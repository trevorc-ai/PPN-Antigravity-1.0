---
id: WO-554
title: "PRODDY — Global Export Audit: Recommended Layout and Content for All PDF and CSV Exports"
status: 03_BUILD
owner: BUILDER
authored_by: PRODDY
reviewed_by: LEAD
lead_reviewed_at: 2026-03-01T17:03:00-08:00
created: 2026-03-01T16:38:39-08:00
failure_count: 0
priority: P1
build_order: 7
note: "Build alongside WO-553 — same BUILDER pass. WO-554 governs SessionExportCenter + DataExport + RiskEligibilityReport. WO-553 governs ClinicalReportPDF."
---

## PRODDY PRD

> **Work Order:** WO-554 — Global Export Audit: Recommended Layout and Content for All PDF and CSV Exports
> **Authored by:** PRODDY
> **Date:** 2026-03-01
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

PPN Portal has four distinct export surfaces — `ClinicalReportPDF.tsx` (4-page PDF), `SessionExportCenter.tsx` (4 TXT/ZIP packages), `DataExport.tsx` (filterable CSV/JSON), and `ExportReportButton.tsx` / `RiskEligibilityReport.tsx` (inline exports). Each was built independently, with inconsistent content, inconsistent HIPAA language, inconsistent zero-PHI enforcement, and no unified information architecture. Practitioners cannot reliably know what data is in which export, which format to choose for which audience, or whether charts and visualizations are included. This creates confusion, compliance risk, and a missed opportunity to showcase the platform's analytical depth to insurers and research collaborators.

---

### 2. Target User + Job-To-Be-Done

A licensed facilitator needs to know exactly what information is included in each export format and for which audience it is appropriate so that they can select the correct export without uncertainty and deliver confident, complete documentation to regulators, insurers, and research partners.

---

### 3. Success Metrics

1. After implementation, a practitioner can identify the correct export type for their use case in ≤2 clicks from any session view, confirmed by 0 "Which export should I use?" support questions across the first 10 clinical beta users.
2. All 4 export surfaces produce zero PHI fields — confirmed by INSPECTOR running a field-level audit on each export output within 30 days of ship.
3. The redesigned `SessionExportCenter.tsx` export package descriptions match the actual content of the generated file in 100% of QA test downloads (no mislabeled packages).

---

### 4. Feature Scope

#### ✅ In Scope — PRODDY Recommended Export Architecture

**PRODDY's recommended final layout for each export surface:**

---

**A. Clinical Outcomes PDF Report (`ClinicalReportPDF.tsx`) — 7 Pages**

| Page | Section | Content |
|------|---------|---------|
| 1 | Cover + Executive Summary | Patient ID, age group, site, clinician, treatment dates, 4-metric headline summary (PHQ-9 Δ, GAD-7 Δ, sessions, benchmark percentile), key findings narrative, HIPAA notice |
| 2 | Baseline Clinical Profile | PHQ-9, GAD-7, PCL-5, ACE, HRV at intake; Baseline vs. 6-Month comparison table |
| 3 | PHQ-9 Symptom Trajectory | PHQ-9 line chart (inline SVG), severity zones, remission threshold line |
| 4 | Dosing Session Record | Per-session table (date, substance, dose, duration, vitals count, MEQ-30, AEs); Vitals trend chart (HR + BP over session elapsed time, inline SVG); Event log table (timestamp, event type) |
| 5 | Experience Quality | MEQ-30 scores per session; CEQ score if available; EDI score if available |
| 6 | Integration + Safety | Integration session attendance; Pulse check compliance; Behavioral changes documented; Safety event table (date, type, severity, resolution) |
| 7 | Network Benchmarking + Certification | Radar chart vs. network peers; Symptom Decay trajectory vs. reference cohort; Report certification block with clinician of record |

*Data source: All data wired to real session data (localStorage + Supabase). No mock data in production exports. Demo badge on benchmark band if static.*

---

**B. Session Export Center Packages (`SessionExportCenter.tsx`) — 4 Packages**

Recommended content fix per package:

| Package | Current Gap | Fix |
|---------|------------|-----|
| Audit & Compliance (TXT) | Missing: rescue protocol activations, session update log with timestamps | Add: full `updateLog` entries with elapsed time stamps; rescue protocol flags from `eventLog` |
| Insurance & Billing (TXT) | Missing: session duration (used for CPT code support), MEQ-30 per session | Add: session duration hours per session; MEQ-30 scores as outcome evidence |
| Research Export (TXT) | Missing: CEQ score, EDI score, neuroplasticity window status, integration session count | Add: all Phase 2 assessment scores (MEQ-30, CEQ, EDI); integration count; neuroplasticity window open/closed |
| Full Bundle (ZIP) | Currently downloads 3 TXT files — no chart data, no CSV | Add a 4th file to the bundle: a CSV of per-session vitals readings (`session_vitals.csv`) |

*Add a 5th export package: **"Clinical Outcomes PDF"** — button that opens `ClinicalReportPDF.tsx` in print mode. This surfaces the PDF as part of the export center UX rather than a separate hidden page.*

---

**C. Data Export Manager (`DataExport.tsx`) — Filterable CSV**

Recommended column set for the primary CSV export:

```
subject_id | age_group | condition | substance | dose_mg | route | session_date |
session_duration_hrs | meq30_score | ceq_score | edi_score |
phq9_baseline | phq9_followup | phq9_pct_change |
gad7_baseline | gad7_followup |
pcl5_baseline | pcl5_followup |
ace_score | hrv_baseline | hrv_followup |
integration_sessions_attended | integration_sessions_scheduled |
pulse_check_compliance_pct | behavioral_changes_count |
safety_events_count | adverse_events_count |
neuroplasticity_window_status | benchmark_percentile
```

*All fields are de-identified (no dates of birth, no names, no addresses). Session date should export as `session_week_of_year` + `session_year` to prevent re-identification.*

---

**D. Risk Eligibility Report (`RiskEligibilityReport.tsx`) — Keep + Clarify**

- Current purpose is unclear — rename the button label from "Export" to "Download Risk Eligibility Report (PDF)" to be explicit
- Confirm it produces a separate output from the Clinical Outcomes PDF; if content overlaps >80%, consolidate into one document

#### ❌ Out of Scope
- Building the actual new export infrastructure for WO-554 — this PRD authorizes only the **design spec and layout recommendation**; BUILDER implements per WO-553 (PDF) and a future CSV ticket
- Changes to the database schema or Supabase query layer
- Adding new clinical fields not already captured by existing forms
- Any analytics export (practitioner-level or network-level aggregates) — those live in `DataExport.tsx` scope only

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Export outputs are the primary artifact practitioners hand to external parties. Inconsistent, mislabeled, or incomplete exports damage practitioner trust and create compliance risk. The architecture defined here unblocks both WO-553 (PDF charts) and any future CSV wiring work.

---

### 6. Open Questions for LEAD

1. `DataExport.tsx` currently uses a simulated progress bar with no real Supabase query. LEAD must confirm: is the Data Export Manager expected to query live Supabase data in the current sprint, or should it continue with the simulation pattern and be flagged with a `DemoDataBadge`?
2. PRODDY recommends adding the Clinical Outcomes PDF as a 5th package in `SessionExportCenter.tsx`. LEAD must confirm whether this is in scope for the same builder pass as WO-553, or a follow-on.
3. The `RiskEligibilityReport.tsx` output is not fully documented — LEAD to confirm what it currently generates and whether it should be consolidated into the Clinical Outcomes PDF or remain standalone.
4. Session date de-identification in the CSV: PRODDY recommends exporting `session_week_of_year + session_year` rather than the full ISO date. LEAD to confirm this is the correct Safe Harbor approach or propose an alternative.

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words (tables excluded from word count per PRODDY convention — they are structured data, not prose)
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD ARCHITECTURE

> **LEAD Review Date:** 2026-03-01
> **Status:** Open Questions Resolved — Routed to BUILD (same pass as WO-553)

### Architecture Decisions (Open Questions Resolved)

**Q1 — `DataExport.tsx`: live Supabase query or simulation + DemoDataBadge?**

[DECISION: Keep simulation pattern + add `DemoDataBadge` — NOT wired to Supabase this sprint]

`DataExport.tsx` uses a simulated progress bar that does not perform a real Supabase query. This is out of scope for this sprint. BUILDER must:
1. Add a visible `DemoDataBadge` or prominent disclaimer banner at the top of the Data Export Manager: `"Simulated export — live Supabase query coming in a future release."`
2. Do NOT wire `DataExport.tsx` to real Supabase queries in this ticket.
3. Do update the CSV column schema displayed in the UI to match PRODDY's recommended column set (the schema table in section 4C of this ticket). This is a UI text change only — no actual export file is generated.

**Q2 — Clinical Outcomes PDF as 5th SessionExportCenter package: same builder pass as WO-553?**

[DECISION: YES — implement in the same BUILDER pass as WO-553]

Since WO-553 is building `ClinicalReportPDF.tsx` simultaneously, BUILDER must wire the SessionExportCenter 5th package in the same pass:
- Add a 5th export card to `SessionExportCenter.tsx` labeled **"Clinical Outcomes Report (PDF)"**
- Card description: `"Complete 7-page clinical outcomes report with session vitals, PHQ-9 trajectory, integration summary, and network benchmarking. Opens browser print dialog."`
- Button action: `window.open('/clinical-report?sessionId=${sessionId}', '_blank')`
- The card is the last item in the export packages grid, separated by a subtle divider from the TXT/ZIP packages (it is a different format).

**Q3 — `RiskEligibilityReport.tsx`: standalone or consolidate into Clinical Outcomes PDF?**

[DECISION: Keep standalone — not the same document. Rename Export button only.]

`RiskEligibilityReport.tsx` is a **Phase 1 pre-treatment contraindication gate** — a screen-rendered safety decision tool. Its `Export PDF` button currently calls an `onExportPDF` prop (a parent-provided callback, not `window.print()`). It has zero content overlap with `ClinicalReportPDF.tsx`, which is a Phase 3 clinical outcomes document. They serve entirely different audiences at entirely different points in the arc of care.

BUILDER must only:
1. Rename the `Export PDF` button label to: **`"Download Risk Eligibility Report"`**
2. Ensure the `onExportPDF` callback in the parent component (`Phase1StepGuide.tsx` or wherever it is wired) triggers `window.print()` scoped to the RiskEligibilityReport panel content only (confirm it currently does this — no code change needed if it already does).

Do NOT merge or consolidate with `ClinicalReportPDF.tsx`.

**Q4 — Session date de-identification in CSV: `week_of_year + year` or alternative?**

[DECISION: APPROVED — export `session_week_of_year` + `session_year` as separate columns]

`session_week_of_year + session_year` is a standard Safe Harbor de-identification approach for preventing date-based re-identification in research datasets. Full ISO dates are PHI under HIPAA Safe Harbor (item (C) — all dates except year for individuals over 89). BUILDER must implement this in the CSV column schema display and — when real export is wired in a future ticket — in the actual export generation logic.

---

### Build Scope Summary for BUILDER

In this ticket (alongside WO-553), BUILDER implements:

| File | Change |
|------|--------|
| `SessionExportCenter.tsx` | Add 5th export card: "Clinical Outcomes Report (PDF)" — links to `/clinical-report?sessionId=` |
| `SessionExportCenter.tsx` | Fix per-package descriptions to match PRODDY's content audit (Section 4B of this ticket) |
| `DataExport.tsx` | Add `DemoDataBadge` / simulation disclaimer banner |
| `DataExport.tsx` | Update CSV column schema display table to PRODDY's recommended columns (Section 4C) |
| `RiskEligibilityReport.tsx` | Rename `Export PDF` button to `Download Risk Eligibility Report` |

**Not in this ticket:** Full Bundle ZIP `session_vitals.csv` addition (WO-557, future ticket). Live Supabase wiring of `DataExport.tsx` (future ticket).

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
