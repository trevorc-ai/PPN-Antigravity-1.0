-- Test query to verify the FunnelChart query works
-- This should match what FunnelChart.tsx is trying to do

SELECT 
    patient_link_code_hash,
    event_at,
    ref_flow_event_types.event_type_code,
    ref_flow_event_types.event_type_label,
    ref_flow_event_types.stage_order
FROM public.log_patient_flow_events
INNER JOIN public.ref_flow_event_types 
    ON log_patient_flow_events.event_type_id = ref_flow_event_types.id
WHERE ref_flow_event_types.stage_order IS NOT NULL
LIMIT 10;
