-- ============================================================
-- INSPECTOR SEED: My Protocols Test Data
-- Purpose: Gives trevorcalton@... visible rows on MyProtocols
-- Safe: additive-only INSERTs, no DROP/ALTER
-- Run in: Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
    psilocybin_id  INTEGER;
    mdma_id        INTEGER;
    ketamine_id    INTEGER;
    meo_dmt_id     INTEGER;
    ibogaine_id    INTEGER;
    site_id_val    INTEGER;
BEGIN
    -- Resolve substance FKs
    SELECT substance_id INTO psilocybin_id FROM ref_substances WHERE substance_name ILIKE '%Psilocybin%' LIMIT 1;
    SELECT substance_id INTO mdma_id        FROM ref_substances WHERE substance_name ILIKE '%MDMA%'       LIMIT 1;
    SELECT substance_id INTO ketamine_id    FROM ref_substances WHERE substance_name ILIKE '%Ketamine%'   LIMIT 1;
    SELECT substance_id INTO meo_dmt_id     FROM ref_substances WHERE substance_name ILIKE '%MeO%'        LIMIT 1;
    SELECT substance_id INTO ibogaine_id    FROM ref_substances WHERE substance_name ILIKE '%Ibogaine%'   LIMIT 1;

    -- Use first available site (or 1 as fallback)
    SELECT COALESCE(MIN(site_id), 1) INTO site_id_val FROM ref_sites;

    -- Insert 8 test protocols (varied substance, sex, date)
    INSERT INTO public.log_clinical_records
        (site_id, patient_id, substance_id, session_date, patient_sex, dosage_amount, created_at)
    VALUES
        (site_id_val, 1001, psilocybin_id, CURRENT_DATE - 5,  'Male',       25,  NOW() - INTERVAL '5 days'),
        (site_id_val, 1002, psilocybin_id, CURRENT_DATE - 12, 'Female',     30,  NOW() - INTERVAL '12 days'),
        (site_id_val, 1003, mdma_id,       CURRENT_DATE - 8,  'Non-Binary', 80,  NOW() - INTERVAL '8 days'),
        (site_id_val, 1004, ketamine_id,   CURRENT_DATE - 3,  'Female',     50,  NOW() - INTERVAL '3 days'),
        (site_id_val, 1005, ketamine_id,   CURRENT_DATE - 20, 'Male',       75,  NOW() - INTERVAL '20 days'),
        (site_id_val, 1006, meo_dmt_id,    CURRENT_DATE - 15, 'Female',     15,  NOW() - INTERVAL '15 days'),
        (site_id_val, 1007, ibogaine_id,   CURRENT_DATE - 7,  'Male',       500, NOW() - INTERVAL '7 days'),
        (site_id_val, 1008, psilocybin_id, CURRENT_DATE - 1,  'Female',     20,  NOW() - INTERVAL '1 day');

    RAISE NOTICE 'Inserted 8 test protocol records. Substance IDs: psilocybin=%, mdma=%, ketamine=%, 5-MeO-DMT=%, ibogaine=%',
        psilocybin_id, mdma_id, ketamine_id, meo_dmt_id, ibogaine_id;
END $$;
