---
id: WO-695
title: "Wire protocol_id write on DosingProtocol form save"
owner: PRODDY
status: 06_USER_REVIEW
priority: P0
created: 2026-03-26
origin: "Intelligence Layer Integration Plan — Phase 0 Data Quality Activation"
pillar_supported: "2 — Comparative Clinical Intelligence, 4 — Network Benchmarking"
sequence_note: "Ship first. Soak 5–10 sessions before WO-696. WO-697 and WO-701 are most valuable after this lands."
files:
  - src/services/clinicalLog.ts
  - src/components/wellness-journey/WellnessFormRouter.tsx
---

## Problem

`createClinicalSession()` in `clinicalLog.ts` (lines 181–187) creates the `log_clinical_records`
stub with only 5 fields: `practitioner_id`, `site_id`, `patient_link_code_hash`, `patient_uuid`,
`session_date`. `protocol_id` is **never written** — not at session create, not by
`updateDosingProtocol()`.

**Impact:** `mv_protocol_outcome_rollup` returns 0 rows for every current session. Protocol
intelligence (capabilities #8, #9 partial) is fully blocked. Network benchmarking is degraded.

## Source Evidence

```
clinicalLog.ts line 181–187: payload contains NO protocol_id field
updateDosingProtocol() lines 286–294: updates substance_id, dosage_mg, route_id, session_status
  — no protocol_id write
```

## Required Fix

1. Add `protocol_id?: string` to `DosingProtocolUpdateData` interface
2. In `updateDosingProtocol()`, include `protocol_id: data.protocol_id ?? null` in the UPDATE payload
3. In `WellnessFormRouter.tsx` DosingProtocolForm save handler, pass the selected `protocol_id`
   through to `updateDosingProtocol()`
4. If no protocol is selected, write `null` — never block the save

## Success Criteria

- After a DosingProtocol form save, `log_clinical_records.protocol_id` is non-null for that session
- `mv_protocol_outcome_rollup` begins returning rows for sessions with a protocol selected
- Existing sessions with null `protocol_id` are unaffected (no backfill required)

## INSPECTOR Pre-Build Note

Write-path change — requires PRODDY plan and INSPECTOR clearance before build.
No schema change required. `protocol_id` column already exists in `log_clinical_records`.

---
- **Data from:** `ProtocolConfiguratorModal.tsx` — selected `protocol_id` passed via `DosingProtocolForm` save handler; `log_clinical_records` existing session row (UPDATE target)
- **Data to:** `log_clinical_records.protocol_id` field — non-null FK written on DosingProtocol form save (via `updateDosingProtocol()` in `clinicalLog.ts`)
- **Theme:** No visual UI changes — write-path wiring only; `clinicalLog.ts` service + `WellnessFormRouter.tsx`

---

## ⚠️ INSPECTOR DB SAFETY ANNOTATION — 2026-03-27

**Source:** SESSION_HANDOFF.md Canonical Database Truths (verified 2026-03-27)

### Pre-Build Verification Step
```bash
node .agent/scripts/inspect-table.js log_clinical_records
```
Confirm `protocol_id` column exists in the live table before writing any code. The WO states it already exists — verify this is true in production before building.

### Legacy Field Warning — `patient_link_code_hash`
The existing `createClinicalSession()` payload (lines 181–187) includes `patient_link_code_hash`. Per SESSION_HANDOFF canonical truths (2026-03-27):

> **`log_clinical_records.patient_link_code_hash` is a legacy PT-code snapshot field. It is NOT a SHA-256 hash. Do NOT rename, drop, modify, or hash this field in place.** Treat it as read-only. An additive replacement plan is pending.

BUILDER must not touch `patient_link_code_hash` in any way as part of this WO. The fix is additive only: add `protocol_id` to the UPDATE payload. Do not refactor the surrounding code.
