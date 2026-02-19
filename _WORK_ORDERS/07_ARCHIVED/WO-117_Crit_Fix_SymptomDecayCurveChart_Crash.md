---
work_order_id: WO-117
title: Critical Fix - SymptomDecayCurveChart Crash
type: BUG
category: CRITICAL FIX
priority: P0 (Immediate)
status: 03_BUILD
created: 2026-02-18T12:00:00-08:00
requested_by: BUILDER (QA Bot)
owner: PENDING
failure_count: 0
---

## 🚨 CRITICAL BUG REPORT

**Context:**
During Deep Crawl QA (WO-110), a "White Screen of Death" was observed on multiple pages (`/#/arc-of-care-phase3`, `/#/arc-of-care-dashboard`, `/#/meq30`, and others).

**Symptoms:**
- Blank screen on load.
- Console error pointing to `<SymptomDecayCurveChart>` component failure.

**Root Cause Analysis:**
- The component is likely trying to access properties of `undefined` or `null` data arrays before they are loaded.
- Lack of Error Boundary causes the entire app to unmount.

**Required Actions:**
1.  **Audit** `src/components/charts/SymptomDecayCurve.tsx` (or similar path).
2.  **Add Guard Clauses**: Ensure the component renders `null` or a "No Data" state if data is missing, instead of crashing.
3.  **Add Error Boundary**: Wrap the chart (or the page) in an Error Boundary.
4.  **Verify**: Ensure `/#/arc-of-care-phase3` loads without crashing.

**Dependencies:**
- None. Fix immediately.
