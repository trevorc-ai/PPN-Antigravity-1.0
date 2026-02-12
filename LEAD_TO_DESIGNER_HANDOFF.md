# 🎨 LEAD → DESIGNER HANDOFF

**Date:** 2026-02-11 11:59 PST  
**Task:** Protocol Builder Phase 1 UX Improvements  
**Status:** ✅ READY FOR DESIGNER

---

## 📋 **TASK SUMMARY**

Create visual mockups for Protocol Builder UX improvements focusing on converting dropdown fields to button groups for better usability.

---

## 🎯 **DESIGNER OBJECTIVES**

### **Phase 1: Convert Dropdowns to Button Groups**

Convert the following dropdown fields to button groups:

1. **Age** → Button group with ranges (18-25, 26-35, 36-45, 46-55, 56-65, 66+)
2. **Weight Range** → Button group with ranges (40-50kg, 51-60kg, 61-70kg, 71-80kg, 81-90kg, 91-100kg, 101+kg)
3. **Race/Ethnicity** → Button group (White, Black/African American, Hispanic/Latino, Asian, Native American, Pacific Islander, Other, Prefer not to say)

### **Fields to Keep as Dropdowns:**
- Primary Indication (too many options)
- Subject ID (text input)

### **Fields Already Using Button Groups (Keep as-is):**
- Biological Sex ✅
- Smoking Status ✅

---

## 📸 **CURRENT STATE REFERENCE**

**Screenshot Location:**
`/Users/trevorcalton/.gemini/antigravity/brain/fc08a919-6a04-4d96-a494-182e26609f2c/protocol_builder_form_dropdowns_1770839895090.png`

**Current Form Shows:**
- Patient Demographics section
- Age dropdown
- Biological Sex button group (Male, Female, Intersex, Unknown)
- Smoking Status button group (4 options)
- Race/Ethnicity dropdown
- Primary Indication dropdown
- Weight Range dropdown
- Subject ID field
- Consent checkbox

---

## 🎨 **DESIGN REQUIREMENTS**

### **Visual Mockup Requirements:**

1. **Create realistic mockups** (NOT ASCII art) using `generate_image` tool
2. **Show ALL interactive states:**
   - Default state
   - Hover state
   - Selected state
   - Focus state (keyboard navigation)
3. **Responsive views:**
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)
4. **Before/After comparison** for each field

### **Design System Constraints:**

**Colors (from design system - NO BRIGHT WHITES):**
- Background: `bg-slate-900` (unselected), `bg-indigo-500` (selected)
- Border: `border-slate-800` (unselected), `border-indigo-500` (selected)
- Text: `text-slate-400` (unselected), `text-slate-100` (selected) - **NOT pure white**
- Hover: `bg-slate-800`
- Focus ring: `ring-2 ring-primary/40` (for keyboard navigation)

**⚠️ CRITICAL - Eye Strain Prevention:**
- **NEVER use `text-white` or pure white (#FFFFFF)**
- Use `text-slate-100` (#f1f5f9) for selected state text
- Use `text-slate-400` (#94a3b8) for unselected state text
- Use `text-slate-500` (#64748b) for disabled/tertiary text
- All text must have sufficient contrast (WCAG AA: 4.5:1 minimum)

**Typography:**
- Font: System default (matches existing)
- Size: `text-sm` for button text
- Weight: `font-medium`

**Spacing:**
- Gap between buttons: `gap-2` (8px)
- Padding: `px-4 py-2`
- Border radius: `rounded-lg`

**Layout:**
- Button groups should wrap on smaller screens
- Maximum 4 buttons per row on mobile
- Maximum 6 buttons per row on desktop

---

## ✅ **ACCEPTANCE CRITERIA**

Your mockups must include:

- [ ] Before/After comparison for Age field
- [ ] Before/After comparison for Weight Range field
- [ ] Before/After comparison for Race/Ethnicity field
- [ ] All interactive states (default, hover, selected, focus)
- [ ] Responsive layouts (desktop, tablet, mobile)
- [ ] Accessibility indicators (keyboard focus rings)
- [ ] Clear visual hierarchy
- [ ] Consistent with existing button groups (Biological Sex, Smoking Status)

---

## 🚫 **CONSTRAINTS**

**DO NOT:**
- Change the overall modal layout
- Modify the Subject ID field
- Modify the Primary Indication dropdown
- Change the consent checkbox
- Alter the "Secure Data Ingestion" notice
- Change colors outside the design system
- Use custom fonts

**DO:**
- Match the existing button group style exactly
- Ensure accessibility (WCAG 2.1 AA)
- Show keyboard navigation states
- Provide clear visual feedback for selection
- Maintain responsive behavior

---

## 📊 **IMPACT ANALYSIS**

**Pages Affected:**
- `/src/pages/ProtocolBuilder.tsx` (lines 332-458 contain form fields)

**Components Affected:**
- ButtonGroup component (already exists, will be reused)
- Form validation logic (no changes needed)

**What Could Break:**
- Nothing - this is visual design only, no code changes yet

**Regression Testing Needed:**
- Visual comparison with existing button groups
- Accessibility testing (keyboard navigation)
- Responsive testing (mobile, tablet, desktop)

---

## 🎯 **DEFINITION OF DONE**

- [ ] All mockup images generated and saved as artifacts
- [ ] Before/After comparisons created
- [ ] All interactive states documented
- [ ] Responsive views created
- [ ] Accessibility features shown (focus states)
- [ ] Design spec document created
- [ ] Handed off to LEAD for approval

---

## 📁 **DELIVERABLES**

Create the following artifacts:

1. **DESIGN_SPEC_PROTOCOLBUILDER_PHASE1_[TIMESTAMP].md**
   - Complete design specifications
   - All mockup images embedded
   - Interactive state definitions
   - Responsive breakpoint specifications
   - Accessibility requirements

2. **Mockup Images:**
   - `age_field_before_after.png`
   - `weight_range_before_after.png`
   - `race_ethnicity_before_after.png`
   - `interactive_states_all_fields.png`
   - `responsive_mobile_view.png`
   - `responsive_tablet_view.png`
   - `responsive_desktop_view.png`

---

## 🔄 **WORKFLOW**

1. **DESIGNER** creates mockups and design spec
2. **DESIGNER** hands off to **LEAD** for visual approval
3. **LEAD** reviews mockups
4. If approved → **DESIGNER** finalizes spec → **INSPECTOR**
5. If changes needed → **DESIGNER** revises → back to **LEAD**

---

## 📞 **CONTACT**

**LEAD:** Ready to review mockups immediately  
**Next Agent:** INSPECTOR (after LEAD approval)

---

**Ready to proceed! 🚀**
