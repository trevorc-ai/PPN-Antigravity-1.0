# 🔍 DATABASE PATTERN AUDIT - SOOP ANALYSIS

**Date:** 2026-02-15T17:27:00-08:00  
**Purpose:** Identify ALL naming/typing inconsistencies across migrations  
**Method:** Pattern recognition analysis of all migration files

---

## 📊 PATTERN ANALYSIS: `site_id` Type

### Pattern A: `site_id BIGSERIAL` (Sequential Integer)
**File:** `000_init_core_tables.sql` (Line 13)
```sql
CREATE TABLE IF NOT EXISTS public.sites (
    site_id BIGSERIAL PRIMARY KEY,
    ...
);
```

### Pattern B: `site_id BIGINT` (Integer Foreign Key)
**Files:** Multiple migrations reference `site_id` as BIGINT
- `000_init_core_tables.sql` (Lines 27, 36, 54, 66, 78, 91)
- `011_add_source_and_meq30.sql` (Line 60)
- `008_create_system_events_table.sql` (Line 16)
- `018_protocol_intelligence_infrastructure.sql` (Line 18)
- `007_monetization_infrastructure.sql` (Lines 14, 159)

**Example:**
```sql
site_id BIGINT NOT NULL REFERENCES public.sites(site_id)
```

### Pattern C: `site_id UUID` (Random Identifier)
**Files:** Some migrations use UUID
- `001_patient_flow_foundation.sql` (Line 163)
- `010_future_proof_schema.sql` (Lines 57, 93, 159, 162)
- `005_seed_test_protocols.sql` (Line 11)
- `002_seed_demo_data.sql` (Line 32)

**Example:**
```sql
site_id UUID NOT NULL,
```

**❓ QUESTION FOR USER:** Which pattern is correct?
- **Option A:** `site_id` should be `BIGSERIAL` (auto-incrementing integer)
- **Option B:** `site_id` should be `UUID` (random identifier)

---

## 📊 PATTERN ANALYSIS: ID Column Naming

### Pattern A: `{table_name}_id` (Descriptive)
**Examples:**
- `sites.site_id`
- `substance_id`
- `route_id`
- `indication_id`
- `clinical_record_id`

### Pattern B: Generic `id`
**Examples:**
- `user_sites.id` (Line 25 in 000_init_core_tables.sql)
- `ref_flow_event_types.id` (Line 136 in 001_patient_flow_foundation.sql)

**❓ QUESTION FOR USER:** Should ALL primary keys use pattern `{table_name}_id`?

---

## 📊 PATTERN ANALYSIS: Reference Table Prefixes

### ✅ CORRECT Pattern: `ref_*` tables
- `ref_substances`
- `ref_routes`
- `ref_indications`
- `ref_support_modality`
- `ref_smoking_status`
- `ref_severity_grade`
- `ref_safety_events`
- `ref_resolution_status`
- `ref_flow_event_types`

### ❌ VIOLATION: Tables missing `ref_` prefix (from audit report)
- `sites` (should be `ref_sites`?)
- `user_sites` (junction table - exception?)
- `user_profiles` (user metadata - exception?)

**❓ QUESTION FOR USER:** Should `sites` be renamed to `ref_sites`?

---

## 📊 PATTERN ANALYSIS: Log Table Prefixes

### ✅ CORRECT Pattern: `log_*` tables
- `log_clinical_records`
- `log_outcomes`
- `log_consent`
- `log_interventions`
- `log_safety_events`
- `log_patient_flow_events`
- `log_meq30`

### ❓ No violations found in log table naming

---

## 📊 PATTERN ANALYSIS: Column Names in `ref_substances`

### Migration 003 Definition (Line 12):
```sql
CREATE TABLE IF NOT EXISTS public.ref_substances (
    substance_id BIGSERIAL PRIMARY KEY,
    substance_name TEXT NOT NULL UNIQUE,  -- ✅ CORRECT
    rxnorm_cui BIGINT,
    substance_class TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Migration 001 Patch (Lines 88-92):
```sql
IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'ref_substances' AND column_name = 'substance_name') THEN
    ALTER TABLE public.ref_substances ADD COLUMN substance_name TEXT;
    RAISE NOTICE '  ✅ Added substance_name';
END IF;
```

**✅ CONFIRMED:** `substance_name` is the CORRECT column name (not a violation)

---

## 📊 PATTERN ANALYSIS: Column Names in `log_clinical_records`

### Migration 000 Definition (Lines 34-49):
```sql
CREATE TABLE IF NOT EXISTS public.log_clinical_records (
    clinical_record_id BIGSERIAL PRIMARY KEY,
    site_id BIGINT REFERENCES public.sites(site_id),
    subject_id BIGINT,  -- ✅ EXISTS in migration
    patient_link_code TEXT,
    protocol_id UUID,
    substance_id BIGINT,
    outcome_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**✅ CONFIRMED:** `subject_id` column EXISTS in migration 000

---

## 🚨 CRITICAL FINDINGS

### Finding #1: `site_id` Type Inconsistency
**Problem:** Some migrations use `BIGINT`, others use `UUID`
**Impact:** Foreign key relationships will FAIL if types don't match
**Root Cause:** Migration 000 defines `site_id BIGSERIAL`, but later migrations use `UUID`

**Migrations that violate the BIGSERIAL pattern:**
1. `001_patient_flow_foundation.sql` (Line 163)
2. `010_future_proof_schema.sql` (Multiple lines)
3. `005_seed_test_protocols.sql` (Line 11)
4. `002_seed_demo_data.sql` (Line 32)

### Finding #2: Missing Columns in Deployed Database
**Problem:** Browser error says `subject_id` doesn't exist
**Evidence:** Migration 000 DOES define `subject_id BIGINT`
**Conclusion:** Migration 000 was NEVER EXECUTED on the database

### Finding #3: Auth User Creation Violations
**Problem:** Migrations try to INSERT into `auth.users`
**Files:**
- `supabase/migrations/20260215_create_test_user.sql`
- `supabase/migrations/20260215_create_test_user_complete.sql`

**Violation:** Direct manipulation of Supabase Auth tables

---

## 🎯 ROOT CAUSE HYPOTHESIS

**The database is in an inconsistent state because:**

1. **Migration 000 was never executed** → Core tables don't exist
2. **Some later migrations were executed** → Created tables with wrong types
3. **Type mismatches** → `site_id` defined as BIGSERIAL but used as UUID
4. **Auth violations** → Attempted to create users via SQL instead of Supabase Auth

---

## ✅ RECOMMENDED FIX

**USER: Please answer these questions:**

1. **What should `site_id` be?**
   - [ ] BIGSERIAL (auto-incrementing integer 1, 2, 3...)
   - [ ] UUID (random like `a1b2c3d4-e5f6-...`)

2. **Should `sites` table be renamed to `ref_sites`?**
   - [ ] Yes, rename to `ref_sites`
   - [ ] No, keep as `sites` (infrastructure table exception)

3. **What migrations have been executed?**
   - [ ] None (database is empty)
   - [ ] Some (database is partially set up)
   - [ ] All (database should be complete)

4. **Do you have a backup I can restore?**
   - [ ] Yes (provide backup file/timestamp)
   - [ ] No (need to rebuild from migrations)

---

**Once you answer these questions, I can create the exact fix needed.**

==== SOOP ====
