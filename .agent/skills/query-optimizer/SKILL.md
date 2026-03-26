---
name: query-optimizer
description: Analyzes query performance using EXPLAIN ANALYZE before deployment. Enforces the four-layer analytical architecture contract (log_/ref_/v_/mv_) and mandatory suppression rules for benchmark queries.
---

# Query Optimizer

## Purpose
Ensure queries are performant and architecturally correct before adding to production. Two responsibilities: (1) performance validation, (2) analytical layer contract enforcement.

---

## Section 1 — Analytical Layer Rules *(run before any v_ or mv_ view SQL)*

### The Four-Layer Contract

`v_` and `mv_` objects are the only legitimate data sources for analytics UI components. Components reading directly from `log_` tables or from `MOCK_*` constants (when a view exists) are architectural violations.

| View Type | Correct Source | Example Consumer |
|-----------|---------------|-----------------|
| `v_` analytical view | Joins over `log_` + `ref_` tables | Real-time dashboards |
| `mv_` materialized view | Pre-computed from `v_` views | Benchmark comparisons, risk queues |
| Direct `log_` query | ❌ Not for analytics UI | Use only for transactional reads inside form submission flows |

### Mock Data Sunset — Mandatory Check

Before writing any `v_` or `mv_` view, verify which UI component it will replace:

```bash
# Find which components still import analyticsData mock constants
grep -rn "analyticsData\|MOCK_" src/components/ src/pages/ --include="*.tsx" -l
```

The WO creating a view is **incomplete** until the consuming component is updated to read from the live view. State explicitly in the `analysis-first` output block which `MOCK_*` constant is being replaced.

### Suppression Rule (Mandatory for Benchmark Queries)

Any `mv_` view used for cross-site comparisons must suppress groups below n=5:

```sql
-- Correct benchmark suppression pattern
SELECT
  site_id,
  substance_id,
  AVG(outcome_score) AS avg_outcome,
  COUNT(DISTINCT subject_id) AS cohort_size
FROM v_patient_episode_summary
GROUP BY site_id, substance_id
HAVING COUNT(DISTINCT subject_id) >= 5;  -- suppress micro-cohorts
```

**❌ FAIL if:** A benchmark view has no `HAVING COUNT(...) >= 5` clause and comparison groups could be under 5. Statistical conclusions on micro-cohorts are clinically misleading.

---

## Section 2 — Performance Validation

### Run EXPLAIN ANALYZE on All Complex Queries

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM v_patient_episode_summary
WHERE site_id = 'YOUR_SITE_UUID'
ORDER BY episode_date DESC
LIMIT 100;
```

### Performance Targets

| Metric | Target | Action if Exceeded |
|--------|--------|--------------------|
| Execution time | < 100ms for typical queries | Add index or rewrite join |
| `mv_` refresh time | < 30 seconds | Partition or pre-aggregate |
| Row estimate accuracy | Within 2x of actual | Run `ANALYZE table_name` |

### Red Flags — Require Fix Before Deployment

- **Seq Scan** on any `log_*` table with > 1,000 rows → add B-tree index on the WHERE column
- **Execution time > 1 second** for a UI-facing query → rewrite as `mv_` (materialized)
- **No index on JOIN conditions** → add composite index on `(site_id, subject_id)` or equivalent
- **Hash Join on large tables** without an index → confirm index exists or add covering index

### Quick Commands

```sql
-- Check execution plan
EXPLAIN SELECT * FROM log_clinical_records WHERE substance_id = 1;

-- Full timing + buffer analysis
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;

-- Check index usage on a table
SELECT indexname, indexdef FROM pg_indexes
WHERE tablename = 'log_clinical_records';

-- Update table statistics after bulk inserts
ANALYZE log_clinical_records;
```

### Index Type Reference

| Pattern | Recommended Index |
|---------|-----------------|
| Equality on single column (`WHERE site_id = ?`) | **B-tree** (default) |
| UUID / hash-style equality only | **Hash** |
| Multi-column WHERE + ORDER BY | **Composite B-tree** |
| All SELECT columns covered | **Covering** (include clause) |
| Low-cardinality flags (`is_active`, `phase`) | **Partial index** (`WHERE is_active = true`) |
| Full-text search on clinical notes | **GIN** (`tsvector`) |

---

## Pre-Deployment Checklist

```
QUERY OPTIMIZER REVIEW — [Date]
View/Query: [name]
Type: v_ / mv_ / direct log_ query
Analytical layer contract: PASS / FAIL — [reason]
Mock data replaced: [MOCK_CONSTANT] in [Component] / N/A
Suppression rule: INCLUDED / N/A (not a benchmark query)
EXPLAIN ANALYZE: PASS (<100ms) / FAIL ([timing] — [fix applied])
Index coverage: CONFIRMED / [index added]
Signed: INSPECTOR | Date: YYYY-MM-DD
```

---
*Extended 2026-03-25 per INSPECTOR SQL-Layers alignment audit. Adds analytical layer contract and suppression rule enforcement to the original EXPLAIN ANALYZE stub.*
