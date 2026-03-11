---
id: WO-592
title: Fix Patient Report Typography and SEO (from WO-590 Audit)
owner: LEAD
status: 01_TRIAGE
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
