---
id: WO-661
title: "Migrate StructuredSafetyCheckForm hardcoded arrays to live ref_clinical_observations fetch"
owner: BUILDER
authored_by: BUILDER
routed_by: LEAD
status: 00_INBOX
priority: P1
created: 2026-03-23
routed_at: ""
active_sprint: false
depends_on: "none"
skip_approved_by: ""
stage_waived_by: ""
hold_reason: ""
held_at: ""
failure_count: 0
completed_at: ""
builder_notes: ""
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
  - ".agent/skills/frontend-surgical-standards/SKILL.md"
database_changes: no
files:
  - src/components/arc-of-care-forms/ongoing-safety/StructuredSafetyCheckForm.tsx
affects:
  - src/components/arc-of-care-forms/ongoing-safety/StructuredSafetyCheckForm.tsx
admin_visibility: no
admin_section: "N/A"
growth_order_ref: ""
---

## Context

`StructuredSafetyCheckForm.tsx` contains two hardcoded constant arrays that duplicate
data from the `ref_clinical_observations` table:

```tsx
// VIOLATION — hardcoded IDs that assume specific DB primary key values
const SAFETY_CONCERNS = [
  { id: 4, name: 'Medication non-compliance', severity: 'moderate' },
  { id: 5, name: 'Social isolation increase', severity: 'moderate' },
  // ... 6 more
];

const SAFETY_ACTIONS = [
  { id: 6, name: 'Hospitalization recommended', urgency: 'immediate' },
  // ... 6 more
];
```

**The risk:** These hardcoded integer IDs assume exact primary key values in
`ref_clinical_observations`. If any row is ever inserted, deleted, or the table is
rebuilt, the IDs silently point to the wrong observation — with no error thrown
and no visual indicator. This violates the DB-as-single-source-of-truth rule
codified in `frontend-best-practices/SKILL.md` Section 6.

Identified during the Interaction Checker hardcoded-data audit (2026-03-23).

---

## Acceptance Criteria

- [ ] `SAFETY_CONCERNS` constant removed — data fetched from `ref_clinical_observations` filtered by `category = 'clinical_flag'`
- [ ] `SAFETY_ACTIONS` constant removed — data fetched from `ref_clinical_observations` filtered by `category = 'clinical_action'` (confirm category value against live schema)
- [ ] Fetched data ordered by `sort_order` ASC to preserve clinical priority ordering
- [ ] `severity` and `urgency` display labels derived from a DB column (confirm which column stores this) — not re-hardcoded on the frontend
- [ ] Loading state shown while fetch is pending (form fields disabled or skeleton shown)
- [ ] Error state handled gracefully — if fetch fails, display an inline error and prevent form submission
- [ ] IDs used for `safety_concern_ids` and `action_taken_ids` in `StructuredSafetyCheckData` are the live DB `id` values from the fetch result — no assumed integers
- [ ] Dead import of `InteractionChecker` from `../../clinical/InteractionChecker` removed (it is never rendered — confirmed in hardcoded-data audit)
- [ ] `npm run build` clean — no TypeScript errors
- [ ] INSPECTOR browser test: form renders, safety concerns and actions display, selections save correctly

---

## Pre-Build Required

BUILDER must run the following SQL to confirm category values and column names before
writing any code:

```sql
SELECT id, name, category, sort_order
FROM ref_clinical_observations
ORDER BY category, sort_order
LIMIT 30;
```

Confirm:
1. What `category` values correspond to safety concerns vs. safety actions
2. What column stores `severity` (critical/high/moderate) and `urgency` (immediate/urgent)

---

## Files to Modify

| File | Action |
|---|---|
| `src/components/arc-of-care-forms/ongoing-safety/StructuredSafetyCheckForm.tsx` | MODIFY — replace `SAFETY_CONCERNS` and `SAFETY_ACTIONS` with live fetch from `ref_clinical_observations`; remove dead `InteractionChecker` import |

---

## Constraints

- No schema changes — `ref_clinical_observations` already exists and has the data
- Surgical only — do not refactor anything outside the hardcoded arrays and dead import
- The `StructuredSafetyCheckData` interface shape must stay compatible with all call sites
- Loading/error states must match PPN design system (no custom spinners)

---

## LEAD Architecture

**Routing Decision:** Standard frontend surgical fix. Single file. No DB migrations.
Fast-path to 04_BUILD after LEAD confirms `ref_clinical_observations` category values
match expectations via the pre-build SQL above.
