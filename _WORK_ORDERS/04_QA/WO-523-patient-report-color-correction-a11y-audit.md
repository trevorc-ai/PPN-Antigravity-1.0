---
id: WO-523
title: PatientReport — Full Color Correction + Colorblind Accessibility Audit
owner: LEAD
status: 01_TRIAGE
filed_by: PRODDY / INSPECTOR
date: 2026-03-03
priority: P1
file: src/pages/PatientReport.tsx
route: /patient-report (public, no auth)
blocks: WO-521, WO-522
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-523 — PatientReport: Color System Correction + Colorblind Accessibility Audit
> **Authored by:** PRODDY / INSPECTOR
> **Date:** 2026-03-03
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

`PatientReport.tsx` was built with a private color token (`C.teal = '#2dd4bf'`) that borrows the WellnessJourney's Phase 3 teal palette. This color appears **20 times** in the file and drives every brand-identity element: the PPN pill, compass rose, sliders, zone borders, CTAs, share buttons, and footer mark. The Integration Compass is a standalone public patient page — it is not a WellnessJourney context — and must use the PPN site-wide brand blue (`#1e40af` / `#60a5fa`) for all non-phase-specific brand elements. Additionally, no colorblind accessibility audit has been run on the page since construction.

---

### 2. Target User + Job-To-Be-Done

A patient (including those with deuteranopia, protanopia, or tritanopia) needs to read and interact with their Integration Compass page so that they can access their healing record accurately and without relying on color perception.

---

### 3. Success Metrics

1. Zero occurrences of `#2dd4bf` remain in `PatientReport.tsx` after correction — confirmed by `grep` count = 0.
2. All interactive elements (sliders, buttons, accordion toggles, share buttons) pass WCAG 2.1 SC 1.4.1 (no color-only information) — confirmed by INSPECTOR re-audit.
3. Contrast ratio of all text-on-background pairs meets WCAG AA (≥ 4.5:1 for body, ≥ 3:1 for large text) — confirmed by contrast checker on the 3 most critical text/bg combinations.

---

### 4. Feature Scope

#### ✅ In Scope

**Color correction (20 tokens):**
- Replace `C.teal = '#2dd4bf'` with the PPN brand blue in all brand/identity contexts:
  - PPN brand pill → blue accent
  - Compass rose SVG ring → blue stroke
  - Zone badge borders → blue tint (or phase-appropriate color if zone maps to a phase)
  - Accordion button borders and labels (WO-520 accordion) → blue
  - Slider track fill and glow thumb → blue
  - "Record Today's Check-In" button → blue gradient CTA
  - "Share with Your Practitioner" button → blue gradient CTA
  - Footer PPN crosshair mark → blue
- `C.gold = '#f59e0b'` (amber) — **retain** — this is a valid Phase 2 token used for spiritual/gold semantic meaning and aligns with `--phase2-primary`
- `C.violet = '#a78bfa'` — **retain** — used for emotional domain semantic color (not a brand color)
- `C.rose = '#fb7185'` — **retain** — used for safety/danger only (correct use)

**Colorblind accessibility audit (all 5 zone types):**
- Zone 1 (violet) — verify content distinguishable under deuteranopia simulation
- Zone 2 (feeling pills — teal/violet alternating) — verify pills distinguishable without color
- Zone 3 (sliders) — verify track fill vs unfilled track has non-color cue
- Zone 4 (rose/red — safety) — verify safety content has icon + text (not color alone)
- Zone 5 (gold + blue accordions) — verify accordion open/closed state has non-color cue

#### ❌ Out of Scope
- Changing `C.gold`, `C.violet`, or `C.rose` — these are semantically correct
- Redesigning any zone layout or content
- Modifying the WellnessJourney pages (teal remains correct there)
- Changing the `PatientCompanionPage.tsx` (separate component)
- Adding new zones or content sections

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** `PatientReport.tsx` is a **public unauthenticated page** shared with patients. It currently uses an incorrect brand color in 20 places, misidentifying the PPN brand as teal. It also has had no colorblind accessibility review. Both are active defects on a patient-facing surface.

---

### 6. Open Questions for LEAD

1. Zone badges (the numbered circles — 1, 2, 3, 4, 5) currently use `rgba(45,212,191,0.08)` teal. Should these map to the zone's semantic domain color (violet for emotional zones, gold for integration zone) or all use the PPN brand blue uniformly?
2. The slider track fill is currently teal. Should the slider use blue or indigo (`--phase1-primary: #6366f1`) — since the check-in form is a Phase 1-style data capture interaction?
3. The feeling pills in Zone 2 alternate between teal and violet. Once teal is replaced with blue, should the alternating pattern become blue/violet, or should pills all be a single neutral color for colorblind safety?
4. Should BUILDER run a Storybook/browser-based colorblind simulation (e.g., using browser DevTools color vision deficiency emulation) as part of the QA output, or is a manual INSPECTOR screenshot review sufficient?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement ≤100 words, no solution ideas
- [x] Job-To-Be-Done single sentence, correct format
- [x] All 3 metrics measurable
- [x] Out of Scope populated
- [x] Priority tier has named reason
- [x] Open Questions ≤5 items
- [x] Word count ≤600
- [x] No code, SQL, or schema written
- [x] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
