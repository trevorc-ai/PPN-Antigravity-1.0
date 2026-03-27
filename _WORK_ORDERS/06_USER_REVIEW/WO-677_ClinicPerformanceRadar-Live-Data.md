---
id: WO-677
title: "Connect ClinicPerformanceRadar to live DB data with minimum-n suppression"
owner: BUILDER
status: 06_USER_REVIEW
priority: P1
created: 2026-03-24
completed_at: 2026-03-26
origin: "Intelligence Gap Audit - Tier 2"
files:
  - src/components/analytics/ClinicPerformanceRadar.tsx
  - src/hooks/useClinicBenchmarks.ts (NEW)
builder_notes: "Both files fully implemented in prior session. useClinicBenchmarks.ts queries log_clinical_records + log_safety_events + log_phase1_consent with min-n=20 suppression; 4 live spokes (Safety/Completion/DataQuality/Consent), 2 suppressed until WO-680. ClinicPerformanceRadar.tsx wired to hook with tooltip definitions. BUILDER fixed PPN UI Standards violations: bare text-xs upgraded, text-slate-600 upgraded to text-slate-500, em-dashes replaced in rendered JSX and JS definition strings."
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

## MV LAYER AMENDMENT — 2026-03-26
The intelligence layer is now live. Preferred data sources updated:
- Safety spoke: prefer `mv_site_safety_benchmarks` over raw `log_safety_events` (handles min-N)
- Completion / Data Quality spokes: prefer `mv_documentation_completeness` over raw field checks
- Efficacy / Adherence: still suppressed until WO-NEW-D (depends on WO-677 completing first)
- Site outcome benchmarks: prefer `mv_site_outcome_benchmarks` for peer comparison context
All hooks must include `// Source: mv_*` comment per GLOBAL_CONSTITUTION Read Model Policy.

---
- **Data from:** `mv_site_safety_benchmarks`, `mv_documentation_completeness`, `mv_site_outcome_benchmarks` (post-amendment); fallbacks: `log_clinical_records`, `log_safety_events`, `log_phase1_consent`
- **Data to:** No DB writes — `ClinicPerformanceRadar.tsx` radar chart display only; `useClinicBenchmarks.ts` hook (read-only)
- **Theme:** Tailwind CSS, Recharts (radar chart) — `ClinicPerformanceRadar.tsx`; PPN design system; min-n suppression at n=20
