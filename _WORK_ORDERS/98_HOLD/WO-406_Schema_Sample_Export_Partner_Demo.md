---
id: WO-406
title: "Schema Sample Export — 'What We Collect' PDF/CSV for Partner Demos"
status: 01_TRIAGE
owner: PRODDY
created: 2026-02-23
created_by: PRODDY
failure_count: 0
priority: P1
tags: [demo-materials, schema, data-transparency, singularism, partner-facing]
depends_on: [log-table-cleanup — in progress per USER 2026-02-23]
blocked_by: "Log table cleanup + ref_ table wiring must complete first (queries currently writing direct values instead of FK IDs)"
---

# WO-406: Schema Sample Export — "What We Collect" Document

## STRATEGIC RATIONALE

Bridger and his team will almost certainly ask to see what the data actually looks like. This is a reasonable and healthy question from any organization evaluating clinical infrastructure — and especially powerful from one with Singularism's legal history.

The answer to "what do you collect?" should be a document we hand them, not something we improvise on a call.

> **"Here — look at the tables. This is what we collect. Every column. No names, no identifiers, no free text. This is it."**

That document is a stronger compliance statement than any verbal pitch. It is also publishable as a trust artifact on the website eventually.

---

## WHAT THIS DOCUMENT IS

A clean, human-readable representation of PPN Portal's clinical data schema — showing exactly what gets written to the database during a patient session. Formatted for a non-technical audience. Shareable with attorneys, advisors, and compliance reviewers.

**Format options (produce at least 2):**
1. PDF — polished, branded, shareable via email
2. CSV — raw column names + descriptions, for technical/legal reviewers
3. (Optional bonus) HTML table — embeddable in the website trust/compliance section

---

## CONTENT SPEC

### Section 1: Cover Statement
> *"The following tables represent everything PPN Portal records during a clinical session. Every field is documented. No field contains a participant name, date of birth, address, or any other direct identifier. Participants are referenced exclusively by system-generated anonymous Subject IDs."*

### Section 2: Table-by-Table Schema Summary

For each log table, show:
- **Table name**
- **Plain English description** ("What this records")
- **Columns** with:
  - Column name
  - Data type
  - Plain English label (e.g., `phq9_score` → "PHQ-9 Depression Score")
  - Whether it is a reference FK, a numeric score, a boolean, or a timestamp
  - Any column that could be confused for PII should have a note: "This is a system-generated ID / reference code — not a participant identifier"

**Tables to include** (post-cleanup, when ref_ wiring is complete):

| Table | Description |
|---|---|
| `log_clinical_records` | Master session record — links all phases |
| `log_baseline_assessments` | Pre-session baseline (PHQ-9, GAD-7, history) |
| `log_session_vitals` | Real-time dosing session vitals |
| `log_meq30_responses` | Mystical Experience Questionnaire responses |
| `log_daily_pulse` | Daily integration check-ins |
| `log_longitudinal_assessments` | Post-session outcome tracking (PHQ-9 trajectory) |
| `log_integration_sessions` | Integration appointment records |
| `log_adverse_events` | Safety / adverse event documentation |

**Do NOT include:** `user_profiles`, `organizations`, or any table with account/admin data. This document is scoped to clinical session data only.

### Section 3: What We Explicitly Do NOT Collect

A short bulleted list:
- ✅ No participant names
- ✅ No dates of birth
- ✅ No addresses or contact information
- ✅ No free-text clinical notes
- ✅ No audio, video, or image recordings of sessions
- ✅ No financial information
- ✅ No government-issued identifiers

### Section 4: How Subject IDs Work

Three sentences. Plain English. For Bridger, this is the key paragraph:

> *"Every participant is assigned a random system-generated ID (e.g., PT-A7K3X9) at the moment of intake. This ID is the only identifier stored in our system. The connection between this ID and a real person is maintained exclusively in the clinic's own records — outside PPN Portal. We have no ability to identify whose data is in our system, and neither does anyone who accesses our database."*

---

## BLOCKING DEPENDENCY

⚠️ **This document cannot be finalized until the log table cleanup is complete.**

The USER noted on 2026-02-23 that some queries are currently writing direct values instead of pulling from `ref_` tables. Until that's fixed:
- Column descriptions will be inaccurate (some columns will show raw strings instead of FK references)
- The "No free-text fields" claim will be undermined if direct-write columns still exist

**PRODDY will draft the copy and structure now. INSPECTOR will validate column-by-column schema accuracy after the cleanup migration runs (USER approval required before final sign-off).**

⚠️ **SOOP DISCONTINUED 2026-02-25** — schema validation role transferred to INSPECTOR.

---

## DELIVERABLES

- [ ] `What_PPN_Collects_Schema_Overview.pdf` — branded PDF, partner-ready
- [ ] `ppn_schema_sample.csv` — raw column manifest for legal/technical reviewers
- [ ] Both files saved to `_WORK_ORDERS/BUSINESS_DOCS/` and `_WORK_ORDERS/05_USER_REVIEW/partner-launch-materials/`

## ROUTING

PRODDY (copy + structure) → INSPECTOR (schema accuracy validation + USER approval) → DESIGNER (PDF layout) → INSPECTOR (final QA gate) → 05_USER_REVIEW
