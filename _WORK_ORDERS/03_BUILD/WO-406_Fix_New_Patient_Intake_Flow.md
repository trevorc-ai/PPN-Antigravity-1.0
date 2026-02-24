---
id: WO-406
status: 03_BUILD
owner: BUILDER
priority: CRITICAL
failure_count: 0
created: 2026-02-23
source: Jason/Trevor Demo Debrief 2/23/26
demo_deadline: Dr. Allen demo (target Wednesday 2/25/26)
---

# WO-406 — Fix New Patient Intake Flow

## USER STORY (verbatim from demo)
> "One of the first questions should be — are you treating PTSD? Because that will guide us to which assessment scores we're using. The reason for the patient's visit should be one of the very first data points collected."
> — Jason, 01:11:12

> "I noticed the age 34 — it's still pulling from something. When I'm creating a new one, the first thing I want to do is what am I trying to treat."
> — Jason, 01:10:32

## LEAD ARCHITECTURE

This ticket has **two bugs** and **one feature addition**, all within the new patient / new protocol intake flow:

### Bug 1 — Age Pre-Population (HIGH — breaks demo illusion)
**Symptom:** When creating a *new* patient/protocol, the top of Phase 1 shows `Age: 34` pre-populated, pulled from a previous patient session. This must be empty/blank on a fresh new patient flow.

**Root cause:** The patient context is not being cleared when the user selects "New Patient." The patient store / local state likely retains the last loaded patient's data.

**Fix:** 
- When the user selects "New Patient" from the patient selection screen, explicitly clear/reset the patient context state.
- Ensure the Phase 1 header fields (age, gender) are blank and editable until the user fills them in as part of the new intake form.

---

### Bug 2 — Condition Being Treated Missing from New Patient First Screen (HIGH)
**Symptom:** When creating a new protocol/patient, the workflow jumps directly to Phase 1 steps (informed consent, etc.) without first asking what condition is being treated. This means assessment score selection (GAD-7, PHQ-9, etc.) has no guiding context.

**Fix — New patient creation should begin with an intake screen (BEFORE Phase 1 stepper) that captures:**

1. **What condition are we treating?** — dropdown of conditions (PTSD, Depression, Anxiety, Spiritual/Ceremonial, Other). This drives which assessment modules are pre-selected.
2. **Basic demographics** — Age (number input), Gender (dropdown: Male / Female / Non-binary / Prefer not to say).
3. **Assessment forms to use** — Multi-select checkboxes of available assessment modules (GAD-7, PHQ-9, MEQ-30, Custom). Should pre-populate based on condition selected in step 1, but practitioner can override.

**UX notes:**
- This screen should appear immediately after the user clicks "New Patient."
- It should feel like a quick 3-field form — not a full wizard. Keep it scannable.
- Once submitted, the Phase 1 stepper begins with this context loaded.
- The condition selected here should appear in the patient summary header throughout the workflow.

---

### Feature Addition — Condition in Patient Header
Once treatment condition is captured, display it in the patient summary bar at the top of Phase 1–3 screens alongside age/gender. Example:
```
Patient #4a7f | Age: 45 | Gender: M | Treating: PTSD
```

---

## ACCEPTANCE CRITERIA
- [ ] Creating a "New Patient" no longer pre-populates age/gender from a previous patient
- [ ] A new intake screen appears before Phase 1 with: condition, age, gender, assessment form selection
- [ ] Condition dropdown drives pre-selection of assessment modules
- [ ] Patient header shows condition throughout the workflow
- [ ] Existing patient flow is NOT affected

## FILES LIKELY AFFECTED
- `src/components/WellnessJourney/` — patient selection and phase screens
- Patient context / store (wherever patient state is held)
- Phase 1 stepper component

## HANDOFF
When done: update `status: 04_QA`, `owner: INSPECTOR`, move to `_WORK_ORDERS/04_QA/`.
