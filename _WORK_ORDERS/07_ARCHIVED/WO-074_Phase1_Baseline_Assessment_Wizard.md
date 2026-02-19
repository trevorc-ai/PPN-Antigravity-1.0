---
id: WO-074-WIZARD
status: 03_BUILD
priority: P1 (Critical)
category: Feature
owner: BUILDER
failure_count: 0
---

# Phase 1 Baseline Assessment Wizard

## User Request
Build a 5-step wizard for Phase 1 baseline assessment that reduces clicks from 15 to 3 and time from 12-17 minutes to 8-10 minutes.

## LEAD ARCHITECTURE

### Technical Strategy
Create a multi-step wizard component that guides practitioners through all 5 Phase 1 forms in one continuous flow with auto-save, progress indicators, and swipe navigation.

### Files to Touch
- `src/components/wizards/BaselineAssessmentWizard.tsx` (NEW)
- `src/components/wizards/WizardStep.tsx` (NEW)
- `src/components/wizards/WizardProgress.tsx` (NEW)
- `src/hooks/useWizard.ts` (NEW)
- `src/pages/WellnessJourney.tsx` (MODIFY)

### Constraints
- Must support mobile/tablet (56px+ tap targets)
- Must auto-save every 30 seconds
- Must support swipe gestures (left/right navigation)
- Must show progress indicator ("Step 2 of 5")
- Must allow "Save & Exit" at any step

## Proposed Changes

### Component 1: Wizard Container

**Purpose:** Manage wizard state and navigation

**Features:**
- Step navigation (Next, Back, Submit All)
- Progress tracking (current step, completed steps)
- Auto-save integration
- Swipe gesture support (mobile)
- Keyboard shortcuts (Enter = Next, Esc = Save & Exit)

**Example Usage:**
```tsx
<BaselineAssessmentWizard
  patientId="PT-XLMR3WZP"
  onComplete={handleComplete}
  onExit={handleExit}
/>
```

---

### Component 2: Wizard Steps

**5 Steps:**
1. **Mental Health Screening** - PHQ-9, GAD-7, ACE, PCL-5
2. **Set & Setting** - Treatment Expectancy slider
3. **Baseline Physiology** - HRV, BP
4. **Baseline Observations** - Motivation, Support, Experience
5. **Informed Consent** - Consent type, confirmation checkbox

**Each step includes:**
- Large input fields (56px tall)
- Real-time validation (green ✅ / red ❌)
- Inline tooltips ([ⓘ] icons)
- Auto-focus on first field
- Auto-tab for numeric inputs (optional)

---

### Component 3: Progress Indicator

**Visual Design:**
```
[●●●○○] Step 3 of 5: Baseline Physiology
```

**Features:**
- Filled dots for completed steps
- Current step highlighted
- Step title displayed
- Tap dot to jump to step (if already completed)

---

### Component 4: Navigation Buttons

**Desktop/Tablet:**
```
[← Back]  [Save & Exit]  [Next →]
```

**Mobile:**
```
[← Back]  [Next →]
[Save & Exit] (secondary button, smaller)
```

**Button Specs:**
- Height: 56px
- Full-width on mobile
- Half-width on desktop
- Green "Submit All" on final step

---

### Component 5: Auto-Save System

**Features:**
- Save to local storage every 30 seconds
- Show "Last saved: X seconds ago" indicator
- Resume from last step on return
- Sync to database on submit

**Example:**
```tsx
const { autoSave, lastSaved } = useWizard({
  wizardId: 'baseline-assessment',
  patientId: 'PT-XLMR3WZP',
  saveInterval: 30000
});
```

---

### Component 6: Auto-Generated Clinical Narrative (CRITICAL)

**Purpose:** Auto-generate narrative charts from structured inputs (per strategic synthesis)

**Strategic Context:**
> "Auto-generate narrative charts from structured inputs" - Top practitioner request

**Features:**
- Generate clinical narrative from all 5 form submissions
- Include all baseline scores with severity interpretations
- Flag concerning findings (e.g., high PTSD symptoms)
- Exportable as PDF or copy-paste text

**Example Output:**
```
BASELINE ASSESSMENT NARRATIVE
Patient ID: PT-XLMR3WZP
Date: February 17, 2026

MENTAL HEALTH SCREENING:
Patient completed baseline mental health screening. PHQ-9 score of 21 indicates 
severe depression. GAD-7 score of 12 indicates moderate anxiety. ACE score of 4 
suggests moderate childhood adversity. PCL-5 score of 85 indicates significant 
PTSD symptoms (clinical threshold: 33).

SET & SETTING:
Treatment expectancy score of 50/100 indicates moderate confidence in treatment 
success. Patient demonstrates realistic expectations for therapeutic outcomes.

BASELINE PHYSIOLOGY:
Resting HRV: 50.00ms (normal range for age). Blood pressure: 120/80 mmHg (normal).
Cardiovascular health appears stable for psychedelic-assisted therapy.

CLINICAL OBSERVATIONS:
Patient presents as motivated and engaged. Strong support system identified. 
No significant contraindications noted.

INFORMED CONSENT:
Informed consent obtained and documented. Patient verbalized understanding of 
treatment risks, benefits, and alternatives.

CLINICAL IMPRESSION:
Patient is appropriate candidate for psychedelic-assisted therapy. Baseline 
depression and PTSD symptoms are significant. Recommend trauma-informed approach 
with close monitoring during dosing session.
```

**Implementation:**
```tsx
const narrative = generateNarrative({
  forms: [mentalHealth, setSetting, physiology, observations, consent],
  patientId: 'PT-XLMR3WZP',
  template: 'baseline-assessment'
});
```

**UI:**
```
[After wizard completion]
✅ Baseline Assessment Complete

[View Clinical Narrative] [Export PDF] [Copy to Clipboard]
```

---

## Verification Plan

### Automated Tests
```bash
npm run test -- BaselineAssessmentWizard.test.tsx
npm run test -- useWizard.test.ts
```

### Manual Verification
1. **Navigation:** Verify Next/Back buttons work
2. **Progress:** Verify progress dots update correctly
3. **Auto-Save:** Verify saves every 30 seconds
4. **Resume:** Verify can resume from last step
5. **Swipe:** Verify swipe left/right navigates (mobile)
6. **Keyboard:** Verify Enter = Next, Esc = Save & Exit
7. **Submit:** Verify all 5 forms submit as one batch

### Accessibility
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader announces current step
- Focus management (auto-focus first field)
- ARIA labels on all inputs

---

## Dependencies
- WO-073 (Slide-out panel component)
- 5 Phase 1 form components
- Patient context

## Estimated Effort
**16-20 hours** (4-5 days) - Increased from 12-16 hours to include auto-generated narrative

## Success Criteria
- ✅ Wizard navigates through all 5 steps
- ✅ Progress indicator shows current step
- ✅ Auto-save works every 30 seconds
- ✅ Can resume from last step
- ✅ Swipe gestures work on mobile
- ✅ Keyboard shortcuts functional
- ✅ All 5 forms submit as one batch
- ✅ Time reduced to 8-10 minutes
- ✅ **Auto-generated clinical narrative created on completion**
- ✅ **Narrative exportable as PDF and copy-paste text**

---

**Status:** Ready for LEAD assignment

