---
id: WO-675
title: "Analytics/Clinical Intelligence page shows zero despite active protocols — session_status promotion gap"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-24
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: "Analytics"
parked_context: ""
files:
  - src/hooks/useAnalyticsData.ts
  - src/services/clinicalLog.ts
  - migrations/20260310_add_session_status.sql
---
## Request
Analytics/Clinical Intelligence page shows zero across the board despite having protocols in process.

## Root Cause (LEAD Diagnosis)

**The session_status promotion gap.** The lifecycle is:

1. `createClinicalSession()` inserts a row in `log_clinical_records` with **no** `session_status` field → DB default = `'draft'`
2. The row only promotes to `'active'` if one of two things happens:
   - **Dosing form saved:** `updateDosingProtocol()` sets `session_status = 'active'`
   - **Consent recorded:** `createConsent()` sets `session_status = 'active'`

3. **Every analytics query filters `neq('session_status', 'draft')`** — correct per WO-592, but this means any session that has only started Phase 1 Preparation (without completing consent) is invisible to analytics AND My Protocols.

**Why My Protocols shows data but Analytics does not:** `MyProtocols.tsx` also uses `neq('session_status', 'draft')`. If the practitioner's protocols are displaying there, they have at least one `'active'` session. The Analytics page query may be failing silently — likely the `log_user_sites` lookup is returning `null` (no `site_id`) so `useAnalyticsData` gets `siteId = null` and short-circuits: `if (!siteId) return { data: null, error: 'No site ID provided' }`.

## Two Likely Failure Paths

### Path A: Missing site_id (most probable if My Protocols also showed nothing recently)
- `Analytics.tsx` fetches `siteId` from `log_user_sites` via `maybeSingle()` 
- If the user's `user_id` has no row in `log_user_sites`, `siteId` stays `null`
- `useAnalyticsData(null)` short-circuits immediately → 0 for all KPIs
- **Fix:** Ensure the user has a `log_user_sites` entry. Check DB.

### Path B: Sessions stuck in 'draft' (if My Protocols also shows zero)
- Sessions exist but are still `'draft'` (consent + dosing not completed)
- **Fix:** Widen the Analytics count to include `'draft'` sessions OR add a third promotion trigger earlier in the flow (e.g., when Phase 1 Screening is saved)

### Path C: Combination — Path A for Analytics, Path B explains My Protocols also seeing some
- Most likely: My Protocols has data because at least some sessions were promoted to `'active'` via consent/dosing
- Analytics is showing zero because site_id lookup in the Analytics hook is failing independently of the My Protocols hook (which uses `user_id` instead of looking up `site_id`)

## LEAD Architecture

1. **Immediate triage:** Check `log_user_sites` for `trevorcalton`'s user entry — if missing, that's the entire bug for Analytics.
2. **Promotion gap fix:** Add a third promotion path — when `SafetyCheckForm` / `PreparationChecklist` is saved, also promote `session_status` to `'active'`. This ensures any fully-started Phase 1 session appears in analytics immediately.
3. **Analytics hook hardening:** Add a fallback — if `siteId` is null after the `log_user_sites` query, try fetching via `practitioner_id = user.id` directly from `log_clinical_records` to count the practitioner's own sessions.

## Files To Touch

- `src/hooks/useAnalyticsData.ts` — fallback for null siteId + count `'active'` sessions correctly
- `src/services/clinicalLog.ts` — add promotion to `'active'` in Phase 1 form saves (preparation/safety check)
- Possibly `src/pages/Analytics.tsx` — verify `siteId` fetch path

## Open Questions
- [ ] Does `log_user_sites` have a row for this user? (verify in Supabase Dashboard)
- [ ] Are "in process" protocols visible in My Protocols, or also blank there?
- [ ] Which phase did the test protocols reach? (Prep only? Or did dosing happen?)
---
*Fast-tracked 2026-03-24 — LEAD diagnosis complete*
