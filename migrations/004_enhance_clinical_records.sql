-- ============================================================================
-- Migration 004: Enhance Clinical Records Table
-- ============================================================================
-- Purpose: Add missing columns to log_clinical_records to support ProtocolBuilder
-- Date: 2026-02-10
-- Status: READY TO RUN
-- ============================================================================

-- Add new columns to log_clinical_records
ALTER TABLE public.log_clinical_records
ADD COLUMN IF NOT EXISTS indication_id BIGINT REFERENCES public.ref_indications(indication_id),
ADD COLUMN IF NOT EXISTS session_number INTEGER,
ADD COLUMN IF NOT EXISTS session_date DATE,
ADD COLUMN IF NOT EXISTS protocol_template_id UUID,
ADD COLUMN IF NOT EXISTS concomitant_meds TEXT,
ADD COLUMN IF NOT EXISTS support_modality_ids BIGINT[],
ADD COLUMN IF NOT EXISTS patient_weight_range TEXT,
ADD COLUMN IF NOT EXISTS patient_sex TEXT,
ADD COLUMN IF NOT EXISTS patient_age TEXT,
ADD COLUMN IF NOT EXISTS patient_smoking_status_id BIGINT REFERENCES public.ref_smoking_status(smoking_status_id),
ADD COLUMN IF NOT EXISTS baseline_phq9_score INTEGER,
ADD COLUMN IF NOT EXISTS psychological_difficulty_score INTEGER;

-- Create indexes for new columns used in filtering/analytics
CREATE INDEX IF NOT EXISTS idx_clinical_records_indication ON public.log_clinical_records(indication_id);
CREATE INDEX IF NOT EXISTS idx_clinical_records_session_date ON public.log_clinical_records(session_date);
CREATE INDEX IF NOT EXISTS idx_clinical_records_session_number ON public.log_clinical_records(session_number);

-- Verify columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'log_clinical_records'
ORDER BY ordinal_position;

DO $$ 
BEGIN
    RAISE NOTICE '✅ Migration 004: Clinical Records Enhanced Successfully';
END $$;
