-- Function 4 of 5: get_pulse_check_trends()
-- Purpose: Get pulse check trends over specified time period for visualization

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
