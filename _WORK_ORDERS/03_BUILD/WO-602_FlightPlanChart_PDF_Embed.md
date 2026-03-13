---
owner: BUILDER
status: 03_BUILD
authored_by: LEAD
priority: P2
blocks: WO-600 (PDF Completion Sprint - Flight Plan section)
created: 2026-03-12
---

# WO-602: Embed FlightPlanChart into ClinicalReportPDF

## LEAD Decision Summary

**Q2 (WO-600) is now answered.** Code inspection confirms:

- `FlightPlanChart.tsx` is **pure React SVG**. No canvas, no WebGL, no third-party chart library. It renders a `<svg viewBox="0 0 560 180">` with inline path, rect, text, and linearGradient elements.
- `ClinicalReportPDF.tsx` already uses identical inline SVG chart components: `PHQ9Chart`, `VitalsChart`, `RadarChart`. The pattern is fully established - no new dependencies needed.
- The `FlightPlanChart` requires: `substanceCategory`, `accentColor`, `timelineEvents[]`, `sessionStartTime`. All of these are available from `usePhase3Data` hook which is already imported in `ClinicalReportPDF.tsx`.
- The existing `<AwaitingData>` placeholder pattern handles the case where session data is absent.
- **There is no snapshot/screenshot approach needed.** Direct component import and render is the correct approach.

**Ruling:** Use direct component import. No static snapshot. No canvas capture.

---

## What the PDF is missing (confirmed from code audit, Page 5)

Page 5 of `ClinicalReportPDF.tsx` contains `<AwaitingData>` placeholders for:
1. MEQ-30 score block - awaiting `usePhase3Data` data hook integration (WO-554 scope)
2. CEQ score block - same
3. EDI score block - same
4. **Pharmacokinetic Flight Plan chart - THIS WO** - can be added now, data available

The Flight Plan is on Page 4 (Dosing Session Record) logically, not Page 5. BUILDER should add it to Page 4 below the Session Event Log, or as a new Page 4b insert. This mirrors the live session view where the Flight Plan appears on the Cockpit dashboard alongside vitals.

---

## Specification

### New import
```ts
import { FlightPlanChart } from '../components/compass/FlightPlanChart';
```

### Data needed (already in usePhase3Data or derivable)
- `data.substanceCategory` (type: `SubstanceCategory`) - add to `usePhase3Data` hook return if not present, or read from session record directly.
- `accentColor` - derive from substanceCategory using the same `SUBSTANCE_ACCENT_MAP` pattern used elsewhere in the app. Fallback: `'#2dd4bf'`.
- `data.timelineEvents` - already returned by `usePhase3Data`.
- `data.sessionStartTime` - add to `usePhase3Data` hook return if not present.

### Placement in ClinicalReportPDF.tsx
Add after the Session Event Log table on **Page 4** (line ~509), before `</PageShell>`:

```tsx
<SectionTitle accent="#2dd4bf">Pharmacokinetic Flight Plan</SectionTitle>
<p style={{ fontSize: '10px', color: '#64748b', margin: '-8px 0 10px' }}>
  Estimated compound intensity curve for {substanceName}. Patient timeline events are plotted as dots on the curve. Individual timelines vary with metabolism and dose.
</p>
<div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
  {data.substanceCategory
    ? <FlightPlanChart
        substanceCategory={data.substanceCategory}
        accentColor={accentColor}
        timelineEvents={data.timelineEvents ?? []}
        sessionStartTime={data.sessionStartTime ?? null}
      />
    : <AwaitingData label="Flight plan available once substance category is logged for this session." />
  }
</div>
```

### PDF-specific constraint
The `FlightPlanChart` internal hover tooltip uses `<foreignObject>` and mouse events. These are interactive and will not render on print. This is acceptable - the chart curve, phase bands, and event dots are all static SVG elements that print correctly. The hover tooltip is purely additive.

BUILDER must verify by triggering `window.print()` and confirming the chart renders in the printed output.

### TOTAL page count
`ClinicalReportPDF.tsx` currently sets `const TOTAL = 7`. If adding the Flight Plan pushes Page 4 over one A4 page, increment to 8 and add a `<PageShell pageNum={4} total={8}>` split. BUILDER to verify visually in browser before committing.

---

## Acceptance Criteria

1. Flight Plan chart appears on Page 4 of the Clinical Report PDF in the browser view.
2. The chart renders with the correct substance PK curve and phase bands.
3. Timeline event dots appear for sessions that have logged events.
4. `window.print()` preview shows the chart (curve, bands, dots) without SVG rendering errors.
5. When `substanceCategory` is not available, the `<AwaitingData>` placeholder renders instead of a broken chart.
6. No new npm dependencies added.

---

## Verification

1. Navigate to `/clinical-report-pdf?sessionId=[any real session ID]` in the browser.
2. Confirm the Flight Plan section renders on Page 4 with the correct substance curve.
3. Open browser print dialog (`Cmd+P` on Mac). Confirm the chart is visible and not blank in the print preview.
4. Load the page with no sessionId (preview mode). Confirm the `<AwaitingData>` placeholder shows.

**Route:** BUILDER -> INSPECTOR -> LEAD sign-off.
