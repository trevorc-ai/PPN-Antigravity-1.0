-- ============================================================
-- Migration 083: Ibogaine Withdrawal & Addiction Assessment Tables
-- ============================================================
-- Purpose:
--   WO-668 requires structured storage of 4 assessment instruments
--   used in Ibogaine OUD/AUD treatment protocols:
--     - COWS  (Clinical Opiate Withdrawal Scale)   — 11 items, 0–55
--     - SOWS  (Subjective Opiate Withdrawal Scale)  — aggregate score only
--     - BAWS  (Brief Alcohol Withdrawal Scale)       — aggregate score only
--     - ASI   (Addiction Severity Index)            — 7-domain scores
--
--   LEAD Architecture decision (2026-03-24):
--     - All scores stored as structured integers, no free text
--     - Pre/post session distinguished by timing enum (pre | post)
--     - New dedicated table: log_ibogaine_withdrawal_assessments
--     - Session-level RLS: must inherit from log_clinical_records
--     - All cards are opt-in toggles per Dr. Allen — no gates
--
-- Source: WO-668 — Ibogaine Withdrawal & Addiction Severity Assessment Module
-- Authored by: BUILDER (2026-03-25)
-- USER approval: REQUIRED before cloud execution
--
-- Architecture Constitution compliance:
--   ✅ Additive-only — new table only, no existing mutations
--   ✅ All score columns are typed integers with CHECK constraints
--   ✅ No free-text columns
--   ✅ RLS enabled with session-level policy
--   ✅ timing CHECK enum constraint
--   ✅ IF NOT EXISTS guard on table and index creation
--   ✅ FK to log_clinical_records with ON DELETE CASCADE
-- ============================================================

-- ── Reference table: assessment type registry ────────────────────────────────
CREATE TABLE IF NOT EXISTS ref_ibogaine_assessment_types (
    assessment_type_id SERIAL PRIMARY KEY,
    type_code          VARCHAR(10) UNIQUE NOT NULL,
    type_name          VARCHAR(100) NOT NULL,
    min_score          INTEGER NOT NULL,
    max_score          INTEGER NOT NULL,
    description        TEXT,
    is_active          BOOLEAN DEFAULT true,
    created_at         TIMESTAMP DEFAULT NOW()
);

INSERT INTO ref_ibogaine_assessment_types
    (type_code, type_name, min_score, max_score, description)
VALUES
    ('COWS',  'Clinical Opiate Withdrawal Scale',      0,  55,  '11-item clinician-administered OUD withdrawal severity scale. Confirms opioid dependence; scores severity before and after Ibogaine.'),
    ('SOWS',  'Subjective Opiate Withdrawal Scale',     0,  64,  'Patient-rated opiate withdrawal symptom checklist. Complements COWS with the patient perspective.'),
    ('BAWS',  'Brief Alcohol Withdrawal Scale',         0,  19,  'Structured AUD withdrawal severity instrument. Appropriate when alcohol dependence is part of the indication.'),
    ('ASI',   'Addiction Severity Index',               0, 280,  '7-domain structured intake instrument. Domains: Medical, Employment, Alcohol, Drug, Legal, Family/Social, Psychiatric.')
ON CONFLICT (type_code) DO NOTHING;

-- Enable RLS (reference table: read-only for authenticated users)
ALTER TABLE ref_ibogaine_assessment_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ibogaine_assessment_types_read" ON ref_ibogaine_assessment_types;
CREATE POLICY "ibogaine_assessment_types_read"
    ON ref_ibogaine_assessment_types FOR SELECT
    USING (auth.role() = 'authenticated');

-- ── Log table: assessment scores per session ─────────────────────────────────
CREATE TABLE IF NOT EXISTS log_ibogaine_withdrawal_assessments (
    assessment_id       SERIAL PRIMARY KEY,
    session_id          UUID NOT NULL
        REFERENCES public.log_clinical_records(id) ON DELETE CASCADE,

    -- Which instrument was administered?
    assessment_type_id  INTEGER NOT NULL
        REFERENCES ref_ibogaine_assessment_types(assessment_type_id),

    -- Timing: pre-session baseline or post-session re-administration
    timing              VARCHAR(4) NOT NULL
        DEFAULT 'pre'
        CHECK (timing IN ('pre', 'post')),

    -- ── COWS fields (0–55 total; 11 items each 0–5 or 0–8) ──────────────────
    -- Stored as individual item scores for future research granularity.
    -- All nullable — only COWS records populate these columns.
    cows_resting_pulse_rate        INTEGER CHECK (cows_resting_pulse_rate        BETWEEN 0 AND 4),
    cows_sweating                  INTEGER CHECK (cows_sweating                  BETWEEN 0 AND 4),
    cows_restlessness              INTEGER CHECK (cows_restlessness              BETWEEN 0 AND 5),
    cows_pupil_size                INTEGER CHECK (cows_pupil_size                BETWEEN 0 AND 5),
    cows_bone_joint_aches          INTEGER CHECK (cows_bone_joint_aches          BETWEEN 0 AND 4),
    cows_runny_nose                INTEGER CHECK (cows_runny_nose                BETWEEN 0 AND 4),
    cows_gi_upset                  INTEGER CHECK (cows_gi_upset                  BETWEEN 0 AND 5),
    cows_tremor                    INTEGER CHECK (cows_tremor                    BETWEEN 0 AND 4),
    cows_yawning                   INTEGER CHECK (cows_yawning                   BETWEEN 0 AND 4),
    cows_anxiety_irritability      INTEGER CHECK (cows_anxiety_irritability      BETWEEN 0 AND 4),
    cows_gooseflesh_skin           INTEGER CHECK (cows_gooseflesh_skin           BETWEEN 0 AND 5),
    cows_total_score               INTEGER CHECK (cows_total_score               BETWEEN 0 AND 55),

    -- ── SOWS aggregate score ──────────────────────────────────────────────────
    sows_total_score               INTEGER CHECK (sows_total_score               BETWEEN 0 AND 64),

    -- ── BAWS aggregate score ──────────────────────────────────────────────────
    baws_total_score               INTEGER CHECK (baws_total_score               BETWEEN 0 AND 19),

    -- ── ASI domain scores (0–40 each for a possible 280 maximum) ─────────────
    -- Domain scores: 0 = No problem, higher = greater severity.
    asi_medical_score              INTEGER CHECK (asi_medical_score              BETWEEN 0 AND 40),
    asi_employment_score           INTEGER CHECK (asi_employment_score           BETWEEN 0 AND 40),
    asi_alcohol_score              INTEGER CHECK (asi_alcohol_score              BETWEEN 0 AND 40),
    asi_drug_score                 INTEGER CHECK (asi_drug_score                 BETWEEN 0 AND 40),
    asi_legal_score                INTEGER CHECK (asi_legal_score                BETWEEN 0 AND 40),
    asi_family_social_score        INTEGER CHECK (asi_family_social_score        BETWEEN 0 AND 40),
    asi_psychiatric_score          INTEGER CHECK (asi_psychiatric_score          BETWEEN 0 AND 40),
    asi_composite_score            INTEGER CHECK (asi_composite_score            BETWEEN 0 AND 280),

    -- Metadata
    administered_at                TIMESTAMP DEFAULT NOW(),
    administered_by_user_id        UUID REFERENCES auth.users(id),
    created_at                     TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE log_ibogaine_withdrawal_assessments IS
    'Stores COWS, SOWS, BAWS, and ASI assessment scores for Ibogaine sessions. '
    'All instruments are opt-in per practitioner choice (no gate). '
    'Pre/post timing allows COWS and SOWS re-administration at session closeout (WO-668).';

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE log_ibogaine_withdrawal_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ibogaine_withdrawal_assessments_select" ON log_ibogaine_withdrawal_assessments;
CREATE POLICY "ibogaine_withdrawal_assessments_select"
    ON log_ibogaine_withdrawal_assessments FOR SELECT
    USING (
        session_id IN (
            SELECT id FROM log_clinical_records
            WHERE site_id IN (
                SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
            )
        )
    );

DROP POLICY IF EXISTS "ibogaine_withdrawal_assessments_insert" ON log_ibogaine_withdrawal_assessments;
CREATE POLICY "ibogaine_withdrawal_assessments_insert"
    ON log_ibogaine_withdrawal_assessments FOR INSERT
    WITH CHECK (
        session_id IN (
            SELECT id FROM log_clinical_records
            WHERE site_id IN (
                SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
            )
        )
    );

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_ibogaine_wa_session_id
    ON log_ibogaine_withdrawal_assessments (session_id);

CREATE INDEX IF NOT EXISTS idx_ibogaine_wa_session_timing
    ON log_ibogaine_withdrawal_assessments (session_id, timing);

CREATE INDEX IF NOT EXISTS idx_ibogaine_wa_type_timing
    ON log_ibogaine_withdrawal_assessments (assessment_type_id, timing);

-- ── Verification Queries ──────────────────────────────────────────────────────
-- 1. Table exists with expected columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'log_ibogaine_withdrawal_assessments'
ORDER BY ordinal_position;

-- 2. Reference data seeded
SELECT type_code, type_name, min_score, max_score
FROM ref_ibogaine_assessment_types
ORDER BY type_code;
-- Expected: 4 rows — ASI, BAWS, COWS, SOWS

-- 3. RLS policies present
SELECT polname, polcmd, polpermissive
FROM pg_policy
WHERE polrelid = 'log_ibogaine_withdrawal_assessments'::regclass;
-- Expected: 2 rows — select + insert
