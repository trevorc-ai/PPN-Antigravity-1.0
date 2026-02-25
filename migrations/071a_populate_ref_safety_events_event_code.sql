-- ============================================================================
-- Migration: 071a_populate_ref_safety_events_event_code.sql
-- Date: 2026-02-25
-- Purpose: Populate ref_safety_events.event_code with canonical codes.
--
-- Context (WO-420 Phase 2, Item 1):
--   event_code was confirmed NULL for all 13 rows on 2026-02-25.
--   These codes enable migration 071b to wire a safety_event_type_id FK
--   from log_safety_events to ref_safety_events.
--
-- PRE-FLIGHT (run before this migration):
--   SELECT event_code, COUNT(*) FROM ref_safety_events GROUP BY event_code;
--   → Expect: (NULL, 13) — all NULL means safe to proceed
--
-- ONE CONCERN PER FILE (INSPECTOR rule):
--   This file ONLY updates data in ref_safety_events.event_code.
--   Schema changes are in 071b.
-- ============================================================================

-- Pre-flight guard: only run UPDATEs if all event_code are NULL
-- (Manual check required before execution — run the SELECT below first)

-- Step 1: Populate event_code for all 13 canonical safety event types
UPDATE ref_safety_events SET event_code = 'ANXIETY'              WHERE safety_event_id = 1;
UPDATE ref_safety_events SET event_code = 'CONFUSIONAL_STATE'    WHERE safety_event_id = 2;
UPDATE ref_safety_events SET event_code = 'DISSOCIATION'         WHERE safety_event_id = 3;
UPDATE ref_safety_events SET event_code = 'DIZZINESS'            WHERE safety_event_id = 4;
UPDATE ref_safety_events SET event_code = 'HEADACHE'             WHERE safety_event_id = 5;
UPDATE ref_safety_events SET event_code = 'HYPERTENSION'         WHERE safety_event_id = 6;
UPDATE ref_safety_events SET event_code = 'INSOMNIA'             WHERE safety_event_id = 7;
UPDATE ref_safety_events SET event_code = 'NAUSEA'               WHERE safety_event_id = 8;
UPDATE ref_safety_events SET event_code = 'PANIC_ATTACK'         WHERE safety_event_id = 9;
UPDATE ref_safety_events SET event_code = 'PARANOIA'             WHERE safety_event_id = 10;
UPDATE ref_safety_events SET event_code = 'TACHYCARDIA'          WHERE safety_event_id = 11;
UPDATE ref_safety_events SET event_code = 'VISUAL_HALLUCINATION' WHERE safety_event_id = 12;
UPDATE ref_safety_events SET event_code = 'OTHER'                WHERE safety_event_id = 13;

-- ============================================================================
-- VERIFICATION — run after execution:
-- ============================================================================
-- SELECT safety_event_id, event_name, event_code
-- FROM ref_safety_events
-- ORDER BY safety_event_id;
-- Expect: 13 rows, all with non-null event_code values
