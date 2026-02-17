-- Function 2 of 5: get_integration_milestones()
-- Purpose: Get timeline of integration milestones (assessments + therapy sessions)

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
