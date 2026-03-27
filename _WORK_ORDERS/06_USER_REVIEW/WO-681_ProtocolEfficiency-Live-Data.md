---
id: WO-681
title: "Connect ProtocolEfficiency to live session timing data"
owner: BUILDER
status: 06_USER_REVIEW
priority: P1
created: 2026-03-24
origin: "Intelligence Gap Audit — Tier 2"
files:
  - src/components/analytics/ProtocolEfficiency.tsx
---
## Problem
`ProtocolEfficiency` renders an efficiency chart. It is unclear whether it queries `log_clinical_records` for real session timing data (planned vs. actual session duration, close times, delays) or renders static/mock values.

## Required Fix
1. **Audit first** — confirm current data source
2. Wire to `log_clinical_records` querying:
   - `session_date` (planned)
   - `created_at` vs. `updated_at` as proxy for session duration where explicit close time is unavailable
   - `session_status = 'active'` filter
3. Efficiency metric = sessions completed without extension or safety events / total sessions
4. Trend by month if ≥ 3 months of data available
5. Zero-state if fewer than 5 sessions

## Success Criteria
- Chart values are derived from real session records
- Visible in the component: "Based on X sessions, YYYY-MM to YYYY-MM"

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-24

## MV LAYER AMENDMENT — 2026-03-26
Prefer `v_session_summary` over direct `log_clinical_records` queries.
`v_session_summary` provides a pre-shaped session object (session_date, status, site_id,
substance_name, dosage) without requiring raw joins. Use as primary source.
Comment: `// Source: v_session_summary (capability #12 — reusable session summary read model)`

---
- **Data from:** `v_session_summary` (post-amendment preferred source — capability #12); fallback: `log_clinical_records` (`session_date`, `session_status`, timing fields)
- **Data to:** No DB writes — `ProtocolEfficiency.tsx` efficiency chart display only (read-only)
- **Theme:** Tailwind CSS, Recharts — `ProtocolEfficiency.tsx`; PPN design system; min-n suppression at n=5; trend by month if ≥3 months data
