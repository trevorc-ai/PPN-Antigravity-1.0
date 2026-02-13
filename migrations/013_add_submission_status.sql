-- ============================================================================
-- Migration 013: Add Submission Status to Clinical Records
-- ============================================================================
-- Purpose: Track when a protocol is officially submitted/locked by the practitioner.
-- Date: 2026-02-12
-- ============================================================================

-- 1. Add Status Columns
ALTER TABLE public.log_clinical_records
ADD COLUMN IF NOT EXISTS is_submitted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;

COMMENT ON COLUMN public.log_clinical_records.is_submitted IS 'True if the protocol has been finalized and submitted to the registry';
COMMENT ON COLUMN public.log_clinical_records.submitted_at IS 'Timestamp when the record was submitted';

-- 2. Index for filtering submitted records
CREATE INDEX IF NOT EXISTS idx_clinical_records_submitted ON public.log_clinical_records(is_submitted);

DO $$ 
BEGIN
    RAISE NOTICE '✅ Migration 013: Added submission status tracking.';
END $$;
