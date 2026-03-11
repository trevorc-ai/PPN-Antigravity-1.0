# WO-595 — Protocol Detail: "Record Not Found" Error

**Status:** 99_COMPLETED
**Priority:** P0 — CRITICAL
**Author:** INSPECTOR → BUILDER
**Date:** 2026-03-10

---

## Root Cause (Confirmed)

`ProtocolDetail.tsx` line 147 selects `patient_link_code_hash` from `log_clinical_records`. That column is written by `clinicalLog.ts` line 184 as `patient_link_code_hash: patientId || null` — where `patientId` is the raw patient link code string (e.g. `PT-XXXXXXXXXX`), **not** a hash.

The RLS policy on `log_clinical_records` (added in WO-594) requires:
```sql
site_id IN (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid())
```

Sessions where `site_id` is `NULL` (confirmed in DB screenshots — several rows have `NULL` site_id) **will be blocked by RLS** and return nothing, which triggers the "Session not found" error at `ProtocolDetail.tsx` line 151.

**There are two separate bugs:**

**Bug A — Some sessions have NULL `site_id`** (data integrity)
Sessions where `site_id` was not written will fail the RLS check and return 0 rows even though the session ID is correct.

**Bug B — `ProtocolDetail.tsx` shows a generic "Record not found" with no diagnostic info** (UX)
When RLS blocks the read, the error message gives no useful feedback.

---

## Files to Modify

### Fix A — `src/services/clinicalLog.ts`

**Function:** `createClinicalSession()` (around line 180)

Ensure `site_id` is always written when creating a session. Do a pre-flight check:

```typescript
// BEFORE the insert, verify site_id is resolved
if (!siteId) {
  console.error('[clinicalLog] createClinicalSession: site_id is missing — session will fail RLS');
  return { sessionId: null, error: new Error('Missing site_id') };
}
```

Do **NOT** change the insert payload shape — only add the guard.

### Fix B — `src/pages/ProtocolDetail.tsx`

**Lines 145–151** — The query itself is correct (`eq('id', id)`). The issue is RLS silently returning 0 rows.

Replace the generic catch at line 151:

```typescript
// CURRENT (line 151):
if (sessionErr || !sessionData) throw new Error('Session not found');

// REPLACE WITH:
if (sessionErr) throw new Error(`DB error: ${sessionErr.message} (code: ${sessionErr.code})`);
if (!sessionData) throw new Error(
  'Session not found. This may be a permissions issue — confirm this session belongs to your clinic. Session ID: ' + id
);
```

**Do NOT change anything else in `ProtocolDetail.tsx`.** No layout changes, no query changes, no type changes.

### Fix C — Backfill NULL site_id in Production DB

**Run once in Supabase SQL Editor:**

```sql
-- Backfill site_id on sessions where it is NULL
-- Uses the practitioner's site from log_user_sites
UPDATE log_clinical_records lcr
SET site_id = lus.site_id
FROM log_user_sites lus
WHERE lcr.site_id IS NULL
  AND lcr.created_by = lus.user_id;

-- For any remaining NULL site_id rows with no created_by,
-- check count before deciding further action:
SELECT COUNT(*) FROM log_clinical_records WHERE site_id IS NULL;
```

---

## Do NOT Touch

- `App.tsx` routing — route `/protocol/:id` is correct (line 441)
- `MyProtocols.tsx` row click — `navigate('/protocol/${p.id}')` at line 334 is correct
- `ProtocolDetail.tsx` query logic — fetching by UUID is correct
- Any styling, layout, or unrelated component

---

## Acceptance Criteria

- [ ] Clicking any session row in My Protocols opens Protocol Detail without error
- [ ] If a session genuinely cannot be found, the error message explains why (permissions vs. not found)
- [ ] `site_id` is never NULL after `createClinicalSession()` completes successfully
- [ ] Console shows `[clinicalLog] createClinicalSession: site_id is missing` if site resolution fails

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
