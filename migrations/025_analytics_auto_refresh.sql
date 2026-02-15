-- ============================================================================
-- Migration 025: Analytics Materialized View Auto-Refresh
-- ============================================================================
-- Purpose: Enable automatic refresh of analytics materialized views on data changes
-- Date: 2026-02-15
-- Status: READY TO RUN
-- Dependencies: Requires migration 017 (materialized views)
-- ============================================================================

-- 1. Create function to check if refresh is needed (5-minute cooldown)
CREATE OR REPLACE FUNCTION public.should_refresh_analytics()
RETURNS BOOLEAN AS $$
DECLARE
  last_refresh TIMESTAMPTZ;
  time_since_refresh NUMERIC;
BEGIN
  -- Get the last_updated timestamp from mv_outcomes_summary
  SELECT last_updated INTO last_refresh
  FROM public.mv_outcomes_summary
  LIMIT 1;
  
  -- If no data exists, always refresh
  IF last_refresh IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Calculate seconds since last refresh
  time_since_refresh := EXTRACT(EPOCH FROM (NOW() - last_refresh));
  
  -- Only refresh if more than 5 minutes (300 seconds) have passed
  RETURN time_since_refresh > 300;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create auto-refresh trigger function
CREATE OR REPLACE FUNCTION public.auto_refresh_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Only refresh if cooldown period has passed
  IF public.should_refresh_analytics() THEN
    -- Refresh all three materialized views concurrently
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_outcomes_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_clinic_benchmarks;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_network_benchmarks;
    
    RAISE NOTICE 'Analytics materialized views refreshed at %', NOW();
  ELSE
    RAISE NOTICE 'Skipping refresh - cooldown period active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger on log_clinical_records (fires after INSERT/UPDATE)
DROP TRIGGER IF EXISTS trigger_refresh_analytics ON public.log_clinical_records;

CREATE TRIGGER trigger_refresh_analytics
AFTER INSERT OR UPDATE ON public.log_clinical_records
FOR EACH STATEMENT
EXECUTE FUNCTION public.auto_refresh_analytics();

-- 4. Create manual refresh function for frontend "Refresh Data" button
CREATE OR REPLACE FUNCTION public.refresh_all_analytics()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Force refresh all views
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_outcomes_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_clinic_benchmarks;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_network_benchmarks;
  
  -- Return success with timestamp
  result := json_build_object(
    'success', TRUE,
    'refreshed_at', NOW(),
    'message', 'All analytics views refreshed successfully'
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.refresh_all_analytics() TO authenticated;

-- 6. Add comments
COMMENT ON FUNCTION public.should_refresh_analytics() IS 
  'Checks if analytics views need refresh (5-minute cooldown)';

COMMENT ON FUNCTION public.auto_refresh_analytics() IS 
  'Automatically refreshes analytics views after data changes (with cooldown)';

COMMENT ON FUNCTION public.refresh_all_analytics() IS 
  'Manual refresh function for Analytics Dashboard "Refresh Data" button';

-- 7. Verification
DO $$ 
BEGIN
  RAISE NOTICE '✅ Migration 025: Analytics Auto-Refresh';
  RAISE NOTICE '   - Auto-refresh trigger: ACTIVE on log_clinical_records';
  RAISE NOTICE '   - Cooldown period: 5 minutes';
  RAISE NOTICE '   - Manual refresh function: refresh_all_analytics()';
  RAISE NOTICE '   - Ready for frontend integration';
END $$;
