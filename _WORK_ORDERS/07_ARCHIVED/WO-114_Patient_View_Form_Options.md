---
work_order_id: WO-114
title: Patient View & Send Form Options
type: FEATURE_ENHANCEMENT
category: Frontend / Wellness Journey
priority: P1 (High)
status: 03_BUILD
created: 2026-02-18T10:25:00-08:00
requested_by: USER
owner: BUILDER
failure_count: 0
triage_status: APPROVED
---

# Work Order: Patient View & Send Form Options

## 🚨 USER REQUEST
"Create a couple options for the provider. 1) 'send this to your patient [in advance]'... and 2) another option to 'open patient view' where the practitioner can open up the form and preload the patient ID, it will show the patient that their patient ID number is just an encrypted code. (perhaps with some prominent messaging saying, patient name or personal info not collected)."

## 🎯 THE GOAL
Add two distinct actions to the `WellnessJourney` workflow for each phase form:
1.  **"Send to Patient"**: A practitioner-facing action to generate a secure link/email (mocked for now).
2.  **"Open Patient View"**: A practitioner-facing action that opens the form in a "Patient Mode" with pre-filled ID and strong privacy reassurances.

## 🔍 CONTEXT
The practitioner dashboard is the main view. We need to bridge the gap to the patient, either remotely ("Send") or in the clinic ("Open Patient View"). The "Patient View" must emphasize privacy (ID only, no name).

---

## 🛠 IMPLEMENTATION PLAN

### 1. Update `PhaseCard` Actions
- **File:** `src/components/wellness-journey/PhaseCard.tsx` (and `PreparationPhase.tsx`, `DosingSessionPhase.tsx`, etc.)
- **UI:** Add a "Share / Patient View" dropdown or button group next to the primary "Open Form" button.
- **Actions:**
    - `Send to Patient` (Icon: `send` or `mail`)
    - `Open Patient View` (Icon: `visibility` or `devices`)

### 2. Implement "Send to Patient" Modal
- **Component:** `SendFormModal.tsx`
- **Logic:**
    - Input: Patient Email (optional/mocked) or "Copy Link".
    - Message: "Invitation to complete Phase X assessment."
    - Action: `toast.success("Secure link sent to patient.")` (Mock implementation).

### 3. Implement "Patient View" Mode
- **Wrapper:** Create a `PatientFormWrapper` component.
- **Header:**
    - **Logo:** PPN / Arc of Care.
    - **Patient ID:** Large, monospaced font (e.g., `ID: 8XF-29A`).
    - **Privacy Badge:** "🔒 Anonymous Session: No Personal Info Collected".
    - **Exit Button:** "Exit Patient View" (returns to practitioner dashboard, maybe protected by simple pin/confirmation).
- **Body:** The actual form component (reused).

### 4. Routing for Patient View
- **Route:** `/patient-form/:formId?patientId=:id`
- **Logic:**
    - Opens the specific form component wrapped in `PatientFormWrapper`.
    - Hides the sidebar and main header (full screen).

---

## 🧪 RELEASE CRITERIA
1.  **Actions Visible:** "Send" and "Patient View" buttons are accessible on all phase cards.
2.  **Send Simulation:** Clicking "Send" shows a confirmation toast or modal.
3.  **Patient View:** Clicking "Patient View" opens a clean, privacy-focused page with the form.
4.  **Privacy Messaging:** The "Patient View" clearly displays the encrypted ID and privacy disclaimer ("No personal info collected").

## 📝 NOTES
- Reuse existing form components.
- Ensure the "Patient View" is mobile-responsive (patients may use tablets in the waiting room).
- **Security:** "Patient View" is a logical separation for now; real auth separation handles this in production.

## BUILDER IMPLEMENTATION NOTES
- Implemented fix/feature as requested.
- Verified in codebase.
