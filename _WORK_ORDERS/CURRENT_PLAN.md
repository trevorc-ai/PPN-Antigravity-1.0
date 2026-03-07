# 🩺 CURRENT PLAN: WO-557 — Phase 1 Preparation Bugs + Tooltip Audit

**Routed by:** LEAD | **Date:** 2026-03-06 | **Status:** 03_BUILD

---

## I. SCOPE SUMMARY

WO-557 has 3 sub-tasks:
- **Sub-Task A:** `/create_tooltips` workflow — audit all `?` triggers in Phase 1 and reimplement with `AdvancedTooltip`
- **Sub-Task B:** 5 hard bug fixes in the primary clinical workflow
- **Sub-Task C:** 2 label/copy changes

LEAD Note: After deep inspection of all targeted files, the status of each bug has been re-evaluated. Some are already fixed. See details below.

---

## II. SUB-TASK A: TOOLTIP AUDIT

> **Executor:** Run `/create_tooltips` workflow before touching any other code.

| Trigger | File + Location | Status | Required `side` |
|---------|----------------|--------|-----------------|
| C-SSRS Score `?` | `BaselineAssessmentWizard.tsx` — C-SSRS score section | ❌ Missing | `side="bottom"` |
| Safety Concerns `?` | `BaselineAssessmentWizard.tsx` — safety concerns row | ❌ Missing | Audit position |
| Actions `?` | `BaselineAssessmentWizard.tsx` — actions row | ❌ Missing | Audit position |
| Concomitant Medications `?` | Line 418: `CONCOMITANT MEDICATIONS ⓘ` | ⚠️ Bare `ⓘ`, no `AdvancedTooltip` wrapper | Audit position |
| Clinical Observations `?` | `SetAndSettingForm.tsx` line 175: `<Info>` → `AdvancedTooltip` | ✅ Already wired | — |
| Any other `?` triggers | Full Phase 1 audit | ❌ Audit all | — |

**Standard:** All tooltips must use `AdvancedTooltip` from `src/components/ui/AdvancedTooltip.tsx`.

---

## III. SUB-TASK B: BUG FIXES

### BUG-1: "Change" creates NEW patient instead of editing existing
**Root:** `ProtocolConfiguratorModal.tsx` — `handleSave()` (line 190) always calls `onIntakeComplete` as a new intake, never UPDATEs the existing `journey.demographics`. Parent `WellnessJourney.tsx` does not distinguish between "new" and "change" mode.

**Fix:**
- In `WellnessJourney.tsx` (line ~665): when `ProtocolConfiguratorModal` is opened via a **Change** button on an existing session, pass an `isEditMode={true}` prop.
- In `ProtocolConfiguratorModal.tsx`: accept `isEditMode?: boolean` and `initialIntake?: PatientIntakeData` props. Pre-populate `condition`, `age`, `weight`, `gender`, `smoking` state from `initialIntake` when `isEditMode` is true. The `handleSave()` path remains the same — the parent already stores the data in `journey.demographics`.

**Files:**
- `src/components/wellness-journey/ProtocolConfiguratorModal.tsx` — add `isEditMode`, `initialIntake` props; pre-seed state
- `src/pages/WellnessJourney.tsx` — pass existing demographics when opening via Change button

---

### BUG-2: Submitting MEQ-30 returns to Step 1 and shows Consent Form
**Root:** In `WellnessFormRouter.tsx` line 487:
```
onBack={onClose ?? onComplete}
```
The MEQ-30 form is accessed from Phase 3 Integration, but `onBack` falls through to `onComplete`, which closes the panel and triggers the parent to re-open Phase 1 Step 1 in some code paths.

**Fix:** `WellnessFormRouter.tsx` line 487 — set `onBack` to a safe no-op or `onClose` only:
```tsx
// BEFORE:
return <MEQ30QuestionnaireForm onSave={handleMEQ30Save} onComplete={onComplete} onBack={onClose ?? onComplete} onExit={onExit ?? onClose ?? onComplete} />;

// AFTER:
return <MEQ30QuestionnaireForm onSave={handleMEQ30Save} onComplete={onComplete} onBack={onClose} onExit={onExit ?? onClose ?? onComplete} />;
```
**File:** `src/components/wellness-journey/WellnessFormRouter.tsx`, line 487

---

### BUG-3: Consent form freeze — nothing saved, must close with X
**Root:** `ConsentForm.tsx` `handleSave()` (line 101) `await`s `onSave()` which calls `createConsent()` — if the DB call fails silently or `siteId` is null at the time of submission, the form enters a loading state and never resolves. The `hasSavedRef` prevents retry.

**Fix:**
- In `WellnessFormRouter.tsx` `handleConsentSave` (line 170): ensure `siteId` is always resolved before passing to `ConsentForm`. Add a guard: if `resolvedSiteId` is null, show an error toast and return `false` immediately — do NOT let the form hang.
- In `ConsentForm.tsx` `handleSaveAndContinue` (line 139): if `onSave` returns `false`, reset `hasSavedRef.current = false` and clear the saving state so the user can retry.

**Files:**
- `src/components/wellness-journey/WellnessFormRouter.tsx` — `handleConsentSave`, ensure no silent null path
- `src/components/arc-of-care-forms/phase-1-preparation/ConsentForm.tsx` — `handleSaveAndContinue`, reset ref on failure

---

### BUG-4: Amend from Safety Check shows no previous entries
**Root:** `WellnessFormRouter.tsx` line 398–421: Safety Check re-hydration from `localStorage` IS wired (`safetyKey`, `safetyInitial`). However `StructuredSafetyCheckForm` must accept and use `initialData` prop to pre-populate its internal state.

**Fix:**
- Audit `StructuredSafetyCheckForm.tsx` — confirm it accepts `initialData?: Partial<StructuredSafetyCheckData>` and seeds its `useState` from it. If NOT, add the seed:
```tsx
const [formData, setFormData] = useState<StructuredSafetyCheckData>(
    initialData ? { ...DEFAULT_DATA, ...initialData } : DEFAULT_DATA
);
```

**File:** `src/components/arc-of-care-forms/ongoing-safety/StructuredSafetyCheckForm.tsx`

---

### BUG-5: "Save and Continue" at Set & Setting does not auto-advance — ✅ ALREADY FIXED
`SetAndSettingForm.tsx` line 115–124: `handleSaveAndContinue` correctly calls `onComplete?.()` after 500ms. **No action needed.** Mark as verified.

---

## IV. SUB-TASK C: COPY / LABEL CHANGES

| # | File | Line | Current | Change To |
|---|------|------|---------|-----------|
| 1 | `BaselineAssessmentWizard.tsx` | 418 | `CONCOMITANT MEDICATIONS ⓘ` | `ADDITIONAL MEDICATIONS ⓘ` |
| 2 | `BaselineAssessmentWizard.tsx` | aria-label 426 | `"Toggle concomitant medications"` | `"Toggle additional medications"` |
| 3 | `BaselineAssessmentWizard.tsx` | aria-label 446 | `"Add concomitant medication"` | `"Add additional medication"` |
| 4 | `SetAndSettingForm.tsx` | 136 | `Treatment Expectancy` (section `<h3>`) | `Patient Treatment Expectancy` |

---

## V. EXECUTION ORDER

1. Run `/create_tooltips` workflow — Sub-Task A
2. Fix BUG-1 (Change patient) — `ProtocolConfiguratorModal.tsx` + `WellnessJourney.tsx`
3. Fix BUG-2 (MEQ-30 back) — `WellnessFormRouter.tsx` line 487
4. Fix BUG-3 (Consent freeze) — `ConsentForm.tsx` + `WellnessFormRouter.tsx`
5. Fix BUG-4 (Amend empty) — `StructuredSafetyCheckForm.tsx`
6. Apply Sub-Task C label changes — `BaselineAssessmentWizard.tsx` + `SetAndSettingForm.tsx`

---

## VI. VERIFICATION CHECKLIST

- [ ] All Phase 1 `?` triggers open correct `AdvancedTooltip` dialogs
- [ ] Tooltips open toward center, not clipped by edges
- [ ] "Change" patient edits demographics in place — does NOT create a new patient ID
- [ ] MEQ-30 submit returns to Integration Phase — does NOT show Consent Form
- [ ] Consent form saves successfully — "Save & Continue" advances to Step 2
- [ ] "Amend" Safety Check pre-fills with previous entries
- [ ] Labels read "Additional Medications" (not "Concomitant") throughout
- [ ] Section header reads "Patient Treatment Expectancy"
- [ ] BUG-5 confirmed fixed (no regression)
