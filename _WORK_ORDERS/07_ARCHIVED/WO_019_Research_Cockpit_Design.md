---
work_order_id: WO_019
title: Design Spec - High-Fidelity Research Cockpit
type: DESIGN
category: Design
priority: HIGH
status: COMPLETE
created: 2026-02-14T22:47:21-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T22:53:17-08:00
lead_decision: GO (with conditions)
requested_by: PPN Admin
assigned_to: DESIGNER
estimated_complexity: 8/10
failure_count: 0
completed_by: DESIGNER
completed_at: 2026-02-14T23:25:00-08:00
deliverable: docs/design/research_portal_v2.md
workflow_sequence:
  - step: 1
    agent: LEAD
    action: Initial review and go-ahead
    status: COMPLETE
    completed_at: 2026-02-14T22:53:17-08:00
    decision: GO (with conditions)
    review_doc: brain/331b813b-74d3-4c93-ae05-fb2e1aa00a00/WO_019_LEAD_Review.md
  - step: 2
    agent: INSPECTOR
    action: Secondary review and go-ahead
    status: COMPLETE
    completed_at: 2026-02-14T23:00:01-08:00
    decision: CONDITIONAL APPROVAL (accessibility enhancements required)
  - step: 3
    agent: DESIGNER
    action: Create design specification
    status: COMPLETE
    completed_at: 2026-02-14T23:25:00-08:00
    deliverable: docs/design/research_portal_v2.md
---

# Work Order: Design Spec - High-Fidelity Research Cockpit

## 🎯 THE GOAL

Redesign the `SearchPortal.tsx` results area to shift from "Horizontal Scroll" to a "Bento Grid" Research Cockpit.

### Design Requirements

1. **Visual Language:** Use "Glassmorphism" (translucent dark layers, 1px white/10 borders) to separate sections

2. **Top Tier (Substances):** Design a "Hero Row" for substances
   - Large cards
   - Space for 3D molecular renders
   - Distinct "Efficacy Score" badges

3. **Middle Tier (Clinical Data):** Design a "High-Density Data Table" for Patient outcomes
   - Instead of just text, use Sparklines or Heatmap Bars
   - Visualize PHQ-9 score drop (Baseline → Current)

4. **The AI Ticker:** Redesign the AI box as a slim, collapsible "Notification Bar"
   - Position at top of results
   - Use "pulsing" animation state when loading

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `docs/design/research_portal_v2.md` (New Artifact)
- `src/pages/SearchPortal.tsx` (Visual reference only)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Remove the large Hero Search Bar
- Use "Light Mode" elements; keep the "Dark/Scientific" aesthetic
- Implement code (design spec only)

**MUST:**
- Maintain dark/scientific aesthetic
- Preserve search functionality

---

## 🔄 CUSTOM WORKFLOW SEQUENCE

This work order requires a **3-step approval process** due to complexity and risk:

### Step 1: LEAD Initial Review ⏳ PENDING
- Review current SearchPortal.tsx implementation
- Assess feasibility of Bento Grid redesign
- Identify potential risks and dependencies
- **Deliverable:** Go/No-Go decision with rationale

### Step 2: INSPECTOR Secondary Review ⏳ PENDING
- Verify accessibility implications of glassmorphism
- Review data visualization approach (sparklines, heatmaps)
- Assess PHI/PII compliance for clinical data display
- **Deliverable:** Security and accessibility sign-off

### Step 3: DESIGNER Implementation ⏳ PENDING
- Create high-fidelity design specification
- Document glassmorphism styling guidelines
- Design substance hero cards with molecular render space
- Design high-density data table with visualizations
- Design AI notification bar with pulsing animation
- **Deliverable:** `docs/design/research_portal_v2.md`

---

## ✅ Acceptance Criteria

### LEAD Review
- [ ] Current SearchPortal.tsx reviewed
- [ ] Bento Grid feasibility assessed
- [ ] Risks and dependencies documented
- [ ] Go/No-Go decision made

### INSPECTOR Review
- [ ] Glassmorphism accessibility verified
- [ ] Data visualization approach approved
- [ ] PHI/PII compliance confirmed
- [ ] Security sign-off provided

### DESIGNER Deliverable
- [ ] Design spec created in `docs/design/research_portal_v2.md`
- [ ] Glassmorphism guidelines documented
- [ ] Substance hero cards designed
- [ ] High-density data table designed
- [ ] Sparklines/heatmap visualizations specified
- [ ] AI notification bar designed
- [ ] Pulsing animation states defined

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Glass elements must have sufficient border contrast** (1px solid white/10)
- Ensure all interactive elements are keyboard accessible
- Provide text alternatives for data visualizations

### SECURITY
- No PHI/PII exposure in design mockups
- Maintain data privacy in clinical data visualizations

---

## 🚦 Status

**INBOX** - Awaiting LEAD initial review

---

## 📋 Design Elements to Specify

### Glassmorphism Styling
- Background: `rgba(0, 0, 0, 0.4)` with backdrop blur
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Shadow: Subtle elevation

### Substance Hero Cards
- Size: Large (300px+ width)
- Molecular render area
- Efficacy score badge placement
- Hover/interaction states

### Clinical Data Table
- Sparkline specifications
- Heatmap bar color scales
- PHQ-9 visualization (Baseline → Current)
- Row/column structure

### AI Notification Bar
- Collapsed/expanded states
- Pulsing animation keyframes
- Loading state indicators

---

## Dependencies

None - This is a design specification task.

---

## ⚠️ High-Risk Notice

This work order is marked **HIGH PRIORITY** and **HIGH COMPLEXITY** due to:
- Major UI/UX redesign of critical search functionality
- Complex data visualization requirements
- Accessibility considerations with glassmorphism
- Requires multi-agent approval before implementation

---

## 🔍 INSPECTOR REVIEW (Step 2)

**Reviewed By:** INSPECTOR  
**Review Date:** 2026-02-14T23:00:01-08:00  
**Status:** ⚠️ **CONDITIONAL APPROVAL**

### Accessibility Compliance Review

**⚠️ CONCERNS IDENTIFIED:**

1. **Glassmorphism Contrast Risk**
   - Specified border: `rgba(255, 255, 255, 0.1)` is **too low contrast**
   - May violate WCAG 2.1 3:1 minimum contrast ratio for UI components
   - Users with color vision deficiency will struggle to distinguish panel boundaries
   - **REQUIRED FIX:** Increase to minimum `rgba(255, 255, 255, 0.2)`

2. **Data Visualization Accessibility**
   - Sparklines and heatmaps mentioned without accessibility specifications
   - **REQUIRED:** ARIA labels for all visualizations
   - **REQUIRED:** Data table alternatives for screen readers
   - **REQUIRED:** Keyboard navigation for interactive elements

3. **Font Size Requirements**
   - No minimum font size specified
   - **REQUIRED:** Minimum 12px for all text (per user global rules)

### Security Compliance Review

**✅ APPROVED:**
- No PHI/PII exposure in design mockups
- Data privacy maintained in clinical visualizations
- Design-only work order (no code implementation)

### Mandatory Conditions for DESIGNER

Before proceeding to Step 3, DESIGNER must commit to:

1. ✅ Use border opacity ≥ `rgba(255, 255, 255, 0.2)` for all glass elements
2. ✅ Specify ARIA labels for all data visualizations
3. ✅ Provide text alternatives for sparklines and heatmaps
4. ✅ Enforce minimum 12px font size throughout
5. ✅ Document keyboard navigation patterns

**VERDICT:** Approved to proceed to DESIGNER (Step 3) with mandatory accessibility enhancements.
