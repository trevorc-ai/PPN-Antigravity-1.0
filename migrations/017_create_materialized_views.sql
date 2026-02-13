-- ============================================================================
-- Migration 017: Create Materialized Views for Clinical Analytics
-- ============================================================================
-- Purpose: Enable real-time analytics in Protocol Builder Clinical Insights
-- Date: 2026-02-13
-- Status: READY TO RUN
-- Dependencies: Requires log_clinical_records to have outcome data (phq9_baseline, phq9_post)
-- ============================================================================

-- 1. Create outcomes summary materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_outcomes_summary AS
SELECT 
  indication_id,
  substance_id,
  patient_age AS age_range,
  patient_sex AS biological_sex,
  patient_weight_range AS weight_range,
  dosage_mg,
  COUNT(*) as total_sessions,
  COUNT(DISTINCT subject_id) as unique_patients,
  -- PHQ-9 outcomes (Depression)
  AVG(CASE WHEN baseline_phq9_score IS NOT NULL AND phq9_post IS NOT NULL 
      THEN phq9_post - baseline_phq9_score END) as avg_phq9_improvement,
  STDDEV(CASE WHEN baseline_phq9_score IS NOT NULL AND phq9_post IS NOT NULL 
      THEN phq9_post - baseline_phq9_score END) as std_dev_phq9,
  -- Remission rate (PHQ-9 < 5)
  COUNT(CASE WHEN phq9_post < 5 THEN 1 END)::float / 
    NULLIF(COUNT(CASE WHEN phq9_post IS NOT NULL THEN 1 END), 0)::float as remission_rate,
  -- Response rate (≥50% improvement)
  COUNT(CASE WHEN baseline_phq9_score IS NOT NULL AND phq9_post IS NOT NULL 
        AND (baseline_phq9_score - phq9_post)::float / baseline_phq9_score >= 0.5 
        THEN 1 END)::float / 
    NULLIF(COUNT(CASE WHEN baseline_phq9_score IS NOT NULL AND phq9_post IS NOT NULL THEN 1 END), 0)::float 
    as response_rate,
  -- Confidence metrics
  CASE 
    WHEN COUNT(DISTINCT subject_id) >= 100 THEN 0.95
    WHEN COUNT(DISTINCT subject_id) >= 50 THEN 0.90
    WHEN COUNT(DISTINCT subject_id) >= 25 THEN 0.85
    WHEN COUNT(DISTINCT subject_id) >= 10 THEN 0.75
    ELSE 0.50
  END as confidence_level,
  -- Metadata
  MIN(session_date) as earliest_session,
  MAX(session_date) as latest_session,
  NOW() as last_updated
FROM public.log_clinical_records
WHERE submitted_at IS NOT NULL  -- Only include submitted records
  AND indication_id IS NOT NULL
  AND substance_id IS NOT NULL
GROUP BY indication_id, substance_id, patient_age, patient_sex, patient_weight_range, dosage_mg
HAVING COUNT(DISTINCT subject_id) >= 3;  -- Minimum 3 patients for statistical validity

-- 2. Create indexes on outcomes summary
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_outcomes_pk 
ON public.mv_outcomes_summary(indication_id, substance_id, age_range, biological_sex, weight_range, dosage_mg);

CREATE INDEX IF NOT EXISTS idx_mv_outcomes_lookup 
ON public.mv_outcomes_summary(indication_id, substance_id);

CREATE INDEX IF NOT EXISTS idx_mv_outcomes_sample_size 
ON public.mv_outcomes_summary(unique_patients DESC);

-- 3. Create clinic benchmarks materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_clinic_benchmarks AS
SELECT 
  site_id,
  substance_id,
  indication_id,
  COUNT(*) as total_sessions,
  COUNT(DISTINCT subject_id) as unique_patients,
  -- PHQ-9 outcomes
  AVG(CASE WHEN baseline_phq9_score IS NOT NULL AND phq9_post IS NOT NULL 
      THEN phq9_post - baseline_phq9_score END) as avg_improvement,
  COUNT(CASE WHEN phq9_post < 5 THEN 1 END)::float / 
    NULLIF(COUNT(CASE WHEN phq9_post IS NOT NULL THEN 1 END), 0)::float as success_rate,
  -- Percentile rank (calculated later via window function)
  PERCENT_RANK() OVER (
    PARTITION BY substance_id, indication_id 
    ORDER BY COUNT(CASE WHEN phq9_post < 5 THEN 1 END)::float / 
             NULLIF(COUNT(CASE WHEN phq9_post IS NOT NULL THEN 1 END), 0)::float
  ) as percentile_rank,
  -- Metadata
  MIN(session_date) as earliest_session,
  MAX(session_date) as latest_session,
  NOW() as last_updated
FROM public.log_clinical_records
WHERE submitted_at IS NOT NULL
  AND site_id IS NOT NULL
  AND substance_id IS NOT NULL
  AND indication_id IS NOT NULL
GROUP BY site_id, substance_id, indication_id
HAVING COUNT(DISTINCT subject_id) >= 5;  -- Minimum 5 patients per clinic

-- 4. Create indexes on clinic benchmarks
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_clinic_pk 
ON public.mv_clinic_benchmarks(site_id, substance_id, indication_id);

CREATE INDEX IF NOT EXISTS idx_mv_clinic_lookup 
ON public.mv_clinic_benchmarks(site_id);

-- 5. Create network benchmarks materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_network_benchmarks AS
SELECT 
  substance_id,
  indication_id,
  COUNT(*) as total_sessions,
  COUNT(DISTINCT subject_id) as unique_patients,
  COUNT(DISTINCT site_id) as participating_sites,
  -- PHQ-9 outcomes
  AVG(CASE WHEN baseline_phq9_score IS NOT NULL AND phq9_post IS NOT NULL 
      THEN phq9_post - baseline_phq9_score END) as avg_improvement,
  COUNT(CASE WHEN phq9_post < 5 THEN 1 END)::float / 
    NULLIF(COUNT(CASE WHEN phq9_post IS NOT NULL THEN 1 END), 0)::float as network_success_rate,
  -- Response rate
  COUNT(CASE WHEN baseline_phq9_score IS NOT NULL AND phq9_post IS NOT NULL 
        AND (baseline_phq9_score - phq9_post)::float / baseline_phq9_score >= 0.5 
        THEN 1 END)::float / 
    NULLIF(COUNT(CASE WHEN baseline_phq9_score IS NOT NULL AND phq9_post IS NOT NULL THEN 1 END), 0)::float 
    as network_response_rate,
  -- Metadata
  MIN(session_date) as earliest_session,
  MAX(session_date) as latest_session,
  NOW() as last_updated
FROM public.log_clinical_records
WHERE submitted_at IS NOT NULL
  AND substance_id IS NOT NULL
  AND indication_id IS NOT NULL
GROUP BY substance_id, indication_id
HAVING COUNT(DISTINCT subject_id) >= 10;  -- Minimum 10 patients network-wide

-- 6. Create indexes on network benchmarks
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_network_pk 
ON public.mv_network_benchmarks(substance_id, indication_id);

-- 7. Add comments
COMMENT ON MATERIALIZED VIEW public.mv_outcomes_summary IS 
  'Pre-computed outcomes for cohort matching in Protocol Builder. Refreshed hourly.';
COMMENT ON MATERIALIZED VIEW public.mv_clinic_benchmarks IS 
  'Clinic-level performance metrics for benchmarking. Refreshed daily.';
COMMENT ON MATERIALIZED VIEW public.mv_network_benchmarks IS 
  'Network-wide averages for comparison. Refreshed daily.';

-- 8. Enable RLS on materialized views
ALTER MATERIALIZED VIEW public.mv_outcomes_summary OWNER TO postgres;
ALTER MATERIALIZED VIEW public.mv_clinic_benchmarks OWNER TO postgres;
ALTER MATERIALIZED VIEW public.mv_network_benchmarks OWNER TO postgres;

-- Note: Materialized views don't support RLS directly, but we can create security-definer functions

-- 9. Create refresh functions (for manual or scheduled refresh)
CREATE OR REPLACE FUNCTION public.refresh_outcomes_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_outcomes_summary;
  RAISE NOTICE 'Refreshed mv_outcomes_summary at %', NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.refresh_clinic_benchmarks()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_clinic_benchmarks;
  RAISE NOTICE 'Refreshed mv_clinic_benchmarks at %', NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.refresh_network_benchmarks()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_network_benchmarks;
  RAISE NOTICE 'Refreshed mv_network_benchmarks at %', NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Initial refresh
REFRESH MATERIALIZED VIEW public.mv_outcomes_summary;
REFRESH MATERIALIZED VIEW public.mv_clinic_benchmarks;
REFRESH MATERIALIZED VIEW public.mv_network_benchmarks;

-- 11. Verify creation
DO $$ 
DECLARE
  outcomes_count INTEGER;
  clinic_count INTEGER;
  network_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO outcomes_count FROM public.mv_outcomes_summary;
  SELECT COUNT(*) INTO clinic_count FROM public.mv_clinic_benchmarks;
  SELECT COUNT(*) INTO network_count FROM public.mv_network_benchmarks;
  
  RAISE NOTICE '✅ Migration 017: Created materialized views';
  RAISE NOTICE '   - mv_outcomes_summary: % rows', outcomes_count;
  RAISE NOTICE '   - mv_clinic_benchmarks: % rows', clinic_count;
  RAISE NOTICE '   - mv_network_benchmarks: % rows', network_count;
  
  IF outcomes_count = 0 THEN
    RAISE WARNING '⚠️ mv_outcomes_summary is empty. Ensure log_clinical_records has outcome data (phq9_post).';
  END IF;
END $$;
