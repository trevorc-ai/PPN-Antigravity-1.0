---
id: WO-050
status: 03_BUILD
priority: P0 (Critical)
category: Feature
owner: BUILDER
failure_count: 0
phase: Arc of Care - Phase 1 (Preparation)
estimated_hours: 15-20
---

# Work Order: Phase 1 Forms Redesign (Preparation)
## Arc of Care Compliance - Forms Showcase Update

**Created:** 2026-02-17T05:35:00-08:00  
**Designer:** DESIGNER  
**Phase:** 1 of 3 (Preparation)  

---

## 📋 User Request

Update Forms Showcase Phase 1 (Preparation) forms to achieve 100% compliance with Arc of Care Design Guidelines v2.0 using the schema from `arc_of_care_technical_spec.md` as the authoritative source.

**Design Guidelines (9 criteria):**
- ⚡ Optimum speed (<60s protocol entry)
- 👆 Minimal touches
- 📐 Optimal space usage
- 🎯 No text inputs / No PHI/PII (schema now uses dropdowns)
- 🔄 Multi-treatment tracking
- 📈 Scalability (dynamic ref_ table rendering)
- ♿ Accessibility (WCAG AAA, color-blind safe)
- 🎨 Optimal UI/UX
- 💎 Aesthetic consistency (glassmorphism, Tailwind CSS)

---

## 🎯 Scope: Phase 1 Forms (Preparation)

### Forms Included:

| # | Form Name | Status | Changes Required |
|---|-----------|--------|------------------|
| 1 | Mental Health Screening | ✅ USE AS-IS | None |
| 2 | Set & Setting | ✅ USE AS-IS | None |
| 3 | Baseline Physiology | ✅ USE AS-IS | None |
| 4 | Baseline Observations | ✅ USE AS-IS | None (schema updated) |
| 5 | Informed Consent | ✅ USE AS-IS | None |

**Total:** 5 forms, all compliant with locked schema

---

## 🔧 LEAD ARCHITECTURE (UPDATED P0 PRIORITY)

### ⚡ CRITICAL CONTEXT:

This is a **VERIFICATION AND DOCUMENTATION** task, NOT a code implementation task. All 5 Phase 1 forms already exist and are compliant with the locked schema. Your job is to:

1. **Verify** that existing forms match the schema exactly
2. **Document** them as reference implementations for Phase 2 & 3
3. **Audit** compliance with 9 design guidelines
4. **Create** a showcase integration checklist

**NO CODE CHANGES REQUIRED** unless you discover schema mismatches during verification.

---

### Technical Strategy:

**Phase 1 forms map directly to `log_baseline_assessments` table in the locked schema.**

All forms use controlled inputs (numeric steppers, gradient sliders, checkboxes, dropdowns) with **zero free-text fields** per the "No PHI/PII" rule.

**Schema Reference:**
```sql
CREATE TABLE log_baseline_assessments (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  site_id INTEGER REFERENCES ref_sites(id),
  assessment_date TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Depression & Anxiety
  phq9_score INTEGER CHECK (phq9_score BETWEEN 0 AND 27),
  gad7_score INTEGER CHECK (gad7_score BETWEEN 0 AND 21),
  
  -- Trauma & PTSD
  ace_score INTEGER CHECK (ace_score BETWEEN 0 AND 10),
  pcl5_score INTEGER CHECK (pcl5_score BETWEEN 0 AND 80),
  
  -- Set & Setting
  expectancy_scale INTEGER CHECK (expectancy_scale BETWEEN 1 AND 100),
  psycho_spiritual_history TEXT, -- NOW DROPDOWN (per user clarification)
  
  -- Physiology
  resting_hrv DECIMAL(5,2),
  resting_bp_systolic INTEGER,
  resting_bp_diastolic INTEGER,
  
  -- Metadata
  completed_by_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Files to Verify:**
1. `src/components/forms/MentalHealthScreening.tsx` ✅
2. `src/components/forms/SetAndSetting.tsx` ✅
3. `src/components/forms/BaselinePhysiology.tsx` ✅
4. `src/components/forms/BaselineObservations.tsx` ✅
5. `src/components/forms/InformedConsent.tsx` ✅

---

### 🎯 EXECUTION WORKFLOW (BUILDER):

**Step 1: Verify Form-Schema Alignment (2 hours)**
- Read each of the 5 form components
- Create a verification matrix mapping form inputs → schema fields
- Flag any mismatches (e.g., wrong input type, missing validation)
- Document findings in `docs/forms/phase1_verification_report.md`

**Step 2: Compliance Audit (2 hours)**
- Test each form against the 9 design guidelines
- Use browser tool to verify:
  - Speed: Can complete in <60s
  - Touches: Count actual clicks/taps needed
  - Accessibility: Font sizes ≥12px, keyboard nav, WCAG AAA
  - Aesthetics: Glassmorphism theme consistency
- Document findings in same verification report

**Step 3: Create Reference Documentation (1 hour)**
- Create `docs/forms/phase1_preparation_forms.md`
- Document each form's purpose, fields, time-to-complete, touch count
- Include screenshots from browser testing
- This becomes the **gold standard** for Phase 2 & 3 forms

**Step 4: Forms Showcase Integration Check (1 hour)**
- Verify all 5 forms are in `src/pages/FormsShowcase.tsx`
- Test navigation and rendering
- Document any integration issues

**Total Estimated Time: 6 hours** (reduced from 15-20 due to no code changes)

---

### 🚨 CRITICAL CONSTRAINTS:

- **DO NOT** modify form code unless you find a schema mismatch
- **DO NOT** change the database schema
- **DO** use the browser tool to verify UX claims (speed, touches)
- **DO** create screenshots for documentation
- **DO** flag any accessibility violations for INSPECTOR review

---

### ✅ SUCCESS CRITERIA:

1. Verification report confirms 100% schema alignment (or documents mismatches)
2. Compliance audit confirms 9/9 guidelines met (or documents gaps)
3. Reference documentation created and ready for Phase 2/3 teams
4. Forms Showcase integration verified
5. All findings documented with screenshots

---

## 📦 Implementation Tasks

### Task 1: Verify Form-Schema Alignment (BUILDER)

**Purpose:** Confirm all Phase 1 forms match the locked schema exactly

**Verification Checklist:**

**Form 1: Mental Health Screening**
- [ ] PHQ-9 Score: Numeric stepper (0-27) → `phq9_score`
- [ ] GAD-7 Score: Numeric stepper (0-21) → `gad7_score`
- [ ] ACE Score: Numeric stepper (0-10) → `ace_score`
- [ ] PCL-5 Score: Numeric stepper (0-80) → `pcl5_score`

**Form 2: Set & Setting**
- [ ] Treatment Expectancy: Gradient slider (1-100) → `expectancy_scale`

**Form 3: Baseline Physiology**
- [ ] Resting HRV: Numeric input (ms) → `resting_hrv`
- [ ] BP Systolic: Numeric stepper (mmHg) → `resting_bp_systolic`
- [ ] BP Diastolic: Numeric stepper (mmHg) → `resting_bp_diastolic`

**Form 4: Baseline Observations**
- [ ] Psycho-Spiritual History: Dropdown → `psycho_spiritual_history`
- [ ] (Note: Schema shows TEXT but user confirmed it's now dropdown)

**Form 5: Informed Consent**
- [ ] Consent Type: Multi-select checkboxes
- [ ] Confirmation: Boolean checkbox

---

### Task 2: Compliance Audit (DESIGNER)

**Purpose:** Verify all Phase 1 forms meet 9 design guidelines

**Audit Checklist:**

For each form, verify:
- [ ] ⚡ Speed: Can be completed in <60 seconds
- [ ] 👆 Touches: Minimized (use touch budget)
- [ ] 📐 Space: Efficient layout, responsive design
- [ ] 🎯 No Text Inputs: Zero free-text fields
- [ ] 🔄 Multi-Treatment: Supports session tracking
- [ ] 📈 Scalable: Dynamic rendering from ref_ tables
- [ ] ♿ Accessible: WCAG AAA, color-blind safe, keyboard navigable
- [ ] 🎨 UI/UX: Intuitive, consistent, delightful
- [ ] 💎 Aesthetic: Aligned with CSS theme, glassmorphism

---

### Task 3: Documentation Update (BUILDER)

**Purpose:** Document Phase 1 forms as reference implementation

**Create Documentation:**

**File:** `docs/forms/phase1_preparation_forms.md`

```markdown
# Phase 1: Preparation Forms
## Reference Implementation for Arc of Care

### Overview
Phase 1 forms collect baseline assessments before the dosing session.
All forms map to `log_baseline_assessments` table.

### Forms

#### 1. Mental Health Screening
- **Purpose:** Assess depression, anxiety, trauma, PTSD
- **Assessments:** PHQ-9, GAD-7, ACE, PCL-5
- **Time to Complete:** ~30 seconds
- **Touch Count:** 8-12 touches
- **Schema Fields:** `phq9_score`, `gad7_score`, `ace_score`, `pcl5_score`

#### 2. Set & Setting
- **Purpose:** Measure treatment expectancy
- **Assessment:** Expectancy Scale (1-100)
- **Time to Complete:** ~10 seconds
- **Touch Count:** 1 touch (gradient slider)
- **Schema Field:** `expectancy_scale`

#### 3. Baseline Physiology
- **Purpose:** Record resting vital signs
- **Measurements:** HRV, Blood Pressure
- **Time to Complete:** ~20 seconds
- **Touch Count:** 6-9 touches
- **Schema Fields:** `resting_hrv`, `resting_bp_systolic`, `resting_bp_diastolic`

#### 4. Baseline Observations
- **Purpose:** Capture psycho-spiritual background
- **Assessment:** Dropdown selection
- **Time to Complete:** ~15 seconds
- **Touch Count:** 2-3 touches
- **Schema Field:** `psycho_spiritual_history`

#### 5. Informed Consent
- **Purpose:** Document consent types
- **Assessment:** Multi-select checkboxes
- **Time to Complete:** ~15 seconds
- **Touch Count:** 2-3 touches
- **Schema Field:** (separate consent tracking table)

### Total Phase 1 Time
**~90 seconds** for all 5 forms
```

---

### Task 4: Forms Showcase Integration (BUILDER)

**Purpose:** Ensure Phase 1 forms are properly integrated in Forms Showcase

**Verification:**
- [ ] All 5 forms appear in Forms Showcase navigation
- [ ] Forms are grouped under "Phase 1: Preparation" section
- [ ] Each form has proper route (e.g., `#/forms-showcase/mental-health-screening`)
- [ ] Forms render correctly in showcase layout
- [ ] Forms are accessible via direct URL

**File:** `src/pages/FormsShowcase.tsx`

Verify structure:
```typescript
const phase1Forms = [
  { id: 1, name: 'Mental Health Screening', component: MentalHealthScreening, phase: 'Preparation' },
  { id: 2, name: 'Set & Setting', component: SetAndSetting, phase: 'Preparation' },
  { id: 3, name: 'Baseline Physiology', component: BaselinePhysiology, phase: 'Preparation' },
  { id: 4, name: 'Baseline Observations', component: BaselineObservations, phase: 'Preparation' },
  { id: 5, name: 'Informed Consent', component: InformedConsent, phase: 'Preparation' },
];
```

---

## 🧪 Testing Requirements

### Functional Tests:
- [ ] All forms load without errors
- [ ] All forms submit data to correct schema fields
- [ ] Validation works correctly (e.g., PHQ-9 score 0-27)
- [ ] Forms pre-populate when editing existing assessment

### Accessibility Tests:
- [ ] Keyboard navigation works for all form fields
- [ ] Screen reader announces all labels correctly
- [ ] Color contrast meets WCAG AAA (7:1 ratio)
- [ ] No color-only meaning (all status indicators have text + icons)
- [ ] Font sizes ≥12px throughout

### Performance Tests:
- [ ] Forms load in <500ms
- [ ] Form submission completes in <1s
- [ ] No layout shift during render

### Cross-Browser Tests:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 📊 Success Criteria

**Phase 1 forms achieve:**
- ✅ 100% compliance with all 9 design guidelines
- ✅ 100% schema alignment (zero mismatches)
- ✅ Zero free-text inputs (0% PHI risk)
- ✅ <90 seconds total completion time (all 5 forms)
- ✅ <30 touches total (all 5 forms)
- ✅ WCAG AAA accessibility
- ✅ Scalable (no hardcoded layouts)
- ✅ Aesthetic consistency (glassmorphism theme)

---

## 📚 Reference Documents

- **Design Guidelines:** `/brain/arc_of_care_guidelines_v2.md`
- **Forms Audit:** `/brain/arc_of_care_forms_audit.md`
- **Schema Spec:** `/brain/arc_of_care_technical_spec.md`
- **Redesign Proposal:** `/brain/forms_redesign_proposal.md`

---

## 🚀 Deployment Checklist

- [ ] All forms verified against schema
- [ ] Compliance audit completed (9/9 guidelines)
- [ ] Documentation created
- [ ] Forms Showcase integration verified
- [ ] All tests pass (functional, accessibility, performance)
- [ ] INSPECTOR review completed
- [ ] USER review completed
- [ ] Ready for Phase 2 work order

---

**Estimated Effort:** 15-20 hours  
**Dependencies:** None (Phase 1 is independent)  
**Blocks:** WO-051 (Phase 2 Forms), WO-052 (Phase 3 Forms)  
**Status:** Ready for LEAD triage and assignment
