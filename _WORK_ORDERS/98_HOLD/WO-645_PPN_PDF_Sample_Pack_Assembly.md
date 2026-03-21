---
id: WO-645
title: "PPN PDF Sample Pack Assembly — The Proof of Capability Portfolio"
owner: LEAD
status: 98_HOLD
authored_by: PRODDY
date: 2026-03-20
priority: P1
tags: [outreach, sales, marketing, pdf, leave-behind]
held_at: 2026-03-20
hold_reason: "Two unresolved dependencies: (1) pdf-lib and sharp not installed in the project — run npm install --save-dev pdf-lib sharp puppeteer. (2) Source PDFs (adverse-event, informed-consent, safety-plan, session-timeline, transport-plan, LMN, discharge-summary, research-outcomes-export) must be pre-rendered from the React PDF components in the app and placed in public/outreach/source-pdfs/. BUILDER cannot assemble without these. Script scaffold and manifest are complete at scripts/assemble-sample-pack.js and scripts/manifests/clinic-director.json."
---

## PRODDY PRD

> **Work Order:** WO-645 — PPN PDF Sample Pack Assembly  
> **Authored by:** PRODDY  
> **Date:** 2026-03-20  
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Clinic directors evaluating PPN cannot currently receive a single tangible artifact that shows what the platform produces. The product is abstract — "a Zero-PHI clinical OS" — until a prospect sees actual output. Without a curated, print-ready portfolio of real platform exports, every sales conversation requires a live demo, which is expensive to schedule and impossible to leave behind. Outreach stalls because there is nothing physical or downloadable that proves institutional-grade capability.

---

### 2. Target User + Job-To-Be-Done

A clinic director or medical practice owner needs to review the exact compliance and clinical documents PPN generates so that they can make a purchase decision without requiring a live software demo.

---

### 3. Success Metrics

1. A single `PPN_Sample_Outputs.pdf` file is produced that opens correctly in Preview and Adobe Acrobat with all 3 module sections and a cover page, verified by INSPECTOR before handoff
2. All PDFs in the pack render with white backgrounds and synthetic (non-PHI) patient data — zero instances of dark/inverted headers confirmed by visual INSPECTOR QA
3. File is under 15MB so it can be attached to a cold-outreach email without triggering attachment size limits

---

### 4. Feature Scope

#### ✅ In Scope

- **Cover Page**: Rendered as a print-ready HTML/PDF page using the approved introductory copy (see Appendix A). Uses the existing PPN clinician packet design system (dark navy header, Inter font, branded footer). The official PPN Portal wordmark logo must appear on the cover page, sourced from `public/assets/ppn_portal_wordmark.png`. Do not use the 3D molecular viewer component (`PPNLogo.tsx`) for this document.
- **Module 1 — Liability Shield**: Assemble the following existing platform PDFs with synthetic demo data:
  - Adverse Event Incident Report (CTCAE-graded)
  - Informed Consent Record (immutable, timestamped)
  - Safety Plan (pre-session risk assessment)
  - Session Timeline (dosing session event ledger)
  - Transport Plan (post-session release protocol)
- **Module 2 — Clinical OS**: Assemble the following:
  - Letter of Medical Necessity / Insurance Report
  - Session Timeline Export (clinical version)
  - Drug Interaction Checker UI screenshot (formatted as a print exhibit page, labeled "Platform Screenshot")
- **Module 3 — Patient & Practice Artifacts**:
  - Clinical Discharge Summary
  - Research Outcomes Export
  - Two UI screenshots formatted as print exhibit pages: Symptom Decay Curve and Clinic Performance Radar
- **Module Divider Pages**: Thin, branded separator pages between each module with the module title, subtitle, and brief one-sentence description.
- **Synthetic Patient Persona**: All PDFs must use one consistent synthetic patient: `Subject ID: SYN-2024-042`, 44-year-old, treatment-resistant PTSD, failed 3 SSRIs, psilocybin-assisted therapy protocol, Clinic: "Horizon Integrative Health (Demo)."
- **Final Combination**: All pages merged in order into a single `PPN_Sample_Outputs.pdf`.

#### ❌ Out of Scope

- Any live database wiring or dynamic data generation — this is a static assembled document only
- New PDF report components not already built in the platform (new PDF development is tracked in WO-643)
- The digital HTML landing page version (tracked in WO-646)
- Any changes to existing PDF component source code — BUILDER must use existing exports only, or flag to LEAD if a component is broken
- Printing, mailing, or physical production — this ticket delivers a digital file only

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Active outreach is in progress to clinic directors (referenced: Dr. Smith follow-up, Sarah demo pipeline). A leave-behind PDF is the immediate unlock for cold outreach email campaigns and in-person meetings with high-value targets. No hard deadline but the outreach window is open now.

---

### 6. Open Questions for LEAD

1. Which tool is preferred for final PDF merging — a Node.js/`pdf-lib` script checked into the repo, or a standalone shell script using `pdfunite`/`gs`? The approach affects how BUILDER assembles the final file.
2. Do the UI screenshot exhibit pages need to be captured live from the running dev server (browser screenshots), or will static pre-captured PNG exports from the NotebookLM notebook suffice?
3. Should the synthetic patient persona (SYN-2024-042) be formalized as a reusable test fixture in the repo, or is it one-off for this document only?

---

### Appendix A — Approved Cover Page Copy

The following copy was approved by the user on 2026-03-20 and must appear verbatim on the cover page of `PPN_Sample_Outputs.pdf`:

```
# The PPN Deliverables: Automated Clinical Intelligence
A Sample Portfolio of PPN Generated Outputs

### The Problem with Psychedelic EMRs
Standard electronic medical records (EMRs) were not built for psychedelic-assisted therapy.
They force your practitioners to spend hours writing manual session notes, and worse, they
store massive amounts of vulnerable free-text Protected Health Information (PHI) that puts
your clinic at constant risk of a HIPAA breach or a state subpoena.

You don't need another place to type notes. You need a system that does the heavy lifting for you.

### The PPN Solution
The Psychedelic Practitioner Network (PPN) is a Zero-Knowledge Clinical Operating System.
By capturing structured, anonymized data at the point of care, PPN automatically generates
the institutional-grade reporting your business needs to survive and scale.

We don't ask you to trust our software; we ask you to review our outputs.

[Module 1, 2, 3 descriptions as structured in the original approved copy]

Review the Following Documents:
As you review the attached sample exports, remember: your clinical staff did not spend hours
formatting these PDFs. They simply tapped structured buttons during their normal workflow,
and PPN's architecture handled the rest.

Welcome to the future of psychedelic clinical operations.
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

**Q1 — PDF Merge Tool:** Use a Node.js script (`scripts/assemble-sample-pack.js`) with `pdf-lib`. The project is already Node-based; a checked-in script is reproducible, version-controlled, and doesn't require system-level dependencies (`gs`/`pdfunite` are not guaranteed on all dev machines). BUILDER must create this script in `scripts/` and document its usage in the file header.

**Q2 — UI Screenshot Source:** Use existing static `.webp` files from `public/screenshots/`. Do not spin up the dev server for screenshot capture. Confirmed asset mapping:
- Drug Interaction Checker → `public/screenshots/interation_checker.webp`
- Symptom Decay Curve → `public/screenshots/Phase3-Visual-Sympotom-Decay-Curve.webp`
- Clinic Performance Radar → `public/screenshots/Component-Clinic-Performance-Radar.webp`

BUILDER must convert `.webp` to `.png` if `pdf-lib` does not support WebP natively, or embed as JPEG at 90% quality to stay under the 15MB size limit.

**Q3 — Synthetic Persona Fixture:** Create a reusable JSON fixture at `public/outreach/fixtures/synthetic_patient_SYN2024042.json`. This will be shared by WO-645, WO-647, and any future outreach materials. BUILDER must not hardcode persona data inline.

**Output Location:** Final file delivered to `public/outreach/PPN_Sample_Outputs.pdf`.

**Design System Base:** Use `public/internal/founding_partner_docs/Clinician-Packet/clinician_html/00_Cover_Page.html` as the CSS/design reference for the cover and divider pages.

**LEAD routing:** → `03_BUILD`. No blockers.
