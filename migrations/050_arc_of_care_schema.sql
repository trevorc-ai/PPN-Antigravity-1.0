-- =====================================================
-- Arc of Care Database Schema (CORRECTED)
-- Migration: 050_arc_of_care_schema.sql
-- Created: 2026-02-16
-- Strategy: Extend existing tables + add new Arc of Care tables
-- =====================================================

-- =====================================================
-- PART 1: NEW REFERENCE TABLES (ref_*)
-- =====================================================

-- Assessment Scales (PHQ-9, GAD-7, ACE, MEQ-30, etc.)
CREATE TABLE IF NOT EXISTS ref_assessment_scales (
  assessment_scale_id SERIAL PRIMARY KEY,
  scale_code VARCHAR(20) UNIQUE NOT NULL,
  scale_name VARCHAR(100) NOT NULL,
  scale_description TEXT,
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  loinc_code VARCHAR(20),
  snomed_code VARCHAR(20),
  scoring_interpretation JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data for assessment scales
INSERT INTO ref_assessment_scales (scale_code, scale_name, min_score, max_score, scoring_interpretation) VALUES
('PHQ9', 'Patient Health Questionnaire-9', 0, 27, '{"0-4": "Minimal", "5-9": "Mild", "10-14": "Moderate", "15-19": "Moderately Severe", "20-27": "Severe"}'),
('GAD7', 'Generalized Anxiety Disorder-7', 0, 21, '{"0-4": "Minimal", "5-9": "Mild", "10-14": "Moderate", "15-21": "Severe"}'),
('ACE', 'Adverse Childhood Experiences', 0, 10, '{"0": "None", "1-3": "Low", "4-6": "Moderate", "7-10": "High"}'),
('PCL5', 'PTSD Checklist-5', 0, 80, '{"0-32": "No PTSD", "33-80": "Probable PTSD"}'),
('EXPECTANCY', 'Treatment Expectancy Scale', 1, 100, '{"1-40": "Low Belief", "41-70": "Moderate Belief", "71-100": "High Belief"}'),
('MEQ30', 'Mystical Experience Questionnaire-30', 0, 100, '{"0-59": "Incomplete", "60-100": "Complete Mystical Experience"}'),
('EDI', 'Ego Dissolution Inventory', 0, 100, '{"0-40": "Low", "41-70": "Moderate", "71-100": "High Ego Dissolution"}'),
('CEQ', 'Challenging Experience Questionnaire', 0, 100, '{"0-40": "Mild", "41-70": "Moderate", "71-100": "Highly Challenging"}'),
('WHOQOL', 'WHO Quality of Life-BREF', 0, 100, '{"0-40": "Poor", "41-60": "Fair", "61-80": "Good", "81-100": "Excellent"}'),
('PSQI', 'Pittsburgh Sleep Quality Index', 0, 21, '{"0-5": "Good", "6-10": "Fair", "11-21": "Poor"}'),
('CSSRS', 'Columbia Suicide Severity Rating Scale', 0, 5, '{"0": "No Risk", "1-2": "Low Risk", "3-4": "Moderate Risk", "5": "High Risk"}')
ON CONFLICT (scale_code) DO NOTHING;

-- Enable RLS
ALTER TABLE ref_assessment_scales ENABLE ROW LEVEL SECURITY;

-- RLS Policy (authenticated users can read)
DROP POLICY IF EXISTS "ref_assessment_scales_read" ON ref_assessment_scales;
CREATE POLICY "ref_assessment_scales_read" ON ref_assessment_scales FOR SELECT USING (auth.role() = 'authenticated');

-- Intervention Types (for rescue protocols)
CREATE TABLE IF NOT EXISTS ref_intervention_types (
  intervention_type_id SERIAL PRIMARY KEY,
  intervention_code VARCHAR(50) UNIQUE NOT NULL,
  intervention_name VARCHAR(100) NOT NULL,
  intervention_category VARCHAR(50),
  description TEXT,
  requires_documentation BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data for intervention types
INSERT INTO ref_intervention_types (intervention_code, intervention_name, intervention_category) VALUES
('VERBAL_REASSURANCE', 'Verbal Reassurance', 'verbal'),
('BREATHING_TECHNIQUE', 'Guided Breathing Technique', 'verbal'),
('PHYSICAL_TOUCH', 'Physical Touch (Hand-holding)', 'physical'),
('ENVIRONMENT_ADJUST', 'Environment Adjustment (Lighting/Music)', 'environmental'),
('CHEMICAL_BENZO', 'Chemical Rescue (Benzodiazepine)', 'chemical'),
('CHEMICAL_PROPRANOLOL', 'Chemical Rescue (Propranolol)', 'chemical')
ON CONFLICT (intervention_code) DO NOTHING;

-- Enable RLS
ALTER TABLE ref_intervention_types ENABLE ROW LEVEL SECURITY;

-- RLS Policy (authenticated users can read)
DROP POLICY IF EXISTS "ref_intervention_types_read" ON ref_intervention_types;
CREATE POLICY "ref_intervention_types_read" ON ref_intervention_types FOR SELECT USING (auth.role() = 'authenticated');

-- MedDRA Codes (standardized adverse event coding)
CREATE TABLE IF NOT EXISTS ref_meddra_codes (
  meddra_code_id SERIAL PRIMARY KEY,
  meddra_code VARCHAR(20) UNIQUE NOT NULL,
  preferred_term VARCHAR(200) NOT NULL,
  system_organ_class VARCHAR(100),
  severity_level VARCHAR(20),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data for common adverse events
INSERT INTO ref_meddra_codes (meddra_code, preferred_term, system_organ_class, severity_level) VALUES
('10028813', 'Nausea', 'Gastrointestinal disorders', 'mild'),
('10033772', 'Panic attack', 'Psychiatric disorders', 'moderate'),
('10019211', 'Hypertension', 'Vascular disorders', 'moderate'),
('10013968', 'Dizziness', 'Nervous system disorders', 'mild'),
('10002026', 'Anxiety', 'Psychiatric disorders', 'moderate')
ON CONFLICT (meddra_code) DO NOTHING;

-- Enable RLS
ALTER TABLE ref_meddra_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policy (authenticated users can read)
DROP POLICY IF EXISTS "ref_meddra_codes_read" ON ref_meddra_codes;
CREATE POLICY "ref_meddra_codes_read" ON ref_meddra_codes FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- PART 2: EXTEND EXISTING TABLES (ALTER TABLE)
-- =====================================================

-- EXTEND log_clinical_records (becomes primary sessions table)
-- Already has: session_number, session_date, baseline_phq9_score
-- Adding: dosage details, MEQ-30, EDI, CEQ, session timeline, guide
ALTER TABLE log_clinical_records
  ADD COLUMN IF NOT EXISTS dosage_mg DECIMAL(6,2),
  ADD COLUMN IF NOT EXISTS dosage_route VARCHAR(20),
  ADD COLUMN IF NOT EXISTS batch_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS dose_administered_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS onset_reported_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS peak_intensity_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS session_ended_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS meq30_score INTEGER CHECK (meq30_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS meq30_completed_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS edi_score INTEGER CHECK (edi_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS edi_completed_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS ceq_score INTEGER CHECK (ceq_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS ceq_completed_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS session_notes TEXT,
  ADD COLUMN IF NOT EXISTS guide_user_id UUID REFERENCES auth.users(id);

-- Add indexes for Arc of Care queries
CREATE INDEX IF NOT EXISTS idx_clinical_records_session_date ON log_clinical_records(session_date);
CREATE INDEX IF NOT EXISTS idx_clinical_records_guide ON log_clinical_records(guide_user_id);

-- EXTEND log_safety_events (becomes session events table)
-- Adding: session linkage, event type, MedDRA codes, intervention types
ALTER TABLE log_safety_events
  ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES log_clinical_records(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS event_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS meddra_code_id INTEGER REFERENCES ref_meddra_codes(meddra_code_id),
  ADD COLUMN IF NOT EXISTS intervention_type_id INTEGER REFERENCES ref_intervention_types(intervention_type_id),
  ADD COLUMN IF NOT EXISTS is_resolved BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS logged_by_user_id UUID REFERENCES auth.users(id);

-- Add indexes for Arc of Care queries
CREATE INDEX IF NOT EXISTS idx_safety_events_session ON log_safety_events(session_id);
CREATE INDEX IF NOT EXISTS idx_safety_events_type ON log_safety_events(event_type);
CREATE INDEX IF NOT EXISTS idx_safety_events_meddra ON log_safety_events(meddra_code_id);

-- EXTEND log_interventions (for rescue protocol tracking)
-- Adding: session linkage, intervention type classification
ALTER TABLE log_interventions
  ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES log_clinical_records(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS intervention_type_id INTEGER REFERENCES ref_intervention_types(intervention_type_id);

-- Add indexes for Arc of Care queries
CREATE INDEX IF NOT EXISTS idx_interventions_session ON log_interventions(session_id);
CREATE INDEX IF NOT EXISTS idx_interventions_type ON log_interventions(intervention_type_id);

-- =====================================================
-- PART 3: NEW ARC OF CARE TABLES (CREATE TABLE)
-- =====================================================

-- Baseline Assessments (Phase 1: Preparation)
CREATE TABLE IF NOT EXISTS log_baseline_assessments (
  baseline_assessment_id SERIAL PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  site_id UUID REFERENCES log_sites(site_id),
  assessment_date TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Depression & Anxiety
  phq9_score INTEGER CHECK (phq9_score BETWEEN 0 AND 27),
  gad7_score INTEGER CHECK (gad7_score BETWEEN 0 AND 21),
  
  -- Trauma & PTSD
  ace_score INTEGER CHECK (ace_score BETWEEN 0 AND 10),
  pcl5_score INTEGER CHECK (pcl5_score BETWEEN 0 AND 80),
  
  -- Set & Setting
  expectancy_scale INTEGER CHECK (expectancy_scale BETWEEN 1 AND 100),
  psycho_spiritual_history TEXT,
  
  -- Physiology
  resting_hrv DECIMAL(5,2),
  resting_bp_systolic INTEGER,
  resting_bp_diastolic INTEGER,
  
  -- Metadata
  completed_by_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policy for baseline assessments
ALTER TABLE log_baseline_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their site's baseline assessments" ON log_baseline_assessments;
CREATE POLICY "Users can only access their site's baseline assessments"
  ON log_baseline_assessments
  FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_baseline_assessments_patient_site ON log_baseline_assessments(patient_id, site_id);
CREATE INDEX IF NOT EXISTS idx_baseline_assessments_created ON log_baseline_assessments(created_at);

-- Session Vitals (Phase 2: real-time biometric data)
CREATE TABLE IF NOT EXISTS log_session_vitals (
  session_vital_id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES log_clinical_records(id) ON DELETE CASCADE,
  recorded_at TIMESTAMP NOT NULL,
  
  -- Vital Signs
  heart_rate INTEGER CHECK (heart_rate BETWEEN 40 AND 200),
  hrv DECIMAL(5,2),
  bp_systolic INTEGER CHECK (bp_systolic BETWEEN 60 AND 250),
  bp_diastolic INTEGER CHECK (bp_diastolic BETWEEN 40 AND 150),
  oxygen_saturation INTEGER CHECK (oxygen_saturation BETWEEN 70 AND 100),
  
  -- Data Source
  source VARCHAR(50),
  device_id VARCHAR(100),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_vitals_session_id ON log_session_vitals(session_id);
CREATE INDEX IF NOT EXISTS idx_session_vitals_recorded_at ON log_session_vitals(recorded_at);

-- Pulse Checks (Phase 3: Integration - daily check-ins)
CREATE TABLE IF NOT EXISTS log_pulse_checks (
  pulse_check_id SERIAL PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  session_id UUID REFERENCES log_clinical_records(id),
  check_date DATE NOT NULL,
  
  -- Pulse Check Questions (1-5 scale)
  connection_level INTEGER CHECK (connection_level BETWEEN 1 AND 5),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
  
  -- Optional additional questions
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 5),
  anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 5),
  
  -- Metadata
  completed_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(patient_id, session_id, check_date)
);

CREATE INDEX IF NOT EXISTS idx_pulse_checks_patient_session ON log_pulse_checks(patient_id, session_id);
CREATE INDEX IF NOT EXISTS idx_pulse_checks_date ON log_pulse_checks(check_date);

-- RLS Policy for pulse checks
ALTER TABLE log_pulse_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their site's pulse checks" ON log_pulse_checks;
CREATE POLICY "Users can only access their site's pulse checks"
  ON log_pulse_checks
  FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
      )
    )
  );

-- Longitudinal Assessments (scheduled follow-up assessments)
CREATE TABLE IF NOT EXISTS log_longitudinal_assessments (
  longitudinal_assessment_id SERIAL PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  session_id UUID REFERENCES log_clinical_records(id),
  assessment_date DATE NOT NULL,
  days_post_session INTEGER,
  
  -- Symptom Tracking
  phq9_score INTEGER CHECK (phq9_score BETWEEN 0 AND 27),
  gad7_score INTEGER CHECK (gad7_score BETWEEN 0 AND 21),
  
  -- Quality of Life
  whoqol_score INTEGER CHECK (whoqol_score BETWEEN 0 AND 100),
  
  -- Sleep Quality
  psqi_score INTEGER CHECK (psqi_score BETWEEN 0 AND 21),
  
  -- Suicidality (RED ALERT)
  cssrs_score INTEGER CHECK (cssrs_score BETWEEN 0 AND 5),
  
  -- Metadata
  completed_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(patient_id, session_id, assessment_date)
);

CREATE INDEX IF NOT EXISTS idx_longitudinal_patient_session ON log_longitudinal_assessments(patient_id, session_id);
CREATE INDEX IF NOT EXISTS idx_longitudinal_assessments_date ON log_longitudinal_assessments(assessment_date);

-- RLS Policy for longitudinal assessments
ALTER TABLE log_longitudinal_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their site's longitudinal assessments" ON log_longitudinal_assessments;
CREATE POLICY "Users can only access their site's longitudinal assessments"
  ON log_longitudinal_assessments
  FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
      )
    )
  );

-- Behavioral Changes (patient-reported life changes)
CREATE TABLE IF NOT EXISTS log_behavioral_changes (
  behavioral_change_id SERIAL PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  session_id UUID REFERENCES log_clinical_records(id),
  change_date DATE NOT NULL,
  
  -- Change Classification
  change_type VARCHAR(50) NOT NULL,
  change_description TEXT NOT NULL,
  is_positive BOOLEAN NOT NULL,
  
  -- Metadata
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_behavioral_changes_patient ON log_behavioral_changes(patient_id);

-- RLS Policy for behavioral changes
ALTER TABLE log_behavioral_changes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their site's behavioral changes" ON log_behavioral_changes;
CREATE POLICY "Users can only access their site's behavioral changes"
  ON log_behavioral_changes
  FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
      )
    )
  );

-- Integration Sessions (therapy attendance tracking)
CREATE TABLE IF NOT EXISTS log_integration_sessions (
  integration_session_id SERIAL PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  dosing_session_id UUID REFERENCES log_clinical_records(id),
  integration_session_number INTEGER NOT NULL,
  session_date DATE NOT NULL,
  
  -- Session Details
  session_duration_minutes INTEGER,
  therapist_user_id UUID REFERENCES auth.users(id),
  session_notes TEXT,
  
  -- Attendance
  attended BOOLEAN DEFAULT true,
  cancellation_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(patient_id, dosing_session_id, integration_session_number)
);

-- RLS Policy for integration sessions
ALTER TABLE log_integration_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their site's integration sessions" ON log_integration_sessions;
CREATE POLICY "Users can only access their site's integration sessions"
  ON log_integration_sessions
  FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
      )
    )
  );

-- Red Alerts (automated safety alerts)
CREATE TABLE IF NOT EXISTS log_red_alerts (
  red_alert_id SERIAL PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  alert_severity VARCHAR(20) NOT NULL,
  alert_triggered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Alert Details
  trigger_value JSONB,
  alert_message TEXT,
  
  -- Response
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by_user_id UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP,
  response_notes TEXT,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_red_alerts_patient ON log_red_alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_red_alerts_unresolved ON log_red_alerts(is_resolved) WHERE is_resolved = false;
CREATE INDEX IF NOT EXISTS idx_red_alerts_triggered ON log_red_alerts(alert_triggered_at);

-- RLS Policy for red alerts
ALTER TABLE log_red_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their site's red alerts" ON log_red_alerts;
CREATE POLICY "Users can only access their site's red alerts"
  ON log_red_alerts
  FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
      )
    )
  );

-- =====================================================
-- INSPECTOR REQUIRED ADDITIONS (2026-02-17)
-- Fix 1: RLS for log_session_vitals (was missing entirely)
-- Fix 2: INSERT policies for all 7 log_* tables
-- Approved by: INSPECTOR — Conditional Sign-Off
-- =====================================================

-- FIX 1: log_session_vitals RLS (CRITICAL — table had zero protection)
ALTER TABLE log_session_vitals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select their site session vitals" ON log_session_vitals;
CREATE POLICY "Users can select their site session vitals"
  ON log_session_vitals FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM log_clinical_records
      WHERE site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can insert session vitals" ON log_session_vitals;
CREATE POLICY "Users can insert session vitals"
  ON log_session_vitals FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM log_clinical_records
      WHERE site_id IN (
        SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
      )
    )
  );

-- FIX 2: INSERT policies for all other log_* tables
-- (SELECT policies already exist; these enable application writes)

DROP POLICY IF EXISTS "Users can insert baseline assessments" ON log_baseline_assessments;
CREATE POLICY "Users can insert baseline assessments"
  ON log_baseline_assessments FOR INSERT
  WITH CHECK (
    site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert pulse checks" ON log_pulse_checks;
CREATE POLICY "Users can insert pulse checks"
  ON log_pulse_checks FOR INSERT
  WITH CHECK (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert longitudinal assessments" ON log_longitudinal_assessments;
CREATE POLICY "Users can insert longitudinal assessments"
  ON log_longitudinal_assessments FOR INSERT
  WITH CHECK (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert behavioral changes" ON log_behavioral_changes;
CREATE POLICY "Users can insert behavioral changes"
  ON log_behavioral_changes FOR INSERT
  WITH CHECK (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert integration sessions" ON log_integration_sessions;
CREATE POLICY "Users can insert integration sessions"
  ON log_integration_sessions FOR INSERT
  WITH CHECK (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert red alerts" ON log_red_alerts;
CREATE POLICY "Users can insert red alerts"
  ON log_red_alerts FOR INSERT
  WITH CHECK (
    patient_id IN (
      SELECT patient_id FROM log_baseline_assessments
      WHERE site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())
    )
  );

-- =====================================================
-- MIGRATION COMPLETE (INSPECTOR-APPROVED)
-- =====================================================
-- Total operations:
--   - 3 new ref_* tables (assessment_scales, intervention_types, meddra_codes)
--   - 3 ALTER TABLE (clinical_records, safety_events, interventions)
--   - 7 new log_* tables (baseline_assessments, session_vitals, pulse_checks,
--                         longitudinal_assessments, behavioral_changes,
--                         integration_sessions, red_alerts)
--   - 1 RLS ENABLE added (log_session_vitals — was missing)
--   - 8 INSERT policies added (all 7 log_* tables + session_vitals select)
-- Total: 13 schema objects + 9 RLS additions
-- Inspector Sign-Off: CONDITIONAL APPROVAL → FULL APPROVAL after these fixes
-- =====================================================
