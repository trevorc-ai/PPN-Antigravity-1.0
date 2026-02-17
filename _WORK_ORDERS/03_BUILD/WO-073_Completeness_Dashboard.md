---
id: WO-073
status: 03_BUILD
priority: P0 (Blocking)
category: Feature
owner: BUILDER
failure_count: 0
---

# Week 1 Value: Completeness Dashboard

## User Request
Build a completeness dashboard that shows practitioners their data quality and benchmark readiness immediately after first form submission.

## Strategic Context
> "Platform MUST deliver visible operational value in **first 2 weeks**, not 6 months"

**North Star Metric:** Benchmark-ready episodes per month

## LEAD ARCHITECTURE

### Technical Strategy
Create a real-time dashboard that calculates and displays benchmark readiness based on 5 requirements, providing immediate feedback and clear next steps.

### Files to Touch
- `src/components/dashboard/CompletenessWidget.tsx` (NEW)
- `src/components/dashboard/BenchmarkReadiness.tsx` (NEW)
- `src/components/dashboard/DataQualityScore.tsx` (NEW)
- `src/components/dashboard/NextStepsGuidance.tsx` (NEW)
- `src/hooks/useBenchmarkReadiness.ts` (NEW)
- `src/utils/benchmarkCalculator.ts` (NEW)
- `src/pages/WellnessJourney.tsx` (MODIFY)

### Constraints
- Must update in real-time as forms are submitted
- Must show clear next steps for missing requirements
- Must be mobile-friendly (56px+ tap targets)
- Must calculate score based on 5 benchmark requirements

## Proposed Changes

### Component 1: Benchmark Readiness Widget

**UI:**
```
┌─────────────────────────────────────┐
│ 📊 Benchmark Readiness              │
│                                     │
│ [●●●○○] 60% Complete                │
│                                     │
│ 3 of 5 Requirements Met:            │
│ ✅ Baseline outcome measure         │
│ ✅ Coded exposure record            │
│ ✅ Coded setting/support            │
│ ⚠️ Missing: Follow-up timepoint     │
│ ⚠️ Missing: Safety event capture    │
│                                     │
│ [Complete Missing Forms]            │
└─────────────────────────────────────┘
```

**5 Benchmark Requirements:**
1. Baseline outcome measure (PHQ-9, GAD-7, etc.)
2. At least one defined follow-up timepoint
3. Coded exposure record (substance, route, dose)
4. Coded setting and support structure
5. Coded safety event capture

---

### Component 2: Data Quality Score

**UI:**
```
┌─────────────────────────────────────┐
│ 📈 Data Quality: 85%                │
│                                     │
│ Complete Forms: 12/15               │
│ Missing Fields: 3                   │
│                                     │
│ [View Missing Fields]               │
└─────────────────────────────────────┘
```

---

### Component 3: Next Steps Guidance

**UI:**
```
🎯 Next Steps to Reach 100%:
1. Complete Phase 1 Informed Consent
2. Schedule first follow-up assessment
3. Document any safety events (if applicable)

[Start Next Form]
```

---

## Verification Plan

### Automated Tests
```bash
npm run test -- CompletenessWidget.test.tsx
npm run test -- BenchmarkReadiness.test.tsx
npm run test -- benchmarkCalculator.test.ts
```

### Manual Verification
1. **Initial State:** Verify shows "0 of 5 requirements met"
2. **After Phase 1:** Verify shows "2 of 5 requirements met" (baseline + setting)
3. **After Phase 2:** Verify shows "3 of 5 requirements met" (+ exposure)
4. **After Safety Check:** Verify shows "4 of 5 requirements met" (+ safety)
5. **After Follow-Up:** Verify shows "5 of 5 requirements met" (100%)
6. **Real-Time Update:** Verify updates immediately after form submission
7. **Next Steps:** Verify "Complete Missing Forms" button navigates correctly

### Accessibility
- Keyboard navigation (Tab, Enter)
- Screen reader announces completion percentage
- Color-coded with text labels (not color-only)
- High contrast mode compatible

---

## Dependencies
- Patient data from Wellness Journey
- Form submission events
- 19 Arc of Care form components

## Estimated Effort
**12-16 hours** (3-4 days)

## Success Criteria
- ✅ Shows "X of 5 requirements met" with visual progress bar
- ✅ Lists completed requirements with green checkmarks
- ✅ Lists missing requirements with yellow warnings
- ✅ "Complete Missing Forms" button navigates to correct form
- ✅ Updates in real-time as forms are submitted
- ✅ Data quality score shows % complete
- ✅ Next steps guidance provides clear actions

---

**Status:** Ready for LEAD assignment
