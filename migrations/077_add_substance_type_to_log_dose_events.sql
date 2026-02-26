-- ============================================================
-- Migration 077: Add substance_type to log_dose_events
-- ============================================================
-- Purpose:
--   Dr. Allen's FRD (Ibogaine_Research_SaaS.md) requires that
--   the Cumulative Dose Calculator distinguish between:
--     - Pure Ibogaine HCl        (100% active ibogaine)
--     - Total Plant Alkaloid (TPA) (~80% active ibogaine)
--
--   200mg TPA ≠ 200mg HCl. Without this column, the dose log
--   has no record of which form was administered, and the
--   estimated_active_ibogaine_mg calculation cannot be audited.
--
-- Source: WO-413 — Dr. Allen Demo Requests (GAP-3)
-- Source: public/admin_uploads/Ibogaine_Research_SaaS.md
-- Authored by: INSPECTOR (2026-02-25)
-- USER approval: REQUIRED before cloud execution
--
-- Architecture Constitution compliance:
--   ✅ Additive-only — no DROP, no RENAME, no type change
--   ✅ CHECK constraint — enumerable finite set
--   ✅ DEFAULT provided — existing rows backfill to 'HCl'
--   ✅ No free-text column (CHECK enforces finite vocabulary)
--   ✅ RLS not affected — no policy changes needed
-- ============================================================

ALTER TABLE public.log_dose_events
    ADD COLUMN IF NOT EXISTS substance_type VARCHAR(10)
        NOT NULL
        DEFAULT 'HCl'
        CHECK (substance_type IN ('HCl', 'TPA'));

-- ── Index: useful for analytics queries filtering by substance ──
CREATE INDEX IF NOT EXISTS idx_log_dose_events_substance_type
    ON public.log_dose_events (substance_type);

-- ── Verification Queries ──────────────────────────────────────
-- Run after migration to confirm success:

-- 1. Confirm column exists with correct type and constraint
SELECT
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'log_dose_events'
  AND column_name  = 'substance_type';
-- Expected: 1 row — substance_type, character varying, 10, 'HCl', NO

-- 2. Confirm CHECK constraint is present
SELECT
    conname,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.log_dose_events'::regclass
  AND conname LIKE '%substance_type%';
-- Expected: 1 row with CHECK (substance_type IN ('HCl', 'TPA'))

-- 3. Confirm existing rows received the default
SELECT substance_type, COUNT(*) AS row_count
FROM public.log_dose_events
GROUP BY substance_type;
-- Expected: 0 rows if table is empty, OR rows showing 'HCl' for all existing data
