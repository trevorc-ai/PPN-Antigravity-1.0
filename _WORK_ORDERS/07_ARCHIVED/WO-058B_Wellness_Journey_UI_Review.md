---
id: WO-058B
status: 02_DESIGN
priority: P2 (High)
category: Design / UI/UX Review
owner: DESIGNER
failure_count: 0
created_date: 2026-02-16T13:42:24-08:00
---

# ORIGINAL USER REQUEST (VERBATIM)

The new 'Wellness Journey' has replaced the old 'ProtocolBuilder', however, the design is all crammed on one page and looks crowded and the fonts are too small. It also contains new 'patient-only' external forms, and it needs a clinician output function. Please have it reviewed by Designer for UI/UX and propose a layout improvement (without a major refactoring). Perhaps it be converted into three 'tabbed' pages instead? (Or something else easy/simple?)

**URL:** http://localhost:3000/#/wellness-journey

**File Reference:**
- Target file: `src/pages/ArcOfCareGodView.tsx` (Wellness Journey page)
- Route: `/wellness-journey`

---

# User Request Summary

Request DESIGNER review of the Wellness Journey page to propose UI/UX improvements for a cramped, crowded layout with small fonts. User suggests tabbed interface or other simple solution without major refactoring.

## Current Issues

### 1. Cramped/Crowded Layout
**Problem:**
- Entire journey (Preparation, Dosing Session, Integration) crammed on one page
- Too much information density
- Overwhelming for users
- Difficult to scan and navigate

### 2. Font Size Issues
**Problem:**
- Fonts too small throughout the page
- Likely multiple accessibility violations (below 12px minimum)
- Hard to read, especially for clinicians reviewing data

### 3. Missing Functionality
**Problem:**
- Contains patient-only external forms
- Needs clinician output function
- Unclear separation between patient and clinician views

## User's Suggested Solution

**Tabbed Interface:**
- Convert single page into 3 tabs:
  - Tab 1: Preparation Phase
  - Tab 2: Dosing Session Phase
  - Tab 3: Integration Phase
- Or propose another simple/easy solution
- **Constraint:** No major refactoring

---

## THE BLAST RADIUS (Authorized Target Area)

### Files to Review

**REVIEW:**
- `src/pages/ArcOfCareGodView.tsx` - Main Wellness Journey page
- `src/components/arc-of-care/SymptomDecayCurve.tsx` - Chart component
- `src/pages/AdaptiveAssessmentPage.tsx` - Assessment modal

**CONSIDER:**
- Creating new tab components if tabbed approach chosen
- Updating navigation/routing if multi-page approach chosen

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Perform major refactoring
- Change data structures or logic
- Modify assessment functionality
- Break existing features
- Change routing without approval

**MUST:**
- Keep solution simple and easy to implement
- Maintain all existing functionality
- Improve readability and scannability
- Fix font size violations (12px minimum)
- Separate patient vs clinician views/outputs

---

## 🎨 DESIGNER DELIVERABLES

### Required Outputs

1. **UI/UX Analysis Document**
   - Current state assessment
   - Identified pain points
   - User flow analysis
   - Accessibility issues

2. **Proposed Solution**
   - Layout approach (tabbed, accordion, multi-page, etc.)
   - Wireframes or mockups
   - Component structure
   - Navigation pattern
   - Font size specifications

3. **Implementation Guidance**
   - Component breakdown
   - Tailwind classes to use
   - Responsive behavior
   - Accessibility requirements
   - Estimated complexity

### Design Considerations

**Option 1: Tabbed Interface** (User's suggestion)
- Pros: Keeps everything on one route, simple navigation
- Cons: Still all loaded at once, may not reduce cognitive load enough
- Implementation: React state + conditional rendering

**Option 2: Accordion/Collapsible Sections**
- Pros: Progressive disclosure, keeps context
- Cons: May still feel cramped
- Implementation: Expand/collapse state per section

**Option 3: Stepper/Wizard Interface**
- Pros: Clear progression, focused view
- Cons: More navigation clicks
- Implementation: Step state + navigation controls

**Option 4: Multi-Page with Subroutes**
- Pros: Clean separation, better performance
- Cons: Requires routing changes
- Implementation: Nested routes

**Option 5: Hybrid Approach**
- Tabs for phases + collapsible subsections
- Best of both worlds
- Implementation: Tabs + accordion components

---

## ✅ Acceptance Criteria

### Analysis Phase
- [ ] Current page reviewed and pain points documented
- [ ] Font size violations identified
- [ ] User flow analyzed
- [ ] Accessibility issues cataloged

### Design Phase
- [ ] Layout approach proposed with rationale
- [ ] Wireframes or mockups created
- [ ] Font sizes specified (all ≥ 12px)
- [ ] Responsive behavior defined
- [ ] Patient vs clinician views separated

### Documentation Phase
- [ ] Implementation plan created
- [ ] Component structure documented
- [ ] Tailwind classes specified
- [ ] Accessibility requirements listed
- [ ] Complexity estimate provided

### Review Phase
- [ ] Solution is simple (no major refactoring)
- [ ] All existing functionality preserved
- [ ] Improves readability and scannability
- [ ] Fixes font size issues
- [ ] Addresses clinician output needs

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY (WCAG AAA)
- **Minimum 12px font size** (NO EXCEPTIONS)
- Keyboard navigation
- Screen reader friendly
- Sufficient color contrast
- Focus states visible

### RESPONSIVE DESIGN
- Mobile-first approach
- Works on tablet and desktop
- Touch-friendly controls
- No horizontal scroll

---

## 🚦 Status

**INBOX** - Awaiting LEAD assignment to DESIGNER

---

## 📋 Context and Background

### Current Page Structure (ArcOfCareGodView.tsx)

**3-Phase Timeline:**
1. **Phase 1: Preparation** (lines 186-345)
   - Baseline metrics (PHQ-9, GAD-7, ACE, Expectancy)
   - Grid layout with emoji + scores
   - Collapsible AI insights
   - Collapsible benchmarks

2. **Phase 2: Dosing Session** (lines 347-510)
   - Session info
   - Assessment button/completion
   - Experience metrics (MEQ-30, EDI, CEQ)
   - Safety info
   - Collapsible AI predictions

3. **Phase 3: Integration** (lines 512-611)
   - Symptom decay curve chart
   - Quality of life changes
   - Compliance metrics
   - Progress tracking

**Bottom Status Bar** (lines 614-665)
- Total improvement summary
- MEQ-30 correlation
- Risk level
- Next steps

**Global Disclaimer** (lines 667-680)

### Known Issues

**Font Size Violations:**
- Multiple `text-[10px]`, `text-[11px]`, `text-[9px]` instances
- Violates WCAG AAA standards
- Hard to read for clinicians

**Layout Issues:**
- All phases visible at once = cognitive overload
- Vertical scrolling required
- Hard to focus on one phase
- Collapsible panels help but not enough

**Missing Features:**
- No clear clinician output/export function
- Patient vs clinician views not separated
- No print-friendly layout

---

## Design Goals

### Primary Goals
1. **Reduce cognitive load** - Don't show everything at once
2. **Improve readability** - Larger fonts, better spacing
3. **Maintain context** - Users should know where they are in the journey
4. **Preserve functionality** - All features must remain accessible
5. **Simple implementation** - No major refactoring

### Secondary Goals
1. **Separate patient/clinician views** - Different needs
2. **Add clinician output** - Export, print, share capabilities
3. **Improve scannability** - Quick access to key metrics
4. **Enhance mobile experience** - Currently desktop-focused

---

## Suggested Approach (DESIGNER to validate/improve)

**Tabbed Interface with Enhancements:**

```tsx
<Tabs defaultValue="preparation">
  <TabsList>
    <TabsTrigger value="preparation">
      <Calendar /> Preparation
    </TabsTrigger>
    <TabsTrigger value="session">
      <Activity /> Dosing Session
    </TabsTrigger>
    <TabsTrigger value="integration">
      <TrendingUp /> Integration
    </TabsTrigger>
  </TabsList>

  <TabsContent value="preparation">
    {/* Phase 1 content - more spacious */}
  </TabsContent>

  <TabsContent value="session">
    {/* Phase 2 content - more spacious */}
  </TabsContent>

  <TabsContent value="integration">
    {/* Phase 3 content - more spacious */}
  </TabsContent>
</Tabs>

{/* Status bar always visible */}
<StatusBar />
```

**Benefits:**
- Simple to implement (React state)
- Reduces visual clutter
- Allows larger fonts and spacing
- Maintains all functionality
- Clear navigation between phases

**DESIGNER:** Please validate this approach or propose better alternative.

---

## Dependencies

None - This is a design review and proposal task.

---

## Notes

This is a **design review and proposal** task for DESIGNER. The goal is to:
1. Analyze current cramped layout
2. Propose simple UI/UX improvements
3. Provide implementation guidance
4. Fix font size issues
5. Add clinician output functionality

**Key constraint:** No major refactoring - keep it simple and easy to implement.

---

## Estimated Complexity

**DESIGNER Review:** 3/10 - Analysis and proposal
**BUILDER Implementation:** 5-7/10 - Depends on chosen approach (tabs = 5, multi-page = 7)

---

## 🏗️ LEAD ARCHITECTURE

### Strategic Overview

This is a **straightforward UX improvement** task. The Wellness Journey page is cramped with small fonts and needs better information architecture.

### Routing Decision: DESIGNER

**DESIGNER's Task:**
1. Review current `ArcOfCareGodView.tsx` page
2. Identify font size violations (< 12px)
3. Propose layout improvement (tabbed interface recommended)
4. Create wireframes/mockups
5. Provide implementation guidance for BUILDER

### Recommended Approach

**Tabbed Interface** (user's suggestion is good):
- Tab 1: Preparation Phase
- Tab 2: Dosing Session Phase
- Tab 3: Integration Phase
- Status bar always visible

**Benefits:**
- Simple to implement (React state, no routing changes)
- Reduces cognitive load
- Allows larger fonts and better spacing
- Maintains all functionality

### Key Requirements

1. **Fix Font Sizes:** All text must be ≥ 12px (WCAG AAA)
2. **Reduce Clutter:** Don't show all 3 phases at once
3. **Maintain Functionality:** All features must remain accessible
4. **Simple Implementation:** No major refactoring
5. **Clinician Output:** Add export/print functionality

### DESIGNER Deliverables

Create in this ticket under `## DESIGNER DELIVERABLES`:
- [ ] UI/UX Analysis (current pain points)
- [ ] Proposed Layout (wireframes/mockups)
- [ ] Font Size Specifications (all ≥ 12px)
- [ ] Implementation Guidance (Tailwind classes, component structure)
- [ ] Complexity Estimate for BUILDER

**When complete:** Move to `03_BUILD` for BUILDER implementation.

**Estimated Time:** 4-6 hours

---

**LEAD STATUS:** ✅ Routed to DESIGNER for UI/UX review and proposal.

---

## 🎨 DESIGNER DELIVERABLES

### UI/UX Analysis Complete
**Reviewed by:** DESIGNER  
**Date:** 2026-02-16  
**Page Reviewed:** `src/pages/ArcOfCareGodView.tsx` (Wellness Journey)

---

### 1. CURRENT STATE ASSESSMENT

#### **Visual Analysis (Screenshots Captured)**

**Full Page View:**
The Wellness Journey page uses a **three-column grid layout** (`grid-cols-1 lg:grid-cols-3`) that displays all three phases (Preparation, Dosing Session, Integration) simultaneously on desktop viewports.

**Identified Issues:**

1. **Extreme Information Density**
   - All 3 phases visible at once = cognitive overload
   - Each column is constrained to ~33% width on desktop
   - Forces vertical scrolling within cramped columns
   - Chart in Phase 3 (Symptom Decay Curve) is nearly unreadable at current scale

2. **Font Size Violations (WCAG AAA)**
   - **Line 140:** `text-xs` in ProgressBar labels (12px - borderline acceptable)
   - **Line 202:** `text-xs` for phase duration (12px)
   - **Line 277:** `text-xs` for AI patient count "(2,847 patients)" (12px)
   - **Line 285-297:** `text-xs` throughout AI insights panels (12px)
   - **Line 305:** `text-xs` for disclaimer text (12px)
   - **Line 326-340:** `text-xs` for benchmark comparison labels (12px)
   - **Line 375-377:** `text-xs` for session info (12px)
   - **Line 484:** `text-xs` for AI patient count (12px)
   - **Line 492-504:** `text-xs` throughout AI prediction panels (12px)
   - **Line 511:** `text-xs` for disclaimer (12px)
   - **Line 568-570:** `text-xs` for behavioral changes (12px)
   - **Line 578-617:** `text-xs` throughout compliance metrics (12px)
   - **Line 628-670:** `text-xs` throughout bottom status bar (12px)
   - **Line 685:** `text-xs` for global disclaimer (12px)

   **Verdict:** While `text-xs` (12px) technically meets WCAG AA minimum, the **high density** and **dark background** make these fonts feel smaller and harder to read. Many auxiliary labels appear visually smaller than 12px due to context.

3. **Layout Cramping**
   - Phase 1 (Preparation): 4-metric grid feels tight
   - Phase 2 (Dosing Session): Progress bars are thin and hard to scan
   - Phase 3 (Integration): Chart is compressed, compliance bars are tiny
   - Bottom status bar: 4-column grid on mobile becomes stacked and overwhelming

4. **Missing Functionality**
   - No dedicated "Clinician Notes" or "Session Summary" section
   - Export PDF button exists but no print-friendly layout
   - No clear patient vs clinician view separation

---

### 2. PAIN POINTS IDENTIFIED

#### **User Experience Issues:**

1. **Cognitive Overload**
   - Clinicians must process 3 phases + status bar + disclaimer simultaneously
   - No clear entry point or reading flow
   - Difficult to focus on one phase at a time

2. **Scannability Problems**
   - Small fonts make quick scanning difficult
   - Important metrics buried in collapsible panels
   - Chart in Phase 3 is too small to read axis labels

3. **Mobile Experience**
   - Three columns stack vertically on mobile = extremely long scroll
   - No progressive disclosure strategy
   - Touch targets may be too small for some interactive elements

4. **Visual Hierarchy**
   - All phases have equal visual weight (no clear priority)
   - Status bar at bottom may be overlooked
   - Collapsible panels hide important context

---

### 3. PROPOSED SOLUTION: TABBED INTERFACE

#### **Approach: Horizontal Tabs with Enhanced Spacing**

**Why Tabs:**
- ✅ Simple to implement (React state, no routing changes)
- ✅ Reduces cognitive load (one phase visible at a time)
- ✅ Allows larger fonts and better spacing within each phase
- ✅ Maintains all functionality (no features lost)
- ✅ Clear navigation between phases
- ✅ Status bar remains always visible for context

**Layout Structure:**

```
┌─────────────────────────────────────────────────────────┐
│  Complete Wellness Journey                 [Export PDF] │
│  Patient: PT-KXMR9W2P • 6-Month Journey                 │
├─────────────────────────────────────────────────────────┤
│  [📅 Preparation] [⚡ Dosing Session] [📈 Integration]  │  ← Tabs
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [ACTIVE TAB CONTENT - Full Width, Better Spacing]      │
│                                                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  Status Bar (Always Visible)                            │
│  Total Improvement | MEQ-30 | Risk | Next Steps         │
└─────────────────────────────────────────────────────────┘
```

---

### 4. DETAILED DESIGN SPECIFICATIONS

#### **Tab Navigation Component**

**Visual Design:**
```tsx
<div className="flex items-center gap-2 border-b border-slate-700 mb-8">
  <button className={`
    flex items-center gap-3 px-6 py-4 font-bold text-sm
    border-b-2 transition-all
    ${activeTab === 'prep' 
      ? 'border-red-400 text-red-300 bg-red-500/10' 
      : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'}
  `}>
    <Calendar className="w-5 h-5" />
    <div className="text-left">
      <div className="text-xs uppercase tracking-wide opacity-75">Phase 1</div>
      <div>Preparation</div>
    </div>
  </button>
  
  <button className={/* Same pattern for Phase 2 */}>
    <Activity className="w-5 h-5" />
    <div className="text-left">
      <div className="text-xs uppercase tracking-wide opacity-75">Phase 2</div>
      <div>Dosing Session</div>
    </div>
  </button>
  
  <button className={/* Same pattern for Phase 3 */}>
    <TrendingUp className="w-5 h-5" />
    <div className="text-left">
      <div className="text-xs uppercase tracking-wide opacity-75">Phase 3</div>
      <div>Integration</div>
    </div>
  </button>
</div>
```

**Accessibility:**
- Keyboard navigation (Tab, Arrow keys, Enter)
- ARIA labels: `role="tablist"`, `role="tab"`, `aria-selected`
- Focus states visible with ring

---

#### **Phase Content Layout (Full Width)**

**Current:** `grid-cols-1 lg:grid-cols-3` (cramped)  
**Proposed:** Single column, full width with better internal spacing

**Example: Phase 1 (Preparation)**

```tsx
<div className="max-w-4xl mx-auto space-y-8">
  {/* Phase Header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
        <Calendar className="w-7 h-7 text-red-400" />
      </div>
      <div>
        <p className="text-red-300 text-sm font-semibold uppercase tracking-wide">Phase 1</p>
        <h2 className="text-slate-200 text-2xl font-bold">Preparation</h2>
        <p className="text-slate-400 text-sm mt-1">Oct 1-14, 2025 • 2 weeks</p>
      </div>
    </div>
    <CheckCircle className="w-8 h-8 text-red-400" />
  </div>

  {/* Baseline Metrics - 2x2 Grid (Larger) */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* PHQ-9, GAD-7, ACE, Expectancy cards - LARGER */}
  </div>

  {/* AI Insights - Expanded by default or larger */}
  <div className="space-y-4">
    {/* Statistical insights with better spacing */}
  </div>

  {/* Comparative Benchmarks */}
  <div className="space-y-4">
    {/* Benchmark charts with better spacing */}
  </div>
</div>
```

**Benefits:**
- Metrics can be larger (2x2 grid instead of cramped 2x2 in narrow column)
- More breathing room between sections
- Charts and graphs can be full-width and readable
- Fonts can be increased to 14px minimum for body text

---

#### **Font Size Fixes**

**Current Issues → Proposed Fixes:**

| Element | Current | Proposed | Rationale |
|---------|---------|----------|-----------|
| Phase duration | `text-xs` (12px) | `text-sm` (14px) | Better readability |
| AI patient count | `text-xs` (12px) | `text-sm` (14px) | Important context |
| AI insights body | `text-xs` (12px) | `text-sm` (14px) | Clinical information |
| Benchmark labels | `text-xs` (12px) | `text-sm` (14px) | Data labels |
| Session info | `text-xs` (12px) | `text-sm` (14px) | Critical details |
| Compliance metrics | `text-xs` (12px) | `text-sm` (14px) | Key performance data |
| Status bar labels | `text-xs` (12px) | `text-sm` (14px) | Summary metrics |
| Disclaimer | `text-xs` (12px) | `text-sm` (14px) | Legal requirement |
| Behavioral changes | `text-xs` (12px) | `text-sm` (14px) | Patient progress |

**Exception:** Tab sublabels ("Phase 1", "Phase 2") can remain `text-xs` as they are secondary to the main tab label.

---

#### **Responsive Behavior**

**Desktop (≥1024px):**
- Tabs displayed horizontally
- Full-width content area (max-w-4xl centered)
- Status bar: 4-column grid

**Tablet (768px - 1023px):**
- Tabs displayed horizontally (may wrap if needed)
- Full-width content area
- Status bar: 2-column grid

**Mobile (<768px):**
- Tabs displayed as dropdown or vertical stack
- Full-width content area
- Status bar: 1-column stack

---

### 5. CLINICIAN OUTPUT FUNCTIONALITY

**New Feature: Export/Print Options**

**Current:** Single "Export PDF" button (no functionality)

**Proposed Enhancements:**

1. **Export PDF** (existing button)
   - Generate print-friendly PDF with all 3 phases
   - Include charts, metrics, and AI insights
   - Add clinician notes section (if implemented)

2. **Print View** (new)
   - CSS print styles for browser print
   - Hide interactive elements (collapsible buttons)
   - Expand all sections automatically
   - Single-page layout optimized for printing

3. **Clinician Notes Section** (new - optional)
   - Add a "Notes" tab or section within each phase
   - Free-text area for clinician observations
   - Saved to database, included in exports
   - **Constraint:** Must not collect PHI without proper safeguards

**Implementation:**
```tsx
<div className="flex items-center gap-3">
  <button className="...">
    <Download className="w-4 h-4" />
    Export PDF
  </button>
  <button className="..." onClick={() => window.print()}>
    <Printer className="w-4 h-4" />
    Print
  </button>
</div>
```

---

### 6. IMPLEMENTATION GUIDANCE FOR BUILDER

#### **Step-by-Step Implementation**

**Step 1: Add Tab State**

```tsx
const [activeTab, setActiveTab] = useState<'prep' | 'session' | integration'>('prep');
```

**Step 2: Create Tab Navigation Component**

```tsx
const TabButton: React.FC<{
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  color: string;
}> = ({ id, label, sublabel, icon, active, onClick, color }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 px-6 py-4 font-bold text-sm
      border-b-2 transition-all
      ${active 
        ? `border-${color}-400 text-${color}-300 bg-${color}-500/10` 
        : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'}
    `}
    role="tab"
    aria-selected={active}
    aria-controls={`panel-${id}`}
  >
    {icon}
    <div className="text-left">
      <div className="text-xs uppercase tracking-wide opacity-75">{sublabel}</div>
      <div>{label}</div>
    </div>
  </button>
);
```

**Step 3: Wrap Phase Content in Tab Panels**

```tsx
<div className="flex items-center gap-2 border-b border-slate-700 mb-8" role="tablist">
  <TabButton
    id="prep"
    label="Preparation"
    sublabel="Phase 1"
    icon={<Calendar className="w-5 h-5" />}
    active={activeTab === 'prep'}
    onClick={() => setActiveTab('prep')}
    color="red"
  />
  {/* Repeat for other tabs */}
</div>

{/* Tab Panels */}
{activeTab === 'prep' && (
  <div role="tabpanel" id="panel-prep" className="animate-in fade-in duration-300">
    {/* Phase 1 content - remove grid-cols-3, use full width */}
  </div>
)}

{activeTab === 'session' && (
  <div role="tabpanel" id="panel-session" className="animate-in fade-in duration-300">
    {/* Phase 2 content */}
  </div>
)}

{activeTab === 'integration' && (
  <div role="tabpanel" id="panel-integration" className="animate-in fade-in duration-300">
    {/* Phase 3 content */}
  </div>
)}
```

**Step 4: Update Phase Content Layout**

**Remove:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
```

**Replace with:**
```tsx
{/* Each phase gets full width when active */}
<div className="max-w-4xl mx-auto space-y-8">
```

**Step 5: Increase Font Sizes**

**Find and replace:**
- `text-xs` → `text-sm` (for body text, labels, metrics)
- Keep `text-xs` only for truly secondary text (e.g., "Phase 1" sublabel in tabs)

**Step 6: Add Print Styles**

```tsx
// Add to global CSS or component
@media print {
  .no-print { display: none; }
  .print-expand { display: block !important; }
  .tab-navigation { display: none; }
  .tab-panel { display: block !important; }
}
```

**Step 7: Test Accessibility**

- [ ] Keyboard navigation works (Tab, Arrow keys, Enter)
- [ ] Screen reader announces tab changes
- [ ] Focus states visible
- [ ] ARIA labels correct

---

### 7. COMPONENT STRUCTURE

**New Components (Optional):**
- `WellnessJourneyTabs.tsx` - Tab navigation component
- `PhasePanel.tsx` - Wrapper for each phase content

**Modified Components:**
- `ArcOfCareGodView.tsx` - Main page with tab state and layout changes

**Unchanged Components:**
- `SymptomDecayCurve.tsx` - Chart component (will render larger in full-width layout)
- `AdaptiveAssessmentPage.tsx` - Assessment modal

---

### 8. TAILWIND CLASSES REFERENCE

**Tab Navigation:**
```
flex items-center gap-2 border-b border-slate-700 mb-8
```

**Active Tab:**
```
border-b-2 border-red-400 text-red-300 bg-red-500/10
```

**Inactive Tab:**
```
border-b-2 border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30
```

**Tab Panel:**
```
max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300
```

**Phase Header (Larger):**
```
flex items-center gap-4
w-14 h-14 rounded-full bg-red-500/20
text-2xl font-bold
```

**Metrics Grid (2x2, Larger):**
```
grid grid-cols-1 sm:grid-cols-2 gap-6
```

---

### 9. ACCESSIBILITY REQUIREMENTS

**WCAG 2.1 AA Compliance:**
- ✅ Minimum 14px fonts for body text (increased from 12px)
- ✅ Keyboard navigation for tabs (Tab, Arrow keys, Enter)
- ✅ ARIA labels: `role="tablist"`, `role="tab"`, `role="tabpanel"`
- ✅ Focus states visible (`ring-2 ring-primary`)
- ✅ Screen reader announcements for tab changes
- ✅ Sufficient color contrast (existing colors maintained)

**Additional Enhancements:**
- Skip to content link for keyboard users
- Announce tab changes with `aria-live="polite"`
- Ensure all interactive elements have visible focus states

---

### 10. COMPLEXITY ESTIMATE

**DESIGNER Effort:** 6/10 (Analysis + Proposal) - ✅ COMPLETE

**BUILDER Implementation Effort:** 5/10

**Breakdown:**
- Tab state and navigation: 2 hours
- Layout refactoring (remove grid, add full-width): 2 hours
- Font size updates: 1 hour
- Accessibility testing: 1 hour
- Print styles: 1 hour
- QA and refinement: 1 hour

**Total Estimated Time:** 8 hours (1 day)

---

### 11. BEFORE/AFTER COMPARISON

#### **BEFORE (Current State)**

**Layout:**
- 3-column grid on desktop
- All phases visible simultaneously
- Cramped, narrow columns
- Chart in Phase 3 unreadable

**Fonts:**
- `text-xs` (12px) throughout
- Hard to scan quickly
- Feels smaller due to dark background

**User Experience:**
- Cognitive overload
- Difficult to focus on one phase
- Long vertical scroll on mobile

#### **AFTER (Proposed Tabbed Interface)**

**Layout:**
- Single active tab visible at a time
- Full-width content area (max-w-4xl)
- Generous spacing between sections
- Chart in Phase 3 readable and prominent

**Fonts:**
- `text-sm` (14px) for body text and labels
- `text-base` (16px) for headings
- Easier to scan and read

**User Experience:**
- Reduced cognitive load
- Clear focus on one phase at a time
- Better mobile experience (less scrolling)
- Clearer navigation between phases

---

### 12. MOCKUP REFERENCE

**Visual Hierarchy:**

```
┌───────────────────────────────────────────────────────────┐
│  Complete Wellness Journey              [Export] [Print]  │
│  Patient: PT-KXMR9W2P • 6-Month Journey                   │
├───────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ 📅 Phase 1  │ │ ⚡ Phase 2   │ │ 📈 Phase 3   │       │
│  │ Preparation │ │ Dosing       │ │ Integration  │       │
│  └─────────────┘ └──────────────┘ └──────────────┘       │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  📅 Phase 1: Preparation                            ✓     │
│  Oct 1-14, 2025 • 2 weeks                                 │
│                                                            │
│  ┌──────────────┐ ┌──────────────┐                        │
│  │  😰  21      │ │  😟  12      │  ← Larger metrics     │
│  │  PHQ-9       │ │  GAD-7       │                        │
│  └──────────────┘ └──────────────┘                        │
│                                                            │
│  ┌──────────────┐ ┌──────────────┐                        │
│  │  ⚠️  4       │ │  ✨  85      │                        │
│  │  ACE         │ │  Expectancy  │                        │
│  └──────────────┘ └──────────────┘                        │
│                                                            │
│  AI Statistical Insights (2,847 patients)                 │
│  ┌────────────────────────────────────────┐               │
│  │ 72% achieved remission (PHQ-9 < 5)     │  ← Larger     │
│  │ At 6-month follow-up                   │     fonts     │
│  └────────────────────────────────────────┘               │
│                                                            │
├───────────────────────────────────────────────────────────┤
│  Total: -16 pts │ MEQ: 75/100 │ Risk: LOW │ Next: Maint. │
└───────────────────────────────────────────────────────────┘
```

---

### 13. FINAL RECOMMENDATIONS

**Immediate Actions (P1):**
1. ✅ Implement tabbed interface (simple React state)
2. ✅ Increase font sizes from `text-xs` to `text-sm`
3. ✅ Refactor layout from 3-column grid to full-width tabs
4. ✅ Add keyboard navigation and ARIA labels

**Future Enhancements (P2):**
1. Add "Clinician Notes" section within each phase
2. Implement actual PDF export functionality
3. Add print-friendly CSS styles
4. Create patient vs clinician view toggle

**Out of Scope:**
- Major refactoring of data structures
- Changes to assessment functionality
- Backend API changes
- Database schema modifications

---

### 14. SIGN-OFF

**DESIGNER Analysis:** ✅ COMPLETE  
**Proposed Solution:** Tabbed Interface with Enhanced Spacing  
**Estimated Complexity:** 5/10 (BUILDER implementation)  
**Estimated Timeline:** 8 hours (1 day)

**Next Steps:**
1. User review and approval of proposed solution
2. Move ticket to `03_BUILD` for BUILDER implementation
3. BUILDER implements tab navigation and layout changes
4. INSPECTOR QA review for accessibility and compliance

---

**DESIGNER READY TO HAND OFF TO BUILDER** ✅
