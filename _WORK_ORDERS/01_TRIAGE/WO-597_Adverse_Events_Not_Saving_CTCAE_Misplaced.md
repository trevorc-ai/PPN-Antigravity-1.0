# WO-597 — Adverse Events Not Saving + CTCAE Button Misplaced

**Status:** 01_TRIAGE
**Priority:** P1 — HIGH
**Author:** INSPECTOR
**Date:** 2026-03-10
**Source:** QA Session 03-10, phase2 screenshots (4.37.37, 4.15.00, 4.19.06 PM)

---

## Problem

Two related adverse event issues:

### Issue A — Adverse Events Not Capturing
User logged an adverse event (Nausea) during Phase 2. The DB shows only 1 safety event row with `exposure_id`, `event_id`, and `causality_code` all NULL. User annotation: "STILL NOT CAPTURING ADVERSE EVENTS PROPERLY."

### Issue B — CTCAE Export Button Misplaced
The "Finalize & Export CTCAE Incident Report" button appears in the middle of an active adverse event form, not at the end after all data is entered. This is confusing and may cause premature exports.

### Issue C — "Review Safety Events" Always Inactive
At Phase 2 and Phase 3 closeout, "Review Safety Events (0)" is greyed out and unclickable even when safety events have been logged. It should either:
- Count and link to actual events logged this session
- Or be removed if it serves no purpose

## Acceptance Criteria

- [ ] Logging an adverse event correctly writes to `log_safety_events` with all required fields
- [ ] `causality_code`, `severity_grade_id_fk`, `safety_event_type_id` are populated where data was entered
- [ ] CTCAE Export button appears only at the end of the adverse event form, after all fields are complete
- [ ] "Review Safety Events" at closeout shows the correct count and links to the events for this session
