-- ============================================================
-- Migration: 060_create_academy_waitlist.sql
-- Purpose:   Create the academy_waitlist table for the
--            PPN Practitioner Academy waitlist landing page.
-- Safe:      Additive only. No columns dropped. No type changes.
-- Created:   2026-02-20
-- ============================================================

-- Create the waitlist table
CREATE TABLE IF NOT EXISTS public.academy_waitlist (
    id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    first_name       TEXT        NOT NULL,
    email            TEXT        NOT NULL UNIQUE,
    practitioner_type TEXT       NOT NULL,
    source           TEXT        DEFAULT 'academy_landing_page'
);

-- Enable RLS
ALTER TABLE public.academy_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public waitlist form — no auth required)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'academy_waitlist'
        AND policyname = 'allow_public_insert'
    ) THEN
        CREATE POLICY "allow_public_insert"
            ON public.academy_waitlist
            FOR INSERT
            WITH CHECK (true);
    END IF;
END $$;

-- Allow authenticated users (admins / Admin) to read the list
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'academy_waitlist'
        AND policyname = 'allow_authenticated_read'
    ) THEN
        CREATE POLICY "allow_authenticated_read"
            ON public.academy_waitlist
            FOR SELECT
            USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Index on email for fast duplicate detection
CREATE INDEX IF NOT EXISTS idx_academy_waitlist_email
    ON public.academy_waitlist (email);

-- Index on created_at so you can sort the list by join date
CREATE INDEX IF NOT EXISTS idx_academy_waitlist_created_at
    ON public.academy_waitlist (created_at DESC);

-- ============================================================
-- VERIFICATION: Run after applying this migration
-- ============================================================
-- SELECT COUNT(*) FROM public.academy_waitlist;
-- SELECT * FROM pg_policies WHERE tablename = 'academy_waitlist';
-- ============================================================
