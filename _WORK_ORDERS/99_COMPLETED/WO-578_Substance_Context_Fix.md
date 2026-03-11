---
id: WO-578
title: Substance Context — Fix "No Substance Selected" in Phase 2 HUD + Medication Save
owner: BUILDER
status: 99_COMPLETED
priority: P0
created: 2026-03-09
source: Jason-Trevor Meeting 2026-03-09
---

## PRODDY PRD

> **Work Order:** WO-578 — Substance Context: Fix Phase 2 HUD + Medication Save  
> **Authored by:** INSPECTOR (expedited from meeting action items)  
> **Date:** 2026-03-09  
> **Status:** 99_COMPLETED

---

### 1. Problem Statement

After selecting a substance and completing Phase 1 dosing protocol, Phase 2 continues to display "No substance selected" in the HUD next to the medications section. The context established in Phase 1 is not propagating to the Phase 2 view. Additionally, the medication input in the dosing protocol does not persist to the database — practitioners enter a medication and it does not save.

---

### 2. Target User + Job-To-Be-Done

The practitioner needs the substance selected in Phase 1 to be visible in the Phase 2 HUD and the medication entered in the dosing protocol to be saved so that the clinical record is accurate and contra-indicator logic can fire correctly.

---

### 3. Success Metrics

1. After selecting a substance in Phase 1 and transitioning to Phase 2, the HUD displays the correct substance name within 2 seconds of the transition — zero "No substance selected" messages displayed.
2. A medication entered in the dosing protocol form saves to the database and is visible on page reload.
3. Contra-indicator logic (if any) fires correctly when an incompatible medication and substance combination is present.

---

### 4. Feature Scope

#### ✅ In Scope

- Trace the substance context from Phase 1 (`DosingProtocolForm` / `ProtocolContext`) to Phase 2 HUD and determine why it is not propagating.
- Fix the context propagation (either via `ProtocolContext`, `localStorage`, or session-level DB read).
- Fix the medication input persistence in `DosingProtocolForm.tsx` — identify the broken DB write path and ensure medication saves to the correct column in `wellness_sessions` or `log_dosing_protocol`.

#### ❌ Out of Scope

- Building new contra-indicator logic (existing logic should fire once context is fixed)
- Changes to the medication reference table schema
- Any UI redesign of Phase 2

---

### 5. Priority Tier

**[x] P0** — Demo blocker / safety critical  

**Reason:** "No substance selected" directly suppresses safety checks (contra-indicators). This is a patient safety defect, not a cosmetic bug.

---

### 6. Open Questions for LEAD

1. Is substance context stored in `ProtocolContext`, `localStorage`, or derived from the `wellness_sessions` DB row at Phase 2 mount?
2. Which table and column stores medication data from the dosing protocol?
3. Is the current `DosingProtocolForm` medication field wired to `updateDosingProtocol` in `clinicalLog.ts`, or is it un-wired?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] No code, SQL, or schema written anywhere in this document

---

## LEAD ARCHITECTURE

**Reviewed:** 2026-03-09 | **Routed to:** BUILDER → `03_BUILD`

### Open Questions — Resolved

**Q1: Where is substance context stored?**
→ After the practitioner fills `DosingProtocolForm`, the form saves `substance_id` (an integer FK to `ref_substances`) to `log_clinical_records`. However, the Phase 2 HUD reads `journey.session.substance` (a free-text string in the `PatientJourney` React state), which is initialized to `null` and **never updated** when `DosingProtocolForm` completes. There is no upstream call that back-propagates the saved `substance_id` into `journey.session.substance`. This is the entire root cause.

**Q2: Which table/column stores medication data?**
→ `log_clinical_records.concomitant_med_ids` (ARRAY of integer references to `ref_medications.medication_id`). The `DosingProtocolForm` data interface has a `substance_id` field but **no medication field**. The `log_phase1_safety_screen.concomitant_med_ids` stores meds entered during the Phase 1 safety screen — not the dosing protocol. BUILDER must confirm which medications the HUD intends to show (contra-indicator meds from Phase 1 safety screen, or the dosing protocol substance itself). These are two different things.

**Q3: Is `DosingProtocolForm` wired to `updateDosingProtocol` in `clinicalLog.ts`?**
→ `DosingProtocolForm` calls its own `handleSaveAndExit` / `handleSaveAndContinue` which invoke the `onSave` prop. The prop chain goes: `WellnessFormRouter` → `SlideOutPanel` → `handleFormComplete`. **There is no `updateDosingProtocol` call in `clinicalLog.ts` in the current save path.** The form saves to localStorage (`ppn_dosing_protocol`) and the `onSave` prop callback, but does not write `substance_id` to `log_clinical_records`. BUILDER must wire the save to update `log_clinical_records.substance_id` via a Supabase update using the current `sessionId`.

### Architecture Decisions

**Fix 1 — Substance HUD propagation (P0 safety fix):**
- `DosingProtocolForm.onSave` callback receives `{ substance_id, ... }`. BUILDER must thread this back up to `WellnessJourneyInternal` so that `setJourney(prev => ({ ...prev, session: { ...prev.session, substance: resolvedSubstanceName, substance_id } }))` is called.
- To resolve `substance_id → substance_name`: after form save, issue a single Supabase query `select substance_name from ref_substances where substance_id = :id` to get the display name for the HUD.
- Additionally, write the `substance_id` to `log_clinical_records` via: `supabase.from('log_clinical_records').update({ substance_id }).eq('id', sessionId)`.
- On Phase 2 component mount (`DosingSessionPhase`), if `journey.session.substance` is null, do a DB read of `log_clinical_records.substance_id` for the active session and resolve the name — so a page reload also shows the correct substance.

**Fix 2 — Medication persistence:**
- The "medication" field in the dosing protocol context refers to the **concomitant medications** already entered in the Phase 1 safety screen (`log_phase1_safety_screen.concomitant_med_ids`), NOT a new field on the dosing protocol form.
- BUILDER must confirm this with the user before building. If the intent is to show concomitant meds in the Phase 2 HUD, the fix is: on Phase 2 mount, query `log_phase1_safety_screen` for the latest row matching `session_id`, read `concomitant_med_ids`, resolve to names via `ref_medications`, and display in the HUD.
- If the dosing protocol needs its OWN medication field (separate from safety screen meds), that is a schema change (new column on `log_clinical_records`) and must be escalated to SOOP first.

**Contra-indicator logic:** Once `substance_id` is correctly propagated to React state and `localStorage`, the existing contra-indicator engine should fire without further changes.

> ⚠️ **BUILDER ACTION REQUIRED BEFORE BUILD:** Confirm with user whether the "medication" field in the dosing protocol form should read from `log_phase1_safety_screen.concomitant_med_ids` (existing Phase 1 safety data) or requires a new field. This affects whether SOOP is needed.

---

### ⛔ SURGICAL SCOPE — DO NOT EXCEED

BUILDER is authorized to touch **only** the following:

| File | Permitted Change |
|------|-----------------|
| `WellnessFormRouter.tsx` | Thread `onDosingProtocolSave(data)` callback up to parent so `substance_id` is returned after `DosingProtocolForm` saves |
| `WellnessJourney.tsx` | In `handleFormComplete` (or `onSave` callback for `dosing-protocol`): call `ref_substances` lookup, then `setJourney` to update `session.substance`; call Supabase update to write `substance_id` to `log_clinical_records` |
| `DosingSessionPhase.tsx` | On Phase 2 mount: if `journey.session.substance` is null, query `log_clinical_records.substance_id` for the session, resolve name from `ref_substances`, and call the prop setter to populate HUD |
| `clinicalLog.ts` | Add `updateSessionSubstance(sessionId, substanceId)` helper if it does not exist |

**PROHIBITED without a new LEAD-approved WO:**
- Changes to `DosingProtocolForm` UI or field structure
- Adding a new medication field to the dosing protocol form (this requires SOOP + new column)
- Changes to the contra-indicator engine logic
- Any UI redesign of Phase 2
- Touching any file not listed above

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
