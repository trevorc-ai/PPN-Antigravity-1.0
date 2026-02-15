-- ============================================
-- COMPLETE TEST USER SETUP
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- ============================================

BEGIN;

-- 1. Create test user in auth.users
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
  role,
  confirmation_token,
  email_confirmed_at,
  recovery_token,
  email_change_token_new,
  email_change
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
  'authenticated',
  '',
  NOW(),
  '',
  '',
  ''
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = NOW();

-- 2. Verify auth user was created
SELECT id, email, email_confirmed_at, role 
FROM auth.users 
WHERE email = 'test@ppn.local';

COMMIT;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
  'Test user created successfully' as status,
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  role
FROM auth.users
WHERE email = 'test@ppn.local';
