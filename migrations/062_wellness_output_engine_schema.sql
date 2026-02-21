-- ============================================================
-- Migration: 062_wellness_output_engine_schema.sql
-- Scope:     WO-309 + WO-313 additive schema changes
-- Author:    SOOP (via LEAD routing)
-- Date:      2026-02-21
-- Policy:    ADDITIVE ONLY — no DROP, no ALTER TYPE, no column removal
-- RLS:       Enabled on all new tables
-- ============================================================

-- ── SAFETY CHECK: Confirm parent tables exist before adding columns ─────────

DO $$
BEGIN
  -- log_clinical_records must exist (WO-309 additive columns depend on it)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND   table_name   = 'log_clinical_records'
  ) THEN
    RAISE EXCEPTION '[062] ABORT: log_clinical_records does not exist. Run migration 050 first.';
  END IF;

  -- log_safety_events must exist (WO-309 additive column depends on it)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND   table_name   = 'log_safety_events'
  ) THEN
    RAISE EXCEPTION '[062] ABORT: log_safety_events does not exist. Run migration 050 first.';
  END IF;
END $$;

-- ============================================================
-- SECTION A: WO-309 — ContraindicationEngine Support Columns
-- ============================================================
-- Purpose: Store the provider's documented justification when they
--          override a relative contraindication flag and proceed
--          with a session. Required for clinical audit compliance.
-- ─────────────────────────────────────────────────────────────

-- A1. Contraindication override justification on the session record
ALTER TABLE public.log_clinical_records
  ADD COLUMN IF NOT EXISTS contraindication_verdict TEXT
    CHECK (contraindication_verdict IN ('CLEAR', 'PROCEED_WITH_CAUTION', 'DO_NOT_PROCEED')),
  ADD COLUMN IF NOT EXISTS contraindication_override_reason TEXT,
  ADD COLUMN IF NOT EXISTS contraindication_assessed_at TIMESTAMPTZ;

COMMENT ON COLUMN public.log_clinical_records.contraindication_verdict IS
  'ContraindicationEngine verdict at time of Phase 2 unlock. Values: CLEAR | PROCEED_WITH_CAUTION | DO_NOT_PROCEED';

COMMENT ON COLUMN public.log_clinical_records.contraindication_override_reason IS
  'Free-text clinical justification entered by provider if proceeding despite relative contraindication flags. Required when verdict = PROCEED_WITH_CAUTION.';

COMMENT ON COLUMN public.log_clinical_records.contraindication_assessed_at IS
  'Timestamp when ContraindicationEngine was run for this session.';

-- ─────────────────────────────────────────────────────────────
-- A2. AE Report URL on safety events — stores the generated PDF location
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.log_safety_events
  ADD COLUMN IF NOT EXISTS report_pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS report_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ctcae_grade SMALLINT
    CHECK (ctcae_grade BETWEEN 1 AND 5);

COMMENT ON COLUMN public.log_safety_events.report_pdf_url IS
  'Storage URL of the auto-generated AE incident report PDF (CTCAE v5.0 format). Populated by AEAutoReport service on form save.';

COMMENT ON COLUMN public.log_safety_events.ctcae_grade IS
  'CTCAE v5.0 severity grade (1-5). Grade 3+ triggers regulatory notification banner in UI.';

-- ============================================================
-- SECTION B: WO-313 — Chain of Custody Log Table
-- ============================================================
-- Purpose: Track every unit of controlled substance from receipt
--          through administration to destruction. Required for
--          Oregon ORS 475A + DEA compliance.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.log_chain_of_custody (
  id                        UUID          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Site context
  site_id                   UUID          NOT NULL,

  -- Session link (optional — NULL for batch receipts not tied to a session)
  session_id                UUID,

  -- Substance identity
  substance                 TEXT          NOT NULL,
  batch_number              TEXT,
  lot_number                TEXT,
  supplier_name             TEXT,
  supplier_license_number   TEXT,

  -- Receipt record
  quantity_received_mg      NUMERIC(10,2),
  date_received             DATE,
  storage_location          TEXT,     -- e.g. 'Clinic Safe A', 'Refrigerator Unit 1'
  storage_conditions        TEXT,     -- e.g. 'Room temp, dark, locked'

  -- Administration record
  quantity_administered_mg  NUMERIC(10,2),
  route                     TEXT      CHECK (route IN ('oral', 'IM', 'IV', 'intranasal', 'sublingual', 'other')),
  patient_link_code         TEXT,     -- Subject_ID ONLY — no PHI
  session_date              DATE,
  administering_clinician_id UUID,

  -- Waste / destruction record
  quantity_wasted_mg        NUMERIC(10,2),
  destruction_method        TEXT,     -- e.g. 'Witnessed flush', 'Licensed waste disposal'
  destruction_witness_name  TEXT,     -- Name of staff member who witnessed destruction
  destruction_date          DATE,

  -- Audit trail
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by                UUID        -- auth.users.id of clinician who entered record
);

-- ── Row Level Security ─────────────────────────────────────────────────────

ALTER TABLE public.log_chain_of_custody ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can only read/write records for their own site.
-- site_id must match the clinician's site from their profile.

DROP POLICY IF EXISTS "chain_of_custody_site_select" ON public.log_chain_of_custody;
CREATE POLICY "chain_of_custody_site_select"
  ON public.log_chain_of_custody
  FOR SELECT
  TO authenticated
  USING (
    site_id IN (
      SELECT site_id FROM public.log_user_sites
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "chain_of_custody_site_insert" ON public.log_chain_of_custody;
CREATE POLICY "chain_of_custody_site_insert"
  ON public.log_chain_of_custody
  FOR INSERT
  TO authenticated
  WITH CHECK (
    site_id IN (
      SELECT site_id FROM public.log_user_sites
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "chain_of_custody_site_update" ON public.log_chain_of_custody;
CREATE POLICY "chain_of_custody_site_update"
  ON public.log_chain_of_custody
  FOR UPDATE
  TO authenticated
  USING (
    site_id IN (
      SELECT site_id FROM public.log_user_sites
      WHERE user_id = auth.uid()
    )
  );

-- No DELETE policy — chain of custody records are immutable by design.
-- Corrections must be made via new additive record with a note.

-- ── Indexes ────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_coc_site_id
  ON public.log_chain_of_custody (site_id);

CREATE INDEX IF NOT EXISTS idx_coc_session_id
  ON public.log_chain_of_custody (session_id);

CREATE INDEX IF NOT EXISTS idx_coc_session_date
  ON public.log_chain_of_custody (session_date DESC);

CREATE INDEX IF NOT EXISTS idx_coc_substance
  ON public.log_chain_of_custody (substance);

-- ── Table comment ──────────────────────────────────────────────────────────

COMMENT ON TABLE public.log_chain_of_custody IS
  'WO-313: Controlled substance chain of custody log. Tracks batch receipt, session administration, and waste destruction per session. Required for Oregon ORS 475A and DEA compliance. Immutable — no DELETE policy. Corrections via additive record.';

-- ============================================================
-- SECTION C: Update timestamp trigger for log_chain_of_custody
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_chain_of_custody_updated_at ON public.log_chain_of_custody;
CREATE TRIGGER set_chain_of_custody_updated_at
  BEFORE UPDATE ON public.log_chain_of_custody
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- VERIFICATION QUERIES (run after applying migration)
-- ============================================================

-- V1: Confirm additive columns on log_clinical_records
SELECT column_name, data_type, is_nullable
FROM   information_schema.columns
WHERE  table_schema = 'public'
AND    table_name   = 'log_clinical_records'
AND    column_name  IN (
         'contraindication_verdict',
         'contraindication_override_reason',
         'contraindication_assessed_at'
       );
-- Expected: 3 rows returned

-- V2: Confirm additive columns on log_safety_events
SELECT column_name, data_type
FROM   information_schema.columns
WHERE  table_schema = 'public'
AND    table_name   = 'log_safety_events'
AND    column_name  IN ('report_pdf_url', 'report_generated_at', 'ctcae_grade');
-- Expected: 3 rows returned

-- V3: Confirm log_chain_of_custody table + RLS
SELECT tablename, rowsecurity
FROM   pg_tables
WHERE  schemaname = 'public'
AND    tablename  = 'log_chain_of_custody';
-- Expected: 1 row, rowsecurity = true

-- V3b: Confirm log_user_sites exists (required by RLS policies)
SELECT COUNT(*) AS log_user_sites_exists
FROM   information_schema.tables
WHERE  table_schema = 'public'
AND    table_name   = 'log_user_sites';
-- Expected: 1

-- V4: Confirm all 3 RLS policies exist
SELECT policyname, cmd
FROM   pg_policies
WHERE  tablename = 'log_chain_of_custody';
-- Expected: 3 rows — chain_of_custody_site_select, _insert, _update

-- V5: Confirm indexes
SELECT indexname
FROM   pg_indexes
WHERE  tablename = 'log_chain_of_custody';
-- Expected: 4+ rows including the 3 custom indexes above

-- ============================================================
-- END OF MIGRATION 062
-- ============================================================
