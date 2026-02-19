-- ============================================================================
-- Migration: 054_form_schema_alignment.sql
-- Purpose:   Align live schema with arc-of-care form data shapes.
--            Identified via live schema audit on 2026-02-18.
-- Inspector: APPROVED for SOOP execution
-- Rules:     Additive only. All statements idempotent. RLS on every log_* table.
-- Run in:    Supabase SQL Editor (user executes manually)
-- ============================================================================

-- ============================================================================
-- PART 1: log_session_vitals — Add WO-085 clinical monitoring fields
-- (Form adds: respiratory_rate, temperature, diaphoresis_score, level_of_consciousness)
-- Live schema confirmed these 4 columns are MISSING.
-- ============================================================================

ALTER TABLE log_session_vitals
  ADD COLUMN IF NOT EXISTS respiratory_rate INTEGER
    CHECK (respiratory_rate BETWEEN 0 AND 60),          -- breaths/min (normal 12-20)
  ADD COLUMN IF NOT EXISTS temperature NUMERIC(4,1)
    CHECK (temperature BETWEEN 85.0 AND 115.0),         -- °F
  ADD COLUMN IF NOT EXISTS diaphoresis_score INTEGER
    CHECK (diaphoresis_score BETWEEN 0 AND 3),          -- 0=None 1=Mild 2=Moderate 3=Severe
  ADD COLUMN IF NOT EXISTS level_of_consciousness VARCHAR(20)
    CHECK (level_of_consciousness IN ('alert','verbal','pain','unresponsive')); -- AVPU scale

-- ============================================================================
-- PART 2: log_integration_sessions — Add rating columns + FK ID arrays
-- (Form sends: rating fields 1-5, session_focus_ids[], homework_assigned_ids[],
--  therapist_observation_ids[])
-- Live schema confirmed these columns are MISSING.
-- NOTE: session_notes TEXT was correctly removed by migration 051. Do NOT re-add.
-- ============================================================================

ALTER TABLE log_integration_sessions
  ADD COLUMN IF NOT EXISTS insight_integration_rating INTEGER
    CHECK (insight_integration_rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS emotional_processing_rating INTEGER
    CHECK (emotional_processing_rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS behavioral_application_rating INTEGER
    CHECK (behavioral_application_rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS engagement_level_rating INTEGER
    CHECK (engagement_level_rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS session_focus_ids INTEGER[],        -- FK to ref_session_focus_areas
  ADD COLUMN IF NOT EXISTS homework_assigned_ids INTEGER[],    -- FK to ref_homework_types
  ADD COLUMN IF NOT EXISTS therapist_observation_ids INTEGER[]; -- FK to ref_therapist_observations

-- ============================================================================
-- PART 3: log_behavioral_changes — Add structured fields to replace free-text
-- (Form sends: change_category, change_type_ids[], impact_on_wellbeing,
--  confidence_sustaining, related_to_dosing)
-- Live schema has: change_type VARCHAR, change_description TEXT, is_positive BOOLEAN
-- Strategy: ADD new structured columns. Keep legacy columns (additive only).
--           BUILDER should write to new columns; legacy columns left for historical data.
-- ============================================================================

ALTER TABLE log_behavioral_changes
  ADD COLUMN IF NOT EXISTS change_category VARCHAR(50)
    CHECK (change_category IN (
      'relationship','substance_use','exercise','work','hobby','self_care'
    )),
  ADD COLUMN IF NOT EXISTS change_type_ids INTEGER[],          -- FK to ref_behavioral_change_types
  ADD COLUMN IF NOT EXISTS impact_on_wellbeing VARCHAR(30)
    CHECK (impact_on_wellbeing IN (
      'highly_positive','moderately_positive','neutral',
      'moderately_negative','highly_negative'
    )),
  ADD COLUMN IF NOT EXISTS confidence_sustaining INTEGER
    CHECK (confidence_sustaining BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS related_to_dosing VARCHAR(30)
    CHECK (related_to_dosing IN (
      'direct_insight','indirect_influence','unrelated'
    ));

-- ============================================================================
-- PART 4: log_pulse_checks — Add DEFAULT to check_date (prevents NOT NULL errors)
-- (arcOfCareApi.ts was missing check_date — adding default prevents crashes)
-- Also: column is named 'check_date' in schema but form sends 'check_in_date'.
-- BUILDER must map check_in_date → check_date on insert.
-- ============================================================================

ALTER TABLE log_pulse_checks
  ALTER COLUMN check_date SET DEFAULT CURRENT_DATE;

-- ============================================================================
-- PART 5: log_consent — Add consent_types junction table
-- (ConsentForm sends consent_types: string[] — 1 row per consent type)
-- Live log_consent has: type TEXT, verified BOOLEAN, verified_at — maps to single type.
-- Pattern: one INSERT per consent_type (BUILDER loops array and inserts multiple rows).
-- No new table needed — existing log_consent.type handles it correctly.
-- ============================================================================

-- Confirm log_consent.type accepts our consent type codes:
-- 'informed_consent', 'hipaa_authorization', 'research_participation', 'photography_recording'
-- No migration needed — type TEXT already accepts these.
-- BUILDER mapping: consent_obtained → verified, verification_datetime → verified_at

-- ============================================================================
-- PART 6: session_timeline_events — Rename to log_session_timeline_events
-- (Migration 053 created 'session_timeline_events' without log_ prefix.
--  Live schema query filtered on log_%. Table may exist as non-log_ name.
--  SAFE APPROACH: Create log_session_timeline_events with IF NOT EXISTS.
--  SessionTimelineForm will target this new canonical name.)
-- ============================================================================

CREATE TABLE IF NOT EXISTS log_session_timeline_events (
  timeline_event_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          UUID REFERENCES log_clinical_records(id) ON DELETE CASCADE,
  event_timestamp     TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type          VARCHAR(50) NOT NULL CHECK (event_type IN (
                        'dose_admin','vital_check','patient_observation',
                        'clinical_decision','music_change','touch_consent',
                        'safety_event','other'
                      )),
  event_type_id       INTEGER,                              -- optional FK for future structured ref
  performed_by        UUID REFERENCES auth.users(id),
  metadata            JSONB,                                -- vital snapshots, dose amounts, etc.
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_log_timeline_session
  ON log_session_timeline_events(session_id, event_timestamp);

CREATE INDEX IF NOT EXISTS idx_log_timeline_type
  ON log_session_timeline_events(event_type);

ALTER TABLE log_session_timeline_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select their site timeline events" ON log_session_timeline_events;
CREATE POLICY "Users can select their site timeline events"
  ON log_session_timeline_events FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM log_clinical_records
      WHERE site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can insert timeline events" ON log_session_timeline_events;
CREATE POLICY "Users can insert timeline events"
  ON log_session_timeline_events FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM log_clinical_records
      WHERE site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- PART 7: ref_session_focus_areas — Reference table for integration session focus
-- (log_integration_sessions.session_focus_ids[] FK target)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ref_session_focus_areas (
  focus_area_id   SERIAL PRIMARY KEY,
  focus_code      VARCHAR(50) UNIQUE NOT NULL,
  focus_label     VARCHAR(100) NOT NULL,
  is_active       BOOLEAN DEFAULT true
);

INSERT INTO ref_session_focus_areas (focus_code, focus_label) VALUES
  ('trauma_processing',     'Trauma Processing'),
  ('grief_loss',            'Grief & Loss'),
  ('relationship_patterns', 'Relationship Patterns'),
  ('identity_self_concept', 'Identity & Self-Concept'),
  ('life_purpose',          'Life Purpose & Meaning'),
  ('substance_relationship','Relationship with Substance'),
  ('somatic_integration',   'Somatic Integration'),
  ('spiritual_integration', 'Spiritual Integration'),
  ('behavioral_change',     'Behavioral Change Planning'),
  ('peer_support',          'Peer Support Integration')
ON CONFLICT (focus_code) DO NOTHING;

ALTER TABLE ref_session_focus_areas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_session_focus_areas_read" ON ref_session_focus_areas;
CREATE POLICY "ref_session_focus_areas_read" ON ref_session_focus_areas
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- PART 8: ref_homework_types — Reference table for homework assignments
-- (log_integration_sessions.homework_assigned_ids[] FK target)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ref_homework_types (
  homework_type_id  SERIAL PRIMARY KEY,
  homework_code     VARCHAR(50) UNIQUE NOT NULL,
  homework_label    VARCHAR(100) NOT NULL,
  is_active         BOOLEAN DEFAULT true
);

INSERT INTO ref_homework_types (homework_code, homework_label) VALUES
  ('journaling',           'Daily Journaling'),
  ('meditation',           'Meditation Practice'),
  ('breathwork',           'Breathwork Exercise'),
  ('nature_time',          'Time in Nature'),
  ('creative_expression',  'Creative Expression'),
  ('somatic_exercise',     'Somatic Exercise'),
  ('community_connection', 'Community Connection'),
  ('therapy_reading',      'Recommended Reading'),
  ('movement_practice',    'Movement Practice'),
  ('gratitude_practice',   'Gratitude Practice')
ON CONFLICT (homework_code) DO NOTHING;

ALTER TABLE ref_homework_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_homework_types_read" ON ref_homework_types;
CREATE POLICY "ref_homework_types_read" ON ref_homework_types
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- PART 9: ref_therapist_observations — Reference table for clinical observations
-- (log_integration_sessions.therapist_observation_ids[] FK target)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ref_therapist_observations (
  observation_type_id SERIAL PRIMARY KEY,
  observation_code    VARCHAR(50) UNIQUE NOT NULL,
  observation_label   VARCHAR(100) NOT NULL,
  is_active           BOOLEAN DEFAULT true
);

INSERT INTO ref_therapist_observations (observation_code, observation_label) VALUES
  ('high_affect',        'High Emotional Affect'),
  ('low_affect',         'Low Emotional Affect'),
  ('cognitive_insight',  'Cognitive Insight Reported'),
  ('somatic_release',    'Somatic Release'),
  ('resistance',         'Therapeutic Resistance'),
  ('breakthrough',       'Breakthrough Moment'),
  ('dissociation_mild',  'Mild Dissociation Noted'),
  ('strong_engagement',  'Strong Therapeutic Engagement'),
  ('avoidance',          'Avoidance Behavior'),
  ('grief_expression',   'Grief Expression')
ON CONFLICT (observation_code) DO NOTHING;

ALTER TABLE ref_therapist_observations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_therapist_observations_read" ON ref_therapist_observations;
CREATE POLICY "ref_therapist_observations_read" ON ref_therapist_observations
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- PART 10: ref_behavioral_change_types — Reference table for behavioral changes
-- (log_behavioral_changes.change_type_ids[] FK target)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ref_behavioral_change_types (
  change_type_id    SERIAL PRIMARY KEY,
  change_type_code  VARCHAR(50) UNIQUE NOT NULL,
  change_type_label VARCHAR(100) NOT NULL,
  category          VARCHAR(50) NOT NULL CHECK (category IN (
                      'relationship','substance_use','exercise','work','hobby','self_care'
                    )),
  is_active         BOOLEAN DEFAULT true
);

INSERT INTO ref_behavioral_change_types (change_type_code, change_type_label, category) VALUES
  ('reduced_alcohol',       'Reduced Alcohol Use',              'substance_use'),
  ('reduced_cannabis',      'Reduced Cannabis Use',             'substance_use'),
  ('smoking_cessation',     'Smoking Cessation Progress',       'substance_use'),
  ('improved_sleep',        'Improved Sleep Quality',           'self_care'),
  ('started_exercise',      'Started Exercise Routine',         'exercise'),
  ('improved_diet',         'Improved Nutrition Habits',        'self_care'),
  ('social_reconnection',   'Social Reconnection',              'relationship'),
  ('family_healing',        'Family Relationship Healing',      'relationship'),
  ('work_engagement',       'Improved Work Engagement',         'work'),
  ('creative_pursuit',      'New Creative Pursuit',             'hobby'),
  ('mindfulness_practice',  'Regular Mindfulness Practice',     'self_care'),
  ('therapy_engagement',    'Consistent Therapy Engagement',    'self_care')
ON CONFLICT (change_type_code) DO NOTHING;

ALTER TABLE ref_behavioral_change_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_behavioral_change_types_read" ON ref_behavioral_change_types;
CREATE POLICY "ref_behavioral_change_types_read" ON ref_behavioral_change_types
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Summary of changes:
--   PART 1: log_session_vitals              +4 columns (WO-085 vitals)
--   PART 2: log_integration_sessions        +7 columns (ratings + FK arrays)
--   PART 3: log_behavioral_changes          +5 columns (structured behavioral fields)
--   PART 4: log_pulse_checks                check_date DEFAULT CURRENT_DATE added
--   PART 5: log_consent                     No change needed (type TEXT sufficient)
--   PART 6: log_session_timeline_events     NEW TABLE + RLS (canonical log_ name)
--   PART 7: ref_session_focus_areas         NEW ref table + 10 seed rows
--   PART 8: ref_homework_types              NEW ref table + 10 seed rows
--   PART 9: ref_therapist_observations      NEW ref table + 10 seed rows
--   PART 10: ref_behavioral_change_types    NEW ref table + 12 seed rows
--
-- Zero destructive operations. All statements idempotent (IF NOT EXISTS / ON CONFLICT).
-- Safe to re-run if interrupted.
-- ============================================================================
