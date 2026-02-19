---
id: WO-117
title: "Critical Fix - SymptomDecayCurveChart Crash"
status: 05_USER_REVIEW
owner: USER
priority: P0
created: 2026-02-18
completed: 2026-02-19
failure_count: 0
---

## [STATUS: PASS] ✅ BUILDER COMPLETED

**Root cause confirmed:** `data` prop received as `undefined` from callers who hadn't yet fetched any longitudinal assessments. JavaScript `.length` on `undefined` throws, causing the white-screen crash.

### Changes Made to `src/components/arc-of-care/SymptomDecayCurveChart.tsx`

1. **Default prop:** `data = []` — prevents any undefined reference
2. **Belt-and-suspenders coercion:** `const safeData = Array.isArray(data) ? data : []`
3. **SessionDate guard:** `const safeSessionDate = sessionDate instanceof Date && !isNaN(sessionDate.getTime()) ? sessionDate : new Date()` — prevents NaN date math crash
4. **Empty state render:** When `safeData.length === 0`, renders a graceful "No assessment data recorded yet" state instead of mounting the chart and crashing
5. **All internal references** updated from `data` → `safeData` including SVG polyline and circle renders

### Verification Needed (USER)

Load the following routes and verify no white screen:
- `/#/arc-of-care-phase3`
- `/#/arc-of-care-dashboard`
- `/#/meq30`
