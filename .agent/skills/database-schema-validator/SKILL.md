---
name: database-schema-validator
description: Validates SQL migration files for banned commands, naming conventions, live schema alignment, idempotency, and RLS completeness before execution. MANDATORY for INSPECTOR (or delegated agent) before any SQL handoff to User.
---

# Database Schema Validator

## Purpose
Catch SQL errors **before** they reach the user's database. This skill must be run by INSPECTOR (or delegated agent) on every migration file before the User executes it.

---

## 🛑 STEP 1: MANDATORY LIVE SCHEMA VERIFICATION — HARD STOP

**THIS STEP CANNOT BE SKIPPED. THE AUTHORING AGENT MUST NOT WRITE A SINGLE LINE OF SQL UNTIL THIS IS COMPLETE.**

Do NOT rely on any hardcoded table list, any prior session's notes, `SCHEMA_SNAPSHOT.md`, or any migration file to determine what tables exist. Migrations are intentions — they may never have been executed. Only the live database is truth.

### Required Action Before Any SQL Is Written:

**Run the agent schema inspector tool for each table you plan to reference:**

```bash
node .agent/scripts/inspect-table.js <table_name>
```

*Example: `node .agent/scripts/inspect-table.js log_clinical_records`*

This tool connects directly to the live production database via a read-only role and returns exact column names, types, nullability, and all constraints. It is always accurate — unlike any markdown file.

**To list all tables in the public schema**, run:
```bash
node .agent/scripts/inspect-table.js --list-all
```
*(If `--list-all` is not yet implemented, run the grep below to derive the table list from src/ queries.)*

**Rule: If the authoring agent cannot confirm a table exists via the inspector tool output, treat it as non-existent. Period.**

### Why SCHEMA_SNAPSHOT.md Was Deprecated:
A static markdown file cannot stay in sync with the live database. It caused agents to write FK references against tables that were never created, or with column names that had changed. The inspector tool replaces it with a live, read-only, token-efficient query.

### STOP Check — Paste output to ALL of these before writing SQL:

```
## INSPECTOR Live Schema Pre-Flight (MANDATORY — paste real inspector output here)
- [ ] inspect-table.js run for each target table: [paste output]
- [ ] Table I am modifying/creating confirmed: [TABLE NAME] → EXISTS / DOES NOT EXIST
- [ ] All FK targets confirmed live (list each one): [TABLE: status]
- [ ] Column I am adding/modifying confirmed to not already exist: [COLUMN: status]
```

**If any FK target does not exist in the inspector output: STOP. Create a ticket to build that table first. Do not write the downstream migration.**

---

### Quick Grep Check (for columns/tables the app already uses)

```bash
# Find all table names the app actually queries in src/
grep -rn "\.from('" src/ | grep -v ".DS_Store" | sed "s/.*\.from('//;s/').*//g" | sort -u
```

This tells you what the app expects to query. Cross-reference with the live inspector output above. If the app queries a table that doesn't appear in the live result — that is a bug to report, not a table to assume exists.to assume exists.

### ⚠️ Known Schema Traps (Verified 2026-02-19)

| Table | Live? | Notes |
|-------|-------|-------|
| `ref_medications` | ✅ YES | Created WO-226. Has `medication_id`, `medication_name`, `medication_category`, `is_active` |
| `ref_clinical_interactions` | ✅ YES | Created WO-227. Has `substance_name`, `interactor_name`, `severity_grade`, `risk_level`, `clinical_description` |
| `ref_knowledge_graph` | ✅ YES (wrong schema) | Exists but is a legacy alert rules table: `rule_id`, `substance_a_id`, `substance_b_id`, `condition_code`, `risk_level` (text), `alert_message`. **Do NOT use for clinical interaction lookups.** |
| `ref_drug_interactions` | ❌ NO | Does not exist in live DB. Never was created. |
| `log_user_subscriptions` | ✅ YES | Active |
| `log_subscriptions` | ✅ YES | Also active — confirm which one before referencing |

---

## STEP 1.5: Benchmark FK Check *(Required for `ref_` and `mv_` migrations)*

**Trigger:** Run this step if the migration creates or modifies any table or view that will be used for cross-site comparisons, benchmarking aggregations, or the `data-seeding-pipeline` workflow.

### What to Check

For each field that will appear in a `GROUP BY`, `WHERE`, or cross-site comparison in a `v_` or `mv_` view:

```bash
# Find columns that look like free-text comparison fields
grep -n "TEXT\|VARCHAR" migration.sql | grep -iv "label\|description\|note\|name"
```

**❌ FAIL if any of the following are stored as `TEXT` or `VARCHAR` instead of FK integers:**
- Substance / drug name
- Indication / condition
- Protocol type / modality
- Severity grade
- Instrument / assessment tool name
- Site tier / type

**The fix:** The field must be an FK integer referencing the corresponding `ref_` table:

```sql
-- WRONG (free text — degrades cross-site comparability)
modality TEXT,

-- CORRECT (FK integer to ref_ table)
modality_id INTEGER REFERENCES ref_modalities(modality_id),
```

### Why This Matters

Free-text benchmark fields cannot be compared across sites (different spellings, capitalization, abbreviations destroy joins). Correcting them after a benchmark table is seeded requires a destructive migration — the entire seeding pipeline must re-run.

**If any FK violation is found:** STOP. Return ticket to `02_TRIAGE` with `hold_reason: Benchmark FK Check — [field] must be FK integer referencing ref_[table] before this migration executes.`

---

## STEP 2: Banned Commands Check

```bash
grep -iE "drop\s+(table|column)|delete\s+from|truncate|alter\s+table.*drop|alter\s+table.*rename" migration.sql
```

**❌ Banned (will fail governance):**
- `DROP TABLE`
- `DROP COLUMN`
- `DELETE FROM` (in migrations)
- `TRUNCATE`
- `ALTER TABLE ... DROP`
- `ALTER TABLE ... RENAME`

**✅ Exception:** `DROP POLICY IF EXISTS` is REQUIRED (see Step 4).

---

## STEP 3: Idempotency Check

Every statement must be safe to re-run. The database may have been partially migrated.

```bash
# Check CREATE TABLE statements have IF NOT EXISTS
grep -n "^CREATE TABLE" migration.sql | grep -v "IF NOT EXISTS"
# Expected output: empty (all CREATE TABLEs must have IF NOT EXISTS)

# Check CREATE INDEX statements have IF NOT EXISTS
grep -n "^CREATE INDEX" migration.sql | grep -v "IF NOT EXISTS"
# Expected output: empty

# Check ALTER TABLE uses ADD COLUMN IF NOT EXISTS
grep -n "ADD COLUMN" migration.sql | grep -v "IF NOT EXISTS"
# Expected output: empty
```

**❌ FAIL if any output is returned from the above.**

---

## STEP 4: Policy Idempotency (CRITICAL — Most Common Failure)

`CREATE POLICY` will error with `42710` if the policy already exists. Every policy MUST be preceded by a `DROP POLICY IF EXISTS`.

```bash
# Count DROP POLICY IF EXISTS statements
DROP_COUNT=$(grep -c "DROP POLICY IF EXISTS" migration.sql)

# Count CREATE POLICY statements  
CREATE_COUNT=$(grep -c "CREATE POLICY" migration.sql)

echo "DROP: $DROP_COUNT | CREATE: $CREATE_COUNT"
# These numbers MUST be equal
```

**❌ FAIL if DROP_COUNT ≠ CREATE_COUNT.**

**Required pattern for every policy:**
```sql
DROP POLICY IF EXISTS "policy name" ON table_name;
CREATE POLICY "policy name" ON table_name FOR SELECT USING (...);
```

---

## STEP 5: RLS Completeness Check

Every new `log_*` table MUST have:
1. `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. A **SELECT** policy
3. An **INSERT** policy (users must be able to write data)

```bash
# Find all new log_* tables created
grep -n "CREATE TABLE IF NOT EXISTS log_" migration.sql

# For each table found, verify RLS is enabled
grep -n "ENABLE ROW LEVEL SECURITY" migration.sql

# Verify both SELECT and INSERT policies exist
grep -n "FOR SELECT" migration.sql
grep -n "FOR INSERT" migration.sql
```

**❌ FAIL if any `log_*` table is missing RLS ENABLE, SELECT policy, or INSERT policy.**

`ref_*` tables only require a SELECT policy (read-only reference data).

---

## STEP 5.5: Benchmark Suppression Check *(Required for `mv_` views only)*

**Trigger:** Run if the migration contains any `CREATE MATERIALIZED VIEW mv_` statement.

```bash
# Verify suppression clause exists in mv_ view definition
grep -n "HAVING COUNT" migration.sql
```

**❌ FAIL if:** The `mv_` view aggregates data across multiple sites or subjects AND has no `HAVING COUNT(DISTINCT subject_id) >= 5` (or equivalent) clause.

**Why:** Statistical conclusions drawn from cohorts of fewer than 5 subjects are clinically misleading and create re-identification risk. Every benchmark `mv_` view must suppress micro-cohorts.

**Correct pattern:**
```sql
-- Required for any mv_ with cross-site or cross-group comparison
HAVING COUNT(DISTINCT subject_id) >= 5
```

**If clause is missing:** Return ticket to `02_TRIAGE` with `hold_reason: Benchmark Suppression Check — mv_[name] aggregates subjects without HAVING COUNT >= 5 suppression.`

`ref_*` tables and `v_` views: this check does not apply.

---

## STEP 6: Banned Commands Final Scan

```bash
grep -iE "^\s*(DROP TABLE|TRUNCATE|DELETE FROM)" migration.sql
# Expected: empty
```

---

## INSPECTOR Pre-Handoff Checklist

Before moving any ticket to `03_BUILD` (from `02.5_PRE-BUILD_REVIEW`) or handing SQL to the User, INSPECTOR must append this completed checklist to the work order:

```
## INSPECTOR 02.5 CLEARANCE
- [ ] Step 1: Live table names verified via src/ grep or live Supabase query
- [ ] Step 1.5: Benchmark FK Check — all comparison fields are FK integers (N/A if not a benchmark table)
- [ ] Step 2: No banned commands found
- [ ] Step 3: All CREATE TABLE/INDEX use IF NOT EXISTS
- [ ] Step 4: DROP POLICY count == CREATE POLICY count (N/N)
- [ ] Step 5: All log_* tables have RLS ENABLE + SELECT + INSERT policies
- [ ] Step 5.5: Suppression clause (HAVING COUNT >= 5) present in all mv_ views (N/A if no mv_)
- [ ] Step 6: Final banned command scan clean
- [ ] Index types reviewed: [B-tree / Hash / Composite / Covering / Bitmap / Full-Text as appropriate]
- [ ] /analysis-first gate: Pre-conditions = YES | N/A (not a v_ or mv_ object)
Signed: INSPECTOR | Date: YYYY-MM-DD
```

**If any box is unchecked: DO NOT move to BUILD or hand to User. Fix first.**

---

## Quick Reference: Failure Modes by Error Code

| Postgres Error | Cause | Fix |
|---------------|-------|-----|
| `42710` | Duplicate policy name | Add `DROP POLICY IF EXISTS` before `CREATE POLICY` |
| `42P01` | Table doesn't exist (FK) | Verify table name via `grep -rn ".from('" src/` |
| `42601` | Syntax error | Review SQL syntax around the reported line |
| `23503` | FK violation | Parent table must exist before child table in file order |
| `42P07` | Duplicate table | Add `IF NOT EXISTS` to `CREATE TABLE` |
