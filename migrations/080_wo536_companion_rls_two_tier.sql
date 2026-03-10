-- =====================================================
-- Migration: 080_wo536_companion_rls_two_tier.sql
-- Work Order: WO-536
-- Purpose: Replace single-tier INSERT policy on log_session_timeline_events
--          with a two-tier policy:
--            Tier 1 — Authenticated practitioners (site-scoped)
--            Tier 2 — Companion App anon writes (active sessions only)
-- LEAD decisions (2026-03-09):
--   - Companion validation: session_id only (no token)
--   - Anon scope: is_submitted = false on log_clinical_records
--   - performed_by: NULL for companion writes (already nullable)
-- No schema changes — policy-only migration.
-- =====================================================

-- ─────────────────────────────────────────────────────
-- STEP 1: Drop all known existing INSERT policies
--         (Belt-and-suspenders: drop by every name ever used)
-- ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can insert timeline events" ON log_session_timeline_events;
DROP POLICY IF EXISTS "Users can insert timeline events for their site" ON log_session_timeline_events;
DROP POLICY IF EXISTS "allow_public_insert" ON log_session_timeline_events;
DROP POLICY IF EXISTS "site_practitioners_insert_timeline_events" ON log_session_timeline_events;
DROP POLICY IF EXISTS "companion_anon_insert" ON log_session_timeline_events;
DROP POLICY IF EXISTS "practitioner_authenticated_insert" ON log_session_timeline_events;

-- ─────────────────────────────────────────────────────
-- STEP 2: Ensure RLS is enabled (idempotent)
-- ─────────────────────────────────────────────────────
ALTER TABLE log_session_timeline_events ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────
-- STEP 3: Tier 1 — Authenticated practitioners (site-scoped)
--         Covers: Quick Keys, form saves, all practitioner writes
-- ─────────────────────────────────────────────────────
CREATE POLICY "practitioner_authenticated_insert"
ON log_session_timeline_events
FOR INSERT
TO authenticated
WITH CHECK (
  session_id IN (
    SELECT lcr.id
    FROM log_clinical_records lcr
    JOIN log_user_sites lus ON lus.site_id = lcr.site_id
    WHERE lus.user_id = auth.uid()
      AND lus.is_active = true
  )
);

-- ─────────────────────────────────────────────────────
-- STEP 4: Tier 2 — Companion App (anon, active sessions only)
--         Covers: patient feeling taps during live session
--         Constraint: session must not be submitted (is_submitted = false)
-- ─────────────────────────────────────────────────────
CREATE POLICY "companion_anon_insert"
ON log_session_timeline_events
FOR INSERT
TO anon
WITH CHECK (
  session_id IN (
    SELECT id
    FROM log_clinical_records
    WHERE is_submitted = false
  )
);

-- ─────────────────────────────────────────────────────
-- VERIFICATION QUERY (run after migration in Docker)
-- ─────────────────────────────────────────────────────
-- SELECT
--   policyname,
--   roles,
--   cmd,
--   with_check
-- FROM pg_policies
-- WHERE tablename = 'log_session_timeline_events'
-- ORDER BY policyname;
--
-- Expected output: 3 rows
--   practitioner_authenticated_insert | {authenticated} | INSERT | ...
--   companion_anon_insert             | {anon}          | INSERT | ...
--   <existing SELECT policy>          | ...             | SELECT | ...
