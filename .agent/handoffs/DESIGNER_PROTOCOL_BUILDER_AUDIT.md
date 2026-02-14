# @DESIGNER: Protocol Builder Functionality Audit

**Command ID:** #003  
**Date Issued:** February 13, 2026, 4:26 PM PST  
**Issued By:** User (Boss)  
**Priority:** P0 - CRITICAL  
**Deadline:** Today EOD (Feb 13, 2026)

---

## Directive

**"Assign a different agent, not you, to fully test the functionality of the protocol builder."**

You are assigned to conduct a **comprehensive functionality audit** of the Protocol Builder. The Boss has identified that the dosage slider cannot be grabbed directly, and there may be other interaction issues.

---

## Your Task

### 1. Test EVERY Interactive Element

Navigate to: `http://localhost:3000/#/protocol-builder`

**Test the complete user flow:**

#### Patient Selection Screen
- [ ] Click "New Patient" card → Does it advance to Tab 1?
- [ ] Click "Existing Patient" card → Does it work?
- [ ] Click "Back to My Protocols" button → Does it navigate back?

#### Tab 1: Patient Identity
- [ ] Test all dropdown selectors (Age Range, Sex, etc.)
- [ ] Verify NO text inputs present (zero-text-entry policy)
- [ ] Click "Next" → Does it advance to Tab 2?

#### Tab 2: Medications
- [ ] Test substance selector (how is it implemented?)
- [ ] Test medication selection (checkbox grid? dropdown?)
- [ ] Click "Add Medication" → Does it work?
- [ ] Verify selected medications display in list
- [ ] Click "Next" → Does it advance to Tab 3?

#### Tab 3: Protocol Details
- [ ] **CRITICAL:** Test dosage slider
  - Can you grab the slider handle directly with mouse?
  - Can you drag it left/right?
  - Does the dosage value update as you drag?
  - Does it snap to increments or allow smooth dragging?
- [ ] Test dosage input field (if present)
- [ ] Test route of administration selector
- [ ] Test frequency selector
- [ ] Test all other protocol detail controls
- [ ] Click "Next" → Does it advance to Tab 4?

#### Tab 4: Clinical Context
- [ ] Test indication selector (dropdown? checkbox?)
- [ ] Test all clinical context fields
- [ ] Verify data entry controls work
- [ ] Click "Next" → Does it advance to Tab 5?

#### Tab 5: Review & Submit
- [ ] Verify ALL entered data displays correctly
- [ ] Test "Edit" buttons (do they navigate back to correct tabs?)
- [ ] Test "Submit" button → Does it submit successfully?
- [ ] After submit, does it navigate back to My Protocols?

---

### 2. Test Data Persistence

- [ ] Enter data in Tab 1, advance to Tab 2
- [ ] Click "Back" to Tab 1
- [ ] Verify data is still there (not lost)
- [ ] Repeat for all tabs

---

### 3. Test Edge Cases

- [ ] Try submitting with missing required fields → Does it show validation errors?
- [ ] Try entering invalid data → Does it prevent submission?
- [ ] Try navigating away mid-form → Does it warn about unsaved data?

---

### 4. Document ALL Issues

For **EACH issue** you find, document:

```markdown
### Issue #X: [Short Description]

**Location:** [Tab name / Element name]
**Expected Behavior:** [What should happen]
**Actual Behavior:** [What actually happens]
**Severity:** [Critical / High / Medium / Low]
**Screenshot:** [Path to screenshot showing the issue]
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3
```

---

## Deliverable

Create a file: `.agent/handoffs/PROTOCOL_BUILDER_FUNCTIONALITY_AUDIT.md`

**Include:**
1. **Executive Summary** - How many issues found, severity breakdown
2. **Detailed Issue List** - All issues documented with screenshots
3. **Prioritized Fix List** - Issues sorted by severity (Critical → Low)
4. **Recommendations** - What needs to be fixed before launch

---

## Specific Focus Areas

The Boss mentioned these specific concerns:

1. **Dosage Slider** - "I can't grab the dosage slider directly, et al"
   - Test if the slider handle is clickable/draggable
   - Test if there's a visual indicator when hovering
   - Test if the slider responds to mouse events
   - Test if there's an alternative input method (text field?)

2. **General Interaction Issues** - "et al" suggests there are multiple issues
   - Test ALL interactive elements thoroughly
   - Look for any controls that don't respond to clicks
   - Look for any visual glitches or layout issues

---

## Timeline

**Start:** Immediately  
**Deadline:** Today EOD (Feb 13, 2026)  
**Estimated Time:** 2-3 hours

---

## Acknowledgment Required

Reply within 2 hours:

```
✅ ACKNOWLEDGED - Command #003 received. Starting Protocol Builder audit now. ETA: [Your estimated completion time]
```

---

## Questions?

If you encounter any blockers or need clarification, notify LEAD immediately.

---

**This is a P0 CRITICAL task. The Protocol Builder is the #1 priority feature for MVP launch.**
