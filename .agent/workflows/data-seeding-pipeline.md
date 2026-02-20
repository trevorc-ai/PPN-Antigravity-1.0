---
description: Multi-agent pipeline for seeding PPN database with publicly available psychedelic therapy outcome data to power the Global Benchmark Intelligence layer (WO-231).
agents: [ANALYST, LEAD, SOOP, BUILDER, INSPECTOR, USER]
---

# /data-seeding-pipeline
## WO-231: Public Data Seeding — Global Benchmark Intelligence Layer

This workflow defines the exact handoff sequence between all agents to deliver seeded benchmark data into the PPN database. It is designed to be run start-to-finish with USER checkpoints at stages 3 and 6.

---

## STAGE 0: ANALYST — Research Complete ✅
*Already done. WO-231 is in 00_INBOX with full research brief.*

**Done when:** WO-231.md exists in `_WORK_ORDERS/00_INBOX/` with ANALYST research report.

---

## STAGE 1: LEAD — Architecture Review & Routing

**LEAD's job:**
1. Read WO-231 in `00_INBOX`
2. Append `## LEAD ARCHITECTURE` section to WO-231 with:
   - Confirmed table names (`benchmark_trials`, `benchmark_cohorts`, `population_baselines`)
   - Confirmed migration number (059)
   - Data flow diagram: ClinicalTrials.gov API → BUILDER script → `benchmark_trials` table
   - Scope decision: Phase 1 only (no NIDA DataShare application yet — keep it achievable)
   - Confirm that `benchmark_cohorts` seed CSV will be provided by ANALYST, not scraped
3. Split into two parallel tickets:
   - **WO-231a** → SOOP (schema + migration SQL)
   - **WO-231b** → BUILDER (ETL scripts + seeding logic)
4. Move WO-231 to `01_TRIAGE`, create WO-231a in `03_BUILD` for SOOP, WO-231b in `03_BUILD` for BUILDER

**Done when:** WO-231a in `03_BUILD` with `owner: SOOP`, WO-231b in `03_BUILD` with `owner: BUILDER`

---

## STAGE 2: SOOP — Database Schema Migration

**SOOP's job:**
1. Read WO-231a in `_WORK_ORDERS/03_BUILD/`
2. Run the database-schema-validator skill BEFORE writing SQL
3. Write `migrations/059_global_benchmark_tables.sql` with:

```sql
-- ============================================================================
-- MIGRATION 059: Global Benchmark Intelligence Tables
-- WO-231 | Owner: SOOP | Approved by: LEAD
-- Additive only. No drops. RLS enforced on all tables.
-- ============================================================================

-- TABLE 1: benchmark_trials (from ClinicalTrials.gov bulk API)
CREATE TABLE IF NOT EXISTS public.benchmark_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nct_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  phase TEXT,
  status TEXT,
  modality TEXT NOT NULL,
  conditions TEXT[],
  country TEXT,
  enrollment_actual INTEGER,
  start_date DATE,
  completion_date DATE,
  primary_outcome_measure TEXT,
  source TEXT DEFAULT 'clinicaltrials.gov',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 2: benchmark_cohorts (manually seeded from published papers + Metapsy)
CREATE TABLE IF NOT EXISTS public.benchmark_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_name TEXT NOT NULL,
  source_citation TEXT NOT NULL,
  modality TEXT NOT NULL,
  condition TEXT NOT NULL,
  setting TEXT,
  n_participants INTEGER NOT NULL,
  country TEXT,
  instrument TEXT NOT NULL,
  baseline_mean NUMERIC,
  baseline_sd NUMERIC,
  endpoint_mean NUMERIC,
  endpoint_sd NUMERIC,
  followup_weeks INTEGER,
  response_rate_pct NUMERIC,
  remission_rate_pct NUMERIC,
  effect_size_hedges_g NUMERIC,
  adverse_event_rate_pct NUMERIC,
  data_freely_usable BOOLEAN DEFAULT TRUE,
  license TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 3: population_baselines (from SAMHSA TEDS aggregate data)
CREATE TABLE IF NOT EXISTS public.population_baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  year INTEGER NOT NULL,
  region TEXT NOT NULL,
  condition TEXT,
  substance TEXT,
  demographic_group TEXT,
  n_episodes INTEGER,
  avg_age NUMERIC,
  pct_female NUMERIC,
  avg_prior_treatments NUMERIC,
  avg_los_days NUMERIC,
  pct_completed_treatment NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: All three tables are READ-ONLY for authenticated users.
-- Only service_role (seeding scripts) can write.
ALTER TABLE public.benchmark_trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmark_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.population_baselines ENABLE ROW LEVEL SECURITY;

-- Public read access for benchmarks (no PII — these are aggregate stats)
CREATE POLICY "Authenticated users can read benchmark_trials"
  ON public.benchmark_trials FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read benchmark_cohorts"
  ON public.benchmark_cohorts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read population_baselines"
  ON public.population_baselines FOR SELECT
  USING (auth.role() = 'authenticated');

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_benchmark_trials_modality ON public.benchmark_trials(modality);
CREATE INDEX IF NOT EXISTS idx_benchmark_trials_status ON public.benchmark_trials(status);
CREATE INDEX IF NOT EXISTS idx_benchmark_cohorts_modality_condition ON public.benchmark_cohorts(modality, condition);
CREATE INDEX IF NOT EXISTS idx_benchmark_cohorts_instrument ON public.benchmark_cohorts(instrument);
CREATE INDEX IF NOT EXISTS idx_population_baselines_source_year ON public.population_baselines(source, year);
```

4. Run migration-manager skill to verify against live schema
5. Move WO-231a to `04_QA` with `owner: INSPECTOR`

**Done when:** `migrations/059_global_benchmark_tables.sql` exists and passes schema validation.

---

## STAGE 3: USER CHECKPOINT #1 — Schema Approval

**USER reviews:**
- The three tables in `migrations/059_global_benchmark_tables.sql`
- Confirms table structure matches mental model of the data
- Approves SOOP to hand off to BUILDER for ETL scripts

**USER runs in Supabase SQL Editor:**
```sql
-- Preview the migration (read-only check — do not execute yet)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('benchmark_trials', 'benchmark_cohorts', 'population_baselines');
```

**Done when:** USER says "approved" or requests modifications.

---

## STAGE 4: BUILDER — ETL Scripts + Seed Data

**BUILDER's job after USER approves:**

**Part A: ClinicalTrials.gov API Importer**
Create `backend/scripts/seed_benchmark_trials.py`:
```python
"""
WO-231b — ClinicalTrials.gov Benchmark Seeder
Pulls completed/active trials for psychedelic interventions.
Writes to benchmark_trials table via Supabase service_role key.
"""
import requests
import json
from supabase import create_client

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_SERVICE_KEY = os.environ['SUPABASE_SERVICE_ROLE_KEY']

MODALITY_KEYWORDS = {
    'psilocybin': ['psilocybin', 'psilocin'],
    'mdma': ['mdma', '3,4-methylenedioxy'],
    'ketamine': ['ketamine'],
    'esketamine': ['esketamine', 'spravato'],
    'lsd': ['lysergic acid', 'lsd-25'],
    'ayahuasca': ['ayahuasca', 'dmt', 'dimethyltryptamine'],
}

CONDITIONS = [
    'PTSD', 'Major Depressive Disorder', 'Treatment Resistant Depression',
    'Alcohol Use Disorder', 'Anxiety', 'OCD', 'Obsessive Compulsive',
    'End of Life', 'Substance Use'
]

def fetch_trials(search_term: str, page_token: str = None) -> dict:
    params = {
        'query.intr': search_term,
        'filter.overallStatus': 'COMPLETED,ACTIVE_NOT_RECRUITING',
        'fields': 'NCTId,BriefTitle,Phase,OverallStatus,InterventionName,ConditionList,LocationCountry,EnrollmentCount,StartDate,CompletionDate,PrimaryOutcomeDescription',
        'pageSize': 100,
        'format': 'json'
    }
    if page_token:
        params['pageToken'] = page_token
    
    r = requests.get('https://clinicaltrials.gov/api/v2/studies', params=params)
    return r.json()

def classify_modality(intervention_names: list) -> str:
    text = ' '.join(intervention_names).lower()
    for modality, keywords in MODALITY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return modality
    return 'other'

def seed_trials():
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    records = []
    
    for modality, keywords in MODALITY_KEYWORDS.items():
        for keyword in keywords:
            data = fetch_trials(keyword)
            for study in data.get('studies', []):
                proto = study.get('protocolSection', {})
                id_mod = proto.get('identificationModule', {})
                status_mod = proto.get('statusModule', {})
                design_mod = proto.get('designModule', {})
                arms_mod = proto.get('armsInterventionsModule', {})
                conditions_mod = proto.get('conditionsModule', {})

                records.append({
                    'nct_id': id_mod.get('nctId'),
                    'title': id_mod.get('briefTitle'),
                    'phase': design_mod.get('phaseList', {}).get('phase', [None])[0],
                    'status': status_mod.get('overallStatus'),
                    'modality': modality,
                    'conditions': conditions_mod.get('conditionList', {}).get('condition', []),
                    'country': status_mod.get('locationList', {}).get('location', [{}])[0].get('locationCountry'),
                    'enrollment_actual': design_mod.get('enrollmentInfo', {}).get('count'),
                    'start_date': status_mod.get('startDateStruct', {}).get('date'),
                    'completion_date': status_mod.get('completionDateStruct', {}).get('date'),
                    'primary_outcome_measure': proto.get('outcomesModule', {}).get('primaryOutcomeList', {}).get('primaryOutcome', [{}])[0].get('primaryOutcomeMeasure'),
                    'source': 'clinicaltrials.gov'
                })
    
    # Deduplicate by nct_id and upsert
    seen = set()
    unique = [r for r in records if r['nct_id'] and r['nct_id'] not in seen and not seen.add(r['nct_id'])]
    
    # Upsert in batches of 50
    for i in range(0, len(unique), 50):
        batch = unique[i:i+50]
        supabase.table('benchmark_trials').upsert(batch, on_conflict='nct_id').execute()
    
    print(f"[STATUS: PASS] Seeded {len(unique)} benchmark trials.")

if __name__ == '__main__':
    seed_trials()
```

**Part B: Manual Benchmark Cohorts Seed CSV**
ANALYST will provide `backend/data/benchmark_cohorts_seed.csv` with 10+ rows extracted from published papers. BUILDER writes `backend/scripts/seed_benchmark_cohorts.py` to upsert this file.

**Part C: Supabase TypeScript API Hook**
Create `src/lib/benchmarks.ts` for the front end to query benchmarks:
```typescript
import { supabase } from './supabaseClient';

export interface BenchmarkCohort {
  id: string;
  cohort_name: string;
  source_citation: string;
  modality: string;
  condition: string;
  n_participants: number;
  instrument: string;
  baseline_mean: number;
  endpoint_mean: number;
  response_rate_pct: number;
  remission_rate_pct: number;
  effect_size_hedges_g: number;
  followup_weeks: number;
}

export async function getBenchmarkCohorts(
  modality: string,
  condition: string,
  instrument: string
): Promise<BenchmarkCohort[]> {
  const { data, error } = await supabase
    .from('benchmark_cohorts')
    .select('*')
    .eq('modality', modality)
    .eq('condition', condition)
    .eq('instrument', instrument)
    .order('n_participants', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getBenchmarkTrialCount(modality?: string): Promise<number> {
  let query = supabase
    .from('benchmark_trials')
    .select('id', { count: 'exact', head: true });
  
  if (modality) query = query.eq('modality', modality);
  
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}
```

5. Move WO-231b to `04_QA` with `owner: INSPECTOR`

**Done when:** Both Python seed scripts + TypeScript API hook exist and have no TypeScript errors.

---

## STAGE 5: ANALYST — Seed CSV Creation (Parallel with STAGE 4)

**ANALYST creates `backend/data/benchmark_cohorts_seed.csv`** with manually extracted data from these open-access papers:

| Row | Paper | License | N | Instrument |
|-----|-------|---------|---|------------|
| 1 | MAPS MAPP1 (Mitchell et al., 2021, Nature Medicine) | CC BY 4.0 | 90 | CAPS-5 |
| 2 | MAPS MAPP2 (Mitchell et al., 2023, Nature Medicine) | CC BY 4.0 | 104 | CAPS-5 |
| 3 | COMP360 Phase 2b (Goodwin et al., 2022, NEJM) | Open Access | 233 | MADRS |
| 4 | Davis et al. (2021, JAMA Psychiatry) — JHU MDD | Open Access | 24 | GRID-HAMD |
| 5 | Unlimited Sciences Naturalistic (2023, Frontiers) | CC BY | 8,049 | PHQ-9/GAD-7 |
| 6 | Carhart-Harris et al. Imperial TRD psilocybin | Open Access | 59 | QIDS/MADRS |
| 7 | Bogenschutz et al. AUD psilocybin (JAMA Psychiatry) | Open Access | 93 | AUDIT |
| 8 | Metapsy depression-psiloctr — pooled effect | CC BY | Meta-N | MADRS (g) |
| 9 | Murrough et al. Ketamine MDD | Published | 73 | MADRS |
| 10 | Feder et al. Ketamine PTSD | Published | 41 | CAPS |

CSV schema:
```
cohort_name, source_citation, modality, condition, setting, n_participants, country,
instrument, baseline_mean, baseline_sd, endpoint_mean, endpoint_sd, followup_weeks,
response_rate_pct, remission_rate_pct, effect_size_hedges_g, adverse_event_rate_pct,
data_freely_usable, license, notes
```

**Done when:** CSV file exists with ≥ 8 complete rows, all values verified against source papers.

---

## STAGE 6: INSPECTOR — QA Gate

**INSPECTOR reviews both WO-231a and WO-231b:**

**Schema Checks:**
- [ ] Migration 059 uses `CREATE TABLE IF NOT EXISTS` (idempotent)
- [ ] All three tables have `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- [ ] All three tables have `ENABLE ROW LEVEL SECURITY`
- [ ] RLS policies are present and correct (SELECT only for authenticated users)
- [ ] No DROP, TRUNCATE, or ALTER COLUMN TYPE statements
- [ ] Indexes exist on foreign-key-equivalents (modality, condition, instrument)

**Code Checks:**
- [ ] Python seed script has try/catch around API calls
- [ ] Python seed script deduplicates on `nct_id` before upsert
- [ ] TypeScript `getBenchmarkCohorts()` function handles null/error states
- [ ] No PHI/PII — all seeded data is aggregate/anonymized
- [ ] Font size violations: n/a (no UI in this ticket)

**Data Checks:**
- [ ] benchmark_cohorts_seed.csv has source_citation column populated for every row
- [ ] data_freely_usable = TRUE is accurate for each row's license
- [ ] No synthetic or invented data — every number must cite a real published source

**If PASS:** Move both tickets to `05_USER_REVIEW`, `owner: USER`
**If FAIL:** Return to BUILDER/SOOP with specific error list. Increment failure_count.

---

## STAGE 7: USER CHECKPOINT #2 — Final Review & Execute

**USER's actions:**
1. Read INSPECTOR's approval notes
2. Execute migration in Supabase: copy `migrations/059_global_benchmark_tables.sql` → paste into Supabase SQL Editor → Run
3. Run seed scripts:
   ```bash
   # From project root
   python backend/scripts/seed_benchmark_trials.py
   python backend/scripts/seed_benchmark_cohorts.py
   ```
4. Verify record counts in Supabase:
   ```sql
   SELECT 'benchmark_trials' AS table_name, COUNT(*) FROM benchmark_trials
   UNION ALL
   SELECT 'benchmark_cohorts', COUNT(*) FROM benchmark_cohorts
   UNION ALL
   SELECT 'population_baselines', COUNT(*) FROM population_baselines;
   ```
5. Confirm counts match expectations (300+ trials, 8+ cohorts)
6. Run `/finalize_feature` workflow to commit and push

**Done when:** USER confirms record counts and pushes to remote. WO-231 moves to `06_COMPLETE`.

---

## PIPELINE SUMMARY

```
[ANALYST] WO-231 Research ✅
    ↓
[LEAD] Architecture + split into WO-231a / WO-231b
    ↓──────────────────────────────────┐
[SOOP] WO-231a: SQL Migration 059     [BUILDER] WO-231b: ETL Scripts + TS hooks
    ↓                                      ↓ (+ ANALYST provides seed CSV)
    └──────────────┬────────────────────────┘
               [INSPECTOR] QA Gate
                    ↓
             [USER] Checkpoint #2
             Execute migration + Seed scripts
                    ↓
             ✅ 1,000+ benchmark records live in DB
                    ↓
             [Analytics page] can now render global benchmarks
```

---

## SUCCESS METRICS

| Metric | Target | Verified By |
|--------|--------|------------|
| benchmark_trials count | ≥ 300 records | USER query |
| benchmark_cohorts count | ≥ 8 records | USER query |
| benchmark_cohorts — all have citation | 100% | INSPECTOR |
| Analytics page can query benchmarks | No errors | BUILDER test |
| Migration is idempotent | Run twice with no error | SOOP |
| RLS prevents unauthenticated write | Test fails gracefully | INSPECTOR |
