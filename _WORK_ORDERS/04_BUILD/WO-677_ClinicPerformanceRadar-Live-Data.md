---
id: WO-677
title: "Connect ClinicPerformanceRadar to live DB data with minimum-n suppression"
owner: BUILDER
status: 00_INBOX
priority: P1
created: 2026-03-24
origin: "Intelligence Gap Audit — Tier 2"
files:
  - src/components/analytics/ClinicPerformanceRadar.tsx
  - src/hooks/useClinicBenchmarks.ts (NEW)
---
## Problem
`ClinicPerformanceRadar` renders a spider chart with spokes for Safety, Retention, Efficacy, Adherence, Data Quality, and Compliance. The values for these spokes are currently **not derived from real DB queries against the practitioner's own session data**. This is confirmed by the absence of any `supabase` or `useDataCache` call in the component. ChatGPT classifies this as "dashboard theater."

## Required Fix
1. Create `src/hooks/useClinicBenchmarks.ts` — a self-contained hook (same pattern as `useAnalyticsData` post-WO-675) that:
   - Resolves `user → site_id` internally
   - Queries `log_clinical_records`, `log_safety_events`, `log_assessments` (if available) to compute each spoke
   - Applies minimum-n suppression: if total sessions < 20, return `suppressed: true` and render a "Insufficient data" state instead of fake numbers
2. **Spoke definitions (must be documented in code comments):**
   - **Safety** = (sessions without AEs) / total sessions × 100
   - **Completion** = sessions with `session_status = 'active'` (closed) / all non-draft sessions × 100
   - **Data Quality** = sessions with all required fields populated / total sessions × 100
   - **Consent** = sessions with consent timestamp / total sessions × 100
   - Efficacy and Adherence: **suppress** until assessment score data pipeline is live (WO-680)
3. Wire `ClinicPerformanceRadar` to the new hook
4. Every spoke value must display its definition on hover (tooltip: "Safety: X of Y sessions had no adverse events")

## Success Criteria
- Radar chart values match `My Protocols` session count and `log_safety_events` AE count
- If n < 20: renders "Minimum data threshold not yet met (need 20 sessions)" instead of the chart
- No hardcoded numbers anywhere in the component

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-24
