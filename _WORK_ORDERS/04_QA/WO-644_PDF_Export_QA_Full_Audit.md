---
id: WO-644
title: "PDF & Export QA — Full Platform Audit"
status: 04_QA
owner: INSPECTOR
priority: P1
phase: Cross-Phase
skill: inspector-qa-script
created_at: "2026-03-20"
depends_on: WO-643
---

## Summary

All PDF and document export outputs across the platform need a structured QA pass. The attached screenshot confirms at least one existing PDF renders with a solid dark header band that prints incorrectly. This WO covers every current export surface AND all new PDFs being built under WO-643.

INSPECTOR must run this checklist in full before any PDF route is considered shippable.

---

## Scope — All PDF & Export Surfaces

### Group A: React/Print PDF Pages (window.print)

| ID | File | Route | Status |
|---|---|---|---|
| A1 | `ClinicalReportPDF.tsx` | `/clinical-report-pdf` | Existing — QA required |
| A2 | `DemoClinicalReportPDF.tsx` | `/demo-clinical-report-pdf` | Existing — QA required |
| A3 | `AuditReportPDF.tsx` | `/audit-report-pdf` | Existing — QA required (**screenshot shows dark header printing**) |
| A4 | `PatientReportPDF.tsx` | `/patient-report-pdf` | Existing — QA required |
| A5 | `DataPolicyPDF.tsx` | `/data-policy-pdf` | Existing — QA required |
| A6 | `DataPolicyPrint.tsx` | `/data-policy/print` | Existing — QA required |
| A7 | `AEReportPDF.tsx` | `/ae-report-pdf` | **WO-643-B — QA after build** |
| A8 | `SessionTimelinePDF.tsx` | `/session-timeline-pdf` | **WO-643-C — QA after build** |
| A9 | `SafetyPlanPDF.tsx` | `/safety-plan-pdf` | **WO-643-D — QA after build** |
| A10 | `TransportPlanPDF.tsx` | `/transport-plan-pdf` | **WO-643-E — QA after build** |
| A11 | `ResearchReportPDF.tsx` | `/research-report-pdf` | **WO-643-F — QA after build** |
| A12 | `InsuranceReportPDF.tsx` | `/insurance-report-pdf` | **WO-643-G — QA after build** |
| A13 | `ConsentPlanPDF.tsx` | `/consent-plan-pdf` | **WO-643-H — QA after build** |

### Group B: jsPDF Service-Layer Exports

| ID | File | Output | Status |
|---|---|---|---|
| B1 | `dischargeSummary.ts` | `.pdf` via jsPDF | Existing — QA required (**WO-643-A dark header fix must apply first**) |
| B2 | `aeReportGenerator.ts` | `.txt` (pre WO-643-B) | QA that `.txt` output is complete and file names correctly |
| B3 | `pdfGenerator.ts` | TBD | QA output format and filename |
| B4 | `reportGenerator.ts` | TBD | QA output format and filename |
| B5 | `complianceDocuments.ts` | TBD | QA output format and filename |
| B6 | `narrativeGenerator.ts` | TBD | QA output format and filename |

### Group C: DownloadCenter Hub

| ID | File | Route | Status |
|---|---|---|---|
| C1 | `DownloadCenter.tsx` | `/download-center` | QA all download triggers surface correctly with correct labels and export types |

---

## QA Checklist (Run Per Surface)

### 1. Printer-Friendliness (Critical)

- [ ] **No dark backgrounds.** Open print preview (`Cmd+P`). Confirm zero dark-filled rectangles appear on page. Dark fills are a blocking failure.
- [ ] **Background graphics checkbox.** With "Background graphics" ON and OFF in print dialog, content remains fully legible.
- [ ] **Page fits without clipping.** No columns, charts, or tables overflow beyond the printable margin.
- [ ] **Page breaks.** Multi-page documents break between logical sections, not mid-table or mid-chart.

### 2. ppn-ui-standards Compliance (Rule 5)

- [ ] **Page size.** Group A (new WO-643 PDFs): `@page { size: letter; }`. Group A (existing pre-WO-643): verify no content clips on US Letter; log non-conformance for future sprint if A4.
- [ ] **Table headers.** No dark (`#1e3a5f` or similar) fills on table headers in the printed output. Correct: `#ede9ff` fill + `#3730a3` text.
- [ ] **Font.** Inter rendered correctly. No Courier New or serif fonts visible.
- [ ] **Minimum font size.** Zoom to 100% in print preview. Body text must be legible at 9pt minimum. Captions at 7pt minimum.
- [ ] **Em dashes.** Search rendered text for any `—` character. None permitted.

### 3. Content Accuracy

- [ ] **With real session data.** Open with a valid `?sessionId=` or `?aeId=` URL param. Confirm all fields populate from the database (no stale demo data shown as real data).
- [ ] **With no params (demo mode).** Open without params. Confirm graceful fallback: either demo data with "DEMO DATA" banner, or "Awaiting data" placeholders with no crashes.
- [ ] **Null field handling.** All null/missing database values show "Not recorded" — no blank white space, no `undefined`, no `null` strings.
- [ ] **Patient identifiers.** Confirm only Subject_ID appears. No name, DOB, address, email, or PHI anywhere on the printable page. HIPAA compliance is a P0 blocking failure.

### 4. Report ID and Filename

- [ ] **Report ID.** Every PDF has a unique report ID displayed in the header (monospace, right-aligned). Format: e.g., `RPT-YYYYMMDD-XXXXXXXX`.
- [ ] **Filename on save.** `Cmd+P` > Save as PDF. Filename must follow the pattern defined in the relevant WO. Examples:
  - Clinical: `PPN-Clinical-Outcomes-Report-RPT-...`
  - AE Report: `ae_report_SUB-XXXXXX_YYYY-MM-DD.txt` (or `.pdf` after WO-643-B)
  - Discharge: `discharge_summary_SUB-XXXXXX_YYYY-MM-DD.pdf`

### 5. Toolbar (No-Print)

- [ ] **Toolbar hidden on print.** The "Download PDF" / "Print" button and any top toolbar must not appear in the printed output. They must carry `.no-print` class verified by INSPECTOR in rendered DOM.
- [ ] **Print button works.** `window.print()` is triggered by the toolbar button. No console errors on click.

### 6. Accessibility & Color-Blindness (Rule 1)

- [ ] **No color-only indicators.** Every badge, status pill, or colored indicator pairs a Lucide React icon OR explicit text label with the color. Pure color with no text/icon is a blocking failure.
- [ ] **Contrast.** Text on colored backgrounds meets minimum contrast (eyeball check in print preview at 100%).

### 7. TypeScript & Build

- [ ] **Zero TypeScript errors.** `npm run build` or `npx tsc --noEmit` reports zero errors in any new or modified PDF file.
- [ ] **No console errors.** Open browser console while navigating to each PDF route. Zero `[ERROR]` log lines.

### 8. jsPDF Outputs (Group B only)

- [ ] **File is a real PDF.** Open `discharge_summary_*.pdf` in macOS Preview. It must render as a formatted document, not an error or blank page.
- [ ] **TXT outputs are complete.** Open `ae_report_*.txt`. All sections must be populated. No `undefined`, no empty `[time not recorded]` if time was provided.
- [ ] **Graceful jsPDF fallback.** For `dischargeSummary.ts`, simulate a jsPDF failure by temporarily not importing jsPDF. Confirm TXT fallback triggers without crashing the UI.

---

## Regression Tests

After any change to a PDF file, INSPECTOR must re-run this abbreviated regression checklist:

1. Open print preview — confirm no dark backgrounds
2. Confirm no PHI in rendered output
3. Confirm report ID is present
4. Confirm TypeScript zero errors

---

## Blocking Failures (P0 — Do Not Ship)

The following findings are a hard STOP — must be fixed before commit:

1. Dark solid background fills visible in print preview
2. Any PHI (name, DOB, address, email) visible in rendered output
3. Content clipping beyond printable area
4. `undefined` or `null` rendered as visible text
5. Color-only status indicators (no paired icon or text)
6. TypeScript errors in any modified PDF file

---

## Files to QA

Grouped by WO-643 sub-task order:

**Existing (QA immediately):**
- `src/pages/ClinicalReportPDF.tsx`
- `src/pages/AuditReportPDF.tsx` — priority, screenshot shows dark header
- `src/pages/PatientReportPDF.tsx`
- `src/pages/DataPolicyPDF.tsx`
- `src/pages/DemoClinicalReportPDF.tsx`
- `src/pages/DataPolicyPrint.tsx`
- `src/services/dischargeSummary.ts`
- `src/services/aeReportGenerator.ts`
- `src/services/pdfGenerator.ts`
- `src/services/reportGenerator.ts`
- `src/services/complianceDocuments.ts`
- `src/services/narrativeGenerator.ts`
- `src/pages/DownloadCenter.tsx`

**After WO-643 BUILDER completes:**
- `src/pages/AEReportPDF.tsx`
- `src/pages/SessionTimelinePDF.tsx`
- `src/pages/SafetyPlanPDF.tsx`
- `src/pages/TransportPlanPDF.tsx`
- `src/pages/ResearchReportPDF.tsx`
- `src/pages/InsuranceReportPDF.tsx`
- `src/pages/ConsentPlanPDF.tsx`
- `src/services/dischargeSummary.ts` (after WO-643-A header fix)
- `src/components/pdf/PDFPageShell.tsx` (new shared component)

---

## Notes

- `AuditReportPDF.tsx` is a priority: the attached screenshot clearly shows a dark header band
  printing on-screen, likely caused by the same `SLATE_900` fill pattern as `dischargeSummary.ts`.
  INSPECTOR must flag this to BUILDER for a WO-643-A-style fix if the header is dark-filled.
- `ClinicalReportPDF.tsx` uses A4. Per ppn-ui-standards Rule 5, US Letter is the standard.
  Log this as a non-conformance note but do NOT block on it — it is the gold-standard design
  reference and will be standardized in a future dedicated sprint.
- Group B services (`pdfGenerator.ts`, `narrativeGenerator.ts`, etc.) may output CSV or TXT.
  INSPECTOR should document the actual output format and flag any that should be upgraded to PDF.
