---
work_order_id: WO_042
title: Database Security Verification - PHI & RLS Audit
type: AUDIT
category: Security
priority: CRITICAL
status: INSPECTOR_REVIEW
created: 2026-02-15T02:02:30-08:00
requested_by: INSPECTOR
assigned_to: SOOP
assigned_date: 2026-02-15T05:44:00-08:00
estimated_complexity: 6/10
failure_count: 0
---

# Work Order: Database Security Verification - PHI & RLS Audit

## 🎯 THE GOAL

Verify that all database validation controls and RLS policies are correctly implemented to prevent PHI exposure and cross-user data access.

## 🔍 AUDIT SCOPE

### 1. PHI Anonymization Verification

**Verify all identifiers are anonymized:**
```sql
-- 1. Verify subject_id is UUID (not patient name)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sessions' 
AND column_name = 'subject_id';
-- Expected: uuid

-- 2. Verify NO PHI columns exist
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE column_name IN (
  'patient_name', 'dob', 'ssn', 'mrn', 
  'email', 'phone', 'address', 'zip'
);
-- Expected: 0 rows (or only in user_profiles for practitioners)

-- 3. Verify NO free-text fields in patient tables
SELECT table_name, column_name, data_type
FROM information_schema.columns 
WHERE table_name IN ('sessions', 'log_sessions', 'protocols')
AND data_type = 'text';
-- Review each: should be controlled values or foreign keys only
```

### 2. RLS Policy Verification

**Verify RLS is enabled on all critical tables:**
```sql
-- 1. Check RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'sessions', 'log_sessions', 'protocols', 
  'user_profiles', 'user_sites', 'substances'
);
-- Expected: rowsecurity = true for all

-- 2. List all RLS policies
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
-- Document all policies

-- 3. Verify policies filter by user_id or site_id
-- Review qual column for each policy
```

### 3. RLS Testing (Use RLS_Verification_Script.md)

**Run all 4 test scenarios:**
- [ ] Test 1: User Isolation (User A cannot see User B's data)
- [ ] Test 2: Site Isolation (User sees only authorized site data)
- [ ] Test 3: Unauthenticated Access (Anonymous users see nothing)
- [ ] Test 4: RPC Function Security (SECURITY DEFINER functions enforce RLS)

### 4. Validation Controls Verification

**For WO_022 (Contraindication Safety Engine):**
- [ ] Verify `drug_interactions` table uses substance IDs (not free text)
- [ ] Verify medication inputs are FK references to `ref_medications`
- [ ] Verify NO free-text fields in interaction checker

**For all reference tables:**
- [ ] Verify all `ref_*` tables have controlled values
- [ ] Verify foreign key constraints exist
- [ ] Verify NO free-text inputs bypass reference tables

---

## 📝 DELIVERABLES

### 1. Database Security Audit Report
**Include:**
- PHI anonymization verification results
- RLS policy documentation
- RLS test results (all 4 scenarios)
- Validation control verification
- Any violations found
- Recommended fixes

### 2. RLS Test Results
**For each test scenario, document:**
- Test query executed
- Expected result
- Actual result
- PASS/FAIL status

### 3. INSPECTOR Sign-Off
**SOOP must provide:**
- Completed audit report
- Test results
- Confirmation that all identifiers are anonymized
- Confirmation that RLS prevents cross-user access

---

## ✅ ACCEPTANCE CRITERIA

- [ ] All PHI anonymization checks completed
- [ ] All RLS policies documented
- [ ] All 4 RLS test scenarios executed and passed
- [ ] All validation controls verified
- [ ] Audit report created
- [ ] INSPECTOR reviews and approves

---

## 📝 MANDATORY COMPLIANCE

### SECURITY
- **NO PHI/PII in database** (except anonymized identifiers)
- **RLS must be enabled** on all patient/session tables
- **All policies must filter** by user_id or site_id
- **No free-text fields** that could contain PHI

---

## 🚦 Status

**INBOX** - Awaiting formal submission and LEAD routing

---

## 📋 Reference Documents

**INSPECTOR has created:**
- `PHI_Validation_Checklist.md` - Use for PHI verification
- `RLS_Verification_Script.md` - Use for RLS testing
- `Security_Review_SLA.md` - SECURITY DEFINER requirements

---

## Dependencies

**Blocks:**
- WO_020 (Smart Search RPC) - Cannot deploy until RLS verified
- WO_022 (Contraindication Engine) - Needs validation control verification
- All Shadow Market features - Need RLS confirmation

**Critical:** This audit must be completed before ANY database-related features deploy to production.
