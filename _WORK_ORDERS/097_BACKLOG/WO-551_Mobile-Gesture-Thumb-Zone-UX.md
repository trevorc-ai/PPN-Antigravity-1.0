---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-551 — Mobile Gesture & Thumb-Zone UX Architecture  
> **Authored by:** PRODDY  
> **Date:** 2026-03-05  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement
The PPN portal's navigation model—left sidebar, top-header search, center-screen modals—is architecturally incompatible with touchscreen use. On mobile, this forces practitioners into high-friction multi-tap workflows to reach primary actions, creates ergonomic dead zones (top-left corner), and delivers no native gesture affordances (swipe, long-press, pull). Without a touch-first architecture, the portal cannot serve the majority of practitioners who access it from a phone.

---

### 2. Target User + Job-To-Be-Done
A practitioner on a mobile device needs to log, review, and act on clinical data using single-thumb gestures so that the portal feels as fast and natural as a native iOS or Android application.

---

### 3. Success Metrics
1. Primary navigation (Home, Log Session, Analytics) is reachable from resting thumb position in ≤ 1 tap, with no vertical scroll required, on 100% of tested devices at `< 768px` width.
2. Bottom sheet drag-to-dismiss reaches its stable resolved state (snapped or dismissed) in ≤ `300ms` from finger release across all 5 targeted components.
3. Long-press context menu is recognized and rendered in ≤ `520ms` from sustained touch initiation on 100% of QA test sessions.

---

### 4. Feature Scope

#### ✅ In Scope
- Dynamic bottom app bar replacing left sidebar navigation at `< 768px` breakpoint.
- Drag-to-dismiss bottom sheets replacing all center-screen modals (filters, forms, confirmations).
- Swipe-left reveal of quick actions (Edit, Archive) on session/patient list items.
- Long-press (500ms) haptic-style visual feedback + AI context menu on Bento cards and list rows.
- Pull-to-refresh with a custom Indigo arc indicator on all scrollable data lists.
- Progressive Bento card expand/collapse tap interaction for KPI and analytics cards.
*(Detailed Framer Motion implementation logic is in companion `mobile_gesture_specs.md`.)*

#### ❌ Out of Scope
- Rebuilding desktop layout or desktop sidebar (this ticket is `< 768px` only).
- Native iOS/Android app development; this is web-only (PWA compatible).
- Modifying Supabase data-fetching strategy or query logic.
- Redesigning the visual color system or typography (WO-550 governs that layer).

---

### 5. Priority Tier

**[X] P1** — High value, ship this sprint  

**Reason:** Mobile is the dominant access vector for practitioners between sessions. The current layout actively fails on touch; this blocks the portal from being genuinely usable for day-to-day clinical practice.

---

### 6. Open Questions for LEAD

1. Do we have a global `useBreakpoint` hook, or should a new one be created to gate the bottom bar vs. sidebar swap at `768px`?
2. Is `Framer Motion` already a project dependency, or does it need to be added? (Avoids a 17kb+ bundle surprise.)
3. Should the long-press `navigator.vibrate()` call be wrapped in a feature-detect util, or handled silently (it no-ops on iOS Safari already)?
4. For swipe-to-delete, should item removal trigger an optimistic UI update, or wait for Supabase confirmation before removing from the list?

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

==== PRODDY ====
