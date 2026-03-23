---
id: WO-610
title: Admin Dashboard — Database Schema Additions
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 03_BUILD
priority: P0 — must ship before WO-611 or WO-612
created: 2026-03-11
---

## Context

The Admin Dashboard and Feedback Overhaul require three additive schema changes:
1. Two new columns on `user_feedback` (`status`, `metadata`)
2. A `role` column on `log_user_profiles`
3. Two new RLS policies enabling admin reads/writes
4. A one-time seed to set the founding admin user's role

---

## Migration File

**Create:** `supabase/migrations/20260311_admin_dashboard.sql`

```sql
-- ============================================================
-- WO-610: Admin Dashboard Schema Additions
-- Additive only. RLS enforced. No drops.
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
CREATE POLICY IF NOT EXISTS "admin_read_all_feedback"
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
CREATE POLICY IF NOT EXISTS "admin_update_feedback_status"
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
CREATE POLICY IF NOT EXISTS "admin_read_all_profiles"
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
CREATE POLICY IF NOT EXISTS "admin_update_user_roles"
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
```

---

## Post-Migration Step (Run Once in Supabase SQL Editor)

After the migration is applied, set the founding admin role. Replace `<TREVOR_USER_UUID>` with the actual UUID from `auth.users`:

```sql
UPDATE public.log_user_profiles
SET role = 'admin'
WHERE user_id = '<TREVOR_USER_UUID>';
```

> **IMPORTANT:** Do NOT hardcode the UUID into the migration file itself — run this manually in the Supabase dashboard to avoid exposing internal IDs.

---

## Do NOT Touch

- Any existing columns or policies
- `log_clinical_records` or any clinical table
- Any file outside the migration SQL file

---

## Acceptance Criteria

- [ ] `user_feedback` has `status` column (`open` default) and `metadata JSONB` column
- [ ] `log_user_profiles` has `role` column (`practitioner` default)
- [ ] `npm run build` passes with zero TypeScript errors (schema changes are DB-only)
- [ ] Admin user sees feedback rows when querying via Supabase dashboard
- [ ] Non-admin user cannot SELECT from `user_feedback`
