-- =============================================================================
-- Migration 076: Create log_dose_events
-- Author: INSPECTOR (SOOP proxy — SOOP role fulfilled by INSPECTOR for unblocking WO-413 PRD A)
-- Date: 2026-02-25
-- Work Order: WO-413 — PRD A (Cumulative Dose Calculator)
-- Architecture Constitution: Additive only. No DROP. No free-text. No staff names.
-- Requires USER approval before execution per migration-execution-protocol.
-- =============================================================================
-- 
-- PURPOSE:
--   Track every discrete substance dose event within a wellness journey session.
--   Powers the CumulativeDoseCalculator component (WO-413 PRD A).
--   Each row = one bolus/booster/rescue event, identified only by Subject_ID.
--
-- PRIVACY RULES (Architecture Constitution §2):
--   - No patient names, DOBs, addresses
--   - subject_id is a synthetic hash — NOT a sequential patient number
--   - practitioner_id is auth.users UUID — NOT a name string
--   - substance_id is a FK to ref_substances — NOT a free-text substance name
--   - dose_event_type is CHECK-constrained — NOT a free-text category
--   - No free-text columns of any kind
--
-- DEPENDENCIES (must exist before this migration runs):
--   - public.ref_substances (substance_id PK)
--   - auth.users (for practitioner_id FK)
-- =============================================================================

-- ── Step 1: Create the table ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.log_dose_events (
    -- Primary key
    dose_event_id       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Session reference (links to wellness_sessions if table exists, else loose FK)
    session_id          UUID        NOT NULL,

    -- Subject identity — synthetic hash only, never a name
    subject_id          TEXT        NOT NULL
                                    CHECK (subject_id ~ '^[A-Z0-9]{6,16}$'),

    -- Practitioner — UUID FK to auth.users (never a name string)
    practitioner_id     UUID        NOT NULL
                                    REFERENCES auth.users(id) ON DELETE RESTRICT,

    -- Substance — FK to reference table, NOT free text
    substance_id        INTEGER     NOT NULL
                                    REFERENCES public.ref_substances(substance_id) ON DELETE RESTRICT,

    -- Dose event classification — finite set, CHECK-constrained
    dose_event_type     TEXT        NOT NULL
                                    CHECK (dose_event_type IN (
                                        'initial',      -- first dose of session
                                        'booster',      -- planned supplemental dose
                                        'rescue'        -- clinician-initiated safety intervention
                                    )),

    -- Measured dose in milligrams — scalar only, no unit ambiguity
    dose_mg             NUMERIC(8,3) NOT NULL
                                    CHECK (dose_mg > 0 AND dose_mg <= 9999),

    -- Weight used for mg/kg calculation at time of event — scalar scalar only
    -- Stored separately from patient record snapshot so historical calculations are reproducible
    patient_weight_kg   NUMERIC(5,1) NOT NULL
                                    CHECK (patient_weight_kg > 0 AND patient_weight_kg <= 500),

    -- Computed at insert time for auditability — not recalculated later
    dose_mg_per_kg      NUMERIC(8,4) GENERATED ALWAYS AS (dose_mg / patient_weight_kg) STORED,

    -- Temporal — session-relative elapsed minutes from session start
    -- NULL allowed: initial dose may be at t=0 not yet calculated
    session_elapsed_min INTEGER     CHECK (session_elapsed_min >= 0),

    -- Wall clock timestamp of dose administration
    administered_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Audit timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Step 2: Indexes ───────────────────────────────────────────────────────────

-- Primary query pattern: all dose events for a session (used by CumulativeDoseCalculator)
CREATE INDEX IF NOT EXISTS idx_log_dose_events_session_id
    ON public.log_dose_events (session_id, administered_at);

-- Secondary: all events for a subject across sessions (longitudinal cumulative dose view)
CREATE INDEX IF NOT EXISTS idx_log_dose_events_subject_id
    ON public.log_dose_events (subject_id, administered_at);

-- Tertiary: practitioner-level query for their own events (RLS enforcement)
CREATE INDEX IF NOT EXISTS idx_log_dose_events_practitioner_id
    ON public.log_dose_events (practitioner_id);

-- ── Step 3: Row Level Security ────────────────────────────────────────────────

ALTER TABLE public.log_dose_events ENABLE ROW LEVEL SECURITY;

-- Practitioners can only INSERT and SELECT their own dose events
CREATE POLICY "practitioners_own_dose_events"
    ON public.log_dose_events
    FOR ALL
    USING (practitioner_id = auth.uid())
    WITH CHECK (practitioner_id = auth.uid());

-- ── Step 4: Comments (documentation in the schema itself) ─────────────────────

COMMENT ON TABLE public.log_dose_events IS
    'WO-413 PRD A — One row per discrete dose administration event within a session. '
    'Powers CumulativeDoseCalculator. No PHI — subject_id is synthetic hash only. '
    'Architecture Constitution compliant: no free-text columns, all categoricals are FK or CHECK-constrained.';

COMMENT ON COLUMN public.log_dose_events.subject_id IS
    'Synthetic Subject ID (format: AAAA0000). Never a patient name or DOB. '
    'Must match CHECK constraint pattern ^[A-Z0-9]{6,16}$.';

COMMENT ON COLUMN public.log_dose_events.dose_mg_per_kg IS
    'Generated column — computed from dose_mg / patient_weight_kg at insert time. '
    'Read-only. Used by CumulativeDoseCalculator for dosing band display.';

COMMENT ON COLUMN public.log_dose_events.dose_event_type IS
    'Controlled vocabulary. initial = first bolus. booster = planned supplement. '
    'rescue = clinician-initiated safety intervention (e.g., benzodiazepine, ketamine reversal).';

-- ── Step 5: Inline verification queries (paste results into WO-413 before USER approval) ───

-- Confirm table was created with expected columns
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'log_dose_events'
ORDER BY ordinal_position;

-- Confirm RLS is enabled
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename  = 'log_dose_events';

-- Confirm CHECK constraints
SELECT
    conname,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.log_dose_events'::regclass
  AND contype  = 'c'
ORDER BY conname;

-- Confirm RLS policies
SELECT
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'log_dose_events';
