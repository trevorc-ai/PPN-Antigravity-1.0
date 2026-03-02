---
id: WO-559
title: "Phase 2 Event Completeness — Additional Dosing + Vitals Pre-Population"
status: 03_BUILD
owner: BUILDER
created: 2026-03-01T20:12:47-08:00
failure_count: 0
priority: P1
authored_by: LEAD
source: "User notes 2026-03-01 live testing session"
---

## LEAD ARCHITECTURE

### Context

Two related Phase 2 data completeness issues confirmed in live testing:

**Issue A — Additional Dosing not logged:**
Re-dosing (supplemental dose) is a standard clinical event in long-form psilocybin, MDMA, and ketamine sessions — occurring in a significant proportion of real protocols. When a practitioner logs an additional dose in the Phase 2 session, it does not appear in the event ledger or graph. This is a P1 gap: re-dosing times are clinically significant and must be part of the permanent session record.

**Issue B — Baseline vitals not pre-populated:**
Every time the practitioner opens the Session Update vitals form, all fields are blank. They must re-enter HR / BP / SpO2 from scratch. The correct behavior: once baseline vitals are established (first Session Update), subsequent Session Update forms should pre-populate with either the baseline vitals (first logged) or the most recent vitals — whichever is implemented more simply and reliably.

### Architecture Decisions

**Issue A — Additional Dosing:**

1. **Find the Additional Dose button/handler** in `DosingSessionPhase.tsx`. It likely calls a state update but does NOT dispatch a `ppn:session-event` CustomEvent or call `createTimelineEvent`.

2. **Fix:** On Additional Dose save, dispatch a `ppn:session-event` with `type: 'additional_dose'` and call `createTimelineEvent` with:
   - `event_type: 'additional_dose'`
   - `label: 'Additional Dose — [substance] [amount]'` (use whatever fields the additional dose form captures)
   - `session_id: resolvedSessionId` (same UUID guard as WO-547)

3. **Graph pin:** The `SessionVitalsTrendChart` must render `additional_dose` events as a distinct pin color/icon — suggest amber/orange to differentiate from session updates (teal) and safety events (red). BUILDER must add `additional_dose` to the pin renderer's event type switch.

4. **Ledger entry:** `LiveSessionTimeline` ledger must display `additional_dose` entries. They should be formatted as: `"Additional Dose · [T+HH:MM] · [amount] [substance]"`.

**Issue B — Vitals Pre-Population:**

5. **Strategy: use most recent vitals** — simpler than baseline tracking. On Session Update form open, read the last entry from `updateLog` state (which tracks all session updates) and pre-fill HR, SBP, DBP, SpO2 inputs with those values.

6. **If `updateLog` is empty** (first update of session): pre-fill from `journey.session?.baselineVitals` if that field exists, otherwise leave blank (true first entry).

7. **No DB read required** — `updateLog` is already in component state. This is a pure UI pre-fill, not a persistence change.

8. **Inputs remain editable** — pre-population is a convenience, not a lock.

### Files Likely Touched

- `src/components/wellness-journey/DosingSessionPhase.tsx` — additional dose event dispatch + vitals pre-fill
- `src/components/wellness-journey/SessionVitalsTrendChart.tsx` (or equivalent chart component) — add `additional_dose` pin type
- `src/components/wellness-journey/LiveSessionTimeline.tsx` — add `additional_dose` entry rendering (read-only verify — may already handle via generic event type)

---

## Acceptance Criteria

- [ ] Logging an additional dose creates a timestamped entry in the Phase 2 event ledger
- [ ] Additional dose entry is formatted: `"Additional Dose · T+[elapsed] · [amount/substance if available]"`
- [ ] Additional dose event appears as a distinct pin on the vitals trend graph (amber/orange — different from session update and safety pins)
- [ ] Additional dose event is persisted to `log_session_timeline_events` via `createTimelineEvent` with `event_type: 'additional_dose'` (UUID guard applied — no write in demo/test sessions)
- [ ] Session Update form pre-populates HR, BP, SpO2 with values from the most recent prior session update when one exists
- [ ] Session Update form is blank on the first update of a session (no prior data to pre-fill from)
- [ ] All pre-populated vitals fields remain editable — they are suggestions, not locks
- [ ] No regressions in existing Session Update, Rescue Protocol, or Adverse Event flows
- [ ] TypeScript: `npx tsc --noEmit` = 0 errors

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
