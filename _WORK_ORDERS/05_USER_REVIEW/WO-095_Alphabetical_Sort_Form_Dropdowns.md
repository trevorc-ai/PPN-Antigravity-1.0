---
id: WO-095
status: 03_BUILD
priority: P3 (Normal)
category: Polish
audience: Provider-Facing
owner: INSPECTOR
failure_count: 0
---

# Alphabetical Sort on All Form Dropdowns & Select Fields

## User Request (verbatim)

> "We need to set all front facing ref tables to display sort alphabetically"
> Scope clarification: "Dropdown & select fields in forms... Substance page cards can stay as-is."
> Additional: "Interaction checker" (include its dropdowns too)

---

## Audit Findings (Pre-Ticket Research by CUE)

### ✅ Already Sorted (No Action Needed)

These queries already have `.order()` in place:

| File | Table | Sort Field |
|---|---|---|
| `useReferenceData.ts` | `ref_substances` | `substance_name` |
| `useReferenceData.ts` | `ref_routes` | `route_name` |
| `useReferenceData.ts` | `ref_indications` | `indication_name` |
| `useReferenceData.ts` | `ref_support_modality` | `modality_name` |
| `useReferenceData.ts` | `ref_smoking_status` | `status_name` |
| `useReferenceData.ts` | `ref_severity_grade` | `grade_value` |
| `useReferenceData.ts` | `ref_safety_events` | `event_name` |
| `useReferenceData.ts` | `ref_resolution_status` | `status_name` |
| `useReferenceData.ts` | `ref_dosage_units` | `unit_label` |
| `useReferenceData.ts` | `ref_dosage_frequency` | `frequency_label` |
| `useReferenceData.ts` | `ref_sex` | `sex_label` |
| `useReferenceData.ts` | `ref_weight_ranges` | `sort_order` |
| `useReferenceData.ts` | `ref_settings` | `setting_label` |
| `Tab3_ProtocolDetails.tsx` | `ref_indications`, `ref_substances`, `ref_routes` | ✅ |
| `PatientLookupModal.tsx` | `ref_indications`, `ref_substances` | ✅ |
| `GlobalFilterBar.tsx` | `ref_substances`, `ref_routes`, `ref_support_modality` | ✅ |
| `ObservationSelector.tsx` | `ref_clinical_observations` | `observation_text` ✅ |
| `Tab2_Medications.tsx` | `ref_medications` | `is_common DESC, medication_name` ✅ |
| `DosageCalculator.tsx` | `ref_substances` | `substance_name` ✅ |

---

### ❌ Needs Fix — 2 Items

#### Fix 1: `InteractionChecker.tsx` — Hardcoded Arrays Not Sorted

**File:** `src/pages/InteractionChecker.tsx`  
**Problem:** Both dropdowns use hardcoded constants from `src/constants.ts`:
- `PSYCHEDELICS` array (line 8) — rendered as Primary Agent dropdown
- `MEDICATIONS_LIST` array (line 222) — rendered as Secondary Agent dropdown

These are **not fetched from a ref table**, so `.order()` doesn't apply. Fix is to sort the arrays alphabetically at the point of render.

**Fix:** Add `.slice().sort()` at the render site (non-destructive):
```tsx
// Line 197 — Primary Agent dropdown
{[...PSYCHEDELICS].sort().map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}

// Line 222 — Secondary Agent dropdown  
{[...MEDICATIONS_LIST].sort().map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
```

#### Fix 2: `ClinicalInsightsPanel.tsx` — Verify Sort Status

**File:** `src/components/ProtocolBuilder/ClinicalInsightsPanel.tsx`  
**Problem:** File queries ref tables but sort status not confirmed in audit.  
**Action:** BUILDER to inspect and add `.order()` if missing.

---

## Acceptance Criteria

- [ ] `InteractionChecker.tsx` Primary Agent dropdown sorted A→Z
- [ ] `InteractionChecker.tsx` Secondary Agent dropdown sorted A→Z
- [ ] `ClinicalInsightsPanel.tsx` ref table queries verified/fixed
- [ ] No existing `.order()` calls removed or changed
- [ ] No visual regressions on any form

## Technical Notes

- Use `.slice().sort()` (not `.sort()` directly) to avoid mutating the original constant array
- For Supabase queries: `.order('column_name', { ascending: true })` — `ascending: true` is the default so can be omitted
- **Do NOT touch** substance page cards, monograph pages, or analytics charts

## Estimated Effort

**Total:** 0.5 days  
- InteractionChecker fix: 15 min  
- ClinicalInsightsPanel audit + fix: 15 min  
- Smoke test all affected forms: 30 min

## Files to Touch

1. `src/pages/InteractionChecker.tsx` — lines 197, 222
2. `src/components/ProtocolBuilder/ClinicalInsightsPanel.tsx` — audit only
