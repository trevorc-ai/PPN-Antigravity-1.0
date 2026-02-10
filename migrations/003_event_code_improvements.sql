-- ============================================================================
-- PATIENT FLOW IMPROVEMENTS - MIGRATION 003
-- ============================================================================
-- Purpose: Implement event_type_code as stable key pattern
-- Date: February 8, 2026
-- Version: 1.0
-- Safe to run: YES (adds constraints, does not modify data)
-- ============================================================================

-- ============================================================================
-- SECTION 1: ADD UNIQUENESS CONSTRAINTS
-- ============================================================================

-- Add unique constraint on event_type_code (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ref_flow_event_types_event_type_code_key'
    ) THEN
        ALTER TABLE public.ref_flow_event_types 
        ADD CONSTRAINT ref_flow_event_types_event_type_code_key 
        UNIQUE (event_type_code);
        
        RAISE NOTICE '✅ Added unique constraint on event_type_code';
    ELSE
        RAISE NOTICE '⏭️  Unique constraint on event_type_code already exists';
    END IF;
END $$;

-- Add unique constraint on stage_order for funnel stages (optional but recommended)
-- This ensures each funnel stage has a unique order
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ref_flow_event_types_stage_order_key'
    ) THEN
        -- Only add constraint if stage_order values are currently unique
        -- (excluding NULL values)
        IF (SELECT COUNT(*) FROM (
            SELECT stage_order, COUNT(*) as cnt
            FROM public.ref_flow_event_types
            WHERE stage_order IS NOT NULL
            GROUP BY stage_order
            HAVING COUNT(*) > 1
        ) duplicates) = 0 THEN
            ALTER TABLE public.ref_flow_event_types 
            ADD CONSTRAINT ref_flow_event_types_stage_order_key 
            UNIQUE (stage_order);
            
            RAISE NOTICE '✅ Added unique constraint on stage_order';
        ELSE
            RAISE NOTICE '⚠️  Cannot add unique constraint on stage_order - duplicate values exist';
            RAISE NOTICE '   Run this query to see duplicates:';
            RAISE NOTICE '   SELECT stage_order, COUNT(*) FROM ref_flow_event_types WHERE stage_order IS NOT NULL GROUP BY stage_order HAVING COUNT(*) > 1;';
        END IF;
    ELSE
        RAISE NOTICE '⏭️  Unique constraint on stage_order already exists';
    END IF;
END $$;

-- ============================================================================
-- SECTION 2: UPDATE VIEWS TO EXPOSE CODES
-- ============================================================================

-- Drop and recreate v_flow_stage_counts to include event_type_code
DROP VIEW IF EXISTS public.v_flow_stage_counts CASCADE;

CREATE OR REPLACE VIEW public.v_flow_stage_counts AS
SELECT
    e.site_id,
    et.event_type_code,
    et.event_type_label,
    et.stage_order,
    DATE_TRUNC('week', e.event_at) AS week_bucket,
    DATE_TRUNC('month', e.event_at) AS month_bucket,
    COUNT(*) AS count_events,
    COUNT(DISTINCT e.patient_link_code_hash) AS count_unique_patients
FROM public.log_patient_flow_events e
JOIN public.ref_flow_event_types et ON e.event_type_id = et.id
WHERE et.stage_order IS NOT NULL
  AND et.is_active = TRUE
GROUP BY 
    e.site_id,
    et.event_type_code,
    et.event_type_label,
    et.stage_order,
    week_bucket,
    month_bucket
HAVING COUNT(DISTINCT e.patient_link_code_hash) >= 10;

COMMENT ON VIEW public.v_flow_stage_counts IS 
'Aggregated funnel counts by stage, site, and time bucket. Includes event_type_code for stable filtering. Small-cell suppression: N>=10.';

-- Drop and recreate v_flow_time_to_next_step to include event_type_codes
DROP VIEW IF EXISTS public.v_flow_time_to_next_step CASCADE;

CREATE OR REPLACE VIEW public.v_flow_time_to_next_step AS
WITH patient_transitions AS (
    SELECT
        e1.site_id,
        e1.patient_link_code_hash,
        et1.event_type_code AS from_event_code,
        et1.event_type_label AS from_event_label,
        et1.stage_order AS from_stage,
        et2.event_type_code AS to_event_code,
        et2.event_type_label AS to_event_label,
        et2.stage_order AS to_stage,
        EXTRACT(EPOCH FROM (e2.event_at - e1.event_at)) / 86400.0 AS days_to_next
    FROM public.log_patient_flow_events e1
    JOIN public.ref_flow_event_types et1 ON e1.event_type_id = et1.id
    JOIN public.log_patient_flow_events e2 ON 
        e1.patient_link_code_hash = e2.patient_link_code_hash
        AND e1.site_id = e2.site_id
        AND e2.event_at > e1.event_at
    JOIN public.ref_flow_event_types et2 ON e2.event_type_id = et2.id
    WHERE et1.stage_order IS NOT NULL
      AND et2.stage_order IS NOT NULL
      AND et2.stage_order = et1.stage_order + 1
      AND et1.is_active = TRUE
      AND et2.is_active = TRUE
)
SELECT
    site_id,
    from_event_code,
    from_event_label,
    from_stage,
    to_event_code,
    to_event_label,
    to_stage,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_to_next) AS median_days,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY days_to_next) AS p75_days,
    COUNT(DISTINCT patient_link_code_hash) AS n_patients
FROM patient_transitions
GROUP BY 
    site_id,
    from_event_code,
    from_event_label,
    from_stage,
    to_event_code,
    to_event_label,
    to_stage
HAVING COUNT(DISTINCT patient_link_code_hash) >= 10;

COMMENT ON VIEW public.v_flow_time_to_next_step IS 
'Median and P75 days between consecutive funnel stages. Includes event_type_codes for stable filtering. Small-cell suppression: N>=10.';

-- v_followup_compliance already doesn't use event types, so no changes needed
-- But let's add a comment for clarity
COMMENT ON VIEW public.v_followup_compliance IS 
'Follow-up completion rates by site and month. Small-cell suppression: N>=10 sessions per month.';

-- ============================================================================
-- SECTION 3: CREATE HELPER FUNCTION FOR CODE-BASED LOOKUPS
-- ============================================================================

-- Function to get event_type_id from event_type_code
CREATE OR REPLACE FUNCTION public.get_event_type_id_by_code(p_event_type_code TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_event_type_id BIGINT;
BEGIN
    SELECT id INTO v_event_type_id
    FROM public.ref_flow_event_types
    WHERE event_type_code = p_event_type_code
      AND is_active = TRUE;
    
    RETURN v_event_type_id;
END;
$$;

COMMENT ON FUNCTION public.get_event_type_id_by_code(TEXT) IS 
'Helper function to get event_type_id from event_type_code. Use this in application code to convert codes to IDs for database operations.';

-- ============================================================================
-- SECTION 4: ADD INDEXES FOR CODE-BASED QUERIES
-- ============================================================================

-- Index on event_type_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_ref_flow_event_types_code 
ON public.ref_flow_event_types(event_type_code) 
WHERE is_active = TRUE;

-- ============================================================================
-- SECTION 5: VERIFICATION QUERIES
-- ============================================================================

-- Verify uniqueness constraints
DO $$
DECLARE
    code_constraint_exists BOOLEAN;
    stage_constraint_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ref_flow_event_types_event_type_code_key'
    ) INTO code_constraint_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ref_flow_event_types_stage_order_key'
    ) INTO stage_constraint_exists;
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICATION RESULTS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'event_type_code unique constraint: %', 
        CASE WHEN code_constraint_exists THEN '✅ EXISTS' ELSE '❌ MISSING' END;
    RAISE NOTICE 'stage_order unique constraint: %', 
        CASE WHEN stage_constraint_exists THEN '✅ EXISTS' ELSE '⚠️  NOT ADDED (check for duplicates)' END;
    RAISE NOTICE '';
END $$;

-- Show current event types with codes
SELECT 
    id,
    event_type_code,
    event_type_label,
    stage_order,
    is_active
FROM public.ref_flow_event_types
ORDER BY stage_order NULLS LAST, event_type_code;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Migration 003 completed successfully';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Changes applied:';
    RAISE NOTICE '   1. Added unique constraint on event_type_code';
    RAISE NOTICE '   2. Added unique constraint on stage_order (if no duplicates)';
    RAISE NOTICE '   3. Updated v_flow_stage_counts to include event_type_code';
    RAISE NOTICE '   4. Updated v_flow_time_to_next_step to include event_type_codes';
    RAISE NOTICE '   5. Created helper function get_event_type_id_by_code()';
    RAISE NOTICE '   6. Added index on event_type_code';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next steps:';
    RAISE NOTICE '   1. Update frontend to use event_type_code instead of event_type_id';
    RAISE NOTICE '   2. Update saved views to store event_type_code';
    RAISE NOTICE '   3. Test all charts with new view structure';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;
