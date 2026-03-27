---
id: WO-694
title: "Phase 2 Dosing Cockpit — Comprehensive bug fix: Vitals chart tooltip, Live Session Timeline, post-session rendering"
owner: BUILDER
status: 04_BUILD
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-24
fast_track: true
origin: "User fast-track request + follow-up"
admin_visibility: no
admin_section: ""
parked_context: "Holding in 03_REVIEW until 04_BUILD WIP slot opens. 04_BUILD is at 6/5."
files:
  - src/components/wellness-journey/SessionVitalsTrendChart.tsx
  - src/components/wellness-journey/LiveSessionTimeline.tsx
  - src/components/wellness-journey/DosingSessionPhase.tsx
---

## Request

Fix all known bugs in the Phase 2 Dosing Cockpit — Session Vitals Trend chart and Live Session Timeline — covering active-session behavior and post-session closeout behavior. Also evaluate a targeted refactor of `DosingSessionPhase.tsx` to reduce file size without changing behavior.

---

## ⚠️ MANDATORY REGRESSION GATE

**INSPECTOR must run `/phase2-session-regression` BEFORE and AFTER all changes.**

Pre-build regression establishes baseline. Post-build regression is the QA gate. No PR without both passing.

---

## Bug Inventory (Code-Audit Verified)

### BUG-01 — Chart tooltips fire on crosshair hover, not just on dot click
**File:** `SessionVitalsTrendChart.tsx`
**Root cause:** Two tooltip mechanisms exist simultaneously:
1. Recharts `<Tooltip content={<ChartTooltip />} />` (line 463) — fires on any `onMouseMove` over the chart canvas, including the vertical crosshair line. This shows vitals data for any point the cursor passes through, not just dot positions.
2. `EventDot` component (lines 218–225) uses `onMouseEnter`/`onMouseLeave` to set `hoveredEvent` state, triggering the custom DOM overlay tooltip on any cursor contact with the dot.

**Fix:**
- Remove Recharts `<Tooltip>` component entirely from `ComposedChart`.
- Convert `EventDot` from `onMouseEnter`/`onMouseLeave` → `onClick` that sets `selectedEvent` state (rename from `hoveredEvent`).
- Add a dismiss mechanism: clicking anywhere else on the chart clears `selectedEvent`.
- The custom DOM overlay (lines 558–607) already renders correctly — keep it, just change the trigger from hover to click.
- For vitals line dots: replace `activeDot` with a custom `dot` shape component that fires `onClick` and sets `selectedVital` state, rendering a similar click-triggered callout.

### BUG-02 — Adverse event tooltip clips at top of chart container
**File:** `SessionVitalsTrendChart.tsx`
**Root cause:** The custom overlay (line 577) is `position: absolute` inside the chart div. Adverse event dots sit at `EVENT_Y_BAND['safety-and-adverse-event'] = 172` (near the top of the Y domain). The `-115%` transform pushes the tooltip above the chart div's top edge, where `overflow` clips it.
**Fix:** Already partially handled by the `zone` / `tooltipTransform` logic but only covers left/right. Add a top-edge detection: if `cy < 80px`, anchor tooltip BELOW the dot (`translate(-50%, 16px)`) instead of above it. Same for the arrow — flip it to a top-pointing arrow in this case.
**NOTE:** BUG-01 fix supersedes this for adverse events since they become click-triggered, but the positioning logic still needs the top-edge fix for correctness.

### BUG-03 — Initial Dose appears twice in Live Session Timeline
**File:** `LiveSessionTimeline.tsx` + `DosingSessionPhase.tsx`
**Root cause (two sources):**
1. `DosingSessionPhase.tsx` line 794 dispatches `ppn:dose-registered` → `{type: 'vital_check', label: 'Baseline Vitals…'}` from the WO-B6b baseline seeder effect. No dose duplication from this.
2. The real duplication: `DosingSessionPhase.tsx` also dispatches `ppn:dose-registered` at line 364 when `ppn:dosing-saved` fires (`eventType: 'dose_admin'`). Simultaneously, `fetchLocalEvents()` from `LiveSessionTimeline` runs on mount and pulls the same dose record from DB. Both land in the `events` state array = duplicate.
**Fix:** In `fetchLocalEvents()`, before `setEvents(mappedEvents.reverse())`, filter out any event already present in `events` state by `id`. Alternatively: in `DosingSessionPhase.tsx`, only dispatch `ppn:dose-registered` if the DB write was confirmed — not as a parallel optimistic update when the timeline will refetch anyway.
**Timestamp bug:** The top-of-list "Initial Dose" (the optimistic `ppn:dose-registered` entry) uses `new Date()` as timestamp (line 258 in `LiveSessionTimeline.tsx`), which is the current wall-clock time at dispatch. If dispatch happens before the session is fully started (e.g., during pre-dosing prep), that timestamp will be earlier than Informed Consent entries. Fix: pass `elapsedSec` in the event detail and derive the displayed time from `sessionStartMs + elapsedSec` rather than `new Date()` in the optimistic handler.

### BUG-04 — Add Dose and Rescue Protocol show no details in Timeline
**File:** `LiveSessionTimeline.tsx`
**Root cause:**
- **Add Dose:** `ppn:dose-registered` dispatches `{type: 'additional_dose', label: 'Additional Dose'}` (line 364–365 in `DosingSessionPhase.tsx`). The event `description` that's rendered is just `"Additional Dose"` — the full dose details (substance, amount, route, T+ time) ARE computed into `dosingDesc` (line 379–390 of `DosingSessionPhase.tsx`) but only used for the DB `createTimelineEvent` write. The `ppn:dose-registered` dispatch sends only a short label. The timeline renders `event.description` which equals that short label.
- **Fix:** Update `ppn:dose-registered` dispatch payload to include `label: dosingDesc` (the full detail string) for additional dose entries. The `ppn:dose-registered` handler in `LiveSessionTimeline` uses `label ?? type` as `description`, so passing the full string there is enough.
- **Rescue Protocol:** `ppn:dose-registered` at line 1116–1120 dispatches `{type: 'rescue-protocol', label: 'Rescue Protocol initiated'}`. This is a bare label — no details about the rescue action. Fix: include the rescue form's metadata fields in the dispatch payload (`medication`, `dosage`, `rationale` etc.).

### BUG-05 — Session Updates not rendering in Timeline
**File:** `LiveSessionTimeline.tsx` + `DosingSessionPhase.tsx`
**Root cause:** `handleSaveUpdate` (line 917 in `DosingSessionPhase.tsx`) dispatches `ppn:session-event` with `type: 'session_update'`. The timeline's `ppn:session-event` listener (lines 250–265) is keyed on `ppn:dose-registered` not `ppn:session-event`. The `ppn:session-event` listener is in `DosingSessionPhase.tsx` itself (line 432) to update `eventLog` for the chart — but `LiveSessionTimeline` has NO listener for `ppn:session-event`. It only listens to `ppn:dose-registered`.
**Fix:** In `LiveSessionTimeline.tsx`, add a `useEffect` listener for `ppn:session-event` that creates an optimistic entry from `e.detail`. This mirrors the existing `ppn:dose-registered` listener pattern. Alternatively: consolidate both event types into `ppn:dose-registered` at the dispatch site but that conflates semantics. Preferred: add the `ppn:session-event` listener to `LiveSessionTimeline`.

### BUG-06 — Adverse Events not rendering in Timeline
**Root cause:** Adverse events are submitted via the `safety-and-adverse-event` form through `WellnessFormRouter`. The form dispatches `ppn:session-event`. `LiveSessionTimeline` has no `ppn:session-event` listener (same root cause as BUG-05). The DB write does happen (via `createTimelineEvent`), so events appear on page reload/refetch — but not live during the session.
**Fix:** Same as BUG-05 — add `ppn:session-event` listener to `LiveSessionTimeline`.

### BUG-07 — Session Vitals Trend graph doesn't render after session ends
**File:** `DosingSessionPhase.tsx`, `SessionVitalsTrendChart.tsx`
**Root cause:** When `mode === 'post'`, the chart is rendered inside the `showPostSessionTimeline` collapsed accordion (line 619). The `SessionVitalsTrendChart` receives `data={vitalsChartData}` and `events={eventLog}`. Both `vitalsChartData` (derived from `updateLog`) and `eventLog` are React state — they are **in-memory only** and are wiped when the component unmounts or when the user navigates away and back. On `mode === 'post'`, the DB hydration useEffect at line 711 only runs `if (updateLog.length > 0) return` — so if the user ends the session and the component re-mounts, `updateLog` starts empty, the hydration guard prevents refetch if there IS data, but more critically: the `vitalsLoading` starts `true` on every mount and the chart shows the loading skeleton indefinitely if hydration fails silently OR if the `updateLog.length > 0` guard is incorrectly triggered.
**Actual failure:** `updateLog.length > 0` guard (line 714) prevents re-hydration if any entry was seeded by WO-B6b baseline seeder (line 787, `setUpdateLog([baseline])`). So after session end + remount: baseline is re-seeded (1 entry) → `updateLog.length === 1` → DB hydration skips → only baseline entry in chart → appears empty.
**Fix:** The hydration guard `if (updateLog.length > 0) return` should be changed to `if (updateLog.length > 1) return` OR the baseline seeder should add a `isBaseline: true` flag and the guard should check for non-baseline entries only.

### BUG-08 — Rescue Protocol missing from post-session timeline
**Root cause:** `ppn:dose-registered` for rescue protocol IS dispatched at line 1116–1120 in `DosingSessionPhase.tsx`. But `LiveSessionTimeline`'s `ppn:dose-registered` listener adds it as an optimistic entry that only exists in local React state. After session end + page navigation back to closeout view, `ReactState` is wiped. On remount, `fetchLocalEvents()` runs and loads from DB. The rescue event was written to DB via `createTimelineEvent` — but the type code used must match what's in `ref_flow_event_types`. If `rescue-protocol` is not a valid `event_type_code` in that table, the DB write silently fails (line 183: "kept locally only").
**Fix:** Verify `rescue-protocol` (hyphen) is a valid code in `ref_flow_event_types`. If not, it needs to be added via migration OR the dispatch should use the code that IS in the table (e.g., `session_completed` maps to rescue per line 61 of `LiveSessionTimeline.tsx` — this is a code mismatch). Harmonize the codes.

---

## Refactor Assessment (DosingSessionPhase.tsx, 1271 lines)

The file is large but structured — it contains: state declarations (~200L), ~8 useEffects (~250L), business logic handlers (~300L), render logic (~520L). It previously topped 1500L.

**INSPECTOR recommendation:**
- Extract `handleSaveUpdate` + update state (`updateLog`, update fields) into a `useSessionUpdate` hook (~150L saved from component body).
- Extract `vitalsChartData` + `vitalsLoading` DB hydration into a `useVitalsChartData(sessionId, mode)` hook (~150L saved).
- Extract the post-session `mode === 'post'` render branch into `<PostSessionView>` component (~150L saved from render).
- These 3 extractions reduce `DosingSessionPhase.tsx` to ~820L without changing any behavior.
- **Do NOT refactor in WO-694.** This is a separate WO to be scoped and planned independently. Flag to LEAD for scheduling after WO-694 bugs are fixed and regression-tested.

---

## Build Rules

1. INSPECTOR runs `/phase2-session-regression` at baseline BEFORE any code changes.
2. BUILDER fixes bugs in this order: BUG-05/06 first (easiest, highest user impact), then BUG-01/02 (tooltip), then BUG-03/04 (duplicate/missing details), then BUG-07/08 (post-session).
3. After all changes, INSPECTOR runs `/phase2-session-regression` again.
4. Refactor (DosingSessionPhase.tsx) is explicitly out of scope for WO-694.

## Open Questions
- [ ] Confirm: is `rescue-protocol` (with hyphen) a valid `event_type_code` in `ref_flow_event_types`? Check DB or run migration if missing.
- [ ] For clicked-dot vitals callout: inline near dot (like current hover card) or fixed panel below chart?

---

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.

**UI Standards Pre-Build Gate:** N/A — existing files, no new layout introduced. BUILDER must not introduce bare `grid-cols-2+` or hardcoded px widths in any touched file.

**⚠️ MANDATORY REGRESSION GATE (Phase 3.5):**
- Trigger files: `DosingSessionPhase.tsx`, `LiveSessionTimeline.tsx`, `SessionVitalsTrendChart.tsx`
- Required workflow: `/phase2-session-regression` (4 browser scenarios)
- BUILDER runs pre-build baseline BEFORE any code changes.
- INSPECTOR runs post-build `/phase2-session-regression` BEFORE approving.
- No commit without both runs passing.

Signed: INSPECTOR | Date: 2026-03-25

---
- **Data from:** `log_session_vitals` (chart data), `log_flow_events` via `getTimelineEvents()` (timeline), in-memory `updateLog` / `eventLog` React state
- **Data to:** Read-only bug fix — no new DB writes; all existing write paths unchanged
- **Theme:** Tailwind CSS, Recharts — `SessionVitalsTrendChart.tsx`, `LiveSessionTimeline.tsx`, `DosingSessionPhase.tsx`
