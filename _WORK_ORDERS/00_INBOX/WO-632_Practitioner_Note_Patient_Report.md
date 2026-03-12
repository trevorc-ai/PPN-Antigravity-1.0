---
id: WO-632
title: Practitioner Personal Note on Patient Report (Integration Compass Zone 1)
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
priority: P1
date_created: 2026-03-12
phase: patient-facing
tags: [patient-report, practitioner-note, zone-1, wellness_sessions]
---

## PRODDY PRD

> **Work Order:** WO-632 — Practitioner Personal Note on Patient Report
> **Authored by:** PRODDY
> **Date:** 2026-03-12
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

The Patient Report's Zone 1 (The Start of the Path) displays a hardcoded Rumi quote that could appear on any wellness website. The practitioner has no mechanism to write a personal note to the patient inside the report. Without a practitioner voice, the Integration Compass feels impersonal and generic — undermining its value as a therapeutic care artifact and reducing the sense of continuity between practitioner and patient during the critical integration window.

---

### 2. Target User + Job-To-Be-Done

A licensed psychedelic therapy practitioner needs to leave a personalized post-session message for their patient so that the patient opens the Integration Compass and immediately feels held, seen, and guided by *their* specific practitioner — not a generic wellness platform.

---

### 3. Success Metrics

1. Practitioner note field is populated in ≥ 50% of sessions where a Patient Report link is generated, measured within 30 days of ship
2. PatientReport.tsx Zone 1 renders dynamic practitioner note content (not the static Rumi quote) in 100% of sessions where `practitioner_note` is non-null
3. Zero instances of PHI stored in `practitioner_note` — enforced by a 500-character hard cap at the UI input layer and confirmed by INSPECTOR schema audit before merge

---

### 4. Feature Scope

#### ✅ In Scope
- New nullable `practitioner_note` text column added to `wellness_sessions` table (additive only, max 500 chars, no PHI)
- Freetext textarea input rendered in the Phase 3 Integration session UI (before or alongside the "Generate Report" flow) for the practitioner to author the note
- Optional: a curated dropdown of 5–8 note *starters* (e.g., "This session showed real courage…") that the practitioner can select and then edit — reducing blank-page friction
- Zone 1 of `PatientReport.tsx` renders the practitioner note in place of the Rumi quote when `practitioner_note` is non-null; the Rumi quote remains the graceful fallback when no note is present
- RLS policy: patient can SELECT their own session's `practitioner_note` via the existing session_id access path; no new auth required

#### ❌ Out of Scope
- Back-and-forth patient-to-practitioner messaging or replies
- Rich text formatting (bold, markdown) in the note — plain text only
- Real-time note editing after the patient has received the report link
- Practitioner note visible in the fixed top navigation bar (zone-specific placement only)
- Any patient-authored content rendered in Zone 1

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Lowest implementation complexity of any patient-facing improvement (one nullable column, one textarea, one conditional render in Zone 1). Directly differentiates PPN as a relationship platform versus a documentation tool. Strengthens the demo narrative for any practitioner-facing review session.

---

### 6. Open Questions for LEAD

1. Is `wellness_sessions` the correct table for `practitioner_note`, or does LEAD prefer it in `log_clinical_records` for schema cleanliness?
2. What is the exact RLS policy — does the patient's existing session-linked read path in `PatientReport.tsx` already cover a new column on `wellness_sessions`, or does a new policy row need to be written?
3. Should `practitioner_note` be locked (read-only via RLS) after the patient report link is first accessed, or remain editable by the practitioner indefinitely?

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
