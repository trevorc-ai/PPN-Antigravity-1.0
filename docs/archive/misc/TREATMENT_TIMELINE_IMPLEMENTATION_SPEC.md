# 🎨 TREATMENT TIMELINE: Implementation Specification

**Designer:** Antigravity  
**Date:** 2026-02-10  
**Status:** READY FOR INVESTIGATOR REVIEW → BUILDER EXECUTION  
**Page:** Protocol Detail (`ProtocolDetail.tsx`)

---

## 🎯 Objective

Add a **Treatment History Timeline** component to the Protocol Detail page that:
1. ✅ Shows multiple treatments for a single patient over time
2. ✅ Displays day-level temporal precision (Day 0, Day 8, Day 11)
3. ✅ Visualizes outcome progression (PHQ-9 scores)
4. ✅ Supports filtering and analysis
5. ✅ Has **distinct screen and print layouts**
6. ✅ Fits on 1 printed page (landscape)

---

## 📐 SCREEN LAYOUT DESIGN

### **Placement:**
Insert **between** Receptor Affinity Profile and Therapeutic Envelope containers (left panel, 2/3 width)

### **Visual Structure:**

```
┌─────────────────────────────────────────────────────────────────────┐
│ TREATMENT HISTORY TIMELINE                    [Filters ▼] [Print]  │
│ 4 Sessions • 45 Days Total • 39% Improvement                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PHQ-9                                                               │
│   20│                                                                │
│   18│●                                                               │
│   15│  ╲                                                             │
│   12│    ●─────●                                                     │
│   10│          ╲                                                     │
│    8│            ●                                                   │
│    5│- - - - - - - - - - - - - - - - - - - (Remission Threshold)   │
│    0│                                                                │
│     └────┬────────┬────────┬────────┬─────                          │
│        Day 0    Day 8   Day 11  Day 15                              │
│          │        │        │        │                                │
│       ┌──┴──┐  ┌──┴──┐  ┌──┴──┐  ┌──┴──┐                           │
│       │ P1  │  │ P2  │  │ P3  │  │ P4  │                            │
│       │Psilo│  │Psilo│  │MDMA │  │Psilo│                            │
│       │25mg │  │50mg │  │100mg│  │25mg │                            │
│       │💊   │  │💊   │  │💉   │  │💊   │                            │
│       └─────┘  └─────┘  └─────┘  └─────┘                            │
│                  ↓-17%    ↓-20%    ↓-8%                              │
│                           ⚠AE                                        │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ KEY INSIGHTS                                                         │
│ ✓ 39% total symptom reduction (PHQ-9: 18 → 11)                     │
│ ⭐ Best response: Treatment 2 (Psilocybin 50mg, -20%)               │
│ ⚠ Substance switch at Treatment 3 (MDMA trial)                     │
│ ⚠ 1 adverse event (Treatment 3, Grade 2 Nausea, resolved)          │
└─────────────────────────────────────────────────────────────────────┘
```

### **Screen Layout Specifications:**

#### **Container:**
```tsx
<section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative print:hidden">
  {/* Timeline content */}
</section>
```

#### **Header:**
```tsx
<div className="flex justify-between items-center mb-8">
  <div className="flex items-center gap-4">
    <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
      <span className="material-symbols-outlined text-2xl">timeline</span>
    </div>
    <div>
      <h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">
        Treatment History Timeline
      </h3>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
        {treatmentCount} Sessions • {totalDays} Days • {improvementPct}% Improvement
      </p>
    </div>
  </div>
  <div className="flex gap-3">
    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-black uppercase tracking-widest">
      Filters ▼
    </button>
    <button onClick={handlePrint} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-xs font-black uppercase tracking-widest">
      Print
    </button>
  </div>
</div>
```

#### **Chart Area:**
```tsx
<div className="h-[300px] w-full bg-slate-900/30 rounded-3xl border border-slate-800 p-6">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
      {/* Chart configuration */}
    </AreaChart>
  </ResponsiveContainer>
</div>
```

#### **Treatment Cards (Below Chart):**
```tsx
<div className="flex justify-around mt-4 px-6">
  {treatments.map((tx, idx) => (
    <div key={tx.id} className="flex flex-col items-center gap-2">
      <div className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-center min-w-[100px]">
        <span className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">
          P{idx + 1}
        </span>
        <span className="block text-sm font-bold text-white">
          {tx.substance}
        </span>
        <span className="block text-xs text-slate-400">
          {tx.dosage}{tx.dosageUnit}
        </span>
        <span className="block text-lg mt-1">
          {getRouteIcon(tx.route)}
        </span>
      </div>
      {idx > 0 && (
        <span className={`text-sm font-bold ${getDeltaColor(tx.delta)}`}>
          {tx.delta > 0 ? '↑' : '↓'}{Math.abs(tx.delta)}%
        </span>
      )}
      {tx.hasAdverseEvent && (
        <span className="text-xs text-red-400">⚠ AE</span>
      )}
    </div>
  ))}
</div>
```

#### **Key Insights Panel:**
```tsx
<div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Key Insights</h4>
  <ul className="space-y-2">
    <li className="flex items-center gap-3 text-sm font-medium text-slate-300">
      <span className="text-clinical-green">✓</span>
      {overallImprovement}% total symptom reduction (PHQ-9: {firstScore} → {lastScore})
    </li>
    <li className="flex items-center gap-3 text-sm font-medium text-slate-300">
      <span className="text-amber-500">⭐</span>
      Best response: Treatment {bestTreatmentNum} ({bestSubstance} {bestDosage}, {bestDelta}%)
    </li>
    {hasSubstanceSwitch && (
      <li className="flex items-center gap-3 text-sm font-medium text-slate-300">
        <span className="text-amber-500">⚠</span>
        Substance switch at Treatment {switchTreatmentNum} ({switchDetails})
      </li>
    )}
    {adverseEvents.length > 0 && (
      <li className="flex items-center gap-3 text-sm font-medium text-slate-300">
        <span className="text-red-500">⚠</span>
        {adverseEvents.length} adverse event(s) ({adverseEventSummary})
      </li>
    )}
  </ul>
</div>
```

---

## 🖨️ PRINT LAYOUT DESIGN

### **Placement:**
Appears **after** Receptor Affinity Profile in print view (replaces screen timeline)

### **Visual Structure:**

```
TREATMENT HISTORY TIMELINE
4 Sessions • 45 Days • 39% Improvement

PHQ-9 Trajectory:
 18 ●────●15────●12────●11
    ↓17%  ↓20%  ↓8%
────────────────────────────────── (Remission < 5)

Day 0      Day 8      Day 11     Day 15
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│   P1   │ │   P2   │ │   P3   │ │   P4   │
│ Psilo  │ │ Psilo  │ │  MDMA  │ │ Psilo  │
│  25mg  │ │  50mg  │ │ 100mg  │ │  25mg  │
│  Oral  │ │  Oral  │ │   IV   │ │  Oral  │
│ PHQ:18 │ │ PHQ:15 │ │ PHQ:12 │ │ PHQ:11 │
└────────┘ └────────┘ └────────┘ └────────┘
           ↓-17%      ↓-20%      ↓-8%
                      ⚠ AE

KEY INSIGHTS:
✓ 39% total symptom reduction (PHQ-9: 18→11)
⭐ Best response: Treatment 2 (Psilocybin 50mg, -20%)
⚠ Substance switch at Treatment 3 (MDMA trial)
⚠ 1 adverse event (Treatment 3, Grade 2 Nausea, resolved)
```

### **Print Layout Specifications:**

#### **Print-Specific Container:**
```tsx
<section className="hidden print:block print:break-inside-avoid print:mb-8">
  {/* Print timeline content */}
</section>
```

#### **Print Header:**
```tsx
<div className="mb-4">
  <h3 className="text-lg font-black text-black uppercase tracking-wider mb-1">
    Treatment History Timeline
  </h3>
  <p className="text-xs font-bold text-black">
    {treatmentCount} Sessions • {totalDays} Days • {improvementPct}% Improvement
  </p>
</div>
```

#### **Print Chart (Simplified):**
```tsx
<div className="mb-4">
  <p className="text-xs font-bold text-black mb-2">PHQ-9 Trajectory:</p>
  <div className="flex items-center gap-2 font-mono text-sm">
    {treatments.map((tx, idx) => (
      <React.Fragment key={tx.id}>
        <span className="font-bold">{tx.phq9Score}</span>
        <span>●</span>
        {idx < treatments.length - 1 && <span>────</span>}
      </React.Fragment>
    ))}
  </div>
  <div className="flex items-center gap-4 text-xs mt-1">
    {treatments.slice(1).map((tx, idx) => (
      <span key={tx.id}>
        {tx.delta > 0 ? '↑' : '↓'}{Math.abs(tx.delta)}%
      </span>
    ))}
  </div>
  <div className="border-t border-dashed border-black mt-2 pt-1 text-xs">
    Remission Threshold (PHQ-9 &lt; 5)
  </div>
</div>
```

#### **Print Treatment Cards:**
```tsx
<div className="flex justify-around mb-4">
  {treatments.map((tx, idx) => (
    <div key={tx.id} className="text-center">
      <p className="text-xs font-bold mb-1">Day {tx.daysSinceFirst}</p>
      <div className="border-2 border-black rounded-lg p-2 min-w-[80px]">
        <p className="text-xs font-black mb-1">P{idx + 1}</p>
        <p className="text-sm font-bold">{tx.substance}</p>
        <p className="text-xs">{tx.dosage}{tx.dosageUnit}</p>
        <p className="text-xs">{tx.route}</p>
        <p className="text-xs font-bold mt-1">PHQ:{tx.phq9Score}</p>
      </div>
      {idx > 0 && (
        <p className="text-xs font-bold mt-1">
          {tx.delta > 0 ? '↑' : '↓'}{Math.abs(tx.delta)}%
        </p>
      )}
      {tx.hasAdverseEvent && (
        <p className="text-xs mt-1">⚠ AE</p>
      )}
    </div>
  ))}
</div>
```

#### **Print Insights:**
```tsx
<div className="border border-black rounded-lg p-3">
  <p className="text-xs font-black uppercase mb-2">Key Insights:</p>
  <ul className="space-y-1 text-[11px]">
    <li>✓ {overallImprovement}% total symptom reduction (PHQ-9: {firstScore}→{lastScore})</li>
    <li>⭐ Best response: Treatment {bestTreatmentNum} ({bestSubstance} {bestDosage}, {bestDelta}%)</li>
    {hasSubstanceSwitch && (
      <li>⚠ Substance switch at Treatment {switchTreatmentNum} ({switchDetails})</li>
    )}
    {adverseEvents.length > 0 && (
      <li>⚠ {adverseEvents.length} adverse event(s) ({adverseEventSummary})</li>
    )}
  </ul>
</div>
```

#### **Print CSS:**
```css
@media print {
  @page {
    size: letter landscape;
    margin: 0.5in;
  }
  
  /* Hide screen timeline */
  .print\\:hidden {
    display: none !important;
  }
  
  /* Show print timeline */
  .print\\:block {
    display: block !important;
  }
  
  /* Prevent page breaks */
  .print\\:break-inside-avoid {
    break-inside: avoid;
  }
  
  /* High contrast */
  .print\\:text-black {
    color: #000 !important;
  }
  
  .print\\:border-black {
    border-color: #000 !important;
  }
  
  /* Font size minimum */
  .text-\\[11px\\] {
    font-size: 11px !important;
  }
}
```

---

## 📊 DATA STRUCTURE

### **TypeScript Interfaces:**

```typescript
interface TreatmentTimelineData {
  patientId: string;
  patientHash: string;
  treatments: Treatment[];
  summary: TimelineSummary;
}

interface Treatment {
  id: string;
  sessionNumber: number;
  sessionDate: string; // ISO 8601
  daysSinceFirst: number; // Calculated
  
  // Treatment details
  substanceId: number;
  substanceName: string;
  substanceClass: string;
  dosage: number;
  dosageUnit: string;
  routeId: number;
  routeName: string;
  
  // Outcomes
  phq9Score: number;
  difficultyScore: number;
  delta: number; // % change from previous treatment (calculated)
  
  // Safety
  hasAdverseEvent: boolean;
  adverseEventName?: string;
  severityGrade?: number;
  
  // Context
  indicationName: string;
  modalityName: string;
  concomitantMeds: string[];
}

interface TimelineSummary {
  treatmentCount: number;
  totalDays: number;
  firstPhq9: number;
  lastPhq9: number;
  overallImprovement: number; // %
  bestTreatmentIndex: number;
  bestTreatmentDelta: number;
  hasSubstanceSwitch: boolean;
  substanceSwitchIndex?: number;
  adverseEventCount: number;
}
```

---

## 🔍 DATA FETCHING

### **Supabase Query:**

```typescript
const fetchTreatmentTimeline = async (patientId: string) => {
  const { data, error } = await supabase
    .from('log_clinical_records')
    .select(`
      id,
      session_number,
      session_date,
      dosage,
      dosage_unit,
      phq9_score,
      difficulty_score,
      substance:ref_substances(substance_id, substance_name, substance_class),
      route:ref_routes(route_id, route_name),
      indication:ref_indications(indication_id, indication_name),
      modality:ref_support_modality(modality_id, modality_name),
      safety_event:ref_safety_events(safety_event_id, event_name),
      severity_grade:ref_severity_grade(severity_grade_id, grade_value)
    `)
    .eq('patient_id', patientId)
    .order('session_date', { ascending: true });
  
  if (error) throw error;
  
  return processTimelineData(data);
};
```

### **Data Processing:**

```typescript
const processTimelineData = (records: any[]): TreatmentTimelineData => {
  if (!records || records.length === 0) {
    return null;
  }
  
  const firstDate = new Date(records[0].session_date);
  
  const treatments: Treatment[] = records.map((record, idx) => {
    const sessionDate = new Date(record.session_date);
    const daysSinceFirst = Math.floor(
      (sessionDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const prevPhq9 = idx > 0 ? records[idx - 1].phq9_score : null;
    const delta = prevPhq9 
      ? Math.round(((prevPhq9 - record.phq9_score) / prevPhq9) * 100)
      : 0;
    
    return {
      id: record.id,
      sessionNumber: record.session_number,
      sessionDate: record.session_date,
      daysSinceFirst,
      substanceId: record.substance.substance_id,
      substanceName: record.substance.substance_name,
      substanceClass: record.substance.substance_class,
      dosage: record.dosage,
      dosageUnit: record.dosage_unit,
      routeId: record.route.route_id,
      routeName: record.route.route_name,
      phq9Score: record.phq9_score,
      difficultyScore: record.difficulty_score,
      delta,
      hasAdverseEvent: !!record.safety_event,
      adverseEventName: record.safety_event?.event_name,
      severityGrade: record.severity_grade?.grade_value,
      indicationName: record.indication.indication_name,
      modalityName: record.modality.modality_name,
      concomitantMeds: [] // TODO: Fetch from concomitant_med_ids
    };
  });
  
  const summary = calculateSummary(treatments);
  
  return {
    patientId: records[0].patient_id,
    patientHash: records[0].patient_id, // Assuming patient_id is the hash
    treatments,
    summary
  };
};

const calculateSummary = (treatments: Treatment[]): TimelineSummary => {
  const firstPhq9 = treatments[0].phq9Score;
  const lastPhq9 = treatments[treatments.length - 1].phq9Score;
  const overallImprovement = Math.round(((firstPhq9 - lastPhq9) / firstPhq9) * 100);
  
  const bestTreatmentIndex = treatments.reduce((bestIdx, tx, idx) => {
    return Math.abs(tx.delta) > Math.abs(treatments[bestIdx].delta) ? idx : bestIdx;
  }, 1); // Start from index 1 (skip first treatment with delta=0)
  
  const hasSubstanceSwitch = treatments.some((tx, idx) => 
    idx > 0 && tx.substanceId !== treatments[idx - 1].substanceId
  );
  
  const substanceSwitchIndex = hasSubstanceSwitch
    ? treatments.findIndex((tx, idx) => 
        idx > 0 && tx.substanceId !== treatments[idx - 1].substanceId
      )
    : undefined;
  
  const adverseEventCount = treatments.filter(tx => tx.hasAdverseEvent).length;
  
  const totalDays = treatments[treatments.length - 1].daysSinceFirst;
  
  return {
    treatmentCount: treatments.length,
    totalDays,
    firstPhq9,
    lastPhq9,
    overallImprovement,
    bestTreatmentIndex,
    bestTreatmentDelta: treatments[bestTreatmentIndex].delta,
    hasSubstanceSwitch,
    substanceSwitchIndex,
    adverseEventCount
  };
};
```

---

## 🎨 STYLING SPECIFICATIONS

### **Color Palette:**

| Element | Screen Color | Print Color | Purpose |
|---------|-------------|-------------|---------|
| **Container Background** | `bg-[#0b0e14]` | `bg-white` | Main container |
| **Border** | `border-slate-800` | `border-black` | Dividers |
| **Text Primary** | `text-white` | `text-black` | Headings |
| **Text Secondary** | `text-slate-400` | `text-black` | Labels |
| **Improvement (↓)** | `text-clinical-green` | `text-black` + `↓` | Positive outcome |
| **Worsening (↑)** | `text-red-500` | `text-black` + `↑` | Negative outcome |
| **Chart Line** | `stroke="#2b74f3"` | `stroke="#000"` | PHQ-9 line |
| **Chart Fill** | `fill="url(#gradient)"` | `fill="none"` | Area under curve |

### **Typography:**

| Element | Screen | Print | Font Weight |
|---------|--------|-------|-------------|
| **Section Title** | `text-xl` (20px) | `text-lg` (18px) | `font-black` (900) |
| **Summary** | `text-sm` (14px) | `text-xs` (12px) | `font-bold` (700) |
| **Treatment Label** | `text-sm` (14px) | `text-sm` (14px) | `font-bold` (700) |
| **Dosage** | `text-xs` (12px) | `text-xs` (12px) | `font-medium` (500) |
| **Delta %** | `text-sm` (14px) | `text-xs` (12px) | `font-bold` (700) |
| **Insights** | `text-sm` (14px) | `text-[11px]` (11px) | `font-medium` (500) |

**Minimum Font Size:** 11px (per user rules)

### **Spacing:**

| Element | Screen | Print |
|---------|--------|-------|
| **Container Padding** | `p-8 sm:p-10` | `p-3` |
| **Section Gap** | `space-y-8` | `space-y-4` |
| **Card Gap** | `gap-4` | `gap-2` |
| **Border Radius** | `rounded-[2.5rem]` | `rounded-lg` |

---

## 🔧 HELPER FUNCTIONS

### **Route Icon Mapping:**

```typescript
const getRouteIcon = (routeName: string): string => {
  const iconMap: Record<string, string> = {
    'Oral': '💊',
    'Intravenous': '💉',
    'Intramuscular': '💉',
    'Intranasal': '👃',
    'Sublingual': '💊',
    'Buccal': '💊',
    'Subcutaneous': '💉',
    'Other': '⚕️'
  };
  return iconMap[routeName] || '⚕️';
};
```

### **Delta Color Mapping:**

```typescript
const getDeltaColor = (delta: number): string => {
  if (delta < 0) return 'text-clinical-green'; // Improvement (PHQ-9 decreased)
  if (delta > 0) return 'text-red-500'; // Worsening (PHQ-9 increased)
  return 'text-slate-500'; // No change
};
```

### **Chart Data Transformation:**

```typescript
const transformToChartData = (treatments: Treatment[]) => {
  return treatments.map(tx => ({
    day: `Day ${tx.daysSinceFirst}`,
    phq9: tx.phq9Score,
    label: `${tx.substanceName} ${tx.dosage}${tx.dosageUnit}`
  }));
};
```

---

## 📋 IMPLEMENTATION CHECKLIST

### **For INVESTIGATOR:**

- [ ] Verify `log_clinical_records` table has all required columns
- [ ] Confirm foreign key relationships to reference tables
- [ ] Test Supabase query with sample patient data
- [ ] Validate RLS policies allow reading patient's treatment history
- [ ] Check for edge cases:
  - [ ] Patient with only 1 treatment (no delta)
  - [ ] Patient with 10+ treatments (chart scaling)
  - [ ] Missing PHQ-9 scores
  - [ ] Null substance/route IDs
- [ ] Confirm print CSS doesn't break existing print layouts

### **For BUILDER:**

#### **Phase 1: Data Layer**
- [ ] Create `fetchTreatmentTimeline()` function
- [ ] Create `processTimelineData()` function
- [ ] Create `calculateSummary()` function
- [ ] Add TypeScript interfaces
- [ ] Test with sample data

#### **Phase 2: Screen Layout**
- [ ] Create `TreatmentTimeline` component
- [ ] Add timeline container to `ProtocolDetail.tsx` (after Receptor Affinity)
- [ ] Implement header with summary stats
- [ ] Build Recharts AreaChart with PHQ-9 data
- [ ] Add treatment cards below chart
- [ ] Implement key insights panel
- [ ] Add filter button (stub for Phase 3)
- [ ] Add print button (triggers `window.print()`)

#### **Phase 3: Print Layout**
- [ ] Create print-specific timeline component
- [ ] Add print CSS to `ProtocolDetail.tsx`
- [ ] Implement simplified chart (text-based)
- [ ] Add print treatment cards
- [ ] Add print insights panel
- [ ] Test print layout (landscape, 1 page)
- [ ] Verify minimum 11px font size

#### **Phase 4: Polish**
- [ ] Add loading states
- [ ] Add empty state (no treatments found)
- [ ] Add error handling
- [ ] Test responsive behavior (mobile/tablet)
- [ ] Verify colorblind-safe design (icons + text)
- [ ] Test print layout on multiple browsers

---

## 🚨 EDGE CASES & ERROR HANDLING

### **1. No Treatments Found**
```tsx
{treatments.length === 0 && (
  <div className="text-center py-12">
    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
      No treatment history available
    </p>
  </div>
)}
```

### **2. Single Treatment (No Delta)**
```tsx
{treatments.length === 1 && (
  <p className="text-slate-500 text-xs">
    Baseline treatment (no comparison available)
  </p>
)}
```

### **3. Missing PHQ-9 Scores**
```tsx
const phq9Score = treatment.phq9_score ?? 'N/A';
const delta = prevPhq9 && treatment.phq9_score 
  ? calculateDelta(prevPhq9, treatment.phq9_score)
  : null;
```

### **4. Chart Scaling (10+ Treatments)**
```tsx
// Adjust chart width based on treatment count
const chartWidth = treatments.length > 6 ? '150%' : '100%';
```

---

## ✅ ACCEPTANCE CRITERIA

### **Screen Layout:**
- [ ] Timeline appears between Receptor Affinity and Therapeutic Envelope
- [ ] Chart displays PHQ-9 scores with connecting line
- [ ] Treatment cards show substance, dosage, route (icon), delta %
- [ ] Key insights panel summarizes overall improvement, best response, switches, AEs
- [ ] Filter button present (functional in Phase 3)
- [ ] Print button triggers browser print dialog
- [ ] Responsive on mobile/tablet (horizontal scroll or stack)

### **Print Layout:**
- [ ] Timeline appears in print view (replaces screen timeline)
- [ ] Simplified text-based chart shows PHQ-9 trajectory
- [ ] Treatment cards display in compact format
- [ ] Key insights panel fits on same page
- [ ] Entire timeline fits on 1 landscape page
- [ ] Minimum 11px font size enforced
- [ ] High contrast (black on white)

### **Data Integrity:**
- [ ] Fetches all treatments for patient (ordered by date)
- [ ] Calculates day intervals correctly
- [ ] Calculates delta % correctly (negative = improvement)
- [ ] Identifies substance switches
- [ ] Flags adverse events
- [ ] Handles missing data gracefully

### **Accessibility:**
- [ ] Color + icon + text for all status indicators
- [ ] High contrast in print mode
- [ ] Keyboard navigation support
- [ ] Screen reader friendly (ARIA labels)

---

## 📁 FILES TO MODIFY

1. **`src/pages/ProtocolDetail.tsx`**
   - Add `TreatmentTimeline` component import
   - Insert timeline section after Receptor Affinity Profile
   - Add print-specific timeline section

2. **`src/components/TreatmentTimeline.tsx`** (NEW)
   - Screen timeline component
   - Chart rendering
   - Treatment cards
   - Key insights

3. **`src/components/TreatmentTimelinePrint.tsx`** (NEW)
   - Print timeline component
   - Simplified chart
   - Compact treatment cards

4. **`src/utils/timelineHelpers.ts`** (NEW)
   - `fetchTreatmentTimeline()`
   - `processTimelineData()`
   - `calculateSummary()`
   - `getRouteIcon()`
   - `getDeltaColor()`

5. **`src/types.ts`**
   - Add `TreatmentTimelineData` interface
   - Add `Treatment` interface
   - Add `TimelineSummary` interface

---

## 🎯 SUCCESS METRICS

**This implementation will be successful if:**
1. ✅ Practitioners can see entire treatment history at a glance
2. ✅ Temporal relationships are immediately clear (day intervals)
3. ✅ Outcome trends are visually obvious (PHQ-9 line chart)
4. ✅ Print layout fits on 1 page (landscape)
5. ✅ Design is colorblind-friendly (no color-only meaning)
6. ✅ Mobile experience is usable (scroll or stack)
7. ✅ Data fetching is performant (<500ms)

---

## 📝 NOTES FOR INVESTIGATOR

### **Questions to Validate:**

1. **Data Availability:**
   - Do we have multiple treatments per patient in the database?
   - Are `session_date` and `session_number` populated?
   - Are PHQ-9 scores consistently recorded?

2. **RLS Policies:**
   - Can users query all treatments for a patient they have access to?
   - Are foreign key joins allowed by RLS?

3. **Performance:**
   - How many treatments per patient (average/max)?
   - Should we paginate if >10 treatments?

4. **Print Compatibility:**
   - Does existing print CSS conflict with new timeline?
   - Should we use landscape or portrait for print?

### **Potential Issues:**

1. **Chart Scaling:**
   - If patient has 20+ treatments, chart may be too crowded
   - **Solution:** Horizontal scroll or pagination

2. **Missing Data:**
   - Some treatments may lack PHQ-9 scores
   - **Solution:** Show "N/A" and skip delta calculation

3. **Print Page Breaks:**
   - Timeline may split across pages if too tall
   - **Solution:** Use `break-inside-avoid` CSS

---

## 🚀 NEXT STEPS

1. **INVESTIGATOR:** Review this spec and validate data availability
2. **INVESTIGATOR:** Test Supabase query with sample patient
3. **INVESTIGATOR:** Identify any blockers or missing data
4. **INVESTIGATOR:** Approve spec or request changes
5. **BUILDER:** Implement Phase 1 (Data Layer)
6. **BUILDER:** Implement Phase 2 (Screen Layout)
7. **BUILDER:** Implement Phase 3 (Print Layout)
8. **BUILDER:** Implement Phase 4 (Polish)
9. **DESIGNER:** Review implementation for visual consistency
10. **USER:** Test and provide feedback

---

**DESIGNER ROLE COMPLETE** ✅  
**Status:** READY FOR INVESTIGATOR REVIEW

**Awaiting:**
- INVESTIGATOR validation of data availability
- INVESTIGATOR approval to proceed
- BUILDER implementation

---

**End of Specification**
