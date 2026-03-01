---
id: WO-528
title: "Phase 2 HUD: Unified Session Event Graph"
status: 03_BUILD
owner: BUILDER
authored_by: PRODDY
created: 2026-03-01T00:39:46-08:00
amended: 2026-03-01T00:45:45-08:00
amendments:
  - "Added toggle show/hide per line/event-type to scope"
  - "X-axis resolved: elapsed session time (T+0:00:00), not wall-clock"
  - "Added per-reading dot marker requirement"
  - "LEAD granted layout flexibility (multi-line, separate graphs, or overlays)"
  - "Open Question 2 resolved; replaced with layout decision question"
  - "All 5 LEAD open questions answered — ready for BUILD"
failure_count: 0
priority: P1
---

## PRODDY PRD

> **Work Order:** WO-528 — Phase 2 HUD: Unified Session Event Graph  
> **Authored by:** PRODDY  
> **Date:** 2026-03-01  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

During a live dosing session (Phase 2), the "Session Vitals Trend" chart displays only manually-entered physiological readings (HR, BP, Temp). All other recorded events — dose administrations, rescue protocols, adverse events, session updates (affect, responsiveness, comfort), timeline quick-actions — are invisible on the graph. A practitioner monitoring a multi-hour session must mentally correlate what happened on the timeline with what happened to the patient's physiology. Without a unified view, patterns such as "HR spiked immediately after the second dose" or "adverse event coincided with BP threshold breach" are missed in real time.

---

### 2. Target User + Job-To-Be-Done

A licensed psychedelic therapy facilitator needs to see every recorded session event plotted as timestamped markers on the vitals chart so that they can immediately correlate physiological changes with clinical actions during a live dosing session.

---

### 3. Success Metrics

1. **All event categories** (Vitals, Dose Admin, Rescue Protocol, Adverse Event, Session Update, Timeline Quick-Actions) appear as distinct, labeled markers on the chart within **≤2 seconds** of being logged, confirmed across 5 consecutive QA sessions.
2. **Zero chart render crashes** when 0 vitals snapshots and ≥1 non-vitals event exist, validated across 10 QA runs with partial data states.
3. **100% of events logged during a live session** map to a visible marker at the correct elapsed time (T+HH:MM:SS) on the chart, verified by side-by-side comparison of the Live Session Timeline and the chart in a single QA session.

---

### 4. Feature Scope

#### ✅ In Scope
- Extend `SessionVitalsTrendChart` to accept a new `events` prop: an array of all session events sourced from the `LiveSessionTimeline`, `SessionUpdate` panel, and all three action-button flows (Session Update, Rescue Protocol, Adverse Event)
- **X-axis is elapsed session time** starting at `T+0:00:00` when the session timer starts — not wall-clock time. All vitals data points and event markers are plotted relative to session start. The existing mock data using absolute times must be replaced with elapsed-time offsets
- **Each recorded reading renders as a dot** on the chart at its elapsed time position — practitioners see exactly when each data point was entered
- Render each event as a visual marker (vertical line, dot cluster, icon pin, or overlay — LEAD chooses the layout approach) color-coded by event type using the existing `EVENT_CONFIG` palette from `LiveSessionTimeline.tsx`
- **LEAD has layout flexibility**: event types may be shown as additional lines on the same graph, as a separate event-strip panel beneath the vitals graph, as overlay icon-pins, or as any combination LEAD determines is clearest — the goal is correlation, not a prescriptive layout
- Show compact symbol labels per event type (e.g. `💊 DOSE`, `⚠ EVENT`, `🛟 RESCUE`, `📋 UPDATE`)
- **Toggle buttons** in the chart header — one per line/event-type — allow the practitioner to show or hide individual series/markers to avoid cognitive overload. Toggled state is in-memory only (not persisted)
- On hover of any data point or event marker, display event type, description, and elapsed time in the existing `VitalsTooltip` style
- A legend row reflects the toggle-button state (grayed out when hidden)
- The chart must render gracefully with zero vitals readings and ≥1 event (no blank state)

#### ❌ Out of Scope
- Wearable / Bluetooth device integrations (covered by WO-415)
- Changing the underlying database schema or log tables
- Retroactively loading events from previous sessions onto the chart
- Moving or replacing the `LiveSessionTimeline` scroll list — the chart complements it, does not replace it
- PDF/export formatting of the chart (separate work order if needed)
- Any Phase 1 or Phase 3 HUD modifications
- Persisting toggle-button state between page loads

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** The Phase 2 live session HUD is currently in active testing with Dr. Allen. The chart shows static mock data and zero real events. This feature directly enables the clinical goal of real-time pattern recognition during a live dosing session and is the primary observability gap identified in the WO-527 HUD audit scope. Not a demo blocker today, but a meaningful gap for any real session.

---

### 6. Open Questions for LEAD

1. **Event data flow:** Should `DosingSessionPhase` lift the combined event array (from `updateLog` + timeline events + form submissions) into shared state and pass it down to `SessionVitalsTrendChart` as a prop — or should `SessionVitalsTrendChart` subscribe to its own event source independently?
2. **Visual layout decision (LEAD's call):** The user has given LEAD latitude on how event types are displayed — separate lines, an icon-pin overlay strip, a secondary panel beneath the vitals graph, or a hybrid. LEAD must choose the approach that best avoids cognitive overload while maintaining timeline correlation clarity, and document the decision before BUILDER starts.
3. **Rescue Protocol and Adverse Event data shape:** These events are currently submitted via `onOpenForm('rescue-protocol')` and `onOpenForm('safety-and-adverse-event')` — do these forms emit a timestamp and type back to the parent on submission? If not, a callback must be added before the elapsed-time marker can be plotted.
4. **Real-time refresh cadence:** The `LiveSessionTimeline` polls every 30 seconds. Should the vitals chart re-render on the same interval, or be event-driven (triggered immediately on each user action)?
5. **Session Update dual representation:** A "Session Update" can contain both vitals data (HR/BP) AND qualitative fields (Affect, Responsiveness, Comfort). Should a single Session Update produce both a dot on the vitals line AND an event marker — or only whichever data fields were actually filled in?

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
- [x] Frontmatter updated: `owner: BUILDER`, `status: 03_BUILD`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD Answers to Open Questions

**Q1 — Event data flow:**  
`DosingSessionPhase` lifts state. `updateLog` already lives there. Add a new `eventLog` state array in `DosingSessionPhase` for non-vitals events. Pass the combined `events` array (both logs merged) down as a new prop to `SessionVitalsTrendChart`. Keep data flow unidirectional — no independent subscription inside the chart.

**Q2 — Visual layout (LEAD decision):**  
**Icon-pin overlay strip.** Render a narrow dedicated horizontal event lane beneath the vitals chart lines. Each event is an icon-pin at its elapsed-time X position, color-coded by event type from `EVENT_CONFIG` in `LiveSessionTimeline.tsx`. The pins share the same X-axis as the vitals lines, making vertical correlation visually obvious without cluttering the Y-axis.

**Q3 — Rescue & Adverse Event data shape:**  
These forms do NOT currently emit a timestamp back to the parent. Builder must add a lightweight `onEventLogged` callback in `DosingSessionPhase`. When `onComplete` fires for `rescue-protocol` or `safety-and-adverse-event`, record `{ type, elapsed, timestamp }` into the new `eventLog` state. This feeds the chart events prop.

**Q4 — Refresh cadence:**  
**Event-driven.** Each user action updates in-memory state → prop flows to chart → Recharts re-renders immediately. No polling interval needed — the data is local state, not fetched from Supabase.

**Q5 — Session Update dual representation:**  
A Session Update produces **two markers** if both data types are present:
- If HR or BP entered → dot plotted on the vitals line (already handled by `updateLog`)
- Always → a `📋 UPDATE` event pin in the overlay strip at that elapsed time
A pure-qualitative update (Affect/Comfort only, no vitals) still renders the UPDATE pin. The two representations are additive, not mutually exclusive.
