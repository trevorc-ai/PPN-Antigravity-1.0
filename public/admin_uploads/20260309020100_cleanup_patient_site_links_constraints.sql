-- ============================================================
-- Migration: Clean up log_patient_site_links unique constraints
-- Date: 2026-03-09
--
-- Problem: Table has 5 UNIQUE constraints — 2 prevent multi-clinic
--          patients and 3 are redundant duplicates.
--
-- Correct final state: ONE composite UNIQUE(site_id, patient_link_code)
-- This allows:
--   ✅ Same patient_uuid at multiple sites (multi-clinic)
--   ✅ Same patient_link_code at multiple sites (each site enrolls patient)
--   ✅ Exactly one row per (site, patient_link_code) pair
-- ============================================================

-- Step 1: Drop constraints that break multi-clinic support
ALTER TABLE public.log_patient_site_links
    DROP CONSTRAINT IF EXISTS log_patient_site_links_patient_link_code_key;   -- UNIQUE(patient_link_code)

ALTER TABLE public.log_patient_site_links
    DROP CONSTRAINT IF EXISTS log_patient_site_links_patient_uuid_unique;      -- UNIQUE(patient_uuid)

-- Step 2: Drop redundant duplicate composite constraints
-- (keep only log_patient_site_links_site_code_unique)
ALTER TABLE public.log_patient_site_links
    DROP CONSTRAINT IF EXISTS log_patient_site_links_site_patient_key;         -- duplicate composite

ALTER TABLE public.log_patient_site_links
    DROP CONSTRAINT IF EXISTS patient_site_links_patient_link_code_site_id_key; -- duplicate composite

-- Step 3: Verify final state — should be exactly ONE unique constraint
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.log_patient_site_links'::regclass
  AND contype = 'u'
ORDER BY conname;
-- Expected ONE row:
-- log_patient_site_links_site_code_unique | UNIQUE (site_id, patient_link_code)
