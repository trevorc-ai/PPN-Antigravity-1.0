-- ============================================================================
-- PPN STAGING SEED: 20 Dummy Patient Protocols (v4 - Table Name Fix)
-- Purpose: Exercise all platform components with diverse clinical data.
-- Coverage: 20 patients (PT-001 to PT-020), 5 substances, 6 indications.
-- Zero PHI: Uses synthetic Subject IDs.
-- Safe: Additive-only INSERTs with ON CONFLICT DO NOTHING.
-- ============================================================================

DO $$
DECLARE
    v_site_alpha     UUID;
    v_practitioner_id UUID;
    v_sub_psilo      BIGINT;
    v_sub_mdma       BIGINT;
    v_sub_keta       BIGINT;
    v_sub_5meo       BIGINT;
    v_sub_ibog       BIGINT;
    v_ind_mdd        BIGINT;
    v_ind_ptsd       BIGINT;
    v_ind_trd        BIGINT;
    v_ind_gad        BIGINT;
    v_ind_sud        BIGINT;
    v_session_id     UUID;
    v_patient_uuid   UUID;
    v_i              INTEGER;
BEGIN
    -- 1. Resolve Site and User (Using verified 'log_sites' and 'log_user_sites')
    SELECT site_id INTO v_site_alpha FROM public.log_sites LIMIT 1;
    
    -- Use first available practitioner from log_user_sites
    SELECT user_id INTO v_practitioner_id FROM public.log_user_sites WHERE site_id = v_site_alpha AND role = 'clinician' LIMIT 1;
    IF v_practitioner_id IS NULL THEN
        SELECT id INTO v_practitioner_id FROM auth.users LIMIT 1;
    END IF;

    -- 2. Resolve Substances
    SELECT substance_id INTO v_sub_psilo FROM public.ref_substances WHERE substance_name = 'Psilocybin';
    SELECT substance_id INTO v_sub_mdma  FROM public.ref_substances WHERE substance_name = 'MDMA';
    SELECT substance_id INTO v_sub_keta  FROM public.ref_substances WHERE substance_name = 'Ketamine';
    SELECT substance_id INTO v_sub_5meo FROM public.ref_substances WHERE substance_name = '5-MeO-DMT';
    SELECT substance_id INTO v_sub_ibog  FROM public.ref_substances WHERE substance_name = 'Ibogaine';

    -- 3. Resolve Indications
    SELECT indication_id INTO v_ind_mdd FROM public.ref_indications WHERE indication_name ILIKE '%MDD%';
    SELECT indication_id INTO v_ind_trd FROM public.ref_indications WHERE indication_name ILIKE '%TRD%';
    SELECT indication_id INTO v_ind_ptsd FROM public.ref_indications WHERE indication_name ILIKE '%PTSD%';
    SELECT indication_id INTO v_ind_gad FROM public.ref_indications WHERE indication_name ILIKE '%GAD%';
    SELECT indication_id INTO v_ind_sud FROM public.ref_indications WHERE indication_name ILIKE '%Substance%';

    RAISE NOTICE 'Seeding 20 patients for site %...', v_site_alpha;

    -- 4. Seed 20 Patients
    FOR v_i IN 1..20 LOOP
        v_session_id   := gen_random_uuid();
        v_patient_uuid := gen_random_uuid();
        
        -- A) Master Patient Record (Baseline)
        INSERT INTO log_baseline_assessments (patient_uuid, site_id, phq9_score, gad7_score, assessment_date)
        VALUES (v_patient_uuid, v_site_alpha, 15 + (v_i % 10), 12 + (v_i % 5), CURRENT_DATE - 45)
        ON CONFLICT DO NOTHING;

        -- B) Preparation / Session Records
        IF v_i <= 5 THEN
            -- PREPARATION PHASE
            INSERT INTO log_clinical_records (id, site_id, practitioner_id, session_number, session_date)
            VALUES (v_session_id, v_site_alpha, v_practitioner_id, 1, CURRENT_DATE)
            ON CONFLICT (id) DO NOTHING;

        ELSIF v_i <= 10 THEN
            -- ACTIVE PHASE
            INSERT INTO log_clinical_records (id, site_id, practitioner_id, session_number, session_date, dosage_mg, substance_id, indication_id)
            VALUES (v_session_id, v_site_alpha, v_practitioner_id, 1, CURRENT_DATE, 
                   25, v_sub_psilo, v_ind_mdd)
            ON CONFLICT (id) DO NOTHING;

            INSERT INTO log_session_vitals (session_id, recorded_at, heart_rate, bp_systolic, bp_diastolic, oxygen_saturation)
            VALUES (v_session_id, NOW() - INTERVAL '10 minutes', 75, 120, 80, 98);

        ELSE
            -- INTEGRATION PHASE
            INSERT INTO log_clinical_records (id, site_id, practitioner_id, session_number, session_date, dosage_mg, substance_id, indication_id)
            VALUES (v_session_id, v_site_alpha, v_practitioner_id, 1, CURRENT_DATE - INTERVAL '30 days', 
                   25, v_sub_psilo, v_ind_mdd)
            ON CONFLICT (id) DO NOTHING;

            -- Longitudinal Assessments (Improvement curves)
            INSERT INTO log_longitudinal_assessments (patient_uuid, session_id, assessment_date, phq9_score, gad7_score, days_post_session)
            VALUES 
                (v_patient_uuid, v_session_id, CURRENT_DATE - INTERVAL '30 days', 22, 20, 0),
                (v_patient_uuid, v_session_id, CURRENT_DATE - INTERVAL '14 days', 14, 12, 14),
                (v_patient_uuid, v_session_id, CURRENT_DATE,                       6, 4, 30)
            ON CONFLICT DO NOTHING;

            -- Pulse Checks
            INSERT INTO log_pulse_checks (patient_uuid, session_id, check_date, connection_level, sleep_quality, mood_level)
            SELECT v_patient_uuid, v_session_id, (CURRENT_DATE - (d || ' days')::interval)::date, 4, 4, 4
            FROM generate_series(0, 14) d
            ON CONFLICT DO NOTHING;
        END IF;

    END LOOP;

    RAISE NOTICE 'Successfully seeded 20 dummy protocols.';

END $$;
