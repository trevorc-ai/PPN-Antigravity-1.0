---
id: WO-416
status: 99_COMPLETED
owner: SYSTEM
priority: P1
failure_count: 0
created: 2026-02-24
tags: [database, schema, compliance, rls, views, refactor]
---

# Benchmark Schema & View RLS Compliance Remediation

## Objective
Enforce the "Gold Standard" of the `DATABASE_INTEGRITY_POLICY.md` on the remaining tables in the database that violate the `log_` or `ref_` prefix convention or lack Row Level Security (RLS). 

## Context
During the resolution of `WO-414` (Waitlist Naming Violation), the database was transitioned to a local Supabase staging environment `npx supabase start`. Examining the local database list reveals the following remaining schema rule violations in the live schema:
1. `benchmark_cohorts` (Missing `ref_` prefix)
2. `benchmark_trials` (Missing `ref_` prefix)
3. `population_baselines` (Missing `ref_` prefix)
4. `sys_waitlist` (An orphaned waitlist table from an earlier, failed test migration. Needs immediate dropping).
5. Open Views lacking explicit permissions or tracking tags. 

## Acceptance Criteria
1. Draft additive-only SQL migration scripts (using `CREATE TABLE IF NOT EXISTS ref_<table_name>`) for the 3 benchmark reference tables.
2. Clone existing data using `INSERT INTO ... SELECT ...`. 
3. Apply RLS policies on the new `ref_` tables equivalent to the standard reference table permissions.
4. Update React components and APIs referencing `benchmark_trials`, `benchmark_cohorts`, or `population_baselines` to use their `ref_` counterparts.
5. Create a drop script to drop `sys_waitlist`.
6. Ensure views have appropriate RLS behavior enabled (or document why postgres views are implicitly secure if the underlying `log_` tables have RLS enforced).
7. Apply these migrations strictly utilizing the local staging environment (`npx supabase db push`).

## Constraints & Requirements
- **No `ALTER TABLE RENAME` allowed.** Migrations must be strictly additive.
- The `log_waitlist` is fully operational and must not be touched. 
- All database write changes must pass the internal `INSPECTOR` review prior to executing against production.

## BUILDER IMPLEMENTATION
- Drafted `20260224154000_benchmark_compliance.sql` using strict `IF EXISTS` logic across the board.
- The `ref_benchmark_trials`, `ref_benchmark_cohorts`, and `ref_population_baselines` explicitly duplicate the definitions from `migrations/059`.
- Created a `DO $$` block to systematically migrate the records out of the deprecated base names into the `ref_` tables if they exist.
- RLS specifically defined and re-applied to ensure the new prefixed tables remain tightly sealed for `SELECT` using authenticated roles.
- Indexes restored.
- Appended `ALTER VIEW SET (security_invoker = on)` on all views to securely inherit base table RLS natively and remove the warnings. 

## [STATUS: PASS] - INSPECTOR APPROVED
- `sys_waitlist` is permanently destroyed.
- Data integrity protocols successfully validated on the SQL.
- No React frontend code needed mutating because `src/lib/benchmarks.ts` was *already* querying `ref_` tables correctly despite the schema drift error on the table names! This instantly reconnects the frontend without breakage.
