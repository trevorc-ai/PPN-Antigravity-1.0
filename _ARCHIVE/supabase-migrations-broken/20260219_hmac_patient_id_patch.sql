-- ============================================================================
-- Migration: 20260219_hmac_patient_id_patch.sql  (WO-210 patch)
-- Purpose:   Fix the two patient_id columns missed by the main migration:
--              1. log_baseline_assessments — was blocked because 8 policies
--                 on 4 other tables SELECT from its patient_id column
--                 (those 8 policies were recreated by Phase 3 of the main run)
--              2. log_red_alerts — was simply not in the original target list
--
-- Strategy:
--   - Phase 1: Save+drop the 8 policies on the 4 tables that subquery
--              log_baseline_assessments.patient_id (these are the blockers)
--   - Phase 2: Save+drop ALL policies on log_red_alerts
--   - Phase 3: ALTER both columns (now unblocked)
--   - Phase 4: Recreate all saved policies
-- ============================================================================

DO $$
DECLARE
  -- Tables whose policies contain "SELECT log_baseline_assessments.patient_id"
  -- in their WITH CHECK / USING expressions — these are the blockers
  blocking_tables TEXT[] := ARRAY[
    'log_behavioral_changes',
    'log_integration_sessions',
    'log_longitudinal_assessments',
    'log_pulse_checks'
  ];
  t              TEXT;
  saved_policies JSONB   := '[]'::JSONB;
  pol            RECORD;
  entry          JSONB;
  roles_str      TEXT;
  recreate_sql   TEXT;
BEGIN

  -- =========================================================================
  -- PHASE 1: Save + drop the 8 blocking policies on the 4 dependent tables
  -- =========================================================================
  FOREACH t IN ARRAY blocking_tables LOOP
    FOR pol IN
      SELECT
        p.polname,
        CASE p.polpermissive WHEN TRUE THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END AS permissive,
        CASE p.polcmd
          WHEN 'r' THEN 'SELECT' WHEN 'a' THEN 'INSERT'
          WHEN 'w' THEN 'UPDATE' WHEN 'd' THEN 'DELETE' ELSE 'ALL'
        END AS cmd,
        pg_get_expr(p.polqual,      p.polrelid, TRUE) AS qual,
        pg_get_expr(p.polwithcheck, p.polrelid, TRUE) AS withcheck,
        ARRAY(SELECT rolname FROM pg_roles WHERE oid = ANY(p.polroles)) AS roles
      FROM  pg_policy     p
      JOIN  pg_class      c ON c.oid = p.polrelid
      JOIN  pg_namespace  n ON n.oid = c.relnamespace
      WHERE c.relname = t AND n.nspname = 'public'
    LOOP
      saved_policies := saved_policies || jsonb_build_array(jsonb_build_object(
        'tbl',        t,
        'polname',    pol.polname,
        'permissive', pol.permissive,
        'cmd',        pol.cmd,
        'qual',       pol.qual,
        'withcheck',  pol.withcheck,
        'roles',      to_jsonb(pol.roles)
      ));
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.polname, t);
      RAISE NOTICE '[patch] Dropped "%" on %', pol.polname, t;
    END LOOP;
  END LOOP;

  -- =========================================================================
  -- PHASE 2: Save + drop ALL policies on log_red_alerts
  -- =========================================================================
  FOR pol IN
    SELECT
      p.polname,
      CASE p.polpermissive WHEN TRUE THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END AS permissive,
      CASE p.polcmd
        WHEN 'r' THEN 'SELECT' WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE' WHEN 'd' THEN 'DELETE' ELSE 'ALL'
      END AS cmd,
      pg_get_expr(p.polqual,      p.polrelid, TRUE) AS qual,
      pg_get_expr(p.polwithcheck, p.polrelid, TRUE) AS withcheck,
      ARRAY(SELECT rolname FROM pg_roles WHERE oid = ANY(p.polroles)) AS roles
    FROM  pg_policy     p
    JOIN  pg_class      c ON c.oid = p.polrelid
    JOIN  pg_namespace  n ON n.oid = c.relnamespace
    WHERE c.relname = 'log_red_alerts' AND n.nspname = 'public'
  LOOP
    saved_policies := saved_policies || jsonb_build_array(jsonb_build_object(
      'tbl',        'log_red_alerts',
      'polname',    pol.polname,
      'permissive', pol.permissive,
      'cmd',        pol.cmd,
      'qual',       pol.qual,
      'withcheck',  pol.withcheck,
      'roles',      to_jsonb(pol.roles)
    ));
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.log_red_alerts', pol.polname);
    RAISE NOTICE '[patch] Dropped "%" on log_red_alerts', pol.polname;
  END LOOP;

  -- =========================================================================
  -- PHASE 3: ALTER both remaining columns (all blockers now dropped)
  -- =========================================================================
  ALTER TABLE public.log_baseline_assessments
    ALTER COLUMN patient_id TYPE VARCHAR(20);
  RAISE NOTICE '[patch] Altered log_baseline_assessments.patient_id → VARCHAR(20)';

  ALTER TABLE public.log_red_alerts
    ALTER COLUMN patient_id TYPE VARCHAR(20);
  RAISE NOTICE '[patch] Altered log_red_alerts.patient_id → VARCHAR(20)';

  -- =========================================================================
  -- PHASE 4: Recreate ALL saved policies
  -- =========================================================================
  FOR entry IN SELECT * FROM jsonb_array_elements(saved_policies)
  LOOP
    -- NULLIF handles empty array from {public} roles (array_to_string returns '')
    roles_str := COALESCE(
      NULLIF(array_to_string(
        ARRAY(SELECT jsonb_array_elements_text(entry->'roles')), ', '
      ), ''),
      'PUBLIC'
    );

    recreate_sql := format(
      'CREATE POLICY %I ON public.%I AS %s FOR %s TO %s',
      entry->>'polname',
      entry->>'tbl',
      entry->>'permissive',
      entry->>'cmd',
      roles_str
    );

    IF (entry->>'qual') IS NOT NULL AND (entry->>'qual') <> '' THEN
      recreate_sql := recreate_sql || format(' USING (%s)', entry->>'qual');
    END IF;
    IF (entry->>'withcheck') IS NOT NULL AND (entry->>'withcheck') <> '' THEN
      recreate_sql := recreate_sql || format(' WITH CHECK (%s)', entry->>'withcheck');
    END IF;

    EXECUTE recreate_sql;
    RAISE NOTICE '[patch] Recreated "%" on %', entry->>'polname', entry->>'tbl';
  END LOOP;

END $$;


-- ============================================================================
-- VERIFY: All patient_id columns should now be VARCHAR(20)
-- Expected: 6 rows all showing 20
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
