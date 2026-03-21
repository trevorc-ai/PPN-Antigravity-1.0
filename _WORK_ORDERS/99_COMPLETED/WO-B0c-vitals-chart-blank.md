---
id: WO-B0c
title: "Track B0c — Fix Vitals Chart Blank on Cockpit Mount"
track: B
priority: P0
status: 04_QA
created: 2026-03-21
completed_at: 2026-03-21
author: ANTIGRAVITY (planning), BUILDER (execution)
builder_notes: "Added vitalsLoading state (DosingSessionPhase.tsx line 700); added setVitalsLoading calls to WO-A2 hydration useEffect finally{} block; threaded vitalsLoading prop through SessionCockpitViewProps interface → isLoading prop on SessionVitalsTrendChart; added loading spinner skeleton to SessionVitalsTrendChart when isLoading=true."
depends_on: WO-B0
references:
  - STABILIZATION_BRIEF.md
  - HANDOFF_2026-03-21.md
affects:
  - src/components/wellness-journey/SessionVitalsTrendChart.tsx
  - src/components/wellness-journey/SessionCockpitView.tsx
verification: Manual browser verification at ppnportal.net/#/wellness-journey
---

# WO-B0c — Fix Vitals Chart Blank on Cockpit Mount

## Problem

The Session Vitals Trend chart in Panel A of the cockpit is completely blank.
The legend chips (HR / BP / Temp / Events) are present and the component renders,
but the chart area is empty — no data is plotted even when HR/BP data IS in
`log_session_vitals` (confirmed by the HUD displaying HR 62 bpm, BP 122/82).

## Root Cause: Two Separate Issues

### Issue 1 — Empty state fallback renders regardless of DB data

In `SessionVitalsTrendChart.tsx` line 350:

```typescript
const hasData = chartData.length > 0;
```

And line 400:
```typescript
{(hasData || events.length > 0) ? (
    <ResponsiveContainer ... />
) : (
    <div>No data recorded yet</div>  // ← THIS RENDERS
)}
```

`vitalsChartData` (passed as `data` prop) is built from `updateLog` in
`DosingSessionPhase.tsx`. On page refresh, WO-A2 hydrates `updateLog` from the
DB via `getSessionVitals()`. However:

- The hydration is async (useEffect)
- On the first render, `vitalsChartData` is `[]`
- The chart receives `data=[]` and `events=[]` (eventLog also empty on mount)
- The empty-state placeholder renders
- When hydration completes, `updateLog` is set, `vitalsChartData` recomputes,
  Chart re-renders — **BUT** the chart may still show empty if there's a timing
  issue with the ResponsiveContainer height resolution race

### Issue 2 — ResponsiveContainer height resolution in flex chain

The cockpit Panel A layout:

```
Panel A wrapper: h-[380px]         ← known height ✅
  └─ border-t div: h-[380px]       ← ✅
       └─ <div className="h-full"> ← resolves to 380px via parent ✅
            └─ SessionVitalsTrendChart
                 └─ root div: "h-full min-h-[220px]"  ← relies on parent ✅
                      └─ chart area div: "h-full min-h-[220px]"
                           └─ ResponsiveContainer: height="100%"  ← needs resolved parent ✅
```

The `h-full` chain appears correct. The container hierarchy has a resolved
`h-[380px]` anchor. However, `hideHeader={true}` removes the padding/flex wrapper,
making the root `<div className="w-full flex flex-col">` — this `flex-col` div
does NOT have `h-full` or any height constraint, relying purely on the parent to
impose height via the `h-full min-h-[220px]` inner div.

## Fix

### Fix A — Add loading state to prevent premature empty-state render

**File:** `DosingSessionPhase.tsx` — add `vitalsLoading` state

```typescript
const [vitalsLoading, setVitalsLoading] = useState(true);

// In the WO-A2 useEffect, set loading to false after hydration:
useEffect(() => {
    // ... existing guard logic ...
    (async () => {
        try {
            const result = await getSessionVitals(sessionId);
            if (result.success && result.data && result.data.length > 0) {
                // ... existing hydration ...
                setUpdateLog(hydrated);
            }
        } catch { /* non-blocking */ }
        finally {
            setVitalsLoading(false);
        }
    })();
    // If guard fails (no UUID), still exit loading state
    return () => setVitalsLoading(false);
}, [journey.sessionId]);
```

Pass `vitalsLoading` to `SessionCockpitView` → `SessionVitalsTrendChart`.

### Fix B — Add `isLoading` prop to suppress empty-state during hydration

**File:** `SessionVitalsTrendChart.tsx`

Add optional prop:
```typescript
interface SessionVitalsTrendChartProps {
    // ... existing props ...
    isLoading?: boolean;
}
```

In the chart render, replace the empty-state check:
```typescript
// Current:
{(hasData || events.length > 0) ? (
    <ResponsiveContainer ... />
) : (
    <EmptyState /> // shows "No data" immediately
)}

// Fixed:
{isLoading ? (
    <LoadingSkeleton />  // simple pulsing bar
) : (hasData || events.length > 0) ? (
    <ResponsiveContainer ... />
) : (
    <EmptyState />
)}
```

The loading skeleton can be as simple as:
```typescript
<div className="h-full flex items-center justify-center">
    <p className="text-sm text-slate-600 animate-pulse">Loading vitals…</p>
</div>
```

### Fix C — Ensure root div has h-full when hideHeader=true

**File:** `SessionVitalsTrendChart.tsx` line 353:

```typescript
// Current:
<div className={hideHeader ? 'w-full flex flex-col' : 'w-full bg-slate-900/60 ...'}>

// Fixed:
<div className={hideHeader ? 'w-full h-full flex flex-col' : 'w-full bg-slate-900/60 ...'}>
```

Adding `h-full` to the root div when in cockpit mode ensures the flex chain
propagates the parent's resolved `h-[380px]` all the way to `ResponsiveContainer`.

## Data Flow Summary (after fix)

```
Page load (with active session)
  → DosingSessionPhase mounts
  → vitalsLoading = true
  → WO-A2 useEffect fires getSessionVitals()
  → SessionCockpitView receives vitalsLoading=true
  → Chart shows "Loading vitals…" skeleton (not "No data")
  → DB returns rows → updateLog populated → vitalsChartData computed
  → vitalsLoading = false
  → Chart receives data=[...] → ResponsiveContainer renders lines
```

## Prop Threading Required

New prop `vitalsLoading: boolean` must be threaded from `DosingSessionPhase`
→ `SessionCockpitView` → `SessionVitalsTrendChart`.

**`SessionCockpitView` must add to its props interface:**
```typescript
vitalsLoading?: boolean;
```

And pass to the chart:
```typescript
<SessionVitalsTrendChart
    ...
    isLoading={vitalsLoading}
/>
```

## Verification

1. Log vitals during a live session (HR + BP in Session Update)
2. Confirm chart plots the data immediately (in-session)
3. Refresh the browser
4. Confirm chart shows "Loading vitals…" briefly, then plots the same data
5. Open a brand-new session with no vitals — confirm "No data recorded yet" shows
   (not "Loading" indefinitely)
6. Run /phase2-session-regression checklist
