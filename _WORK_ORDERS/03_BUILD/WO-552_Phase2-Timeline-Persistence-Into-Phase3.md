---
id: WO-552
title: "Phase 2 Live Timeline Graph — Persist Display Through Phase 3"
status: 03_BUILD
owner: BUILDER
authored_by: PRODDY
reviewed_by: LEAD
lead_reviewed_at: 2026-03-01T17:03:00-08:00
created: 2026-03-01T16:38:39-08:00
failure_count: 0
priority: P1
prerequisite: WO-547
build_order: 6
---

## PRODDY PRD

> **Work Order:** WO-552 — Phase 2 Live Timeline Graph — Persist Display Through Phase 3
> **Authored by:** PRODDY
> **Date:** 2026-03-01
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

When a practitioner completes a dosing session (Phase 2) and advances to integration (Phase 3), the live session timeline graph — including the vitals trend chart and event pin ledger — disappears entirely. The Phase 3 view currently gives no visual reference to what happened during the session. This forces practitioners to hold session details in memory or navigate backwards, disrupting the post-session clinical workflow at the exact moment they need a complete, at-a-glance session record.

---

### 2. Target User + Job-To-Be-Done

A licensed facilitator needs to see the Phase 2 session timeline graph (vitals + event log) displayed at the top of Phase 3 so that they can reference exactly what occurred during the dosing session while completing integration documentation, without leaving the Phase 3 view.

---

### 3. Success Metrics

1. The Phase 2 vitals trend chart and event ledger render at the top of Phase 3 in 100% of QA test sessions where Phase 2 was completed with at least one session update logged.
2. Zero regressions in Phase 2 session view — the graph rendering in both views simultaneously without layout conflicts.
3. The read-only Phase 2 timeline header clearly distinguishes the panel from Phase 3 interactive content in ≥5 consecutive WCAG AA accessibility reviews.

---

### 4. Feature Scope

#### ✅ In Scope
- Render a read-only "Session Record" accordion panel at the **top** of Phase 3 (`IntegrationPhase.tsx`), **above** the Session Snapshot Strip (defined in WO-545)
- The panel displays: (a) `SessionVitalsTrendChart` with the session's recorded vitals and event pins, and (b) `LiveSessionTimeline` ledger in non-active/read-only mode
- Panel is **expanded by default** when vitals data or event pins exist for the completed session; **collapsed by default** if no vitals were logged
- Panel header reads: `"Dosing Session Record · [Session Date]"` with an amber activity icon — consistent with the WO-548 post-session accordion styling already implemented in `DosingSessionPhase.tsx`
- Layout spec for Phase 3: Session Record panel → Session Snapshot Strip → Phase 3 Action Cards → Intelligence Panels
- Panel is **read-only** — no form controls, no event trigger buttons
- `sessionDurationSec` and `eventLog` data must be passed from the Phase 2 session state into Phase 3 view via localStorage read (same keys used in `DosingSessionPhase.tsx`)

#### ❌ Out of Scope
- Any modification to Phase 2 session state or data model
- Rendering new vitals or logging new events from within Phase 3
- Changes to the `SessionVitalsTrendChart` or `LiveSessionTimeline` components themselves
- PDF inclusion of the timeline (handled separately in WO-553)
- Changes to the Session Snapshot Strip (WO-545 scope)

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Phase 3 was approved in WO-545 with a "holistic view" mandate. The live graph disappearing at the Phase 2→3 boundary is the most visible gap in that mandate. Practitioners reviewing integration notes need the session record immediately accessible without navigation.

---

### 6. Open Questions for LEAD

1. The `vitalsChartData` and `eventLog` state live inside `DosingSessionPhase.tsx` (in-component state). LEAD must confirm the preferred persistence strategy for Phase 3 to read them: does BUILDER write vitals to localStorage on each `handleSaveUpdate` call (extending existing behavior), or does Phase 3 re-query `log_clinical_vitals` from Supabase using the `sessionId`?
2. The `sessionDurationSec` is derived from the running timer in Phase 2. LEAD must confirm whether Phase 3 should display the **final recorded duration** (from the session close timestamp) or the **last logged vitals elapsed time** as the chart x-axis domain.
3. Should the Session Record panel header display the **session date** (from `journey.session.date`) or the **session number** (from `journey.session.sessionNumber`)? LEAD to confirm display format.

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD ARCHITECTURE

> **LEAD Review Date:** 2026-03-01
> **Status:** Open Questions Resolved — Routed to BUILD

### ⚠️ PREREQUISITE GATE

**DO NOT BEGIN THIS TICKET UNTIL WO-547 IS CLOSED AND IN 07_ARCHIVED.**
Phase 3 reads from `log_clinical_vitals` and `log_session_events`. If WO-547's event logging pipeline is broken, Phase 3 will display empty panels. Testing the Session Record panel against a broken data pipeline produces false QA results.

---

### Architecture Decisions (Open Questions Resolved)

**Q1 — Vitals data persistence strategy: localStorage vs. Supabase re-query?**

[DECISION: Supabase re-query via `usePhase3Data` hook]

`vitalsChartData` in `DosingSessionPhase.tsx` is derived from `updateLog` (in-component state, not persisted to localStorage). Writing it to localStorage on every `handleSaveUpdate` would duplicate data and introduce a stale-read risk if the session is edited. The correct approach:

- BUILDER extends `usePhase3Data.ts` with a `fetchSessionVitals(sessionId)` function that queries `log_clinical_vitals` filtered by `session_id`.
- This is the same table already written to by `handleSaveUpdate` (confirmed in `DosingSessionPhase.tsx` lines 494–505).
- For the event ledger, BUILDER queries `log_session_events` filtered by `session_id` and renders entries as read-only rows in `LiveSessionTimeline`.
- No localStorage dependency. No new tables. No schema changes.

**Q2 — Session x-axis domain: final recorded duration or last vitals elapsed time?**

[DECISION: Final recorded duration from `log_clinical_records.session_ended_at`]

Calculate total session duration as:
```
duration_seconds = session_ended_at - COALESCE(dose_administered_at, created_at)
```
from `log_clinical_records` for the completed session. This is the authoritative session boundary. Fallback (if `session_ended_at` is NULL for any reason): use `MAX(elapsed_seconds)` from `log_clinical_vitals` entries for that session.

The chart x-axis domain must be `[0, duration_seconds]` so the full session arc is always visible — not just the time range of logged vitals.

**Q3 — Panel header format: session date or session number?**

[DECISION: Substance + Date format]

Header reads: **`"[Substance] Dosing Session · [Date]"`**

Example: `"Psilocybin Dosing Session · March 1, 2026"`

Rationale: Session number alone is not self-explanatory when viewing historical records. The substance name is the most clinically significant identifier. Date gives temporal context for integration documentation.

Source fields: `ref_substances.substance_name` (via `log_clinical_records.substance_id`) + `log_clinical_records.session_date` (or `dose_administered_at` date portion).

---

### Files to Touch

1. `src/hooks/usePhase3Data.ts` — EXTEND: add `fetchSessionVitals(sessionId)` and `fetchSessionEvents(sessionId)` functions
2. `src/components/wellness-journey/IntegrationPhase.tsx` — ADD: Session Record accordion panel at the top, above Session Snapshot Strip, using data from `usePhase3Data`
3. No changes to `DosingSessionPhase.tsx`, `SessionVitalsTrendChart`, or `LiveSessionTimeline` components

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
