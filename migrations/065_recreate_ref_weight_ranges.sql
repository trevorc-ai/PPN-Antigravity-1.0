-- ============================================================
-- Migration 065: Recreate ref_weight_ranges with 5kg bands
-- Purpose: Restore the weight range reference table that was
--          dropped/emptied. Expands from 5 coarse bands to
--          precise 5kg bands with dual kg + lbs labels, matching
--          the format "120-125 kg (265-276 lbs)".
--
-- Architecture Constitution compliance:
--   ✅ ref_ table — controlled vocabulary, no free text
--   ✅ range_label UNIQUE constraint — idempotent insert
--   ✅ is_active soft-delete — no hard deletes
--   ✅ sort_order for UI ordering
--   ✅ Additive-only
--   ✅ RLS: authenticated read-only
--
-- INSPECTOR: Authorized for execution in Docker test DB.
-- USER: Paste into Supabase SQL Editor to execute.
-- Date: 2026-02-25
-- ============================================================

-- ── Recreate table (IF NOT EXISTS is safe if it already exists) ──
CREATE TABLE IF NOT EXISTS public.ref_weight_ranges (
    id          BIGSERIAL   PRIMARY KEY,
    range_label TEXT        NOT NULL UNIQUE,   -- e.g. "45-50 kg (99-110 lbs)"
    kg_low      NUMERIC(5,1) NOT NULL,         -- lower bound in kg (for mg/kg calc comparisons)
    kg_high     NUMERIC(5,1) NOT NULL,         -- upper bound in kg
    sort_order  INTEGER     NOT NULL,
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Index ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_ref_weight_ranges_sort
    ON public.ref_weight_ranges(sort_order);

-- ── Seed: 5kg bands from 40kg to 200kg with lbs equivalents ──
-- lbs = kg * 2.2046 (rounded to nearest whole lb)
-- Format: "NN-NN kg (NNN-NNN lbs)"
INSERT INTO public.ref_weight_ranges (range_label, kg_low, kg_high, sort_order) VALUES
    ('< 40 kg (< 88 lbs)',            0,    40,   1),
    ('40-45 kg (88-99 lbs)',          40,   45,   2),
    ('45-50 kg (99-110 lbs)',         45,   50,   3),
    ('50-55 kg (110-121 lbs)',        50,   55,   4),
    ('55-60 kg (121-132 lbs)',        55,   60,   5),
    ('60-65 kg (132-143 lbs)',        60,   65,   6),
    ('65-70 kg (143-154 lbs)',        65,   70,   7),
    ('70-75 kg (154-165 lbs)',        70,   75,   8),
    ('75-80 kg (165-176 lbs)',        75,   80,   9),
    ('80-85 kg (176-187 lbs)',        80,   85,  10),
    ('85-90 kg (187-198 lbs)',        85,   90,  11),
    ('90-95 kg (198-209 lbs)',        90,   95,  12),
    ('95-100 kg (209-220 lbs)',       95,  100,  13),
    ('100-105 kg (220-231 lbs)',     100,  105,  14),
    ('105-110 kg (231-243 lbs)',     105,  110,  15),
    ('110-115 kg (243-254 lbs)',     110,  115,  16),
    ('115-120 kg (254-265 lbs)',     115,  120,  17),
    ('120-125 kg (265-276 lbs)',     120,  125,  18),
    ('125-130 kg (276-287 lbs)',     125,  130,  19),
    ('130-140 kg (287-309 lbs)',     130,  140,  20),
    ('140-150 kg (309-331 lbs)',     140,  150,  21),
    ('150-160 kg (331-353 lbs)',     150,  160,  22),
    ('160-175 kg (353-386 lbs)',     160,  175,  23),
    ('> 175 kg (> 386 lbs)',         175, 9999,  24)
ON CONFLICT (range_label) DO NOTHING;

-- ── RLS ───────────────────────────────────────────────────────
ALTER TABLE public.ref_weight_ranges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ref_weight_ranges_read" ON public.ref_weight_ranges;
CREATE POLICY "ref_weight_ranges_read"
    ON public.ref_weight_ranges FOR SELECT
    TO authenticated USING (true);

-- ── updated_at trigger (matches migration 012 pattern) ────────
-- Only create if the update_updated_at_column function exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column'
    ) THEN
        -- Drop existing trigger if it exists from migration 012
        DROP TRIGGER IF EXISTS update_ref_weight_ranges_updated_at
            ON public.ref_weight_ranges;

        CREATE TRIGGER update_ref_weight_ranges_updated_at
            BEFORE UPDATE ON public.ref_weight_ranges
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ── Verification ──────────────────────────────────────────────
-- SELECT COUNT(*) FROM ref_weight_ranges;  -- expect 24
-- SELECT range_label, kg_low, kg_high FROM ref_weight_ranges ORDER BY sort_order;
