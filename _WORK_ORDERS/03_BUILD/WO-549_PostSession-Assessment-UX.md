---
id: WO-549
title: "Post-Session Assessment UX & Navigation"
status: 03_BUILD
owner: BUILDER
created: 2026-03-01T16:28:00-08:00
failure_count: 0
priority: P1
authored_by: LEAD
parent_ticket: WO-546
build_order: 3
---

## LEAD ARCHITECTURE

### Context

The post-session assessment flow (triggered after End Session) has eight UX defects spanning scroll behavior, navigation, dummy data, button layouts, and a missing assessment selector. These do not require schema changes — all fixes are front-end component level.

### Architecture Decisions

1. **Assessment selector modal (Defect #18 — highest complexity item):** When the practitioner clicks "Begin Post-Session Assessments" on the Phase 2 HUD, show a **pre-assessment modal** before any assessment form loads. The modal presents a checklist of available assessments:
   - Quick Experience Check
   - Ego Dissolution Check
   - Emotional Experience Assessment
   - MEQ-30 (if applicable to session protocol)
   - Any additional assessments currently in the codebase
   
   Practitioner toggles which ones to include for this session. Selection stored in **React state / session context only** — no DB write required at this stage. Only the selected assessments appear in the step-through flow. This modal replaces showing all assessments unconditionally.

2. **Exit-without-saving (Defect #19):** Each assessment must have an "Exit Without Saving" or "Skip This Assessment" button in addition to the normal "Complete Assessment" flow. This button should confirm intent ("Are you sure? Progress will not be saved.") then return to the Phase 2 HUD or assessment selector.

3. **Auto-scroll on keyboard/keypad navigation (Defect #12):** Quick Experience Check (and any tall assessment) must scroll the active input into view when it receives focus via keyboard/tab. Use `element.scrollIntoView({ behavior: 'smooth', block: 'center' })` on focus events for all number inputs and selectors.

4. **Back button missing (Defect #13):** Every assessment step must have a functional "Previous" / "Back" button that returns to the prior question or prior assessment without data loss. The "Previous" button in Ego Dissolution (Defect #16 — permanently grayed) must be debugged — likely a `step === 0` guard that is never releasing. Fix the guard condition.

5. **Assessment complete screen scrollbar (Defect #14):** The assessment complete screen (with stats in the center) has a visible scrollbar despite not being a scrolling screen. Fix: set `overflow: hidden` on the assessment complete container. Do not use `overflow-y: scroll` or `overflow-y: auto` on this screen.

6. **Statistics dummy data (Defect #15):** The stats block "Baseline Depression / Expected Improvement / Remission Likelihood" is displaying hard-coded dummy values. BUILDER must determine the data source:
   - If real calculation exists → wire it
   - If no calculation exists → replace with a labeled placeholder: `"Available after first assessment set"` or hide the block entirely
   - Do NOT leave unlabeled dummy numbers visible to practitioners

7. **Emotional Experience button layout (Defect #17):** The 5 emotion buttons (Fear, Grief, Physical Distress, etc.) are stacked vertically and require scrolling. Refactor to a **horizontal flex row**, `flex-wrap: nowrap` on desktop tablet, `flex-wrap: wrap` on mobile. This eliminates the scroll requirement on this screen and the assessment complete screen.

### Files Likely Touched

- Post-session assessment flow container/router component
- Quick Experience Check component
- Ego Dissolution Check component  
- Emotional Experience Assessment component
- Assessment complete screen component
- Phase 2 HUD "Begin Post-Session Assessments" entry point

---

## Acceptance Criteria

- [ ] A pre-assessment selector modal appears before the assessment flow begins — practitioner can toggle which assessments to include
- [ ] Only selected assessments appear in the step-through flow
- [ ] Every assessment step has a functional "Previous / Back" button that restores prior state without data loss
- [ ] Ego Dissolution "Previous" button is not grayed — activates after first question is answered
- [ ] "Exit Without Saving" / "Skip" option exists on every assessment with a confirmation dialog
- [ ] Tapping/tabbing into an off-screen input auto-scrolls that input into view (smooth scroll)
- [ ] Assessment complete screen has no visible scrollbar (`overflow: hidden` confirmed)
- [ ] Statistics block either shows real calculated data OR shows a clearly labeled placeholder — no unlabeled dummy numbers
- [ ] Emotional Experience emotion buttons render as a horizontal row on ≥768px screens
- [ ] Emotional Experience screen does not require scrolling on a standard tablet viewport (1024×768)
- [ ] No regressions: all existing assessment types still open and complete correctly after selector modal is added
- [ ] No regressions: assessment completion still marks "Post Session Assessments" ✅ on Phase 2 HUD (pending WO-547 fix)

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
