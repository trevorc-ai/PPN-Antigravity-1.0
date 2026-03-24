---
id: GO-661
title: "PPN Portal ROI Analysis — Time Savings, Dollar Value & Practitioner Impact Report"
owner: PRODDY
status: 00_BACKLOG
authored_by: PRODDY (fast-track)
priority: P1
created: 2026-03-23
fast_track: false
target_audience: Clinic Directors, Practice Owners, Insurance Partners, Research Institutions
notebook_source: N/A
prototype_reference: None
linked_wo: TBD
epic_type: PDF_Asset
---

## PRODDY PRD

### 1. Problem Statement

Practitioners and clinic directors evaluating PPN Portal have no quantified, evidence-based understanding of the time and financial value the platform creates versus manual (hand-written or EHR-typed) clinical documentation. Without a concrete ROI narrative, adoption decisions default to status quo. The platform has significant, measurable time-saving advantages that are currently invisible in all sales, outreach, and onboarding materials.

### 2. Target User + Job-To-Be-Done

A clinic director or practice owner needs to see a credible, quantified comparison of manual-vs-PPN documentation time and dollar cost so that they can justify the platform investment to their finance team or board without requiring a pilot study.

### 3. Success Metrics

1. ROI document is cited in at least 1 outreach conversation or demo within 14 days of publication
2. The time-savings calculator component (if built) is opened by ≥ 3 unique practitioners within 30 days
3. All time estimates are sourced from verifiable clinical workflow research (no invented data)

### 4. Feature Scope

#### In Scope:

**A. Time-Savings Analysis — Documentation Tasks**
For each task below, calculate:
- Average time to complete by hand (manual/paper/EHR free-text)
- Average time to complete in PPN Portal
- Delta (time saved per instance)
- Annualized savings at typical clinical volume (e.g., 40 patients/year, 3 dosing sessions each)

| Task to Measure | Manual Method | PPN Method |
|---|---|---|
| Pre-session baseline screening (PHQ-9, GAD-7, ACE, PCL-5, HRV) | Paper form + manual EHR transcription | Structured select form, auto-calculated |
| Informed consent documentation | Free-text + signature scanning | Structured consent log with timestamp hash |
| Dosing session vitals log (q-15 min readings) | Paper vitals sheet + transcription | Real-time vitals entry form |
| Adverse event documentation (MedDRA coding) | Narrative note + manual lookup | Structured AE form with MedDRA auto-code |
| Post-session integration notes | SOAP notes in EHR free-text | Structured integration checklist |
| Clinical outcomes export (for insurance) | Manual chart compilation + PDF creation | One-click Insurance & Billing PDF |
| Audit & compliance report (for legal review) | Multi-source document assembly | One-click Audit & Compliance PDF |
| Research dataset contribution (de-identification) | Manual data scrubbing + spreadsheet | Zero-PHI architecture, automatic |
| Drug interaction verification | Manual PubMed/reference lookup | Interaction Checker (13-point matrix) |

**B. Dollar Value Calculation**
- Assign a blended hourly rate for practitioner time (use published ranges: $75–$150/hr licensed therapist, $200–$400/hr prescribing psychiatrist)
- Calculate savings in dollars per task, per patient, per year
- Present three scenarios: Solo practitioner, Small clinic (3 practitioners), Medium clinic (10 practitioners)

**C. Risk & Liability ROI**
- Cost of one regulatory audit without compliant documentation (legal + remediation estimate from published sources)
- Cost of one adverse event defense without timestamped, MedDRA-coded records
- Probability reduction offered by compliant structured documentation
- "Insurance premium equivalence" framing: if PPN saves $X in audit risk annually, that's equivalent to $X in malpractice insurance value

**D. Network Intelligence Value**
- What does equivalent benchmarking data cost from a research data vendor (e.g., IQVIA, Definitive Healthcare)?
- PPN provides this as a native outcome — assign a market-rate dollar value
- Frame as: "PPN Portal includes $Y/yr of research intelligence at no additional cost"

**E. Additional ROI Angles**
- **Error prevention value**: Published rate of drug interaction adverse events in manual documentation vs. systematic checking
- **Reimbursement acceleration**: Properly formatted insurance submissions vs. claim rejection/rework cost
- **Practitioner time redirected to care**: Hours/week reclaimed vs. administrative burden (cite published EHR burden studies for comparison baseline)
- **Regulatory penalty avoidance**: 21 CFR Part 11 non-compliance fines ($10K–$1M range, cite FDA published schedules)

#### Out of Scope:
- Interactive in-app calculator (separate WO if approved)
- Custom ROI calculations for specific clinics (professional services)
- Competitive benchmarking against specific named EHR vendors

### 5. Priority Tier

**P1** — This deliverable directly supports beta practitioner conversion and investor/partner conversations. No hard deadline currently, but blocks the next outreach wave.

### 6. Open Questions for LEAD

1. Should the final deliverable be a PDF leave-behind only, or also a scrollable web page at `/roi` on the marketing site?
2. Do we have any real usage timing data from the Compass Demo (Trevor's testing sessions) to use as empirical baseline instead of estimates?
3. Should the three clinic-size scenarios use a specific pricing model assumption, or remain pricing-agnostic for now?

---

## Brief

Produce a comprehensive, data-driven ROI analysis document that quantifies the economic and clinical value of PPN Portal versus manual documentation methods. The deliverable is a professional-grade PDF (and optionally a web page) suitable for sharing with clinic directors, practice owners, insurers, and research partners. It must use verifiable external research for time-estimate baselines and present a credible, conservative calculation methodology — no invented statistics.

## MARKETER Task List

- [ ] Research and cite published average documentation times for each task in the table above (sources: APA clinical workflow studies, EHR burden research, CMS time-motion studies)
- [ ] Draft the Time-Savings Analysis section with calculations across 3 clinic sizes
- [ ] Draft the Dollar Value section using blended hourly rate ranges
- [ ] Draft the Risk & Liability ROI section with cited legal/regulatory sources
- [ ] Draft the Network Intelligence Value section with market-rate comparables
- [ ] Draft Additional ROI Angles section
- [ ] Write executive summary (≤ 200 words) for busy clinic directors
- [ ] Produce `CONTENT_MATRIX.md` with all copy sections and a visual layout brief for DESIGNER

## Prompt Engineering Context (for AI-assisted research)

Use the following prompt template for researching clinical documentation time benchmarks:

```
Act as a healthcare workflow research analyst with expertise in clinical documentation burden studies.

Analyze published research from [APA / CMS / HIMSS / JAMA / health IT journals] and extract:
1. Average time (in minutes) a licensed therapist or prescribing psychiatrist spends on {task_name} using paper/EHR free-text methods
2. Published source citation (author, year, journal)
3. Whether the estimate applies to psychedelic-assisted therapy specifically or general outpatient therapy

Output format: markdown table with columns: Task | Avg Time (min) | Source | Applicability to PAT

Let's think step by step: first identify the task category, then find the closest published analog, then note any adjustments needed for the psychedelic therapy context.
```

## Reference Assets

- Screenshots: `public/screenshots/Marketing-Screenshots/webp/`
- Existing audit: `_GROWTH_ORDERS/02_USER_REVIEW/GO-660_CONTENT_MATRIX.md` (Part 5 improvement backlog for task context)
- PPN workflow documentation: `MASTER_PLAN.md`
- Task list reference: See table in Section 4 above (9 documentation tasks to measure)
