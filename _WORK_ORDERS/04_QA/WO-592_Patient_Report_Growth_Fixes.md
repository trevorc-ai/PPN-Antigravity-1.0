---
id: WO-592
title: Fix Patient Report Typography and SEO (from WO-590 Audit)
owner: BUILDER
status: 04_QA
completed_at: 2026-03-11
builder_notes: "Added JSON-LD WebPage/MedicalWebPage schema via useEffect injection (no react-helmet-async needed). Dynamic document.title with substance + date. Fixed sub-14px text in phase strip (12→14px), session metadata (12→14px), and footer labels (11→14px). Added sticky above-the-fold share strip (position:sticky, top:0, zIndex:40) with Share with Practitioner + Share with Friend buttons. Also fixed broken const sharePractitioner declaration from edit."
priority: P1
---

# WO-592: Patient Report Growth Fixes

Following the INSPECTOR run of all 6 growth workflows on `src/pages/PatientReport.tsx` (WO-590), the following critical failures need to be routed to BUILDER:

### 1. SEO & AIO Specialist (Entity & Structure)
- **Missing JSON-LD & Meta Tags:** There is no `<script type="application/ld+json">` schema block or `<Helmet>` equivalent to define the page entity for AI crawlers.
- **Required Fix:** Add `react-helmet-async` with standard PatientReport JSON-LD schema and dynamic `<title>`.

### 2. UI/UX Auditor (FLO)
- **Text under 14px:** Dozens of elements violate the 14px minimum accessibility rule throughout the canvas (tooltips, brand pills, slide ranges, accordion headers, footer text).
- **Required Fix:** Scale up typography component-wide so no raw text falls below 14px.

### 3. Marketing QA Checklist (CRO & Meta)
- **CRO/CTA:** No primary CTA above the fold. The Share buttons are deep at the bottom of the page.
- **Required Fix:** Implement a sticky or hero-level share CTA.

Please route to `03_BUILD` for implementation.
