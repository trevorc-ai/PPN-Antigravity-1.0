---
id: WO-581
title: "Integration Compass — Science View Driven by Verified Ki Receptor Data"
status: 00_INBOX
priority: P1
owner: LEAD
created: 2026-03-02
author: INSPECTOR
tags: [compass, spider-graph, pharmacology, data-integrity, ref_substances]
---

## PRODDY PRD

> **Work Order:** WO-581 — Science View Radar Driven by Actual Ki Receptor Data
> **Authored by:** INSPECTOR (escalated from clinical accuracy audit)
> **Date:** 2026-03-02
> **Status:** 00_INBOX → LEAD review required

---

### 1. Problem Statement

The Integration Compass "Science View" spider graph currently displays six receptor axes
(`5-HT2A`, `D2 / Sigma-1`, `SERT / NET`, `κ-Opioid`, `mGluR5`, `Sigma-1 / TRP`) with
hardcoded `PREDICTED_SHAPES` values — static arrays that are not derived from any data
source. The application already stores verified pharmacological Ki binding affinity data
per substance in `ref_substances` (migration 015, sourced from PDSP Ki Database). The
radar shape is cosmetic decoration, not clinical information. For a platform serving
licensed psychedelic therapy practitioners, displaying unverifiable "science" violates
the core mission principle: everything displayed must be accurate and verifiable.

---

### 2. Target User + Job-To-Be-Done

A psychedelic therapy practitioner needs to show a patient a scientifically defensible
visualization of which receptor systems were most engaged during their session so that
the patient understands why their experience had the specific qualities it did — and the
practitioner can cite the data source if asked.

---

### 3. Success Metrics

1. The science view radar polygon is computed at runtime from `ref_substances.receptor_*_ki`
   columns — no hardcoded shape arrays exist in the component after this ticket closes.
2. Each axis label maps 1:1 to a specific Ki column in `ref_substances`, and the axis
   score is derived via a documented, reproducible normalization formula (inverted Ki,
   log-scaled, normalized to 0–1).
3. A visible source citation ("Data: PDSP Ki Database · PubChem") renders beneath the
   science view radar — a practitioner can read and verify the provenance in under 5 seconds.

---

### 4. Feature Scope

#### ✅ In Scope

- Extend `useCompassSession` query to SELECT all `receptor_*_ki` and `primary_mechanism`
  columns from `ref_substances` for the session substance
- Define a documented normalization function: `score = 1 - clamp(log10(Ki) / log10(maxKi), 0, 1)`
  so that lower Ki (stronger binding) = higher radar score
- Replace `PREDICTED_SHAPES` hardcoded arrays in `CompassSpiderGraph.tsx` with computed
  values derived from the hook data
- **Axis set is locked at exactly 6** — matching the 6 Ki columns already in `ref_substances`:
  - Axis 1: `5-HT2A` → `receptor_5ht2a_ki` (experience: Sensory Alteration)
  - Axis 2: `5-HT1A` → `receptor_5ht1a_ki` (experience: Emotional Intensity)
  - Axis 3: `5-HT2C` → `receptor_5ht2c_ki` (experience: Mystical Quality)
  - Axis 4: `SERT` → `receptor_sert_ki` (experience: Connection / Ego Dissolution)
  - Axis 5: `D2` → `receptor_d2_ki` (experience: Time Distortion)
  - Axis 6: `NMDA` → `receptor_nmda_ki` (experience: Physical Sensation / Dissociation)
- Remove current science labels `κ-Opioid`, `mGluR5`, `Sigma-1 / TRP` — not in schema
- Remove `D2 / Sigma-1` combined label — replace with `D2 (Dopamine)` only
- Remove `SERT / NET` combined label — replace with `SERT` only
- Hexagon geometry preserved (6 = even, symmetric, each axis has a direct opposite)
- Add source citation beneath science view: `"Binding data: PDSP Ki Database · PubChem · DrugBank"`
- Fall back to a labeled "Estimated — substance not in database" ghost shape if Ki data
  is unavailable for a given substance (do not show empty or misleading data)

#### ❌ Out of Scope

- Adding new receptor columns to `ref_substances` (schema changes are a separate migration)
- Adding D1 receptor data (not currently in schema; requires research validation first)
- Changing the experience-mode axes (Sensory Alteration, Ego Dissolution, etc.) — those
  remain experiential descriptors, not pharmacological
- Making the experience-mode shape data-driven (separate ticket if ever warranted)
- Patient-facing display of raw Ki nM values — too technical; normalized 0–1 scores only

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** The user explicitly stated "everything we display site-wide must be accurate
and verifiable." The science view is currently unverifiable hardcoded data shown to
licensed clinical practitioners. This is a credibility and mission-alignment issue that
blocks presenting the compass to any clinical audience.

---

### 6. Open Questions for LEAD

1. Should the normalization use `log10(Ki)` scaling (standard in pharmacology) or a
   simpler linear inversion? LEAD recommendation: **use log10** — it's correct, and the
   source citation makes it verifiable for any practitioner who wants to check.
2. Should the source citation link to an external URL (e.g., PDSP Ki Database) or
   remain as plain text? Recommendation: **plain text only** — no navigation away from
   the patient report.
3. If a session's substance is `unknown`, should the science view tab be hidden entirely
   or show a "Generic psychedelic profile" fallback? Recommendation: **hide the science
   tab** — do not show any shape that cannot be sourced.

**RESOLVED (no longer open):**
- Axis count: stays at **6** (symmetric hexagon, matches 6 Ki columns in schema exactly)
- Axes: `5-HT2A`, `5-HT1A`, `5-HT2C`, `SERT`, `D2`, `NMDA` — no new migrations needed
- D1 receptor: **not added** — not in schema, not in PDSP data loaded, defer indefinitely

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
