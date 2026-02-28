-- ============================================================================
-- EMERGENCY INCREMENTAL FIX: Add Missing subject_id Column
-- ============================================================================
-- Purpose: Add subject_id column to log_clinical_records if missing
-- Date: 2026-02-15
-- Safe: Uses IF NOT EXISTS and column existence checks
-- ============================================================================

-- Check if column exists before adding
DO $$
BEGIN
    -- Add subject_id to log_clinical_records if missing
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'log_clinical_records' 
          AND column_name = 'subject_id'
    ) THEN
        RAISE NOTICE '⚠️  Adding missing subject_id column to log_clinical_records';
        ALTER TABLE public.log_clinical_records 
        ADD COLUMN subject_id BIGINT;
        
        RAISE NOTICE '✅ subject_id column added successfully';
    ELSE
        RAISE NOTICE '✅ subject_id column already exists';
    END IF;
END $$;

-- Add index on subject_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_clinical_records_subject_id 
ON public.log_clinical_records(subject_id);

COMMENT ON INDEX idx_clinical_records_subject_id IS 
  'Fast lookup for existing patient records by subject_id (Protocol Builder patient lookup)';

-- Verify the column now exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND table_name = 'log_clinical_records' 
              AND column_name = 'subject_id'
        ) THEN '✅ VERIFICATION PASSED: subject_id exists in log_clinical_records'
        ELSE '❌ VERIFICATION FAILED: subject_id still missing'
    END as verification_result;

-- ============================================================================
-- END MIGRATION
-- ============================================================================

RAISE NOTICE '✅ Emergency incremental fix completed successfully';
