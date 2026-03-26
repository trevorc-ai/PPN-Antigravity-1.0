---
description: /request-triage — North Star decision filter. Run BEFORE any task. Five questions that determine if work aligns with the five pillars, avoids the kill-list, and maps to the correct pipeline.
---

# /request-triage — North Star Decision Filter

> **Every agent, every task, every session.** Run this before accepting any new request.
> If you cannot answer YES to all five questions, stop and surface to the USER.

---

## The Five Questions

Answer each in order. A NO or UNCERTAIN on any question is a STOP.

### Q1 — Does this strengthen at least one pillar?

| Pillar | Triggers |
|--------|---------|
| 1 — Safety Surveillance | Risk flags, adverse event tracking, escalation logic, safety dashboards |
| 2 — Comparative Intelligence | Cross-protocol comparisons, outcome analytics, patient benchmarking |
| 3 — QA / Governance | Form completeness, protocol adherence, dropout tracking |
| 4 — Network Benchmarking | Peer network comparisons, `ref_` seed data, benchmark views |
| 5 — Research Infrastructure | Analytical exports, `v_`/`mv_` views, de-identified data structures |

**If the request maps to zero pillars → it is kill-list work. STOP. Flag to USER.**

---

### Q2 — Is any part of this request on the kill-list?

From GLOBAL_CONSTITUTION §6. Any YES = STOP immediately, flag to USER.

- [ ] Cosmetic dashboard with no `v_`/`mv_` SQL backing (once a real view exists or is planned)
- [ ] AI-generated clinical summary on mock, weak, or unvalidated data
- [ ] Free-text field where a `ref_` FK reference should exist
- [ ] One-off site customization that destroys cross-site standardization
- [ ] Analytics component that hardcodes data when a live view could be built
- [ ] Feature that maps to zero pillars

---

### Q3 — Does this respect locked architecture?

- [ ] Additive schema only (no DROP, RENAME, ALTER TYPE)
- [ ] RLS on all new `log_*` tables
- [ ] New tables use `log_` or `ref_` prefix (not generic names)
- [ ] Any analytics output reads from `v_` views or `mv_` materialized views (not hardcoded data)
- [ ] Zero PHI — patient data stored as Subject_ID FK only

---

### Q4 — Is this going through the correct pipeline?

| Work type | Correct pipeline |
|-----------|----------------|
| Platform feature, bug fix, React component, DB migration | `_WORK_ORDERS/` pipeline |
| Marketing copy, outreach HTML, PDF leave-behinds, public-facing content | `_GROWTH_ORDERS/` pipeline |
| Public-facing feature requiring engineering | Both pipelines (GO first, WO after `04_VISUAL_REVIEW`) |
| Strategy or PRD (PRODDY only) | Discussion first, then WO after USER approval |

---

### Q5 — Does this leave the system more standardized?

- [ ] No free-text introduced where structured FK exists
- [ ] No mock data made permanent
- [ ] No one-off logic encoded into platform that breaks cross-site consistency
- [ ] If modifying a shared component: dependency check run (`grep -r "ComponentName" src/ -l`)

---

## Triage Output

After running all five questions, state:

```
REQUEST TRIAGE — [Date]
Request: [One sentence]
Pillar(s): [1-5 or "NONE — kill-list, flagged to USER"]
Kill-list item: YES / NO
Architecture safe: YES / NO
Correct pipeline: [WO / GO / Both / N/A]
Standardization impact: IMPROVES / NEUTRAL / DEGRADES
Verdict: PROCEED / STOP — [reason]
```

If verdict is PROCEED, move to the next action (file a WO, write a PRD, start build, etc.).
If verdict is STOP, post the triage output to the USER and await direction.

---

## Confidence Labels (use in all output)

| Label | Meaning |
|-------|---------|
| **CONFIRMED** | Schema-verified or grep-verified from `src/` |
| **ASSUMED** | Reasonable inference, not verified against live DB |
| **PROPOSED** | Direction that seems right but needs USER approval |

Never present PROPOSED as CONFIRMED.

---
*Created 2026-03-25 per INSPECTOR SQL-Layers alignment audit. Implements GLOBAL_CONSTITUTION §6 decision filter.*
