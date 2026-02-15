---
work_order_id: WO_040
title: Comprehensive UX/UI Friction Audit & Redesign of ProtocolBuilder
type: DESIGN
category: Design
priority: CRITICAL
status: 02_DESIGN
created: 2026-02-15T00:59:56-08:00
requested_by: Trevor Calton
assigned_to: DESIGNER
assigned_date: 2026-02-15T05:44:00-08:00
estimated_complexity: 8/10
failure_count: 0
---

# Work Order: Comprehensive UX/UI Friction Audit & Redesign of ProtocolBuilder

## 🎯 THE GOAL

Act as a Senior UX/UI Architect and Conversion Rate Expert. The ProtocolBuilder.tsx workflow is the "Killer App" of our platform. It must be as frictionless, lightning-fast, and intuitive as possible to drive clinician adoption.

Perform a deep UX audit of the current React components and propose/implement a masterful UI redesign focusing on:

### 1. Actionable Validation Feedback
The "Submit to Registry" button is currently disabled if `isFormComplete` is false, but gives ZERO visual feedback on what is missing. Design elegant, inline visual cues (icons, helper text, subtle red highlights paired with text labels) to clearly guide the user to missing required fields before they even try to click submit.

### 2. Speed & Ergonomics (Power User Focus)
The form must be fully keyboard navigable (Tab/Enter). Reduce mouse-clicks wherever possible. Evaluate if we can use pill-toggles or segmented controls instead of dropdowns for binary choices.

### 3. Cognitive Load & Visual Hierarchy
The main form stacks Tab1, Tab2, and Tab3 in a long scroll. Improve the visual separation (e.g., using elevated Card UI, subtle background shifts, or clear numbering). The user should never feel overwhelmed by a "wall of inputs."

### 4. The 70/30 Split Experience
Ensure the sticky ClinicalInsightsPanel on the right feels like a dynamic, high-value "Copilot" that reacts beautifully as data is entered on the left.

### 5. Premium Aesthetic
Apply modern 2026 SaaS design trends (e.g., subtle Glassmorphism, elevated focus states, refined typography) to make the page feel trustworthy and high-end.

### 6. Artifact First
The Designer MUST document their UX audit findings and proposed Tailwind UI updates into the Work Order .md file for review before writing the final code.

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

You are ONLY analyzing and modifying the frontend UI/UX wrappers and Tailwind classes in:

- `src/pages/ProtocolBuilder.tsx`
- `src/components/ProtocolBuilder/Tab1_PatientInfo.tsx`
- `src/components/ProtocolBuilder/Tab2_Medications.tsx`
- `src/components/ProtocolBuilder/Tab3_ProtocolDetails.tsx`
- `src/components/ProtocolBuilder/ClinicalInsightsPanel.tsx`
- `src/components/ProtocolBuilder/PatientSelectionScreen.tsx`
- `src/components/ProtocolBuilder/SubmissionSuccessScreen.tsx`

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify the `ProtocolFormData` interface (database schema is locked)
- Alter the Supabase `handleSubmit` logic, data payload, or `handleSelectPatient` data fetching logic
- Break the existing 70/30 grid layout on desktop
- Add new data collection fields
- Touch files outside the Blast Radius

**MUST:**
- Only upgrade the visual wrapper around the data
- If you believe you must touch a file outside the Blast Radius, FAIL the task and return it to Inbox

---

## 📝 WORKFLOW REQUIREMENTS

### Phase 1: UX Audit (REQUIRED FIRST)
Document in this work order file:
1. Current friction points identified
2. Validation feedback gaps
3. Keyboard navigation issues
4. Visual hierarchy problems
5. Cognitive load concerns

### Phase 2: Design Proposal (REQUIRED BEFORE CODE)
Document in this work order file:
1. Proposed Tailwind class changes
2. New UI components (pill-toggles, segmented controls)
3. Validation feedback design
4. Visual hierarchy improvements
5. Premium aesthetic enhancements

### Phase 3: Implementation (ONLY AFTER APPROVAL)
- Apply Tailwind UI updates
- Implement validation feedback
- Enhance keyboard navigation
- Improve visual hierarchy
- Apply premium aesthetic

---

## ✅ Acceptance Criteria

### UX Audit Completed
- [ ] Friction points documented
- [ ] Validation gaps identified
- [ ] Keyboard navigation assessed
- [ ] Visual hierarchy evaluated
- [ ] Cognitive load analyzed

### Design Proposal Delivered
- [ ] Tailwind class changes proposed
- [ ] UI component updates specified
- [ ] Validation feedback designed
- [ ] Visual hierarchy improvements outlined
- [ ] Premium aesthetic defined

### Implementation (After Approval)
- [ ] Actionable validation feedback implemented
- [ ] Keyboard navigation enhanced
- [ ] Visual hierarchy improved
- [ ] 70/30 split optimized
- [ ] Premium aesthetic applied

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Minimum 12px fonts** (text-xs minimum)
- **NO color-only state indicators** (use icons: ⚠️, ✓, ✗)
- User has Color Vision Deficiency
- Keyboard navigable
- Screen reader compatible

### SECURITY
- **NO PHI/PII data collection**
- No names, DOBs, or emails

---

## 🚦 Status

**INBOX** - Awaiting DESIGNER UX audit and design proposal

---

## ⚠️ IMPORTANT NOTE

This is **NOT** intended to be a major refactoring, but rather:
1. **Functional optimization**
2. **Crisp, professional, stunning beautification**

**If DESIGNER recommends Refactoring:**
- Must come to user for design review FIRST
- Must include visual mockups
- Must wait for approval before proceeding

---

## 📋 Focus Areas Summary

1. **Validation Feedback** - Icons + helper text + subtle highlights
2. **Keyboard Navigation** - Full Tab/Enter support
3. **Visual Hierarchy** - Card UI, background shifts, clear numbering
4. **Copilot Experience** - Dynamic ClinicalInsightsPanel
5. **Premium Aesthetic** - Glassmorphism, elevated focus states, refined typography
