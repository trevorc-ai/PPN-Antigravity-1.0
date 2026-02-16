-- ============================================================================
-- FIX RPC FUNCTION SECURITY - Change SECURITY INVOKER to SECURITY DEFINER
-- ============================================================================
-- Work Order: WO_042
-- Author: SOOP
-- Date: 2026-02-16T01:29:03-08:00
-- Purpose: Fix 5 RPC functions that are using SECURITY INVOKER (security risk)
-- ============================================================================

-- CRITICAL: These functions handle patient data and MUST use SECURITY DEFINER
-- to ensure RLS policies are enforced

-- ============================================================================
-- FUNCTION 1: ensure_sha256_hex_patient_hash
-- ============================================================================
-- Purpose: Ensures patient hash is in SHA256 hex format
-- Risk: CRITICAL - Handles patient identifiers
-- Fix: Change to SECURITY DEFINER

ALTER FUNCTION public.ensure_sha256_hex_patient_hash()
SECURITY DEFINER;

COMMENT ON FUNCTION public.ensure_sha256_hex_patient_hash() IS 
'Ensures patient hash is in SHA256 hex format. SECURITY DEFINER enforces RLS.';

-- ============================================================================
-- FUNCTION 2: ensure_sha256_hex_patient_hash_v1
-- ============================================================================
-- Purpose: Ensures patient hash is in SHA256 hex format (version 1)
-- Risk: CRITICAL - Handles patient identifiers
-- Fix: Change to SECURITY DEFINER

ALTER FUNCTION public.ensure_sha256_hex_patient_hash_v1()
SECURITY DEFINER;

COMMENT ON FUNCTION public.ensure_sha256_hex_patient_hash_v1() IS 
'Ensures patient hash is in SHA256 hex format (v1). SECURITY DEFINER enforces RLS.';

-- ============================================================================
-- FUNCTION 3: hash_patient_link_code
-- ============================================================================
-- Purpose: Hashes patient link codes
-- Risk: CRITICAL - Handles patient linking
-- Fix: Change to SECURITY DEFINER

ALTER FUNCTION public.hash_patient_link_code(text)
SECURITY DEFINER;

COMMENT ON FUNCTION public.hash_patient_link_code(text) IS 
'Hashes patient link codes. SECURITY DEFINER enforces RLS.';

-- ============================================================================
-- FUNCTION 4: get_event_type_id_by_code
-- ============================================================================
-- Purpose: Looks up event type ID by code
-- Risk: MEDIUM - Lookup function
-- Fix: Change to SECURITY DEFINER for consistency

ALTER FUNCTION public.get_event_type_id_by_code(text)
SECURITY DEFINER;

COMMENT ON FUNCTION public.get_event_type_id_by_code(text) IS 
'Looks up event type ID by code. SECURITY DEFINER enforces RLS.';

-- ============================================================================
-- FUNCTION 5: update_user_subscriptions_updated_at
-- ============================================================================
-- Purpose: Updates subscription timestamp
-- Risk: MEDIUM - Timestamp update
-- Fix: Change to SECURITY DEFINER for consistency

ALTER FUNCTION public.update_user_subscriptions_updated_at()
SECURITY DEFINER;

COMMENT ON FUNCTION public.update_user_subscriptions_updated_at() IS 
'Updates subscription timestamp. SECURITY DEFINER enforces RLS.';

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this after applying the migration to verify all functions are now secure

SELECT 
    p.proname as function_name,
    CASE 
        WHEN p.prosecdef THEN '✅ SECURITY DEFINER'
        ELSE '❌ SECURITY INVOKER (RISK)'
    END as security_mode
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
  AND p.proname IN (
    'ensure_sha256_hex_patient_hash',
    'ensure_sha256_hex_patient_hash_v1',
    'hash_patient_link_code',
    'get_event_type_id_by_code',
    'update_user_subscriptions_updated_at'
  )
ORDER BY p.proname;

-- Expected result: All 5 functions should show ✅ SECURITY DEFINER

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- SECURITY DEFINER vs SECURITY INVOKER:
-- 
-- SECURITY DEFINER (✅ SECURE):
-- - Function runs with the permissions of the function OWNER
-- - RLS policies are ENFORCED
-- - User cannot bypass RLS by calling the function
-- - This is what we want for all functions
-- 
-- SECURITY INVOKER (❌ RISK):
-- - Function runs with the permissions of the CALLER
-- - RLS policies may be BYPASSED
-- - User could potentially access data they shouldn't see
-- - This is a security vulnerability
-- 
-- ============================================================================
