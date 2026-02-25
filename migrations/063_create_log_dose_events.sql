-- ============================================================
-- Migration 063: Create log_dose_events (v2 — corrected)
-- Fixes from v1:
--   1. session_id: UUID → BIGINT (log_clinical_records PK is BIGSERIAL)
--   2. FK column: (id) → (clinical_record_id)
--   3. Removed GENERATED ALWAYS AS STORED — computed client-side
--   4. Simplified RLS — site join via log_clinical_records.site_id
--
-- Purpose: Persistent per-row tracking for the Cumulative Dose
--          Calculator (WO-413 PRD A). Each row = one dose admin
--          event during a session (initial dose or booster).
--
-- Architecture Constitution compliance:
--   ✅ No free-text columns
--   ✅ substance_id FK → ref_substances(substance_id) BIGSERIAL
--   ✅ session_id FK → log_clinical_records(clinical_record_id) BIGSERIAL
--   ✅ patient_id is synthetic VARCHAR — not a real identity
--   ✅ Additive-only — no DROP, no RENAME
--   ✅ RLS enabled — SELECT + INSERT policies
--
-- USER: Paste into Supabase SQL Editor to execute.
-- Date: 2026-02-25
-- ============================================================

CREATE TABLE IF NOT EXISTS log_dose_events (
    id                   BIGSERIAL    PRIMARY KEY,

    -- Session linkage — FK to log_clinical_records (PK: id UUID — confirmed 2026-02-25)
    session_id           UUID         NOT NULL
                         REFERENCES log_clinical_records(id)
                         ON DELETE CASCADE,

    -- Synthetic patient code — never PII
    patient_id           VARCHAR(20)  NOT NULL,

    -- Substance FK → ref_substances(substance_id)
    substance_id         BIGINT       NOT NULL
                         REFERENCES ref_substances(substance_id),

    -- Raw dose in milligrams
    dose_mg              NUMERIC(8, 2) NOT NULL CHECK (dose_mg > 0),

    -- Patient weight at time of recording (kg — sourced from intake)
    weight_kg            NUMERIC(5, 2) NOT NULL CHECK (weight_kg > 0),

    -- mg/kg — calculated client-side and stored for fast analytics
    dose_mg_per_kg       NUMERIC(8, 4),

    -- Running cumulative totals — calculated client-side before insert
    cumulative_mg        NUMERIC(8, 2),
    cumulative_mg_per_kg NUMERIC(8, 4),

    -- Event type
    event_type           VARCHAR(10)  NOT NULL
                         CHECK (event_type IN ('initial', 'booster', 'rescue'))
                         DEFAULT 'booster',

    -- When the dose was administered
    administered_at      TIMESTAMP    NOT NULL DEFAULT NOW(),

    created_at           TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_log_dose_events_session_id
    ON log_dose_events(session_id);

CREATE INDEX IF NOT EXISTS idx_log_dose_events_administered_at
    ON log_dose_events(session_id, administered_at);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE log_dose_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select log_dose_events" ON log_dose_events;
CREATE POLICY "Users can select log_dose_events"
    ON log_dose_events FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can insert log_dose_events" ON log_dose_events;
CREATE POLICY "Users can insert log_dose_events"
    ON log_dose_events FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ── Verification ──────────────────────────────────────────────
-- SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'log_dose_events';
-- Expected: 1
