-- ============================================================================
-- Migration: 066d_session_type_final_patch.sql
-- Date: 2026-02-25
-- Purpose: 066b Steps 1 + 2 were rolled back when Step 3 (FK) failed.
--          This migration ONLY contains those two steps — isolated so a
--          future error in another statement can't roll them back again.
--
-- Confirmed still needed (live query result 2026-02-25 10:03):
--   'Dosing Session' — 2 rows (should be 'dosing')
--   'Preparation'   — 1 row  (should be 'preparation')
--
-- 066c confirmed applied — FK columns are live. Do NOT re-run sections from 066c.
-- ============================================================================


-- STEP 1: Normalize dirty session_type values
-- Idempotent — rows already normalized won't be affected.

UPDATE log_clinical_records
  SET session_type = 'preparation'
  WHERE session_type = 'Preparation';

UPDATE log_clinical_records
  SET session_type = 'dosing'
  WHERE session_type = 'Dosing Session';


-- STEP 2: Apply the CHECK constraint (now that data is clean)

ALTER TABLE log_clinical_records
  DROP CONSTRAINT IF EXISTS chk_clinical_records_session_type;

ALTER TABLE log_clinical_records
  ADD CONSTRAINT chk_clinical_records_session_type
  CHECK (session_type IN ('preparation', 'dosing', 'integration', 'complete'));


-- VERIFICATION — run inline after this script to confirm:

SELECT session_type, COUNT(*)
FROM log_clinical_records
GROUP BY session_type
ORDER BY session_type;

-- Expected result:
-- dosing       | 2
-- preparation  | 20
