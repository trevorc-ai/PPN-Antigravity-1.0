-- ============================================================================
-- WO-570: Integration Compass Demo Seed
-- Idempotent — safe to re-run. Uses ON CONFLICT DO NOTHING.
-- Demo UUID: 00000000-0570-demo-0000-000000000000
-- Seeds 10 days ago session (Demo = Day 10 of integration window)
-- ============================================================================

-- Use a fixed UUID namespace for demo data
DO $$
DECLARE
  v_session_uuid   uuid := '00000000-0570-de00-0000-000000000000';
  v_patient_uuid   uuid := '00000000-0570-de00-0000-000000000001';
  v_practitioner   uuid := '00000000-0570-de00-0000-000000000002';
  v_substance_id   uuid;
  v_session_date   date := CURRENT_DATE - INTERVAL '10 days';
  v_session_date_ts timestamptz := NOW() - INTERVAL '10 days';
BEGIN

  -- ── 1. Get psilocybin substance_id from ref_substances ─────────────────────
  SELECT id INTO v_substance_id
  FROM ref_substances
  WHERE LOWER(name) LIKE '%psilocybin%'
  LIMIT 1;

  -- Fallback if table doesn't have psilocybin yet
  IF v_substance_id IS NULL THEN
    v_substance_id := '00000000-0570-de00-0000-000000000010'::uuid;
    INSERT INTO ref_substances (id, name, category, status)
    VALUES (v_substance_id, 'Psilocybin', 'classical_psychedelic', 'active')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- ── 2. Clinical record (the session) ────────────────────────────────────────
  INSERT INTO log_clinical_records (
    id, patient_uuid, practitioner_uuid,
    session_date, session_type, status, created_at
  )
  VALUES (
    v_session_uuid, v_patient_uuid, v_practitioner,
    v_session_date, 'dosing', 'completed', v_session_date_ts
  )
  ON CONFLICT (id) DO NOTHING;

  -- ── 3. Baseline assessment ──────────────────────────────────────────────────
  INSERT INTO log_baseline_assessments (
    session_id, patient_uuid, phq9_score, gad7_score, created_at
  )
  VALUES (
    v_session_uuid, v_patient_uuid, 18, 14, v_session_date_ts - INTERVAL '7 days'
  )
  ON CONFLICT DO NOTHING;

  -- ── 4. Single dose event (psilocybin, 25mg) ─────────────────────────────────
  INSERT INTO log_dose_events (
    session_id, substance_id, dose_mg, dose_mg_per_kg, occurred_at
  )
  VALUES (
    v_session_uuid, v_substance_id, 25.0, 0.33,
    v_session_date_ts + INTERVAL '9 hours'
  )
  ON CONFLICT DO NOTHING;

  -- ── 5. Session timeline events (feelings across the session) ─────────────────
  INSERT INTO log_session_timeline_events (session_id, occurred_at, event_type, label, intensity)
  VALUES
    (v_session_uuid, v_session_date_ts + INTERVAL '9h 30m',  'feeling',   'Anxiety',    4),
    (v_session_uuid, v_session_date_ts + INTERVAL '10h',     'feeling',   'Curious',    7),
    (v_session_uuid, v_session_date_ts + INTERVAL '10h 45m', 'sensory',   'Visual patterns', 8),
    (v_session_uuid, v_session_date_ts + INTERVAL '11h 15m', 'peak',      'Surrender',  9),
    (v_session_uuid, v_session_date_ts + INTERVAL '11h 45m', 'mystical',  'Awe',        10),
    (v_session_uuid, v_session_date_ts + INTERVAL '12h 10m', 'insight',   'Insight',    9),
    (v_session_uuid, v_session_date_ts + INTERVAL '12h 40m', 'emotion',   'Grief released', 8),
    (v_session_uuid, v_session_date_ts + INTERVAL '13h 5m',  'feeling',   'Love',       9),
    (v_session_uuid, v_session_date_ts + INTERVAL '13h 35m', 'companion_tap', 'Connected', 8),
    (v_session_uuid, v_session_date_ts + INTERVAL '14h',     'feeling',   'Peaceful',   7),
    (v_session_uuid, v_session_date_ts + INTERVAL '14h 30m', 'feeling',   'Gratitude',  8),
    (v_session_uuid, v_session_date_ts + INTERVAL '15h',     'body',      'Grounded',   6)
  ON CONFLICT DO NOTHING;

  -- ── 6. Daily pulse checks (14 days of check-ins post-session) ────────────────
  INSERT INTO log_pulse_checks (
    session_id, patient_uuid, mood_level, sleep_quality,
    connection_level, anxiety_level, check_date, completed_at
  )
  SELECT
    v_session_uuid,
    v_patient_uuid,
    -- Slowly improving mood/sleep, decreasing anxiety
    LEAST(10, 5 + day_num * 0.25 + (RANDOM() * 1.5)::int)::int,
    LEAST(10, 4 + day_num * 0.20 + (RANDOM() * 1.5)::int)::int,
    LEAST(10, 4 + day_num * 0.25 + (RANDOM() * 1.0)::int)::int,
    GREATEST(1, 7 - day_num * 0.20 - (RANDOM() * 1.0)::int)::int,
    CURRENT_DATE - INTERVAL '10 days' + (day_num * INTERVAL '1 day'),
    NOW() - INTERVAL '10 days' + (day_num * INTERVAL '1 day')
  FROM generate_series(0, 13) AS day_num
  ON CONFLICT DO NOTHING;

  -- ── 7. Longitudinal assessments (days 7 and 14 post-session) ─────────────────
  INSERT INTO log_longitudinal_assessments (
    session_id, patient_uuid, days_post_session,
    phq9_score, gad7_score, phq2_score, gad2_score, created_at
  )
  VALUES
    (v_session_uuid, v_patient_uuid, 0,  18, 14, 3, 3, v_session_date_ts),
    (v_session_uuid, v_patient_uuid, 7,  13,  9, 2, 2, v_session_date_ts + INTERVAL '7 days'),
    (v_session_uuid, v_patient_uuid, 10,  11,  8, 2, 1, v_session_date_ts + INTERVAL '10 days')
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'WO-570 demo seed complete. Session ID: %', v_session_uuid;

END $$;
