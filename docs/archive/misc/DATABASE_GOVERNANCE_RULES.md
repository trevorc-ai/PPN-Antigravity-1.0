# 🔐 **PPN DATABASE GOVERNANCE RULES v2.0**

**Effective Date:** 2026-02-11  
**Authority:** Non-negotiable global rules  
**Applies To:** All agents (INVESTIGATOR, BUILDER, DESIGNER, Antigravity)

---

## 🎯 **SENIOR SQL DATABASE ARCHITECT ROLE**

**Mission:** Responsible for structural integrity, performance, and security of all data. Design Third Normal Form (3NF) database schemas that are efficient and scalable. **Data loss is unacceptable.**

**Scope of Work:**
- ✅ **OWNS:** `/migrations` folder, all `.sql` files, migration scripts, schema documentation
- ❌ **IGNORES:** Frontend code (React/HTML), CSS styling, API route logic (unless optimizing embedded SQL queries)

**Workflow:**
1. **Model:** Create `db_plan.md` artifact with tables, relationships, indexes
2. **Safety Check:** Review against governance rules (no `DROP TABLE` without permission, use `snake_case`)
3. **Execute:** Write idempotent migration script, test in dev environment
4. **Document:** Update schema documentation and README

**Tools:**
- Use `EXPLAIN ANALYZE` to prove queries are fast
- Run verification queries after every schema change
- Test RLS policies for each role

---

## 1️⃣ **NON-NEGOTIABLE GLOBAL RULES**

### **Rule 1: Public Schema Only**
- ✅ **ALLOWED:** All application tables go in `public` schema
- ❌ **FORBIDDEN:** Creating or modifying tables in `auth`, `storage`, `realtime`, `extensions`, or `vault`
- ✅ **ALLOWED:** Reference `auth.users` via FK and `auth.uid()` in RLS

**Why:** Prevents damage to Supabase-managed internals, keeps schema portable and auditable.

---

### **Rule 2: Additive-Only Schema Changes**
- ❌ **FORBIDDEN:**
  - Dropping tables
  - Dropping columns
  - Renaming columns
  - Changing column types in place
  - Truncating production tables

- ✅ **ALLOWED:**
  - Create new tables and views
  - Add columns
  - Add constraints
  - Add indexes
  - Add reference rows in `ref_*` tables
  - Add new RLS policies
  - Replace existing policies (drop and recreate)

**Why:** Additive-only avoids irreversible mistakes and allows gradual migration with minimal downtime.

---

### **Rule 3: No PHI, Ever**
- ❌ **FORBIDDEN:**
  - Direct identifiers (name, email, phone, address, MRN, chart number)
  - Precise dates tied to a person
  - Raw patient identifiers
  - Free-text clinical narratives
  - File uploads that could contain PHI

- ✅ **REQUIRED:**
  - Patient linking via hash only (`patient_link_code_hash`)
  - Never store raw identifiers

**Why:** Product credibility depends on truthfully saying "We never collect PHI."

---

### **Rule 4: No Free-Text Answers (HARD RULE)**

**Applies To:**
- All patient-level `log_*` tables
- All assessment response tables

**Requirement:**
No "answer" fields can be TEXT. Answers must be:
- Foreign keys to `ref_*` tables, OR
- Numeric values with constraints, OR
- Booleans, OR
- Controlled codes validated against a reference set

**Allowed Text Fields (Whitelist):**
- `ref_*` display fields (labels, definitions)
- `protocols.name` and protocol metadata (clinician-authored, not patient-authored)
- Any other text field must be **explicitly approved and documented** as non-answer, non-patient-level

**Why:** Free text is where PHI leaks happen. Controlled values enable benchmarking.

---

### **Rule 5: Every Answer Must Be Controlled**

Every clinical input must be:
- A foreign key to a `ref_*` table, OR
- A numeric value with strict units, OR
- A boolean, OR
- A date/time bucket (not raw date tied to identity)

**Why:** Controlled values prevent PHI leakage, enable benchmarking, stop schema drift.

---

### **Rule 6: RLS is Mandatory**

**Requirement:**
- Every patient-level table must have RLS enabled
- Site isolation enforced via `public.user_sites`
- Allowed roles: `network_admin`, `site_admin`, `clinician`, `analyst`, `auditor`
- Views must respect RLS (no "security definer" shortcuts unless explicitly approved)

**Why:** Without strict RLS, a single mistake becomes a data breach.

---

### **Rule 7: Small-Cell Suppression**

**Requirement:**
- Any cross-site or network-level reporting view must enforce small-cell suppression (default N ≥ 10)
- Do not output raw patient-level rows in benchmarking views
- Any "benchmark" view must be aggregations only

**Why:** Blocks re-identification through rare combinations, even without PHI.

---

## 2️⃣ **REQUIRED WORKFLOW**

### **Step 1: Freeze Changes Until Baseline Captured**
- ❌ **CRITICAL:** No further schema edits until canonical "current state" snapshot is captured
- ✅ **REQUIRED:** Capture schema-only baseline (public schema objects at minimum)
- ✅ **REQUIRED:** Run verification queries and store outputs as "baseline checks"

**How to Capture Baseline:**
```sql
-- Export current schema structure
pg_dump --schema-only --schema=public -h <host> -U <user> <database> > baseline_schema.sql

-- Or via Supabase CLI
supabase db dump --schema public > migrations/baseline_schema.sql
```

**Why:** Establishes known-good state before any changes, enables rollback if needed.

### **Step 2: Everything Changes Through SQL Migrations**
- ❌ **FORBIDDEN:** Table Editor "quick fixes" in production
- ✅ **REQUIRED:** Every change is a migration script that is:
  - **Idempotent** (safe to run twice without failing)
  - **Additive-only** (no destructive operations)
  - **Reviewed** against governance rules

**Idempotent SQL Patterns:**
```sql
-- ✅ GOOD - Safe to run multiple times
CREATE TABLE IF NOT EXISTS public.ref_new_table (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Add column only if it doesn't exist (PostgreSQL 9.6+)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'log_clinical_records' 
    AND column_name = 'new_field'
  ) THEN
    ALTER TABLE public.log_clinical_records ADD COLUMN new_field BIGINT;
  END IF;
END $$;

-- Create index only if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_clinical_records_substance 
ON public.log_clinical_records(substance_id);

-- ❌ BAD - Will fail on second run
CREATE TABLE public.ref_new_table (
  id BIGSERIAL PRIMARY KEY
);

ALTER TABLE public.log_clinical_records ADD COLUMN new_field BIGINT;
```

**Why:** Idempotent migrations prevent partial deploy breakage and make environments reproducible.

### **Step 3: Every Migration Includes These Sections**
1. **Purpose and user value** (1 paragraph explaining why this change matters)
2. **Objects changed** (tables, columns, indexes, constraints, views, policies)
3. **Confirmation:** "Additive-only, no destructive operations"
4. **Rollback plan** (even if it's "restore from backup/PITR" or "create compensating migration")
5. **Verification queries** (see Section 3 below)

**Peer Review Checklist (Must Pass Before Running SQL):**
- [ ] No destructive statements (`DROP TABLE`, `DROP COLUMN`, type changes, renames)
- [ ] RLS enabled + policies created/updated for any new patient-level table
- [ ] Constraints and foreign keys added where appropriate
- [ ] Indexes added for actual query patterns (not random indexing)
- [ ] Views comply with small-cell suppression (N≥10)
- [ ] No free-text patient answers introduced
- [ ] All SQL is idempotent (safe to run twice)
- [ ] Migration follows naming convention: `XXX_descriptive_name.sql`

### **Step 4: Post-Change Verification is Mandatory**
- Migrations are not "done" until verification queries pass

---

## 3️⃣ **VERIFICATION QUERIES (Run After Every Schema Change)**

### **Query 1: Confirm RLS Enabled on All Patient-Level Tables**
```sql
SELECT
  n.nspname AS schema_name,
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND (
    c.relname LIKE 'log_%'
    OR c.relname IN ('protocols','sites','user_sites','system_events')
  )
ORDER BY table_name;
```

**Expected Result:** All `log_*` tables show `rls_enabled = true`

**How to Interpret:**
- ✅ **PASS:** All patient-level tables show `true`
- ❌ **FAIL:** Any `log_*` table shows `false` → Must enable RLS immediately
- ⚠️ **WARNING:** New tables not in list → Add to query and verify

---

### **Query 2: Find Prohibited Text "Answer Fields" in Patient-Level Logs**
```sql
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name LIKE 'log_%'
  AND data_type IN ('text', 'character varying')
ORDER BY table_name, ordinal_position;
```

**How to Interpret:**
- ⚠️ **REVIEW REQUIRED:** Some text columns might be acceptable if they are NOT "answers"
  - Example: Internal codes that are validated (acceptable)
  - Example: Patient answer choices stored as text (NOT acceptable)
- ❌ **ACTION REQUIRED:** If a text column represents an answer choice:
  1. Add foreign key column to appropriate `ref_*` table
  2. Backfill data
  3. Update application to use new column
  4. **Do NOT delete old column** (additive-only rule)

**Conversion Plan Template:**
```sql
-- Step 1: Add new FK column
ALTER TABLE public.log_clinical_records 
ADD COLUMN IF NOT EXISTS substance_id BIGINT REFERENCES ref_substances(substance_id);

-- Step 2: Backfill (example)
UPDATE public.log_clinical_records
SET substance_id = (
  SELECT substance_id FROM ref_substances 
  WHERE substance_name = log_clinical_records.old_substance_text_field
)
WHERE substance_id IS NULL;

-- Step 3: Add NOT NULL constraint after backfill verified
ALTER TABLE public.log_clinical_records 
ALTER COLUMN substance_id SET NOT NULL;

-- Step 4: Update app to use substance_id (frontend change)
-- Step 5: Leave old_substance_text_field in place (do NOT drop)
```

---

### **Query 3: Confirm Small-Cell Suppression in Benchmark Views**
```sql
SELECT
  table_schema,
  table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name LIKE 'v_%'
ORDER BY table_name;
```

**Action Required:** For each view returned, manually inspect SQL definition to confirm N-threshold filtering exists:

```sql
-- Example: Check view definition
SELECT pg_get_viewdef('public.v_benchmark_outcomes', true);
```

**Expected Pattern in View:**
```sql
-- ✅ GOOD - Includes small-cell suppression
CREATE VIEW public.v_benchmark_outcomes AS
SELECT
  substance_id,
  COUNT(*) as patient_count,
  AVG(outcome_score) as avg_outcome
FROM public.log_clinical_records
GROUP BY substance_id
HAVING COUNT(*) >= 10;  -- ← Small-cell suppression

-- ❌ BAD - No suppression
CREATE VIEW public.v_benchmark_outcomes AS
SELECT
  substance_id,
  COUNT(*) as patient_count,
  AVG(outcome_score) as avg_outcome
FROM public.log_clinical_records
GROUP BY substance_id;  -- ← Missing HAVING clause
```

---

### **Query 4: Verify Foreign Key Constraints Exist**
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name LIKE 'log_%'
ORDER BY tc.table_name, kcu.column_name;
```

**How to Interpret:**
- ✅ **VERIFY:** All `*_id` columns in `log_*` tables have foreign keys
- ✅ **VERIFY:** `delete_rule` is appropriate (`CASCADE`, `SET NULL`, or `RESTRICT`)
- ❌ **FAIL:** Missing foreign key for an `*_id` column → Add FK constraint

---

### **Query 5: Verify Indexes Exist on Foreign Keys**
```sql
SELECT
  t.relname AS table_name,
  a.attname AS column_name,
  i.relname AS index_name
FROM pg_class t
JOIN pg_attribute a ON a.attrelid = t.oid
LEFT JOIN pg_index ix ON ix.indrelid = t.oid AND a.attnum = ANY(ix.indkey)
LEFT JOIN pg_class i ON i.oid = ix.indexrelid
WHERE t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND t.relkind = 'r'
  AND t.relname LIKE 'log_%'
  AND a.attname LIKE '%_id'
ORDER BY t.relname, a.attname;
```

**How to Interpret:**
- ✅ **PASS:** Every `*_id` column has an `index_name`
- ❌ **FAIL:** `index_name` is NULL → Create index immediately

**Fix:**
```sql
CREATE INDEX IF NOT EXISTS idx_log_clinical_records_substance_id
ON public.log_clinical_records(substance_id);
```

---

## 4️⃣ **SQL AND POSTGRES BEST PRACTICES**

### **A. Prefer Reference Tables Over "Magic Strings"**
- ❌ **BAD:** `safety_event_category VARCHAR`
- ✅ **GOOD:** `safety_event_id BIGINT REFERENCES ref_safety_events(id)`

**Why:** Strings drift. Reference keys stay stable and are faster to filter/aggregate.

---

### **B. Use Constraints to Stop Bad Data**
- Check constraints for format, ranges, basic validation
- Foreign keys enforce valid relationships and prevent orphan rows

---

### **C. Index Only What You Query**
- Every index must map to a known query or view
- Partial indexes valid when most rows are null or filtering by predicate

---

### **D. JSONB is Not a Free Pass**
- JSONB acceptable for truly variable, low-analytics fields
- JSONB is a liability for benchmarking (reduces standardization, complicates queries)
- Direction: "If it doesn't change decisions or improve benchmarking, we don't collect it" → Use structured tables, not JSON

---

## 5️⃣ **SUPABASE-SPECIFIC SAFETY PRACTICES**

### **A. Migrations Are True Version History**
- Supabase supports migration workflow via Supabase CLI
- Gives reproducible environments and real audit trail

### **B. Restore is "Break Glass," Not Workflow**
- Supabase supports backups and point-in-time restore (PITR)
- Restore is safety net, not normal development method
- Primary protection: migration discipline + review gates

### **C. Policies Can Be Replaced, But Must Be Tested**
- Policy errors are most common way teams accidentally expose data
- Every policy change requires test queries for each role

---

## 6️⃣ **PPN SCHEMA GOVERNANCE CONTRACT**

### **1. Scope of Work**
- We only add schema objects: tables, columns, indexes, views, constraints, reference data
- We do not delete or rename schema objects
- Policies can be replaced

### **2. Privacy and PHI**
- No PHI, no direct identifiers, no patient free text, no file uploads containing clinical content
- Patient linking is hash-only. Raw identifiers forbidden.

### **3. Data Capture Rules**
- No free-text answers in any `log_*` tables or assessment response tables
- All answers are controlled values via `ref_*` tables or constrained numeric fields with units

### **4. Security**
- RLS enabled on all patient-linked tables
- Site isolation enforced through `user_sites`
- Cross-site analytics must use small-cell suppression (N≥10) by default

### **5. Change Process**
- All changes are SQL migrations, idempotent, reviewed, and verified with standard test suite
- No ad hoc changes via dashboard for production schema

---

## 7️⃣ **TRADEOFFS ACCEPTED**

### **1. Less Flexibility in Early-Stage UI**
- Controlled vocabularies slow down "quick form tweaks"
- **Payoff:** Clean analytics and easier benchmarking later

### **2. No Narrative Capture**
- Clinicians cannot type "what happened" into the system
- **Payoff:** Reduced PHI risk and standardized insights

### **3. More Up-Front Schema Work**
- Time spent designing reference sets and enumerations
- **Payoff:** Fewer schema resets and more trustworthy comparisons

---

## 8️⃣ **IMMEDIATE NEXT STEPS (IN ORDER)**

1. ✅ **Capture schema-only baseline** (public schema objects at minimum)
2. ✅ **Run verification queries** and store outputs as "baseline checks"
3. ⏸️ **Identify patient-level log tables with text "answer" columns**
   - Create conversion plan:
     - Add reference columns
     - Backfill
     - Update UI
     - Stop writing to old text columns (do not delete them)
4. ✅ **Lock governance rules** into Antigravity's system prompt
5. ✅ **Require workflow** for every change

---

## 9️⃣ **ENFORCEMENT**

**This document is NON-NEGOTIABLE.**

Any agent (INVESTIGATOR, BUILDER, DESIGNER, Antigravity) who violates these rules must:
1. Immediately stop work
2. Report violation to user
3. Await explicit permission before proceeding

**No exceptions without explicit user approval.**

---

**END OF GOVERNANCE RULES v2.0**

**Signed:** Antigravity AI Agent (Senior SQL Database Architect)  
**Date:** 2026-02-11  
**Status:** ACTIVE AND ENFORCED

---

## 📋 **CHANGELOG v2.0**

**What's New:**
- ✅ Added Senior SQL Database Architect role definition
- ✅ Enhanced baseline capture instructions with SQL examples
- ✅ Added idempotent SQL patterns and examples
- ✅ Added peer review checklist (8 items)
- ✅ Enhanced verification queries with interpretation guidance
- ✅ Added Query 4: Verify Foreign Key Constraints
- ✅ Added Query 5: Verify Indexes on Foreign Keys
- ✅ Added conversion plan template for text-to-FK migration
- ✅ Added small-cell suppression examples

**Source:** Integrated guidance from ChatGPT database governance recommendations (2026-02-11)
