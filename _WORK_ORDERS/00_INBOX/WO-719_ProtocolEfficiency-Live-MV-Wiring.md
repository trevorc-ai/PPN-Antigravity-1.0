---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
active_sprint: true
priority: P2
pillar_supported: "Pillar 3 — QA and Governance"
database_changes: no
files:
  - src/components/analytics/ProtocolEfficiency.tsx
data_from: mv_protocol_outcome_rollup
data_to: read-only (no writes)
theme: existing component CSS, no layout changes
---

## PRODDY PRD

### 1. Problem Statement
`ProtocolEfficiency` renders a financial efficiency / protocol ROI chart using hardcoded mock data. `mv_protocol_outcome_rollup` is live in production and provides per-protocol outcome aggregates. The component is a GLOBAL_CONSTITUTION Kill-List violation. Clinic operators are making protocol investment decisions based on fake ROI numbers.

### 2. Target User + Job-To-Be-Done
A clinic operator needs to compare real outcome efficiency across their active protocols so they can invest time and money in the treatments that produce the best results per session hour.

### 3. Success Metrics
1. All `MOCK DATA` constants removed from `ProtocolEfficiency.tsx` — INSPECTOR grep confirms
2. Chart renders real protocol rollups from `mv_protocol_outcome_rollup` grouped by `protocol_id`
3. Empty-state renders cleanly when no protocols have sufficient sessions for rollup

### 4. Feature Scope
#### In Scope:
- Replace mock constants with live reads from `mv_protocol_outcome_rollup`
- Site-scoped query (RLS or explicit `site_id` filter)
- Add `// Source: mv_protocol_outcome_rollup` per DB-First policy

#### Out of Scope:
- Adding new financial metrics (e.g. revenue per session)
- Redesigning the chart layout or axes
- Cross-site protocol comparison

### 5. Priority Tier
P2 — No safety risk but misleads operators. Important but not a Pillar 1 blocker.

### 6. Open Questions for LEAD
1. Does `mv_protocol_outcome_rollup` include a financial efficiency metric or only clinical outcome counts? LEAD to confirm shape before BUILDER starts.
2. How should the chart handle a protocol with n=1 session — suppress or flag?
