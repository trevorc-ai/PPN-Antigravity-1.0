# 🚀 ANTIGRAVITY BEST PRACTICES

## How to Operate Antigravity Optimally

This guide shows you how to get the most out of Antigravity by using its features effectively.

---

## 1️⃣ **Using the Browser Tool**

### **Why Use It:**
- Visual verification of UI changes
- Identify specific elements by clicking on them
- Capture screenshots for documentation
- Test responsive behavior at different screen sizes

### **How to Use:**

#### **A. Open Your Local Dev Server**
```
"Open localhost:5173 in the browser"
```

Antigravity will:
- Launch a browser window
- Navigate to your dev server
- Capture a screenshot automatically

#### **B. Identify Specific Elements**
Instead of describing elements vaguely, **click on them** in the browser:

**❌ Bad:**
> "The button in the top right corner isn't working"

**✅ Good:**
> "Open the browser and click on the login button in the header"

Antigravity can then:
- Inspect the element's HTML
- Get its CSS classes and IDs
- Identify the exact component
- Understand the context

#### **C. Test Interactions**
```
"In the browser, click the Protocol Builder tab, 
then fill out the form and click Submit"
```

This lets Antigravity:
- See what happens when you interact
- Identify JavaScript errors
- Verify form validation
- Check loading states

#### **D. Capture Before/After Screenshots**
```
"Take a screenshot of the dashboard, then make the changes, 
then take another screenshot to compare"
```

Great for:
- Documenting changes in walkthrough.md
- Verifying visual improvements
- Showing you the difference

---

## 2️⃣ **Using Comments Effectively**

### **What Are Comments?**
You can leave comments while Antigravity is working to provide additional context or corrections.

### **When to Use Comments:**

#### **A. Provide Additional Context**
While Antigravity is working on a task:
```
"Also, make sure this works on mobile screens"
```

#### **B. Correct Course Mid-Task**
If you see Antigravity going in the wrong direction:
```
"Actually, I want this in the sidebar, not the header"
```

#### **C. Add Requirements**
```
"This also needs to be accessible for screen readers"
```

### **Best Practices:**
- ✅ Be specific about what needs to change
- ✅ Reference specific files or components
- ✅ Mention if it's a critical requirement
- ❌ Don't overload with too many changes at once

---

## 3️⃣ **Using Agent Mentions (@mentions)**

### **Summon Specific Agents:**
Based on your `agent.yaml`, you can direct requests to specialists:

```
@DESIGNER can you create a design spec for a new dashboard widget?
```

```
@INSPECTOR please review this DESIGN_SPEC.md for feasibility
```

```
@BUILDER implement the changes in TECH_SPEC.md
```

```
@SUBA I need to add a new column to the log_clinical_records table
```

### **Why This Helps:**
- Routes work to the right specialist
- Agents stay in their lane (no scope creep)
- Follows Chain of Custody protocol

---

## 4️⃣ **Providing Context with File References**

### **Open Relevant Files First**
Before making a request, open the files you're talking about in your editor.

**Example:**
1. Open `ProtocolBuilder.tsx`
2. Put cursor on line 45 (the problematic code)
3. Request: "This validation isn't working correctly"

Antigravity sees:
- Which file you're looking at
- Where your cursor is
- The surrounding code context

### **Reference Files in Requests**
```
"In ProtocolBuilder.tsx, the substance dropdown isn't 
loading data from ref_substances"
```

Much better than:
```
"The dropdown isn't working"
```

---

## 5️⃣ **Using the Chain of Custody Workflow**

### **For Complex Changes:**
Follow the protocol to prevent failures:

1. **Make Request:**
   ```
   "I want to add a patient risk calculator to the dashboard"
   ```

2. **Review PLAN.md:**
   - LEAD creates the plan
   - You review and approve

3. **Review DESIGN_SPEC.md:**
   - DESIGNER creates visual spec
   - You review and approve

4. **Review TECH_SPEC.md:**
   - INSPECTOR validates feasibility
   - You review and approve

5. **Test Implementation:**
   - BUILDER writes code
   - You test and accept

### **For Simple Changes:**
Use Emergency Workflow:
```
"@BUILDER please change the button label from 'Submit' to 'Save Protocol'"
```

---

## 6️⃣ **Describing Visual Issues**

### **Be Specific About Location:**

**❌ Vague:**
> "The colors are wrong"

**✅ Specific:**
> "In the Protocol Builder form, the error messages are using 
> red text on a red background, which I can't read because 
> I'm colorblind"

### **Use Screenshots:**
If you have a screenshot:
```
"I've uploaded a screenshot. The element I'm talking about 
is circled in the image."
```

### **Describe Behavior:**
```
"When I click the Save button, nothing happens. 
Expected: form should submit and show success message"
```

---

## 7️⃣ **Database Changes (Critical)**

### **Always Use This Pattern:**

1. **State the Goal:**
   ```
   "I need to track patient medication adherence. 
   We need a new table for this."
   ```

2. **Review db_plan.md:**
   - SUBA creates migration plan
   - INSPECTOR reviews for PHI/PII risks
   - You approve

3. **YOU Run Migration:**
   ```
   "I've reviewed the migration script. I'll run it now."
   ```
   Then run it manually in Supabase

4. **Verify:**
   ```
   "Migration complete. Please verify the schema."
   ```

### **Never:**
- ❌ Let agents auto-run database changes
- ❌ Skip the review process
- ❌ Use Supabase Table Editor for schema changes

---

## 8️⃣ **Asking for Clarification**

### **When Antigravity Asks Questions:**
Answer specifically:

**Antigravity:**
> "Should the error message appear above or below the form?"

**✅ Good Response:**
> "Above the form, right after the page title"

**❌ Vague Response:**
> "Wherever looks best"

### **When You're Unsure:**
Ask Antigravity to show you options:

```
"Show me 2-3 design options for the error message layout, 
then I'll choose"
```

---

## 9️⃣ **Leveraging Artifacts**

### **Request Artifacts for Review:**
```
"Create an implementation plan for this feature 
before writing any code"
```

### **Review Artifacts:**
Antigravity will create:
- `task.md` - Progress tracking
- `implementation_plan.md` - Detailed plan
- `walkthrough.md` - Completed work summary

You review and approve before work proceeds.

---

## 🔟 **Accessibility Considerations**

### **Always Mention Your Colorblindness:**
```
"I'm colorblind, so don't use color alone to convey status. 
Add icons or text labels."
```

### **Request Accessibility Checks:**
```
"@DESIGNER make sure this design is WCAG 2.1 compliant 
and works for colorblind users"
```

### **Use the Accessibility Checker Skill:**
```
"Run the accessibility-checker skill on the new dashboard"
```

---

## 📋 **Quick Reference: Optimal Request Patterns**

### **UI Changes:**
```
"Open localhost:5173 in the browser, navigate to the Protocol Builder, 
and click on the Substance dropdown. It's not loading data from 
ref_substances table. @INSPECTOR please diagnose."
```

### **New Feature:**
```
"I want to add a patient risk score calculator. 
@LEAD please create a PLAN.md for this feature."
```

### **Bug Fix:**
```
"In InteractionChecker.tsx line 45, the query is using is_active 
but the table has is_verified. @BUILDER please fix this."
```

### **Design Change:**
```
"@DESIGNER the error messages need better contrast for colorblind users. 
Create a DESIGN_SPEC.md with accessible color choices."
```

### **Database Change:**
```
"@SUBA I need to add a medication_adherence_score column to 
log_clinical_records. Create a db_plan.md with the migration script."
```

---

## 🎯 **Summary: The Optimal Workflow**

1. **Open relevant files** in your editor
2. **Use the browser** to show visual issues
3. **Be specific** about what you want
4. **Use @mentions** to direct work to the right agent
5. **Follow Chain of Custody** for complex changes
6. **Review artifacts** at each stage
7. **Mention accessibility** requirements upfront
8. **Test manually** before accepting
9. **Use comments** to provide additional context mid-task

---

**This approach prevents critical failures and ensures high-quality results.**
