---
id: WO-615
title: Protocol Detail Page — dosage Column Crash (code 42703)
owner: BUILDER
authored_by: INSPECTOR
status: 04_QA
priority: P0 — crashes the page for every protocol detail view
created: 2026-03-11
completed_at: 2026-03-11
builder_notes: "Removed dosage from the explicit select list in ProtocolDetail.tsx line 147 and removed the dosage field from the SessionRecord interface (line 24). The session.dosage display in the right panel (line 544) was left in place but is now safely guarded by the existing conditional (session.dosage &&) which will simply not render since the field is no longer fetched."
---

## Problem

Navigating to any `/protocol/:id` URL crashes with:

> DB error: column log_clinical_records.dosage does not exist (code: 42703)

## Root Cause

`ProtocolDetail.tsx` line 147 explicitly names `dosage` in the Supabase `.select()` call:

```ts
.select('id, patient_link_code_hash, session_date, session_type_id, substance_id, site_id, practitioner_id, dosage, route_id, concomitant_med_ids')
```

The column `log_clinical_records.dosage` does not exist in the live schema — dose data lives in `log_dose_events` / `log_session_observations`. Postgres returns error code 42703 (undefined column) which the component surfaces as "Record not found".

## Fix Applied

1. Removed `dosage` from the `.select()` string in `ProtocolDetail.tsx` line 147
2. Removed `dosage: number | null` from the `SessionRecord` interface (line 24)
3. The `session.dosage && (...)` display block (line 544) is harmlessly left — it simply never renders since the field is absent

## Acceptance Criteria

- [ ] `/protocol/:id` loads without error for any valid session ID
- [ ] No TypeScript build errors
- [ ] The "Dosage" row in the Protocol Card is absent (since it's not yet fetched from dose tables)
