# @SOOP: BUILDER Database Dependencies

**Command ID:** #005  
**Date Issued:** February 13, 2026, 4:45 PM PST  
**Issued By:** LEAD (on behalf of BUILDER)  
**Priority:** P0 - CRITICAL  
**Deadline:** Today EOD (Feb 13, 2026)

---

## Directive

BUILDER needs database support for two features:
1. **Clinical Insights Panel** - Database work for Protocol Builder
2. **User Profiles** - New table for profile management

---

## Task #1: Clinical Insights Panel Database (VERIFY STATUS)

**Status:** Marked as COMPLETE in protocol_builder_corrective_plan.md (line 216)

**Required Database Components:**
1. ✅ `ref_medications` table with `is_common` flag
2. ✅ `ref_substances` table with receptor affinity data
3. ✅ `mv_outcomes_summary` materialized view
4. ✅ `ref_knowledge_graph` table for drug interactions

**SOOP: Please confirm these are actually deployed and working:**

```sql
-- Verification Query 1: Check ref_medications.is_common flag
SELECT COUNT(*) as common_meds_count
FROM ref_medications
WHERE is_common = true;
-- Expected: ~60 medications

-- Verification Query 2: Check ref_substances receptor data
SELECT substance_name, 
       receptor_5ht2a, receptor_5ht1a, receptor_d2, 
       receptor_nmda, receptor_kappa, receptor_sigma1
FROM ref_substances
WHERE substance_name IN ('Psilocybin', 'MDMA', 'Ketamine', 'LSD');
-- Expected: 4 rows with receptor affinity values

-- Verification Query 3: Check mv_outcomes_summary
SELECT * FROM mv_outcomes_summary LIMIT 5;
-- Expected: Materialized view exists and has data

-- Verification Query 4: Check ref_knowledge_graph
SELECT COUNT(*) as interaction_count
FROM ref_knowledge_graph
WHERE interaction_type = 'drug_interaction';
-- Expected: 15+ drug interactions
```

**If any of these fail, please fix immediately.**

---

## Task #2: User Profiles Table (NEW - REQUIRED)

**Status:** NOT STARTED  
**Priority:** P0 - BLOCKING PILOT TESTING  
**Estimated Time:** 1 hour

**Problem:**
- TopHeader.tsx currently shows "Dr. Sarah Jenkins" for ALL users (hardcoded)
- No profile setup flow exists for new users
- Pilot testers cannot set their own name/credentials

**Required:**
Create `user_profiles` table to store user information.

### Migration File

**Create:** `migrations/019_create_user_profiles.sql`

```sql
-- ============================================
-- USER PROFILES TABLE
-- ============================================
-- Purpose: Store user profile information (name, role, credentials)
-- Created: 2026-02-13
-- Author: SOOP
-- ============================================

BEGIN;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'pilot_tester', 'practitioner', 'researcher', 'analyst')),
  license_number TEXT,
  specialty TEXT CHECK (specialty IN ('psychiatry', 'psychology', 'psychotherapy', 'nursing', 'social_work', 'other')),
  years_experience TEXT CHECK (years_experience IN ('0-2', '3-5', '6-10', '11-20', '20+')),
  organization TEXT,
  avatar_url TEXT,
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Test table creation
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Test RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_profiles';

-- Test indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'user_profiles';
```

### Schema Details

**Table:** `public.user_profiles`

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY | Unique profile ID |
| `user_id` | UUID | NOT NULL, UNIQUE, FK to auth.users | Links to Supabase auth user |
| `full_name` | TEXT | NOT NULL | User's full name (e.g., "Dr. Sarah Jenkins") |
| `role` | TEXT | NOT NULL, CHECK constraint | User role: owner, pilot_tester, practitioner, researcher, analyst |
| `license_number` | TEXT | NULLABLE | Professional license number (optional for owners/pilot testers) |
| `specialty` | TEXT | NULLABLE, CHECK constraint | Specialty: psychiatry, psychology, etc. |
| `years_experience` | TEXT | NULLABLE, CHECK constraint | Experience range: 0-2, 3-5, etc. |
| `organization` | TEXT | NULLABLE | Clinic/organization name |
| `avatar_url` | TEXT | NULLABLE | Profile picture URL |
| `profile_completed` | BOOLEAN | DEFAULT FALSE | Whether user has completed profile setup |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Profile creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**RLS Policies:**
- Users can only view/update/insert their own profile
- No cross-user data access

**Indexes:**
- `user_id` (for fast lookups)
- `role` (for filtering by role)

---

## Deliverables

1. **Verify Clinical Insights Database** (15 min)
   - Run verification queries
   - Confirm all 4 components working
   - Report any issues

2. **Create User Profiles Migration** (45 min)
   - Create `migrations/019_create_user_profiles.sql`
   - Run migration via Supabase Dashboard
   - Verify table created with RLS policies
   - Test CRUD operations

3. **Documentation** (10 min)
   - Create `.agent/handoffs/SOOP_USER_PROFILES_COMPLETE.md`
   - Document table schema
   - Provide example queries for BUILDER

---

## Testing Instructions

### Test 1: Verify Clinical Insights Database

```bash
# Connect to Supabase and run verification queries
# Expected: All 4 queries return data
```

### Test 2: Create Test Profile

```sql
-- Insert test profile
INSERT INTO public.user_profiles (
  user_id,
  full_name,
  role,
  license_number,
  specialty,
  years_experience,
  organization,
  profile_completed
)
VALUES (
  auth.uid(),
  'Test User',
  'pilot_tester',
  NULL,
  NULL,
  NULL,
  'Test Org',
  true
);

-- Verify insertion
SELECT * FROM public.user_profiles WHERE user_id = auth.uid();

-- Update profile
UPDATE public.user_profiles
SET full_name = 'Updated Test User'
WHERE user_id = auth.uid();

-- Verify update
SELECT * FROM public.user_profiles WHERE user_id = auth.uid();

-- Delete test profile
DELETE FROM public.user_profiles WHERE user_id = auth.uid();
```

### Test 3: Verify RLS Policies

```sql
-- Try to access another user's profile (should fail)
SELECT * FROM public.user_profiles WHERE user_id != auth.uid();
-- Expected: 0 rows (RLS blocks access)
```

---

## Success Criteria

- ✅ Clinical Insights database components verified and working
- ✅ `user_profiles` table created with correct schema
- ✅ RLS policies enforced (users can only access own profile)
- ✅ Indexes created for performance
- ✅ Trigger updates `updated_at` timestamp
- ✅ Test profile CRUD operations successful
- ✅ Documentation delivered to BUILDER

---

## Timeline

**Start:** Immediately  
**Deadline:** Today EOD (Feb 13, 2026)  
**Estimated Time:** 1 hour total

**Breakdown:**
- Clinical Insights verification: 15 min
- User Profiles migration: 45 min
- Documentation: 10 min

---

## Acknowledgment Required

Reply within 2 hours:

```
✅ ACKNOWLEDGED - Command #005 received. 
- Clinical Insights DB: [VERIFIED / NEEDS FIXES]
- User Profiles migration: Starting now. ETA: [Your estimated completion time]
```

---

## Questions?

If you encounter any issues or need clarification, notify LEAD immediately.

---

**This is a P0 CRITICAL task. BUILDER is blocked on User Profiles table for pilot testing.**
