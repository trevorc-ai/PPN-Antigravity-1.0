-- ============================================
-- DATABASE AUDIT SCRIPT
-- ============================================
-- Purpose: Comprehensive audit of database security, performance, and integrity
-- Author: SOOP
-- Date: 2026-02-15
-- ============================================

-- ============================================
-- SECTION 1: RLS POLICY AUDIT
-- ============================================

-- List all tables and their RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Find tables WITHOUT RLS enabled
SELECT 
    tablename,
    '⚠️ SECURITY RISK: RLS not enabled' as issue
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false
ORDER BY tablename;

-- List all RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Find tables WITH RLS but NO policies
SELECT 
    t.tablename,
    '⚠️ SECURITY RISK: RLS enabled but no policies' as issue
FROM pg_tables t
WHERE t.schemaname = 'public'
AND t.rowsecurity = true
AND NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = t.schemaname
    AND p.tablename = t.tablename
)
ORDER BY t.tablename;

-- ============================================
-- SECTION 2: INDEX AUDIT
-- ============================================

-- List all foreign key columns
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

-- Find foreign keys WITHOUT indexes
SELECT 
    tc.table_name,
    kcu.column_name,
    '⚠️ PERFORMANCE: Missing index on FK' as issue
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND NOT EXISTS (
    SELECT 1 FROM pg_indexes i
    WHERE i.schemaname = 'public'
    AND i.tablename = tc.table_name
    AND i.indexdef LIKE '%' || kcu.column_name || '%'
)
ORDER BY tc.table_name, kcu.column_name;

-- List all existing indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================
-- SECTION 3: SCHEMA CONSISTENCY AUDIT
-- ============================================

-- Check table naming conventions
SELECT 
    tablename,
    CASE 
        WHEN tablename LIKE 'ref_%' THEN 'Reference Table'
        WHEN tablename LIKE 'log_%' THEN 'Log Table'
        WHEN tablename IN ('sites', 'user_sites', 'user_profiles', 'user_subscriptions') THEN 'Core Table'
        ELSE '⚠️ NAMING: Non-standard table name'
    END as table_type
FROM pg_tables
WHERE schemaname = 'public'
AND tablename NOT LIKE 'pg_%'
ORDER BY table_type, tablename;

-- Find tables with TEXT columns (potential PHI risk)
SELECT 
    table_name,
    column_name,
    data_type,
    CASE 
        WHEN table_name LIKE 'log_%' AND data_type IN ('text', 'character varying') 
        THEN '⚠️ SECURITY: TEXT column in log table (PHI risk)'
        ELSE 'OK'
    END as risk_assessment
FROM information_schema.columns
WHERE table_schema = 'public'
AND data_type IN ('text', 'character varying')
AND table_name NOT LIKE 'ref_%'
ORDER BY risk_assessment DESC, table_name, column_name;

-- ============================================
-- SECTION 4: DATA INTEGRITY AUDIT
-- ============================================

-- Check for columns that should be NOT NULL but aren't
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    '⚠️ DATA INTEGRITY: Primary data column allows NULL' as issue
FROM information_schema.columns
WHERE table_schema = 'public'
AND is_nullable = 'YES'
AND (
    column_name IN ('user_id', 'site_id', 'created_by', 'created_at')
    OR (table_name LIKE 'ref_%' AND column_name LIKE '%_name')
)
ORDER BY table_name, column_name;

-- Find tables without created_at timestamp
SELECT 
    tablename,
    '⚠️ AUDIT: Missing created_at timestamp' as issue
FROM pg_tables t
WHERE schemaname = 'public'
AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns c
    WHERE c.table_schema = 'public'
    AND c.table_name = t.tablename
    AND c.column_name = 'created_at'
)
ORDER BY tablename;

-- ============================================
-- SECTION 5: SECURITY REVIEW
-- ============================================

-- Check user_sites table for proper isolation
SELECT 
    'user_sites' as table_name,
    COUNT(*) as total_rows,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT site_id) as unique_sites
FROM user_sites;

-- Verify RLS policies on critical tables
SELECT 
    tablename,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '🚨 CRITICAL: No RLS policies'
        WHEN COUNT(*) < 2 THEN '⚠️ WARNING: Only 1 policy (may need read + write)'
        ELSE '✅ OK'
    END as status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
    'user_profiles', 'user_sites', 'log_clinical_records', 
    'log_outcomes', 'log_sm_sessions', 'log_patient_flow_events'
)
GROUP BY tablename
ORDER BY policy_count ASC;

-- ============================================
-- SECTION 6: SUMMARY STATISTICS
-- ============================================

-- Table count by type
SELECT 
    CASE 
        WHEN tablename LIKE 'ref_%' THEN 'Reference Tables'
        WHEN tablename LIKE 'log_%' THEN 'Log Tables'
        ELSE 'Core Tables'
    END as table_category,
    COUNT(*) as table_count
FROM pg_tables
WHERE schemaname = 'public'
GROUP BY table_category
ORDER BY table_category;

-- RLS coverage
SELECT 
    COUNT(*) FILTER (WHERE rowsecurity = true) as tables_with_rls,
    COUNT(*) FILTER (WHERE rowsecurity = false) as tables_without_rls,
    COUNT(*) as total_tables,
    ROUND(100.0 * COUNT(*) FILTER (WHERE rowsecurity = true) / COUNT(*), 2) as rls_coverage_percent
FROM pg_tables
WHERE schemaname = 'public';

-- ============================================
-- END OF AUDIT SCRIPT
-- ============================================
