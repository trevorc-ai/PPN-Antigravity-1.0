-- ============================================================
-- Migration 082: Add qtc_baseline_ms to log_clinical_records
-- ============================================================
-- Purpose:
--   WO-672 requires that a baseline QTc (ms) be captured in Phase 1
--   before Ibogaine administration. Without a stored baseline, the
--   Phase 2 4-tier QTc alert system cannot compute the delta from
--   baseline, and the phase-to-phase safety record is incomplete.
--
--   LEAD Architecture (2026-03-24):
--   "Baseline QTc field: check if session_baselines.qtc_baseline_ms
--    already exists before adding — if so, no migration needed"
--
--   Verified: no qtc_baseline_ms column exists on log_clinical_records
--   (grep across all migrations returns zero matches).
--   Column is therefore added here as an additive, nullable integer.
--
-- Source: WO-672 — ECG Baseline and QTc Monitoring Alert System
-- Authored by: BUILDER (2026-03-25)
-- USER approval: REQUIRED before cloud execution
--
-- Architecture Constitution compliance:
--   ✅ Additive-only — no DROP, no RENAME, no type change
--   ✅ Nullable column — no DEFAULT needed; pre-existing rows are NULL
--   ✅ CHECK constraint — physiologically valid QTc range (200–800ms)
--   ✅ No free-text column — integer only
--   ✅ RLS not affected — column added to existing RLS-protected table
--   ✅ IF NOT EXISTS guard — idempotent execution
-- ============================================================

ALTER TABLE public.log_clinical_records
    ADD COLUMN IF NOT EXISTS qtc_baseline_ms INTEGER
        CHECK (qtc_baseline_ms IS NULL OR (qtc_baseline_ms BETWEEN 200 AND 800));

COMMENT ON COLUMN public.log_clinical_records.qtc_baseline_ms IS
    'Baseline QTc reading in milliseconds captured in Phase 1 before Ibogaine administration. '
    'Range 200–800ms enforced. NULL for non-Ibogaine sessions. '
    'Advisory only — used by 4-tier Phase 2 QTc alert system (WO-672). '
    'Source: Dr. Allen ibogaine safety protocol (2026-03-24).';

-- ── Index: useful for Phase 2 delta calc and analytics queries ──
CREATE INDEX IF NOT EXISTS idx_log_clinical_records_qtc_baseline
    ON public.log_clinical_records (qtc_baseline_ms)
    WHERE qtc_baseline_ms IS NOT NULL;

-- ── Verification Queries ──────────────────────────────────────
-- Run after migration to confirm success:

-- 1. Confirm column exists with correct type and constraint
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'log_clinical_records'
  AND column_name  = 'qtc_baseline_ms';
-- Expected: 1 row — qtc_baseline_ms, integer, YES, null

-- 2. Confirm CHECK constraint is present
SELECT
    conname,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.log_clinical_records'::regclass
  AND conname LIKE '%qtc_baseline%';
-- Expected: 1 row with range check

-- 3. Confirm no existing rows were harmed
SELECT COUNT(*) AS total_rows,
       COUNT(qtc_baseline_ms) AS rows_with_qtc
FROM public.log_clinical_records;
-- Expected: rows_with_qtc = 0 (all existing rows NULL)
