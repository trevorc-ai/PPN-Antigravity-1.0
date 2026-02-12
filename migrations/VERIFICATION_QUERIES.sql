-- ============================================================================
-- PPN DATABASE GOVERNANCE - VERIFICATION QUERIES
-- ============================================================================
-- Purpose: Run these queries after EVERY schema change to verify compliance
-- Date: 2026-02-10
-- Authority: DATABASE_GOVERNANCE_RULES.md
-- ============================================================================

-- ============================================================================
-- QUERY 1: Confirm RLS Enabled on All Patient-Level Tables
-- ============================================================================
-- Expected: All log_* tables show rls_enabled = true

SELECT
  n.nspname AS schema_name,
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled,
  CASE 
    WHEN c.relrowsecurity THEN '✅ PASS'
    ELSE '❌ FAIL - RLS NOT ENABLED'
  END AS status
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND (
    c.relname LIKE 'log_%'
    OR c.relname IN ('protocols','sites','user_sites','system_events')
  )
ORDER BY table_name;

-- ============================================================================
-- QUERY 2: Find Prohibited Text "Answer Fields" in Patient-Level Logs
-- ============================================================================
-- Action: Flag text columns for conversion to foreign keys
-- Note: Some text columns may be acceptable if they are not "answers"

SELECT
  table_name,
  column_name,
  data_type,
  CASE 
    WHEN column_name IN ('created_at', 'updated_at', 'id', 'site_id', 'practitioner_id', 'patient_link_code_hash', 'source_table', 'notes') 
      THEN '✅ ALLOWED (system field)'
    WHEN column_name LIKE '%_id' 
      THEN '✅ ALLOWED (foreign key)'
    ELSE '⚠️ REVIEW REQUIRED - Potential answer field'
  END AS compliance_status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name LIKE 'log_%'
  AND data_type IN ('text', 'character varying')
ORDER BY 
  CASE 
    WHEN column_name IN ('created_at', 'updated_at', 'id', 'site_id', 'practitioner_id', 'patient_link_code_hash', 'source_table', 'notes') THEN 1
    WHEN column_name LIKE '%_id' THEN 2
    ELSE 3
  END,
  table_name, 
  ordinal_position;

-- ============================================================================
-- QUERY 3: Confirm Small-Cell Suppression in Benchmark Views
-- ============================================================================
-- Action: For each view, confirm N-threshold filtering exists in SQL definition

SELECT
  table_schema,
  table_name,
  '⚠️ MANUAL REVIEW REQUIRED' AS status,
  'Check view definition for N >= 10 filtering' AS action
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name LIKE 'v_%'
ORDER BY table_name;

-- ============================================================================
-- QUERY 4: Verify All Reference Tables Have Proper Structure
-- ============================================================================
-- Expected: All ref_* tables have id, name/label, is_active, created_at

SELECT
  t.table_name,
  BOOL_OR(c.column_name LIKE '%_id') AS has_id_column,
  BOOL_OR(c.column_name IN ('name', 'label', 'display_name')) AS has_label_column,
  BOOL_OR(c.column_name = 'is_active') AS has_is_active,
  BOOL_OR(c.column_name = 'created_at') AS has_created_at,
  CASE 
    WHEN BOOL_OR(c.column_name LIKE '%_id') 
      AND BOOL_OR(c.column_name IN ('name', 'label', 'display_name'))
      AND BOOL_OR(c.column_name = 'is_active')
      AND BOOL_OR(c.column_name = 'created_at')
    THEN '✅ PASS'
    ELSE '⚠️ INCOMPLETE STRUCTURE'
  END AS status
FROM information_schema.tables t
LEFT JOIN information_schema.columns c 
  ON t.table_name = c.table_name 
  AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public'
  AND t.table_name LIKE 'ref_%'
  AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name
ORDER BY t.table_name;

-- ============================================================================
-- QUERY 5: Find Foreign Keys Without ON DELETE Actions
-- ============================================================================
-- Expected: All foreign keys should have ON DELETE CASCADE or SET NULL

SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule,
  CASE 
    WHEN rc.delete_rule IN ('CASCADE', 'SET NULL', 'RESTRICT') THEN '✅ PASS'
    WHEN rc.delete_rule = 'NO ACTION' THEN '⚠️ SHOULD SPECIFY CASCADE OR SET NULL'
    ELSE '❌ FAIL - NO DELETE RULE'
  END AS status
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================================================
-- QUERY 6: Verify Indexes Exist on All Foreign Keys
-- ============================================================================
-- Expected: Every foreign key column should have an index

SELECT
  t.table_name,
  c.column_name,
  CASE 
    WHEN i.indexname IS NOT NULL THEN '✅ INDEXED'
    ELSE '⚠️ MISSING INDEX - Performance risk'
  END AS index_status,
  i.indexname
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.columns AS c
  ON kcu.table_name = c.table_name
  AND kcu.column_name = c.column_name
  AND kcu.table_schema = c.table_schema
LEFT JOIN pg_indexes AS i
  ON i.tablename = c.table_name
  AND i.schemaname = c.table_schema
  AND i.indexdef LIKE '%' || c.column_name || '%'
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY 
  CASE WHEN i.indexname IS NULL THEN 1 ELSE 2 END,
  t.table_name, 
  c.column_name;

-- ============================================================================
-- QUERY 7: Check for Orphaned Records (Foreign Key Violations)
-- ============================================================================
-- Note: This is a template - customize for your specific tables

-- Example: Check log_clinical_records for orphaned substance_id
SELECT 
  'log_clinical_records' AS table_name,
  'substance_id' AS column_name,
  COUNT(*) AS orphaned_count
FROM log_clinical_records lcr
WHERE substance_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM ref_substances rs 
    WHERE rs.substance_id = lcr.substance_id
  );

-- Add similar checks for other foreign key relationships

-- ============================================================================
-- QUERY 8: Verify Updated_At Triggers Exist
-- ============================================================================
-- Expected: All tables with updated_at column should have a trigger

SELECT
  c.table_name,
  BOOL_OR(c.column_name = 'updated_at') AS has_updated_at_column,
  BOOL_OR(t.trigger_name LIKE '%updated_at%') AS has_updated_at_trigger,
  CASE 
    WHEN BOOL_OR(c.column_name = 'updated_at') AND BOOL_OR(t.trigger_name LIKE '%updated_at%') 
      THEN '✅ PASS'
    WHEN BOOL_OR(c.column_name = 'updated_at') AND NOT BOOL_OR(t.trigger_name LIKE '%updated_at%')
      THEN '❌ FAIL - Missing trigger'
    ELSE '✅ N/A - No updated_at column'
  END AS status
FROM information_schema.columns c
LEFT JOIN information_schema.triggers t
  ON c.table_name = t.event_object_table
  AND c.table_schema = t.event_object_schema
WHERE c.table_schema = 'public'
  AND c.table_name NOT LIKE 'pg_%'
GROUP BY c.table_name
ORDER BY c.table_name;

-- ============================================================================
-- QUERY 9: Summary Report
-- ============================================================================

SELECT 
  'GOVERNANCE VERIFICATION SUMMARY' AS report_section,
  NOW() AS run_at,
  current_user AS run_by,
  current_database() AS database_name;

-- Count tables by type
SELECT 
  'Table Counts' AS metric,
  COUNT(*) FILTER (WHERE table_name LIKE 'log_%') AS log_tables,
  COUNT(*) FILTER (WHERE table_name LIKE 'ref_%') AS ref_tables,
  COUNT(*) FILTER (WHERE table_name NOT LIKE 'log_%' AND table_name NOT LIKE 'ref_%') AS other_tables,
  COUNT(*) AS total_tables
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';

-- ============================================================================
-- END OF VERIFICATION QUERIES
-- ============================================================================

-- INSTRUCTIONS:
-- 1. Run all queries after every schema change
-- 2. Review all ❌ FAIL and ⚠️ WARNING results
-- 3. Fix issues before proceeding
-- 4. Document results in migration commit message
-- 5. Store baseline results for comparison
