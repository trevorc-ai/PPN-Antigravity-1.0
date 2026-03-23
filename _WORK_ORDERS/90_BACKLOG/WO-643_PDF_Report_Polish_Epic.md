---
id: WO-643
title: "PDF Report Polish Epic — 7 Missing Polished PDF Exports"
status: 097_BACKLOG
owner: BUILDER
priority: P1
phase: Cross-Phase
skill: frontend-best-practices
created_at: "2026-03-20"
---

## Overview

A CUE audit on 2026-03-20 identified 8 report types in the platform. Only the **Clinical Outcomes Report** (`ClinicalReportPDF.tsx`) has a fully polished, printer-friendly PDF export. The following reports either export as plain `.txt` files, use printer-unfriendly dark background headers, or have no export capability at all.

> **PRINTER RULE (IMMUTABLE):** No solid dark background fills (`background: '#0f172a'`, jsPDF `setFillColor` on full-width rects). All page backgrounds must be white (`#ffffff`). Section headers use left-colored border accent or light tinted backgrounds only. This matches the ClinicalReportPDF standard exactly.

---

## Audit Summary

| Report | Current State | Action Required |
|---|---|---|
| `ClinicalReportPDF.tsx` | ✅ Polished React/print PDF | None — this is the gold standard |
| `dischargeSummary.ts` | ⚠️ jsPDF with dark SLATE_900 header band | Fix dark header to match print standard |
| `ae_report` (`aeReportGenerator.ts`) | ❌ Plain `.txt` download | Build polished React PDF page |
| `transport_plan` | ❌ Does not exist | Build from scratch |
| `session_timeline` | ❌ Only `.txt` in `LiveSessionTimeline.tsx` | Build polished React PDF page |
| `safety_plan` | ❌ Does not exist | Build from scratch |
| `research_report` | ❌ Does not exist | Build from scratch |
| `insurance_report` | ❌ Does not exist | Build from scratch |
| `consent_plan` | ❌ Does not exist | Build from scratch |

---

## Design Standard (Must Match ClinicalReportPDF)

All new PDFs must follow the `PageShell` pattern from `ClinicalReportPDF.tsx`:

- **Page background:** `#ffffff` (white), A4 210mm × 297mm
- **Top accent bar:** `height: 6px`, `background: linear-gradient(90deg, #1e3a5f, #3b82f6, #10b981)` — thin rainbow, NOT a full dark band
- **Header row:** `backgroundColor: '#f8fafc'`, white logo mark, left-side branding, right-side report ID + page count
- **Footer row:** `backgroundColor: '#f8fafc'`, HIPAA notice left, generated date right
- **Section titles:** Left-colored 3px border accent, `color: '#1e3a5f'`, full-width `#e2e8f0` rule
- **Metric cells:** `backgroundColor: '#f8fafc'`, `border: '1px solid #e2e8f0'`, colored value text
- **Print CSS:** `@media print { @page { size: A4; margin: 0; } body { -webkit-print-color-adjust: exact; } }`
- **Font:** Inter / Helvetica Neue
- **ZERO PHI:** Subject_ID only. No name, DOB, address in any output.

---

## Sub-Tasks

### WO-643-A: Fix Discharge Summary Dark Header (QUICK WIN)
**File:** `src/services/dischargeSummary.ts`
- Remove `setFillColor(SLATE_900)` header band on lines ~152–153
- Replace with: thin 6px gradient top bar + light `#f8fafc` header background
- Match ClinicalReportPDF `PageShell` header pattern using jsPDF primitives
- Keep all content sections intact — visual fix only

### WO-643-B: AE Report — TXT to Polished PDF
**Current file:** `src/services/aeReportGenerator.ts` (outputs `.txt`)
**New file:** `src/pages/AEReportPDF.tsx` (React/print, like ClinicalReportPDF)
**Route:** `/ae-report-pdf?aeId={id}&sessionId={id}`

Sections:
1. **Cover** — AE Report ID, CTCAE Grade badge (color-coded: Grade 1–2 teal, Grade 3+ amber, Grade 4–5 red), session date, substance, site
2. **Incident Summary** — Event type, severity grade band, onset time, duration, outcome
3. **Intervention Log** — Timestamped table: time post-dose, intervention description, pharmacological rescue (if any)
4. **Resolution & Follow-Up** — Resolution note, regulatory notification status (Grade 3+ = red action banner)
5. **Provider Sign-Off** — Clinician ID, date printed, signature line
6. **HIPAA footer** on every page

### WO-643-C: Session Timeline PDF
**Current file:** `src/components/wellness-journey/LiveSessionTimeline.tsx` (outputs `.txt`)
**New file:** `src/pages/SessionTimelinePDF.tsx`
**Route:** `/session-timeline-pdf?sessionId={id}`

Sections:
1. **Cover** — Session ID, date, substance, dose, duration, clinician
2. **PK Flight Plan Chart** — Reuse `PKChart` from `ClinicalReportPDF.tsx` with session events plotted on curve
3. **Event Ledger** — Full chronological table: timestamp, event type badge, description
4. **Vitals Overlay** — HR/BP chart across session timeline
5. **HIPAA footer** on every page

### WO-643-D: Safety Plan PDF
**New file:** `src/pages/SafetyPlanPDF.tsx`
**Route:** `/safety-plan-pdf?sessionId={id}`

Sections:
1. **Cover** — Patient Subject_ID, clinician, date, session type
2. **Risk Flags Summary** — Active flags from pre-session screening (contraindications, psychological risk level)
3. **Emergency Protocol** — Rescue medication authorization (drug name, dose, route, conditions for use)
4. **Emergency Contacts** — Role-based contacts (site emergency contact, referral, backup clinician)
5. **Environmental Safety Checklist** — Setting confirmation items (set/setting score, supervision ratio)
6. **Provider Attestation** — Clinician ID, date, signature line
7. **HIPAA footer** on every page

### WO-643-E: Transport Plan PDF
**New file:** `src/pages/TransportPlanPDF.tsx`
**Route:** `/transport-plan-pdf?sessionId={id}`

Sections:
1. **Cover** — Session ID, date, substance, expected session end time
2. **Transport Authorization** — Who is authorized to transport the patient (role, name anonymized to ID)
3. **Escort Requirements** — Supervision level, escort count, time post-session minimum
4. **Estimated Readiness Window** — Based on substance PK curve (reuse PK data from `ClinicalReportPDF`)
5. **Clinician Release Checklist** — Orientation assessment, affect, gait stability, instructions received
6. **Provider Sign-Off** — Clinician ID, date, signature line

### WO-643-F: Research Export PDF
**New file:** `src/pages/ResearchReportPDF.tsx`
**Route:** `/research-report-pdf?sessionId={id}&patientId={id}`

> This report contains **de-identified, aggregated** data only. It is intended for IRB submissions, outcomes research, and comparative benchmarking. No practitioner-identifiable data.

Sections:
1. **Cover** — PPN Portal Research Export, date range, cohort size, substance filter
2. **Demographic Summary** — Age bands, diagnosis distribution (no individual records)
3. **Outcome Metrics Table** — PHQ-9 baseline/final distributions, GAD-7, CAPS-5 (where available)
4. **Network Benchmark Comparison** — Reuse `NetworkBenchmarkBlock` from `ClinicalReportPDF.tsx`
5. **Adverse Event Summary** — AE count, grade distribution, substance breakdown (aggregated)
6. **Data Provenance** — Collection dates, schema version, export audit ID
7. **HIPAA / IRB Footer** — De-identification attestation per 21 CFR Part 11

### WO-643-G: Insurance Report PDF
**New file:** `src/pages/InsuranceReportPDF.tsx`
**Route:** `/insurance-report-pdf?sessionId={id}&patientId={id}`

> Designed specifically for insurance coverage documentation and reimbursement letters. Clinician-facing, de-identified to Subject_ID only.

Sections:
1. **Cover** — "Letter of Medical Necessity" header, date, payer reference
2. **Diagnosis & Treatment Justification** — Diagnosis, baseline severity (PHQ-9/GAD-7), treatment rationale
3. **Protocol Description** — Substance, dose, session count, supervision ratio
4. **Outcome Evidence** — PHQ-9 trajectory (chart), response/remission achieved badges
5. **Safety Profile** — AE count, grade summary, chemical rescue status
6. **Clinician Attestation** — Clinician ID, credentials field (for manual completion), date, signature
7. **HIPAA Notice** on every page

### WO-643-H: Consent Plan PDF
**New file:** `src/pages/ConsentPlanPDF.tsx`
**Route:** `/consent-plan-pdf?sessionId={id}`

> A pre-session consent summary document capturing the key disclosures made and confirmed by the patient. Audit-grade, immutable once generated.

Sections:
1. **Cover** — "Informed Consent Record", Patient Subject_ID, date, session type, clinician
2. **Substance & Protocol Disclosure** — Substance name, dose, expected duration, PK summary
3. **Risk Disclosure Summary** — Contraindications reviewed, psychological risks acknowledged, emergency plan acknowledged
4. **Touch Consent** — Touch consent policy, patient's settings (allowed/not allowed)
5. **Voluntary Participation** — Right to withdraw statement, contact for questions
6. **Attestation Block** — "Patient confirms receipt and understanding of the above" — date/timestamp (auto-populated from system, not editable), Clinician signature line
7. **HIPAA / Audit Trail** — Consent generation timestamp, audit trail ID, 21 CFR Part 11 compliance notice

---

## Acceptance Criteria (All Sub-Tasks)

- [ ] White page backgrounds — no solid dark fills anywhere in the printable area
- [ ] Top gradient accent bar (6px, matches ClinicalReportPDF exactly)
- [ ] Light `#f8fafc` header and footer bands
- [ ] HIPAA compliant: Subject_ID only, no PHI
- [ ] Renders correctly on A4 portrait (210mm × 297mm)
- [ ] All null/missing fields show graceful "Not recorded" fallback — no crashes
- [ ] `@media print` hides the toolbar (`.no-print` class)
- [ ] `window.print()` button triggers native print/save dialog
- [ ] TypeScript compiles with zero errors
- [ ] INSPECTOR QA script passes before commit

---

## Files to Create

| File | Sub-Task |
|---|---|
| `src/pages/AEReportPDF.tsx` | WO-643-B |
| `src/pages/SessionTimelinePDF.tsx` | WO-643-C |
| `src/pages/SafetyPlanPDF.tsx` | WO-643-D |
| `src/pages/TransportPlanPDF.tsx` | WO-643-E |
| `src/pages/ResearchReportPDF.tsx` | WO-643-F |
| `src/pages/InsuranceReportPDF.tsx` | WO-643-G |
| `src/pages/ConsentPlanPDF.tsx` | WO-643-H |

## Files to Modify

| File | Sub-Task |
|---|---|
| `src/services/dischargeSummary.ts` | WO-643-A (fix dark header) |
| `src/App.tsx` (or router file) | All — add new routes |

---

## Dependencies

- `jsPDF` is already installed (used by `dischargeSummary.ts`)
- `src/pages/ClinicalReportPDF.tsx` — reference implementation for all `PageShell`, `SectionTitle`, `MetricCell`, and chart components
- `src/components/compass/NetworkBenchmarkBlock.tsx` — used in ResearchReportPDF
- `src/hooks/usePhase3Data.ts` — data source for most reports

---

## ppn-ui-standards Amendment (Added 2026-03-20)

> **Routed through:** `_GROWTH_ORDERS/05_IMPLEMENTATION/GO-643_PDF_Report_Polish_BUILDER_Ticket.md`
> **Standard:** `.agent/skills/ppn-ui-standards` Rule 5 (Print & PDF Context)

The following corrections were applied to this WO spec before routing to BUILDER:

| Item | Original | Corrected |
|---|---|---|
| Page size | A4 (210mm × 297mm) | **US Letter (8.5in × 11in)** — `@page { size: letter; margin: 0.6in; }` |
| Table headers | Dark `#1e3a5f` fill | **`#ede9ff` fill + `#3730a3` text** — no dark fills on tables |
| Body font | `Helvetica Neue` fallback | **`Inter` only** — `'Inter', ui-sans-serif, sans-serif` |
| Monospace font | Not specified | **`'Roboto Mono', ui-monospace, monospace`** only |
| Min font size | Not specified | **9pt body minimum, 7pt caption/footer minimum** |
| Color indicators | Color only | **Must pair with Lucide React icon OR text label** |
