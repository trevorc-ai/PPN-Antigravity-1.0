# 🎨 DESIGNER: Treatment History Timeline Chart (REVISED)

**Page:** Protocol Detail - Patient Treatment Timeline  
**Date:** 2026-02-10 (Updated)  
**Status:** DESIGN PROPOSAL - Awaiting Review  
**Role:** DESIGNER (No code implementation, specifications only)

---

## 🎯 Design Objective (REVISED)

**User's Vision:**
> "Patient gets treatment on Day 1, returns on Day 8 for different treatment with slightly different outcomes, returns on Day 11 for another treatment, and so on. Horizontal timeline represented in a **chart** that adjusts dynamically depending on how many treatments the patient has."

**Placement:**
- **Between** Receptor Affinity Profile container and Therapeutic Envelope container
- Replaces nothing, inserts as new section

**Design Goal:**  
Create a **dynamic horizontal timeline chart** that:
- ✅ Shows precise day intervals (Day 1 → Day 8 → Day 11)
- ✅ Scales dynamically (2 treatments vs 10+ treatments)
- ✅ Displays outcome changes at each treatment point
- ✅ Supports complex filtering/analysis
- ✅ Works on screen AND print (1 page)
- ✅ Uses high-contrast, colorblind-friendly design

---

## 📊 Current Page Structure

### **Existing Layout (ProtocolDetail.tsx):**

```
┌─────────────────────────────────────────────────────────┐
│ IDENTITY HEADER                                         │
├─────────────────────────────────────────────────────────┤
│ LEFT PANEL (2/3)          │ RIGHT PANEL (1/3)          │
│                            │                            │
│ 1. Receptor Affinity       │ 4. Protocol Architecture   │
│    Profile (Radar Chart)   │    (Substance/Dosage)      │
│                            │                            │
│ ┌─────────────────────────┐│                            │
│ │ 🆕 TREATMENT TIMELINE   ││                            │
│ │ (INSERT HERE)           ││                            │
│ └─────────────────────────┘│                            │
│                            │                            │
│ 2. Therapeutic Envelope    │ 5. Safety Monitor          │
│    (Setting/Timeline)      │    (Meds/Events)           │
│                            │                            │
│ 3. Efficacy Trajectory     │                            │
│    (PHQ-9 Chart)           │                            │
└─────────────────────────────────────────────────────────┘
```

**Insertion Point:** After Receptor Affinity Profile, before Therapeutic Envelope

---

## 📊 Current State Analysis

### **What Exists:**
- ✅ Single protocol detail view (shows ONE protocol at a time)
- ✅ Efficacy trajectory chart (PHQ-9 over time for ONE protocol)
- ✅ Receptor affinity radar
- ✅ Safety monitoring
- ✅ Print-optimized layout

### **What's Missing:**
- ❌ **Multi-protocol timeline** (no way to see sequential treatments)
- ❌ **Day-level temporal precision** (only dates, not day intervals)
- ❌ **Dynamic scaling** (chart doesn't adapt to number of treatments)
- ❌ **Treatment pattern detection** (no visual for dose escalation, substance rotation)
- ❌ **Filtering/analysis tools** (no way to filter by substance, outcome, etc.)

---

## 🎨 Proposed Design: "Treatment Journey Timeline"

### **Visual Metaphor:**
A **horizontal timeline** showing protocols as **milestone cards** connected by **outcome trend lines**.

### **Layout Structure:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PATIENT TREATMENT JOURNEY                                    [Print Button] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────┐         ┌──────┐         ┌──────┐         ┌──────┐              │
│  │ P1   │────────▶│ P2   │────────▶│ P3   │────────▶│ P4   │              │
│  │25mg  │  +12%   │50mg  │  +18%   │50mg  │  +5%    │25mg  │              │
│  │Psilo │         │Psilo │         │MDMA  │         │Psilo │              │
│  │      │         │      │         │      │         │      │              │
│  │PHQ:18│         │PHQ:15│         │PHQ:12│         │PHQ:11│              │
│  └──┬───┘         └──┬───┘         └──┬───┘         └──┬───┘              │
│     │                │                │                │                    │
│  Jan 15          Mar 22          Jun 10          Sep 5                      │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────  │
│  │                    OUTCOME TREND LINE (PHQ-9)                         │  │
│  │  18 ●─────────●15──────────●12─────────●11                            │  │
│  │     ↓ -17%    ↓ -20%       ↓ -8%                                      │  │
│  ────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  KEY INSIGHTS:                                                               │
│  ✓ 4 sessions over 8 months                                                 │
│  ✓ 39% total symptom reduction (PHQ-9: 18→11)                              │
│  ✓ Best response: Protocol 2 (Psilocybin 50mg, -20%)                       │
│  ⚠ Substance switch at Protocol 3 (MDMA trial)                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Breakdown

### **1. Timeline Header**
**Purpose:** Context and navigation

**Elements:**
- Patient hash (anonymized ID)
- Total treatment duration (e.g., "8 months")
- Number of protocols (e.g., "4 sessions")
- Print button (screen only)

**Visual Style:**
- Dark background: `bg-[#0b0e14]`
- White text: `text-white`
- Print: `print:bg-white print:text-black`

---

### **2. Protocol Milestone Cards**
**Purpose:** Show individual protocol details at a glance

**Card Contents:**
- **Protocol number** (P1, P2, P3...)
- **Substance name** (Psilocybin, MDMA, Ketamine)
- **Dosage** (25mg, 50mg, 100mg)
- **Route** (Oral, IV, IM) - icon only
- **PHQ-9 score** (baseline for this session)
- **Date** (Jan 15, 2024)
- **Outcome delta** (% change from previous session)

**Visual Design:**
```
┌─────────────────────┐
│  P2                 │ ← Protocol number (top-left)
│  ┌─────────────┐    │
│  │ Psilocybin  │    │ ← Substance (large, bold)
│  │ 50mg        │    │ ← Dosage (medium)
│  │ 💊 Oral     │    │ ← Route (icon + text)
│  └─────────────┘    │
│                     │
│  PHQ-9: 15          │ ← Outcome score (large)
│  ↓ -20% from P1     │ ← Delta (color-coded)
│                     │
│  Mar 22, 2024       │ ← Date (bottom)
└─────────────────────┘
```

**Color Coding (Colorblind-Safe):**
- **Improvement (↓):** Green dot + down arrow `●↓`
- **Worsening (↑):** Red dot + up arrow `●↑`
- **No change (→):** Gray dot + right arrow `●→`

**Card Styling:**
- Screen: `bg-slate-900 border-slate-800 rounded-2xl p-6`
- Print: `bg-white border-black rounded-lg p-4`
- Hover: `hover:border-primary/50 hover:shadow-xl` (screen only)

---

### **3. Connecting Arrows**
**Purpose:** Show temporal flow and outcome direction

**Visual Design:**
- **Arrow style:** Solid line with arrowhead `────────▶`
- **Color:** 
  - Improvement: `text-clinical-green` (green)
  - Worsening: `text-red-500` (red)
  - Neutral: `text-slate-600` (gray)
- **Label:** Outcome delta percentage above arrow
  - Example: `+12%` (improvement)
  - Example: `-5%` (worsening)

**Print Optimization:**
- Arrows become simple lines: `─────`
- Delta text remains visible

---

### **4. Outcome Trend Line**
**Purpose:** Show longitudinal PHQ-9 progression across all protocols

**Visual Design:**
- **Chart type:** Line chart (Recharts AreaChart)
- **X-axis:** Protocol dates (Jan 15, Mar 22, Jun 10, Sep 5)
- **Y-axis:** PHQ-9 score (0-27)
- **Reference line:** Remission threshold (PHQ-9 < 5) - green dashed line
- **Data points:** Large dots at each protocol milestone
- **Gradient fill:** Blue gradient under the line

**Print Optimization:**
- Remove gradient fill (solid line only)
- Increase line thickness: `strokeWidth={3}`
- High-contrast colors: Black line, white background
- Remove grid (too busy for print)

**Chart Dimensions:**
- Screen: `h-[200px]`
- Print: `h-[120px]` (condensed)

---

### **5. Key Insights Panel**
**Purpose:** Summarize treatment journey in plain language

**Insights to Display:**
- ✓ **Total sessions:** "4 sessions over 8 months"
- ✓ **Overall improvement:** "39% symptom reduction (PHQ-9: 18→11)"
- ✓ **Best response:** "Protocol 2 (Psilocybin 50mg, -20%)"
- ⚠ **Notable events:** "Substance switch at Protocol 3 (MDMA trial)"
- ⚠ **Safety flags:** "1 adverse event (Grade 2, resolved)"

**Visual Style:**
- Checkmark icon `✓` for positive insights (green)
- Warning icon `⚠` for notable events (amber)
- Alert icon `⚠` for safety flags (red)
- Text: `text-sm font-medium text-slate-300`
- Print: `text-[11px] text-black`

---

## 📐 Layout Specifications

### **Screen Layout (Desktop):**

**Container:**
- `PageContainer width="wide"`
- `max-w-[1600px]`
- `px-6 sm:px-8 xl:px-10`

**Grid Structure:**
```tsx
<div className="space-y-8">
  {/* Timeline Header */}
  <div className="flex justify-between items-center">
    <h2>Patient Treatment Journey</h2>
    <button>Print</button>
  </div>

  {/* Protocol Timeline (Horizontal Scroll on Mobile) */}
  <div className="overflow-x-auto">
    <div className="flex gap-6 min-w-max">
      {protocols.map(protocol => (
        <ProtocolCard key={protocol.id} {...protocol} />
      ))}
    </div>
  </div>

  {/* Outcome Trend Chart */}
  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
    <OutcomeTrendChart data={protocols} />
  </div>

  {/* Key Insights */}
  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
    <KeyInsights protocols={protocols} />
  </div>
</div>
```

**Responsive Behavior:**
- **Desktop (>1024px):** All cards visible, horizontal layout
- **Tablet (768-1024px):** Horizontal scroll for timeline
- **Mobile (<768px):** Vertical stack (cards stack vertically)

---

### **Print Layout (Single Page):**

**Page Settings:**
```css
@media print {
  @page {
    size: letter landscape; /* 11" x 8.5" */
    margin: 0.5in;
  }
}
```

**Layout Adjustments:**
1. **Remove decorative elements:**
   - Background gradients
   - Hover effects
   - Navigation buttons
   - Tooltips

2. **Condense spacing:**
   - Card padding: `p-6` → `p-3`
   - Gap between cards: `gap-6` → `gap-3`
   - Chart height: `h-[200px]` → `h-[100px]`

3. **Force high contrast:**
   - All text: `text-black`
   - All backgrounds: `bg-white`
   - All borders: `border-black`

4. **Fit to page:**
   - Timeline: Shrink cards to fit 4-6 protocols on one row
   - Chart: Reduce height, remove legend
   - Insights: Condense to 3-4 bullet points

**Print-Specific Classes:**
```css
.print:hidden { display: none !important; }
.print:bg-white { background: white !important; }
.print:text-black { color: black !important; }
.print:border-black { border-color: black !important; }
```

---

## 🎨 Visual Design System

### **Color Palette (Colorblind-Safe):**

| Element | Screen Color | Print Color | Purpose |
|---------|-------------|-------------|---------|
| **Improvement** | `#10b981` (green) | `#000` (black) + `↓` | Positive outcome |
| **Worsening** | `#ef4444` (red) | `#000` (black) + `↑` | Negative outcome |
| **Neutral** | `#64748b` (slate) | `#666` (gray) | No change |
| **Primary** | `#2b74f3` (blue) | `#000` (black) | Emphasis |
| **Background** | `#0b0e14` (dark) | `#fff` (white) | Container |
| **Text** | `#f1f5f9` (white) | `#000` (black) | Body text |
| **Border** | `#1e293b` (slate) | `#000` (black) | Dividers |

### **Typography:**

| Element | Screen | Print | Font Weight |
|---------|--------|-------|-------------|
| **Page Title** | `text-3xl` (30px) | `text-2xl` (24px) | `font-black` (900) |
| **Card Title** | `text-xl` (20px) | `text-lg` (18px) | `font-black` (900) |
| **Substance** | `text-2xl` (24px) | `text-xl` (20px) | `font-bold` (700) |
| **Dosage** | `text-lg` (18px) | `text-base` (16px) | `font-bold` (700) |
| **PHQ-9 Score** | `text-4xl` (36px) | `text-2xl` (24px) | `font-black` (900) |
| **Date** | `text-sm` (14px) | `text-xs` (12px) | `font-medium` (500) |
| **Delta %** | `text-base` (16px) | `text-sm` (14px) | `font-bold` (700) |
| **Insights** | `text-sm` (14px) | `text-[11px]` (11px) | `font-medium` (500) |

**Minimum Font Size:** 11px (per user rules, no fonts ≤ 9pt)

### **Spacing:**

| Element | Screen | Print |
|---------|--------|-------|
| **Card padding** | `p-6` (24px) | `p-3` (12px) |
| **Card gap** | `gap-6` (24px) | `gap-3` (12px) |
| **Section spacing** | `space-y-8` (32px) | `space-y-4` (16px) |
| **Border radius** | `rounded-2xl` (16px) | `rounded-lg` (8px) |

---

## 🔍 Interaction Design

### **Screen Interactions:**

1. **Hover on Protocol Card:**
   - Border color changes: `border-slate-800` → `border-primary/50`
   - Shadow appears: `shadow-xl`
   - Cursor: `cursor-pointer`
   - **Action:** Click to view full protocol detail

2. **Click on Connecting Arrow:**
   - Highlight both connected protocols
   - Show delta calculation tooltip
   - **Action:** Compare two protocols side-by-side (future feature)

3. **Hover on Trend Chart Data Point:**
   - Show tooltip with:
     - Protocol number
     - PHQ-9 score
     - Date
     - % change from previous

4. **Print Button:**
   - Opens browser print dialog
   - Automatically switches to print layout
   - **Action:** `window.print()`

### **Mobile Interactions:**

1. **Horizontal Scroll:**
   - Timeline cards scroll horizontally
   - Snap to card edges (CSS scroll-snap)
   - Swipe gesture support

2. **Tap on Card:**
   - Navigate to full protocol detail
   - No hover effects (touch-only)

---

## 📊 Data Requirements

### **Data Structure:**

```typescript
interface TreatmentHistory {
  patientId: string;
  patientHash: string;
  protocols: Protocol[];
  totalDuration: number; // days
  overallImprovement: number; // % change in PHQ-9
}

interface Protocol {
  id: string;
  protocolNumber: number; // 1, 2, 3, 4...
  substance: string;
  dosage: number;
  dosageUnit: string;
  route: string;
  date: string; // ISO 8601
  phq9Baseline: number;
  phq9Endpoint: number;
  deltaFromPrevious: number; // % change
  safetyEvents: SafetyEvent[];
  status: 'Active' | 'Completed';
}
```

### **Calculations:**

1. **Delta from Previous:**
   ```
   delta = ((current_phq9 - previous_phq9) / previous_phq9) * 100
   ```
   - Negative delta = improvement (PHQ-9 decreased)
   - Positive delta = worsening (PHQ-9 increased)

2. **Overall Improvement:**
   ```
   improvement = ((first_phq9 - last_phq9) / first_phq9) * 100
   ```

3. **Best Response:**
   - Protocol with largest negative delta

4. **Treatment Duration:**
   ```
   duration = last_protocol_date - first_protocol_date
   ```

---

## 🖨️ Print Optimization Strategy

### **Goal:** Fit entire treatment history on 1 page (landscape)

### **Techniques:**

1. **Landscape Orientation:**
   - More horizontal space for timeline
   - Fits 4-6 protocol cards comfortably

2. **Condensed Layout:**
   - Remove all decorative elements
   - Reduce padding/margins by 50%
   - Shrink chart height

3. **High Contrast:**
   - Black text on white background
   - Thick borders (2px minimum)
   - No gradients or shadows

4. **Essential Information Only:**
   - Hide navigation buttons
   - Hide tooltips
   - Hide "Cohort Matches" section
   - Keep only: Timeline, Chart, Key Insights

5. **Page Break Control:**
   ```css
   .print:break-inside-avoid {
     break-inside: avoid;
   }
   ```
   - Prevent cards from splitting across pages
   - Keep chart on same page as timeline

6. **Font Size Adjustments:**
   - Reduce all fonts by 2-4px
   - Maintain minimum 11px (per user rules)

---

## 📏 Example Layout (4 Protocols)

### **Screen View:**

```
┌────────────────────────────────────────────────────────────────────────┐
│ PATIENT TREATMENT JOURNEY                          [Print Record]      │
│ 6f9a2b3c4d5e... • 4 Sessions • 8 Months                                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐│
│  │    P1    │──────▶│    P2    │──────▶│    P3    │──────▶│    P4    ││
│  │          │ -17%  │          │ -20%  │          │ -8%   │          ││
│  │Psilocybin│       │Psilocybin│       │   MDMA   │       │Psilocybin││
│  │  25mg    │       │  50mg    │       │  100mg   │       │  25mg    ││
│  │  💊 Oral │       │  💊 Oral │       │  💉 IV   │       │  💊 Oral ││
│  │          │       │          │       │          │       │          ││
│  │ PHQ-9: 18│       │ PHQ-9: 15│       │ PHQ-9: 12│       │ PHQ-9: 11││
│  │          │       │          │       │          │       │          ││
│  │Jan 15 '24│       │Mar 22 '24│       │Jun 10 '24│       │Sep 5 '24 ││
│  └──────────┘       └──────────┘       └──────────┘       └──────────┘│
│                                                                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  OUTCOME TREND (PHQ-9 Depression Scale)                                │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ 27│                                                              │  │
│  │   │                                                              │  │
│  │ 18│●──────────                                                   │  │
│  │   │ ╲                                                            │  │
│  │ 15│  ●─────────                                                  │  │
│  │   │   ╲                                                          │  │
│  │ 12│    ●──────────                                               │  │
│  │   │     ╲                                                        │  │
│  │ 11│      ●                                                       │  │
│  │  5│- - - - - - - - - - - - - - - - - - - - - - - - (Remission) │  │
│  │  0│                                                              │  │
│  │   └──────┬────────┬────────┬────────┬──────────────────────────│  │
│  │        Jan 15  Mar 22  Jun 10  Sep 5                            │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  KEY INSIGHTS                                                           │
│  ✓ 4 sessions over 8 months (avg 2 months between sessions)           │
│  ✓ 39% total symptom reduction (PHQ-9: 18 → 11)                       │
│  ✓ Best response: Protocol 2 (Psilocybin 50mg, -20% improvement)      │
│  ⚠ Substance switch at Protocol 3 (MDMA trial, -8% improvement)       │
│  ⚠ 1 adverse event (Protocol 3, Grade 2 Nausea, resolved)             │
│  ⚠ Approaching remission threshold (PHQ-9 < 5)                        │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### **Print View (Condensed):**

```
PATIENT TREATMENT JOURNEY
6f9a2b3c4d5e... • 4 Sessions • 8 Months

┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│  P1    │────▶│  P2    │────▶│  P3    │────▶│  P4    │
│Psilo   │-17% │Psilo   │-20% │MDMA    │-8%  │Psilo   │
│25mg    │     │50mg    │     │100mg   │     │25mg    │
│PHQ:18  │     │PHQ:15  │     │PHQ:12  │     │PHQ:11  │
│Jan 15  │     │Mar 22  │     │Jun 10  │     │Sep 5   │
└────────┘     └────────┘     └────────┘     └────────┘

OUTCOME TREND (PHQ-9)
 18 ●────●15────●12────●11
    ↓17%  ↓20%  ↓8%
- - - - - - - - - - - - - - - (Remission < 5)

KEY INSIGHTS
✓ 39% total symptom reduction (PHQ-9: 18→11)
✓ Best response: P2 (Psilocybin 50mg, -20%)
⚠ Substance switch at P3 (MDMA trial)
⚠ 1 adverse event (P3, Grade 2, resolved)
```

---

## ✅ Design Checklist

### **Accessibility:**
- [ ] Minimum 11px font size (per user rules)
- [ ] Color + icon/text for all status indicators (colorblind-safe)
- [ ] High contrast in print mode (black on white)
- [ ] Keyboard navigation support (Tab, Enter, Escape)
- [ ] Screen reader friendly (ARIA labels)

### **Responsiveness:**
- [ ] Desktop: Horizontal timeline, all cards visible
- [ ] Tablet: Horizontal scroll for timeline
- [ ] Mobile: Vertical stack or horizontal scroll
- [ ] Print: Landscape, fits on 1 page

### **Print Optimization:**
- [ ] Landscape orientation
- [ ] Remove decorative elements
- [ ] High contrast (black/white)
- [ ] Condensed spacing
- [ ] Essential information only
- [ ] No page breaks within cards

### **Data Integrity:**
- [ ] Accurate delta calculations
- [ ] Correct temporal ordering
- [ ] Safety event flags visible
- [ ] Substance switches highlighted

---

## 🚀 Implementation Handoff (For INVESTIGATOR)

### **Files to Modify:**
1. `src/pages/ProtocolDetail.tsx` - Add treatment history timeline section
2. `src/components/ProtocolCard.tsx` - New component for protocol milestone cards
3. `src/components/charts/OutcomeTrendChart.tsx` - New chart component
4. `src/types.ts` - Add `TreatmentHistory` interface

### **New Components Needed:**
1. **`ProtocolCard.tsx`** - Individual protocol milestone card
2. **`OutcomeTrendChart.tsx`** - Longitudinal PHQ-9 chart
3. **`TreatmentTimeline.tsx`** - Main timeline container
4. **`KeyInsights.tsx`** - Insights summary panel

### **Data Fetching:**
- Query: Fetch all protocols for a given `patientHash`
- Sort: Order by `date` ascending
- Calculate: Deltas, overall improvement, best response

### **Testing Requirements:**
- [ ] Test with 2 protocols (minimum)
- [ ] Test with 6+ protocols (horizontal scroll)
- [ ] Test print layout (landscape, 1 page)
- [ ] Test on mobile (vertical stack or scroll)
- [ ] Test with colorblind simulator

---

## 📝 Open Questions for Review

1. **Timeline Orientation:**
   - Horizontal (left-to-right) or Vertical (top-to-bottom)?
   - **Recommendation:** Horizontal (better for temporal flow)

2. **Card Size:**
   - Fixed width (e.g., 200px) or Flexible (responsive)?
   - **Recommendation:** Fixed width for consistency

3. **Mobile Behavior:**
   - Horizontal scroll or Vertical stack?
   - **Recommendation:** Horizontal scroll (preserves timeline metaphor)

4. **Print Page Limit:**
   - How many protocols should fit on 1 page?
   - **Recommendation:** 4-6 protocols (landscape)

5. **Outcome Metric:**
   - PHQ-9 only or support multiple scales (GAD-7, etc.)?
   - **Recommendation:** Start with PHQ-9, add others later

---

## 🎯 Success Metrics

**This design will be successful if:**
1. ✅ Practitioners can see entire treatment history at a glance
2. ✅ Temporal relationships are immediately clear
3. ✅ Outcome trends are visually obvious
4. ✅ Print layout fits on 1 page (landscape)
5. ✅ Design is colorblind-friendly (no color-only meaning)
6. ✅ Mobile experience is usable (scroll or stack)

---

**DESIGNER ROLE COMPLETE**  
**Next Step:** INVESTIGATOR review and approval before handoff to BUILDER

**Awaiting User Feedback:**
- Approve design concept?
- Prefer horizontal or vertical timeline?
- Any additional insights to display?
- Print layout acceptable?
