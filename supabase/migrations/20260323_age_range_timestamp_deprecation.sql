-- ============================================================
-- MIGRATION: 20260323_age_range_timestamp_deprecation.sql
-- INSPECTOR: Approved 2026-03-23
-- Scope: ref_age_ranges table, age_range_id FK columns,
--        backfill from existing age_at_intake values.
--
-- ADDITIVE ONLY — no DROP, no ALTER TYPE, no TRUNCATE.
-- Timestamp columns deprecated-in-place: BUILDER stops writing
-- to them. No DB change required for that deprecation.
-- session_date replaced by session_number (ordinal, no date info).
--
-- Run in Supabase SQL Editor. Safe to re-run (idempotent).
-- Verify with 3 queries at bottom before closing session.
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- PART 1: ref_age_ranges REFERENCE TABLE
-- Pattern mirrors ref_weight_ranges exactly.
-- age_low / age_high used for backfill mapping only.
-- Ages ≥ 90 grouped per HHS HIPAA Safe Harbor requirement.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ref_age_ranges (
  id          BIGSERIAL PRIMARY KEY,
  range_code  VARCHAR(20)  UNIQUE NOT NULL,
  range_label TEXT         NOT NULL,
  age_low     INTEGER      NOT NULL,
  age_high    INTEGER      NOT NULL,   -- 9999 used for open-ended upper bound
  sort_order  INTEGER      NOT NULL,
  is_active   BOOLEAN      NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

INSERT INTO ref_age_ranges (range_code, range_label, age_low, age_high, sort_order) VALUES
  ('UNDER_18',   'Under 18',  0,  17,   1),
  ('AGE_18_24',  '18-24',    18,  24,   2),
  ('AGE_25_34',  '25-34',    25,  34,   3),
  ('AGE_35_44',  '35-44',    35,  44,   4),
  ('AGE_45_54',  '45-54',    45,  54,   5),
  ('AGE_55_64',  '55-64',    55,  64,   6),
  ('AGE_65_74',  '65-74',    65,  74,   7),
  ('AGE_75_84',  '75-84',    75,  84,   8),
  ('AGE_85_89',  '85-89',    85,  89,   9),
  ('AGE_90_PLUS','90+',      90, 9999, 10)   -- HIPAA Safe Harbor: all ages ≥ 90 grouped
ON CONFLICT (range_code) DO NOTHING;

-- RLS: ref table — SELECT only, no INSERT policy needed
ALTER TABLE ref_age_ranges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ref_age_ranges_select" ON ref_age_ranges;
CREATE POLICY "ref_age_ranges_select"
  ON ref_age_ranges FOR SELECT
  USING (auth.role() = 'authenticated');


-- ════════════════════════════════════════════════════════════
-- PART 2: log_clinical_records — ADD age_range_id
-- Replaces patient_age_years (integer). patient_age_years
-- is deprecated in-place (stop writing; column retained per
-- additive-only governance until formal DROP phase).
-- ════════════════════════════════════════════════════════════

ALTER TABLE log_clinical_records
  ADD COLUMN IF NOT EXISTS age_range_id BIGINT REFERENCES ref_age_ranges(id);

CREATE INDEX IF NOT EXISTS idx_clinical_records_age_range
  ON log_clinical_records(age_range_id);
-- Index type: B-tree (default) — equality + JOIN lookups on FK

-- No backfill needed: patient_age_years has 0 non-null rows
-- (confirmed Block 6: rows_with_age = 0)


-- ════════════════════════════════════════════════════════════
-- PART 3: log_patient_profiles — ADD age_range_id
-- Replaces age_at_intake (integer). 19/19 rows have values —
-- backfill required (see Part 4 below).
-- ════════════════════════════════════════════════════════════

ALTER TABLE log_patient_profiles
  ADD COLUMN IF NOT EXISTS age_range_id BIGINT REFERENCES ref_age_ranges(id);

CREATE INDEX IF NOT EXISTS idx_patient_profiles_age_range
  ON log_patient_profiles(patient_uuid, age_range_id);
-- Index type: Composite B-tree — joins on patient_uuid + filter on age


-- ════════════════════════════════════════════════════════════
-- PART 4: BACKFILL log_patient_profiles.age_range_id
-- Maps existing age_at_intake integers to ref_age_ranges FKs.
-- Safe: only updates rows where age_range_id IS NULL and
-- age_at_intake IS NOT NULL. Idempotent on re-run.
-- ════════════════════════════════════════════════════════════

UPDATE log_patient_profiles lpp
SET    age_range_id = rar.id
FROM   ref_age_ranges rar
WHERE  lpp.age_at_intake IS NOT NULL
  AND  lpp.age_range_id  IS NULL
  AND  lpp.age_at_intake >= rar.age_low
  AND  lpp.age_at_intake <= rar.age_high;


-- ════════════════════════════════════════════════════════════
-- VERIFICATION — run immediately after execution
-- All 3 must pass before closing the SQL Editor session.
-- ════════════════════════════════════════════════════════════

-- V1: ref_age_ranges seeded correctly? (expect exactly 10 rows)
SELECT id, range_code, range_label, age_low, age_high, sort_order
FROM ref_age_ranges
ORDER BY sort_order;

-- V2: New columns exist in both tables? (expect exactly 2 rows)
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    (table_name = 'log_clinical_records' AND column_name = 'age_range_id')
    OR (table_name = 'log_patient_profiles' AND column_name = 'age_range_id')
  )
ORDER BY table_name;

-- V3: Backfill complete? (expect: profiles_backfilled = 19)
-- Note: log_clinical_records has 0 existing age rows — no backfill expected there.
SELECT
  (SELECT COUNT(*) FROM log_patient_profiles WHERE age_range_id IS NOT NULL) AS profiles_backfilled,
  (SELECT COUNT(*) FROM log_patient_profiles WHERE age_at_intake IS NOT NULL AND age_range_id IS NULL) AS profiles_missed;
-- profiles_missed MUST be 0. If > 0: an age_at_intake value fell outside all brackets — report immediately.


-- ════════════════════════════════════════════════════════════
-- INSPECTOR 02.5 CLEARANCE
-- ════════════════════════════════════════════════════════════
-- Step 1: Live table names verified via live query (Blocks 1-12)
--         log_clinical_records: EXISTS ✅
--         log_patient_profiles: EXISTS ✅
--         ref_age_ranges: DID NOT EXIST → created above ✅
--         ref_weight_ranges: EXISTS (FK pattern confirmed) ✅
--         age_range_id columns confirmed NOT YET EXISTING before this migration ✅
-- Step 2: Banned commands scan — PASS
--         grep result: 0 DROP TABLE, 0 DELETE FROM, 0 TRUNCATE, 0 ALTER..DROP ✅
-- Step 3: Idempotency — PASS
--         CREATE TABLE IF NOT EXISTS ✅
--         ADD COLUMN IF NOT EXISTS ✅
--         CREATE INDEX IF NOT EXISTS ✅
--         INSERT ... ON CONFLICT DO NOTHING ✅
--         UPDATE only where IS NULL (safe to re-run) ✅
-- Step 4: Policy parity — PASS
--         DROP POLICY count: 1 ("ref_age_ranges_select")
--         CREATE POLICY count: 1 ("ref_age_ranges_select")
--         1 == 1 ✅
-- Step 5: RLS completeness — PASS
--         ref_age_ranges: ENABLE ROW LEVEL SECURITY ✅
--         ref_age_ranges: SELECT policy ✅
--         (ref table — no INSERT policy required per governance pattern) ✅
--         log_clinical_records: pre-existing RLS confirmed (Block 12) ✅
--         log_patient_profiles: pre-existing RLS confirmed (Block 12) ✅
-- Step 6: Final banned scan — PASS ✅
-- Index types reviewed:
--   idx_clinical_records_age_range: B-tree (equality FK lookup)
--   idx_patient_profiles_age_range: Composite B-tree (patient_uuid JOIN + age filter)
-- UI Standards Pre-Build Gate: N/A — no visible files in scope
-- Signed: INSPECTOR | Date: 2026-03-23
