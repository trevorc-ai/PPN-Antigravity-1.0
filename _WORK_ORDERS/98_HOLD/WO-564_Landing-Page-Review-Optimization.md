---
title: "Landing Page Review & Optimization"
id: "WO-564"
status: "01_TRIAGE"
owner: "LEAD"
date: "2026-03-01"
---

## PRODDY PRD

> **Work Order:** WO-564 — Landing Page Review & Optimization
> **Authored by:** PRODDY (Direct to Triage)
> **Date:** 2026-03-01
> **Status:** Pending LEAD review

---

### 1. Problem Statement
The landing page has missing or incomplete aspects under the surface — components or graphics not loading correctly, layering (z-index) issues, poor load speed optimization, and missing SEO metadata (favicon, title, description, social Open Graph images). This hurts performance, accessibility, and discoverability.

---

### 2. Target User + Job-To-Be-Done
The user needs to experience a fast, fully-loaded, and properly rendering landing page so that they can discover the platform without interruptions or visual bugs.

---

### 3. Success Metrics
1. All landing page graphics and components load completely with correct z-index layering 100% of the time.
2. Google Lighthouse (or equivalent) performance score improves due to speed optimizations (e.g., lazy loading, compression).
3. SEO tags (title, description, OG images, favicon) are confirmed present and correct via page inspector.

---

### 4. Feature Scope

#### ✅ In Scope
- Fixing graphics or components that fail to load or render incorrectly.
- Auditing and fixing z-index or layering issues.
- Page speed optimization (lazy loading images, compressing assets).
- Adding missing SEO metadata (favicon, SEO image, title, description).

#### ❌ Out of Scope
- Cosmetic design changes or restyling.
- Structural layout changes to the landing page.
- Addition of new sections or copy changes.

---

### 5. Priority Tier
**[x] P1** — High value, ship this sprint  

**Reason:** Core discoverability (SEO) and first-impression performance (load speed) are critical for platform credibility. 

---

### 6. Open Questions for LEAD
None — spec is complete.

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
- [x] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====

---

## LEAD Build Plan

### Overview
This ticket requires fixing functional and performance regressions on the Landing Page. No cosmetic redesign is authorized. We will accomplish this in three specific ways: lazy loading heavy demo components, fixing known z-index overlaps, and adding essential SEO tags to the raw HTML entry point.

### Architectural Steps

**1. Speed Optimization (React Lazy/Suspense) in `Landing.tsx`**
- Currently, `SafetyRiskMatrixDemo`, `ClinicRadarDemo`, `PatientJourneyDemo`, and `AllianceWall` are statically imported at the top of the file.
- Convert these imports to `React.lazy()`.
- Wrap their instances inside `<Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-500">Loading component...</div>}>`.
- *Reasoning:* These components pull in Recharts layer and large datasets, hurting Initial Load speed.

**2. Component Layering (z-index and overflow) in `Landing.tsx`**
- Inspect the demo wrappers (e.g., around line 700+ where `pointer-events-none` and `min-w-[500px]` are set). 
- Ensure that the parent container has `overflow-hidden` so that demo charts don't bleed out of their glassmorphism containers if rendered broadly on small screens.
- Ensure `relative z-10` or higher is placed on text elements that overlap background glares.

**3. SEO / HTML Completeness (`index.html`)**
- Edit `/index.html` to include a proper `<meta name="description" content="Psychedelic Practitioners Network (PPN) is a clinical intelligence alliance for outcomes tracking..."/>`
- Add Open Graph (`og:title`, `og:description`, `og:image`, `og:type`, `og:url` if applicable) inside `<head>`.
- Add `<link rel="icon" type="image/svg+xml" href="/logo.svg" />` (use a placeholder icon if an explicit one isn't in `/public` yet).

### Handoff
Moving to `03_BUILD`. Author is assigned to execute.
