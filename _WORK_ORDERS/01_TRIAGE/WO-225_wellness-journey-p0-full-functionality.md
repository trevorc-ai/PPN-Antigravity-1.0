---
id: WO-225
status: 00_INBOX
owner: PENDING
priority: P0
failure_count: 0
repeat_request: true
created: 2026-02-19
---

# WO-225: Wellness Journey — Full End-to-End Functionality (P0)

## User Prompt (verbatim)
"Fixing the wellness journey takes precedence over anything else. That remains top priority until it is fully functional."

## Context
This is a REPEAT request. Wellness Journey has been partially fixed across multiple sessions but remains non-functional end-to-end. Fixes applied so far:
- ✅ Dosing Protocol crash on dropdown select (WellnessFormRouter — no-op onSave)
- ✅ Toast spam loop when sessionId/patientId null
- ✅ Wellness Journey link restored to sidebar

## Remaining Blockers (known)
1. **No session creation flow** — Phase 2 forms require `sessionId`, but there is no UI/UX flow for a practitioner to CREATE a session before entering Phase 2 forms. All Phase 2 saves silently no-op because `sessionId` is always null.
2. **Patient selection** — `PatientSelectModal` may not be passing patientId/sessionId down to `WellnessFormRouter` correctly. Needs end-to-end trace.
3. **Form save confirmation** — No visual confirmation that form data actually landed in the database for any phase.
4. **Phase gating** — Can users freely open Phase 2 forms without completing Phase 1? Is that intentional?

## Acceptance Criteria
- [ ] Practitioner can select a patient and start a session (sessionId is created)
- [ ] Phase 1 forms save with success toast and record in DB
- [ ] Phase 2 forms save with success toast and record in DB (requires sessionId)
- [ ] Phase 3 forms save with success toast and record in DB
- [ ] No crashes on any form field interaction
- [ ] No spurious error toasts on form open

## LEAD NOTES
Route immediately to BUILDER after architecture review.
