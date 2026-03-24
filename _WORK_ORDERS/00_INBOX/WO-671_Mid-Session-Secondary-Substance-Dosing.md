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

> **Work Order:** WO-671 — Mid-Session Secondary Substance Dosing Pattern (Intra-Session Combination Protocol)
> **Authored by:** PRODDY
> **Date:** 2026-03-23
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Dr. Allen's completed Ibogaine session log documents Ketamine being administered mid-session twice (25mg and 50mg IM) as an augmentation agent — not flagged pre-session, but deployed as a clinical intervention during the experience. PPN's current architecture treats secondary substances only as pre-session interaction risks. There is no logging path for a secondary substance administered during an active Phase 2 session. This clinical pattern is real, it is happening, and PPN cannot document it.

---

### 2. Target User + Job-To-Be-Done

An Ibogaine practitioner who administers a secondary substance (e.g., Ketamine, Magnesium IV) during an active session needs to log that dose with a timestamp, route, and dose amount directly in the Phase 2 timeline so that the complete pharmacological record is accurate and retrievable.

---

### 3. Success Metrics

1. A "Secondary Dose" event type is available in the Phase 2 Live Session Timeline that accepts: substance name (from structured vocabulary), dose in mg, route of administration (structured enum), and auto-timestamp — verified in ≥3 consecutive QA sessions.
2. Secondary dose events appear as visually distinct entries in the session timeline (separate from primary substance dose events) with no data loss on page refresh — verified in QA.
3. Secondary dose entries are included in the generated session PDF report within 30 days of ship.

---

### 4. Feature Scope

#### ✅ In Scope
- "Add Secondary Dose" action in Phase 2 Live Session Timeline
- Fields: substance name (structured dropdown from existing vocabulary — no free text), dose (mg, numeric), route (IV / IM / PO / Sublingual / Inhaled — structured), auto-timestamp
- Secondary dose events displayed distinctly in session timeline
- Secondary doses included in the session PDF export
- Support for pre-medication substances (e.g., IV Metoclopramide, IV MgCl) as well as augmentation substances (e.g., Ketamine)

#### ❌ Out of Scope
- Changes to the pre-session interaction checker or contraindication flagging logic
- Multi-substance cumulative dosing calculator (e.g., cross-substance mg/kg totals) — future analytics ticket
- Free-text substance entry — all substances must come from structured vocabulary
- Retroactive addition of secondary doses to completed/closed sessions

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** This is a documentation accuracy issue, not a UX preference. Dr. Allen's case proves this pattern is already occurring in clinical practice. Without this logging path, PPN's session record is pharmacologically incomplete every time a secondary agent is used mid-session. That is a liability gap, not a missing feature.

---

### 6. Open Questions for LEAD

1. Should secondary doses feed into any cumulative dose calculation, or are they logged as standalone clinical events?
2. Does the existing `session_doses` table (or equivalent) have a structure that can accommodate a `substance_type: secondary` flag, or does this require a new table?
3. Should IV pre-medications (Metoclopramide, MgCl) use the same substance vocabulary as psychedelic compounds, or a separate medication reference list?
4. Should secondary dose events trigger any real-time alerts (e.g., "Ketamine administered during Ibogaine session" — flag for cardiac monitoring)?
5. Is there a maximum number of secondary dose events the UI should support per session, or is it unlimited?

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
- [x] `database_changes: yes` — secondary dose event logging requires schema support
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
