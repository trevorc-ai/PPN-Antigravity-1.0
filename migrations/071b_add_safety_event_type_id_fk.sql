-- ============================================================================
-- Migration: 071b_add_safety_event_type_id_fk.sql
-- Date: 2026-02-25
-- Purpose: Add safety_event_type_id FK column to log_safety_events and
--          drop the stopgap CHECK constraint from migration 070.
--
-- Context (WO-420 Phase 2, Item 1):
--   Migration 070 added a CHECK constraint with display label strings as
--   a stopgap. ref_safety_events is the canonical table — wire a real FK.
--   Run AFTER migration 071a (event_code populated).
--
-- PRE-FLIGHT (run before this migration):
--   1. Confirm ref_safety_events.safety_event_id is the PK:
--      SELECT column_name FROM information_schema.columns
--      WHERE table_schema = 'public' AND table_name = 'ref_safety_events'
--      ORDER BY ordinal_position LIMIT 5;
--      → Expect: safety_event_id as first column
--
--   2. Confirm no existing rows in log_safety_events.event_type:
--      SELECT event_type, COUNT(*) FROM log_safety_events
--      WHERE event_type IS NOT NULL GROUP BY event_type;
--      → Expect: 0 rows (all NULL — confirmed 2026-02-25)
--
-- ONE CONCERN PER FILE (INSPECTOR rule):
--   This file ONLY modifies log_safety_events schema.
--   Data population is in 071a.
-- ============================================================================

-- Step 1: Add the FK column (additive only — event_type TEXT column is NOT dropped)
ALTER TABLE log_safety_events
  ADD COLUMN IF NOT EXISTS safety_event_type_id BIGINT
    REFERENCES ref_safety_events(safety_event_id)
    ON DELETE SET NULL;

COMMENT ON COLUMN log_safety_events.safety_event_type_id IS
  'FK → ref_safety_events(safety_event_id). Canonical event type identifier. Added migration 071b. Replaces event_type TEXT stopgap CHECK from migration 070.';

-- Step 2: Drop the stopgap CHECK constraint from migration 070
-- (The FK to ref_safety_events now enforces controlled vocabulary)
ALTER TABLE log_safety_events
  DROP CONSTRAINT IF EXISTS chk_safety_events_event_type;

COMMENT ON COLUMN log_safety_events.event_type IS
  'DEPRECATED CHECK constraint dropped migration 071b. Use safety_event_type_id FK → ref_safety_events instead. Column retained per additive-only rule.';

-- Step 3: Index for FK performance
CREATE INDEX IF NOT EXISTS idx_log_safety_events_safety_event_type_id
  ON log_safety_events(safety_event_type_id);

-- ============================================================================
-- VERIFICATION — run after execution:
-- ============================================================================
-- 1. Confirm column exists:
--    SELECT column_name, data_type FROM information_schema.columns
--    WHERE table_name = 'log_safety_events'
--    AND column_name = 'safety_event_type_id';
--
-- 2. Confirm old CHECK is gone:
--    SELECT constraint_name FROM information_schema.check_constraints
--    WHERE constraint_name = 'chk_safety_events_event_type';
--    → Expect: 0 rows
--
-- 3. Confirm FK exists:
--    SELECT constraint_name FROM information_schema.table_constraints
--    WHERE table_name = 'log_safety_events'
--    AND constraint_type = 'FOREIGN KEY';
