---
id: WO-307
title: "GlobalCohortHeatmap + Trial Registry Browser — Global Intelligence Layer Expansion"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-21
created_by: ANALYST + PRODDY
failure_count: 0
priority: P3
tags: [analytics, global, heatmap, research, benchmark, trial-registry, visualization]
depends_on: [WO-231 data seeding — benchmark_trials + benchmark_cohorts populated]
parent: WO-231
user_prompt: |
  ANALYST specified GlobalCohortHeatmap and Trial Registry Browser as P2/P3.
  PRODDY: "The global layer has a strategic function not yet activated — 
  PPN as a publisher of original intelligence. This component is the foundation 
  of that publishing strategy."
---

# WO-307: GlobalCohortHeatmap + Trial Registry Browser

**Owner: LEAD → BUILDER**
**Priority: P3 — Research/press layer; powers publishing strategy**
**Depends on: WO-231 data seeding complete (benchmark_trials + benchmark_cohorts)**

---

## COMPONENT 1: `GlobalCohortHeatmap`

### What It Shows
The single most powerful visualization in the entire PPN intelligence layer: a matrix showing the mean effect size (Hedges' g) for every condition × modality combination that has published peer-reviewed evidence.

This is the "where the evidence is strongest" map of the entire psychedelic therapy field.

### Visual Specification
Following ANALYST visualization SKILL Pattern 4:

**Rows (Conditions):** PTSD · MDD · TRD · AUD · GAD · End-of-Life Anxiety · Burnout
**Columns (Modalities):** Psilocybin · MDMA · Ketamine · Esketamine · Ayahuasca · DMT

**Cell Content:**
- Primary: Hedges' g value (bold) e.g. `g = 0.91`
- Secondary: n= participant count e.g. `n=2,847`
- Color: Diverging violet ↔ amber scale (colorblind-safe, ANALYST palette)
  - Low g (close to 0): amber/light
  - High g (≥ 0.8): deep violet
- Empty cells (no published evidence): slate background with "—" label

**Legend:**
- Continuous color bar at bottom showing g = 0 → g = 1.2
- Labels: "Small (0.2)" · "Medium (0.5)" · "Large (0.8)"
- All colorblind-safe (deuteranopia tested)

**Tooltip on hover:**
```
MDMA × PTSD
Effect Size: g = 0.91 (Large)
Total published participants: 8,241
Landmark study: MAPS MAPP2 Phase 3
Source: Nature Medicine, 2023
[EXTERNAL BENCHMARK — CC BY 4.0]
```

**Insight Headline (above chart):**
"MDMA shows the strongest published evidence for PTSD. Psilocybin leads for depression. Evidence is emerging for ketamine across multiple conditions."

### Data Source
- All cells: `benchmark_cohorts` table, grouped by condition × modality
- Aggregate: `AVG(effect_size_hedges_g)` weighted by `n_participants`
- Min 1 cohort record per cell before showing value (else show "—")

### New Component: `src/components/analytics/GlobalCohortHeatmap.tsx`

---

## COMPONENT 2: `TrialRegistryBrowser`

### What It Shows
A filterable, searchable table of all seeded `benchmark_trials` records (500–800 from ClinicalTrials.gov). This turns PPN into the curated clinical research map of the psychedelic therapy field — filterable by modality, condition, phase, and country.

### UI Specification

**Filter Bar (top):**
- Modality: All / Psilocybin / MDMA / Ketamine / Esketamine / Ayahuasca / LSD / DMT / Ibogaine
- Condition: All / PTSD / MDD / TRD / AUD / OUD / GAD / OCD / EOL Anxiety
- Phase: All / Phase 1 / Phase 2 / Phase 3
- Status: All / Completed / Active / Recruiting
- Country: Free-text filter

**Table Columns:**
| NCT ID | Title (truncated) | Modality | Condition | Phase | Status | N Enrolled | Country | Start Year |
|--------|-------------------|----------|-----------|-------|--------|------------|---------|------------|

**Row Click:** Expands to show full title + primary outcome measure + link to ClinicalTrials.gov (external)

**Header stat:**
> *"Showing {X} of {total} trials indexed from ClinicalTrials.gov · Last updated: {date}"*

**Attribution footer:**
> *"Trial data sourced from ClinicalTrials.gov (public domain, U.S. government). PPN provides search and filtering only — visit ClinicalTrials.gov for authoritative data."*

### Pagination
- 20 records per page
- Client-side filtering (data loaded once from Supabase)

### New Component: `src/components/analytics/TrialRegistryBrowser.tsx`

---

## PLACEMENT ON ANALYTICS PAGE

Both components go inside the existing `GlobalBenchmarkIntelligence` section, below the existing cohort cards:

```
GlobalBenchmarkIntelligence
  ↳ Social Proof Counter (existing)
  ↳ Effect Size Bar Chart (existing)
  ↳ Landmark Study Benchmark Cards (existing)
  ↳ [NEW] GlobalCohortHeatmap
  ↳ [NEW] TrialRegistryBrowser (collapsible/expandable)
```

---

## ACCEPTANCE CRITERIA
- [ ] Heatmap renders all condition × modality cells with data
- [ ] Empty cells show "—" not blank or error
- [ ] Color scale is colorblind-safe (deuteranopia compatible per ANALYST palette)
- [ ] Tooltip shows study name + source citation + [EXTERNAL BENCHMARK] label
- [ ] Insight headline above heatmap states specific finding (not generic)
- [ ] Trial Registry shows correct count in header
- [ ] Attribution to ClinicalTrials.gov shown in footer
- [ ] Filters work (modality, condition, phase, status)
- [ ] External ClinicalTrials.gov links open in new tab
- [ ] Both components have loading skeletons and error states
- [ ] Fonts ≥ 12px in table and heatmap labels
- [ ] Responsive: heatmap scrolls horizontally on mobile

## ROUTING
LEAD → BUILDER (data-intensive, minimal custom layout) → INSPECTOR
