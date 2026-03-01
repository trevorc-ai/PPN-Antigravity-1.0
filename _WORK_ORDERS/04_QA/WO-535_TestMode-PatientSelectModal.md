---
id: WO-535
title: "TEST Mode — Practice Session + Onboarding X Button"
owner: BUILDER
status: 03_BUILD
authored_by: LEAD
priority: P1
created: 2026-03-01
failure_count: 0
related: WO-500
tags: [test-mode, patient-select-modal, onboarding, ux, no-db-write]
---

# WO-535: TEST Mode — Practice Session + Onboarding X Button

## Summary

Two small, self-contained UX additions:

1. **TEST Mode button** — a third card in `PatientSelectModal` (choose view) that launches a fully functional Wellness Journey session using a synthetic `TEST-[timestamp]` patient ID. No data is written to Supabase. A persistent amber `TEST MODE` badge appears in the Patient Context Bar throughout the session.
2. **Onboarding X button** — add a standard top-right × close button to `ArcOfCareOnboarding.tsx` for UI consistency with all other modals in the app.

---

## Problem Statement

Practitioners (and partners evaluating the platform) have no way to explore or practice the Wellness Journey without creating a real patient record. There is also no visual close affordance (X button) on the onboarding modal — inconsistent with every other modal in the app.

---

## Acceptance Criteria

### 1. TEST Mode Button in PatientSelectModal

- [ ] A third card labeled **"Practice Session"** (or "Test Mode") is added below the "Existing Patient" card in the `choose` view of `PatientSelectModal.tsx`
- [ ] Card is visually distinct — amber/yellow color scheme (`amber-500` family), with a `FlaskConical` or `TestTube` icon from lucide-react
- [ ] Card copy: title = `"Practice Session"`, subtitle = `"Explore the Wellness Journey without creating a real patient record"`, ID preview = `→ TEST-XXXXXXXXXX` (computed at render, not on click)
- [ ] On click: calls `onSelect(testPatientId, true, 'Preparation')` where `testPatientId = generateTestPatientId()`
- [ ] `generateTestPatientId()` is a local helper in `PatientSelectModal.tsx`: returns `"TEST-" + Date.now().toString(36).toUpperCase()` (e.g. `TEST-LQKM7A2P`)
- [ ] **No DB writes**: In `WellnessJourney.tsx`, `handlePatientSelect` must detect when `patientId.startsWith('TEST-')` and skip the `createClinicalSession()` call entirely — use `crypto.randomUUID()` as the local-only `sessionId` instead
- [ ] **No toast for new patient**: The "New Patient Created" toast should be suppressed for TEST sessions; replace with: `title: '🧪 Practice Mode Active'`, `message: 'No data will be saved. Explore freely.'`, `type: 'info'`
- [ ] **ProtocolConfiguratorModal is still shown** for TEST sessions (the practitioner should still be able to configure demographics/substance for a realistic practice run — data just won't persist to DB)

### 2. TEST MODE Banner in WellnessJourney.tsx

- [ ] When `journey.patientId.startsWith('TEST-')`, render a persistent amber pill badge in the **Patient Context Bar** (the `flex` row at line ~695 of `WellnessJourney.tsx`)
- [ ] Badge content: `🧪 TEST MODE` — amber text on amber/10 background, amber border
- [ ] Badge placement: immediately after the patient ID `<span>` (before the Age/Gender/Weight pills)
- [ ] Badge must be visible at all times during the session — it is the primary visual signal to the practitioner that no real data is being saved
- [ ] Badge styling: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-xs font-black text-amber-400 tracking-wide uppercase animate-pulse` — the `animate-pulse` should run only on mount for ~3s then stop (use a `useEffect` + `setTimeout` to add/remove a CSS class, or simply remove `animate-pulse` after first render)

### 3. X Close Button on ArcOfCareOnboarding.tsx

- [ ] Add a standard top-right `X` button to `ArcOfCareOnboarding.tsx` inside the modal card, positioned `absolute top-3 right-3`
- [ ] Uses `X` icon from lucide-react (already imported in the app)
- [ ] Calls `handleClose()` on click
- [ ] `aria-label="Close"`, styled consistently with other modal close buttons: `p-2 rounded-lg text-slate-500 hover:text-[#A8B5D1] hover:bg-slate-800 transition-all`
- [ ] The existing "Back to Dashboard" strip at the top is retained — the X is an additional affordance for desktop users

---

## Files to Edit

| File | Change |
|---|---|
| `src/components/wellness-journey/PatientSelectModal.tsx` | Add `generateTestPatientId()` helper + TEST mode card in choose view |
| `src/pages/WellnessJourney.tsx` | Skip `createClinicalSession()` for TEST IDs; swap toast; add TEST MODE badge |
| `src/components/arc-of-care/ArcOfCareOnboarding.tsx` | Add X close button top-right |

---

## Out of Scope

- Writing TEST session data to any DB table (ever)
- A "clear TEST data" admin tool
- Role-based access control for TEST mode
- Any changes to FREEZE.md protected files

---

## QA Verification Steps

1. Open Wellness Journey → "Practice Session" card is visible as a 3rd option
2. Click "Practice Session" → Protocol Configurator appears → configure and confirm
3. Verify Patient Context Bar shows `🧪 TEST MODE` badge with amber styling
4. Complete one form (e.g. Mental Health Screening) → Save → check Supabase: zero new rows in `log_clinical_records`, `log_patient_intake`, or `log_session_vitals`
5. Patient ID in the context bar reads `TEST-XXXXXXXXXX` format
6. Open Wellness Journey fresh → confirm onboarding modal has an X button top-right
7. Click X → modal closes, "Don't show me again" checkbox state is respected

---

## PRODDY Sign-Off Checklist

- [x] Problem is clear, no solution bias in problem statement
- [x] Acceptance criteria are observable and testable
- [x] Out of Scope is populated
- [x] Files to edit are named specifically
- [x] Zero PHI / zero DB writes for TEST mode — compliant with ZERO PHI rule
- [x] No frozen files touched (PatientSelectModal, WellnessJourney main body, ArcOfCareOnboarding are all unfrozen)
