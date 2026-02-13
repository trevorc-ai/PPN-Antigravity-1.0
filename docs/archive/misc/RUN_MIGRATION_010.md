# 🚀 **RUN MIGRATION 010 - CRITICAL FIXES**

**Date:** 2026-02-10 14:00 PM  
**Priority:** 🔴 **CRITICAL**  
**File:** `migrations/010_fix_critical_database_issues.sql`

---

## 📋 **WHAT THIS MIGRATION DOES**

### **Fixes 5 Critical Issues:**

1. ✅ **Fixes `system_events.site_id` type** (BIGINT → UUID)
2. ✅ **Recreates `ref_knowledge_graph`** with proper foreign keys (no text duplication)
3. ✅ **Adds medications to `ref_substances`** (SSRIs, Lithium, Benzodiazepines, etc.)
4. ✅ **Seeds 9 drug interactions** using proper foreign key references
5. ✅ **Adds `updated_at` triggers** to all reference tables

---

## 🎯 **HOW TO RUN**

### **Step 1: Open Supabase SQL Editor**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in sidebar
4. Click **New Query**

### **Step 2: Copy Migration File**
1. In VS Code, open: `migrations/010_fix_critical_database_issues.sql`
2. Select ALL (Cmd+A)
3. Copy (Cmd+C)

### **Step 3: Run Migration**
1. Paste into Supabase SQL Editor (Cmd+V)
2. Click **Run** (or Cmd+Enter)
3. Wait 5-10 seconds

---

## ✅ **EXPECTED RESULTS**

You should see at the end:
```
✅ Migration 010: Critical Database Issues Fixed Successfully
   - system_events.site_id type changed to UUID
   - ref_knowledge_graph recreated with proper foreign keys
   - 9 drug interactions seeded
   - updated_at triggers added to all reference tables
   - Schema documentation added
```

**Plus 4 verification tables showing:**
1. `system_events.site_id` is now `uuid` type
2. `ref_knowledge_graph` columns with proper foreign keys
3. 9 interactions with substance names, risk levels, severity
4. List of triggers on all reference tables

---

## 🔍 **VERIFICATION QUERIES**

After running, verify with these queries:

### **Check Interactions:**
```sql
SELECT 
  s1.substance_name as substance,
  s2.substance_name as interactor,
  kg.risk_level,
  sg.grade_label as severity
FROM public.ref_knowledge_graph kg
JOIN public.ref_substances s1 ON kg.substance_id = s1.substance_id
JOIN public.ref_substances s2 ON kg.interactor_substance_id = s2.substance_id
JOIN public.ref_severity_grade sg ON kg.severity_grade_id = sg.severity_grade_id
ORDER BY kg.risk_level DESC;
```

**Expected:** 9 rows showing interactions like:
- Psilocybin + Lithium (Risk 10, Grade 4 - Life Threatening)
- MDMA + MAOIs (Risk 10, Grade 4 - Life Threatening)
- etc.

---

## ⚠️ **IMPORTANT NOTES**

### **This migration will:**
- ✅ Drop and recreate `ref_knowledge_graph` (old structure was wrong)
- ✅ Add 7 new substances to `ref_substances` (medications)
- ✅ Fix `system_events` to properly reference `sites` table

### **This migration will NOT:**
- ❌ Delete any clinical data (`log_clinical_records` untouched)
- ❌ Delete any reference data (only adds to `ref_substances`)
- ❌ Break any existing functionality

---

## 🚨 **IF ERRORS OCCUR**

### **Error: "relation already exists"**
**Cause:** Migration already run  
**Fix:** Skip to verification queries

### **Error: "foreign key violation"**
**Cause:** `sites` table doesn't exist or has no records  
**Fix:** Tell me, we'll create a site first

### **Error: "permission denied"**
**Cause:** Not logged in as admin  
**Fix:** Verify you're logged in as project owner

---

## 📊 **AFTER MIGRATION**

Once successful, we can proceed with:
1. ✅ Update `AuditLogs.tsx` to use `system_events` table
2. ✅ Update `InteractionChecker.tsx` to use `ref_knowledge_graph` table
3. ✅ Test both pages
4. ✅ Remove hardcoded data from `constants.ts`

---

**Status:** ⏸️ **READY TO RUN**  
**Action:** Copy migration file and paste into Supabase SQL Editor

---

**Let me know when you've run it and I'll proceed with the frontend integration!**
