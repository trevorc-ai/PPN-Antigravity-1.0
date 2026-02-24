-- ============================================================================
-- MIGRATION: Benchmark Schema Compliance Remediation
-- ============================================================================
-- WO-416 | BUILDER/INSPECTOR
-- Date: 2026-02-24
-- Purpose: Remediate remaining tables that violate the "log_" or "ref_" 
--          prefix convention required by the Database Integrity Policy.
--          Drops the orphaned sys_waitlist.
-- ============================================================================

-- 1. DROP ORPHANED SYS_WAITLIST
DROP TABLE IF EXISTS sys_waitlist;

-- 2. CREATE REPLACEMENT BENCHMARK TABLES WITH 'ref_' PREFIX
CREATE TABLE IF NOT EXISTS public.ref_benchmark_trials (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nct_id                  TEXT        UNIQUE NOT NULL,
  title                   TEXT        NOT NULL,
  phase                   TEXT,
  status                  TEXT,
  modality                TEXT        NOT NULL,
  conditions              TEXT[],
  country                 TEXT,
  enrollment_actual       INTEGER,
  start_date              DATE,
  completion_date         DATE,
  primary_outcome_measure TEXT,
  source                  TEXT        NOT NULL DEFAULT 'clinicaltrials.gov',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ref_benchmark_cohorts (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_name             TEXT        NOT NULL,
  source_citation         TEXT        NOT NULL,
  modality                TEXT        NOT NULL,
  condition               TEXT        NOT NULL,
  setting                 TEXT,
  n_participants          INTEGER     NOT NULL,
  country                 TEXT,
  instrument              TEXT        NOT NULL,
  baseline_mean           NUMERIC(8,2),
  baseline_sd             NUMERIC(8,2),
  endpoint_mean           NUMERIC(8,2),
  endpoint_sd             NUMERIC(8,2),
  followup_weeks          INTEGER,
  response_rate_pct       NUMERIC(5,1),
  remission_rate_pct      NUMERIC(5,1),
  effect_size_hedges_g    NUMERIC(6,3),
  adverse_event_rate_pct  NUMERIC(5,1),
  data_freely_usable      BOOLEAN     NOT NULL DEFAULT TRUE,
  license                 TEXT,
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ref_population_baselines (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  source                    TEXT        NOT NULL,
  year                      INTEGER     NOT NULL,
  region                    TEXT        NOT NULL,
  condition                 TEXT,
  substance                 TEXT,
  demographic_group         TEXT,
  n_episodes                INTEGER,
  avg_age                   NUMERIC(5,1),
  pct_female                NUMERIC(5,1),
  avg_prior_treatments      NUMERIC(5,1),
  avg_los_days              NUMERIC(7,1),
  pct_completed_treatment   NUMERIC(5,1),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MIGRATE DATA ONLY IF OLD TABLE EXISTS
-- We use PL/pgSQL DO blocks to conditionally check and insert if the old table exists.
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'benchmark_trials') THEN
    INSERT INTO public.ref_benchmark_trials
    SELECT * FROM public.benchmark_trials
    ON CONFLICT DO NOTHING;
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'benchmark_cohorts') THEN
    INSERT INTO public.ref_benchmark_cohorts
    SELECT * FROM public.benchmark_cohorts
    ON CONFLICT DO NOTHING;
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'population_baselines') THEN
    INSERT INTO public.ref_population_baselines
    SELECT * FROM public.population_baselines
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- 4. APPLY ROW LEVEL SECURITY (RLS)
ALTER TABLE public.ref_benchmark_trials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_benchmark_trials_authenticated_select" ON public.ref_benchmark_trials;
CREATE POLICY "ref_benchmark_trials_authenticated_select" ON public.ref_benchmark_trials FOR SELECT TO authenticated USING (true);

ALTER TABLE public.ref_benchmark_cohorts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_benchmark_cohorts_authenticated_select" ON public.ref_benchmark_cohorts;
CREATE POLICY "ref_benchmark_cohorts_authenticated_select" ON public.ref_benchmark_cohorts FOR SELECT TO authenticated USING (true);

ALTER TABLE public.ref_population_baselines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_population_baselines_authenticated_select" ON public.ref_population_baselines;
CREATE POLICY "ref_population_baselines_authenticated_select" ON public.ref_population_baselines FOR SELECT TO authenticated USING (true);

-- 5. RECREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_rbt_modality ON public.ref_benchmark_trials(modality);
CREATE INDEX IF NOT EXISTS idx_rbt_status ON public.ref_benchmark_trials(status);
CREATE INDEX IF NOT EXISTS idx_rbt_country ON public.ref_benchmark_trials(country);
CREATE INDEX IF NOT EXISTS idx_rbt_completion_date ON public.ref_benchmark_trials(completion_date DESC);

CREATE INDEX IF NOT EXISTS idx_rbc_modality_condition ON public.ref_benchmark_cohorts(modality, condition);
CREATE INDEX IF NOT EXISTS idx_rbc_instrument ON public.ref_benchmark_cohorts(instrument);
CREATE INDEX IF NOT EXISTS idx_rbc_modality ON public.ref_benchmark_cohorts(modality);
CREATE INDEX IF NOT EXISTS idx_rbc_condition ON public.ref_benchmark_cohorts(condition);

CREATE INDEX IF NOT EXISTS idx_rpb_source_year ON public.ref_population_baselines(source, year);
CREATE INDEX IF NOT EXISTS idx_rpb_condition ON public.ref_population_baselines(condition);
CREATE INDEX IF NOT EXISTS idx_rpb_region ON public.ref_population_baselines(region);

-- 6. DROP OLD NON-COMPLIANT TABLES
DROP TABLE IF EXISTS benchmark_trials;
DROP TABLE IF EXISTS benchmark_cohorts;
DROP TABLE IF EXISTS population_baselines;

-- 7. SECURE DATABASE VIEWS WITH SECURITY INVOKER
-- Enforces underlying table Row Level Security policies when querying via views.
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_views WHERE schemaname = 'public' AND viewname = 'v_flow_stage_counts') THEN
    ALTER VIEW public.v_flow_stage_counts SET (security_invoker = on);
  END IF;

  IF EXISTS (SELECT FROM pg_views WHERE schemaname = 'public' AND viewname = 'v_flow_time_to_next_step') THEN
    ALTER VIEW public.v_flow_time_to_next_step SET (security_invoker = on);
  END IF;

  IF EXISTS (SELECT FROM pg_views WHERE schemaname = 'public' AND viewname = 'v_followup_compliance') THEN
    ALTER VIEW public.v_followup_compliance SET (security_invoker = on);
  END IF;
END $$;
