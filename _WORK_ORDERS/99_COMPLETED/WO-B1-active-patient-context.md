---
id: WO-B1
title: "Track B1 — ActivePatientContext + URL Param Routing"
track: B
priority: P1
status: 02_TRIAGE
created: 2026-03-21
author: ANTIGRAVITY (planning), BUILDER (execution)
depends_on: WO-B0, WO-B0b, WO-B0c
blocked_by: B0 cluster (must be stable before B1)
references:
  - STABILIZATION_BRIEF.md Section 5
  - UI_UX_GUARDRAILS.md — Section: Navigation Must Carry Patient Context
  - HANDOFF_2026-03-21.md — Track B — Revised Scope
affects:
  - src/pages/WellnessJourney.tsx
  - src/contexts/ActivePatientContext.tsx (NEW — already created)
  - src/pages/ProtocolDetail.tsx
  - src/components/layout/Sidebar.tsx (or equivalent)
  - src/App.tsx (context provider wiring)
verification: Manual navigation test ppnportal.net — Protocol Detail → Wellness Journey patient preserved
---

# WO-B1 — ActivePatientContext + URL Param Routing

## Context

`ActiveSessionsContext` is already wired in `App.tsx` at `<ActiveSessionsProvider>`
(confirmed Track A, line 547). `ActivePatientContext` — per the handoff — does not
yet exist as a separate context and is not yet wired.

Per `STABILIZATION_BRIEF.md` Section 5, the minimum mechanism required is:
1. `?patientUuid=<uuid>` in the URL initializes the context on page load
2. A lightweight `ActivePatientContext` React provider holds the resolved
   `{ activePatientUuid, activeSessionId }` globally

## What Must Be Built

### Step 1 — Create `src/contexts/ActivePatientContext.tsx`

```typescript
interface ActivePatientContextValue {
    activePatientUuid: string | null;
    activeSessionId: string | null;
    setActivePatient: (uuid: string | null, sessionId?: string | null) => void;
    clearActivePatient: () => void;
}
```

- Reads `?patientUuid=` from URL on initialization
- Writes back to URL when `setActivePatient` is called (so the URL always
  reflects current state — supports bookmark, back button, page refresh)
- Does NOT derive clinical state from the URL param. The URL param is navigation
  metadata only. Clinical source of truth is the DB.

### Step 2 — Wire provider in `App.tsx`

Wrap the router tree with `<ActivePatientProvider>`.

### Step 3 — Update `WellnessJourney.tsx`

Instead of always showing the patient selection modal on mount:
1. Check `activePatientUuid` from `ActivePatientContext`
2. If present, pre-load that patient without showing the modal
3. If absent, show the modal as today

This is the fix for "patient selection modal fires on every visit to Wellness Journey."

### Step 4 — Update `ProtocolDetail.tsx`

When navigating from Protocol Detail to Wellness Journey:
- Pass `?patientUuid=<patientUuid>` in the navigation call
- Ensure `activePatientUuid` is set in context before navigation

### Step 5 — Sidebar/TopHeader contextual links

When `activePatientUuid` is set, contextual navigation links should appear:
- "Back to Patient Journey" → `/wellness-journey?patientUuid=<uuid>`
- "View Protocol" → `/protocol/<protocolId>?patientUuid=<uuid>`

> Per UI_UX_GUARDRAILS.md: "Preserve patient context when moving between
> patient-specific areas. Show when user is in patient-specific mode vs. general mode."

## Constraints

- URL param **carries context**, does not **define clinical state**
- Never derive `sessionId`, `phase`, or `cycleNumber` from URL params
- If `activePatientUuid` from URL doesn't resolve to a valid DB patient, clear
  context and show the selection modal
- Do NOT modify the patient-selection modal itself — just conditionally skip it

## Out of Scope

- "Begin New Treatment Cycle" action (WO-B2)
- Sidebar redesign or major navigation refactor — only additive contextual links

## Verification

1. Navigate to Protocol Detail for Patient X
2. Click "Open in Wellness Journey" — Wellness Journey pre-loads Patient X
3. No selection modal should appear
4. Refresh the page — Patient X still pre-loaded (URL param survived)
5. Navigate to Sidebar → different page → Sidebar shows "Back to Patient Journey" link
6. Run /phase2-session-regression checklist
