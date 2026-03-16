-- PHASE 3 / IN-CHAIR CRITICAL INDEXES
-- PPN Portal · Created 2026-03-16
--
-- This migration is intentionally narrow:
-- - Only covers Phase 2/3 outcome, safety, and dosing paths that power
--   Wellness Journey + Integration dashboards.
-- - Uses CREATE INDEX IF NOT EXISTS to be idempotent in dev/staging/prod.
-- - Matches current query patterns in usePhase3Data.ts and related flows.
--
-- NOTE: Run this in a low-traffic window in production. All indexes are
-- standard btree; no column type changes are performed.

--------------------------------------------------------------------------------
-- 1. Longitudinal outcomes (Phase 3)
--------------------------------------------------------------------------------

-- Per-session PHQ-9 / GAD-7 trajectory (Phase 3 Integration analytics)
CREATE INDEX IF NOT EXISTS idx_longitudinal_session_date
    ON log_longitudinal_assessments (session_id, assessment_date);

-- Patient-centric longitudinal view (ProtocolDetail, cross-session analytics)
CREATE INDEX IF NOT EXISTS idx_longitudinal_patient_date
    ON log_longitudinal_assessments (patient_uuid, assessment_date);

-- Baseline outcomes used as Phase 3 reference point
CREATE INDEX IF NOT EXISTS idx_baseline_patient_created
    ON log_baseline_assessments (patient_uuid, created_at DESC);

--------------------------------------------------------------------------------
-- 2. Daily Pulse (Phase 3 integration telemetry)
--------------------------------------------------------------------------------

-- Session-centric 7-day trend and compliance
CREATE INDEX IF NOT EXISTS idx_pulse_session_created
    ON log_pulse_checks (session_id, created_at);

-- Patient-centric pulse history (future ProtocolDetail / benchmarking)
CREATE INDEX IF NOT EXISTS idx_pulse_patient_created
    ON log_pulse_checks (patient_uuid, created_at);

--------------------------------------------------------------------------------
-- 3. Integration sessions & behavioral change
--------------------------------------------------------------------------------

-- Per-dosing-session integration roll-up (sessions attended vs scheduled)
CREATE INDEX IF NOT EXISTS idx_integration_dosing_attendance
    ON log_integration_sessions (dosing_session_id, attendance_status_id);

-- Patient-centric integration history over time
CREATE INDEX IF NOT EXISTS idx_integration_patient_date
    ON log_integration_sessions (patient_uuid, session_date);

-- Behavioral change tracker — used by Phase 3 analytics and reports
CREATE INDEX IF NOT EXISTS idx_behavior_patient_date
    ON log_behavioral_changes (patient_uuid, change_date);

--------------------------------------------------------------------------------
-- 4. Vitals & clinical timeline (Phase 2/3 safety + PDF exports)
--------------------------------------------------------------------------------

-- Live vitals charting for a dosing session
CREATE INDEX IF NOT EXISTS idx_vitals_session_recorded
    ON log_session_vitals (session_id, recorded_at);

-- Clinical event ledger for dosing/integration timeline
CREATE INDEX IF NOT EXISTS idx_timeline_session_timestamp
    ON log_session_timeline_events (session_id, event_timestamp);

--------------------------------------------------------------------------------
-- 5. Dosing events & clinical records (Protocol / substance context)
--------------------------------------------------------------------------------

-- Per-session dosing events (used for Phase 3 + ProtocolDetail context)
CREATE INDEX IF NOT EXISTS idx_dose_session_time
    ON log_dose_events (session_id, administered_at);

-- Site-scoped session history (RLS + multi-tenant isolation)
CREATE INDEX IF NOT EXISTS idx_clinical_records_site_created
    ON log_clinical_records (site_id, created_at);

--------------------------------------------------------------------------------
-- 6. RLS alignment checklist (manual verification)
--------------------------------------------------------------------------------

-- For each table below, ensure that EVERY column referenced in RLS USING /
-- WITH CHECK predicates is indexed. This file does not alter policies; it
-- documents the minimum index set expected for good performance.
--
-- Tables:
--   log_longitudinal_assessments  (patient_uuid, site_id?, created_by?)
--   log_pulse_checks              (patient_uuid, site_id?, created_by?)
--   log_integration_sessions      (patient_uuid, dosing_session_id, site_id?)
--   log_behavioral_changes        (patient_uuid, session_id, site_id?)
--   log_session_vitals            (session_id, site_id?)
--   log_session_timeline_events   (session_id, site_id?)
--   log_baseline_assessments      (patient_uuid, site_id?)
--   log_clinical_records          (site_id, patient_uuid, created_by?)
--
-- Recommended RLS pattern (example):
--   USING (site_id = (auth.jwt() ->> 'site_id')::uuid)
--   WITH CHECK (site_id = (auth.jwt() ->> 'site_id')::uuid)
--
-- Before enabling or tightening these policies in production, confirm:
--   - An index exists on every column used in the policy expressions.
--   - JWT claims include the fields referenced by the policies (e.g. site_id).

