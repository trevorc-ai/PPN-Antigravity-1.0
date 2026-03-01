---
id: WO-523
title: Customer Journey Scoring + Prioritized Recommendations
owner: PRODDY
status: 98_HOLD
authored_by: PRODDY
priority: P1
created: 2026-02-28
depends_on: WO-521, WO-522
blocks: none
lead_hold_note: "Blocked pending WO-521 (framework research) and WO-522 (browser audit). LEAD will move to 01_TRIAGE automatically when both are marked complete."
---

## PRODDY PRD

> **Work Order:** WO-523 — Customer Journey Scoring + Prioritized Recommendations
> **Authored by:** PRODDY
> **Date:** 2026-02-28
> **Status:** Draft → Pending LEAD review

> ⚠️ **DEPENDENCY GATE:** This work order MUST NOT begin until WO-521 (framework selection) and WO-522 (browser journey map) are both marked complete in their respective files. LEAD enforces this gate.

---

### 1. Problem Statement

Once the framework (WO-521) and the journey map (WO-522) exist, PRODDY must apply the framework to the map and produce an objective scored assessment of PPN's customer journey. Without a score and prioritized recommendations, the practitioner cannot make sequenced, data-driven decisions about which journey gaps to close first. This work order produces the final deliverable: a scored matrix and an actionable improvement backlog.

---

### 2. Target User + Job-To-Be-Done

The practitioner-owner needs a scored assessment of PPN's current customer journey against an established UX framework, plus a prioritized list of improvement recommendations, so that they can make sequenced, ROI-justified decisions about journey improvements.

---

### 3. Success Metrics

1. Every journey stage documented in WO-522 receives a score on every criterion from WO-521's framework — zero blank cells in the scoring matrix.
2. PRODDY delivers ≥5 and ≤15 prioritized recommendations, each tied to a specific scored gap (no generic "improve UX" recommendations).
3. The practitioner can identify the top 3 highest-priority improvements without reading the full document — verified by a ≤5-minute review pass.

---

### 4. Feature Scope

#### ✅ In Scope

- Apply the scoring framework from WO-521 to each journey stage/path documented in WO-522.
- Produce a **scored matrix** — rows = journey stages (Awareness, Conversion, Auth, Onboarding, Core Use, Retention), columns = framework criteria, cells = 1–5 score + 1-line rationale.
- Calculate an **overall journey score** per stage and a total composite score.
- Flag **critical gaps** (any criterion scoring 1–2) with a "🚨 Critical" label.
- Produce a **prioritized recommendations backlog** — each item must include:
  - Which stage and criterion it addresses
  - Current score → target score
  - Effort estimate (Low / Medium / High)
  - Whether it requires a new work order or can be resolved in an existing one
- Deliver as a structured markdown document (`WO-523_Journey-Score-Recommendations.md`) placed in `_WORK_ORDERS/00_INBOX/`.

#### ❌ Out of Scope

- Implementing any recommendations — each actionable recommendation becomes its own future work order.
- Redesigning the landing page or any other component — this is analysis only.
- Scoring any route not in the WO-522 map (no scope expansion mid-task).
- Any database queries or schema inspection.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** This is the terminal deliverable of a three-part research chain. The practitioner explicitly requested objective scoring and recommendations — this is the output they are waiting for. Blocked only by WO-521 and WO-522.

---

### 6. Open Questions for LEAD

1. Should the final scored document be formatted for practitioner review only, or also for sharing with external partners (e.g. formatted as a shareable HTML report like the attorney presentation)?
2. If a recommendation requires changes to FREEZE.md-protected files (e.g. `WellnessJourney`, `DosingSessionPhase`), should PRODDY flag them as "frozen — deferred" rather than open recommendations?

*No additional open questions at this time.*

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
- [x] Frontmatter updated: `owner: PRODDY`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
