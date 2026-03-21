---
id: WO-648
title: "PPN Researcher Digital Portfolio — Institutional RWE & Telemetry HTML Leave-Behind"
owner: LEAD
status: 04_QA
authored_by: PRODDY
date: 2026-03-20
priority: P1
tags: [outreach, research, html, digital, IRB, RWE, NYU, MAPS, academic, VDR]
completed_at: 2026-03-20
builder_notes: "Delivered self-contained HTML file at public/outreach/researcher/PPN_Researcher_Portfolio.html. Academic/minimal tone: white/bg-subtle body, navy accent. Architecture callout strip (ontologies, 21 CFR Part 11, Zero-PHI). 3-module tabs: RWE, Telemetry, Data Integrity. All 8 screenshots embedded from public/screenshots/. Footer CTA to info@ppnportal.net with Request Data Access and PDF download links. CSS: 2 overrides only per LEAD Q4 decision."
---

## PRODDY PRD

> **Work Order:** WO-648 — PPN Researcher Digital Portfolio (HTML)  
> **Authored by:** PRODDY  
> **Date:** 2026-03-20  
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Institutional contacts at NYU, MAPS, and CROs operate in a document-heavy environment where a VDR link or email attachment is the standard engagement mechanism. A static PDF (WO-647) solves the print use case, but a digital HTML artifact allows for a richer, more interactive first impression — tabbed navigation between research modules, annotated exhibit callouts, and an embedded download link for the full data room. Without this, outreach to research partners is limited to a single flat file that cannot guide a PI through a narrative exploration of the platform's data capabilities.

---

### 2. Target User + Job-To-Be-Done

A Principal Investigator or research director needs to navigate an interactive, browser-based showcase of PPN's RWE exports and telemetry dashboards so that they can self-educate on the platform's research capabilities before a formal discovery call.

---

### 3. Success Metrics

1. The HTML portfolio loads fully in under 3 seconds and all 3 module tabs are navigable without a page reload, confirmed by INSPECTOR in Chrome DevTools
2. The file is self-contained with zero external CDN dependencies, confirmed by INSPECTOR by running it with network access disabled in browser DevTools
3. The "Request Data Access" CTA button renders correctly in both desktop and mobile viewports (tested at 1440px and 375px widths), confirmed by INSPECTOR before handoff

---

### 4. Feature Scope

#### ✅ In Scope

- **Single self-contained HTML file**: `PPN_Researcher_Portfolio.html`, using the same design system as the clinician packet (`public/clinician_packet/`). Zero external CDN dependencies.
- **Cover / Hero Section**: Full-width branded header with approved introductory copy (see WO-647 Appendix A). Official PPN Portal wordmark logo sourced from `public/assets/ppn_portal_wordmark.png` — do not use `PPNLogo.tsx`. Sticky tab bar for Module 1: RWE, Module 2: Telemetry, Module 3: Data Integrity.
- **Tone and vocabulary calibration**: All section labels and annotations must use research vocabulary (RWE, ontology, CTCAE, 21 CFR Part 11, IRB) — not clinical or billing vocabulary. BUILDER must review WO-647 in full before writing any annotation copy.
- **Module 1 — RWE & Cohort Analytics Tab**:
  - Research Outcomes Export exhibit (primary, full-width)
  - Symptom Decay Curve Timeline exhibit
  - Patient Outcome Constellation exhibit
  - Annotation beneath each: 1 sentence explaining research utility (e.g., "Automated calculation of responder and remission rates across de-identified cohorts")
- **Module 2 — Telemetry & Pharmacokinetics Tab**:
  - System and Mood Heatmap exhibit with annotation
  - Molecular Binding Affinity Matrix exhibit with annotation
  - Neuroplasticity Window exhibit with annotation
- **Module 3 — Data Integrity & Audit Standards Tab**:
  - Clinical Record Audit Logs exhibit, annotated with "21 CFR Part 11 compliant — cryptographic hash chain verified per entry"
  - Adverse Event Report exhibit, annotated with "CTCAE v5.0 severity grading, MedDRA code auto-mapped at point of capture"
- **Footer CTA**: "Request Data Access" button linking to a `mailto:` address (to be provided by user). Secondary link: "Download Full Portfolio (PDF)" pointing to `PPN_Researcher_Data_Portfolio.pdf` (WO-647 output).
- **Print Stylesheet**: `@media print` so the page prints cleanly if forwarded as a physical document.
- **Distinct visual identity from WO-646**: While using the same base design system, the researcher portfolio must feel academic and data-focused — not clinical/commercial. Recommend: use a lighter, more minimal color treatment (white/light-grey body, navy accents only) rather than the darker treatment appropriate for the clinic director pack. BUILDER should flag to LEAD if this requires a new CSS variant.

#### ❌ Out of Scope

- Any insurance, billing, LMN, or compliance-defense content — wrong audience signal
- Live API calls, dynamic data, or database wiring — static HTML only
- A public web server, CDN, or hosting infrastructure
- New data visualization code builds — all exhibits are static image captures
- The clinic director digital portfolio (WO-646) — separate file, separate ticket

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Direct parallel to WO-647. The digital version is the VDR email link and the "forward to a colleague" artifact. Both WO-647 and WO-648 should ship together as the complete researcher outreach kit.

---

### 6. Open Questions for LEAD

1. What is the `mailto:` address for the "Request Data Access" CTA in the footer?
2. Should `PPN_Researcher_Portfolio.html` live in `public/outreach/researcher/` or the same directory being established for the clinic director pack (WO-646)?
3. Can the exhibit images (PNG screenshots from the platform) be shared between WO-646 and WO-648 from a common `/assets/` folder, or should the two portfolios remain completely isolated files?
4. Does BUILDER need to create a new CSS variant for the "academic / minimal" visual tone, or should they use the existing clinician packet stylesheet with reduced color saturation? This needs a LEAD decision before styling begins to avoid a layout regression.

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

**Q1 — CTA mailto:** Confirmed: `info@ppnportal.net`. No placeholder — BUILDER must use this address directly.

**Q2 — Output Location:** `public/outreach/researcher/PPN_Researcher_Portfolio.html`. Parallel to `public/outreach/clinic-director/PPN_Digital_Portfolio.html` (WO-646). Each portfolio lives in its own audience-specific subfolder.

**Q3 — Shared Assets:** Yes — both WO-646 and WO-648 draw from `public/screenshots/`. BUILDER must reference screenshots via relative paths in the build script and not duplicate image files. The base64-inlining build script from WO-646 should be parameterized to accept a manifest so it can produce both HTML outputs.

**Q4 — CSS Variant:** Do NOT create a new CSS file or variant. BUILDER must use the existing Researcher Packet stylesheet from `public/internal/founding_partner_docs/Researcher-Packet/researcher_html/` and override only body background and card background to `white` / `#F8F9FC`. This is two CSS overrides — not a new variant. If BUILDER finds more than 5 CSS lines need changing, stop and flag to LEAD.

**Confirmed asset mapping for exhibit pages:**
- Research Outcomes Export → rendered from platform component (see WO-647 Q2 decision)
- Symptom Decay Curve → `public/screenshots/Phase3-Visual-Sympotom-Decay-Curve.webp`
- Patient Outcome Constellation → `public/screenshots/Patient Constellation.webp`
- System & Mood Heatmap → `public/screenshots/Phase3-Visual-Score-DailyPulse-WeeklyPHQ9.webp`
- Molecular Binding Affinity Matrix → `public/screenshots/Binding Affinity Matrix.webp`
- Neuroplasticity Window → `public/screenshots/Phase3-Visual-Neuroplasticiy-Window.webp`
- Audit Logs → `public/screenshots/Component-Audit-logs.webp`
- Adverse Event Report → `public/screenshots/Phase2.3.3-Form-Adverse-Events.webp`

**LEAD routing:** → `03_BUILD`. No blockers.
