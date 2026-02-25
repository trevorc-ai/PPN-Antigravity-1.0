-- ============================================================================
-- Migration: 072_add_substance_indication_fks_to_log_protocols.sql
-- Date: 2026-02-25
-- Purpose: Add substance_id and indication_id FK columns to log_protocols.
--
-- Context (WO-420 Phase 2, Item 2):
--   log_protocols currently stores substance and indication as TEXT columns.
--   ref_substances and ref_indications exist as proper FK targets.
--   Additive-only: TEXT columns are KEPT per Architecture Constitution rule.
--   New integer FK columns co-exist alongside the legacy text columns.
--
-- IMPORTANT ARCHITECTURAL NOTE:
--   The ProtocolBuilder page (src/pages/ProtocolBuilder.tsx) writes to
--   log_clinical_records (NOT log_protocols). log_clinical_records already
--   has indication_id and substance_id as integer FKs via the formData state.
--   This migration targets the separate log_protocols table, which has its
--   own TEXT columns substance and indication without FK enforcement.
--
-- PRE-FLIGHT (run before this migration):
--   1. Verify existing data in log_protocols.substance:
--      SELECT substance, COUNT(*) FROM log_protocols
--      WHERE substance IS NOT NULL GROUP BY substance;
--
--   2. Verify existing data in log_protocols.indication:
--      SELECT indication, COUNT(*) FROM log_protocols
--      WHERE indication IS NOT NULL GROUP BY indication;
--
--   3. Confirm PK column names:
--      SELECT column_name FROM information_schema.columns
--      WHERE table_schema = 'public'
--      AND table_name IN ('ref_substances', 'ref_indications')
--      ORDER BY table_name, ordinal_position LIMIT 6;
--      → Expect: ref_indications.indication_id, ref_substances.substance_id
--
--   4. Confirm FK columns don't already exist:
--      SELECT column_name FROM information_schema.columns
--      WHERE table_name = 'log_protocols'
--      AND column_name IN ('substance_id', 'indication_id');
--      → Expect: 0 rows
--
-- ONE CONCERN PER FILE (INSPECTOR rule):
--   This file ONLY adds FK columns to log_protocols.
--   Backfill of existing text rows (if any) requires a separate migration.
-- ============================================================================

-- Step 1: Add substance_id FK column (additive — keep substance TEXT)
ALTER TABLE log_protocols
  ADD COLUMN IF NOT EXISTS substance_id BIGINT
    REFERENCES ref_substances(substance_id)
    ON DELETE SET NULL;

COMMENT ON COLUMN log_protocols.substance_id IS
  'FK → ref_substances(substance_id). Canonical substance identifier. Added migration 072. substance TEXT column retained per additive-only rule.';

-- Step 2: Add indication_id FK column (additive — keep indication TEXT)
ALTER TABLE log_protocols
  ADD COLUMN IF NOT EXISTS indication_id BIGINT
    REFERENCES ref_indications(indication_id)
    ON DELETE SET NULL;

COMMENT ON COLUMN log_protocols.indication_id IS
  'FK → ref_indications(indication_id). Canonical indication identifier. Added migration 072. indication TEXT column retained per additive-only rule.';

-- Step 3: Indexes for FK performance
CREATE INDEX IF NOT EXISTS idx_log_protocols_substance_id
  ON log_protocols(substance_id);

CREATE INDEX IF NOT EXISTS idx_log_protocols_indication_id
  ON log_protocols(indication_id);

-- ============================================================================
-- VERIFICATION — run after execution:
-- ============================================================================
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'log_protocols'
-- AND column_name IN ('substance_id', 'indication_id')
-- ORDER BY column_name;
-- → Expect: 2 rows, both bigint
