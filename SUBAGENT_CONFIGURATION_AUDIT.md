# Subagent Configuration Audit

**Date:** 2026-02-11  
**Purpose:** Ensure all subagents have clear, actionable instructions and task files

---

## Summary

**Total Subagents:** 5 (DESIGNER, INSPECTOR, BUILDER, SUBA, CRAWL)  
**Task Files Found:** 4  
**Issues Identified:** 3

---

## 1. DESIGNER

**Model:** claude-4.5-sonnet  
**Tools:** browser, code_editor  
**Temperature:** 7 (high creativity)

### Current Instructions
✅ **Good:**
- Clear identity ("DESIGNER")
- Defined scope (UI/UX, /frontend, /components, /styles)
- 4-step workflow (Audit → Plan → Execute → Verify)
- Accessibility requirements (WCAG 2.1)

⚠️ **Issues:**
- Generic instructions, not project-specific
- No reference to existing design system
- No mention of PPN-specific requirements
- Workflow says "wait for approval" but doesn't specify how

### Task Files
✅ `DESIGNER_TASK_PROTOCOLBUILDER.md` (exists)  
✅ `DESIGNER_TASK_PROTOCOLBUILDER_PHASE1.md` (just created)

### Recommendation
✅ **FIXED** - Created specific Phase 1 task file with exact code examples

---

## 2. INSPECTOR

**Model:** claude-4.5-sonnet  
**Tools:** browser  
**Skills:** inspector-qa, browser  
**Temperature:** 0 (deterministic)

### Current Instructions
✅ **Good:**
- Clear identity ("INSPECTOR")
- Specific violations to flag (spaceship text, font inconsistencies, ad-hoc colors)
- References DESIGN_SYSTEM.md
- Clear reporting format (🔴 CRITICAL, 🟡 WARNING, 🟢 PASS)

✅ **Excellent:**
- Read-only role (won't break code)
- Focused on visual consistency only

### Task Files
❌ **MISSING** - No current task file

### Recommendation
⚠️ **CREATE:** `INSPECTOR_TASK_CURRENT.md` with specific audit targets

---

## 3. BUILDER

**Model:** claude-4.5-sonnet  
**Tools:** terminal, file_editor  
**Temperature:** 0 (deterministic)

### Current Instructions
⚠️ **Issues:**
- Description says "Python and Database logic" but this is a React/TypeScript project
- Hardcoded task: "Connect Supabase Auth to React Frontend" (outdated)
- Generic "Step-Back" analysis (good pattern, but needs project context)

### Task Files
✅ `BUILDER_TASK_LAUNCH_CRITICAL.md` (exists)  
✅ `BUILDER_TASK_SUMMARY.md` (exists)

### Recommendation
🔧 **UPDATE:** Instructions should reference React/TypeScript, not Python  
🔧 **UPDATE:** Remove hardcoded task variable

---

## 4. SUBA

**Model:** claude-4.5-sonnet  
**Tools:** terminal, file_editor  
**Temperature:** 0 (deterministic)

### Current Instructions
✅ **Good:**
- Clear identity ("SUBA, the Database Specialist")
- Strong safety rules (no DROP TABLE without permission)
- 4-step workflow (Model → Safety Check → Execute → Document)
- References 3NF normalization

⚠️ **Issues:**
- References PostgreSQL MCP (not configured)
- References /database folder (doesn't exist, we use /migrations)
- Says "Alembic, Prisma" but we use raw SQL migrations

### Task Files
❌ **MISSING** - No current task file

### Recommendation
🔧 **UPDATE:** Instructions should reference Supabase, /migrations folder, raw SQL  
⚠️ **CREATE:** `SUBA_TASK_CURRENT.md` if database work is needed

---

## 5. CRAWL

**Model:** claude-3-5-sonnet (older model)  
**Tools:** browser  
**Skills:** accessibility-checker, browser  
**Temperature:** 0 (deterministic)

### Current Instructions
✅ **Good:**
- Clear identity ("CRAWL")
- Read-only role (safe)
- Systematic traversal methodology
- Specific focus on tooltips (AdvancedTooltip component)
- Clear reporting format with timestamps

✅ **Excellent:**
- Generates separate reports per pass (doesn't overwrite)
- Flags native HTML tooltips as failures

### Task Files
❌ **MISSING** - No current task file

### Recommendation
✅ **GOOD AS-IS** - Instructions are clear and project-specific  
⚠️ **OPTIONAL:** Create `CRAWL_TASK_CURRENT.md` if full site audit is needed

---

## Issues Summary

### Critical Issues
1. ❌ **BUILDER instructions reference Python** (should be React/TypeScript)
2. ❌ **SUBA instructions reference wrong folders** (/database vs /migrations)
3. ❌ **BUILDER has hardcoded outdated task**

### Missing Task Files
1. ❌ INSPECTOR_TASK_CURRENT.md
2. ❌ SUBA_TASK_CURRENT.md
3. ❌ CRAWL_TASK_CURRENT.md (optional)

### Recommendations

#### Immediate Actions
1. ✅ **DESIGNER** - Already fixed with Phase 1 task file
2. 🔧 **Update BUILDER instructions** - Remove Python references, update to React/TypeScript
3. 🔧 **Update SUBA instructions** - Reference Supabase, /migrations, raw SQL

#### Optional Actions
4. ⚠️ **Create INSPECTOR task** - If visual audit is needed
5. ⚠️ **Create SUBA task** - If database work is needed
6. ⚠️ **Create CRAWL task** - If full site QA is needed

---

## Proposed Fixes

### Fix 1: Update BUILDER Instructions

**Current:**
```yaml
description: \"Specialist in Python and Database logic.\"
VARIABLE: {current_task} = \"Connect Supabase Auth to React Frontend\"
```

**Proposed:**
```yaml
description: \"Specialist in React/TypeScript frontend development.\"
instructions: |
  You are the BUILDER. Your name is BUILDER.
  Always start your response with \"BUILDER: \".
  
  You are responsible for React/TypeScript frontend implementation.
  
  Before writing any code, perform a \"Step-Back\" analysis:
  1. Restate the goal.
  2. List the files that will be touched.
  3. Explain how you will prevent breaking the current build.
  4. Check for any existing task files in the root directory.
  
  Your \"Lane\" (Scope of Work):
  • Files you own: /src (React components, hooks, utilities)
  • Files you must IGNORE: Database migrations, SQL files, backend logic
  
  Once you have completed the Step-Back analysis, generate the code blocks.
```

### Fix 2: Update SUBA Instructions

**Current:**
```yaml
Files you own: You have exclusive control over the /database folder, all .sql files, migration scripts (e.g., Alembic, Prisma, or raw SQL)
Use the PostgreSQL MCP (or your specific DB adapter)
```

**Proposed:**
```yaml
Files you own: You have exclusive control over the /migrations folder and all .sql files.
We use Supabase (PostgreSQL) with raw SQL migrations.

Your Workflow:
1. Model: Before writing code, create a migration_plan.md artifact.
2. Safety Check: Review against DATABASE_GOVERNANCE_RULES.md
   - No DROP TABLE commands without explicit user permission
   - No DROP COLUMN or ALTER COLUMN TYPE (additive-only)
   - All table names must use snake_case
   - All new tables must have RLS enabled
3. Execute: Write the migration script in /migrations folder
4. Document: Update migration checklist and verify in Supabase
```

---

## Next Steps

1. ✅ **DESIGNER** - Task file created, ready to work
2. 🔧 **Update agent.yaml** - Fix BUILDER and SUBA instructions
3. ⚠️ **Create task files** - For INSPECTOR, SUBA, CRAWL if needed

---

**Status:** Audit complete, fixes identified  
**Priority:** Update BUILDER and SUBA instructions before next use
