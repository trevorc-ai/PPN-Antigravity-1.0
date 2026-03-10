-- ============================================================
-- Migration: Add session_status to log_clinical_records
-- WO-592: Prevent Abandoned Sessions From Polluting Analytics
-- Date: 2026-03-10
-- Safe: additive only — no dropped columns, no type changes
-- ============================================================

ALTER TABLE log_clinical_records
ADD COLUMN IF NOT EXISTS session_status TEXT
    NOT NULL DEFAULT 'draft'
    CHECK (session_status IN ('draft', 'active', 'completed'));

COMMENT ON COLUMN log_clinical_records.session_status IS
    'draft    = stub row created at session start, no substance selected yet.
     active   = substance selected; session is meaningful clinical data.
     completed = Phase 3 / integration note saved; session fully closed out.
     RULE: All analytics queries MUST filter WHERE session_status != ''draft''.';

-- Backfill: any existing rows with a substance_id are already active sessions
UPDATE log_clinical_records
SET session_status = 'active'
WHERE substance_id IS NOT NULL
  AND session_status = 'draft';
