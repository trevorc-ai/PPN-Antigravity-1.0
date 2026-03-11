# WO-595 — Protocol Detail: "Record Not Found" Error

**Status:** 01_TRIAGE
**Priority:** P0 — CRITICAL (data is written but unreadable)
**Author:** INSPECTOR
**Date:** 2026-03-10
**Source:** QA Session 03-10, screenshots-myprotocols-03-10

---

## Problem

After completing a full Wellness Journey session, clicking the protocol row in My Protocols produces:
- "Record not found" error
- "Session not found" error

The session EXISTS in the database (confirmed via DB screenshots) but the Protocol Detail page cannot retrieve it.

## Likely Cause

`ProtocolDetail.tsx` or the route fetching the record is filtering by a field that doesn't match — most likely `created_by` (which is NULL on sessions created before the session_status fix) or a `session_id` mismatch in the URL routing.

## Steps to Reproduce

1. Log in as a practitioner
2. Complete a full Wellness Journey session
3. Navigate to My Protocols
4. Click on the session row

## Acceptance Criteria

- [ ] Clicking a session row in My Protocols opens the Protocol Detail page successfully
- [ ] The detail page displays all fields captured during the session
- [ ] Empty fields show clearly as "Not recorded" rather than causing errors
