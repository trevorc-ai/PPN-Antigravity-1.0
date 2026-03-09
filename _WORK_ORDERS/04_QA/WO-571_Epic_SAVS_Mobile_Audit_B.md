---
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
epic: Epic_SAVS_Mobile_Audit
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-571 — SAVS Mobile Audit B: Phase 1 (Preparation) Intakes
> **Authored by:** PRODDY  
> **Date:** 2026-03-06  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement
The Phase 1 forms (Consent, Demographics, Assessments) and their parent container, `SlideOutPanel.tsx`, have mobile rendering issues (text overflow, small touch targets) and lack a defined interaction mapping to verify that form submissions correctly write to the database and hydrate the UI HUD.

---

### 2. Target User + Job-To-Be-Done
The Practitioner needs to complete Phase 1 intake forms on a mobile device without layout breakage so that critical baseline patient data is securely logged and immediately visible in the Phase 1 HUD.

---

### 3. Success Metrics
1. 100% of Phase 1 intake forms define their expected UI, DB, and Viz states in the Interaction Matrix.
2. `SlideOutPanel.tsx` utilizes 100% of the viewport width on mobile (<768px) and eliminates horizontal scrolling within its inner forms.
3. Every interactive element (checkboxes, radios, submission buttons) within the Phase 1 forms meets the 44px minimum touch target size requirement.

---

### 4. Feature Scope

#### ✅ In Scope
- Defining the State-Action Verification System (SAVS) Interaction Matrix for: Consent, Protocol Configurator, Baseline Assessments (PHQ-9, GAD-7), and Set & Setting forms.
- Auditing and optimizing `SlideOutPanel.tsx` mobile scaling.
- Auditing the specific form components triggered in Phase 1 for mobile layout issues and 44px tap targets.
- Enforcing FLO's zero free-text input policy where applicable inside these specific forms.

#### ❌ Out of Scope
- Auditing or optimizing Phase 2 live session "cockpit" components (Reserved for WO-C).
- Modifying the underlying database `log_patient_intake` schemas (we are only verifying writes to them).

---

### 5. Priority Tier

**[x] P0** — Demo blocker / safety critical  
**[ ] P1** — High value, ship this sprint  
**[ ] P2** — Useful but deferrable  

**Reason:** Phase 1 data forms the foundation of the clinical record. If mobile input is broken or if form submissions do not correctly map to the database, the entire downstream clinical workflow fails.

---

### 6. Open Questions for LEAD
1. Does the `SlideOutPanel` swipe-to-dismiss gesture conflict with vertical scrolling on any of the longer assessments (like the MEQ-30 or PHQ-9)?
2. Do we expect any of the Phase 1 forms to bypass localStorage and write directly to Supabase immediately, or do they all save locally first?

---

### PRODDY Sign-Off Checklist
- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====

## INTERACTION MATRIX (LEAD Execution Plan)

### Action 1: Submit Informed Consent
* **[UI Layer]**: Form validates signatures -> Modal closes -> Toast: "Consent Signed" -> Phase 1 HUD 'Consent' chip turns teal and reads "Signed".
* **[DB Layer]**: Saves locally to `ppn_consent_${patientId}` structure.
* **[Viz Layer]**: N/A for Phase 1.

### Action 2: Submit Protocol Configurator (Demographics)
* **[UI Layer]**: Form validates -> Modal closes -> Patient Context bar updates with Age, Gender, Weight, and Treating Condition pills.
* **[DB Layer]**: Updates local cache or sends `PatientIntakeData` payload affecting `log_patient_intake` upon session start? (Requires code verification to ensure expected write path).
* **[Viz Layer]**: N/A for Phase 1.

### Action 3: Submit Baseline Assessments (PHQ-9, GAD-7)
* **[UI Layer]**: Wizard completes -> Modal closes -> Phase 1 HUD chips for PHQ-9/GAD-7 update with calculated integer scores.
* **[DB Layer]**: Saves locally to `ppn_wizard_baseline_${patientId}`.
* **[Viz Layer]**: N/A for Phase 1.

### Action 4: Submit Set & Setting
* **[UI Layer]**: Form submits -> Modal closes -> Phase 1 HUD 'Set & Setting' chip turns teal and reads "Complete".
* **[DB Layer]**: Saved locally (requires code verification of exact storage key/DB write point).
* **[Viz Layer]**: N/A for Phase 1.
