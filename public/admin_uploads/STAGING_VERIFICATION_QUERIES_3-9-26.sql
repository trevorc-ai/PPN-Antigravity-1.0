-- =============================================================================
-- STAGING VERIFICATION QUERIES — Ghost Saves Audit (2026-03-09)
-- Run each block independently in the Supabase SQL Editor.
-- Replace placeholder UUIDs with real values from your staging data.
-- =============================================================================


-- ============================================================
-- 1. RLS — Confirm log_phase3_meq30 has RLS enabled + policies
-- ============================================================
-- Expected: rowsecurity = true
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'log_phase3_meq30';

-- Expected: 2 rows — SELECT and INSERT policies
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'log_phase3_meq30'
ORDER BY cmd;


-- ============================================================
-- 2. RLS — Audit ALL log_* tables for missing RLS
-- ============================================================
-- Expected: every log_* table should have rowsecurity = true.
-- Any row with rowsecurity = false is a gap.
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE 'log_%'
ORDER BY rowsecurity ASC, tablename ASC;


-- ============================================================
-- 3. BASELINE ASSESSMENTS — confirm pcl5_score is being written
-- ============================================================
-- Submit a Mental Health Screening form in staging, then run:
SELECT id, patient_uuid, site_id, phq9_score, gad7_score, ace_score,
       pcl5_score,  -- should NOT be null if pcl5 was entered
       created_by, created_at
FROM log_baseline_assessments
ORDER BY created_at DESC
LIMIT 5;


-- ============================================================
-- 4. SESSION VITALS — confirm consciousness_level_id resolves
-- ============================================================
-- Submit a Session Vitals form with LOC selected, then run:
SELECT sv.id, sv.session_id, sv.heart_rate, sv.consciousness_level_id,
       rcl.code  AS consciousness_code,
       rcl.label AS consciousness_label,
       sv.data_source_id,
       rds.code  AS data_source_code,
       sv.created_by, sv.recorded_at
FROM log_session_vitals sv
LEFT JOIN ref_consciousness_levels rcl ON rcl.id = sv.consciousness_level_id
LEFT JOIN ref_data_sources rds ON rds.data_source_id = sv.data_source_id
ORDER BY sv.recorded_at DESC
LIMIT 5;

-- ⚠️ If consciousness_code is NULL but a value was entered in the form,
-- the ref_consciousness_levels table may be missing the expected codes.
-- Check what codes exist:
SELECT id, code, label FROM ref_consciousness_levels ORDER BY id;
-- Expected codes: alert, verbal, pain, unresponsive


-- ============================================================
-- 5. SAFETY EVENTS — confirm rescue protocol writes here (not timeline only)
-- ============================================================
-- Trigger a Rescue Protocol form save in staging, then run:
SELECT se.id, se.session_id, se.site_id,
       rse.event_name,
       se.severity_grade_id_fk,
       se.ctcae_grade,
       se.is_resolved,
       se.logged_by_user_id,
       se.created_at
FROM log_safety_events se
LEFT JOIN ref_safety_events rse ON rse.safety_event_id = se.safety_event_type_id
ORDER BY se.created_at DESC
LIMIT 5;

-- Also verify the safety_event_type lookup resolves correctly:
SELECT safety_event_id, event_name, event_code
FROM ref_safety_events
WHERE lower(event_name) LIKE '%rescue%'
   OR lower(event_code) LIKE '%rescue%';


-- ============================================================
-- 6. MEQ-30 — confirm writes to log_phase3_meq30 AND denormalized score
-- ============================================================
-- Submit MEQ-30 form in staging, then run:
SELECT m.id, m.session_id, m.patient_uuid, m.meq30_score, m.created_at,
       lcr.meq30_score AS denormalized_score  -- should match m.meq30_score (clamped to 100)
FROM log_phase3_meq30 m
LEFT JOIN log_clinical_records lcr ON lcr.id = m.session_id
ORDER BY m.created_at DESC
LIMIT 5;

-- ⚠️ If log_phase3_meq30 is empty but the form was submitted,
-- check: was the patient UUID and session UUID correctly resolved?


-- ============================================================
-- 7. INTEGRATION SESSIONS — confirm attendance_status_id resolves
-- ============================================================
-- Submit a Structured Integration Session with an attendance status, then run:
SELECT ls.id, ls.patient_uuid, ls.session_date,
       ls.attendance_status_id,
       ras.code  AS attendance_code,
       ras.label AS attendance_label,
       ls.therapist_user_id, ls.created_at
FROM log_integration_sessions ls
LEFT JOIN ref_attendance_statuses ras ON ras.id = ls.attendance_status_id
ORDER BY ls.created_at DESC
LIMIT 5;

-- Check ref table seeded correctly:
SELECT id, code, label FROM ref_attendance_statuses ORDER BY id;


-- ============================================================
-- 8. LONGITUDINAL ASSESSMENTS — confirm cssrs_score + created_by
-- ============================================================
SELECT id, patient_uuid, session_id,
       phq9_score, gad7_score, cssrs_score,
       created_by, created_at
FROM log_longitudinal_assessments
ORDER BY created_at DESC
LIMIT 5;


-- ============================================================
-- 9. PHASE 1 SAFETY SCREEN — confirm createSafetyScreen() writes here
-- ============================================================
-- Trigger Structured Safety Check form save in staging, then run:
SELECT id, patient_uuid, session_id, site_id,
       contraindication_verdict_id,
       ekg_rhythm_id,
       concomitant_med_ids,
       created_at
FROM log_phase1_safety_screen
ORDER BY created_at DESC
LIMIT 5;


-- ============================================================
-- 10. REF TABLE SEEDING — quick audit of all FK ref tables used by the app
-- ============================================================
SELECT 'ref_consciousness_levels'  AS table_name, COUNT(*) AS row_count FROM ref_consciousness_levels
UNION ALL
SELECT 'ref_data_sources',                         COUNT(*) FROM ref_data_sources
UNION ALL
SELECT 'ref_attendance_statuses',                  COUNT(*) FROM ref_attendance_statuses
UNION ALL
SELECT 'ref_safety_events',                        COUNT(*) FROM ref_safety_events
UNION ALL
SELECT 'ref_severity_grade',                       COUNT(*) FROM ref_severity_grade
UNION ALL
SELECT 'ref_session_focus_areas',                  COUNT(*) FROM ref_session_focus_areas
UNION ALL
SELECT 'ref_homework_types',                       COUNT(*) FROM ref_homework_types
UNION ALL
SELECT 'ref_therapist_observations',               COUNT(*) FROM ref_therapist_observations
UNION ALL
SELECT 'ref_contraindication_verdicts',            COUNT(*) FROM ref_contraindication_verdicts
UNION ALL
SELECT 'ref_ekg_rhythms',                          COUNT(*) FROM ref_ekg_rhythms
ORDER BY row_count ASC;

-- ⚠️ Any table with row_count = 0 means the live ref lookup will return null.
-- Those need to be seeded before the corresponding form will write correctly.
