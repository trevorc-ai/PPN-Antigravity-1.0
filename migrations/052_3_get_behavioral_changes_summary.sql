-- Function 3 of 5: get_behavioral_changes_summary()
-- Purpose: Get summary of positive behavioral changes grouped by type

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
