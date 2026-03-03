-- ============================================================================
-- VERIFICATION SCRIPT: Shadow Market Schema (WO_002)
-- ============================================================================
-- Purpose: Verify that migration 022 executed successfully
-- Run this AFTER executing 022_shadow_market_schema.sql
-- ============================================================================

\echo '========================================='
\echo 'Shadow Market Schema Verification'
\echo '========================================='
\echo ''

-- 1. Verify Reference Tables Exist
\echo '1. Checking Reference Tables...'
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_name IN ('ref_sm_substances', 'ref_sm_interventions', 'ref_sm_risk_flags')
ORDER BY table_name;

-- 2. Verify Log Tables Exist
\echo ''
\echo '2. Checking Log Tables...'
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_name IN ('log_sm_sessions', 'log_sm_doses', 'log_sm_interventions', 'log_sm_risk_reports')
ORDER BY table_name;

-- 3. Verify RLS is Enabled
\echo ''
\echo '3. Checking Row Level Security...'
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
    AND tablename LIKE '%sm_%'
ORDER BY tablename;

-- 4. Verify RLS Policies
\echo ''
\echo '4. Checking RLS Policies...'
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command
FROM pg_policies
WHERE schemaname = 'public' 
    AND tablename LIKE '%sm_%'
ORDER BY tablename, policyname;

-- 5. Verify RPC Function Exists
\echo ''
\echo '5. Checking RPC Function...'
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public' 
    AND routine_name = 'check_client_risk';

-- 6. Verify Indexes
\echo ''
\echo '6. Checking Indexes...'
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public' 
    AND tablename LIKE '%sm_%'
ORDER BY tablename, indexname;

-- 7. Verify Seed Data
\echo ''
\echo '7. Checking Seed Data...'
SELECT 'ref_sm_substances' as table_name, COUNT(*) as row_count FROM public.ref_sm_substances
UNION ALL
SELECT 'ref_sm_interventions', COUNT(*) FROM public.ref_sm_interventions
UNION ALL
SELECT 'ref_sm_risk_flags', COUNT(*) FROM public.ref_sm_risk_flags;

-- 8. Test RPC Function
\echo ''
\echo '8. Testing check_client_risk() Function...'
SELECT public.check_client_risk('test_hash_12345') as risk_count;

\echo ''
\echo '========================================='
\echo 'Verification Complete!'
\echo '========================================='
