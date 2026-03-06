# WO-555 — Analytics Page: Data + Visualization Sprint

**Page:** `src/pages/Analytics.tsx`
**Priority:** High
**Assigned to:** BUILDER
**Status:** 03_BUILD
**Created:** 2026-03-06 | **Scoped by LEAD:** 2026-03-06
**Skill:** `frontend-surgical-standards.md`
**Routing table:** `work-order-triage.md`

> ⚠️ **LEAD SPLIT:** Items 1–5 are blocked on DB seed (USER action required in Supabase staging) and VIZ workflow. Items 6 + 8 are unblocked and must ship NOW. BUILDER executes 6 + 8 only. Items 1–5 will be re-opened in `98_HOLD` as WO-555B once DB seed is confirmed.

---

## ✅ BUILDER SCOPE — Ship immediately (no blockers)

### 1. UNBLOCK KPI Ribbon (4 cards)
**Root cause:** `log_user_sites` has no row for current user → `siteId = null` → all queries return zero.

**Fix:**
- Confirm `proftrevorc` user has a row in `log_user_sites(user_id, site_id)`
- If missing, insert via staging Supabase console or seed migration
- Verify `mv_clinic_benchmarks` has rows for that `site_id`
- Hook: `src/hooks/useAnalyticsData.ts`

---

### 2. UNBLOCK Safety Benchmark
**Root cause:** Same `site_id` gate as above.

**Fix:** Confirm rows in `log_clinical_records` and `log_safety_events` with matching `site_id`.
**Hook:** `src/hooks/useSafetyBenchmark.ts`

---

### 3. UNBLOCK Clinical Intelligence Feed (InsightFeedPanel)
**Root cause:** Same `site_id` gate.

**Fix:** Requires rows in `log_clinical_records`, `log_integration_sessions`, `log_longitudinal_assessments`, `log_session_vitals`, `log_baseline_assessments`.
**Component:** `src/components/analytics/InsightFeedPanel.tsx`

---

### 4. Performance Radar — ⛔ BLOCKED — Wait for VIZ workflow
**Current state:** 100% hardcoded mock data arrays `DATA_QUARTER` / `DATA_YEAR`. Never live.

**Action:** Execute `/data-viz` workflow to connect real queries from `mv_clinic_benchmarks` or `log_clinical_records`, grouped by metric dimension (Efficacy, Safety, Retention, Speed, Revenue, Compliance).
**File:** `src/components/analytics/ClinicPerformanceRadar.tsx`

---

### 5. Patient Galaxy — ⛔ BLOCKED — Wait for VIZ workflow
**Current state:** `MOCK_DATA` array always used. `filteredData` is hardcoded `undefined` in Analytics.tsx (line 36).

**Action:** Execute `/data-viz` workflow to replace mock scatter data with real patient outcome queries. Remove `return undefined` no-op in `filteredData` useMemo.
**File:** `src/components/analytics/PatientConstellation.tsx`

---

### 6. ✅ DELETE Global Benchmark Intelligence section — UNBLOCKED
Remove from `Analytics.tsx` lines 290–306: section header, "Live Data" badge, `<GlobalBenchmarkIntelligence>` component, and its import (line 21) if unused elsewhere.

---

### 7. Chart Filters — No change until VIZ workflow completes
**FYI for user:** The "Chart Filters" bar (Molecule + Date Range dropdowns with tune icon) is visible **desktop only** (`xl` breakpoint) — hidden on mobile. Currently a no-op as `filteredData` is `undefined`. Will be wired once items 4 & 5 are live.

---

### 8. ✅ Export PDF — Update filename — UNBLOCKED
**Fix:** In `handlePrint()` (`Analytics.tsx` line 58), set `document.title` to `PPN Clinic Report [yyyy-mm-dd]` before `window.print()`, restore after.

**Exact pattern (mirrors InteractionChecker.tsx fix):**
```tsx
const handlePrint = () => {
  const prev = document.title;
  document.title = `PPN Clinic Report ${new Date().toISOString().slice(0, 10)}`;
  window.print();
  window.addEventListener('afterprint', () => { document.title = prev; }, { once: true });
};
```

---

## Files
| File | Change |
|------|--------|
| `src/pages/Analytics.tsx` | Delete GBI section, fix PDF filename, wire filteredData |
| `src/components/analytics/ClinicPerformanceRadar.tsx` | Replace mock with live queries |
| `src/components/analytics/PatientConstellation.tsx` | Replace mock with live queries |
| Supabase staging | Insert `log_user_sites` row for `proftrevorc` |

## Dependencies
- Items 4, 5, 7 → VIZ workflow execution
- Items 1–3 → DB seed/insert in staging first
