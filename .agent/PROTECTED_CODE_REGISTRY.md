# ⚠️ PROTECTED CODE REGISTRY ⚠️
# READ THIS BEFORE MODIFYING ANY FILE LISTED BELOW

This registry documents code blocks that are **PERMANENTLY ENFORCED** by the USER.
These represent hard-won fixes that have been repeatedly lost/regressed.

**ALL AGENTS**: You are FORBIDDEN from removing, weakening, or overriding any item in this
registry. The INSPECTOR must verify this registry on EVERY QA pass.

---

## REGISTRY

### ENTRY 001 — Text Brightness Cap (CRITICAL — EYE STRAIN PROTECTION)
- **File:** `src/index.css`
- **Lines (approx):** The block starting with `⚠️ TEXT BRIGHTNESS ENFORCEMENT — DO NOT REMOVE ⚠️`
- **What it does:** Caps `.text-white` at `rgb(226 232 240)` (slate-200). Prevents blinding white text.
- **Original commit:** `e9de64e` (WO-067)
- **Accidentally deleted in:** `56e3348` (Wellness Journey UI polish — BUILDER didn't check)
- **Restored:** 2026-02-18
- **USER enforcement note:** *"The CSS was changed and now all the bright white fonts are coming back, causing eye strain."*
- **AGENTS: You MAY NOT remove or weaken this block. If any component needs white text for contrast, use `style={{ color: '#E2E8F0' }}` inline instead of fighting the global rule.**

---

### ENTRY 002 — Sidebar Font Sizes
- **File:** `src/components/Sidebar.tsx`
- **Requirement:** Nav labels must be `text-base` (16px) minimum. Section headers `text-sm` minimum.
- **Rationale:** USER flagged small sidebar fonts multiple times.
- **Last fixed:** 2026-02-18

---

### ENTRY 003 — Global Font Minimum (12px hard floor)
- **File:** `src/index.css`  
- **Lines (approx):** The block starting with `GLOBAL FONT SIZE ENFORCEMENT`
- **What it does:** Prevents any text from rendering below 12px. SVG/chart text: 11px exception only.
- **AGENTS: Do not remove or soften these rules.**

---

## INSPECTOR GATE REQUIREMENT

Before approving ANY ticket that touches `src/index.css`, INSPECTOR **MUST**:
1. `grep "TEXT BRIGHTNESS ENFORCEMENT" src/index.css` — must return a result
2. `grep "text-white" src/index.css` — must show the `!important` override
3. If either check fails → **AUTOMATIC FAIL**, send back to BUILDER.

---

## ROOT CAUSE ANALYSIS — Why Regressions Keep Happening

### Pattern Identified (2026-02-18)
The BUILDER commits changes to files like `index.css` as part of "UI polish" or "layout fixes"
tickets, **without verifying that PROTECTED blocks from prior commits are preserved.**

Git shows: `56e3348 feat: Wellness Journey Phase 1 UI polish` — this commit touched `index.css`
and silently removed the entire text-brightness enforcement section added by `e9de64e`.

### Prevention Protocol (EFFECTIVE IMMEDIATELY)

1. **BUILDER RULE**: Before committing any change to `src/index.css`, run:
   ```
   git diff HEAD src/index.css | grep -E "^-.*TEXT BRIGHTNESS|^-.*text-white"
   ```
   If this returns any results, STOP and restore the deleted lines before committing.

2. **INSPECTOR RULE**: Add the grep checks above to every QA pass for any ticket touching CSS.

3. **LEAD RULE**: When routing tickets to BUILDER that involve CSS, add this note:
   > "⚠️ Check PROTECTED_CODE_REGISTRY.md before modifying index.css"

4. **No "broad rewrites"**: Agents must NOT rewrite entire CSS files. Only additive changes allowed
   to index.css. If you need to change behavior, ADD a new rule — do not delete existing ones.
