---
id: WO-576
title: Ledger Unification — Live Session Timeline as Single Source of Truth
owner: BUILDER
status: 03_BUILD
priority: P0
created: 2026-03-09
source: Jason-Trevor Meeting 2026-03-09
---

## PRODDY PRD

> **Work Order:** WO-576 — Ledger Unification: Live Session Timeline as Single Source of Truth  
> **Authored by:** INSPECTOR (expedited from meeting action items)  
> **Date:** 2026-03-09  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

Currently two ledgers exist side-by-side on the Phase 2 dosing screen:  
(1) **Live Session Timeline** — correct UX (icons, color-coded event types) but broken: timestamps wrong, no T+ counter, quick-chip entries flash momentarily but don't persist, free-text note in the same container doesn't store.  
(2) **Session Updates** — correct T+ counter and accurate timestamp, correctly displays vitals from the Session Update pop-out, but missing all other event types.

Having two ledgers is confusing and neither is complete. The practitioner cannot reliably document a live dosing session. Entries are lost.

---

### 2. Target User + Job-To-Be-Done

The practitioner needs to log all session events (chips, custom notes, vitals updates, safety events) in a single, real-time, filterable ledger so that every clinical action during Phase 2 is timestamped and permanently recorded.

---

### 3. Success Metrics

1. All quick-chip taps (P.Spoke, Music, Decision) appear in the Live Session Timeline ledger and survive a page reload within 5 seconds of being pressed.
2. The Session Update pop-out's "SESSION NOTE" field fires a `general_note` event into the Live Session Timeline and appears with the correct event type icon.
3. The T+ elapsed timer displays in the Live Session Timeline header and ticks every second from session start.

---

### 4. Feature Scope

#### ✅ In Scope

- **Fix chip persistence:** `QUICK_ACTIONS` in `LiveSessionTimeline.tsx` must write to the database via `createTimelineEvent` and survive a re-fetch. Audit `FLOW_EVENT_TYPE_CODES` to ensure `patient_observation`, `music_change`, and `clinical_decision` are valid codes.
- **Fix free-text note persistence:** The custom-note textarea in `LiveSessionTimeline.tsx` must write to the DB (currently appears to optimistic-update only with the DB write failing silently).
- **Add T+ elapsed counter:** Display `T+HH:MM:SS` in the Live Session Timeline header, starting from session start time. Source the start time from `wellness_sessions.started_at` or the session context.
- **Redirect Session Update notes:** The "SESSION NOTE" field in the Session Update pop-out (`DosingSessionPhase.tsx`) currently writes to the SESSION UPDATES ledger. Re-route it to fire a `ppn:session-event` custom event (or direct DB write) so it appears in the Live Session Timeline instead.
- **Add event-type filter toggles:** Add filter buttons (P.Spoke / Music / Decision / Vitals / Notes / Safety) below the timeline header. Active filter shows only matching event types. Toggles use the same color-coded style as existing chip buttons.
- **Delete "SESSION UPDATES" ledger:** Remove the `SessionUpdates` / `Phase2LiveBar` component (or equivalent) from the dosing screen. Preserve the Session Update pop-out modal itself — only the display ledger is deleted.
- **Keep all existing icons and color-coding** from `EVENT_CONFIG` in `LiveSessionTimeline.tsx`.

#### ❌ Out of Scope

- Redesigning the Session Update pop-out UI (other than note re-routing)
- The T+ counter in the SESSION UPDATES ledger (being deleted)
- Any changes to how vitals are saved to the DB from the Session Update pop-out

---

### 5. Priority Tier

**[x] P0** — Demo blocker / safety critical  

**Reason:** A practitioner running a live dosing session cannot reliably capture clinical observations. Entries are silently lost. This is the primary documentation defect from the Jason-Trevor review meeting.

---

### 6. Open Questions for LEAD

1. What is the canonical DB column that stores session start time — `wellness_sessions.started_at`, `session_date`, or something else? The T+ counter needs this.
2. Are `patient_observation`, `music_change`, and `clinical_decision` present in the `ref_flow_event_types` reference table? Or do we need to insert them?
3. Should the filter toggle state persist across page reloads (localStorage) or reset each time the ledger mounts?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] No code, SQL, or schema written anywhere in this document

---

## LEAD ARCHITECTURE

**Reviewed:** 2026-03-09 | **Routed to:** BUILDER → `03_BUILD`

### Open Questions — Resolved

**Q1: Canonical session start time column?**
→ `log_clinical_records.session_started_at` (timestamptz, nullable). This is set when the practitioner clicks "Start Session" in `DosingSessionPhase`. Source it via a Supabase query on mount: `select session_started_at from log_clinical_records where id = :sessionId`. Fall back to `created_at` if `session_started_at` is null.

**Q2: Are `patient_observation`, `music_change`, `clinical_decision` in `ref_flow_event_types`?**
→ **This is the root cause of chip non-persistence.** `FLOW_EVENT_TYPE_CODES` in `refFlowEventTypes.ts` is a hardcoded list of 9 admin-flow codes (e.g. `intake_started`, `session_completed`). The three live-session chip types are **not in this list**. `handleAddNote` checks `supportedCodes.has(type)` and silently skips the DB write when the check fails. BUILDER must:
  1. Query `ref_flow_event_types` at component mount to confirm whether `patient_observation`, `music_change`, and `clinical_decision` exist as rows. If they do not, they must be inserted via a one-time migration (SOOP sub-task, see below).
  2. Replace the hardcoded `supportedCodes` check with the live async lookup (`getEventTypeIdByCode`) that already exists in `refFlowEventTypes.ts`.

**Q3: Filter toggle state — persist or reset?**
→ Reset on each mount (do not use localStorage). The ledger is a live clinical tool; a new clinical session should always start with all event types visible.

### Architecture Decisions

**Target table:** `log_session_timeline_events`. Schema confirms:
- `timeline_event_id` uuid PK
- `session_id` uuid (FK → `log_clinical_records.id`)
- `event_timestamp` timestamptz NOT NULL
- `event_type_id` integer (FK → `ref_flow_event_types.id`)
- `performed_by` uuid (nullable)
- `metadata` jsonb (store `event_description` here)

**Problem with current `createTimelineEvent`:** It may be passing `event_type_code` as a string instead of resolving to the integer `event_type_id`. BUILDER must verify that `clinicalLog.ts → createTimelineEvent` calls `getEventTypeIdByCode()` and maps the result to `event_type_id` before the insert.

**Session Update notes re-routing:** The Session Update modal's "SESSION NOTE" field currently writes to a separate ledger component. It must instead call `createTimelineEvent` with `event_type_code = 'general_note'` (or nearest equivalent from `ref_flow_event_types`). The Session Update pop-out UI form is **not to be changed** — only where its note field writes. Wire it to dispatch `ppn:session-event` OR call `createTimelineEvent` directly before closing the modal.

**Delete target:** Remove the `SessionUpdates` / `Phase2LiveBar` **display component** only. Preserve the Session Update pop-out modal. BUILDER must grep for `SessionUpdates` and `Phase2LiveBar` in `DosingSessionPhase.tsx` and `WellnessJourney.tsx` before deleting.

**T+ Timer:** Source `session_started_at` from the DB on Phase 2 mount. Display as `T+HH:MM:SS` using a `setInterval(1000)` hook. If `session_started_at` is null, fall back to the `created_at` timestamp of the session row.

### SOOP Sub-task (if needed)
If `patient_observation`, `music_change`, `clinical_decision`, and `general_note` are not rows in `ref_flow_event_types` in the live DB, SOOP must write a migration to insert them with `is_active = true` before BUILDER ships the chip persistence fix. BUILDER should verify this at runtime with a console log on component mount.

---

### ⛔ SURGICAL SCOPE — DO NOT EXCEED

BUILDER is authorized to touch **only** the following:

| File | Permitted Change |
|------|-----------------|
| `LiveSessionTimeline.tsx` | Replace hardcoded `supportedCodes` check with `getEventTypeIdByCode()` lookup; fix `createTimelineEvent` call to pass `event_type_id` integer; add T+ timer; add filter toggle buttons |
| `clinicalLog.ts` | Verify/fix `createTimelineEvent` to resolve `event_type_code → event_type_id` before insert |
| `DosingSessionPhase.tsx` | Re-route Session Update modal's note field to fire `createTimelineEvent`; remove `SessionUpdates`/`Phase2LiveBar` **display** component render only |
| `refFlowEventTypes.ts` | No changes unless SOOP migration confirms new codes are live — then add codes to `FLOW_EVENT_TYPE_CODES` constant |

**PROHIBITED without a new LEAD-approved WO:**
- Changing Session Update pop-out modal UI
- Changing vitals save logic
- Refactoring any component not listed above
- Adding new DB tables or columns
