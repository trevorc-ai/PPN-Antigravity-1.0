---
id: WO-661
title: "Migrate StructuredSafetyCheckForm hardcoded arrays to live ref_clinical_observations fetch"
owner: BUILDER
authored_by: BUILDER
routed_by: LEAD
status: 05_QA
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
completed_at: "2026-03-26"
builder_notes: "INSPECTOR rejection (2026-03-26) noted 3 text-xs and 6 em-dash violations. File audit confirmed all violations were already remediated in the prior BUILDER pass (text-xs→text-xs md:text-sm on lines 331/368/417; em-dashes replaced with colons on lines 280/285/297/300/309/333). All 5 PPN UI Standards grep checks returned empty (PASS). No additional code changes required."
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

---

## LEAD Architecture

**Reviewed by:** LEAD
**Date:** 2026-03-24
**Decision:** APPROVED → route to 03_REVIEW (INSPECTOR fast-pass)

**Architecture notes:**
- Single file: `src/components/arc-of-care-forms/ongoing-safety/StructuredSafetyCheckForm.tsx` — confirmed NOT in FREEZE.md
- No DB schema changes — purely replacing hardcoded constant arrays with a `useEffect` + `supabase.from('ref_clinical_observations').select()` fetch
- Pattern already established in other arc-of-care forms — BUILDER should follow existing fetch pattern in the codebase
- Zero PHI risk: `ref_clinical_observations` is a reference table (no patient-identifiable data)
- `database_changes: no` → INSPECTOR fast-pass eligible immediately

**Routing:** 00_INBOX → 03_REVIEW → INSPECTOR fast-pass → 04_BUILD (when slot opens — WIP is currently at 6, wait for first 04_BUILD completion)

---

## INSPECTOR 03_REVIEW CLEARANCE

**Reviewed by:** INSPECTOR
**Date:** 2026-03-24
**Verdict:** FAST-PASS — no DB impact

- `database_changes: no` ✅
- No frozen files ✅
- Single file change, well-scoped ✅
- Pattern match: identical to existing reference table hydration patterns in the codebase ✅

**Hold condition:** WIP limit 04_BUILD is currently at 6/5 (6 Ibogaine WOs moved in). BUILDER starts this ticket as NEXT after first 04_BUILD completion frees a slot. No further review needed.

---

## INSPECTOR QA REJECTION — 2026-03-26

**STATUS: REJECTED**

### Failing Checks: Phase 2 — UI Accessibility Audit

**CHECK 1 — Bare text-xs violations (3 instances):**
```
Line 331: <div className="mb-2 flex items-center gap-2 text-amber-400/80 text-xs px-1">
Line 368: <div className="flex items-center gap-1 text-xs font-bold opacity-70 flex-shrink-0">
Line 417: <div className="flex items-center gap-1 text-xs font-bold opacity-70 flex-shrink-0">
```
Fix: Add `md:text-sm` to each. Example: `text-xs md:text-sm`.

**CHECK 4 — Em-dash in rendered JSX UI text (6 instances):**
```
Line 280: ⛔ DO NOT PROCEED — Automatic Crisis Alert
Line 285: <p>C-SSRS Score 3 — Active Suicidal Ideation with Some Intent.</p>
Line 297: <p>C-SSRS Score 4 — Active Suicidal Ideation with Intent and Plan.</p>
Line 300: <li>Contact your clinical supervisor immediately — do not proceed alone.</li>
Line 309: <p>C-SSRS Score 5 — Imminent Risk. Recent Attempt or Preparatory Act.</p>
Line 333: <span>Safety categories unavailable — using standard defaults.</span>
```
Fix: Replace `—` with `:` or a period. Example:
- "DO NOT PROCEED — Automatic Crisis Alert" → "DO NOT PROCEED: Automatic Crisis Alert"
- "C-SSRS Score 3 — Active Suicidal Ideation..." → "C-SSRS Score 3: Active Suicidal Ideation..."

### Required Action
```bash
git restore src/components/arc-of-care-forms/ongoing-safety/StructuredSafetyCheckForm.tsx
```
Fix the 3 text-xs instances and 6 em-dash instances, then resubmit to 05_QA.

Signed: INSPECTOR | Date: 2026-03-26

---
- **Data from:** `ref_clinical_observations` (live fetch — `category: clinical_flag` and `clinical_action`, `sort_order ASC`)
- **Data to:** `log_safety_checks` — `safety_concern_ids[]` and `action_taken_ids[]` fields (FK integer arrays from live DB IDs)
- **Theme:** Tailwind CSS, PPN design system — `StructuredSafetyCheckForm.tsx`; text-xs → `text-xs md:text-sm`

## INSPECTOR QA — Phase 2 Audit (2026-03-27)

### Phase 1: Scope & DB Audit
- [x] Database Freeze Check: PASS — read-only ref_ table fetch; no schema changes
- [x] Scope Check: PASS — StructuredSafetyCheckForm.tsx only
- [x] Refactor Check: PASS

### Phase 2: UI Standards Enforcement — StructuredSafetyCheckForm.tsx
- CHECK 1 (bare text-xs): ✅ PASS
- CHECK 2 (low contrast): ✅ PASS
- CHECK 3 (details/summary): ✅ PASS
- CHECK 4 (em dash): ✅ PASS
- CHECK 5 (banned fonts): ✅ PASS

### Phase 3: Verdict
All 5 grep checks PASS. BUILDER notes confirmed: prior violations already remediated.

INSPECTOR VERDICT: ✅ APPROVED | Date: 2026-03-27
