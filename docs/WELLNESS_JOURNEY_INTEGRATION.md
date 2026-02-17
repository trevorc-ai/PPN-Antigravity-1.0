# Wellness Journey Integration Documentation

**Version:** 1.0  
**Last Updated:** February 16, 2026  
**Status:** ✅ Complete (Phase A)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features Implemented](#features-implemented)
4. [Component Documentation](#component-documentation)
5. [User Experience Flow](#user-experience-flow)
6. [Technical Implementation](#technical-implementation)
7. [Accessibility & Design](#accessibility--design)
8. [Future Roadmap](#future-roadmap)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The **Wellness Journey** is a comprehensive dashboard that visualizes the complete arc of psychedelic-assisted therapy, from preparation through integration. It seamlessly integrates the adaptive assessment system to provide clinicians with real-time insights into patient progress.

### Key Objectives

- **Unified View:** Consolidate all phases of care into a single, cohesive dashboard
- **Adaptive Assessments:** Integrate MEQ-30, EDI, and CEQ assessments as a modal overlay
- **Real-time Updates:** Reflect assessment completion immediately in the dashboard
- **Discoverable Navigation:** Add "Wellness Journey" to the sidebar for easy access
- **Polished UX:** Ensure a professional, accessible, and visually appealing interface

---

## Architecture

### File Structure

```
src/
├── pages/
│   ├── ArcOfCareGodView.tsx          # Main Wellness Journey dashboard (renamed)
│   └── AdaptiveAssessmentPage.tsx    # Adaptive assessment component
├── components/
│   └── Sidebar.tsx                    # Navigation sidebar
└── App.tsx                            # Route configuration
```

### Routes

| Route | Component | Purpose | Status |
|-------|-----------|---------|--------|
| `/wellness-journey` | `ArcOfCareGodView` | Primary route | ✅ Active |
| `/arc-of-care-god-view` | `ArcOfCareGodView` | Legacy route | ✅ Backwards compatible |

---

## Features Implemented

### Phase A: Core Integration ✅

#### 1. **Terminology Update**
- ✅ Renamed "Wellness Journey" to "Wellness Journey" across all UI elements
- ✅ Updated page titles, headings, and navigation labels
- ✅ Maintained backwards compatibility with legacy routes

#### 2. **Assessment Modal Integration**
- ✅ Added "Complete Post-Session Assessments" button to Phase 2
- ✅ Implemented modal overlay for `AdaptiveAssessmentPage`
- ✅ Removed back button from modal context (`showBackButton={false}`)
- ✅ Auto-close modal 3 seconds after completion
- ✅ Real-time state updates on assessment completion

#### 3. **Navigation Enhancement**
- ✅ Added "Wellness Journey" to sidebar under "Core Research"
- ✅ Used "timeline" icon for visual consistency
- ✅ Positioned between "Dashboard" and "News"

#### 4. **Visual Polish (Quick Wins)**
- ✅ Increased card spacing (gap-6) for better breathing room
- ✅ Enlarged score typography (text-4xl font-black)
- ✅ Enhanced assessment button with gradient and hover effects
- ✅ Improved text contrast across all sections
- ✅ Reduced dead space in Phase 1 card

---

## Component Documentation

### `ArcOfCareGodView.tsx`

**Purpose:** Main dashboard displaying the 3-phase wellness journey.

#### State Management

```typescript
const [showAssessmentModal, setShowAssessmentModal] = useState(false);
const [assessmentCompleted, setAssessmentCompleted] = useState(false);
const [assessmentScores, setAssessmentScores] = useState<{
  meq: number;
  edi: number;
  ceq: number;
} | null>(null);
```

#### Key Props

| Prop | Type | Description |
|------|------|-------------|
| `journey` | `JourneyData` | Mock patient journey data |
| `showAssessmentModal` | `boolean` | Controls modal visibility |
| `assessmentCompleted` | `boolean` | Tracks completion status |
| `assessmentScores` | `object \| null` | Stores MEQ/EDI/CEQ scores |

#### Assessment Completion Handler

```typescript
const handleAssessmentComplete = (scores: { meq: number; edi: number; ceq: number }) => {
  setAssessmentScores(scores);
  setAssessmentCompleted(true);
  
  // Auto-close modal after 3 seconds
  setTimeout(() => {
    setShowAssessmentModal(false);
  }, 3000);
};
```

---

### `AdaptiveAssessmentPage.tsx`

**Purpose:** Adaptive assessment flow with branching logic.

#### New Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onComplete` | `(scores) => void` | `undefined` | Callback when assessments finish |
| `showBackButton` | `boolean` | `true` | Controls back button visibility |

#### Usage in Modal Context

```tsx
<AdaptiveAssessmentPage 
  showBackButton={false}
  onComplete={(scores) => {
    handleAssessmentComplete(scores);
  }}
/>
```

---

## User Experience Flow

### 1. **Dashboard Entry**
- User navigates to `/wellness-journey` from sidebar
- Dashboard loads with 3 phase cards (Preparation, Dosing Session, Integration)

### 2. **Assessment Trigger**
- User clicks "Complete Post-Session Assessments" button in Phase 2
- Modal overlay appears with `AdaptiveAssessmentPage`
- Back button is hidden to focus user on task

### 3. **Assessment Flow**
- User completes MEQ-30 quick assessment (3 questions)
- Based on score, either:
  - **High score (≥60):** Proceed to EDI
  - **Low score (<60):** Expand to full MEQ-30
- Complete EDI and CEQ assessments

### 4. **Completion**
- Scores are aggregated and passed to dashboard
- Success message displays for 3 seconds
- Modal auto-closes
- Dashboard updates to show "Assessments Complete" status
- Scores are displayed in Phase 2

---

## Technical Implementation

### Styling Approach

#### Card Spacing
```css
/* Phase cards */
.grid-cols-3 { gap: 1.5rem; } /* gap-6 */

/* Internal card spacing */
.space-y-2.5 { margin-top: 0.625rem; }
```

#### Typography Hierarchy
```css
/* Score numbers */
.text-4xl.font-black { font-size: 2.25rem; font-weight: 900; }

/* Labels */
.text-sm.font-semibold { font-size: 0.875rem; font-weight: 600; }

/* Section headings */
.text-sm.font-bold.uppercase.tracking-wide
```

#### Button Polish
```css
/* Assessment button */
.bg-gradient-to-r.from-amber-500.to-amber-600
.hover:scale-[1.02]
.shadow-xl.shadow-amber-500/40
```

### Accessibility Features

- ✅ **Minimum font size:** 12px (text-sm) site-wide
- ✅ **Color contrast:** WCAG AA compliant
- ✅ **No color-only meaning:** Text labels accompany all status indicators
- ✅ **Keyboard navigation:** Full support for tab/enter
- ✅ **Screen reader friendly:** Semantic HTML and ARIA labels

---

## Accessibility & Design

### Color Palette

| Element | Color | Contrast Ratio |
|---------|-------|----------------|
| Primary text | `text-slate-200` | 12.6:1 |
| Secondary text | `text-slate-400` | 7.2:1 |
| Phase 1 (Preparation) | Red (`border-red-500/50`) | N/A |
| Phase 2 (Dosing) | Amber (`border-amber-500/50`) | N/A |
| Phase 3 (Integration) | Emerald (`border-emerald-500/50`) | N/A |

### Typography Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Page title | `text-3xl` (30px) | `font-black` | "Complete Wellness Journey" |
| Score numbers | `text-4xl` (36px) | `font-black` | PHQ-9: 21, GAD-7: 12 |
| Section headings | `text-sm` (14px) | `font-bold uppercase` | "Experience Metrics" |
| Body text | `text-sm` (14px) | `font-medium` | Safety events, labels |
| Small text | `text-xs` (12px) | `font-normal` | Dates, metadata |

### Spacing System

| Element | Spacing | Tailwind Class |
|---------|---------|----------------|
| Between phase cards | 24px | `gap-6` |
| Card padding | 20px | `p-5` |
| Internal sections | 10px | `space-y-2.5` |
| Score grid gap | 10px | `gap-2.5` |
| Accordion padding | 10px | `p-2.5` |

---

## Future Roadmap

### Phase B: Supabase Integration 🔄
- [ ] Connect to `log_patient_journeys` table
- [ ] Fetch real patient data via RPC functions
- [ ] Save assessment responses to `log_assessment_responses`
- [ ] Implement RLS policies for data security

### Phase C: Complete Assessment Flow 📋
- [ ] Add baseline assessments (PHQ-9, GAD-7, ACE) to Phase 1
- [ ] Implement integration pulse checks in Phase 3
- [ ] Add C-SSRS and PSQI assessments
- [ ] Create assessment scheduling system

### Phase D: Advanced Features 🚀
- [ ] Export to PDF functionality
- [ ] Comparative analytics (clinic vs. global benchmarks)
- [ ] Predictive outcome modeling
- [ ] Longitudinal trend analysis
- [ ] Multi-patient comparison views

---

## Troubleshooting

### Common Issues

#### 1. **Assessment modal doesn't open**
- **Cause:** State not updating
- **Fix:** Check `setShowAssessmentModal(true)` is called on button click

#### 2. **Back button still visible in modal**
- **Cause:** `showBackButton` prop not passed
- **Fix:** Ensure `showBackButton={false}` is set on `AdaptiveAssessmentPage`

#### 3. **Dashboard doesn't update after assessment**
- **Cause:** `onComplete` callback not wired
- **Fix:** Verify `handleAssessmentComplete` is passed to `AdaptiveAssessmentPage`

#### 4. **Modal doesn't auto-close**
- **Cause:** `setTimeout` not executing
- **Fix:** Check that `onComplete` is called from assessment component

#### 5. **Dead space in Phase 1 card**
- **Cause:** Excessive spacing
- **Fix:** Verify `space-y-2.5` and `gap-2.5` classes are applied

---

## Code Examples

### Adding a New Phase

```tsx
{/* Phase 4: Maintenance */}
<div className="bg-gradient-to-br from-blue-500/10 to-blue-900/10 border-2 border-blue-500/50 rounded-2xl p-5 space-y-2.5">
  {/* Phase header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
        <RefreshCw className="w-5 h-5 text-blue-400" />
      </div>
      <div>
        <p className="text-blue-300 text-xs font-semibold uppercase tracking-wide">Phase 4</p>
        <h3 className="text-slate-200 text-base font-bold">Maintenance</h3>
      </div>
    </div>
    <CheckCircle className="w-5 h-5 text-blue-400" />
  </div>
  
  {/* Content here */}
</div>
```

### Customizing Assessment Button

```tsx
<button
  onClick={() => setShowAssessmentModal(true)}
  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98]"
>
  <CheckCircle className="w-5 h-5" />
  Complete Baseline Assessments
</button>
```

---

## Changelog

### v1.0 (February 16, 2026)
- ✅ Initial release
- ✅ Renamed "Wellness Journey" to "Wellness Journey"
- ✅ Integrated adaptive assessment modal
- ✅ Added sidebar navigation
- ✅ Implemented visual polish (Quick Wins)
- ✅ Reduced dead space in Phase 1

---

## Contributors

- **BUILDER:** Implementation and code
- **DESIGNER:** UI/UX specifications
- **LEAD:** Architecture and planning

---

## License

Internal use only - PPN Research Portal

---

**For questions or support, contact the development team.**
