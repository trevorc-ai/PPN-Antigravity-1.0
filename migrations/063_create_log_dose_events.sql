-- ============================================================
-- Migration 063: Create log_dose_events
-- Purpose: Persistent per-row tracking for the Cumulative Dose
--          Calculator (WO-413 PRD A). Each row = one dose admin
--          event during a session (initial dose or booster).
--
-- Architecture Constitution compliance:
--   ✅ No free-text columns — all enumerable fields are FKs or
--      constrained CHECK values.
--   ✅ Substance stored as substance_id FK → ref_substances
--   ✅ No practitioner name or patient name stored
--   ✅ patient_id is synthetic VARCHAR — not a real identity
--   ✅ Additive-only — no DROP, no RENAME
--   ✅ RLS enabled — SELECT + INSERT policies
--
-- Pre-flight verification (run before executing):
--   SELECT table_name FROM information_schema.tables
--   WHERE table_name IN ('log_clinical_records', 'ref_substances');
--   Both must return rows.
--
-- INSPECTOR: Authorized for execution in Docker test DB.
-- USER: Copy-paste this file into Supabase SQL Editor to execute.
-- Date: 2026-02-25
-- ============================================================

-- ── Table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS log_dose_events (
    id              SERIAL PRIMARY KEY,

    -- Session / patient linkage
    session_id      UUID        NOT NULL
                    REFERENCES log_clinical_records(id)
                    ON DELETE CASCADE,

    patient_id      VARCHAR(20) NOT NULL,   -- synthetic patient code, never PII

    -- Dose administration details
    -- substance_id FK → ref_substances (verified live table)
    substance_id    INTEGER     NOT NULL
                    REFERENCES ref_substances(substance_id),

    -- Raw dose in milligrams (measured scalar — no FK needed)
    dose_mg         NUMERIC(8, 2) NOT NULL CHECK (dose_mg > 0),

    -- Patient weight at time of recording (kg — sourced from intake, read-only)
    weight_kg       NUMERIC(5, 2) NOT NULL CHECK (weight_kg > 0),

    -- Computed mg/kg — stored for fast analytics, recalculated from dose_mg / weight_kg
    -- BUILDER populates this: calculated client-side before insert
    dose_mg_per_kg  NUMERIC(8, 4) GENERATED ALWAYS AS (dose_mg / weight_kg) STORED,

    -- Event classification:
    --   'initial'  = first dose of session
    --   'booster'  = subsequent supplemental dose
    --   'rescue'   = emergency dose (rare — should trigger safety event)
    event_type      VARCHAR(10)  NOT NULL
                    CHECK (event_type IN ('initial', 'booster', 'rescue'))
                    DEFAULT 'booster',

    -- Timestamp when dose was administered (practitioner-entered or auto-stamped)
    administered_at TIMESTAMP   NOT NULL DEFAULT NOW(),

    -- Running cumulative total at the time of this event (pre-calculated by client)
    -- Stored to allow fast analytics without re-summing all prior rows
    cumulative_mg         NUMERIC(8, 2),
    cumulative_mg_per_kg  NUMERIC(8, 4),

    -- Notes field: INTENTIONALLY OMITTED per Architecture Constitution §2.
    -- Free-text practitioner notes are not stored. If a practitioner needs
    -- to flag an event, they use the safety event workflow (log_safety_events).

    created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
-- Fast lookup for all doses in a session (primary analytics query)
CREATE INDEX IF NOT EXISTS idx_log_dose_events_session_id
    ON log_dose_events(session_id);

-- Fast chronological listing per session (required for running total display)
CREATE INDEX IF NOT EXISTS idx_log_dose_events_administered_at
    ON log_dose_events(session_id, administered_at);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE log_dose_events ENABLE ROW LEVEL SECURITY;

-- SELECT: practitioners can only read dose events for sessions at their site
DROP POLICY IF EXISTS "Users can select their site log_dose_events" ON log_dose_events;
CREATE POLICY "Users can select their site log_dose_events"
    ON log_dose_events FOR SELECT
    USING (
        session_id IN (
            SELECT id FROM log_clinical_records
            WHERE site_id IN (
                SELECT site_id FROM log_user_sites
                WHERE user_id = auth.uid()
            )
        )
    );

-- INSERT: practitioners can insert dose events for sessions at their site
DROP POLICY IF EXISTS "Users can insert log_dose_events" ON log_dose_events;
CREATE POLICY "Users can insert log_dose_events"
    ON log_dose_events FOR INSERT
    WITH CHECK (
        session_id IN (
            SELECT id FROM log_clinical_records
            WHERE site_id IN (
                SELECT site_id FROM log_user_sites
                WHERE user_id = auth.uid()
            )
        )
    );

-- ── Verification Query (run after migration to confirm success) ──
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'log_dose_events'
-- ORDER BY ordinal_position;

-- ── Done ──────────────────────────────────────────────────────
-- After USER runs this in Docker:
--   1. Signal BUILDER that PRD A (Cumulative Dose Calculator) is unblocked
--   2. BUILDER wires CumulativeDoseCalculator.tsx to persist via this table
--   3. INSPECTOR spot-check: insert one row, read it back, confirm mg_per_kg computed correctly
