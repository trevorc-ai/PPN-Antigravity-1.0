---
id: WO-658
title: "Fix overlapping axis labels and oversized radar chart in PatientReportPDF page 6"
owner: BUILDER
status: 04_BUILD
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-23
fast_track: true
origin: "User fast-track request — screenshot showing overlapping text on PDF page 6"
admin_visibility: no
admin_section: ""
parked_context: ""
files:
  - src/pages/PatientReportPDF.tsx
---

## Request

Fix overlapping axis labels and oversized radar chart in PatientReportPDF page 6.

## LEAD Architecture

The radar chart in the "Predicted vs. Lived Experience Profile" section of `PatientReportPDF.tsx` is rendering too large, causing its axis labels (e.g., "Your Experience" / "Sensory Alteration" at top, "Where you…" / "Physical Sensation" at bottom) to collide and overlap. The fix involves: (1) reducing the chart container height so labels have breathing room, (2) adjusting the `outerRadius` prop on the `RadarChart` component so it sits inside its bounding box, and (3) ensuring the custom axis label renderer positions text far enough from the chart edge to never clip or overlap adjacent labels. The legend overlay ("Your Experience" / dashed "Predicted" lines) should be moved outside/above the chart area to eliminate the top collision.

## Open Questions

- [x] Science View badge stays in top-right of chart block (no change)
