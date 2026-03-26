---
id: WO-688
title: "Phase 2 dosing session instantly scrolls to bottom/footer when transitioning from Phase 1 on desktop"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-24
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
files: []
---

## Request
Phase 2 dosing session — when I finish Phase 1 (on desktop), Phase 2 opens and correctly hides unnecessary items up top, but it instantly scrolls to the bottom of the page displaying the footer. Is this intentional?

## LEAD Architecture
This is a UX regression (not intentional). When Phase 2 mounts, something is triggering a scroll jump — likely a `scrollIntoView()` or `focus()` call on a newly-rendered element at the bottom of the DOM, or a `useEffect` hook that fires a `window.scrollTo()` with an incorrect Y value after the Phase 1→2 state transition. The fix requires finding wherever the phase-transition scroll is initiated and ensuring it scrolls to the **top** (or a logical Phase 2 anchor) rather than the bottom.

Likely files:
- `src/pages/DosingSession.tsx` (or equivalent dosing session orchestrator)
- Phase transition hooks or state managers controlling the phase switch
- Any `useEffect` that calls `scrollTo`, `scrollIntoView`, or `scroll` after phase state updates

## Open Questions
- [ ] Confirm: is this scroll-to-bottom happening on ALL Phase 1→2 transitions or only specific tablet/protocol combinations?
