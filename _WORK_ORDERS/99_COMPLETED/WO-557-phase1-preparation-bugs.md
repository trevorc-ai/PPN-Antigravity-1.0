# WO-557 — Wellness Journey: Phase 1 Preparation Bugs + Tooltip Audit

**Page:** Wellness Journey → Phase 1: Preparation
**Priority:** High (P1 — multiple hard failures in primary clinical workflow)
**Assigned to:** BUILDER
**Status:** 03_BUILD
**Created:** 2026-03-06 | **Scoped by LEAD:** 2026-03-06

---

## Sub-Task A: Execute `/create_tooltips` Workflow

Audit and reimplement ALL tooltips in Phase 1 Preparation components using `AdvancedTooltip`.

**Global rule:** Tooltips must open **toward the container centre** — never toward an edge.
Apply `side` prop using the workflow positioning matrix:
- Elements near **top of container** → `side="bottom"`
- Elements near **right edge** → `side="left"`
- Mid-page elements → `side="top"` (default)

**Known failing `?` tooltip triggers (all return no result):**
| Trigger | Expected | Side |
|---------|----------|------|
| C-SSRS Score `?` | Dialogue explaining C-SSRS scoring | `bottom` or `right` |
| Safety Concerns `?` | Explanation of safety concern flags | determine by position |
| Actions `?` | Explanation of available actions | determine by position |
| Concomitant Medications `?` | Definition of "concomitant" + rename to "Additional Medications" | determine by position |
| Clinical Observations `?` | Informational dialogue | determine by position |
| Any other `?` triggers with no result | Applicable info | audit all |

**Tooltip implementation standard:** `/create_tooltips` workflow — `AdvancedTooltip` component at `src/components/ui/AdvancedTooltip.tsx`.

---

## Sub-Task B: Bug Fixes (Hard Failures)

### BUG-1: "Change" patient config creates NEW patient instead of editing existing
- **Steps:** Patient created → click "Change" to update age/weight/gender config
- **Expected:** Edit/update existing patient record
- **Actual:** Creates a brand new patient ID — data not updated
- **File:** Patient selection / setup flow in Phase 1

### BUG-2: Submitting MEQ-30 returns to Step 1 and shows Consent Form
- **Steps:** Submit MEQ-30
- **Expected:** Return to Step 1 in Preparation
- **Actual:** Consent form appears unexpectedly
- **File:** MEQ-30 form submission handler

### BUG-3: Consent form freeze — nothing saved, must close with X
- **Steps:** Fill out consent → check box → click Save/Exit or Save
- **Expected:** Save consent → advance to Step 2 Safety Check
- **Actual:** Screen freezes. Nothing is submitted/saved. User must close via X.
- **Fix required:** Consent should save successfully and auto-advance to Step 2 Safety.

### BUG-4: Amend from Safety Check shows no previous entries
- **Steps:** Click "Amend" from Safety Check section on main screen
- **Expected:** Previous entries visible and editable → save
- **Actual:** No previous entries are pre-populated
- **File:** Safety Check amend flow

### BUG-5: "Save and Continue" at Set & Setting does not auto-advance
- **Steps:** Set and Setting → click "Save and Continue"
- **Expected:** Auto-advance to Phase 2 Dosing Session (consistent with other steps)
- **Actual:** No automatic advance — manual message at bottom says to navigate manually
- **Principle:** All "Save and Continue" buttons must self-advance to the next step.

---

## Sub-Task C: Copy / Label Refinements

| Location | Current | Change To |
|----------|---------|-----------|
| Concomitant Medications | "Concomitant" (label) | "Additional Medications" + tooltip defining "concomitant" |
| Treatment Expectancy header | "Treatment Expectancy" | "Patient Treatment Expectancy" |

---

## Files to Audit
- `src/components/wizards/BaselineAssessmentWizard.tsx`
- `src/pages/WellnessJourney.tsx` (or equivalent Phase 1 entry)
- Phase 1 step components (Preparation forms, consent, MEQ-30, C-SSRS, Set & Setting)
- Look for `?` tooltip triggers with no `AdvancedTooltip` wrapper

## Verification
- All `?` triggers open correct `AdvancedTooltip` dialogs
- Tooltips open toward center, not clipped by container edges
- Consent saves and advances to Step 2
- "Change" patient edits rather than creates
- MEQ-30 submit does not incorrectly show consent form
- Amend shows previous entries pre-filled
- "Save and Continue" at Set & Setting auto-advances to Phase 2
- Labels read "Additional Medications" and "Patient Treatment Expectancy"
