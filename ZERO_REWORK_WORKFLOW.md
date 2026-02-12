# 🎯 ZERO-REWORK WORKFLOW - ARTIFACT-BASED DESIGN IMPLEMENTATION

**Version:** 2.0  
**Date:** 2026-02-11  
**Status:** ✅ ACTIVE  
**Purpose:** Eliminate rework through visual mockups, clear handoffs, and safety gates

---

## 📋 **WORKFLOW OVERVIEW**

```
DESIGNER → LEAD → DESIGNER → INSPECTOR → BUILDER → INSPECTOR → LEAD
  (mockup)  (approve) (finalize)  (safety)  (implement) (verify)  (approve)
```

**Key Principle:** Agents communicate via artifacts only. No direct chat.

---

## 🔄 **COMPLETE WORKFLOW**

### **PHASE 0: Visual Mockup Creation & Approval**
**Agent:** DESIGNER  
**Hands Off To:** LEAD

#### **DESIGNER Actions:**
1. ✅ Use browser tool to capture current state
2. ✅ Screenshot current UI (save as artifact)
3. ✅ Use `generate_image` tool to create realistic mockups
4. ✅ Create mockups for ALL states:
   - Default state
   - Hover state
   - Focus state
   - Active/Selected state
   - Disabled state (if applicable)
   - Loading state (if applicable)
   - Error state (if applicable)
5. ✅ Create mockups for ALL responsive views:
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)
6. ✅ Create preliminary design spec with mockups
7. ✅ Create artifact: `DESIGN_MOCKUP_[TASK]_[TIMESTAMP].md`

#### **DESIGNER Handoff:**
```
**DESIGNER:** Design mockups ready for review.
Artifact: /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/DESIGN_MOCKUP_[TASK]_[TIMESTAMP].md
Mockup images:
- MOCKUP_[TASK]_current_state.png
- MOCKUP_[TASK]_proposed_desktop.png
- MOCKUP_[TASK]_proposed_hover.png
- MOCKUP_[TASK]_proposed_focus.png
- MOCKUP_[TASK]_proposed_active.png
- MOCKUP_[TASK]_proposed_tablet.png
- MOCKUP_[TASK]_proposed_mobile.png
Requesting LEAD approval before proceeding to full specification.
```

#### **LEAD Actions:**
1. ✅ Review all mockups
2. ✅ Verify alignment with product vision
3. ✅ Check for scope creep
4. ✅ Decision:
   - ✅ **APPROVE** → DESIGNER proceeds to Phase 1
   - ❌ **REQUEST CHANGES** → DESIGNER revises mockups → back to LEAD

---

### **PHASE 1: Design Specification Finalization**
**Agent:** DESIGNER  
**Hands Off To:** INSPECTOR

#### **DESIGNER Actions (after LEAD approval):**
1. ✅ Incorporate LEAD's feedback into mockups
2. ✅ Finalize all technical specifications
3. ✅ Create **Acceptance Criteria** (testable checklist):
   ```
   - [ ] Button group displays 3 options horizontally
   - [ ] Selected state shows indigo-500 background (#6366f1)
   - [ ] Hover state shows slate-700 background (#334155)
   - [ ] Focus ring visible (2px indigo-500 outline)
   - [ ] Keyboard navigation works (Tab, Enter, Space)
   - [ ] Screen reader announces "Option X selected"
   - [ ] Mobile view stacks vertically below 768px
   ```
4. ✅ Create **Impact Analysis**:
   ```
   PAGES AFFECTED:
   - /protocol-builder (primary)
   
   COMPONENTS AFFECTED:
   - ProtocolBuilder.tsx (modified)
   - ButtonGroup.tsx (new)
   
   SHARED STYLES AFFECTED:
   - None (uses existing design tokens)
   
   WHAT COULD BREAK:
   - Existing dropdown functionality (being replaced)
   
   REGRESSION TESTING NEEDED:
   - Test all other dropdowns still work
   - Test form submission with new button groups
   ```
5. ✅ Create **Definition of Done**:
   ```
   DEFINITION OF DONE:
   - [ ] All acceptance criteria met
   - [ ] No console errors
   - [ ] Accessibility tested (keyboard + screen reader)
   - [ ] Responsive tested (mobile, tablet, desktop)
   - [ ] No code leaking to other components
   - [ ] Design system compliance verified
   - [ ] Performance acceptable (no lag)
   
   SIGN-OFFS:
   - DESIGNER: [name] [date]
   - LEAD VISUAL APPROVAL: [name] [date]
   - INSPECTOR PRE-REVIEW: [pending]
   - BUILDER IMPLEMENTATION: [pending]
   - INSPECTOR POST-REVIEW: [pending]
   - LEAD FINAL APPROVAL: [pending]
   ```
6. ✅ Create final artifact: `DESIGN_SPEC_[TASK]_[TIMESTAMP].md`

#### **DESIGNER Handoff:**
```
**DESIGNER:** Design specification complete. LEAD approved.
Artifact: /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/DESIGN_SPEC_[TASK]_[TIMESTAMP].md
Mockup images: 7 images (all states + responsive views)
Acceptance criteria: 12 items
Impact analysis: Complete
Definition of Done: Included
Handing off to INSPECTOR for safety review.
```

---

### **PHASE 2: Pre-Implementation Safety Review**
**Agent:** INSPECTOR  
**Hands Off To:** BUILDER (if approved) or DESIGNER (if issues)

#### **INSPECTOR Actions:**
1. ✅ Read DESIGNER's spec artifact
2. ✅ Read all mockup images
3. ✅ Use browser tool to audit current code:
   - Page where change will occur
   - Sidebar (if affected)
   - Top header (if affected)
   - Breadcrumbs (if affected)
   - All upstream components (parents, containers)
   - All downstream components (children, dependencies)
   - Shared styles and design system files
4. ✅ Check completeness of DESIGNER's spec:
   - ✅ All visual specifications present
   - ✅ All interactive states defined
   - ✅ All responsive breakpoints specified
   - ✅ All accessibility requirements listed
   - ✅ All affected files listed
   - ✅ All dependencies identified
   - ✅ No conflicts with existing code
5. ✅ Identify risks that would block BUILDER:
   - Missing specifications
   - Conflicts with existing components
   - Breaking changes to shared styles
   - Accessibility violations
   - Design system violations
   - Incomplete file list
6. ✅ Create artifact: `INSPECTOR_PRE_REVIEW_[TASK]_[TIMESTAMP].md`
7. ✅ Decision:
   - ✅ **GO-AHEAD** → Hand off to BUILDER
   - ❌ **SEND BACK** → Hand off to DESIGNER with fixes

#### **INSPECTOR Handoff (if approved):**
```
**INSPECTOR:** Pre-implementation safety review complete.
Artifact: /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/INSPECTOR_PRE_REVIEW_[TASK]_[TIMESTAMP].md
Status: ✅ GO-AHEAD

COMPLETENESS CHECK: ✅ PASS
- All visual specs present
- All states defined
- All responsive views specified
- All accessibility requirements listed
- All files identified

RISK ASSESSMENT: ✅ NO BLOCKERS
- No conflicts with existing components
- No breaking changes to shared styles
- Design system compliant

UPSTREAM DEPENDENCIES: None
DOWNSTREAM DEPENDENCIES: None
SHARED RESOURCES: Uses existing design tokens only

IMPLEMENTATION CHECKLIST FOR BUILDER:
1. Create ButtonGroup.tsx component
2. Modify ProtocolBuilder.tsx (lines 145-167, 189-201, 234-246, 278-290, 312-324)
3. Test all button groups
4. Test form submission
5. Test keyboard navigation
6. Test screen reader
7. Test responsive behavior

Handing off to BUILDER for implementation.
```

#### **INSPECTOR Handoff (if issues found):**
```
**INSPECTOR:** Pre-implementation safety review complete.
Artifact: /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/INSPECTOR_PRE_REVIEW_[TASK]_[TIMESTAMP].md
Status: ❌ ISSUES FOUND

ISSUES:
1. Missing hover state mockup for disabled buttons
2. Accessibility requirement incomplete (missing ARIA labels)
3. Impact analysis missing: TopNav component uses same button styles

REQUIRED FIXES:
- Add disabled+hover state mockup
- Specify exact ARIA labels for each button
- Add TopNav to impact analysis and regression testing plan

Sending back to DESIGNER for fixes.
```

---

### **PHASE 3: Implementation**
**Agent:** BUILDER  
**Hands Off To:** INSPECTOR

#### **BUILDER Actions:**
1. ✅ Read INSPECTOR's pre-review artifact
2. ✅ Read DESIGNER's spec artifact
3. ✅ Review all mockup images
4. ✅ Perform **Step-Back Analysis**:
   ```
   **BUILDER:** Step-Back Analysis:
   
   GOAL: Implement ButtonGroup component and replace 5 dropdowns
   
   FILES TO MODIFY:
   - /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/components/forms/ButtonGroup.tsx (create)
   - /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/ProtocolBuilder.tsx (modify)
   
   SAFETY CHECK:
   - Am I touching database files? NO ✅
   - Am I touching .sql files? NO ✅
   - Am I in /src directory? YES ✅
   
   BREAKING CHANGE PREVENTION:
   - Will not remove dropdown code, will comment out
   - Will test form submission before/after
   - Will verify no impact on other pages
   
   TASK FILE CHECK:
   - Checked BUILDER_TASK_*.md: None found
   - Following INSPECTOR's implementation checklist
   ```
5. ✅ Implement code following mockups exactly
6. ✅ Test all functionality:
   - Run dev server
   - Test all button groups
   - Test form submission
   - Test keyboard navigation
   - Test screen reader
   - Test responsive behavior
   - Check console for errors
7. ✅ Create artifact: `BUILDER_COMPLETE_[TASK]_[TIMESTAMP].md`

#### **BUILDER Handoff:**
```
**BUILDER:** Implementation complete.
Artifact: /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/BUILDER_COMPLETE_[TASK]_[TIMESTAMP].md

DESIGNER SPEC FOLLOWED: DESIGN_SPEC_BUTTONGROUP_20260211_1045.md
INSPECTOR PRE-REVIEW FOLLOWED: INSPECTOR_PRE_REVIEW_BUTTONGROUP_20260211_1102.md

FILES MODIFIED:
- /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/components/forms/ButtonGroup.tsx (created, 87 lines)
- /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/ProtocolBuilder.tsx (modified, replaced 5 dropdowns)

CHANGES MADE:
1. Created ButtonGroup component with all states (default, hover, focus, active, disabled)
2. Replaced Sex dropdown with button group (lines 145-167)
3. Replaced Smoking Status dropdown with button group (lines 189-201)
4. Replaced Route dropdown with button group (lines 234-246)
5. Replaced Severity Grade dropdown with button group (lines 278-290)
6. Replaced Resolution Status dropdown with button group (lines 312-324)

TESTING PERFORMED:
- ✅ Dev server running, no errors
- ✅ All button groups render correctly
- ✅ All interactive states work (hover, focus, active)
- ✅ Keyboard navigation works (Tab, Enter, Space)
- ✅ Screen reader announces selections correctly
- ✅ Form submission works with new button groups
- ✅ Responsive behavior correct (mobile, tablet, desktop)
- ✅ No impact on other pages verified

CONSOLE STATUS: ✅ CLEAN (no errors, no warnings)

KNOWN ISSUES: None

READY FOR INSPECTOR VERIFICATION: YES

Handing off to INSPECTOR for verification.
```

---

### **PHASE 4: Post-Implementation Verification**
**Agent:** INSPECTOR  
**Hands Off To:** LEAD (if approved) or BUILDER (if issues)

#### **INSPECTOR Actions:**
1. ✅ Read BUILDER's completion artifact
2. ✅ Read DESIGNER's spec artifact
3. ✅ Review all mockup images
4. ✅ Use browser tool to inspect implementation:
   - Navigate to implemented feature
   - Screenshot all states (default, hover, focus, active, disabled)
   - Test all interactive elements
   - Test responsive behavior (mobile, tablet, desktop)
   - Check console for errors
   - Verify accessibility (keyboard, screen reader, ARIA)
5. ✅ Compare implementation vs mockups (pixel-perfect check):
   - ✅ Colors match exactly
   - ✅ Typography matches exactly
   - ✅ Spacing matches exactly
   - ✅ All interactive states work
   - ✅ Responsive behavior correct
   - ✅ Accessibility requirements met
   - ✅ No console errors
   - ✅ No code leaking
   - ✅ Design system compliance
6. ✅ Check code quality:
   - No errors in console
   - No warnings in console
   - No broken layouts
   - No accessibility violations
   - No design system violations
   - No code leaking (unintended side effects)
7. ✅ Create artifact: `INSPECTOR_POST_REVIEW_[TASK]_[TIMESTAMP].md`
8. ✅ Decision:
   - ✅ **APPROVED** → Hand off to LEAD
   - ❌ **SEND BACK** → Hand off to BUILDER with fixes

#### **INSPECTOR Handoff (if approved):**
```
**INSPECTOR:** Post-implementation verification complete.
Artifact: /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/INSPECTOR_POST_REVIEW_[TASK]_[TIMESTAMP].md
Status: ✅ APPROVED

BUILDER COMPLETION ARTIFACT REVIEWED: BUILDER_COMPLETE_BUTTONGROUP_20260211_1115.md
DESIGNER SPEC REVIEWED: DESIGN_SPEC_BUTTONGROUP_20260211_1045.md

IMPLEMENTATION SCREENSHOTS:
- VERIFY_buttongroup_default.png
- VERIFY_buttongroup_hover.png
- VERIFY_buttongroup_focus.png
- VERIFY_buttongroup_active.png
- VERIFY_buttongroup_mobile.png
- VERIFY_buttongroup_tablet.png

COMPARISON RESULTS (Spec vs Implementation):
✅ Colors: Exact match (indigo-500, slate-700, slate-200)
✅ Typography: Exact match (14px, 500 weight, Inter font)
✅ Spacing: Exact match (8px padding, 4px gap)
✅ Interactive states: All working (hover, focus, active, disabled)
✅ Responsive behavior: Correct (stacks vertically < 768px)
✅ Accessibility: Full compliance (keyboard nav, screen reader, ARIA)

CONSOLE CHECK: ✅ CLEAN (no errors, no warnings)
ACCESSIBILITY CHECK: ✅ PASS (WCAG 2.1 AA compliant)
CODE QUALITY CHECK: ✅ PASS (clean code, no violations)
CODE LEAKING CHECK: ✅ NO LEAKS (no unintended side effects)

ACCEPTANCE CRITERIA VERIFICATION:
✅ Button group displays 3 options horizontally
✅ Selected state shows indigo-500 background (#6366f1)
✅ Hover state shows slate-700 background (#334155)
✅ Focus ring visible (2px indigo-500 outline)
✅ Keyboard navigation works (Tab, Enter, Space)
✅ Screen reader announces "Option X selected"
✅ Mobile view stacks vertically below 768px

FINAL SIGN-OFF:
Work completed to DESIGNER's specifications.
Implementation matches mockups pixel-perfect.
No errors. No warnings. No code leaking.
All acceptance criteria met.

Handing off to LEAD for final approval.
```

#### **INSPECTOR Handoff (if issues found):**
```
**INSPECTOR:** Post-implementation verification complete.
Artifact: /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/INSPECTOR_POST_REVIEW_[TASK]_[TIMESTAMP].md
Status: ❌ ISSUES FOUND

ISSUES:
1. Focus ring color incorrect (using blue-500 instead of indigo-500)
2. Mobile breakpoint wrong (stacking at 640px instead of 768px)
3. Screen reader not announcing selection (missing aria-live region)

REQUIRED FIXES:
- Change focus ring to indigo-500 (#6366f1)
- Update breakpoint to 768px
- Add aria-live="polite" region for selection announcements

Sending back to BUILDER for fixes.
```

---

### **PHASE 5: Final Approval**
**Agent:** LEAD  
**Final Decision**

#### **LEAD Actions:**
1. ✅ Read INSPECTOR's post-review artifact
2. ✅ Review implementation screenshots
3. ✅ Verify alignment with product vision
4. ✅ Decision:
   - ✅ **APPROVE** → Task complete, merge to main
   - ❌ **REQUEST CHANGES** → Send back with feedback

---

## 📊 **ARTIFACT SUMMARY**

| Phase | Agent | Artifact Created | Handed To |
|-------|-------|------------------|-----------|
| 0 | DESIGNER | DESIGN_MOCKUP_*.md + mockup images | LEAD |
| 1 | DESIGNER | DESIGN_SPEC_*.md | INSPECTOR |
| 2 | INSPECTOR | INSPECTOR_PRE_REVIEW_*.md | BUILDER or DESIGNER |
| 3 | BUILDER | BUILDER_COMPLETE_*.md | INSPECTOR |
| 4 | INSPECTOR | INSPECTOR_POST_REVIEW_*.md | LEAD or BUILDER |
| 5 | LEAD | (Final approval, no artifact) | — |

---

## ✅ **BENEFITS OF THIS WORKFLOW**

1. **Visual Mockups Eliminate Ambiguity** - Everyone sees exactly what we're building
2. **LEAD Approval Gate** - Catches strategic issues before implementation
3. **INSPECTOR Safety Valve** - Catches technical issues before and after implementation
4. **Acceptance Criteria** - Clear definition of "done"
5. **Impact Analysis** - Nothing gets missed
6. **Definition of Done** - Clear accountability chain
7. **Artifact-Based Communication** - No confusion, clear handoffs
8. **No Rework** - Issues caught at every gate before moving forward

---

## 🚨 **CRITICAL RULES**

1. **NO SKIPPING PHASES** - Every phase must complete
2. **NO DIRECT CHAT** - Agents communicate via artifacts only
3. **MOCKUPS ARE MANDATORY** - DESIGNER must use generate_image tool
4. **LEAD MUST APPROVE MOCKUPS** - Before INSPECTOR review
5. **INSPECTOR MUST APPROVE TWICE** - Pre and post implementation
6. **BUILDER MUST CREATE COMPLETION ARTIFACT** - Before handoff
7. **ALL ARTIFACTS MUST BE TIMESTAMPED** - For tracking

---

**This workflow virtually eliminates rework by catching issues at every gate before they become expensive to fix.**

**Status: ✅ ACTIVE AND ENFORCED IN agent.yaml**
