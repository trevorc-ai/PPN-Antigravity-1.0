-- Migration: Add Wellness Journey Helper Functions
-- Purpose: SQL functions for compliance calculations and data aggregation
-- Works with existing tables from 050_arc_of_care_schema.sql
-- Author: INSPECTOR (executing WO-063)
-- Date: 2026-02-16

-- ============================================
-- FUNCTION 1: calculate_compliance_score()
-- ============================================

CREATE OR REPLACE FUNCTION calculate_compliance_score(
    p_session_id UUID,
    p_days_post_session INTEGER DEFAULT 180
)
RETURNS TABLE (
    pulse_check_count INTEGER,
    pulse_check_percentage DECIMAL(5, 2),
    assessment_count INTEGER,
    assessment_percentage DECIMAL(5, 2),
    integration_session_count INTEGER,
    integration_session_percentage DECIMAL(5, 2),
    overall_compliance_score INTEGER
) AS $$
DECLARE
    v_expected_pulse_checks INTEGER := p_days_post_session;
    v_expected_assessments INTEGER := CEIL(p_days_post_session / 7.0); -- Weekly
    v_expected_integration_sessions INTEGER := CEIL(p_days_post_session / 30.0); -- Monthly
    v_pulse_check_count INTEGER;
    v_assessment_count INTEGER;
    v_integration_count INTEGER;
    v_pulse_pct DECIMAL(5, 2);
    v_assessment_pct DECIMAL(5, 2);
    v_integration_pct DECIMAL(5, 2);
BEGIN
    -- Count pulse checks
    SELECT COUNT(*)::INTEGER INTO v_pulse_check_count
    FROM log_pulse_checks 
    WHERE session_id = p_session_id;
    
    -- Count longitudinal assessments
    SELECT COUNT(*)::INTEGER INTO v_assessment_count
    FROM log_longitudinal_assessments 
    WHERE session_id = p_session_id;
    
    -- Count integration therapy sessions
    SELECT COUNT(*)::INTEGER INTO v_integration_count
    FROM log_integration_sessions 
    WHERE dosing_session_id = p_session_id
    AND attended = true;
    
    -- Calculate percentages
    v_pulse_pct := CASE 
        WHEN v_expected_pulse_checks > 0 THEN (v_pulse_check_count::DECIMAL / v_expected_pulse_checks * 100)
        ELSE 0 
    END;
    
    v_assessment_pct := CASE 
        WHEN v_expected_assessments > 0 THEN (v_assessment_count::DECIMAL / v_expected_assessments * 100)
        ELSE 0 
    END;
    
    v_integration_pct := CASE 
        WHEN v_expected_integration_sessions > 0 THEN (v_integration_count::DECIMAL / v_expected_integration_sessions * 100)
        ELSE 0 
    END;
    
    -- Return results
    RETURN QUERY
    SELECT 
        v_pulse_check_count,
        v_pulse_pct,
        v_assessment_count,
        v_assessment_pct,
        v_integration_count,
        v_integration_pct,
        -- Overall compliance score (weighted average)
        (v_pulse_pct * 0.4 + v_assessment_pct * 0.4 + v_integration_pct * 0.2)::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION calculate_compliance_score IS 
    'Calculates compliance score based on pulse checks (40%), assessments (40%), and integration sessions (20%)';

-- ============================================
-- FUNCTION 2: get_integration_milestones()
-- ============================================

CREATE OR REPLACE FUNCTION get_integration_milestones(p_session_id UUID)
RETURNS TABLE (
    milestone_date DATE,
    milestone_type VARCHAR,
    milestone_description VARCHAR,
    completed BOOLEAN,
    days_post_session INTEGER
) AS $$
BEGIN
    RETURN QUERY
    -- Integration therapy sessions
    SELECT 
        session_date::DATE AS milestone_date,
        'INTEGRATION_THERAPY'::VARCHAR AS milestone_type,
        ('Integration Session #' || integration_session_number)::VARCHAR AS milestone_description,
        attended AS completed,
        EXTRACT(DAY FROM (session_date - (SELECT session_date FROM log_clinical_records WHERE id = p_session_id)))::INTEGER AS days_post_session
    FROM log_integration_sessions
    WHERE dosing_session_id = p_session_id
    
    UNION ALL
    
    -- Longitudinal assessments
    SELECT 
        assessment_date::DATE AS milestone_date,
        'ASSESSMENT'::VARCHAR AS milestone_type,
        CASE 
            WHEN phq9_score IS NOT NULL THEN 'PHQ-9 Assessment'
            WHEN gad7_score IS NOT NULL THEN 'GAD-7 Assessment'
            WHEN whoqol_score IS NOT NULL THEN 'Quality of Life Assessment'
            WHEN psqi_score IS NOT NULL THEN 'Sleep Quality Assessment'
            ELSE 'Assessment'
        END::VARCHAR AS milestone_description,
        true AS completed,
        days_post_session
    FROM log_longitudinal_assessments
    WHERE session_id = p_session_id
    
    ORDER BY milestone_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_integration_milestones IS 
    'Returns timeline of integration milestones (assessments, therapy sessions) for display';

-- ============================================
-- FUNCTION 3: get_behavioral_changes_summary()
-- ============================================

CREATE OR REPLACE FUNCTION get_behavioral_changes_summary(p_session_id UUID)
RETURNS TABLE (
    change_type VARCHAR,
    change_count INTEGER,
    recent_changes TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bc.change_type,
        COUNT(*)::INTEGER AS change_count,
        ARRAY_AGG(bc.change_description ORDER BY bc.change_date DESC)::TEXT[] AS recent_changes
    FROM log_behavioral_changes bc
    WHERE bc.session_id = p_session_id
    AND bc.is_positive = true
    GROUP BY bc.change_type
    ORDER BY change_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_behavioral_changes_summary IS 
    'Returns summary of positive behavioral changes by type for Quality of Life card';

-- ============================================
-- FUNCTION 4: get_pulse_check_trends()
-- ============================================

CREATE OR REPLACE FUNCTION get_pulse_check_trends(
    p_session_id UUID,
    p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
    check_date DATE,
    avg_connection DECIMAL(3, 2),
    avg_sleep DECIMAL(3, 2),
    avg_mood DECIMAL(3, 2),
    avg_anxiety DECIMAL(3, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pc.check_date,
        AVG(pc.connection_level)::DECIMAL(3, 2) AS avg_connection,
        AVG(pc.sleep_quality)::DECIMAL(3, 2) AS avg_sleep,
        AVG(pc.mood_level)::DECIMAL(3, 2) AS avg_mood,
        AVG(pc.anxiety_level)::DECIMAL(3, 2) AS avg_anxiety
    FROM log_pulse_checks pc
    WHERE pc.session_id = p_session_id
    AND pc.check_date >= CURRENT_DATE - p_days_back
    GROUP BY pc.check_date
    ORDER BY pc.check_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_pulse_check_trends IS 
    'Returns pulse check trends over specified time period for visualization';

-- ============================================
-- FUNCTION 5: get_compliance_alerts()
-- ============================================

CREATE OR REPLACE FUNCTION get_compliance_alerts(p_session_id UUID)
RETURNS TABLE (
    alert_type VARCHAR,
    alert_severity VARCHAR,
    alert_message TEXT,
    recommended_action TEXT
) AS $$
DECLARE
    v_pulse_check_count INTEGER;
    v_expected_pulse_checks INTEGER;
    v_last_pulse_check_date DATE;
    v_days_since_last_check INTEGER;
    v_session_date DATE;
    v_days_post_session INTEGER;
BEGIN
    -- Get session date
    SELECT session_date INTO v_session_date
    FROM log_clinical_records
    WHERE id = p_session_id;
    
    -- Calculate days post session
    v_days_post_session := CURRENT_DATE - v_session_date;
    
    -- Get pulse check stats
    SELECT COUNT(*), MAX(check_date) INTO v_pulse_check_count, v_last_pulse_check_date
    FROM log_pulse_checks
    WHERE session_id = p_session_id;
    
    -- Calculate expected pulse checks (assume 180 days integration or actual days elapsed)
    v_expected_pulse_checks := LEAST(v_days_post_session, 180);
    
    -- Calculate days since last check
    v_days_since_last_check := CURRENT_DATE - COALESCE(v_last_pulse_check_date, v_session_date);
    
    -- Alert: Low pulse check compliance
    IF v_pulse_check_count::DECIMAL / NULLIF(v_expected_pulse_checks, 0) < 0.5 AND v_expected_pulse_checks > 7 THEN
        RETURN QUERY
        SELECT 
            'LOW_COMPLIANCE'::VARCHAR AS alert_type,
            'WARNING'::VARCHAR AS alert_severity,
            ('Patient has completed only ' || v_pulse_check_count || ' of ' || v_expected_pulse_checks || ' expected pulse checks (< 50%)')::TEXT AS alert_message,
            'Schedule follow-up call to encourage daily pulse check completion'::TEXT AS recommended_action;
    END IF;
    
    -- Alert: No recent pulse checks
    IF v_days_since_last_check > 7 AND v_days_post_session > 7 THEN
        RETURN QUERY
        SELECT 
            'NO_RECENT_CHECKS'::VARCHAR AS alert_type,
            'CRITICAL'::VARCHAR AS alert_severity,
            ('No pulse checks logged in ' || v_days_since_last_check || ' days (last: ' || COALESCE(v_last_pulse_check_date::TEXT, 'never') || ')')::TEXT AS alert_message,
            'Contact patient immediately to check on wellbeing'::TEXT AS recommended_action;
    END IF;
    
    -- If no alerts, return success message
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            'NO_ALERTS'::VARCHAR AS alert_type,
            'SUCCESS'::VARCHAR AS alert_severity,
            'Patient is stable and progressing well'::TEXT AS alert_message,
            'Continue current protocol'::TEXT AS recommended_action;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_compliance_alerts IS 
    'Returns compliance alerts and recommended actions for proactive intervention';
