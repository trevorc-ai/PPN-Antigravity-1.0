---
id: WO-206
title: "Service Layer Isolation — Split arcOfCareApi.ts into Domain Services"
status: 03_BUILD
owner: BUILDER
priority: HIGH
created: 2026-02-19
failure_count: 0
ref_tables_affected: none (refactor only)
---

## Problem

`src/services/arcOfCareApi.ts` is a monolith — 679 lines handling identity resolution, ref_ table reads, all log_ table writes, and validation helpers. As the system grows, every agent touches the same file.

## Target Architecture

```
src/services/
├── identity.ts        ← getCurrentSiteId(), generatePatientId()
├── vocabulary.ts      ← All ref_ reads + sessionStorage cache (24hr TTL)
├── clinicalLog.ts     ← All log_ table writes (one function per form)
├── analytics.ts       ← Aggregate queries, ALL with k-anonymity guard
├── quality.ts         ← Documentation completeness scoring (WO-209)
└── auth.ts            ← Existing authentication layer
```

## Rules for Each Service

### `identity.ts`
- ONLY exports: `getCurrentSiteId()`, `generatePatientId()`
- No other service bypasses this for patient/site resolution

### `vocabulary.ts`
- Every ref_ table fetch is wrapped: check sessionStorage → if stale, fetch Supabase → cache result
- Cache key format: `ppn_ref_[table_name]_[siteId]`
- TTL: 24 hours
- Exports one function per ref_ table: `getSessionFocusAreas()`, `getHomeworkTypes()`, etc.

### `clinicalLog.ts`
- All `createX()` functions from current `arcOfCareApi.ts`
- Every function validates array FK IDs against the cached ref_ data from `vocabulary.ts`
- Every function wraps in try/catch — never throws to the caller

### `analytics.ts`
- All aggregate queries
- EVERY query MUST have `HAVING COUNT(DISTINCT patient_id) >= 5` (k-anonymity floor)
- Comment on every function: `// k-anon: minimum 5 distinct patients`

## Migration Path

1. Create the 4 new files with their functions moved out of arcOfCareApi.ts
2. Update `arcOfCareApi.ts` to re-export everything (backward compat while consumers update)
3. Update `WellnessFormRouter.tsx` imports to use new service files
4. Delete `arcOfCareApi.ts` re-exports once all consumers are updated

## Acceptance Criteria

- [ ] TypeScript compiles with zero errors after split
- [ ] `vocabulary.ts` caches ref_ data — confirmed by checking sessionStorage in browser devtools
- [ ] `analytics.ts` functions all have `HAVING COUNT(DISTINCT patient_id) >= 5`
- [ ] `arcOfCareApi.ts` can be deleted without breaking any import
- [ ] INSPECTOR code review: no service imports another service directly (all through identity.ts for patient context)
