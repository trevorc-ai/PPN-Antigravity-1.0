-- =====================================================
-- Migration: 053_session_timeline_events.sql
-- Purpose: Create tables for minute-by-minute session tracking (WO-086)
--          and multi-substance dosing.
-- =====================================================

-- 1. Session Timeline Events (The detailed log)
CREATE TABLE IF NOT EXISTS session_timeline_events (
    timeline_event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES log_clinical_records(id) ON DELETE CASCADE,
    event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'dose_admin', 
        'vital_check', 
        'patient_observation', 
        'clinical_decision', 
        'music_change', 
        'touch_consent', 
        'safety_event',
        'other'
    )),
    event_description TEXT CHECK (LENGTH(event_description) <= 500),
    performed_by UUID REFERENCES auth.users(id),
    metadata JSONB, -- Flexible storage for event-specific data (e.g. vital values snapshot)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timeline_session ON session_timeline_events(session_id, event_timestamp);
CREATE INDEX IF NOT EXISTS idx_timeline_type ON session_timeline_events(event_type);

-- Enable RLS
ALTER TABLE session_timeline_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view timeline events for their site" ON session_timeline_events;
CREATE POLICY "Users can view timeline events for their site"
    ON session_timeline_events FOR SELECT
    USING (
        session_id IN (
            SELECT id FROM log_clinical_records
            WHERE site_id IN (
                SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
            )
        )
    );

DROP POLICY IF EXISTS "Users can insert timeline events for their site" ON session_timeline_events;
CREATE POLICY "Users can insert timeline events for their site"
    ON session_timeline_events FOR INSERT
    WITH CHECK (
        session_id IN (
            SELECT id FROM log_clinical_records
            WHERE site_id IN (
                SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
            )
        )
    );

-- 2. Multi-Substance Dosing (Tracking extra doses/boosters)
CREATE TABLE IF NOT EXISTS session_multi_substance_log (
    multi_substance_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES log_clinical_records(id) ON DELETE CASCADE,
    substance_id UUID REFERENCES ref_substances(substance_id),
    dose_mg DECIMAL(10,2) NOT NULL,
    route_id UUID REFERENCES ref_routes(route_id),
    administered_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sequence_order INTEGER, -- 1st dose, 2nd dose, etc.
    reason_for_administration TEXT, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_multi_substance_session ON session_multi_substance_log(session_id);

-- Enable RLS
ALTER TABLE session_multi_substance_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view substance logs for their site" ON session_multi_substance_log;
CREATE POLICY "Users can view substance logs for their site"
    ON session_multi_substance_log FOR SELECT
    USING (
        session_id IN (
            SELECT id FROM log_clinical_records
            WHERE site_id IN (
                SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
            )
        )
    );

DROP POLICY IF EXISTS "Users can insert substance logs for their site" ON session_multi_substance_log;
CREATE POLICY "Users can insert substance logs for their site"
    ON session_multi_substance_log FOR INSERT
    WITH CHECK (
        session_id IN (
            SELECT id FROM log_clinical_records
            WHERE site_id IN (
                SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
            )
        )
    );
