# Supabase Migration Execution Checklist
**Date:** 2026-02-09  
**Migration:** 003_protocolbuilder_reference_tables.sql  
**Status:** READY TO EXECUTE

---

## ✅ PRE-FLIGHT CHECKLIST

### Step 1: Access Supabase
- [ ] Open browser to: https://supabase.com/dashboard
- [ ] Sign in with your credentials
- [ ] Navigate to your project: `rxwsthatjhnixqsthegf`
- [ ] Click **SQL Editor** in the left sidebar

### Step 2: Verify Current State
Run this query first to see what tables already exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'ref_%'
ORDER BY table_name;
```

**Expected Result:** You should see some existing ref_* tables (like ref_flow_event_types, ref_pharmacology, etc.)

---

## 🚀 MIGRATION EXECUTION

### Step 3: Run Migration 003

1. In Supabase SQL Editor, click **New Query**
2. Copy the **ENTIRE contents** of: `migrations/003_protocolbuilder_reference_tables.sql`
3. Paste into the SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. Wait for completion (should take 5-10 seconds)

**Expected Success Message:**
```
✅ Migration 003: ProtocolBuilder Reference Tables completed successfully
```

**Expected Row Counts:**
```
ref_substances: 8 rows
ref_routes: 9 rows
ref_support_modality: 5 rows
ref_smoking_status: 4 rows
ref_severity_grade: 5 rows
ref_safety_events: 13 rows
ref_resolution_status: 3 rows
ref_indications: 9 rows
```

---

## ✅ POST-MIGRATION VERIFICATION

### Step 4: Verify Tables Were Created

```sql
-- Check all new tables exist
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'ref_substances',
    'ref_routes',
    'ref_support_modality',
    'ref_smoking_status',
    'ref_severity_grade',
    'ref_safety_events',
    'ref_resolution_status',
    'ref_indications'
)
ORDER BY table_name;
```

**Expected:** 8 tables, each with 4-6 columns

### Step 5: Verify RLS Is Enabled

```sql
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'ref_%'
ORDER BY tablename;
```

**Expected:** All tables should have `rls_enabled = true`

### Step 6: Verify Seed Data

```sql
-- Count rows in each table
SELECT 'ref_substances' as table_name, COUNT(*) as row_count FROM public.ref_substances
UNION ALL SELECT 'ref_routes', COUNT(*) FROM public.ref_routes
UNION ALL SELECT 'ref_support_modality', COUNT(*) FROM public.ref_support_modality
UNION ALL SELECT 'ref_smoking_status', COUNT(*) FROM public.ref_smoking_status
UNION ALL SELECT 'ref_severity_grade', COUNT(*) FROM public.ref_severity_grade
UNION ALL SELECT 'ref_safety_events', COUNT(*) FROM public.ref_safety_events
UNION ALL SELECT 'ref_resolution_status', COUNT(*) FROM public.ref_resolution_status
UNION ALL SELECT 'ref_indications', COUNT(*) FROM public.ref_indications
ORDER BY table_name;
```

**Expected Results:**
- ref_indications: 9 rows
- ref_resolution_status: 3 rows
- ref_routes: 9 rows
- ref_safety_events: 13 rows
- ref_severity_grade: 5 rows
- ref_smoking_status: 4 rows
- ref_substances: 8 rows
- ref_support_modality: 5 rows

### Step 7: Test a Sample Query

```sql
-- Test fetching substances (what ProtocolBuilder will do)
SELECT substance_id, substance_name, substance_class
FROM public.ref_substances
WHERE is_active = true
ORDER BY substance_name;
```

**Expected:** Should return 8 substances (Psilocybin, MDMA, Ketamine, etc.)

### Step 8: Verify RLS Policies

```sql
-- Check policies exist
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename LIKE 'ref_%'
ORDER BY tablename, policyname;
```

**Expected:** Each table should have 2 policies:
- `[table]_read` - Allow authenticated users to read
- `[table]_write` - Allow network_admin to write

---

## 🐛 TROUBLESHOOTING

### Error: "relation already exists"
**Solution:** Tables already created. Safe to ignore or run:
```sql
DROP TABLE IF EXISTS public.ref_substances CASCADE;
-- (repeat for each table)
```
Then re-run migration.

### Error: "permission denied"
**Solution:** Make sure you're signed in as the project owner in Supabase.

### Error: "policy already exists"
**Solution:** Policies already created. Safe to ignore or drop and recreate:
```sql
DROP POLICY IF EXISTS "ref_substances_read" ON public.ref_substances;
```

### No rows returned from verification queries
**Solution:** Check if migration actually ran. Look for error messages in SQL Editor output.

---

## ✅ COMPLETION CHECKLIST

- [ ] Migration 003 executed successfully
- [ ] All 8 tables created
- [ ] RLS enabled on all tables
- [ ] Seed data loaded (56 total rows across 8 tables)
- [ ] Sample query returns data
- [ ] RLS policies created (16 total policies)

---

## 📋 NEXT STEPS AFTER MIGRATION

Once migration is complete:
1. ✅ Mark this checklist as complete
2. ✅ Proceed to Designer instructions
3. ✅ Designer will update ProtocolBuilder.tsx to use these tables
4. ✅ Builder will wire the new fields to Supabase

---

**STATUS:** Ready to execute  
**Estimated Time:** 10 minutes  
**Risk Level:** LOW (all tables use IF NOT EXISTS, safe to re-run)
