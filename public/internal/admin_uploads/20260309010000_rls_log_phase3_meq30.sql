-- =============================================================================
-- Migration: 20260309010000_rls_log_phase3_meq30.sql
-- Purpose:   Enable Row Level Security on log_phase3_meq30.
--            Restricts all access to practitioners whose site is linked to
--            the patient session via log_user_sites.
--
-- HOW TO APPLY:
--   1. Open Supabase Dashboard → SQL Editor
--   2. Paste this entire file and run
--   3. Verify with the query at the bottom of this file
--
-- Pre-flight (verified 2026-03-09):
--   ✅ log_phase3_meq30       — confirmed in live app (clinicalLog.ts)
--   ✅ log_user_sites          — confirmed in live app
--   ✅ log_clinical_records    — session FK parent, confirmed in live app
--
-- Safety:
--   ✅ Idempotent — all statements safe to re-run
--   ✅ DROP POLICY IF EXISTS before every CREATE POLICY
--   ✅ Additive only — no DROP TABLE, no DROP COLUMN, no type changes
--   ✅ Zero PHI in policy expressions — uses FK IDs only
-- =============================================================================

-- Step 1: Enable RLS (idempotent — no-op if already enabled)
ALTER TABLE log_phase3_meq30 ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- POLICY: SELECT
-- Practitioners can read MEQ-30 scores for patients at their site.
-- Joins through log_clinical_records to resolve the session's site.
-- =============================================================================
DROP POLICY IF EXISTS "log_phase3_meq30_select" ON log_phase3_meq30;
CREATE POLICY "log_phase3_meq30_select"
    ON log_phase3_meq30
    FOR SELECT
    USING (
        session_id IN (
            SELECT lcr.id
            FROM log_clinical_records lcr
            WHERE lcr.site_id IN (
                SELECT lus.site_id
                FROM log_user_sites lus
                WHERE lus.user_id = auth.uid()
            )
        )
    );

-- =============================================================================
-- POLICY: INSERT
-- Practitioners can only insert MEQ-30 scores for sessions at their site.
-- Prevents cross-site writes.
-- =============================================================================
DROP POLICY IF EXISTS "log_phase3_meq30_insert" ON log_phase3_meq30;
CREATE POLICY "log_phase3_meq30_insert"
    ON log_phase3_meq30
    FOR INSERT
    WITH CHECK (
        session_id IN (
            SELECT lcr.id
            FROM log_clinical_records lcr
            WHERE lcr.site_id IN (
                SELECT lus.site_id
                FROM log_user_sites lus
                WHERE lus.user_id = auth.uid()
            )
        )
    );

-- =============================================================================
-- UPDATE: Blocked — MEQ-30 records are immutable (clinical audit trail).
-- DELETE: Blocked — clinical records are immutable (CORE ENGINEERING RULE).
-- No policies defined → both are implicitly denied by RLS.
-- =============================================================================

-- =============================================================================
-- Step 2: Indexes for common query patterns (idempotent)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_log_phase3_meq30_session_id
    ON log_phase3_meq30 (session_id);

CREATE INDEX IF NOT EXISTS idx_log_phase3_meq30_patient_uuid
    ON log_phase3_meq30 (patient_uuid);

-- =============================================================================
-- VERIFICATION — Run after applying to confirm RLS is active
-- =============================================================================
-- Check RLS enabled:
--   SELECT tablename, rowsecurity
--   FROM pg_tables
--   WHERE tablename = 'log_phase3_meq30';
--   → Expected: rowsecurity = true
--
-- List active policies:
--   SELECT policyname, cmd
--   FROM pg_policies
--   WHERE tablename = 'log_phase3_meq30';
--   → Expected: 2 rows — log_phase3_meq30_select (SELECT), log_phase3_meq30_insert (INSERT)
-- =============================================================================
