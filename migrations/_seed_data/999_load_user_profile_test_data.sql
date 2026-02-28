-- ============================================
-- USER PROFILE TEST DATA
-- ============================================
-- Purpose: Load test user profiles for interface testing
-- Created: 2026-02-13
-- Author: SOOP
-- 
-- IMPORTANT: Replace the user_id values with actual auth.users IDs
-- after users have signed up via Supabase Auth
-- ============================================

BEGIN;

-- ============================================
-- OWNER PROFILES (You and Your Partner)
-- ============================================

-- Profile 1: PPN Admin (You - Super Admin)
-- NOTE: Replace 'YOUR-AUTH-USER-ID-HERE' with your actual auth.users.id
INSERT INTO public.user_profiles (
  user_id,
  first_name,
  last_name,
  email,
  display_name,
  specialty,
  organization_name,
  role_tier,
  subscription_status,
  subscription_tier,
  protocol_limit,
  is_profile_complete,
  features
)
VALUES (
  'YOUR-AUTH-USER-ID-HERE',  -- Replace with your auth.users.id
  'Admin',
  'Calton',
  'info@ppnresearch.com',  -- Replace with your email
  'PPN Admin',
  NULL,
  'PPN Research Portal',
  'super_admin',
  'lifetime_free',
  NULL,
  999999,  -- Unlimited protocols
  true,
  '{"admin_panel": true, "analytics": true, "user_management": true}'::jsonb
)
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  role_tier = EXCLUDED.role_tier,
  subscription_status = EXCLUDED.subscription_status,
  protocol_limit = EXCLUDED.protocol_limit,
  is_profile_complete = EXCLUDED.is_profile_complete,
  features = EXCLUDED.features;

-- Profile 2: Your Business Partner
-- NOTE: Replace 'PARTNER-AUTH-USER-ID-HERE' with partner's actual auth.users.id
INSERT INTO public.user_profiles (
  user_id,
  first_name,
  last_name,
  email,
  display_name,
  specialty,
  organization_name,
  role_tier,
  subscription_status,
  subscription_tier,
  protocol_limit,
  is_profile_complete,
  features
)
VALUES (
  'PARTNER-AUTH-USER-ID-HERE',  -- Replace with partner's auth.users.id
  'Partner',  -- Replace with partner's first name
  'Name',     -- Replace with partner's last name
  'partner@ppnresearch.com',  -- Replace with partner's email
  'Dr. Partner Name',  -- Replace with how they want to be addressed
  NULL,
  'PPN Research Portal',
  'partner',
  'lifetime_free',
  NULL,
  999999,  -- Unlimited protocols
  true,
  '{"admin_panel": true, "analytics": true}'::jsonb
)
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  role_tier = EXCLUDED.role_tier,
  subscription_status = EXCLUDED.subscription_status,
  protocol_limit = EXCLUDED.protocol_limit,
  is_profile_complete = EXCLUDED.is_profile_complete,
  features = EXCLUDED.features;

-- ============================================
-- PILOT TESTER PROFILES (3 examples)
-- ============================================

-- Pilot Tester 1: Dr. Sarah Jenkins (Free Pilot)
-- NOTE: Replace 'PILOT1-AUTH-USER-ID-HERE' with actual auth.users.id
INSERT INTO public.user_profiles (
  user_id,
  first_name,
  last_name,
  email,
  display_name,
  specialty,
  organization_name,
  role_tier,
  subscription_status,
  pilot_expires_at,
  protocol_limit,
  is_profile_complete
)
VALUES (
  'PILOT1-AUTH-USER-ID-HERE',  -- Replace with pilot tester's auth.users.id
  'Sarah',
  'Jenkins',
  'sarah.jenkins@example.com',  -- Replace with pilot tester's email
  'Dr. Sarah Jenkins',
  'Psychiatry',
  'Mindful Healing Center',
  'pilot_free',
  'lifetime_free',
  NOW() + INTERVAL '90 days',  -- Pilot expires in 90 days
  100,  -- 100 protocol limit
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  specialty = EXCLUDED.specialty,
  organization_name = EXCLUDED.organization_name,
  role_tier = EXCLUDED.role_tier,
  subscription_status = EXCLUDED.subscription_status,
  pilot_expires_at = EXCLUDED.pilot_expires_at,
  protocol_limit = EXCLUDED.protocol_limit,
  is_profile_complete = EXCLUDED.is_profile_complete;

-- Pilot Tester 2: Dr. Michael Chen (Free Pilot)
-- NOTE: Replace 'PILOT2-AUTH-USER-ID-HERE' with actual auth.users.id
INSERT INTO public.user_profiles (
  user_id,
  first_name,
  last_name,
  email,
  display_name,
  specialty,
  organization_name,
  role_tier,
  subscription_status,
  pilot_expires_at,
  protocol_limit,
  is_profile_complete
)
VALUES (
  'PILOT2-AUTH-USER-ID-HERE',  -- Replace with pilot tester's auth.users.id
  'Michael',
  'Chen',
  'michael.chen@example.com',  -- Replace with pilot tester's email
  'Dr. Michael Chen',
  'Psychology',
  'Horizon Wellness Clinic',
  'pilot_free',
  'lifetime_free',
  NOW() + INTERVAL '90 days',  -- Pilot expires in 90 days
  100,  -- 100 protocol limit
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  specialty = EXCLUDED.specialty,
  organization_name = EXCLUDED.organization_name,
  role_tier = EXCLUDED.role_tier,
  subscription_status = EXCLUDED.subscription_status,
  pilot_expires_at = EXCLUDED.pilot_expires_at,
  protocol_limit = EXCLUDED.protocol_limit,
  is_profile_complete = EXCLUDED.is_profile_complete;

-- Pilot Tester 3: Emma Rodriguez (Free Pilot)
-- NOTE: Replace 'PILOT3-AUTH-USER-ID-HERE' with actual auth.users.id
INSERT INTO public.user_profiles (
  user_id,
  first_name,
  last_name,
  email,
  display_name,
  specialty,
  organization_name,
  role_tier,
  subscription_status,
  pilot_expires_at,
  protocol_limit,
  is_profile_complete
)
VALUES (
  'PILOT3-AUTH-USER-ID-HERE',  -- Replace with pilot tester's auth.users.id
  'Emma',
  'Rodriguez',
  'emma.rodriguez@example.com',  -- Replace with pilot tester's email
  'Emma Rodriguez',  -- No "Dr." - not all pilot testers are doctors
  'Psychotherapy',
  'Inner Journey Therapy',
  'pilot_free',
  'lifetime_free',
  NOW() + INTERVAL '90 days',  -- Pilot expires in 90 days
  100,  -- 100 protocol limit
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  specialty = EXCLUDED.specialty,
  organization_name = EXCLUDED.organization_name,
  role_tier = EXCLUDED.role_tier,
  subscription_status = EXCLUDED.subscription_status,
  pilot_expires_at = EXCLUDED.pilot_expires_at,
  protocol_limit = EXCLUDED.protocol_limit,
  is_profile_complete = EXCLUDED.is_profile_complete;

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count user profiles
SELECT COUNT(*) as profile_count FROM public.user_profiles;

-- View all profiles
SELECT 
  first_name,
  last_name,
  display_name,
  role_tier,
  subscription_status,
  protocol_limit,
  pilot_expires_at
FROM public.user_profiles
ORDER BY role_tier, last_name;

-- ============================================
-- INSTRUCTIONS FOR USE
-- ============================================

/*
STEP 1: Get User IDs from Supabase Auth
---------------------------------------
1. Go to Supabase Dashboard → Authentication → Users
2. Find each user (you, partner, pilot testers)
3. Copy their UUID (e.g., "a1b2c3d4-e5f6-7890-abcd-ef1234567890")

STEP 2: Replace Placeholder IDs
--------------------------------
Replace these placeholders in the SQL above:
- YOUR-AUTH-USER-ID-HERE → Your actual auth.users.id
- PARTNER-AUTH-USER-ID-HERE → Partner's actual auth.users.id
- PILOT1-AUTH-USER-ID-HERE → Pilot tester 1's actual auth.users.id
- PILOT2-AUTH-USER-ID-HERE → Pilot tester 2's actual auth.users.id
- PILOT3-AUTH-USER-ID-HERE → Pilot tester 3's actual auth.users.id

STEP 3: Update Email Addresses
-------------------------------
Replace example emails with real emails:
- info@ppnresearch.com → Your real email
- partner@ppnresearch.com → Partner's real email
- sarah.jenkins@example.com → Pilot tester 1's real email
- etc.

STEP 4: Execute Migration
--------------------------
1. Go to Supabase Dashboard → SQL Editor
2. Paste the updated SQL (with real user IDs and emails)
3. Click "Run"

STEP 5: Test Interface
-----------------------
1. Sign in as yourself → Should see "PPN Admin" in TopHeader
2. Sign in as partner → Should see their name
3. Sign in as pilot tester → Should see their name

CLEANUP (if needed):
DELETE FROM public.user_profiles WHERE role_tier IN ('pilot_free', 'pilot_paid');
*/
