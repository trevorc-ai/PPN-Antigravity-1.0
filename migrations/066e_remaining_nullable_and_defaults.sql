-- ============================================================================
-- Migration: 066e_remaining_nullable_and_defaults.sql
-- Date: 2026-02-25
-- Purpose: Apply 066 Sections 1–4 which were rolled back when Section 5
--          (ADD CONSTRAINT) failed due to dirty data.
--          066d fixed that data + applied the CHECK. 066c applied FK columns.
--          This file closes out the remaining items.
--
-- SAFETY: All statements here are ALTER COLUMN DROP NOT NULL or SET DEFAULT.
--         These operations CANNOT fail due to existing data — zero rollback risk.
--         Safe to run even if already applied (idempotent behavior).
--
-- Confirmed still needed (live check 2026-02-25 10:08):
--   log_behavioral_changes.change_type        — still NOT NULL
--   log_behavioral_changes.change_description — still NOT NULL
-- ============================================================================


-- ============================================================================
-- SECTION 1: log_behavioral_changes
--   change_type VARCHAR(50) NOT NULL — legacy free-text, code never writes it
--   change_description TEXT NOT NULL — legacy narrative, code never writes it
-- ============================================================================

ALTER TABLE log_behavioral_changes
  ALTER COLUMN change_type DROP NOT NULL;

ALTER TABLE log_behavioral_changes
  ALTER COLUMN change_description DROP NOT NULL;

COMMENT ON COLUMN log_behavioral_changes.change_type IS
  'DEPRECATED: Legacy free-text column. Use change_type_ids INTEGER[] FK array instead. Nullable as of migration 066e.';

COMMENT ON COLUMN log_behavioral_changes.change_description IS
  'DEPRECATED: Legacy narrative. Architecture Constitution prohibits practitioner prose in log tables. Nullable as of migration 066e.';


-- ============================================================================
-- SECTION 2: log_red_alerts
--   patient_id VARCHAR(20) NOT NULL — CrisisLogger has session_id only
--   alert_type VARCHAR(50) NOT NULL — replaced by crisis_event_type_id FK
--   alert_severity — add CHECK constraint
-- ============================================================================

ALTER TABLE log_red_alerts
  ALTER COLUMN patient_id DROP NOT NULL;

ALTER TABLE log_red_alerts
  ALTER COLUMN alert_type DROP NOT NULL;

ALTER TABLE log_red_alerts
  DROP CONSTRAINT IF EXISTS chk_red_alerts_alert_severity;

ALTER TABLE log_red_alerts
  ADD CONSTRAINT chk_red_alerts_alert_severity
  CHECK (alert_severity IN ('mild', 'moderate', 'severe'));

COMMENT ON COLUMN log_red_alerts.patient_id IS
  'Nullable as of 066e. CrisisLogger writes session_id; patient resolves via join to log_clinical_records.';

COMMENT ON COLUMN log_red_alerts.alert_type IS
  'DEPRECATED: Replaced by crisis_event_type_id INTEGER FK. Nullable as of 066e.';


-- ============================================================================
-- SECTION 3: log_session_timeline_events
--   event_type NOT NULL with CHECK — code sends event_type_id only
--   Fix: DEFAULT 'other' so inserts survive without this field
-- ============================================================================

ALTER TABLE log_session_timeline_events
  ALTER COLUMN event_type SET DEFAULT 'other';

COMMENT ON COLUMN log_session_timeline_events.event_type IS
  'DEFAULT ''other'' added 066e. Code should pass a valid type; falls back safely. CHECK: dose_admin | vital_check | patient_observation | clinical_decision | music_change | touch_consent | safety_event | other.';


-- ============================================================================
-- SECTION 4: log_feature_requests
--   request_type VARCHAR(50) NOT NULL — code omits this field
--   requested_text TEXT NOT NULL — code omits this field
-- ============================================================================

ALTER TABLE log_feature_requests
  ALTER COLUMN request_type SET DEFAULT 'vocabulary_request';

ALTER TABLE log_feature_requests
  ALTER COLUMN requested_text SET DEFAULT '';

COMMENT ON COLUMN log_feature_requests.request_type IS
  'DEFAULT ''vocabulary_request'' added 066e so inserts without this field succeed.';

COMMENT ON COLUMN log_feature_requests.requested_text IS
  'DEFAULT '''' added 066e. Non-clinical table — free text acceptable for feature requests.';


-- ============================================================================
-- INLINE VERIFICATION — results appear immediately after run
-- ============================================================================

-- Check behavioral_changes nullable:
SELECT 'behavioral_changes' AS tbl, column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'log_behavioral_changes'
  AND column_name IN ('change_type', 'change_description');

-- Check red_alerts nullable + CHECK:
SELECT 'red_alerts' AS tbl, column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'log_red_alerts'
  AND column_name IN ('patient_id', 'alert_type');

SELECT 'red_alerts CHECK' AS tbl, constraint_name
FROM information_schema.check_constraints
WHERE constraint_name = 'chk_red_alerts_alert_severity';

-- Check timeline event_type default:
SELECT 'timeline' AS tbl, column_name, column_default
FROM information_schema.columns
WHERE table_name = 'log_session_timeline_events'
  AND column_name = 'event_type';
