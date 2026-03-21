# Docker-First DB Operator Pack

This pack gives you a safe way to test database changes before production.

## What this pack does

1. Checks your current RLS setup for risky overlaps
2. Applies safer RLS rules
3. Tests append-only protections
4. Confirms protocol-detail view contracts
5. Captures basic query plans for performance checks
6. Provides rollback SQL if you need to undo changes

## File order

Run these in order:

1. `seed/00_sanitized_seed.sql`
2. `sql/01_rls_audit.sql`
3. `sql/02_rls_remediation.sql`
4. `sql/03_append_only_verification.sql`
5. `sql/04_view_contract_assertions.sql`
6. `sql/05_perf_explain_checks.sql`

Rollback file:

- `sql/06_rollback.sql`

## Quick start

Use the helper script:

```bash
cd supabase/operator-pack-docker-first
chmod +x run_local.sh
./run_local.sh
```

## Requirements

- Docker running
- Local Postgres/Supabase available
- `psql` installed
- `DATABASE_URL` set

Example:

```bash
export DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
```

## Stop conditions (do not promote)

- Cross-site data reads/writes are possible when they should not be
- `UPDATE` or `DELETE` works on governed append-only tables
- Any required `vw_protocol_detail_*` view is missing required columns
- Query plans regress badly vs your baseline
