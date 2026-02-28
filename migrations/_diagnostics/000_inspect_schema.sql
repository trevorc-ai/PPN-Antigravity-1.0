-- ============================================================================
-- COMPREHENSIVE SCHEMA INSPECTION
-- ============================================================================
-- Purpose: Show complete schema for all tables in public schema
-- Date: February 8, 2026
-- Safe to run: YES (read-only, no modifications)
-- ============================================================================

-- Show all tables
SELECT 
    '=== ALL TABLES IN PUBLIC SCHEMA ===' AS info;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================================================
-- DETAILED COLUMN INFORMATION FOR EACH TABLE
-- ============================================================================

-- sites table
SELECT '=== SITES TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'sites'
ORDER BY ordinal_position;

-- user_sites table
SELECT '=== USER_SITES TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_sites'
ORDER BY ordinal_position;

-- ref_substances table
SELECT '=== REF_SUBSTANCES TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_substances'
ORDER BY ordinal_position;

-- ref_routes table
SELECT '=== REF_ROUTES TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_routes'
ORDER BY ordinal_position;

-- ref_support_modality table
SELECT '=== REF_SUPPORT_MODALITY TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_support_modality'
ORDER BY ordinal_position;

-- log_clinical_records table
SELECT '=== LOG_CLINICAL_RECORDS TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'log_clinical_records'
ORDER BY ordinal_position;

-- log_outcomes table
SELECT '=== LOG_OUTCOMES TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'log_outcomes'
ORDER BY ordinal_position;

-- log_consent table
SELECT '=== LOG_CONSENT TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'log_consent'
ORDER BY ordinal_position;

-- log_interventions table
SELECT '=== LOG_INTERVENTIONS TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'log_interventions'
ORDER BY ordinal_position;

-- log_safety_events table
SELECT '=== LOG_SAFETY_EVENTS TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'log_safety_events'
ORDER BY ordinal_position;

-- protocols table
SELECT '=== PROTOCOLS TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'protocols'
ORDER BY ordinal_position;

-- system_events table
SELECT '=== SYSTEM_EVENTS TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'system_events'
ORDER BY ordinal_position;

-- ============================================================================
-- REFERENCE TABLES (all ref_* tables)
-- ============================================================================

SELECT '=== REF_ASSESSMENT_INTERVAL TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_assessment_interval'
ORDER BY ordinal_position;

SELECT '=== REF_ASSESSMENTS TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_assessments'
ORDER BY ordinal_position;

SELECT '=== REF_JUSTIFICATION_CODES TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_justification_codes'
ORDER BY ordinal_position;

SELECT '=== REF_PRIMARY_ADVERSE TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_primary_adverse'
ORDER BY ordinal_position;

SELECT '=== REF_RESOLUTION_STATUS TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_resolution_status'
ORDER BY ordinal_position;

SELECT '=== REF_SAFETY_EVENTS TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_safety_events'
ORDER BY ordinal_position;

SELECT '=== REF_SEVERITY_GRADE TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_severity_grade'
ORDER BY ordinal_position;

SELECT '=== REF_SMOKING_STATUS TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_smoking_status'
ORDER BY ordinal_position;

SELECT '=== REF_KNOWLEDGE_GRAPH TABLE ===' AS info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ref_knowledge_graph'
ORDER BY ordinal_position;

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================================================

SELECT '=== FOREIGN KEY CONSTRAINTS ===' AS info;
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================================================
-- PRIMARY KEYS
-- ============================================================================

SELECT '=== PRIMARY KEYS ===' AS info;
SELECT
    tc.table_name,
    kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT '=== SCHEMA INSPECTION COMPLETE ===' AS info;

DO $$
DECLARE
    table_count INTEGER;
    total_columns INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    
    SELECT COUNT(*) INTO total_columns
    FROM information_schema.columns
    WHERE table_schema = 'public';
    
    RAISE NOTICE '';
    RAISE NOTICE '📊 Database Summary:';
    RAISE NOTICE '  • Total tables: %', table_count;
    RAISE NOTICE '  • Total columns: %', total_columns;
    RAISE NOTICE '';
    RAISE NOTICE '✅ Schema inspection complete';
    RAISE NOTICE '📋 Please share all output above to proceed with migration';
END $$;
