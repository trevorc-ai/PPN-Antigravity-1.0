---
id: WO-080
status: 00_INBOX
priority: P1 (Critical)
category: Feature
owner: PENDING_LEAD_ASSIGNMENT
failure_count: 0
---

# Benchmark Enablement: Benchmark Readiness Scoring

## User Request
Build benchmark readiness scoring system that calculates and displays progress toward "5/5 benchmark-ready" status.

## Strategic Context
> "North Star Metric: Benchmark-ready episodes per month"
> "No contribution = No network benchmarks (give-to-get model)"

**Impact:** Gamifies data completeness, drives practitioner engagement

## LEAD ARCHITECTURE

### Technical Strategy
Create scoring algorithm that calculates benchmark readiness based on 5 requirements, with visual progress tracking and clear next steps.

### Files to Touch
- `src/utils/benchmarkReadinessCalculator.ts` (NEW)
- `src/components/benchmark/ReadinessScore.tsx` (NEW)
- `src/components/benchmark/RequirementsList.tsx` (NEW)
- `src/components/benchmark/NextSteps.tsx` (NEW)
- `src/hooks/useBenchmarkReadiness.ts` (NEW)
- `src/pages/WellnessJourney.tsx` (MODIFY)

### Constraints
- Must calculate based on 5 specific requirements
- Must show visual progress (0-100%)
- Must provide clear next steps for missing requirements
- Must update in real-time as forms are submitted

## Proposed Changes

### Component 1: Benchmark Readiness Calculator

**5 Benchmark Requirements:**

1. ✅ **Baseline outcome measure** (PHQ-9, GAD-7, etc.)
   - Satisfied by: Phase 1 Mental Health Screening form
   
2. ✅ **At least one defined follow-up timepoint** (6-week assessment)
   - Satisfied by: Phase 3 Longitudinal Assessment form
   
3. ✅ **Coded exposure record** (substance, route, dose)
   - Satisfied by: Phase 2 Dosing Protocol form
   
4. ✅ **Coded setting and support structure** (set & setting)
   - Satisfied by: Phase 1 Set & Setting form
   
5. ✅ **Coded safety event capture** (safety checks)
   - Satisfied by: Structured Safety Check form

**Scoring Logic:**
```typescript
const calculateBenchmarkReadiness = (patient: Patient) => {
  let score = 0;
  let requirements = [];
  
  // Requirement 1: Baseline outcome measure
  if (patient.hasBaselineAssessment) {
    score += 20;
    requirements.push({ 
      name: 'Baseline outcome measure', 
      met: true,
      form: 'Mental Health Screening'
    });
  } else {
    requirements.push({ 
      name: 'Baseline outcome measure', 
      met: false,
      form: 'Mental Health Screening',
      action: 'Complete Phase 1 baseline assessment'
    });
  }
  
  // Requirement 2: Follow-up timepoint
  if (patient.hasFollowUpAssessment) {
    score += 20;
    requirements.push({ 
      name: 'Follow-up timepoint', 
      met: true,
      form: 'Longitudinal Assessment'
    });
  } else {
    requirements.push({ 
      name: 'Follow-up timepoint', 
      met: false,
      form: 'Longitudinal Assessment',
      action: 'Schedule 6-week follow-up assessment'
    });
  }
  
  // Requirement 3: Coded exposure record
  if (patient.hasDosingProtocol) {
    score += 20;
    requirements.push({ 
      name: 'Coded exposure record', 
      met: true,
      form: 'Dosing Protocol'
    });
  } else {
    requirements.push({ 
      name: 'Coded exposure record', 
      met: false,
      form: 'Dosing Protocol',
      action: 'Complete dosing session protocol'
    });
  }
  
  // Requirement 4: Coded setting/support
  if (patient.hasSetAndSetting) {
    score += 20;
    requirements.push({ 
      name: 'Coded setting/support', 
      met: true,
      form: 'Set & Setting'
    });
  } else {
    requirements.push({ 
      name: 'Coded setting/support', 
      met: false,
      form: 'Set & Setting',
      action: 'Complete set & setting assessment'
    });
  }
  
  // Requirement 5: Safety event capture
  if (patient.hasSafetyCheck) {
    score += 20;
    requirements.push({ 
      name: 'Safety event capture', 
      met: true,
      form: 'Structured Safety Check'
    });
  } else {
    requirements.push({ 
      name: 'Safety event capture', 
      met: false,
      form: 'Structured Safety Check',
      action: 'Complete safety check'
    });
  }
  
  return { 
    score, 
    requirements,
    isBenchmarkReady: score === 100
  };
};
```

---

### Component 2: Readiness Score Widget

**UI (60% Complete):**
```
┌─────────────────────────────────────┐
│ 🎯 Benchmark Readiness: 60%         │
│                                     │
│ [●●●○○] 3 of 5 Requirements Met     │
│                                     │
│ ✅ Baseline outcome measure         │
│ ✅ Coded exposure record            │
│ ✅ Coded setting/support            │
│ ⚠️ Missing: Follow-up timepoint     │
│ ⚠️ Missing: Safety event capture    │
│                                     │
│ Next Step: Schedule 6-week follow-up│
│ [Schedule Follow-Up]                │
└─────────────────────────────────────┘
```

**UI (100% Complete):**
```
┌─────────────────────────────────────┐
│ 🎯 Benchmark Readiness: 100%        │
│                                     │
│ [●●●●●] 5 of 5 Requirements Met     │
│                                     │
│ ✅ Baseline outcome measure         │
│ ✅ Follow-up timepoint              │
│ ✅ Coded exposure record            │
│ ✅ Coded setting/support            │
│ ✅ Safety event capture             │
│                                     │
│ 🎉 Episode is benchmark-ready!      │
│ [View Network Benchmarks]           │
└─────────────────────────────────────┘
```

---

### Component 3: Requirements List

**UI:**
```
┌─────────────────────────────────────┐
│ 📋 Benchmark Requirements           │
│                                     │
│ 1. ✅ Baseline outcome measure      │
│    Form: Mental Health Screening    │
│    Completed: Jan 1, 2026           │
│                                     │
│ 2. ⚠️ Follow-up timepoint           │
│    Form: Longitudinal Assessment    │
│    Action: Schedule 6-week follow-up│
│    [Schedule Now]                   │
│                                     │
│ 3. ✅ Coded exposure record         │
│    Form: Dosing Protocol            │
│    Completed: Jan 15, 2026          │
│                                     │
│ 4. ✅ Coded setting/support         │
│    Form: Set & Setting              │
│    Completed: Jan 1, 2026           │
│                                     │
│ 5. ⚠️ Safety event capture          │
│    Form: Structured Safety Check    │
│    Action: Complete safety check    │
│    [Complete Now]                   │
└─────────────────────────────────────┘
```

---

### Component 4: Next Steps Guidance

**UI:**
```
🎯 Next Steps to Reach 100%:

1. Schedule 6-week follow-up assessment
   [Schedule Follow-Up]

2. Complete structured safety check
   [Complete Safety Check]

Estimated time to complete: 15 minutes
```

---

### Component 5: Benchmark Badge (100% Complete)

**UI:**
```
┌─────────────────────────────────────┐
│         🏆 BENCHMARK READY          │
│                                     │
│   This episode meets all 5 network  │
│   benchmark requirements and will   │
│   contribute to peer comparisons.   │
│                                     │
│   [View Network Benchmarks]         │
│   [Share Badge]                     │
└─────────────────────────────────────┘
```

**Badge Features:**
- Shareable on clinic website
- Downloadable as PNG
- Shows "Benchmark Ready" status
- Builds trust with patients

---

## Verification Plan

### Automated Tests
```bash
npm run test -- benchmarkReadinessCalculator.test.ts
npm run test -- ReadinessScore.test.tsx
npm run test -- useBenchmarkReadiness.test.ts
```

### Manual Verification
1. **Initial State:** Verify shows "0 of 5 requirements met"
2. **After Phase 1:** Verify shows "2 of 5 requirements met" (baseline + setting)
3. **After Phase 2:** Verify shows "3 of 5 requirements met" (+ exposure)
4. **After Safety Check:** Verify shows "4 of 5 requirements met" (+ safety)
5. **After Follow-Up:** Verify shows "5 of 5 requirements met" (100%)
6. **Real-Time Update:** Verify updates immediately after form submission
7. **Next Steps:** Verify shows clear actions for missing requirements
8. **Badge:** Verify badge appears when 100% complete

### Accessibility
- Keyboard navigation (Tab, Enter)
- Screen reader announces completion percentage
- Color + text labels (not color-only)
- High contrast mode compatible

---

## Dependencies
- Patient form data (all phases)
- Form completion tracking
- Badge generation service

## Estimated Effort
**8-12 hours** (2-3 days)

## Success Criteria
- ✅ Calculates score based on 5 requirements
- ✅ Shows visual progress (0-100%)
- ✅ Lists met and missing requirements
- ✅ Provides clear next steps
- ✅ Updates in real-time
- ✅ Shows "Benchmark Ready" badge when 100%
- ✅ Badge is shareable/downloadable

---

**Status:** Ready for LEAD assignment
