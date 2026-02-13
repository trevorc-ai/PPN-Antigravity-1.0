# 🎨 DESIGNER: Protocol Builder Phase 1 - Ready to Execute

**Date:** 2026-02-11 10:44 PST  
**Status:** ✅ READY TO START  
**Priority:** P0 - Critical for Adoption

---

## 📍 **CRITICAL: PROJECT LOCATION CONFIRMED**

**Your working directory:**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0
```

**Verify before starting:**
```bash
pwd
# Must show: /Users/trevorcalton/Desktop/PPN-Antigravity-1.0
```

---

## 🎯 **YOUR MISSION**

Implement Phase 1 UX improvements to Protocol Builder to reduce data entry time by 30%.

**What you're doing:**
- Creating a reusable `ButtonGroup` component
- Replacing 5 dropdowns with button groups for faster selection
- Auto-opening the first accordion
- Adding a progress indicator

**What you're NOT doing:**
- ❌ No database changes
- ❌ No backend logic changes
- ❌ No form submission changes
- ❌ Only UI/UX improvements

---

## 📋 **YOUR TASK FILE**

**Read this file completely before starting:**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/DESIGNER_TASK_PROTOCOLBUILDER_PHASE1.md
```

This file contains:
- ✅ Complete ButtonGroup component code
- ✅ All 5 dropdown replacements with exact code
- ✅ Auto-open accordion instructions
- ✅ Progress indicator code
- ✅ Testing checklist

---

## 🔧 **FILES YOU WILL MODIFY**

### **1. CREATE NEW FILE:**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/components/forms/ButtonGroup.tsx
```
**Action:** Copy the complete component code from Task 1 in your task file (lines 83-134)

### **2. MODIFY EXISTING FILE:**
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/ProtocolBuilder.tsx
```
**Actions:**
- Add ButtonGroup import
- Replace 5 dropdowns (Sex, Smoking Status, Route, Session Number, Safety Event)
- Auto-open first accordion
- Add progress indicator

---

## ✅ **STEP-BY-STEP EXECUTION PLAN**

### **Step 1: Create ButtonGroup Component** (15 min)
1. Navigate to `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/components/forms/`
2. Create `ButtonGroup.tsx`
3. Copy code from DESIGNER_TASK_PROTOCOLBUILDER_PHASE1.md lines 83-134
4. Save file

### **Step 2: Modify ProtocolBuilder.tsx** (2 hours)
1. Open `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/ProtocolBuilder.tsx`
2. Add import: `import { ButtonGroup } from '../components/forms/ButtonGroup';`
3. Replace Sex dropdown (Task 2.2)
4. Replace Smoking Status dropdown (Task 2.3)
5. Replace Route dropdown (Task 2.4)
6. Replace Session Number dropdown (Task 2.5)
7. Replace Safety Event checkbox (Task 2.6)
8. Save file

### **Step 3: Auto-Open First Accordion** (15 min)
1. Find accordion state initialization in ProtocolBuilder.tsx
2. Update to: `const [openSections, setOpenSections] = useState<string[]>(['demographics']);`
3. Save file

### **Step 4: Add Progress Indicator** (30 min)
1. Add `getCompletionStatus()` helper function (from Task 4)
2. Add progress display to modal header
3. Save file

### **Step 5: Test Everything** (30 min)
1. Start dev server: `npm run dev`
2. Open browser to localhost
3. Open Protocol Builder modal
4. Test all button groups
5. Verify progress indicator updates
6. Submit a test form
7. Check console for errors

---

## 🎨 **DESIGN SPECIFICATIONS**

### **Button Group Colors:**
- **Unselected:** `bg-slate-800`, `border-slate-700`, `text-slate-400`
- **Hover:** `bg-slate-700`, `border-indigo-500`, `text-slate-200`
- **Selected:** `bg-indigo-500`, `border-indigo-500`, `text-white`, `font-semibold`

### **Transitions:**
- All transitions: `200ms`
- Smooth color changes
- No layout shift

### **Responsive:**
- Buttons should flex evenly
- Mobile: buttons may stack or shrink (test this)

---

## 🚫 **WHAT NOT TO CHANGE**

- ❌ Do NOT modify form submission logic
- ❌ Do NOT change database payload structure
- ❌ Do NOT modify these dropdowns: Substance, Indication, PHQ-9 (keep as searchable dropdowns)
- ❌ Do NOT change modal layout or accordion structure (except auto-opening first one)
- ❌ Do NOT change any backend logic
- ❌ Do NOT change fonts, overall spacing, or color scheme (except for button groups)

---

## ✅ **ACCEPTANCE CRITERIA**

Before marking complete, verify:

### **Visual:**
- [ ] Button groups have correct colors (slate-800 unselected, indigo-500 selected)
- [ ] Hover states work (slate-700 bg, indigo-500 border)
- [ ] Selected button is bold with white text
- [ ] All 5 button groups are visually consistent
- [ ] First accordion (Patient Demographics) opens automatically
- [ ] Progress indicator shows in modal header

### **Functional:**
- [ ] Clicking a button updates the form state
- [ ] Only one button can be selected at a time
- [ ] Progress indicator updates as fields are filled
- [ ] Form submission still works correctly
- [ ] No console errors

### **Performance:**
- [ ] No layout shift when switching between buttons
- [ ] Smooth transitions (200ms)
- [ ] Responsive on mobile

---

## 🧪 **TESTING CHECKLIST**

After implementation:
1. [ ] Open Protocol Builder modal
2. [ ] Verify first accordion is open
3. [ ] Click each button in Sex button group - verify selection works
4. [ ] Click each button in Smoking Status - verify selection works
5. [ ] Click each button in Route - verify selection works
6. [ ] Click each button in Session Number - verify selection works
7. [ ] Click each button in Safety Event - verify selection works
8. [ ] Fill out entire form and submit - verify data saves correctly
9. [ ] Check progress indicator updates as you fill fields
10. [ ] Test on mobile - verify buttons are responsive

---

## 📊 **EXPECTED IMPACT**

**Before:**
- 5 dropdown clicks (open dropdown, scroll, select)
- Hard to scan options
- Slower visual feedback

**After:**
- 1 click per selection
- All options visible at once
- Instant visual feedback
- **30% faster data entry**

---

## 🆘 **IF YOU ENCOUNTER ISSUES**

### **Issue: ButtonGroup component not found**
**Solution:** Verify file path is exactly:
```
/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/components/forms/ButtonGroup.tsx
```

### **Issue: Import error in ProtocolBuilder**
**Solution:** Verify import path is:
```typescript
import { ButtonGroup } from '../components/forms/ButtonGroup';
```

### **Issue: Form submission broken**
**Solution:** You likely changed the formData structure. Revert and only change the UI, not the data model.

### **Issue: Styling doesn't match**
**Solution:** Copy the exact className strings from the task file. Don't improvise.

---

## 📞 **COMMUNICATION**

**When you're done:**
1. Report completion to LEAD
2. Provide screenshot of button groups
3. Confirm all tests passed
4. Note any issues encountered

**If you get stuck:**
1. Ask LEAD for clarification
2. Don't guess - follow the spec exactly
3. Reference the task file for exact code

---

## 🚀 **READY TO START?**

1. ✅ Read PATH_UPDATE_ALL_AGENTS.md (confirm project location)
2. ✅ Read DESIGNER_TASK_PROTOCOLBUILDER_PHASE1.md (your detailed task)
3. ✅ Verify you're in `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0`
4. ✅ Start with Step 1: Create ButtonGroup component
5. ✅ Follow the execution plan step by step
6. ✅ Test thoroughly
7. ✅ Report completion

---

**DESIGNER: You have everything you need. The task file has all the code. Just copy, paste, test, and verify. This is a 4-hour task. Start now!** 🚀

**Questions? Ask LEAD before proceeding.**

---

**STATUS:** ✅ READY FOR DESIGNER EXECUTION  
**Estimated Time:** 4 hours  
**Expected Completion:** 2026-02-11 14:44 PST
