---
id: WO-639
title: Admin Dashboard — Platform Health Improvements
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 097_BACKLOG
priority: P2
created: 2026-03-13
depends_on: WO-612
---

## Context

The Platform Health tab shows four raw counts with no context — no trends, no timestamp, no interactivity. Numbers without trend are difficult to interpret. "Total Clinics" is also a misleading label.

---

## Files to Modify

| File | Action |
|---|---|
| `src/pages/admin/AdminDashboard.tsx` | [MODIFY] PlatformHealth component only |

---

## Changes Required

### 1. Fix "Total Clinics" label

Rename to **"Active Sites"** — this is accurate because solo practitioners also create a `site_id`. "Clinics" implies a multi-practitioner institution.

### 2. Add "Last refreshed" timestamp + manual refresh button

```tsx
const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

// After data loads:
setLastRefreshed(new Date());

// In JSX, below the grid:
<div className="flex items-center justify-between mt-4 text-xs text-slate-600">
  <span>
    {lastRefreshed
      ? `Last refreshed ${relativeTime(lastRefreshed.toISOString())}`
      : 'Loading...'}
  </span>
  <button
    onClick={loadStats}
    className="flex items-center gap-1 hover:text-slate-400 transition-colors"
  >
    <RefreshCw className="w-3 h-3" /> Refresh
  </button>
</div>
```

### 3. Make tiles navigational

Clicking a tile should navigate to the relevant tab:

```tsx
// Map tile labels to tab IDs:
const tileNav: Record<string, TabId | null> = {
  'Total Users': 'users',
  'Total Sessions': null,   // no sessions tab yet
  'Active Sites': null,
  'New This Week': 'users',
};

// Add onClick to each tile div:
<div
  key={label}
  onClick={() => tileNav[label] && onTabChange(tileNav[label]!)}
  className={`... ${tileNav[label] ? 'cursor-pointer hover:border-indigo-500/30 hover:bg-slate-800/60' : ''}`}
>
```

This requires `PlatformHealth` to accept an `onTabChange` prop from `AdminDashboard`.

### 4. Add 7-day new user trend indicator

Extend the data fetch to also get the previous 7 days count for comparison:

```tsx
const { count: prevWeek } = await supabase
  .from('log_user_profiles')
  .select('*', { count: 'exact', head: true })
  .gt('created_at', new Date(Date.now() - 14 * 86400000).toISOString())
  .lt('created_at', new Date(Date.now() - 7 * 86400000).toISOString());

const trend = (newThisWeek ?? 0) - (prevWeek ?? 0);
```

Display as a small colored badge on the "New This Week" tile:
- `trend > 0` → up arrow, `text-emerald-400`
- `trend < 0` → down arrow, `text-red-400`
- `trend === 0` → flat, `text-slate-500`

---

## Acceptance Criteria

- [ ] "Total Clinics" renamed to "Active Sites" everywhere
- [ ] Last refreshed timestamp shown below tiles
- [ ] Manual refresh button reloads all four counts
- [ ] Total Users and New This Week tiles navigate to Users tab on click
- [ ] New This Week tile shows trend arrow vs. previous 7 days
- [ ] `npm run build` clean
