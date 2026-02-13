# DESIGNER Handoff - Protocol Builder Complete Redesign

**From:** LEAD  
**To:** DESIGNER  
**Date:** Feb 13, 2026, 10:40 AM  
**Priority:** CRITICAL - Complete Redesign Required  
**Temperature:** 3 (Refinement mode)

---

## 🚨 CRITICAL REQUIREMENTS (NON-NEGOTIABLE)

### 1. ZERO TEXT ENTRY POLICY ⚠️

**RULE:** Absolutely NO free-text inputs anywhere in the application

**❌ FORBIDDEN:**
- Search boxes (e.g., "Search medications...")
- Text input fields
- Textarea elements
- Any user-typed text

**✅ ALLOWED ONLY:**
- **Button groups** (for binary/small choices like Age, Sex, Weight)
- **Dropdowns** (for controlled lists like Indication, Substance, Route)
- **Checkboxes** (for multi-select like Medications)
- **Sliders** (for numeric ranges like Dosage - single touch/drag, faster than steppers)
- **Date pickers** (calendar UI, not text input)

**❌ NO STEPPERS** - Too many touches, use sliders instead

**Why:** PHI/PII risk, HIPAA compliance, data integrity

**Current Violation:** Medications tab has text search input - THIS MUST BE REMOVED

---

### 2. VISUAL EXCELLENCE (NOT DRAB)

**❌ NOT ACCEPTABLE:**
- Monochromatic (all dark grays)
- Lifeless, flat design
- No visual hierarchy
- Minimal accent colors

**✅ REQUIRED:**
- **Vibrant accent colors** (teal, emerald, amber, purple)
- **Gradients and glows** (subtle, tasteful)
- **Micro-animations** (button hovers, transitions, loading states)
- **Visual hierarchy** (color coding, icons, badges)
- **Rich visual elements** (icons, illustrations, data visualizations)

**Target:** User should be "wowed" at first glance, not think "this looks drab"

---

### 3. INFORMATION DENSITY (MINIMIZE DEAD SPACE)

**❌ NOT ACCEPTABLE:**
- >20% empty/dead space
- Sparse layouts with excessive padding
- Half-empty screens

**✅ REQUIRED:**
- **Dense, compact layouts** with rich information
- **Efficient use of space** (every pixel has purpose)
- **Minimal scrolling** (fit more content per screen)
- **Smart grouping** (related fields together)

**Current Issue:** Protocol Builder has >50% dead space - UNACCEPTABLE

---

### 4. NO PHASE 2 DEFERRALS

**❌ NOT ACCEPTABLE:**
- "Coming in Phase 2" placeholders
- Empty panels with "Complete X to view Y"
- Deferred features

**✅ REQUIRED:**
- **ALL features implemented NOW**
- **Clinical Insights panel fully functional** (all 6 sections with real data)
- **Complete, production-ready design**

**Current Issue:** Clinical Insights panel is empty placeholder - MUST BE IMPLEMENTED

---

### 5. TOOLTIPS REQUIRED (CRITICAL)

**❌ NOT ACCEPTABLE:**
- Missing tooltips on complex fields
- No guidance for users
- Unclear terminology

**✅ REQUIRED:**
- **AdvancedTooltip component** on every field that needs explanation
- **Clinical context** (e.g., "Why does this matter?")
- **Examples** (e.g., "Example: 25mg for moderate depression")
- **Warnings** (e.g., "Contraindicated with MAOIs")

**Implementation:**
- Use existing `AdvancedTooltip` component from `/src/components/ui/AdvancedTooltip.tsx`
- Tooltip trigger: Info icon (ⓘ) next to field label
- Content: Clinical context, examples, warnings
- See `/create_tooltips` workflow for implementation guide

**Priority Fields for Tooltips:**
1. Primary Indication (clinical definitions)
2. Dosage (safe ranges, weight-based calculations)
3. Route of Administration (onset time, bioavailability)
4. Concomitant Medications (interaction warnings)
5. Clinical Insights metrics (what each metric means)

---

### 6. PAGE HIERARCHY (CRITICAL)

**Primary Page:** `/protocols` = **My Protocols** (protocols list table)
- User lands here FIRST
- Shows all previously entered protocols
- Search/filter functionality
- "New Protocol" button navigates to builder

**Secondary Page:** `/protocol-builder` = **Protocol Builder** (data entry workflow)
- Accessed via "New Protocol" button
- NOT the landing page
- Returns to My Protocols after submission

**❌ DO NOT** make Protocol Builder the landing page (current mistake)

---

## Design Requirements

### Page 1: My Protocols (`/protocols`)

**Purpose:** Landing page showing all protocols in a table

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  My Protocols                          [+ New Protocol]      │
├─────────────────────────────────────────────────────────────┤
│  [Search: Subject ID...]  [Filter: Substance ▼] [Status ▼]  │
├─────────────────────────────────────────────────────────────┤
│  Subject ID  │ Session │ Substance  │ Dosage │ Date │ Status│
├──────────────┼─────────┼────────────┼────────┼──────┼───────┤
│  PT-ABC123   │    3    │ Psilocybin │ 25mg   │ 2/10 │ ✓     │
│  PT-XYZ789   │    1    │ MDMA       │ 120mg  │ 2/8  │ ✓     │
│  PT-DEF456   │    2    │ Ketamine   │ 0.5mg  │ 2/5  │ Draft │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Table with sortable columns
- ✅ Search by Subject ID (dropdown autocomplete, NOT free text)
- ✅ Filter by Substance (dropdown)
- ✅ Filter by Status (Submitted/Draft)
- ✅ Click row → navigate to `/protocol/{id}` (detail view)
- ✅ "New Protocol" button (top right, prominent, teal)
- ✅ Show count: "Showing X of Y protocols"

**Visual Design:**
- Vibrant status badges (green for Submitted, amber for Draft)
- Hover effects on rows
- Teal accent for "New Protocol" button
- Icons for actions

---

### Page 2: Protocol Builder (`/protocol-builder`)

**Purpose:** Single-page data entry form for creating/editing protocols

**Layout:** 70/30 split (form left, insights right)

**Left Side (70%):**

#### Section 1: Patient Information (Button Groups)
- **Age Range:** 6 buttons (18-25, 26-35, 36-45, 46-55, 56-65, 66+)
- **Biological Sex:** 4 buttons (Male, Female, Intersex, Unknown)
- **Weight Range:** 7 buttons (40-50kg, 51-60kg, 61-70kg, 71-80kg, 81-90kg, 91-100kg, 101+kg)
- **Smoking Status:** 4 buttons (Non-Smoker, Former, Occasional, Daily)
- **Prior Psychedelic Experience:** 4 buttons (None, 1-5, 6-10, 11+)

#### Section 2: Medications (Button Grid - NO TEXT INPUT)
**🚨 CRITICAL:** NO search input, NO free text

**Design:**
- **60 common medications** displayed as checkboxes in a grid
- **Organized by category:**
  - Antidepressants (SSRIs, SNRIs, TCAs)
  - Anxiolytics (Benzodiazepines)
  - Mood Stabilizers (Lithium, etc.)
  - Antipsychotics
  - Other
- **Multi-select:** User clicks checkboxes to select
- **Selected medications:** Display as removable pills/badges above grid
- **Visual:** 3-4 columns, compact grid, icons for categories

**Example Layout:**
```
Selected: [Sertraline ×] [Lithium ×]

Antidepressants:
☐ Sertraline (Zoloft)    ☐ Fluoxetine (Prozac)    ☐ Escitalopram (Lexapro)
☐ Paroxetine (Paxil)     ☐ Citalopram (Celexa)    ☐ Venlafaxine (Effexor)

Mood Stabilizers:
☑ Lithium                ☐ Valproate              ☐ Lamotrigine
```

#### Section 3: Protocol Details
- **Primary Indication:** Dropdown with tooltip (MDD, GAD, PTSD, OCD, etc.)
  - Tooltip: Clinical definition, typical presentation
- **Substance:** Dropdown with tooltip (Psilocybin, MDMA, Ketamine, LSD, 5-MeO-DMT, Ibogaine, Mescaline, Other)
  - Tooltip: Mechanism of action, typical use cases
- **Dosage:** Slider (0-500mg range, 1mg increments) + Unit dropdown (mg, mcg, ml)
  - Tooltip: Safe dosage ranges, weight-based recommendations
  - Display: Current value shown above slider (e.g., "25 mg")
  - Visual feedback: Color-coded zones (green = therapeutic, amber = high, red = dangerous)
- **Route:** Dropdown with tooltip (Oral, IV, IM, Intranasal, Sublingual, etc.)
  - Tooltip: Onset time, duration, bioavailability
- **Session Number:** Auto-incremented (read-only display, not user input)
  - For new patients: Session 1
  - For existing patients: Previous session + 1
- **❌ NO SESSION DATE FIELD** - Auto-generated on submission

#### Section 4: Consent
- **Consent Verified:** Single checkbox (required)

#### Section 5: Submit
- **Submit to Registry** button (large, teal, prominent)
- **Cancel** button (returns to My Protocols)

---

**Right Side (30%):** Clinical Insights Panel

**🚨 MUST BE FULLY IMPLEMENTED (NOT PLACEHOLDER)**

#### 1. Receptor Affinity Profile
- **Radar chart** showing binding affinity for 7 receptors
- Data from `ref_substances` table (SOOP provides)
- Receptors: 5-HT2A, 5-HT1A, 5-HT2C, D2, SERT, NMDA, Other
- Color-coded by affinity strength

#### 2. Expected Outcomes
- **Horizontal bar chart** showing average improvement
- Data from `mv_outcomes_summary` materialized view
- Metrics: PHQ-9 reduction, remission rate, response rate
- Compare: Your clinic vs. Network average

#### 3. Drug Interaction Alerts
- **List of interactions** with severity indicators
- Data from `ref_knowledge_graph` table
- Color-coded: 🔴 Severe, 🟡 Moderate, 🟢 Mild
- Show clinical recommendation

#### 4. Genomic Safety
- **Gauge/meter** showing safety score
- Based on patient genetics + substance
- Color-coded: Green (safe), Amber (caution), Red (contraindicated)

#### 5. Therapeutic Envelope
- **Compact info card** showing dosage range
- Min/Max safe dosage for patient weight
- Current dosage highlighted

#### 6. Cohort Matches
- **Preview** of similar patients
- "X patients with similar profile"
- Click to view details

---

## Visual Design Specifications

### Color Palette
- **Background:** `#020408` (deep dark)
- **Cards:** `#0f1218` (elevated dark)
- **Primary Text:** `#f8fafc` (slate-50)
- **Secondary Text:** `#94a3b8` (slate-400)
- **Accent 1:** `#14b8a6` (teal) - Primary actions, highlights
- **Accent 2:** `#10b981` (emerald) - Success, positive
- **Accent 3:** `#f59e0b` (amber) - Warnings, caution
- **Accent 4:** `#ef4444` (red) - Errors, severe alerts
- **Accent 5:** `#8b5cf6` (purple) - Special features

### Typography
- **Font:** Inter
- **Minimum Size:** 12px (WCAG AAA)
- **Labels:** Title Case (not ALL-CAPS)
- **Touch Targets:** 48px minimum

### Animations
- **Button hovers:** Scale 1.02, brightness increase
- **Transitions:** 200-300ms ease-in-out
- **Loading states:** Skeleton screens, pulse animations
- **Success feedback:** Checkmark animation, confetti (subtle)

### Responsive Breakpoints
- **Mobile (320-767px):** Stacked layout, single column
- **Tablet (768-1023px):** 50/50 split
- **Desktop (1024px+):** 70/30 split (form left, insights right)

---

## What NOT to Do (Negative Examples)

### ❌ Medication Screen - WRONG
```
Concomitant Medications
[Search medications...] ← FREE TEXT INPUT - FORBIDDEN
```

### ✅ Medication Screen - CORRECT
```
Concomitant Medications
Selected: [Sertraline ×] [Lithium ×]

☐ Sertraline (Zoloft)    ☐ Fluoxetine (Prozac)    ☑ Lithium
☐ Paroxetine (Paxil)     ☐ Citalopram (Celexa)    ☐ Valproate
```

### ❌ Session Date - WRONG
```
Session Date: [MM/DD/YYYY] ← SHOULD NOT EXIST
```

### ✅ Session Date - CORRECT
```
(No session date field - auto-generated on submission)
```

### ❌ Clinical Insights - WRONG
```
Complete patient information to view insights ← PLACEHOLDER
```

### ✅ Clinical Insights - CORRECT
```
[Radar chart with real data]
[Bar chart with real data]
[Interaction alerts list]
```

---

## Success Criteria

### Functional Requirements
- [ ] My Protocols page shows protocols table as landing page
- [ ] Protocol Builder accessed via "New Protocol" button
- [ ] Zero text entry (medications = checkbox grid, NO search)
- [ ] Session date field removed entirely
- [ ] Clinical Insights panel fully implemented (all 6 sections)
- [ ] Single-page layout (no tabs unless absolutely necessary)

### Visual Requirements
- [ ] Vibrant colors (teal, emerald, amber accents)
- [ ] Micro-animations (hovers, transitions)
- [ ] Dense layout (<20% dead space)
- [ ] Visual hierarchy (icons, badges, color coding)
- [ ] Not drab (user should be "wowed")

### Accessibility Requirements
- [ ] WCAG AAA contrast ratios (7:1 minimum)
- [ ] 12px minimum font size
- [ ] 48px minimum touch targets
- [ ] Keyboard navigation
- [ ] Screen reader compatible

---

## Deliverables

1. **My Protocols page mockup** (.png or Figma link)
2. **Protocol Builder redesign mockup** (.png or Figma link)
3. **Medication selection component spec** (.md file)
4. **Clinical Insights panel spec** (.md file with chart specifications)
5. **Component specifications** (.md files for each major component)
6. **Browser verification screenshots** (before/after)

---

## Database Dependencies (SOOP)

DESIGNER needs these data sources for Clinical Insights:

1. **Receptor affinity data:** `ref_substances` table with receptor columns
2. **Outcomes data:** `mv_outcomes_summary` materialized view
3. **Drug interactions:** `ref_knowledge_graph` table
4. **Medications list:** `ref_medications` table (60 most common)

**Coordination:** SOOP must complete database work in parallel

---

## Workflow

1. **Review this handoff** and current implementation screenshots
2. **Create design mockups** for both pages
3. **Submit for LEAD approval** (do not proceed to implementation)
4. **Iterate based on feedback**
5. **After approval:** Create component specifications
6. **Hand off to BUILDER** for implementation

---

## Estimated Time

- My Protocols page mockup: 2 hours
- Protocol Builder redesign mockup: 4 hours
- Component specifications: 3 hours
- Browser verification: 1 hour
- **Total: ~10 hours**

---

## Questions for DESIGNER

1. Do you need additional visual references or examples?
2. Do you need clarification on any requirements?
3. Do you need access to the current implementation for comparison?

**Ready to proceed?**
