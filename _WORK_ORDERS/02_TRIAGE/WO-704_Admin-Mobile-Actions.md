---
id: WO-704
title: "Admin Dashboard action buttons are hidden behind the mobile menu, making it unusable on mobile"
owner: LEAD
status: 00_INBOX
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
