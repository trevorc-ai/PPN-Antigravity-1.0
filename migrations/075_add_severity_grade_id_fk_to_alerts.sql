-- ============================================================================
-- Migration: 075_add_severity_grade_id_fk_to_alerts.sql
-- Date: 2026-02-25
-- Purpose: Add severity_grade_id FK to log_red_alerts and log_adverse_events.
--
-- Context (WO-420 Phase 2 — Final 2%):
--   Both tables write alert_severity as 'mild'|'moderate'|'severe' TEXT string.
--   ref_severity_grade has these as integer PKs (1=Mild, 2=Moderate, 3=Severe).
--   log_safety_events already has severity_grade_id_fk ✅ (migration 066b/c).
--   This migration brings the two remaining alert tables into compliance.
--
-- ref_severity_grade mapping (confirmed from migration 003):
--   severity_grade_id = 1 → Grade 1 - Mild
--   severity_grade_id = 2 → Grade 2 - Moderate
--   severity_grade_id = 3 → Grade 3 - Severe
--
-- PRE-FLIGHT (run before this migration):
--   1. Confirm PK name and data in ref_severity_grade:
--      SELECT severity_grade_id, grade_label
--      FROM ref_severity_grade ORDER BY severity_grade_id;
--      → Expect: 1=Mild, 2=Moderate, 3=Severe, 4=Life Threatening, 5=Death
--
--   2. Confirm columns don't already exist:
--      SELECT column_name FROM information_schema.columns
--      WHERE table_schema = 'public'
--      AND table_name IN ('log_red_alerts', 'log_adverse_events')
--      AND column_name = 'severity_grade_id';
--      → Expect: 0 rows
--
-- ONE CONCERN PER FILE (INSPECTOR rule):
--   This file ONLY adds FK columns. Code changes are in CrisisLogger.tsx
--   and AdverseEventLogger.tsx. alert_severity TEXT retained (additive-only).
-- ============================================================================

-- Step 1: Add severity_grade_id FK to log_red_alerts
ALTER TABLE log_red_alerts
  ADD COLUMN IF NOT EXISTS severity_grade_id BIGINT
    REFERENCES ref_severity_grade(severity_grade_id)
    ON DELETE SET NULL;

COMMENT ON COLUMN log_red_alerts.severity_grade_id IS
  'FK → ref_severity_grade(severity_grade_id). Replaces alert_severity TEXT CHECK.
   1=Mild, 2=Moderate, 3=Severe. Added migration 075. alert_severity TEXT retained
   per additive-only rule — deprecated, do not write new values to alert_severity.';

COMMENT ON COLUMN log_red_alerts.alert_severity IS
  'DEPRECATED: CHECK-constrained TEXT. Use severity_grade_id FK instead.
   Retained per additive-only rule. Deprecation added migration 075.';

-- Step 2: Add severity_grade_id FK to log_adverse_events
ALTER TABLE log_adverse_events
  ADD COLUMN IF NOT EXISTS severity_grade_id BIGINT
    REFERENCES ref_severity_grade(severity_grade_id)
    ON DELETE SET NULL;

COMMENT ON COLUMN log_adverse_events.severity_grade_id IS
  'FK → ref_severity_grade(severity_grade_id). Replaces alert_severity TEXT CHECK.
   1=Mild, 2=Moderate, 3=Severe. Added migration 075. alert_severity TEXT retained
   per additive-only rule — deprecated, do not write new values to alert_severity.';

COMMENT ON COLUMN log_adverse_events.alert_severity IS
  'DEPRECATED: CHECK-constrained TEXT. Use severity_grade_id FK instead.
   Retained per additive-only rule. Deprecation added migration 075.';

-- Step 3: Indexes for FK performance
CREATE INDEX IF NOT EXISTS idx_log_red_alerts_severity_grade_id
  ON log_red_alerts(severity_grade_id);

CREATE INDEX IF NOT EXISTS idx_log_adverse_events_severity_grade_id
  ON log_adverse_events(severity_grade_id);

-- ============================================================================
-- VERIFICATION — run after execution:
-- ============================================================================
-- SELECT table_name, column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
-- AND table_name IN ('log_red_alerts', 'log_adverse_events')
-- AND column_name = 'severity_grade_id'
-- ORDER BY table_name;
-- → Expect: 2 rows, both bigint
