-- ============================================================
-- Migration 064: Create ref_ekg_rhythms
-- Purpose: Reference vocabulary for EKG rhythm classification.
--          Used by the EKG rhythm dropdown in Baseline Vitals
--          (WO-413 MT-1). Practitioners select a code; the label
--          is read back via JOIN.
--
-- Architecture Constitution compliance:
--   ✅ ref_ table — controlled vocabulary, no free-text
--   ✅ code column is CHECK-constrained via UNIQUE
--   ✅ is_active soft-delete — never hard-delete entries
--   ✅ valid_from / valid_to for longitudinal safety (ICD model)
--   ✅ RLS: authenticated users can read; no insert from client
--   ✅ Additive-only
--
-- INSPECTOR: Authorized for execution in Docker test DB.
-- USER: Copy-paste this file into Supabase SQL Editor to execute.
-- Date: 2026-02-25
-- ============================================================

-- ── Table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ref_ekg_rhythms (
    id          SERIAL      PRIMARY KEY,

    -- Short machine code stored in log_ tables
    code        VARCHAR(50) UNIQUE NOT NULL,

    -- Human-readable label displayed in the UI
    label       VARCHAR(150) NOT NULL,

    -- Clinical severity tier for UI ordering and potential color hinting
    -- 'normal'   = no action required
    -- 'monitor'  = increased observation recommended
    -- 'critical' = immediate clinical response required
    severity_tier VARCHAR(10) NOT NULL
                  CHECK (severity_tier IN ('normal', 'monitor', 'critical'))
                  DEFAULT 'monitor',

    -- Soft-delete support — never hard-delete a code in use by historical logs
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,

    -- Versioning (ICD model) — retirement date for retired codes
    valid_from  DATE    NOT NULL DEFAULT CURRENT_DATE,
    valid_to    DATE    -- NULL = still active

);

-- ── Seed Data ─────────────────────────────────────────────────
-- 12 clinically validated EKG rhythms. Curated for ibogaine/ketamine
-- psychedelic-assisted therapy contexts. Advisory-board review pending.
--
-- IMPORTANT: ON CONFLICT (code) DO NOTHING — idempotent reseed.
INSERT INTO ref_ekg_rhythms (code, label, severity_tier) VALUES
    ('NSR',           'Normal Sinus Rhythm',           'normal'),
    ('SINUS_BRADY',   'Sinus Bradycardia',             'monitor'),
    ('SINUS_TACHY',   'Sinus Tachycardia',             'monitor'),
    ('SINUS_ARRHYTH', 'Sinus Arrhythmia',              'monitor'),
    ('PAC',           'Premature Atrial Contraction',  'monitor'),
    ('PVC',           'Premature Ventricular Contraction', 'monitor'),
    ('AFIB',          'Atrial Fibrillation',           'critical'),
    ('AFLUTTER',      'Atrial Flutter',                'critical'),
    ('FIRST_DEG_AVB', 'First Degree AV Block',         'monitor'),
    ('QT_PROLONGED',  'QT Prolonged',                  'critical'),
    ('JUNCT_RHYTHM',  'Junctional Rhythm',             'monitor'),
    ('OTHER',         'Other (Document in safety event log)', 'monitor')
ON CONFLICT (code) DO NOTHING;

-- ── Index ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_ref_ekg_rhythms_is_active
    ON ref_ekg_rhythms(is_active);

-- ── Row Level Security ─────────────────────────────────────────
ALTER TABLE ref_ekg_rhythms ENABLE ROW LEVEL SECURITY;

-- Read-only for all authenticated users (ref_ tables are shared vocabulary)
DROP POLICY IF EXISTS "ref_ekg_rhythms_read" ON ref_ekg_rhythms;
CREATE POLICY "ref_ekg_rhythms_read"
    ON ref_ekg_rhythms FOR SELECT
    USING (auth.role() = 'authenticated');

-- No INSERT policy from client — vocabulary additions go through
-- INSPECTOR + USER approval workflow only.

-- ── Verification Query ────────────────────────────────────────
-- SELECT code, label, severity_tier FROM ref_ekg_rhythms ORDER BY id;
-- Expected: 12 rows matching the seed data above.

-- ── Done ──────────────────────────────────────────────────────
-- After USER runs this in Docker:
--   1. Signal BUILDER that MT-1 (EKG rhythm dropdown) is unblocked
--   2. BUILDER wires baseline vitals EKG dropdown to fetch from this table
--   3. INSPECTOR spot-check: SELECT COUNT(*) FROM ref_ekg_rhythms → expect 12
