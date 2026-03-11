# WO-602 — Phase 3 UX Issues (Timeline, Integration Card, Report Print, Journey Timeline)

**Status:** 01_TRIAGE
**Priority:** P2 — MEDIUM
**Author:** INSPECTOR
**Date:** 2026-03-10
**Source:** QA Session 03-10, phase3 screenshots

---

## Grouped Phase 3 UX issues:

### A — Patient Journey Timeline Not Populating
Phase 3 shows "DEMO DATA" tags across all timeline containers with no actual data. Timeline charts for interventions, symptom decay, etc. are empty even after data was logged.
- Root cause: timeline data queries may be filtering incorrectly or using hardcoded demo data
- [ ] Wire timeline charts to live `log_session_timeline_events` and `log_clinical_records` data

### B — Integration Session Card Appears Twice
The Integration Session entry card is rendered twice on the Phase 3 timeline. One instance is redundant. Additionally, the card does not visually indicate completion (e.g., checkmark, color change) after the session is saved.
- [ ] Deduplicate the Integration Session card in the Phase 3 timeline
- [ ] Add visual completion indicator (checkmark or color change) when session is saved

### C — Report Print Preview Renders App UI Instead of Document
When triggering the print/PDF export from Phase 3, the print dialog captures the dark-themed app interface rather than a clean, formatted clinical report.
- [ ] Implement proper print stylesheet (`@media print`) for the report
- [ ] Report print view should be white background, clinical document format with all data formatted for readability

### D — Safety Event History Shows "No Records" Despite Logged Events
Phase 3 Safety History component consistently shows "No safety checks recorded yet" even after adverse events were logged during Phase 2. Frontend is not querying the correct session or not reading back correctly.
- [ ] Fix the Safety History query to filter by current session ID
- [ ] Verify `log_safety_events.session_id` is being set when safety events are logged

### E — Export Report Duplicate (Phase 1 and Phase 3)
The "Export Report" dropdown appears in both Phase 1 and Phase 3. User requests design decision: is this intentional, or should it only appear in Phase 3?
- [ ] Confirm with product intent: is Phase 1 export intentional?
- [ ] If redundant, remove from Phase 1

## Acceptance Criteria

- [ ] Journey Timeline renders live data (not "DEMO DATA")
- [ ] Integration Session card appears once and shows completion state
- [ ] Print export produces a clean clinical document
- [ ] Safety Event History correctly shows events from current session
- [ ] Export Report placement decision made and implemented
