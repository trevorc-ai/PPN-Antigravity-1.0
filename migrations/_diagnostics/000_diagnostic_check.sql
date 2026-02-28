-- ============================================================================
-- DIAGNOSTIC CHECK - Run this BEFORE migration 001
-- ============================================================================
-- Purpose: Check what tables already exist and their schemas
-- Date: February 8, 2026
-- Safe to run: YES (read-only queries)
-- ============================================================================

-- Check if sites table exists and show its columns
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sites') THEN
        RAISE NOTICE '✅ sites table EXISTS';
        RAISE NOTICE 'Columns in sites table:';
    ELSE
        RAISE NOTICE '❌ sites table DOES NOT EXIST';
    END IF;
END $$;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'sites'
ORDER BY ordinal_position;

-- Check if user_sites table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_sites') THEN
        RAISE NOTICE '✅ user_sites table EXISTS';
    ELSE
        RAISE NOTICE '❌ user_sites table DOES NOT EXIST';
    END IF;
END $$;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_sites'
ORDER BY ordinal_position;

-- Check other potentially existing tables
DO $$
DECLARE
    table_list TEXT[] := ARRAY[
        'log_patient_flow_events',
        'ref_flow_event_types',
        'ref_substances',
        'ref_routes',
        'ref_support_modality',
        'log_clinical_records',
        'log_outcomes',
        'log_consent',
        'log_interventions',
        'log_safety_events'
    ];
    tbl TEXT;
BEGIN
    RAISE NOTICE '=== Checking for existing tables ===';
    FOREACH tbl IN ARRAY table_list
    LOOP
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
            RAISE NOTICE '✅ % EXISTS', tbl;
        ELSE
            RAISE NOTICE '❌ % does not exist', tbl;
        END IF;
    END LOOP;
END $$;

-- List ALL tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
