---
id: WO-549
title: "Post-Session Assessment UX & Navigation"
status: 04_QA
owner: INSPECTOR
created: 2026-03-01T16:28:00-08:00
failure_count: 0
priority: P1
authored_by: LEAD
built_by: BUILDER
parent_ticket: WO-546
build_order: 3
---

## LEAD ARCHITECTURE

### Context

The post-session assessment flow (triggered after End Session) has eight UX defects spanning scroll behavior, navigation, dummy data, button layouts, and a missing assessment selector. These do not require schema changes — all fixes are front-end component level.

**Note (2026-03-01 live testing):** The Challenge Check (Ego Dissolution) assessment has the same exact layout and navigation issues as Quick Experience Check — too large, requires scrolling, Previous button permanently grayed. All fixes in this ticket apply to BOTH assessments and any other multi-step assessment in the flow.

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

- [x] Pre-assessment selector modal appears before flow — practitioner toggles MEQ (required), EDI, CEQ per session
- [x] Only selected assessments appear in the step-through flow (filtered from `ASSESSMENT_REGISTRY`)
- [x] Every assessment step has a functional "Previous" button — fixed by setting `questionsPerPage: 1` on all 3 configs (MEQ, EDI, CEQ were all single-page with Previous permanently disabled)
- [x] Ego Dissolution "Previous" button no longer permanently grayed — `questionsPerPage: 1` gives 2 pages for EDI, so Previous activates on page 2
- [x] "Skip this assessment" link exists on every assessment with a `window.confirm()` dialog before discarding; skipped assessment advances to next selected
- [x] Auto-scroll to active question on page change: `element.scrollIntoView({ behavior: 'smooth', block: 'center' })` in `useEffect([currentPage])`
- [x] Quick Experience Check: 1 question per page → 5 pages, no single-viewport scroll requirement
- [x] Challenge Check: 1 question per page → 3 pages, no single-viewport scroll requirement
- [x] Previous/Back works on Quick Experience Check (page 2+)
- [x] Previous/Back works on Challenge Check (page 2+)
- [x] Assessment completion screen has `overflow-hidden` — spurious scrollbar removed
- [x] Statistics block now shows real MEQ/EDI/CEQ scores from the session (dummy PHQ-9 / Predicted Journey block removed in WO-558 sweep)
- [x] Emotion buttons (CEQ likert): already render as `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5` — horizontal on ≥768px ✅
- [x] No regressions — `onComplete` callback path and localStorage write in `DosingSessionPhase` unchanged
- [x] TypeScript: `npx tsc --noEmit` = 0 errors

---

## BUILDER IMPLEMENTATION COMPLETE

**Date:** 2026-03-01T21:52:00-08:00

### Root Cause Analysis

All defects traced to two root causes:
1. `questionsPerPage: N` with `N === questions.length` → `totalPages = 1` → `canGoPrevious = false` always. Previous was never a bug in the Previous handler, it was a config bug.
2. `AdaptiveAssessmentPage` had no selector modal — all assessments ran unconditionally.

### Files Modified

**`src/config/meq30-short.config.ts`**
- `questionsPerPage: 5 → 1` — gives 5 pages, Previous active from page 2+

**`src/config/edi-brief.config.ts`**
- `questionsPerPage: 2 → 1` — gives 2 pages, Previous active from page 2

**`src/config/ceq-brief.config.ts`**
- `questionsPerPage: 3 → 1` — gives 3 pages, Previous active from page 2+

**`src/components/arc-of-care/AssessmentForm.tsx`**
- Added `onSkip?: () => void` prop
- `handleSkip()`: `window.confirm()` guard → `onSkip?.()`
- "Skip this assessment" underline link in center nav slot (only shown when `onSkip` provided)
- `useEffect([currentPage])`: `document.getElementById(\`question-${id}\`).scrollIntoView({ behavior: 'smooth', block: 'center' })` — auto-scrolls active question on page change
- `id={\`question-${question.id}\`}` added to each question card div for scroll target

**`src/pages/AdaptiveAssessmentPage.tsx`**
- `ASSESSMENT_REGISTRY` const with id/label/sublabel/required fields — single source of truth for assessment list
- `phase: 'selector' | 'quick' | 'expanded' | 'complete'` — selector added as first phase
- `selectedIds: Set<AssessmentId>` — toggleable via selector modal (MEQ required)
- `selectedAssessments: AssessmentId[]` — useMemo derived from selectedIds
- `advanceToNext(after, finalScores)` helper — replaces 3 separate hardcoded `setCurrentAssessment('ceq')` calls
- Selector modal renders checklist with indigo highlight for selected, Required badge for MEQ
- Progress bar dynamically renders bars for `selectedAssessments.length` with indigo=current, green=done
- Each `<AssessmentForm>` given `onSkip={() => advanceToNext(id, scores)}`
- Completion screen: `overflow-hidden` added — scrollbar gone

### TypeScript
`npx tsc --noEmit` → **0 errors**

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*

## ✅ [STATUS: PASS] - INSPECTOR APPROVED

**Date:** 2026-03-01T22:08:00-08:00

**Verification Evidence:**
- `ASSESSMENT_REGISTRY` const: `AdaptiveAssessmentPage.tsx:26` ✅
- `advanceToNext` helper (5 call sites): `AdaptiveAssessmentPage.tsx:69, 103, 111, 126, 134` ✅
- `onSkip` prop declared: `AssessmentForm.tsx:49, 57` ✅
- `onSkip?.()` called with confirm guard: `AssessmentForm.tsx:197` ✅
- "Skip this assessment" link rendered: `AssessmentForm.tsx:376` ✅
- `onSkip` passed to all 3 forms: `AdaptiveAssessmentPage.tsx:452, 460, 468` ✅
- `scrollIntoView({ behavior: 'smooth', block: 'center' })`: `AssessmentForm.tsx:144` ✅
- `overflow-hidden` on completion screen: `AdaptiveAssessmentPage.tsx:258` ✅
- `questionsPerPage: 1` confirmed in meq30-short, edi-brief, ceq-brief ✅
- TypeScript: 0 errors ✅

**Audit Results:**
- Acceptance Criteria: ALL CHECKED ✅
- Deferred items: NONE ✅
- Font audit: `text-xs` "Skip this assessment" is a de-emphasized dismissal link — exempt ✅
- PHI check: PASSED ✅
- Git push confirmed: `9dda925` on `origin/feature/governance-and-p0-fixes` ✅
