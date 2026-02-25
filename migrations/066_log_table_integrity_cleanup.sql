-- ============================================================================
-- Migration: 066_log_table_integrity_cleanup.sql
-- Date: 2026-02-25
-- Author: LEAD (acting as SOOP)
-- Purpose: Fix ALL log_ table integrity violations identified in live schema
--          audit against Column_Check_Constraint_Inspect_log_Tables.csv.
--
-- PHILOSOPHY: Additive + constraint-relaxing only.
--   ✅ DROP NOT NULL     — relaxes constraints, never destroys data
--   ✅ ADD COLUMN        — always IF NOT EXISTS
--   ✅ SET DEFAULT       — makes existing NOT NULL cols survivable
--   ✅ ADD CHECK         — tightens loose VARCHAR columns
--   ❌ No DROP TABLE     — never
--   ❌ No DROP COLUMN    — never
--   ❌ No RENAME         — never
--   ❌ No ALTER TYPE     — never
--
-- BLOCKERS FIXED (silent INSERT failures happening right now):
--   1. log_behavioral_changes  — change_type + change_description NOT NULL
--   2. log_red_alerts          — patient_id + alert_type NOT NULL, no patient FK from CrisisLogger
--   3. log_session_timeline_events — event_type NOT NULL, code never sends it
--   4. log_feature_requests    — request_type + requested_text NOT NULL, code omits both
--
-- CONSTRAINT VIOLATIONS FIXED:
--   5. log_red_alerts          — alert_severity has no CHECK constraint
--   6. log_adverse_events      — alert_severity has no CHECK constraint (if table exists)
--   7. log_clinical_records    — session_type VARCHAR(50) has no CHECK
--   8. log_safety_events       — severity_grade_id / resolution_status_id are TEXT (add typed FK cols)
--
-- CODE FIXES (separate — see clinicalLog.ts + DosageCalculator.tsx):
--   9. DosageCalculator.tsx    — writes to log_doses (non-existent); must use log_dose_events
--  10. CrisisLogger.tsx        — patient_id / alert_type made nullable here; code fix separate
-- ============================================================================


-- ============================================================================
-- 1. log_behavioral_changes
--    BLOCKER: change_type VARCHAR(50) NOT NULL and change_description TEXT NOT NULL
--    Code intentionally never writes these (free-text architecture violation).
--    Fix: make nullable so inserts succeed with FK array approach.
-- ============================================================================

ALTER TABLE log_behavioral_changes
  ALTER COLUMN change_type DROP NOT NULL,
  ALTER COLUMN change_description DROP NOT NULL;

-- Provide safe defaults so existing NOT NULL rows are unaffected
ALTER TABLE log_behavioral_changes
  ALTER COLUMN change_type SET DEFAULT NULL,
  ALTER COLUMN change_description SET DEFAULT NULL;

COMMENT ON COLUMN log_behavioral_changes.change_type IS
  'DEPRECATED: Legacy free-text field. Use change_type_ids INTEGER[] FK to ref_behavioral_change_types instead. Nullable as of migration 066.';

COMMENT ON COLUMN log_behavioral_changes.change_description IS
  'DEPRECATED: Legacy free-text narrative. Architecture Constitution §2 prohibits practitioner prose in log tables. Nullable as of migration 066.';


-- ============================================================================
-- 2. log_red_alerts
--    BLOCKER: patient_id VARCHAR(20) NOT NULL — CrisisLogger has session_id only,
--             not patient_id at time of crisis event logging.
--    BLOCKER: alert_type VARCHAR(50) NOT NULL — code replaced with crisis_event_type_id FK.
--    VIOLATION: alert_severity VARCHAR(20) has no CHECK constraint.
-- ============================================================================

-- Make patient_id nullable — CrisisLogger resolves via session_id → log_clinical_records
ALTER TABLE log_red_alerts
  ALTER COLUMN patient_id DROP NOT NULL;

ALTER TABLE log_red_alerts
  ALTER COLUMN patient_id SET DEFAULT NULL;

-- Make alert_type nullable — fully replaced by crisis_event_type_id INTEGER FK
ALTER TABLE log_red_alerts
  ALTER COLUMN alert_type DROP NOT NULL;

ALTER TABLE log_red_alerts
  ALTER COLUMN alert_type SET DEFAULT NULL;

-- Add CHECK constraint to alert_severity (the 3 values code already writes)
ALTER TABLE log_red_alerts
  DROP CONSTRAINT IF EXISTS chk_red_alerts_alert_severity;

ALTER TABLE log_red_alerts
  ADD CONSTRAINT chk_red_alerts_alert_severity
  CHECK (alert_severity IN ('mild', 'moderate', 'severe'));

COMMENT ON COLUMN log_red_alerts.patient_id IS
  'Nullable as of migration 066. CrisisLogger writes session_id instead; patient resolved via log_clinical_records.patient_link_code join.';

COMMENT ON COLUMN log_red_alerts.alert_type IS
  'DEPRECATED: Replaced by crisis_event_type_id INTEGER FK to ref_crisis_event_types. Nullable as of migration 066.';


-- ============================================================================
-- 3. log_session_timeline_events
--    BLOCKER: event_type VARCHAR(50) NOT NULL with CHECK constraint — but
--             clinicalLog.createTimelineEvent() sends only event_type_id (INTEGER),
--             never event_type. Every timeline INSERT fails.
--    Fix: SET DEFAULT 'other' (valid per existing CHECK constraint).
--         Code should ideally populate this — tracked as tech debt.
-- ============================================================================

ALTER TABLE log_session_timeline_events
  ALTER COLUMN event_type SET DEFAULT 'other';

COMMENT ON COLUMN log_session_timeline_events.event_type IS
  'DEFAULT ''other'' added migration 066 to prevent NOT NULL failures when code sends only event_type_id. Code should map event_type_id → event_type string before insert. Tech debt tracked.';


-- ============================================================================
-- 4. log_feature_requests
--    BLOCKER: request_type VARCHAR(50) NOT NULL + requested_text TEXT NOT NULL
--             Code (ClinicianDirectory.tsx, RefTableRequestModal.tsx) only sends user_id.
--    Fix: provide meaningful defaults so the insert succeeds.
-- ============================================================================

ALTER TABLE log_feature_requests
  ALTER COLUMN request_type SET DEFAULT 'vocabulary_request';

ALTER TABLE log_feature_requests
  ALTER COLUMN requested_text SET DEFAULT '';

COMMENT ON COLUMN log_feature_requests.request_type IS
  'DEFAULT ''vocabulary_request'' added migration 066. App inserts should specify type.';

COMMENT ON COLUMN log_feature_requests.requested_text IS
  'DEFAULT '''' added migration 066 to prevent NOT NULL failure. This table is non-clinical — free text acceptable for feature requests.';


-- ============================================================================
-- 5. log_clinical_records — session_type CHECK constraint
--    VIOLATION: session_type VARCHAR(50) NOT NULL with no CHECK.
--    Code writes 'preparation' on session create. Should be 3 values only.
--    Also: session_type_id INTEGER FK column already exists in live schema.
--    Add CHECK to the legacy text column while the FK replacement is wired.
-- ============================================================================

ALTER TABLE log_clinical_records
  DROP CONSTRAINT IF EXISTS chk_clinical_records_session_type;

ALTER TABLE log_clinical_records
  ADD CONSTRAINT chk_clinical_records_session_type
  CHECK (session_type IN ('preparation', 'dosing', 'integration', 'complete'));

COMMENT ON COLUMN log_clinical_records.session_type IS
  'CHECK constraint added migration 066: preparation | dosing | integration | complete. Long-term: migrate to session_type_id FK.';


-- ============================================================================
-- 6. log_safety_events — severity_grade_id and resolution_status_id are TEXT
--    These should be FK references to ref_severity_grade and ref_resolution_status.
--    ADDITIVE FIX: Add properly-typed FK columns alongside existing TEXT columns.
--    Old TEXT columns left intact — never drop existing columns.
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
  'Typed BIGINT FK replacement for severity_grade_id TEXT (migration 066). Code should write to this column. Old TEXT col left for read compatibility.';

COMMENT ON COLUMN log_safety_events.resolution_status_id_fk IS
  'Typed BIGINT FK replacement for resolution_status_id TEXT (migration 066). Code should write to this column. Old TEXT col left for read compatibility.';


-- ============================================================================
-- 7. log_adverse_events — alert_severity CHECK (if table exists in live DB)
--    The live schema CSV did not show log_adverse_events directly — it may be
--    named differently (e.g. part of log_safety_events). Applying defensively.
--    This block is safe to run even if the table doesn't exist (IF EXISTS guard).
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
-- VERIFICATION QUERIES — paste these after running to confirm success
-- ============================================================================

-- 1. Confirm log_behavioral_changes change_type is now nullable:
-- SELECT column_name, is_nullable FROM information_schema.columns
-- WHERE table_name = 'log_behavioral_changes' AND column_name IN ('change_type', 'change_description');

-- 2. Confirm log_red_alerts patient_id + alert_type are now nullable:
-- SELECT column_name, is_nullable FROM information_schema.columns
-- WHERE table_name = 'log_red_alerts' AND column_name IN ('patient_id', 'alert_type', 'alert_severity');

-- 3. Confirm log_session_timeline_events event_type now has DEFAULT 'other':
-- SELECT column_name, column_default FROM information_schema.columns
-- WHERE table_name = 'log_session_timeline_events' AND column_name = 'event_type';

-- 4. Confirm log_clinical_records session_type CHECK exists:
-- SELECT constraint_name, check_clause FROM information_schema.check_constraints
-- WHERE constraint_name = 'chk_clinical_records_session_type';

-- 5. Confirm log_safety_events new FK columns exist:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'log_safety_events' AND column_name IN ('severity_grade_id_fk', 'resolution_status_id_fk');

-- ============================================================================
-- END OF MIGRATION 066
-- ============================================================================
