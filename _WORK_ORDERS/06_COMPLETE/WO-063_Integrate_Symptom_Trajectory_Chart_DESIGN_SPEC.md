---
id: WO-063
status: 03_BUILD
priority: P2 (High)
category: Feature
audience: Patient-Facing
implementation_order: 3
owner: INSPECTOR
failure_count: 0
inspector_notes: "Component exists and is integrated in 3 locations. Needs completion of Phases 2-5 per acceptance criteria before QA review."
---

# Integrate Symptom Trajectory Chart Component

## User Request

Integrate existing `SymptomDecayCurve.tsx` component to visualize longitudinal outcome data (PHQ-9, GAD-7, WHOQOL scores from baseline → follow-ups).

## Context

**From:** ANALYST Phase 1 Compliance-Focused Visualizations  
**Purpose:** Visualize treatment response over time (NOT clinical progress monitoring)

**Existing Components:**
- ✅ `SymptomDecayCurve.tsx` - Symptom trajectory over time
- ✅ `SymptomDecayCurveChart.tsx` - Chart component
- Location: `/src/components/arc-of-care/`

**Compliance Value:**
- Treatment response documentation
- Research outcome tracking
- Insurance justification (proof of efficacy)

## Acceptance Criteria

### Phase 1: Integration
- [ ] Integrate `SymptomDecayCurve.tsx` into integration/follow-up workflow
- [ ] Connect to `log_longitudinal_assessments` table
- [ ] Display PHQ-9, GAD-7, WHOQOL scores over time
- [ ] Show baseline → post-session → 1-week → 1-month → 3-month

### Phase 2: Visual Enhancements
- [ ] Line chart with multiple symptom scales
- [ ] Change from baseline annotations
- [ ] Color-coded by scale (PHQ-9: blue, GAD-7: purple, WHOQOL: green)
- [ ] Mobile-responsive layout

### Phase 3: Compliance Features
- [ ] "Export Outcome Data (CSV)" button
- [ ] Include baseline comparison table
- [ ] Calculate percentage change from baseline
- [ ] Add population percentile indicators (if data available)

### Phase 4: Component Showcase Integration
- [ ] After QA approval, add component to ComponentShowcase.tsx
- [ ] Add demo section with mock longitudinal data
- [ ] Include component description and features list
- [ ] Verify component renders correctly in showcase

### Phase 5: Filtering & Comparative Analysis
- [ ] Filter trajectories by: substance, baseline severity, site_id, date range
- [ ] Compare outcome trajectories across substances (e.g., "Psilocybin -56% PHQ-9 vs MDMA -42%")
- [ ] Add cohort stratification (e.g., "High baseline severity vs Low baseline")
- [ ] Add "Responder vs Non-Responder" analysis (≥50% symptom reduction)
- [ ] Export filtered outcome data (CSV)

## Technical Notes

**Database Schema:**
- Table: `log_longitudinal_assessments`
- Fields: `phq9_score`, `gad7_score`, `whoqol_score`, `assessment_date`, `timepoint`

**Language Rules (No Medical Advice):**
- ✅ "PHQ-9 decreased from 18 (baseline) to 8 (1-month): -56% change"
- ✅ "Longitudinal outcome data documented"
- ❌ "Treatment is working" (clinical interpretation)

**Label:** "Longitudinal Outcome Data" (NOT "Treatment Progress")

## Estimated Effort

**Total:** 1.5 days
- Integration: 0.5 days
- Visual enhancements: 0.5 days
- Compliance features: 0.5 days

## Dependencies

- Database connection to `log_longitudinal_assessments`
- Existing `SymptomDecayCurve.tsx` component functional
- Recharts or D3.js library available

## Success Metrics

- [ ] Chart displays all timepoints (baseline → 3-month)
- [ ] Change from baseline calculated accurately
- [ ] CSV export functional
- [ ] No clinical interpretation language (objective data only)
