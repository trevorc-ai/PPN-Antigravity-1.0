-- ============================================================================
-- SCHEMA AUDIT: Find Type Inconsistencies
-- ============================================================================
-- Purpose: Identify tables where site_id has different data types
-- This is blocking RLS policy fixes
-- ============================================================================

-- Check site_id column types across all tables
SELECT 
    table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'site_id'
ORDER BY data_type, table_name;

-- Check user_id column types
SELECT 
    table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'user_id'
ORDER BY data_type, table_name;

-- Summary
DO $$
DECLARE
    v_uuid_count INTEGER;
    v_bigint_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_uuid_count
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND column_name = 'site_id' 
      AND data_type = 'uuid';
    
    SELECT COUNT(*) INTO v_bigint_count
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND column_name = 'site_id' 
      AND data_type = 'bigint';
    
    RAISE NOTICE '=== SITE_ID TYPE AUDIT ===';
    RAISE NOTICE 'Tables with site_id as UUID: %', v_uuid_count;
    RAISE NOTICE 'Tables with site_id as BIGINT: %', v_bigint_count;
    
    IF v_uuid_count > 0 AND v_bigint_count > 0 THEN
        RAISE WARNING '❌ SCHEMA INCONSISTENCY: site_id has mixed types!';
        RAISE NOTICE 'This must be fixed before RLS policies can work correctly.';
    END IF;
END $$;
