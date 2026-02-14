# Row Level Security (RLS) Audit Report

**Date:** February 13, 2026  
**Auditor:** SOOP  
**Purpose:** Pre-launch security audit of all database tables  
**Priority:** P1 - CRITICAL FOR SECURITY

---

## Executive Summary

**Status:** ⚠️ AUDIT IN PROGRESS

This audit verifies that all tables containing sensitive data have proper Row Level Security (RLS) policies to prevent:
- Cross-site data leakage
- Unauthorized data access
- PHI/PII exposure

---

## Audit Methodology

### Step 1: Identify All Tables

Run this query to list all public schema tables:

```sql
SELECT 
  table_name,
  (SELECT COUNT(*) 
   FROM information_schema.columns 
   WHERE table_schema = 'public' 
   AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### Step 2: Check RLS Status

For each table, run:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Step 3: List Policies

For tables with RLS enabled:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## Critical Tables (MUST Have RLS)

These tables contain sensitive patient/practitioner data and MUST have RLS:

| Table | Contains | RLS Required | Audit Status |
|-------|----------|--------------|--------------|
| `protocols` | Patient protocols | ✅ YES | 🔍 TO AUDIT |
| `patients` | Patient demographics | ✅ YES | 🔍 TO AUDIT |
| `protocol_outcomes` | Treatment outcomes | ✅ YES | 🔍 TO AUDIT |
| `adverse_events` | Safety data | ✅ YES | 🔍 TO AUDIT |
| `user_profiles` | Practitioner info | ✅ YES | 🔍 TO AUDIT |
| `user_sites` | Site access control | ✅ YES | 🔍 TO AUDIT |
| `sites` | Site information | ✅ YES | 🔍 TO AUDIT |
| `user_subscriptions` | Billing data | ✅ YES | 🔍 TO AUDIT |

---

## Reference Tables (RLS Optional)

These tables contain lookup data only (no sensitive info):

| Table | Purpose | RLS Required | Notes |
|-------|---------|--------------|-------|
| `ref_substances` | Substance lookup | ❌ NO | Read-only, public data |
| `ref_indications` | Indication lookup | ❌ NO | Read-only, public data |
| `ref_dosage_units` | Unit lookup | ❌ NO | Read-only, public data |
| `ref_routes` | Route lookup | ❌ NO | Read-only, public data |
| `ref_frequencies` | Frequency lookup | ❌ NO | Read-only, public data |
| `ref_medications` | Medication lookup | ❌ NO | Read-only, public data |
| `ref_knowledge_graph` | Drug interactions | ❌ NO | Read-only, public data |

---

## RLS Policy Requirements

For each critical table, verify:

### 1. RLS Enabled
```sql
ALTER TABLE public.[table_name] ENABLE ROW LEVEL SECURITY;
```

### 2. SELECT Policy (Site Isolation)
```sql
CREATE POLICY "Users can view own site data"
  ON public.[table_name]
  FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );
```

### 3. INSERT Policy (Site Isolation)
```sql
CREATE POLICY "Users can insert to own site"
  ON public.[table_name]
  FOR INSERT
  WITH CHECK (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );
```

### 4. UPDATE Policy (Site Isolation)
```sql
CREATE POLICY "Users can update own site data"
  ON public.[table_name]
  FOR UPDATE
  USING (
    site_id IN (
      SELECT site_id FROM public.user_sites WHERE user_id = auth.uid()
    )
  );
```

### 5. DELETE Policy (Restricted)
```sql
CREATE POLICY "Only network_admin can delete"
  ON public.[table_name]
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_sites
      WHERE user_id = auth.uid() AND role = 'network_admin'
    )
  );
```

---

## Audit Checklist

### Critical Tables Audit

For each table below, verify:
- [ ] RLS enabled
- [ ] SELECT policy exists and enforces site isolation
- [ ] INSERT policy exists and enforces site isolation
- [ ] UPDATE policy exists and enforces site isolation
- [ ] DELETE policy exists and restricts to network_admin
- [ ] No data leakage across sites (test with multiple users)

#### `protocols`
- [ ] RLS enabled
- [ ] Policies verified
- [ ] Site isolation tested
- **Status:** 🔍 PENDING AUDIT

#### `patients`
- [ ] RLS enabled
- [ ] Policies verified
- [ ] Site isolation tested
- **Status:** 🔍 PENDING AUDIT

#### `protocol_outcomes`
- [ ] RLS enabled
- [ ] Policies verified
- [ ] Site isolation tested
- **Status:** 🔍 PENDING AUDIT

#### `adverse_events`
- [ ] RLS enabled
- [ ] Policies verified
- [ ] Site isolation tested
- **Status:** 🔍 PENDING AUDIT

#### `user_profiles`
- [ ] RLS enabled
- [ ] Policies verified
- [ ] User can only access own profile
- **Status:** 🔍 PENDING AUDIT

#### `user_sites`
- [ ] RLS enabled
- [ ] Policies verified
- [ ] User can only see own site assignments
- **Status:** 🔍 PENDING AUDIT

#### `sites`
- [ ] RLS enabled
- [ ] Policies verified
- [ ] User can only see sites they're assigned to
- **Status:** 🔍 PENDING AUDIT

#### `user_subscriptions`
- [ ] RLS enabled
- [ ] Policies verified
- [ ] User can only access own subscription
- **Status:** 🔍 PENDING AUDIT

---

## Testing Procedure

### Test 1: Cross-Site Data Leakage

1. Create two test users in different sites
2. User A creates a protocol in Site 1
3. User B (Site 2) attempts to query protocols
4. **Expected:** User B should NOT see User A's protocol

```sql
-- As User A (Site 1)
INSERT INTO protocols (...) VALUES (...);

-- As User B (Site 2)
SELECT * FROM protocols WHERE site_id = 1;
-- Expected: 0 rows (RLS blocks access)
```

### Test 2: User Profile Isolation

1. User A views their profile
2. User A attempts to view User B's profile
3. **Expected:** User A should only see their own profile

```sql
-- As User A
SELECT * FROM user_profiles WHERE user_id != auth.uid();
-- Expected: 0 rows (RLS blocks access)
```

### Test 3: Network Admin Privileges

1. Network admin user queries all sites
2. **Expected:** Network admin should see all data

```sql
-- As network_admin
SELECT COUNT(*) FROM protocols;
-- Expected: All protocols across all sites
```

---

## Findings (TO BE COMPLETED)

### Tables with RLS ✅

| Table | RLS Enabled | Policies | Site Isolation | Status |
|-------|-------------|----------|----------------|--------|
| _To be filled after audit_ | | | | |

### Tables Missing RLS ❌

| Table | Contains Sensitive Data | Risk Level | Recommended Action |
|-------|------------------------|------------|-------------------|
| _To be filled after audit_ | | | |

---

## Recommended Fixes (TO BE COMPLETED)

_Will be populated with SQL scripts to fix any RLS issues found_

---

## Next Steps

1. **Execute Audit Queries** - Run all queries in Supabase Dashboard
2. **Document Findings** - Update this report with results
3. **Create Fix Scripts** - Write SQL to fix any missing RLS policies
4. **Test Fixes** - Verify site isolation works correctly
5. **Report to LEAD** - Provide final audit status

---

**Status:** 🔍 AUDIT QUERIES READY - Awaiting execution in Supabase Dashboard

**Estimated Time to Complete:** 2-3 hours (including testing)
