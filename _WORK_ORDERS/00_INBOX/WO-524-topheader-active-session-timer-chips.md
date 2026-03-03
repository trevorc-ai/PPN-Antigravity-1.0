---
id: WO-524
title: TopHeader — Active Dosing Session Timer Chips
owner: LEAD
status: 01_TRIAGE
filed_by: PRODDY
date: 2026-03-03
priority: P2
file: src/components/TopHeader.tsx
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-524 — TopHeader: Active Session Timer Chips
> **Authored by:** PRODDY
> **Date:** 2026-03-03
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

When Dr. Allen runs multiple simultaneous dosing sessions (3–4 patients, 2–3 assisting practitioners), there is no persistent indicator showing which sessions are currently active or how long each has been running. The practitioner must navigate away from their current view to check another session's status. This creates unnecessary context-switching during a high-attention clinical workflow.

---

### 2. Target User + Job-To-Be-Done

A lead practitioner running multiple concurrent dosing sessions needs to see a live elapsed timer per active session in the persistent header so that they can monitor session duration without navigating away from their current screen.

---

### 3. Success Metrics

1. One chip per active session renders in `TopHeader` within 2 seconds of page load — confirmed by visual inspection.
2. Each chip displays the patient `Subject_ID` and elapsed time (`HH:MM`) updating every 60 seconds — confirmed by waiting 60s and observing update.
3. Clicking a chip navigates directly to that session's `DosingSessionPhase` — confirmed by click test.

---

### 4. Feature Scope

#### ✅ In Scope
- Query `log_clinical_records` for **all active sessions at the authenticated user's site** — not scoped to the logged-in practitioner's own sessions
- Every practitioner logged in at that site sees chips for every active dosing session at that site simultaneously
- Render one pill/chip per active session in `TopHeader` — to the left of the icon button group
- Each chip shows: `Subject_ID` (truncated to 6 chars) + elapsed time (`HH:MM`) computed from session start
- **Each chip is a one-click navigation button** — clicking it opens `DosingSessionPhase` for that session immediately (no confirm, no drawer)
- Timer updates every 60 seconds via `setInterval`
- If no sessions are active at the site, the chip area renders nothing (zero visual footprint)

#### ❌ Out of Scope
- Modifying any page outside `TopHeader.tsx`
- Showing sessions from other sites
- Any change to `DosingSessionPhase.tsx` or `WellnessJourney.tsx`
- Real-time push (60s polling is sufficient for a timer display)

---

### 5. Priority Tier

**[x] P2** — Next sprint

**Reason:** Direct request from Dr. Jason Allen regarding multi-session monitoring. No blocking dependency — `log_clinical_records` query does not require any new columns or schema changes.

> ⚠️ **Cross-check required before implementation.** WO-529–534 cover dosing session event logging (ledger + live graph) and directly overlap with this WO. LEAD must cross-check WO-524 against WO-529–534 before assigning. INSPECTOR preliminary QA is required across all related WOs before any code is written.

---

### 6. Open Questions for LEAD

1. What column name and value represents an "active" dosing session in `log_clinical_records`? (e.g. `session_status = 'active'` or a phase column?)
2. What is the session start time column — or should elapsed time be computed from `created_at`?
3. Maximum number of chips before truncating with a `+N more` overflow pill?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement ≤100 words, no solution ideas
- [x] Job-To-Be-Done single sentence, correct format
- [x] All 3 metrics measurable
- [x] Out of Scope populated
- [x] Priority tier named reason
- [x] Open Questions ≤5 items
- [x] No code, SQL, or schema written
- [x] Frontmatter: `owner: LEAD`, `status: 01_TRIAGE`

==== PRODDY ====
