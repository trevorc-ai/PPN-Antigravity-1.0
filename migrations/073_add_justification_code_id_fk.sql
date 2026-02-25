-- ============================================================================
-- Migration: 073_add_justification_code_id_fk.sql
-- Date: 2026-02-25
-- Purpose: Add justification_code_id FK to log_clinical_records to replace
--          the free-text contraindication_override_reason column.
--
-- Context (WO-420 Phase 2, Item 3):
--   log_clinical_records.contraindication_override_reason TEXT allows
--   practitioners to type free-text justification, violating Architecture
--   Constitution §2. ref_justification_codes has 6 approved reasons.
--   Additive-only: TEXT column is KEPT per governance rules.
--
-- ref_justification_codes data (confirmed 2026-02-25):
--   1 — Vital signs (BP/HR) stable and within safe limits.
--   2 — Specialist/Psychiatrist clearance obtained and on file.
--   3 — Medication washout/tapering period successfully completed.
--   4 — Patient has safely tolerated this dose/substance previously.
--   5 — Clinical benefit outweighs theoretical interaction risk.
--   6 — Baseline screening ruled out specific contraindications.
--
-- PRE-FLIGHT (run before this migration):
--   1. Confirm no existing data in contraindication_override_reason:
--      SELECT contraindication_override_reason, COUNT(*)
--      FROM log_clinical_records
--      WHERE contraindication_override_reason IS NOT NULL
--      GROUP BY contraindication_override_reason;
--      → Document results before proceeding
--
--   2. Confirm PK column name on ref_justification_codes:
--      SELECT column_name FROM information_schema.columns
--      WHERE table_schema = 'public'
--      AND table_name = 'ref_justification_codes'
--      ORDER BY ordinal_position LIMIT 3;
--      → Expect: justification_id
--
--   3. Confirm justification_code_id doesn't already exist:
--      SELECT column_name FROM information_schema.columns
--      WHERE table_name = 'log_clinical_records'
--      AND column_name = 'justification_code_id';
--      → Expect: 0 rows
--
-- ONE CONCERN PER FILE (INSPECTOR rule):
--   This file ONLY adds the FK column.
--   UI change to dropdown requires separate code review (no migration file).
-- ============================================================================

-- Step 1: Add justification_code_id FK column (additive — keep text column)
ALTER TABLE log_clinical_records
  ADD COLUMN IF NOT EXISTS justification_code_id BIGINT
    REFERENCES ref_justification_codes(justification_id)
    ON DELETE SET NULL;

COMMENT ON COLUMN log_clinical_records.justification_code_id IS
  'FK → ref_justification_codes(justification_id). PHI-safe controlled vocabulary for contraindication override reason. Added migration 073. contraindication_override_reason TEXT retained per additive-only rule.';

COMMENT ON COLUMN log_clinical_records.contraindication_override_reason IS
  'DEPRECATED: Free-text field violates Architecture Constitution §2. Use justification_code_id FK instead. Retained per additive-only rule. Added deprecation notice migration 073.';

-- Step 2: Index for FK performance
CREATE INDEX IF NOT EXISTS idx_log_clinical_records_justification_code_id
  ON log_clinical_records(justification_code_id);

-- ============================================================================
-- VERIFICATION — run after execution:
-- ============================================================================
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'log_clinical_records'
-- AND column_name = 'justification_code_id';
-- → Expect: 1 row, bigint
