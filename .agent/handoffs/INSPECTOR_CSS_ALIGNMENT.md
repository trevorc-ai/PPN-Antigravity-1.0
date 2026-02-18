# INSPECTOR HANDOFF: Component Library CSS Alignment

## Context
We have updated the Global CSS (`src/index.css`) with standardized utilities for glassmorphism, accessibility (focus rings), and font size enforcement. The Component Library and Forms Library need to be audited and updated to fully utilize these global classes instead of ad-hoc Tailwind utilities.

## Global CSS Standards (Reference `src/index.css`)
1.  **Glassmorphism Cards**: Use `.card-glass` class.
    *   *Replace:* `bg-slate-900/60 backdrop-blur-xl border border-slate-700/50` (and similar variations).
    *   *With:* `card-glass`.
2.  **Focus States**: Global CSS handles `:focus-visible` with a standard blue outline.
    *   *Action:* Remove manual Tailwind focus classes like `focus:ring-2`, `focus:ring-offset-2`, `focus:ring-primary`, `focus:outline-none` from Buttons, Inputs, and interactive elements.
3.  **Typography**:
    *   Global CSS enforces a set minimum font size (12px).
    *   *Action:* Remove any explicit super-small utility classes (e.g., `text-[10px]`, `text-[11px]`) to ensure code reflects the actual rendered reality.
    *   *Action:* Ensure text colors use the brighter standard (e.g., `text-slate-100/200` for primary content) where appropriate, as seen in the `RiskIndicators` update.

## Target Directories
1.  `src/components/ui/` (Buttons, Cards, Dropdowns, Tooltips)
2.  `src/components/forms/` (Inputs, DatePickers, Selectors)
3.  `src/components/common/` (Shared widgets)

## Status of Recent Work
*   **`src/components/risk/RiskIndicators.tsx`**: Updated to use `.card-glass` and brighter text colors.
*   **`src/components/ui/Button.tsx`**: Partially reverted manual font overrides. Needs verification to ensure all `focus:ring` classes are gone.

## Immediate Task for INSPECTOR
1.  **Audit** the files in the target directories.
2.  **Refactor** components to use `.card-glass` and remove manual focus rings.
3.  **Verify** that visual hierarchy remains intact (brighter text for readability).
4.  **Report** completion.
