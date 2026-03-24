---
description: Unified omni-channel audit and optimization — replaces mobile-audit and optimize-mobile. Single-pass scan covering mobile, tablet, desktop, and print contexts.
---

# WORKFLOW: Omni-Channel Architect
**Description:** Single-pass audit and optimization for all four rendering contexts: mobile, tablet, desktop, and print. Supersedes `mobile-audit.md` and `optimize-mobile.md`.
**Trigger:** `/omni-channel-architect` | `/audit-mobile` | `/optimize-mobile`

---

## MANDATORY FIRST STEP

Read `.agent/skills/ppn-ui-standards/SKILL.md`:
- `<omni-channel-rules>` (Rule 0) — the 4-context matrix
- `<mobile-rules>` (Rule 8) — mobile-first construction order and pre-commit checks
- `<print-rules>` (Rule 5) — print: modifier mandate

---

## EXECUTION STEPS

You are the Lead Omni-Channel UX Architect for PPN Portal. Your job is to audit a component for all four rendering contexts in a **single pass** and output the minimal surgical fixes. DO NOT rewrite entire files. Provide targeted Tailwind/React upgrades.

### Step 1: Tablet Gap Scan

Check the `md:` breakpoint behavior:

- [ ] **Navigation:** Flag any bottom-sheet or mobile-only nav that persists at `md:`. Tablets must use top or side navigation.
- [ ] **Grid layout:** Flag any single-column layout that should switch to `md:grid-cols-2` at the tablet breakpoint.
- [ ] **Touch targets:** Verify 44px minimum (`min-h-[44px]`) is maintained at `md:`.
- [ ] **Font floor:** Verify `md:text-sm` is present wherever `text-xs` is used as the base class.

### Step 2: Mobile Touch Target & Overflow Audit (from `/audit-mobile`)

- [ ] **Touch targets:** Flag any clickable element (button, link, menu item) smaller than `44px` by `44px` (`h-11 w-11`).
- [ ] **Horizontal overflow:** Scan for tables, wide charts, or data grids that break the mobile viewport. Suggest `overflow-x-auto` wrappers or stacked-card mobile layouts.
- [ ] **Bottom navigation:** Ensure primary actions are reachable by a user's thumb at the bottom of the screen for mobile. Do NOT apply bottom-sheet nav to tablet breakpoints.
- [ ] **Font scaling:** Verify typography scales with `text-xs md:text-sm` — never bare `text-xs` on desktop.

### Step 3: Kinetic Transitions + Perceived Performance (from `/optimize-mobile`)

- [ ] **"Thumb Zone" architecture:** Flag top-screen primary actions or center-screen modals on mobile. Fix: Move primary actions to sticky bottom bar (`fixed bottom-0 w-full pb-safe`) for mobile. At `md:`, restore to standard in-page placement.
- [ ] **Kinetic transitions:** Flag any `hover:`, `active:`, or conditional states that snap instantly. Fix: `transition-all duration-300 ease-in-out` or `active:scale-95`.
- [ ] **Skeleton loaders:** Flag heavy data components (charts, lists) lacking a loading state. Fix: `animate-pulse bg-slate-800 rounded-xl`.
- [ ] **Spatial depth:** Flag dense `<table>` elements or flat backgrounds. Fix: Stack table rows into flex cards. Apply Glass Panel (`bg-slate-900/60 backdrop-blur-md`) to foreground elements.

### Step 4: Print & Dark Mode Override Check

- [ ] **Print: modifiers:** Flag any dark bg component (`bg-slate-950`, `bg-slate-900`, `bg-black`) that does NOT have a `print:bg-white` override in its `className`.
- [ ] **Text print override:** Flag any white or light text (`text-slate-50`, `text-slate-100`) without `print:text-slate-900`.
- [ ] **Nav hidden in print:** Verify nav elements have `print:hidden`.
- [ ] **Page break safety:** Verify card grids and tables have `print:break-inside-avoid`.

---

## REQUIRED OUTPUT FORMAT

**CRITICAL RULE:** If the user did not explicitly tag a file using the `@filename` syntax, STOP. Output: "ERROR: Target file not specified. Please retry and @ tag the exact file."

<thinking>
1. [Run all 4 steps above against the target file]
2. [Group findings by context: Tablet / Mobile / Kinetic / Print]
3. [Formulate the minimal surgical Tailwind/React replacement code]
4. [Verify NO em dashes are introduced and the text-sm desktop rule is preserved]
</thinking>

**📱 OMNI-CHANNEL AUDIT REPORT: `[Target File]`**
* **Status:** [Pass / Needs Refinement / Critical Failure]
* **Contexts failing:** [List: Mobile / Tablet / Desktop / Print — or "All pass"]

**🔴 Critical Violations:**
* [Group by context. Flag bare text-xs on desktop, missing print: overrides, tablet bottom-sheet nav, touch targets < 44px]

**🟡 Friction Points:**
* [Snap transitions, missing skeleton loaders, dense table layouts, empty states]

**✂️ HANDOFF SNIPPET FOR LEAD AGENT:**
*(User: Copy this block and give it to LEAD to generate the SURGICAL_PLAN.md)*

**Target File:** `[File Path]`
**Target Lines:** `[e.g., Lines 42-60]`
**Action:** `[Exact replacement code featuring responsive, kinetic, and print-safe Tailwind classes. Must match surrounding architecture.]`

==== OMNI-CHANNEL ARCHITECT ====
