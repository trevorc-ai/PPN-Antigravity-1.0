---
description: Standing order — register every new internal HTML asset in the Admin Dashboard Site Navigator
---

# Admin Dashboard Link Policy (Standing Order)

## Trigger

This policy activates whenever **any** of the following is created or updated:

- A new digital packet placed in `public/internal/founding-docs/`
- A new outreach or demo HTML file placed in `public/internal/` or its subdirectories
- A new internal tool, leave-behind, or campaign asset placed in `public/internal/admin_uploads/`

## Mandatory Step (applies to every Build ticket that creates an internal HTML asset)

Before a Work Order or Growth Order is marked **complete**, the BUILDER must:

1. Open `src/pages/admin/AdminDashboard.tsx`
2. Locate the `SITE_MAP` constant
3. Add the new asset as an `externalLinks` entry in the correct group:
   - **Founding Partner Packets / Legal Docs** → `Legal & Data` group
   - **Demo pages, leave-behinds, invite flows** → `Outreach Assets (Internal)` group
   - **New category needed?** → Create a new group following the existing `{ group, icon, routes: [], externalLinks: [...] }` pattern
4. Each entry must include: `icon` (emoji), `label` (human-readable), `href` (root-relative path starting with `/internal/`)
5. Commit the `AdminDashboard.tsx` change in the same commit as the asset

## Example Entry

```ts
{ label: 'Denver Leave-Behind · PsyCon 2026', href: '/internal/admin_uploads/denver-2026/PPN_Leave_Behind_Print.html', icon: '🎯' },
```

## Groups Reference (current)

| Group | Icon | Contents |
|---|---|---|
| Legal & Data | 📄 | HIPAA packet, Founding Partner Packets, privacy/terms pages |
| Outreach Assets (Internal) | 📤 | Demo pages, leave-behinds, invite flows, showcases |

## INSPECTOR Check

INSPECTOR must confirm the new link appears in the Site Navigator and opens the correct asset in a new tab before approving any Work Order that creates an internal HTML file.
