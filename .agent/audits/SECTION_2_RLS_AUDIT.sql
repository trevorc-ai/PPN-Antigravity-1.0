-- ============================================================================
-- SECTION 2: RLS SECURITY AUDIT
-- ============================================================================
-- Check which tables do NOT have Row Level Security enabled

SELECT 
    '❌ CRITICAL: No RLS' as status,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
  AND tablename LIKE 'log_%'  -- Focus on patient data tables
ORDER BY tablename;

-- Expected: ZERO rows (all log_* tables should have RLS enabled)
-- If you see ANY rows, users could access each other's data
