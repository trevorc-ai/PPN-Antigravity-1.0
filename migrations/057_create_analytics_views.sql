-- ============================================================================
-- Migration: 057_create_analytics_views.sql
-- Purpose:   Create analytics materialized views against the LIVE schema.
--
-- WHY THIS EXISTS (not 017):
--   Migration 017 referenced columns that do not exist in log_clinical_records:
--     ❌ subject_id        → live column is patient_link_code
--     ❌ patient_age       → does not exist
--     ❌ patient_sex       → does not exist
--     ❌ patient_weight_range → does not exist
--     ❌ dosage_mg         → live column is dosage (NUMERIC)
--     ❌ baseline_phq9_score → does not exist
--     ❌ phq9_post         → does not exist
--     ❌ submitted_at      → does not exist
--   Running 017 would immediately fail. This migration supersedes it.
--
-- LIVE COLUMNS USED (verified from 000_init + 004 + 005 + 010 migrations):
--   patient_link_code TEXT      — patient identifier
--   indication_id     BIGINT    — FK to ref_indications
--   substance_id      BIGINT    — FK to ref_substances
--   site_id           UUID      — FK to log_sites
--   session_date      DATE
--   phq9_score        INTEGER   — single PHQ-9 score per session
--   dosage            NUMERIC
--
-- VIEWS START EMPTY: The HAVING thresholds (3/5/10 patients) exist to
--   prevent analytics on statistically insignificant cohorts. They will
--   populate as real clinical data accumulates.
--
-- IDEMPOTENT:  Yes (CREATE IF NOT EXISTS + CREATE UNIQUE INDEX IF NOT EXISTS)
-- ADDITIVE:    Yes (new views + indexes only)
-- RLS IMPACT:  Materialized views do not support RLS directly. Access is
--              controlled by SECURITY DEFINER functions (see 025).
-- ============================================================================


-- ── 1. mv_outcomes_summary ───────────────────────────────────────────────────
-- Network-wide outcomes by indication + substance cohort.
-- Powers: ProtocolBuilder Clinical Insights, CohortMatchingPanel
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_outcomes_summary AS
SELECT
    indication_id,
    substance_id,
    COUNT(*)                              AS total_sessions,
    COUNT(DISTINCT patient_link_code)     AS unique_patients,
    AVG(phq9_score)                       AS avg_phq9_score,
    STDDEV(phq9_score)                    AS std_dev_phq9,
    -- Remission proxy: PHQ-9 score < 5
    COUNT(CASE WHEN phq9_score < 5 THEN 1 END)::FLOAT /
        NULLIF(COUNT(CASE WHEN phq9_score IS NOT NULL THEN 1 END), 0)::FLOAT
                                          AS remission_rate,
    -- Confidence tier based on sample size
    CASE
        WHEN COUNT(DISTINCT patient_link_code) >= 100 THEN 0.95
        WHEN COUNT(DISTINCT patient_link_code) >= 50  THEN 0.90
        WHEN COUNT(DISTINCT patient_link_code) >= 25  THEN 0.85
        WHEN COUNT(DISTINCT patient_link_code) >= 10  THEN 0.75
        ELSE 0.50
    END                                   AS confidence_level,
    MIN(session_date)                     AS earliest_session,
    MAX(session_date)                     AS latest_session,
    NOW()                                 AS last_updated
FROM public.log_clinical_records
WHERE indication_id IS NOT NULL
  AND substance_id  IS NOT NULL
GROUP BY indication_id, substance_id
HAVING COUNT(DISTINCT patient_link_code) >= 3;

-- Required for REFRESH MATERIALIZED VIEW CONCURRENTLY
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_outcomes_pk
    ON public.mv_outcomes_summary(indication_id, substance_id);

CREATE INDEX IF NOT EXISTS idx_mv_outcomes_lookup
    ON public.mv_outcomes_summary(indication_id, substance_id);

CREATE INDEX IF NOT EXISTS idx_mv_outcomes_sample_size
    ON public.mv_outcomes_summary(unique_patients DESC);


-- ── 2. mv_clinic_benchmarks ──────────────────────────────────────────────────
-- Per-clinic performance vs. network. Powers: ClinicBenchmarkCard.
-- NOTE: PERCENT_RANK() is computed via a regular view layered on top (below).
--       Materialized views with window functions over aggregates are valid SQL
--       but require a subquery wrapper for the UNIQUE index to work correctly.
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_clinic_benchmarks AS
SELECT
    site_id,
    substance_id,
    indication_id,
    COUNT(*)                              AS total_sessions,
    COUNT(DISTINCT patient_link_code)     AS unique_patients,
    AVG(phq9_score)                       AS avg_phq9_score,
    COUNT(CASE WHEN phq9_score < 5 THEN 1 END)::FLOAT /
        NULLIF(COUNT(CASE WHEN phq9_score IS NOT NULL THEN 1 END), 0)::FLOAT
                                          AS success_rate,
    MIN(session_date)                     AS earliest_session,
    MAX(session_date)                     AS latest_session,
    NOW()                                 AS last_updated
FROM public.log_clinical_records
WHERE site_id        IS NOT NULL
  AND substance_id   IS NOT NULL
  AND indication_id  IS NOT NULL
GROUP BY site_id, substance_id, indication_id
HAVING COUNT(DISTINCT patient_link_code) >= 5;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_clinic_pk
    ON public.mv_clinic_benchmarks(site_id, substance_id, indication_id);

CREATE INDEX IF NOT EXISTS idx_mv_clinic_lookup
    ON public.mv_clinic_benchmarks(site_id);

-- Percentile rank computed as a thin regular view over the materialized view
-- (avoids indexing issues while keeping PERCENT_RANK available to the frontend)
CREATE OR REPLACE VIEW public.v_clinic_benchmarks_ranked AS
SELECT
    *,
    PERCENT_RANK() OVER (
        PARTITION BY substance_id, indication_id
        ORDER BY success_rate ASC NULLS FIRST
    ) AS percentile_rank
FROM public.mv_clinic_benchmarks;


-- ── 3. mv_network_benchmarks ─────────────────────────────────────────────────
-- Network-wide averages for cross-clinic comparison. Powers: NetworkBenchmarkPanel.
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_network_benchmarks AS
SELECT
    substance_id,
    indication_id,
    COUNT(*)                              AS total_sessions,
    COUNT(DISTINCT patient_link_code)     AS unique_patients,
    COUNT(DISTINCT site_id)               AS participating_sites,
    AVG(phq9_score)                       AS avg_phq9_score,
    COUNT(CASE WHEN phq9_score < 5 THEN 1 END)::FLOAT /
        NULLIF(COUNT(CASE WHEN phq9_score IS NOT NULL THEN 1 END), 0)::FLOAT
                                          AS network_success_rate,
    MIN(session_date)                     AS earliest_session,
    MAX(session_date)                     AS latest_session,
    NOW()                                 AS last_updated
FROM public.log_clinical_records
WHERE substance_id  IS NOT NULL
  AND indication_id IS NOT NULL
GROUP BY substance_id, indication_id
HAVING COUNT(DISTINCT patient_link_code) >= 10;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_network_pk
    ON public.mv_network_benchmarks(substance_id, indication_id);

CREATE INDEX IF NOT EXISTS idx_mv_network_lookup
    ON public.mv_network_benchmarks(substance_id, indication_id);


-- ── 4. Ownership & permissions ───────────────────────────────────────────────
ALTER MATERIALIZED VIEW public.mv_outcomes_summary  OWNER TO postgres;
ALTER MATERIALIZED VIEW public.mv_clinic_benchmarks OWNER TO postgres;
ALTER MATERIALIZED VIEW public.mv_network_benchmarks OWNER TO postgres;

GRANT SELECT ON public.mv_outcomes_summary   TO authenticated;
GRANT SELECT ON public.mv_clinic_benchmarks  TO authenticated;
GRANT SELECT ON public.mv_network_benchmarks TO authenticated;
GRANT SELECT ON public.v_clinic_benchmarks_ranked TO authenticated;


-- ── 5. Initial population (non-CONCURRENTLY for first run) ───────────────────
-- Views will be empty until real clinical records with indication_id +
-- substance_id accumulate (HAVING threshold: 3/5/10 patients per cohort).
REFRESH MATERIALIZED VIEW public.mv_outcomes_summary;
REFRESH MATERIALIZED VIEW public.mv_clinic_benchmarks;
REFRESH MATERIALIZED VIEW public.mv_network_benchmarks;


-- ── 6. Verification ──────────────────────────────────────────────────────────
DO $$
DECLARE
    v_outcomes  INTEGER;
    v_clinic    INTEGER;
    v_network   INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_outcomes FROM public.mv_outcomes_summary;
    SELECT COUNT(*) INTO v_clinic   FROM public.mv_clinic_benchmarks;
    SELECT COUNT(*) INTO v_network  FROM public.mv_network_benchmarks;

    RAISE NOTICE '✅ Migration 057: Analytics materialized views created';
    RAISE NOTICE '   mv_outcomes_summary:  % rows (empty until 3+ patient cohorts exist)', v_outcomes;
    RAISE NOTICE '   mv_clinic_benchmarks: % rows (empty until 5+ patient cohorts exist)', v_clinic;
    RAISE NOTICE '   mv_network_benchmarks:% rows (empty until 10+ patient cohorts exist)', v_network;
    RAISE NOTICE '   v_clinic_benchmarks_ranked: view with PERCENT_RANK() available';
    RAISE NOTICE '   auto_refresh_analytics() trigger: now unblocked on log_clinical_records';
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- Next: The trigger_refresh_analytics on log_clinical_records will now call
-- should_refresh_analytics() successfully, which reads mv_outcomes_summary.
-- All three views will auto-refresh every 5 minutes on new clinical data.
-- ============================================================================
