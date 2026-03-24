---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
active_sprint: false
priority: P1
created: 2026-03-23
database_changes: no
source_analysis: proddy_dr_allen_analysis.md
files: []
---

## PRODDY PRD

> **Work Order:** WO-672 — ECG Baseline Safety Gate Before Phase 2 Session Start
> **Authored by:** PRODDY
> **Date:** 2026-03-23
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Ibogaine's primary cardiac risk is QT interval prolongation. A patient's baseline QTc must be established before Ibogaine is administered, because QT prolongation risk is measured as a delta from baseline — a reading of 480ms is dangerous if the baseline was 420ms, but possibly normal if the baseline was 475ms. Dr. Allen's form includes "Baseline ECG / QTc" as a listed pre-session check. PPN has ECG monitoring capability but no confirmed hard gate preventing Phase 2 from starting without a baseline ECG being logged first.

---

### 2. Target User + Job-To-Be-Done

An Ibogaine practitioner needs to be prevented from starting an active session (Phase 2) in PPN until a baseline ECG with QTc reading has been recorded so that all intra-session cardiac monitoring is interpreted against a documented baseline and patient safety is enforced at the platform level.

---

### 3. Success Metrics

1. Attempting to advance from Phase 1 to Phase 2 for an Ibogaine session without a documented baseline QTc entry produces a blocking error — not a warning — in ≥10 consecutive QA attempts.
2. The baseline QTc value is displayed persistently in the Phase 2 monitoring interface alongside intra-session QTc readings for real-time delta reference — verified visually in QA.
3. Baseline QTc appears in the generated session PDF report in the pre-session section within 30 days of ship.

---

### 4. Feature Scope

#### ✅ In Scope
- Hard gate on Phase 2 entry for Ibogaine sessions: baseline ECG / QTc field must be populated
- Baseline QTc value surfaced as a persistent reference in the Phase 2 active session monitoring view
- Baseline QTc included in session PDF report (pre-session section)
- Gate applies to Ibogaine (HCl and TPA) protocols only

#### ❌ Out of Scope
- ECG gate for non-Ibogaine modalities (e.g., psilocybin, MDMA) — different risk profiles
- Full ECG report upload or PDF parsing
- Automated integration with external cardiac monitoring devices
- Changes to the Dual QT Interval Tracker (covered separately by existing functionality)
- Any changes to Phase 3 closeout flow

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** This is a patient safety feature. Ibogaine-related cardiac deaths are documented in the literature and are the primary reason Ibogaine remains Schedule I. A platform that does not enforce baseline ECG documentation before Ibogaine administration is not clinically credible and cannot be recommended by any medical oversight board. This gate is the minimum safety bar.

---

### 6. Open Questions for LEAD

1. Is this gate enforced at the UI/UX level only, or should it be enforced at the API level as well (preventing Phase 2 record creation server-side)?
2. Should Ibogaine protocol detection be based on `primary_substance` field value, or is there a dedicated `protocol_type: ibogaine` flag in the data model?
3. What is the UX for the blocking error — a modal with instructions, an inline form that accepts the baseline QTc in place, or a redirect back to Phase 1?
4. Should the gate apply to existing in-progress sessions that were started before this feature ships (backward compatibility)?
5. Does the "Baseline ECG / QTc" requirement also need to show a QTc danger threshold warning if the baseline itself is concerning (e.g., >450ms before any Ibogaine is administered)?

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
- [x] `database_changes: no` — baseline QTc field likely already exists; this is a gate/UX enforcement ticket
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
