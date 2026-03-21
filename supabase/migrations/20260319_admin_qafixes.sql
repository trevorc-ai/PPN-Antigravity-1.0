-- ============================================================
-- WO-612-QA: Admin Dashboard RLS Fix (v4 — Verified Edition)
-- Date: 2026-03-19
--
-- HOW TO USE THIS FILE:
--   Run each numbered block (BLOCK 0 through BLOCK 9) ONE AT A TIME
--   in the Supabase SQL Editor. Verify the output before running
--   the next block. STOP and report any unexpected results.
--
-- LIVE SCHEMA BASIS (verified 2026-03-19):
--   REBUILT-3-15-26_Schema.md + REBUILT_Database_Dictionary_3-15-26.md
--
-- TABLES AFFECTED:
--   public.user_feedback   — CREATE from scratch (absent in live DB)
--   public.log_user_profiles — ADD role_id FK (role TEXT column confirmed absent)
--   public.ref_user_roles  — read-only, 11 rows, only queried
--
-- FRONTEND CALLERS REVIEWED:
--   src/components/FeedbackCard.tsx
--     insert: user_id, type, message, page_url, metadata
--     requires: user_feedback.status default + metadata JSONB
--   src/pages/admin/AdminDashboard.tsx
--     feedback select: *, log_user_profiles(display_name, email)
--     requires: user_feedback.status column EXISTS
--     user select: user_id, display_name, email, role_id, ref_user_roles(role_code)
--     update: role_id (resolved from role_code lookup)
--     requires: log_user_profiles.role_id FK to ref_user_roles
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- BLOCK 0: PRE-FLIGHT — Run this FIRST to see current state
-- Expected: user_feedback absent, log_user_profiles has role_id column
-- ════════════════════════════════════════════════════════════

-- 0a. Does user_feedback exist? (expect: 0 rows)
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'user_feedback';

-- 0b. Current columns on log_user_profiles (look for role_id)
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'log_user_profiles'
ORDER BY ordinal_position;

-- 0c. How many rows in ref_user_roles? What role_codes exist?
SELECT id, role_code, role_name, is_active
FROM public.ref_user_roles
ORDER BY id;

-- 0d. Current RLS policies on log_user_profiles and user_feedback
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('log_user_profiles', 'user_feedback')
ORDER BY tablename, policyname;


-- ════════════════════════════════════════════════════════════
-- BLOCK 1: CREATE user_feedback
-- Pre-condition: BLOCK 0 confirmed user_feedback does NOT exist
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.user_feedback (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL CHECK (type IN ('bug', 'feature', 'comment')),
  message     TEXT        NOT NULL CHECK (char_length(message) <= 1000),
  page_url    TEXT,
  status      TEXT        NOT NULL DEFAULT 'open'
                          CHECK (status IN ('open', 'reviewed', 'resolved')),
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════
-- BLOCK 2: POST-VERIFY user_feedback creation
-- Expected: table exists, all 8 columns present, RLS = YES
-- ════════════════════════════════════════════════════════════

-- 2a. Table exists?
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'user_feedback';

-- 2b. All columns present?
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_feedback'
ORDER BY ordinal_position;

-- 2c. RLS enabled?
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname = 'user_feedback' AND relnamespace = 'public'::regnamespace;


-- ════════════════════════════════════════════════════════════
-- BLOCK 3: VERIFY log_user_profiles.role_id exists
-- Pre-condition: BLOCK 0 showed role_id column in log_user_profiles
-- If role_id was NOT shown in Block 0, stop and report.
-- ════════════════════════════════════════════════════════════

-- 3a. Confirm role_id column with FK details
SELECT
  c.column_name,
  c.data_type,
  c.column_default,
  c.is_nullable,
  kcu.constraint_name,
  ccu.table_name  AS references_table,
  ccu.column_name AS references_column
FROM information_schema.columns c
LEFT JOIN information_schema.key_column_usage kcu
  ON kcu.table_name = c.table_name
  AND kcu.column_name = c.column_name
  AND kcu.table_schema = 'public'
LEFT JOIN information_schema.referential_constraints rc
  ON rc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = rc.unique_constraint_name
WHERE c.table_schema = 'public'
  AND c.table_name = 'log_user_profiles'
  AND c.column_name = 'role_id';

-- ⚠️  STOP HERE. Review output of Block 3.
-- If role_id IS present → proceed to Block 4.
-- If role_id is NOT present → run Block 3b and continue to Block 3c.

-- 3b. (Only if role_id missing) Add role_id FK column
-- ALTER TABLE public.log_user_profiles
--   ADD COLUMN IF NOT EXISTS role_id INTEGER
--     REFERENCES public.ref_user_roles(id)
--     DEFAULT (SELECT id FROM public.ref_user_roles WHERE role_code = 'practitioner' LIMIT 1);

-- 3c. (Only after 3b runs) Re-verify role_id was added
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'log_user_profiles' AND column_name = 'role_id';


-- ════════════════════════════════════════════════════════════
-- BLOCK 4: CREATE is_admin() SECURITY DEFINER function
-- Pre-conditions: log_user_profiles.role_id exists, ref_user_roles has 'admin' role
-- ════════════════════════════════════════════════════════════

-- 4a. Pre-verify: confirm 'admin' role_code exists in ref_user_roles
SELECT id, role_code FROM public.ref_user_roles WHERE role_code = 'admin';
-- Expected: exactly 1 row

-- 4b. Create (or replace) the function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.log_user_profiles lup
    JOIN public.ref_user_roles rur ON rur.id = lup.role_id
    WHERE lup.user_id = auth.uid()
      AND rur.role_code = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- ════════════════════════════════════════════════════════════
-- BLOCK 5: POST-VERIFY is_admin() function
-- Expected: function present, security definer, accessible to authenticated
-- ════════════════════════════════════════════════════════════

SELECT
  p.proname AS function_name,
  p.prosecdef AS security_definer,
  p.provolatile AS volatility,
  pg_get_function_result(p.oid) AS returns
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname = 'is_admin';


-- ════════════════════════════════════════════════════════════
-- BLOCK 6: RLS POLICIES — user_feedback
-- ════════════════════════════════════════════════════════════

-- 6a. Pre: show current policies
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'user_feedback';

-- 6b. Insert: authenticated users can submit their own feedback
DROP POLICY IF EXISTS "users_insert_own_feedback" ON public.user_feedback;
CREATE POLICY "users_insert_own_feedback"
  ON public.user_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 6c. Select: admins can read all feedback
DROP POLICY IF EXISTS "admin_read_all_feedback" ON public.user_feedback;
CREATE POLICY "admin_read_all_feedback"
  ON public.user_feedback
  FOR SELECT
  TO authenticated
  USING ( public.is_admin() );

-- 6d. Update: admins can update status
DROP POLICY IF EXISTS "admin_update_feedback_status" ON public.user_feedback;
CREATE POLICY "admin_update_feedback_status"
  ON public.user_feedback
  FOR UPDATE
  TO authenticated
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

-- 6e. Post: verify all 3 policies exist
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'user_feedback';


-- ════════════════════════════════════════════════════════════
-- BLOCK 7: RLS POLICIES — log_user_profiles (admin access)
-- ════════════════════════════════════════════════════════════

-- 7a. Pre: show current policies
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'log_user_profiles';

-- 7b. Admin SELECT (full directory)
DROP POLICY IF EXISTS "admin_read_all_profiles" ON public.log_user_profiles;
CREATE POLICY "admin_read_all_profiles"
  ON public.log_user_profiles
  FOR SELECT
  TO authenticated
  USING ( public.is_admin() );

-- 7c. Admin UPDATE (role management)
DROP POLICY IF EXISTS "admin_update_user_roles" ON public.log_user_profiles;
CREATE POLICY "admin_update_user_roles"
  ON public.log_user_profiles
  FOR UPDATE
  TO authenticated
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

-- 7d. Post: verify new policies are present alongside existing ones
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'log_user_profiles';


-- ════════════════════════════════════════════════════════════
-- BLOCK 8: SET YOUR ADMIN ROLE
-- Updates Trevor's role_id to the 'admin' role.
-- Pre-condition: Block 0 confirmed 'admin' role_code exists.
-- ════════════════════════════════════════════════════════════

-- 8a. Pre: find your current row + role
SELECT lup.user_id, lup.role_id, rur.role_code, au.email
FROM public.log_user_profiles lup
JOIN public.ref_user_roles rur ON rur.id = lup.role_id
JOIN auth.users au ON au.id = lup.user_id
WHERE au.email = 'trevorcalton@gmail.com';

-- 8b. Update role to admin
UPDATE public.log_user_profiles
SET    role_id = (
         SELECT id FROM public.ref_user_roles WHERE role_code = 'admin' LIMIT 1
       )
WHERE  user_id = (
         SELECT id FROM auth.users WHERE email = 'trevorcalton@gmail.com' LIMIT 1
       );

-- 8c. Post: confirm role is now 'admin'
SELECT lup.user_id, lup.role_id, rur.role_code, au.email
FROM public.log_user_profiles lup
JOIN public.ref_user_roles rur ON rur.id = lup.role_id
JOIN auth.users au ON au.id = lup.user_id
WHERE au.email = 'trevorcalton@gmail.com';


-- ════════════════════════════════════════════════════════════
-- BLOCK 9: FINAL SMOKE TEST
-- Run last — confirms the entire setup is coherent.
-- ════════════════════════════════════════════════════════════

-- 9a. All admin-related policies in place?
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('user_feedback', 'log_user_profiles')
ORDER BY tablename, policyname;

-- 9b. user_feedback table fully formed?
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_feedback'
ORDER BY ordinal_position;

-- 9c. is_admin() function reachable?
SELECT proname, prosecdef FROM pg_proc
JOIN pg_namespace n ON n.oid = pronamespace
WHERE nspname = 'public' AND proname = 'is_admin';

-- 9d. Can you count users? (tests admin_read_all_profiles policy)
-- Run this AFTER logging back in as trevorcalton@gmail.com in the app.
-- Expected: > 0 rows returned
-- SELECT COUNT(*) FROM public.log_user_profiles;

-- ════════════════════════════════════════════════════════════
-- END — All structural changes are complete.
-- ════════════════════════════════════════════════════════════
