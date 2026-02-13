# 🎨 DESIGNER TASK: CLINICAL INTELLIGENCE PLATFORM REDESIGN

**Assigned To:** DESIGNER (UI/UX Lead)  
**Assigned By:** LEAD  
**Date:** 2026-02-11 16:40 PST  
**Priority:** P0 - CRITICAL  
**Estimated Effort:** 3-4 days  
**Status:** 🔴 NOT STARTED

---

## 📋 **TASK SUMMARY**

Redesign the Protocol Builder from a "data entry form" to a "real-time clinical intelligence platform" that shows practitioners live benchmarking data, predictive outcomes, and receptor impact visualizations as they design treatment protocols.

---

## 🎯 **CONTEXT & STRATEGIC IMPORTANCE**

### **The Paradigm Shift:**

**OLD Vision:**
> Fast data entry form for logging protocols after treatment

**NEW Vision:**
> Real-time clinical decision support system that shows practitioners what will likely happen BEFORE they treat

### **Why This Matters:**

**Dr. Shena's Insight (First Doctor User):**
> "Research progress is hampered by lack of comparable data... no common framework... impossible to compare protocols or outcomes"

**User's Vision:**
> "Display data on the protocol builder at the same time. Making inputs simultaneously act as filters on data visualization components... comparing patient to other similar patients in real time"

**Impact:**
- 100x more valuable than a data entry form
- Addresses #1 pain point: "No way to know what works"
- Enables practitioners to make data-driven decisions in real-time
- Transforms every treatment into a research contribution

---

## 🎨 **DESIGN REQUIREMENTS**

### **PRIMARY INTERFACE: Split-Screen Layout**

#### **Desktop View (>1024px):**

```
┌─────────────────────────────────────────────────────────────┐
│  Protocol Builder - Clinical Intelligence Platform          │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│  INPUT PANEL             │  LIVE DATA PANEL                 │
│  (Left 40%)              │  (Right 60%)                     │
│                          │                                  │
│  Patient Characteristics │  📊 Similar Patients (N=127)    │
│  ┌────────────────────┐  │  ├─ 68% significant improvement │
│  │ Age: [36-45]       │  │  ├─ 24% moderate improvement    │
│  │ Weight: [61-70 kg] │  │  └─ 8% minimal improvement      │
│  │ Sex: [Female]      │  │                                  │
│  └────────────────────┘  │  🧠 Receptor Impact              │
│                          │  ├─ NMDA ████████░░ 80%         │
│  Proposed Protocol       │  ├─ AMPA ██████░░░░ 60%         │
│  ┌────────────────────┐  │  └─ mTOR ████░░░░░░ 40%         │
│  │ Substance:         │  │                                  │
│  │ [Ketamine]         │  │  ⚠️ Safety Alerts                │
│  │ Dose: [0.5 mg/kg]  │  │  └─ Benzo interaction detected  │
│  │ Route: [IV]        │  │                                  │
│  └────────────────────┘  │  📈 Network Benchmarks           │
│                          │  ├─ Your clinic: 72%            │
│  [Save Plan] [Submit]    │  └─ Network avg: 68%            │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

#### **Tablet View (640px - 1024px):**
- Tabbed interface: `[Input] [Data]`
- Toggle between input and data views
- Sticky tab bar at top

#### **Mobile View (<640px):**
- Stacked layout: Input first, then data
- Collapsible data sections
- Sticky "View Data" button

---

## 🧩 **REQUIRED COMPONENTS**

### **1. Split-Screen Container**
**Purpose:** Main layout component for desktop view

**Specifications:**
- Left panel: 40% width (input fields)
- Right panel: 60% width (data visualizations)
- Resizable divider (drag to adjust)
- Responsive: Switches to tabs on tablet, stacked on mobile

**States:**
- Default: 40/60 split
- Collapsed left: 0/100 (full data view)
- Collapsed right: 100/0 (full input view)

---

### **2. Live Data Visualization Panel**
**Purpose:** Show real-time benchmarking data as practitioner designs protocol

**Sub-Components:**

#### **A. Similar Patients Outcomes**
**What to show:**
```
Patients like yours (N=127):
├─ 68% significant improvement (PHQ-9 ↓ 50%+)
├─ 24% moderate improvement (PHQ-9 ↓ 25-50%)
├─ 8% minimal/no improvement
└─ 2% adverse events (mild)

Most common protocols:
├─ Ketamine 0.5mg/kg IV (42%)
├─ Ketamine 0.75mg/kg IV (31%)
└─ Ketamine 1.0mg/kg IV (18%)
```

**Visual Design:**
- Horizontal bar chart for outcome distribution
- Color coding: Green (improvement), Yellow (moderate), Red (minimal)
- N count prominently displayed (data confidence indicator)
- Clickable bars to drill down

**Updates:**
- Real-time as practitioner changes patient characteristics
- Smooth transitions (300ms fade)
- Loading state: Skeleton UI (no spinners)

---

#### **B. Receptor Impact Visualization**
**What to show:**
```
Proposed Protocol: Ketamine 0.5mg/kg IV

Receptor Targets:
├─ NMDA antagonism ████████░░ 80%
├─ AMPA activation ██████░░░░ 60%
├─ mTOR pathway ████░░░░░░ 40%
└─ HCN1 inhibition ███░░░░░░░ 30%

Expected Effects:
├─ Rapid antidepressant (6-24 hours)
├─ Neuroplasticity window (2-7 days)
└─ Dissociation (mild-moderate, 45 min)
```

**Visual Design:**
- Horizontal bar chart for receptor activation levels
- Color gradient: Low (blue) → Medium (purple) → High (indigo)
- Tooltip on hover: Explains what each receptor does
- Icons for expected effects (⚡ rapid, 🌱 neuroplasticity, 🌀 dissociation)

**Updates:**
- Real-time as practitioner changes substance/dose
- Smooth bar animations (400ms ease-out)

---

#### **C. Safety Alerts**
**What to show:**
```
⚠️ INTERACTION DETECTED

Patient taking: Benzodiazepines (Xanax 1mg PRN)

Considerations:
├─ May reduce ketamine efficacy (GABA-A agonism)
├─ Consider holding 24h before treatment
├─ Alternative: Lower benzo dose day-of
└─ 23% of similar patients on benzos had reduced response

Recommendation: Discuss with patient
```

**Visual Design:**
- Amber alert box (not red - not a hard stop)
- Warning icon (⚠️) in amber-500
- Collapsible details (click to expand)
- "Acknowledge" button (doesn't block, just confirms practitioner saw it)

**Updates:**
- Appears immediately when interaction detected
- Dismissible but logged (practitioner acknowledged alert)

---

#### **D. Network Benchmarks**
**What to show:**
```
Your Clinic vs Network:

Success Rate (PHQ-9 ↓ 50%+):
├─ Your clinic: 72% (N=45)
├─ Network avg: 68% (N=1,247)
└─ You're performing ABOVE average ✅

Average Dose:
├─ Your clinic: 0.6mg/kg
├─ Network avg: 0.65mg/kg
└─ You're using slightly lower doses
```

**Visual Design:**
- Side-by-side comparison bars
- Your clinic: Indigo-500
- Network: Slate-400
- Green checkmark if above average, amber if below
- N counts for both (transparency)

**Updates:**
- Static (doesn't change as inputs change)
- Shows clinic's historical performance

---

### **3. Patient-Facing View (NEW)**
**Purpose:** Practitioner shows this to patient during consultation

**What to show:**
- Simplified version of data panel
- Larger fonts (readable from 3 feet away)
- Focus on: Similar patients outcomes, expected effects
- Remove: Technical receptor details, network benchmarks

**Visual Design:**
- Clean, minimal, high-contrast
- Large outcome percentages (48px font)
- Simple language (7th grade reading level)
- "Powered by PPN Research Network" footer

**Access:**
- Toggle button: "Show Patient View"
- Opens in new window or fullscreen overlay
- Practitioner can control what's visible

---

## 🎨 **DESIGN SYSTEM UPDATES**

### **Color Palette Additions:**

**Data Visualization Colors:**
| Purpose | Color | Hex | Tailwind |
|---------|-------|-----|----------|
| Positive outcome | Green | `#10b981` | `emerald-500` |
| Moderate outcome | Yellow | `#f59e0b` | `amber-500` |
| Minimal outcome | Red | `#ef4444` | `red-500` |
| Your clinic | Indigo | `#6366f1` | `indigo-500` |
| Network average | Slate | `#94a3b8` | `slate-400` |
| Receptor low | Blue | `#3b82f6` | `blue-500` |
| Receptor medium | Purple | `#a855f7` | `purple-500` |
| Receptor high | Indigo | `#6366f1` | `indigo-500` |

**Chart Styling:**
- Bar charts: Rounded corners (8px)
- Hover state: Opacity 80% + tooltip
- Animations: Smooth (300-400ms ease-out)
- Grid lines: Slate-700 (subtle, not distracting)

---

## 📱 **RESPONSIVE BREAKPOINTS**

### **Desktop (>1024px):**
- Split-screen layout (40/60)
- All visualizations visible
- Resizable divider

### **Tablet (640px - 1024px):**
- Tabbed interface: `[Input] [Data]`
- Sticky tab bar at top
- Full-width visualizations in Data tab

### **Mobile (<640px):**
- Stacked layout
- Input fields first
- Collapsible data sections
- Sticky "View Data" button (bottom-right)

---

## ♿ **ACCESSIBILITY REQUIREMENTS**

### **Keyboard Navigation:**
- Tab through all interactive elements
- Arrow keys to navigate charts
- Enter to expand/collapse sections
- Esc to close patient-facing view

### **Screen Reader Support:**
- ARIA labels on all charts
- Live regions for real-time updates
- Descriptive alt text for visualizations

### **Color Blindness:**
- Don't rely on color alone
- Use icons + labels + patterns
- Test with color blindness simulators

---

## 🧪 **INTERACTIVE STATES**

### **Loading States:**
- Skeleton UI for data panel (no spinners)
- Smooth fade-in when data loads
- "Calculating..." text if >1 second

### **Empty States:**
```
📊 Not Enough Data

We need at least 10 similar patients to show benchmarks.

Your entry will help build this dataset!
```

### **Error States:**
```
⚠️ Data Temporarily Unavailable

We're having trouble loading benchmarks.
You can still save your protocol.

[Retry] [Continue Without Data]
```

---

## 🎯 **USER FLOWS**

### **Flow 1: Planning Mode (Pre-Treatment)**

1. Practitioner opens Protocol Builder
2. Enters patient characteristics (age, weight, conditions)
3. **Data panel updates:** Shows similar patients outcomes
4. Enters proposed protocol (substance, dose, route)
5. **Data panel updates:** Shows receptor impact, safety alerts
6. Reviews network benchmarks
7. Adjusts protocol based on data
8. Clicks "Save Plan" (saves as planned protocol)
9. **Optional:** Clicks "Show Patient View" to discuss with patient

---

### **Flow 2: Documentation Mode (Post-Treatment)**

1. Practitioner opens saved planned protocol
2. Reviews what was planned (read-only)
3. Enters actual treatment delivered
4. **Data panel shows:** Planned vs Actual comparison
5. Enters outcomes (PHQ-9, MEQ-30, etc.)
6. **Data panel shows:** Expected vs Observed outcomes
7. Logs any safety events
8. Clicks "Submit" (saves final record)
9. **System learns:** Updates predictive models

---

## 📊 **MOCKUPS REQUIRED**

### **Priority 1: Core Screens**
1. ✅ Desktop split-screen (input | data) - Default state
2. ✅ Desktop split-screen - With data loaded
3. ✅ Desktop split-screen - With safety alert
4. ✅ Tablet tabbed view - Input tab
5. ✅ Tablet tabbed view - Data tab
6. ✅ Mobile stacked view
7. ✅ Patient-facing view (fullscreen)

### **Priority 2: Interactive States**
8. ✅ Loading state (skeleton UI)
9. ✅ Empty state (not enough data)
10. ✅ Error state (data unavailable)
11. ✅ Comparison view (planned vs actual)

### **Priority 3: Detail Views**
12. ✅ Similar patients drill-down
13. ✅ Receptor impact tooltip
14. ✅ Safety alert expanded
15. ✅ Network benchmarks detail

---

## ✅ **ACCEPTANCE CRITERIA**

### **Visual Design:**
- [ ] Split-screen layout works on desktop (>1024px)
- [ ] Tabbed layout works on tablet (640-1024px)
- [ ] Stacked layout works on mobile (<640px)
- [ ] All data visualizations follow design system
- [ ] No bright whites (eye strain prevention)
- [ ] Color blind friendly (icons + labels + patterns)

### **Functionality:**
- [ ] Data panel updates in real-time as inputs change
- [ ] Smooth transitions (<400ms)
- [ ] Loading states use skeleton UI (no spinners)
- [ ] Empty states are helpful and encouraging
- [ ] Error states allow graceful degradation
- [ ] Patient-facing view is clean and simple

### **Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader support complete
- [ ] ARIA labels on all charts
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

### **Responsiveness:**
- [ ] Works on 1920px desktop
- [ ] Works on 1024px laptop
- [ ] Works on 768px tablet
- [ ] Works on 375px mobile

---

## 🚫 **OUT OF SCOPE**

**Do NOT design these (future phases):**
- ❌ Multi-substance protocol UI (Phase 3)
- ❌ Advanced filtering/sorting (Phase 3)
- ❌ Export/print functionality (Phase 4)
- ❌ Collaborative features (Phase 4)

---

## 📚 **REFERENCE MATERIALS**

### **Read These First:**
1. `PARADIGM_SHIFT_CLINICAL_INTELLIGENCE.md` - Strategic context
2. `STRATEGIC_SYNTHESIS.md` - Market research insights
3. `.agent/workflows/create_tooltips.md` - Tooltip guidelines
4. `DESIGN_SYSTEM.md` - Color palette, typography

### **Existing Components to Reuse:**
- `AdvancedTooltip` - For info icons
- `GlassmorphicCard` - For data panel sections
- Button groups - For input fields (already designed)

---

## 🎯 **DEFINITION OF DONE**

- [x] Read all reference materials
- [ ] Create 15 mockups (Priority 1-3)
- [ ] Document all interactive states
- [ ] Specify all animations/transitions
- [ ] Define responsive breakpoints
- [ ] Create patient-facing view mockup
- [ ] Write accessibility specifications
- [ ] Get LEAD approval
- [ ] Hand off to INSPECTOR for pre-review

---

## 📞 **HANDOFF TO DESIGNER**

**LEAD:** This is the most important design task we've ever had.

**Why:** This transforms PPN from a "data entry tool" to a "clinical intelligence platform" - 100x more valuable.

**Your Mission:** Design an interface that makes practitioners feel like they have a superpower - the ability to see what will likely happen before they treat.

**Key Principle:** The data panel should feel like a **trusted advisor**, not a **nagging assistant**. It shows possibilities, not prescriptions.

**Timeline:** 3-4 days for Priority 1-2 mockups. Priority 3 can follow.

**Questions?** Ask LEAD anytime.

**Ready to change the world?** 🚀

---

**Task Created:** 2026-02-11 16:40 PST  
**Assigned To:** DESIGNER  
**Status:** 🔴 AWAITING START  
**Next Step:** DESIGNER creates mockups, then hands to INSPECTOR
