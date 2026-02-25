-- ============================================================================
-- Migration: 067_wire_session_type_id_fk.sql
-- Date: 2026-02-25
-- Purpose: Promote log_clinical_records.session_type from CHECK-constrained
--          VARCHAR to a proper FK reference via session_type_id INTEGER.
--
-- ref_session_types confirmed live (2026-02-25):
--   id=1  PREPARATION
--   id=2  DOSING
--   id=3  INTEGRATION
--   id=4  BASELINE
--   id=5  FOLLOW_UP
--   id=6  SCREENING
--
-- PRE-FLIGHT DATA CHECK (run 2026-02-25):
--   SELECT session_type, COUNT(*) FROM log_clinical_records GROUP BY session_type;
--   | preparation | 21 |  → maps to id=1
--   | dosing      |  2 |  → maps to id=2
--   No 'integration' or 'complete' rows exist — no unmapped values.
--
-- WHAT THIS DOES:
--   1. Add FK constraint to the existing session_type_id INTEGER column
--   2. Populate session_type_id from session_type string values
--   3. session_type VARCHAR column stays (additive only — never drop)
--
-- ============================================================================


-- ============================================================================
-- STEP 1: Add FK constraint to session_type_id (column already exists)
-- PRE-FLIGHT: Verified ref_session_types has id column (BIGINT/INTEGER)
-- ============================================================================

-- Drop if re-running (idempotent)
ALTER TABLE log_clinical_records
  DROP CONSTRAINT IF EXISTS fk_clinical_records_session_type_id;

ALTER TABLE log_clinical_records
  ADD CONSTRAINT fk_clinical_records_session_type_id
  FOREIGN KEY (session_type_id)
  REFERENCES ref_session_types(id)
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_clinical_records_session_type_id
  ON log_clinical_records(session_type_id);

COMMENT ON COLUMN log_clinical_records.session_type_id IS
  'FK → ref_session_types(id). Replaces session_type VARCHAR. Added constraint migration 067.';


-- ============================================================================
-- STEP 2: Backfill session_type_id from existing session_type string values
-- Mapping confirmed against live ref_session_types table.
-- ============================================================================

UPDATE log_clinical_records SET session_type_id = 1 WHERE session_type = 'preparation' AND session_type_id IS NULL;
UPDATE log_clinical_records SET session_type_id = 2 WHERE session_type = 'dosing'       AND session_type_id IS NULL;
UPDATE log_clinical_records SET session_type_id = 3 WHERE session_type = 'integration'  AND session_type_id IS NULL;

COMMENT ON COLUMN log_clinical_records.session_type IS
  'DEPRECATED: Legacy VARCHAR. Use session_type_id FK instead. Kept for read compatibility. Will be removed in a future migration after all writes use session_type_id.';


-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Confirm FK constraint applied:
-- SELECT constraint_name FROM information_schema.table_constraints
-- WHERE table_name = 'log_clinical_records' AND constraint_name = 'fk_clinical_records_session_type_id';

-- Confirm backfill:
-- SELECT session_type, session_type_id, COUNT(*) FROM log_clinical_records
-- GROUP BY session_type, session_type_id ORDER BY session_type;

-- Expected:
-- | dosing      | 2 | 2 rows |
-- | preparation | 1 | 21 rows |
