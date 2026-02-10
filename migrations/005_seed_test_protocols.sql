-- ============================================================================
-- Migration 005: Seed Test Protocols
-- ============================================================================
-- Purpose: Generate diverse test protocols to verify all triggers/analytics
-- Date: 2026-02-10
-- scenarios: Interactions, Safety Events, Outcomes, Sequential Data
-- ============================================================================

DO $$
DECLARE
    site_id UUID;
    practitioner_id UUID;
    psilocybin_id BIGINT;
    mdma_id BIGINT;
    ketamine_id BIGINT;
    meo_dmt_id BIGINT;
    oral_id BIGINT;
    iv_id BIGINT;
    im_id BIGINT;
    mdd_id BIGINT;
    ptsd_id BIGINT;
    trd_id BIGINT;
    ocd_id BIGINT;
    anxiety_event_id BIGINT;
    panic_event_id BIGINT;
    hypertension_event_id BIGINT;
    dissociation_event_id BIGINT;
    grade1_id BIGINT;
    grade2_id BIGINT;
    grade3_id BIGINT;
    resolved_sess_id BIGINT;
    resolved_post_id BIGINT;
    unresolved_id BIGINT;
BEGIN
    -- 1. Get IDs via Lookups (Robust)
    SELECT id INTO site_id FROM public.sites WHERE site_code = 'DEMO_PPC' LIMIT 1;
    -- Fallback site if demo not present
    IF site_id IS NULL THEN
        SELECT id INTO site_id FROM public.sites LIMIT 1;
    END IF;
    
    -- Substances
    SELECT substance_id INTO psilocybin_id FROM public.ref_substances WHERE substance_name = 'Psilocybin';
    SELECT substance_id INTO mdma_id FROM public.ref_substances WHERE substance_name = 'MDMA';
    SELECT substance_id INTO ketamine_id FROM public.ref_substances WHERE substance_name = 'Ketamine';
    SELECT substance_id INTO meo_dmt_id FROM public.ref_substances WHERE substance_name = '5-MeO-DMT';
    
    -- Routes
    SELECT route_id INTO oral_id FROM public.ref_routes WHERE route_name = 'Oral';
    SELECT route_id INTO iv_id FROM public.ref_routes WHERE route_name = 'Intravenous';
    SELECT route_id INTO im_id FROM public.ref_routes WHERE route_name = 'Intramuscular';
    
    -- Indications
    SELECT indication_id INTO mdd_id FROM public.ref_indications WHERE indication_name = 'Major Depressive Disorder (MDD)';
    SELECT indication_id INTO ptsd_id FROM public.ref_indications WHERE indication_name = 'Post-Traumatic Stress Disorder (PTSD)';
    SELECT indication_id INTO trd_id FROM public.ref_indications WHERE indication_name = 'Treatment-Resistant Depression (TRD)';
    SELECT indication_id INTO ocd_id FROM public.ref_indications WHERE indication_name = 'Obsessive-Compulsive Disorder (OCD)';
    
    -- Safety Events
    SELECT safety_event_id INTO anxiety_event_id FROM public.ref_safety_events WHERE event_name = 'Anxiety';
    SELECT safety_event_id INTO panic_event_id FROM public.ref_safety_events WHERE event_name = 'Panic Attack';
    SELECT safety_event_id INTO hypertension_event_id FROM public.ref_safety_events WHERE event_name = 'Hypertension';
    SELECT safety_event_id INTO dissociation_event_id FROM public.ref_safety_events WHERE event_name = 'Dissociation';
    
    -- Severity
    SELECT severity_grade_id INTO grade1_id FROM public.ref_severity_grade WHERE grade_value = 1;
    SELECT severity_grade_id INTO grade2_id FROM public.ref_severity_grade WHERE grade_value = 2;
    SELECT severity_grade_id INTO grade3_id FROM public.ref_severity_grade WHERE grade_value = 3;
    
    -- Resolution
    SELECT resolution_status_id INTO resolved_sess_id FROM public.ref_resolution_status WHERE status_name = 'Resolved in Session';
    SELECT resolution_status_id INTO resolved_post_id FROM public.ref_resolution_status WHERE status_name = 'Resolved Post-Session';
    SELECT resolution_status_id INTO unresolved_id FROM public.ref_resolution_status WHERE status_name = 'Unresolved/Lingering';

    -- 2. Insert Test Protocols
    
    -- SCENARIO A: Drug Interaction Risk (MDMA + SSRI)
    INSERT INTO public.log_clinical_records (
        site_id, patient_link_code, session_date, session_number, 
        substance_id, route_id, dosage_amount, indication_id,
        concomitant_meds, baseline_phq9_score, psychological_difficulty_score,
        safety_event_id, severity_grade_id, resolution_status_id
    ) VALUES (
        site_id, 'TEST_PROTO_001', CURRENT_DATE - 5, 1,
        mdma_id, oral_id, 120, ptsd_id,
        'Escitalopram 10mg', 18, 4,
        NULL, NULL, NULL -- No actual event, just risk
    );

    -- SCENARIO B: Safety Event - Hypertension (Ketamine)
    INSERT INTO public.log_clinical_records (
        site_id, patient_link_code, session_date, session_number, 
        substance_id, route_id, dosage_amount, indication_id,
        concomitant_meds, baseline_phq9_score, psychological_difficulty_score,
        safety_event_id, severity_grade_id, resolution_status_id
    ) VALUES (
        site_id, 'TEST_PROTO_002', CURRENT_DATE - 10, 1,
        ketamine_id, iv_id, 0.5, trd_id,
        'None', 22, 2,
        hypertension_event_id, grade2_id, resolved_sess_id
    );

    -- SCENARIO C: Multiple Safety Events / Difficult Experience (5-MeO-DMT)
    INSERT INTO public.log_clinical_records (
        site_id, patient_link_code, session_date, session_number, 
        substance_id, route_id, dosage_amount, indication_id,
        concomitant_meds, baseline_phq9_score, psychological_difficulty_score,
        safety_event_id, severity_grade_id, resolution_status_id
    ) VALUES (
        site_id, 'TEST_PROTO_003', CURRENT_DATE - 2, 1,
        meo_dmt_id, im_id, 12, trd_id,
        'None', 15, 9, -- High Difficulty
        panic_event_id, grade3_id, resolved_post_id
    );

    -- SCENARIO D: Sequential Treatment - Session 1 (Psilocybin - Good)
    INSERT INTO public.log_clinical_records (
        site_id, patient_link_code, session_date, session_number, 
        substance_id, route_id, dosage_amount, indication_id,
        concomitant_meds, baseline_phq9_score, psychological_difficulty_score,
        safety_event_id, severity_grade_id, resolution_status_id
    ) VALUES (
        site_id, 'TEST_PROTO_004', CURRENT_DATE - 30, 1,
        psilocybin_id, oral_id, 25, mdd_id,
        'None', 24, 3,
        NULL, NULL, NULL
    );

    -- SCENARIO D: Sequential Treatment - Session 2 (Psilocybin - Improved)
    INSERT INTO public.log_clinical_records (
        site_id, patient_link_code, session_date, session_number, 
        substance_id, route_id, dosage_amount, indication_id,
        concomitant_meds, baseline_phq9_score, psychological_difficulty_score,
        safety_event_id, severity_grade_id, resolution_status_id
    ) VALUES (
        site_id, 'TEST_PROTO_004', CURRENT_DATE - 15, 2,
        psilocybin_id, oral_id, 30, mdd_id,
        'None', 12, 4, -- PHQ9 dropped from 24 to 12
        NULL, NULL, NULL
    );

    -- SCENARIO E: Unresolved Outcome (Psilocybin)
    INSERT INTO public.log_clinical_records (
        site_id, patient_link_code, session_date, session_number, 
        substance_id, route_id, dosage_amount, indication_id,
        concomitant_meds, baseline_phq9_score, psychological_difficulty_score,
        safety_event_id, severity_grade_id, resolution_status_id
    ) VALUES (
        site_id, 'TEST_PROTO_005', CURRENT_DATE - 20, 1,
        psilocybin_id, oral_id, 25, ocd_id,
        'None', 20, 8,
        dissociation_event_id, grade2_id, unresolved_id
    );

    -- SCENARIO F: High Concomitant Med Load (Polypharmacy Risk)
    INSERT INTO public.log_clinical_records (
        site_id, patient_link_code, session_date, session_number, 
        substance_id, route_id, dosage_amount, indication_id,
        concomitant_meds, baseline_phq9_score, psychological_difficulty_score,
        safety_event_id, severity_grade_id, resolution_status_id
    ) VALUES (
        site_id, 'TEST_PROTO_006', CURRENT_DATE - 1, 1,
        mdma_id, oral_id, 80, ptsd_id,
        'Lithium, Lamotrigine, Quetiapine', 19, 5,
        NULL, NULL, NULL
    );
    
    RAISE NOTICE '✅ Seeded 7 Test Protocols covering Interactions, Safety, and Outcomes';
END $$;
