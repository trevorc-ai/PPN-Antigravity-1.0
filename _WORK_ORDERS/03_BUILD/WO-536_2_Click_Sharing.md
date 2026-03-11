==== PRODDY ====
---
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
---

## PRODDY PRD

> **Work Order:** WO-536 — 2-Click Intelligence Sharing  
> **Authored by:** PRODDY  
> **Date:** 2026-03-04  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

Practitioners frequently want to share compelling clinical intelligence, visualizations, or "cool data insights" with colleagues and patients to drive education and engagement. Currently, doing this requires multiple clicks, navigating away from the active screen, or taking manual screenshots. In fast-paced operational environments, this multi-step friction prevents organic sharing and stifles the network-growth potential of the platform's visual assets. 

---

### 2. Target User + Job-To-Be-Done

A licensed practitioner needs to instantly share a dynamic visualization or data insight so that they can quickly educate a patient or collaborate with a colleague without interrupting their clinical workflow.

---

### 3. Success Metrics

1. Share/Export action successfully completes in ≤ 2 clicks for 95% of tracked sessions.
2. Zero PHI is present or transmitted in the shared output across 50 consecutive QA tests.
3. Native mobile/tablet share sheet or link generation invokes in < 1.0 seconds.

---

### 4. Feature Scope

#### ✅ In Scope

- "1-Tap Share" functionality embedded within major visualization cards (e.g., Flight Plan Chart, Emotional Waveform, Spider Graphs).
- Generation of a visually polished, de-identified static image or secure link of the specific view.
- Invocation of the native mobile/tablet share sheet (iOS/Android via web API).
- PPN branding/watermarking automatically applied to the shared asset.

#### ❌ Out of Scope

- Generation of comprehensive, multi-page clinical PDF reports (this is a separate feature).
- Real-time collaborative editing of the shared view.
- Complex PHI scrubbing pipelines (the visualizations must be inherently Zero-PHI by design).

---

### 5. Priority Tier

**[X] P1** — High value, ship this sprint  

**Reason:** This directly supports the Global and Clinical messaging pillars by capitalizing on practitioner enthusiasm ("Hey look at this"). Turning the app into a frictionless, 2-click viral sharing tool for clinical intelligence drives immediate organic product awareness and engagement.

---

### 6. Open Questions for LEAD

1. Should the "share" action generate a rendered static image (Canvas/PNG) or a secure public URL linking back to the platform?
2. How do we ensure dynamic/interactive SVG visualizations capture their exact current state (e.g., specific zoom or filter) when the image is generated?
3. What is the most reliable method for invoking the native mobile share sheet via React in our current deployment environment?

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

## LEAD ARCHITECTURE

**Routed by:** LEAD
**Route date:** 2026-03-10
**Owner:** BUILDER
**Route:** 01_TRIAGE → 03_BUILD (after Trevor confirms sharing mechanism preference below)

### Open Question Resolutions:

**Q1 — Image vs. URL:** Generate a **secure public URL** (not a rendered PNG). Reason: static PNG capture is brittle on dynamic SVG charts (zoom state, filters) and adds complexity. A URL is simple, PHI-free (links to aggregate/benchmarked views only), and persistent. PNG can be added later as V2.

**Q2 — SVG current state capture:** Not applicable if we use URL approach. For URL sharing, the shared link shows the practitioner's aggregate benchmarked view — same chart, same data, no user-specific session data.

**Q3 — Native mobile share sheet:** Use the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) (`navigator.share()`). This is supported on iOS Safari (our primary mobile target). Fall back to clipboard copy on desktop. Same pattern already used in `vip-invite-flow.html`.

### Architecture Decision:
- Add a Share icon button to: **Flight Plan Chart**, **Emotional Waveform Card**, **Spider/Radar Graph** (the 3 highest-value viz cards)
- On tap: construct a URL to the relevant benchmark view (URL structure TBD by BUILDER based on current routing)
- Invoke `navigator.share({ title: 'PPN Clinical Intelligence', url: shareUrl })` → clipboard fallback
- All shared URLs must link to public/anonymous views — zero practitioner-identifiable data in the URL

**Move to 03_BUILD after this architecture note is complete.**

