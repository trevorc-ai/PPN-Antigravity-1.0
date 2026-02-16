-- ============================================================================
-- COMPLETE DATABASE SECURITY AUDIT - ALL-IN-ONE SCRIPT
-- ============================================================================
-- Work Order: WO_042
-- Author: SOOP
-- Date: 2026-02-16T01:27:30-08:00
-- Purpose: Execute all 4 audit sections in one script
-- Instructions: Copy this entire file and paste into Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- SECTION 1: PHI/PII VERIFICATION AUDIT
-- ============================================================================

-- 1.1: Check for PHI Column Names (CRITICAL)
SELECT 
    '❌ CRITICAL: PHI Column Detected' as status,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN (
    'patient_name', 'first_name', 'last_name', 'full_name',
    'dob', 'date_of_birth', 'birth_date',
    'ssn', 'social_security',
    'mrn', 'medical_record_number',
    'email', 'patient_email',
    'phone', 'phone_number', 'mobile',
    'address', 'street_address', 'home_address',
    'zip', 'zipcode', 'postal_code',
    'city', 'state', 'country'
  )
ORDER BY table_name, column_name;

-- 1.2: Verify Subject ID is UUID (Not Patient Names)
SELECT 
    CASE 
        WHEN data_type = 'uuid' THEN '✅ Correct: UUID'
        ELSE '❌ WRONG: Not UUID'
    END as status,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN ('subject_id', 'patient_id', 'client_id')
ORDER BY table_name;

-- 1.3: Check for Free-Text Fields in Patient/Session Tables
SELECT 
    '⚠️  WARNING: Free-text field in sensitive table' as status,
    table_name,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'log_clinical_records',
    'log_outcomes',
    'log_consent',
    'log_interventions',
    'log_safety_events',
    'log_sessions',
    'log_doses',
    'log_patient_flow_events',
    'log_baseline_assessments',
    'log_session_events',
    'log_session_vitals',
    'log_pulse_checks',
    'log_longitudinal_assessments',
    'log_behavioral_changes',
    'log_integration_sessions',
    'log_red_alerts'
  )
  AND data_type IN ('text', 'varchar', 'character varying')
  AND column_name NOT IN (
    -- Allowed text fields (controlled values, IDs, hashes)
    'id', 'session_id', 'protocol_id', 'site_id', 'user_id',
    'subject_id', 'client_blind_hash', 'target_client_hash',
    'submission_status', 'event_code', 'stage_name',
    'created_at', 'updated_at', 'status', 'notes_type'
  )
ORDER BY table_name, column_name;

-- 1.4: PHI Summary Report
DO $$
DECLARE
    v_phi_columns INTEGER;
    v_free_text_fields INTEGER;
    v_ref_tables INTEGER;
    v_log_tables INTEGER;
BEGIN
    -- Count PHI columns
    SELECT COUNT(*) INTO v_phi_columns
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name IN (
        'patient_name', 'first_name', 'last_name', 'full_name',
        'dob', 'date_of_birth', 'birth_date',
        'ssn', 'social_security',
        'mrn', 'medical_record_number',
        'email', 'patient_email',
        'phone', 'phone_number', 'mobile',
        'address', 'street_address', 'home_address',
        'zip', 'zipcode', 'postal_code'
      );
    
    -- Count free-text fields in log tables
    SELECT COUNT(*) INTO v_free_text_fields
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name LIKE 'log_%'
      AND data_type IN ('text', 'varchar', 'character varying')
      AND column_name NOT IN (
        'id', 'session_id', 'protocol_id', 'site_id', 'user_id',
        'subject_id', 'client_blind_hash', 'target_client_hash',
        'submission_status', 'event_code', 'stage_name', 'status'
      );
    
    -- Count reference tables
    SELECT COUNT(*) INTO v_ref_tables
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name LIKE 'ref_%';
    
    -- Count log tables
    SELECT COUNT(*) INTO v_log_tables
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name LIKE 'log_%';
    
    RAISE NOTICE '';
    RAISE NOTICE '=== SECTION 1: PHI/PII VERIFICATION SUMMARY ===';
    RAISE NOTICE 'PHI columns detected: %', v_phi_columns;
    RAISE NOTICE 'Free-text fields in log tables: %', v_free_text_fields;
    RAISE NOTICE 'Reference tables (controlled values): %', v_ref_tables;
    RAISE NOTICE 'Log tables (patient data): %', v_log_tables;
    RAISE NOTICE '';
    
    IF v_phi_columns > 0 THEN
        RAISE WARNING '❌ CRITICAL: % PHI columns detected - MUST BE REMOVED', v_phi_columns;
    ELSE
        RAISE NOTICE '✅ No PHI columns detected';
    END IF;
    
    IF v_free_text_fields > 0 THEN
        RAISE WARNING '⚠️  WARNING: % free-text fields in log tables - REVIEW REQUIRED', v_free_text_fields;
    ELSE
        RAISE NOTICE '✅ No uncontrolled free-text fields in log tables';
    END IF;
    
    IF v_phi_columns = 0 AND v_free_text_fields = 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅✅✅ DATABASE IS PHI-COMPLIANT ✅✅✅';
    END IF;
END $$;

-- ============================================================================
-- SECTION 2: RLS SECURITY AUDIT
-- ============================================================================

-- 2.1: Tables WITHOUT RLS Enabled (CRITICAL SECURITY ISSUE)
SELECT 
    '❌ CRITICAL: No RLS' as status,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
ORDER BY tablename;

-- 2.2: Tables WITH RLS but NO POLICIES (BLOCKS ALL ACCESS)
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

-- 2.3: All RLS Policies (Review for Security)
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

-- 2.4: Critical Tables RLS Check
DO $$
DECLARE
    v_critical_tables TEXT[] := ARRAY[
        'log_clinical_records',
        'log_outcomes',
        'log_consent',
        'log_interventions',
        'log_safety_events',
        'log_sessions',
        'log_baseline_assessments',
        'log_session_events',
        'log_session_vitals',
        'log_pulse_checks',
        'log_longitudinal_assessments',
        'log_behavioral_changes',
        'log_integration_sessions',
        'log_red_alerts',
        'sites',
        'user_sites',
        'subscriptions',
        'user_profiles'
    ];
    v_table TEXT;
    v_rls_enabled BOOLEAN;
    v_policy_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== SECTION 2: CRITICAL TABLES RLS AUDIT ===';
    
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

-- 2.5: Reference Tables RLS Check
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

-- 2.6: Overly Permissive Policies (Security Risk)
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

-- 2.7: RLS Summary Report
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
    
    RAISE NOTICE '';
    RAISE NOTICE '=== SECTION 2: RLS AUDIT SUMMARY ===';
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

-- ============================================================================
-- SECTION 3: VALIDATION CONTROLS CHECK
-- ============================================================================

-- 3.1: Foreign Key Coverage
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

-- 3.2: Reference Tables List
SELECT 
    '✅ Reference Table' as status,
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name LIKE 'ref_%'
ORDER BY table_name;

-- 3.3: Validation Controls Summary
DO $$
DECLARE
    v_fk_count INTEGER;
    v_ref_tables INTEGER;
BEGIN
    -- Count foreign keys on log tables
    SELECT COUNT(*) INTO v_fk_count
    FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
      AND table_schema = 'public'
      AND table_name LIKE 'log_%';
    
    -- Count reference tables
    SELECT COUNT(*) INTO v_ref_tables
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name LIKE 'ref_%';
    
    RAISE NOTICE '';
    RAISE NOTICE '=== SECTION 3: VALIDATION CONTROLS SUMMARY ===';
    RAISE NOTICE 'Foreign key constraints on log tables: %', v_fk_count;
    RAISE NOTICE 'Reference tables (controlled values): %', v_ref_tables;
    RAISE NOTICE '';
    
    IF v_fk_count > 0 AND v_ref_tables > 0 THEN
        RAISE NOTICE '✅ Validation controls in place';
    ELSE
        RAISE WARNING '⚠️  WARNING: Limited validation controls detected';
    END IF;
END $$;

-- ============================================================================
-- SECTION 4: RPC FUNCTION SECURITY CHECK
-- ============================================================================

-- 4.1: All RPC Functions Security Mode
SELECT 
    p.proname as function_name,
    CASE 
        WHEN p.prosecdef THEN '✅ SECURITY DEFINER'
        ELSE '❌ SECURITY INVOKER (RISK)'
    END as security_mode
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'  -- Functions only (not aggregates)
ORDER BY p.proname;

-- 4.2: RPC Function Security Summary
DO $$
DECLARE
    v_total_functions INTEGER;
    v_secure_functions INTEGER;
    v_insecure_functions INTEGER;
BEGIN
    -- Count total functions
    SELECT COUNT(*) INTO v_total_functions
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.prokind = 'f';
    
    -- Count SECURITY DEFINER functions
    SELECT COUNT(*) INTO v_secure_functions
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
      AND p.prosecdef = true;
    
    -- Count SECURITY INVOKER functions
    v_insecure_functions := v_total_functions - v_secure_functions;
    
    RAISE NOTICE '';
    RAISE NOTICE '=== SECTION 4: RPC FUNCTION SECURITY SUMMARY ===';
    RAISE NOTICE 'Total RPC functions: %', v_total_functions;
    RAISE NOTICE 'SECURITY DEFINER (secure): %', v_secure_functions;
    RAISE NOTICE 'SECURITY INVOKER (risk): %', v_insecure_functions;
    RAISE NOTICE '';
    
    IF v_insecure_functions > 0 THEN
        RAISE WARNING '⚠️  WARNING: % functions using SECURITY INVOKER', v_insecure_functions;
    ELSE
        RAISE NOTICE '✅ All RPC functions use SECURITY DEFINER';
    END IF;
END $$;

-- ============================================================================
-- FINAL SUMMARY
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '===================================================================';
    RAISE NOTICE 'DATABASE SECURITY AUDIT COMPLETE';
    RAISE NOTICE '===================================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Review all sections above for:';
    RAISE NOTICE '  1. PHI/PII compliance (Section 1)';
    RAISE NOTICE '  2. RLS policies (Section 2)';
    RAISE NOTICE '  3. Validation controls (Section 3)';
    RAISE NOTICE '  4. RPC function security (Section 4)';
    RAISE NOTICE '';
    RAISE NOTICE 'Document all findings in:';
    RAISE NOTICE '  .agent/audits/WO_042_DATABASE_SECURITY_AUDIT_REPORT.md';
    RAISE NOTICE '';
    RAISE NOTICE '===================================================================';
END $$;
