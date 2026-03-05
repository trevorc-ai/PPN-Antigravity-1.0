---
id: WO-525
title: Multi-Practitioner Notes — Code Fixes (performed_by + Realtime)
owner: LEAD
status: 01_TRIAGE
filed_by: INSPECTOR
date: 2026-03-03
priority: P1
files:
  - src/components/wellness-journey/LiveSessionTimeline.tsx
  - src/components/wellness-journey/WellnessFormRouter.tsx
depends_on: WO-527
inspector_status: CONDITIONALLY_APPROVED (code-only changes)
---

==== INSPECTOR ====

## INSPECTOR Pre-Approved Code Fix

> **Work Order:** WO-525 — Multi-Practitioner Notes: Code Fixes
> **Filed by:** INSPECTOR
> **Date:** 2026-03-03
> **Status:** Code-only. No schema change. INSPECTOR conditionally approved.

> ⚠️ **Depends on WO-527.** The `log_user_sites` table is currently empty (confirmed via Supabase dashboard). Until practitioners are enrolled in the table, multi-practitioner writes cannot be meaningfully tested. WO-527 (practitioner enrollment UI) should be in progress before this ships.

---

### Problem Statement

Two bugs prevent accurate practitioner attribution on session timeline events:

1. `LiveSessionTimeline.tsx` line 65 passes `performed_by: 'Current Clinician'` — a hardcoded string — instead of the authenticated user's UUID. Every event from every practitioner is mis-attributed identically.
2. `WellnessFormRouter.tsx` `handleTimelineSave()` passes `e.performed_by` which is always `undefined` from `SessionTimelineForm` (the form never sets this field). The DB receives `null` for all events submitted via the form.

Additionally, `LiveSessionTimeline.tsx` uses a 30-second `setInterval` poll. For collaborative use where multiple practitioners are entering notes on different tablets, this means up to 30-second lag before one practitioner sees another's entry — unacceptable during an active session.

---

### Scope

#### ✅ In Scope — `LiveSessionTimeline.tsx`
- Resolve `supabase.auth.getUser()` on component mount; store `uid` in state
- Pass resolved `uid` as `performed_by` to `createTimelineEvent()` — replacing hardcoded string
- Replace `setInterval(30000)` poll with `supabase.channel()` Realtime subscription on `log_session_timeline_events` filtered by `session_id`
- Display resolved `uid` (or display name from `log_user_profiles`) in each event's author field in the timeline UI

#### ✅ In Scope — `WellnessFormRouter.tsx`
- In `handleTimelineSave()`: resolve `supabase.auth.getUser()` once before the `validEvents.map()` loop
- Pass resolved `uid` as `performed_by` to each `createTimelineEvent()` call

#### ❌ Out of Scope
- No changes to `SessionTimelineForm.tsx`
- No changes to `clinicalLog.ts` service layer
- No schema or RLS changes (those are WO-526)
- No changes to any Phase 1, Phase 3 forms, or analytics components

---

### INSPECTOR Pre-Check Summary

From full blast radius audit:
- **4 files** reference `performed_by` / timeline functions
- **`SessionTimelineForm.tsx`**: read-only display; no write changes needed ✅
- **`clinicalLog.ts`**: `performed_by` is already an optional UUID field passed through correctly ✅
- Changes are **backward-compatible** — `performed_by` is nullable in DB today; fixing null → real UUID is additive only

> ⚠️ **Cross-check required before implementation.** WO-529–534 cover dosing session event logging (ledger + live graph). `LiveSessionTimeline.tsx` is the primary event write surface and is directly in scope for both WO-525 and WO-529–534. LEAD must review these WOs together. INSPECTOR preliminary QA across all related WOs required before any code is written.

### QA Checklist (run after implementation)

- [ ] `LiveSessionTimeline` event author shows practitioner display name (not 'Current Clinician' or 'Unknown Clinician')
- [ ] Two authenticated users on different tablets can both add events to the same `session_id` and see each other's entries within 3 seconds (Realtime)
- [ ] `WellnessFormRouter handleTimelineSave` writes real `user_id` UUID to `performed_by` — confirmed via Supabase table editor
- [ ] No regression on Phase 1 or Phase 3 form saves
- [ ] TypeScript: zero new errors

==== INSPECTOR ====
