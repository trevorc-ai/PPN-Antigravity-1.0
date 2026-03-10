-- ============================================================================
-- Phase 3 Visualizations Seed Script (Staging)
-- Purpose: Generates a complete patient journey with Phase 1 Baseline, 
--          Phase 2 Dosing, and Phase 3 Integration data (Longitudinal & Pulse)
-- Target:  Assigned to Trevor's user account (or first available Clinician)
-- ============================================================================

DO $$
DECLARE
    v_site_alpha     UUID;
    v_practitioner_id UUID;
    v_sub_psilo      BIGINT;
    v_ind_mdd        BIGINT;
    v_session_id     UUID := gen_random_uuid();
    v_patient_uuid   UUID := gen_random_uuid();
BEGIN
    -- 1. Resolve Site
    SELECT site_id INTO v_site_alpha FROM public.log_sites LIMIT 1;
    
    -- 2. Resolve Practitioner (Attempt to find Trevor, fallback to first clinician)
    SELECT id INTO v_practitioner_id FROM auth.users WHERE email ILIKE '%trevor%' LIMIT 1;
    IF v_practitioner_id IS NULL THEN
        SELECT user_id INTO v_practitioner_id FROM public.log_user_sites WHERE site_id = v_site_alpha AND role = 'clinician' LIMIT 1;
    END IF;
    IF v_practitioner_id IS NULL THEN
        SELECT id INTO v_practitioner_id FROM auth.users LIMIT 1;
    END IF;

    -- 3. Resolve Substance and Indication
    SELECT substance_id INTO v_sub_psilo FROM public.ref_substances WHERE substance_name = 'Psilocybin';
    SELECT indication_id INTO v_ind_mdd FROM public.ref_indications WHERE indication_name ILIKE '%MDD%';

    -- 4. Baseline Assessment (Phase 1)
    -- Includes ACE and PCL-5 scores to unlock the "Forecasted Integration Plan"
    INSERT INTO public.log_baseline_assessments 
        (patient_uuid, site_id, phq9_score, gad7_score, ace_score, pcl5_score, expectancy_scale, assessment_date)
    VALUES 
        (v_patient_uuid, v_site_alpha, 18, 15, 3, 42, 75, CURRENT_DATE - 45)
    ON CONFLICT DO NOTHING;

    -- 5. Clinical Record (Phase 2 Dosing Session)
    -- Placed 30 days in the past to generate integration timeline
    INSERT INTO public.log_clinical_records 
        (id, site_id, practitioner_id, session_number, session_date, dosage_mg, substance_id, indication_id)
    VALUES 
        (v_session_id, v_site_alpha, v_practitioner_id, 1, CURRENT_DATE - INTERVAL '30 days', 25, v_sub_psilo, v_ind_mdd)
    ON CONFLICT (id) DO NOTHING;

    -- 6. Session Vitals
    INSERT INTO public.log_session_vitals 
        (session_id, recorded_at, heart_rate, bp_systolic, bp_diastolic, oxygen_saturation)
    VALUES 
        (v_session_id, CURRENT_DATE - INTERVAL '30 days' + INTERVAL '1 hour', 85, 130, 85, 98),
        (v_session_id, CURRENT_DATE - INTERVAL '30 days' + INTERVAL '2 hours', 95, 135, 88, 97);

    -- 7. Longitudinal Assessments (Phase 3 Symptom Decay Curve)
    -- Creates the blue trajectory line showing PHQ-9 decreasing over 30 days
    INSERT INTO public.log_longitudinal_assessments 
        (patient_uuid, session_id, assessment_date, phq9_score, gad7_score, days_post_session)
    VALUES 
        (v_patient_uuid, v_session_id, CURRENT_DATE - INTERVAL '30 days', 22, 20, 0),
        (v_patient_uuid, v_session_id, CURRENT_DATE - INTERVAL '14 days', 14, 12, 14),
        (v_patient_uuid, v_session_id, CURRENT_DATE,                       6,  4, 30)
    ON CONFLICT DO NOTHING;

    -- 8. Daily Pulse Checks (Phase 3 7-Day Trend Widget)
    -- Generates daily connection and sleep scores for the bar chart
    INSERT INTO public.log_pulse_checks 
        (patient_uuid, session_id, check_date, connection_level, sleep_quality, mood_level)
    SELECT 
        v_patient_uuid, v_session_id, (CURRENT_DATE - (d || ' days')::interval)::date, 
        ROUND(RANDOM() * 2 + 3), ROUND(RANDOM() * 2 + 3), ROUND(RANDOM() * 2 + 3)
    FROM generate_series(0, 14) d
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Successfully seeded a perfect Phase 3 Demo Patient for practitioner %', v_practitioner_id;
END $$;
