-- ============================================
-- TEST USER INFRASTRUCTURE ONLY
-- ============================================
-- Purpose: Create test user account and site for login testing
-- CRITICAL: This does NOT create fake clinical data
-- User will create protocols via UI after login
-- ============================================

BEGIN;

-- ============================================
-- 1. CREATE TEST USER IN AUTH
-- ============================================
-- Note: This creates a Supabase Auth user
-- Email: test@ppn.local
-- Password: TestPassword123!

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
)
VALUES (
  '00000000-0000-0000-0000-000000000099'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'test@ppn.local',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CREATE TEST SITE (Infrastructure, not clinical data)
-- ============================================
-- Note: site_id is BIGSERIAL, so we can insert a specific value
INSERT INTO public.sites (
  site_id,
  site_name,
  site_code,
  is_active,
  region,
  site_type,
  created_at,
  updated_at
)
VALUES (
  999,
  'TEST SITE - Demo Account',
  'TEST-999',
  TRUE,
  'US-West',
  'demo',
  NOW(),
  NOW()
)
ON CONFLICT (site_id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  updated_at = NOW();

-- ============================================
-- 3. LINK TEST USER TO TEST SITE
-- ============================================
INSERT INTO public.user_sites (
  user_id,
  site_id,
  role,
  is_active,
  created_at
)
VALUES (
  '00000000-0000-0000-0000-000000000099'::uuid,
  999,
  'clinician',
  TRUE,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. CREATE USER PROFILE (if table exists)
-- ============================================
INSERT INTO public.user_profiles (
  user_id,
  full_name,
  license_type,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000099'::uuid,
  'Test User',
  'MD',
  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO NOTHING;

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify test user exists
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE id = '00000000-0000-0000-0000-000000000099';

-- Verify test site exists
SELECT site_id, site_name, site_code, is_active 
FROM public.sites 
WHERE site_id = 999;

-- Verify user-site link exists
SELECT user_id, site_id, role, is_active 
FROM public.user_sites 
WHERE user_id = '00000000-0000-0000-0000-000000000099';

-- ============================================
-- TEST CREDENTIALS
-- ============================================
-- Email: test@ppn.local
-- Password: TestPassword123!
-- ============================================

-- ============================================
-- CLEANUP (if needed)
-- ============================================
-- DELETE FROM public.user_sites WHERE user_id = '00000000-0000-0000-0000-000000000099';
-- DELETE FROM public.user_profiles WHERE user_id = '00000000-0000-0000-0000-000000000099';
-- DELETE FROM public.sites WHERE site_id = 999;
-- DELETE FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000099';
