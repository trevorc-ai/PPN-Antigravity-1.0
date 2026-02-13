-- ============================================================================
-- Migration 014: Add Subject ID Index for Patient Lookup Performance
-- ============================================================================
-- Purpose: Optimize patient lookup query performance for Protocol Builder
-- Date: 2026-02-13
-- Status: OPTIONAL (performance optimization, not blocking)
-- Estimated Impact: Reduce patient lookup time from 50-150ms to 10-50ms
-- ============================================================================

-- 1. Add index on subject_id for fast "Get Last Record" queries
CREATE INDEX IF NOT EXISTS idx_clinical_records_subject_id 
ON public.log_clinical_records(subject_id);

COMMENT ON INDEX idx_clinical_records_subject_id IS 
  'Fast lookup for existing patient records by subject_id (Protocol Builder patient lookup)';

-- 2. Add composite index for common patient search pattern
-- This index supports queries filtering by patient characteristics
CREATE INDEX IF NOT EXISTS idx_clinical_records_patient_lookup 
ON public.log_clinical_records(
  patient_age, 
  patient_sex, 
  patient_weight_range, 
  indication_id, 
  substance_id, 
  session_date DESC
);

COMMENT ON INDEX idx_clinical_records_patient_lookup IS 
  'Optimized for patient search by characteristics (age, sex, weight, indication, substance, date)';

-- 3. Add index on (subject_id, session_number) for session auto-increment
CREATE INDEX IF NOT EXISTS idx_clinical_records_subject_session 
ON public.log_clinical_records(subject_id, session_number DESC);

COMMENT ON INDEX idx_clinical_records_subject_session IS 
  'Fast lookup for MAX(session_number) per patient (session auto-increment logic)';

-- 4. Verify indexes were created
DO $$ 
DECLARE
  idx_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO idx_count
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND tablename = 'log_clinical_records'
    AND indexname IN (
      'idx_clinical_records_subject_id',
      'idx_clinical_records_patient_lookup',
      'idx_clinical_records_subject_session'
    );
  
  IF idx_count = 3 THEN
    RAISE NOTICE '✅ Migration 014: Added 3 patient lookup indexes successfully.';
  ELSE
    RAISE WARNING '⚠️ Migration 014: Expected 3 indexes, found %. Check index creation.', idx_count;
  END IF;
END $$;

-- ============================================================================
-- PERFORMANCE NOTES
-- ============================================================================
-- Before: Patient lookup query ~50-150ms (depends on table size)
-- After:  Patient lookup query ~10-50ms (significant improvement)
--
-- Query patterns optimized:
-- 1. SELECT * FROM log_clinical_records WHERE subject_id = ?
-- 2. SELECT MAX(session_number) FROM log_clinical_records WHERE subject_id = ?
-- 3. SELECT * FROM log_clinical_records WHERE patient_age = ? AND patient_sex = ? ...
-- ============================================================================
