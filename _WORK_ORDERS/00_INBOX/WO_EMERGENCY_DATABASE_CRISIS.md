---
id: WO-EMERGENCY
status: 00_INBOX
priority: P0 (BLOCKING - APPLICATION COMPLETELY NON-FUNCTIONAL)
category: Database / Critical Bug
owner: PENDING_LEAD_ASSIGNMENT
failure_count: 0
created: 2026-02-15T17:15:00-08:00
requested_by: Trevor Calton
severity: CRITICAL - USER CANNOT USE APPLICATION FOR 24+ HOURS
---

# 🚨 EMERGENCY: Application Completely Non-Functional

## User Report

**Duration:** 24+ hours  
**Impact:** User cannot:
- Log in
- View any page except landing page
- See test data
- See visualizations
- Access any functionality

## Root Cause Analysis (SOOP + Browser Diagnostics)

### CRITICAL ERROR #1: Missing `subject_id` Column ❌

**Error:** `column log_clinical_records.subject_id does not exist` (PostgreSQL Error 42703)

**Evidence from Browser Console:**
```
[error] Error fetching protocols: {code: 42703, message: column log_clinical_records.subject_id does not exist}
```

**Impact:**
- **EVERY** query to `log_clinical_records` fails with 400 Bad Request
- "My Protocols" page shows "No protocols found"
- Dashboard visualizations cannot load
- All clinical data is inaccessible

**Root Cause:**
Frontend code expects `subject_id` column but database schema does not have it. This is likely due to:
1. Incomplete migration execution
2. Schema mismatch between migrations and deployed database
3. Recent table renaming that didn't update column names

---

### CRITICAL ERROR #2: No Authentication Session ❌

**Evidence from Browser:**
- `localStorage` is **completely empty**
- `sessionStorage` is **completely empty**
- Console logs: `No authenticated user found`
- Clicking "Access Portal" redirects to `#/login` page
- "User Practitioner" in header is a hardcoded fallback, not real auth

**Impact:**
- User cannot log in
- No Supabase session exists
- Cannot test any authenticated features
- Stuck on landing page

**Root Cause (from WO-049 Audit):**
Direct manipulation of `auth.users` table in migration files:
- `supabase/migrations/20260215_create_test_user.sql`
- `supabase/migrations/20260215_create_test_user_complete.sql`

**Specific Issues:**
1. Duplicate `email_confirmed_at` column in INSERT statement
2. Incorrect password hashing (using `crypt()` instead of Supabase's internal method)
3. Schema mismatch with actual Supabase Auth schema

---

### CONFIRMED: `substance_name` Column EXISTS ✅

**Status:** NOT AN ISSUE

The `ref_substances` table **DOES** have a `substance_name` column (migration 003, line 12):
```sql
CREATE TABLE IF NOT EXISTS public.ref_substances (
    substance_id BIGSERIAL PRIMARY KEY,
    substance_name TEXT NOT NULL UNIQUE,
    ...
);
```

Frontend code correctly queries `substance_name`. This is not causing the current failures.

---

## Immediate Action Required

### Phase 0: STOP THE BLEEDING (Execute NOW)

#### 1. Delete Dangerous Auth Migration Files

**Risk:** HIGH - These files are corrupting the auth system  
**Effort:** 30 seconds

```bash
# Delete the files that are breaking authentication
rm supabase/migrations/20260215_create_test_user.sql
rm supabase/migrations/20260215_create_test_user_complete.sql
```

#### 2. Identify Missing `subject_id` Column

**Need to determine:**
- Which migration was supposed to create `subject_id` column?
- Was the migration executed?
- Is there a schema mismatch?

**Action:**
```bash
# Search for subject_id in migrations
grep -r "subject_id" migrations/
```

#### 3. Create Test User via Supabase Dashboard (NOT SQL)

**Steps:**
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Email: `test@ppn.local`
4. Password: `TestPassword123!`
5. Check "Auto Confirm Email"
6. Save

---

## Questions for LEAD

1. **Which migration creates the `subject_id` column in `log_clinical_records`?**
2. **Have ALL migrations been executed on the database?**
3. **Should we run a full schema reset or incremental fix?**
4. **What is the correct test user creation strategy?**

---

## Acceptance Criteria

- [ ] User can log in successfully
- [ ] `log_clinical_records.subject_id` column exists
- [ ] "My Protocols" page displays data
- [ ] Dashboard visualizations load
- [ ] No console errors related to database schema
- [ ] Test data is visible

---

## References

- **Database Audit Report:** `brain/.../WO_049_Database_Audit_Report.md`
- **Browser Console Diagnostics:** Completed 2026-02-15T17:15:00-08:00
- **Logout Bug Ticket:** `WO-006_Fix_Logout_Button.md` (in USER_REVIEW)
- **Auth Migration Files:** `supabase/migrations/20260215_create_test_user*.sql`

---

**STATUS:** AWAITING LEAD TRIAGE AND EMERGENCY ROUTING

