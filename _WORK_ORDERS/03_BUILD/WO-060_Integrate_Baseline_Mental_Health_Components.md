---
id: WO-060
status: 03_BUILD
priority: P1 (Critical)
category: Feature
audience: Patient-Facing
implementation_order: 5
owner: BUILDER
failure_count: 0
---

# Integrate Baseline Mental Health Visualization Components

## User Request

Integrate existing arc-of-care components to display baseline mental health assessment data (PHQ-9, GAD-7, ACE, PCL-5) with severity gauges and clinical context.

## Context

**From:** ANALYST Phase 1 Compliance-Focused Visualizations  
**VoC Finding:** Practitioners need "defensible documentation" with "standardized scales (PHQ-9, MEQ-30)" to "justify treatment plans to insurers"

**Existing Components:**
- ✅ `SetAndSettingCard.tsx` - Comprehensive baseline dashboard
- ✅ `GAD7SeverityZones.tsx` - Anxiety severity gauge (0-21)
- ✅ `ACEScoreBarChart.tsx` - Trauma assessment (0-10)
- ✅ `ExpectancyScaleGauge.tsx` - Treatment expectancy (1-100)

**Gap:** Need PHQ-9 and PCL-5 severity gauges (clone GAD7SeverityZones pattern)

## Acceptance Criteria

### Phase 1A: Integrate Existing Components
- [ ] Integrate `SetAndSettingCard.tsx` into preparation workflow
- [ ] Connect to `log_baseline_assessments` table
- [ ] Display GAD-7, ACE, and Expectancy scores from database
- [ ] Add AdvancedTooltip explanations for each metric

### Phase 1B: Build Missing Gauges
- [ ] Create `PHQ9SeverityZones.tsx` (clone GAD7SeverityZones)
  - 4 zones: Minimal (0-4), Mild (5-9), Moderate (10-14), Severe (15-27)
  - Color-coded with clinical recommendations
- [ ] Create `PCL5SeverityZones.tsx` (clone GAD7SeverityZones)
  - 4 zones: Minimal (0-30), Mild (31-45), Moderate (46-60), Severe (61-80)
  - PTSD-specific clinical insights

### Phase 1C: Update SetAndSettingCard
- [ ] Add PHQ-9 gauge to SetAndSettingCard
- [ ] Add PCL-5 gauge to SetAndSettingCard
- [ ] Update grid layout to accommodate 6 metrics (2x3 grid)

### Phase 1D: Compliance Features
- [ ] Add "Export Baseline Report (PDF)" button
- [ ] Include timestamp and practitioner NPI
- [ ] Add population percentile indicators (if data available)

### Phase 1E: Component Showcase Integration
- [ ] After QA approval, add component to ComponentShowcase.tsx
- [ ] Add demo section with mock data
- [ ] Include component description and features list
- [ ] Verify component renders correctly in showcase

### Phase 1F: Filtering & Comparative Analysis
- [ ] Add population percentile overlay (e.g., "78th percentile for PHQ-9")
- [ ] Add "Compare to Network Average" toggle
- [ ] Filter by: site_id, date range, substance type
- [ ] Export filtered data subset (CSV)
- [ ] Add cohort comparison view (e.g., "Psilocybin vs MDMA baseline profiles")

## Technical Notes

**Database Schema:**
- Table: `log_baseline_assessments`
- Fields: `phq9_score`, `gad7_score`, `ace_score`, `pcl5_score`, `expectancy_scale`

**Component Pattern:**
- Clone `GAD7SeverityZones.tsx` for consistency
- Use same color scheme (emerald/blue/amber/red)
- Maintain WCAG AAA compliance (font ≥12px, text labels)

**Language Rules (No Medical Advice):**
- ✅ "PHQ-9 score: 18 (Moderate-Severe range per PHQ-9 scoring guidelines)"
- ✅ "Clinically significant depression documented"
- ❌ "Patient needs treatment" (clinical judgment)

## Estimated Effort

**Total:** 2-3 days
- Phase 1A (Integration): 0.5 days
- Phase 1B (Build gauges): 1 day
- Phase 1C (Update card): 0.5 days
- Phase 1D (Compliance): 0.5-1 day

## Dependencies

- Database connection to `log_baseline_assessments`
- Existing arc-of-care components functional
- AdvancedTooltip component available

## Success Metrics

- [ ] All 6 baseline metrics displayed with severity gauges
- [ ] Compliance report export functional
- [ ] WCAG AAA accessibility maintained
- [ ] No medical advice language (objective documentation only)
