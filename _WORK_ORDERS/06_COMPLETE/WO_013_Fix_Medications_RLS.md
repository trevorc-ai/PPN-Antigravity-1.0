---
work_order_id: WO_013
title: Fix ref_medications RLS Policies
type: BUG
category: Bug
priority: HIGH
status: COMPLETE
created: 2026-02-14T22:00:33-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T22:41:56-08:00
completed_by: SOOP
completed_at: 2026-02-14T22:44:00-08:00
requested_by: Trevor Calton
assigned_to: SOOP
estimated_complexity: 3/10
failure_count: 0
---

# Work Order: Fix ref_medications RLS Policies

## 🎯 THE GOAL

Resolve the "404 Not Found" error for `ref_medications`.

### PRE-FLIGHT CHECK

1. Check existing RLS policies on `ref_medications` in Supabase
2. If a policy exists but is broken, ALTER it. If none exists, CREATE it
3. STOP if the table is already readable (curl check)

### Directives

1. Ensure the `is_common` column is accessible to authenticated users
2. Verify the RLS policy allows SELECT

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- Supabase SQL Editor / RLS Policies
- `ref_medications` table settings

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Delete any data
- Duplicate policies (check names first)
- Modify table structure
- Touch any other tables

**MUST:**
- Verify existing policies before creating new ones
- Test accessibility after changes

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Check if RLS is enabled on `ref_medications`
- [ ] List existing policies on `ref_medications`
- [ ] Test table accessibility with curl or SQL query
- [ ] Document current state before changes

### RLS Policy Fix
- [ ] RLS policy allows SELECT for authenticated users
- [ ] `is_common` column is accessible
- [ ] No duplicate policies created
- [ ] Policy follows least privilege principle (read-only)

### Verification
- [ ] Table returns data (no 404 error)
- [ ] Authenticated users can read `ref_medications`
- [ ] `is_common` column is queryable
- [ ] No data was deleted or modified

---

## 🧪 Testing Requirements

- [ ] Test SELECT query as authenticated user
- [ ] Verify `is_common` column is accessible
- [ ] Confirm 404 error is resolved
- [ ] Test from frontend application

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
N/A (Database task)

### SECURITY
- **Least Privilege:** Read-Only for users
- No write access granted
- RLS enforced on all queries

---

## 🚦 Status

**INBOX** - Ready for SOOP assignment

---

## 📋 Technical Notes

### Check Existing Policies
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'ref_medications';

-- List existing policies
SELECT * FROM pg_policies 
WHERE tablename = 'ref_medications';
```

### Test Accessibility
```sql
-- Test as authenticated user
SELECT id, name, is_common 
FROM ref_medications 
LIMIT 5;
```

### Create/Fix Policy
```sql
-- If no policy exists, create one
CREATE POLICY "Allow authenticated users to read medications"
ON ref_medications
FOR SELECT
TO authenticated
USING (true);

-- If policy exists but is broken, alter it
ALTER POLICY "existing_policy_name"
ON ref_medications
USING (true);
```

### Enable RLS (if not enabled)
```sql
ALTER TABLE ref_medications ENABLE ROW LEVEL SECURITY;
```

---

## 📋 Common Issues

1. **RLS enabled but no SELECT policy** - Users get 404/empty results
2. **Policy exists but has restrictive USING clause** - Some rows hidden
3. **RLS not enabled** - Table accessible but inconsistent with other tables

---

## Dependencies

None - This is a standalone database fix.
