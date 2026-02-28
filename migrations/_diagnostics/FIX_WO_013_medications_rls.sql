-- ============================================================================
-- WO_013: Fix ref_medications RLS Policies
-- ============================================================================
-- Purpose: Resolve 404 error by ensuring authenticated users can read medications
-- Date: 2026-02-14
-- Agent: SOOP
-- ============================================================================

-- STEP 1: Check current RLS status
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
    AND tablename = 'ref_medications';

-- STEP 2: List existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command,
    qual as using_expression
FROM pg_policies
WHERE schemaname = 'public' 
    AND tablename = 'ref_medications';

-- STEP 3: Test current accessibility
SELECT id, medication_name, is_common
FROM public.ref_medications
LIMIT 5;

-- ============================================================================
-- FIX: Create SELECT policy if missing
-- ============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.ref_medications ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid duplicates)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.ref_medications;
DROP POLICY IF EXISTS "Allow authenticated users to read medications" ON public.ref_medications;
DROP POLICY IF EXISTS "Public read access" ON public.ref_medications;

-- Create new SELECT policy for authenticated users
CREATE POLICY "Enable read access for authenticated users" 
ON public.ref_medications
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify policy was created
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'ref_medications';

-- Test accessibility
SELECT COUNT(*) as total_medications,
       COUNT(CASE WHEN is_common = true THEN 1 END) as common_medications
FROM public.ref_medications;

-- Sample data
SELECT id, medication_name, is_common
FROM public.ref_medications
WHERE is_common = true
LIMIT 5;

DO $$ 
BEGIN
    RAISE NOTICE '✅ WO_013: ref_medications RLS policy fixed';
    RAISE NOTICE '   - RLS enabled on table';
    RAISE NOTICE '   - SELECT policy created for authenticated users';
    RAISE NOTICE '   - Table should now be accessible';
END $$;
