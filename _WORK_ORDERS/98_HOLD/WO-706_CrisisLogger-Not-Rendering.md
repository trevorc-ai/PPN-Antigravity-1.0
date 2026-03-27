---
id: WO-706
title: "Crisis Logger buttons do not render in live Phase 2 sessions"
owner: BUILDER
status: 04_BUILD
unfrozen_at: 2026-03-27
unfreeze_authorization: "USER explicit approval 2026-03-27 — P0 clinical safety; DosingSessionPhase.tsx and MobileCockpit.tsx now clear"
authored_by: LEAD (fast-track)
priority: P0
created: 2026-03-27
fast_track: true
origin: "User-reported live session bug — Crisis Logger buttons not visibly rendering during active Phase 2 sessions"
admin_visibility: no
admin_section: ""
pillar_supported: "1 — Safety Surveillance"
task_type: "bug-fix"
database_changes: no
related_tickets:
  - WO-696 (CrisisLogger live wiring — implementation WO that shipped this component)
  - WO-553 (WellnessJourney.tsx — conflict risk if touching same file)
files:
  - src/components/wellness-journey/MobileCockpit.tsx
  - src/components/wellness-journey/DosingSessionPhase.tsx
  - src/pages/WellnessJourney.tsx (read-only audit only — may not need to touch)
---

## User Report

Crisis Logger buttons do not render in an active Phase 2 dosing session. The component is
confirmed live in `ComponentShowcase.tsx` (buttons visible there), but does not appear
during a real active session in `DosingSessionPhase.tsx`.

---

## LEAD Root Cause Analysis

### Guard (DosingSessionPhase.tsx, line 1265)
```tsx
{isLive && hasRealUUID && (
    <CrisisLogger sessionId={resolvedSessionId!} ... />
)}
```

`hasRealUUID` (line 1055) requires `resolvedSessionId` to be a UUID-pattern string:
```tsx
const resolvedSessionId = journey.sessionId ?? journey.session?.sessionId;
const UUID_RE_CHECK = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hasRealUUID = !!(resolvedSessionId && UUID_RE_CHECK.test(resolvedSessionId));
```

`journey.sessionId` is `undefined` at component render time when:

1. **Same-device session restore** — `localStorage` has `ppn_session_mode_{uuid}=live` and
   `ppn_session_start_{uuid}` correctly set, but the `readStoredSession()` call in
   `WellnessJourney.tsx` (line 229) may not have re-run if the component tree remounted
   without the stored session being present in `ACTIVE_SESSION_KEY` (a different key, only
   written by older code paths).

2. **`activePatientUuid` context load path** — The `WO-B1/B2` `useEffect` (line 242)
   resolves `sessionId` from the DB, but the async fetch has latency. During the async
   window, `journey.sessionId` is `undefined` → `hasRealUUID=false` → CrisisLogger skipped
   by React. When `setJourney` fires, the `DosingSessionPhase` tree does **not remount** —
   it re-renders, and `isLive && hasRealUUID` is re-evaluated. If this works, the logger
   should eventually appear. If it doesn't, there's a re-render suppression issue.

3. **Direct `MobileCockpit` path (mobile)** — `MobileCockpit` reads
   `journey.session?.sessionId ?? journey.sessionId ?? 'demo'` (line 19 of MobileCockpit).
   The `'demo'` fallback means the component renders in a degraded state with sessionId=`'demo'`.
   The main `DosingSessionPhase` is NOT rendered on mobile (line 1552–1557 conditional),
   so if the user was on mobile, CrisisLogger would not be mounted at all because
   `DosingSessionPhase` is excluded from the mobile render path.

### Most Likely Root Cause: MobileCockpit Missing CrisisLogger

`MobileCockpit` was not updated as part of WO-696. The component renders on mobile
(viewport < 768px) INSTEAD OF `DosingSessionPhase`. Since `CrisisLogger` was added to
`DosingSessionPhase`, it never renders on mobile. The screenshot confirms a mobile-like
viewport (narrow, tall). The user is almost certainly on a phone or narrow browser window.

---

## Required Fixes

### Fix 1 — Add CrisisLogger to MobileCockpit (PRIMARY FIX)

Inspect `MobileCockpit.tsx`. Add `CrisisLogger` mount when the cockpit is in live mode
with a real UUID session ID, mirroring the DosingSessionPhase implementation:

```tsx
{isLive && hasRealUUID && (
    <CrisisLogger
        sessionId={sessionId}
        onEventLogged={(eventType) => {
            // Stamp safety_event pin on chart
        }}
    />
)}
```

Use the same `UUID_RE` guard pattern. Do NOT use the `'demo'` fallback — CrisisLogger
must only render when there is a real DB-persisted session.

### Fix 2 — Defensive hasRealUUID in DosingSessionPhase (SECONDARY FIX)

The `resolvedSessionId` derivation (line 1053) only reads from props. Add a localStorage
fallback for the case where `journey.sessionId` hydrates async:

```tsx
// Fallback: scan localStorage for a live session UUID if journey.sessionId is not yet hydrated
const resolvedSessionId: string | undefined = (() => {
    const fromJourney = journey.sessionId ?? journey.session?.sessionId;
    if (fromJourney && UUID_RE_CHECK.test(fromJourney)) return fromJourney;
    // Fallback: find a live session UUID from localStorage storage keys
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k?.startsWith('ppn_session_mode_') && localStorage.getItem(k) === 'live') {
                const uuid = k.replace('ppn_session_mode_', '');
                if (UUID_RE_CHECK.test(uuid)) return uuid;
            }
        }
    } catch { /* localStorage unavailable */ }
    return undefined;
})();
```

> ⚠️ This is a defensive fallback only. The primary fix is Fix 1. Fix 2 must not
> introduce any logic change to other guards that use `resolvedSessionId` — BUILDER
> must audit all callsites before applying.

### Fix 3 — Dispatch ppn:session-event from onEventLogged (TERTIARY — logging gap)

Even after the component renders, Crisis Logger events do not appear in the Live Session
Timeline because `onEventLogged` in `DosingSessionPhase.tsx` only stamps the vitals chart
`eventLog`. It does NOT dispatch `ppn:session-event` (which `LiveSessionTimeline` polls
for in real-time).

Add to the `onEventLogged` callback (DosingSessionPhase.tsx line 1268):
```tsx
window.dispatchEvent(new CustomEvent('ppn:session-event', {
    detail: {
        type: 'safety_event',
        label: eventType.replace(/_/g, ' ').toLowerCase()
            .replace(/\b\w/g, c => c.toUpperCase()),
        timestamp: new Date().toISOString(),
    },
}));
```

---

## QA Criteria

- [ ] Crisis Logger renders in a live session on mobile viewport (< 768px)
- [ ] Crisis Logger renders in a live session on desktop viewport
- [ ] After a hold-to-log gesture completes, the event appears in the Live Session
      Timeline within 2 seconds (no DB poll required — CustomEvent is immediate)
- [ ] `log_red_alerts` receives the insert (verify via Supabase console)
- [ ] Crisis Logger does NOT render when `sessionId` resolves to `'demo'` or undefined
- [ ] Run `/phase2-session-regression` — no regressions in existing Phase 2 flows

---

## Regression Risk

**HIGH** — `DosingSessionPhase.tsx` and `MobileCockpit.tsx` are core Phase 2 components.
Fix 2 changes the `resolvedSessionId` derivation which is used by multiple downstream
handlers (vitals writes, timeline events, end-session flow). INSPECTOR must verify all
callsites after BUILDER completes.

INSPECTOR must run `/phase2-session-regression` before and after.

---
- **Data from:** `localStorage` (session mode/UUID fallback), `journey.sessionId` / `journey.session.sessionId` (context props), `ref_safety_event_types` (event type via live ref lookup)
- **Data to:** `log_red_alerts` (crisis event insert via `CrisisLogger` submit); `log_safety_events` (via `createSessionEvent()`)
- **Theme:** Tailwind CSS, PPN design system — `DosingSessionPhase.tsx`, `MobileCockpit.tsx`, `CrisisLogger.tsx`

---

## INSPECTOR 03_REVIEW CLEARANCE

### Phase 0: Pre-Build Review

**Fast-pass eligibility:** `database_changes: no` — no SQL/migration files in scope. FAST-PASS eligible.

**UI Standards Pre-Build Gate — DosingSessionPhase.tsx:**
- CHECK 1 (bare text-xs): ✅ PASS — no bare text-xs in JSX
- CHECK 2 (low contrast): ✅ PASS
- CHECK 3 (details/summary): ✅ PASS
- CHECK 4 (em dash): ✅ PASS — em dashes only in file header comments and console.debug strings, NOT rendered UI
- CHECK 5 (banned fonts): ✅ PASS

**UI Standards Pre-Build Gate — MobileCockpit.tsx:**
- CHECK 1 (bare text-xs): ⚠️ PRE-EXISTING — lines 214, 221: `text-xs font-bold uppercase tracking-wider` on icon FAB button labels ("Log Vitals", "Clinical Note"). These are mobile-only icon label micro-text inside `min-h-[64px]` touch targets (pattern is acceptable for mobile icon buttons). **BUILDER MUST:** upgrade to `text-xs md:text-sm` OR add inline comment justifying mobile-only exception.
- CHECK 2 (low contrast): ✅ PASS
- CHECK 3 (details/summary): ✅ PASS
- CHECK 4 (em dash): ✅ PASS
- CHECK 5 (banned fonts): ✅ PASS

**Files list correction:** `MobileCockpit.tsx` added to `files:` — it is the PRIMARY FIX TARGET per LEAD root cause analysis (CrisisLogger missing entirely from mobile render path). BUILDER must treat it as the first file to modify.

**Freeze status:** Both `DosingSessionPhase.tsx` and `MobileCockpit.tsx` are confirmed UNFROZEN as of 2026-03-27 per USER authorization.

**Pillar Classification Gate:** ✅ PASS — `pillar_supported: "1 — Safety Surveillance"`, `task_type: "bug-fix"` present.

**Analytics Data Source Gate:** N/A — no analytics files in scope.

**Data Completeness Gate:** N/A — no analytical output.

**Network Benchmark Gate:** N/A — no site-vs-network surface.

**⚠️ MANDATORY REGRESSION GATE (Phase 3.5):**
- Trigger files: `DosingSessionPhase.tsx`, `MobileCockpit.tsx`
- Required workflow: `/phase2-session-regression` (all 4 scenarios)
- All scenarios must PASS before `/finalize_feature` runs.

### INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Files unfrozen per USER authorization dated 2026-03-27. MobileCockpit.tsx pre-existing text-xs flagged for BUILDER remediation. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-27
