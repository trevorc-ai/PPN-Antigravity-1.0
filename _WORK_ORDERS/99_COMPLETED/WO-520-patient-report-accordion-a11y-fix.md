---
id: WO-520
title: PatientReport Accordion — Accessibility Fix (color-blind + button type)
owner: LEAD
status: 01_TRIAGE
filed_by: INSPECTOR
date: 2026-03-03
priority: P1
file: src/pages/PatientReport.tsx
route: /patient-report
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-520 — PatientReport Accordion Accessibility Remediation  
> **Authored by:** PRODDY / INSPECTOR  
> **Date:** 2026-03-03  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

The `Accordion` component added to `PatientReport.tsx` (WO-pending) has two INSPECTOR-identified violations. First: the `<button>` element is missing `type="button"`, which defaults to `type="submit"` in any form context — a latent submit-trigger bug. Second: the open/closed state is communicated by chevron rotation only; the chevron is stroked in `accentColor` meaning colorblind users (deuteranopia/protanopia) cannot distinguish zone-specific accordions or confirm expand/collapse state without a non-color, non-rotation cue. Both must be fixed before the accordion change can be approved.

---

### 2. Target User + Job-To-Be-Done

A colorblind patient needs to reliably expand and collapse accordion sections on the Integration Compass page so that they can access their reflective content without relying on color perception.

---

### 3. Success Metrics

1. All accordion `<button>` elements have `type="button"` attribute confirmed by DOM inspection.
2. Each accordion button displays a visible `+` (collapsed) or `−` (expanded) glyph alongside its label — confirmed by visual inspection on 375px and 755px viewports.
3. Zero WCAG 2.1 SC 1.4.1 color-only indicator violations in INSPECTOR re-audit.

---

### 4. Feature Scope

#### ✅ In Scope
- Add `type="button"` to the `Accordion` component's `<button>` element
- Add a `+` / `−` `<span aria-hidden="true">` glyph before the label text in the accordion button
- Glyph must be the same color as `accentColor` but must convey meaning independently of color

#### ❌ Out of Scope
- Redesigning the accordion component's overall appearance
- Adding animation to the glyph (chevron rotation is sufficient)
- Any changes to zone layout, colors, or non-accordion content

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint  

**Reason:** INSPECTOR blocked approval of the existing accordion change on these two violations. The accordion is live at `/patient-report` (public, no auth). Until fixed the page has an active a11y defect visible to all patients.

---

### 6. Open Questions for LEAD

None — spec is complete. Both fixes are surgical, single-component changes.

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
