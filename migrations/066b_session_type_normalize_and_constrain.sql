-- ============================================================================
-- Migration: 066b_session_type_normalize_and_constrain.sql
-- Date: 2026-02-25
-- Purpose: Patch for 066 failure on session_type CHECK constraint.
--
-- Root cause: 3 rows had display-label strings instead of code values:
--   'Preparation' (1 row) — capitalization inconsistency
--   'Dosing Session' (2 rows) — UI display label written directly to DB
--
-- This patch:
--   1. Normalizes those 3 rows to their correct code equivalents
--   2. Re-runs the session_type CHECK (Section 5 of 066)
--   3. Runs Sections 6–7 of 066 that were skipped after the error
--
-- Sections 1–4 of 066 already applied successfully — do NOT re-run.
-- ============================================================================


-- ============================================================================
-- STEP 1: Normalize dirty session_type values in log_clinical_records
-- Data correction, not structural change. Safe to re-run (idempotent).
-- ============================================================================

-- 'Preparation' → 'preparation' (1 row affected)
UPDATE log_clinical_records
SET session_type = 'preparation'
WHERE session_type = 'Preparation';

-- 'Dosing Session' → 'dosing' (2 rows affected)
UPDATE log_clinical_records
SET session_type = 'dosing'
WHERE session_type = 'Dosing Session';

-- Verification: no violating rows should remain
-- SELECT session_type, COUNT(*) FROM log_clinical_records GROUP BY session_type;


-- ============================================================================
-- STEP 2: Apply session_type CHECK constraint (Section 5 of 066, re-run)
-- ============================================================================

ALTER TABLE log_clinical_records
  DROP CONSTRAINT IF EXISTS chk_clinical_records_session_type;

ALTER TABLE log_clinical_records
  ADD CONSTRAINT chk_clinical_records_session_type
  CHECK (session_type IN ('preparation', 'dosing', 'integration', 'complete'));

COMMENT ON COLUMN log_clinical_records.session_type IS
  'CHECK constraint: preparation | dosing | integration | complete. Normalized from display labels in migration 066b. Long-term: migrate to session_type_id FK.';


-- ============================================================================
-- STEP 3: log_safety_events — add properly-typed FK columns (Section 6 of 066)
-- Original TEXT columns left intact — additive only.
-- ============================================================================

ALTER TABLE log_safety_events
  ADD COLUMN IF NOT EXISTS severity_grade_id_fk BIGINT
    REFERENCES ref_severity_grade(id)
    ON DELETE SET NULL;

ALTER TABLE log_safety_events
  ADD COLUMN IF NOT EXISTS resolution_status_id_fk BIGINT
    REFERENCES ref_resolution_status(id)
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_safety_events_severity_grade_fk
  ON log_safety_events(severity_grade_id_fk);

CREATE INDEX IF NOT EXISTS idx_safety_events_resolution_status_fk
  ON log_safety_events(resolution_status_id_fk);

COMMENT ON COLUMN log_safety_events.severity_grade_id_fk IS
  'Typed BIGINT FK to ref_severity_grade. Replaces legacy severity_grade_id TEXT column. Added migration 066b.';

COMMENT ON COLUMN log_safety_events.resolution_status_id_fk IS
  'Typed BIGINT FK to ref_resolution_status. Replaces legacy resolution_status_id TEXT column. Added migration 066b.';


-- ============================================================================
-- STEP 4: log_adverse_events CHECK (Section 7 of 066) — defensive, IF EXISTS
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
-- VERIFICATION — run these after the migration to confirm all applied
-- ============================================================================

-- 1. Confirm session_type values are now clean:
-- SELECT session_type, COUNT(*) FROM log_clinical_records GROUP BY session_type ORDER BY session_type;

-- 2. Confirm CHECK constraint exists:
-- SELECT constraint_name, check_clause FROM information_schema.check_constraints
-- WHERE constraint_name = 'chk_clinical_records_session_type';

-- 3. Confirm new FK columns on log_safety_events:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'log_safety_events'
--   AND column_name IN ('severity_grade_id_fk', 'resolution_status_id_fk');

-- ============================================================================
-- END OF MIGRATION 066b
-- ============================================================================
