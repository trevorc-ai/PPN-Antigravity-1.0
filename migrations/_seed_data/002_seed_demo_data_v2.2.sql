-- ============================================================================
-- PATIENT FLOW DEMO DATA - VERSION 2.2 (7-STAGE MODEL)
-- ============================================================================
-- Purpose: Generate realistic demo data for the new 7-stage patient flow model
-- Date: February 8, 2026
-- Version: 2.2
-- Changes: Updated to use sequential stage orders (1-7) instead of grouped (1,1,2,3,4,5,5)
-- ============================================================================

-- CLEANUP: Remove old demo data first
DELETE FROM public.log_patient_flow_events WHERE site_id IN (
    SELECT id FROM public.sites WHERE name IN ('Demo Site Alpha', 'Demo Site Beta')
);

DELETE FROM public.sites WHERE name IN ('Demo Site Alpha', 'Demo Site Beta');

-- ============================================================================
-- SECTION 1: CREATE DEMO SITES
-- ============================================================================

INSERT INTO public.sites (id, name, site_code, is_active, created_at)
VALUES
    (gen_random_uuid(), 'Demo Site Alpha', 'DEMO_ALPHA', TRUE, NOW()),
    (gen_random_uuid(), 'Demo Site Beta', 'DEMO_BETA', TRUE, NOW())
ON CONFLICT (site_code) DO UPDATE SET
    name = EXCLUDED.name,
    is_active = EXCLUDED.is_active;

-- Get site IDs for later use
DO $$
DECLARE
    v_site_alpha_id UUID;
    v_site_beta_id UUID;
    v_patient_hash TEXT;
    v_intake_started_id BIGINT;
    v_intake_completed_id BIGINT;
    v_consent_id BIGINT;
    v_baseline_id BIGINT;
    v_session_id BIGINT;
    v_followup_id BIGINT;
    v_integration_id BIGINT;
    v_discontinued_id BIGINT;
    v_base_date TIMESTAMP;
    v_current_date TIMESTAMP;
    v_dropout_chance FLOAT;
    i INT;
BEGIN
    -- Get site IDs
    SELECT id INTO v_site_alpha_id FROM public.sites WHERE site_code = 'DEMO_ALPHA';
    SELECT id INTO v_site_beta_id FROM public.sites WHERE site_code = 'DEMO_BETA';
    
    -- Get event type IDs (using new sequential stage orders)
    SELECT id INTO v_intake_started_id FROM public.ref_flow_event_types WHERE event_type_code = 'intake_started';
    SELECT id INTO v_intake_completed_id FROM public.ref_flow_event_types WHERE event_type_code = 'intake_completed';
    SELECT id INTO v_consent_id FROM public.ref_flow_event_types WHERE event_type_code = 'consent_verified';
    SELECT id INTO v_baseline_id FROM public.ref_flow_event_types WHERE event_type_code = 'baseline_assessment_completed';
    SELECT id INTO v_session_id FROM public.ref_flow_event_types WHERE event_type_code = 'session_completed';
    SELECT id INTO v_followup_id FROM public.ref_flow_event_types WHERE event_type_code = 'followup_assessment_completed';
    SELECT id INTO v_integration_id FROM public.ref_flow_event_types WHERE event_type_code = 'integration_visit_completed';
    SELECT id INTO v_discontinued_id FROM public.ref_flow_event_types WHERE event_type_code = 'treatment_discontinued';
    
    RAISE NOTICE 'Creating 60 demo patients with realistic 7-stage progression...';
    
    -- Generate 60 patients (30 per site)
    FOR i IN 1..60 LOOP
        -- Generate unique patient hash
        v_patient_hash := MD5('demo_patient_' || i::TEXT);
        
        -- Assign to site (alternate between sites)
        v_site_alpha_id := CASE WHEN i % 2 = 0 THEN v_site_alpha_id ELSE v_site_beta_id END;
        
        -- Random start date in last 6 months
        v_base_date := NOW() - (RANDOM() * INTERVAL '180 days');
        v_current_date := v_base_date;
        
        -- STAGE 1: Intake Started (100% of patients)
        INSERT INTO public.log_patient_flow_events (
            site_id, patient_link_code_hash, event_type_id, event_at, created_at
        ) VALUES (
            v_site_alpha_id, v_patient_hash, v_intake_started_id,
            v_current_date, NOW()
        );
        
        -- STAGE 2: Intake Completed (95% continue)
        v_dropout_chance := RANDOM();
        IF v_dropout_chance > 0.05 THEN
            v_current_date := v_current_date + (RANDOM() * INTERVAL '3 days');
            INSERT INTO public.log_patient_flow_events (
                site_id, patient_link_code_hash, event_type_id, event_at, created_at
            ) VALUES (
                v_site_alpha_id, v_patient_hash, v_intake_completed_id,
                v_current_date, NOW()
            );
        ELSE
            -- Dropout after intake started
            v_current_date := v_current_date + (RANDOM() * INTERVAL '7 days');
            INSERT INTO public.log_patient_flow_events (
                site_id, patient_link_code_hash, event_type_id, event_at, created_at
            ) VALUES (
                v_site_alpha_id, v_patient_hash, v_discontinued_id,
                v_current_date, NOW()
            );
            CONTINUE;
        END IF;
        
        -- STAGE 3: Consent Verified (85% continue)
        v_dropout_chance := RANDOM();
        IF v_dropout_chance > 0.15 THEN
            v_current_date := v_current_date + (RANDOM() * INTERVAL '4 days');
            INSERT INTO public.log_patient_flow_events (
                site_id, patient_link_code_hash, event_type_id, event_at, created_at
            ) VALUES (
                v_site_alpha_id, v_patient_hash, v_consent_id,
                v_current_date, NOW()
            );
        ELSE
            -- Dropout after intake completed
            v_current_date := v_current_date + (RANDOM() * INTERVAL '10 days');
            INSERT INTO public.log_patient_flow_events (
                site_id, patient_link_code_hash, event_type_id, event_at, created_at
            ) VALUES (
                v_site_alpha_id, v_patient_hash, v_discontinued_id,
                v_current_date, NOW()
            );
            CONTINUE;
        END IF;
        
        -- STAGE 4: Baseline Assessment Completed (90% continue)
        v_dropout_chance := RANDOM();
        IF v_dropout_chance > 0.10 THEN
            v_current_date := v_current_date + (RANDOM() * INTERVAL '7 days');
            INSERT INTO public.log_patient_flow_events (
                site_id, patient_link_code_hash, event_type_id, event_at, created_at
            ) VALUES (
                v_site_alpha_id, v_patient_hash, v_baseline_id,
                v_current_date, NOW()
            );
        ELSE
            -- Dropout after consent
            v_current_date := v_current_date + (RANDOM() * INTERVAL '14 days');
            INSERT INTO public.log_patient_flow_events (
                site_id, patient_link_code_hash, event_type_id, event_at, created_at
            ) VALUES (
                v_site_alpha_id, v_patient_hash, v_discontinued_id,
                v_current_date, NOW()
            );
            CONTINUE;
        END IF;
        
        -- STAGE 5: Session Completed (92% continue)
        v_dropout_chance := RANDOM();
        IF v_dropout_chance > 0.08 THEN
            v_current_date := v_current_date + (RANDOM() * INTERVAL '10 days');
            INSERT INTO public.log_patient_flow_events (
                site_id, patient_link_code_hash, event_type_id, event_at, created_at
            ) VALUES (
                v_site_alpha_id, v_patient_hash, v_session_id,
                v_current_date, NOW()
            );
        ELSE
            -- Dropout after baseline
            v_current_date := v_current_date + (RANDOM() * INTERVAL '21 days');
            INSERT INTO public.log_patient_flow_events (
                site_id, patient_link_code_hash, event_type_id, event_at, created_at
            ) VALUES (
                v_site_alpha_id, v_patient_hash, v_discontinued_id,
                v_current_date, NOW()
            );
            CONTINUE;
        END IF;
        
        -- STAGE 6: Follow-up Assessment Completed (80% continue)
        v_dropout_chance := RANDOM();
        IF v_dropout_chance > 0.20 THEN
            v_current_date := v_current_date + (RANDOM() * INTERVAL '30 days');
            INSERT INTO public.log_patient_flow_events (
                site_id, patient_link_code_hash, event_type_id, event_at, created_at
            ) VALUES (
                v_site_alpha_id, v_patient_hash, v_followup_id,
                v_current_date, NOW()
            );
        ELSE
            -- Dropout after session (lost to follow-up)
            CONTINUE;
        END IF;
        
        -- STAGE 7: Integration Visit Completed (60% of those who did follow-up)
        v_dropout_chance := RANDOM();
        IF v_dropout_chance > 0.40 THEN
            v_current_date := v_current_date + (RANDOM() * INTERVAL '14 days');
            INSERT INTO public.log_patient_flow_events (
                site_id, patient_link_code_hash, event_type_id, event_at, created_at
            ) VALUES (
                v_site_alpha_id, v_patient_hash, v_integration_id,
                v_current_date, NOW()
            );
        END IF;
        
    END LOOP;
    
    RAISE NOTICE '✅ Demo data generation complete!';
END $$;

-- ============================================================================
-- SECTION 2: VERIFICATION QUERIES
-- ============================================================================

-- Count events by stage
SELECT 
    et.stage_order,
    et.event_type_code,
    et.event_type_label,
    COUNT(*) as event_count,
    COUNT(DISTINCT e.patient_link_code_hash) as unique_patients
FROM public.log_patient_flow_events e
JOIN public.ref_flow_event_types et ON e.event_type_id = et.id
WHERE e.site_id IN (SELECT id FROM public.sites WHERE site_code IN ('DEMO_ALPHA', 'DEMO_BETA'))
GROUP BY et.stage_order, et.event_type_code, et.event_type_label
ORDER BY et.stage_order NULLS LAST;

-- Check funnel progression
WITH funnel AS (
    SELECT 
        et.stage_order,
        et.event_type_label,
        COUNT(DISTINCT e.patient_link_code_hash) as patients
    FROM public.log_patient_flow_events e
    JOIN public.ref_flow_event_types et ON e.event_type_id = et.id
    WHERE e.site_id IN (SELECT id FROM public.sites WHERE site_code IN ('DEMO_ALPHA', 'DEMO_BETA'))
      AND et.stage_order IS NOT NULL
    GROUP BY et.stage_order, et.event_type_label
    ORDER BY et.stage_order
)
SELECT 
    stage_order,
    event_type_label,
    patients,
    LAG(patients) OVER (ORDER BY stage_order) as prev_patients,
    CASE 
        WHEN LAG(patients) OVER (ORDER BY stage_order) IS NOT NULL 
        THEN ROUND(((LAG(patients) OVER (ORDER BY stage_order) - patients)::NUMERIC / LAG(patients) OVER (ORDER BY stage_order) * 100), 1)
        ELSE 0
    END as dropout_pct
FROM funnel;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Demo data regenerated successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Expected funnel (60 patients):';
    RAISE NOTICE '   Stage 1: Intake Started (~60 patients)';
    RAISE NOTICE '   Stage 2: Intake Completed (~57 patients, 5%% dropout)';
    RAISE NOTICE '   Stage 3: Consent Verified (~48 patients, 15%% dropout)';
    RAISE NOTICE '   Stage 4: Baseline Completed (~43 patients, 10%% dropout)';
    RAISE NOTICE '   Stage 5: Session Completed (~40 patients, 8%% dropout)';
    RAISE NOTICE '   Stage 6: Follow-up Completed (~32 patients, 20%% dropout)';
    RAISE NOTICE '   Stage 7: Integration Completed (~19 patients, 40%% dropout)';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next step: Refresh Patient Flow page to see new data!';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;
