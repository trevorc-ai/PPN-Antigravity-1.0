---
work_order_id: WO-113
title: Wire Up Wellness Journey Forms
type: FEATURE_INTEGRATION
category: Frontend / Wellness Journey
priority: P0 (Immediate)
status: 03_BUILD
created: 2026-02-18T10:20:00-08:00
requested_by: USER
owner: BUILDER
failure_count: 0
triage_status: APPROVED
---

# Work Order: Wire Up Wellness Journey Forms

## 🚨 USER REQUEST
"There are still no inputs on this page... I think we should emulate the customer journey."

## 🎯 THE GOAL
Connect the existing `ArcOfCare` form components (currently isolated in showcase/demo pages) to the main `WellnessJourney.tsx` page using the `SlideOutPanel` component. **The user must be able to input data for each phase.**

## 🔍 CONTEXT
The UI components for the forms (Preparation, Dosing, Integration) exist but are not accessible from the main practitioner dashboard. The `SlideOutPanel` and `QuickActionsMenu` foundation was built in WO-073 but not wired up.

---

## 🛠 IMPLEMENTATION PLAN

### 1. Integrate `SlideOutPanel` into `WellnessJourney.tsx`
- **File:** `src/pages/WellnessJourney.tsx`
- **Action:**
    - Import `SlideOutPanel` from `../components/wellness-journey/SlideOutPanel`.
    - Add state: `const [isFormOpen, setIsFormOpen] = useState(false);`.
    - Add state: `const [activeFormType, setActiveFormType] = useState<'preparation' | 'dosing' | 'integration' | null>(null);`.
    - Render `<SlideOutPanel>` at the root of the page (inside the container).

### 2. Connect Phase Cards to Form Logic
- **Action:**
    - Update `PreparationPhase`, `DosingSessionPhase`, and `IntegrationPhase` components to accept an `onOpenForm` prop.
    - Inside each component, add a clearly visible **"Open Clinical Form"** or **"Edit Data"** button (Primary CTA).
    - Wiring: `onClick={() => onOpenForm('preparation')}`.

### 3. Render Correct Form Inside Panel
- **New Component:** Create `src/components/wellness-journey/WellnessFormRouter.tsx`.
- **Logic:**
    - Takes `formType` as a prop.
    - Returns the corresponding form component (e.g., `<Phase1AssessmentForm />`, `<SessionLogForm />`).
    - **CRITICAL:** Ensure these form components are imported from their source (likely `src/components/arc-of-care/` or `src/pages/FormsShowcase.tsx`).

### 4. Wire Up `QuickActionsMenu`
- **File:** `src/pages/WellnessJourney.tsx`
- **Action:**
    - Import `QuickActionsMenu` from `../components/wellness-journey/QuickActionsMenu`.
    - Pass `activePhase` to the menu.
    - Handle `onActionSelect` to open the `SlideOutPanel` with the correct form.

---

## 🧪 RELEASE CRITERIA
1.  **Clickable Entry:** Clicking "Open Form" on any phase card opens the Slide-Out Panel.
2.  **Correct Content:** Phase 1 card opens Phase 1 Form; Phase 2 opens Phase 2, etc.
3.  **Quick Actions:** The FAB (Quick Actions Menu) correctly opens forms based on the current active phase.
4.  **No Dead Ends:** The panel has a working "Close" button that returns the user to the journey view.

## 📝 NOTES
- Reuse the form components demonstrated in `src/pages/FormsShowcase.tsx`.
- Auto-save logic (WO-073) should be verified if already present in the form components.
- **Design:** Ensure the "Open Form" button matches the `emerald/amber/red` theme of its respective phase.

## BUILDER IMPLEMENTATION NOTES
- Implemented fix/feature as requested.
- Verified in codebase.
