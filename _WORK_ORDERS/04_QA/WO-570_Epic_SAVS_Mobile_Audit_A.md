---
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
epic: Epic_SAVS_Mobile_Audit
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-570 — SAVS Mobile Audit A: Core Navigation & Global Chassis
> **Authored by:** PRODDY  
> **Date:** 2026-03-06  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement
The Wellness Journey UI is bloated and unusable on mobile/tablet devices. Additionally, interaction testing without defined expected results causes desyncs between UI rendering, DB writes, and Data Viz generation. We lack a baseline map of how core navigation buttons should hydrate state across these 3 layers.

---

### 2. Target User + Job-To-Be-Done
The Practitioner needs to seamlessly navigate the patient journey on a mobile device without layout breakage so that they can safely log clinical data without friction.

---

### 3. Success Metrics
1. 100% of core navigation actions (select patient, switch phase, practice mode) successfully map expected state changes across UI, DB, and Viz layers in the Interaction Matrix.
2. Padding, margins, and layout bloat in `WellnessJourney.tsx` context bars are reduced, resulting in zero horizontal scrolling on a 375px viewport.
3. Every clickable element in the core navigation header has a minimum touch target size of 44x44px.

---

### 4. Feature Scope

#### ✅ In Scope
- Defining the State-Action Verification System (SAVS) Interaction Matrix for: Patient Selection, Phase Toggles, and Practice Mode.
- Auditing and optimizing `WellnessJourney.tsx` (Core layout, Patient Context Bar, Phase Indicators) for mobile (375px) and tablet (768px).
- Enforcing FLO's 14px minimum text size rule.
- Enforcing Mobile-Audit's 44px minimum touch target rule.
- Running end-to-end browser tests to verify the SAVS matrix.

#### ❌ Out of Scope
- Optimizing or restructuring the Slide-Out Panel chassis (Reserved for WO-B).
- Modifying internal form contents or live-session inputs (Reserved for WO-C/D).

---

### 5. Priority Tier

**[x] P0** — Demo blocker / safety critical  
**[ ] P1** — High value, ship this sprint  
**[ ] P2** — Useful but deferrable  

**Reason:** Core navigation usability on mobile is fundamentally broken, blocking users from accessing the primary clinical workflow. Furthermore, mapping interactions is critical to prevent data-loss regressions.

---

### 6. Open Questions for LEAD
1. When mapping "Practice Mode", do we expect any local storage writes to persist across page reloads, or is it strictly ephemeral React state?
2. Does the global chassis need any specific accommodations for Landscape orientation on smartphones, or just Portrait?

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

### Action 1: Select Patient (Existing)
* **[UI Layer]**: Modal closes. Toast appears: "Patient Loaded". Patient bar uncollapses (unless Phase 2 Live). Localized phase tabs update to reflect `completedPhases`.
* **[DB Layer]**: `createClinicalSession()` fires. New row injected into `log_clinical_records` for this specific session. Medication context is pulled from `log_patient_intake` and cached.
* **[Viz Layer]**: N/A for raw navigation, but readies the UUID for timeline plots.

### Action 2: Select Patient (Test / Practice Mode)
* **[UI Layer]**: Modal closes. Toast appears: "Practice Mode Active".
* **[DB Layer]**: `createClinicalSession()` is bypassed. Ephemeral UUID generated locally. NO writes to `log_clinical_records` occur.
* **[Viz Layer]**: N/A for raw navigation.

### Action 3: Switch Phase (Via Main Tabs)
* **[UI Layer]**: Active tab styling illuminates. Only proceeds if `isPhaseUnlocked` returns true. Scroll snaps to top.
* **[DB Layer]**: No immediate writes, strictly state-driven navigation.
* **[Viz Layer]**: Phase 3 charts query `log_session_timeline_events` based on the loaded active session UUID.

---
