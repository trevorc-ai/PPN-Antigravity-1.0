-- ============================================================================
-- Migration: 066c_safety_events_fk_columns.sql
-- Date: 2026-02-25
-- Purpose: Patch for 066b FK error — correct PK column names for ref tables.
--
-- 066b Steps 1 + 2 succeeded:
--   ✅ session_type rows normalized ('Preparation' → 'preparation', 'Dosing Session' → 'dosing')
--   ✅ chk_clinical_records_session_type CHECK constraint applied
--
-- 066b Steps 3 + 4 failed (wrong FK column name — 'id' does not exist):
--   ❌ log_safety_events FK columns — PK is severity_grade_id, not id
--   ❌ log_adverse_events CHECK — skipped after error
--
-- This migration runs only Steps 3 + 4 with correct column names.
-- ============================================================================


-- ============================================================================
-- STEP 3 (corrected): log_safety_events — typed FK columns
-- ref_severity_grade PK = severity_grade_id (BIGINT)
-- ref_resolution_status PK = resolution_status_id (BIGINT)
-- ============================================================================

ALTER TABLE log_safety_events
  ADD COLUMN IF NOT EXISTS severity_grade_id_fk BIGINT
    REFERENCES ref_severity_grade(severity_grade_id)
    ON DELETE SET NULL;

ALTER TABLE log_safety_events
  ADD COLUMN IF NOT EXISTS resolution_status_id_fk BIGINT
    REFERENCES ref_resolution_status(resolution_status_id)
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_safety_events_severity_grade_fk
  ON log_safety_events(severity_grade_id_fk);

CREATE INDEX IF NOT EXISTS idx_safety_events_resolution_status_fk
  ON log_safety_events(resolution_status_id_fk);

COMMENT ON COLUMN log_safety_events.severity_grade_id_fk IS
  'Typed BIGINT FK → ref_severity_grade(severity_grade_id). Replaces legacy severity_grade_id TEXT. Added migration 066c.';

COMMENT ON COLUMN log_safety_events.resolution_status_id_fk IS
  'Typed BIGINT FK → ref_resolution_status(resolution_status_id). Replaces legacy resolution_status_id TEXT. Added migration 066c.';


-- ============================================================================
-- STEP 4: log_adverse_events alert_severity CHECK (defensive IF EXISTS)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'log_adverse_events'
  ) THEN
    ALTER TABLE log_adverse_events
      DROP CONSTRAINT IF EXISTS chk_adverse_events_alert_severity;

    ALTER TABLE log_adverse_events
      ADD CONSTRAINT chk_adverse_events_alert_severity
      CHECK (alert_severity IN ('mild', 'moderate', 'severe'));
  END IF;
END $$;


-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Confirm FK columns on log_safety_events:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'log_safety_events'
--   AND column_name IN ('severity_grade_id_fk', 'resolution_status_id_fk');
