---
id: WO-570d
title: "Integration Compass — Page Assembly: IntegrationCompass.tsx, Two Modes, Demo Mode"
owner: BUILDER
status: 04_QA
authored_by: LEAD
parent: WO-570
sequence: 4
date: 2026-03-02
priority: P0
tags: [compass, assembly, page, demo-mode, two-modes, practitioner-gate]
failure_count: 0
depends_on: [WO-570a, WO-570b, WO-570c]
blocks: [WO-570e]
---

## LEAD Architecture

Ticket 4 of 5. This is the assembly ticket. BUILDER creates `IntegrationCompass.tsx`
as a pure assembly file — zero component definitions inline. Then retires
`PatientReport.tsx` (move to `PatientReport.tsx.deprecated` — do NOT delete, in case
of rollback).

---

### New File

**`src/pages/IntegrationCompass.tsx`** — replaces `src/pages/PatientReport.tsx`

**Route:** Same as today: `/patient-report?sessionId={uuid}` (route not changed)

**App.tsx change required:** Update the route to import `IntegrationCompass` instead
of `PatientReport`. One line change only.

---

### URL Params Handled

| Param | Value | Effect |
|---|---|---|
| `sessionId` | UUID string | Loads real session data |
| `pv` | `1` | Reveals `CompassCustomizePanel` (practitioner view) |
| `demo` | `1` | Loads synthetic demo data, bypasses all DB calls |

---

### Demo Mode (REQUIRED — user spec: "demo in 2 clicks")

When `?demo=1` is present in the URL:
- All hooks return a pre-built `DEMO_COMPASS_DATA` constant
- A gold banner renders at top: "✦ Demo Mode — Sample Data Only"
- No Supabase calls are made
- All visualizations render fully with realistic synthetic data

**`DEMO_COMPASS_DATA` must include:**
- `substanceCategory: 'psilocybin'`
- `substanceName: 'Psilocybin'`
- `daysPostSession: 12`
- `sessionDate`: 12 days ago from render time
- `livedData`: pre-built spider axis values showing meaningful lived vs. predicted gap
- `sessionEvents`: 8–12 synthetic events distributed across a 6-hour timeline
- `emaPoints`: 12 entries (one per day) with improving mood trajectory
- `baselinePhq9: 18`, `outcomes`: 3 longitudinal entries showing PHQ-9 dropping 18→12→9
- `indicationName: 'Major Depressive Disorder'`

**2-click demo access from the portal:**
- A "Preview Compass" button visible in Phase 3 that opens `/patient-report?demo=1`
  in a new tab — this is the demo entry point
- Practitioner can click this in any live demo to instantly show the patient-facing
  experience with no real patient data exposed

---

### Page Structure — Assembly Only

```tsx
// IntegrationCompass.tsx — assembly only, no definitions

const IntegrationCompass = () => {
  const { sessionId, demo } = parseUrlParams();

  // Hooks
  const session = useCompassSession(demo ? null : sessionId, demo ? DEMO_DATA : null);
  const timeline = useCompassTimeline(demo ? null : sessionId, demo ? DEMO_DATA : null);
  const ema = useCompassEMA(demo ? null : sessionId, demo ? DEMO_DATA : null);
  const outcomes = useCompassOutcomes(demo ? null : sessionId, demo ? DEMO_DATA : null);
  const { mode, practitionerView } = useCompassMode(ema.points.length, searchParams);

  return (
    <div className="compass-root">
      {demo && <DemoBanner />}
      {practitionerView && <CompassCustomizePanel ... />}

      <HeroHeader session={session} />

      {mode === 'daily' && (
        <>
          <DayAwarenessHeader daysPostSession={session.daysPostSession} />
          <DailyCheckInCard ... onSubmitSuccess={ema.refetch} />
          <FullJourneyDisclosure />
        </>
      )}

      <CompassZone number={1} title="Your Experience Map" accentColor={session.accentColor}>
        <CompassSpiderGraph ... />
        <BrainNetworkMap ... />
      </CompassZone>

      <CompassZone number={2} title="Your Session Journey" accentColor={C.rose}>
        <FlightPlanChart ... />
        <EmotionalWaveform ... />
        <FeelingWave ... />
      </CompassZone>

      <CompassZone number={3} title="Your Healing in Motion" accentColor={session.accentColor}>
        <CompassEMAGraph ... />
        {mode === 'report' && <DailyCheckInCard ... />}
      </CompassZone>

      <CompassZone number={4} title="You Are Not Alone" accentColor={C.gold}>
        <NetworkBenchmarkBlock ... />
      </CompassZone>

      <CompassZone number={5} title="Your Path Forward" accentColor={C.violet}>
        <PEMSModelCard />
        <JournalPrompts feelings={timeline.events} />
        <IntegrationStoryChart ... />
        {practitionerView && <PractitionerMessagePreview />}
      </CompassZone>

      <ShareButtons sessionId={sessionId} />
      <CompassFooter />
    </div>
  );
};
```

---

### Acceptance Criteria

- [ ] `IntegrationCompass.tsx` exists in `src/pages/`
- [ ] Zero component definitions inside `IntegrationCompass.tsx` — assembly only
- [ ] Route updated in `App.tsx` to use `IntegrationCompass` (not `PatientReport`)
- [ ] `PatientReport.tsx` renamed to `PatientReport.tsx.deprecated` (not deleted)
- [ ] Daily Mode: check-in card visible above Zone 1 without scroll at 390×844
- [ ] Full Report Mode: all 5 zones visible on first load (no check-ins)
- [ ] `?demo=1` loads full page with synthetic data, gold demo banner visible
- [ ] `?pv=1` reveals `CompassCustomizePanel` — absent without param
- [ ] Patient URL (no params): zero reference to `CompassCustomizePanel` in DOM
- [ ] "Preview Compass" button in Phase 3 links to `/patient-report?demo=1`
- [ ] `DEMO_COMPASS_DATA` constant is complete with all required fields above
- [ ] TypeScript: zero compile errors, zero `any` types
- [ ] No regressions in Phase 1, Phase 2, or Phase 3 practitioner views
