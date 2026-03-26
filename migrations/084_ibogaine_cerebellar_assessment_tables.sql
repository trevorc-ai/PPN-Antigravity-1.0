-- ============================================================
-- Migration 084: Ibogaine Cerebellar Safety Assessment Tables
-- ============================================================
-- Purpose:
--   WO-669 requires structured storage of 3 cerebellar/vestibular
--   safety assessment instruments administered during and after
--   Ibogaine dosing sessions:
--     - SARA  (Scale for the Assessment and Rating of Ataxia): 8 items, 0–40
--     - FTN   (Finger-to-Nose Test): 3 items, 0–5 per side
--     - HKS   (Heel-Knee-Shin Test): categorical per side
--
--   LEAD Architecture (2026-03-24):
--     - New dedicated log table: log_ibogaine_cerebellar_assessments
--     - timing: pre | mid | post — supports intra-session serial monitoring
--     - SARA item scores stored individually for research granularity
--     - HKS categorical, not numeric — stored as enum text per Zero-PHI rules
--     - All instruments are opt-in, non-blocking
--
-- Source: WO-669 — Ibogaine Cerebellar & Vestibular Safety Assessment Module
-- Authored by: BUILDER (2026-03-25)
-- USER approval: REQUIRED before cloud execution
--
-- Architecture Constitution compliance:
--   ✅ Additive-only — new table only
--   ✅ No free-text columns — enums and integers
--   ✅ RLS enabled with session-level policy
--   ✅ timing CHECK enum constraint (pre | mid | post)
--   ✅ IF NOT EXISTS guard on table and index creation
--   ✅ FK to log_clinical_records with ON DELETE CASCADE
-- ============================================================

CREATE TABLE IF NOT EXISTS log_ibogaine_cerebellar_assessments (
    assessment_id       SERIAL PRIMARY KEY,
    session_id          UUID NOT NULL
        REFERENCES public.log_clinical_records(id) ON DELETE CASCADE,

    -- Timing: pre-session baseline, mid-session monitoring, post-session
    timing              VARCHAR(4) NOT NULL
        DEFAULT 'pre'
        CHECK (timing IN ('pre', 'mid', 'post')),

    -- ── SARA — Scale for the Assessment and Rating of Ataxia ─────────────────
    -- 8 items, each scored 0–4 or 0–8 depending on the item.
    -- All nullable — only SARA records populate these columns.
    sara_gait               INTEGER CHECK (sara_gait               BETWEEN 0 AND 8),
    sara_stance             INTEGER CHECK (sara_stance             BETWEEN 0 AND 6),
    sara_sitting            INTEGER CHECK (sara_sitting            BETWEEN 0 AND 4),
    sara_speech_disturbance INTEGER CHECK (sara_speech_disturbance BETWEEN 0 AND 6),
    sara_finger_chase       INTEGER CHECK (sara_finger_chase       BETWEEN 0 AND 4),
    sara_nose_finger_test   INTEGER CHECK (sara_nose_finger_test   BETWEEN 0 AND 4),
    sara_fast_alternating   INTEGER CHECK (sara_fast_alternating   BETWEEN 0 AND 4),
    sara_heel_slide         INTEGER CHECK (sara_heel_slide         BETWEEN 0 AND 4),
    sara_total_score        INTEGER CHECK (sara_total_score        BETWEEN 0 AND 40),

    -- ── FTN — Finger-to-Nose Test ──────────────────────────────────────────
    -- Each side scored 0 (absent) to 5 (severe).
    -- Pass rate also recorded per side (0–10 attempts).
    ftn_left_score          INTEGER CHECK (ftn_left_score          BETWEEN 0 AND 5),
    ftn_right_score         INTEGER CHECK (ftn_right_score         BETWEEN 0 AND 5),
    ftn_left_attempts       INTEGER CHECK (ftn_left_attempts       BETWEEN 0 AND 10),
    ftn_right_attempts      INTEGER CHECK (ftn_right_attempts      BETWEEN 0 AND 10),
    ftn_left_passes         INTEGER CHECK (ftn_left_passes         BETWEEN 0 AND 10),
    ftn_right_passes        INTEGER CHECK (ftn_right_passes        BETWEEN 0 AND 10),

    -- ── HKS — Heel-Knee-Shin Test ─────────────────────────────────────────
    -- Categorical result per side.
    -- Zero-PHI compliance: enum values only, no freetext.
    hks_left_result         VARCHAR(20) CHECK (hks_left_result  IN ('normal', 'mild', 'moderate', 'severe', 'unable')),
    hks_right_result        VARCHAR(20) CHECK (hks_right_result IN ('normal', 'mild', 'moderate', 'severe', 'unable')),

    -- Metadata
    administered_at         TIMESTAMP DEFAULT NOW(),
    administered_by_user_id UUID REFERENCES auth.users(id),
    created_at              TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE log_ibogaine_cerebellar_assessments IS
    'Stores SARA (8-item ataxia scale), FTN (finger-to-nose), and HKS (heel-knee-shin) '
    'assessments for Ibogaine sessions. Pre/mid/post timing captures intra-session trajectory. '
    'All instruments are opt-in. No assessment gates Phase 2 or Phase 3 entry (WO-669).';

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE log_ibogaine_cerebellar_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ibogaine_cerebellar_assessments_select" ON log_ibogaine_cerebellar_assessments;
CREATE POLICY "ibogaine_cerebellar_assessments_select"
    ON log_ibogaine_cerebellar_assessments FOR SELECT
    USING (
        session_id IN (
            SELECT id FROM log_clinical_records
            WHERE site_id IN (
                SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
            )
        )
    );

DROP POLICY IF EXISTS "ibogaine_cerebellar_assessments_insert" ON log_ibogaine_cerebellar_assessments;
CREATE POLICY "ibogaine_cerebellar_assessments_insert"
    ON log_ibogaine_cerebellar_assessments FOR INSERT
    WITH CHECK (
        session_id IN (
            SELECT id FROM log_clinical_records
            WHERE site_id IN (
                SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()
            )
        )
    );

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_ibogaine_ca_session_id
    ON log_ibogaine_cerebellar_assessments (session_id);

CREATE INDEX IF NOT EXISTS idx_ibogaine_ca_session_timing
    ON log_ibogaine_cerebellar_assessments (session_id, timing);

-- ── Verification Queries ──────────────────────────────────────────────────────
-- 1. Table exists with expected columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'log_ibogaine_cerebellar_assessments'
ORDER BY ordinal_position;
-- Expected: 18 rows (assessment_id through created_at)

-- 2. RLS policies present
SELECT polname, polcmd
FROM pg_policy
WHERE polrelid = 'log_ibogaine_cerebellar_assessments'::regclass;
-- Expected: 2 rows — select + insert

-- 3. CHECK constraints on enum columns
SELECT conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'log_ibogaine_cerebellar_assessments'::regclass
  AND conname LIKE '%hks%';
-- Expected: 2 rows — left + right
