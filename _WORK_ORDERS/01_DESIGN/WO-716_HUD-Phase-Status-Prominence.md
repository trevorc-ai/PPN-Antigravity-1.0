---
id: WO-716
title: "Patient HUD Phase Status — Make phase subtitle more prominent + surface incomplete Integration warning"
owner: PRODDY
status: 02_TRIAGE
authored_by: INSPECTOR (user-reported UX)
priority: P2
created: 2026-03-27
fast_track: false
origin: "User-reported — phase subtitle text too easy to miss; practitioners don't realise Integration isn't finalized before starting new dosing session"
admin_visibility: no
pillar_supported: "1 — Safety Surveillance, 3 — QA and Governance"
task_type: "ux-enhancement"
related_tickets:
  - WO-715 (Phase 3 auto-redirect by design — awareness fix instead)
files:
  - src/pages/WellnessJourney.tsx
  - src/components/wellness-journey/IntegrationPhase.tsx (read-only, for phase status logic)
database_changes: no
---

## User Report (2026-03-27)

The patient HUD subtitle line (circled yellow in screenshot):

> *"Pre-treatment preparation, complete baseline assessments before session"*

is too small and easy to miss. When a practitioner looks up a patient who has an open
(unfinalized) Phase 3 Integration and starts a new dosing session, they receive no
prominent signal that Phase 3 was never closed out.

**User request:** Make this status banner more prominent. Add phase timeline
awareness ("current phase started/ended") so practitioners always know where
the patient is in the wellness journey at a glance.

---

## PRODDY Spec Required

### What currently exists
- One-line subtitle below patient header: plain `text-slate-400` text describing the current phase
- Phase tabs (1 Preparation / 2 Dosing / 3 Integration) show checkmarks but no date context
- No visual warning when Phase 3 is open/incomplete at the time of Phase 2 re-entry

### What PRODDY should design

**Enhancement 1 — Bolder phase status line**
Replace the current single-line dimmed subtitle with a more prominent phase status
badge/pill row directly under the patient identifiers in the HUD. Should show:
- Current phase name (e.g. `Phase 3 — Integration`)
- Phase started date (e.g. `Started Mar 22`)
- Phase status: `IN PROGRESS` (amber) / `COMPLETE` (green) / `NOT STARTED` (slate)

**Enhancement 2 — Incomplete Integration warning**
When a patient's most recent session is ended/submitted (Phase 3 context) AND a new
dosing session is being started or Phase 2 tab is active:
- Show a contextual amber warning banner below the HUD (non-blocking, dismissable):
  > ⚠️ **Phase 3 Integration not finalized** — Patient has an open integration period
  > from Mar 22. You can complete it under the Integration tab.

**Enhancement 3 — Phase timeline micro-summary in HUD**
Under the patient name row, show a compact 3-phase status row:
```
✓ Prep  ·  ✓ Dosing (Mar 22)  ·  ⚑ Integration (Mar 22 — open)
```
Clickable — clicking each phase label jumps to that tab.

### Constraints
- Zero-PHI: no patient names, DOBs, or identifiers beyond Subject_ID (already compliant)
- Must not block or slow the Phase 2 dosing cockpit load
- Warning banner must be dismissable per session (localStorage or React state; no DB write needed)
- Should render correctly at mobile (375px), tablet (768px), desktop (1280px+)
- Must pass PPN UI Standards — no bare `text-xs`, no em-dashes in rendered text

---

## QA Criteria
- [ ] Phase status line visually distinct from current dimmed subtitle
- [ ] Amber warning appears when Phase 3 is open and practitioner enters Phase 2
- [ ] Warning is dismissable and does not reappear within the same session context
- [ ] Phase timeline row is readable at 375px mobile width
- [ ] Run `/phase2-session-regression` (affects WellnessJourney.tsx patient HUD)

---
- **Data from:** `log_clinical_records` (session_ended_at, is_submitted, created_at) — same query already in WellnessJourney.tsx; no new DB query needed
- **Data to:** Display only — no DB writes; local React state for banner dismiss
- **Theme:** Tailwind CSS, PPN design system — amber warning, phase status badges
