# Implementation Plan: [Project Name]

**Date:** YYYY-MM-DD  
**Lead:** [Agent Name]  
**Status:** [PLANNING | IN PROGRESS | BLOCKED | COMPLETE]

---

## 1. The Goal

**One Sentence Summary:**  
[e.g., Build a responsive treatment timeline visualization for the Patient Flow page.]

**Success Criteria:**
- [ ] [e.g., Timeline displays all treatment sessions chronologically]
- [ ] [e.g., PHQ-9 scores show improvement/worsening with visual indicators]
- [ ] [e.g., Component is accessible (keyboard nav, screen reader compatible)]

---

## 2. Architecture & Tech Stack (Hard Constraints)

**Frontend:**
- Framework: React 18+ with TypeScript
- Styling: Tailwind CSS (no CSS modules)
- Charts: Recharts (if data visualization needed)
- Icons: Material Symbols Outlined

**Backend:**
- Database: Supabase PostgreSQL
- Auth: Supabase Auth + RLS

**Key Rules:**
- ❌ **FORBIDDEN:** Free-text inputs, PHI/PII collection, color-only status indicators
- ✅ **REQUIRED:** All data stored as IDs referencing `ref_*` tables
- ✅ **REQUIRED:** Minimum 11px font size everywhere
- ✅ **REQUIRED:** Mobile-first responsive design

---

## 3. Directory Structure (The Map)

*Agents must follow this structure exactly. Do not create files outside this structure.*

```
src/
├── components/
│   ├── [feature-name]/
│   │   ├── ComponentName.tsx       ← New component here
│   │   └── ComponentNameHelper.ts  ← Helper functions here
│   └── ui/
│       └── [reusable-ui].tsx       ← Shared UI components
├── pages/
│   └── [PageName].tsx              ← Route-level pages
├── hooks/
│   └── use[HookName].ts            ← Custom hooks
└── types.ts                         ← Type definitions
```

**Files to Create:**
- [ ] `src/components/[feature]/[Component].tsx`
- [ ] `src/types.ts` (update with new interfaces)
- [ ] `src/pages/[Page].tsx` (if new page)

**Files to Modify:**
- [ ] `src/App.tsx` (if adding new route)
- [ ] `src/components/layouts/Sidebar.tsx` (if adding nav link)

---

## 4. Database Changes (If Applicable)

**Tables Affected:**  
[e.g., `log_clinical_records`, `ref_substances`]

**Migration Required:** [YES / NO]

**If YES, complete this section:**

**New Tables:**
- [ ] `table_name` - Description

**New Columns:**
- [ ] `table_name.column_name` (data_type) - Description

**New Indexes:**
- [ ] `idx_table_column` on `table_name(column_name)`

**RLS Policies:**
- [ ] Policy name: `policy_description`

**Migration File:**
- [ ] `migrations/XXX_descriptive_name.sql` created
- [ ] Migration reviewed against governance rules (no DROP, additive-only)
- [ ] Verification queries included in migration

**Verification Queries:**
```sql
-- Query to verify changes worked
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'table_name';
```

---

## 5. Step-by-Step Execution Plan (The Handoff)

*Mark steps as [x] when complete. Do not skip steps.*

### **Phase 1: Planning** (Assigned to: LEAD)
- [ ] Create this PLAN.md file
- [ ] Define success criteria
- [ ] Identify affected files
- [ ] Get user approval on plan

**Handoff to:** DESIGNER

---

### **Phase 2: Design Specification** (Assigned to: DESIGNER)
- [ ] Create visual mockup (text description or image)
- [ ] Define component structure
- [ ] Specify color palette and typography
- [ ] Define responsive breakpoints
- [ ] Document accessibility requirements
- [ ] **Verification:** Review mockup with user

**Handoff to:** INSPECTOR

---

### **Phase 3: Technical Review** (Assigned to: INSPECTOR)
- [ ] Review design for data availability
- [ ] Check for performance issues
- [ ] Validate against governance rules
- [ ] Identify technical blockers
- [ ] Create TECH_SPEC.md (if complex) OR approve PLAN.md
- [ ] **Verification:** All data sources confirmed available

**Handoff to:** BUILDER

---

### **Phase 4: Implementation** (Assigned to: BUILDER)
- [ ] Create component files per directory structure
- [ ] Implement UI per design spec
- [ ] Add TypeScript interfaces
- [ ] Implement data fetching (if applicable)
- [ ] Add error handling
- [ ] Add loading states
- [ ] **Verification:** Component renders without errors

---

### **Phase 5: Accessibility & Testing** (Assigned to: BUILDER)
- [ ] Add ARIA labels to interactive elements
- [ ] Implement keyboard navigation
- [ ] Test with screen reader
- [ ] Verify minimum 11px font size
- [ ] Test responsive design (375px, 768px, 1440px)
- [ ] Add color + icon + text for all status indicators
- [ ] **Verification:** Passes accessibility checklist

---

### **Phase 6: Database Migration** (Assigned to: SOOP, if applicable)
- [ ] Review migration file against governance rules
- [ ] Run migration in development environment
- [ ] Run verification queries
- [ ] Confirm RLS policies work
- [ ] **Verification:** All verification queries pass

---

### **Phase 7: Final Review** (Assigned to: LEAD)
- [ ] Code review completed
- [ ] All success criteria met
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] User acceptance testing
- [ ] **Verification:** Ready for deployment

---

## 6. Accessibility Requirements

**Colorblind-Friendly Design:**
- [ ] All status indicators use color + icon + text (not color alone)
- [ ] High contrast ratios (WCAG AA minimum)

**Keyboard Navigation:**
- [ ] All interactive elements are keyboard accessible
- [ ] Visible focus states on all focusable elements
- [ ] Logical tab order

**Screen Reader Support:**
- [ ] All images have alt text
- [ ] All icon-only buttons have aria-label
- [ ] Form inputs have aria-describedby for help text

**Typography:**
- [ ] Minimum 11px font size (including tooltips, legends)
- [ ] Consistent font families (Manrope for headings, Inter for body)

---

## 7. Known Blockers & Dependencies

**Blocked On:**
- [ ] [e.g., Waiting for user approval on design mockup]
- [ ] [e.g., Need API key for external service]

**Dependencies:**
- [ ] [e.g., Must complete Migration 010 before implementing this feature]
- [ ] [e.g., Requires AdvancedTooltip component to be created first]

**Risks:**
- [ ] [e.g., Large dataset may cause performance issues - need pagination]

---

## 8. Current Status & Handoff Notes

**Current Phase:** [Phase number and name]  
**Current Agent:** [Agent name]  
**Last Updated:** YYYY-MM-DD HH:MM

**Progress Summary:**
[e.g., Phase 1 complete. Design mockup approved by user. Ready for technical review.]

**Known Issues:**
[e.g., None / List any issues discovered]

**Next Steps:**
[e.g., INSPECTOR to review design spec and create TECH_SPEC.md]

---

## 9. Verification Checklist (Before Marking Complete)

**Code Quality:**
- [ ] No `console.log()` statements
- [ ] No commented-out code
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Formatting consistent (Prettier)

**Functionality:**
- [ ] All success criteria met
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Edge cases handled

**Testing:**
- [ ] Manual testing on Chrome, Firefox, Safari
- [ ] Mobile testing (375px width)
- [ ] Tablet testing (768px width)
- [ ] Desktop testing (1440px width)
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (VoiceOver/NVDA)

**Documentation:**
- [ ] Code comments added for complex logic
- [ ] README updated (if applicable)
- [ ] CHANGELOG updated (if applicable)

---

## 10. Rollback Plan (If Applicable)

**If Implementation Fails:**
1. [e.g., Revert commits: `git revert <commit-hash>`]
2. [e.g., Restore database from backup]
3. [e.g., Remove feature flag]

**Rollback Commands:**
```bash
# Example rollback commands
git revert HEAD~3..HEAD
npm run db:rollback
```

---

## 🔁 NEXT ACTIONS (MANDATORY — Complete Before Moving Ticket Forward)

> Do not leave this section blank. The pipeline must never stall.
> INSPECTOR will reject any ticket missing this section.

**Follow-on tickets to create immediately:**
- [ ] WO-[ID]: [Description] → `owner: [AGENT]` | `status: [QUEUE]`

**Tickets this work unblocks:**
- [ ] WO-[ID]: [Ticket name] — update frontmatter and move to correct queue

**This agent's next action:**
- [ ] Moving to next ticket: WO-[ID] — [Name]
- [ ] OR: Queue empty. Notifying LEAD.

---

**END OF PLAN**

**Status:** [READY FOR PHASE 2 / IN PROGRESS / COMPLETE]  
**Next Action:** [Explicit statement of what happens next and who does it]
