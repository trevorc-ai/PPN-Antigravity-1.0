---
id: WO-702
title: "Wire DataQualityPanel to admin dashboard route"
owner: BUILDER
status: 04_BUILD
priority: P2
created: 2026-03-26
origin: "WO-701 INSPECTOR hold — component built, mount location pending"
pillar_supported: "3 — QA and Governance"
audience: site_admin role only
files:
  - src/pages/Dashboard.tsx (or AdminDashboard if separate route)
  - src/components/admin/DataQualityPanel.tsx (existing — no changes needed)
---

## Context

`DataQualityPanel.tsx` and `useSiteDataQuality.ts` were built and cleared by INSPECTOR (WO-701).
The component is role-gated (`site_admin` / `admin` only) and is ready to render.
It was NOT mounted in WO-701 because the render location was not specified.

## Required Fix

Mount `DataQualityPanel` in ONE of the following locations (choose the cleanest fit):

**Option A — Inline in Dashboard.tsx** (preferred if no separate admin route exists)
- Import `DataQualityPanel` in `Dashboard.tsx`
- Render below the KPI cards section, gated by `user.role === 'site_admin'`
- Pass `practitionerId={user.id}` and `userRole={user.role}`

**Option B — Dedicated `/admin/data-quality` route** (preferred if AdminDashboard exists)
- Add route in `App.tsx` or router config
- Create a minimal page wrapper that renders `DataQualityPanel`
- Link from the admin sidebar or Settings

## Success Criteria
- `DataQualityPanel` is visible to `site_admin` users on the dashboard or a dedicated route
- Non-admin users cannot see it (role gate remains intact)
- No changes to `DataQualityPanel.tsx` or `useSiteDataQuality.ts` required

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact. Component already built and cleared. Wiring only.
Signed: INSPECTOR | Date: 2026-03-26
