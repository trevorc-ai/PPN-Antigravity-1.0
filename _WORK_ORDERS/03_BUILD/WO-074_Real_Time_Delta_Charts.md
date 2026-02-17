---
id: WO-074-DELTA
status: 03_BUILD
priority: P0 (Blocking)
category: Feature
owner: BUILDER
failure_count: 0
---

# Week 1 Value: Real-Time Delta Charts

## User Request
Build real-time delta charts that show baseline → current comparison immediately after data entry, proving treatment efficacy to practitioners.

## Strategic Context
> "Platform MUST deliver visible operational value in **first 2 weeks**, not 6 months"

**Week 1 Value:** Show practitioners their data **instantly** after first form submission

## LEAD ARCHITECTURE

### Technical Strategy
Create interactive charts that visualize patient progress from baseline to current state, with network benchmarks when available (N ≥ 10).

### Files to Touch
- `src/components/charts/DeltaChart.tsx` (NEW)
- `src/components/charts/MultiMetricDashboard.tsx` (NEW)
- `src/components/charts/NetworkBenchmark.tsx` (NEW)
- `src/hooks/useMetricTrends.ts` (NEW)
- `src/utils/chartCalculations.ts` (NEW)
- `src/pages/WellnessJourney.tsx` (MODIFY)

### Constraints
- Must update in real-time as forms are submitted
- Must show % improvement/decline
- Must support network benchmarks (when N ≥ 10)
- Must be mobile-friendly with touch interactions

## Proposed Changes

### Component 1: PHQ-9 Delta Chart

**UI:**
```
┌─────────────────────────────────────┐
│ 🧠 PHQ-9 Depression Score           │
│                                     │
│ Baseline: 21 (Severe)               │
│ Current:  12 (Moderate)             │
│                                     │
│ ↓ 43% Improvement                   │
│                                     │
│ [Chart: Line graph showing trend]   │
│ 21 → 18 → 15 → 12                   │
│                                     │
│ 📊 Network Average: 15              │
│ Your patient is improving faster    │
│ than 65% of similar cases           │
└─────────────────────────────────────┘
```

**Features:**
- Line chart with 4+ data points
- Color-coded trend (green = improving, red = declining, yellow = stable)
- Clinical threshold lines (e.g., PHQ-9 > 20 = severe)
- Network benchmark overlay (when available)

---

### Component 2: Multi-Metric Dashboard

**UI:**
```
┌─────────────────────────────────────┐
│ 📊 Treatment Progress Overview      │
│                                     │
│ PHQ-9:  21 → 12  (↓ 43%)            │
│ GAD-7:  12 → 7   (↓ 42%)            │
│ PCL-5:  85 → 45  (↓ 47%)            │
│                                     │
│ Overall Improvement: 44%            │
│                                     │
│ [View Detailed Charts]              │
└─────────────────────────────────────┘
```

**Features:**
- Shows all tracked metrics in one view
- Calculates overall improvement average
- Click to expand individual charts
- Swipe to navigate between metrics (mobile)

---

### Component 3: Network Benchmarks

**UI:**
```
💡 Insight: Your patient's improvement rate
is in the top 35% of the network.

Similar patients (n=127):
- Average PHQ-9 reduction: 28%
- Your patient: 43% reduction

[View Network Comparison]
```

**Features:**
- Only shows when N ≥ 10 (suppression rule)
- Compares to similar patients (age group, baseline severity)
- Shows percentile ranking
- Provides actionable insights

---

## Verification Plan

### Automated Tests
```bash
npm run test -- DeltaChart.test.tsx
npm run test -- MultiMetricDashboard.test.tsx
npm run test -- chartCalculations.test.ts
```

### Manual Verification
1. **Baseline Only:** Verify shows "No follow-up data yet"
2. **After Follow-Up:** Verify shows baseline → current with % change
3. **Improvement:** Verify green trend line for improving metrics
4. **Decline:** Verify red trend line for declining metrics
5. **Network Benchmark:** Verify shows when N ≥ 10
6. **Suppression:** Verify hides when N < 10
7. **Real-Time Update:** Verify updates immediately after form submission

### Accessibility
- Keyboard navigation (Tab, Arrow keys)
- Screen reader announces trend direction
- Color + text labels (not color-only)
- High contrast mode compatible

---

## Dependencies
- Patient baseline data (Phase 1)
- Follow-up assessment data (Phase 3)
- Network data (optional, for benchmarks)

## Estimated Effort
**12-16 hours** (3-4 days)

## Success Criteria
- ✅ Shows baseline vs. current for all tracked metrics
- ✅ Calculates and displays % improvement
- ✅ Visual trend line (green/red/yellow)
- ✅ Network benchmarks (when N ≥ 10)
- ✅ Updates immediately after form submission
- ✅ Multi-metric dashboard shows overall progress
- ✅ Mobile-friendly with touch interactions

---

**Status:** Ready for LEAD assignment
