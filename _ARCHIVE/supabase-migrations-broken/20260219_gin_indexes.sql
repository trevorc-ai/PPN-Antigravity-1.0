-- ============================================================================
-- Migration: 20260219_gin_indexes.sql  (WO-201)
-- Purpose:   GIN indexes on all INTEGER[] FK columns + cardinality constraints.
--
-- Pre-flight live schema audit (19 Feb 2026):
--   log_integration_sessions  → session_focus_ids, homework_assigned_ids,
--                                therapist_observation_ids  (all _int4[])
--   log_clinical_records      → support_modality_ids (_int8[])
--                                NOTE: WO said concomitant_med_ids — does not
--                                exist on live schema; correct col is support_modality_ids
--   log_baseline_assessments  → no array columns found; skipped
--
-- All statements idempotent (IF NOT EXISTS / DO block guards).
-- ============================================================================

-- 1. GIN indexes — prevent full table scans on ANY(array_col) queries
CREATE INDEX IF NOT EXISTS idx_gin_session_focus_ids
    ON public.log_integration_sessions USING GIN (session_focus_ids);

CREATE INDEX IF NOT EXISTS idx_gin_homework_assigned_ids
    ON public.log_integration_sessions USING GIN (homework_assigned_ids);

CREATE INDEX IF NOT EXISTS idx_gin_therapist_observation_ids
    ON public.log_integration_sessions USING GIN (therapist_observation_ids);

CREATE INDEX IF NOT EXISTS idx_gin_support_modality_ids
    ON public.log_clinical_records USING GIN (support_modality_ids);

-- 2. Cardinality CHECK constraints — prevent absurd arrays (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_session_focus_limit') THEN
        ALTER TABLE public.log_integration_sessions
            ADD CONSTRAINT chk_session_focus_limit CHECK (cardinality(session_focus_ids) <= 10);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_homework_limit') THEN
        ALTER TABLE public.log_integration_sessions
            ADD CONSTRAINT chk_homework_limit CHECK (cardinality(homework_assigned_ids) <= 10);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_observations_limit') THEN
        ALTER TABLE public.log_integration_sessions
            ADD CONSTRAINT chk_observations_limit CHECK (cardinality(therapist_observation_ids) <= 10);
    END IF;
END $$;
