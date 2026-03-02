-- ============================================================================
-- WO-XXX: Add is_test_account flag to user_profiles
-- Additive only. RLS preserved. Safe to re-run.
-- ============================================================================
-- Purpose: Tag tester / demo accounts so all their clinical records can be
-- identified and bulk-deleted in one query without touching real data.
-- ============================================================================

-- 1. Add the column (additive — no existing data touched)
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS is_test_account BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.user_profiles.is_test_account IS
  'TRUE = tester/demo account. All clinical records created by this user are synthetic and can be bulk-deleted.';

-- 2. Verify
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'user_profiles'
  AND column_name  = 'is_test_account';

-- ============================================================================
-- USAGE REFERENCE (run manually when needed — never automate deletions)
-- ============================================================================
-- Tag a user as tester:
--   UPDATE user_profiles SET is_test_account = TRUE
--   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jason@example.com');
--
-- Preview what would be deleted:
--   SELECT COUNT(*) FROM log_clinical_records cr
--   JOIN user_profiles up ON up.user_id = cr.practitioner_uuid
--   WHERE up.is_test_account = TRUE;
--
-- Bulk-delete all test clinical records (run in order):
--   DELETE FROM log_longitudinal_assessments WHERE session_id IN (
--     SELECT cr.id FROM log_clinical_records cr
--     JOIN user_profiles up ON up.user_id = cr.practitioner_uuid
--     WHERE up.is_test_account = TRUE);
--   DELETE FROM log_pulse_checks WHERE session_id IN (
--     SELECT cr.id FROM log_clinical_records cr
--     JOIN user_profiles up ON up.user_id = cr.practitioner_uuid
--     WHERE up.is_test_account = TRUE);
--   DELETE FROM log_session_timeline_events WHERE session_id IN (
--     SELECT cr.id FROM log_clinical_records cr
--     JOIN user_profiles up ON up.user_id = cr.practitioner_uuid
--     WHERE up.is_test_account = TRUE);
--   DELETE FROM log_baseline_assessments WHERE session_id IN (
--     SELECT cr.id FROM log_clinical_records cr
--     JOIN user_profiles up ON up.user_id = cr.practitioner_uuid
--     WHERE up.is_test_account = TRUE);
--   DELETE FROM log_dose_events WHERE session_id IN (
--     SELECT cr.id FROM log_clinical_records cr
--     JOIN user_profiles up ON up.user_id = cr.practitioner_uuid
--     WHERE up.is_test_account = TRUE);
--   DELETE FROM log_clinical_records WHERE practitioner_uuid IN (
--     SELECT user_id FROM user_profiles WHERE is_test_account = TRUE);
-- ============================================================================
