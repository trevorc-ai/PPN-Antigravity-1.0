---
name: migration-manager
description: Manages Supabase database migrations with proper workflow. Includes mandatory pre-flight live schema verification to prevent FK errors against non-existent or misnamed tables.
---

# Migration Manager

## 🔒 GOVERNANCE AUTHORITY (Read Before Anything Else)

> **MANDATORY:** Read `DATABASE_GOVERNANCE_CHARTER.md` before starting any migration work.

**Database Write/Create Authority:**
- ✅ AUTHORIZED: USER (Admin) — executes in Supabase SQL Editor only
- ✅ AUTHORIZED: INSPECTOR — on USER's explicit delegation only
- ❌ FORBIDDEN: BUILDER, LEAD, or any other agent — may WRITE sql files as text, NEVER EXECUTE them

**Database work model:** INSPECTOR (or BUILDER if assigned) produces the `.sql` migration file as a work product, appends the `INSPECTOR 02.5 CLEARANCE` checklist, then **User runs it manually in Supabase SQL Editor**. No agent ever executes SQL.

---

## Purpose
Produce database migration files safely. The #1 rule: **always verify the live schema before writing SQL**, not after.

---

## MANDATORY PRE-FLIGHT (Before Writing Any SQL)

### 1. Discover Live Table Names
```bash
# Find every table the app actually queries — these are your ground truth
grep -rn "\.from('" src/ 2>/dev/null | grep -v ".DS_Store" | \
  sed "s/.*\.from('//;s/').*//" | sort -u
```

Save this list. Every FK reference in your migration MUST use a name from this list.

### 2. Verify Specific Tables Before Referencing Them
```bash
# Before writing: REFERENCES some_table(id)
# Confirm it exists:
grep -rn "from('some_table')" src/
```

**If no result: that table does not exist in the live DB. Do not reference it.**

### 3. Known Table Name Traps in This Codebase
| What you might assume | Actual live name |
|----------------------|-----------------|
| `sites` | `log_sites` |
| `user_sites` | `log_user_sites` |
| `clinical_records` | `log_clinical_records` |

**Rule:** When in doubt, grep `src/` first. Never assume.

---

## Migration Workflow

### Step 1: Pre-Flight (above) — MANDATORY

### Step 2: Write SQL
- All `CREATE TABLE` → use `IF NOT EXISTS`
- All `CREATE INDEX` → use `IF NOT EXISTS`  
- All `ADD COLUMN` → use `IF NOT EXISTS`
- All `CREATE POLICY` → preceded by `DROP POLICY IF EXISTS`

### Step 3: Validate with database-schema-validator skill
Run all 6 validation steps before handing off.

### Step 4: Append INSPECTOR 02.5 CLEARANCE block
Append the completed checklist (from `database-schema-validator` SKILL) to the WO. Move ticket from `02.5_PRE-BUILD_REVIEW` to `03_BUILD` (if engineering work follows) or surface SQL file to User for execution.

### Step 5: User Executes Manually
User runs SQL in Supabase dashboard SQL editor. Docker-first protocol always applies.

---

## SQL Patterns (Copy-Paste Safe)

### New Table with Full RLS
```sql
CREATE TABLE IF NOT EXISTS log_new_table (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  site_id UUID REFERENCES log_sites(site_id),  -- verified live
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE log_new_table ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select their site log_new_table" ON log_new_table;
CREATE POLICY "Users can select their site log_new_table"
  ON log_new_table FOR SELECT
  USING (
    site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert log_new_table" ON log_new_table;
CREATE POLICY "Users can insert log_new_table"
  ON log_new_table FOR INSERT
  WITH CHECK (
    site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())
  );
```

### Extend Existing Table
```sql
ALTER TABLE log_existing_table
  ADD COLUMN IF NOT EXISTS new_column VARCHAR(50),
  ADD COLUMN IF NOT EXISTS another_column INTEGER;

CREATE INDEX IF NOT EXISTS idx_existing_table_new_column
  ON log_existing_table(new_column);
```

### Reference Table (read-only, no INSERT policy needed)
```sql
CREATE TABLE IF NOT EXISTS ref_new_lookup (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  label VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

INSERT INTO ref_new_lookup (code, label) VALUES
  ('CODE_A', 'Label A'),
  ('CODE_B', 'Label B')
ON CONFLICT (code) DO NOTHING;

ALTER TABLE ref_new_lookup ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ref_new_lookup_read" ON ref_new_lookup;
CREATE POLICY "ref_new_lookup_read" ON ref_new_lookup
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

## Common Error Codes & Fixes

| Error | Meaning | Fix |
|-------|---------|-----|
| `42710` | Policy already exists | Add `DROP POLICY IF EXISTS` before `CREATE POLICY` |
| `42P01` | Table doesn't exist | Run pre-flight grep to find correct table name |
| `42P07` | Table already exists | Add `IF NOT EXISTS` to `CREATE TABLE` |
| `23503` | FK references missing row | Check parent table exists and has data |
| `42601` | Syntax error | Check SQL around reported line number |

---

## Safety Rules (Immutable)
- ✅ Additive only — never DROP, RENAME, or change column types
- ✅ All statements idempotent — safe to re-run
- ✅ RLS on every `log_*` table — SELECT + INSERT policies
- ✅ Live schema verified before writing any FK
- ✅ `DROP POLICY IF EXISTS` before every `CREATE POLICY`
- ❌ Never execute SQL yourself — User runs manually
