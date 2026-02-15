-- ============================================================================
-- RLS SECURITY AUDIT - Comprehensive Check
-- ============================================================================
-- Purpose: Verify all tables have proper RLS policies and no data leakage
-- Author: SOOP
-- Date: 2026-02-15
-- Run this in Supabase SQL Editor to audit RLS configuration
-- ============================================================================

-- SECTION 1: Tables WITHOUT RLS Enabled (CRITICAL SECURITY ISSUE)
-- ============================================================================
SELECT 
    '❌ CRITICAL: No RLS' as status,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
ORDER BY tablename;

-- SECTION 2: Tables WITH RLS but NO POLICIES (BLOCKS ALL ACCESS)
-- ============================================================================
SELECT 
    '⚠️  WARNING: RLS enabled but no policies' as status,
    t.schemaname,
    t.tablename
FROM pg_tables t
WHERE t.schemaname = 'public'
  AND t.rowsecurity = true
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = t.schemaname
      AND p.tablename = t.tablename
  )
ORDER BY t.tablename;

-- SECTION 3: All RLS Policies (Review for Security)
-- ============================================================================
SELECT 
    '✅ Policy Exists' as status,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- SECTION 4: Critical Tables RLS Check
-- ============================================================================
DO $$
DECLARE
    v_critical_tables TEXT[] := ARRAY[
        'log_clinical_records',
        'log_outcomes',
        'log_consent',
        'log_interventions',
        'log_safety_events',
        'sites',
        'user_sites',
        'subscriptions',
        'user_profiles'
    ];
    v_table TEXT;
    v_rls_enabled BOOLEAN;
    v_policy_count INTEGER;
BEGIN
    RAISE NOTICE '=== CRITICAL TABLES RLS AUDIT ===';
    
    FOREACH v_table IN ARRAY v_critical_tables
    LOOP
        -- Check if table exists
        IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = v_table) THEN
            -- Check RLS enabled
            SELECT rowsecurity INTO v_rls_enabled
            FROM pg_tables
            WHERE schemaname = 'public' AND tablename = v_table;
            
            -- Count policies
            SELECT COUNT(*) INTO v_policy_count
            FROM pg_policies
            WHERE schemaname = 'public' AND tablename = v_table;
            
            IF v_rls_enabled AND v_policy_count > 0 THEN
                RAISE NOTICE '✅ %: RLS enabled, % policies', v_table, v_policy_count;
            ELSIF v_rls_enabled AND v_policy_count = 0 THEN
                RAISE WARNING '⚠️  %: RLS enabled but NO POLICIES (blocks all access)', v_table;
            ELSE
                RAISE WARNING '❌ %: RLS NOT ENABLED (CRITICAL SECURITY ISSUE)', v_table;
            END IF;
        ELSE
            RAISE NOTICE '   %: Table does not exist (may be intentional)', v_table;
        END IF;
    END LOOP;
END $$;

-- SECTION 5: Reference Tables RLS Check
-- ============================================================================
SELECT 
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS Enabled'
        ELSE '❌ RLS NOT Enabled'
    END as status,
    tablename,
    (SELECT COUNT(*) FROM pg_policies p WHERE p.tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE schemaname = 'public'
  AND tablename LIKE 'ref_%'
ORDER BY tablename;

-- SECTION 6: Overly Permissive Policies (Security Risk)
-- ============================================================================
SELECT 
    '⚠️  REVIEW: Potentially overly permissive' as status,
    tablename,
    policyname,
    qual as using_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND (
    qual = 'true'  -- Allows access to all rows
    OR qual LIKE '%true%'
  )
  AND tablename LIKE 'log_%'  -- Log tables should NEVER have public access
ORDER BY tablename;

-- SECTION 7: Tables Accessible to Public (Anon Role)
-- ============================================================================
SELECT 
    '⚠️  PUBLIC ACCESS' as status,
    tablename,
    policyname,
    roles
FROM pg_policies
WHERE schemaname = 'public'
  AND 'public' = ANY(roles)
ORDER BY tablename;

-- SECTION 8: Summary Report
-- ============================================================================
DO $$
DECLARE
    v_total_tables INTEGER;
    v_rls_enabled INTEGER;
    v_no_rls INTEGER;
    v_rls_no_policies INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_total_tables
    FROM pg_tables WHERE schemaname = 'public';
    
    SELECT COUNT(*) INTO v_rls_enabled
    FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true;
    
    SELECT COUNT(*) INTO v_no_rls
    FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = false;
    
    SELECT COUNT(*) INTO v_rls_no_policies
    FROM pg_tables t
    WHERE t.schemaname = 'public'
      AND t.rowsecurity = true
      AND NOT EXISTS (
        SELECT 1 FROM pg_policies p
        WHERE p.schemaname = t.schemaname AND p.tablename = t.tablename
      );
    
    RAISE NOTICE '=== RLS AUDIT SUMMARY ===';
    RAISE NOTICE 'Total tables: %', v_total_tables;
    RAISE NOTICE 'RLS enabled: % (%.1f%%)', v_rls_enabled, (v_rls_enabled::FLOAT / v_total_tables * 100);
    RAISE NOTICE 'RLS NOT enabled: % (%.1f%%)', v_no_rls, (v_no_rls::FLOAT / v_total_tables * 100);
    RAISE NOTICE 'RLS enabled but no policies: %', v_rls_no_policies;
    
    IF v_no_rls > 0 THEN
        RAISE WARNING '❌ SECURITY ISSUE: % tables without RLS', v_no_rls;
    END IF;
    
    IF v_rls_no_policies > 0 THEN
        RAISE WARNING '⚠️  WARNING: % tables with RLS but no policies', v_rls_no_policies;
    END IF;
    
    IF v_no_rls = 0 AND v_rls_no_policies = 0 THEN
        RAISE NOTICE '✅ All tables have RLS enabled with policies';
    END IF;
END $$;
