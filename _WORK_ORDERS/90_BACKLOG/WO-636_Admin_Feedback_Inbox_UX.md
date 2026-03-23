---
id: WO-636
title: Admin Dashboard — Feedback Inbox UX Hardening
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 097_BACKLOG
priority: P1
created: 2026-03-13
depends_on: WO-612 (AdminDashboard.tsx must exist)
---

## Context

The Feedback Inbox tab is functional but has several UX gaps that create friction for daily triage. As the volume of submissions grows, these gaps compound. This WO hardens the Feedback Inbox into a fast, efficient triage tool.

---

## Files to Modify

| File | Action |
|---|---|
| `src/pages/admin/AdminDashboard.tsx` | [MODIFY] All changes in this file only |

---

## Changes Required

### 1. Open count badge on "Feedback Inbox" tab label

In the `TABS` array and tab bar render, add a live count of `open` status items.

- Query occurs inside `FeedbackInbox` — lift the `rows` state or pass a callback up to `AdminDashboard` so the tab label can read the count
- Badge: a small red pill `bg-red-500/20 text-red-300 border border-red-500/30 rounded-full px-1.5 text-xs font-black`
- Show only when count > 0
- Example: `Feedback Inbox (3)`

### 2. Upgrade status cycle button

Replace the text underline link:
```tsx
// Current (too subtle):
<button className="ppn-meta text-slate-500 hover:text-indigo-300 ... underline">
  Mark as {NEXT_STATUS[row.status]}
</button>
```

Replace with a proper pill button matching the StatusBadge style:
```tsx
<button className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-700 text-slate-400 hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/10 text-xs font-bold transition-all min-h-[44px]">
  <RefreshCw className="w-3 h-3" /> Mark as {NEXT_STATUS[row.status]}
</button>
```

### 3. Make `page_url` a clickable link

```tsx
// Current:
<p className="ppn-meta text-slate-500 font-mono">{row.page_url}</p>

// Replace with:
<a
  href={row.page_url ?? '#'}
  target="_blank"
  rel="noopener noreferrer"
  className="ppn-meta text-slate-500 font-mono hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
>
  {row.page_url} <ExternalLink className="w-3 h-3" />
</a>
```

### 4. Differentiate empty states

```tsx
// Current: "No feedback found."
// Replace with conditional:
{rows.length === 0
  ? <p className="ppn-body text-slate-500">No feedback submitted yet.</p>
  : <p className="ppn-body text-slate-500">No {filter} feedback found.</p>
}
```

---

## Acceptance Criteria

- [ ] Open count badge appears on Feedback Inbox tab when open items exist
- [ ] Badge disappears when all items are resolved
- [ ] Status cycle uses pill button, not text underline
- [ ] `page_url` opens in new tab when clicked
- [ ] Empty state message distinguishes "no feedback ever" from "none matching filter"
- [ ] `npm run build` clean
