---
id: WO-684
title: "Audit and remove RevenueForensics — no billing data source exists"
owner: LEAD
status: 00_INBOX
priority: P2
created: 2026-03-24
origin: "Intelligence Gap Audit — Tier 2"
files:
  - src/components/analytics/RevenueForensics.tsx
---
## Problem
`RevenueForensics` renders a revenue analysis visualization. PPN has no billing, invoicing, or revenue data in the DB schema. Any values shown by this component are synthetic. Showing fabricated revenue data to practitioners is misleading and potentially harmful.

## LEAD Decision Required Before BUILD

Before BUILDER touches this, LEAD must determine one of:

**Option A: Replace with honest placeholder**
- Render a "Revenue Intelligence — coming in a future release" state with no synthetic numbers
- Keep the component shell for when real billing data exists

**Option B: Remove the component entirely from Analytics.tsx**
- Delete `RevenueForensics.tsx`
- Remove from `Analytics.tsx` render tree
- Note: this is the more honest choice if there is no billing integration planned pre-Denver

## LEAD Action: Review and amend this WO with the chosen option before routing to BUILDER.
