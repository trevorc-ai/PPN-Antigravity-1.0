---
id: WO-073
status: 03_BUILD
priority: P1 (Critical)
category: Feature
owner: BUILDER
failure_count: 0
---

# Wellness Journey Form Integration: Foundation Components

## User Request
Integrate the 19 Arc of Care forms into the Wellness Journey page with context-aware access methods optimized for tablet/mobile use.

## LEAD ARCHITECTURE

### Technical Strategy
Build the foundational UI components that enable practitioners to access and fill out forms directly from the Wellness Journey page without losing patient context.

### Files to Touch
- `src/components/wellness-journey/SlideOutPanel.tsx` (NEW)
- `src/components/wellness-journey/QuickActionsMenu.tsx` (NEW)
- `src/components/wellness-journey/PhaseCard.tsx` (MODIFY)
- `src/pages/WellnessJourney.tsx` (MODIFY)
- `src/hooks/useFormIntegration.ts` (NEW)

### Constraints
- Must work on mobile/tablet (56px+ tap targets)
- Must maintain patient context visibility
- Must support offline mode with auto-save
- Must be accessible (WCAG 2.1 AAA)

## Proposed Changes

### Component 1: Slide-Out Panel (Desktop/Tablet Landscape)

**Purpose:** Display forms without losing patient context

**Specs:**
- Width: 40% of viewport (desktop), full-screen on mobile
- Slides in from right with backdrop blur
- Sticky header with form title and close button
- Sticky footer with Submit/Cancel buttons (56px tall)
- Auto-save every 30 seconds
- Swipe down to dismiss (mobile)

**Example Usage:**
```tsx
<SlideOutPanel
  isOpen={isFormOpen}
  onClose={handleClose}
  title="Mental Health Screening"
  width="40%"
>
  <MentalHealthScreeningForm />
</SlideOutPanel>
```

---

### Component 2: Quick Actions Menu (FAB)

**Purpose:** Fast access to common forms

**Specs:**
- Fixed position: bottom-right corner
- 56px diameter button with "+" icon
- Opens bottom sheet (mobile) or floating menu (desktop)
- Context-aware: shows different actions based on current phase
- Haptic feedback on tap

**Actions by Phase:**
- **Phase 1:** Complete Baseline Assessment
- **Phase 2:** Start Session, Record Vitals, Report Adverse Event
- **Phase 3:** Document Session, Log Behavioral Change, Daily Pulse Check
- **Ongoing:** Safety Check

**Example Usage:**
```tsx
<QuickActionsMenu
  currentPhase={currentPhase}
  onActionSelect={handleActionSelect}
/>
```

---

### Component 3: Enhanced Phase Cards

**Purpose:** Make phase cards clickable to access phase-specific forms

**Modifications to existing `PhaseCard.tsx`:**
- Add `onClick` handler
- Add hover state (desktop)
- Add press state (mobile) with haptic feedback
- Show form completion status (✅ Complete, ⚠️ Pending)

**Example:**
```tsx
<PhaseCard
  phase="Phase 1: Preparation"
  status="active"
  onClick={() => openPhaseDetail('phase1')}
  completionStatus={{
    completed: 4,
    total: 5,
    pending: ['Informed Consent']
  }}
/>
```

---

### Component 4: Form Integration Hook

**Purpose:** Manage form state, auto-save, and offline sync

**Features:**
- Auto-save to local storage every 30 seconds
- Offline queue for form submissions
- Sync when connection restored
- Form validation state management

**Example Usage:**
```tsx
const {
  formData,
  updateField,
  submitForm,
  isSaving,
  lastSaved
} = useFormIntegration({
  formId: 'mental-health-screening',
  patientId: 'PT-XLMR3WZP',
  autoSaveInterval: 30000
});
```

---

### Component 5: Week 1 Value Delivery (CRITICAL)

**Purpose:** Deliver visible operational value within first 2 weeks (per strategic synthesis)

**Strategic Context:**
> "Platform MUST deliver visible operational value in **first 2 weeks**, not 6 months"

**Week 1 Value Requirements:**

#### **A. Completeness Dashboard**
Show practitioners their data quality immediately after first form submission.

**UI:**
```
┌─────────────────────────────────────┐
│ 📊 Data Completeness                │
│                                     │
│ Benchmark Readiness: 60%            │
│ [●●●○○] 3 of 5 requirements met     │
│                                     │
│ ✅ Baseline outcome measure         │
│ ✅ Coded exposure record            │
│ ✅ Coded setting/support            │
│ ⚠️ Missing: Follow-up timepoint     │
│ ⚠️ Missing: Safety event capture    │
│                                     │
│ [Complete Missing Forms]            │
└─────────────────────────────────────┘
```

**Implementation:**
```tsx
<CompletenessWidget
  patientId="PT-XLMR3WZP"
  benchmarkReadiness={0.6}
  completedRequirements={['baseline', 'exposure', 'setting']}
  missingRequirements={['followup', 'safety']}
/>
```

---

#### **B. Real-Time Delta Charts**
Show baseline → current comparison immediately after data entry.

**Example:**
```
PHQ-9 Score Trend
21 (Baseline) → 12 (Current)
↓ 43% improvement
[Chart showing downward trend]
```

**Implementation:**
```tsx
<DeltaChart
  metric="PHQ-9"
  baseline={21}
  current={12}
  trend="improving"
/>
```

---

#### **C. Instant Feedback Messages**
Provide contextual insights after form submission.

**Examples:**
- "Your patient's PHQ-9 is 40% higher than network average (when network data available)"
- "HR trend is stable, no anomalies detected"
- "Patient demonstrates high motivation and strong support system"

**Implementation:**
```tsx
<FeedbackToast
  message="Baseline assessment complete! PHQ-9 indicates severe depression."
  type="info"
  action="View Treatment Recommendations"
/>
```

---

#### **D. Exportable Audit Reports**
One-click export for compliance/insurance.

**Features:**
- PDF export with all forms, timestamps, signatures
- Safety event timeline
- Completeness score
- Benchmark readiness indicator

**Implementation:**
```tsx
<ExportButton
  patientId="PT-XLMR3WZP"
  reportType="audit"
  format="pdf"
/>
```

---

## Verification Plan

### Automated Tests
```bash
npm run test -- SlideOutPanel.test.tsx
npm run test -- QuickActionsMenu.test.tsx
npm run test -- useFormIntegration.test.ts
```

### Manual Verification
1. **Desktop:** Verify slide-out panel appears at 40% width
2. **Mobile:** Verify forms open full-screen
3. **Quick Actions:** Verify FAB shows context-aware actions
4. **Phase Cards:** Verify click opens phase detail view
5. **Auto-Save:** Verify forms auto-save every 30 seconds
6. **Offline:** Verify forms queue for sync when offline

### Accessibility
- Keyboard navigation (Tab, Esc, Enter)
- Screen reader support (ARIA labels)
- Focus indicators (2px blue outline)
- High contrast mode compatible

---

## Dependencies
- Existing Wellness Journey page
- Patient context (PT-XLMR3WZP)
- 19 Arc of Care form components (from Forms Showcase)

## Estimated Effort
**16-24 hours** (4-6 days) - Increased from 8-12 hours to include Week 1 value delivery

## Success Criteria
- ✅ Slide-out panel component built and tested
- ✅ Quick actions menu functional with context-aware actions
- ✅ Phase cards clickable with completion status
- ✅ Auto-save working with 30-second interval
- ✅ Offline mode queues forms for sync
- ✅ All components accessible (WCAG 2.1 AAA)
- ✅ **Completeness dashboard shows benchmark readiness**
- ✅ **Real-time delta charts display baseline → current**
- ✅ **Instant feedback messages after form submission**
- ✅ **Exportable audit reports (PDF)**

---

**Status:** Ready for LEAD assignment

