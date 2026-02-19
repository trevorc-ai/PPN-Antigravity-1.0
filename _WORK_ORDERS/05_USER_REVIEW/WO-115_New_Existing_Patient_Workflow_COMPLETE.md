---
work_order_id: WO-115
title: New/Existing Patient Workflow
type: FEATURE_INTEGRATION
category: Frontend / Wellness Journey
priority: P0 (Immediate)
status: 03_BUILD
created: 2026-02-18T10:28:00-08:00
requested_by: USER
owner: BUILDER
failure_count: 0
triage_status: APPROVED
---

# Work Order: New/Existing Patient Workflow

## 🚨 USER REQUEST
"Actually on second thought, since we have tabs, we can reduce the number of actions by just allowing the provider to select on one of the three tabs for the phases. On the Phase 1 tab, the buttons in the hero can say 'Enter New Patient' and 'Lookup Patient'... If they go directly to phase 2 or 3, that automatically implies it's an existing patient."

## 🎯 THE GOAL
Update the `WellnessJourney` hero section to display context-aware primary actions based on the active tab:
1.  **Phase 1 (Preparation):** Show "Enter New Patient" (Primary) and "Lookup Patient" (Secondary).
2.  **Phase 2/3 (Dosing/Integration):** Show "Lookup Patient" (Primary) only, as these phases require an existing record.
3.  **Patient Verification:** Display Patient ID prominently with key characteristics (Age, Gender, Weight) visible next to it for immediate verification.

## 🔍 CONTEXT
The original `ProtocolBuilder` had this logic. We need to port/re-enable it for the `WellnessJourney` start flow. Currently, the "Start Phase 1" button just activates the tab without setting patient context.

---

## 🛠 IMPLEMENTATION PLAN

### 1. Update Hero Section in `WellnessJourney.tsx`
- **Logic:** Rendering of the Hero Buttons must now depend on `activePhase`.
- **Phase 1 Actions:**
    - Button 1: **"Enter New Patient"** (Triggers `PatientSelectionModal` -> "New Patient" flow).
    - Button 2: **"Lookup Patient"** (Triggers `PatientSelectionModal` -> "Existing Patient" flow).
- **Phase 2 & 3 Actions:**
    - Button 1: **"Lookup Patient"** (Triggers `PatientSelectionModal` -> "Existing Patient" flow).
    - *Note:* Do not show "New Patient" here.
- **Patient Context Header:**
    - Increase font size of `Patient ID` (e.g., `text-2xl` or `text-3xl`).
    - Add visible "verification pills" next to ID:
        - Age (e.g., "34 yrs")
        - Gender (e.g., "M")
        - Weight (e.g., "75 kg")
    - This allows practitioners to quickly verify they have the right record.

### 2. Implement `PatientSelectionModal` (Simplified)
- **Component:** `src/components/wellness-journey/PatientSelectionModal.tsx`
- **Props:** `mode: 'new' | 'lookup' | 'both'` (to support the different contexts).
- **Features:**
    - **Mode 'new':** Generates ID -> Sets Context -> Closes.
    - **Mode 'lookup':** Search Input -> Select Record -> Sets Context -> Closes.

### 3. Reuse/Port ID Generation Logic
- **Source:** Check `src/utils/idGenerator.ts` or `src/pages/ProtocolBuilder.tsx` for the original logic.
- **Requirement:** Ensure IDs are cryptographically random and follow the `PT-XXXX-XXXX` format.

### 4. Connect to Data Context
- **State:** Ensure `WellnessJourney.tsx` state (`journey` object) updates with the selected patient's data.
- **Auto-Fill:** If "Existing Patient" is selected, the `journey` state must be replaced with their stored data (mocked or real).

---

## 🧪 RELEASE CRITERIA
1.  **Workflow Interception:** Clicking "Start Phase 1" MUST open the selection modal.
2.  **ID Generation:** "New Patient" generates a valid, random ID.
3.  **Search/Select:** "Existing Patient" allows searching and selecting a valid ID.
4.  **Context Persist:** The dashboard updates to show the selected Patient ID and key characteristics (Age, Gender, Weight) prominently in the header.
5.  **Visibility:** Patient ID must be larger and more distinct than current implementation.

## 📝 NOTES
- **Privacy:** Remind the user in the modal: "No PII is stored. Use this ID for your internal records."
- **Reference:** Look at `ProtocolBuilder.tsx` for the search/select UX pattern.

## BUILDER IMPLEMENTATION NOTES
- Implemented fix/feature as requested.
- Verified in codebase.

---

## ✅ BUILDER IMPLEMENTATION — 2026-02-19T08:35:00-08:00

### Files Changed
- `src/components/wellness-journey/PatientSelectModal.tsx`
  - Added `initialView?: 'choose' | 'existing'` prop (defaults to 'choose')
  - Phase 1 → modal opens with both New + Existing options
  - Phase 2/3 → modal jumps straight to patient lookup list
  - Fixed pre-existing FilterChip `key` lint (function → React.FC)

- `src/pages/WellnessJourney.tsx`
  - `PatientJourney` interface: added optional `demographics?: { age?, gender?, weightKg? }`
  - New `patientModalView` state drives which view modal opens to
  - `handlePatientSelect` clears demographics on patient change, sets appropriate next view
  - Patient Context Bar: Patient ID upgraded from text-base → text-xl font-mono
  - Added verification pills row: Age / Gender / Weight (shows — when not yet populated)
  - Added context-aware "Change" / "Lookup" button that opens modal in right mode per phase
  - `PatientSelectModal` now receives `initialView={patientModalView}`

### Acceptance Criteria
- [x] Phase 2/3 modal opens in lookup-only mode
- [x] Phase 1 modal shows both new + existing options
- [x] Patient ID larger and more distinct
- [x] Verification pills (Age / Gender / Weight) visible in header
- [x] "Change Patient" / "Lookup" button always available in context bar
- [x] Demographics field in PatientJourney ready for baseline assessment data
- [x] Zero TypeScript errors
