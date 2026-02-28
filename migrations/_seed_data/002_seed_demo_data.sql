-- ============================================================================
-- PATIENT FLOW DEMO DATA - SEED SCRIPT 002 (CORRECTED FOR YOUR SCHEMA)
-- ============================================================================
-- Purpose: Generate realistic demo data for Patient Flow Deep Dive testing
-- Date: February 8, 2026
-- Version: 2.1 (Fixed to match your exact schema)
-- Safe to run: YES (uses DEMO_ prefix for easy cleanup)
-- ============================================================================

-- ============================================================================
-- SECTION 1: DEMO SITES
-- ============================================================================

-- Insert demo sites (using correct column name: 'name' not 'site_name')
INSERT INTO public.sites (id, name, site_code, region, site_type, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'DEMO_Portland Psychedelic Clinic', 'DEMO_PPC', 'Oregon', 'clinic', TRUE),
('22222222-2222-2222-2222-222222222222', 'DEMO_Seattle Research Center', 'DEMO_SRC', 'Washington', 'research', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SECTION 2: DEMO PATIENT FLOW EVENTS
-- ============================================================================

-- Generate 200+ flow events across 60 demo patients
DO $$
DECLARE
    site_ids UUID[] := ARRAY[
        '11111111-1111-1111-1111-111111111111'::UUID,
        '22222222-2222-2222-2222-222222222222'::UUID
    ];
    patient_num INTEGER;
    site_id UUID;
    base_date TIMESTAMPTZ;
    patient_hash TEXT;
    intake_event_id BIGINT;
    consent_event_id BIGINT;
    baseline_event_id BIGINT;
    session_event_id BIGINT;
    followup_event_id BIGINT;
BEGIN
    -- Get event type IDs
    SELECT id INTO intake_event_id FROM public.ref_flow_event_types WHERE event_type_code = 'intake_completed';
    SELECT id INTO consent_event_id FROM public.ref_flow_event_types WHERE event_type_code = 'consent_verified';
    SELECT id INTO baseline_event_id FROM public.ref_flow_event_types WHERE event_type_code = 'baseline_assessment_completed';
    SELECT id INTO session_event_id FROM public.ref_flow_event_types WHERE event_type_code = 'session_completed';
    SELECT id INTO followup_event_id FROM public.ref_flow_event_types WHERE event_type_code = 'followup_assessment_completed';

    -- Generate events for 60 patients
    FOR patient_num IN 1..60 LOOP
        -- Assign patient to site (alternating)
        site_id := site_ids[(patient_num % 2) + 1];
        
        -- Random start date in last 90 days
        base_date := NOW() - (random() * INTERVAL '90 days');
        
        -- Generate patient hash (DEMO_ prefix for easy cleanup)
        patient_hash := 'DEMO_PATIENT_' || LPAD(patient_num::TEXT, 4, '0');
        
        -- STAGE 1: Intake (100% complete)
        INSERT INTO public.log_patient_flow_events (
            site_id, 
            patient_link_code_hash, 
            event_type_id, 
            event_at
        ) VALUES (
            site_id,
            patient_hash,
            intake_event_id,
            base_date
        );
        
        -- STAGE 2: Consent (80% complete)
        IF random() > 0.2 THEN
            INSERT INTO public.log_patient_flow_events (
                site_id, 
                patient_link_code_hash, 
                event_type_id, 
                event_at
            ) VALUES (
                site_id,
                patient_hash,
                consent_event_id,
                base_date + (1 + random() * 3) * INTERVAL '1 day'
            );
            
            -- STAGE 3: Baseline Assessment (90% of those who consented)
            IF random() > 0.1 THEN
                INSERT INTO public.log_patient_flow_events (
                    site_id, 
                    patient_link_code_hash, 
                    event_type_id, 
                    event_at
                ) VALUES (
                    site_id,
                    patient_hash,
                    baseline_event_id,
                    base_date + (4 + random() * 3) * INTERVAL '1 day'
                );
                
                -- STAGE 4: Session (95% of those with baseline)
                IF random() > 0.05 THEN
                    INSERT INTO public.log_patient_flow_events (
                        site_id, 
                        patient_link_code_hash, 
                        event_type_id, 
                        event_at
                    ) VALUES (
                        site_id,
                        patient_hash,
                        session_event_id,
                        base_date + (7 + random() * 7) * INTERVAL '1 day'
                    );
                    
                    -- STAGE 5: Follow-up Assessment (70% complete)
                    IF random() > 0.3 THEN
                        INSERT INTO public.log_patient_flow_events (
                            site_id, 
                            patient_link_code_hash, 
                            event_type_id, 
                            event_at
                        ) VALUES (
                            site_id,
                            patient_hash,
                            followup_event_id,
                            base_date + (21 + random() * 14) * INTERVAL '1 day'
                        );
                    END IF;
                END IF;
            END IF;
        END IF;
    END LOOP;

    RAISE NOTICE '✅ Generated flow events for 60 demo patients';
END $$;

-- ============================================================================
-- SECTION 3: VERIFICATION QUERIES
-- ============================================================================

-- Count events by stage
DO $$
DECLARE
    stage_counts TEXT;
BEGIN
    SELECT string_agg(event_type_label || ': ' || count::TEXT, ', ' ORDER BY stage_order)
    INTO stage_counts
    FROM (
        SELECT 
            et.event_type_label,
            et.stage_order,
            COUNT(*) as count
        FROM public.log_patient_flow_events e
        JOIN public.ref_flow_event_types et ON e.event_type_id = et.id
        WHERE e.patient_link_code_hash LIKE 'DEMO_%'
        AND et.stage_order IS NOT NULL
        GROUP BY et.event_type_label, et.stage_order
    ) counts;
    
    RAISE NOTICE '📊 Event counts by stage: %', stage_counts;
END $$;

-- Count unique patients
DO $$
DECLARE
    patient_count INTEGER;
BEGIN
    SELECT COUNT(DISTINCT patient_link_code_hash)
    INTO patient_count
    FROM public.log_patient_flow_events
    WHERE patient_link_code_hash LIKE 'DEMO_%';
    
    RAISE NOTICE '👥 Unique demo patients: %', patient_count;
END $$;

-- Count events by site
DO $$
DECLARE
    site_counts TEXT;
BEGIN
    SELECT string_agg(s.name || ': ' || count::TEXT, ', ')
    INTO site_counts
    FROM (
        SELECT 
            e.site_id,
            COUNT(*) as count
        FROM public.log_patient_flow_events e
        WHERE e.patient_link_code_hash LIKE 'DEMO_%'
        GROUP BY e.site_id
    ) counts
    JOIN public.sites s ON counts.site_id = s.id;
    
    RAISE NOTICE '🏥 Events by site: %', site_counts;
END $$;

-- ============================================================================
-- SECTION 4: TEST VIEWS
-- ============================================================================

-- Test v_flow_stage_counts
DO $$
DECLARE
    view_row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_row_count FROM public.v_flow_stage_counts;
    RAISE NOTICE '📈 v_flow_stage_counts has % rows', view_row_count;
END $$;

-- Test v_flow_time_to_next_step
DO $$
DECLARE
    view_row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_row_count FROM public.v_flow_time_to_next_step;
    RAISE NOTICE '⏱️  v_flow_time_to_next_step has % rows', view_row_count;
    
    IF view_row_count = 0 THEN
        RAISE NOTICE '   ℹ️  This is normal - small-cell suppression requires ≥10 patients per transition';
    END IF;
END $$;

-- Test v_followup_compliance
DO $$
DECLARE
    view_row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_row_count FROM public.v_followup_compliance;
    RAISE NOTICE '✓ v_followup_compliance has % rows', view_row_count;
    
    IF view_row_count = 0 THEN
        RAISE NOTICE '   ℹ️  This is normal - small-cell suppression requires ≥10 sessions per month';
    END IF;
END $$;

-- ============================================================================
-- SECTION 5: SAMPLE QUERY - SHOW THE FUNNEL
-- ============================================================================

SELECT 
    et.event_type_label AS "Stage",
    et.stage_order AS "Order",
    COUNT(*) as "Total Events",
    COUNT(DISTINCT e.patient_link_code_hash) as "Unique Patients"
FROM public.log_patient_flow_events e
JOIN public.ref_flow_event_types et ON e.event_type_id = et.id
WHERE e.patient_link_code_hash LIKE 'DEMO_%'
  AND et.stage_order IS NOT NULL
GROUP BY et.event_type_label, et.stage_order
ORDER BY et.stage_order;

-- ============================================================================
-- CLEANUP INSTRUCTIONS
-- ============================================================================

-- To remove all demo data later:
-- DELETE FROM public.log_patient_flow_events WHERE patient_link_code_hash LIKE 'DEMO_%';
-- DELETE FROM public.sites WHERE site_code LIKE 'DEMO_%';

-- ============================================================================
-- SEED COMPLETE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Demo data seed completed successfully';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 You now have:';
    RAISE NOTICE '   • 2 demo sites';
    RAISE NOTICE '   • 60 demo patients';
    RAISE NOTICE '   • 200+ flow events with realistic dropout';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Check the query results above to see the funnel!';
    RAISE NOTICE '';
    RAISE NOTICE '🧹 To cleanup later:';
    RAISE NOTICE '   DELETE FROM log_patient_flow_events WHERE patient_link_code_hash LIKE ''DEMO_%%'';';
    RAISE NOTICE '   DELETE FROM sites WHERE site_code LIKE ''DEMO_%%'';';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;
