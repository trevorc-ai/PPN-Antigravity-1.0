-- ============================================================
-- WO-610: Admin Dashboard Schema Additions
-- Additive only. RLS enforced. No drops.
-- Run manually in Supabase SQL Editor (BUILDER does NOT execute this).
-- ============================================================

-- 1. Add status column to user_feedback
ALTER TABLE public.user_feedback
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'reviewed', 'resolved'));

-- 2. Add metadata JSONB column to user_feedback (for bug report context)
ALTER TABLE public.user_feedback
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 3. Add role column to log_user_profiles
ALTER TABLE public.log_user_profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'practitioner'
    CHECK (role IN ('practitioner', 'admin', 'suspended'));

-- 4. Admin SELECT policy on user_feedback
DROP POLICY IF EXISTS "admin_read_all_feedback" ON public.user_feedback;
CREATE POLICY "admin_read_all_feedback"
  ON public.user_feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.log_user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Admin UPDATE policy on user_feedback (status changes)
DROP POLICY IF EXISTS "admin_update_feedback_status" ON public.user_feedback;
CREATE POLICY "admin_update_feedback_status"
  ON public.user_feedback
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.log_user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (true);

-- 6. Admin SELECT policy on log_user_profiles (full directory)
DROP POLICY IF EXISTS "admin_read_all_profiles" ON public.log_user_profiles;
CREATE POLICY "admin_read_all_profiles"
  ON public.log_user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.log_user_profiles AS adm
      WHERE adm.user_id = auth.uid() AND adm.role = 'admin'
    )
  );

-- 7. Admin UPDATE policy on log_user_profiles (role management)
DROP POLICY IF EXISTS "admin_update_user_roles" ON public.log_user_profiles;
CREATE POLICY "admin_update_user_roles"
  ON public.log_user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.log_user_profiles AS adm
      WHERE adm.user_id = auth.uid() AND adm.role = 'admin'
    )
  )
  WITH CHECK (true);

-- ============================================================
-- POST-MIGRATION (run manually in Supabase SQL Editor):
-- Replace <TREVOR_USER_UUID> with actual UUID from auth.users
-- DO NOT add this to the migration file itself.
--
-- UPDATE public.log_user_profiles
-- SET role = 'admin'
-- WHERE user_id = '<TREVOR_USER_UUID>';
-- ============================================================
