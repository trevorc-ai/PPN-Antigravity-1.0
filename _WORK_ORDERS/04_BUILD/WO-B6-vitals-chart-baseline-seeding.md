---
id: WO-B6
title: "Track B6 — Vitals Chart + Timeline: Dose Event Rendering + Baseline Vitals Seeding"
track: B
priority: P0
status: 04_BUILD
created: 2026-03-21
author: INSPECTOR (QA observation)
depends_on: WO-B0c
affects:
  - src/components/wellness-journey/SessionVitalsTrendChart.tsx
  - src/components/wellness-journey/DosingSessionPhase.tsx
  - src/components/wellness-journey/LiveSessionTimeline.tsx
  - src/components/wellness-journey/SessionCockpitView.tsx
verification: Browser test — new live session shows initial dose marker on chart + baseline vitals in timeline at T+0
---

# WO-B6 — Vitals Chart + Timeline: Dose Event Rendering + Baseline Vitals Seeding

## Background

Identified during INSPECTOR Phase 2 regression QA on 2026-03-21.
A live session was started. The timeline correctly showed:

```
T+00:00 · Initial Dose · 25 · Psilocybin · Oral
```

However, the SESSION VITALS TREND chart panel was completely blank — no event
markers, no data lines. The HUD displayed HR 82 bpm, BP 125/82 (baseline vitals
from the dosing protocol), but neither appeared in the chart or the timeline.

---

## Sub-Task B6a — P0: Chart Blank Despite Initial Dose in eventLog (B0c Regression)

### Problem

WO-B0c shipped a `vitalsLoading` state + `isLoading` prop to suppress the
"No data recorded yet" empty state during hydration, and added `h-full` to the
`SessionVitalsTrendChart` root div when `hideHeader=true`.

However, in production the chart remains completely blank when an initial dose
event is in the eventLog. The Live Session Timeline correctly shows the dose
entry (`ppn:dose-registered` was dispatched and received). This means either:

1. **The chart's `events` prop is empty** — the `eventLog` state in
   `DosingSessionPhase` is not being passed down through `SessionCockpitView`
   to `SessionVitalsTrendChart` correctly, OR
2. **ResponsiveContainer height is still 0** — the `h-full` fix in WO-B0c did
   not fully resolve the height chain, so the chart renders at 0px height.

### BUILDER Must Verify

1. In `DosingSessionPhase.tsx`, confirm `eventLog` contains the initial dose
   entry after `ppn:dose-registered` fires.
2. Confirm `eventLog` is threaded to `SessionCockpitView` → `SessionVitalsTrendChart`
   as the `events` prop.
3. In `SessionVitalsTrendChart.tsx`, confirm the `events` prop arrives non-empty
   by checking the guard: `(hasData || events.length > 0)`.
4. In browser DevTools, inspect the chart container's computed height. If it
   resolves to 0px, the root div needs explicit `h-[380px]` or `min-h-[220px]`
   when `hideHeader=true` (not just `h-full` which relies on parent propagation).

### Fix Path

If `events` prop is empty when it should not be: trace the prop chain from
`DosingSessionPhase.eventLog` → `SessionCockpitView` → `SessionVitalsTrendChart`.

If height is the issue: add explicit `min-h-[220px]` to the chart root div
regardless of `hideHeader` state, in addition to the `h-full` already there.

---

## Sub-Task B6b — P1: Baseline Vitals Not in Chart at T+0

### Problem

Baseline vitals (HR, BP, SpO2) captured during the dosing protocol / pre-session
safety check appear in the cockpit HUD but are not written to `updateLog` and
therefore never appear as a data point at T+0 on the vitals chart.

The vitals chart only populates from `updateLog`, which is filled by Session
Update saves during the live session. The initial vitals are orphaned in the
HUD display layer.

### Required Behavior

The first reading (from the dosing protocol or pre-session vitals capture) should
be treated as a T+00:00 data point seeding the chart. This gives the chart a
starting anchor for all subsequent HR/BP trend lines.

### Fix Path

After the initial dose event fires (or on cockpit mount when `mode='live'`),
if `updateLog` is empty and `latestHR` / `latestBPSys` / `latestBPDia` are
available from the HUD state:

1. Construct a synthetic T+0 `updateLog` entry from those values
2. Prepend it to `updateLog` (React state only — do NOT write a duplicate
   `log_session_vitals` row if one already exists)
3. `vitalsChartData` will then recompute and the chart will render the starting point

This is a display-only transformation on the client. No schema change required.

---

## Sub-Task B6c — P1: Initial Dose Not Appearing as EVENTS Marker on Chart

### Problem

The initial dose entry is in the Live Session Timeline (`T+00:00 · Initial Dose`)
but does NOT appear as an EVENTS marker pip on the vitals chart. The chart has an
EVENTS legend chip that should show these markers.

### Required Behavior

`ppn:dose-registered` (fired when initial dose is logged) should produce an
event marker at the T+00:00 position on the chart. Similarly, rescue protocol
and adverse events should show as EVENTS pips at their respective timestamps.

### Fix Path

Confirm that `eventLog` entries of type `'initial_dose'`, `'rescue-protocol'`,
and `'safety_event'` are converted to the chart's `events` array format:

```typescript
{ timestamp: number; label: string; type: string; }
```

BUILDER must trace `eventLog` → `events` prop mapping in `DosingSessionPhase.tsx`.

---

## Acceptance Criteria

1. A newly started live session with initial dose shows at minimum an EVENTS
   marker on the chart at T+00:00 (no blank canvas)
2. Baseline vitals from the dosing protocol appear as a T+00:00 data point on
   the chart trend lines (HR, BP series)
3. Baseline vitals appear as a T+00:00 entry in the Live Session Timeline
4. The chart never shows a completely blank canvas when there is any session data
5. `npm run build` clean — zero TypeScript errors
6. All Phase 2 regression scenarios still pass after fix

---

## Out of Scope

- Adding new session vitals fields (vitals schema is frozen)
- Modifying the `log_session_vitals` table structure
- Changing the HUD display logic

---

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.

**Frontmatter status corrected:** was `02_TRIAGE`, corrected to `03_REVIEW` — ticket was physically placed in `03_REVIEW` directory.

**⚠️ MANDATORY REGRESSION GATE (Phase 3.5):**
- Trigger files: `DosingSessionPhase.tsx`, `LiveSessionTimeline.tsx`, `SessionVitalsTrendChart.tsx`, `SessionCockpitView.tsx`
- Required workflow: `/phase2-session-regression` (4 browser scenarios)
- All scenarios must PASS before `/finalize_feature` runs.

Signed: INSPECTOR | Date: 2026-03-25

---
- **Data from:** `log_session_vitals` (DB hydration), in-memory `updateLog` / `eventLog` React state, HUD baseline vitals (`latestHR`, `latestBPSys`)
- **Data to:** Display-only synthetic T+0 entry prepended to `updateLog` (React state only — no `log_session_vitals` row written)
- **Theme:** Tailwind CSS, Recharts — `DosingSessionPhase.tsx`, `SessionVitalsTrendChart.tsx`, `SessionCockpitView.tsx`, `LiveSessionTimeline.tsx`
