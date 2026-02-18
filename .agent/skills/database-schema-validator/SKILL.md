---
name: database-schema-validator
description: Validates SQL migration files for banned commands, naming conventions, live schema alignment, idempotency, and RLS completeness before execution. MANDATORY for SOOP before any handoff.
---

# Database Schema Validator

## Purpose
Catch SQL errors **before** they reach the user's database. This skill must be run by SOOP on every migration file before moving a ticket to 04_QA.

---

## STEP 1: Live Schema Verification (MANDATORY FIRST STEP)

Before writing any FK references, SOOP must verify actual live table names by checking the source code — **never assume from local migration files**.

```bash
# Find all table names the app actually queries
grep -rn "\.from('" src/ | grep -v ".DS_Store" | sed "s/.*\.from('//;s/').*//" | sort -u
```

**Rule:** If a table name appears in `src/` queries, it exists in the live DB. Use those exact names in FKs and RLS policies.

### ✅ Verified Live Table Map (2026-02-17 — source of truth)

| Category | Live Table Name | Notes |
|----------|----------------|-------|
| **Sites** | `log_sites` | Has data. `sites` is empty legacy artifact — DO NOT USE |
| **User-Site Links** | `log_user_sites` | Active RLS table. `user_sites` is empty legacy artifact — DO NOT USE |
| **Clinical Sessions** | `log_clinical_records` | Core session table. `dosing_sessions` does not exist |
| **User Profiles** | `log_user_profiles` | `patients` does not exist |
| **Baseline Assessments** | `log_baseline_assessments` | `baseline_assessments` does not exist |
| **Safety Events** | `log_safety_events` | `safety_events` does not exist |
| **Session Vitals** | `log_session_vitals` | Active |
| **Pulse Checks** | `log_pulse_checks` | Active |
| **Longitudinal Assessments** | `log_longitudinal_assessments` | Active |
| **Red Alerts** | `log_red_alerts` | Active |
| **System/Audit Logs** | `log_system_events` | `audit_logs` does not exist |
| **Subscriptions** | `log_user_subscriptions` | `user_subscriptions` does not exist |
| **Interventions** | `log_interventions` | Active |
| **Patient Flow** | `log_patient_flow_events` | Active |

**Common traps in this codebase:**
- `sites` and `user_sites` exist but are **empty legacy artifacts** — never reference them
- The `log_` prefix is NOT universal — `ref_*` tables never use it
- Always verify before writing `REFERENCES table_name(column)`

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
