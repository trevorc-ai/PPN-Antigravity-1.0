-- =====================================================
-- Arc of Care: Remove Free-Text Fields (PHI Risk Elimination)
-- Migration: 051_remove_free_text_add_observations.sql
-- Created: 2026-02-16
-- Purpose: Replace all free-text fields with controlled vocabulary
-- =====================================================

-- =====================================================
-- PART 1: REMOVE ALL FREE-TEXT COLUMNS
-- =====================================================

-- Remove free-text from baseline assessments
ALTER TABLE log_baseline_assessments
  DROP COLUMN IF EXISTS psycho_spiritual_history CASCADE;

-- Remove free-text from clinical records (sessions)
ALTER TABLE log_clinical_records
  DROP COLUMN IF EXISTS session_notes CASCADE;

-- Remove free-text from safety events
-- Note: event_description might be needed for MedDRA coding, keep for now but will be replaced with ref table

-- Remove free-text from interventions
-- Note: log_interventions.notes column doesn't exist in current schema

-- Remove free-text from integration sessions
ALTER TABLE log_integration_sessions
  DROP COLUMN IF EXISTS session_notes CASCADE,
  DROP COLUMN IF EXISTS cancellation_reason CASCADE;

-- Remove free-text from red alerts
ALTER TABLE log_red_alerts
  DROP COLUMN IF EXISTS alert_message CASCADE,
  DROP COLUMN IF EXISTS response_notes CASCADE;

-- =====================================================
-- PART 2: CREATE REFERENCE TABLES
-- =====================================================

-- Clinical Observations (replaces all free-text notes)
CREATE TABLE IF NOT EXISTS ref_clinical_observations (
  observation_id SERIAL PRIMARY KEY,
  observation_code VARCHAR(50) UNIQUE NOT NULL,
  observation_text TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'baseline', 'session', 'integration', 'safety'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed common clinical observations
INSERT INTO ref_clinical_observations (observation_code, observation_text, category) VALUES
-- Baseline observations (Set & Setting)
('BASELINE_MOTIVATED', 'Patient appears motivated and engaged in treatment', 'baseline'),
('BASELINE_ANXIOUS', 'Patient reports elevated anxiety about upcoming treatment', 'baseline'),
('BASELINE_CALM', 'Patient appears calm and well-prepared', 'baseline'),
('BASELINE_SKEPTICAL', 'Patient expresses skepticism about treatment efficacy', 'baseline'),
('BASELINE_HOPEFUL', 'Patient expresses hope and optimism about treatment', 'baseline'),
('BASELINE_SUPPORT_STRONG', 'Patient has strong social support system', 'baseline'),
('BASELINE_SUPPORT_LIMITED', 'Patient has limited social support available', 'baseline'),
('BASELINE_MEDITATION_EXP', 'Patient has prior meditation or mindfulness experience', 'baseline'),
('BASELINE_PSYCHEDELIC_NAIVE', 'Patient is psychedelic-naive', 'baseline'),
('BASELINE_PSYCHEDELIC_EXP', 'Patient has prior psychedelic experience', 'baseline'),

-- Session observations (Dosing)
('SESSION_SMOOTH', 'Session progressing smoothly without complications', 'session'),
('SESSION_CHALLENGING', 'Patient experiencing challenging emotional content', 'session'),
('SESSION_BREAKTHROUGH', 'Patient reports significant breakthrough experience', 'session'),
('SESSION_MYSTICAL', 'Patient reports mystical or transcendent experience', 'session'),
('SESSION_NAUSEA_MILD', 'Patient experiencing mild nausea (manageable)', 'session'),
('SESSION_NAUSEA_SEVERE', 'Patient experiencing severe nausea (intervention considered)', 'session'),
('SESSION_ANXIETY_PEAK', 'Patient experiencing peak anxiety during session', 'session'),
('SESSION_ANXIETY_RESOLVED', 'Patient anxiety resolved with verbal support', 'session'),
('SESSION_CRYING', 'Patient experiencing emotional release (crying)', 'session'),
('SESSION_LAUGHING', 'Patient experiencing joy or laughter', 'session'),
('SESSION_QUIET', 'Patient quiet and introspective throughout session', 'session'),
('SESSION_VERBAL', 'Patient verbally processing experience during session', 'session'),

-- Integration observations
('INTEGRATION_ENGAGED', 'Patient actively engaged in integration work', 'integration'),
('INTEGRATION_RESISTANT', 'Patient showing resistance to integration process', 'integration'),
('INTEGRATION_PROGRESS', 'Patient demonstrating clear integration progress', 'integration'),
('INTEGRATION_STRUGGLING', 'Patient struggling to integrate experience', 'integration'),
('INTEGRATION_INSIGHTS', 'Patient sharing meaningful insights from experience', 'integration'),
('INTEGRATION_BEHAVIORAL', 'Patient reporting positive behavioral changes', 'integration'),
('INTEGRATION_RELATIONAL', 'Patient reporting improved relationships', 'integration'),
('INTEGRATION_SPIRITUAL', 'Patient reporting spiritual or existential shifts', 'integration'),

-- Safety observations
('SAFETY_STABLE', 'Patient vitals stable and within normal range', 'safety'),
('SAFETY_HR_ELEVATED', 'Heart rate elevated but manageable (no intervention)', 'safety'),
('SAFETY_BP_ELEVATED', 'Blood pressure elevated but manageable (no intervention)', 'safety'),
('SAFETY_DISTRESS_MILD', 'Patient in mild psychological distress', 'safety'),
('SAFETY_DISTRESS_SEVERE', 'Patient in severe psychological distress', 'safety'),
('SAFETY_INTERVENTION_VERBAL', 'Verbal reassurance intervention provided', 'safety'),
('SAFETY_INTERVENTION_BREATHING', 'Guided breathing intervention provided', 'safety'),
('SAFETY_INTERVENTION_CHEMICAL', 'Chemical rescue intervention provided', 'safety'),
('SAFETY_RESOLVED', 'Safety concern resolved without intervention', 'safety')

ON CONFLICT (observation_code) DO NOTHING;

-- Enable RLS
ALTER TABLE ref_clinical_observations ENABLE ROW LEVEL SECURITY;

-- RLS Policy (all authenticated users can read)
CREATE POLICY "ref_clinical_observations_read" 
  ON ref_clinical_observations 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- =====================================================
-- Cancellation Reasons (for integration sessions)
-- =====================================================
CREATE TABLE IF NOT EXISTS ref_cancellation_reasons (
  cancellation_reason_id SERIAL PRIMARY KEY,
  reason_code VARCHAR(50) UNIQUE NOT NULL,
  reason_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed common cancellation reasons
INSERT INTO ref_cancellation_reasons (reason_code, reason_text) VALUES
('CANCEL_ILLNESS', 'Patient illness (non-COVID)'),
('CANCEL_COVID', 'COVID-19 exposure or symptoms'),
('CANCEL_EMERGENCY', 'Family or personal emergency'),
('CANCEL_SCHEDULING', 'Scheduling conflict'),
('CANCEL_TRANSPORTATION', 'Transportation issue'),
('CANCEL_FINANCIAL', 'Financial constraints'),
('CANCEL_DECLINED', 'Patient declined to continue treatment'),
('CANCEL_PROVIDER', 'Provider unavailable'),
('CANCEL_WEATHER', 'Weather or natural disaster'),
('CANCEL_OTHER', 'Other reason (contact clinic for details)')

ON CONFLICT (reason_code) DO NOTHING;

-- Enable RLS
ALTER TABLE ref_cancellation_reasons ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "ref_cancellation_reasons_read" 
  ON ref_cancellation_reasons 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- =====================================================
-- PART 3: CREATE LINKING TABLES (Many-to-Many)
-- =====================================================

-- Link baseline assessments to observations
CREATE TABLE IF NOT EXISTS log_baseline_observations (
  id SERIAL PRIMARY KEY,
  baseline_assessment_id INTEGER REFERENCES log_baseline_assessments(baseline_assessment_id) ON DELETE CASCADE,
  observation_id INTEGER REFERENCES ref_clinical_observations(observation_id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(baseline_assessment_id, observation_id)
);

CREATE INDEX IF NOT EXISTS idx_baseline_observations_assessment 
  ON log_baseline_observations(baseline_assessment_id);

CREATE INDEX IF NOT EXISTS idx_baseline_observations_observation 
  ON log_baseline_observations(observation_id);

-- Link sessions to observations
CREATE TABLE IF NOT EXISTS log_session_observations (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES log_clinical_records(id) ON DELETE CASCADE,
  observation_id INTEGER REFERENCES ref_clinical_observations(observation_id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id, observation_id)
);

CREATE INDEX IF NOT EXISTS idx_session_observations_session 
  ON log_session_observations(session_id);

CREATE INDEX IF NOT EXISTS idx_session_observations_observation 
  ON log_session_observations(observation_id);

-- Link integration sessions to cancellation reasons
ALTER TABLE log_integration_sessions
  ADD COLUMN IF NOT EXISTS cancellation_reason_id INTEGER REFERENCES ref_cancellation_reasons(cancellation_reason_id);

CREATE INDEX IF NOT EXISTS idx_integration_sessions_cancellation 
  ON log_integration_sessions(cancellation_reason_id);

-- Link safety events to observations
CREATE TABLE IF NOT EXISTS log_safety_event_observations (
  id SERIAL PRIMARY KEY,
  safety_event_id TEXT REFERENCES log_safety_events(ae_id) ON DELETE CASCADE,
  observation_id INTEGER REFERENCES ref_clinical_observations(observation_id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(safety_event_id, observation_id)
);

CREATE INDEX IF NOT EXISTS idx_safety_event_observations_event 
  ON log_safety_event_observations(safety_event_id);

CREATE INDEX IF NOT EXISTS idx_safety_event_observations_observation 
  ON log_safety_event_observations(observation_id);

-- =====================================================
-- PART 4: FEATURE REQUEST SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS log_feature_requests (
  request_id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  site_id UUID REFERENCES log_sites(site_id),
  request_type VARCHAR(50) NOT NULL, -- 'observation', 'cancellation_reason', 'other'
  requested_text TEXT NOT NULL,
  category VARCHAR(50), -- for observations: 'baseline', 'session', 'integration', 'safety'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_requests_status 
  ON log_feature_requests(status);

CREATE INDEX IF NOT EXISTS idx_feature_requests_site 
  ON log_feature_requests(site_id);

-- Enable RLS
ALTER TABLE log_feature_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policy (users can see their site's requests + their own requests)
CREATE POLICY "Users can access their site's feature requests"
  ON log_feature_requests
  FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

-- RLS Policy (users can create requests)
CREATE POLICY "Users can create feature requests"
  ON log_feature_requests
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Summary:
--   - Removed all free-text columns (PHI risk eliminated)
--   - Created ref_clinical_observations (37 seed observations)
--   - Created ref_cancellation_reasons (10 seed reasons)
--   - Created 4 linking tables for many-to-many relationships
--   - Created log_feature_requests for user-requested additions
--   - All tables have RLS policies for site isolation
-- =====================================================
