---
id: WO-584
title: Live Session Timeline — Notes Not Persisting, Chips Not Saving, No Color-Coding
owner: LEAD → INSPECTOR → BUILDER
status: 00_INBOX
priority: P1
created: 2026-03-09
source: User escalation — repeatedly requested, never correctly fixed
files:
  - src/components/wellness-journey/LiveSessionTimeline.tsx
  - src/services/clinicalLog.ts
  - migrations/081_seed_live_session_event_types.sql [NEW]
---

## Problem Statement

The Live Session Timeline has three simultaneous defects that compound each other:

1. **No color-coding** — every entry in the ledger renders as a gray `[NOTE]` regardless of event type (dose, music, observation, etc.)
2. **Chips not saving** — tapping P.Spoke, Music, or Decision chips produces an optimistic local entry that disappears on page refresh. The events are never persisted to the database.
3. **Free-text notes may also not save** — same root cause as chips. Custom typed notes may silently fail to write to DB.

---

## Root Cause Analysis (LEAD-verified, do not skip)

### Bug A — Color-coding broken (`event_type` column does not exist)

`getTimelineEvents` in `clinicalLog.ts` runs:
```ts
.select('*')
```
The table `log_session_timeline_events` has **`event_type_id` (integer FK)** — it has NO column named `event_type`.

`LiveSessionTimeline.fetchLocalEvents` then maps:
```ts
type: row.event_type || 'general_note',   // ← row.event_type is always undefined
```

Result: `event.type` is always `'general_note'`, and `EVENT_CONFIG['general_note']` is gray for every row.

### Bug B — Chip events never persist to DB

`LiveSessionTimeline.handleAddNote` calls `getEventTypeIdByCode(type)` where `type` is one of:
- `patient_observation`
- `music_change`
- `clinical_decision`
- `general_note`
- `dose_admin`
- `additional_dose`
- `vital_check`
- `safety_event`
- `touch_consent`
- `session_update`

`ref_flow_event_types` in the database only contains these 9 stage-level codes:
```
intake_started, intake_completed, consent_verified,
baseline_assessment_completed, session_completed,
followup_assessment_completed, integration_visit_completed,
treatment_paused, treatment_discontinued
```

None of the live-session chip codes exist. `getEventTypeIdByCode` returns `null`. The guard in `handleAddNote` silently skips the DB insert. The optimistic local state is reset on next `fetchLocalEvents`, so the entry disappears.

### Bug C — Confirmed same root cause as Bug B for `general_note`

`general_note` is not in `ref_flow_event_types` either, so free-text notes sent without a preset type also fail silently.

---

## Required Fixes — ALL THREE MUST BE IMPLEMENTED TOGETHER

### Fix 1 — DB Migration: seed missing event type codes

**File:** `migrations/081_seed_live_session_event_types.sql` [NEW]

Idempotent upsert of the 10 session-level event type codes into `ref_flow_event_types`.
Use `ON CONFLICT (event_type_code) DO NOTHING` so re-running is safe.

Codes to seed (match exactly — these are the keys used in `EVENT_CONFIG`):
```
dose_admin, additional_dose, vital_check,
patient_observation, music_change, clinical_decision,
general_note, safety_event, touch_consent, session_update
```

Each row needs: `event_type_code`, `event_type_label`, `event_category = 'session'`, `is_active = true`.

### Fix 2 — Service layer: JOIN ref table in `getTimelineEvents`

**File:** `src/services/clinicalLog.ts` — function `getTimelineEvents` (line ~714)

Change the select to join and return `event_type_code`:
```ts
// BEFORE:
.select('*')

// AFTER:
.select('*, ref_flow_event_types!inner(event_type_code)')
```

### Fix 3 — Component: read joined field in `fetchLocalEvents`

**File:** `src/components/wellness-journey/LiveSessionTimeline.tsx` — `fetchLocalEvents` mapping (line ~148)

Change this one line:
```ts
// BEFORE:
type: row.event_type || 'general_note',

// AFTER:
type: row.ref_flow_event_types?.event_type_code || 'general_note',
```

---

## What MUST NOT Change

- The `EVENT_CONFIG` object — do not touch it, all color definitions are correct.
- The `QUICK_ACTIONS` array — do not touch it.
- The optimistic update logic — keep as-is, it is correct for UX.
- The `visible` filtering logic — keep as-is.
- Pre-session Phase 2 layout — this WO touches zero layout code.
- Any other file not listed in the `files:` frontmatter.

---

## Success Criteria (INSPECTOR must verify all before marking DONE)

- [ ] **Migration safety:** `migrations/081_...sql` uses `ON CONFLICT DO NOTHING` — safe to re-run.
- [ ] **Chip persistence:** Tap P. Spoke → hard refresh page → entry still present in timeline.
- [ ] **Chip persistence:** Tap Music → hard refresh → entry still present, violet colored.
- [ ] **Chip persistence:** Tap Decision → hard refresh → entry still present, orange colored.
- [ ] **Note persistence:** Type a custom note → submit → hard refresh → entry still present, gray.
- [ ] **Color-coding:** `dose_admin` entries render emerald. `patient_observation` entries render amber. `music_change` entries render violet. `clinical_decision` entries render orange. `safety_event` entries render red. `general_note` entries render gray.
- [ ] **No console warnings:** DevTools console shows zero instances of `event_type_code '...' not found in ref_flow_event_types` after clicking any chip or submitting a note.
- [ ] **No regressions:** Existing high-level events (`intake_completed`, `consent_verified`, etc.) still appear in the timeline with correct labels.
- [ ] **Pre-session view unchanged:** Phase 2 pre-session layout is pixel-identical to before this fix.

---

## INSPECTOR Checklist (complete before handing to BUILDER)

- [ ] Confirm `ref_flow_event_types` has a UNIQUE constraint on `event_type_code` (required for `ON CONFLICT` to work — check `migrations/001_patient_flow_foundation.sql`).
- [ ] Confirm `log_session_timeline_events.event_type_id` FK points to `ref_flow_event_types(id)` — verify join direction is correct for PostgREST.
- [ ] Confirm `ref_flow_event_types!inner` vs `ref_flow_event_types` (LEFT JOIN) — decide which is safer given RLS.
- [ ] Flag any `stage_order` UNIQUE constraint on `ref_flow_event_types` that may conflict with the new rows (check migration 003a).
- [ ] Confirm the `is_active` column exists on `ref_flow_event_types` (it is used in `loadRefFlowEventTypes` filter: `.eq('is_active', true)`).
