# WORKFLOW: Mobile-First Experience Audit
**Description:** Evaluates components for touch-targets, responsive overflow, and mobile performance.
**Trigger:** `/audit-mobile`

## EXECUTION STEPS:
Scan the provided component specifically for mobile/tablet rendering constraints.

1. **Touch Targets:** Flag any clickable element (button, link, menu item) smaller than `44px` by `44px` (`h-11 w-11` in Tailwind).
2. **Horizontal Overflow:** Scan for tables, wide charts, or data grids that will break the mobile viewport. Suggest `overflow-x-auto` wrappers or stacked-card mobile layouts.
3. **Bottom Navigation:** Ensure primary actions are reachable by a user's thumb at the bottom of the screen. 
4. **Font Scaling:** Verify that typography scales down gracefully without breaking the 14px minimum readability rule.

## REQUIRED OUTPUT:
Provide a "Mobile Friction Report" listing exactly which Tailwind utility classes need to be added (e.g., `md:flex-row flex-col`) to make the component seamless on an iPhone/iPad.