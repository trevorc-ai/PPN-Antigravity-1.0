---
name: database-schema-validator
description: Validates SQL migration files for banned commands, naming conventions, live schema alignment, idempotency, and RLS completeness before execution. MANDATORY for SOOP before any handoff.
---

# Database Schema Validator

## Purpose
Catch SQL errors **before** they reach the user's database. This skill must be run by SOOP on every migration file before moving a ticket to 04_QA.

---

## 🛑 STEP 1: MANDATORY LIVE SCHEMA VERIFICATION — HARD STOP

**THIS STEP CANNOT BE SKIPPED. SOOP MUST NOT WRITE A SINGLE LINE OF SQL UNTIL THIS IS COMPLETE.**

Do NOT rely on any hardcoded table list, any prior session's notes, or any migration file to determine what tables exist. Migrations are intentions — they may never have been executed. Only the live database is truth.

### Required Action Before Any SQL Is Written:

**Give the user these two queries and ask them to run them in Supabase SQL Editor. Paste the results into the ticket before proceeding.**

```sql
-- Query 1: List all live tables in the public schema
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Query 2: If working with a specific table, confirm its columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'YOUR_TABLE_NAME_HERE'
ORDER BY ordinal_position;
```

**Rule: If SOOP cannot confirm a table exists via live query output pasted into the ticket, SOOP treats it as non-existent. Period.**

### Why the Old Table Map Was Removed:
A hardcoded table list dated 2026-02-17 was previously here. It was stale. It listed tables that never existed in the live DB (e.g., `ref_medications` was assumed to exist because a migration file referenced it — it was never actually created). This caused SOOP to write migrations against phantom tables.

### STOP Check — Paste answer to ALL of these before writing SQL:

```
## SOOP Live Schema Pre-Flight (MANDATORY — paste real query output here)
- [ ] Query 1 run: [PASTE TABLE LIST HERE]
- [ ] Table I am modifying/creating confirmed: [TABLE NAME] → EXISTS / DOES NOT EXIST
- [ ] All FK targets confirmed live (list each one): [TABLE: status]
- [ ] Column I am adding/modifying confirmed to not already exist: [COLUMN: status]
```

**If any FK target does not exist in the live query output: STOP. Create a ticket to build that table first. Do not write the downstream migration.**

---

### Quick Grep Check (for columns/tables the app already uses)

```bash
# Find all table names the app actually queries in src/
grep -rn "\.from('" src/ | grep -v ".DS_Store" | sed "s/.*\.from('//;s/').*//" | sort -u
```

This tells you what the app expects to query. Cross-reference with the live query output above. If the app queries a table that doesn't appear in the live list — that is a bug to report, not a table to assume exists.

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

## STEP 6: Banned Commands Final Scan

```bash
grep -iE "^\s*(DROP TABLE|TRUNCATE|DELETE FROM)" migration.sql
# Expected: empty
```

---

## SOOP Pre-Handoff Checklist

Before moving any ticket to 04_QA, SOOP must append this completed checklist to the work order:

```
## SOOP Pre-Flight Checklist
- [ ] Step 1: Live table names verified via src/ grep
- [ ] Step 2: No banned commands found
- [ ] Step 3: All CREATE TABLE/INDEX use IF NOT EXISTS
- [ ] Step 4: DROP POLICY count == CREATE POLICY count (N/N)
- [ ] Step 5: All log_* tables have RLS ENABLE + SELECT + INSERT policies
- [ ] Step 6: Final banned command scan clean
```

**If any box is unchecked: DO NOT move to QA. Fix first.**

---

## Quick Reference: Failure Modes by Error Code

| Postgres Error | Cause | Fix |
|---------------|-------|-----|
| `42710` | Duplicate policy name | Add `DROP POLICY IF EXISTS` before `CREATE POLICY` |
| `42P01` | Table doesn't exist (FK) | Verify table name via `grep -rn ".from('" src/` |
| `42601` | Syntax error | Review SQL syntax around the reported line |
| `23503` | FK violation | Parent table must exist before child table in file order |
| `42P07` | Duplicate table | Add `IF NOT EXISTS` to `CREATE TABLE` |
