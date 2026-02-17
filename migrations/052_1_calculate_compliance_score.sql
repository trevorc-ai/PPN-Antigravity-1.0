-- Function 1 of 5: calculate_compliance_score()
-- Purpose: Calculate weighted compliance score (pulse checks 40%, assessments 40%, integration sessions 20%)

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
