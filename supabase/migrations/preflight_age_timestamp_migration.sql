-- ============================================================
-- INSPECTOR PRE-FLIGHT VERIFICATION QUERIES
-- Purpose: Confirm live schema state before writing migration SQL
-- Run each block in Supabase SQL Editor. Review ALL results
-- before proceeding. Expected outcomes noted inline.
-- Date: 2026-03-23
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- BLOCK 1: CURRENT COLUMN TYPES FOR AFFECTED COLUMNS
-- Expected: patient_age_years = integer, age_at_intake = integer
-- ────────────────────────────────────────────────────────────
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    (table_name = 'log_clinical_records'  AND column_name = 'patient_age_years')
    OR (table_name = 'log_patient_profiles' AND column_name = 'age_at_intake')
    OR (table_name = 'log_patient_profiles' AND column_name = 'weight_range_id') -- reference pattern
  )
ORDER BY table_name, column_name;


-- ────────────────────────────────────────────────────────────
-- BLOCK 2: ALL EXACT TIMESTAMP COLUMNS IN log_clinical_records
-- Expected: see 11 timestamptz columns (dose_administered_at,
-- onset_reported_at, peak_intensity_at, session_ended_at,
-- submitted_at, meq30_completed_at, edi_completed_at,
-- ceq_completed_at, contraindication_assessed_at, created_at,
-- session_date (DATE type)
-- ────────────────────────────────────────────────────────────
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'log_clinical_records'
  AND data_type IN ('timestamp with time zone', 'timestamp without time zone', 'date', 'time with time zone', 'time without time zone')
ORDER BY column_name;


-- ────────────────────────────────────────────────────────────
-- BLOCK 3: ALL TIMESTAMP COLUMNS ACROSS ALL log_ TABLES
-- Purpose: Catalog every date/time field in the entire log_
-- layer for the HIPAA timestamp disclosure to counsel.
-- ────────────────────────────────────────────────────────────
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name LIKE 'log_%'
  AND data_type IN ('timestamp with time zone', 'timestamp without time zone', 'date', 'time with time zone', 'time without time zone')
ORDER BY table_name, column_name;


-- ────────────────────────────────────────────────────────────
-- BLOCK 4: DOES ref_age_ranges ALREADY EXIST?
-- Expected: 0 rows (table does not yet exist)
-- ────────────────────────────────────────────────────────────
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'ref_age_ranges';


-- ────────────────────────────────────────────────────────────
-- BLOCK 5: EXISTING ref_weight_ranges ROWS (pattern to clone)
-- Expected: Rows showing range_label, kg_low, kg_high, sort_order
-- We will mirror this pattern for ref_age_ranges.
-- ────────────────────────────────────────────────────────────
SELECT id, range_label, kg_low, kg_high, sort_order, is_active
FROM ref_weight_ranges
ORDER BY sort_order;


-- ────────────────────────────────────────────────────────────
-- BLOCK 6: DATA PRESENCE — HOW MANY ROWS HAVE NON-NULL VALUES?
-- Expected: tells us migration scope and whether backfill of new
-- age_range_id column is needed for existing rows.
-- ────────────────────────────────────────────────────────────
SELECT
  'log_clinical_records' AS table_name,
  COUNT(*)                AS total_rows,
  COUNT(patient_age_years) AS rows_with_age,
  COUNT(dose_administered_at) AS rows_with_dose_ts,
  COUNT(onset_reported_at) AS rows_with_onset_ts,
  COUNT(peak_intensity_at) AS rows_with_peak_ts,
  COUNT(session_ended_at) AS rows_with_ended_ts,
  COUNT(submitted_at) AS rows_with_submitted_ts,
  COUNT(session_date) AS rows_with_session_date
FROM log_clinical_records

UNION ALL

SELECT
  'log_patient_profiles' AS table_name,
  COUNT(*) AS total_rows,
  COUNT(age_at_intake) AS rows_with_age,
  NULL, NULL, NULL, NULL, NULL, NULL
FROM log_patient_profiles;


-- ────────────────────────────────────────────────────────────
-- BLOCK 7: VIEWS REFERENCING DEPRECATED COLUMNS
-- Expected: 0 views referencing patient_age_years or age_at_intake
-- If any are found, they MUST be included in the migration plan.
-- ────────────────────────────────────────────────────────────
SELECT
  v.table_name AS view_name,
  v.view_definition
FROM information_schema.views v
WHERE v.table_schema = 'public'
  AND (
    v.view_definition ILIKE '%patient_age_years%'
    OR v.view_definition ILIKE '%age_at_intake%'
    OR v.view_definition ILIKE '%dose_administered_at%'
    OR v.view_definition ILIKE '%onset_reported_at%'
    OR v.view_definition ILIKE '%peak_intensity_at%'
  );


-- ────────────────────────────────────────────────────────────
-- BLOCK 8: FUNCTIONS OR TRIGGERS REFERENCING DEPRECATED COLUMNS
-- Expected: 0 matches — if any are found, report before proceeding.
-- ────────────────────────────────────────────────────────────
SELECT
  routine_name,
  routine_type,
  LEFT(routine_definition, 200) AS definition_excerpt
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (
    routine_definition ILIKE '%patient_age_years%'
    OR routine_definition ILIKE '%age_at_intake%'
    OR routine_definition ILIKE '%dose_administered_at%'
    OR routine_definition ILIKE '%onset_reported_at%'
  );


-- ────────────────────────────────────────────────────────────
-- BLOCK 9: INDEXES ON DEPRECATED COLUMNS
-- Purpose: Any index on a deprecated column must be flagged —
-- leaving dead indexes after deprecation wastes storage.
-- ────────────────────────────────────────────────────────────
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND (
    indexdef ILIKE '%patient_age_years%'
    OR indexdef ILIKE '%age_at_intake%'
    OR indexdef ILIKE '%dose_administered_at%'
    OR indexdef ILIKE '%onset_reported_at%'
    OR indexdef ILIKE '%peak_intensity_at%'
    OR indexdef ILIKE '%session_ended_at%'
    OR indexdef ILIKE '%session_date%'
  );


-- ────────────────────────────────────────────────────────────
-- BLOCK 10: PHI SURFACE AUDIT — CONFIRM NO DIRECT IDENTIFIER
-- LINKAGE TO patient_uuid OR patient_link_code_hash
-- Expected: ONLY pseudonymous/clinical columns — no name, DOB,
-- email, phone, MRN, SSN, or address columns in any patient table.
-- ────────────────────────────────────────────────────────────
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'log_clinical_records',
    'log_patient_profiles',
    'log_patient_flow_events',
    'log_patient_site_links',
    'log_baseline_assessments',
    'log_longitudinal_assessments',
    'log_integration_sessions',
    'log_behavioral_changes',
    'log_pulse_checks'
  )
ORDER BY table_name, column_name;


-- ────────────────────────────────────────────────────────────
-- BLOCK 11: CONFIRM log_patient_profiles EXACT COLUMN LIST
-- Purpose: Verify age_at_intake type and all columns before
-- writing ADD COLUMN IF NOT EXISTS age_range_id migration.
-- ────────────────────────────────────────────────────────────
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'log_patient_profiles'
ORDER BY ordinal_position;


-- ────────────────────────────────────────────────────────────
-- BLOCK 12: RLS STATUS ON ALL AFFECTED TABLES
-- Expected: ALL tables must show rowsecurity = TRUE
-- Any FALSE result is a pre-existing RLS gap — report separately.
-- ────────────────────────────────────────────────────────────
SELECT
  relname AS table_name,
  relrowsecurity AS rls_enabled,
  relforcerowsecurity AS rls_forced
FROM pg_class
WHERE relnamespace = 'public'::regnamespace
  AND relkind = 'r'
  AND relname IN (
    'log_clinical_records',
    'log_patient_profiles',
    'log_patient_flow_events',
    'log_patient_site_links',
    'log_baseline_assessments',
    'log_longitudinal_assessments'
  )
ORDER BY relname;
