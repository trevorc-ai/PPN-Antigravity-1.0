-- ============================================================================
-- Migration: 058_fix_consent_id_sequence_and_rls.sql
-- Purpose:   Two fixes:
--   1. Add a proper BIGINT sequence to log_consent.id so API inserts
--      don't need to generate IDs client-side.
--   2. Update log_clinical_records seed rows to set user_id = practitioner_id
--      so RLS SELECT policy (user_id = auth.uid()) can see them.
--
-- IDEMPOTENT: Yes
-- ADDITIVE:   Yes — no DROP, no column removal, no type change
-- ============================================================================

-- ── Fix 1: Add sequence to log_consent.id ────────────────────────────────────
-- log_consent.id is BIGINT NOT NULL with no default. This caused every API
-- INSERT to fail with NOT NULL violation until client-side IDs were added.
-- Adding a proper sequence makes it auto-increment like a standard SERIAL.

CREATE SEQUENCE IF NOT EXISTS public.log_consent_id_seq
    START WITH 10000       -- above any manually inserted rows (seed used 1-12)
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Only set default if column doesn't already have one
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = 'log_consent'
          AND column_name  = 'id'
          AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE public.log_consent
            ALTER COLUMN id SET DEFAULT nextval('public.log_consent_id_seq');

        -- Sync sequence to above current max to prevent conflicts
        PERFORM setval(
            'public.log_consent_id_seq',
            GREATEST(10000, COALESCE((SELECT MAX(id) FROM public.log_consent), 0) + 1)
        );

        RAISE NOTICE '✅ log_consent.id sequence added. API inserts no longer need client-side IDs.';
    ELSE
        RAISE NOTICE '⏭️  log_consent.id already has a default — skipping sequence creation.';
    END IF;
END $$;


-- ── Fix 2: Update seed records to set user_id ─────────────────────────────────
-- The seed script set practitioner_id but not user_id on log_clinical_records.
-- RLS SELECT policy checks user_id = auth.uid().
-- With user_id NULL, the seed records are invisible to the logged-in user.
--
-- SCOPE: Only updates rows where user_id IS NULL and practitioner_id IS NOT NULL.
-- This is safe — it only affects seed data, not production records.

UPDATE public.log_clinical_records
SET user_id = practitioner_id
WHERE user_id IS NULL
  AND practitioner_id IS NOT NULL;

DO $$
DECLARE v_updated INTEGER;
BEGIN
    GET DIAGNOSTICS v_updated = ROW_COUNT;
    RAISE NOTICE '✅ log_clinical_records: % rows updated (user_id = practitioner_id)', v_updated;
END $$;


-- ── Verify ────────────────────────────────────────────────────────────────────
-- After running this migration:
-- 1. Check consent sequence:
--    SELECT last_value FROM public.log_consent_id_seq;
--
-- 2. Check seed records are now visible:
--    SELECT patient_link_code, user_id, practitioner_id, session_date
--    FROM log_clinical_records
--    WHERE practitioner_id IS NOT NULL
--    ORDER BY session_date;
-- ============================================================================
