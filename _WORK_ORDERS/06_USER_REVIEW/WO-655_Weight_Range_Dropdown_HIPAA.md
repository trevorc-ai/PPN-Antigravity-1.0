---
id: WO-655
title: "Replace Weight Text Input with ref_weight_ranges Dropdown — HIPAA Safe Harbor Remediation"
owner: BUILDER
authored_by: INSPECTOR
routed_by: LEAD
status: 04_BUILD
priority: P1
created: 2026-03-22
depends_on: none
database_changes: no
admin_visibility: no
parked_context: ""
target_ship: "2026-03-29"
files:
  - src/constants.ts
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
  - ".agent/skills/core-ui-engineering/SKILL.md"
failure_count: 0
builder_notes: ""
---

# WO-655 — Weight Range Dropdown (HIPAA Safe Harbor Remediation)

## Background

The HIPAA Safe Harbor analysis (GO-651 / HIPAA conflict audit 2026-03-22) confirmed that patient
weight must be stored as a range band, not an exact kg value, to maintain Safe Harbor compliance.

Dr. Allen (clinical advisor) confirmed 2026-03-22 that **±5 kg bands are clinically sufficient**
for QTc safety monitoring: *"SD on scales alone, plus hr-hr variability in hydration weight.
Safety is not going to be determined by kg alone."* Range labels include both kg and lbs.

The database FK infrastructure (`log_patient_profiles.weight_range_id → ref_weight_ranges`) and
service-layer resolution (`resolveWeightRangeId()` in `clinicalLog.ts`) are **already implemented**.
This WO is purely a UI change: replace any free-text or numeric weight entry with a dropdown
backed by `ref_weight_ranges`.

---

## Code Audit Findings (INSPECTOR pre-build)

| Location | Current State | Issue |
|---|---|---|
| `src/constants.ts` L568–1138 | Mock patient demographics include exact `weight: N` (integer kg) | Must be replaced with `weight_label: "X–Y kg / A–B lbs"` range strings |
| `src/pages/WellnessJourney.tsx` L582–587 | Reads `kg_low` + `kg_high` and computes midpoint as `weightKg` for display | Display logic acceptable — midpoint used for dosing calculation display only, not storage |
| New patient setup form | **Weight input component not found in codebase** — either not yet built or pending | Must be confirmed by BUILDER. If a numeric weight input exists, replace with dropdown. |
| `src/services/clinicalLog.ts` L1172–1186 | `resolveWeightRangeId(weightKg, weight_label)` — accepts both numeric kg and label string | Already works. No change needed in service layer. |

> **BUILDER: First step is to find the weight input in the new patient setup flow.** Search for any
> `<input type="number"` or `type="text"` near "weight", "kg", or "lbs" context in form components.
> If not found, this WO adds the dropdown to the patient profile/demographics section of the
> new patient setup wizard.

---

## Acceptance Criteria

- [ ] No free-text or `<input type="number">` exists for patient weight anywhere in the app
- [ ] Weight entry is a `<select>` or styled dropdown populated from `ref_weight_ranges`
- [ ] Each option displays the range label (e.g. `"55–60 kg / 121–132 lbs"`) — NOT exact kg
- [ ] Selected value resolves to `weight_range_id` FK before any DB write (via existing `resolveWeightRangeId()` or direct FK ID)
- [ ] `constants.ts` mock patient `weight: N` exact-kg values replaced with `weight_label` range strings matching `ref_weight_ranges` labels
- [ ] `WellnessJourney.tsx` midpoint display (`weightKg` from `kg_low + kg_high / 2`) continues to work — no regression
- [ ] No new `npm` dependencies
- [ ] `npx tsc --noEmit` returns zero errors

---

## Files to Modify

| File | Action |
|---|---|
| New patient setup form / demographics component | **MODIFY or CREATE** — replace numeric weight input with range dropdown |
| `src/constants.ts` | **MODIFY** — replace exact `weight: N` values with `weight_label: "..."` range strings |
| Any component displaying exact weight to practitioners | **MODIFY** — display the range label, not a derived kg number |

> **Do NOT modify:**
> - `src/services/clinicalLog.ts` — service layer already correct
> - `src/pages/WellnessJourney.tsx` — display midpoint is acceptable (not stored)
> - `ref_weight_ranges` table — no schema change (database_changes: no)

---

## Implementation Notes

### Populating the Dropdown

Live `ref_weight_ranges` confirmed: 24 records, `< 40 kg` → `120-125 kg`, `is_active` flag available.
Label format: `"40-45 kg (88-99 lbs)"` (dual-unit, parentheses).

Fetch ranges at component mount:
```ts
const { data: weightRanges } = await supabase
  .from('ref_weight_ranges')
  .select('id, range_label, kg_low, kg_high')
  .eq('is_active', true)
  .order('kg_low', { ascending: true });
```

Render as options:
```tsx
<select value={selectedRangeId} onChange={e => setSelectedRangeId(Number(e.target.value))}>
  <option value="">Select weight range</option>
  {weightRanges?.map(r => (
    <option key={r.id} value={r.id}>{r.range_label}</option>
  ))}
</select>
```

Pass `selectedRangeId` directly as `weight_range_id` — no need to call `resolveWeightRangeId()`
when the UI sends the FK directly. This bypasses the legacy numeric-kg lookup path entirely.

### constants.ts Mock Data

Replace exact-kg mock values with the nearest `ref_weight_ranges` label string. Example:
```ts
// BEFORE
{ weight: 82, ... }

// AFTER — label must match ref_weight_ranges.range_label exactly
{ weight_label: "80-85 kg (176-187 lbs)", ... }
```

BUILDER must confirm exact label strings from the live table before committing.

---

## INSPECTOR QA Checklist

- [ ] Grep confirms zero `weight_kg` text inputs remain in any form component: `grep -rn 'type="number"' src/ | grep -i weight`
- [ ] Dropdown renders in new patient setup — screenshot in PR
- [ ] Existing patient with `weight_range_id` loads and displays correctly
- [ ] `constants.ts` has no bare `weight: [0-9]+` entries remaining
- [ ] No TypeScript errors

---

## LEAD Architecture Note

**Routing:** INSPECTOR pre-build clearance (02.5) → BUILDER → INSPECTOR QA (04_QA)

This is database_changes: **no** — `ref_weight_ranges` exists. RLS is unaffected. Index strategy
unchanged. Fast-pass eligible at 02.5 if LEAD agrees.
