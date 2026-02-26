---
status: 03_BUILD
owner: BUILDER
failure_count: 0
created: 2026-02-25
priority: P0
---

# WO-430: Data Hydration Sprint — Patient & Session Connectivity

## Problem Statement
All Phase 2 Wellness Journey components are built but not connected to live data.
Practitioners see stale/demo data across sessions. App is not pilot-ready.

## Issues Found (QA — 2026-02-25)

### BUG-1: No localStorage clear on patient switch
- When selecting a new/existing patient, `ppn_dosing_protocol` and
  `mock_patient_medications_names` from the PREVIOUS session persist
- Causes: stale substance preloading, wrong meds in engine, wrong HUD data
- Fix: `handlePatientSelect` must clear these keys before setting journey state

### BUG-2: Patient medications never loaded from Supabase  
- `mock_patient_medications_names` in localStorage is never populated from DB
- Engine and display both fall back to hardcoded Lithium/Sertraline/Lisinopril
- Fix: After patient select, query `log_patient_intake` or `log_clinical_records`
  for this patient's medication list and write to localStorage

### BUG-3: DosingProtocolForm initialData not rehydrated on Amend
- When practitioner opens the Dosing Protocol form a second time (Amend),
  `initialData={}` — all previously entered fields are blank
- Root cause: `WellnessJourney.tsx` passes no `initialData` to the form
- Fix: Read `ppn_dosing_protocol` from localStorage in `WellnessJourney.tsx`
  and pass as `initialData` when form is `dosing-protocol`

### BUG-4: Contraindication check fires on second dose only
- Related to BUG-3: after first save, re-opening form doesn't pre-populate,
  so substance is blank → engine gets no substance → ALL CLEAR on re-open

## Implementation Notes (BUILDER)

### Fix 1 — Clear localStorage on patient select (WellnessJourney.tsx)
```typescript
// In handlePatientSelect, before setJourney:
const SESSION_KEYS = ['ppn_dosing_protocol', 'mock_patient_medications_names'];
SESSION_KEYS.forEach(k => localStorage.removeItem(k));
```

### Fix 2 — Load patient medications from Supabase (WellnessJourney.tsx)
After creating a clinical session for the patient, query their most recent
`log_patient_intake` for medication_ids, resolve names from `ref_medications`,
and write to `mock_patient_medications_names`:
```typescript
// After handlePatientSelect resolves patientId:
const { data: medsData } = await supabase
  .from('log_patient_intake')
  .select('medication_ids')
  .eq('patient_link_code', patientId)
  .order('created_at', { ascending: false })
  .limit(1)
  .maybeSingle();
// Then resolve names and write to localStorage
```

### Fix 3 — Rehydrate DosingProtocolForm from localStorage
In the SlideOut form render in `WellnessJourney.tsx`, for `dosing-protocol`:
```typescript
const dosingInitialData = (() => {
  try {
    const raw = localStorage.getItem('ppn_dosing_protocol');
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {};
})();
// Pass as initialData to DosingProtocolForm
```

## Acceptance Criteria
- [ ] Selecting existing patient clears previous patient's localStorage keys
- [ ] Patient medications load from Supabase and display correctly  
- [ ] DosingProtocolForm pre-populates on Amend with previously entered values
- [ ] Contraindication engine fires on FIRST substance selection (not second)
- [ ] Substance HUD shows correct substance after first save
