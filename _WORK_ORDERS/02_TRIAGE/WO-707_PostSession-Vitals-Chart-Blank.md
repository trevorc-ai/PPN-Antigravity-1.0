---
id: WO-707
title: "Session Vitals Trend graph is blank in post-session closeout view (after End Dosing Session)"
owner: PRODDY
status: 02_TRIAGE
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
fast_track: true
origin: "User-reported — graph blank after clicking End Dosing Session"
admin_visibility: no
admin_section: ""
pillar_supported: "1 — Safety Surveillance, 3 — QA and Governance"
task_type: "bug-fix"
related_tickets:
  - WO-694 (Phase 2 Vitals/Timeline Bugs — related scope)
  - WO-A2 (DB vitals hydration on refresh — same root, different trigger)
files:
  - src/components/wellness-journey/SessionCloseoutView.tsx
  - src/components/wellness-journey/DosingSessionPhase.tsx
  - src/components/wellness-journey/SessionVitalsTrendChart.tsx
---

## User Report

After clicking "End Dosing Session," the `VIEW SESSION TIMELINE & LEDGER` accordion is
visible but the Session Vitals Trend chart is completely blank. The legend chips (HR BPM,
BP SYS, TEMP, EVENTS) render correctly, but the chart area has no data points or lines.

---

## LEAD Root Cause Analysis

### Data Path: `vitalsChartData` is in-memory state

`SessionVitalsTrendChart` in `SessionCloseoutView` receives `vitalsChartData` as a prop
(line 108 of SessionCloseoutView.tsx). This prop originates from `vitalsChartData` —
a `useMemo` derived from `updateLog` state in `DosingSessionPhase.tsx` (line 841).

`updateLog` is React in-memory state. It survives the `mode='live' → mode='post'`
transition because the component does NOT unmount. However, in two real-world scenarios
the `updateLog` is empty when `endDosingSession` fires:

1. **DB-hydrated session recovery (WO-A2 path):** On page refresh, `updateLog` is
   hydrated from `log_session_vitals` via `getSessionVitals()`. But if the session ends
   and the component remounts fresh (e.g., after navigation), `updateLog` starts empty
   and the WO-A2 hydration guard `if (updateLog.length > 1) return` blocks re-hydration
   (the baseline seeder added by WO-B6b counts as 1 entry, so the guard only runs when
   ≤ 1 entry — but the baseline IS the only entry if no live vitals were logged).

2. **`session-vitals` feature flag missing from `config`:** Line 103 of
   `SessionCloseoutView.tsx` guards the chart entirely with:
   ```tsx
   {config.enabledFeatures.includes('session-vitals') && (
       <SessionVitalsTrendChart ... />
   )}
   ```
   If the site's protocol config does not include `'session-vitals'`, the chart never
   renders in post-session mode even if data exists.

3. **`sessionDurationSec` is 0 post-session:** On mode transition to `'post'`, the
   `elapsedTime` timer stops and `sessionDurationSec` is derived from the stopped value.
   If the component remounts fresh, `elapsedTime` resets to `'00:00:00'` → `sessionDurationSec=0`
   → the chart x-axis domain collapses to 0 → data points outside the domain are clipped.

### Fix Required

**Fix 1 — DB re-fetch on post-session chart** (primary)
`SessionCloseoutView` should trigger a DB fetch of `log_session_vitals` when it mounts
(when `mode='post'`), independent of `updateLog` state. This is a read-only fetch for
display purposes only. The data already exists in `log_session_vitals` from live logging.

Approach:
- Add a `usePostSessionVitals(sessionId)` hook or inline `useEffect` in
  `SessionCloseoutView` that fetches from `log_session_vitals` if `vitalsChartData.length === 0`.
- Map the DB rows to `VitalsSnapshot[]` — same mapping as WO-A2's hydration logic.
- Pass the result to `SessionVitalsTrendChart` as a derived override prop.

**Fix 2 — Remove `session-vitals` feature flag guard in post-session chart**
The feature flag was intended to gate the live vitals form (not the read-only chart).
In post-session mode, the chart should always render if any vitals data exists.
Change the guard:
```tsx
// BEFORE (blocks chart if feature flag not set):
{config.enabledFeatures.includes('session-vitals') && (
    <SessionVitalsTrendChart ... />
)}

// AFTER (always render if data exists):
{(vitalsChartData.length > 0 || sessionId is a real UUID) && (
    <SessionVitalsTrendChart ... />
)}
```

**Fix 3 — `sessionDurationSec` fallback for post-session**
When `sessionDurationSec` is 0 (timer reset on remount), derive it from
`vitalsChartData` max `elapsedSec` or from DB `session_ended_at - dose_administered_at`.
Pass a non-zero floor so the chart domain is always wide enough to show data.

---

## QA Criteria

- [ ] Vitals chart renders data in post-session view for any session where vitals were logged
- [ ] Chart renders correctly even if the page was refreshed before ending the session
- [ ] Chart blank state ("No vitals recorded this session") renders correctly when truly
      no vitals exist (new session with zero session updates)
- [ ] Run `/phase2-session-regression` before and after
- [ ] INSPECTOR must verify chart data matches `log_session_vitals` rows in Supabase console

---

## Regression Risk

**MEDIUM** — `vitalsChartData` prop chain touches `DosingSessionPhase` orchestrator.
BUILDER must not change the live-mode chart behavior, only the post-session path.

---
- **Data from:** `log_session_vitals` (DB re-fetch on post-session mount) — via `usePostSessionVitals` hook or inline `useEffect`
- **Data to:** Read-only display — no DB writes; renders existing `log_session_vitals` rows in `SessionVitalsTrendChart`
- **Theme:** Tailwind CSS, Recharts — `SessionCloseoutView.tsx`, `DosingSessionPhase.tsx`, `SessionVitalsTrendChart.tsx`
