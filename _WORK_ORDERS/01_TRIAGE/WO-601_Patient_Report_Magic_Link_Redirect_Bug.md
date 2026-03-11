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
