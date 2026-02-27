---
id: WO-514
title: "My Protocols — Fix Hardcoded Fake Data"
status: 03_BUILD
owner: BUILDER
priority: P0
failure_count: 0
created: 2026-02-27
reporter: USER
lead_architect: LEAD
---

## User Request (verbatim)

> "My Protocols shows fake data"

## Problem Statement

The `My Protocols` page (`src/pages/MyProtocols.tsx`) queries `log_clinical_records` but hardcodes the following values in the `formattedData` map, regardless of what is actually in the database:

- `session_number: 1` — always hardcoded
- `dosage_mg: 25` — always hardcoded
- `dosage_unit: 'mg'` — always hardcoded
- `status: 'Completed'` — always hardcoded
- `indication_name: 'Research'` — always hardcoded
- `patient_sex: 'Unknown'` — always hardcoded

This means the table always shows `25 mg`, `Completed`, `Session 1`, and `Research` for every row regardless of real data. The `substance_name` and `session_date` are correctly pulled from the DB.

## Acceptance Criteria

1. **No hardcoded data** in the display table. Every field shown must come from the database or be omitted if unavailable.
2. The query must be updated to JOIN or SELECT the real columns available on `log_clinical_records`:
   - `substance_id` → `ref_substances(substance_name)` ✅ (already done)
   - `session_date` ✅ (already done)
   - `patient_link_code` ✅ (already done)
   - `session_type_id` → to derive a real status label (e.g., map to `ref_session_types`)
3. **Remove** the `dosage_mg` and `dosage_unit` columns from the table entirely — dosage data lives in a separate dosing protocol form and is NOT reliably available on `log_clinical_records`. Showing `25 mg` is actively misleading/incorrect.
4. **Remove** the hardcoded `status: 'Completed'` — replace with a real status derived from `session_type_id` using a simple label map (`1 → Preparation`, `2 → Dosing`, `3 → Integration`), or show "In Progress" as default.
5. The table headers and `SortField` type must be updated to reflect the removed columns.
6. The `SortableHeader` for `dosage_mg` must be removed.
7. Empty state (zero records) must still render correctly.

## Files in Scope

- `src/pages/MyProtocols.tsx` — **only this file**

## Out of Scope

- Do NOT change the database schema.
- Do NOT modify any other page or component.
- Do NOT add new columns that do not exist in `log_clinical_records`.

---

## LEAD ARCHITECTURE

### Approach A — Client-Side Label Map (Selected ✅)

Add `session_type_id` to the Supabase `SELECT` query. Map it to a human-readable label using a small client-side const object — no extra DB join needed, no new query. The `ref_session_types` IDs are stable documented constants (`1=Preparation, 2=Dosing, 3=Integration`).

**Pros:** Single query, zero new DB round-trips, zero risk of FK error.
**Cons:** If a new session type is added to the DB in the future, the label map would need updating — acceptable risk, easily resolved with a future ticket.

### Approach B — JOIN ref_session_types

Add `ref_session_types(session_type_name)` to the SELECT using Supabase's PostgREST join syntax. Pull `session_type_name` directly from the reference table.

**Pros:** Always reflects the DB truth, no client-side mapping.
**Cons:** Adds an extra JOIN to an already-simple query. If `session_type_id` is null on old rows (possible for stubs created before the FK was added in migration 067), the join silently returns null and you need a null guard anyway — no material advantage.

**Decision: Approach A selected.** Simpler, safer for null rows, fewer moving parts for a P0 hotfix.

---

### BUILDER Instructions — Exact Changes Required

**File: `src/pages/MyProtocols.tsx` ONLY.**

#### 1. Add session type label map (above the component, after imports)
```ts
const SESSION_TYPE_LABELS: Record<number, string> = {
  1: 'Preparation',
  2: 'Dosing',
  3: 'Integration',
};
```

#### 2. Update the `Protocol` interface — remove fake fields, add real ones
Remove: `session_number`, `dosage_mg`, `dosage_unit`, `indication_name`, `patient_sex`
Add: `session_type_id: number | null`, `status: string`
Keep: `id`, `subject_id`, `substance_name`, `session_date`, `submitted_at`

#### 3. Update the Supabase SELECT to include `session_type_id`
```ts
.select(`
  id,
  patient_link_code,
  session_date,
  session_type_id,
  ref_substances (substance_name)
`)
```

#### 4. Update `formattedData` map — remove all hardcoded values
```ts
const formattedData = data?.map((record: any) => ({
  id: record.id,
  subject_id: record.patient_link_code || 'Unknown',
  substance_name: record.ref_substances?.substance_name || 'Unknown',
  session_date: record.session_date || '—',
  submitted_at: record.created_at ?? null,
  session_type_id: record.session_type_id ?? null,
  status: SESSION_TYPE_LABELS[record.session_type_id] ?? 'In Progress',
})) || [];
```

#### 5. Update `SortField` type — remove `dosage_mg`
```ts
type SortField = 'subject_id' | 'substance_name' | 'session_date' | 'status';
```

#### 6. Remove dosage sort guard from `filteredProtocols` useMemo
Delete the `if (sortField === 'dosage_mg')` block (lines 94–97).

#### 7. Update the table — remove Dosage column header and Dosage cell
- Remove: `<SortableHeader field="dosage_mg" label="Dosage" />`
- Remove: the `<td>` that renders `{p.dosage_mg} {p.dosage_unit}`

#### 8. Update the Protocol Reference cell — remove `• Session {p.session_number}`
The subtitle span currently reads `{p.subject_id} • Session {p.session_number}`.
Change to: `{p.subject_id}`

#### 9. Status dot color — update condition to use real values
The dot and text currently check `p.status === 'Completed'`.
Change to: check `p.status === 'Integration'` for green (integration phase = complete-ish), else `text-primary` blue for active states.

#### 10. Update default `sortField` from `'subject_id'` to `'session_date'`
Most recent sessions should sort to the top by default.

#### 11. Remove unused imports
Remove `Activity`, `Info` from the lucide-react import if not used elsewhere in the file.

---

### Files BUILDER Must Touch
- `src/pages/MyProtocols.tsx` — **one file only**

### Files BUILDER Must NOT Touch
- Any other file in `src/`
- Any migration or SQL file
- `agent.yaml`, `FREEZE.md`, `.agent/`

