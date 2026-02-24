---
description: Perform a comprehensive accessibility audit of a UI component or page.
---

# Accessibility Checker Workflow

Run this workflow anytime you need to verify WCAG 2.1 compliance, check contrast ratios, validate ARIA labels, or ensure keyboard navigation works correctly. It is highly recommended to run this before submitting any front-end PR.

1. **Verify Minimum Font Sizes**
   - Ensure body text is at least `16px` (`1rem`).
   - Ensure labels and tooltips are at least `14px` (`0.875rem`).
   - Never use fonts `<12px`.

2. **Check Color Usage and Contrast Compliance**
   - Verify that NO actionable item relies solely on color to convey meaning. Add icons or text labels (e.g., `[!] Error` instead of just red text).
   - Evaluate the color palette for **Red-Green confusion** (Deuteranopia/Protanopia). Avoid placing red and green elements next to each other without distinct shapes or labels.
   - For data visualizations or charts, prefer "Safe Palettes" (e.g., Blue/Orange) instead of purely Red/Green.
   - Ensure text contrast ratios meet 4.5:1 (AA standard). Ideally aim for 7:1 (AAA).
   - Verify UI components have a contrast ratio of at least 3:1 against their backgrounds.

3. **Validate Keyboard Navigation**
   - Identify if all interactive elements (`button`, `a`, `input`, etc.) can be reached via `Tab`.
   - Ensure proper focus indicators exist: `focus:outline-none focus:ring-2 focus:ring-emerald-500`.

4. **Verify ARIA Attributes**
   - Check icon-only buttons for `aria-label` attributes.
   - Ensure dynamic or loading states use `role="status"` and `aria-live="polite"`.
   - Verify error banners have `role="alert"`.

5. **Generate an Accessibility Audit Report**
   - Use the checklist above to structure an markdown comment or file evaluating the component or page, noting [STATUS: PASS] or [STATUS: FAIL] for each section.
