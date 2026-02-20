---
id: WO-231
title: "Public Data Seeding — Global Benchmark Intelligence Layer"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-20
created_by: ANALYST
failure_count: 0
priority: HIGH
tags: [data-seeding, benchmarking, analytics, open-data, global-comparison]
pipeline_workflow: .agent/workflows/data-seeding-pipeline.md
child_tickets: [WO-231a (SOOP), WO-231b (BUILDER)]
user_prompt: |
  "I want you to research and see how much publicly available data we can seed our database with 
  because we are primed for a great opportunity and the more records that we can get even if they're 
  not even fully complete the global comparison we instantly have as an asset. I know there's a ton 
  of data out there for no cost that people will share. We're more than a database — we're redefining 
  analytics for this industry."
---

# ANALYST RESEARCH REPORT
## WO-231: Public Data Seeding — Global Benchmark Intelligence Layer

**Research Date:** 2026-02-20  
**Analyst:** ANALYST Agent  
**Status:** [STATUS: COMPLETE — Awaiting LEAD Architecture]

---

## EXECUTIVE SUMMARY

There is a substantial and growing body of **free, publicly licensed, de-identified psychedelic therapy outcome data** that PPN can legally seed into our database to create an instant global benchmark layer. This is a legitimate, high-value strategic move that transforms PPN from a data-capture tool into a **living intelligence platform** from Day 1.

We have identified **12 distinct data source tiers**, ranging from downloadable bulk datasets to benchmark statistics extractable from published peer-reviewed studies. Together they represent:

- **Hundreds of completed clinical trials** with structured outcome data
- **8,000+ real-world naturalistic participants** (psilocybin)
- **Millions of substance use treatment episodes** (SAMHSA)
- **Published mean scores** for CAPS-5, MADRS, PHQ-9, GAD-7, QIDS across all major modalities
- **Meta-analytic effect size libraries** (Metapsy)

---

## TIER 1: DIRECT BULK DOWNLOADS (Free, No Request Needed)

### 1.1 — ClinicalTrials.gov API v2 (Bulk JSON/CSV)
- **URL:** `https://clinicaltrials.gov/api/v2/studies/download?format=json.zip`
- **License:** Public domain (U.S. government)
- **Volume:** 500,000+ trials globally. Filtered to psychedelics: ~400–600 completed/active trials
- **Data available:** Study design, arms, interventions, conditions (ICD/DSM), primary outcomes, results summaries, enrollment counts, phase, country
- **Relevant substances:** Psilocybin, MDMA, Ketamine, Esketamine, DMT, Ayahuasca, LSD, Ibogaine
- **Relevant conditions:** MDD, TRD, PTSD, AUD, OUD, GAD, End-of-Life Anxiety, OCD
- **How to seed:** Download the bulk zip → parse JSON → extract trials where `interventionType = DRUG` and substance name matches our modality list → insert as anonymized benchmark cohorts
- **Analyst rating:** ⭐⭐⭐⭐⭐ — HIGHEST PRIORITY

---

### 1.2 — SAMHSA TEDS (Treatment Episode Data Set)
- **URL:** `https://www.samhsa.gov/data/data-we-collect/teds-treatment-episode-data-set`
- **License:** Public domain (U.S. federal)
- **Volume:** 1.5+ million treatment episodes per annual file, updated every year. 2023 data available now.
- **Data available:** Age, gender, race/ethnicity, primary substance, co-occurring disorders, treatment type, length of stay, discharge reason, geographic region (state-level)
- **Formats:** CSV/Delimited, SAS, SPSS, Stata
- **Key value for PPN:** Establishes the national **baseline population context** — how many people with depression, PTSD, AUD etc. are currently in treatment, what those treatment populations look like demographically. This powers our comparison benchmarks.
- **Satellite dataset:** `MH-TEDS` (Mental Health Client-Level Data) — adds mental health diagnoses + outcomes
- **Analyst rating:** ⭐⭐⭐⭐⭐ — HIGHEST PRIORITY

---

### 1.3 — NIDA DataShare (Completed Clinical Trial Data)
- **URL:** `https://datashare.nida.nih.gov/`
- **License:** Free with registration (no cost, academic/research use)
- **Volume:** Dozens of completed NIDA-funded RCTs — substance use disorders, depression, PTSD
- **Data available:** De-identified patient-level CRF data in CDISC format — demographics, baseline scores, outcome scores at each timepoint, adverse events, dropout
- **Notable datasets relevant to PPN:**
  - CTN-0001 through CTN-0100 series: Ketamine, buprenorphine, opioid/stimulant SUD outcomes
  - Depression comorbidity datasets
- **How to use:** Register → Apply for access → Download CDISC datasets → Transform to our schema
- **Analyst rating:** ⭐⭐⭐⭐ — High value, requires free registration

---

### 1.4 — Metapsy "depression-psiloctr" Living Database
- **URL:** `https://www.metapsy.org/databases/`
- **GitHub:** `https://github.com/metapsy-project/data-depression-psiloctr`
- **License:** Open access (CC BY / research use)
- **Volume:** All published RCTs of psilocybin-assisted therapy for depression, meta-analyzed
- **Data available:** Study-level effect sizes (Hedges' g), sample sizes, baseline means, post-test means, follow-up means, instrument used (MADRS, QIDS, BDI, PHQ-9), control condition type
- **R package access:** `metapsyData::getData("depression-psiloctr")`
- **Key value for PPN:** Powers our psilocybin-for-depression global benchmark card — "How does your clinic's depression outcomes compare to the worldwide clinical trial average?"
- **Key stat to seed:** Psilocybin-assisted therapy → mean Hedges' g = **–0.91** vs. control; MADRS mean baseline ~32-33, ≥50% response rate at 3 weeks = 37%
- **Analyst rating:** ⭐⭐⭐⭐⭐ — HIGHEST PRIORITY (immediately seedable)

---

## TIER 2: PUBLISHED BENCHMARK STATISTICS (Extractable from Open-Access Papers)

These are not raw datasets but **published aggregate outcomes** from peer-reviewed open-access papers. We extract the means, SDs, and response rates and store them as seeded `benchmark_cohorts` in our database.

### 2.1 — MAPS MAPP1 & MAPP2 Phase 3 Trials (MDMA-PTSD)
- **Published in:** *Nature Medicine* (Open Access)
- **DOI:** MAPP1 — `10.1038/s41591-021-01336-3`, MAPP2 — `10.1038/s41591-023-02496-6`
- **Sample size:** N=90 (MAPP1), N=104 (MAPP2)
- **Condition:** PTSD
- **Key outcome data to seed:**
  - CAPS-5 baseline mean: ~48-51 (severe PTSD)
  - CAPS-5 reduction (MDMA arm): ~24-27 points
  - Response rate (MDMA): 67-71%
  - Remission rate (MDMA): 46-67%
  - SDS (functional impairment) improvement: significant vs. placebo
  - Adverse event profile: documented and gradable
- **License:** Open Access (CC BY 4.0) — figures and aggregate data freely reproducible with citation
- **Analyst rating:** ⭐⭐⭐⭐⭐ — Landmark data, seeds the PTSD/MDMA benchmark cohort

---

### 2.2 — COMP360 Psilocybin Phase 2b/3 (TRD) — COMPASS Pathways
- **Published in:** *New England Journal of Medicine*, *Journal of Psychopharmacology*
- **Sample size:** N=233 (Phase 2b), Phase 3 ongoing
- **Condition:** Treatment-Resistant Depression
- **Key outcome data to seed:**
  - MADRS baseline: 32.8 (SD ~5.6)
  - MADRS change (25mg): –12.0 at Week 3 vs. –5.4 (1mg control), LS mean difference = –6.6
  - Response rate (25mg, Week 3): 37%
  - Remission rate (25mg, Week 3): 29%
  - QIDS-SR-16 baseline: 16.5 (SD 5.04); reduction of –6.9 by Week 3
  - GAD-7 baseline: 12.9 (SD 5.94); reduction of –4.1 by Week 3
- **Analyst rating:** ⭐⭐⭐⭐⭐ — Core psilocybin/TRD benchmark set

---

### 2.3 — Johns Hopkins Psilocybin for MDD (Davis et al., 2021)
- **Published in:** *JAMA Psychiatry* (Open Access)
- **Sample size:** N=24
- **Condition:** Major Depressive Disorder (non-treatment-resistant)
- **Key outcomes:**
  - GRID-HAMD score reduction: –17.7 at 1-week, –17.2 at 4-week follow-up
  - Response rate: 75% at 4-week; Remission: 58%
- **Analyst rating:** ⭐⭐⭐⭐ — Good, small N but clean

---

### 2.4 — Unlimited Sciences Naturalistic Study (8,000+ real-world)
- **Published in:** *Frontiers in Psychiatry* (Open Access)
- **Sample size:** N=8,000+ (naturalistic, longitudinal)
- **Condition:** Mixed (primarily depression, anxiety, burnout, well-being)
- **Key outcomes:**
  - Significant reductions in depression, anxiety, alcohol misuse
  - Improvements in cognitive flexibility, emotion regulation, spiritual well-being
  - >90% rated experience positively in retrospect
  - >80% attributed well-being/life satisfaction improvements
  - Adverse event rate: <4% medically significant acute; <5% persisting negative effects
  - Novel finding: first evidence of burnout reduction after psychedelic use
- **Key value for PPN:** This is **real-world, not clinical trial** — directly analogous to what our practitioners are doing. Powers the "naturalistic setting" comparison cohort.
- **Analyst rating:** ⭐⭐⭐⭐⭐ — Directly mirrors PPN's use case

---

### 2.5 — Global Psychedelic Survey 2023 (N=6,379, 85 countries)
- **Published in:** *International Journal of Drug Policy*, *Frontiers in Psychiatry*, *Journal of Psychoactive Drugs* (all Open Access)
- **Sample size:** N=6,379 respondents across 85 countries
- **Data available:** Consumer characteristics, usage patterns, access methods, substance preferences, motivations, demographics by region
- **Key value for PPN:** International demographic benchmarks — what a "global psychedelic-engaged" population looks like. Feeds our geographic comparison feature.
- **Analyst rating:** ⭐⭐⭐ — Useful for patient demographics layer, not outcomes

---

## TIER 3: SPECIALIZED REGISTRIES (Require Partnership or Application)

### 3.1 — OPEN (Oregon Psychedelic Evaluation Nexus)
- **URL:** `https://openpsychedelicscience.org/`
- **Status:** Active enrollment (2024–2028, $3.3M NIDA grant, OHSU-led)
- **Data:** Real-world psilocybin service outcomes in legal Oregon facilitated settings — facilitators AND clients enrolled. 1-year longitudinal follow-ups.
- **Access model:** Contact OHSU research team — PPN could become a **data partner/submission site**
- **Key value for PPN:** This is the first federally funded real-world psilocybin outcomes registry. Being a contributing site would be **enormous** for PPN's credibility.
- **Action:** Reach out to PI at OHSU to discuss PPN as a clinical data submission partner
- **Analyst rating:** ⭐⭐⭐⭐⭐ — HIGHEST STRATEGIC VALUE (partnership, not just seeding)

---

### 3.2 — Ketamine Research Foundation Data Project
- **URL:** `https://ketamineresearchfoundation.org/`
- **Platform:** REDCap (Vanderbilt)
- **Data:** Coded, HIPAA-compliant multi-center voluntary data — diagnosis, dosage, duration, demographics, practice model, outcomes. Published as open-label studies in Journal of Psychoactive Drugs.
- **Volume:** 600+ patients ongoing, multiple sites
- **Access:** KPA members auto-eligible. Non-KPA: $300/yr to participate
- **Action:** PPN should pay the $300 and become a participating site — data contribution makes us eligible for the aggregate outcomes data too
- **Analyst rating:** ⭐⭐⭐⭐ — Strong for ketamine vertical

---

### 3.3 — NIDA CTN (Clinical Trials Network) Common Data Elements
- **URL:** `https://cde.nlm.nih.gov/`
- **Data:** Substance use disorder CDE library — standardized assessment tools aligned with our existing instruments (PHQ-9, GAD-7, AUDIT, DAST, PCL-5)
- **Key value for PPN:** Ensures our data capture is interoperable with federal systems — positions PPN for future NIH data sharing and partnership
- **Analyst rating:** ⭐⭐⭐⭐ — Structural/standards value

---

## TIER 4: ADDITIONAL OPEN SOURCES

| Source | Data Type | Volume | License | Priority |
|--------|-----------|--------|---------|----------|
| OSF.io (psychedelic search) | De-identified study data | Variable | CC BY | ⭐⭐⭐ |
| Figshare Bibliometric Dataset | Study-level metadata 1965-2018 | 1,000+ papers | Open | ⭐⭐⭐ |
| UC Berkeley BCSP Trial Map | ClinicalTrials.gov structured view | ~400+ trials | Open | ⭐⭐⭐ |
| Global Drug Survey (GDS) | Annual drug use population data | Global, annual | Partial | ⭐⭐⭐ |
| NIH Reporter | Grant + publication metadata | Comprehensive | Public domain | ⭐⭐ |
| PsychedelicAlpha.com | Trial tracker (curated) | ~200+ trials | Editorial use | ⭐⭐ |

---

## SEEDING STRATEGY RECOMMENDATION

### Phase 1 — Immediate (No Applications Needed, 1–2 weeks)

1. **Pull ClinicalTrials.gov bulk JSON** → filter for psilocybin/MDMA/ketamine/esketamine interventions → extract trial metadata into a `benchmark_trials` table (NCT ID, phase, condition, N, country, status, primary outcomes)
2. **Seed `benchmark_cohorts` table** with aggregate outcome data extracted from MAPP1/2, COMP360, and Unlimited Sciences publications:
   - Cohort name: "MDMA-PTSD Phase 3 (MAPS 2021)"
   - Modality, condition, N, CAPS-5 baseline mean, CAPS-5 endpoint mean, response %, remission %
3. **Import Metapsy `depression-psiloctr`** data directly — this is a structured R dataset, can be parsed to CSV easily
4. **Request SAMHSA TEDS 2023** delimited file → extract mental health + substance use episodes for demographic benchmarking layer

### Phase 2 — Applications (2–4 weeks)
5. **Register on NIDA DataShare** and request access to relevant completed CTN trials
6. **Send partnership inquiry to OPEN/OHSU** — position PPN as a clinical data contributor
7. **Join KRF Data Project** ($300) for ketamine multi-center data

### Phase 3 — Strategic Partnerships (1–3 months)
8. **Negotiate data-sharing agreements** with academic centers running trials (Johns Hopkins, Imperial College, NYU)
9. **Establish PPN as an OPEN submission site** — this gives us access to the living real-world registry AND positions us in the federal research ecosystem

---

## DATA ARCHITECTURE REQUIREMENTS (For SOOP/LEAD)

New tables required (additive only, RLS ON):

```sql
-- Global benchmark trial registry (from ClinicalTrials.gov)
benchmark_trials (
  id UUID PRIMARY KEY,
  nct_id TEXT UNIQUE,           -- e.g. 'NCT03537014'
  title TEXT,
  phase TEXT,                   -- 'PHASE2', 'PHASE3', etc.
  status TEXT,                  -- 'COMPLETED', 'ACTIVE', etc.
  modality TEXT,                -- 'psilocybin', 'mdma', 'ketamine', 'esketamine'
  conditions TEXT[],            -- ['PTSD', 'MDD', 'AUD']
  country TEXT,
  enrollment_actual INTEGER,
  start_date DATE,
  completion_date DATE,
  primary_outcome_measure TEXT,
  source TEXT DEFAULT 'clinicaltrials.gov',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seeded aggregate benchmark cohorts (from published papers)
benchmark_cohorts (
  id UUID PRIMARY KEY,
  cohort_name TEXT NOT NULL,    -- 'MAPS MAPP1 Phase 3'
  source_citation TEXT,         -- DOI or citation string
  modality TEXT,                -- 'mdma', 'psilocybin', 'ketamine'
  condition TEXT,               -- 'PTSD', 'MDD', 'TRD'
  setting TEXT,                 -- 'clinical_trial', 'naturalistic', 'real_world'
  n_participants INTEGER,
  country TEXT,
  instrument TEXT,              -- 'CAPS-5', 'MADRS', 'PHQ-9', 'QIDS'
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
  license TEXT,                 -- 'CC BY 4.0', 'Public Domain', etc.
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Population-level baseline data (from SAMHSA TEDS)
population_baselines (
  id UUID PRIMARY KEY,
  source TEXT,                  -- 'SAMHSA_TEDS_2023', 'GDS_2023'
  year INTEGER,
  region TEXT,                  -- 'US_National', 'US_Northeast', 'Global'
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
```

---

## RISK REGISTER

| Risk | Category | Likelihood | Impact | Mitigation |
|------|----------|-----------|--------|------------|
| Using aggregate data without proper citation | Reputational | Low | High | Always store source_citation field; display provenance in UI |
| SAMHSA TEDS doesn't map cleanly to our schema | Operational | Medium | Medium | Use as population-level demographics only, not individual records |
| Clinical trial data shows worse outcomes than our practitioners | Clinical/Reputational | Low | Medium | We show benchmarks as context, not judgment — frame it as "how you compare to published clinical trial settings" |
| NIDA DataShare application rejected | Operational | Low | Low | Fallback is published aggregate stats only |
| OPEN data partnership takes too long | Operational | Medium | Low | Phase 1 doesn't depend on it |

---

## ESTIMATED RECORDS AT LAUNCH (Phase 1 Only)

| Source | Estimated Records Seedable |
|--------|---------------------------|
| ClinicalTrials.gov bulk (filtered) | ~500–800 trial metadata records |
| Metapsy psilocybin depression | ~25–35 study-level cohort records |
| MAPS MAPP1/2 (manual extract) | 2 high-quality cohort benchmark records |
| COMP360 Phase 2b/3 (manual extract) | 3 high-quality cohort benchmark records |
| Johns Hopkins MDD (Davis 2021) | 1 cohort record |
| Unlimited Sciences naturalistic | 1 large-N naturalistic cohort record |
| SAMHSA TEDS 2023 (population baselines) | 50–200 population demographic records by condition/region |
| **TOTAL PHASE 1** | **~600–1,000+ seeded records** |

After Phase 2 (NIDA DataShare + KRF participation): **+2,000–5,000 records**

---

## NEXT ACTIONS

| Action | Owner | Done When | ETA |
|--------|-------|-----------|-----|
| LEAD reviews and architects the new DB tables | LEAD | Schema spec approved | Day 1 |
| SOOP creates SQL migration for 3 new tables | SOOP | Migration passes schema-validator | Day 2 |
| BUILDER writes Python/Node scripts to pull ClinicalTrials.gov API | BUILDER | 500+ trials imported to `benchmark_trials` | Day 3–5 |
| ANALYST compiles seed CSV for `benchmark_cohorts` (manual extraction from papers) | ANALYST | CSV with 10+ cohort records ready | Day 2–3 |
| ANALYST compiles seed CSV for `population_baselines` (SAMHSA TEDS) | ANALYST | CSV with 50+ records ready | Day 3–5 |
| USER sends inquiry to OPEN/OHSU about partnership | USER | Email sent | Day 1 |
| USER joins KRF Data Project | USER | Paid + registered | Day 1 ($300) |

---

## STRATEGIC VALUE STATEMENT

> *"PPN's global comparison layer is not just a feature — it is a defensible, compounding moat. Every practitioner who joins adds to the network. But on Day 1, before any practitioner joins, we already have the world's largest publicly available psychedelic clinical outcomes dataset backing our benchmarks. No competitor can say that."*

✅ **ANALYST COMPLETE — Routing to LEAD for architecture and SOOP for schema.**

---

## LEAD ARCHITECTURE

**Decision Date:** 2026-02-20  
**Decision: Phase 1 scope only — achievable in one sprint.**

### Confirmed Table Names & Migration Number
- Migration: `059_global_benchmark_tables.sql`
- Tables: `benchmark_trials`, `benchmark_cohorts`, `population_baselines`
- All additive. No modifications to existing tables. RLS ON.

### Confirmed Scope (Phase 1 Only)
1. ✅ ClinicalTrials.gov API → `benchmark_trials` (BUILDER Python script)
2. ✅ Published paper aggregate stats → `benchmark_cohorts` (ANALYST CSV + BUILDER seed script)
3. ✅ TypeScript API hook → `src/lib/benchmarks.ts` (BUILDER)
4. ❌ SAMHSA TEDS → Deferred to Phase 2 (schema complexity, use after initial launch)
5. ❌ NIDA DataShare → Deferred to Phase 2 (requires application)

### Data Flow
```
ClinicalTrials.gov API v2
  → backend/scripts/seed_benchmark_trials.py  (BUILDER)
  → benchmark_trials table  (SOOP)

Published Papers (CC BY 4.0)
  → backend/data/benchmark_cohorts_seed.csv  (ANALYST)
  → backend/scripts/seed_benchmark_cohorts.py  (BUILDER)
  → benchmark_cohorts table  (SOOP)

Frontend query  
  → src/lib/benchmarks.ts  (BUILDER)
  → Analytics.tsx benchmark ribbon chart
```

### Routing
- **WO-231a** → `03_BUILD`, `owner: SOOP` — SQL migration only
- **WO-231b** → `03_BUILD`, `owner: BUILDER` — ETL scripts + TS hook
- **WO-231** → Stays in `01_TRIAGE` as parent ticket until both children pass QA

### Pipeline Workflow Reference
All agents: read `.agent/workflows/data-seeding-pipeline.md` for full stage-by-stage instructions, acceptance criteria, and USER checkpoints.

**USER checkpoints:**
- Checkpoint 1 (after SOOP): Review migration SQL before execution
- Checkpoint 2 (after INSPECTOR PASS): Execute migration + seed scripts in Supabase, confirm counts

✅ **LEAD ARCHITECTURE COMPLETE — WO-231a and WO-231b created and routed.**
