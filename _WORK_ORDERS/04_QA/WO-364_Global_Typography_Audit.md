---
status: 04_QA
owner: INSPECTOR
failure_count: 0
---
# WO-364: Global Typography Audit

## Context
The user is operating on dual 27-inch high-resolution monitors. The standard web default for utility classes like `text-sm` (14px) and `text-xs` (12px) is rendering uncomfortably small and causing readability strain.

## Objective
Audit the entire application for font-size utility classes and establish a new baseline typography standard that respects high-resolution displays.

## Guidelines
1. **The New Baseline:** The absolute minimum readable font size for body copy and general UI elements should be evaluated. `text-sm` (14px) is frequently used as the primary text size in many of our dashboards (especially data tables and dense cards).
2. **Identification:** Locate the primary components and standardized layout wrappers (like `index.css` global styles, or common `Card` components) that currently rely heavily on `text-sm` or `text-xs`.
3. **Execution Strategy:** Propose a global scaling solution. This might involve:
    * Updating the base font size in `index.css` (e.g., `html { font-size: 16px; }` if it was somehow overridden, or `text-base` for standard layout wrappers).
    * Modifying the Tailwind configuration to scale up the semantic boundaries of `text-sm`, `text-base`, `text-lg`.
    * Manually refactoring heavily trafficked pages (like `DosingSessionPhase.tsx`, `AnalyticsDashboard.tsx`) to shift `text-sm` -> `text-base`, `text-base` -> `text-lg`.

## Task
1. Inspect `src/index.css` and `tailwind.config.js`.
2. Inspect the most dense pages (e.g., Phase 3 integrations, analytics).
3. Draft a global typography modernization plan that prevents us from having to manually patch every single modal moving forward.
