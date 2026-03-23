---
id: GO-643-BUILD
owner: BUILDER
status: 05_IMPLEMENTATION
authored_by: CUE
routed_by: CUE
priority: P1
created: 2026-03-20
approved_by: USER
approved_date: 2026-03-20
source_epic: _WORK_ORDERS/097_BACKLOG/WO-643_PDF_Report_Polish_Epic.md
ppn_ui_standards_review: PASSED (see compliance notes below)
skill_ref: .agent/skills/ppn-ui-standards
skill_ref_frontend: .agent/skills/frontend-best-practices
---

# BUILDER TICKET — GO-643: PDF Report Polish Epic (8 Sub-Tasks)

> **Source WO:** [WO-643_PDF_Report_Polish_Epic.md](file:///Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/097_BACKLOG/WO-643_PDF_Report_Polish_Epic.md)
> **CUE Audit Date:** 2026-03-20
> **Approved Mockups:** See walkthrough.md in brain artifact directory

---

## ppn-ui-standards Compliance Review

CUE has reviewed all 8 sub-tasks against `.agent/skills/ppn-ui-standards` SKILL.md. The following
corrections have been applied to the original WO-643 spec:

| Rule | Original WO-643 Spec | Corrected Spec |
|---|---|---|
| **Rule 5 — Page Size** | A4 (210mm x 297mm) | **US Letter (8.5x11in)** — `@page { size: letter; margin: 0.6in; }` |
| **Rule 5 — Table Headers** | `backgroundColor: '#1e3a5f'` dark fills | **Light tint `#ede9ff` with indigo text `#3730a3`** — no dark fills |
| **Rule 2b — Font** | `'Inter','Helvetica Neue',sans-serif` | `'Inter', ui-sans-serif, sans-serif` only. No Courier New anywhere. Monospace = `'Roboto Mono', ui-monospace, monospace` |
| **Rule 2 — Min Font Size** | Some labels at `fontSize: '8px'` | Minimum **9pt body copy (12px)**, minimum **7pt captions/footers** |
| **Rule 4 — Em Dashes** | No em dashes found | Confirmed clean — no em dashes in any spec |
| **Rule 1 — Color-Blindness** | Grade badges: color only | All grade/status badges MUST include text label alongside color |

> [!IMPORTANT]
> The `ClinicalReportPDF.tsx` gold standard uses A4. The ppn-ui-standards Rule 5 mandates
> US Letter for all print/PDF documents. BUILDER must use US Letter for all new PDFs.
> Do NOT follow the A4 dimensions in the existing ClinicalReportPDF.tsx — follow this ticket.

---

## Sub-Task Execution Order

Implement in this order (dependencies first):

### 1. WO-643-A — Fix Discharge Summary Header (QUICK WIN, ~30 min)
**File:** `src/services/dischargeSummary.ts`

**Problem:** Lines ~152-153 use `doc.setFillColor(...SLATE_900)` dark band. Printer-unfriendly.

**Fix:**
- Remove the full-width dark header fill rect
- Replace with: 6px tall thin rect filled with a smooth indigo-to-teal gradient using jsPDF `setFillColor` iteratively, OR use a simple indigo `#3730a3` 6pt top bar (acceptable fallback in jsPDF)
- Header row background: `setFillColor(248, 250, 252)` (slate-50) — NOT dark
- Table headers throughout: `setFillColor(237, 233, 255)` + `setTextColor(55, 48, 163)` — indigo tint, NOT `SLATE_900`
- Page size: change from A4 to `{ format: 'letter' }` — `new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' })`
- All font sizes: minimum 9pt body copy, minimum 7pt footer captions

**Acceptance criteria:**
- [ ] No `setFillColor(SLATE_900)` or any dark fill on printable rects
- [ ] Page format is `letter` (8.5x11in)
- [ ] All table headers use `#ede9ff` fill + `#3730a3` text
- [ ] TypeScript zero errors

---

### 2. WO-643-B — AE Report PDF (New file)
**New file:** `src/pages/AEReportPDF.tsx`
**Route:** Add to `src/App.tsx` as `/ae-report-pdf`

**Page Shell (copy from ClinicalReportPDF.tsx `PageShell`, adjust to US Letter):**
- Page: US Letter, `width: '8.5in'`, `minHeight: '11in'`, `backgroundColor: '#ffffff'`
- Top bar: `height: '6px'`, `background: 'linear-gradient(90deg,#1e3a5f 0%,#3b82f6 50%,#10b981 100%)'`
- Header row: `backgroundColor: '#f8fafc'`, PPN Portal branding left, report ID + page count right
- Footer: `backgroundColor: '#f8fafc'`, HIPAA notice left, generated date right

**Page 1 — Incident Report:**
- Cover block: AE Report ID (monospace), session date, substance + dose, site reference
- CTCAE Grade badge: pill with light tinted background + icon + text label
  - Grade 1-2: `backgroundColor: '#d1fae5'`, `color: '#065f46'`, `<CheckCircle />` icon
  - Grade 3: `backgroundColor: '#fef3c7'`, `color: '#92400e'`, `<AlertTriangle />` icon
  - Grade 4-5: `backgroundColor: '#fee2e2'`, `color: '#991b1b'`, `<AlertOctagon />` icon
- Section "INCIDENT SUMMARY" — key-value rows
- Section "INTERVENTION LOG" — table; header: `backgroundColor: '#ede9ff'`, `color: '#3730a3'`; rows alternate white/`#f8fafc`
- Section "RESOLUTION" — light green `#f0fdf4` box, dark green text
- Section "REGULATORY NOTIFICATION" — Grade 3+: amber `#fef3c7` action banner with `<AlertTriangle />` icon

**Page 2 — Sign-Off:**
- Section "PROVIDER SIGN-OFF"
- Clinician ID, date printed, blank signature line
- HIPAA footer

**Data source:** Props from URL params `?aeId=&sessionId=` — wire to `log_safety_events` via Supabase query or display "Awaiting data" gracefully if no params

---

### 3. WO-643-C — Session Timeline PDF (New file)
**New file:** `src/pages/SessionTimelinePDF.tsx`
**Route:** `/session-timeline-pdf`

**Page 1 — Cover + PK Chart:**
- Cover block: Session ID, date, substance/dose, clinician
- Section "PHARMACOKINETIC FLIGHT PLAN" — reuse `PKChart` SVG component from `ClinicalReportPDF.tsx` verbatim (it is already print-safe SVG)
- Phase background cells: light tints only (purple `rgba(167,139,250,0.12)`, teal, amber, pink — all at <= 0.12 opacity)

**Page 2 — Event Ledger:**
- Section "EVENT LEDGER" — full chronological table
  - Table header: `backgroundColor: '#ede9ff'`, `color: '#3730a3'`, font-weight 700
  - Alternating rows: white / `#f8fafc`
  - `safety_event` badge: `backgroundColor: '#fef3c7'`, `color: '#92400e'` + `<AlertTriangle />` icon text
  - `dose_admin` badge: `backgroundColor: '#ede9ff'`, `color: '#3730a3'`
  - All other badges: `backgroundColor: '#eff6ff'`, `color: '#1e40af'`
- Section "VITALS SNAPSHOT" — reuse `VitalsChart` SVG component from `ClinicalReportPDF.tsx`

**Data source:** `?sessionId=` param — via `usePhase3Data` hook or displays "Awaiting data"

---

### 4. WO-643-D — Safety Plan PDF (New file)
**New file:** `src/pages/SafetyPlanPDF.tsx`
**Route:** `/safety-plan-pdf`

**Single page (US Letter):**
- Cover block: Patient Subject_ID, session date, clinician, session type
- Section "RISK FLAGS" — table; header `#ede9ff`/`#3730a3`; status badges with icons:
  - MONITOR: amber + `<AlertTriangle />`
  - LOW RISK: teal + `<CheckCircle />`
  - HIGH RISK: red + `<AlertOctagon />`
- Section "EMERGENCY PROTOCOL" — key-value rows: rescue medication, conditions, authorization
- Section "EMERGENCY CONTACTS" — table; header `#ede9ff`/`#3730a3`; columns: Role, Contact Reference, Phone
- Section "ENVIRONMENTAL SAFETY CHECKLIST" — checklist rows; checked items: `<CheckSquare />` teal; unchecked: `<Square />` gray
- Section "PROVIDER ATTESTATION" — light `#f8fafc` box; attestation text; signature line

---

### 5. WO-643-E — Transport Plan PDF (New file)
**New file:** `src/pages/TransportPlanPDF.tsx`
**Route:** `/transport-plan-pdf`

**Single page (US Letter):**
- Cover block: Session ID, date, substance, expected release time
- Section "TRANSPORT AUTHORIZATION" — key-value table; header `#ede9ff`/`#3730a3`
- Section "ESTIMATED READINESS WINDOW" — horizontal phase bar (CSS only, no canvas):
  - PEAK: `backgroundColor: '#fef3c7'`
  - DESCENT: `backgroundColor: '#ccfbf1'`
  - SAFE TRANSPORT WINDOW: `backgroundColor: '#dcfce7'`
  - Green marker label: "Earliest Safe Release" with `<MapPin />` icon
- Section "CLINICIAN RELEASE CHECKLIST" — checkboxes with Lucide icons; pre-filled items use `<CheckSquare color="#10b981" />`; manual sign-off row uses `<Square color="#94a3b8" />`
- Section "PROVIDER SIGN-OFF" — gray attestation box, signature + date lines

---

### 6. WO-643-F — Research Report PDF (New file)
**New file:** `src/pages/ResearchReportPDF.tsx`
**Route:** `/research-report-pdf`

**Page 1 — Demographics + Outcomes:**
- Cover block: Export title, date range, cohort size, substance filter, PPN Portal v2.2
- Section "DEMOGRAPHIC SUMMARY" — two SVG inline bar charts side by side (US Letter width: `560px` viewBox each, halved); bars use blue gradient fills — NO dark backgrounds; axis labels minimum 9pt
- Section "OUTCOME METRICS" — table; header `#ede9ff`/`#3730a3`; columns: Measure, Baseline Mean, Final Mean, Avg Change (colored: teal if negative = improvement), Responder Rate

**Page 2 — Benchmark + AE:**
- Section "NETWORK BENCHMARK" — reuse `RadarChart` SVG from `ClinicalReportPDF.tsx`; wrap in white `#f8fafc` bordered container
- Section "ADVERSE EVENT SUMMARY" — 3 `MetricCell` components in a row (reuse from ClinicalReportPDF.tsx pattern)
- Section "DATA PROVENANCE" — key-value rows: collection dates, schema version (PPN v2.2), export audit ID
- HIPAA/IRB footer: "De-identified per 21 CFR Part 11 — IRB-ready export"

> **Note:** No patient-level data. Aggregated stats only. Cohort size driven by URL params for now; show "Sample data" banner if no real params.

---

### 7. WO-643-G — Insurance Report PDF (New file)
**New file:** `src/pages/InsuranceReportPDF.tsx`
**Route:** `/insurance-report-pdf`

**Page 1 — Diagnosis + Protocol:**
- Cover block: "LETTER OF MEDICAL NECESSITY", patient Subject_ID, payer reference, date, clinician
- Section "DIAGNOSIS AND TREATMENT JUSTIFICATION" — key-value rows; treatment rationale in `#f8fafc` italic text box
- Section "PROTOCOL DESCRIPTION" — key-value rows

**Page 2 — Evidence + Attestation:**
- Section "OUTCOME EVIDENCE" — inline PHQ-9 line chart (reuse `PHQ9Chart` SVG from ClinicalReportPDF.tsx); below chart: Response/Remission badge pills with `<CheckCircle />` icons
- Section "SAFETY PROFILE" — 3 MetricCell components: Total AEs, Grade 3+, Chemical Rescue Used
- Section "CLINICIAN ATTESTATION" — `#f8fafc` box with attestation text; fields: Clinician ID, Credentials (blank line for manual fill), Signature line, Date
- HIPAA footer every page

---

### 8. WO-643-H — Consent Plan PDF (New file)
**New file:** `src/pages/ConsentPlanPDF.tsx`
**Route:** `/consent-plan-pdf`

**Single page (US Letter, may overflow to page 2):**
- Cover block: "INFORMED CONSENT RECORD", Patient Subject_ID, session date, substance, session type, consent timestamp (auto-populated from system clock at render time)
- Section "SUBSTANCE AND PROTOCOL DISCLOSURE" — key-value rows; PK summary in `#f8fafc` text box
- Section "RISK DISCLOSURE" — checklist rows; each item: `<CheckCircle color="#10b981" />` + text label (no color-only indicators)
- Section "TOUCH CONSENT" — 2-column table; header `#ede9ff`/`#3730a3`; status column: "Permitted" in teal + `<CheckCircle />`, "Not Permitted" in red + `<XCircle />`
- Section "VOLUNTARY PARTICIPATION" — light blue `#eff6ff` bordered box with participation statement
- Section "ATTESTATION BLOCK" — `#f8fafc` box; auto-timestamped notice text (immutable, shown read-only); Patient Acknowledgment row (auto timestamp); Clinician Signature line
- Footer: lock icon SVG + "Audit Trail ID: [auditId] — 21 CFR Part 11 — Zero PHI — PPN Portal v2.2"

> **IMMUTABILITY NOTE:** Consent record timestamp is populated at render time from `new Date().toISOString()`. Do NOT allow any editable fields in the consent attestation block. This must be treated as a read-only audit document.

---

## Shared Component Reuse Map

| Component | Origin | Reuse In |
|---|---|---|
| `PageShell` (US Letter adapted) | New — base all on this | All 8 sub-tasks |
| `SectionTitle` | `ClinicalReportPDF.tsx` | All sub-tasks |
| `MetricCell` | `ClinicalReportPDF.tsx` | WO-643-B, F, G |
| `PHQ9Chart` (SVG) | `ClinicalReportPDF.tsx` | WO-643-G |
| `VitalsChart` (SVG) | `ClinicalReportPDF.tsx` | WO-643-C |
| `PKChart` (SVG) | `ClinicalReportPDF.tsx` | WO-643-C |
| `RadarChart` (SVG) | `ClinicalReportPDF.tsx` | WO-643-F |
| Lucide React icons | Already installed | All sub-tasks |

> BUILDER NOTE: Extract shared components into `src/components/pdf/` so they can be imported
> cleanly across all 8 PDF page files. Do not copy-paste the SVG implementations verbatim into
> each file.

---

## Global Page Shell Spec (US Letter)

```tsx
// src/components/pdf/PDFPageShell.tsx
const PDFPageShell: React.FC<{
  children: React.ReactNode;
  reportType: string;       // e.g. "Adverse Event Incident Report"
  reportId: string;
  pageNum: number;
  total: number;
  exportDate: string;
}> = ({ children, reportType, reportId, pageNum, total, exportDate }) => (
  <div className="pdf-page" style={{
    width: '8.5in', minHeight: '11in', backgroundColor: '#ffffff',
    fontFamily: "'Inter', ui-sans-serif, sans-serif", color: '#1e293b',
    position: 'relative', boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
    marginBottom: '24px', display: 'flex', flexDirection: 'column',
  }}>
    {/* 6px gradient accent bar */}
    <div style={{ height: '6px', background: 'linear-gradient(90deg,#1e3a5f 0%,#3b82f6 50%,#10b981 100%)' }} />
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0.6in 12px',
      borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg,#1e3a5f,#3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontSize: '14px', fontWeight: 900 }}>P</span>
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 900, color: '#1e3a5f',
            letterSpacing: '0.08em', textTransform: 'uppercase' }}>PPN Portal</div>
          <div style={{ fontSize: '9px', color: '#64748b' }}>{reportType}, CONFIDENTIAL</div>
        </div>
      </div>
      <div style={{ textAlign: 'right', fontSize: '9px', color: '#94a3b8' }}>
        <div style={{ fontWeight: 700, color: '#64748b', fontFamily: "'Roboto Mono', ui-monospace, monospace" }}>{reportId}</div>
        <div>Page {pageNum} of {total}</div>
      </div>
    </div>
    {/* Content */}
    <div style={{ flex: 1, padding: '24px 0.6in' }}>{children}</div>
    {/* Footer */}
    <div style={{ borderTop: '1px solid #e2e8f0', padding: '8px 0.6in',
      display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
      <span style={{ fontSize: '7pt', color: '#94a3b8' }}>HIPAA Compliant — 21 CFR Part 11 — All exports logged — PPN Portal v2.2</span>
      <span style={{ fontSize: '7pt', color: '#94a3b8' }}>Generated: {exportDate}</span>
    </div>
  </div>
);
```

---

## Print CSS (All PDF Pages)

```css
@media print {
  @page { size: letter; margin: 0.6in; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pdf-page {
    page-break-after: always; break-after: page;
    break-inside: avoid; box-shadow: none !important;
    margin-bottom: 0 !important; width: 100% !important;
  }
  .pdf-page:last-child { page-break-after: auto; }
  .no-print { display: none !important; }
}
```

---

## Files to Create

| File | Sub-Task | Route |
|---|---|---|
| `src/components/pdf/PDFPageShell.tsx` | Shared | (component, no route) |
| `src/components/pdf/PDFSectionTitle.tsx` | Shared | (component, no route) |
| `src/components/pdf/PDFMetricCell.tsx` | Shared | (component, no route) |
| `src/pages/AEReportPDF.tsx` | WO-643-B | `/ae-report-pdf` |
| `src/pages/SessionTimelinePDF.tsx` | WO-643-C | `/session-timeline-pdf` |
| `src/pages/SafetyPlanPDF.tsx` | WO-643-D | `/safety-plan-pdf` |
| `src/pages/TransportPlanPDF.tsx` | WO-643-E | `/transport-plan-pdf` |
| `src/pages/ResearchReportPDF.tsx` | WO-643-F | `/research-report-pdf` |
| `src/pages/InsuranceReportPDF.tsx` | WO-643-G | `/insurance-report-pdf` |
| `src/pages/ConsentPlanPDF.tsx` | WO-643-H | `/consent-plan-pdf` |

## Files to Modify

| File | Change |
|---|---|
| `src/services/dischargeSummary.ts` | WO-643-A: fix dark header, A4 to letter |
| `src/App.tsx` | Add 7 new routes |

---

## Acceptance Criteria (INSPECTOR Gate)

- [ ] All page backgrounds `#ffffff` or `#f8fafc` — zero dark fills
- [ ] All table headers: `backgroundColor: '#ede9ff'`, `color: '#3730a3'`
- [ ] Page size: US Letter (8.5x11in) in `@page` rule, NOT A4
- [ ] Font: Inter only. Monospace: Roboto Mono only. No Courier New, no serif.
- [ ] Minimum font size: 9pt body, 7pt captions/footers
- [ ] All color indicators paired with Lucide React icon OR text label
- [ ] No em dashes (—) anywhere in rendered output
- [ ] `window.print()` triggers correctly, `.no-print` toolbar is hidden
- [ ] TypeScript zero errors
- [ ] INSPECTOR QA script passes before commit
- [ ] Routes registered in `src/App.tsx`
