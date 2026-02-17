-- Function 5 of 5: get_compliance_alerts()
-- Purpose: Generate proactive alerts for low compliance or missing pulse checks

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
