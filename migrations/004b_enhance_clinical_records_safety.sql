-- ============================================================================
-- Migration 004b: Enhance Clinical Records - Safety & Route IDs
-- ============================================================================
-- Purpose: Add remaining ID columns for safety, route, and resolution
-- Date: 2026-02-10
-- Status: READY TO RUN
-- ============================================================================

ALTER TABLE public.log_clinical_records
ADD COLUMN IF NOT EXISTS route_id BIGINT REFERENCES public.ref_routes(route_id),
ADD COLUMN IF NOT EXISTS safety_event_id BIGINT REFERENCES public.ref_safety_events(safety_event_id),
ADD COLUMN IF NOT EXISTS severity_grade_id BIGINT REFERENCES public.ref_severity_grade(severity_grade_id),
ADD COLUMN IF NOT EXISTS resolution_status_id BIGINT REFERENCES public.ref_resolution_status(resolution_status_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_clinical_records_safety_event ON public.log_clinical_records(safety_event_id);
CREATE INDEX IF NOT EXISTS idx_clinical_records_severity ON public.log_clinical_records(severity_grade_id);
CREATE INDEX IF NOT EXISTS idx_clinical_records_route ON public.log_clinical_records(route_id);

DO $$ 
BEGIN
    RAISE NOTICE '✅ Migration 004b: Safety & Route IDs Added Successfully';
END $$;
