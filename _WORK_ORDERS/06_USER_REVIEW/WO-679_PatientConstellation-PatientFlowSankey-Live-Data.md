---
id: WO-679
title: "Connect PatientConstellation, PatientFlowSankey to live log_clinical_records data"
owner: BUILDER
status: 06_USER_REVIEW
priority: P1
created: 2026-03-24
origin: "Intelligence Gap Audit — Tier 2"
files:
  - src/components/analytics/PatientConstellation.tsx
  - src/components/analytics/PatientFlowSankey.tsx
---
## Problem
`PatientConstellation` (patient bubble/cluster view) and `PatientFlowSankey` (funnel/flow visualization) have no visible DB queries. They render visual representations of patient population and care flow but are not connected to real `log_clinical_records` data.

## Required Fix

### PatientConstellation
- Query `log_clinical_records` for the site: group by `substance_type`, `treatment_modality`, and `session_status`
- Each bubble = one patient UUID (de-identified), sized by session count, colored by substance
- Apply minimum-n guard: if fewer than 5 patients, show zero-state ("Not enough data to visualize")

### PatientFlowSankey
- Query `log_clinical_records` for the site: count records at each stage (Preparation → Consent → Dosing → Integration → Follow-up)
- Drop-off at each node = sessions that did not advance to the next stage
- Source: `session_status` field + form completion timestamps
- If total < 10 sessions: show zero-state

## Both Components
- Must use `useDataCache` pattern (5-min TTL)
- Must resolve `site_id` internally (post-WO-675 pattern)
- Must handle `loading`, `error`, and zero/suppressed states

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-24

---
- **Data from:** `log_clinical_records` (grouped by `substance_type`, `treatment_modality`, `session_status`, stage completion timestamps); `useDataCache` pattern (5-min TTL)
- **Data to:** No DB writes — `PatientConstellation.tsx` bubble display + `PatientFlowSankey.tsx` funnel display (read-only)
- **Theme:** Tailwind CSS, custom Recharts/D3 visualization — `PatientConstellation.tsx`, `PatientFlowSankey.tsx`; PPN design system; min-n suppression at n=5/10
