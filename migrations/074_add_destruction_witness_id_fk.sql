-- ============================================================================
-- Migration: 074_add_destruction_witness_id_fk.sql
-- Date: 2026-02-25
-- Purpose: Add destruction_witness_id UUID FK to log_chain_of_custody
--          to replace the PII-containing destruction_witness_name TEXT column.
--
-- Context (WO-420 Phase 2, Item 4):
--   log_chain_of_custody.destruction_witness_name TEXT stores a staff
--   member's name as PII, violating Architecture Constitution §2 (staff PII
--   is equally prohibited as patient PII). No application code currently
--   writes to this column (confirmed — zero INSERT paths in src/).
--   Correct pattern: UUID FK → auth.users.
--
-- PRE-FLIGHT (run before this migration):
--   1. Confirm no existing data in destruction_witness_name:
--      SELECT destruction_witness_name, COUNT(*)
--      FROM log_chain_of_custody
--      WHERE destruction_witness_name IS NOT NULL
--      GROUP BY destruction_witness_name;
--      → Expect: 0 rows (no app code writes here)
--
--   2. Confirm destruction_witness_id doesn't already exist:
--      SELECT column_name FROM information_schema.columns
--      WHERE table_name = 'log_chain_of_custody'
--      AND column_name = 'destruction_witness_id';
--      → Expect: 0 rows
--
-- ONE CONCERN PER FILE (INSPECTOR rule):
--   This file ONLY adds the UUID FK column and deprecates the text column.
--   The text column is NOT dropped — additive-only rule applies.
-- ============================================================================

-- Step 1: Add destruction_witness_id UUID FK (additive — keep name column)
ALTER TABLE log_chain_of_custody
  ADD COLUMN IF NOT EXISTS destruction_witness_id UUID
    REFERENCES auth.users(id)
    ON DELETE SET NULL;

COMMENT ON COLUMN log_chain_of_custody.destruction_witness_id IS
  'FK → auth.users(id). PHI-safe witness identifier using authenticated user UUID. Added migration 074 to replace PII destruction_witness_name TEXT column.';

COMMENT ON COLUMN log_chain_of_custody.destruction_witness_name IS
  'DEPRECATED: PII violation — stores staff name as TEXT. Use destruction_witness_id UUID FK → auth.users instead. Retained per additive-only rule. Deprecation added migration 074.';

-- Step 2: Index for FK performance
CREATE INDEX IF NOT EXISTS idx_log_chain_of_custody_destruction_witness_id
  ON log_chain_of_custody(destruction_witness_id);

-- ============================================================================
-- VERIFICATION — run after execution:
-- ============================================================================
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'log_chain_of_custody'
-- AND column_name = 'destruction_witness_id';
-- → Expect: 1 row, uuid
