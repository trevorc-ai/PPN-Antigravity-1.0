---
id: WO-653
title: "Wire AdminSharingLibrary into app nav and add Documents tab with leave-behind and PDF assets"
owner: BUILDER
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-21
fast_track: true
origin: "User fast-track — public materials not shareable from admin, especially mobile"
admin_visibility: yes
admin_section: "Admin"
parked_context: ""
files:
  - "src/App.tsx"
  - "src/pages/AdminSharingLibrary.tsx"
  - "src/components/layouts/Sidebar.tsx"
---

## Request
`AdminSharingLibrary.tsx` exists but is not wired into the app. It also only shows text invitation templates, not the actual public-facing documents. The user needs to share leave-behinds and PDFs directly from the admin — especially on mobile via the native share sheet.

## What Changes

### 1. `src/App.tsx`
- Import and add a lazy route for `AdminSharingLibrary` under the authenticated admin layout
- Route path: `/admin/sharing-library`

### 2. `src/components/layouts/Sidebar.tsx` (or admin nav equivalent)
- Add "Sharing Library" nav link under the Admin section
- Icon: `Share2` (already imported in the component)
- Label: "Sharing Library"
- Visible to: owner, admin, and trevor-email check (matches existing `isSuperAdmin` logic)

### 3. `src/pages/AdminSharingLibrary.tsx`
Add a second tab: **"Documents"** alongside the existing **"Templates"** tab.

The Documents tab contains shareable cards for:

| Document | File path | Audience |
|---|---|---|
| Clinic Director Portfolio | `/outreach/clinic-director/PPN_Digital_Portfolio.html` | Clinic Directors |
| Researcher Portfolio | `/outreach/researcher/PPN_Researcher_Portfolio.html` | Researchers / IRBs |
| PPN Data Policy | `/assets/trust/ppn-data-policy-light.pdf` | Compliance / Legal |

Each document card includes:
- Title and audience label
- One-line description of when to use it
- **Share button** using `navigator.share` (opens native share sheet on mobile)
  - `title`: document title
  - `url`: full URL to the file
- **Fallback** (desktop): copy the URL to clipboard (already coded in Templates tab — reuse exact same pattern)
- **Open** button: opens the file in a new tab (`ExternalLink` icon — already imported)

## Mobile Requirement
The `navigator.share` API already exists in this component and opens the iOS/Android native share sheet. No new mobile work required — just wire the document URLs into the same pattern.

## Success Criteria
- [ ] `/admin/sharing-library` is a valid route and reachable from the admin nav
- [ ] "Documents" tab is the default active tab when navigating to the page
- [ ] All 3 documents appear as cards with Share + Open buttons
- [ ] On mobile: tapping Share opens native share sheet with the document URL
- [ ] On desktop: tapping Share copies the URL, shows "Copied" confirmation
- [ ] "Templates" tab still works exactly as before (no regression)
- [ ] No TypeScript errors
- [ ] No em dashes in any new copy
