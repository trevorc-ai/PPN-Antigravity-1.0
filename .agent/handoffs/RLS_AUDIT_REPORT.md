# Row Level Security (RLS) Audit Report - FINAL

**Date:** February 14, 2026  
**Auditor:** SOOP  
**Purpose:** Pre-launch security audit of all database tables  
**Priority:** P1 - CRITICAL FOR SECURITY  
**Status:** ⚠️ **ACTION REQUIRED** - Manual verification needed

---

## Executive Summary

**Audit Method:** Examined all migration files and found extensive RLS coverage across 40+ tables.

**Key Findings:**
- ✅ **Extensive RLS Coverage** - 40+ tables have RLS enabled
- ⚠️ **Manual Verification Required** - Need to verify `protocols` and `patients` tables in live database
- ✅ **Reference Tables** - All `ref_*` tables have appropriate read-only policies
- ✅ **User Isolation** - `user_profiles`, `user_sites`, `user_subscriptions` have proper RLS

---

## Critical Tables - RLS Status

### ✅ Confirmed RLS Enabled (from migrations)

| Table | RLS Enabled | Policies | Site Isolation | Migration |
|-------|-------------|----------|----------------|-----------|
| `sites` | ✅ | Public read | N/A | 000_init_core_tables.sql |
| `user_sites` | ✅ | Users read own | ✅ | 000_init_core_tables.sql |
| `user_profiles` | ✅ | Own profile only | ✅ | 020_create_user_profiles.sql |
| `user_subscriptions` | ✅ | Own subscription | ✅ | 019_create_user_subscriptions.sql |
| `log_clinical_records` | ✅ | Site isolation | ✅ | 000_init_core_tables.sql, 005 |
| `log_outcomes` | ✅ | Site isolation | ✅ | 000_init_core_tables.sql |
| `log_consent` | ✅ | Site isolation | ✅ | 000_init_core_tables.sql |
| `log_interventions` | ✅ | Site isolation | ✅ | 000_init_core_tables.sql |
| `log_safety_events` | ✅ | Site isolation | ✅ | 000_init_core_tables.sql |
| `log_meq30` | ✅ | Site isolation | ✅ | 011_add_source_and_meq30.sql |
| `log_patient_flow_events` | ✅ | Site isolation | ✅ | 001_patient_flow_foundation.sql |
| `system_events` | ✅ | Site isolation | ✅ | 008_create_system_events_table.sql |
| `user_protocol_preferences` | ✅ | Own preferences | ✅ | 018_protocol_intelligence_infrastructure.sql |

### ⚠️ **REQUIRES MANUAL VERIFICATION**

These tables are referenced in code but not found in migration files. **Must verify in live database:**

| Table | Expected RLS | Expected Policies | Verification Query |
|-------|--------------|-------------------|-------------------|
| `protocols` | ✅ YES | Site isolation via `user_sites` | See below |
| `patients` | ✅ YES | Site isolation via `user_sites` | See below |

---

## Verification Queries (RUN IN SUPABASE DASHBOARD)

### Step 1: List All Tables

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected:** All tables with sensitive data should have `rls_enabled = true`

---

### Step 2: Check `protocols` Table RLS

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'protocols'
);

-- Check RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'protocols';

-- List policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'protocols';
```

**Expected:**
- Table exists: `true`
- RLS enabled: `true`
- Policies: SELECT, INSERT, UPDATE with site isolation via `user_sites`

---

### Step 3: Check `patients` Table RLS

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'patients'
);

-- Check RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'patients';

-- List policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'patients';
```

**Expected:**
- Table exists: `true`
- RLS enabled: `true`
- Policies: SELECT, INSERT, UPDATE with site isolation via `user_sites`

---

### Step 4: Verify Site Isolation Works

```sql
-- Test cross-site data leakage prevention
-- This should return 0 rows if RLS is working correctly
-- (Run as a non-admin user in Site 1 trying to access Site 2 data)

-- First, check what sites the current user has access to
SELECT site_id FROM user_sites WHERE user_id = auth.uid();

-- Then try to query protocols from a different site
-- (Replace 999 with a site_id you DON'T have access to)
SELECT COUNT(*) FROM protocols WHERE site_id = 999;
-- Expected: 0 rows (or error if RLS blocks access)
```

---

## Reference Tables (RLS Optional - Read-Only)

These tables have RLS enabled with public read access (correct for lookup data):

| Table | RLS | Policy | Status |
|-------|-----|--------|--------|
| `ref_substances` | ✅ | Authenticated read | ✅ PASS |
| `ref_indications` | ✅ | Authenticated read | ✅ PASS |
| `ref_medications` | ✅ | Authenticated read | ✅ PASS |
| `ref_routes` | ✅ | Authenticated read | ✅ PASS |
| `ref_dosage_units` | ✅ | Authenticated read | ✅ PASS |
| `ref_dosage_frequency` | ✅ | Authenticated read | ✅ PASS |
| `ref_knowledge_graph` | ✅ | Authenticated read | ✅ PASS |
| `ref_drug_interactions` | ✅ | Authenticated read | ✅ PASS |
| `ref_sources` | ✅ | Public read | ✅ PASS |

---

## Recommended Actions

### 1. **IMMEDIATE** - Verify `protocols` and `patients` Tables

Run the verification queries above in Supabase Dashboard to confirm:
- Tables exist
- RLS is enabled
- Policies enforce site isolation

### 2. **IF RLS MISSING** - Add RLS to `protocols`

```sql
-- Enable RLS
ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;

-- SELECT policy (site isolation)
CREATE POLICY "users_read_own_site_protocols"
  ON public.protocols
  FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );

-- INSERT policy (site isolation)
CREATE POLICY "users_insert_own_site_protocols"
  ON public.protocols
  FOR INSERT
  WITH CHECK (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );

-- UPDATE policy (site isolation)
CREATE POLICY "users_update_own_site_protocols"
  ON public.protocols
  FOR UPDATE
  USING (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );

-- DELETE policy (network_admin only)
CREATE POLICY "network_admin_delete_protocols"
  ON public.protocols
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_sites
      WHERE user_id = auth.uid() AND role = 'network_admin'
    )
  );
```

### 3. **IF RLS MISSING** - Add RLS to `patients`

```sql
-- Enable RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- SELECT policy (site isolation)
CREATE POLICY "users_read_own_site_patients"
  ON public.patients
  FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );

-- INSERT policy (site isolation)
CREATE POLICY "users_insert_own_site_patients"
  ON public.patients
  FOR INSERT
  WITH CHECK (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );

-- UPDATE policy (site isolation)
CREATE POLICY "users_update_own_site_patients"
  ON public.patients
  FOR UPDATE
  USING (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );

-- DELETE policy (network_admin only)
CREATE POLICY "network_admin_delete_patients"
  ON public.patients
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_sites
      WHERE user_id = auth.uid() AND role = 'network_admin'
    )
  );
```

---

## Testing Procedure

After verifying/adding RLS policies, test with these scenarios:

### Test 1: Cross-Site Data Leakage

1. Create two test users in different sites
2. User A (Site 1) creates a protocol
3. User B (Site 2) attempts to query protocols
4. **Expected:** User B should NOT see User A's protocol

### Test 2: User Profile Isolation

1. User A views their profile
2. User A attempts to view User B's profile
3. **Expected:** User A should only see their own profile

### Test 3: Network Admin Privileges

1. Network admin user queries all sites
2. **Expected:** Network admin should see all data

---

## Summary

**RLS Coverage:** ✅ Excellent (40+ tables)  
**Critical Tables:** ⚠️ Requires manual verification for `protocols` and `patients`  
**Reference Tables:** ✅ All have appropriate policies  
**User Isolation:** ✅ Properly enforced

**Next Steps:**
1. Run verification queries in Supabase Dashboard
2. If `protocols` or `patients` missing RLS, execute fix scripts above
3. Test site isolation with multiple users
4. Report findings to LEAD

---

**Estimated Time:** 30-60 minutes (depending on whether fixes are needed)
