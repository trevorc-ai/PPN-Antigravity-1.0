-- ============================================================================
-- MIGRATION 061: Practitioner Directory — ref_practitioners Table
-- ============================================================================
-- WO-118 | SOOP | Parent ticket: WO-118_Practitioner-Directory-DB-Connection
-- Date: 2026-02-20
-- Purpose: Create ref_practitioners table as a controlled vocabulary entry
--          for the Practitioner Directory. Seed with 8 demo practitioners
--          matching the existing CLINICIANS constants array in src/constants.
--
-- Architecture decision (from WO-118 LEAD ARCHITECTURE):
--   - Practitioners are a REFERENCE vocabulary, not user-table entities.
--   - Network admins seed via SQL migration (this file).
--   - Practitioners submit listing requests via log_feature_requests (existing).
--   - App reads ref_practitioners — no direct writes from app layer.
--
-- Affected Tables: ref_practitioners (NEW)
-- Existing Tables Modified: NONE
-- ============================================================================
-- GOVERNANCE RULES APPLIED:
--   ✅ CREATE TABLE IF NOT EXISTS (idempotent)
--   ✅ UUID PK via gen_random_uuid()
--   ✅ RLS ENABLED — SELECT only for authenticated users
--   ✅ DROP POLICY IF EXISTS before CREATE POLICY (idempotent)
--   ✅ No DROP, TRUNCATE, ALTER COLUMN TYPE
--   ✅ No PHI — professional identity only (display name, role, location)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ref_practitioners (
  practitioner_id     BIGINT      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  display_name        TEXT        NOT NULL,
  role                TEXT        NOT NULL,         -- 'Psychiatrist', 'Facilitator', 'LCSW', 'PhD Researcher', etc.
  location_city       TEXT        NOT NULL,
  location_country    TEXT        NOT NULL DEFAULT 'United States',
  license_type        TEXT,                         -- 'MD', 'DO', 'LCSW', 'LPC', 'PhD', 'NP', 'Other'
  modalities          TEXT[],                       -- ['Psilocybin', 'Ketamine', 'MDMA', 'Ibogaine', 'Cannabis']
  accepting_clients   BOOLEAN     NOT NULL DEFAULT true,
  verified            BOOLEAN     NOT NULL DEFAULT false,
  verification_level  TEXT        NOT NULL DEFAULT 'L1',  -- 'L1', 'L2', 'L3'
  profile_url         TEXT,
  image_url           TEXT,
  is_active           BOOLEAN     NOT NULL DEFAULT true,
  sort_order          INT         NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ref_practitioners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ref_practitioners_authenticated_select" ON public.ref_practitioners;
CREATE POLICY "ref_practitioners_authenticated_select"
  ON public.ref_practitioners
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE INDEX IF NOT EXISTS idx_rp_is_active
  ON public.ref_practitioners(is_active);

CREATE INDEX IF NOT EXISTS idx_rp_sort_order
  ON public.ref_practitioners(sort_order);

CREATE INDEX IF NOT EXISTS idx_rp_modalities
  ON public.ref_practitioners USING GIN (modalities);

CREATE INDEX IF NOT EXISTS idx_rp_accepting_clients
  ON public.ref_practitioners(accepting_clients);


-- ─────────────────────────────────────────────────────────────────────────────
-- SEED: 8 Demo Practitioners
-- Matches the existing CLINICIANS array in src/constants/index.ts
-- These are fictional demo entries — no real practitioner data
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.ref_practitioners
  (display_name, role, location_city, location_country, license_type, modalities, accepting_clients, verified, verification_level, sort_order)
VALUES
  ('Dr. Sarah Chen',       'Psychiatrist',        'San Francisco', 'United States', 'MD',   ARRAY['Psilocybin', 'Ketamine'],        true,  true,  'L3', 1),
  ('Marcus Rivera',        'Facilitator',         'Denver',        'United States', 'LPC',  ARRAY['Psilocybin', 'MDMA'],            true,  true,  'L2', 2),
  ('Dr. Emily Thornton',   'Clinical Psychologist','Seattle',       'United States', 'PhD',  ARRAY['Ketamine', 'Psilocybin'],        false, true,  'L3', 3),
  ('James Okafor',         'Facilitator',         'Austin',        'United States', 'LCSW', ARRAY['Psilocybin'],                    true,  false, 'L1', 4),
  ('Dr. Lisa Nakamura',    'Psychiatrist',        'New York',      'United States', 'MD',   ARRAY['Ketamine', 'Esketamine'],        true,  true,  'L3', 5),
  ('Robert Blackwood',     'Nurse Practitioner',  'Portland',      'United States', 'NP',   ARRAY['Ketamine'],                      true,  true,  'L2', 6),
  ('Dr. Amara Osei',       'LCSW',                'Atlanta',       'United States', 'LCSW', ARRAY['Psilocybin', 'MDMA'],            false, true,  'L2', 7),
  ('Dr. Thomas Whitfield', 'Psychiatrist',        'Boston',        'United States', 'MD',   ARRAY['Psilocybin', 'Ketamine', 'MDMA'],true,  true,  'L3', 8)
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFICATION QUERIES
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Confirm table exists and is populated
SELECT COUNT(*) AS practitioner_count FROM public.ref_practitioners;
-- Expected: 8

-- 2. Confirm RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'ref_practitioners';
-- Expected: rowsecurity = true

-- 3. Confirm SELECT policy exists
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'ref_practitioners';
-- Expected: 1 row — ref_practitioners_authenticated_select, SELECT, authenticated

-- 4. Spot-check seed data
SELECT display_name, role, location_city, modalities
FROM public.ref_practitioners
ORDER BY sort_order;
-- Expected: 8 rows matching the seed values above

-- ============================================================================
-- END OF MIGRATION 061
-- ============================================================================
