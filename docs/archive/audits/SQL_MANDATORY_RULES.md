# 🗄️ **SQL DATABASE BEST PRACTICES - MANDATORY RULES**

**Date:** 2026-02-10  
**Purpose:** Mandatory rules for all database work on PPN Research Portal  
**Applies to:** All agents (INVESTIGATOR, BUILDER, DESIGNER)

---

## 🔴 **CRITICAL RULES (NEVER VIOLATE)**

### **1. NO HARDCODED DATA - USE FOREIGN KEYS**
❌ **NEVER** store text that should be a foreign key
```sql
-- WRONG
substance_name TEXT  -- "Psilocybin", "MDMA", etc.
severity_grade TEXT  -- "Life-Threatening", "Moderate", etc.

-- RIGHT
substance_id BIGINT REFERENCES ref_substances(substance_id)
severity_grade_id BIGINT REFERENCES ref_severity_grade(severity_grade_id)
```

**Rule:** ALWAYS get user permission before storing denormalized/duplicated data.

---

### **2. CONSISTENT DATA TYPES**
❌ **NEVER** mix types for the same logical entity
```sql
-- WRONG
sites.id UUID
system_events.site_id BIGINT  -- Type mismatch!

-- RIGHT
sites.id UUID
system_events.site_id UUID  -- Matches parent table
```

**Rule:** Foreign keys MUST match parent table primary key type exactly.

---

### **3. PROPER FOREIGN KEY CONSTRAINTS**
✅ **ALWAYS** specify ON DELETE behavior
```sql
-- INCOMPLETE
substance_id BIGINT REFERENCES ref_substances(substance_id)

-- COMPLETE
substance_id BIGINT REFERENCES ref_substances(substance_id) ON DELETE CASCADE
-- or
substance_id BIGINT REFERENCES ref_substances(substance_id) ON DELETE SET NULL
```

**Rule:** Every foreign key MUST specify ON DELETE action.

---

## 🟡 **REQUIRED STANDARDS**

### **4. NAMING CONVENTIONS**
- Tables: `snake_case`, plural (`ref_substances`, `log_clinical_records`)
- Columns: `snake_case` (`created_at`, `substance_id`)
- Foreign keys: `{table}_id` format (`substance_id`, `route_id`)
- Indexes: `idx_{table}_{column}` format
- Constraints: `{table}_{type}` format

---

### **5. REQUIRED COLUMNS**
Every table MUST have:
```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

Reference tables SHOULD have:
```sql
is_active BOOLEAN DEFAULT TRUE
```

Log tables SHOULD have:
```sql
created_by UUID REFERENCES auth.users(id)
```

---

### **6. UPDATED_AT TRIGGERS**
Every table with `updated_at` MUST have a trigger:
```sql
CREATE TRIGGER update_{table}_updated_at
BEFORE UPDATE ON public.{table}
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

### **7. INDEXES**
MUST index:
- All foreign keys
- Columns used in WHERE clauses
- Columns used in ORDER BY
- Composite indexes for multi-column queries

```sql
CREATE INDEX idx_{table}_{column} ON public.{table}({column});
```

---

### **8. CONSTRAINTS**
MUST add constraints for:
- NOT NULL where appropriate
- UNIQUE for unique values
- CHECK for valid ranges/enums
- DEFAULT values

```sql
risk_level INTEGER NOT NULL CHECK (risk_level BETWEEN 1 AND 10)
patient_sex TEXT CHECK (patient_sex IN ('male', 'female', 'other', 'declined'))
```

---

### **9. ROW LEVEL SECURITY**
Every table MUST have:
```sql
ALTER TABLE public.{table} ENABLE ROW LEVEL SECURITY;

-- Read policy
CREATE POLICY "{table}_read" ON public.{table}
FOR SELECT USING (auth.role() = 'authenticated');

-- Write policy (network_admin only for ref tables)
CREATE POLICY "{table}_write" ON public.{table}
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_sites WHERE user_id = auth.uid() AND role = 'network_admin')
);
```

---

### **10. SCHEMA DOCUMENTATION**
Every table and column MUST have comments:
```sql
COMMENT ON TABLE public.{table} IS 'Description of table purpose';
COMMENT ON COLUMN public.{table}.{column} IS 'Description of column';
```

---

## 🟢 **BEST PRACTICES**

### **11. DATA TYPES**
Use PostgreSQL-optimized types:
- `BIGSERIAL` for auto-incrementing IDs
- `TIMESTAMPTZ` for timestamps (timezone-aware)
- `BOOLEAN` for true/false (not integer)
- `JSONB` for structured JSON (not JSON)
- `TEXT` for variable-length strings (not VARCHAR)
- `UUID` for distributed primary keys

---

### **12. NORMALIZATION**
- Minimum 3NF (Third Normal Form)
- No repeating groups
- No partial dependencies
- No transitive dependencies
- Use junction tables for many-to-many (not arrays)

---

### **13. SOFT DELETES**
Prefer soft deletes over hard deletes:
```sql
is_active BOOLEAN DEFAULT TRUE
-- or
deleted_at TIMESTAMPTZ
```

---

## 📋 **PRE-MIGRATION CHECKLIST**

Before creating ANY new table or migration, verify:

- [ ] All foreign keys use IDs, not text
- [ ] All foreign key types match parent table
- [ ] All foreign keys have ON DELETE specified
- [ ] Table has created_at, updated_at columns
- [ ] updated_at has trigger
- [ ] All foreign keys are indexed
- [ ] CHECK constraints on enum-like columns
- [ ] RLS enabled with policies
- [ ] Table and columns have COMMENT documentation
- [ ] Naming follows conventions

---

## 🚫 **COMMON MISTAKES TO AVOID**

1. ❌ Storing "Psilocybin" as TEXT instead of substance_id
2. ❌ Mixing UUID and BIGINT for same entity
3. ❌ Missing ON DELETE on foreign keys
4. ❌ No trigger for updated_at column
5. ❌ No indexes on foreign keys
6. ❌ No CHECK constraints on enums
7. ❌ No RLS policies
8. ❌ No schema documentation
9. ❌ Using arrays for many-to-many relationships
10. ❌ Hardcoding data that should come from reference tables

---

## ✅ **APPROVAL REQUIRED**

**ALWAYS get user approval before:**
1. Storing denormalized/duplicated data
2. Creating array columns for relationships
3. Deviating from naming conventions
4. Skipping indexes on foreign keys
5. Creating tables without RLS
6. Using non-standard data types

---

**END OF MANDATORY SQL RULES**

These rules apply to ALL database work on PPN Research Portal.
Violations of CRITICAL RULES (🔴) require immediate correction.
