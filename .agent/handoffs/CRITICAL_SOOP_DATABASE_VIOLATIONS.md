# 🚨 CRITICAL: SOOP DATABASE VIOLATIONS - IMMEDIATE ACTION REQUIRED

**Date:** 2026-02-15  
**Severity:** CRITICAL  
**Agent:** SOOP  
**Issue:** Repeated attempts to INSERT into `log_` tables instead of using `ref_` table data

---

## 🔴 THE PROBLEM

SOOP is **repeatedly confusing** the purpose of `log_` tables vs `ref_` tables:

### ❌ WRONG: What SOOP is doing
- Trying to INSERT test/seed data into `log_clinical_records`
- Trying to INSERT fake session data into `log_sessions`
- Trying to INSERT sample data into `log_protocols`
- Creating migrations that populate log tables with fake data

### ✅ CORRECT: What SOOP should do
- INSERT seed data ONLY into `ref_` tables (reference data)
- NEVER INSERT into `log_` tables (these are for real practitioner data only)
- Leave log tables EMPTY until real users create real data

---

## 📊 TABLE TAXONOMY (MUST MEMORIZE)

### `ref_` Tables (Reference/Lookup Data)
**Purpose:** Static reference data that all users share  
**Examples:** `ref_substances`, `ref_medications`, `ref_routes`, `ref_indications`  
**Seeding:** ✅ **YES** - Seed with real-world reference data  
**Who writes:** Migrations only (one-time setup)  
**Example data:**
```sql
-- ✅ CORRECT
INSERT INTO ref_substances (substance_name, default_dose_mg) VALUES
  ('Psilocybin', 25),
  ('Ketamine', 0.5),
  ('MDMA', 125);
```

### `log_` Tables (Clinical/Session Data)
**Purpose:** Real clinical data entered by practitioners during actual sessions  
**Examples:** `log_clinical_records`, `log_sessions`, `log_protocols`, `log_interventions`  
**Seeding:** ❌ **NEVER** - Must remain empty until real data  
**Who writes:** Application code only (user-generated)  
**Why empty is correct:** Empty visualizations are CORRECT until real practitioners enter real data

---

## 🚫 ABSOLUTE PROHIBITIONS FOR SOOP

### NEVER do these things:

1. **NEVER INSERT into `log_` tables in migrations**
   ```sql
   -- ❌ FORBIDDEN
   INSERT INTO log_clinical_records (...) VALUES (...);
   INSERT INTO log_sessions (...) VALUES (...);
   INSERT INTO log_protocols (...) VALUES (...);
   ```

2. **NEVER create "test data" migrations**
   - No `999_load_test_data.sql`
   - No `seed_sample_sessions.sql`
   - No "helpful" fake data to populate dashboards

3. **NEVER justify it with "but the charts are empty"**
   - Empty charts are CORRECT
   - Empty dashboards are EXPECTED
   - Real data comes from real practitioners

4. **NEVER create RPC functions that INSERT into log tables**
   - Functions can READ from log tables
   - Functions can NEVER WRITE to log tables
   - Only application code writes to log tables

---

## ✅ WHAT SOOP SHOULD DO INSTEAD

### When asked to "populate data" or "create test data":

1. **STOP** - Do not proceed
2. **CHALLENGE** - Ask: "Is this reference data or clinical data?"
3. **REDIRECT** - If clinical data, respond:
   > "I cannot create fake clinical data. Log tables must remain empty until real practitioners enter real data. If you need to test visualizations, use the application UI to create real test sessions."

### When creating migrations:

1. **Only INSERT into `ref_` tables**
2. **Only CREATE `log_` tables** (structure only, no data)
3. **Only CREATE RLS policies** on log tables
4. **NEVER seed log tables**

---

## 📋 CURRENT VIOLATIONS IN TRIAGE

Based on INSPECTOR analysis, these tickets are in TRIAGE due to log table violations:

1. **WO_009: Test Data Migration** - Attempted to INSERT into `log_protocols`
2. **WO_002: Shadow Market Schema** - May have attempted to seed log tables
3. **WO_017: Analytics Materialized Views** - References `log_clinical_records` incorrectly

---

## 🔧 ENFORCEMENT MECHANISM

### Before ANY database work, SOOP MUST:

1. **Read this document** - `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.agent/handoffs/CRITICAL_SOOP_DATABASE_VIOLATIONS.md`
2. **Read the policy** - `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.agent/workflows/database-integrity-policy.md`
3. **Ask the question:** "Am I about to INSERT into a `log_` table?"
   - If YES → STOP immediately
   - If NO → Proceed

### INSPECTOR will REJECT any migration that:
- Contains `INSERT INTO log_`
- Contains fake clinical data
- Attempts to "help" by populating log tables

---

## 🎯 THE GOLDEN RULE

> **Reference tables (`ref_*`):** ✅ Seed with real data  
> **Log tables (`log_*`):** ❌ NEVER seed with fake data

**WHY:** Log tables contain REAL CLINICAL DATA. Fake data:
- Corrupts analytics and research outcomes
- Violates regulatory compliance (HIPAA)
- Breaks practitioner trust
- Creates PHI compliance risks
- Pollutes the database with garbage data

---

## 📝 CORRECT MIGRATION TEMPLATE

```sql
-- ✅ CORRECT MIGRATION EXAMPLE

-- 1. Create reference table
CREATE TABLE ref_substances (
  id SERIAL PRIMARY KEY,
  substance_name TEXT NOT NULL,
  default_dose_mg NUMERIC
);

-- 2. Seed reference table (OK!)
INSERT INTO ref_substances (substance_name, default_dose_mg) VALUES
  ('Psilocybin', 25),
  ('Ketamine', 0.5);

-- 3. Create log table (structure only, NO DATA!)
CREATE TABLE log_clinical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  substance_id INTEGER REFERENCES ref_substances(id),
  dose_mg NUMERIC,
  session_date TIMESTAMPTZ
);

-- 4. Enable RLS
ALTER TABLE log_clinical_records ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policy
CREATE POLICY "Users can view own records"
  ON log_clinical_records FOR SELECT
  USING (auth.uid() = user_id);

-- ❌ DO NOT DO THIS:
-- INSERT INTO log_clinical_records (...) VALUES (...);  -- FORBIDDEN!
```

---

## 🚨 IMMEDIATE ACTIONS REQUIRED

### For SOOP:
1. **STOP all work** on tickets in TRIAGE
2. **READ this document** completely
3. **REVIEW all failed migrations** and identify violations
4. **REWRITE migrations** to remove ALL `INSERT INTO log_` statements
5. **RESUBMIT to INSPECTOR** for approval

### For LEAD:
1. **Review SOOP's work orders** in TRIAGE
2. **Rewrite architecture** to clarify ref vs log distinction
3. **Add explicit warnings** in work order templates

### For INSPECTOR:
1. **Reject ANY migration** with `INSERT INTO log_`
2. **Escalate to user** if pattern continues
3. **Create automated check** to scan for violations

---

## 📖 REQUIRED READING FOR SOOP

Before touching ANY database work:
1. This document (you're reading it)
2. `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.agent/workflows/database-integrity-policy.md`
3. `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/DATABASE_INTEGRITY_POLICY.md` (if exists)

---

## ✅ ACKNOWLEDGMENT REQUIRED

SOOP must acknowledge understanding by:
1. Reading this entire document
2. Identifying which TRIAGE tickets violated this rule
3. Proposing corrected migrations that comply

**Violations after this warning = immediate escalation to user**

---

**INSPECTOR:** This document created in response to repeated log table violations. Zero tolerance policy in effect.
