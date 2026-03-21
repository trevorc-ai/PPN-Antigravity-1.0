---
description: Mandatory Phase 3 integration session regression checklist — run before any Phase 3 commit
---

# Phase 3 Integration Session Regression Checklist

> **Who runs this:** INSPECTOR only, after BUILDER submits and before `/finalize_feature`.
> **When:** Required for ANY change to `StructuredIntegrationSession.tsx`, `StructuredIntegrationSessionForm.tsx`, `WellnessJourney.tsx`, `ProtocolDetail.tsx`, or any file that reads/writes `log_integration_sessions`, `log_longitudinal_assessments`, or `ppn_phase3_*` localStorage keys.

---

## Pre-flight

Start the dev server. Have a test patient with at least one completed Phase 2 dosing session available.

```bash
npm run dev
```

---

## Scenario 1: Integration Session Save + Session Closure

This is the highest-stakes scenario. The save must mark the integration session as complete AND unlock the next dosing session.

1. Navigate to Wellness Journey → Phase 3 for a patient who has a completed Phase 2 session.
2. Complete all required integration fields.
3. Click Save / Complete Integration Session.
4. **PASS:** The integration session is confirmed saved (success toast or visual confirmation). Navigate to MyProtocols and confirm the patient's protocol shows the integration step completed.
5. Navigate back to Wellness Journey → Phase 2 for the same patient and confirm a **new** dosing session can be initiated (the prior session's "in progress" gate is cleared).
6. **FAIL:** Save appears to succeed but Protocol Detail page does not reflect completion. Or: Phase 2 still blocks a new session.

---

## Scenario 2: Assessment Data Persistence Across Navigation

1. Complete a longitudinal assessment (PHQ-9, GAD-7, or PCL-5) inside Phase 3.
2. Navigate away to Dashboard.
3. Return to Wellness Journey → Phase 3 → Protocol Detail for the same patient.
4. **PASS:** Assessment scores are visible and correct. No fields are blank or reset.
5. **FAIL:** Any score is missing or shows a default/zero value it shouldn't.

---

## Scenario 3: Integration Step Card Illumination

1. Open Phase 3 with at least one integration step incomplete.
2. Complete and save that step.
3. Without a page reload, observe the step cards.
4. **PASS:** The completed step card illuminates (shows completed state) immediately — no reload required.
5. **FAIL:** Step card remains in incomplete state until page is refreshed.

---

## Scenario 4: Bidirectional Navigation Without Data Loss

1. Start from Protocol Detail page with a patient in Phase 3.
2. Click through to Wellness Journey Phase 3.
3. Enter (but do not save) partial data in any form.
4. Click back to Protocol Detail.
5. Return to Wellness Journey Phase 3.
6. **PASS:** No unexpected modal appears. Partial unsaved data behavior is consistent with design (may clear, but should not trigger an error state or redirect to Phase 1).
7. **FAIL:** PatientSelectModal appears unexpectedly, or an error state blocks navigation.

---

## INSPECTOR Sign-Off

All four scenarios must PASS before calling `/finalize_feature`. Document results as:

```
Scenario 1 (Save + Closure): PASS / FAIL
Scenario 2 (Assessment Persistence): PASS / FAIL
Scenario 3 (Step Card Illumination): PASS / FAIL
Scenario 4 (Bidirectional Navigation): PASS / FAIL
```
