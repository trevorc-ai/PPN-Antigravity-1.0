# Command #016: Analytics Chart Improvements - Legends, Tooltips, Filters

**Date Issued:** Feb 13, 2026, 7:25 PM PST  
**Issued By:** LEAD (on behalf of User)  
**Assigned To:** BUILDER  
**Priority:** P1 - HIGH  
**Estimated Time:** 2-3 hours  
**Start After:** Command #014 (Analytics page filters) complete

---

## DIRECTIVE

Fix recharts rendering warnings and implement comprehensive chart improvements across all analytics pages:

1. **Legends** - Add clear, accessible legends to all charts
2. **Tooltips** - Implement rich tooltips with clinical context
3. **Functional Filters** - Wire up existing filter dropdowns
4. **Loading States** - Eliminate chart "jumping" during render

**User Requirement:** "Make sure legends, tooltips, filters, etc. are in place and functional."

---

## AFFECTED PAGES & COMPONENTS

### Analytics Pages (13 total)
1. `src/pages/Analytics.tsx` - Main analytics dashboard
2. `src/pages/deep-dives/RegulatoryMapPage.tsx`
3. `src/pages/deep-dives/ClinicPerformancePage.tsx`
4. `src/pages/deep-dives/PatientConstellationPage.tsx`
5. `src/pages/deep-dives/MolecularPharmacologyPage.tsx`
6. `src/pages/deep-dives/PatientFlowPage.tsx`
7. `src/pages/deep-dives/SafetySurveillancePage.tsx`
8. `src/pages/deep-dives/ComparativeEfficacyPage.tsx`
9. `src/pages/deep-dives/ProtocolEfficiencyPage.tsx`
10. `src/pages/deep-dives/RiskMatrixPage.tsx`
11. `src/pages/deep-dives/RevenueAuditPage.tsx`
12. `src/pages/deep-dives/WorkflowChaosPage.tsx`
13. `src/pages/deep-dives/PatientJourneyPage.tsx`
14. `src/pages/deep-dives/PatientRetentionPage.tsx`

### Chart Components
- `src/components/analytics/ClinicPerformanceRadar.tsx`
- `src/components/analytics/PatientConstellation.tsx`
- `src/components/analytics/MolecularPharmacology.tsx`
- `src/components/analytics/MetabolicRiskGauge.tsx`
- `src/components/analytics/ProtocolEfficiency.tsx`
- `src/components/analytics/SafetyBenchmark.tsx`
- All other chart components in `src/components/analytics/`

---

## ISSUE 1: Recharts Rendering Warnings

**Problem:** Console warnings during chart initialization
```
Warning: width(0) or height(-1)
```

**Cause:** Charts rendering before containers have dimensions

**Fix:** Implement loading states with skeleton loaders

### Implementation

**Create:** `src/components/ChartSkeleton.tsx`

```typescript
import React from 'react';

interface ChartSkeletonProps {
  height?: string;
  className?: string;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ 
  height = '400px', 
  className = '' 
}) => {
  return (
    <div 
      className={`animate-pulse bg-slate-800/50 rounded-lg ${className}`}
      style={{ height }}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-500 text-sm">Loading chart...</div>
      </div>
    </div>
  );
};
```

**Update all chart components:**

```typescript
import { ChartSkeleton } from '../ChartSkeleton';

const MyChartComponent: React.FC = () => {
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    // Delay chart render to ensure container has dimensions
    const timer = setTimeout(() => setChartReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!chartReady) {
    return <ChartSkeleton height="400px" />;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      {/* Chart content */}
    </ResponsiveContainer>
  );
};
```

---

## ISSUE 2: Missing Legends

**Problem:** Charts lack clear legends explaining data series

**Fix:** Add legends to all multi-series charts

### Implementation

**For Recharts components:**

```typescript
<LineChart data={data}>
  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
  <XAxis dataKey="name" stroke="#94a3b8" />
  <YAxis stroke="#94a3b8" />
  <Tooltip 
    contentStyle={{ 
      backgroundColor: '#1e293b', 
      border: '1px solid #334155',
      borderRadius: '8px'
    }}
    labelStyle={{ color: '#e2e8f0' }}
  />
  {/* ADD LEGEND */}
  <Legend 
    wrapperStyle={{ 
      paddingTop: '20px',
      fontSize: '14px'
    }}
    iconType="line"
  />
  <Line 
    type="monotone" 
    dataKey="baseline" 
    stroke="#06b6d4" 
    name="Baseline PHQ-9"
    strokeWidth={2}
  />
  <Line 
    type="monotone" 
    dataKey="post" 
    stroke="#10b981" 
    name="Post-Treatment PHQ-9"
    strokeWidth={2}
  />
</LineChart>
```

**Accessibility Requirements:**
- Font size ≥14px (WCAG AAA)
- High contrast colors
- Clear, descriptive labels
- No color-only meaning (use icons + text)

---

## ISSUE 3: Missing Tooltips

**Problem:** Charts lack rich tooltips with clinical context

**Fix:** Implement custom tooltips with clinical explanations

### Implementation

**Create:** `src/components/analytics/CustomTooltip.tsx`

```typescript
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  clinicalContext?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label,
  clinicalContext 
}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl">
      <p className="text-slate-100 font-semibold mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-300 text-sm">
            {entry.name}: <strong className="text-slate-100">{entry.value}</strong>
          </span>
        </div>
      ))}
      {clinicalContext && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-slate-400 text-xs italic">{clinicalContext}</p>
        </div>
      )}
    </div>
  );
};
```

**Usage in charts:**

```typescript
<Tooltip 
  content={
    <CustomTooltip 
      clinicalContext="PHQ-9 scores <5 indicate remission. Scores 10-14 indicate moderate depression."
    />
  }
/>
```

---

## ISSUE 4: Non-Functional Filters

**Problem:** Filter dropdowns exist but don't filter data

**Fix:** Wire up onChange handlers and filter logic

### Implementation

**File:** `src/pages/Analytics.tsx` (Lines 238-249)

**Current Code (Non-Functional):**
```typescript
<select className="...">
  <option>All Molecules</option>
  <option>Psilocybin</option>
  <option>MDMA</option>
  <option>Ketamine</option>
</select>
```

**Fixed Code:**

```typescript
const [selectedSubstance, setSelectedSubstance] = useState<string>('all');
const [selectedDateRange, setSelectedDateRange] = useState<string>('30');

// Filter data based on selections
const filteredData = useMemo(() => {
  let filtered = analyticsData;

  if (selectedSubstance !== 'all') {
    filtered = filtered.filter(d => d.substance === selectedSubstance);
  }

  if (selectedDateRange !== 'all') {
    const daysAgo = parseInt(selectedDateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    filtered = filtered.filter(d => new Date(d.date) >= cutoffDate);
  }

  return filtered;
}, [analyticsData, selectedSubstance, selectedDateRange]);

// Render filters
<select 
  value={selectedSubstance}
  onChange={(e) => setSelectedSubstance(e.target.value)}
  className="..."
>
  <option value="all">All Molecules</option>
  <option value="psilocybin">Psilocybin</option>
  <option value="mdma">MDMA</option>
  <option value="ketamine">Ketamine</option>
</select>

<select 
  value={selectedDateRange}
  onChange={(e) => setSelectedDateRange(e.target.value)}
  className="..."
>
  <option value="7">Last 7 Days</option>
  <option value="30">Last 30 Days</option>
  <option value="90">Last 90 Days</option>
  <option value="all">All Time</option>
</select>

// Pass filtered data to charts
<ClinicPerformanceRadar data={filteredData} />
<PatientConstellation data={filteredData} />
```

---

## ISSUE 5: Accessibility Compliance

**Problem:** Some charts may not meet WCAG AAA standards

**Fix:** Ensure all charts are fully accessible

### Requirements

**Color Contrast:**
- Text: ≥7:1 contrast ratio (WCAG AAA)
- Chart elements: ≥4.5:1 contrast ratio

**Keyboard Navigation:**
- All interactive elements focusable
- Clear focus indicators
- Logical tab order

**Screen Readers:**
- Descriptive ARIA labels
- Chart summaries for screen readers

**Implementation:**

```typescript
<div 
  role="img" 
  aria-label="Line chart showing patient PHQ-9 scores over time. Baseline average: 18, Post-treatment average: 6, indicating 67% improvement."
>
  <ResponsiveContainer>
    {/* Chart content */}
  </ResponsiveContainer>
</div>
```

---

## VERIFICATION CHECKLIST

### For Each Chart Component:

- [ ] **Loading state** - ChartSkeleton displays before render
- [ ] **Legend** - Clear, accessible legend with ≥14px font
- [ ] **Tooltip** - Rich tooltip with clinical context
- [ ] **Colors** - WCAG AAA contrast compliance
- [ ] **ARIA labels** - Descriptive labels for screen readers
- [ ] **No console warnings** - Zero recharts dimension warnings

### For Analytics Pages:

- [ ] **Filters functional** - Dropdowns filter data correctly
- [ ] **Filter state** - Selected values persist during navigation
- [ ] **Empty states** - "No data" message when filters return nothing
- [ ] **Performance** - Charts render in <500ms

---

## TESTING PLAN

### Automated Tests

```bash
# Component tests
npm run test -- src/components/analytics/*.test.tsx

# Integration tests
npm run test -- src/pages/Analytics.test.tsx
```

### Manual Testing

1. **Load Analytics page** - Verify no console warnings
2. **Test filters** - Select different substances and date ranges
3. **Hover charts** - Verify tooltips display correctly
4. **Check legends** - Verify all series labeled clearly
5. **Test accessibility** - Tab through page, verify focus indicators
6. **Test on mobile** - Verify responsive design

---

## DELIVERABLES

- [ ] `ChartSkeleton.tsx` component created
- [ ] `CustomTooltip.tsx` component created
- [ ] All 14 analytics pages updated with:
  - Loading states
  - Legends
  - Rich tooltips
  - Functional filters
- [ ] Zero console warnings
- [ ] WCAG AAA compliance verified
- [ ] Screenshots of 3 example charts (before/after)

---

## ESTIMATED TIME BREAKDOWN

- **ChartSkeleton component:** 15 minutes
- **CustomTooltip component:** 30 minutes
- **Update 6 main chart components:** 60 minutes (10 min each)
- **Wire up filters on Analytics.tsx:** 30 minutes
- **Test all 14 pages:** 30 minutes
- **Fix any issues:** 15 minutes

**Total:** 2 hours 30 minutes

---

## PRIORITY ORDER

1. **ChartSkeleton** (eliminates console warnings)
2. **Functional filters** (user-requested)
3. **Legends** (accessibility)
4. **Tooltips** (UX enhancement)
5. **ARIA labels** (accessibility)

---

## NOTES

- Use existing color palette from design system
- Maintain dark mode aesthetic
- Keep tooltips concise but informative
- Test with real data, not mock data
- Verify on Safari, Chrome, Firefox

---

**START AFTER COMMAND #014 COMPLETE**
