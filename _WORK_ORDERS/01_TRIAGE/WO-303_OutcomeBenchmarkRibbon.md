---
id: WO-303
title: "OutcomeBenchmarkRibbon — Clinic Outcomes vs. Published Phase 3 Evidence"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-21
created_by: ANALYST + PRODDY
failure_count: 0
priority: P1
tags: [analytics, benchmark, visualization, clinic-level, recharts, outcomes]
depends_on: [WO-231 data seeding — benchmark_cohorts must be populated]
parent: null
user_prompt: |
  ANALYST identified this as the P1 "closes a sale" visualization.
  PRODDY endorsed as the single highest-value retention feature.
  The moment a practitioner sees their patient curve running alongside MAPS Phase 3, 
  the value proposition is visceral. Build this first after InsightFeedPanel.
---

# WO-303: OutcomeBenchmarkRibbon — Clinic vs. Published Phase 3 Evidence

**Owner: LEAD → DESIGNER → BUILDER**
**Priority: P1 — The "aha moment" visualization that closes practitioner retention**
**Depends on: WO-231 data seeding (benchmark_cohorts populated)**

---

## ANALYST SPECIFICATION

### The Core Visual Question
*"Is my clinic achieving outcomes consistent with what published Phase 3 trials show is possible?"*

### Component: `OutcomeBenchmarkRibbon`
**Location:** Analytics page — full-width panel, above the Performance Radar

### Chart Architecture: Recharts `ComposedChart`

#### Data Layers (bottom to top, rendering order)

**Layer 1 — Phase 3 Trial Range (background ribbon)**
- Source: `benchmark_cohorts` → clinical_trial setting records
- Rendered as: `<Area>` with low opacity fill (8% opacity)
- Color: violet `#8b5cf6` at 8%
- Label: "Phase 3 Trial Range" (annotated at right edge)
- Data: min/max of baseline_mean → endpoint_mean across relevant Phase 3 cohorts

**Layer 2 — Real-World/Naturalistic Average (dashed reference line)**
- Source: `benchmark_cohorts` → naturalistic setting (Unlimited Sciences N=8,000+)
- Rendered as: `<ReferenceLine>` horizontal dashed
- Color: amber `#f59e0b` dashed
- Label: "Real-World Average (n=8,000+)"

**Layer 3 — Clinically Meaningful Change Threshold**
- Source: ANALYST skill CMC table (hardcoded per instrument)
  - PHQ-9: ≥5 point reduction from baseline
  - MADRS: ≥50% reduction
  - CAPS-5: ≥10 point reduction
- Rendered as: `<ReferenceLine>` solid, labeled "Clinical Response Threshold"
- Color: emerald `#34d399`

**Layer 4 — Clinic's Own Mean Line (primary)**
- Source: `log_longitudinal_assessments` aggregated by `days_post_session`
- Rendered as: `<Line>` bold, with `<Area>` 95% CI shaded band
- Color: blue `#3b82f6` (line) + blue 15% opacity (CI band)
- Label: "Your Clinic" with n= annotation at each timepoint

#### X-Axis: Session timeline
- Week 0 (Baseline) → Week 3 → Week 6 → Week 12
- Never use calendar dates

#### Y-Axis: Instrument score
- Label: "[Instrument] Score — Lower = Better" for symptom scales
- Full scale 0 to instrument max (no truncation)

### Instrument Selector
Toggle between available instruments:
- `PHQ-9` (if ≥5 patients have PHQ-9 data)
- `MADRS` (if available)
- `CAPS-5` (if available)
- `GAD-7` (if available)
Default to the instrument with most data.

### Stat Summary Row (below chart)
```
[Your Response Rate]    [Benchmark Response Rate]    [Hedges' g vs. Benchmark]    [Patients in Analysis]
      87%                      67% (MAPS MAPP2)              g = 0.34                    n = 23
   [STATUS: PASS]            [SOURCE: Nature Med 2023]      Medium effect             [Week 6 endpoint]
```

### Severity-Adjusted Context (PRODDY requirement)
If clinic baseline severity is > 1.0 SD above benchmark baseline:
Show callout: *"Your patients started significantly more severe than this benchmark population. Your outcomes may be stronger than the chart suggests."*

### Source Citation (INSPECTOR compliance)
Every benchmark layer MUST display:
- `[EXTERNAL BENCHMARK — Source: {source_citation}]` on hover/tooltip
- Never present benchmark data as PPN's own outcomes

---

## TECHNICAL IMPLEMENTATION

### Data Queries (ANALYST-validated)

```typescript
// Clinic trajectory (aggregate by timepoint)
SELECT 
  days_post_session,
  ROUND(AVG(phq9_score), 1) AS avg_score,
  ROUND(STDDEV(phq9_score), 1) AS sd_score,
  COUNT(DISTINCT patient_id) AS n_patients
FROM log_longitudinal_assessments
GROUP BY days_post_session
HAVING COUNT(DISTINCT patient_id) >= 5
ORDER BY days_post_session;

// Benchmark ribbon data
SELECT 
  cohort_name, setting, 
  baseline_mean, endpoint_mean, followup_weeks,
  response_rate_pct, effect_size_hedges_g,
  source_citation, n_participants
FROM benchmark_cohorts
WHERE instrument = :instrument
  AND condition = :condition
ORDER BY setting, n_participants DESC;
```

### New File: `src/components/analytics/OutcomeBenchmarkRibbon.tsx`
### New Hook: `src/hooks/useBenchmarkRibbon.ts`

---

## ACCEPTANCE CRITERIA
- [ ] ComposedChart renders all 4 data layers correctly
- [ ] Instrument toggle works (PHQ-9 / MADRS / CAPS-5)
- [ ] Benchmark citation shown in tooltip ([EXTERNAL BENCHMARK — Source: ...])
- [ ] Severity-adjusted callout appears when applicable
- [ ] Y-axis starts at 0, direction labeled "Lower = Better"
- [ ] 95% CI band shown on clinic line
- [ ] n= shown at each datapoint
- [ ] Graceful empty state if < 5 patients have longitudinal data
- [ ] k-anonymity guard applied (N ≥ 5 per timepoint)
- [ ] Fonts ≥ 12px
- [ ] Responsive (mobile collapses to single column, chart remains readable)
- [ ] Loading skeleton while data fetches

## ROUTING
LEAD → DESIGNER (chart layout spec) → BUILDER (implementation) → INSPECTOR (QA)
