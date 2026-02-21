-- ============================================================================
-- MIGRATION 059: Global Benchmark Intelligence Tables
-- ============================================================================
-- WO-231 | SOOP | Approved by: LEAD
-- Date: 2026-02-20
-- Purpose: Create three additive read-only tables to power the Global
--          Benchmark Intelligence layer of PPN Analytics.
-- Affected Tables: ref_benchmark_trials (NEW), ref_benchmark_cohorts (NEW),
--                  ref_population_baselines (NEW)
-- Existing Tables Modified: NONE
-- ============================================================================
-- GOVERNANCE RULES APPLIED:
--   ✅ CREATE TABLE IF NOT EXISTS (idempotent — safe to run twice)
--   ✅ UUID PKs via gen_random_uuid()
--   ✅ RLS ENABLED on all tables
--   ✅ SELECT-only policies for authenticated users
--   ✅ No DROP, TRUNCATE, ALTER COLUMN TYPE, or ALTER TABLE ... DROP
--   ✅ No FK constraints to existing tables (standalone benchmark layer)
--   ✅ source_citation NOT NULL on benchmark_cohorts (citation integrity)
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 1: ref_benchmark_trials
-- Source: ClinicalTrials.gov API v2 (U.S. Public Domain)
-- Populated by: backend/scripts/seed_benchmark_trials.py
-- Purpose: Registry of psychedelic clinical trials worldwide for
--          context ("your outcomes are informed by 487 global trials")
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.ref_benchmark_trials (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nct_id                  TEXT        UNIQUE NOT NULL,     -- e.g. 'NCT03537014'
  title                   TEXT        NOT NULL,
  phase                   TEXT,                             -- 'PHASE1','PHASE2','PHASE3','PHASE4','NA'
  status                  TEXT,                             -- 'COMPLETED','ACTIVE_NOT_RECRUITING','RECRUITING'
  modality                TEXT        NOT NULL,             -- 'psilocybin','mdma','ketamine','esketamine','lsd','ayahuasca','dmt','ibogaine','mescaline'
  conditions              TEXT[],                           -- Array: ['PTSD','Major Depressive Disorder']
  country                 TEXT,
  enrollment_actual       INTEGER,
  start_date              DATE,
  completion_date         DATE,
  primary_outcome_measure TEXT,
  source                  TEXT        NOT NULL DEFAULT 'clinicaltrials.gov',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ref_benchmark_trials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ref_benchmark_trials_authenticated_select" ON public.ref_benchmark_trials;
CREATE POLICY "ref_benchmark_trials_authenticated_select"
  ON public.ref_benchmark_trials
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_rbt_modality
  ON public.ref_benchmark_trials(modality);

CREATE INDEX IF NOT EXISTS idx_rbt_status
  ON public.ref_benchmark_trials(status);

CREATE INDEX IF NOT EXISTS idx_rbt_country
  ON public.ref_benchmark_trials(country);

CREATE INDEX IF NOT EXISTS idx_rbt_completion_date
  ON public.ref_benchmark_trials(completion_date DESC);


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 2: ref_benchmark_cohorts
-- Source: Manually extracted from peer-reviewed open-access publications
-- Populated by: backend/scripts/seed_benchmark_cohorts.py
-- Purpose: Aggregate outcome benchmarks for the Benchmark Ribbon chart —
--          "How does your clinic's CAPS-5 response rate compare to the
--           MAPS Phase 3 global benchmark (n=104)?"
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.ref_benchmark_cohorts (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_name             TEXT        NOT NULL,             -- 'MAPS MAPP1 Phase 3 (Mitchell 2021)'
  source_citation         TEXT        NOT NULL,             -- Full DOI — NEVER NULL (enforced at DB level)
  modality                TEXT        NOT NULL,             -- 'mdma','psilocybin','ketamine','esketamine'
  condition               TEXT        NOT NULL,             -- 'PTSD','MDD','TRD','AUD','GAD','Mixed'
  setting                 TEXT,                             -- 'clinical_trial','naturalistic','real_world'
  n_participants          INTEGER     NOT NULL,             -- Sample size — NEVER NULL
  country                 TEXT,
  instrument              TEXT        NOT NULL,             -- 'CAPS-5','MADRS','PHQ-9','GAD-7','QIDS-SR-16','AUDIT-C','GRID-HAMD','CAPS'
  baseline_mean           NUMERIC(8,2),                     -- Mean score at Week 0
  baseline_sd             NUMERIC(8,2),                     -- SD at Week 0
  endpoint_mean           NUMERIC(8,2),                     -- Mean score at primary endpoint
  endpoint_sd             NUMERIC(8,2),                     -- SD at primary endpoint
  followup_weeks          INTEGER,                          -- Weeks from baseline to primary endpoint
  response_rate_pct       NUMERIC(5,1),                     -- % achieving instrument-specific response
  remission_rate_pct      NUMERIC(5,1),                     -- % achieving instrument-specific remission
  effect_size_hedges_g    NUMERIC(6,3),                     -- Hedges' g (negative = improvement for symptom scales)
  adverse_event_rate_pct  NUMERIC(5,1),                     -- % with any adverse event
  data_freely_usable      BOOLEAN     NOT NULL DEFAULT TRUE,
  license                 TEXT,                             -- 'CC BY 4.0','Open Access','Public Domain'
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ref_benchmark_cohorts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ref_benchmark_cohorts_authenticated_select" ON public.ref_benchmark_cohorts;
CREATE POLICY "ref_benchmark_cohorts_authenticated_select"
  ON public.ref_benchmark_cohorts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_rbc_modality_condition
  ON public.ref_benchmark_cohorts(modality, condition);

CREATE INDEX IF NOT EXISTS idx_rbc_instrument
  ON public.ref_benchmark_cohorts(instrument);

CREATE INDEX IF NOT EXISTS idx_rbc_modality
  ON public.ref_benchmark_cohorts(modality);

CREATE INDEX IF NOT EXISTS idx_rbc_n_participants
  ON public.ref_benchmark_cohorts(n_participants DESC);

CREATE INDEX IF NOT EXISTS idx_rbc_condition
  ON public.ref_benchmark_cohorts(condition);


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 3: ref_population_baselines
-- Source: SAMHSA TEDS / Global Drug Survey (Phase 2 — structure ready now,
--         data seeded in future work order)
-- Purpose: National demographic baselines — what does a typical MDD/PTSD/AUD
--          treatment population look like? Provides demographic context for
--          practitioners reviewing their patient mix.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.ref_population_baselines (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  source                    TEXT        NOT NULL,           -- 'SAMHSA_TEDS_2023','GDS_2023','NIMH_2022'
  year                      INTEGER     NOT NULL,
  region                    TEXT        NOT NULL,           -- 'US_National','US_West','US_Northeast','US_South','US_Midwest','Global'
  condition                 TEXT,                           -- 'PTSD','MDD','AUD','OUD','GAD','SUD_Mixed'
  substance                 TEXT,                           -- 'Alcohol','Opioids','Cannabis','Stimulants' (primary substance of concern)
  demographic_group         TEXT,                           -- 'All','Female','Male','18-25','26-35','36-50','51+'
  n_episodes                INTEGER,                        -- Number of treatment episodes in dataset
  avg_age                   NUMERIC(5,1),
  pct_female                NUMERIC(5,1),
  avg_prior_treatments      NUMERIC(5,1),                   -- Average number of prior treatment attempts
  avg_los_days              NUMERIC(7,1),                   -- Average length of stay (days)
  pct_completed_treatment   NUMERIC(5,1),                   -- % who completed treatment (vs. dropped out)
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ref_population_baselines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ref_population_baselines_authenticated_select" ON public.ref_population_baselines;
CREATE POLICY "ref_population_baselines_authenticated_select"
  ON public.ref_population_baselines
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_rpb_source_year
  ON public.ref_population_baselines(source, year);

CREATE INDEX IF NOT EXISTS idx_rpb_condition
  ON public.ref_population_baselines(condition);

CREATE INDEX IF NOT EXISTS idx_rpb_region
  ON public.ref_population_baselines(region);


-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFICATION QUERIES
-- Run these after executing the migration to confirm success
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Confirm all three tables exist
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('ref_benchmark_trials', 'ref_benchmark_cohorts', 'ref_population_baselines')
ORDER BY table_name;
-- Expected: 3 rows, all table_type = 'BASE TABLE'

-- 2. Confirm RLS is enabled on all three
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('ref_benchmark_trials', 'ref_benchmark_cohorts', 'ref_population_baselines')
ORDER BY tablename;
-- Expected: 3 rows, rowsecurity = true for all

-- 3. Confirm policies exist
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename IN ('ref_benchmark_trials', 'ref_benchmark_cohorts', 'ref_population_baselines')
ORDER BY tablename, policyname;
-- Expected: 3 rows (one SELECT policy per table)

-- 4. Confirm indexes
SELECT tablename, indexname
FROM pg_indexes
WHERE tablename IN ('ref_benchmark_trials', 'ref_benchmark_cohorts', 'ref_population_baselines')
ORDER BY tablename, indexname;
-- Expected: Multiple index rows per table

-- ============================================================================
-- END OF MIGRATION 059
-- ============================================================================
