-- ============================================================================
-- EMERGENCY DIAGNOSTIC: What exists in the database RIGHT NOW?
-- ============================================================================
-- Run this in Supabase SQL Editor to see current state
-- ============================================================================

-- 1. Does log_clinical_records table exist?
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'log_clinical_records'
        ) THEN '✅ log_clinical_records table EXISTS'
        ELSE '❌ log_clinical_records table MISSING'
    END as table_status;

-- 2. If it exists, what columns does it have?
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'log_clinical_records'
ORDER BY ordinal_position;

-- 3. Does subject_id column exist?
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND table_name = 'log_clinical_records' 
              AND column_name = 'subject_id'
        ) THEN '✅ subject_id column EXISTS'
        ELSE '❌ subject_id column MISSING - THIS IS THE PROBLEM'
    END as subject_id_status;

-- 4. Does ref_substances table exist?
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'ref_substances'
        ) THEN '✅ ref_substances table EXISTS'
        ELSE '❌ ref_substances table MISSING'
    END as ref_substances_status;

-- 5. If ref_substances exists, does it have substance_name?
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND table_name = 'ref_substances' 
              AND column_name = 'substance_name'
        ) THEN '✅ substance_name column EXISTS'
        ELSE '❌ substance_name column MISSING'
    END as substance_name_status;

-- 6. What is the type of site_id in sites table?
SELECT 
    column_name,
    data_type,
    CASE 
        WHEN data_type = 'bigint' THEN '✅ CORRECT (BIGINT)'
        WHEN data_type = 'uuid' THEN '❌ WRONG (should be BIGINT)'
        ELSE '⚠️ UNEXPECTED TYPE'
    END as type_status
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'sites' 
  AND column_name = 'site_id';

-- 7. List ALL tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ============================================================================
-- INSTRUCTIONS:
-- 1. Copy this entire file
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and click "Run"
-- 4. Send SOOP the results
-- ============================================================================
