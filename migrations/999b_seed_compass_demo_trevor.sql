-- ============================================================================
-- WO-570: Integration Compass PERSONAL Demo Seed — trevorcalton@gmail.com
-- Idempotent — safe to re-run. Uses ON CONFLICT DO NOTHING.
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- After running, your demo link is:
--   http://localhost:5173/#/patient-report?sessionId=00000000-0570-de00-0000-aa0000000001&demo=1
--
-- Or on production:
--   https://ppnportal.net/#/patient-report?sessionId=00000000-0570-de00-0000-aa0000000001&demo=1
-- ============================================================================

DO $$
DECLARE
  v_session_uuid    uuid := '00000000-0570-de00-0000-aa0000000001';
  v_patient_uuid    uuid := '00000000-0570-de00-0000-aa0000000002';
  v_practitioner_id uuid;
  v_substance_id    uuid;
  v_session_date    date        := CURRENT_DATE - INTERVAL '10 days';
  v_session_ts      timestamptz := NOW() - INTERVAL '10 days 9 hours';
BEGIN

  -- ── 1. Resolve trevor's practitioner UUID from auth.users ────────────────────
  SELECT id INTO v_practitioner_id
  FROM auth.users
  WHERE email = 'trevorcalton@gmail.com'
  LIMIT 1;

  IF v_practitioner_id IS NULL THEN
    RAISE NOTICE 'trevorcalton@gmail.com not found in auth.users. Using placeholder UUID.';
    v_practitioner_id := '00000000-0570-de00-0000-aa0000000003';
  ELSE
    RAISE NOTICE 'Found practitioner: %', v_practitioner_id;
  END IF;

  -- ── 2. Resolve psilocybin substance ID ──────────────────────────────────────
  SELECT id INTO v_substance_id
  FROM ref_substances
  WHERE LOWER(name) LIKE '%psilocybin%'
  LIMIT 1;

  IF v_substance_id IS NULL THEN
    v_substance_id := '00000000-0570-de00-0000-aa0000000010';
    INSERT INTO ref_substances (id, name, category, status)
    VALUES (v_substance_id, 'Psilocybin', 'classical_psychedelic', 'active')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- ── 3. Clinical record ───────────────────────────────────────────────────────
  INSERT INTO log_clinical_records (
    id, patient_uuid, practitioner_uuid,
    session_date, session_type, status, created_at
  )
  VALUES (
    v_session_uuid, v_patient_uuid, v_practitioner_id,
    v_session_date, 'dosing', 'completed', v_session_ts
  )
  ON CONFLICT (id) DO NOTHING;

  -- ── 4. Baseline assessment (day -7) ─────────────────────────────────────────
  INSERT INTO log_baseline_assessments (
    session_id, patient_uuid, phq9_score, gad7_score, created_at
  )
  VALUES (
    v_session_uuid, v_patient_uuid, 17, 13,
    v_session_ts - INTERVAL '7 days'
  )
  ON CONFLICT DO NOTHING;

  -- ── 5. Dose event — psilocybin 25mg ─────────────────────────────────────────
  INSERT INTO log_dose_events (
    session_id, substance_id, dose_mg, dose_mg_per_kg, occurred_at
  )
  VALUES (
    v_session_uuid, v_substance_id, 25.0, 0.33,
    v_session_ts
  )
  ON CONFLICT DO NOTHING;

  -- ── 6. Timeline events (12 events across the session) ───────────────────────
  INSERT INTO log_session_timeline_events
    (session_id, occurred_at, event_type, label, intensity)
  VALUES
    (v_session_uuid, v_session_ts + INTERVAL '25m',  'feeling',       'Nervous energy',    4),
    (v_session_uuid, v_session_ts + INTERVAL '55m',  'sensory',       'Visual static',     5),
    (v_session_uuid, v_session_ts + INTERVAL '90m',  'body',          'Body warmth',       7),
    (v_session_uuid, v_session_ts + INTERVAL '120m', 'emotion',       'Waves of grief',    8),
    (v_session_uuid, v_session_ts + INTERVAL '150m', 'peak',          'Peak — surrender',  10),
    (v_session_uuid, v_session_ts + INTERVAL '175m', 'mystical',      'Unity feeling',     10),
    (v_session_uuid, v_session_ts + INTERVAL '205m', 'insight',       'Core insight',      9),
    (v_session_uuid, v_session_ts + INTERVAL '235m', 'emotion',       'Gratitude',         9),
    (v_session_uuid, v_session_ts + INTERVAL '265m', 'companion_tap', 'Felt held',         8),
    (v_session_uuid, v_session_ts + INTERVAL '295m', 'feeling',       'Gentle clarity',    7),
    (v_session_uuid, v_session_ts + INTERVAL '330m', 'feeling',       'Peace',             8),
    (v_session_uuid, v_session_ts + INTERVAL '370m', 'body',          'Grounded, tired',   5)
  ON CONFLICT DO NOTHING;

  -- ── 7. Daily pulse checks — 10 days of check-ins ────────────────────────────
  INSERT INTO log_pulse_checks (
    session_id, patient_uuid, mood_level, sleep_quality,
    connection_level, anxiety_level, check_date, completed_at
  )
  VALUES
    (v_session_uuid, v_patient_uuid, 4, 4, 4, 8, CURRENT_DATE - 10, NOW() - INTERVAL '10 days'),
    (v_session_uuid, v_patient_uuid, 5, 4, 5, 7, CURRENT_DATE -  9, NOW() - INTERVAL '9 days'),
    (v_session_uuid, v_patient_uuid, 5, 5, 5, 7, CURRENT_DATE -  8, NOW() - INTERVAL '8 days'),
    (v_session_uuid, v_patient_uuid, 6, 5, 6, 6, CURRENT_DATE -  7, NOW() - INTERVAL '7 days'),
    (v_session_uuid, v_patient_uuid, 6, 6, 6, 5, CURRENT_DATE -  6, NOW() - INTERVAL '6 days'),
    (v_session_uuid, v_patient_uuid, 7, 6, 7, 5, CURRENT_DATE -  5, NOW() - INTERVAL '5 days'),
    (v_session_uuid, v_patient_uuid, 7, 7, 7, 4, CURRENT_DATE -  4, NOW() - INTERVAL '4 days'),
    (v_session_uuid, v_patient_uuid, 8, 7, 7, 4, CURRENT_DATE -  3, NOW() - INTERVAL '3 days'),
    (v_session_uuid, v_patient_uuid, 8, 7, 8, 3, CURRENT_DATE -  2, NOW() - INTERVAL '2 days'),
    (v_session_uuid, v_patient_uuid, 8, 8, 8, 3, CURRENT_DATE -  1, NOW() - INTERVAL '1 day')
  ON CONFLICT DO NOTHING;

  -- ── 8. Longitudinal assessments (days 0, 7, 10) ─────────────────────────────
  INSERT INTO log_longitudinal_assessments (
    session_id, patient_uuid, days_post_session,
    phq9_score, gad7_score, phq2_score, gad2_score, created_at
  )
  VALUES
    (v_session_uuid, v_patient_uuid,  0, 17, 13, 3, 3, v_session_ts),
    (v_session_uuid, v_patient_uuid,  7, 12,  9, 2, 2, v_session_ts + INTERVAL '7 days'),
    (v_session_uuid, v_patient_uuid, 10, 10,  7, 2, 1, v_session_ts + INTERVAL '10 days')
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Demo seed complete.';
  RAISE NOTICE 'Session ID: %', v_session_uuid;
  RAISE NOTICE 'Practitioner: %', v_practitioner_id;
  RAISE NOTICE '';
  RAISE NOTICE 'Demo link (local):';
  RAISE NOTICE 'http://localhost:5173/#/patient-report?sessionId=% &demo=1', v_session_uuid;
  RAISE NOTICE '';
  RAISE NOTICE 'Practitioner view (local):';
  RAISE NOTICE 'http://localhost:5173/#/patient-report?sessionId=% &demo=1&pv=1', v_session_uuid;

END $$;
