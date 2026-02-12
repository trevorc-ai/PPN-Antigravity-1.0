# 👤 USER ROLE IN CHAIN OF CUSTODY PROTOCOL

## Your Critical Role: Quality Gates & Final Authority

After the critical database overwrite incident that prevented your live demo, you are now the **gatekeeper at every stage**. Agents cannot proceed to the next step without your explicit approval.

---

## Your Workflow

### **Step 1: Make a Request**
You describe what you want in natural language.

**Example:**
> "I want to add a patient risk score calculator to the dashboard"

---

### **Step 2: Review PLAN.md (from LEAD)**
LEAD creates a high-level plan stating:
- The goal
- Files that will be affected
- Success criteria

**Your Job:**
- ✅ Does this align with your vision?
- ✅ Are the right files being touched?
- ✅ Are there any governance violations (PHI, breaking changes, etc.)?

**You Decide:**
- ✅ **APPROVE** → LEAD hands off to DESIGNER
- ❌ **REJECT** → Request changes to PLAN.md
- ⏸️ **CLARIFY** → Ask questions before approving

---

### **Step 3: Review DESIGN_SPEC.md (from DESIGNER)**
DESIGNER creates visual specifications:
- Component layout
- Colors, typography, spacing
- Accessibility requirements
- Responsive behavior

**Your Job:**
- ✅ Does this look good visually?
- ✅ Is it accessible (no color-only meaning)?
- ✅ Does it match your brand/design system?

**You Decide:**
- ✅ **APPROVE** → DESIGNER hands off to INSPECTOR
- ❌ **REJECT** → Request design changes
- ⏸️ **CLARIFY** → Ask for mockups or clarification

---

### **Step 4: Review TECH_SPEC.md or REJECTION_REPORT.md (from INSPECTOR)**
INSPECTOR performs QA checks and creates either:

**A) TECH_SPEC.md (if design is feasible)**
- Component logic and state variables
- API endpoints needed
- Strict implementation constraints for BUILDER

**B) REJECTION_REPORT.md (if design is NOT feasible)**
- Why the design cannot be implemented
- What data/APIs are missing
- Alternative approaches

**Your Job:**
- ✅ If TECH_SPEC.md: Does the technical approach make sense?
- ✅ If REJECTION_REPORT.md: Do you agree with the assessment?
- ✅ Are there any red flags (performance, security, complexity)?

**You Decide:**
- ✅ **APPROVE TECH_SPEC.md** → INSPECTOR hands off to BUILDER
- ✅ **ACCEPT REJECTION** → Go back to DESIGNER for alternative design
- ❌ **REJECT** → Request changes to technical approach
- ⏸️ **CLARIFY** → Ask technical questions

---

### **Step 5: Test Final Implementation (from BUILDER)**
BUILDER writes the code based on TECH_SPEC.md.

**Your Job:**
- ✅ Test the feature manually
- ✅ Verify it matches the approved design
- ✅ Check for bugs or unexpected behavior
- ✅ Verify no governance rules were violated

**You Decide:**
- ✅ **ACCEPT** → Feature is complete
- ❌ **REJECT** → Report bugs/issues, BUILDER fixes
- 🔄 **REQUEST CHANGES** → Minor tweaks needed

---

## Special Case: Database Changes

For database changes, you have **additional checkpoints**:

1. **Review PLAN.md** (from LEAD) - Database impact assessment
2. **Review db_plan.md** (from SUBA) - Migration script and schema changes
3. **Review INSPECTOR's QA report** - PHI/PII risks, breaking changes
4. **YOU RUN THE MIGRATION** - Never auto-run database changes
5. **Review verification queries** (from INSPECTOR) - Confirm success

---

## Your Authority

You have **final say** on:
- ✅ Database schema changes
- ✅ Breaking changes
- ✅ New features
- ✅ Security changes
- ✅ Design system changes
- ✅ Deployment timing
- ✅ When to use Emergency Workflow (skip some steps for simple changes)

---

## Emergency Workflow (When You Can Skip Steps)

For **simple, low-risk changes**, you can approve BUILDER to work directly:

**Criteria:**
- ✅ Simple, well-defined
- ✅ No design decisions
- ✅ No database changes
- ✅ No API changes

**Examples:**
- Fix a typo
- Update a constant value
- Add a tooltip
- Change a button label

**Workflow:**
```
YOU → BUILDER → YOU test
```

---

## How to Communicate Your Decisions

**Approve:**
> "Approved. Proceed to next step."

**Reject:**
> "Rejected. [Specific reason]. Please update [specific item]."

**Clarify:**
> "Before I approve, can you clarify [specific question]?"

**Emergency Override:**
> "This is simple enough. @BUILDER please implement directly."

---

## Summary: Your Role is the Safety Net

The Chain of Custody exists because **you are colorblind and need clear, structured handoffs**. You review at each stage to ensure:

1. **PLAN.md** - Right direction
2. **DESIGN_SPEC.md** - Accessible and beautiful
3. **TECH_SPEC.md** - Technically sound
4. **Final Code** - Works as expected

**You prevent critical failures by being the gatekeeper.**
