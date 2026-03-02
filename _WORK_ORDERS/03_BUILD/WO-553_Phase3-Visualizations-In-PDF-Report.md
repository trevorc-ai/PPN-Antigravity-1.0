---
id: WO-553
title: "Phase 3 PDF Report — Include Live Graph and All Visualizations"
status: 03_BUILD
owner: BUILDER
authored_by: PRODDY
reviewed_by: LEAD
lead_reviewed_at: 2026-03-01T17:03:00-08:00
created: 2026-03-01T16:38:39-08:00
failure_count: 0
priority: P1
prerequisite: WO-547
build_order: 7
related: WO-554
---

## PRODDY PRD

> **Work Order:** WO-553 — Phase 3 PDF Report — Include Live Graph and All Visualizations
> **Authored by:** PRODDY
> **Date:** 2026-03-01
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

The Phase 3 Clinical Outcomes Report PDF (`ClinicalReportPDF.tsx`) currently outputs static mock data and lacks the session-level and integration-phase visualizations that exist in the live Phase 3 view. The Phase 2 live session graph (vitals trend, event pins) and the Phase 3 intelligence panels (Patient Journey Snapshot, Symptom Decay Curve, Confidence Cone, Safety Timeline) are entirely absent from the exported document. Practitioners exporting records for legal, insurance, or research use receive an incomplete report that does not reflect the clinical intelligence the platform has generated.

---

### 2. Target User + Job-To-Be-Done

A licensed facilitator needs the Phase 3 PDF report to include all relevant charts and visualizations — including the dosing session vitals graph and integration outcome charts — so that they can provide regulators, insurers, and research collaborators with a complete, verifiable clinical record without manually reconstructing data from the screen.

---

### 3. Success Metrics

1. The Phase 3 PDF export contains ≥5 rendered chart visualizations (vitals graph, PHQ-9 trajectory, Patient Journey Snapshot, Symptom Decay Curve, Confidence Cone) in 100% of QA test exports where real Phase 3 data exists.
2. All charts in the PDF render using inline SVG (print-compatible) — zero Recharts/canvas dependencies that would silently drop on `window.print()`.
3. Any chart panel that has no real data renders an explicit printed "Awaiting data" placeholder text cell — no silent blank sections in ≥5 consecutive QA export reviews.

---

### 4. Feature Scope

#### ✅ In Scope
- Add a **"Dosing Session Record" page** to `ClinicalReportPDF.tsx`: includes the vitals trend chart (HR + systolic BP over session elapsed time) and a text-formatted event log (timestamps + event type). Chart must be inline SVG — not a React component requiring DOM rendering.
- Add a **"Patient Outcome Trajectory" page** to `ClinicalReportPDF.tsx`: includes the PHQ-9 symptom decay chart (already partially built in the file — wire it to real session data), the Patient Journey Snapshot timeline markers, and the Confidence Cone comparison band.
- Add a **"Symptom Decay + Network Cohort" page**: combines the Symptom Decay Curve (6-month view) with a comparative network band. Label benchmark band as `"Reference Cohort (N=14k published data)"` if using static data, per WO-545 LEAD decision.
- Add a **"Safety & Integration Events" page**: renders the Safety Timeline as a printable table (date, event type, severity, resolution status) and Integration Phase summary metrics (sessions attended, pulse check rate, behavioral changes documented).
- Wire all chart pages to **real session data from localStorage and/or Supabase** — replace `MOCK_*` constants in `ClinicalReportPDF.tsx` with actual session context passed as props or read from `ppn_session_mode_*` and `ppn_phase2_assessment_*` localStorage keys.
- All pages must carry the existing `PageShell` header/footer (page number, PPN Portal branding, HIPAA notice, report ID).
- The report should expand from its current 4 pages to a maximum of **7 pages**.

#### ❌ Out of Scope
- Converting the PDF export from `window.print()` to a third-party PDF library (jsPDF, Puppeteer) — LEAD to confirm if this is needed separately
- Real-time chart interactivity within the PDF
- Changes to the `SessionExportCenter.tsx` export package cards or text report formats (audit, insurance, research TXT formats)
- Changes to `DemoClinicalReportPDF.tsx` (demo/marketing version — separate file)
- Adding charts to the CSV export (WO-554 scope)

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** The Clinical Outcomes PDF is the primary deliverable practitioners hand to regulators, insurers, and research networks. A PDF that omits the live session graph and integration outcome charts significantly undersells the platform's analytical capability and limits the practitioner's ability to use the export for real clinical and compliance purposes.

---

### 6. Open Questions for LEAD

1. `ClinicalReportPDF.tsx` currently uses `window.print()` for PDF generation, which may clip or drop SVG charts depending on browser print settings. LEAD must confirm whether the acceptable approach remains `window.print()` with `@media print` CSS, or whether a headless rendering library (e.g., `html2canvas` + `jsPDF`) should be introduced in this ticket.
2. Real session data for the PDF must come from somewhere — LEAD must confirm the data flow: (a) props passed from the `WellnessJourney` parent, (b) direct localStorage reads inside `ClinicalReportPDF.tsx`, or (c) a new Supabase query executed on PDF page mount.
3. The Confidence Cone benchmark band is confirmed static (WO-545 LEAD Decision Q1). Should the PDF benchmark page display a `[DEMO DATA]` watermark text stamp, or is the `"Reference Cohort (N=14k published data)"` label sufficient for printed reports?
4. LEAD to confirm: should the new pages insert **before** the existing Network Benchmarking page (page 4), or **replace** the current sessions page (page 3) which is currently mock-data only?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD ARCHITECTURE

> **LEAD Review Date:** 2026-03-01
> **Status:** Open Questions Resolved — Routed to BUILD

### ⚠️ PREREQUISITE GATE

**DO NOT BEGIN THIS TICKET UNTIL WO-547 IS CLOSED AND IN 07_ARCHIVED.**
The PDF charts require real session data to render truthfully. Testing the PDF against broken data pipelines will result in blank pages or misleading output.

---

### Architecture Decisions (Open Questions Resolved)

**Q1 — PDF generation: `window.print()` or third-party library (jsPDF / html2canvas)?**

[DECISION: `window.print()` with `@media print` CSS — no new library dependencies]

No third-party PDF library is introduced in this ticket. `window.print()` remains the mechanism.

**Critical constraint:** All charts in `ClinicalReportPDF.tsx` MUST be inline SVG — not Recharts, not canvas-based components. Recharts renders to `<canvas>` which is silently dropped by browser print drivers. BUILDER must author lightweight inline SVG helper functions (e.g., `renderLineSVG(data, width, height)`) for the vitals trend chart and PHQ-9 trajectory chart. These are print-specific — they do not replace the live Recharts components in the Wellness Journey view.

If any chart cannot be rendered as inline SVG within this ticket's scope, BUILDER must display a clearly labeled placeholder: `"[Chart available in live view — open ClinicalReportPDF from Session Export Center to view]"`

**Q2 — Data flow: props, localStorage, or Supabase query on PDF mount?**

[DECISION: `sessionId` URL query param → Supabase query on mount via `usePhase3Data` hook]

`ClinicalReportPDF.tsx` is a standalone routed page at `/clinical-report`. It must:
1. Read `?sessionId=<uuid>` from the URL query string on mount
2. Call the same `usePhase3Data(sessionId)` hook used in `IntegrationPhase.tsx` to fetch real session data
3. Replace ALL `MOCK_*` constants with values from the hook response
4. Render an explicit `"Awaiting data"` placeholder for any field where the hook returns null/empty

No localStorage reads inside `ClinicalReportPDF.tsx`. No prop-drilling from WellnessJourney. The page is self-contained and route-addressable.

The URL to open the PDF report from `SessionExportCenter.tsx` will be: `/clinical-report?sessionId=${sessionId}`

**Q3 — Confidence Cone benchmark band: `[DEMO DATA]` watermark or label text only?**

[DECISION: Label text only — no additional watermark]

The `"Reference Cohort (N=14k published data)"` label on the benchmark band is sufficient for printed reports. A second watermark stamp would create visual noise and is not required by HIPAA for aggregate/de-identified benchmark data in a provider-facing report. The printed label attribution is the correct disclosure mechanism.

**Q4 — New page insertion order: replace mock page 3 or insert before page 4?**

[DECISION: Replace current mock page 3, expand to 7 pages. Approved page order per WO-554 PRODDY spec:]

| Page | Section |
|------|---------|
| 1 | Cover + Executive Summary |
| 2 | Baseline Clinical Profile |
| 3 | PHQ-9 Symptom Trajectory (inline SVG) |
| 4 | Dosing Session Record (vitals chart + event log table) |
| 5 | Experience Quality (MEQ-30, CEQ, EDI) |
| 6 | Integration + Safety (attendance, pulse check, safety events table) |
| 7 | Network Benchmarking + Report Certification |

All new pages carry the existing `PageShell` header/footer (page number, PPN Portal branding, HIPAA notice, report ID).

---

### Files to Touch

1. `src/pages/ClinicalReportPDF.tsx` — EXTEND: read `?sessionId` from URL, wire `usePhase3Data`, replace all `MOCK_*`, build 7-page layout with inline SVG charts
2. `src/pages/SessionExportCenter.tsx` — ADD: 5th export package "Clinical Outcomes PDF" button that navigates to `/clinical-report?sessionId=${sessionId}` (per WO-554 direction — same builder pass)
3. `src/hooks/usePhase3Data.ts` — EXTEND: add any missing queries needed by the PDF (confirmed in WO-552 scope)

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
