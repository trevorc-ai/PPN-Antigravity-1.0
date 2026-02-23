# 🔒 DATABASE GOVERNANCE CHARTER
**STATUS: IMMUTABLE — READ-ONLY AFTER CREATION**
**Authority: INSPECTOR + USER (Admin) ONLY**
**Effective: 2026-02-22**
**Supersedes: DATABASE_INTEGRITY_POLICY.md (partial), schema-change-policy.md (partial)**

---

> ⚠️ MANDATORY SESSION START READ: Every agent MUST read this document at the start of any session that could touch the database. No exceptions. Claim you read it or INSPECTOR will reject your work order.

---

## 1. THE IRON RULE — Who May Write to the Database

```
┌─────────────────────────────────────────────────────────────┐
│  DATABASE WRITE/CREATE/ALTER AUTHORITY                      │
│                                                             │
│  ✅ AUTHORIZED:   USER (Admin / trevorcalton)               │
│  ✅ AUTHORIZED:   INSPECTOR (on USER's explicit delegation) │
│                                                             │
│  ❌ UNAUTHORIZED: SOOP                                      │
│  ❌ UNAUTHORIZED: BUILDER                                   │
│  ❌ UNAUTHORIZED: LEAD                                      │
│  ❌ UNAUTHORIZED: PRODDY                                    │
│  ❌ UNAUTHORIZED: DESIGNER                                  │
│  ❌ UNAUTHORIZED: MARKETER                                  │
│  ❌ UNAUTHORIZED: ANALYST                                   │
│  ❌ UNAUTHORIZED: CUE                                       │
└─────────────────────────────────────────────────────────────┘
```

**This has not changed historically — it was always the intention. This charter makes it explicit, codified, and enforced at the agent-instruction level.**

---

## 2. WHAT "DATABASE WRITE/CREATE" MEANS

The following actions require USER or INSPECTOR authorization:

| Action | Requires Authorization |
|--------|----------------------|
| `CREATE TABLE` | ✅ YES |
| `ALTER TABLE` | ✅ YES |
| `INSERT INTO` (any table) | ✅ YES |
| `CREATE INDEX` | ✅ YES |
| `ALTER TABLE ENABLE ROW LEVEL SECURITY` | ✅ YES |
| `CREATE POLICY` | ✅ YES |
| `DROP POLICY IF EXISTS` | ✅ YES (required step in authorized migration) |
| `SELECT` queries (read-only) | ✅ Agents may request; is always allowed |
| Writing a `.sql` migration file locally | ✅ SOOP may WRITE the file; may NOT EXECUTE it |

**The key distinction:** Agents may PROPOSE and WRITE `.sql` migration files as work product. They may NEVER EXECUTE those files. Execution is exclusively a USER action run in the Supabase SQL Editor or via an INSPECTOR-authorized command.

---

## 3. THE AUTHORIZED PIPELINE — How Database Changes Get Made

```
SOOP writes migration file → INSPECTOR reviews & validates → USER executes in Supabase SQL Editor
        ↑                            ↑                               ↑
  Work product only           Approval gate                 The ONLY execution path
  (a text file)               (charter compliance)          (no agents, no automation)
```

### Step-by-Step (No Shortcuts)

1. **CUE/LEAD** creates a work order ticket with the database change request.
2. **SOOP** performs the live pre-flight (verification queries — asks USER to run in Supabase and paste results).
3. **SOOP** writes the `.sql` migration file to `migrations/` with the next sequential number.
4. **SOOP** runs the 6-step `database-schema-validator` self-audit on the file (checks idempotency, banned commands, RLS completeness, policy count parity).
5. **SOOP** moves the ticket to `04_QA` with the checklist completed.
6. **INSPECTOR** performs final review: banned commands scan, naming conventions, RLS completeness, data integrity rules, charter compliance.
7. **INSPECTOR** issues [STATUS: PASS] OR [STATUS: FAIL] with specific required fixes.
8. **USER** is handed the approved `.sql` file and explicitly runs it in the Supabase SQL Editor.
9. **USER** confirms execution succeeded (pastes the result, or confirms no errors).
10. **INSPECTOR** logs the migration as executed in `SCHEMA_VERSION.md`.

**Any deviation from this pipeline = the change does not happen. Period.**

---

## 4. FORBIDDEN ACTIONS — Every Agent Must Memorize These

### ❌ NEVER DO THESE (Any Agent)

```
❌ Execute a .sql file via CLI (supabase db push, psql, or any scripted runner)
❌ Run migrations via run-migrations.js, run-migrations.ts, or any script
❌ INSERT data directly into ANY table from an agent work session
❌ Modify an existing migration file that has already been executed
❌ CREATE or DROP tables without an approved work order
❌ Change a column type (ever — additive only)
❌ RENAME a table or column (ever)
❌ DROP a table or column (ever — use is_active = false instead)
❌ Run `supabase db reset` or any command that resets state
❌ Create "test data" or "demo data" in log_* tables
❌ Assume a table exists from a migration file — live verification only
```

### ❌ BUILDER-SPECIFIC FORBIDDEN ACTIONS

```
❌ BUILDER may not write .sql migration files (that is SOOP's domain)
❌ BUILDER may not add tables to the database directly via Supabase client admin calls
❌ BUILDER may not add RLS policies via application code
❌ BUILDER may not bypass identity.ts / patient context for any database write
```

### ❌ SOOP-SPECIFIC FORBIDDEN ACTIONS

```
❌ SOOP may not execute its own migration files
❌ SOOP may not INSERT seed data into ref_* tables without explicit written USER authorization in the work order
❌ SOOP may not write a migration against a table it has not confirmed live via USER-run verification query
```

---

## 5. DATA WRITE AUTHORIZATION TIERS

### Tier 1 — Never Allowed (Any Source)
- `INSERT` into `log_*` tables from migrations
- `INSERT` of fake/synthetic/test clinical data
- `INSERT` into `log_*` tables by agents (data entry goes through the application UI only)

### Tier 2 — Allowed Only With Explicit Written USER Authorization in the Work Order Ticket
- `INSERT` into `ref_*` tables (controlled vocabulary)
- Any new `CREATE TABLE`
- Any `ALTER TABLE` (adding columns)
- Any new index creation

### Tier 3 — Always Required on Every Migration
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` (every new table)
- `DROP POLICY IF EXISTS` before every `CREATE POLICY` (idempotency)
- `CREATE POLICY` for SELECT on every new table
- `CREATE POLICY` for INSERT on every new `log_*` table

---

## 6. INSPECTOR ENFORCEMENT PROTOCOL

INSPECTOR must perform these checks on every database-related work order BEFORE issuing [STATUS: PASS]:

### DB-Specific QA Checklist (append to ticket)

```markdown
## INSPECTOR DB GOVERNANCE AUDIT

### Charter Compliance
- [ ] Migration was written by SOOP (not BUILDER, not LEAD, not another agent)
- [ ] Migration was NOT executed by any agent (USER execution only)
- [ ] Live schema pre-flight was run and results pasted in the ticket
- [ ] USER explicitly authorized this change in the work order

### Data Integrity
- [ ] No INSERT into log_* tables in any migration
- [ ] No fake/test/demo data in any INSERT statement
- [ ] All ref_* INSERTs have explicit USER authorization cited in ticket

### Banned Commands Scan
- [ ] grep for DROP TABLE → zero results
- [ ] grep for DROP COLUMN → zero results  
- [ ] grep for DELETE FROM → zero results
- [ ] grep for TRUNCATE → zero results
- [ ] grep for ALTER TABLE.*RENAME → zero results
- [ ] grep for ALTER TABLE.*RENAME COLUMN → zero results

### RLS Completeness
- [ ] Every new log_* table has ENABLE ROW LEVEL SECURITY
- [ ] Every new log_* table has a SELECT policy
- [ ] Every new log_* table has an INSERT policy
- [ ] Every new ref_* table has a SELECT policy (authenticated read)
- [ ] DROP POLICY IF EXISTS count equals CREATE POLICY count

### Idempotency
- [ ] All CREATE TABLE use IF NOT EXISTS
- [ ] All CREATE INDEX use IF NOT EXISTS
- [ ] All ADD COLUMN use IF NOT EXISTS

### Naming Conventions
- [ ] All new tables follow log_* or ref_* convention
- [ ] All columns use snake_case
- [ ] No SELECT * in migration
```

---

## 7. THE FIVE HARD VERIFICATION COMMANDS

INSPECTOR must run these exact commands on every migration before [STATUS: PASS]:

```bash
# 1. Banned command scan
grep -iE "^\s*(DROP TABLE|DROP COLUMN|DELETE FROM|TRUNCATE|ALTER TABLE.*RENAME)" migrations/NNN_*.sql
# Expected: EMPTY

# 2. No INSERT into log_ tables
grep -iE "INSERT INTO log_" migrations/NNN_*.sql
# Expected: EMPTY

# 3. Idempotency — no bare CREATE TABLE
grep -n "^CREATE TABLE " migrations/NNN_*.sql | grep -v "IF NOT EXISTS"
# Expected: EMPTY

# 4. Policy parity
echo "DROP count: $(grep -c 'DROP POLICY IF EXISTS' migrations/NNN_*.sql)"
echo "CREATE count: $(grep -c 'CREATE POLICY' migrations/NNN_*.sql)"
# Expected: numbers MATCH

# 5. RLS enabled on all new log_ tables
for table in $(grep -oP "CREATE TABLE IF NOT EXISTS log_\K\w+" migrations/NNN_*.sql); do
  echo "Checking RLS for: $table"
  grep "ENABLE ROW LEVEL SECURITY" migrations/NNN_*.sql | grep "$table" || echo "❌ MISSING RLS: $table"
done
# Expected: No ❌ lines
```

---

## 8. REAL-TIME SAFEGUARDS SUMMARY

| Safeguard | Type | Enforced By |
|-----------|------|-------------|
| USER executes all migrations manually | Process | USER + INSPECTOR protocol |
| SOOP writes, never executes | Role boundary | All agents + INSPECTOR rejection |
| Live schema verification before SQL | Protocol | database-schema-validator SKILL.md |
| 6-step pre-handoff checklist | Protocol | SOOP self-audit + INSPECTOR audit |
| Banned command scan (grep) | Automated check | INSPECTOR (Step 6 above) |
| RLS completeness check | Automated check | INSPECTOR (Step 6 above) |
| No INSERT log_* in migrations | Data rule | DATABASE_INTEGRITY_POLICY.md + this charter |
| Additive-only schema | Architectural rule | ARCHITECTURE_CONSTITUTION.md Section 7 |
| Charter compliance field in tickets | Ticket structure | Every work order with DB scope |
| SCHEMA_VERSION.md as execution log | Audit trail | INSPECTOR logs after USER confirms execution |

---

## 9. WHAT HAPPENS WHEN THIS IS VIOLATED

If ANY agent (including SOOP) executes a database change without USER authorization:

1. **STOP all work immediately.**
2. **INSPECTOR declares a P0 database incident.**
3. **USER is notified with the exact command that was run.**
4. **INSPECTOR runs a database audit** to determine the extent of unauthorized changes.
5. **Rollback is evaluated** — if data was inserted, USER decides whether to delete it.
6. **The work order that triggered it receives `failure_count: 99`** (permanent fail status).
7. **LEAD must document the incident in `SCHEMA_VERSION.md`** under a "Security Incidents" heading.

---

## 10. ACKNOWLEDGMENT REQUIREMENT

Every agent that reads this charter must append an acknowledgment to any work order they touch that involves database scope:

```markdown
## AGENT DB CHARTER ACKNOWLEDGMENT
- Agent: [AGENT NAME]
- Date Read: [DATE]
- Scope of this ticket touching DB: [YES/NO — and if YES, what tables]
- USER authorization confirmed in this ticket: [YES/NO]
- I will NOT execute SQL: ✅ Confirmed
```

---

**Charter Owner:** INSPECTOR  
**Authorized to modify:** USER (Admin) only  
**Review cycle:** After every P0 database incident  
**Last Updated:** 2026-02-22  
**Hash of last authorized edit:** (USER signs off by committing this file)
