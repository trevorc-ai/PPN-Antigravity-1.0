---
name: database-schema-validator
description: Validates SQL migration files for banned commands and naming conventions before execution
---

# Database Schema Validator

## Purpose
Automatically check SQL files for governance violations before running them.

## Usage
Before executing any SQL migration, run this validation:

```bash
# Check a migration file
grep -E "(DROP TABLE|DROP COLUMN|DELETE FROM|TRUNCATE|ALTER TABLE.*DROP|ALTER TABLE.*RENAME)" migration.sql
```

## Validation Rules

### ❌ Banned Commands
- `DROP TABLE`
- `DROP COLUMN`
- `DELETE FROM` (in migrations)
- `TRUNCATE`
- `ALTER TABLE ... DROP`
- `ALTER TABLE ... RENAME`

### ✅ Required Patterns
- Table names: `snake_case`
- Use `IF NOT EXISTS` for idempotency
- Include RLS policies for patient-level tables

## Quick Check
```bash
# Returns violations or empty
grep -iE "drop\s+(table|column)|delete\s+from|truncate|alter.*drop|alter.*rename" file.sql
```

If violations found: STOP and review against DATABASE_GOVERNANCE_RULES.md
