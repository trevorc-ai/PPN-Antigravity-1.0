---
status: 05_USER_REVIEW
priority: P1
type: BUG
owner: USER
authored_by: PRODDY
triaged_by: LEAD
built_by: BUILDER
inspected_by: INSPECTOR
inspected_at: 2026-03-01T20:22:00-08:00
created: 2026-03-01
triaged: 2026-03-01
failure_count: 0
---

## PRODDY PRD

> **Work Order:** WO-534 — Dosing Protocol Substance Not Persisted to Database
> **Authored by:** PRODDY
> **Date:** 2026-03-01
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Every `log_clinical_records` session row has `substance_id = NULL`. This is caused by two confirmed bugs: (1) `WellnessFormRouter.tsx` wires the Dosing Protocol form's `onSave` to an empty no-op, discarding all form data on save; (2) `clinicalLog.ts` has no function to UPDATE a session with substance, dosage, or route after the stub row is created. Practitioners believe they are saving data, but nothing persists. Note: `patient_link_code` is confirmed to still exist in the live DB — migration 079 has not been applied to production.

---

### 2. Target User + Job-To-Be-Done

A psychedelic therapy practitioner needs to select a substance, dosage, and route in the Dosing Protocol form and have that data permanently saved to the session record so that My Protocols, Protocol Detail, and Analytics reflect accurate clinical data.

---

### 3. Success Metrics

1. After completing the Dosing Protocol form with Psilocybin/25mg/Oral, the corresponding `log_clinical_records` row has `substance_id` ≠ NULL and `dosage = 25` within 2 seconds of form save.
2. My Protocols page shows the correct substance name (not "Unknown" or "Session Record") for 100% of sessions created after this fix ships.
3. Zero `42703 column does not exist` errors appear in Supabase after this fix ships (confirmed root cause was PostgREST FK join syntax, not a missing column — fixed in concurrent work).

---

### 4. Feature Scope

#### ✅ In Scope
- Add `updateDosingProtocol(sessionId, data)` to `clinicalLog.ts` — performs an UPDATE on `log_clinical_records` with `substance_id`, `dosage`, and `route_id`
- Wire `WellnessFormRouter.tsx` `case 'dosing-protocol'` `onSave` to the new handler (replace the empty `() => { }` stub)
- Resolve route text string to `ref_routes.route_id` FK inside `updateDosingProtocol` using a normalisation map (see LEAD Architecture Decision below)
- Do NOT modify `createClinicalSession()` — `patient_link_code` confirmed still present in live DB

#### ❌ Out of Scope
- Backfilling `substance_id` on existing historical session rows — data integrity of past sessions is a separate, future data-migration ticket
- Adding new form fields to `DosingProtocolForm.tsx` — the form UI is correct and frozen
- Any changes to `ref_routes` or `ref_substances` seed data
- Fixing `MEQ-30` or `Session Observations` save stubs (separate bugs; separate tickets)
- `ProtocolDetail.tsx` or `MyProtocols.tsx` UI changes — already updated in concurrent work

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Without substance persistence, every session record is clinically incomplete. My Protocols is the primary data review surface for practitioners and currently shows nothing of value. This directly blocks meaningful testing of Protocol Detail, Analytics, and Global Benchmarks — all of which group data by substance. Not a P0 because no live patient safety data is at risk (sessions are still created; substance data is simply missing from the record).

---

### 6. Open Questions — ANSWERED BY LEAD ✅

**Q1: What column stores the patient reference after migration 079?**
→ **`patient_link_code` still exists in the live database.** Migration 079 has not been applied to production. `PatientSelectModal` successfully queries it today. Do NOT remove from `createClinicalSession()`. LEAD will track migration 079 production application separately.

**Q2: Does `ref_routes` match the form strings?**
→ **Partial mismatch. Resolution: use a normalisation map in `updateDosingProtocol`.** DB values: `'Oral'`, `'Intravenous'`, `'Intramuscular'`, `'Sublingual'`. Form values: `'Oral'` ✅, `'Intravenous (IV)'` ❌, `'Intramuscular (IM)'` ❌, `'Insufflated'` ❌ (no DB match), `'Vaporized'` ❌ (no DB match). BUILDER must map form strings → closest DB `route_name` before resolving to FK. If no match found, write `route_id = NULL` (nullable column) — do not throw.

**Q3: UPDATE or UPSERT?**
→ **Use `UPDATE ... WHERE id = sessionId`.** The stub row always exists by the time the Dosing Protocol form is visible. UPSERT is unnecessary complexity.

**Q4: Cast `substance_id` string → integer in the service or fix the form type?**
→ **Cast in the service (`parseInt(data.substance_id, 10)`).** The form type is driven by HTML `<select>` which always returns a string. Changing the form type would require touching `DosingProtocolForm.tsx` which is stable. Cast at the service boundary — this is the correct architectural pattern.

---

## LEAD Architecture Decision — Route Normalisation Map

BUILDER must implement this map inside `updateDosingProtocol` before the FK lookup:

```
Form string          → ref_routes.route_name
'Oral'              → 'Oral'
'Sublingual'        → 'Sublingual'
'Intramuscular (IM)'→ 'Intramuscular'
'Intravenous (IV)'  → 'Intravenous'
'Insufflated'       → NULL (no match — store route_id as null)
'Vaporized'         → NULL (no match — store route_id as null)
```

Query pattern: `SELECT route_id FROM ref_routes WHERE route_name = <normalised_value>`

---

## Files to Modify

| File | Change |
|------|--------|
| `src/services/clinicalLog.ts` | Add `updateDosingProtocol(sessionId, data)` |
| `src/components/wellness-journey/WellnessFormRouter.tsx` | Replace `onSave={() => { }}` stub with real handler |

## Do NOT Touch
- `DosingProtocolForm.tsx` — frozen, UI is correct
- `createClinicalSession()` — `patient_link_code` still in live DB
- Any migration files

---

### PRODDY Sign-Off Checklist ✅ | LEAD Triage ✅

- [x] All 4 Open Questions answered by LEAD
- [x] Route normalisation map defined
- [x] Architecture decision (UPDATE not UPSERT) confirmed
- [x] Type casting decision confirmed (service-layer cast)
- [x] Ticket routed to 03_BUILD, owner: BUILDER

---

## BUILDER IMPLEMENTATION COMPLETE

*(Reconstructed by INSPECTOR from source — BUILDER shipped without filling this section. Process note logged.)*

### Files Modified
- `src/services/clinicalLog.ts` — Added `ROUTE_NORMALISE` map (line 168), `DosingProtocolUpdateData` interface (line 182), and `updateDosingProtocol()` function (line 199)
- `src/components/wellness-journey/WellnessFormRouter.tsx` — Imported `updateDosingProtocol` + `DosingProtocolUpdateData` (lines 40–42), added `handleDosingProtocolSave` callback (line 290), wired to `DosingProtocolForm onSave` (line 460)

### Implementation Summary
1. `ROUTE_NORMALISE` map translates form display strings → `ref_routes.route_name` values; unmatched strings resolve to `null` (no throw)
2. `updateDosingProtocol(sessionId, data)` — casts `substance_id` string → `parseInt`, does FK lookup on `ref_routes`, then `UPDATE log_clinical_records SET substance_id, dosage, route_id WHERE id = sessionId`
3. `WellnessFormRouter` `case 'dosing-protocol'` — `onSave` replaced from `() => { }` no-op to `handleDosingProtocolSave`; tagged `// WO-534: was () => { } no-op`

---

## ✅ [STATUS: PASS] — INSPECTOR APPROVED

**Verified by:** INSPECTOR
**Date:** 2026-03-01T20:22:00-08:00
**failure_count:** 0

### Grep Evidence

```
grep -rn "updateDosingProtocol" src/services/clinicalLog.ts
clinicalLog.ts:179  — WO-534: Parameter type for updateDosingProtocol
clinicalLog.ts:199  — export async function updateDosingProtocol(
clinicalLog.ts:244  — console.info('[clinicalLog] updateDosingProtocol: ...')
clinicalLog.ts:248  — console.error('[clinicalLog] updateDosingProtocol:', error)

grep -rn "updateDosingProtocol" src/components/wellness-journey/WellnessFormRouter.tsx
WellnessFormRouter.tsx:40  — import { ... updateDosingProtocol } from '../../services/clinicalLog'
WellnessFormRouter.tsx:42  — import type { DosingProtocolUpdateData } from '../../services/clinicalLog'
WellnessFormRouter.tsx:290 — const handleDosingProtocolSave = useCallback(async (data: DosingProtocolUpdateData) => {
WellnessFormRouter.tsx:295 — const result = await updateDosingProtocol(sessionId, data);
WellnessFormRouter.tsx:460 — onSave={handleDosingProtocolSave}  // WO-534: was () => { } no-op

grep -rn "ROUTE_NORMALISE" src/services/clinicalLog.ts
clinicalLog.ts:168 — const ROUTE_NORMALISE: Record<string, string | null> = {

grep -rn "parseInt" src/services/clinicalLog.ts
clinicalLog.ts:211 — parseInt(data.substance_id, 10) || null
```

### Audit Results

| Check | Result |
|---|---|
| `updateDosingProtocol` exists in `clinicalLog.ts` | ✅ Line 199 |
| Route normalisation map present per LEAD spec | ✅ Line 168 — all 6 entries including 2 null mappings |
| `parseInt` cast at service boundary (not form) | ✅ Line 211 |
| UPDATE (not UPSERT) pattern used | ✅ `.update({...}).eq('id', sessionId)` at line 239 |
| `onSave` no-op replaced in `WellnessFormRouter` | ✅ Line 460 — `// WO-534: was () => { } no-op` |
| `createClinicalSession()` untouched | ✅ Confirmed — `patient_link_code` still present |
| Font violations (`text-[11px]`, `text-xs`) | ✅ NONE — grep exit 1 (0 matches) in both files |
| PHI in `console.log` | ✅ NONE — only `console.info`/`console.error` with session UUID and resolved IDs |
| Remote in sync | ✅ `(HEAD -> feature/governance-and-p0-fixes, origin/feature/governance-and-p0-fixes)` @ `f15b870` |

### Process Note
BUILDER did not fill in the `## BUILDER IMPLEMENTATION COMPLETE` section before routing to `04_QA`. Implementation was verified directly from source by INSPECTOR. BUILDER must complete this section on all future tickets before handoff — this is a pipeline protocol violation, not a code quality issue. First offense — no failure_count increment for this reason alone.

**Routed to:** `05_USER_REVIEW`
