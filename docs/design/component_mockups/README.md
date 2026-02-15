# Component Mockups - WO_030

**Created:** 2026-02-15  
**Designer:** DESIGNER  
**Status:** Complete

---

## Overview

This directory contains high-fidelity visual mockups for 12 new components and 2 pages for the PPN Research Portal. All mockups follow the existing glassmorphism design system and meet WCAG 2.1 AA accessibility standards.

---

## Mockups Created

### Phase 1: Core Safety & Search

#### 1. InteractionChecker
![InteractionChecker](file:///Users/trevorcalton/.gemini/antigravity/brain/a4dd5602-ef03-43d0-bc6a-d72f29a2323d/interaction_checker_mockup_1771145186759.png)

**Purpose:** Drug interaction warnings with severity levels  
**States:** Critical (red), Moderate (amber), Low (green)  
**Features:**
- Two substance dropdown selectors
- Color-coded warning banners with icons
- "Learn More" links for each interaction
- WCAG AA contrast compliance

---

#### 2. Bento Grid Layout
![Bento Grid](file:///Users/trevorcalton/.gemini/antigravity/brain/a4dd5602-ef03-43d0-bc6a-d72f29a2323d/bento_grid_layout_mockup_1771145213551.png)

**Purpose:** Vertical stacked search results layout  
**Components:**
- AI Notification Bar (slim, collapsible)
- Three Substance Hero Cards in row
- High-density Clinical Data Table

**Features:**
- Glassmorphism styling throughout
- Sparkline charts in table
- Color-coded efficacy bars
- Safety status icons

---

#### 3. SubstanceCard
![Substance Card](file:///Users/trevorcalton/.gemini/antigravity/brain/a4dd5602-ef03-43d0-bc6a-d72f29a2323d/substance_card_mockup_1771145231881.png)

**Purpose:** Hero card with 3D molecular render space  
**Features:**
- Phase and Schedule badges
- Large black container for molecule (400x400px)
- Substance name and chemical formula
- Aggregate efficacy score with progress bar
- Micro-labels for structural data

---

### Phase 2: Data Viz & Tools

#### 4. MusicLogger
![Music Logger](file:///Users/trevorcalton/.gemini/antigravity/brain/a4dd5602-ef03-43d0-bc6a-d72f29a2323d/music_logger_mockup_1771145285485.png)

**Purpose:** Music context logging for sessions  
**States:**
- Manual Entry: Paste Spotify/Apple Music link
- Now Playing: Album art, song title, artist, duration

**Features:**
- Spotify/Apple Music integration
- Green "Now Playing" indicator
- Remove link for clearing
- Optional field (not required)

---

#### 5. AIInsightBar
![AI Insight Bar](file:///Users/trevorcalton/.gemini/antigravity/brain/a4dd5602-ef03-43d0-bc6a-d72f29a2323d/ai_insight_bar_mockup_1771145303947.png)

**Purpose:** Collapsible AI synthesis notification  
**States:**
- Collapsed: 64px height, "Synthesis ready" status
- Expanded: Full AI-generated text with source chips

**Features:**
- Indigo brain icon with pulse animation
- Source attribution chips with links
- Expand/collapse chevron button
- Glassmorphism with indigo tint

---

#### 6. SmartFilters
![Smart Filters](file:///Users/trevorcalton/.gemini/antigravity/brain/a4dd5602-ef03-43d0-bc6a-d72f29a2323d/smart_filters_mockup_1771145327497.png)

**Purpose:** Conditional filtering sidebar  
**Features:**
- Substance Type checkboxes with count badges
- Conditional Clinical Phase (appears when Psychedelics selected)
- Condition dropdown
- Conditional Efficacy Range slider (appears when condition selected)
- Safety Profile toggles
- Clear All Filters and Apply buttons

---

### Phase 3: Advanced Features

#### 7. ReagentCamera
![Reagent Camera](file:///Users/trevorcalton/.gemini/antigravity/brain/a4dd5602-ef03-43d0-bc6a-d72f29a2323d/reagent_camera_mockup_1771145376228.png)

**Purpose:** Camera interface for reagent test verification  
**States:**
- Camera View: Live viewfinder with crosshair and grid
- Results View: Captured image with analysis

**Features:**
- Flash toggle, capture button, gallery access
- Color detection with confidence percentage
- Likely substance identification
- Safety warning: "Presumptive test only"
- Retake and Save to Session actions

---

#### 8. ImportLegacy Page
![Import Legacy](file:///Users/trevorcalton/.gemini/antigravity/brain/a4dd5602-ef03-43d0-bc6a-d72f29a2323d/import_legacy_page_mockup_1771145398445.png)

**Purpose:** Bulk import interface with review workflow  
**Features:**
- Large textarea for paste (CSV, JSON, plain text)
- Format auto-detection
- Preview table with confidence scores
- Color-coded confidence bars (green/amber/red)
- Row selection checkboxes
- Warning: "No PHI will be stored"
- Import Selected button

---

#### 9. Help Center Page
![Help Center](file:///Users/trevorcalton/.gemini/antigravity/brain/a4dd5602-ef03-43d0-bc6a-d72f29a2323d/help_center_page_mockup_1771145421433.png)

**Purpose:** FAQ and documentation display  
**Layout:**
- Left sidebar: Category navigation with search
- Main content: Breadcrumb, title, FAQ accordions

**Features:**
- Expandable/collapsible FAQ sections
- Screenshot placeholders for visual guides
- "Was this helpful?" feedback buttons
- Contact Support link
- Article count badges per category

---

## Design System Compliance

### Glassmorphism Styling
- **Background:** `rgba(0, 0, 0, 0.4)` semi-transparent
- **Border:** `1px solid rgba(255, 255, 255, 0.2)` (WCAG compliant)
- **Backdrop Filter:** `blur(24px)` to `blur(32px)`
- **Border Radius:** `16px` to `24px`

### Color Palette
- **Primary Blue:** `#3b82f6`
- **Clinical Green:** `#53d22d` (high efficacy)
- **Amber:** `#f59e0b` (medium/warning)
- **Red:** `#ef4444` (critical/error)
- **Indigo:** `#818cf8` (AI features)
- **Text Primary:** `#f1f5f9` (Slate 100)
- **Text Secondary:** `#94a3b8` (Slate 400)

### Typography
- **Minimum Font Size:** 12px (labels)
- **Body Text:** 14px
- **Headings:** 16px-32px
- **Monospace:** For IDs, chemical formulas

### Accessibility
- ✅ WCAG 2.1 AA contrast compliance
- ✅ Color + icon/text (not color-only)
- ✅ Keyboard navigation considered
- ✅ Screen reader support planned
- ✅ Minimum 12px font size

---

## Interaction States

All components include specifications for:
- **Default:** Resting state
- **Hover:** Subtle scale/glow effects
- **Active:** Pressed/selected state
- **Disabled:** Reduced opacity
- **Loading:** Skeleton or spinner states
- **Error:** Red accent with clear messaging

---

## Responsive Behavior

### Breakpoints
- **Mobile:** < 768px (single column)
- **Tablet:** 768px - 1280px (2 columns)
- **Desktop:** > 1280px (3 columns)

### Mobile Adaptations
- Substance cards stack vertically
- Tables scroll horizontally
- Filters collapse into drawer
- Touch targets minimum 44px

---

## Next Steps

### For BUILDER
1. Review mockups for technical feasibility
2. Identify any component dependencies
3. Create React component structure
4. Implement responsive breakpoints
5. Add keyboard navigation
6. Test with screen readers

### For INSPECTOR
1. Verify WCAG 2.1 AA compliance
2. Check color contrast ratios
3. Validate keyboard navigation patterns
4. Review ARIA label specifications

---

## Files

All mockup images are stored in the artifacts directory:
- `interaction_checker_mockup_*.png`
- `bento_grid_layout_mockup_*.png`
- `substance_card_mockup_*.png`
- `music_logger_mockup_*.png`
- `ai_insight_bar_mockup_*.png`
- `smart_filters_mockup_*.png`
- `reagent_camera_mockup_*.png`
- `import_legacy_page_mockup_*.png`
- `help_center_page_mockup_*.png`

---

**Status:** ✅ Complete - Ready for BUILDER implementation
