# 🚀 **DATABASE MIGRATION INSTRUCTIONS**

**Created By:** BUILDER (Antigravity)  
**Date:** 2026-02-10 13:28 PM  
**Priority:** 🔴 **CRITICAL - RUN THESE NOW**  
**Estimated Time:** 5 minutes

---

## 📋 **WHAT I'VE CREATED**

I've created **2 new migration files** for the critical database integrations:

1. **`migrations/008_create_system_events_table.sql`**  
   - Creates `system_events` table for Audit Logs
   - Adds RLS policies for site isolation
   - Adds indexes for performance
   - Seeds initial test data

2. **`migrations/009_create_knowledge_graph_table.sql`**  
   - Creates `ref_knowledge_graph` table for Interaction Checker
   - Adds RLS policies for read access
   - Adds indexes for performance
   - Seeds 10 drug interactions from hardcoded data

---

## 🎯 **WHAT YOU NEED TO DO**

### **Step 1: Open Supabase SQL Editor**

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

---

### **Step 2: Run Migration 008 (System Events)**

1. Open the file: `migrations/008_create_system_events_table.sql`
2. Copy the **entire contents** of the file
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Cmd+Enter)
5. ✅ Verify you see: **Success. No rows returned**

**Expected Result:**
- Table `system_events` created
- 4 RLS policies created
- 4 indexes created
- 1 test event inserted

---

### **Step 3: Run Migration 009 (Knowledge Graph)**

1. Open the file: `migrations/009_create_knowledge_graph_table.sql`
2. Copy the **entire contents** of the file
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Cmd+Enter)
5. ✅ Verify you see: **Success. No rows returned**

**Expected Result:**
- Table `ref_knowledge_graph` created
- 2 RLS policies created
- 4 indexes created
- 1 trigger created
- 10 interaction rules inserted

---

### **Step 4: Verify Tables Were Created**

Run this query in Supabase SQL Editor:

```sql
-- Check system_events table
SELECT 
  event_id,
  event_type,
  event_status,
  created_at
FROM public.system_events
ORDER BY created_at DESC
LIMIT 5;

-- Check ref_knowledge_graph table
SELECT 
  interaction_id,
  substance_name,
  interactor_name,
  risk_level,
  severity_grade
FROM public.ref_knowledge_graph
ORDER BY risk_level DESC
LIMIT 10;
```

**Expected Results:**
- `system_events`: Should show 1 test event
- `ref_knowledge_graph`: Should show 10 interaction rules

---

## ⚠️ **TROUBLESHOOTING**

### **Error: "relation already exists"**
**Cause:** Table already exists  
**Fix:** Skip this migration or drop the table first:
```sql
DROP TABLE IF EXISTS public.system_events CASCADE;
DROP TABLE IF EXISTS public.ref_knowledge_graph CASCADE;
```
Then re-run the migration.

---

### **Error: "permission denied"**
**Cause:** Not enough permissions  
**Fix:** Make sure you're logged in as the project owner/admin

---

### **Error: "foreign key constraint"**
**Cause:** Referenced table doesn't exist  
**Fix:** Make sure these tables exist first:
- `public.sites`
- `public.user_sites`
- `public.ref_substances`

Run this to check:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('sites', 'user_sites', 'ref_substances');
```

---

## ✅ **SUCCESS CRITERIA**

After running both migrations, verify:

- [ ] ✅ `system_events` table exists
- [ ] ✅ `ref_knowledge_graph` table exists
- [ ] ✅ At least 1 event in `system_events`
- [ ] ✅ At least 10 interactions in `ref_knowledge_graph`
- [ ] ✅ No errors in Supabase SQL Editor

---

## 🔄 **NEXT STEPS (AFTER MIGRATIONS)**

Once you've successfully run both migrations, **let me know** and I'll proceed with:

1. **Update AuditLogs.tsx** to fetch from `system_events`
2. **Update InteractionChecker.tsx** to fetch from `ref_knowledge_graph`
3. **Test both pages** to verify database connectivity
4. **Remove hardcoded data** imports

---

## 📞 **NEED HELP?**

If you encounter any issues:

1. Copy the error message
2. Tell me which migration failed
3. I'll help you troubleshoot

---

**Status:** ⏸️ **WAITING FOR YOU TO RUN MIGRATIONS**  
**Next:** After migrations are complete, I'll update the frontend code

---

**End of Migration Instructions**
