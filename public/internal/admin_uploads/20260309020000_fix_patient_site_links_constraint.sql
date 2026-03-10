-- ============================================================
-- Migration: Fix log_patient_site_links unique constraint
-- Date: 2026-03-09
-- Problem: log_patient_site_links_site_id_key constrains ONLY
--          site_id, allowing only one patient per site.
--          Correct constraint should be on (site_id, patient_link_code)
--          composite — one patient_link_code per site.
-- Impact: Without this fix, any second patient at the same site
--         causes "duplicate key" and kills createClinicalSession().
-- ============================================================

-- Step 1: Drop the incorrect single-column unique constraint
ALTER TABLE public.log_patient_site_links
    DROP CONSTRAINT IF EXISTS log_patient_site_links_site_id_key;

-- Step 2: Add the correct composite unique constraint
--         Idempotent — safely re-runnable
ALTER TABLE public.log_patient_site_links
    DROP CONSTRAINT IF EXISTS log_patient_site_links_site_patient_key;

ALTER TABLE public.log_patient_site_links
    ADD CONSTRAINT log_patient_site_links_site_patient_key
    UNIQUE (site_id, patient_link_code);

-- Step 3: Verify
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.log_patient_site_links'::regclass
  AND contype = 'u'
ORDER BY conname;
-- Expected: only log_patient_site_links_site_patient_key
-- (on site_id, patient_link_code)
