# Execution Guide (Plain English)

This is the exact order to run the operator pack.

## 1) Local Docker run (first)

From repo root:

```bash
export DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
cd supabase/operator-pack-docker-first
chmod +x run_local.sh
./run_local.sh
```

What this gives you:
- one run per SQL file
- logs in `supabase/operator-pack-docker-first/logs`
- immediate stop if any SQL fails

If local fails:
- stop
- fix issue
- rerun locally

Do not move to staging until local is clean.

## 2) Staging run (second)

Set staging URL, then run SQL files in the same order:

1. `seed/00_sanitized_seed.sql` (optional in staging, usually skip)
2. `sql/01_rls_audit.sql`
3. `sql/02_rls_remediation.sql`
4. `sql/01_rls_audit.sql` (again, to confirm changes)
5. `sql/03_append_only_verification.sql`
6. `sql/04_view_contract_assertions.sql`
7. `sql/05_perf_explain_checks.sql`

Use `staging_checklist.md` while you run.

If any stop condition hits, do not promote.

## 3) Production run (last)

Use `production_cutover_checklist.md` and run:

1. `sql/01_rls_audit.sql` (baseline capture)
2. `sql/02_rls_remediation.sql`
3. `sql/01_rls_audit.sql` (confirm expected policy state)
4. `sql/03_append_only_verification.sql`
5. `sql/04_view_contract_assertions.sql`
6. `sql/05_perf_explain_checks.sql` (targeted smoke check)

If rollback is needed, run:

`sql/06_rollback.sql`

Then re-run `sql/01_rls_audit.sql` to confirm rollback state.

## 4) What to send back for review

After each environment run, send:
- the SQL output logs
- any error text
- explain plan output
- go/no-go decision

I can then review and tell you exactly what to fix next.
