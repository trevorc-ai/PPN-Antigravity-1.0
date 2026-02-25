-- ============================================================================
-- Migration: 068_wire_consent_type_id_fk.sql
-- Date: 2026-02-25
-- Purpose: Wire log_consent.consent_type_id FK to ref_consent_types.
--          Add missing HIPAA_AUTHORIZATION to ref_consent_types.
--
-- ConsentForm.tsx CONSENT_TYPES (confirmed 2026-02-25):
--   'informed_consent'     → ref id=1 INFORMED_CONSENT
--   'hipaa_authorization'  → NOT IN REF — add here
--   'research_participation' → ref id=4 RESEARCH_PARTICIPATION
--   'photography_recording'  → ref id=3 PHOTO_VIDEO
--
-- ref_consent_types confirmed live (2026-02-25):
--   id=1 INFORMED_CONSENT
--   id=2 DATA_USE
--   id=3 PHOTO_VIDEO
--   id=4 RESEARCH_PARTICIPATION
--   id=5 EMERGENCY_CONTACT
--
-- PRE-FLIGHT: log_consent.consent_type_id is currently NULL for all rows
-- (createConsent intentionally stopped writing type/consent_type_id pending this migration)
-- No backfill needed — no historical data to remap.
-- ============================================================================


-- ============================================================================
-- STEP 1: Add HIPAA_AUTHORIZATION to ref_consent_types
-- ============================================================================

INSERT INTO ref_consent_types (consent_code, label, is_active)
VALUES ('HIPAA_AUTHORIZATION', 'HIPAA Authorization', true)
ON CONFLICT (consent_code) DO NOTHING;


-- ============================================================================
-- STEP 2: Add FK constraint to log_consent.consent_type_id
-- Column already exists as INTEGER — just needs the FK reference
-- ============================================================================

ALTER TABLE log_consent
  DROP CONSTRAINT IF EXISTS fk_consent_consent_type_id;

ALTER TABLE log_consent
  ADD CONSTRAINT fk_consent_consent_type_id
  FOREIGN KEY (consent_type_id)
  REFERENCES ref_consent_types(id)
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_consent_consent_type_id
  ON log_consent(consent_type_id);

COMMENT ON COLUMN log_consent.consent_type_id IS
  'FK → ref_consent_types(id). Replaces type TEXT. Added FK constraint migration 068.';

COMMENT ON COLUMN log_consent.type IS
  'DEPRECATED: Legacy TEXT column. Use consent_type_id FK instead. Never write to this column.';


-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Confirm HIPAA_AUTHORIZATION was added:
-- SELECT id, consent_code, label FROM ref_consent_types ORDER BY id;

-- Confirm FK constraint exists:
-- SELECT constraint_name FROM information_schema.table_constraints
-- WHERE table_name = 'log_consent' AND constraint_name = 'fk_consent_consent_type_id';
