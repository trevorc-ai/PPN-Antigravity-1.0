---
id: WO-663
title: "PatientReportPDF — Full UI/UX audit, data-viz review, PPN UI Standards overhaul, print formatting fix, and bidirectional navigation improvement"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-23
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
files:
  - src/pages/PatientReportPDF.tsx
---

## Request

PatientReportPDF.tsx needs a full FLO UI/UX audit, VIZ data-viz review, PPN UI Standards compliance overhaul, complete print formatting fix, and improved bidirectional navigation UX.

## LEAD Architecture

This is a single-file overhaul of `src/pages/PatientReportPDF.tsx`. The file is 423 lines of inline-styled JSX with three PDF "pages" (wellness journey, how you've changed, what comes next), two inline SVG charts (WellnessRadar + WaveformSummary), a QRCodePlaceholder, and a print toolbar. The overhaul touches: (1) print CSS — switch from A4 to US Letter, add 0.6in margins, inter Google Fonts import, PPN wordmark in header, proper legal footer; (2) typography — all sub-12px inline font sizes must be raised to 9pt minimum for print, 14px for screen; (3) color — red/green alone used in table cells and chart polygons must gain text or icon pairings; (4) radar chart label font size raised from 9px to 12px; (5) waveform axis labels raised from 8px to 9pt; (6) QR URL font size from 8px to 9pt monospace with Roboto Mono; (7) navigation — add a "Back to Protocol" button in the toolbar that uses `window.history.back()` or a router link; (8) table header dark fill (#065f46) must switch to light indigo tint per standards.

## Open Questions

- [ ] Is the back-navigation button supposed to link to a specific protocol detail page (needs sessionId in URL) or just `history.back()`?
- [ ] Should the PPN wordmark image be embedded as a base64 img or loaded from `public/assets/ppn_portal_wordmark.png`?
