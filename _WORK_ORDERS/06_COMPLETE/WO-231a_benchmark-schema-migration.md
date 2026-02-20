---
id: WO-231a
title: "Global Benchmark Tables — SQL Migration (Child of WO-231)"
status: 06_COMPLETE
owner: COMPLETE
parent: WO-231
created: 2026-02-20
created_by: LEAD
completed: 2026-02-20
failure_count: 0
priority: HIGH
tags: [database, migration, benchmark, rls, soop]
---

# WO-231a: SQL Migration 059 — Global Benchmark Tables
**Owner: SOOP | Parent: WO-231 | Pipeline: `.agent/workflows/data-seeding-pipeline.md`**

---

## SOOP Instructions

1. Read `.agent/skills/database-schema-validator/SKILL.md` before writing any SQL
2. Read `.agent/workflows/data-seeding-pipeline.md` Stage 2 for full SQL spec
3. Create `migrations/059_global_benchmark_tables.sql` with the three tables:
   - `benchmark_trials` — ClinicalTrials.gov import target
   - `benchmark_cohorts` — Published paper aggregate benchmarks
   - `population_baselines` — SAMHSA/population demographic context
4. All tables: `CREATE TABLE IF NOT EXISTS` (idempotent)
5. All tables: `ENABLE ROW LEVEL SECURITY`
6. RLS policy: SELECT for `auth.role() = 'authenticated'` only — no INSERT/UPDATE for app users
7. Indexes on: `modality`, `condition`, `instrument`, `(modality, condition)`, `(source, year)`
8. Migration number: **059** — do not use any other number
9. Run migration-manager skill to verify against live schema before handoff

## Acceptance Criteria
- [ ] File exists at `migrations/059_global_benchmark_tables.sql`
- [ ] All three tables created with `IF NOT EXISTS`
- [ ] UUIDs as primary keys using `gen_random_uuid()`
- [ ] RLS enabled and policies present on all three tables
- [ ] No `DROP`, `TRUNCATE`, `ALTER COLUMN TYPE` statements
- [ ] Passes schema-validator skill checks
- [ ] Migration is idempotent (can run twice with no error)

## Handoff
When done: update frontmatter `status: 04_QA`, `owner: INSPECTOR`
Move ticket to `_WORK_ORDERS/04_QA/`
