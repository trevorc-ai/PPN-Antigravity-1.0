-- ============================================================================
-- RLS TEST SCENARIOS - 4 Critical Tests
-- ============================================================================
-- Purpose: Test Row Level Security policies for data isolation
-- Author: SOOP
-- Date: 2026-02-15
-- Work Order: WO_042
-- ============================================================================

-- INSTRUCTIONS:
-- These tests require manual execution with different user contexts
-- Test 1-3 require creating test users in Supabase Auth
-- Test 4 requires checking RPC function security

-- ============================================================================
-- TEST 1: User Isolation (User A cannot see User B's data)
-- ============================================================================
-- Setup: Create two test users in Supabase Auth
-- User A: test-user-a@ppn-research.local
-- User B: test-user-b@ppn-research.local

-- Step 1: Login as User A, insert data
-- Expected: User A can insert their own data
/*
INSERT INTO log_clinical_records (
    site_id, subject_id, substance_id, dose_mg, route_id
) VALUES (
    '<user_a_site_id>', gen_random_uuid(), 1, 25, 1
);
*/

-- Step 2: Login as User B, try to read User A's data
-- Expected: User B sees ZERO rows from User A
/*
SELECT COUNT(*) FROM log_clinical_records
WHERE site_id = '<user_a_site_id>';
-- Expected result: 0
*/

-- Step 3: Login as User A, verify they can see their own data
-- Expected: User A sees their own rows
/*
SELECT COUNT(*) FROM log_clinical_records
WHERE site_id = '<user_a_site_id>';
-- Expected result: > 0
*/

-- ============================================================================
-- TEST 2: Site Isolation (User sees only authorized site data)
-- ============================================================================
-- Setup: Create user with access to Site A but NOT Site B

-- Step 1: Insert data for Site A and Site B
-- (Run as service_role or admin)
/*
INSERT INTO log_clinical_records (site_id, subject_id, substance_id, dose_mg, route_id)
VALUES 
    ('<site_a_id>', gen_random_uuid(), 1, 25, 1),
    ('<site_b_id>', gen_random_uuid(), 1, 30, 1);
*/

-- Step 2: Grant user access to Site A only
/*
INSERT INTO user_sites (user_id, site_id, role)
VALUES ('<test_user_id>', '<site_a_id>', 'clinician');
*/

-- Step 3: Login as test user, query all records
-- Expected: User sees ONLY Site A data, NOT Site B
/*
SELECT site_id, COUNT(*) as record_count
FROM log_clinical_records
GROUP BY site_id;
-- Expected: Only site_a_id appears, site_b_id is hidden
*/

-- ============================================================================
-- TEST 3: Unauthenticated Access (Anonymous users blocked)
-- ============================================================================
-- Step 1: Logout (use anon key instead of authenticated key)
-- Step 2: Try to query log_clinical_records
-- Expected: ZERO rows returned (or 403 Forbidden)

/*
-- Run with anon key:
SELECT COUNT(*) FROM log_clinical_records;
-- Expected result: 0 (or error)
*/

-- Step 3: Try to query user_profiles
-- Expected: ZERO rows returned
/*
SELECT COUNT(*) FROM user_profiles;
-- Expected result: 0 (or error)
*/

-- Step 4: Verify reference tables ARE accessible (public read)
-- Expected: Reference tables return data
/*
SELECT COUNT(*) FROM ref_substances;
-- Expected result: > 0 (reference data is public)
*/

-- ============================================================================
-- TEST 4: RPC Function Security (SECURITY DEFINER functions enforce RLS)
-- ============================================================================
-- Check all RPC functions for SECURITY DEFINER
SELECT 
    p.proname as function_name,
    CASE 
        WHEN p.prosecdef THEN '✅ SECURITY DEFINER'
        ELSE '❌ SECURITY INVOKER (RISK)'
    END as security_mode,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'  -- Functions only (not aggregates)
ORDER BY p.proname;

-- Verify specific RPC functions
SELECT 
    '⚠️  REVIEW: RPC Function Security' as status,
    proname as function_name,
    prosecdef as is_security_definer
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN (
    'search_global_v2',
    'refresh_all_analytics',
    'auto_refresh_analytics',
    'check_client_risk'
  );

-- ============================================================================
-- SUMMARY: RLS Test Checklist
-- ============================================================================
/*
[ ] Test 1: User Isolation - User A cannot see User B's data
[ ] Test 2: Site Isolation - User sees only authorized site data
[ ] Test 3: Unauthenticated Access - Anonymous users blocked from sensitive tables
[ ] Test 4: RPC Function Security - All RPC functions use SECURITY DEFINER

PASS CRITERIA:
- All 4 tests must PASS
- Zero cross-user data leakage
- Zero unauthenticated access to sensitive tables
- All RPC functions enforce RLS
*/
