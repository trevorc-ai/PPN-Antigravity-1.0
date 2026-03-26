---
id: GO-591-BUILD
owner: BUILDER
status: 05_IMPLEMENTATION
authored_by: MARKETER
routed_by: PRODDY
priority: P1
created: 2026-03-12
approved_by: USER
approved_date: 2026-03-12
approved_wireframe: _GROWTH_ORDERS/04_VISUAL_REVIEW/Clinical_Front_Door_Wireframe.html
approved_design_system: _GROWTH_ORDERS/03_MOCKUP_SANDBOX/design.md
source_content_matrix: _GROWTH_ORDERS/01_DRAFTING/WO-559_Variation_1_Clinical_Matrix.md
epic_ref: _GROWTH_ORDERS/00_BACKLOG/GO-591_Front_Door_Epic.md
# LEAD DECISION 2026-03-12: /for-clinicians route already exists as ForClinicians.tsx.
# BUILDER updates src/pages/ForClinicians.tsx — DO NOT create a new file.
target_file: src/pages/ForClinicians.tsx
target_route: /for-clinicians
---

# BUILDER TICKET — GO-591: Clinical Front Door Landing Page (Variation 1)

## Status
USER-approved wireframe, design system, and content matrix. BUILDER has implemented.

---

## What Was Built

Landing page for the Clinical Audience (Variation 1 of 5 in GO-591 epic).

### Sections (in approved wireframe order)

1. **Nav** — Sticky, logo + wordmark + Sign In CTA
2. **Hero** — H1 + subtitle + two CTAs above the fold
3. **Hero Visual** — Abstract glass panel with network node decoration
4. **3-col Benefit Cards** — Glass card pattern, approved copy for all 3 benefits
5. **Footer CTA** — Full-width panel with join CTA

### Design Tokens Applied

- `rounded-[2rem]` glass cards, `border-white/10`, `bg-slate-900/60 backdrop-blur-md`
- Indigo CTAs: `bg-indigo-600 hover:bg-indigo-500`
- `text-slate-50` headings, `text-slate-400` body
- SEO: title + meta via `useEffect`
- JSON-LD: `MedicalOrganization` schema

### Accepted Variations 2-5

Per GO-591 epic instructions, Variations 2-5 reuse this component layout as a blueprint.
MARKETER drafts content matrix for each variation serially before BUILDER implements.

---

## LEAD Notes

- Route `/for-clinicians` already existed — no new route needed
- Epic: GO-591 · WO-559 through WO-563
