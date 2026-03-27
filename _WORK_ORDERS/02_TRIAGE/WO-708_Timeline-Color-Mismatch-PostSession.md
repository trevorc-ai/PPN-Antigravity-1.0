---
id: WO-708
title: "Live Session Timeline: event colors differ between live session and post-session closeout view"
owner: PRODDY
status: 02_TRIAGE
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
fast_track: true
origin: "User-reported — timeline item colors do not match after clicking End Dosing Session"
admin_visibility: no
admin_section: ""
pillar_supported: "3 — QA and Governance, 1 — Safety Surveillance"
task_type: "bug-fix"
related_tickets:
  - WO-707 (Post-session vitals chart blank — same accordion, same audit scope)
  - WO-694 (Phase 2 Vitals/Timeline Bugs — related scope)
files:
  - src/components/wellness-journey/LiveSessionTimeline.tsx
  - src/components/wellness-journey/SessionCloseoutView.tsx
---

## User Report

Timeline event row colors during a live dosing session are correct (green for session
updates, indigo for doses, amber for observations, etc.). After clicking "End Dosing
Session," the same events are displayed in the closeout accordion but appear in the wrong
colors — most falling back to slate-grey (`general_note` style).

---

## LEAD Root Cause Analysis

### Two-State Data Source

`LiveSessionTimeline` has two event data sources controlled by the `active` prop:

**During session (`active=true`):**
Events are added via `addLocalEvent()` using optimistic local state. The `type` field is
explicitly set to the correct lowercase `EVENT_CONFIG` key (e.g. `'session_update'`,
`'dose_admin'`, `'patient_observation'`). Colors render correctly.

**Post-session (`active=false`):**
Events are fetched from the DB via `getTimelineEvents()`. Line 213 of
`LiveSessionTimeline.tsx`:
```tsx
type: row.ref_flow_event_types?.event_type_code || 'general_note',
```

The `event_type_code` from `ref_flow_event_types` may be:
1. **Legacy uppercase codes** stored before the code vocabulary was normalised:
   `'NOTE'`, `'OBSERVATION'`, `'DOSE'` — these exist in `EVENT_CONFIG` but only partially
   (DOSE resolves indigo correctly, but `NOTE` has no match → falls back to `general_note`).
2. **New lowercase codes** stored by the current write path:
   `'session_update'`, `'dose_admin'` — these DO match `EVENT_CONFIG` but older existing
   sessions still have the legacy uppercase codes in the DB.
3. **`general_note` fallback** (line 213) — triggers anytime `ref_flow_event_types` JOIN
   fails or the code is absent.

The lookup at line 334 and 431 of `LiveSessionTimeline.tsx`:
```tsx
const conf = EVENT_CONFIG[e.type] ?? EVENT_CONFIG['general_note'];
```
...silently degrades any unmatched code to grey, with no warning.

### Secondary Issue: `visible` prop filters events in post-session

Post-session, `SessionCloseoutView` passes `visible={chartVisible}` to `LiveSessionTimeline`
(line 117). `chartVisible` tracks the live chart's visibility toggles. If the user never
opened the chart or toggled any series, the default state may hide categories of events.

---

## Required Fixes

### Fix 1 — Case-normalise + alias-map DB event codes (PRIMARY)

In `LiveSessionTimeline.tsx`, when mapping DB rows to local `TimelineEvent[]`, normalise
the `event_type_code` before the `EVENT_CONFIG` lookup:

```tsx
// Normalise DB codes → EVENT_CONFIG keys
const CODE_ALIAS_MAP: Record<string, string> = {
    'NOTE':         'general_note',
    'OBSERVATION':  'patient_observation',
    'DOSE':         'dose_admin',
    'SESSION_UPDATE': 'session_update',
    'SAFETY':       'safety_event',
    'INTERVENTION': 'clinical_decision',
    'PEAK':         'patient_observation',
    'CLOSE':        'session_completed',
};

function normaliseEventCode(raw: string): string {
    if (!raw) return 'general_note';
    // Check direct match first (covers current lowercase codes)
    if (EVENT_CONFIG[raw]) return raw;
    // Check alias map (covers legacy uppercase codes)
    const alias = CODE_ALIAS_MAP[raw.toUpperCase()];
    if (alias && EVENT_CONFIG[alias]) return alias;
    // Final fallback
    return 'general_note';
}
```

Apply `normaliseEventCode()` at line 213:
```tsx
type: normaliseEventCode(row.ref_flow_event_types?.event_type_code || ''),
```

### Fix 2 — Default `visible` to show all in post-session (SECONDARY)

In `SessionCloseoutView.tsx`, when passing `visible` to `LiveSessionTimeline`, **do not
pass the live session's `chartVisible` state**. Post-session is a read-only record.
All event categories should be visible by default:

```tsx
// BEFORE:
<LiveSessionTimeline
    sessionId={...}
    active={false}
    visible={chartVisible}       // ← wrong: uses live filter state
    sessionStartMs={sessionStartMs}
/>

// AFTER:
<LiveSessionTimeline
    sessionId={...}
    active={false}
    visible={{ hr: true, bp: true, temp: true, events: true }}  // ← show all
    sessionStartMs={sessionStartMs}
/>
```

### Fix 3 — Forensic audit of `EVENT_CONFIG` vs `ref_flow_event_types` codes (MANDATORY PRE-BUILD)

BUILDER must run the following before coding:
```sql
SELECT DISTINCT event_type_code FROM ref_flow_event_types ORDER BY 1;
```
And cross-reference against `EVENT_CONFIG` keys in `LiveSessionTimeline.tsx`.
Any DB code without a match in `EVENT_CONFIG` must be added to `CODE_ALIAS_MAP` or
added as a new entry in `EVENT_CONFIG`. No code should silently degrade to `general_note`.

---

## QA Criteria

- [ ] All timeline events in post-session view display the same color as they did during
      the live session (dose = emerald, session update = emerald, notes = slate, etc.)
- [ ] No event type renders grey in post-session unless it genuinely maps to `general_note`
- [ ] Post-session timeline shows ALL event types (no events hidden by filter flags)
- [ ] Live session color display is NOT changed by this fix (only affects DB fetch path)
- [ ] INSPECTOR must compare screenshots: live session timeline vs post-session timeline
      for the same session showing identical colors
- [ ] Run `/phase2-session-regression` before and after

---

## Regression Risk

**LOW-MEDIUM** — `normaliseEventCode()` is additive. `CODE_ALIAS_MAP` only applies to
the DB fetch path (`active=false`). Live session optimistic events are not affected.

---
- **Data from:** `ref_flow_event_types` (DB fetch via `getTimelineEvents()`) — `event_type_code` field
- **Data to:** Read-only display — no DB writes; normalised codes render in `LiveSessionTimeline` post-session view
- **Theme:** Tailwind CSS, PPN design system — `LiveSessionTimeline.tsx`, `SessionCloseoutView.tsx` EVENT_CONFIG color map
