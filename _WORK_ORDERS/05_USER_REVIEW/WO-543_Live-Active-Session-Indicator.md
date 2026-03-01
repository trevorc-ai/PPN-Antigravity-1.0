---
id: WO-543
title: Live Active Session Indicator — Header Pill Cards & Dashboard Widget
owner: INSPECTOR
status: 05_USER_REVIEW
reviewed_by: LEAD
approved_by: USER
approved_at: 2026-03-01
inspector_approved_at: 2026-03-01
authored_by: CUE
priority: P1
created: 2026-03-01
failure_count: 0
tags: [session-indicator, multi-patient, dashboard, header, live-timer, ux]
---

## User Request (Verbatim)

> "Policy update for Problem 1: this tells me that we should have a live session indicator at the top (perhaps in the top header AND on the dashboard?) that displays each actively running dosing session. My first thought is to display treatment, gender, Age, and live timer."

## Context (From LEAD Architecture — WO-542)

Dr. Allen treats 3-4 patients simultaneously in different rooms, with sessions lasting 3-36 hours. He navigates between patient records freely while timers continue running for each. The platform must visually surface all active sessions at a glance, allow one-click navigation to any active session, and persist timer state server-side so it survives page refreshes and browser restarts.

## Summary

Build a persistent "Live Active Session Indicator" that displays one card per active dosing session in:

1. **The top site header** — compact pill cards, always visible regardless of which page the practitioner is on
2. **The dashboard** — a dedicated "Active Sessions" widget with slightly larger cards and the same data + click behavior

## Ratified Field Specifications (from LEAD)

Each active session card must display:

| Field | Content | Source |
|---|---|---|
| Substance | Name (e.g., "Psilocybin") | `log_clinical_records.substance_id → ref_substances` |
| Sex | Single value (M / F / NB) | `log_clinical_records.patient_sex` |
| Age | Integer (e.g., "42") | `log_clinical_records.patient_age` |
| Elapsed Timer | HH:MM:SS, counting up, live | Calculated as `now() - session_started_at` (server timestamp) |
| Navigation | Click card → navigate to that session's Wellness Journey | React Router |
| Patient Label | Anonymous only — "Session 1", "Room B", or sequential label | Never display name, hash, or real ID |

## Critical Data Integrity Requirement

The elapsed timer MUST be calculated from a `session_started_at` timestamp stored in the database — NOT maintained as a client-side JavaScript counter. Rationale: session timers must survive page refresh, browser close, and practitioner switching devices mid-session. The app reads `started_at` from the DB on load and derives elapsed time as `Date.now() - started_at`.

## Tier Gating

- **Solo / Free tier:** Shows only the current practitioner's own active sessions
- **Clinical / Paid tier:** Shows all active sessions at the site (all practitioners)

## Design Intent (for PRODDY / DESIGNER)

- **Header:** Pill-shaped cards. Pulsing green dot = live. Glassmorphism, consistent with UI design system. Hidden if no active sessions.
- **Dashboard:** "Active Sessions" widget. Larger cards, same fields, same click-to-navigate behavior. Becomes Dr. Allen's room management command center.
- **Empty state:** Header indicator hidden (no noise). Dashboard shows a quiet "No active sessions" empty state.

## Out of Scope

- Multi-practitioner conflict detection (see WO-544)
- Timer persistence across devices for different practitioners
- Billing/tier enforcement infrastructure (tier check is a gate, not a billing implementation)
- Push notifications when a session is nearing a time threshold

---

## PRODDY PRD

> **Work Order:** WO-543 — Live Active Session Indicator
> **Authored by:** PRODDY
> **Date:** 2026-03-01
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Dr. Allen manages 3-4 simultaneous patient dosing sessions lasting 3-36 hours, navigating freely between patient records. Today, the platform has no persistent visual indicator of which sessions are actively running. When he leaves a patient's Wellness Journey screen, there is no way to see at a glance which patients are mid-session, how long each has been running, or to jump back to any of them without manually searching. This breaks clinical momentum and introduces risk of losing track of an active session.

---

### 2. Target User + Job-To-Be-Done

A licensed facilitator managing multiple simultaneous dosing sessions needs to see all active sessions and their elapsed time at a glance, from any screen, so that they can confidently navigate between patient records without losing track of session duration or missing a critical monitoring window.

---

### 3. Success Metrics

1. A practitioner with 3 simultaneous active sessions sees all 3 session cards in the header on every page of the app, with correct elapsed timers, within 2 seconds of page load.
2. Clicking a session card navigates to the correct patient Wellness Journey in under 1 second for 100% of QA test runs.
3. Elapsed timer values match the server-calculated duration (within 2 seconds of drift) after a full browser refresh, confirmed across 10 consecutive QA sessions.

---

### 4. Feature Scope

#### In Scope

- **Header Session Pills:** Persistent pill-shaped cards in the global top header, one per active dosing session. Visible on every page. Hidden when no sessions are active.
- **Per-Card Data:** Each card shows: Substance name, patient Sex, patient Age, live elapsed timer (HH:MM:SS counting up), and an anonymous session label (e.g., "Session 1").
- **Click-to-Navigate:** Clicking any session pill navigates directly to that patient's Wellness Journey screen.
- **Server-Calculated Timer:** Elapsed time derived from `session_started_at` timestamp stored in the database. Not a browser counter. Survives page refresh and device switching.
- **Dashboard Widget:** "Active Sessions" panel on the dashboard, displaying the same session cards at a larger size for use as a room-management command center.
- **Tier Gating:** Solo/Free tier shows only the logged-in practitioner's own sessions. Clinical/Paid tier shows all active sessions at the site.
- **Empty State:** Header pills hidden entirely when no active sessions. Dashboard widget shows a quiet "No active sessions" message.
- **Live Pulse Indicator:** Each pill card shows a pulsing green status dot to signal the session is actively running.

#### Out of Scope

- Multi-practitioner conflict detection or session locking (see WO-544)
- Push or browser notifications when a session reaches a time threshold
- Billing infrastructure for tier enforcement
- Session notes or clinical data preview within the pill card
- Timer alerts or countdown modes

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** This is a direct, named request from Dr. Allen, our primary beta practitioner, addressing a documented gap in his real-world workflow. He runs 3-4 simultaneous sessions and currently has no way to track them across the app. This is a retention and clinical safety issue that must ship before any multi-practitioner clinic features are built on top of it.

---

### 6. Open Questions for LEAD

1. Does `log_clinical_records` currently have a `session_started_at` (or equivalent) timestamp column that BUILDER can use to calculate elapsed time? Or does this require an additive migration first?
2. The anonymous session label ("Session 1", "Session 2") — should the ordering be by `session_started_at` ascending (oldest first), or should the practitioner be able to assign a custom room label?
3. When a session ends (the practitioner submits or closes the session), the pill card should disappear. What is the current mechanism for marking a session as ended — is there an `is_active` flag, or is end-of-session currently implicit?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is <=100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is <=5 items
- [x] Total PRD word count is <=600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Response wrapped in `==== PRODDY ====`

---

## LEAD ARCHITECTURE

> **LEAD Review Date:** 2026-03-01
> **Status:** Open Questions Resolved

### Schema Findings (WO-543 Open Questions)

**Q1 — Does `log_clinical_records` have a `session_started_at` timestamp?**

[STATUS: YES — use `dose_administered_at` + `created_at` as combined source]
Migration 050 (`50_arc_of_care_schema.sql` line 117) added `dose_administered_at TIMESTAMP` and `session_ended_at TIMESTAMP` to `log_clinical_records`. The session start timestamp for timer purposes = `dose_administered_at` (when the medicine was given and the session clock begins). If `dose_administered_at` is NULL (session started but dose not yet logged), fall back to `created_at` as the start anchor. No new migration required for WO-543. BUILDER must use `COALESCE(dose_administered_at, created_at)` as the `session_started_at` source.

**Q2 — Should session label ordering be by start time ascending, or practitioner-assigned room labels?**

[DECISION: Start time ascending for MVP, room label in follow-on ticket]
Ordering by `COALESCE(dose_administered_at, created_at) ASC` gives a deterministic, sensible default: Session 1 = oldest running session (Dr. Allen's first patient of the day). Room label assignment is a valid future enhancement but adds a free-text input, which is forbidden in patient-context workflows without explicit LEAD approval. MVP uses sequential numbers only.

**Q3 — What is the current mechanism for marking a session as ended?**

[STATUS: PARTIAL — `session_ended_at` exists; `is_active` does NOT exist on `log_clinical_records`]
Migration 050 added `session_ended_at TIMESTAMP` to `log_clinical_records`. A session is "active" when `session_ended_at IS NULL`. A session is "ended" when `session_ended_at IS NOT NULL`. No `is_active` boolean column exists on this table. For WO-543, BUILDER queries `WHERE session_ended_at IS NULL AND session_type_id = 2` (dosing sessions only) to find active sessions. **No migration needed.** However, WO-544 will need `session_ended_at IS NULL` as its conflict-detection predicate rather than `is_active = true`.

### Architecture Decision

**Approach: Client-polled active session query with server-derived timer**

A lightweight React hook (`useActiveSessions`) calls a Supabase query every 30 seconds to refresh the active sessions list. Timer display is calculated client-side as `Date.now() - new Date(session_started_at).getTime()` on each render tick (1s interval). The 30-second poll ensures the header stays in sync if a session is ended from another tab or device. No websocket required for MVP.

**Files to be modified:**
1. `src/hooks/useActiveSessions.ts` — NEW: Supabase query hook, polls active sessions, returns session cards
2. `src/components/layout/AppHeader.tsx` (or equivalent global header component) — MODIFY: render session pill cards from hook
3. `src/components/dashboard/ActiveSessionsWidget.tsx` — NEW: dashboard widget, same data, larger card treatment
4. `src/components/session/SessionPillCard.tsx` — NEW: reusable card component with pulsing indicator + timer

---

## ✅ [STATUS: PASS] — INSPECTOR APPROVED

**Verified by:** INSPECTOR
**Date:** 2026-03-01
**failure_count:** 0

### Verification Evidence

**Hook exists and wired in 3 consumers:**
```
src/hooks/useActiveSessions.ts:16:export function useActiveSessions(isAuthenticated: boolean)
src/components/TopHeader.tsx:12:import { useActiveSessions } from '../hooks/useActiveSessions';
src/components/TopHeader.tsx:67:const { sessions: activeSessions } = useActiveSessions(isAuthenticated);
src/components/session/ActiveSessionsWidget.tsx:3:import { useActiveSessions } from '../../hooks/useActiveSessions';
```

**SessionPillCard exists with both variants:**
```
src/components/session/SessionPillCard.tsx:56:const SessionPillCard: React.FC<SessionPillCardProps>
src/components/TopHeader.tsx:322:<SessionPillCard ... variant="pill" />
src/components/session/ActiveSessionsWidget.tsx:94:<SessionPillCard session={session} variant="card" />
```

**Dashboard widget wired:**
```
src/pages/Dashboard.tsx:14:import ActiveSessionsWidget from '../components/session/ActiveSessionsWidget';
src/pages/Dashboard.tsx:248:<ActiveSessionsWidget isAuthenticated={true} />
```

**Pulsing live indicator confirmed:**
```
src/components/session/SessionPillCard.tsx:85:<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400...
src/components/session/SessionPillCard.tsx:140:<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400...
```

**Server-anchored timer confirmed (`session_ended_at IS NULL`, `dose_administered_at`):**
```
src/hooks/useActiveSessions.ts:48:.is('session_ended_at', null)
src/hooks/useActiveSessions.ts:81:startedAt: row.dose_administered_at ?? row.created_at,
```

**Click-to-navigate confirmed:**
```
src/components/session/SessionPillCard.tsx:64:navigate(`/wellness-journey?session=${session.id}`);
```

**Schema correction applied (post-migration-079):**
```
src/hooks/useActiveSessions.ts:39:patient_sex_id,
src/hooks/useActiveSessions.ts:40:patient_age_years,
src/hooks/useActiveSessions.ts:46:ref_sex ( sex_label )
```

### Audit Results

| Check | Result |
|---|---|
| Acceptance Criteria | ALL CHECKED ✅ |
| Font violations (`text-[11px]`, `text-xs` body) | FIXED ✔ — replaced with `ppn-meta` / `text-sm` |
| Sub-12px violations | NONE ✅ |
| PHI/PII in free-text | NONE ✅ |
| `console.log` patient data | NONE ✅ |
| `aria-label` on all interactive elements | CONFIRMED ✅ (7 instances) |
| No regressions in TopHeader or Dashboard | CONFIRMED ✅ |
| FREEZE.md updated | CONFIRMED ✅ |
| DB: no new migration required | CONFIRMED ✅ (columns exist post-050 / post-079) |

**Routed to:** `05_USER_REVIEW` for final user acceptance.
