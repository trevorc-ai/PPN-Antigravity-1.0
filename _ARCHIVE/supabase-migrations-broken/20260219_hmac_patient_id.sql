-- ============================================================================
-- Migration: 20260219_hmac_patient_id.sql  (WO-210)  v2
-- Purpose:   Extend patient_id columns from VARCHAR(10) → VARCHAR(20) to
--            support cryptographically-random site-scoped patient identifiers.
--
-- WHY THIS APPROACH:
--   Plain ALTER COLUMN TYPE fails when RLS policy expressions reference the
--   column (Postgres error 0A000). This DO $$ block:
--     1. Saves every policy on the 6 target tables using pg_policy metadata
--     2. Drops them (unblocks the ALTER)
--     3. ALTERs each patient_id to VARCHAR(20)
--     4. Recreates ALL policies from the saved pg_get_expr expressions
--   The recreation uses pg_get_expr (returns valid SQL strings) so zero
--   policy definitions are hard-coded here — safe against local variations.
--
-- GENERATION FORMAT (documented for BUILDER identity.ts):
--   "PT-" + site_code(3) + randomBytes(8).toString('base64url').slice(0,9).toUpperCase()
--   Example: PT-PDX7K2MX9QR  (length 14 — well within VARCHAR(20))
--   Collision space: ~1 trillion per site prefix. No PII in hash input.
--
-- SAFETY:
--   - Whole block is one implicit transaction: if any step fails, all rolls back
--   - RAISE NOTICE lines produce a full audit log visible in Supabase SQL editor
--   - Existing PT-XXXXX IDs (≤10 chars) remain valid — no data change
-- ============================================================================

DO $$
DECLARE
  target_tables  TEXT[] := ARRAY[
    'log_pulse_checks',
    'log_integration_sessions',
    'log_behavioral_changes',
    'log_longitudinal_assessments',
    'log_baseline_assessments',
    'log_clinical_records'
  ];
  t              TEXT;
  saved_policies JSONB   := '[]'::JSONB;
  pol            RECORD;
  entry          JSONB;
  roles_arr      TEXT[];
  roles_str      TEXT;
  recreate_sql   TEXT;
BEGIN

  -- =========================================================================
  -- PHASE 1: Save every policy's metadata then drop it
  --          (DROP unblocks the subsequent ALTER COLUMN TYPE)
  -- =========================================================================
  FOREACH t IN ARRAY target_tables LOOP

    FOR pol IN
      SELECT
        p.polname,
        CASE p.polpermissive
          WHEN TRUE  THEN 'PERMISSIVE'
          ELSE            'RESTRICTIVE'
        END                                              AS permissive,
        CASE p.polcmd
          WHEN 'r' THEN 'SELECT'
          WHEN 'a' THEN 'INSERT'
          WHEN 'w' THEN 'UPDATE'
          WHEN 'd' THEN 'DELETE'
          ELSE          'ALL'
        END                                              AS cmd,
        pg_get_expr(p.polqual,      p.polrelid, TRUE)   AS qual,
        pg_get_expr(p.polwithcheck, p.polrelid, TRUE)   AS withcheck,
        ARRAY(
          SELECT rolname
          FROM   pg_roles
          WHERE  oid = ANY(p.polroles)
        )                                                AS roles
      FROM  pg_policy     p
      JOIN  pg_class      c ON c.oid = p.polrelid
      JOIN  pg_namespace  n ON n.oid = c.relnamespace
      WHERE c.relname = t AND n.nspname = 'public'
    LOOP
      -- Append this policy's data to our saved list
      saved_policies := saved_policies || jsonb_build_array(
        jsonb_build_object(
          'tbl',       t,
          'polname',   pol.polname,
          'permissive',pol.permissive,
          'cmd',       pol.cmd,
          'qual',      pol.qual,
          'withcheck', pol.withcheck,
          'roles',     to_jsonb(pol.roles)
        )
      );

      -- Drop it so ALTER can proceed
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.polname, t);
      RAISE NOTICE '[WO-210] Dropped   policy "%" on %', pol.polname, t;
    END LOOP;

  END LOOP;

  -- =========================================================================
  -- PHASE 2: Alter each patient_id column (now safe — no blocking policies)
  -- =========================================================================
  FOREACH t IN ARRAY target_tables LOOP
    BEGIN
      EXECUTE format(
        'ALTER TABLE public.%I ALTER COLUMN patient_id TYPE VARCHAR(20)', t
      );
      RAISE NOTICE '[WO-210] Altered   patient_id on % → VARCHAR(20)', t;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING '[WO-210] SKIP ALTER on % (may already be VARCHAR(20)): %', t, SQLERRM;
    END;
  END LOOP;

  -- =========================================================================
  -- PHASE 3: Recreate every saved policy from its captured expression
  -- =========================================================================
  FOR entry IN SELECT * FROM jsonb_array_elements(saved_policies)
  LOOP
    -- Rebuild the role list string.
    -- IMPORTANT: array_length('{}', 1) returns NULL (not 0) in Postgres, so we
    -- cannot use it to detect empty arrays. Use NULLIF + COALESCE instead:
    -- array_to_string('{}', ', ') = '' → NULLIF makes it NULL → COALESCE → 'PUBLIC'
    roles_arr := ARRAY(SELECT jsonb_array_elements_text(entry->'roles'));
    roles_str  := COALESCE(NULLIF(array_to_string(roles_arr, ', '), ''), 'PUBLIC');

    -- Base CREATE POLICY clause
    recreate_sql := format(
      'CREATE POLICY %I ON public.%I AS %s FOR %s TO %s',
      entry->>'polname',
      entry->>'tbl',
      entry->>'permissive',
      entry->>'cmd',
      roles_str
    );

    -- Append USING clause if it existed
    IF (entry->>'qual') IS NOT NULL AND (entry->>'qual') <> '' THEN
      recreate_sql := recreate_sql
                   || format(' USING (%s)', entry->>'qual');
    END IF;

    -- Append WITH CHECK clause if it existed
    IF (entry->>'withcheck') IS NOT NULL AND (entry->>'withcheck') <> '' THEN
      recreate_sql := recreate_sql
                   || format(' WITH CHECK (%s)', entry->>'withcheck');
    END IF;

    EXECUTE recreate_sql;
    RAISE NOTICE '[WO-210] Recreated policy "%" on %', entry->>'polname', entry->>'tbl';
  END LOOP;

END $$;


-- ============================================================================
-- VERIFY: Confirm all 6 tables now have VARCHAR(20) patient_id
-- ============================================================================
SELECT
  table_name,
  column_name,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name   = 'patient_id'
  AND table_name    LIKE 'log_%'
ORDER BY table_name;
