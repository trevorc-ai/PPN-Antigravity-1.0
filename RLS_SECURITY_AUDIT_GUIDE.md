# RLS Security Audit - Quick Guide

## 🎯 Purpose
Comprehensive audit of Row Level Security (RLS) policies to ensure:
- All sensitive tables have RLS enabled
- No data leakage between sites/users
- Proper permission isolation
- Admin-only write access enforcement

## 📋 How to Run

**Step 1:** Open Supabase SQL Editor
- Go to your Supabase project
- Click "SQL Editor" → "New query"

**Step 2:** Copy & Execute
- Copy the entire contents of `migrations/RLS_SECURITY_AUDIT.sql`
- Paste into SQL Editor
- Click "Run"

**Step 3:** Review Results
The audit will check:
1. ❌ Tables WITHOUT RLS (critical security issue)
2. ⚠️  Tables WITH RLS but NO policies (blocks all access)
3. ✅ All existing RLS policies
4. Critical tables audit (`log_*`, `sites`, `user_sites`)
5. Reference tables (`ref_*`) RLS status
6. Overly permissive policies (security risk)
7. Public access policies
8. Summary report

## 🚨 What to Look For

### Critical Issues (Fix Immediately)
- **❌ Tables without RLS** - Any `log_*` table without RLS is a data leak
- **⚠️  Overly permissive policies** - `log_*` tables should NEVER have `USING (true)`
- **Public access on sensitive data** - Only `ref_*` tables should be public

### Expected Results
- ✅ All `log_*` tables: RLS enabled + site isolation policies
- ✅ All `ref_*` tables: RLS enabled + authenticated read-only
- ✅ `user_sites`: RLS enabled + user can only see own sites
- ✅ `sites`: RLS enabled (may have public read for dropdown population)

## 📊 Example Good Output

```
✅ log_clinical_records: RLS enabled, 2 policies
✅ log_outcomes: RLS enabled, 1 policy
✅ sites: RLS enabled, 1 policy
✅ user_sites: RLS enabled, 1 policy
✅ ref_substances: RLS enabled, 2 policies

=== RLS AUDIT SUMMARY ===
Total tables: 45
RLS enabled: 45 (100.0%)
RLS NOT enabled: 0 (0.0%)
RLS enabled but no policies: 0
✅ All tables have RLS enabled with policies
```

## 🔧 Common Issues & Fixes

### Issue: Table without RLS
```sql
-- Fix: Enable RLS
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- Add appropriate policy
CREATE POLICY "site_isolation" ON public.table_name
FOR SELECT USING (
  site_id IN (SELECT site_id FROM public.user_sites WHERE user_id = auth.uid())
);
```

### Issue: Overly Permissive Policy
```sql
-- Bad: Allows access to ALL rows
CREATE POLICY "bad_policy" ON public.log_clinical_records
FOR SELECT USING (true);

-- Good: Site isolation
CREATE POLICY "good_policy" ON public.log_clinical_records
FOR SELECT USING (
  site_id IN (SELECT site_id FROM public.user_sites WHERE user_id = auth.uid())
);
```

## ✅ Post-Audit Checklist

After running the audit:
- [ ] All critical tables have RLS enabled
- [ ] No overly permissive policies on `log_*` tables
- [ ] Site isolation working (users can't see other sites' data)
- [ ] Admin-only write access enforced
- [ ] Reference tables have read-only access for authenticated users

---

**Run this audit before launch to ensure database security!**
