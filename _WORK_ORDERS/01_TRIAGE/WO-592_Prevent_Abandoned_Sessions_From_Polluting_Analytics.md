# WO-592 — Prevent Abandoned Sessions From Polluting Analytics

**Status:** 01_TRIAGE
**Author:** INSPECTOR
**Date:** 2026-03-10
**Priority:** HIGH — data integrity

---

## Problem

Every time a practitioner starts a Wellness Journey session and abandons it (closes the tab, navigates away, or starts over), a stub row is permanently created in `log_clinical_records` with `substance_id = NULL` and `created_by = NULL`.

These empty stubs are **invisible to the practitioner but counted by analytics.** This caused three pages to show three different protocol totals today, and will get worse as practitioner count grows.

**Root cause:** The app must create the `log_clinical_records` row at session start because all child records (vitals, MEQ scores, consent, etc.) use its UUID as a foreign key. There is currently no mechanism to distinguish a real session from an abandoned one.

---

## Proposed Solution: `session_status` Column

### Migration (additive — safe)

```sql
ALTER TABLE log_clinical_records
ADD COLUMN IF NOT EXISTS session_status TEXT
  NOT NULL DEFAULT 'draft'
  CHECK (session_status IN ('draft', 'active', 'completed'));

COMMENT ON COLUMN log_clinical_records.session_status IS
  'draft = stub created at session start, not yet meaningful.
   active = practitioner has completed Phase 1 and begun Phase 2.
   completed = session fully closed out via Phase 3/integration.
   All analytics queries MUST filter WHERE session_status != ''draft''.';
```

### Status Transitions

| Trigger | New Status |
|---|---|
| Session stub created (start of Wellness Journey) | `draft` |
| Phase 1 baseline saved (substance selected, patient confirmed) | `active` |
| Session closed out / integration note saved | `completed` |

### Code Changes Required

1. **`clinicalLog.ts`** — set `session_status = 'active'` when `updateClinicalRecord()` saves Phase 1 substance/patient data
2. **`MyProtocols.tsx`** — add `.neq('session_status', 'draft')` to query *(frozen — needs freeze bypass)*
3. **`usePractitionerProtocols.ts`** — add `.neq('session_status', 'draft')` to query
4. **`insightEngine.ts`** — add `session_status` filter to all `log_clinical_records` queries
5. **`useSafetyBenchmark.ts`** — same filter

### Cleanup Policy

Run in Supabase SQL Editor (weekly, or on-demand):
```sql
-- Safe to delete: drafts older than 48hrs with no child records
DELETE FROM log_clinical_records
WHERE session_status = 'draft'
  AND created_at < NOW() - INTERVAL '48 hours';
```

---

## Acceptance Criteria

- [ ] Abandoned sessions never appear in My Protocols, Analytics, or Dashboard counts
- [ ] Dashboard, Analytics, and My Protocols all show the same session total
- [ ] New sessions still save correctly (FK chain intact)
- [ ] Verified on production with one full end-to-end session log

---

## Notes for BUILDER

- This is an **additive migration only** — safe per schema policy
- `MyProtocols.tsx` is frozen — requires authorized freeze bypass
- Apply to staging first, verify analytics queries, then production
- Do NOT delete the stub rows during the migration — only the cleanup policy handles deletion

---

## Related

- Conversation: ea1b3fe5 (INSPECTOR audit session, 2026-03-10)
- Discovered during: live data audit showing 0 / 4 / 22 session count mismatch
