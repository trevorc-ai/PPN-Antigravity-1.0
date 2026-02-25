-- ============================================================================
-- Migration: 069_clinical_records_demographic_constraints.sql
-- Date: 2026-02-25
-- Purpose: Add CHECK constraints to patient_sex and patient_age in
--          log_clinical_records (no ref tables — finite option sets).
--          Wire patient_smoking_status_id FK → ref_smoking_status.
--          Populate ref_smoking_status.status_code for machine-readable mapping.
--
-- PRE-FLIGHT (confirmed 2026-02-25):
--   patient_sex             — all NULL, safe to add CHECK
--   patient_age             — all NULL, safe to add CHECK
--   patient_smoking_status_id — all NULL, no backfill needed
--   patient_weight_range    — SKIP per product decision (weight as integer for QTc)
--
-- ref_smoking_status confirmed (2026-02-25):
--   smoking_status_id=1  Non-Smoker
--   smoking_status_id=2  Former Smoker
--   smoking_status_id=3  Current Smoker (Occasional)
--   smoking_status_id=4  Current Smoker (Daily)
-- ============================================================================


-- ============================================================================
-- STEP 1: Populate status_code on ref_smoking_status
--         (currently NULL — needed for programmatic mapping)
-- ============================================================================

UPDATE ref_smoking_status SET status_code = 'NON_SMOKER'          WHERE smoking_status_id = 1 AND status_code IS NULL;
UPDATE ref_smoking_status SET status_code = 'FORMER'              WHERE smoking_status_id = 2 AND status_code IS NULL;
UPDATE ref_smoking_status SET status_code = 'CURRENT_OCCASIONAL'  WHERE smoking_status_id = 3 AND status_code IS NULL;
UPDATE ref_smoking_status SET status_code = 'CURRENT_DAILY'       WHERE smoking_status_id = 4 AND status_code IS NULL;


-- ============================================================================
-- STEP 2: CHECK constraint on log_clinical_records.patient_sex
--         Values from Tab1_PatientInfo.tsx sexOptions: Male, Female, Intersex, Unknown
-- ============================================================================

ALTER TABLE log_clinical_records
  DROP CONSTRAINT IF EXISTS chk_clinical_records_patient_sex;

ALTER TABLE log_clinical_records
  ADD CONSTRAINT chk_clinical_records_patient_sex
  CHECK (patient_sex IS NULL OR patient_sex IN ('Male', 'Female', 'Intersex', 'Unknown'));

COMMENT ON COLUMN log_clinical_records.patient_sex IS
  'CHECK: Male | Female | Intersex | Unknown. No ref table — finite set. Added migration 069.';


-- ============================================================================
-- STEP 3: CHECK constraint on log_clinical_records.patient_age
--         Values from Tab1_PatientInfo.tsx ageOptions: 18-25, 26-35 etc.
-- ============================================================================

ALTER TABLE log_clinical_records
  DROP CONSTRAINT IF EXISTS chk_clinical_records_patient_age;

ALTER TABLE log_clinical_records
  ADD CONSTRAINT chk_clinical_records_patient_age
  CHECK (patient_age IS NULL OR patient_age IN ('18-25', '26-35', '36-45', '46-55', '56-65', '66+'));

COMMENT ON COLUMN log_clinical_records.patient_age IS
  'CHECK: 18-25 | 26-35 | 36-45 | 46-55 | 56-65 | 66+. Range band, not exact age. Added migration 069.';


-- ============================================================================
-- STEP 4: Wire patient_smoking_status_id FK → ref_smoking_status(smoking_status_id)
-- ============================================================================

ALTER TABLE log_clinical_records
  DROP CONSTRAINT IF EXISTS fk_clinical_records_smoking_status_id;

ALTER TABLE log_clinical_records
  ADD CONSTRAINT fk_clinical_records_smoking_status_id
  FOREIGN KEY (patient_smoking_status_id)
  REFERENCES ref_smoking_status(smoking_status_id)
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_clinical_records_smoking_status_id
  ON log_clinical_records(patient_smoking_status_id);

COMMENT ON COLUMN log_clinical_records.patient_smoking_status_id IS
  'FK → ref_smoking_status(smoking_status_id). Replaces smoking_status TEXT. Added FK constraint migration 069.';


-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Confirm status_code populated:
-- SELECT smoking_status_id, status_name, status_code FROM ref_smoking_status ORDER BY smoking_status_id;

-- Confirm CHECK constraints:
-- SELECT constraint_name, check_clause FROM information_schema.check_constraints
-- WHERE constraint_name IN ('chk_clinical_records_patient_sex', 'chk_clinical_records_patient_age');

-- Confirm FK constraint:
-- SELECT constraint_name FROM information_schema.table_constraints
-- WHERE table_name = 'log_clinical_records' AND constraint_name = 'fk_clinical_records_smoking_status_id';
