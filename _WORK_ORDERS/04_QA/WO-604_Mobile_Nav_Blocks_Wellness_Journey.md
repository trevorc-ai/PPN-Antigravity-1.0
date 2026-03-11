# WO-604 — Mobile Companion: Bottom Nav Blocks Wellness Journey Buttons

**Status:** 01_TRIAGE
**Priority:** P2 — MEDIUM (feature in progress — may defer)
**Author:** INSPECTOR
**Date:** 2026-03-10
**Source:** QA Session 03-10, screenshots-companion-03-10 (4.17.18 PM, 4.27.57 PM)

---

## Problem

On the mobile Companion view, the bottom navigation bar (Search, Dashboard, Wellness, etc.) overlays and blocks interaction with:
- The bottom two rows of buttons in the Wellness Journey forms
- The "Export Report" dropdown menu

User annotation: "Mobile menu is hiding the bottom two rows of buttons... (we may need to postpone this feature.)"

## Options

1. **Fix (preferred):** Add `padding-bottom` to the Wellness Journey scrollable container equal to the height of the bottom nav bar, so content scrolls above it
2. **Defer:** Temporarily hide the bottom nav when the Wellness Journey is active (full-screen mode)
3. **Postpone:** The user suggests this feature may not be ready for initial launch

## Acceptance Criteria

- [ ] All Wellness Journey interactive elements are accessible on mobile without being blocked by the bottom nav
- [ ] OR: A decision is made to defer mobile Compass to a post-launch sprint and this is documented

## Accessibility Note

This also affects users on tablets in portrait mode. Any fix should be tested at both mobile (375px) and tablet (768px) widths.

---

## LEAD ARCHITECTURE

**Routed by:** LEAD
**Route date:** 2026-03-10
**Owner:** BUILDER
**Priority:** P2 — fix now, simple CSS

### Routing Decision:
**LEAD decision: Fix now, do not defer.** Option 1 is preferred: add `padding-bottom` to the Wellness Journey scrollable container equal to the mobile bottom nav height (typically 64-72px).

**Implementation:**
- Identify the scrollable container in the Companion/Wellness Journey view
- Add `padding-bottom: 80px` (safe value that clears the nav bar) to the container on mobile only (`@media (max-width: 768px)`)
- Test at 375px (mobile) and 768px (tablet portrait) as specified
- Export Report dropdown: ensure it also has enough bottom margin to remain visible above the nav bar

**Do NOT hide the bottom nav** — this would break navigation for users mid-journey.

