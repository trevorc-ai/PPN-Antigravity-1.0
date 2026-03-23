---
id: WO-657
title: "Admin Dashboard + Internal Documents: 2-Click Sharing and Mobile UI/UX"
status: 00_INBOX
priority: P2
type: UI/UX
database_changes: none
authored_by: LEAD
owner: TREVOR
created: 2026-03-22
---

## Problem Statement

The Admin Dashboard (`/admin/dashboard`) and all internal HTML document templates (founding-partner-docs, HIPAA legal packet) currently require multiple clicks to perform common tasks such as sharing a link or sending a document. Neither the dashboard nor the document templates are optimized for mobile viewports. This creates friction for a solo founder operating across devices.

---

## Target Users

- **Trevor (admin):** Needs to share dashboards and documents in 1–2 clicks from any device, including phone
- **Future admins and authorized recipients:** Should be able to access internal documents on mobile without layout degradation

---

## Success Metrics

1. Every sharable item (dashboard tab, legal packet section, founding-partner-doc) can be shared via a single tap/click — either a "Copy Link" button or native OS share sheet
2. Admin Dashboard renders without horizontal scroll on viewports down to 375px width
3. Internal HTML document templates (founding-partner-docs, HIPAA packet) render readable on viewports down to 375px — sidebar collapses to bottom navigation or hamburger menu
4. All touch targets meet 44px minimum height on mobile

---

## Scope

### In Scope

**Admin Dashboard (`src/pages/admin/AdminDashboard.tsx`):**
- Add a "Share" / "Copy Link" button to each tab header that copies the direct deep-link URL (`?tab=feedback`, `?tab=users`, etc.) to clipboard — 1 tap
- Add a "Copy" icon on each feedback row, user row, and route entry in Site Navigator — 1 tap to copy ID or path
- Mobile layout audit: tab bar overflow, table horizontal scroll, filter chip wrapping
- Ensure all interactive elements have min-height 44px (already partially done — verify)

**HTML Document Templates (`public/internal/`):**
- `HIPAA-Packet/index.html`: Sidebar collapses to hamburger menu on mobile (< 768px). Bottom nav strip replaces sidebar on phone.
- `founding_partner_docs/Clinician-Packet/index.html` and `Researcher-Packet/`: Same hamburger/bottom-nav treatment
- All individual section HTML files: Padding and font sizes scale correctly on mobile. "Save as PDF" and "Copy Link" buttons already included in new templates — verify and backfill to founding-partner-docs if missing.

### Out of Scope

- Native app sharing (no mobile app)
- Push notifications
- Any schema or database changes

---

## Implementation Notes

**Copy Link pattern (JS, 1 line):**
```js
navigator.clipboard.writeText(window.location.href)
  .then(() => { btn.textContent = '✓ Copied!'; setTimeout(() => btn.textContent = '🔗 Copy Link', 2000); });
```

**Mobile sidebar pattern:**
- Screen < 768px: sidebar hidden, replaced with sticky bottom strip with section icons
- Hamburger button in topbar opens a slide-in overlay sidebar
- Existing section HTML files: no layout change needed, just padding/font scaling

---

## PRODDY Sign-Off Checklist

- [x] Problem Statement is under 100 words
- [x] Job-To-Be-Done is specific and measurable
- [x] Success Metrics contain measurable numbers (44px, 375px, 1–2 clicks)
- [x] Out of Scope is populated
- [x] Database changes field: `none`
- [x] No code, SQL, or schema written in the PRD body (implementation notes are optional reference only)
