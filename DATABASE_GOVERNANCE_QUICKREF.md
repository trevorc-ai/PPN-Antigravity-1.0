# 🚨 **CRITICAL: DATABASE GOVERNANCE ENFORCEMENT**

**Date:** 2026-02-10  
**Authority:** ChatGPT Expert Review + User Approval  
**Status:** ACTIVE AND ENFORCED

---

## **📋 QUICK REFERENCE**

**Full Governance Document:** `DATABASE_GOVERNANCE_RULES.md`  
**Verification Queries:** `migrations/VERIFICATION_QUERIES.sql`

---

## **🔴 NON-NEGOTIABLE RULES (MEMORIZE THESE)**

### **1. Public Schema Only**
- ✅ All tables in `public`
- ❌ Never touch `auth`, `storage`, `realtime`, `extensions`, `vault`

### **2. Additive-Only**
- ✅ Add tables, columns, indexes, views, constraints
- ❌ NO dropping, NO renaming, NO type changes

### **3. No PHI**
- ❌ No names, emails, phones, addresses, MRNs
- ❌ No free-text clinical narratives
- ✅ Only hashed patient identifiers

### **4. No Free-Text Answers**
- ❌ No TEXT columns in `log_*` tables for answers
- ✅ Only foreign keys, numerics, booleans

### **5. RLS Mandatory**
- ✅ Every patient-level table must have RLS enabled
- ✅ Site isolation via `user_sites`

### **6. Small-Cell Suppression**
- ✅ All benchmark views must enforce N ≥ 10

---

## **⚙️ REQUIRED WORKFLOW**

### **Before ANY Schema Change:**
1. ✅ Write migration script (idempotent, additive-only)
2. ✅ Include purpose, objects changed, confirmation
3. ✅ Get user approval
4. ✅ Run migration
5. ✅ Run verification queries
6. ✅ Document results

### **After EVERY Schema Change:**
Run `migrations/VERIFICATION_QUERIES.sql` and fix all ❌ FAIL results

---

## **🚫 WHAT I CANNOT DO**

- ❌ Make schema changes via Supabase Table Editor
- ❌ Drop tables or columns
- ❌ Rename columns
- ❌ Change column types
- ❌ Add TEXT columns for patient answers
- ❌ Skip verification queries
- ❌ Proceed without user approval

---

## **✅ WHAT I MUST DO**

- ✅ Always use SQL migrations
- ✅ Always make changes additive-only
- ✅ Always verify RLS is enabled
- ✅ Always use foreign keys instead of TEXT
- ✅ Always run verification queries
- ✅ Always get user approval first

---

## **📊 VERIFICATION CHECKLIST**

After every migration, verify:
- [ ] RLS enabled on all patient-level tables
- [ ] No TEXT columns for patient answers
- [ ] All foreign keys have ON DELETE actions
- [ ] All foreign keys are indexed
- [ ] All benchmark views have small-cell suppression
- [ ] All reference tables have proper structure
- [ ] All updated_at columns have triggers

---

## **🚨 IF I VIOLATE THESE RULES**

1. ⏸️ **STOP WORK IMMEDIATELY**
2. 🚨 **REPORT VIOLATION TO USER**
3. ⏳ **AWAIT EXPLICIT PERMISSION**

**NO EXCEPTIONS WITHOUT USER APPROVAL**

---

**This is my operating contract. I will not violate it.**

**Signed:** Antigravity AI Agent  
**Date:** 2026-02-10
