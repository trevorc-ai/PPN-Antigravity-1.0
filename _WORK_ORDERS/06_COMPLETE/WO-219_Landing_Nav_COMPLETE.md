---
id: WO-219
title: "Landing Page: Sign In Button Not Visible"
status: 03_BUILD
owner: BUILDER
priority: P0
severity: RELEASE_BLOCKER
created: 2026-02-19T08:40:30-08:00
failure_count: 0
---

## Bug Report

The landing page has no visible Sign In button. A new practitioner arriving at the site cannot find
the way to log in.

## Root Cause

The Sign In button exists in `src/pages/Landing.tsx` at line 148 but has two problems:

1. It is inside a div with `hidden md:flex` — invisible below 768px (mobile and tablet)
2. It is `absolute` positioned inside a `relative overflow-hidden` hero section, not a fixed nav bar.
   It scrolls away with the page.

## Fix

Replace the current ad-hoc nav approach with a proper sticky header bar at the top of the page.

Requirements:
- Fixed/sticky position, always on screen regardless of scroll position
- Visible at all screen sizes (no `hidden md:flex`)
- Contains: PPN Portal brand name (left) and Sign In button (right)
- Sign In button: clear, readable, obvious — not dark-on-dark
- Does NOT obscure page content (use padding or offset on the hero section)
- z-index high enough to stay above all hero content

## Acceptance Criteria

- [ ] Sign In button visible on desktop
- [ ] Sign In button visible on mobile (<=768px)
- [ ] Button is sticky — stays visible as user scrolls down the landing page
- [ ] Clicking it routes to /#/login
- [ ] No other content is obscured by the new nav bar

## Inspector Finding

Filed during walk-through audit, 2026-02-19.
