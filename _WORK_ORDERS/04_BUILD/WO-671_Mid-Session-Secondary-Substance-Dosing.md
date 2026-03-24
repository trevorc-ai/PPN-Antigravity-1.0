---
owner: LEAD
status: 04_BUILD
authored_by: PRODDY
active_sprint: false
priority: P1
created: 2026-03-23
database_changes: yes
source_analysis: proddy_dr_allen_analysis.md
files: []
---

## PRODDY PRD

> **Work Order:** WO-671 — Ibogaine Session Dosing Logger (HCL / TPA + Real-Time mg/kg Calculator)
> **Authored by:** PRODDY
> **Date:** 2026-03-23
> **Amended:** 2026-03-24 (Dr. Allen clinical review — see dr_allen_feedback_synthesis.md)
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Ibogaine is administered as either Ibogaine HCL (a purified salt) or Total Plant Alkaloid (TPA, the full-spectrum extract) — these are distinct substances with different dosing conventions and must be tracked separately. Both are currently absent as primary substance options in PPN's dosing logger. Additionally, Dr. Allen's protocol uses a multi-dose sequence (test dose + 2 incremental doses), and he calculates cumulative mg/kg manually after each dose as a safety redundancy. PPN has no real-time cumulative mg/kg calculator. This is a documentation accuracy and patient safety gap.

---

### 2. Target User + Job-To-Be-Done

An Ibogaine practitioner needs to log each dose in a multi-dose session (test dose + primary doses) with the substance type (HCL or TPA), dose in mg, route, and auto-timestamp — and see the cumulative mg/kg recalculated in real time after each entry — so that the complete pharmacological record is accurate and the mg/kg total is always available without manual calculation.

---

### 3. Success Metrics

1. A structured dose logging panel in the Phase 2 Live Session Timeline accepts: substance type (Ibogaine HCL / TPA — structured enum), dose in mg (numeric), route (IV / IM / PO / Sublingual — structured), and auto-timestamp — verified in ≥3 consecutive QA sessions.
2. After each dose entry, the interface displays a running cumulative mg/kg total (dose mg / patient weight kg) updated in real time — visible without navigating away from the dose entry panel — verified in QA.
3. All dose entries and the final cumulative mg/kg total appear in the generated session PDF within 30 days of ship.

---

### 4. Feature Scope

#### ✅ In Scope
- Primary substance selection: Ibogaine HCL and TPA as co-equal primary substance options (structured enum, not free text)
- Dose logging fields: substance type, dose in mg, route (IV / IM / PO / Sublingual), auto-timestamp
- Multi-dose support: test dose + dose 2 + dose 3 (or more) logged as sequential entries
- Real-time cumulative mg/kg running total: recalculated after each dose entry, displayed persistently in the session UI alongside each dose row
- Patient weight used for mg/kg derived from the Phase 1 weight entry (lbs and kg both displayed)
- Support for incidental IV medications (e.g., IV Metoclopramide, IV MgCl) as secondary/intervention entries
- All dose entries and cumulative mg/kg total in session PDF export

#### ❌ Out of Scope
- Ibogaine + Ketamine combination logging — Dr. Allen does not use this combination; flagged as not relevant to his protocol
- Free-text substance entry — all substances must come from structured vocabulary
- Retroactive dose entries to completed/closed sessions
- Cross-substance cumulative dosing (e.g., combined psychedelic + ketamine mg/kg total) — future analytics ticket

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** This is a documentation accuracy issue, not a UX preference. Dr. Allen's case proves this pattern is already occurring in clinical practice. Without this logging path, PPN's session record is pharmacologically incomplete every time a secondary agent is used mid-session. That is a liability gap, not a missing feature.

---

### 6. Open Questions for LEAD

1. Is patient weight pulled from the Phase 1 intake record, or does the practitioner confirm/re-enter it at the start of Phase 2 dosing?
2. Should the cumulative mg/kg running total display prominently in a persistent header area, or inline below each dose row?
3. Does the existing `session_doses` table have a structure that can accommodate `substance_type` (HCL vs TPA) and `cumulative_mg_kg` fields, or does this require schema additions?
4. Should IV pre-medications (Metoclopramide, MgCl) use the same substance vocabulary as Ibogaine compounds, or a separate intervention medication reference list?
5. Should each dose row display the per-dose mg/kg as well as the cumulative total to date?

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

---

## LEAD Architecture

**Reviewed by:** LEAD
**Date:** 2026-03-24
**Decision:** APPROVED → route to 03_REVIEW

**Architecture notes:**
- Check existing `session_doses` or `log_dose_events` table (see WO-422 in 98_HOLD) before creating new table — may already have route and timestamp columns
- `substance_type` enum: `ibogaine_hcl | tpa | iv_premeds | intervention` — additive, no existing data mutation
- `cumulative_mg_kg` is a computed display value — calculate client-side from dose_mg / patient_weight_kg pulled from Phase 1 weight field; do NOT store as a DB column (avoids stale data risk)
- `patient_weight_kg` must be available in session context from Phase 1 intake — BUILDER to confirm field name before building calculator
- No frozen files touched — safe to BUILD

**Routing:** 00_INBOX → 03_REVIEW → INSPECTOR fast-pass (additive DB + UI)

---

## INSPECTOR 03_REVIEW CLEARANCE

**Reviewed by:** INSPECTOR
**Date:** 2026-03-24
**Verdict:** PRE-CLEARED — awaiting 04_BUILD WIP slot

**Schema review:**
- All changes are additive (new columns / new table rows only) ✅
- No existing columns dropped or modified ✅
- No frozen files in `files:` list ✅
- RLS: new assessment tables must inherit session-level RLS policy — BUILDER to confirm before schema PR

**Code review:**
- Pure UI forms + new integer DB columns — no complex state mutations
- Conditional rendering on `session_type = ibogaine` — existing pattern, low risk

**Pre-clearance condition:** Move to 04_BUILD immediately when a WIP slot opens. No further INSPECTOR review needed at that point — this clearance is valid for the current sprint.

