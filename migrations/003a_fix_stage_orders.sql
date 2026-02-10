-- ============================================================================
-- FIX DUPLICATE STAGE ORDERS - MIGRATION 003a
-- ============================================================================
-- Purpose: Update stage_order values to be sequential (no duplicates)
-- Date: February 8, 2026
-- Safe to run: YES (only updates stage_order values)
-- ============================================================================

-- Show current state
SELECT 
    id,
    event_type_code,
    event_type_label,
    stage_order,
    is_active
FROM public.ref_flow_event_types
ORDER BY stage_order NULLS LAST, event_type_code;

-- Update stage orders to be sequential (Option A: Strict Sequential)
UPDATE public.ref_flow_event_types SET stage_order = 1 WHERE event_type_code = 'intake_started';
UPDATE public.ref_flow_event_types SET stage_order = 2 WHERE event_type_code = 'intake_completed';
UPDATE public.ref_flow_event_types SET stage_order = 3 WHERE event_type_code = 'consent_verified';
UPDATE public.ref_flow_event_types SET stage_order = 4 WHERE event_type_code = 'baseline_assessment_completed';
UPDATE public.ref_flow_event_types SET stage_order = 5 WHERE event_type_code = 'session_completed';
UPDATE public.ref_flow_event_types SET stage_order = 6 WHERE event_type_code = 'followup_assessment_completed';
UPDATE public.ref_flow_event_types SET stage_order = 7 WHERE event_type_code = 'integration_visit_completed';
-- treatment_paused and treatment_discontinued remain NULL (not in funnel)

-- Verify new state
SELECT 
    id,
    event_type_code,
    event_type_label,
    stage_order,
    is_active
FROM public.ref_flow_event_types
ORDER BY stage_order NULLS LAST, event_type_code;

-- Check for any remaining duplicates
SELECT 
    stage_order, 
    COUNT(*) as count,
    STRING_AGG(event_type_code, ', ') as codes
FROM public.ref_flow_event_types
WHERE stage_order IS NOT NULL
GROUP BY stage_order
HAVING COUNT(*) > 1;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Stage orders updated to sequential values (1-7)';
    RAISE NOTICE '   Now you can run migration 003 to add unique constraint';
END $$;
