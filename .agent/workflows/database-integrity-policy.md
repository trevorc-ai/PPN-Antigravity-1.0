---
description: CRITICAL - Database data integrity policy
---

# 🚨 DATABASE INTEGRITY POLICY 🚨

## GOLDEN RULE

**Reference tables (`ref_*`):** ✅ Seed with real data  
**Log tables (`log_*`):** ❌ NEVER seed with fake data

## WHY THIS MATTERS

Log tables contain REAL CLINICAL DATA entered by practitioners. Fake data:
- Corrupts analytics and research outcomes
- Violates regulatory compliance
- Breaks practitioner trust
- Creates PHI compliance risks

## FOR ALL AGENTS

Before creating ANY migration that touches `log_*` tables:

**Ask yourself:**
1. Is this real data entered by a practitioner? If NO → STOP
2. Am I trying to "help" by creating test data? If YES → STOP
3. Are visualizations empty and I want to populate them? If YES → STOP

**Empty visualizations are CORRECT until real data exists.**

## ENFORCEMENT

- All agents must read `DATABASE_INTEGRITY_POLICY.md` before database work
- Never create migrations that INSERT into `log_*` tables
- Challenge any work order requesting fake clinical data
- Escalate to LEAD if unsure

**Violations = immediate rollback + database audit**

---

## 🔒 MIGRATION CONSTRAINT RULES (Added 2026-02-25 — Learned from 066 series)

### Rule 1: Pre-flight data check MANDATORY before any ADD CONSTRAINT

Before writing `ADD CONSTRAINT ... CHECK (col IN (...))`, you MUST run:

```sql
SELECT col_name, COUNT(*)
FROM the_table
GROUP BY col_name
ORDER BY col_name;
```

Paste the result into the ticket. If any value falls outside the proposed CHECK values,
you MUST clean the data FIRST in a separate migration before adding the constraint.
**No exceptions. INSPECTOR will reject any ADD CONSTRAINT without pre-flight evidence.**

### Rule 2: One concern per migration file

Never bundle these in the same file:
- Data normalization UPDATEs + schema constraint changes
- FK reference changes + column nullability changes
- Multiple tables with independent failure modes

Supabase SQL Editor runs scripts as single transactions. One failure rolls back everything.
File per concern = one failure cannot drag down unrelated changes.

### Rule 3: Verify FK column names before writing REFERENCES

Before writing `REFERENCES some_ref_table(id)`, run:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'some_ref_table'
ORDER BY ordinal_position;
```

Ref tables in this codebase do NOT use generic `id` — they use named PKs like
`severity_grade_id`, `resolution_status_id`, `substance_id`, etc.

### Rule 4: Confirm live schema before writing any FK

Never assume a table's PK column name. Always inspect first.
Run the query. Paste the result. Then write the SQL.

### Rule 5: Include inline verification SELECT at the bottom of every migration

Every migration file must end with commented-out (or live) SELECT queries that
prove the migration applied correctly. The user runs these immediately after the
migration to confirm before marking complete.

---

See full policy: `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/DATABASE_INTEGRITY_POLICY.md`
