---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
active_sprint: false
priority: P1
created: 2026-03-23
database_changes: yes
source_analysis: proddy_dr_allen_analysis.md
files: []
---

## PRODDY PRD

> **Work Order:** WO-668 — Ibogaine Withdrawal & Addiction Severity Assessment Module (COWS / BAWS / ASI)
> **Authored by:** PRODDY
> **Date:** 2026-03-23
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Ibogaine is primarily used to treat Opioid Use Disorder (OUD) and Alcohol Use Disorder (AUD). The standard clinical assessments for these indications — COWS (Clinical Opiate Withdrawal Scale, 11 items), BAWS (Brief Alcohol Withdrawal Scale), and ASI (Addiction Severity Index) — are not present in PPN's Phase 1 intake flow. Practitioners treating addiction with Ibogaine currently have no validated instrument to document withdrawal severity or addiction profile inside the portal, creating a gap between clinical documentation standards and platform capability.

---

### 2. Target User + Job-To-Be-Done

An Ibogaine practitioner treating OUD or AUD needs to administer and log COWS, BAWS, and ASI scores pre-session so that the patient's withdrawal severity and addiction profile are permanently recorded alongside the treatment session record.

---

### 3. Success Metrics

1. COWS, BAWS, and ASI each render as structured, scorable forms within Phase 1 intake for sessions where the primary substance is Ibogaine — verified in ≥3 consecutive QA sessions.
2. Each completed assessment auto-calculates its total score and stores it as a structured integer value (not free text) in the database — confirmed by INSPECTOR schema review.
3. Assessment scores appear in the patient's session summary and any generated session PDF report within 30 days of ship.

---

### 4. Feature Scope

#### ✅ In Scope
- COWS: 11-item structured form with auto-scoring (total /55), conditionally rendered in Phase 1 when primary substance = Ibogaine
- BAWS: Structured withdrawal severity form with auto-total, conditionally rendered for Ibogaine sessions
- ASI: 7-domain structured intake instrument (medical, employment, alcohol, drugs, legal, family, psychiatric) — rendered in Phase 1
- All scores stored as structured integer fields (foreign key or integer column) — no free text
- Scores surfaced in session summary view and PDF export

#### ❌ Out of Scope
- COWS/BAWS monitoring during an active session (intra-session reassessment) — that is a separate ticket
- Any changes to existing Phase 1 forms not related to these three instruments
- Custom scoring weight modifications for individual clinics
- Integration with external EHR to import existing ASI scores

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** COWS is standard-of-care for Ibogaine OUD treatment — the primary US commercial indication for Ibogaine. Its absence structurally excludes PPN from the OUD treatment market. No hard demo deadline exists at time of writing, but this is a clinician adoption gate, not a nice-to-have.

---

### 6. Open Questions for LEAD

1. Should COWS/BAWS be gated exclusively to sessions where `primary_substance = Ibogaine`, or surfaced for any session type where the practitioner opts in?
2. Does ASI require its own dedicated page/route within Phase 1, or can it be embedded as a collapsible wizard step?
3. ASI is a lengthy instrument — should it support partial save / resume so practitioners aren't forced to complete it in one sitting?
4. Do COWS and BAWS scores need to feed into the cardiac risk summary or the pre-session safety checklist?
5. What is the correct database home for these scores — extending the existing `session_baselines` table or creating new assessment-specific tables?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] `database_changes: yes` — new assessment score columns/tables required
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
