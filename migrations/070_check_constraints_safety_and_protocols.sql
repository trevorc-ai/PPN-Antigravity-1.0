-- ============================================================================
-- Migration: 070_check_constraints_safety_and_protocols.sql
-- Date: 2026-02-25
-- Purpose: Add CHECK constraints to log_safety_events.event_type and
--          log_protocols.status — two columns with no data and no constraint.
--
-- PRE-FLIGHT (confirmed 2026-02-25):
--   log_safety_events.event_type  — all NULL, zero rows to violate
--   log_protocols.status          — all NULL or 'draft' (default), zero violating rows
--
-- SOURCE EVIDENCE:
--   log_safety_events.event_type values from SafetyAndAdverseEventForm.tsx EVENT_TYPES[]
--   + 'rescue' from WellnessFormRouter.tsx rescue protocol handler
--
--   log_protocols.status default = 'draft' (from live schema CSV)
--   Valid states: draft → pending_review → active → archived
-- ============================================================================


-- ============================================================================
-- SECTION 1: log_safety_events.event_type CHECK
-- Values sourced from SafetyAndAdverseEventForm.tsx EVENT_TYPES constant
-- ============================================================================

ALTER TABLE log_safety_events
  DROP CONSTRAINT IF EXISTS chk_safety_events_event_type;

ALTER TABLE log_safety_events
  ADD CONSTRAINT chk_safety_events_event_type
  CHECK (
    event_type IS NULL OR event_type IN (
      'Nausea / Vomiting',
      'Panic Attack',
      'Hypertension',
      'Tachycardia',
      'Dizziness / Syncope',
      'Severe Anxiety',
      'Psychotic Episode',
      'Cardiac Event',
      'Respiratory Distress',
      'Headache',
      'Other',
      'rescue'
    )
  );

COMMENT ON COLUMN log_safety_events.event_type IS
  'CHECK constraint added migration 070. Values match SafetyAndAdverseEventForm EVENT_TYPES + rescue. Note: values are display labels, not codes — tech debt for future ref table migration.';


-- ============================================================================
-- SECTION 2: log_protocols.status CHECK
-- Valid lifecycle: draft → pending_review → active → archived
-- ============================================================================

ALTER TABLE log_protocols
  DROP CONSTRAINT IF EXISTS chk_protocols_status;

ALTER TABLE log_protocols
  ADD CONSTRAINT chk_protocols_status
  CHECK (status IS NULL OR status IN ('draft', 'pending_review', 'active', 'archived'));

COMMENT ON COLUMN log_protocols.status IS
  'CHECK: draft | pending_review | active | archived. Default draft. Added migration 070.';


-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Confirm both CHECK constraints exist:
-- SELECT constraint_name FROM information_schema.check_constraints
-- WHERE constraint_name IN ('chk_safety_events_event_type', 'chk_protocols_status');
