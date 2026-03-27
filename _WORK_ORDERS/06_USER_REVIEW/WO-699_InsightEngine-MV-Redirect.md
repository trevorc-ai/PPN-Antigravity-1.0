---
id: WO-699
title: "Redirect insightEngine service to read from mv_clinician_work_queue + mv_followup_window_compliance"
owner: BUILDER
status: 05_QA
priority: P2
created: 2026-03-26
completed_at: 2026-03-27
builder_notes: "insightEngine.ts MV redirect confirmed complete — ruleFollowUpLoss reads mv_clinician_work_queue, ruleDocumentationDecay reads mv_documentation_completeness + mv_followup_window_compliance, ruleWorseningPatients added, runInsightEngine priority order reflects mv_clinician_work_queue.priority_score DESC. InsightResult type preserved."
origin: "Intelligence Layer Integration Plan — Part 3 Analytics Streamlining"
pillar_supported: "1 — Safety Surveillance, 3 — QA and Governance"
depends_on: "WO-697 (Dashboard KPI wiring should land first so hooks are aligned)"
sequence_note: "Build after WO-697 is deployed. Do not build before WO-695/696 as the MVs will return sparse data and the redirect will look broken."
files:
  - src/services/insightEngine.ts
---

## Problem
`insightEngine.ts` currently reconstructs queue logic, follow-up compliance, and worsening
patient detection by stitching 5+ raw `log_*` table queries client-side. This duplicates
logic that `mv_clinician_work_queue` and `mv_followup_window_compliance` already compute
server-side with priority scoring. Violates the Read Model Policy (GLOBAL_CONSTITUTION §2).

## Required Fix
1. **Audit first** — map each `insightEngine` function to the MV field that covers it:
   - Worsening patient detection → `mv_clinician_work_queue.trajectory_state = 'worsening'`
   - Missed follow-up → `mv_clinician_work_queue.priority_score` + `mv_followup_window_compliance.is_overdue`
   - Unresolved safety → `mv_clinician_work_queue.unresolved_safety_count > 0`
   - Priority ranking → `mv_clinician_work_queue.priority_score DESC`

2. Redirect the core `runInsightEngine()` query to:
   ```ts
   // Source: mv_clinician_work_queue (capability #1 — clinician priority queue)
   // Source: mv_followup_window_compliance (capability #5 — follow-up compliance)
   ```

3. Preserve the existing `InsightResult` return type — callers do not change

4. Remove all multi-table raw stitching that is now covered by the MVs

## Success Criteria
- `insightEngine` output matches `mv_clinician_work_queue` priority ordering
- No raw joins across 3+ `log_*` tables remain in the service
- `// Source: mv_*` comment present on each primary query

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact. Read-only MV query. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-26

---
- **Data from:** `mv_clinician_work_queue` (capability #1), `mv_followup_window_compliance` (capability #5) — replaces multi-table raw `log_*` stitching
- **Data to:** No DB writes — `insightEngine.ts` service returns `InsightResult` type for consumer pages (read-only)
- **Theme:** No UI — TypeScript service (`src/services/insightEngine.ts`); no CSS

## INSPECTOR QA — Phase 2 Audit (2026-03-27)

### Phase 1: Scope & DB Audit
- [x] Database Freeze Check: PASS — .ts service file; no schema changes; reads existing MVs
- [x] Scope Check: PASS — insightEngine.ts only
- [x] Refactor Check: PASS — existing rules refactored to MV reads; InsightResult type preserved; no surface-area expansion

### Phase 2: UI Standards Enforcement — insightEngine.ts
- CHECK 1–5: ✅ PASS — pure TypeScript service; no JSX. Em dashes in file header comments only.

### Analytics Data Source Gate: ✅ PASS — now reads mv_clinician_work_queue + mv_followup_window_compliance as required.

INSPECTOR VERDICT: ✅ APPROVED | Date: 2026-03-27
