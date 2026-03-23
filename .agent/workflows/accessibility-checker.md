---
description: Perform a comprehensive accessibility audit of a UI component or page.
---

# Accessibility Checker Workflow

Run this workflow anytime you need to verify WCAG 2.1 compliance, check contrast ratios, validate ARIA labels, or ensure keyboard navigation works correctly. It is highly recommended to run this before submitting any front-end PR.

0. **Read PPN UI Standards Rule 6 First (mandatory)**
   - Read `/ppn-ui-standards` Rule 6 (Color Blindness — Explicit Protections) before running any check below.
   - Rule 6 is the authoritative source for PPN's WCAG AA requirements, banned color pairs, and phase palette. The steps below extend it, not replace it.

1. **Verify Minimum Font Sizes**
   - PPN minimum: body text must be at least `14px` (`text-sm`). On mobile, `12px` is the floor.
   - Labels and tooltips: at least `12px`. Never below.
   - `text-xs` (12px on desktop) is **banned** per ppn-ui-standards Rule 2. Flag any usage.
   - See `/ppn-ui-standards` Rule 2 for the authoritative reference.

2. **Check Color Usage and Contrast Compliance**
   - Verify that NO actionable item relies solely on color to convey meaning. Add icons or text labels (e.g., `<AlertTriangle /> Error` instead of just red text).
   - PPN banned color pairs (indistinguishable under common color blindness):
     - Red vs. Green — pair with `<AlertTriangle />` (error) and `<CheckCircle />` (success)
     - Teal vs. Purple — pair with shape or label text
     - Orange vs. Red — use different icons and labels
     - Light gray vs. White — minimum 3:1 contrast ratio required
   - PPN phase palette (only these are allowed for phase indicators):
     - Phase 1: Indigo `#7c6ff7` | Phase 2: Amber `#f59e0b` | Phase 3: Teal `#0d9488`
   - Ensure body text contrast ratios meet 4.5:1 (WCAG AA). Large text (18px+ or 14px bold): 3:1 minimum.
   - Verify UI components and icons have a contrast ratio of at least 3:1 against their backgrounds.
   - Run: `grep -n "text-gray-[1-4]00\|color: #[89a-f]" <file>` — any match must be verified at 4.5:1.

3. **Validate Keyboard Navigation**
   - Identify if all interactive elements (`button`, `a`, `input`, etc.) can be reached via `Tab`.
   - Ensure proper focus indicators exist: `focus:outline-none focus:ring-2 focus:ring-blue-500`.

4. **Verify ARIA Attributes**
   - Check icon-only buttons for `aria-label` attributes.
   - Ensure dynamic or loading states use `role="status"` and `aria-live="polite"`.
   - Verify error banners have `role="alert"`.

5. **Generate an Accessibility Audit Report**
   - Use the checklist above to structure a markdown comment or file evaluating the component or page, noting [STATUS: PASS] or [STATUS: FAIL] for each section.
