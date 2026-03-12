---
id: WO-633
title: Patient Portal Hub — Activate /for-patients as a Unified Practitioner-Curated Care Hub
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
priority: P1
date_created: 2026-03-12
phase: patient-facing
tags: [for-patients, patient-portal, meq30, companion, integration-compass, log_patient_site_links]
depends_on: []
blocks: []
---

## PRODDY PRD

> **Work Order:** WO-633 — Patient Portal Hub
> **Authored by:** PRODDY
> **Date:** 2026-03-12
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

A patient in psychedelic therapy has no single, practitioner-curated landing page. Their assets — the Integration Compass, the Companion App, the MEQ-30, and prep/integration resources — exist as disconnected links the practitioner must share manually. The `/for-patients` route is a 10-line stub tagged WO-563 but never built. Without a hub, the patient experience is fragmented, the practitioner's share workflow is laborious, and care continuity is broken between sessions.

---

### 2. Target User + Job-To-Be-Done

A psychedelic therapy practitioner needs to send a single personalized portal link to their patient so that the patient can access everything relevant to their care — preparation guides, session report, daily check-in, and assigned forms — without a login or technical knowledge.

---

### 3. Success Metrics

1. `/for-patients?id={patient_hash}` renders a non-stub, patient-named portal page in 100% of cases where a valid `patient_hash` exists in `log_patient_site_links`, within 30 days of ship
2. ≥ 1 patient portal link is generated and sent per completed Phase 3 session event within the first 30 days of ship (measured via practitioner click on new "Send Patient Hub" button)
3. MEQ-30 completion events (currently 0 tracked) are observable in `patient_checkins` or equivalent table within 30 days of ship — establishing the measurable baseline

---

### 4. Feature Scope

#### ✅ In Scope
- Activate `ForPatients.tsx` from its current stub into a real portal page, driven by `patient_hash` URL param (already supported by `log_patient_site_links`)
- Portal sections rendered on the hub (in priority order):
  - **Welcome header** with practitioner note if WO-632 is complete, or a placeholder if not
  - **Your Session Report** — deep link to `/patient-report?session={session_id}` (resolved via `patient_hash → canonical_patient_uuid → log_clinical_records`)
  - **Your Daily Check-In** — link to Zone 3 of the Integration Compass, or a standalone PulseCheckWidget if LEAD determines it should be extracted
  - **Assigned Forms** — MEQ-30 link to `/patient-form/meq30?patient={patient_hash}` (mirrors existing `PatientFormPage.tsx` share flow)
  - **Integration Resources** — static section: journaling prompts (already in PatientReport Zone 5 accordion), breathing exercise link, crisis line (988), and PEMS framework summary
- New "Send Patient Hub" CTA button in the Phase 3 practitioner UI that copies the hub URL to clipboard (same UX pattern as existing MEQ-30 share button in `PatientFormPage.tsx`)
- Graceful degradation: if `patient_hash` is absent or unresolved, portal shows a clean "Link not found" state — no error thrown, no PHI exposed

#### ❌ Out of Scope
- Patient authentication or login flow
- Patient-to-practitioner messaging or reply channel
- Dynamic form routing beyond MEQ-30 in this sprint (C-SSRS, PHQ-9, etc. are follow-on)
- Any new database tables — use existing `log_patient_site_links`, `wellness_sessions`, `log_clinical_records`
- The NeuralCopilot AI component on any patient-facing surface (safety risk — deferred indefinitely)
- Companion App integration into the hub (Companion is session-time only; portal is pre/post-session)
- Real-time data in the Integration Resources section (static content only)

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** This ticket completes work already planned as WO-563 but never executed — the infrastructure (`log_patient_site_links`, `PatientFormPage.tsx` share UX, `PatientReport.tsx`) already exists. Without this hub, each patient-facing feature is a dead end with no shared context. The connective tissue cost is one page activation and one CTA button — very low effort for very high demo and retention impact.

---

### 6. Open Questions for LEAD

1. Does `log_patient_site_links.patient_hash` already provide a stable, public-safe identifier suitable for a non-auth portal URL, or does LEAD want a separate `portal_token` with an expiry?
2. Should the pre-session preparation guide be static markdown content baked into `ForPatients.tsx`, or practitioner-selected from a substance-specific enum (e.g., "psilocybin-prep", "ketamine-prep") stored on the session record?
3. The MEQ-30 share flow currently uses a stub token string (`STUB`). Does this portal ticket require real tokenized auth before go-live, or is `patient_hash` a sufficient non-auth access gate for MVP?
4. Should the "Send Patient Hub" CTA live inside the Phase 3 step guide (e.g., after the Integration session is logged), or as a standalone button in the Session Export Center?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
