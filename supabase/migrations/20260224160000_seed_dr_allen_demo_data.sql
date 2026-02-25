-- ============================================================================
-- DR. ALLEN DEMO DATA INJECTION
-- ============================================================================
-- Purpose: Safely obliterate orphaned Protocol/Clinical records for the active
--          demo user and inject 3 pristine, fully compliant records targeting 
--          the strict UUID schema changes (WO-416, 054, etc.).
-- ============================================================================

DO $$
DECLARE
    v_user_uuid UUID;
    v_site_alpha UUID;
    v_site_beta UUID;
    v_substance_mdma BIGINT;
    v_substance_psilocybin BIGINT;
    v_substance_ketamine BIGINT;
    v_session_a UUID := gen_random_uuid();
    v_session_b UUID := gen_random_uuid();
    v_session_c UUID := gen_random_uuid();
BEGIN
    -- 1. Identify the active User UUID from the Supabase auth schema
    SELECT id INTO v_user_uuid FROM auth.users WHERE email = 'trevorcalton@gmail.com' LIMIT 1;
    
    IF v_user_uuid IS NULL THEN
        RAISE NOTICE 'Demo user trevorcalton@gmail.com not found. Demo injection skipped.';
        RETURN;
    END IF;

    -- 2. Clean up any orphaned ghost protocols attached to this user
    DELETE FROM public.log_clinical_records WHERE practitioner_id = v_user_uuid;
    -- Note: ON DELETE CASCADE (if configured) handles children, if not, we create fresh anyway.

    -- 3. Resolve Site Links
    SELECT site_id INTO v_site_alpha FROM public.log_sites WHERE site_name = 'Demo Site Alpha' LIMIT 1;
    SELECT site_id INTO v_site_beta FROM public.log_sites WHERE site_name = 'Demo Site Beta' LIMIT 1;

    -- Ensure User is strictly linked to Demo Site Alpha (Required for RLS visibility)
    IF v_site_alpha IS NOT NULL THEN
        INSERT INTO public.log_user_sites (user_id, site_id, role, is_active)
        VALUES (v_user_uuid, v_site_alpha, 'clinician', true)
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4. Resolve exact Substance IDs from the new ref_ tables
    SELECT substance_id INTO v_substance_mdma FROM public.ref_substances WHERE substance_name ILIKE '%MDMA%' LIMIT 1;
    SELECT substance_id INTO v_substance_psilocybin FROM public.ref_substances WHERE substance_name ILIKE '%Psilocybin%' LIMIT 1;
    SELECT substance_id INTO v_substance_ketamine FROM public.ref_substances WHERE substance_name ILIKE '%Ketamine%' LIMIT 1;

    -- 5. Seed Pristine, Highly Compliant Clinical Records (Dashboards)
    -- Dr. Allen Demo - MDMA Protocol
    INSERT INTO public.log_clinical_records
        (id, practitioner_id, patient_link_code, site_id, substance_id, session_date, session_number, session_type)
    VALUES
        (v_session_a, v_user_uuid, 'PT-XQY4A9', v_site_alpha, COALESCE(v_substance_mdma, 1), CURRENT_DATE - INTERVAL '14 days', 1, 'Dosing Session'),
        (v_session_b, v_user_uuid, 'PT-BZT8M2', v_site_alpha, COALESCE(v_substance_psilocybin, 2), CURRENT_DATE - INTERVAL '30 days', 1, 'Dosing Session'),
        (v_session_c, v_user_uuid, 'PT-KLV7P5', v_site_alpha, COALESCE(v_substance_ketamine, 3), CURRENT_DATE, 1, 'Preparation');

    -- 6. Add rich dashboard context data
    -- (Baseline Assessments map risk factors on the UI)
    INSERT INTO public.log_baseline_assessments (patient_id, patient_uuid, site_id, assessment_date, phq9_score, gad7_score)
    VALUES
        ('PT-XQY4A9', gen_random_uuid(), v_site_alpha, CURRENT_DATE - INTERVAL '14 days', 18, 15),
        ('PT-BZT8M2', gen_random_uuid(), v_site_alpha, CURRENT_DATE - INTERVAL '30 days', 22, 19),
        ('PT-KLV7P5', gen_random_uuid(), v_site_alpha, CURRENT_DATE, 14, 12);

    RAISE NOTICE 'Demo Data successfully initialized for Dr. Allen!';
END $$;
