# WO-601 — Patient Report Magic Link Redirects to Dashboard (Auth Bug)

**Status:** 01_TRIAGE
**Priority:** P1 — HIGH
**Author:** INSPECTOR
**Date:** 2026-03-10
**Source:** QA Session 03-10, screenshots-patientreport-03-10 (4.26.26 PM)
**Related:** WO-EPIC-572 (Magic Link Sprint)

---

## Problem

The Patient Report magic link (`/journey/auth?token=xxx&id=PT-xxx`) redirects the user to the Dashboard instead of displaying the patient report. User annotation: "PATIENT REPORT NOT WORKING. LINK LEADS TO DASHBOARD. CHECK AUTH REQUIREMENT?"

This was previously flagged in the Live Site Testing SOP (conversation 382036f9). It is not yet fixed.

## Additional Request

User wants an explicit **"Copy Link"** button on the share modal (in addition to the existing export/share functionality) so the link can be easily pasted elsewhere.

## Likely Cause

The auth token route handler in `App.tsx` is redirecting authenticated users to the dashboard regardless of the `token` and `id` params. The `/journey/auth` route likely needs to:
1. Extract token + patient ID from URL
2. Validate token
3. Route to the correct patient report view

## Acceptance Criteria

- [ ] Magic link correctly renders the Patient Report for the associated patient
- [ ] Link works when logged in AND when not logged in (public-facing share)
- [ ] Share modal includes a "Copy Link" button
- [ ] Covered by WO-EPIC-572 scope or spawns a sub-ticket

---

## LEAD ARCHITECTURE

**Routed by:** LEAD
**Route date:** 2026-03-10
**Owner:** BUILDER
**Priority:** P1 — Block before any VIP/beta demo

### Routing Decision:
This is a confirmed production bug (validated in conversation 382036f9). The fix requires two parts:

1. **Route wiring in `App.tsx`:** Add a `<Route path="/journey/auth">` that handles the `/journey/auth?token=xxx&id=PT-xxx` URL. This route must:
   - Extract `token` and `id` from URL params
   - If user is authenticated: render `PatientReport` or `WellnessJourney` component with those params
   - If user is unauthenticated: render the report publicly (no auth gate on patient-facing links)

2. **Copy Link button in `MagicLinkModal.tsx`:** Add a simple copy-to-clipboard button alongside the existing share functionality.

**Cross-reference:** WO-591 (Inspector QA Handoff) already confirmed the bug and is waiting on this fix. WO-EPIC-572 tracks the broader magic link sprint.

**BUILDER must test on live site (`ppnportal.net`) after fix per SOP established 2026-03-10.**

