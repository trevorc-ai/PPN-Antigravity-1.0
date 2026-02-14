# User Profiles Database - Complete ✅

## Command #005 - Task #2: User Profiles Table

**Status:** ✅ VERIFIED - Migration already exists and exceeds requirements

---

## Migration File

**File:** `migrations/020_create_user_profiles.sql`  
**Status:** ✅ Already created (more comprehensive than spec)

### Schema Overview

The existing `user_profiles` table includes:

#### Required Fields (from spec)
- ✅ `user_id` - Links to auth.users
- ✅ `full_name` - Split into `first_name` + `last_name` (better UX)
- ✅ `role` - Implemented as `role_tier` with more granular options
- ✅ `profile_completed` - Implemented as `is_profile_complete`
- ✅ RLS policies - Users can only access own profile
- ✅ Indexes - On user_id, role_tier, subscription_status, email
- ✅ Updated_at trigger - Auto-updates timestamp

#### Bonus Fields (beyond spec)
- ✅ `email` - User's email address
- ✅ `display_name` - How user wants to be addressed (e.g., "Dr. Smith")
- ✅ `specialty` - Self-reported specialty (no verification)
- ✅ `organization_name` - Self-reported organization
- ✅ `subscription_status` - active, trialing, past_due, canceled, inactive, lifetime_free
- ✅ `subscription_tier` - solo, clinic_5, clinic_10, clinic_25, clinic_50, enterprise
- ✅ `pilot_expires_at` - Expiration date for pilot testers
- ✅ `protocol_limit` - Max protocols allowed
- ✅ `stripe_customer_id` - Stripe integration
- ✅ `stripe_subscription_id` - Stripe integration
- ✅ `features` - JSONB for feature flags

---

## Role Tiers

The `role_tier` field supports:
- `super_admin` - System administrators (you and your partner)
- `partner` - Business partners/owners
- `pilot_free` - Free pilot testers
- `pilot_paid` - Paid pilot testers
- `solo_practitioner` - Solo practitioners (paying customers)
- `clinic_admin` - Clinic administrators (paying customers)

---

## How to Test the Interface

### Step 1: Execute Migration (if not already done)

**Via Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/rxwsthatjhnixqsthegf/sql
2. Copy contents of `migrations/020_create_user_profiles.sql`
3. Click "Run"

### Step 2: Create Test Profiles

I've created a test data script to populate profiles for you, your partner, and pilot testers:

**File:** `migrations/999_load_user_profile_test_data.sql`

This will create profiles for:
- **You** (Trevor Calton) - super_admin, lifetime_free
- **Your Partner** - partner, lifetime_free
- **3 Pilot Testers** - pilot_free, with expiration dates

### Step 3: Test the Interface

Once profiles are loaded:

1. **Sign in as yourself** - You should see "Trevor Calton" in TopHeader (not "Dr. Sarah Jenkins")
2. **Sign in as your partner** - They should see their name
3. **Sign in as a pilot tester** - They should see their name

### Step 4: Profile Setup Flow (for new users)

When a new user signs up:
1. They create an account via Supabase Auth
2. App detects no profile exists (`user_profiles` table has no row for their `user_id`)
3. App shows "Profile Setup" modal/page
4. User fills in:
   - First name
   - Last name
   - Display name (optional - how they want to be addressed)
   - Specialty (optional)
   - Organization (optional)
5. App creates profile record with `is_profile_complete = true`
6. User is redirected to dashboard

---

## Example Queries for BUILDER

### Check if user has a profile
```typescript
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', user.id)
  .single();

if (!profile) {
  // Show profile setup flow
}
```

### Get user's display name for TopHeader
```typescript
const { data: profile } = await supabase
  .from('user_profiles')
  .select('display_name, first_name, last_name')
  .eq('user_id', user.id)
  .single();

const displayName = profile.display_name || `${profile.first_name} ${profile.last_name}`;
// Use in TopHeader: displayName
```

### Create new profile
```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .insert({
    user_id: user.id,
    first_name: 'John',
    last_name: 'Doe',
    email: user.email,
    display_name: 'Dr. Doe',
    role_tier: 'pilot_free',
    subscription_status: 'lifetime_free',
    is_profile_complete: true
  });
```

### Update profile
```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .update({
    display_name: 'Dr. Smith',
    specialty: 'Psychiatry',
    organization_name: 'Smith Clinic'
  })
  .eq('user_id', user.id);
```

---

## RLS Verification

The table has proper RLS policies:
- ✅ Users can only SELECT their own profile
- ✅ Users can only INSERT their own profile
- ✅ Users can only UPDATE their own profile
- ✅ No cross-user data access

---

## Next Steps for BUILDER

1. **Update TopHeader.tsx** to fetch user's display name from `user_profiles` table
2. **Create ProfileSetup component** for new users without a profile
3. **Add profile editing** in Settings page
4. **Handle missing profiles** gracefully (show setup flow)

---

## Files

- ✅ `migrations/020_create_user_profiles.sql` - Main migration (already exists)
- ✅ `migrations/999_load_user_profile_test_data.sql` - Test data for you, partner, pilot testers (NEW)
- ✅ `.agent/handoffs/SOOP_USER_PROFILES_COMPLETE.md` - This documentation

---

**Status**: ✅ Ready for BUILDER to implement UI components  
**Migration**: ✅ Already created, ready to execute  
**Test Data**: ✅ Created, ready to load
