-- ============================================================================
-- SECTION 3: VALIDATION CONTROLS CHECK
-- ============================================================================
-- Check Foreign Key Coverage on log_* tables

SELECT 
    '✅ Foreign Key Constraint' as status,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name LIKE 'log_%'
ORDER BY tc.table_name, kcu.column_name;

-- Expected: Multiple rows showing foreign keys to ref_* tables
-- This confirms data uses controlled values, not free-text
