---
work_order_id: WO_030
title: Create Visual Mockups for New Components
type: DESIGN
category: Design
priority: HIGH
status: COMPLETE
created: 2026-02-15T00:11:35-08:00
requested_by: Trevor Calton
assigned_to: DESIGNER
estimated_complexity: 8/10
failure_count: 0
owner: DESIGNER
completed: 2026-02-15T03:48:00-08:00
deliverable: docs/design/component_mockups/README.md
prerequisite_for: WO_029
---

# Work Order: Create Visual Mockups for New Components

## 🎯 THE GOAL

Create high-fidelity visual mockups for all 15 new components and 2 new pages proposed in today's work orders BEFORE conducting the comprehensive UI/UX audit (WO_029).

## 📋 COMPONENTS TO DESIGN

### 1. Clinical Safety (1 component)
- **InteractionChecker** - Drug interaction warnings with severity levels

### 2. Data Visualization (1 component)
- **ReceptorChart** - Receptor affinity radar/bar chart

### 3. Session Management (1 component)
- **MusicLogger** - Music context field with playlist link

### 4. Scientific Tools (1 component)
- **ReagentCamera** - Camera interface for reagent test verification

### 5. Data Import (1 page)
- **ImportLegacy Page** - Bulk import interface with review table

### 6. Search & Discovery (6 components)
- **Bento Grid Layout** - Vertical stacked search results
- **SubstanceCard** - Hero row with molecular renders
- **ClinicalDataTable** - High-density table with sparklines
- **AIInsightBar** - Collapsible notification bar
- **SmartFilters** - Conditional sidebar
- **BentoSkeleton** - Custom skeleton loaders

### 7. Content & Help (1 page)
- **Help Center Page** - FAQ and documentation display

---

## 📐 DESIGN SPECIFICATIONS

### Visual Requirements
- **Design System:** Use existing glassmorphism, dark mode aesthetic
- **Accessibility:** WCAG 2.1 AA compliance
- **Responsive:** Mobile, tablet, desktop breakpoints
- **Interactions:** Hover, active, disabled, loading states
- **Animations:** Smooth transitions, respect prefers-reduced-motion

### Deliverable Format
- High-fidelity mockups (Figma, Sketch, or similar)
- Component states (default, hover, active, error, loading)
- Responsive variations (mobile, tablet, desktop)
- Annotations for interactions and animations

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `docs/design/component_mockups/` (New directory)
- Design tool files (Figma, Sketch, etc.)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Write code (mockups only)
- Change existing design system
- Modify functionality

**MUST:**
- Follow existing visual language
- Maintain accessibility standards
- Document design decisions

---

## ✅ Acceptance Criteria

### Mockups Created
- [ ] InteractionChecker (all severity levels)
- [ ] ReceptorChart (radar and bar variants)
- [ ] MusicLogger (manual + "Now Playing")
- [ ] ReagentCamera (camera view + results)
- [ ] ImportLegacy Page (paste + review states)
- [ ] Bento Grid Layout (full search results)
- [ ] SubstanceCard (with molecular render)
- [ ] ClinicalDataTable (with sparklines)
- [ ] AIInsightBar (collapsed + expanded)
- [ ] SmartFilters (conditional states)
- [ ] BentoSkeleton (loading states)
- [ ] Help Center Page (full layout)

### Documentation
- [ ] Design rationale documented
- [ ] Interaction states specified
- [ ] Responsive behavior defined
- [ ] Accessibility notes included

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- WCAG 2.1 AA minimum
- Color contrast verified
- Keyboard navigation considered
- Screen reader support planned

### DESIGN SYSTEM
- Glassmorphism (1px white/10 borders)
- Dark mode aesthetic
- Existing typography scale
- Consistent spacing

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Priority Order

**Phase 1 (Core Safety & Search):**
1. InteractionChecker
2. Bento Grid Layout
3. SubstanceCard
4. ClinicalDataTable

**Phase 2 (Data Viz & Tools):**
5. ReceptorChart
6. MusicLogger
7. AIInsightBar
8. SmartFilters

**Phase 3 (Advanced Features):**
9. ReagentCamera
10. ImportLegacy Page
11. BentoSkeleton
12. Help Center Page

---

## Dependencies

**Prerequisite for:** WO_029 (Comprehensive UI/UX Audit)

## LEAD ARCHITECTURE

**Technical Strategy:**
Create high-fidelity visual mockups for 15 new components before UX audit (prerequisite for WO_029).

**Files to Touch:**
- `docs/design/component_mockups/` - NEW: Mockup files directory
- Design tool files (Figma, Sketch, etc.)

**Constraints:**
- MUST NOT write code (mockups only)
- MUST follow existing glassmorphism design system
- MUST ensure WCAG 2.1 AA compliance
- MUST document all component states (default, hover, active, error, loading)

**Recommended Approach:**
1. Phase 1: Core Safety & Search (InteractionChecker, Bento Grid, SubstanceCard, ClinicalDataTable)
2. Phase 2: Data Viz & Tools (ReceptorChart, MusicLogger, AIInsightBar, SmartFilters)
3. Phase 3: Advanced Features (ReagentCamera, ImportLegacy, BentoSkeleton, Help Center)
4. Document design rationale and accessibility notes
5. Create responsive variations (mobile, tablet, desktop)

**Risk Mitigation:**
- INSPECTOR should review accessibility compliance
- Verify color contrast meets WCAG AA
- Ensure keyboard navigation is considered

**Routing Decision:** → DESIGNER (with INSPECTOR review for accessibility)
