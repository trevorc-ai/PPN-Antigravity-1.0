-- ============================================================================
-- PPN STAGING SEED: Jason's 20 Dummy Patient Protocols
-- Email:    jbluths@gmail.com
-- IDs:      PT-TEST0021 through PT-TEST0040
-- Purpose:  Duplicate of the primary seed set scoped to Jason's practitioner
--           account and site, so he can test and view all platform components.
-- Zero PHI: Synthetic Subject IDs only.
-- Safe:     Additive-only. ON CONFLICT DO NOTHING throughout.
-- ============================================================================

DO $$
DECLARE
    v_site_jason     UUID;
    v_jason_id       UUID;
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
    v_offset         INTEGER := 20;  -- Offsets IDs to PT-TEST0021+
BEGIN
    -- 1. Resolve Jason's user account by email
    SELECT id INTO v_jason_id FROM auth.users WHERE email = 'jbluths@gmail.com' LIMIT 1;
    IF v_jason_id IS NULL THEN
        RAISE EXCEPTION 'User jbluths@gmail.com not found in auth.users. Ensure Jason has signed up in staging first.';
    END IF;

    -- 2. Resolve Jason's site (the site he belongs to via log_user_sites)
    SELECT site_id INTO v_site_jason FROM public.log_user_sites WHERE user_id = v_jason_id LIMIT 1;
    IF v_site_jason IS NULL THEN
        -- Fallback: drop him into the first available site
        SELECT site_id INTO v_site_jason FROM public.log_sites LIMIT 1;
        RAISE NOTICE 'Jason has no site in log_user_sites — assigning to site %', v_site_jason;
    END IF;

    -- 3. Resolve Substances (same ref data as the primary seed)
    SELECT substance_id INTO v_sub_psilo FROM public.ref_substances WHERE substance_name = 'Psilocybin';
    SELECT substance_id INTO v_sub_mdma  FROM public.ref_substances WHERE substance_name = 'MDMA';
    SELECT substance_id INTO v_sub_keta  FROM public.ref_substances WHERE substance_name = 'Ketamine';
    SELECT substance_id INTO v_sub_5meo  FROM public.ref_substances WHERE substance_name = '5-MeO-DMT';
    SELECT substance_id INTO v_sub_ibog  FROM public.ref_substances WHERE substance_name = 'Ibogaine';

    -- 4. Resolve Indications
    SELECT indication_id INTO v_ind_mdd  FROM public.ref_indications WHERE indication_name ILIKE '%MDD%';
    SELECT indication_id INTO v_ind_trd  FROM public.ref_indications WHERE indication_name ILIKE '%TRD%';
    SELECT indication_id INTO v_ind_ptsd FROM public.ref_indications WHERE indication_name ILIKE '%PTSD%';
    SELECT indication_id INTO v_ind_gad  FROM public.ref_indications WHERE indication_name ILIKE '%GAD%';
    SELECT indication_id INTO v_ind_sud  FROM public.ref_indications WHERE indication_name ILIKE '%Substance%';

    RAISE NOTICE 'Seeding 20 patients for Jason (%) at site %...', v_jason_id, v_site_jason;

    -- 5. Seed PT-TEST0021 through PT-TEST0040
    FOR v_i IN 1..20 LOOP
        v_session_id   := gen_random_uuid();
        v_patient_uuid := gen_random_uuid();

        -- A) Baseline Assessment (master patient record for this iteration)
        INSERT INTO log_baseline_assessments (patient_uuid, site_id, phq9_score, gad7_score, assessment_date)
        VALUES (v_patient_uuid, v_site_jason, 15 + (v_i % 10), 12 + (v_i % 5), CURRENT_DATE - 45)
        ON CONFLICT DO NOTHING;

        -- B) Clinical Records by Phase

        IF v_i <= 5 THEN
            -- ── PREPARATION (PT-TEST0021 to PT-TEST0025) ──────────────────────
            INSERT INTO log_clinical_records (id, site_id, practitioner_id, session_number, session_date, created_by)
            VALUES (v_session_id, v_site_jason, v_jason_id, 1, CURRENT_DATE, v_jason_id)
            ON CONFLICT (id) DO NOTHING;

        ELSIF v_i <= 10 THEN
            -- ── ACTIVE / DOSING (PT-TEST0026 to PT-TEST0030) ──────────────────
            INSERT INTO log_clinical_records (id, site_id, practitioner_id, session_number, session_date, dosage_mg, substance_id, indication_id, created_by)
            VALUES (
                v_session_id, v_site_jason, v_jason_id, 1, CURRENT_DATE,
                CASE v_i
                    WHEN 6  THEN 25   -- Psilocybin / MDD
                    WHEN 7  THEN 120  -- MDMA / PTSD
                    WHEN 8  THEN 50   -- Ketamine / TRD
                    WHEN 9  THEN 15   -- 5-MeO-DMT / GAD
                    ELSE    500       -- Ibogaine / SUD
                END,
                CASE v_i
                    WHEN 6  THEN v_sub_psilo
                    WHEN 7  THEN v_sub_mdma
                    WHEN 8  THEN v_sub_keta
                    WHEN 9  THEN v_sub_5meo
                    ELSE    v_sub_ibog
                END,
                CASE v_i
                    WHEN 6  THEN v_ind_mdd
                    WHEN 7  THEN v_ind_ptsd
                    WHEN 8  THEN v_ind_trd
                    WHEN 9  THEN v_ind_gad
                    ELSE    v_ind_sud
                END,
                v_jason_id
            )
            ON CONFLICT (id) DO NOTHING;

            -- Session Vitals
            INSERT INTO log_session_vitals (session_id, recorded_at, heart_rate, bp_systolic, bp_diastolic, oxygen_saturation, created_by)
            VALUES (v_session_id, NOW() - INTERVAL '10 minutes', 72 + v_i, 118 + v_i, 78 + v_i, 98, v_jason_id);

        ELSE
            -- ── INTEGRATION (PT-TEST0031 to PT-TEST0040) ──────────────────────
            INSERT INTO log_clinical_records (id, site_id, practitioner_id, session_number, session_date, dosage_mg, substance_id, indication_id, created_by)
            VALUES (v_session_id, v_site_jason, v_jason_id, 1, CURRENT_DATE - INTERVAL '30 days',
                    25, v_sub_psilo, v_ind_mdd, v_jason_id)
            ON CONFLICT (id) DO NOTHING;

            -- Longitudinal symptom decay curve
            INSERT INTO log_longitudinal_assessments (patient_uuid, session_id, assessment_date, phq9_score, gad7_score, days_post_session, created_by)
            VALUES
                (v_patient_uuid, v_session_id, CURRENT_DATE - INTERVAL '30 days', 22, 20,  0, v_jason_id),
                (v_patient_uuid, v_session_id, CURRENT_DATE - INTERVAL '21 days', 17, 15,  7, v_jason_id),
                (v_patient_uuid, v_session_id, CURRENT_DATE - INTERVAL '14 days', 12, 10, 14, v_jason_id),
                (v_patient_uuid, v_session_id, CURRENT_DATE - INTERVAL '7 days',   8,  6, 21, v_jason_id),
                (v_patient_uuid, v_session_id, CURRENT_DATE,                        5,  4, 30, v_jason_id)
            ON CONFLICT DO NOTHING;

            -- Integration sessions
            INSERT INTO log_integration_sessions (patient_uuid, dosing_session_id, session_date, attended, created_by)
            VALUES
                (v_patient_uuid, v_session_id, CURRENT_DATE - INTERVAL '23 days', true, v_jason_id),
                (v_patient_uuid, v_session_id, CURRENT_DATE - INTERVAL '9 days',  true, v_jason_id)
            ON CONFLICT DO NOTHING;

            -- Pulse checks (last 14 days)
            INSERT INTO log_pulse_checks (patient_uuid, session_id, check_date, connection_level, sleep_quality, mood_level, created_by)
            SELECT v_patient_uuid, v_session_id,
                   (CURRENT_DATE - (d || ' days')::interval)::date,
                   4, 4, 4, v_jason_id
            FROM generate_series(0, 14) d
            ON CONFLICT DO NOTHING;
        END IF;

    END LOOP;

    RAISE NOTICE 'Successfully seeded 20 dummy protocols for Jason (jbluths@gmail.com).';

END $$;
