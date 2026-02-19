-- ============================================================================
-- Migration: 20260219_hmac_patient_id.sql  (WO-210)
-- Purpose:   Extend patient_id columns from VARCHAR(10) to VARCHAR(20) to
--            support cryptographically-random site-scoped patient identifiers.
--
-- GENERATION FORMAT (documented for BUILDER identity.ts):
--   "PT-" + site_code(3) + randomBytes(8).toString('base64url').slice(0,9).toUpperCase()
--   Example: PT-PDX7K2MX9QR
--   Length: 14 chars — well within VARCHAR(20)
--   Collision space: ~1 trillion per site prefix
--   Irreversible: no PII in hash input, site secret never in DB
--
-- SAFETY: Extending VARCHAR length is a metadata-only operation in Postgres.
-- No row rewrites. No data loss. Existing PT-XXXX IDs remain valid.
-- ============================================================================

ALTER TABLE public.log_baseline_assessments
    ALTER COLUMN patient_id TYPE VARCHAR(20);

ALTER TABLE public.log_clinical_records
    ALTER COLUMN patient_id TYPE VARCHAR(20);

ALTER TABLE public.log_pulse_checks
    ALTER COLUMN patient_id TYPE VARCHAR(20);

ALTER TABLE public.log_integration_sessions
    ALTER COLUMN patient_id TYPE VARCHAR(20);

ALTER TABLE public.log_behavioral_changes
    ALTER COLUMN patient_id TYPE VARCHAR(20);

ALTER TABLE public.log_longitudinal_assessments
    ALTER COLUMN patient_id TYPE VARCHAR(20);

-- Verify
SELECT
    table_name,
    column_name,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'patient_id'
  AND table_name LIKE 'log_%'
ORDER BY table_name;
