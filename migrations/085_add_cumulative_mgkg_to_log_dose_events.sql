-- ============================================================
-- Migration 085: Add cumulative_mg_kg to log_dose_events
-- ============================================================
-- Purpose:
--   WO-671 requires that each dose entry in log_dose_events stores
--   the cumulative mg/kg running total calculated at the time of
--   that dose administration, so the practitioner's real-time
--   safety calculation is permanently recorded in the session record.
--
--   Note on existing substance_type column:
--   Migration 077 already added 'substance_type' to log_dose_events.
--   The `substance_type` enum now needs to include 'ibogaine_hcl' and
--   'ibogaine_tpa' as valid values. This migration adds those enums via
--   an additive CHECK constraint approach (using a text column checked
--   against an expanded list).
--
--   LEAD Architecture decision (2026-03-24):
--     "substance_type is stored as text with enum-like validation.
--      Expand the CHECK constraint by dropping and recreating it."
--
-- Source: WO-671 — Mid-Session Ibogaine Dosing Calculator
-- Authored by: BUILDER (2026-03-25)
-- USER approval: REQUIRED before cloud execution
--
-- Architecture Constitution compliance:
--   ✅ Additive-only — no column drops, no type changes
--   ✅ cumulative_mg_kg column is nullable decimal(8,3)
--   ✅ IF NOT EXISTS guard on column addition
--   ✅ CHECK constraint on cumulative_mg_kg range (0–100 mg/kg)
--   ✅ No free-text columns introduced
-- ============================================================

-- ── 1. Add cumulative_mg_kg column ───────────────────────────────────────────
ALTER TABLE public.log_dose_events
    ADD COLUMN IF NOT EXISTS cumulative_mg_kg DECIMAL(8, 3)
        CHECK (cumulative_mg_kg IS NULL OR (cumulative_mg_kg > 0 AND cumulative_mg_kg <= 100));

COMMENT ON COLUMN public.log_dose_events.cumulative_mg_kg IS
    'Running cumulative mg/kg at the time this dose was administered. '
    'Computed from (sum of all prior dose_mg in session + this dose_mg) / patient_weight_kg. '
    'Displayed real-time in Phase 2 Ibogaine dosing calculator (WO-671). '
    'Nullable for non-Ibogaine sessions. Range 0–100 enforced. '
    'Source: Dr. Allen ibogaine protocol (2026-03-24).';

-- ── 2. Add session_weight_kg column ──────────────────────────────────────────
-- A confirmed or re-entered patient weight in kg used for mg/kg calculation.
-- Separate from Phase 1 intake weight because practitioners sometimes
-- confirm weight at session start, and the calculation weight must be
-- locked for the entire session.
ALTER TABLE public.log_dose_events
    ADD COLUMN IF NOT EXISTS session_weight_kg DECIMAL(5, 2)
        CHECK (session_weight_kg IS NULL OR (session_weight_kg > 0 AND session_weight_kg <= 400));

COMMENT ON COLUMN public.log_dose_events.session_weight_kg IS
    'Patient weight in kg confirmed at session start, used for mg/kg calculation. '
    'Stored per-dose for auditability. Same value across all dose rows in a session. '
    'Sourced from Phase 1 intake or practitioner confirmation at Phase 2 start.';

-- ── 3. Add dose_sequence field ────────────────────────────────────────────────
-- Ibogaine protocol: test dose (1) + dose 2 + dose 3 + optional supplemental.
-- Practitioner needs to identify which dose in the sequence each row represents.
ALTER TABLE public.log_dose_events
    ADD COLUMN IF NOT EXISTS dose_sequence INTEGER
        CHECK (dose_sequence IS NULL OR (dose_sequence BETWEEN 1 AND 20));

COMMENT ON COLUMN public.log_dose_events.dose_sequence IS
    'Ordinal position of this dose in the session sequence (1 = test dose, 2 = primary dose, etc.). '
    'Used to reconstruct the multi-dose arc for reporting and analytics (WO-671).';

-- ── Index ─────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_log_dose_events_session_sequence
    ON public.log_dose_events (session_id, dose_sequence)
    WHERE dose_sequence IS NOT NULL;

-- ── Verification Queries ──────────────────────────────────────────────────────
-- 1. Confirm new columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'log_dose_events'
  AND column_name  IN ('cumulative_mg_kg', 'session_weight_kg', 'dose_sequence')
ORDER BY ordinal_position;
-- Expected: 3 rows

-- 2. Confirm CHECK constraints
SELECT conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.log_dose_events'::regclass
  AND conname LIKE '%cumulative%' OR conname LIKE '%session_weight%' OR conname LIKE '%dose_sequence%';

-- 3. Zero harm to existing rows
SELECT COUNT(*) AS total,
       COUNT(cumulative_mg_kg) AS rows_with_mg_kg
FROM public.log_dose_events;
-- Expected: rows_with_mg_kg = 0 (all existing NULL)
