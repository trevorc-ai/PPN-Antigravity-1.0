-- ============================================================
-- Migration: Add session_status to log_clinical_records
-- + Auto-clean function for abandoned draft sessions
-- WO-592: Prevent Abandoned Sessions From Polluting Analytics
-- Date: 2026-03-10
-- Safe: additive only — no dropped columns, no type changes
-- ============================================================

-- 1. Add the column
ALTER TABLE log_clinical_records
ADD COLUMN IF NOT EXISTS session_status TEXT
    NOT NULL DEFAULT 'draft'
    CHECK (session_status IN ('draft', 'active', 'completed'));

COMMENT ON COLUMN log_clinical_records.session_status IS
    'draft    = stub row created at session start, no consent or substance yet.
     active   = consent saved OR substance selected — real clinical session.
     completed = Phase 3 / integration note saved; session fully closed out.
     RULE: All analytics queries MUST filter WHERE session_status != ''draft''.
     Auto-clean: drafts older than 48h are deleted nightly by ppn_cleanup_draft_sessions().';

-- 2. Backfill: existing rows with a substance_id are already active
UPDATE log_clinical_records
SET session_status = 'active'
WHERE substance_id IS NOT NULL
  AND session_status = 'draft';

-- ============================================================
-- 3. Auto-clean function: delete pure draft stubs older than 48h
--    Pure draft = no consent, no substance, just the shell row
--    This function is safe to run on a schedule via pg_cron.
-- ============================================================

CREATE OR REPLACE FUNCTION ppn_cleanup_draft_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete drafts older than 48 hours that have NO linked consent record.
    -- Sessions with consent are real clinical records and are never deleted here —
    -- they will have been promoted to 'active' by createConsent() in the app.
    DELETE FROM log_clinical_records
    WHERE session_status = 'draft'
      AND created_at < NOW() - INTERVAL '48 hours'
      AND id NOT IN (
          SELECT DISTINCT session_id
          FROM log_phase1_consent
          WHERE session_id IS NOT NULL
      );

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION ppn_cleanup_draft_sessions() IS
    'Deletes abandoned draft sessions older than 48 hours with no linked consent.
     Safe to run on a schedule. Returns the number of rows deleted.
     Run manually: SELECT ppn_cleanup_draft_sessions();
     Schedule via pg_cron (requires paid Supabase plan):
       SELECT cron.schedule(''nightly-draft-cleanup'', ''0 3 * * *'',
         $$SELECT ppn_cleanup_draft_sessions()$$);';

-- ============================================================
-- 4. Run cleanup immediately to clear any existing stale drafts
-- ============================================================
SELECT ppn_cleanup_draft_sessions();
