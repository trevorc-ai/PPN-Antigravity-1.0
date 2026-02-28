---
id: WO-515
title: "Analytics — Fix NaN% on Network Efficiency KPI"
status: 00_INBOX
owner: PENDING
priority: P0
failure_count: 0
created: 2026-02-27
reporter: USER
---

## User Request (verbatim)

> "Analytics shows NaN%"

## Problem Statement

The **Network Efficiency** KPI card on `src/pages/Analytics.tsx` displays `NaN%` instead of a numeric value.

### Root Cause — Located in `src/hooks/useAnalyticsData.ts`

**Primary path (mv_clinic_benchmarks):** The `success_rate` column returned from `mv_clinic_benchmarks` can be `null` or `undefined` for new practitioners with no session data. The calculation:

```ts
const avgSuccessRate = benchmarkData.length > 0
    ? benchmarkData.reduce((sum, row) => sum + (row.success_rate || 0), 0) / benchmarkData.length
    : 0;
const efficiency = avgSuccessRate * 100;
```

When `avgSuccessRate` equals `NaN` (due to an upstream `null / 0` division or nullable column), `efficiency` becomes `NaN`, and `Math.round(NaN * 10) / 10` stays `NaN`.

The return statement `data?.networkEfficiency || 0` does NOT catch `NaN` because `NaN || 0` evaluates to `0` in JavaScript... but `NaN` is falsy only in some contexts. More precisely, `NaN || 0 === 0` IS correct in JS, so the bug is that `networkEfficiency` is reaching the template literal as `NaN` before the fallback fires — meaning the data object itself holds `NaN`.

**The fix required:** Add an `isNaN()` / `Number.isFinite()` guard at the point where `efficiency` is computed and where `networkEfficiency` is returned.

## Acceptance Criteria

1. `networkEfficiency` **must never be `NaN`**. It must always be a valid finite number (default `0`).
2. Fix the guard in **both** the primary path (mv_clinic_benchmarks) and the fallback path (raw tables) inside `useAnalyticsData.ts`.
3. The return statement must use `Number.isFinite(data?.networkEfficiency) ? data.networkEfficiency : 0` instead of `data?.networkEfficiency || 0` to correctly reject `NaN`.
4. The KPI card must display `0%` (not `NaN%`) when there is no data.
5. No mock or hardcoded numbers may be introduced — the fix is purely defensive math.

## Files in Scope

- `src/hooks/useAnalyticsData.ts` — **only this file**

## Out of Scope

- Do NOT change `Analytics.tsx`.
- Do NOT change the database schema or materialized views.
- Do NOT alter any other hook or component.
