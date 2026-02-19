-- ============================================================================
-- Migration: 055_test_seed_data.sql
-- Purpose:   Populate test data to exercise ALL active components.
--
-- DESIGN RULES:
--   1. ZERO PHI: All patient IDs are synthetic (PT-A001, PT-B001, PT-C001).
--   2. IDEMPOTENT: Safe to re-run. ON CONFLICT DO NOTHING throughout.
--   3. SITE-AWARE: Links to real log_sites rows (Demo Site Alpha + Demo Site Beta).
--   4. Three patients, two sites:
--        PT-A001 → Demo Site Alpha (full arc, Phase 3 complete — tests all charts)
--        PT-B001 → Demo Site Alpha (Phase 2 active — tests session forms)
--        PT-C001 → Demo Site Beta  (Phase 1 only — tests baseline forms)
--   5. Temporal spread: PT-A001 longitudinal data spans 180 days (required
--      for SymptomDecayCurveChart to render a meaningful curve).
--
-- PREREQUISITES:
--   Step 1: You must be authenticated in Supabase.
--   Step 2: Run the auth.users query below, copy your UUID, and replace
--           'YOUR-USER-UUID-HERE' before executing the rest.
--
-- RECORD COUNT TARGET (see spec doc for rationale):
--   log_user_sites               1   (critical blocker fix)
--   log_user_profiles            1
--   log_clinical_records         3   (adds to existing 57)
--   log_baseline_assessments     3   (one per patient)
--   log_baseline_observations    9   (3 per patient)
--   log_consent                 12   (4 consent types × 3 patients)
--   log_session_vitals          12   (includes migration 054 new fields)
--   log_session_timeline_events  9   (3 per active session)
--   log_session_observations     6
--   log_safety_events            2
--   log_pulse_checks            15   (5 per patient — spans 5 weeks)
--   log_integration_sessions     6   (2 per patient)
--   log_behavioral_changes       6   (2 per patient, uses new structured cols)
--   log_longitudinal_assessments 8   (PT-A001: 6 points, PT-B001: 2 points)
--   TOTAL NEW ROWS:             93
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- STEP 1: Run this query first to get your user UUID
-- Copy the result before proceeding.
-- ──────────────────────────────────────────────────────────────────────────────
-- SELECT id, email FROM auth.users LIMIT 5;

-- ──────────────────────────────────────────────────────────────────────────────
-- STEP 2: Replace YOUR-USER-UUID-HERE below, then run the rest of this file.
-- ──────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
    v_user_uuid      UUID := 'YOUR-USER-UUID-HERE';  -- ← REPLACE THIS
    v_site_alpha     UUID;
    v_site_beta      UUID;
    v_session_a      UUID;  -- PT-A001 session (Phase 3 complete)
    v_session_b      UUID;  -- PT-B001 session (Phase 2 active)
    v_session_c      UUID;  -- PT-C001 session (Phase 1)
BEGIN

    -- ── Resolve site IDs ──────────────────────────────────────────────────────
    -- FIX 1: Actual site_name values in live log_sites are 'Demo Site Alpha' / 'Demo Site Beta'
    SELECT site_id INTO v_site_alpha FROM log_sites WHERE site_name = 'Demo Site Alpha' LIMIT 1;
    SELECT site_id INTO v_site_beta  FROM log_sites WHERE site_name = 'Demo Site Beta'  LIMIT 1;

    IF v_site_alpha IS NULL THEN RAISE EXCEPTION 'Demo Site Alpha not found in log_sites — check log_sites table'; END IF;
    IF v_site_beta  IS NULL THEN RAISE EXCEPTION 'Demo Site Beta not found in log_sites — check log_sites table';  END IF;

    -- ── 1. log_user_sites ─────────────────────────────────────────────────────
    -- CRITICAL BLOCKER FIX: links your user to Demo Site Alpha
    -- getCurrentSiteId() returns null without this → all form writes fail silently
    -- FIX 2: role TEXT NOT NULL must be provided (live schema requires it)
    INSERT INTO log_user_sites (user_id, site_id, role, is_active)
    VALUES (v_user_uuid, v_site_alpha, 'clinician', true)
    ON CONFLICT DO NOTHING;

    -- ── 2. log_user_profiles ──────────────────────────────────────────────────
    -- FIX 3: live table only has (id, user_id, created_at, role_id).
    -- display_name, role (text), site_id do NOT exist in this table.
    -- role_id=3 is the default (clinician) per ref_user_roles.
    INSERT INTO log_user_profiles (user_id, role_id)
    SELECT v_user_uuid, 3
    WHERE NOT EXISTS (SELECT 1 FROM log_user_profiles WHERE user_id = v_user_uuid);

    -- ── 3. log_clinical_records ───────────────────────────────────────────────
    -- Three test sessions — one per patient, across two sites
    -- Each gets a stable UUID so downstream tables can FK reference them reliably

    v_session_a := '11111111-1111-1111-1111-111111111111';
    v_session_b := '22222222-2222-2222-2222-222222222222';
    v_session_c := '33333333-3333-3333-3333-333333333333';

    -- FIX 4: Mapped to actual live log_clinical_records columns.
    --   patient_id → patient_link_code (VARCHAR NOT NULL)
    --   status     → does not exist   (removed)
    --   phase      → does not exist   (removed)
    --   Added: practitioner_id UUID NOT NULL, session_type VARCHAR NOT NULL
    INSERT INTO log_clinical_records
        (id, practitioner_id, patient_link_code, site_id, session_date, session_number, session_type)
    VALUES
      -- PT-A001: dosing session (180 days ago) — drives SymptomDecayCurveChart
      (v_session_a, v_user_uuid, 'PT-A001', v_site_alpha,
       CURRENT_DATE - INTERVAL '180 days', 1, 'Dosing Session'),

      -- PT-B001: dosing session (14 days ago) — drives session form tests
      (v_session_b, v_user_uuid, 'PT-B001', v_site_alpha,
       CURRENT_DATE - INTERVAL '14 days', 1, 'Dosing Session'),

      -- PT-C001: preparation session (today) — drives baseline form tests
      (v_session_c, v_user_uuid, 'PT-C001', v_site_beta,
       CURRENT_DATE, 1, 'Preparation')
    ON CONFLICT (id) DO NOTHING;

    -- ── 4. log_baseline_assessments ───────────────────────────────────────────
    -- One per patient. Needed by:
    --   • AugmentedIntelligencePanel (calculateIntegrationNeeds)
    --   • BaselineMetricsCard
    --   • PredictedOutcomesCard
    -- FIX 5: assessment_date is TIMESTAMP NOT NULL (not TEXT).
    -- Removed ::text cast — values are DATE which implicitly casts to TIMESTAMP.
    INSERT INTO log_baseline_assessments
        (patient_id, site_id, expectancy_scale, ace_score, gad7_score, phq9_score, assessment_date)
    VALUES
      -- PT-A001: High risk profile → riskLevel='critical', sessionCount=16
      ('PT-A001', v_site_alpha, 22, 8, 18, 22,
       (CURRENT_DATE - INTERVAL '180 days')),

      -- PT-B001: Moderate risk → riskLevel='moderate', sessionCount=8
      ('PT-B001', v_site_alpha, 58, 4, 11, 13,
       (CURRENT_DATE - INTERVAL '14 days')),

      -- PT-C001: Low risk → riskLevel='low', sessionCount=4
      ('PT-C001', v_site_beta, 78, 1, 5, 6,
       CURRENT_DATE)
    ON CONFLICT DO NOTHING;

    -- ── 5. log_baseline_observations ──────────────────────────────────────────
    -- 3 per patient. Linked to baseline assessments.
    -- Exercises BaselineObservationsForm and the observation linking logic.
    INSERT INTO log_baseline_observations
        (baseline_assessment_id, observation_id)
    SELECT ba.baseline_assessment_id, obs.observation_id
    FROM log_baseline_assessments ba
    CROSS JOIN (VALUES (1), (2), (3)) AS obs(observation_id)
    WHERE ba.patient_id IN ('PT-A001', 'PT-B001', 'PT-C001')
    ON CONFLICT DO NOTHING;

    -- ── 6. log_consent ────────────────────────────────────────────────────────
    -- 4 consent types × 3 patients = 12 rows
    -- Exercises ConsentForm multi-type insert pattern (createConsent in arcOfCareApi)
    -- FIX 6: log_consent.id is BIGINT NOT NULL with no sequence/default.
    -- Use ROW_NUMBER() offset from current MAX(id) to generate safe, non-conflicting IDs.
    INSERT INTO log_consent (id, site_id, type, verified, verified_at)
    SELECT
        (SELECT COALESCE(MAX(id), 0) FROM log_consent) + ROW_NUMBER() OVER (),
        site_id, consent_type, true, NOW() - INTERVAL '1 hour'
    FROM (
        SELECT v_site_alpha AS site_id, 'informed_consent'       AS consent_type UNION ALL
        SELECT v_site_alpha,            'hipaa_authorization'               UNION ALL
        SELECT v_site_alpha,            'research_participation'            UNION ALL
        SELECT v_site_alpha,            'photography_recording'             UNION ALL
        SELECT v_site_alpha,            'informed_consent'                  UNION ALL
        SELECT v_site_alpha,            'hipaa_authorization'               UNION ALL
        SELECT v_site_alpha,            'research_participation'            UNION ALL
        SELECT v_site_alpha,            'photography_recording'             UNION ALL
        SELECT v_site_beta,             'informed_consent'                  UNION ALL
        SELECT v_site_beta,             'hipaa_authorization'               UNION ALL
        SELECT v_site_beta,             'research_participation'            UNION ALL
        SELECT v_site_beta,             'photography_recording'
    ) AS consents;

    -- ── 7. log_session_vitals ─────────────────────────────────────────────────
    -- 4 readings per active session (PT-A001 and PT-B001 = 8 rows)
    -- + 4 readings testing migration 054 NEW columns (respiratory_rate, temperature,
    --   diaphoresis_score, level_of_consciousness)
    --
    -- This exercises:
    --   • SessionVitalsForm (including WO-085 new fields)
    --   • getSessionVitals() API
    --   • All 4 new migration 054 columns
    INSERT INTO log_session_vitals
        (session_id, recorded_at, heart_rate, hrv, bp_systolic, bp_diastolic,
         oxygen_saturation, respiratory_rate, temperature, diaphoresis_score,
         level_of_consciousness, source)
    VALUES
      -- PT-A001: 4 readings over time (simulates monitoring arc)
      (v_session_a, NOW() - INTERVAL '3 hours',   82, 45, 118, 76, 98, 16, 98.4, 0, 'alert',       'manual'),
      (v_session_a, NOW() - INTERVAL '2 hours',   95, 38, 125, 82, 97, 18, 98.8, 1, 'alert',       'manual'),
      (v_session_a, NOW() - INTERVAL '1 hour',   110, 28, 132, 88, 96, 20, 99.1, 2, 'verbal',      'manual'),
      (v_session_a, NOW() - INTERVAL '30 minutes', 89, 41, 120, 78, 98, 15, 98.6, 0, 'alert',       'manual'),

      -- PT-B001: 4 readings — normal range (tests form with all new fields populated)
      (v_session_b, NOW() - INTERVAL '90 minutes', 74, 52, 112, 72, 99, 14, 98.2, 0, 'alert',       'device'),
      (v_session_b, NOW() - INTERVAL '60 minutes', 78, 48, 116, 74, 99, 15, 98.3, 0, 'alert',       'device'),
      (v_session_b, NOW() - INTERVAL '45 minutes', 81, 44, 118, 76, 98, 16, 98.5, 0, 'alert',       'device'),
      (v_session_b, NOW() - INTERVAL '20 minutes', 76, 50, 114, 73, 99, 14, 98.2, 0, 'alert',       'device'),

      -- PT-C001: 4 readings at rest (Phase 1 vitals baseline)
      (v_session_c, NOW() - INTERVAL '30 minutes', 68, 58, 110, 70, 99, 13, 97.9, 0, 'alert',       'manual'),
      (v_session_c, NOW() - INTERVAL '20 minutes', 70, 55, 112, 71, 99, 14, 98.0, 0, 'alert',       'manual'),
      (v_session_c, NOW() - INTERVAL '10 minutes', 72, 53, 111, 70, 99, 13, 98.1, 0, 'alert',       'manual'),
      (v_session_c, NOW(),                          69, 57, 110, 70, 99, 14, 97.8, 0, 'alert',       'manual')
    ON CONFLICT DO NOTHING;

    -- ── 8. log_session_timeline_events ────────────────────────────────────────
    -- 3 per active session × 3 sessions = 9 rows
    -- Tests the NEW log_session_timeline_events table (migration 054 Part 6)
    --   + SessionTimelineForm + createTimelineEvent() API
    INSERT INTO log_session_timeline_events
        (session_id, event_timestamp, event_type, performed_by, metadata)
    VALUES
      -- PT-A001 timeline
      (v_session_a, NOW() - INTERVAL '3 hours',    'dose_admin',         v_user_uuid,
       '{"dose_mg": 25, "substance": "psilocybin"}'::jsonb),
      (v_session_a, NOW() - INTERVAL '2 hours',    'patient_observation', v_user_uuid,
       '{"note_code": "peak_experience_onset"}'::jsonb),
      (v_session_a, NOW() - INTERVAL '30 minutes', 'vital_check',         v_user_uuid,
       '{"heart_rate": 89, "blood_pressure": "120/78"}'::jsonb),

      -- PT-B001 timeline
      (v_session_b, NOW() - INTERVAL '90 minutes', 'dose_admin',          v_user_uuid,
       '{"dose_mg": 20, "substance": "psilocybin"}'::jsonb),
      (v_session_b, NOW() - INTERVAL '60 minutes', 'vital_check',         v_user_uuid,
       '{"heart_rate": 78, "spo2": 99}'::jsonb),
      (v_session_b, NOW() - INTERVAL '30 minutes', 'clinical_decision',   v_user_uuid,
       '{"decision": "continue_monitoring", "rationale": "stable_vitals"}'::jsonb),

      -- PT-C001 timeline (Phase 1 — preparation events)
      (v_session_c, NOW() - INTERVAL '30 minutes', 'patient_observation', v_user_uuid,
       '{"note_code": "pre_session_check_in"}'::jsonb),
      (v_session_c, NOW() - INTERVAL '15 minutes', 'touch_consent',       v_user_uuid,
       '{"consent_given": true}'::jsonb),
      (v_session_c, NOW(),                          'vital_check',         v_user_uuid,
       '{"heart_rate": 69, "oxygen_saturation": 99}'::jsonb)
    ON CONFLICT DO NOTHING;

    -- ── 9. log_session_observations ───────────────────────────────────────────
    -- 2 per session × 3 sessions = 6 rows
    -- Tests SessionObservationsForm + the observation_id FK pattern
    INSERT INTO log_session_observations (session_id, observation_id)
    VALUES
      (v_session_a, 1), (v_session_a, 3),
      (v_session_b, 2), (v_session_b, 4),
      (v_session_c, 1), (v_session_c, 2)
    ON CONFLICT DO NOTHING;

    -- ── 10. log_safety_events ─────────────────────────────────────────────────
    -- 1 minor AE on PT-A001's high-risk session
    -- 1 rescue protocol event on PT-B001 (tests rescue form path)
    -- Tests SafetyAndAdverseEventForm + createSessionEvent() with ae_id + event_type
    INSERT INTO log_safety_events
        (ae_id, session_id, event_type, severity_grade_id, is_resolved)
    VALUES
      (gen_random_uuid()::text, v_session_a, 'adverse_event', '1', true),
      (gen_random_uuid()::text, v_session_b, 'rescue',        '2', false)
    ON CONFLICT DO NOTHING;

    -- ── 11. log_pulse_checks ──────────────────────────────────────────────────
    -- 5 per patient × 3 patients = 15 rows
    -- Temporal spread: weekly over 5 weeks for PT-A001/B001, daily for PT-C001
    -- Tests DailyPulseCheckForm + createPulseCheck() API
    -- Note: check_date now has DEFAULT CURRENT_DATE (migration 054 fix)
    INSERT INTO log_pulse_checks
        (patient_id, session_id, check_date, connection_level, sleep_quality, mood_level, anxiety_level)
    VALUES
      -- PT-A001: 5 weekly readings showing improvement arc (drives trend display)
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '35 days', 2, 2, 2, 4),
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '28 days', 3, 3, 3, 3),
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '21 days', 3, 4, 3, 3),
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '14 days', 4, 4, 4, 2),
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '7 days',  5, 5, 5, 1),

      -- PT-B001: 5 readings — slight fluctuation (tests non-linear progress)
      ('PT-B001', v_session_b, CURRENT_DATE - INTERVAL '28 days', 3, 2, 2, 4),
      ('PT-B001', v_session_b, CURRENT_DATE - INTERVAL '21 days', 3, 3, 3, 3),
      ('PT-B001', v_session_b, CURRENT_DATE - INTERVAL '14 days', 2, 3, 2, 4),
      ('PT-B001', v_session_b, CURRENT_DATE - INTERVAL '7 days',  4, 4, 3, 3),
      ('PT-B001', v_session_b, CURRENT_DATE,                       4, 4, 4, 2),

      -- PT-C001: 5 readings — just starting (flat baseline)
      ('PT-C001', v_session_c, CURRENT_DATE - INTERVAL '4 days',  3, 3, 3, 3),
      ('PT-C001', v_session_c, CURRENT_DATE - INTERVAL '3 days',  3, 3, 3, 3),
      ('PT-C001', v_session_c, CURRENT_DATE - INTERVAL '2 days',  3, 2, 3, 3),
      ('PT-C001', v_session_c, CURRENT_DATE - INTERVAL '1 day',   3, 3, 3, 2),
      ('PT-C001', v_session_c, CURRENT_DATE,                       3, 3, 3, 3)
    ON CONFLICT DO NOTHING;

    -- ── 12. log_integration_sessions ─────────────────────────────────────────
    -- 2 per patient × 3 = 6 rows
    -- Uses ALL migration 054 new columns (ratings + FK arrays)
    -- Tests StructuredIntegrationSessionForm + createIntegrationSession() API
    INSERT INTO log_integration_sessions
        (patient_id, dosing_session_id, integration_session_number, session_date,
         session_duration_minutes, attended,
         insight_integration_rating, emotional_processing_rating,
         behavioral_application_rating, engagement_level_rating,
         session_focus_ids, homework_assigned_ids, therapist_observation_ids)
    VALUES
      -- PT-A001: Session 1 (3 months ago)
      ('PT-A001', v_session_a, 1, CURRENT_DATE - INTERVAL '90 days',
       60, true, 4, 3, 3, 4, ARRAY[1,3], ARRAY[1,4], ARRAY[2,6]),

      -- PT-A001: Session 2 (1 month ago)
      ('PT-A001', v_session_a, 2, CURRENT_DATE - INTERVAL '30 days',
       90, true, 5, 4, 4, 5, ARRAY[2,5], ARRAY[2,3], ARRAY[1,8]),

      -- PT-B001: Session 1 (2 weeks ago)
      ('PT-B001', v_session_b, 1, CURRENT_DATE - INTERVAL '14 days',
       60, true, 3, 3, 2, 4, ARRAY[1,2], ARRAY[1,5], ARRAY[3,4]),

      -- PT-B001: Session 2 (1 week ago)
      ('PT-B001', v_session_b, 2, CURRENT_DATE - INTERVAL '7 days',
       75, true, 3, 4, 3, 4, ARRAY[3,4], ARRAY[2,6], ARRAY[5,7]),

      -- PT-C001: Session 1 (today — first integration)
      ('PT-C001', v_session_c, 1, CURRENT_DATE,
       45, true, 2, 2, 2, 3, ARRAY[1], ARRAY[1,2], ARRAY[1]),

      -- PT-C001: Session 2 (scheduled — attendance unknown)
      ('PT-C001', v_session_c, 2, CURRENT_DATE + INTERVAL '7 days',
       NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
    ON CONFLICT DO NOTHING;

    -- ── 13. log_behavioral_changes ────────────────────────────────────────────
    -- 2 per patient × 3 = 6 rows
    -- Uses NEW migration 054 structured columns:
    --   change_category, change_type_ids[], impact_on_wellbeing,
    --   confidence_sustaining, related_to_dosing
    -- Also satisfies legacy NOT NULL columns (change_type, change_description, is_positive)
    -- Tests BehavioralChangeTrackerForm + createBehavioralChange() API
    INSERT INTO log_behavioral_changes
        (patient_id, session_id, change_date,
         change_category, change_type_ids, impact_on_wellbeing,
         confidence_sustaining, related_to_dosing,
         change_type, change_description, is_positive)
    VALUES
      -- PT-A001: Two significant changes (shows full improvement)
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '60 days',
       'substance_use', ARRAY[1, 2], 'highly_positive',
       5, 'direct_insight',
       'structured', '[1,2]', true),

      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '30 days',
       'relationship', ARRAY[7], 'moderately_positive',
       4, 'indirect_influence',
       'structured', '[7]', true),

      -- PT-B001: Two changes — one positive, one neutral
      ('PT-B001', v_session_b, CURRENT_DATE - INTERVAL '10 days',
       'exercise', ARRAY[5], 'moderately_positive',
       3, 'indirect_influence',
       'structured', '[5]', true),

      ('PT-B001', v_session_b, CURRENT_DATE - INTERVAL '3 days',
       'self_care', ARRAY[8, 11], 'neutral',
       3, 'unrelated',
       'structured', '[8,11]', true),

      -- PT-C001: Early changes (baseline tracking)
      ('PT-C001', v_session_c, CURRENT_DATE - INTERVAL '2 days',
       'self_care', ARRAY[10], 'moderately_positive',
       2, 'unrelated',
       'structured', '[10]', true),

      ('PT-C001', v_session_c, CURRENT_DATE,
       'exercise', ARRAY[5], 'moderately_positive',
       3, 'unrelated',
       'structured', '[5]', true)
    ON CONFLICT DO NOTHING;

    -- ── 14. log_longitudinal_assessments ─────────────────────────────────────
    -- PT-A001: 6 data points over 180 days → renders SymptomDecayCurveChart curve
    -- PT-B001: 2 data points (early tracking)
    -- PT-C001: 0 — too new
    --
    -- The SymptomDecayCurveChart specifically queries phq9_score + gad7_score
    -- over time ordered by assessment_date ASC. Minimum 4 points for a curve.
    -- PT-A001's PHQ-9 arc: 22 → 18 → 14 → 10 → 7 → 4 (clinical improvement arc)
    INSERT INTO log_longitudinal_assessments
        (patient_id, session_id, assessment_date, days_post_session,
         phq9_score, gad7_score, whoqol_score)
    VALUES
      -- PT-A001: Full 180-day arc (drives SymptomDecayCurveChart)
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '180 days',   0,  22, 18, 35),
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '150 days',  30,  18, 15, 42),
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '120 days',  60,  14, 11, 51),
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '90 days',   90,  10,  8, 59),
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '60 days',  120,   7,  6, 65),
      ('PT-A001', v_session_a, CURRENT_DATE - INTERVAL '30 days',  150,   4,  4, 72),

      -- PT-B001: 2 points (trend just becoming visible)
      ('PT-B001', v_session_b, CURRENT_DATE - INTERVAL '14 days',    0,  13, 11, 48),
      ('PT-B001', v_session_b, CURRENT_DATE,                         14,  10,  9, 54)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Seed data inserted successfully.';
    RAISE NOTICE 'Patients:  PT-A001 (dosing), PT-B001 (dosing), PT-C001 (preparation)';
    RAISE NOTICE 'Sites:     Demo Site Alpha, Demo Site Beta';
    RAISE NOTICE 'User site: % linked to Demo Site Alpha', v_user_uuid;
    RAISE NOTICE 'New rows: ~93 across 14 tables';
    RAISE NOTICE '==============================================';

END $$;

-- ──────────────────────────────────────────────────────────────────────────────
-- VERIFY: Run this after the seed to confirm record counts
-- ──────────────────────────────────────────────────────────────────────────────
SELECT
  'log_clinical_records'          AS table_name, COUNT(*) FROM log_clinical_records
UNION ALL SELECT 'log_baseline_assessments',     COUNT(*) FROM log_baseline_assessments
UNION ALL SELECT 'log_baseline_observations',    COUNT(*) FROM log_baseline_observations
UNION ALL SELECT 'log_consent',                  COUNT(*) FROM log_consent
UNION ALL SELECT 'log_session_vitals',           COUNT(*) FROM log_session_vitals
UNION ALL SELECT 'log_session_timeline_events',  COUNT(*) FROM log_session_timeline_events
UNION ALL SELECT 'log_session_observations',     COUNT(*) FROM log_session_observations
UNION ALL SELECT 'log_safety_events',            COUNT(*) FROM log_safety_events
UNION ALL SELECT 'log_pulse_checks',             COUNT(*) FROM log_pulse_checks
UNION ALL SELECT 'log_integration_sessions',     COUNT(*) FROM log_integration_sessions
UNION ALL SELECT 'log_behavioral_changes',       COUNT(*) FROM log_behavioral_changes
UNION ALL SELECT 'log_longitudinal_assessments', COUNT(*) FROM log_longitudinal_assessments
UNION ALL SELECT 'log_user_sites',               COUNT(*) FROM log_user_sites
UNION ALL SELECT 'log_user_profiles',            COUNT(*) FROM log_user_profiles
UNION ALL SELECT 'ref_session_focus_areas',      COUNT(*) FROM ref_session_focus_areas
UNION ALL SELECT 'ref_homework_types',           COUNT(*) FROM ref_homework_types
UNION ALL SELECT 'ref_therapist_observations',   COUNT(*) FROM ref_therapist_observations
UNION ALL SELECT 'ref_behavioral_change_types',  COUNT(*) FROM ref_behavioral_change_types
ORDER BY table_name;
