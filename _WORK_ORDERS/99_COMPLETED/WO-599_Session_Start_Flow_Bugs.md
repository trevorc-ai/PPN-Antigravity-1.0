# WO-599 — Session Start Flow Bugs (TEST Mode + Patient Selection + C-SSRS Alert)

**Status:** 99_COMPLETED
**Priority:** P1 — HIGH
**Author:** INSPECTOR
**Date:** 2026-03-10
**Source:** QA Session 03-10, phase1-second-turn screenshots

---

## Three bugs in the Wellness Journey start flow:

### Bug A — TEST Mode Auto-Assigned Without User Selection
User explicitly did NOT select "TEST" mode when starting the second session. The session ran with TEST MODE badge displayed anyway. This corrupts real session data and misclassifies clinical records.

- [ ] Investigate why TEST mode persists from a previous session
- [ ] Ensure TEST mode selection is explicit per session (not inherited from session state or local storage)
- [ ] Clear session mode on every new session start

### Bug B — C-SSRS Alert Message Too Vague
When C-SSRS score of 3 is entered, an "AUTOMATIC ALERT TRIGGERED" banner appears with no description of what the alert means, what threshold was crossed, or what action to take.

- [ ] Add clear copy: "C-SSRS score of 3 detected. Patient has expressed suicidal ideation with some intent. Review your clinic's crisis protocol before proceeding."
- [ ] Include link to relevant clinical guidance or next steps

### Bug C — New Patient vs. Existing Patient Button Hierarchy Unclear
Start modal shows "New Patient" and "Existing Patient / Most Recent" with unclear hierarchy. Returning patients who already have a session are confused about which to select.

- [ ] Clarify UI copy and visual hierarchy
- [ ] Consider: if practitioner has prior sessions with a patient, default to "Existing Patient" and require explicit "New Patient" override

## Acceptance Criteria

- [ ] TEST mode only activates when explicitly selected per session
- [ ] C-SSRS alert shows clinical context and actionable guidance
- [ ] Patient selection buttons have clear hierarchy and copy

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
