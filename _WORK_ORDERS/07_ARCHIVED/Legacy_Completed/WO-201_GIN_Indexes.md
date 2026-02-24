---
id: WO-201
title: "GIN Indexes on All Array FK Columns"
status: 03_BUILD
owner: SOOP
priority: CRITICAL
created: 2026-02-19
failure_count: 0
ref_tables_affected: log_integration_sessions, log_baseline_assessments, log_clinical_records
---

## Problem

Postgres does NOT validate array FK contents against ref_ tables (known architectural limitation). More urgently: `INTEGER[]` columns queried with `WHERE 3 = ANY(session_focus_ids)` cause **full table scans** without a GIN index. At 10,000+ rows, these queries will time out.

## Columns Requiring GIN Indexes

```sql
-- log_integration_sessions
session_focus_ids INTEGER[]
homework_assigned_ids INTEGER[]
therapist_observation_ids INTEGER[]

-- log_baseline_assessments  
observation_ids INTEGER[]   -- if this column exists

-- log_clinical_records
concomitant_med_ids BIGINT[]
```

## SOOP Instructions

Write `migrations/060_gin_indexes.sql`:

```sql
CREATE INDEX IF NOT EXISTS idx_gin_session_focus_ids
    ON public.log_integration_sessions USING GIN (session_focus_ids);

CREATE INDEX IF NOT EXISTS idx_gin_homework_assigned_ids
    ON public.log_integration_sessions USING GIN (homework_assigned_ids);

CREATE INDEX IF NOT EXISTS idx_gin_therapist_observation_ids
    ON public.log_integration_sessions USING GIN (therapist_observation_ids);

CREATE INDEX IF NOT EXISTS idx_gin_concomitant_med_ids
    ON public.log_clinical_records USING GIN (concomitant_med_ids);
```

Also add cardinality CHECK constraints to prevent absurd arrays:
```sql
ALTER TABLE public.log_integration_sessions
  ADD CONSTRAINT chk_session_focus_limit CHECK (cardinality(session_focus_ids) <= 10),
  ADD CONSTRAINT chk_homework_limit CHECK (cardinality(homework_assigned_ids) <= 10),
  ADD CONSTRAINT chk_observations_limit CHECK (cardinality(therapist_observation_ids) <= 10);
```

## Acceptance Criteria

- [ ] GIN index exists on every `INTEGER[]` FK column in log_ tables
- [ ] EXPLAIN ANALYZE confirms index usage on `WHERE id = ANY(array_col)` queries
- [ ] Cardinality CHECK constraints prevent arrays > 10 items
- [ ] Migration is idempotent (IF NOT EXISTS throughout)
- [ ] Zero downtime (indexes build CONCURRENTLY or are fast enough on current data size)
