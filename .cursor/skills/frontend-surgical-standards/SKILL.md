---
name: frontend-surgical-standards
description: Strict Tailwind CSS and React constraints for UI modifications.
---

# FRONTEND SURGICAL STANDARDS

## 0. MANDATORY PRE-EDIT GATE (run BEFORE touching any file)

Answer these 4 questions before writing a single line of code:

1. **Is this file listed in the WO's `files:` frontmatter?** If NO → STOP. Flag to LEAD.
2. **Does the WO say "surgical only"?** If YES → you may only touch the specific function/prop named in the WO. No refactors.
3. **Am I touching more than 3 functions in one file?** If YES → this is no longer surgical. STOP and re-read the WO scope.
4. **Does this change require adding a new import not already in the file?** If YES → document why in a comment; it must be the minimum necessary import.

If you cannot answer all 4 questions with a clear "safe to proceed" answer: **STOP and ask LEAD.**

## 1. CSS & DESIGN ADHERENCE
* You must strictly adhere to the existing Tailwind CSS utility classes used in adjacent elements.
* Do not introduce new color palettes, spacing variables, or custom CSS classes unless explicitly commanded.
* NEVER use double scrollbars. Ensure parent containers manage overflow correctly (`overflow-hidden`).

## 2. ACCESSIBILITY ENFORCEMENT
* **Colorblind Rules:** You must verify that no status indicator, button, or alert relies solely on color. You MUST add an SVG icon or text label (e.g., `text-red-500` MUST be accompanied by an `AlertTriangle` icon or the word "Error").
* **Font Sizing:** Never apply a Tailwind text class smaller than `text-xs` (which maps to minimum 9pt).

## 3. SURGICAL EXECUTION
* Do not refactor HTML structures to "fit" Tailwind patterns better.
* Make minimal structural changes.
* If a file uses a specific component library (e.g., shadcn/ui or Headless UI), you must use those exact components. Do not build raw HTML replacements.