---
id: WO-555
title: "Schema Audit: Resolve Patient Select Modal Column Mismatch"
status: 00_INBOX
owner: INSPECTOR
created: 2026-03-01T17:07:00-08:00
failure_count: 0
priority: P0 — BLOCKS TESTING
authored_by: LEAD
parent_ticket: WO-546
build_order: URGENT
---

## Context

The "Select Patient → Existing Patient" modal is broken in production with a **400 Bad Request** from Supabase:

```
{"code": "42703", "details": null, "hint": null, "message": "column log_clinical_records.patient_link_code does not exist"}
```

BUILDER attempted two fixes in sequence:
1. Removed the `ref_substances(substance_name)` PostgREST join (suspected cause) — did not fix.
2. Replaced `patient_link_code_hash` → `patient_link_code` in `useActiveSessions.ts` — same 400 error, wrong column name.

The **live Supabase schema** does not contain either `patient_link_code` or `patient_link_code_hash` on `log_clinical_records`. The correct column name is unknown.

The user also ran a **10+ minute live dosing session** prior to this session. We need to verify:
1. Whether that session row exists in `log_clinical_records`
2. What the real patient identifier column is named

---

## Inspector Task

**Step 1 — Introspect the live schema.**

Run the following in the Supabase SQL Editor (Dashboard → SQL Editor):

```sql
-- Get all columns on log_clinical_records
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'log_clinical_records'
ORDER BY ordinal_position;
```

Return the **full column list** so BUILDER can update all queries.

---

**Step 2 — Check if the dosing session was saved.**

```sql
-- Show the 10 most recent rows — confirms if the live session persisted
SELECT id, patient_link_code, session_date, session_type, created_at
FROM public.log_clinical_records
ORDER BY created_at DESC
LIMIT 10;
```

> ⚠️ Note: `patient_link_code` may be the wrong column name — use
> the result from Step 1 to correct the SELECT if needed.

---

**Step 3 — Report what BUILDER must fix.**

Based on the schema introspection, provide:

1. The correct column name for the anonymous patient identifier (the field used instead of `patient_link_code`)
2. Confirmation of whether the dosing session from today persists in the DB
3. Any other column mismatches you observe between the schema and what the frontend queries

---

## Files BUILDER Will Patch After Inspector Responds

- `src/components/wellness-journey/PatientSelectModal.tsx` (line ~118 — select query)
- `src/hooks/useActiveSessions.ts` (line ~43 — select + filter)
- `src/components/charts/FunnelChart.tsx` (line ~56 — select)
- `src/services/clinicalLog.ts` (line ~147 — insert)
- `src/services/insightEngine.ts` (multiple lines)

---

## Acceptance Criteria

- [ ] Inspector provides the full column list for `log_clinical_records`
- [ ] Inspector confirms the correct patient identifier column name
- [ ] Inspector confirms whether the 10+ minute dosing session exists in the DB
- [ ] BUILDER patches all affected queries once column name is confirmed
- [ ] "Select Patient → Existing Patient" modal loads without error
- [ ] Patient IDs appear in the list

---

## INSPECTOR RESPONSE

*(Inspector to fill in this section with schema output and findings)*

```
[PASTE SQL RESULTS HERE]
```

**Correct patient identifier column name:** `_______________`

**Dosing session saved?** YES / NO

**Other mismatches found:**

---

## BUILDER IMPLEMENTATION

*(To be filled after Inspector responds)*
