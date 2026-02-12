# 🔍 **SQL DATABASE BEST PRACTICES AUDIT**

**Date:** 2026-02-10 13:55 PM  
**Purpose:** Comprehensive review of database design against industry best practices  
**Scope:** PPN Research Portal Supabase PostgreSQL database

---

## 📚 **INDUSTRY BEST PRACTICES (PostgreSQL/Supabase)**

### **1. NORMALIZATION (3NF Minimum)**
**Standard:** Data should be normalized to Third Normal Form (3NF)
- No repeating groups
- No partial dependencies
- No transitive dependencies

### **2. FOREIGN KEY CONSTRAINTS**
**Standard:** All relationships enforced with foreign keys
- `ON DELETE CASCADE` or `ON DELETE SET NULL` specified
- Referential integrity maintained

### **3. INDEXING STRATEGY**
**Standard:** Indexes on all foreign keys and frequently queried columns
- Primary keys auto-indexed
- Foreign keys indexed
- Composite indexes for multi-column queries

### **4. NAMING CONVENTIONS**
**Standard:** Consistent, descriptive naming
- Tables: plural nouns (`users`, `substances`)
- Columns: snake_case (`created_at`, `substance_id`)
- Foreign keys: `{table}_id` format
- Indexes: `idx_{table}_{column}` format
- Constraints: `{table}_{constraint_type}` format

### **5. DATA TYPES**
**Standard:** Use appropriate, specific data types
- `BIGSERIAL` for auto-incrementing IDs
- `TIMESTAMPTZ` for timestamps (timezone-aware)
- `BOOLEAN` for true/false
- `JSONB` for structured JSON (not JSON)
- `TEXT` for variable-length strings (not VARCHAR in PostgreSQL)

### **6. CONSTRAINTS**
**Standard:** Enforce data integrity at database level
- `NOT NULL` where appropriate
- `UNIQUE` constraints for unique values
- `CHECK` constraints for valid ranges
- `DEFAULT` values specified

### **7. ROW LEVEL SECURITY (RLS)**
**Standard:** Security enforced at database level
- RLS enabled on all tables
- Policies for SELECT, INSERT, UPDATE, DELETE
- Site/tenant isolation enforced

### **8. AUDIT TRAILS**
**Standard:** Track who, what, when
- `created_at` timestamp
- `updated_at` timestamp
- `created_by` user reference
- `updated_by` user reference (optional)

### **9. SOFT DELETES**
**Standard:** Preserve data, mark as inactive
- `is_active` or `deleted_at` column
- Filter queries to exclude deleted records

### **10. DOCUMENTATION**
**Standard:** Schema documented in database
- `COMMENT ON TABLE` for table descriptions
- `COMMENT ON COLUMN` for column descriptions

---

## ✅ **WHAT WE'RE DOING RIGHT**

### **1. Foreign Key Constraints** ✅
```sql
substance_id BIGINT REFERENCES public.ref_substances(substance_id)
route_id BIGINT REFERENCES public.ref_routes(route_id)
```
**Status:** GOOD - All relationships use foreign keys

---

### **2. Appropriate Data Types** ✅
```sql
created_at TIMESTAMPTZ DEFAULT NOW()  -- Timezone-aware
is_active BOOLEAN DEFAULT TRUE        -- Boolean, not integer
substance_id BIGSERIAL PRIMARY KEY    -- Auto-incrementing
```
**Status:** GOOD - Using PostgreSQL-optimized types

---

### **3. Indexing on Foreign Keys** ✅
```sql
CREATE INDEX idx_clinical_records_substance ON log_clinical_records(substance_id);
CREATE INDEX idx_clinical_records_route ON log_clinical_records(route_id);
```
**Status:** GOOD - Foreign keys are indexed

---

### **4. Row Level Security** ✅
```sql
ALTER TABLE public.ref_substances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ref_substances_read" ON public.ref_substances FOR SELECT USING (auth.role() = 'authenticated');
```
**Status:** GOOD - RLS enabled on all tables

---

### **5. Soft Deletes** ✅
```sql
is_active BOOLEAN DEFAULT TRUE
```
**Status:** GOOD - Using `is_active` flag instead of hard deletes

---

### **6. Unique Constraints** ✅
```sql
substance_name TEXT NOT NULL UNIQUE
CONSTRAINT unique_interaction UNIQUE (substance_name, interactor_name)
```
**Status:** GOOD - Preventing duplicates at database level

---

## ❌ **WHAT WE'RE DOING WRONG**

### **1. DENORMALIZED DATA (CRITICAL)** 🔴

**Problem:** Storing text values that should be foreign keys

**Example from existing `ref_knowledge_graph`:**
```sql
-- WRONG (current)
ref_knowledge_graph | substance_a_id    | text  -- Should be BIGINT FK
ref_knowledge_graph | substance_b_id    | text  -- Should be BIGINT FK
ref_knowledge_graph | risk_level        | text  -- Should be INTEGER
```

**Should be:**
```sql
-- RIGHT (corrected)
substance_a_id BIGINT REFERENCES public.ref_substances(substance_id)
substance_b_id BIGINT REFERENCES public.ref_substances(substance_id)
risk_level INTEGER NOT NULL CHECK (risk_level BETWEEN 1 AND 10)
```

**Impact:** 
- ❌ No referential integrity
- ❌ Typos possible ("Psilocybn" vs "Psilocybin")
- ❌ Can't enforce valid values
- ❌ Harder to query and join
- ❌ Wastes storage space

---

### **2. INCONSISTENT PRIMARY KEY TYPES** 🟡

**Problem:** Mixing `UUID` and `BIGSERIAL` for primary keys

**Examples:**
```sql
sites.id                    UUID           -- UUID
log_clinical_records.id     UUID           -- UUID
ref_substances.substance_id BIGSERIAL      -- BIGSERIAL
system_events.event_id      BIGSERIAL      -- BIGSERIAL
```

**Best Practice:** Pick ONE strategy and stick to it
- **Option A:** UUIDs everywhere (better for distributed systems, merging data)
- **Option B:** BIGSERIAL everywhere (better performance, simpler)

**Current Status:** Mixed approach
- Core tables (`sites`, `log_clinical_records`) use UUID
- Reference tables use BIGSERIAL
- This is actually OKAY if intentional (UUIDs for distributed data, BIGSERIAL for reference data)

**Recommendation:** Document the strategy in schema comments

---

### **3. MISSING UPDATED_AT TRIGGERS** 🟡

**Problem:** `updated_at` columns exist but no auto-update triggers

**Example:**
```sql
-- Column exists
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

-- But no trigger to update it!
```

**Should have:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ref_substances_updated_at
BEFORE UPDATE ON public.ref_substances
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**Impact:**
- ❌ `updated_at` never changes after creation
- ❌ Can't track when records were last modified

---

### **4. MISSING CREATED_BY / UPDATED_BY** 🟡

**Problem:** Some tables track who created records, others don't

**Inconsistent:**
```sql
-- Has created_by
log_clinical_records.created_by UUID REFERENCES auth.users(id)

-- Missing created_by
ref_substances (no created_by column)
system_events.actor_id (named differently)
```

**Best Practice:** Consistent audit columns on ALL tables
```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
created_by UUID REFERENCES auth.users(id)
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_by UUID REFERENCES auth.users(id)
```

**Impact:**
- ⚠️ Inconsistent audit trail
- ⚠️ Can't track who modified reference data

---

### **5. MISSING TABLE/COLUMN COMMENTS** 🟡

**Problem:** No documentation in database schema

**Current:**
```sql
CREATE TABLE public.ref_substances (
    substance_id BIGSERIAL PRIMARY KEY,
    substance_name TEXT NOT NULL UNIQUE
);
-- No COMMENT statements
```

**Should be:**
```sql
CREATE TABLE public.ref_substances (
    substance_id BIGSERIAL PRIMARY KEY,
    substance_name TEXT NOT NULL UNIQUE
);

COMMENT ON TABLE public.ref_substances IS 
'Reference table for psychedelic substances. Used by Protocol Builder and Interaction Checker.';

COMMENT ON COLUMN public.ref_substances.substance_id IS 
'Auto-incrementing primary key for substance identification';

COMMENT ON COLUMN public.ref_substances.substance_name IS 
'Common name of substance (e.g., Psilocybin, MDMA, Ketamine)';
```

**Impact:**
- ⚠️ New developers can't understand schema without external docs
- ⚠️ Database introspection tools can't show descriptions

---

### **6. NO CHECK CONSTRAINTS ON ENUMS** 🟡

**Problem:** Text columns with limited valid values have no constraints

**Example:**
```sql
-- WRONG (current)
patient_sex TEXT  -- Could be anything: "male", "Male", "M", "xyz"

-- RIGHT (with constraint)
patient_sex TEXT CHECK (patient_sex IN ('male', 'female', 'other', 'declined'))
```

**Other examples needing constraints:**
```sql
session_type TEXT  -- Should have CHECK constraint
setting TEXT       -- Should have CHECK constraint
```

**Impact:**
- ❌ Invalid data can be inserted
- ❌ Inconsistent values ("male" vs "Male" vs "M")

---

### **7. MISSING COMPOSITE INDEXES** 🟡

**Problem:** Queries that filter on multiple columns don't have composite indexes

**Example:**
```sql
-- Common query pattern
SELECT * FROM log_clinical_records 
WHERE site_id = ? AND session_date > ?
ORDER BY session_date DESC;

-- Missing composite index
CREATE INDEX idx_clinical_records_site_date 
ON log_clinical_records(site_id, session_date DESC);
```

**Impact:**
- ⚠️ Slower queries on large datasets
- ⚠️ Full table scans instead of index scans

---

### **8. ARRAY COLUMNS INSTEAD OF JUNCTION TABLES** 🟡

**Problem:** Using arrays for many-to-many relationships

**Example:**
```sql
-- WRONG (current)
support_modality_ids BIGINT[]  -- Array of IDs

-- RIGHT (normalized)
CREATE TABLE log_clinical_records_modalities (
  record_id UUID REFERENCES log_clinical_records(id),
  modality_id BIGINT REFERENCES ref_support_modality(modality_id),
  PRIMARY KEY (record_id, modality_id)
);
```

**Impact:**
- ⚠️ Harder to query (can't use standard JOINs)
- ⚠️ Can't enforce foreign key constraints on array elements
- ⚠️ Harder to count/aggregate

**Note:** Arrays are acceptable for MVP if performance is not critical, but should be refactored for production.

---

### **9. MISSING ON DELETE/UPDATE ACTIONS** 🟡

**Problem:** Some foreign keys don't specify what happens on delete

**Example:**
```sql
-- Incomplete
substance_id BIGINT REFERENCES public.ref_substances(substance_id)

-- Should specify
substance_id BIGINT REFERENCES public.ref_substances(substance_id) ON DELETE CASCADE
-- or
substance_id BIGINT REFERENCES public.ref_substances(substance_id) ON DELETE SET NULL
```

**Impact:**
- ⚠️ Default behavior (RESTRICT) may cause unexpected errors
- ⚠️ Can't delete reference data even if it's obsolete

---

### **10. SITE_ID TYPE INCONSISTENCY** 🔴

**Problem:** `site_id` is different types in different tables

**Examples:**
```sql
sites.id                        UUID    -- Primary key is UUID
system_events.site_id           BIGINT  -- Foreign key is BIGINT (WRONG!)
log_clinical_records.site_id    UUID    -- Foreign key is UUID (RIGHT)
```

**Impact:**
- 🔴 **CRITICAL:** `system_events.site_id` can't reference `sites.id` (type mismatch)
- 🔴 Foreign key constraint will fail

**Fix Required:**
```sql
ALTER TABLE system_events 
ALTER COLUMN site_id TYPE UUID USING site_id::text::uuid;
```

---

## 📊 **BEST PRACTICES SCORECARD**

| Practice | Status | Grade |
|----------|--------|-------|
| Normalization (3NF) | ⚠️ Mostly | B |
| Foreign Key Constraints | ✅ Good | A |
| Indexing Strategy | ✅ Good | A- |
| Naming Conventions | ✅ Consistent | A |
| Data Types | ✅ Appropriate | A |
| Constraints (CHECK, UNIQUE) | ⚠️ Partial | B- |
| Row Level Security | ✅ Enabled | A |
| Audit Trails | ⚠️ Inconsistent | C+ |
| Soft Deletes | ✅ Implemented | A |
| Documentation | ❌ Missing | F |

**Overall Grade: B-**

---

## 🎯 **PRIORITY FIXES**

### **CRITICAL (Fix Now)** 🔴
1. **Fix `system_events.site_id` type mismatch** (UUID vs BIGINT)
2. **Normalize `ref_knowledge_graph`** (use foreign keys, not text)

### **HIGH (Fix Before Production)** 🟡
3. **Add `updated_at` triggers** to all tables with `updated_at` columns
4. **Add CHECK constraints** to enum-like text columns
5. **Add table/column comments** for documentation

### **MEDIUM (Technical Debt)** 🟢
6. **Refactor array columns** to junction tables (support_modality_ids, concomitant_med_ids)
7. **Add composite indexes** for common query patterns
8. **Standardize audit columns** (created_by, updated_by) across all tables

### **LOW (Nice to Have)** ⚪
9. **Add ON DELETE/UPDATE actions** to all foreign keys
10. **Document primary key strategy** (UUID vs BIGSERIAL)

---

## 📋 **RECOMMENDED ACTION PLAN**

### **Phase 1: Critical Fixes (Today)**
1. Fix `system_events.site_id` type to UUID
2. Drop and recreate `ref_knowledge_graph` with proper foreign keys

### **Phase 2: High Priority (This Week)**
3. Create `update_updated_at_column()` function and triggers
4. Add CHECK constraints to enum columns
5. Add COMMENT statements to all tables/columns

### **Phase 3: Technical Debt (Next Sprint)**
6. Refactor array columns to junction tables
7. Add composite indexes based on query analysis
8. Standardize audit columns

---

## ✅ **CONCLUSION**

**Current State:** Database is functional but has normalization issues and missing best practices

**Biggest Issues:**
1. 🔴 Denormalized data (text instead of foreign keys)
2. 🔴 Type mismatches (site_id UUID vs BIGINT)
3. 🟡 Missing triggers for updated_at
4. 🟡 No schema documentation

**Next Steps:**
1. Fix critical issues (site_id type, ref_knowledge_graph normalization)
2. Add missing triggers and constraints
3. Document schema with COMMENT statements

---

**End of SQL Best Practices Audit**
