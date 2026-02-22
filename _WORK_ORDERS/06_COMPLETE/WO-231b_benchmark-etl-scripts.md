---
id: WO-231b
title: "Global Benchmark ETL Scripts + API Hook (Child of WO-231)"
status: 03_BUILD
owner: BUILDER
parent: WO-231
created: 2026-02-20
created_by: LEAD
failure_count: 0
priority: HIGH
tags: [builder, python, typescript, etl, seeding, clinicaltrials, benchmark]
---

# WO-231b: ETL Scripts + TypeScript API Hook — Global Benchmark Intelligence
**Owner: BUILDER | Parent: WO-231 | Pipeline: `.agent/workflows/data-seeding-pipeline.md`**

---

## BUILDER Instructions

Read `.agent/workflows/data-seeding-pipeline.md` Stage 4 for full code specs.

### Deliverable 1: `backend/scripts/seed_benchmark_trials.py`
- Fetches trials from ClinicalTrials.gov API v2
- Filters by modality keywords: psilocybin, mdma, ketamine, esketamine, lsd, ayahuasca, dmt
- Deduplicates on `nct_id`
- Upserts to `benchmark_trials` table via Supabase `service_role` key
- Batch size: 50 records per upsert call
- Wraps ALL API calls and DB calls in try/except
- Prints final count: `[STATUS: PASS] Seeded X benchmark trials.`

### Deliverable 2: `backend/scripts/seed_benchmark_cohorts.py`
- Reads `backend/data/benchmark_cohorts_seed.csv` (ANALYST will provide this)
- Upserts to `benchmark_cohorts` table
- Validates that `source_citation` field is populated for every row — skip and warn if not
- Prints final count on completion

### Deliverable 3: `src/lib/benchmarks.ts`
TypeScript API hook with the following exported functions:
```typescript
// Return benchmark cohorts for given modality/condition/instrument
getBenchmarkCohorts(modality: string, condition: string, instrument: string): Promise<BenchmarkCohort[]>

// Return count of seeded trials for a modality
getBenchmarkTrialCount(modality?: string): Promise<number>

// Return the single best benchmark (largest N) for a given modality/condition/instrument
getPrimaryBenchmark(modality: string, condition: string, instrument: string): Promise<BenchmarkCohort | null>
```

All functions must:
- Handle null/undefined returns gracefully
- Include TypeScript interface `BenchmarkCohort` matching the DB schema
- Use the existing `supabase` client from `src/lib/supabaseClient`

### Important Notes
- Do NOT create `backend/data/benchmark_cohorts_seed.csv` — that is ANALYST's job
- The seed scripts should handle gracefully if the CSV doesn't exist yet (print warning, exit 0)
- Do NOT execute the migration SQL — that is USER's job at Checkpoint 2
- Use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from environment for Python scripts

## Acceptance Criteria
- [ ] `backend/scripts/seed_benchmark_trials.py` exists and has no Python syntax errors
- [ ] `backend/scripts/seed_benchmark_cohorts.py` exists and handles missing CSV gracefully
- [ ] `src/lib/benchmarks.ts` exports all three functions with correct TypeScript types
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] All API/DB calls wrapped in try/catch or try/except
- [ ] No PHI — all data is aggregate/anonymized benchmark data

## Handoff
When done: update frontmatter `status: 04_QA`, `owner: INSPECTOR`
Move ticket to `_WORK_ORDERS/04_QA/`

## ANALYST Dependency
BUILDER should notify ANALYST that `benchmark_cohorts_seed.csv` is needed.
ANALYST will create: `backend/data/benchmark_cohorts_seed.csv`
using data extracted from published open-access papers (CC BY 4.0 licensed).
