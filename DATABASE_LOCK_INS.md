# 🔒 PPN DATABASE LOCK-INS (NON-NEGOTIABLE)

**Date:** 2026-02-11  
**Authority:** Mandatory for all database work  
**Source:** ChatGPT database governance recommendations

---

## 🎯 THE THREE LOCK-INS

### **Lock-In #1: Add-Only Migrations in Supabase Branch Workflow**

**Rules:**
- ✅ All schema changes happen in Supabase preview branch first
- ✅ Every change captured as migration file and committed to Git
- ❌ No direct schema edits in production

**Add-Only Policy:**
- ✅ **ALLOWED:** Create tables, add columns, add constraints, add indexes, add views, add ref tables, add/update RLS policies
- ❌ **FORBIDDEN:** Drop tables/columns, rename columns, change column types, rewrite history

**Why:** Prevents accidental damage, enables rollback, makes Git the source of truth

---

### **Lock-In #2: Public Schema Only + Canonical Site Model**

**Schema Rule:**
- ✅ All product tables in `public` schema
- ❌ No custom tables in `auth`, `storage`, `realtime`, `extensions`, `vault`

**Canonical Tables:**
- `public.sites` - Site registry
- `public.user_sites` - User-to-site membership and role

**Hard Rule:**
- Every tenant-scoped table MUST have `site_id UUID REFERENCES public.sites(id)`
- All RLS enforcement uses `public.user_sites` as membership gate

**Why:** Eliminates "where does this belong" chaos, keeps RLS consistent

---

### **Lock-In #3: One Canonical Patient Identifier**

**Column Name:** `patient_link_code_hash`  
**Type:** `TEXT`  
**Format:** SHA256 hex (64 characters: `^[0-9a-f]{64}$`)

**Hard Rules:**
- ✅ Every patient-referenced log table uses `patient_link_code_hash`
- ❌ NEVER store raw `patient_link_code` in any table (even demo/test)
- ✅ Use check constraint to enforce format

**Constraint Example:**
```sql
ALTER TABLE public.log_clinical_records
ADD CONSTRAINT patient_hash_format 
CHECK (patient_link_code_hash ~ '^[0-9a-f]{64}$');
```

**Why:** Prevents identity drift, enables reliable joins, guarantees PHI safety

---

## 📋 STRICT CONSTRAINTS FOR ANTIGRAVITY

**Use these as global rules for every schema change request:**

1. ✅ Work only in `public` schema for product tables
2. ✅ Use Supabase branch for all schema work, never edit production directly
3. ✅ Produce migrations via CLI workflow
4. ✅ Add-only changes (no drops, renames, type changes)
5. ✅ No free-text user inputs:
   - No `TEXT` columns for user-entered narrative
   - All selectable values from `ref_*` tables
   - If free-text exists, stop writing to it, add controlled replacement
6. ✅ Patient identity rule:
   - Only `patient_link_code_hash` in logs
   - SHA256 hex format enforced by check constraint
7. ✅ Tenant isolation rule:
   - Any row with `site_id` protected by RLS via `public.user_sites`
8. ✅ Analytics rule:
   - Cross-site analytics use small-cell suppression (N ≥ 10)
9. ✅ Every migration must include:
   - Purpose comment at top
   - Forward-only change
   - Indexes for common filters (`site_id`, timestamps, event types)

---

## 🔧 SUPABASE BRANCH WORKFLOW

### Create Branch
```bash
supabase branches create preview-feature-name
```

### Work in Branch
```bash
supabase link --project-ref <project-id> --branch preview-feature-name
supabase migration new add_feature_xyz
# Edit migration file
supabase db reset  # Test locally
```

### Merge to Production
```bash
# After testing and verification
supabase branches merge preview-feature-name
```

---

## 🧪 TEST DATA STRATEGY

**Add Explicit Test Data Marker:**
```sql
-- Add to all tables
is_demo BOOLEAN DEFAULT FALSE

-- Or use enum
data_origin TEXT CHECK (data_origin IN ('demo', 'pilot', 'prod')) DEFAULT 'prod'
```

**Why:** Enables one-statement cleanup without relying on prefixes

**Cleanup:**
```sql
DELETE FROM public.log_clinical_records WHERE is_demo = TRUE;
```

---

## ✅ ENFORCEMENT

**This document is NON-NEGOTIABLE.**

Any schema change that violates these lock-ins must:
1. Stop immediately
2. Report violation to user
3. Await explicit permission before proceeding

**No exceptions without explicit user approval.**

---

**END OF LOCK-INS**

**Signed:** Antigravity AI Agent (Senior SQL Database Architect)  
**Date:** 2026-02-11  
**Status:** ACTIVE AND ENFORCED
