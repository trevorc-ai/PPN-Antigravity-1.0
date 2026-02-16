# User Acceptance Testing (UAT) Guide
## 5 Newly Approved Features from QA

**Date:** 2026-02-16T10:56:02-08:00  
**Inspector:** INSPECTOR  
**Total Features:** 5  
**Estimated Testing Time:** 20-30 minutes

---

## 🎯 Testing Objectives

Verify that all 5 features work correctly in the browser and meet user requirements:
1. Text brightness is comfortable for reading
2. Guided tour provides helpful onboarding
3. Drug interaction checker displays warnings
4. Help center is accessible and searchable
5. Tooltips provide contextual help

---

## 🚀 Pre-Testing Setup

### Step 1: Start Development Server
```bash
cd /Users/trevorcalton/Desktop/PPN-Antigravity-1.0
npm run dev
```

### Step 2: Open Browser
Navigate to: `http://localhost:3000`

### Step 3: Clear Browser Cache
- Press `Cmd + Shift + R` (hard refresh)
- Or clear cache in DevTools

---

## ✅ Feature 1: Text Brightness Fix (WO_043)

### What to Test:
Verify that text is comfortable to read and not too bright.

### Test Steps:

1. **Navigate to Dashboard**
   - URL: `http://localhost:3000/#/dashboard`
   - Check header text (should be slate-200, not white)
   - Check body text (should be slate-300, not white)

2. **Check Multiple Pages**
   - Visit: Substance Catalog, Protocol Builder, Search Portal
   - Verify text is not blindingly bright
   - Confirm text is still readable (good contrast)

3. **Check Buttons**
   - Button labels can be white (on colored backgrounds)
   - This is acceptable and correct

### ✅ Pass Criteria:
- [ ] Headers use slate-200 or darker
- [ ] Body text uses slate-300 or darker
- [ ] Text is comfortable to read
- [ ] No eye strain from bright text

### 🐛 If Issues Found:
- Note which page has bright text
- Take screenshot
- Report to INSPECTOR

---

## ✅ Feature 2: Guided Tour (WO_011)

### What to Test:
Verify the guided tour shows outcome-focused steps.

### Test Steps:

1. **Trigger the Tour**
   - Navigate to: `http://localhost:3000/#/dashboard`
   - Look for a "Start Tour" button or help icon
   - OR: Clear localStorage and reload (tour should auto-start)
   
   ```javascript
   // In browser console:
   localStorage.removeItem('tour_completed');
   location.reload();
   ```

2. **Go Through All Steps**
   - Step 1: "Analyze Protocols" ✅
   - Step 2: "Build Evidence-Based Protocols" ✅
   - Step 3: "Track Substance Affinity" ✅
   - Step 4: "Stay Informed" ✅
   - Step 5: "Get Expert Support" ✅

3. **Check Features**
   - [ ] Tour overlay is visible (not hidden behind elements)
   - [ ] Spotlight highlights correct elements
   - [ ] Next/Previous buttons work
   - [ ] Skip button dismisses tour
   - [ ] Progress indicator shows current step

4. **Test Keyboard Navigation**
   - Press `Tab` to navigate
   - Press `Enter` to proceed
   - Press `Esc` to close

### ✅ Pass Criteria:
- [ ] All 5 steps display correctly
- [ ] Tour highlights correct elements
- [ ] Keyboard navigation works
- [ ] Tour can be dismissed and restarted

### 🐛 If Issues Found:
- Note which step has issues
- Check z-index (tour should be on top)
- Report to INSPECTOR

---

## ✅ Feature 3: Drug Interaction Checker (WO_016)

### What to Test:
Verify the interaction checker displays warnings for dangerous drug combinations.

### Test Steps:

1. **Navigate to Protocol Builder**
   - URL: `http://localhost:3000/#/protocol-builder`
   - OR: Find a page that uses InteractionChecker component

2. **Select a Substance**
   - Choose a psychedelic (e.g., Psilocybin, MDMA)
   - Select medications that interact (e.g., SSRIs)

3. **Check for Warnings**
   - Look for interaction warnings
   - Verify severity levels:
     - **Red** = SEVERE (Contraindicated)
     - **Yellow** = MODERATE (Caution)
     - **Blue** = MILD (Monitor)

4. **Verify Warning Content**
   - [ ] Medical disclaimer displayed
   - [ ] Substance names shown (e.g., "Psilocybin + SSRI")
   - [ ] Risk description displayed
   - [ ] Mechanism explained
   - [ ] Clinical recommendation provided
   - [ ] PubMed reference link (if available)

5. **Test Tooltips**
   - Hover over "Severity Score" label
   - Tooltip should explain: "Red = High Risk (Stop). Yellow = Caution (Monitor closely)."

### ✅ Pass Criteria:
- [ ] Warnings display for known interactions
- [ ] Severity color-coding is correct
- [ ] Medical disclaimer is visible
- [ ] Tooltips provide helpful context
- [ ] User can proceed despite warnings (not blocking)

### 🐛 If Issues Found:
- Note which substance combination failed
- Check browser console for errors
- Verify database has interaction data
- Report to INSPECTOR

---

## ✅ Feature 4: Help Center (WO_027)

### What to Test:
Verify the Help/FAQ page is accessible and searchable.

### Test Steps:

1. **Navigate to Help Center**
   - URL: `http://localhost:3000/#/help-faq`
   - OR: Click "Help" link in navigation

2. **Check Page Layout**
   - [ ] Hero section with search bar
   - [ ] 4 topic categories (Getting Started, Clinical Toolsets, Regulatory, Troubleshooting)
   - [ ] FAQ accordion list
   - [ ] Support sidebar (Contact Support, System Status)

3. **Test Search Functionality**
   - Type "PHI" in search bar
   - Should filter to relevant FAQs (e.g., "Why can't I enter notes?")
   - Clear search, verify all FAQs return

4. **Test Category Filtering**
   - Click "Regulatory" category
   - Should show only regulatory FAQs
   - Click again to deselect

5. **Test FAQ Accordion**
   - Click on a question
   - Answer should expand
   - Click again to collapse

6. **Verify FAQ Content**
   - [ ] "Why can't I enter notes in the Protocol Builder?" (Zero-PHI policy)
   - [ ] "How is the Interaction Checker validated?"
   - [ ] "Do you store patient information?" (No PHI)
   - [ ] "Why can't patients log in to enter their own data?"

### ✅ Pass Criteria:
- [ ] Search filters FAQs correctly
- [ ] Category filtering works
- [ ] FAQ accordion expands/collapses
- [ ] All 7 FAQs are present
- [ ] Support sidebar is visible
- [ ] Responsive design (test on mobile size)

### 🐛 If Issues Found:
- Note which feature doesn't work
- Check browser console for errors
- Report to INSPECTOR

---

## ✅ Feature 5: Tooltip System (WO_028)

### What to Test:
Verify tooltips provide contextual help across the application.

### Test Steps:

1. **Test Safety Shield Tooltips**
   - Navigate to: Drug Interaction Checker (from Feature 3)
   - Hover over "Severity Score" label
   - Tooltip should appear: "Red = High Risk (Stop). Yellow = Caution (Monitor closely)."

2. **Test Tooltip Accessibility**
   - Use keyboard navigation (Tab key)
   - Focus on element with tooltip
   - Tooltip should appear
   - Press Esc to dismiss

3. **Check Tooltip Content**
   - Verify tooltips are helpful and concise
   - Verify tooltips use AdvancedTooltip component (styled consistently)

4. **Test Multiple Tooltips**
   - Navigate to different pages
   - Look for info icons or underlined text
   - Hover to trigger tooltips

### ✅ Pass Criteria:
- [ ] Tooltips appear on hover
- [ ] Tooltips are keyboard accessible
- [ ] Tooltip content is helpful
- [ ] Tooltips use consistent styling
- [ ] Tooltips don't block important content

### 🐛 If Issues Found:
- Note which tooltip doesn't work
- Check if tooltip content is missing
- Report to INSPECTOR

---

## 📊 UAT Completion Checklist

After testing all 5 features, complete this checklist:

### Feature 1: Text Brightness
- [ ] PASS - Text is comfortable to read
- [ ] FAIL - Text is too bright (report issues)

### Feature 2: Guided Tour
- [ ] PASS - Tour works correctly
- [ ] FAIL - Tour has issues (report issues)

### Feature 3: Drug Interaction Checker
- [ ] PASS - Warnings display correctly
- [ ] FAIL - Warnings don't work (report issues)

### Feature 4: Help Center
- [ ] PASS - Help center is functional
- [ ] FAIL - Help center has issues (report issues)

### Feature 5: Tooltip System
- [ ] PASS - Tooltips work correctly
- [ ] FAIL - Tooltips have issues (report issues)

---

## 🚀 Next Steps After Testing

### If All Features PASS:
1. Report to INSPECTOR: "All 5 features PASS UAT"
2. INSPECTOR will move tickets to COMPLETE
3. Features can be deployed to production

### If Any Features FAIL:
1. Document issues found
2. Report to INSPECTOR with details
3. INSPECTOR will create bug tickets
4. BUILDER will fix issues
5. Re-test after fixes

---

## 📝 Bug Report Template

If you find issues, use this template:

```markdown
**Work Order:** WO_XXX
**Feature:** [Feature Name]
**Issue:** [Brief description]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:** [What should happen]
**Actual Behavior:** [What actually happens]
**Screenshot:** [If applicable]
**Browser Console Errors:** [If any]
```

---

## ✅ INSPECTOR SUPPORT

If you encounter any issues during testing, I'm here to help:
- Clarify test steps
- Debug issues
- Create bug tickets
- Re-route to BUILDER if needed

**Ready to begin testing? Start the dev server and let me know how it goes!**

---

**END OF UAT GUIDE**
