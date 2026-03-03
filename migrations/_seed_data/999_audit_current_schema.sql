-- ============================================================================
-- EMERGENCY SCHEMA AUDIT
-- ============================================================================
-- Purpose: Identify which tables exist and which columns are missing
-- Date: 2026-02-15
-- ============================================================================

-- 1. List all tables in public schema
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check if log_clinical_records exists and what columns it has
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'log_clinical_records'
ORDER BY ordinal_position;

-- 3. Check if ref_substances exists and what columns it has
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'ref_substances'
ORDER BY ordinal_position;

-- 4. Check if sites table exists
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'sites'
ORDER BY ordinal_position;

-- 5. Check if user_sites table exists
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_sites'
ORDER BY ordinal_position;

-- ============================================================================
-- CRITICAL COLUMN CHECKS
-- ============================================================================

-- Check for subject_id column in log_clinical_records
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND table_name = 'log_clinical_records' 
              AND column_name = 'subject_id'
        ) THEN '✅ subject_id EXISTS in log_clinical_records'
        ELSE '❌ subject_id MISSING from log_clinical_records'
    END as subject_id_status;

-- Check for substance_name column in ref_substances
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND table_name = 'ref_substances' 
              AND column_name = 'substance_name'
        ) THEN '✅ substance_name EXISTS in ref_substances'
        ELSE '❌ substance_name MISSING from ref_substances'
    END as substance_name_status;

-- ============================================================================
-- END AUDIT
-- ============================================================================
