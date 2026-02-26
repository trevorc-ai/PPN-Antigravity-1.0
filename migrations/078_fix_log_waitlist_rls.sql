-- ============================================================
-- Migration: 078_fix_log_waitlist_rls.sql
-- Purpose:   (1) Document the log_waitlist table that was created
--                directly in Supabase during the WO-410 fix session.
--            (2) Add the missing RLS INSERT policy for the anon role.
--                Without this policy, the waitlist form throws error 42501.
-- Safe:      Additive only. CREATE TABLE IF NOT EXISTS. Idempotent policies.
-- Created:   2026-02-26
-- Author:    INSPECTOR (emergency fix — beta launch blocker)
-- ============================================================

-- (1) Formally document the table in migrations (no-op if already exists)
CREATE TABLE IF NOT EXISTS public.log_waitlist (
    id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    first_name       TEXT        NOT NULL,
    email            TEXT        NOT NULL UNIQUE,
    practitioner_type TEXT       NOT NULL,
    source           TEXT        DEFAULT 'ppn_portal_main'
);

-- (2) Enable RLS (idempotent)
ALTER TABLE public.log_waitlist ENABLE ROW LEVEL SECURITY;

-- (3) Allow anonymous INSERT (public waitlist — no auth required)
--     This is the MISSING policy that caused the 42501 RLS violation.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'log_waitlist'
        AND policyname = 'allow_anon_insert_log_waitlist'
    ) THEN
        CREATE POLICY "allow_anon_insert_log_waitlist"
            ON public.log_waitlist
            FOR INSERT
            TO anon, authenticated
            WITH CHECK (true);
    END IF;
END $$;

-- (4) Allow authenticated users (admin) to read the list
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'log_waitlist'
        AND policyname = 'allow_authenticated_read_log_waitlist'
    ) THEN
        CREATE POLICY "allow_authenticated_read_log_waitlist"
            ON public.log_waitlist
            FOR SELECT
            TO authenticated
            USING (true);
    END IF;
END $$;

-- (5) Performance indexes
CREATE INDEX IF NOT EXISTS idx_log_waitlist_email
    ON public.log_waitlist (email);

CREATE INDEX IF NOT EXISTS idx_log_waitlist_created_at
    ON public.log_waitlist (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_log_waitlist_source
    ON public.log_waitlist (source);

-- ============================================================
-- VERIFICATION: Run after applying this migration
-- ============================================================
-- SELECT COUNT(*) FROM public.log_waitlist;
-- SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'log_waitlist';
-- Expected: 2 policies — allow_anon_insert + allow_authenticated_read
-- ============================================================
