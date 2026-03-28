---
id: WO-704
title: "Admin Dashboard action buttons are hidden behind the mobile menu, making it unusable on mobile"
owner: LEAD
status: 04_BUILD
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
fast_track: true
origin: "User fast-track request"
admin_visibility: yes
admin_section: "Admin Dashboard"
parked_context: ""
pillar_supported: "QA/Governance"
task_type: "bug-fix"
files:
  - src/pages/admin/AdminDashboard.tsx
---

## Request
Admin Dashboard action buttons are hidden behind the mobile menu, making it unusable on mobile.

## LEAD Architecture
The Admin Dashboard (`AdminDashboard.tsx`) currently places primary action buttons in a header/nav zone that collapses into a hamburger menu on mobile viewports. These buttons must be surfaced outside the mobile menu — either as a sticky bottom action bar, inline within each row, or as always-visible CTAs above the filter chips — so the admin is fully operational on small screens without opening the menu. No layout changes to the mobile nav itself are required; only the admin-specific action zone needs restructuring.

**Pillar:** QA/Governance — Admin operational continuity is a governance requirement.

## Screenshot Evidence
User-provided screenshot confirms the hamburger menu is present (top-right) and action buttons are not visible in the main content area on mobile.

## Open Questions
- [ ] Which specific actions are "buried"? (e.g., Approve User, Resend Invite, Delete, Export) — BUILDER should audit `AdminDashboard.tsx` for all `<button>` elements currently inside the mobile-collapsed zone vs. the card/row body.
- [ ] Preferred pattern: (a) sticky bottom action bar per selected item, (b) inline actions exposed directly on each card row, or (c) both? Default to (b) inline-on-card as the fastest, zero-layout-risk fix.

---
- **Data from:** `AdminDashboard.tsx` — local component state / props from parent page
- **Data to:** No direct DB writes from this component — action buttons trigger handlers (Approve, Resend, Delete) via parent service calls
- **Theme:** Tailwind CSS, PPN design system — `AdminDashboard.tsx` responsive layout

## INSPECTOR 03_REVIEW CLEARANCE
**Reviewed by:** INSPECTOR
**Date:** 2026-03-27
**Verdict:** FAST-PASS — no database changes, files list defined, pillar confirmed.
**BUILDER start condition:** Cleared. WO-as-Plan exemption applies. Start coding immediately.

---

## INSPECTOR QA Hold -- 2026-03-27

**Reviewed by:** INSPECTOR | **Date:** 2026-03-27

**Situation:** `src/pages/admin/AdminDashboard.tsx` was committed in commit `611d533` alongside other WO work, so BUILDER did work on this file. However, NO BUILDER Walkthrough block was appended to this ticket before it was placed in `05_QA`.

**INSPECTOR cannot complete QA without BUILDER's walkthrough.** INSPECTOR needs to know:
1. Exactly which lines were changed in `AdminDashboard.tsx`
2. Which actions (Approve, Resend, Delete) were surfaced and how
3. The 5-check PPN UI Standards self-certification results

**Action Required:** BUILDER must append a walkthrough block to this ticket with exact diff summary and 5-check results, then re-surface to `05_QA`. INSPECTOR will complete QA at that time.

**Files to 5-check when walkthrough is present:** `src/pages/admin/AdminDashboard.tsx`

