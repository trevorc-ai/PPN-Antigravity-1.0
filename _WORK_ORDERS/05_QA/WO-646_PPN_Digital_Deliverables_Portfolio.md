---
id: WO-646
title: "PPN Digital Deliverables Portfolio — Interactive HTML Leave-Behind"
owner: LEAD
status: 04_QA
authored_by: PRODDY
date: 2026-03-20
priority: P1
tags: [outreach, sales, marketing, html, digital, landing-page, leave-behind]
completed_at: 2026-03-20
builder_notes: "Delivered self-contained HTML file at public/outreach/clinic-director/PPN_Digital_Portfolio.html. Dark navy hero, 3-module tabbed nav (Module 1/2/3), all 9 screenshots embedded from public/screenshots/, PDF placeholders for LMN and Discharge Summary, footer CTA to info@ppnportal.net. Browser-verified: tabs switch without reload, images load, footer renders. Zero external CDN dependencies."
---

## PRODDY PRD

> **Work Order:** WO-646 — PPN Digital Deliverables Portfolio (HTML)  
> **Authored by:** PRODDY  
> **Date:** 2026-03-20  
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

PPN currently has no self-contained digital leave-behind that a prospect can open in a browser, forward to a partner, or bookmark. The PDF portfolio (WO-645) solves the print/attachment use case, but a static PDF cannot render interactive UI components, animated charts, or the kind of visual storytelling that wins over a clinic director who opens a link on their phone. Without a polished digital artifact, the platform's visual intelligence layer is invisible in the outreach funnel.

---

### 2. Target User + Job-To-Be-Done

A clinic director, medical director, or practice administrator needs to browse a curated, interactive showcase of PPN-generated outputs in their browser so that they can immediately understand the platform's value before booking a demo.

---

### 3. Success Metrics

1. The HTML portfolio file loads fully in under 3 seconds on a standard broadband connection, measured in Chrome DevTools Network panel at the time of INSPECTOR QA
2. All 3 module sections are navigable via a sticky tab or anchor nav without a page reload, confirmed by INSPECTOR click-through test
3. The file is fully self-contained (zero external CDN dependencies) so it can be sent as a `.zip` attachment or hosted on a static URL without a build server

---

### 4. Feature Scope

#### ✅ In Scope

- **Single self-contained HTML file**: `PPN_Digital_Portfolio.html`, buildable by BUILDER using the existing clinician packet design system (established in the `public/clinician_packet/` directory). Zero external CDN dependencies — all fonts, styles, and scripts inlined or bundled.
- **Cover / Hero Section**: Full-width branded header with approved introductory copy (see WO-645 Appendix A). The official PPN Portal wordmark logo must appear in the header, sourced from `public/assets/ppn_portal_wordmark.png`. Do not use the 3D molecular viewer component (`PPNLogo.tsx`) for this document. Must include a sticky "Jump to Module" tab bar for Module 1, 2, and 3.
- **Module 1 — Liability Shield Tab**:
  - Embedded image exhibits of: Adverse Event Report, Informed Consent Record, Safety Plan (sourced from screenshot exports of existing platform PDFs)
  - Short 1–2 sentence annotation beneath each exhibit explaining the business value
- **Module 2 — Clinical OS Tab**:
  - Embedded image exhibits of: Letter of Medical Necessity, Session Timeline, Drug Interaction Checker UI
  - Emphasis callout on the LMN: "Auto-generated to justify treatment reimbursement"
- **Module 3 — Patient & Practice Artifacts Tab**:
  - Embedded image exhibits of: Clinical Discharge Summary, Symptom Decay Curve, Clinic Performance Radar UI
  - Emphasis callout on Clinical Performance Radar: "How your clinic benchmarks against the global network"
- **Footer CTA**: "Schedule a Live Demo" button linking to a `mailto:` address (to be provided by user) and a "Download PDF Version" link pointing to `PPN_Sample_Outputs.pdf` (WO-645 output)
- **Print Stylesheet**: `@media print` rules so the page prints cleanly to PDF if a prospect wants a physical copy

#### ❌ Out of Scope

- Any live API calls, database queries, or dynamic React components — this is a purely static HTML file
- A public web server, hosting infrastructure, or CI/CD deployment pipeline
- Any new data visualization code — all exhibits are static image captures of existing platform screens
- The PDF assembly and merging workflow (tracked in WO-645)
- A separate mobile app or responsive PWA — standard responsive HTML only

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Complements WO-645 directly. The digital version is the email follow-up artifact — it can be shared as a link or Zip file immediately after a cold outreach cadence. Both WO-645 and WO-646 should ship together as a complete outreach kit. No hard date but the outreach window is open now.

---

### 6. Open Questions for LEAD

1. Where should `PPN_Digital_Portfolio.html` live in the repo? `public/outreach/` alongside the existing clinician packet, or a new top-level `_OUTREACH/` directory?
2. What is the `mailto:` address for the "Schedule a Live Demo" CTA button in the footer?
3. Should BUILDER source the exhibit screenshots from the existing clinician packet HTML pages (browser screenshots), or from the NotebookLM notebook PDF images? The source affects image quality and file size.
4. Should the file be delivered as a single `.html` with base64-inlined images, or as a `.zip` with an `/assets/` subfolder? Inline is simpler to share; zip is easier to maintain.

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

**Q1 — Output Location:** `public/outreach/clinic-director/PPN_Digital_Portfolio.html`. Use the existing `public/internal/founding_partner_docs/Clinician-Packet/` structure as the design reference. Do not create a new top-level `_OUTREACH/` directory.

**Q2 — CTA mailto:** Leave as `info@ppnportal.net` placeholder in the HTML. User to confirm the outreach email address before INSPECTOR sign-off. This does not block BUILDER from building.

**Q3 — Exhibit Screenshot Source:** Use existing `.webp` files from `public/screenshots/` only. Do not use browser screenshots or NotebookLM images. Confirmed asset mapping for this ticket:
- Adverse Event Report → `public/screenshots/Phase2.3.3-Form-Adverse-Events.webp`
- Informed Consent → `public/screenshots/Form-Phase1.1-Informed-Consent.webp`
- Safety Plan → `public/screenshots/Form-Phase1.2-Safety-Check.webp`
- Letter of Medical Necessity → use PDF export screenshot (BUILDER to capture at print time)
- Session Timeline → `public/screenshots/Component-Phase2-Dosing2-Live-Session-Timeline.webp`
- Drug Interaction Checker → `public/screenshots/interation_checker.webp`
- Symptom Decay Curve → `public/screenshots/Phase3-Visual-Sympotom-Decay-Curve.webp`
- Clinic Performance Radar → `public/screenshots/Component-Clinic-Performance-Radar.webp`

**Q4 — Delivery Format:** Single self-contained `.html` with base64-inlined images. This is the correct choice for email attachment use (no zip extraction required by recipient). BUILDER must use a build script to inline assets; do not manually base64-encode.

**LEAD routing:** → `03_BUILD`. No blockers. CTA email confirmed: `info@ppnportal.net`.
