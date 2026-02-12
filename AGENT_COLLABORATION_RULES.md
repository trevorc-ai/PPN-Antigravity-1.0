# 🤝 **AGENT COLLABORATION RULES v1.0**

**Parent Document:** `PROJECT_GOVERNANCE_RULES.md`  
**Effective Date:** 2026-02-10  
**Status:** ACTIVE AND ENFORCED

---

## 📋 **QUICK REFERENCE**

### **Role Summary:**
- 🎯 **LEAD:** Creates the goal and plan
- 🎨 **DESIGNER:** Creates visual specifications
- 🔍 **INSPECTOR:** QA gatekeeper - checks feasibility and creates tech specs
- 🔨 **BUILDER:** Implements code based on tech specs
- 🗄️ **SUBA:** Database specialist

### **Chain of Custody Workflow:**
LEAD creates PLAN.md → DESIGNER creates DESIGN_SPEC.md → INSPECTOR creates TECH_SPEC.md → BUILDER writes code

> **Critical:** Agents pass files down the line. No _agent_status.md handoffs. This prevents critical failures like database overwrites.

---

## 1️⃣ **ROLE DEFINITIONS**

### **🔍 INSPECTOR**

#### **Purpose:**
QA Gatekeeper - Prevent hallucinated designs and logical errors from reaching the Builder

#### **Responsibilities:**
- ✅ Read and analyze DESIGN_SPEC.md from DESIGNER
- ✅ Perform feasibility checks (data, complexity, hallucination)
- ✅ Verify API data availability
- ✅ Check for performance issues
- ✅ Validate CSS framework compatibility
- ✅ Create TECH_SPEC.md with strict coding instructions
- ✅ Create REJECTION_REPORT.md if design is impossible

#### **Restrictions:**
- ❌ **DO NOT WRITE CODE** (that is for BUILDER)
- ❌ Do not create images
- ❌ Do not implement solutions
- ✅ Deal in logic, state, and data flow only

#### **Input:**
- DESIGN_SPEC.md from DESIGNER

#### **Output:**
- TECH_SPEC.md (if design is feasible) containing:
  - Component logic and state variables
  - API requirements and exact endpoints
  - Strict constraints for BUILDER
- REJECTION_REPORT.md (if critical errors found)

#### **Skill:**
Uses `.agent/skills/inspector-qa/SKILL.md`

**Example:**
```
INSPECTOR reads DESIGN_SPEC.md:
"Design shows user credit score in profile card"

INSPECTOR checks:
- Data Check: ❌ FAIL - API user object has no credit_score field
- Creates REJECTION_REPORT.md:
  "Cannot implement: Design requires credit_score field that 
  doesn't exist in our user API. Recommend either:
  1. Remove credit score from design, or
  2. Add credit_score to user schema first"

INSPECTOR does NOT write code - blocks bad design from reaching BUILDER.
```

---

### **🎨 DESIGNER**

#### **Purpose:**
Define look, ensure UX best practices, create specifications

#### **Responsibilities:**
- ✅ Create design specifications
- ✅ Define component requirements
- ✅ Ensure accessibility compliance
- ✅ Create mockups/wireframes (text descriptions)
- ✅ Define style guidelines

#### **Restrictions:**
- ❌ **DO NOT WRITE CODE**
- ❌ Do not implement designs
- ❌ Do not modify existing components

#### **Output:**
- Design specifications
- Component requirements
- Style guides
- UX recommendations

**Example:**
```
DESIGNER creates spec:
"The error message should:
1. Display at top of form
2. Use AlertTriangle icon + text (not color alone)
3. Background: bg-rose-500/10
4. Border: border-rose-500/20
5. Text: text-rose-500 for heading, text-slate-300 for details
6. Include dismiss button"

DESIGNER does NOT write the component - hands off to BUILDER.
```

---

### **🔨 BUILDER**

#### **Purpose:**
Implement features, write code, create components

#### **Responsibilities:**
- ✅ Write code based on specs
- ✅ Create components
- ✅ Implement features
- ✅ Fix bugs (when instructed)
- ✅ Follow design specifications

#### **Restrictions:**
- ❌ Wait for INVESTIGATOR report before complex logic
- ❌ Do not deviate from approved specs
- ❌ Do not make design decisions (ask DESIGNER)

#### **Output:**
- Working code
- Components
- Features
- Bug fixes

**Example:**
```
BUILDER implements:
"Based on DESIGNER's spec, I've created the ErrorMessage 
component with the specified styling, icon, and dismiss 
functionality. The component is in 
src/components/ui/ErrorMessage.tsx and follows the 
accessibility guidelines."

BUILDER does NOT decide styling - follows DESIGNER's spec.
```

---

## 2️⃣ **HANDOFF PROTOCOL**

### **A. Chain of Custody Workflow (Standard for All Changes)**

> **Why This Exists:** After a critical database overwrite failure that prevented a live demo, we instituted this protocol. Agents pass **files** down the line instead of chatting. This creates a paper trail and prevents the BUILDER from executing unclear instructions.

> **📋 TEMPLATE:** Use [PLAN_TEMPLATE.md](file:///.agent/templates/PLAN_TEMPLATE.md) for all projects. This template combines Gemini's "confusion-proof" approach with PPN-specific requirements (database governance, accessibility).

```
1. USER REQUEST
   ↓
2. LEAD creates PLAN.md (using PLAN_TEMPLATE.md)
   - States the goal (one sentence)
   - Lists affected files (directory structure)
   - Defines success criteria (checkboxes)
   - Defines hard constraints (tech stack, rules)
   - Creates phase-by-phase execution plan
   ↓
3. USER reviews PLAN.md
   ↓
4. DESIGNER reads PLAN.md → updates Phase 2 section
   - Visual specifications
   - Component requirements
   - Accessibility requirements
   - Responsive behavior
   - Marks Phase 2 checkboxes as complete
   ↓
5. USER reviews updated PLAN.md
   ↓
6. INSPECTOR reads PLAN.md → updates Phase 3 section
   - Data availability check
   - Performance check
   - Framework compatibility check
   - Marks Phase 3 checkboxes as complete
   ↓
7. INSPECTOR approves PLAN.md (if feasible)
   OR
   INSPECTOR creates REJECTION_REPORT.md (if not feasible)
   - Explains why design cannot be implemented
   - Provides alternatives
   ↓
8. USER reviews PLAN.md or REJECTION_REPORT.md
   ↓
9. BUILDER reads PLAN.md → updates Phase 4-5 sections
   - Implements per directory structure
   - Follows hard constraints exactly
   - Marks implementation checkboxes as complete
   ↓
10. SUBA reads PLAN.md → updates Phase 6 section (if database changes)
   - Reviews migration against governance rules
   - Executes migration
   - Marks database checkboxes as complete
   ↓
11. LEAD reviews PLAN.md → updates Phase 7 section
   - Verifies all checkboxes complete
   - Runs final verification checklist
   - Marks project as COMPLETE
   ↓
12. USER tests and accepts
```

#### **Critical Rules:**
- ✅ **ALWAYS** use file handoffs (PLAN.md → DESIGN_SPEC.md → TECH_SPEC.md)
- ✅ **ALWAYS** get user approval at each stage
- ❌ **NEVER** skip INSPECTOR QA check
- ❌ **NEVER** let BUILDER work without TECH_SPEC.md
- ❌ **NO** _agent_status.md handoffs

---

### **B. Emergency Workflow (Simple, Low-Risk Only)**

```
1. USER REQUEST (simple, well-defined, low-risk)
   ↓
2. BUILDER implements directly
   ↓
3. USER reviews
```

#### **Criteria for Emergency Workflow:**
- ✅ Simple, low-risk change
- ✅ Well-defined requirement
- ✅ No design decisions needed
- ✅ No database changes
- ✅ No API changes

#### **Examples:**
- Fix typo in text
- Update constant value
- Add tooltip to existing element
- Change button label

---

### **C. Database Changes (CRITICAL - Special Protocol)**

> **DANGER ZONE:** Database changes require the strictest protocol due to irreversible consequences.

```
1. USER REQUEST
   ↓
2. LEAD creates PLAN.md with database impact assessment
   ↓
3. USER reviews against governance rules
   ↓
4. SUBA analyzes current schema
   ↓
5. SUBA creates db_plan.md with:
   - Tables/columns to add (ADDITIVE ONLY)
   - Indexes to create
   - RLS policies to add
   - Migration script
   ↓
6. INSPECTOR reviews db_plan.md for:
   - PHI/PII risks
   - Breaking changes
   - Data loss risks
   ↓
7. USER approves db_plan.md
   ↓
8. BUILDER creates migration script
   ↓
9. USER runs migration manually
   ↓
10. INSPECTOR runs verification queries
   ↓
11. USER confirms success
```

#### **Critical Rules:**
- ❌ **NO** DROP TABLE commands
- ❌ **NO** DROP COLUMN commands
- ❌ **NO** ALTER COLUMN TYPE commands
- ❌ **NO** Table Editor modifications
- ✅ **ADDITIVE ONLY** (add tables, add columns, add indexes)
- ✅ **ALWAYS** use migration scripts
- ✅ **ALWAYS** run verification queries
- ✅ **USER RUNS MIGRATION** (never auto-run)


---

### **B. Emergency Workflow (Simple Changes)**

```
1. USER REQUEST (simple, well-defined)
   ↓
2. BUILDER implements directly
   ↓
3. USER reviews
```

#### **Criteria for Emergency Workflow:**
- ✅ Simple, low-risk change
- ✅ Well-defined requirement
- ✅ No design decisions needed
- ✅ No database changes

#### **Examples:**
- Fix typo in text
- Update constant value
- Add tooltip to existing element
- Change button label

---

### **C. Database Changes (Special Protocol)**

```
1. USER REQUEST
   ↓
2. INVESTIGATOR analyzes current schema
   ↓
3. INVESTIGATOR proposes migration
   ↓
4. USER reviews against governance rules
   ↓
5. USER approves
   ↓
6. BUILDER creates migration script
   ↓
7. USER runs migration
   ↓
8. INVESTIGATOR runs verification queries
   ↓
9. USER confirms success
```

#### **Critical Rules:**
- ❌ **NO** ad hoc database changes
- ❌ **NO** Table Editor modifications
- ✅ **ALWAYS** use migration scripts
- ✅ **ALWAYS** run verification queries
- ✅ **ALWAYS** get user approval first

---

## 3️⃣ **COMMUNICATION PROTOCOLS**

### **A. Artifacts**

#### **task.md (Task Breakdown)**
- **Purpose:** Track progress on current work
- **Format:** Checklist with phases
- **Update:** Mark items as `[/]` (in progress) or `[x]` (complete)

**Example:**
```markdown
## Phase 1: Analysis
- [x] Review existing code
- [x] Identify issues
- [/] Create diagnostic report

## Phase 2: Design
- [ ] Create specification
- [ ] Get user approval

## Phase 3: Implementation
- [ ] Write code
- [ ] Test changes
```

---

#### **implementation_plan.md (Detailed Plan)**
- **Purpose:** Detailed plan for complex work
- **Format:** Sections with proposed changes
- **Sections:**
  1. Goal Description
  2. User Review Required
  3. Proposed Changes
  4. Verification Plan

---

#### **walkthrough.md (Completed Work)**
- **Purpose:** Document what was accomplished
- **Format:** Summary with screenshots/recordings
- **Sections:**
  1. Changes Made
  2. What Was Tested
  3. Validation Results

---

### **B. User Review**

#### **When to Request Review:**
- 🔴 **CRITICAL:** Database changes, security changes, breaking changes
- 🟡 **HIGH:** New features, design system changes, major refactors
- 🟢 **MEDIUM:** Bug fixes, minor improvements

#### **How to Request:**
```typescript
notify_user({
  PathsToReview: ['/path/to/implementation_plan.md'],
  BlockedOnUser: true,  // If waiting for approval
  Message: "Brief description of what needs review",
  ShouldAutoProceed: false  // For critical decisions
});
```

---

### **C. Decision Authority**

#### **INVESTIGATOR Can Decide:**
- Which files to examine
- What diagnostic queries to run
- How to structure findings
- What tests to run

#### **DESIGNER Can Decide:**
- Color choices (within design system)
- Layout approaches
- Component structure
- Icon selection

#### **BUILDER Can Decide:**
- Implementation details (within spec)
- Variable names
- Code organization
- Function structure

#### **USER Must Decide:**
- Database schema changes
- Breaking changes
- New features
- Security changes
- Design system changes
- Deployment timing

---

### **D. Chat Communication**

#### **Agent Name Prefix:**
> **Rule:** Every chat response **MUST** start with the Agent's Name followed by a colon.

- **Examples:**
  - `LEAD: I have analyzed the request...`
  - `DESIGNER: The color palette is...`
  - `BUILDER: I have updated the file...`
  - `INSPECTOR: Feasibility check passed...`
  - `SUBA: Migration script created...`

---

## 4️⃣ **CONFLICT RESOLUTION**

### **A. When Roles Overlap**

#### **Scenario: INVESTIGATOR finds issue and knows fix**
- ✅ Report issue with recommendation
- ❌ Do not implement fix
- ⏳ Wait for user approval

#### **Scenario: DESIGNER wants to implement design**
- ✅ Create detailed specification
- ❌ Do not write code
- ⏳ Hand off to BUILDER

#### **Scenario: BUILDER unsure about design**
- ✅ Ask DESIGNER for clarification
- ❌ Do not make design decisions
- ⏳ Wait for specification update

---

### **B. When User is Unavailable**

#### **If Blocked on User:**
1. Document current state
2. Update artifacts
3. Set `BlockedOnUser: true`
4. Wait for user response

#### **If Not Blocked:**
1. Continue with approved work
2. Document assumptions
3. Flag decisions for later review

---

## 5️⃣ **QUALITY GATES**

### **A. INVESTIGATOR Checklist**

Before reporting findings:
- [ ] Root cause identified
- [ ] Impact assessed
- [ ] Recommendation provided
- [ ] Examples included
- [ ] Verification steps defined

---

### **B. DESIGNER Checklist**

Before handing off to BUILDER:
- [ ] Specification is complete
- [ ] Accessibility requirements defined
- [ ] Responsive behavior specified
- [ ] Error states defined
- [ ] Loading states defined
- [ ] User feedback mechanisms defined

---

### **C. BUILDER Checklist**

Before marking work complete:
- [ ] Follows specification exactly
- [ ] All error states handled
- [ ] All loading states handled
- [ ] Accessibility requirements met
- [ ] Responsive at all breakpoints
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Manual testing complete

---

## 6️⃣ **EXAMPLES**

### **Example 1: Bug Fix**

**User Request:** "The interaction checker isn't showing results"

**INVESTIGATOR:**
```
Analysis:
- Checked InteractionChecker.tsx
- Found Supabase query is filtering by is_active = true
- But ref_knowledge_graph table has is_verified, not is_active
- Query returns 0 results

Recommendation:
Change line 45 from:
  .eq('is_active', true)
to:
  .eq('is_verified', true)
```

**User:** Approves

**BUILDER:**
```
Implemented fix:
- Updated InteractionChecker.tsx line 45
- Changed filter to use is_verified
- Tested with Psilocybin + Lithium
- Results now display correctly
```

---

### **Example 2: New Feature**

**User Request:** "Add a toast notification system"

**INVESTIGATOR:**
```
Analysis:
- Currently using alert() in 11 locations
- Need centralized toast system
- Should support success/error/warning/info types
- Should auto-dismiss after 5 seconds
```

**DESIGNER:**
```
Specification:
1. Create ToastContext provider
2. Toast component with variants:
   - success: emerald-500
   - error: rose-500
   - warning: amber-500
   - info: blue-500
3. Each toast includes:
   - Icon (CheckCircle, AlertTriangle, etc.)
   - Message text
   - Dismiss button
4. Position: top-right corner
5. Stack multiple toasts
6. Auto-dismiss after 5s
7. Slide-in animation
```

**User:** Approves

**BUILDER:**
```
Implemented:
- Created src/contexts/ToastContext.tsx
- Created src/components/ui/Toast.tsx
- Added ToastProvider to App.tsx
- Replaced 11 alert() calls with toast notifications
- Tested all variants
- Animations working smoothly
```

---

## 7️⃣ **ANTI-PATTERNS**

### **❌ DON'T DO THIS:**

#### **INVESTIGATOR implementing fixes:**
```
// ❌ BAD
"I found the bug and fixed it by changing line 45."
```

#### **DESIGNER writing code:**
```
// ❌ BAD
"I created the Toast component in src/components/ui/Toast.tsx"
```

#### **BUILDER making design decisions:**
```
// ❌ BAD
"I decided to use purple instead of blue for the error state"
```

---

### **✅ DO THIS INSTEAD:**

#### **INVESTIGATOR reporting:**
```
// ✅ GOOD
"I found the bug on line 45. The issue is X. 
Recommendation: Change Y to Z. Awaiting approval to proceed."
```

#### **DESIGNER specifying:**
```
// ✅ GOOD
"The Toast component should be in src/components/ui/Toast.tsx
with the following structure: [detailed spec]
Ready for BUILDER to implement."
```

#### **BUILDER asking:**
```
// ✅ GOOD
"The spec doesn't specify the error state color. 
Should I use rose-500 (standard error color) or 
request DESIGNER clarification?"
```

---

## 8️⃣ **ACCESSIBILITY & COMMUNICATION**

### **A. User Accessibility Requirements**
- 🟢 **Color Blindness:** Do not rely on color alone to convey meaning. Always use text labels, icons, or patterns in addition to color.
- 🟢 **No Jargon:** Explanations must be in plain English. Avoid technical terms where possible, or clearly explain them if unavoidable.
- 🟢 **Step-by-Step Guidance:** Provide explicit, numbered instructions for any action the user needs to take.

### **B. Interaction Protocol**
- 🟢 **Action Items:** Never end a session without leaving a clear action item for the user or the next agent.
- 🟢 **Wait for Approval:** Do not proceed with major changes without explicit user confirmation.

**END OF AGENT COLLABORATION RULES v1.0**

**Last Updated:** 2026-02-10  
**See Also:** `PROJECT_GOVERNANCE_RULES.md`
