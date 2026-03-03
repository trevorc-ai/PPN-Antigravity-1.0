---
name: frontend-surgical-standards
description: Strict Tailwind CSS and React constraints for UI modifications.
---

# FRONTEND SURGICAL STANDARDS

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