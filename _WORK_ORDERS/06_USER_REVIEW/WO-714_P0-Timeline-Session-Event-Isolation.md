---
id: WO-714
title: "P0 Regression — Live Session Timeline shows stale events from previous sessions on new session start"
owner: BUILDER
status: 06_USER_REVIEW
authored_by: INSPECTOR (regression triage)
priority: P0
created: 2026-03-27
fast_track: true
origin: "User-reported regression — confirmed immediately after WO-694/WO-708 QA pass"
admin_visibility: no
admin_section: ""
pillar_supported: "1 — Safety Surveillance, 3 — QA and Governance"
task_type: "bug-fix"
related_tickets:
  - WO-694 (BUG-05/06 introduced the unfiltered ppn:session-event listener)
  - WO-708 (shares LiveSessionTimeline.tsx)
  - WO-707 (shares SessionCloseoutView.tsx)
files:
  - src/components/wellness-journey/LiveSessionTimeline.tsx
  - src/components/wellness-journey/DosingSessionPhase.tsx
database_changes: no
affects:
  - src/components/wellness-journey/LiveSessionTimeline.tsx
  - src/components/wellness-journey/DosingSessionPhase.tsx
---

## P0 User Report (2026-03-27)

On starting a brand new dosing session, the **Live Session Timeline immediately shows
events from previous sessions** — including timestamps from prior sessions (e.g. 01:58 PM,
05:24 PM) and a `[RESCUE PROTOCOL] Session submitt...` entry from a completely different
session. The current session timer reads `00:01:19`. This is a safety-critical regression:
the practitioner cannot trust what they see in the live timeline during an active session.

---

## Root Cause (INSPECTOR Forensic)

### The unfiltered global event listeners

`LiveSessionTimeline.tsx` has **two** global `window.addEventListener` handlers with **no
`sessionId` isolation**:

**1. `handleDoseRegistered` (WO-559, pre-existing)**
```tsx
useEffect(() => {
    const handleDoseRegistered = (e: Event) => {
        const { type, label } = (e as CustomEvent).detail ?? {};
        if (!type) return;
        // ⚠️ NO sessionId check — accepts any ppn:dose-registered on the window
        const optimistic: TimelineEvent = { id: `dose-reg-${Date.now()}`, type, ... };
        setEvents(prev => [...prev, optimistic]);
    };
    window.addEventListener('ppn:dose-registered', handleDoseRegistered);
    return () => window.removeEventListener('ppn:dose-registered', handleDoseRegistered);
}, []);
```

**2. `handleSessionEvent` (WO-694 BUG-05/06, NEW — introduced the regression)**
```tsx
useEffect(() => {
    const handleSessionEvent = (e: Event) => {
        const { type, label, timestamp } = (e as CustomEvent).detail ?? {};
        if (!type) return;
        // ⚠️ NO sessionId check — accepts any ppn:session-event on the window
        const optimistic: TimelineEvent = { id: `session-ev-${Date.now()}`, type, ... };
        setEvents(prev => [...prev, optimistic]);
    };
    window.addEventListener('ppn:session-event', handleSessionEvent);
    return () => window.removeEventListener('ppn:session-event', handleSessionEvent);
}, []);
```

### How stale events appear on new session

When a new session loads:
1. A prior session's `DosingSessionPhase` may still be in React's tree during the
   transition (or the component re-uses the same mounted instance).
2. The prior session's `fetchLocalEvents()` call (or `handleSaveUpdate` cleanup) fires
   `ppn:session-event` dispatches on `window` with `{type, label, timestamp}` — **no
   `sessionId` in the payload**.
3. The new session's `LiveSessionTimeline` is already mounted with its new `sessionId`.
   Its `handleSessionEvent` listener has no way to reject events that belong to the
   prior session — it adds them all as optimistic entries.
4. Additionally: the baseline vitals seeder (WO-B6b) fires `ppn:dose-registered` with
   `{type: 'vital_check', label: 'Baseline Vitals...'}` on every mount. If this is
   firing during a prior session's cleanup, the new timeline catches it.

### Why the dispatch payloads don't include sessionId

Both `ppn:session-event` dispatches in `DosingSessionPhase.tsx` (lines 936 and 813) omit
`sessionId` from the detail:
```tsx
window.dispatchEvent(new CustomEvent('ppn:session-event', {
    detail: { type: 'session_update', label: sessionUpdateDesc, timestamp: ... }
    // ⚠️ sessionId NOT included
}));
```

---

## Required Fixes

### Fix 1 — Add `sessionId` to all dispatch payloads (DosingSessionPhase.tsx)

For every `window.dispatchEvent` of `ppn:session-event` and `ppn:dose-registered` in
`DosingSessionPhase.tsx`, add the current `sessionId` (i.e. `resolvedId` / `sessionUUID`)
to the detail:

```tsx
// ALL ppn:session-event dispatches — add sessionId:
window.dispatchEvent(new CustomEvent('ppn:session-event', {
    detail: {
        sessionId: resolvedId,   // ← ADD THIS
        type: 'session_update',
        label: sessionUpdateDesc,
        timestamp: new Date().toISOString(),
    },
}));

// ALL ppn:dose-registered dispatches — add sessionId:
window.dispatchEvent(new CustomEvent('ppn:dose-registered', {
    detail: {
        sessionId: resolvedId,   // ← ADD THIS
        type: eventType,
        label: dispatchLabel ?? eventLabel,
        elapsedSec: elSec,
    },
}));
```

There are **4 dispatch sites** in `DosingSessionPhase.tsx` (lines ~372, ~403, ~813, ~1137).
BUILDER must update all four.

### Fix 2 — Add `sessionId` guard to both listeners (LiveSessionTimeline.tsx)

In `handleDoseRegistered`, add a session isolation guard:
```tsx
const handleDoseRegistered = (e: Event) => {
    const { sessionId: evSessionId, type, label } = (e as CustomEvent).detail ?? {};
    // Guard: if the event carries a sessionId, it must match OUR sessionId.
    // If it carries no sessionId (legacy), accept it (backwards compat).
    if (evSessionId && evSessionId !== sessionId) return;
    if (!type) return;
    // ... rest of handler unchanged
};
```

In `handleSessionEvent`, same guard:
```tsx
const handleSessionEvent = (e: Event) => {
    const { sessionId: evSessionId, type, label, timestamp } = (e as CustomEvent).detail ?? {};
    if (evSessionId && evSessionId !== sessionId) return;   // ← ADD THIS
    if (!type) return;
    // ... rest of handler unchanged
};
```

**Backwards compatibility note:** The `if (evSessionId && evSessionId !== sessionId) return`
guard only rejects events that explicitly carry a DIFFERENT sessionId. Events dispatched
without `sessionId` in the payload will still be accepted (for any pre-existing callers
that haven't been updated yet). This ensures no regression on other event sources.

### Fix 3 — Add `sessionId` to `useEffect` dependency arrays

Both listener `useEffect` hooks currently have `[]` as their dependency array. After
adding the `sessionId` guard, `sessionId` must be in deps so the listener correctly
uses the current session's ID if it changes:

```tsx
useEffect(() => {
    // handler uses `sessionId` from closure...
    window.addEventListener('ppn:dose-registered', handleDoseRegistered);
    return () => window.removeEventListener('ppn:dose-registered', handleDoseRegistered);
}, [sessionId]);  // ← was []
```

---

## QA Criteria

- [ ] Start a new session immediately after viewing someone else's session — timeline must
      show ONLY the new session's events (initial dose entry from WO-B6b is OK)
- [ ] Session Update logged during live session → appears in timeline immediately (BUG-05/06 must still work)
- [ ] Events from patient A's session do NOT appear in patient B's concurrent session
- [ ] Run `/phase2-session-regression` — all 4 scenarios must PASS

## Regression Risk

**LOW** — change is purely additive (adds a field to the dispatch payload and a guard
to the listener). The `if (evSessionId && evSessionId !== sessionId) return` guard is
non-breaking for legacy callers.

---
## INSPECTOR 02.5 CLEARANCE: FAST-PASS
- `database_changes: no` — no schema changes; client-only JS fix.
- No frozen files in `files:` list.
- UI Standards Pre-Build Gate: N/A — no visible layout changes.
- **⚠️ MANDATORY REGRESSION GATE (Phase 3.5):**
  - Trigger files: `LiveSessionTimeline.tsx`, `DosingSessionPhase.tsx`
  - Required workflow: `/phase2-session-regression` (all 4 scenarios)
Cleared for build.
Signed: INSPECTOR | Date: 2026-03-27

---
- **Data from:** No new data sources — fixes event-bus isolation only
- **Data to:** No DB writes — optimistic local state isolation fix
- **Theme:** Tailwind CSS, PPN event bus — `LiveSessionTimeline.tsx`, `DosingSessionPhase.tsx`

---

## INSPECTOR QA — Phase 2 Audit (2026-03-27)

### Phase 1: Scope & DB Audit
- [x] **Database Freeze Check:** PASS — client-only JS; no CREATE/DROP/ALTER
- [x] **Scope Check:** PASS — only `LiveSessionTimeline.tsx` and `DosingSessionPhase.tsx` touched
- [x] **Refactor Check:** PASS — purely additive guard; no code reorganized

### Phase 2: Code Audit (Source-Verified)
- [x] Guard added to `handleDoseRegistered` listener (line 297): `if (evSessionId && evSessionId !== sessionId) return`
- [x] Guard added to `handleSessionEvent` listener (line 322): `if (evSessionId && evSessionId !== sessionId) return`
- [x] `sessionId` added to `useEffect` deps for both listeners (lines 310, 335)
- [x] `sessionId` added to all 5 `ppn:dose-registered`/`ppn:session-event` dispatch payloads in `DosingSessionPhase.tsx`
- [x] Backwards compatibility confirmed — legacy callers without `sessionId` in payload still accepted (guard only fires if `evSessionId` is present AND mismatches)
- [x] Lint error remediated — outer dispatch at line 373 uses `journey.sessionId ?? journey.session?.sessionId` (not `sid` which is only in scope in `isRedose` block)

### Phase 3.5: Regression
- Browser agent CANNOT_TEST: live session cockpit only accessible during an active in-progress session.
- Source fix verified clean via grep. **⚠️ USER VISUAL CONFIRMATION REQUIRED in live session.**

INSPECTOR VERDICT: ✅ APPROVED (pending user visual confirmation) | Date: 2026-03-27
