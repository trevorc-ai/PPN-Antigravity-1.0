---
description: Policy for making database schema changes
---

# Schema Change Policy

## 🚨 RULE ZERO — DOCKER-FIRST EXECUTION (NON-NEGOTIABLE)

**All migrations MUST be tested in the local Docker Supabase instance before touching the cloud database.**

This rule was established after a catastrophic destructive migration passed INSPECTOR review and
nearly destroyed live clinical data. See: `.agent/workflows/migration-execution-protocol.md`

**INSPECTOR must REJECT any ticket where this step was skipped. No exceptions. No shortcuts.**

---

## ⚠️ CRITICAL: Schema is Currently LOCKED

The database schema was stabilized on 2026-02-15 after critical remediation work. 

## Before Making ANY Schema Changes:

1. **STOP** - Read `SCHEMA_VERSION.md` in project root
2. **Review** - Check if change is absolutely necessary
3. **Document** - Create detailed migration plan
4. **Approve** - Get written approval from project lead
5. **Test** - Test migration on local database first
6. **Rollback** - Document rollback procedure
7. **Execute** - Only then proceed with change

## Forbidden Changes:

- ❌ Renaming tables
- ❌ Renaming columns
- ❌ Changing column types
- ❌ Dropping tables or columns
- ❌ Removing RLS policies

## Allowed Changes (with approval):

- ✅ Adding new tables (with correct `log_` or `ref_` prefix)
- ✅ Adding new columns (additive only)
- ✅ Adding new indexes
- ✅ Adding new RLS policies (not removing)

## Emergency Override:

If you MUST make a schema change, run:
```bash
git log --oneline SCHEMA_VERSION.md
```

This will show the schema lock history. Document your reason for override.
