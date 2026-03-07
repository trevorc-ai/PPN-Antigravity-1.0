---
id: WO-522
title: PatientReport Hero — Apply PPN Blue Gradient to "Journey" in Heading
owner: LEAD
status: 01_TRIAGE
filed_by: PRODDY
date: 2026-03-03
updated: 2026-03-03
priority: P2
file: src/pages/PatientReport.tsx
route: /patient-report
depends_on: WO-523
note: Updated — gradient corrected from teal/gold to PPN brand blue per user feedback.
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-522 — PatientReport: PPN Blue Gradient on "Journey" Heading Word
> **Authored by:** PRODDY
> **Date:** 2026-03-03 (updated same day)
> **Status:** Draft → Pending LEAD review

> ⚠️ **Depends on WO-523.** This ticket should be executed in the same build pass as the full color correction, since WO-523 will already be touching the `<h1>` element's color context.

---

### 1. Problem Statement

The hero `<h1>` on `PatientReport.tsx` reads "Your Journey" rendered as a single gradient string. The word "Journey" does not carry the PPN brand blue gradient treatment (`#1e40af → #60a5fa`) used across the rest of the site. The heading visually disconnects the Integration Compass from the PPN platform identity. This ticket corrects that word specifically.

---

### 2. Target User + Job-To-Be-Done

A patient opening their Integration Compass page needs to immediately recognize PPN brand identity so that they feel trust and continuity between the platform and their personal healing record.

---

### 3. Success Metrics

1. The word "Journey" renders with the PPN blue gradient (`#1e40af → #60a5fa`, matching the gradient defined in `index.css`) confirmed by visual inspection on both mobile and desktop.
2. The word "Your" renders in solid `#e2e8f0` (slate-200), visually distinct from the gradient word — confirmed by screenshot.
3. The change introduces zero layout shift — heading retains its existing `font-size`, `font-weight`, and `letter-spacing` — confirmed by INSPECTOR DOM inspection.

---

### 4. Feature Scope

#### ✅ In Scope
- Split the `<h1>` into two `<span>` elements: `"Your "` (solid `#e2e8f0`) and `"Journey"` (PPN blue gradient `linear-gradient(90deg, #1e40af 0%, #60a5fa 100%)` via `background-clip: text`)
- Use the identical blue gradient already defined in `index.css`: `linear-gradient(90deg, #1e40af 0%, #60a5fa 100%)`

#### ❌ Out of Scope
- Changing any other text in the hero section
- Modifying the compass SVG, star field, or brand pill (those are covered in WO-523)
- Applying gradient to subtitle, phase strip, or any body text

---

### 5. Priority Tier

**[x] P2** — Useful but deferrable

**Reason:** Brand polish — not a functional or safety issue. Must be executed after WO-523 completes the color correction pass, since both touch the same file.

---

### 6. Open Questions for LEAD

None — spec is complete. Blue gradient token confirmed from `index.css`.

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement ≤100 words, no solution ideas
- [x] Job-To-Be-Done single sentence, correct format
- [x] All 3 metrics measurable
- [x] Out of Scope populated
- [x] Priority tier named reason
- [x] Open Questions ≤5 items
- [x] Word count ≤600
- [x] No code, SQL, or schema written
- [x] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
