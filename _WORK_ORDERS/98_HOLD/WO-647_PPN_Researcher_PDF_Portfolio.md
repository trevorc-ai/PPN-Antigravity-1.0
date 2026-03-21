---
id: WO-647
title: "PPN Researcher PDF Portfolio — Institutional RWE & Telemetry Data Pack"
owner: LEAD
status: 98_HOLD
authored_by: PRODDY
date: 2026-03-20
priority: P1
tags: [outreach, research, pdf, IRB, RWE, NYU, MAPS, academic, leave-behind]
held_at: 2026-03-20
hold_reason: "Same two dependencies as WO-645: (1) npm install --save-dev pdf-lib sharp puppeteer needed. (2) Source PDFs for researcher portfolio must be pre-rendered and placed in public/outreach/source-pdfs/ — specifically: research-outcomes-export-RES-2026Q1-PSIL.pdf (rendered from platform component with synthetic_cohort_PSIL2026Q1.json fixture) and adverse-event-report-AE-20260319-B7F3.pdf. Script and manifest ready at scripts/manifests/researcher.json. Cohort fixture created at public/outreach/fixtures/synthetic_cohort_PSIL2026Q1.json."
---

## PRODDY PRD

> **Work Order:** WO-647 — PPN Researcher PDF Portfolio  
> **Authored by:** PRODDY  
> **Date:** 2026-03-20  
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Academic researchers, Principal Investigators, and CRO partners cannot evaluate PPN using the same materials sent to clinic directors. Materials referencing insurance billing (LMN) or compliance defense will cause a PI or data scientist to dismiss the platform as a commercial billing tool. Currently no curated, research-specific artifact exists that speaks the language of longitudinal RWE, ontologies, and 21 CFR Part 11 compliance. Without a purpose-built researcher portfolio, the NYU/MAPS pipeline and similar institutional contacts cannot be meaningfully engaged.

---

### 2. Target User + Job-To-Be-Done

A Principal Investigator or CRO research director needs to review the PPN platform's structured data exports, telemetry depth, and audit trail so that they can assess whether PPN is a viable IRB-approvable data source for a longitudinal psychedelic research study.

---

### 3. Success Metrics

1. A single `PPN_Researcher_Data_Portfolio.pdf` is produced with all 3 module sections and a branded cover page, verified by INSPECTOR before handoff
2. Zero billing or insurance documents appear in the researcher portfolio — confirmed by INSPECTOR checklist item before file is approved
3. File is under 15MB and renders correctly in Adobe Acrobat and Preview, confirmed at QA before handoff

---

### 4. Feature Scope

#### ✅ In Scope

- **Cover Page**: Rendered using approved introductory copy (see Appendix A). Subject line: `PPN Clinical Data Ecosystem: Sample Exports & Telemetry Framework`. Uses PPN clinician packet design system (Inter font, dark navy header, branded footer). Official PPN Portal wordmark logo sourced from `public/assets/ppn_portal_wordmark.png` — do not use `PPNLogo.tsx`.
- **Module 1 — Real-World Evidence (RWE) & Cohort Analytics**:
  - Research Outcomes Export PDF (`RES-2026Q1-PSIL`) — primary asset, must lead the section. Exhibits: baseline vs. final PHQ-9 scores, responder/remission rates, adverse event summary across a de-identified cohort
  - Symptom Decay Curve Timeline UI screenshot — formatted as a labeled print exhibit page
  - Patient Outcome Constellation UI screenshot (combined view) — labeled print exhibit page
- **Module 2 — Advanced Telemetry & Pharmacokinetics**:
  - System and Mood Heatmap UI screenshot — labeled print exhibit page showing physiological/ psychological correlation
  - Molecular Binding Affinity Matrix UI screenshot — labeled print exhibit page proving receptor-level pharmacological tracking
  - Neuroplasticity Window UI screenshot — labeled print exhibit page demonstrating post-acute window tracking
- **Module 3 — Data Integrity & Audit Standards**:
  - Clinical Record Audit Logs UI screenshot — labeled print exhibit, annotated with "21 CFR Part 11 / Cryptographic Hash Verification"
  - Adverse Event Incident Report PDF (`AE-20260319-B7F3`) — exhibit showing MedDRA code mapping and CTCAE v5.0 severity grading
- **Module Divider Pages**: Branded separator pages per module with title, subtitle, and one-sentence research-specific rationale
- **Synthetic Research Cohort**: All PDFs use de-identified cohort persona: `Cohort ID: PSIL-2026-Q1`, n=24, treatment-resistant MDD, psilocybin-assisted therapy, 3-site aggregated, no individual PHI exposed
- **Final Assembly**: All pages merged in order into `PPN_Researcher_Data_Portfolio.pdf`

#### ❌ Out of Scope

- Any billing, insurance, or LMN documents — these must not appear anywhere in this packet
- Any compliance/defense framing (state audit, medical board) — wrong audience signal
- The clinic director PDF pack (WO-645) or digital HTML version (WO-648)
- New data visualization builds — exhibit screenshots from existing platform only
- Live API calls, dynamic data, or database wiring — static assembled document only
- Physical printing, mailing, or VDR upload — this ticket delivers the digital file only

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Active outreach pipeline to NYU/MAPS institutional contacts. The researcher portfolio is a distinct, parallel deliverable from WO-645 and should ship concurrently. Delay costs real institutional relationship warmth.

---

### 6. Open Questions for LEAD

1. Same PDF merge tooling question as WO-645: `pdf-lib` (Node) or `pdfunite`/`gs` (shell)? Can the same merge script from WO-645 be reused?
2. The Research Outcomes Export PDF (`RES-2026Q1-PSIL`) — does this already exist as a rendered export from the platform, or does it need to be generated fresh with a new synthetic cohort fixture?
3. Should `PPN_Researcher_Data_Portfolio.pdf` live in the same output directory as `PPN_Sample_Outputs.pdf` (WO-645), or in a separate `_OUTREACH/researcher/` folder?

---

### Appendix A — Approved Cover Copy

The following introductory copy was approved by the user on 2026-03-20 and must appear verbatim:

```
Subject: PPN Clinical Data Ecosystem: Sample Exports & Telemetry Framework

The PPN Data Ecosystem: Institutional RWE & Telemetry Portfolio
Enabling clean, longitudinal, Zero-PHI data aggregation for psychedelic meta-analysis.

The Data Bottleneck in Psychedelic Research
Current longitudinal studies in psychedelic medicine are bottlenecked by legacy Electronic
Health Records (EHRs). Because standard EHRs rely on unstructured, free-text clinical
notes, researchers are forced to spend thousands of hours manually coding qualitative data
into quantifiable metrics. Furthermore, the presence of Protected Health Information (PHI)
severely limits cross-site data sharing and benchmarking.

The PPN Architecture
The Psychedelic Practitioner Network (PPN) solves this by enforcing strict, standardized
ontologies (RxNorm, MedDRA, SNOMED) at the point of clinical capture. By utilizing a strict
Zero-PHI, cryptographically hashed architecture, PPN allows researchers to safely aggregate
Real-World Evidence (RWE) across hundreds of independent clinics without ever triggering
HIPAA breach liability or IRB data-sharing violations.

[Module 1, 2, 3 section descriptions as structured in the original approved copy]

The Takeaway:
When a data scientist or PI reads this, they will realize they are looking at a platform
built by someone who actually understands how clinical trials work.
```

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

## LEAD Architecture Decisions — 2026-03-20

**Q1 — PDF Merge Tool:** Use the same `scripts/assemble-sample-pack.js` script from WO-645 (`pdf-lib`). BUILDER must parameterize the script to accept a manifest JSON so it can produce both `PPN_Sample_Outputs.pdf` (WO-645) and `PPN_Researcher_Data_Portfolio.pdf` (WO-647) from the same tool. Do not create a second script.

**Q2 — Research Outcomes Export Source:** The Research Outcomes Export PDF (`RES-2026Q1-PSIL`) does not exist as a pre-rendered static file. BUILDER must render it from the existing platform export component using the synthetic cohort fixture (`public/outreach/fixtures/synthetic_cohort_PSIL2026Q1.json` — BUILDER must create this fixture alongside the one from WO-645). If the platform export component cannot render without a live DB, BUILDER must flag to LEAD and we will scope a static mockup variant.

**Q3 — Output Location:** `public/outreach/researcher/PPN_Researcher_Data_Portfolio.pdf`. Parallel to the clinic director output at `public/outreach/PPN_Sample_Outputs.pdf`. Keeps audience-specific artifacts cleanly separated.

**Confirmed asset mapping for exhibit pages:**
- Symptom Decay Curve → `public/screenshots/Phase3-Visual-Sympotom-Decay-Curve.webp`
- Patient Outcome Constellation → `public/screenshots/Patient Constellation.webp`
- System & Mood Heatmap → `public/screenshots/Phase3-Visual-Score-DailyPulse-WeeklyPHQ9.webp`
- Molecular Binding Affinity Matrix → `public/screenshots/Binding Affinity Matrix.webp`
- Neuroplasticity Window → `public/screenshots/Phase3-Visual-Neuroplasticiy-Window.webp`
- Clinical Record Audit Logs → `public/screenshots/Component-Audit-logs.webp`

**Design System Base:** Use `public/internal/founding_partner_docs/Researcher-Packet/researcher_html/00_Cover_Page.html` as the CSS/design reference. Do NOT use the Clinician Packet design files — these are distinct audiences.

**LEAD routing:** → `03_BUILD`. BUILDER must flag if Research Outcomes Export cannot be rendered statically.
