---
id: WO-311
title: "Wellness Journey Output Engine — Phase 2: Session Outputs"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-21
created_by: CUE
failure_count: 0
priority: P1_HIGH
tags: [wellness-journey, session-timeline, vitals-chart, phase-2, dosing-session, real-time]
depends_on: [WO-309]
user_prompt: |
  "Time-Stamped Session Logs: chronological exportable readout of the 6-8 hour session —
  exactly when dose was ingested, peak effects occurred, and facilitator interventions used.
  Vital Sign Trend Graphs: plot of BP, heart rate, temperature over session duration,
  highlighting any data points that crossed predefined clinical safety thresholds."
---

# WO-311: Phase 2 Session Outputs

## WHERE IN THE UI (confirmed by LEAD)
- Live timeline component inside `TreatmentPhase` panel — builds in real-time during the session
- Vital sign trend chart directly below the "Record Vitals" button — updates with each save
- Both panels are visible DURING the session (Phase 2 active), not just post-session

---

## GAP ANALYSIS

### What Exists
- `SessionTimelineForm.tsx` — clinician logs timeline events (dose, peak, interventions)
- `SessionVitalsForm.tsx` — records vitals at each measurement interval
- `DosingSessionPhase.tsx` / `TreatmentPhase` — Phase 2 parent component
- `log_session_vitals` table (inferred from FK references in Wellness Journey)

### What's Missing
1. `LiveSessionTimeline` — visual display of timeline events as they're logged, exportable
2. `SessionVitalsTrendChart` — time-series chart of vitals with threshold violation markers
3. Live-updating pattern (both should re-fetch when new form saves complete)

---

## DELIVERABLE 1: LiveSessionTimeline (`src/components/wellness-journey/LiveSessionTimeline.tsx`)

### Visual Design
```
SESSION TIMELINE                                [Export Log]
──────────────────────────────────────────────────────────
09:14 AM  ●  [DOSE] Psilocybin 25mg oral administered
              Notes: Patient calm, set and setting confirmed

10:02 AM  ○  [OBSERVATION] First onset effects reported
              Notes: Patient reported warmth, mild visuals

11:45 AM  ◆  [PEAK] Peak experience onset
              Notes: Eyes closed, music shifted to peak playlist

01:30 PM  △  [INTERVENTION] Grounding support provided
              Notes: Patient requested hand on shoulder, approved

03:22 PM  ○  [OBSERVATION] Descent phase — patient verbal
              Notes: Discussing key themes: childhood, forgiveness

04:45 PM  ●  [CLOSE] Session formally closed
              Duration: 7h 31min
──────────────────────────────────────────────────────────
```

### Event Types + Icons
| Type | Icon | Symbol | Description |
|---|---|---|---|
| DOSE | Pill icon | `●` | Substance administered |
| OBSERVATION | Circle | `○` | Clinician observation logged |
| PEAK | Diamond | `◆` | Peak effects marker |
| INTERVENTION | Triangle | `△` | Facilitator support action |
| SAFETY | Shield | `⚠` | Safety check or AE logged |
| CLOSE | CheckCircle | `✓` | Session formally closed |

### Data Source
```typescript
// Query: all log_session_timeline records for current session_id
// Ordered by created_at ASC
// Refreshes every 30 seconds OR after each SessionTimelineForm save (via callback)
const { data: timelineEvents, refetch } = useQuery(
  ['session-timeline', sessionId],
  () => getSessionTimeline(sessionId),
  { refetchInterval: 30_000 }
);
```

### Export
"Export Log" button → generates a plain-text or PDF readout in the format shown above.  
Used for: regulatory submission, clinical record, incident documentation.

---

## DELIVERABLE 2: SessionVitalsTrendChart (`src/components/wellness-journey/SessionVitalsTrendChart.tsx`)

### Visual Design (uses `visual-data-storytelling` skill)

**The Claim:** "Vitals remained within safe limits throughout — except one BP spike at 11:45 AM"

**Chart structure:** `ComposedChart` with three lines on a shared time X-axis

```
Vitals Over Session
[Legend: — Heart Rate (bpm)   — — BP Systolic (mmHg)   ··· Temp (°F × 10)]

160 ┤                               ╭─────╮
    │                              ╱       ╲
140 ┤ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ BP Alert Threshold (140)
    │                 ╭──╮        ╱          ╲
120 ┤     ────────────╯  ╰───────╯            ╰───────────── HR
    │
 90 ┤────────────────────────────────────────────────────── BP Baseline
    │
 60 ┤
    └────────────────────────────────────────────────────────
    9:00 AM     11:00 AM     1:00 PM     3:00 PM     5:00 PM
```

### Safety Thresholds (pre-defined, from clinical protocol)
```typescript
const VITAL_THRESHOLDS = {
  hrHigh: 130,          // bpm — tachycardia alert
  hrLow: 45,            // bpm — bradycardia alert
  bpSystolicHigh: 140,  // mmHg — hypertension alert (MDMA/Ketamine)
  bpSystolicLow: 85,    // mmHg — hypotension alert
  tempHigh: 100.4,      // °F — fever alert (MDMA hyperthermia risk)
  spo2Low: 94,          // % — hypoxia alert
};
```

### Threshold Violation Rendering
- When ANY data point crosses a threshold:
  - The line segment turns **amber** (approaching) or **rose** (crossed)
  - A `<ReferenceDot>` marker appears at the violation point with a label: "HR 134 — Above Threshold"
  - A text annotation: `[THRESHOLD EXCEEDED — 11:45 AM]` appears in amber
  - `animationBegin` stagger: threshold lines render first (context), then vital lines animate in

### Data Source
```typescript
// Query: log_session_vitals WHERE session_id = currentSessionId ORDER BY recorded_at ASC
// Each SessionVitalsForm save triggers refetch via onComplete callback
```

### Three dimensions encoded
- **Position (Y):** Vital sign value — lowest cognitive load for primary metric ✅
- **Color:** Safety status — normal (slate), approaching (amber), exceeded (rose) + text label ✅
- **Shape:** Dot at each reading (circle = HR, square = BP, diamond = Temp) ✅

---

## INTEGRATION INTO TreatmentPhase

```tsx
// src/components/wellness-journey/DosingSessionPhase.tsx
// Add below the existing session status header:

{/* Live Session Timeline */}
<LiveSessionTimeline
  sessionId={sessionId}
  onNewEvent={refetchTimeline}
/>

{/* Vital Sign Trend Chart */}
<SessionVitalsTrendChart
  sessionId={sessionId}
  substance={journey.session.substance}
  onThresholdViolation={(vital, value) => {
    addToast({
      title: `[ALERT] ${vital} threshold exceeded`,
      message: `${vital}: ${value} — review immediately`,
      type: 'error',
      persistent: true,  // doesn't auto-dismiss
    });
  }}
/>
```

---

## ACCEPTANCE CRITERIA

- [ ] LiveSessionTimeline renders timeline events in chronological order with icons + type labels
- [ ] Timeline refreshes within 30 seconds of new SessionTimelineForm submission
- [ ] Export Log produces correct chronological readout with timestamps
- [ ] SessionVitalsTrendChart renders HR, BP Systolic, and Temp on shared time axis
- [ ] Threshold lines render BEFORE vital lines (animationBegin stagger)
- [ ] Threshold violations turn line rose and display labeled `<ReferenceDot>`
- [ ] `onThresholdViolation` callback fires a persistent toast (doesn't auto-dismiss)
- [ ] Chart legend uses text + SVG lines (not solid colored squares)
- [ ] Direction labeled: no direction label needed (higher = concern for all vitals shown)
- [ ] "Export Log" on timeline produces readable export
- [ ] Both components handle empty state gracefully (session just starting, no readings yet)
- [ ] RefetchInterval does NOT run when Phase 2 is not active (`enabled: activePhase === 2`)
- [ ] All fonts ≥ 12px
- [ ] INSPECTOR: Threshold violations use text labels, not color-only indicators
