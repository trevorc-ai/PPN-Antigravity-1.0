---
name: query-optimizer
description: Analyzes query performance using EXPLAIN ANALYZE before deployment
---

# Query Optimizer

## Purpose
Ensure queries are performant before adding to production.

## Usage
Run `EXPLAIN ANALYZE` on all complex queries:

```sql
EXPLAIN ANALYZE
SELECT * FROM log_clinical_records WHERE substance_id = 1;
```

## Performance Targets
- Sequential scans on large tables: ❌ BAD
- Index scans: ✅ GOOD
- Execution time < 100ms for typical queries

## Quick Commands
```sql
-- Check if indexes are being used
EXPLAIN SELECT * FROM log_clinical_records WHERE substance_id = 1;

-- Full analysis with timing
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

## Red Flags
- "Seq Scan" on tables with >1000 rows
- Execution time > 1 second
- No index usage on JOIN conditions
