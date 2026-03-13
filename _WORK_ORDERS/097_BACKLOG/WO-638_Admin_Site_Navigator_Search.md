---
id: WO-638
title: Admin Dashboard — Site Navigator Search + Smart Defaults
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 097_BACKLOG
priority: P1
created: 2026-03-13
depends_on: WO-612
---

## Context

The Site Navigator has 60+ routes across 13 collapsible groups with no search. Finding any route requires knowing which group it belongs to. This is the highest-friction tab in the Admin Dashboard for daily use.

---

## Files to Modify

| File | Action |
|---|---|
| `src/pages/admin/AdminDashboard.tsx` | [MODIFY] SiteNavigator component only |

---

## Changes Required

### 1. Add route-level search

Add a search state to `SiteNavigator` and filter `SITE_MAP` in real time:

```tsx
const SiteNavigator: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = SITE_MAP.map(group => ({
    ...group,
    routes: group.routes.filter(r =>
      !query || r.path.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(group => !query || group.routes.length > 0);

  return (
    <div className="space-y-3">
      {/* Search box */}
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search routes..."
        className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
      />
      {/* Route groups */}
      {filtered.map(...)}
    </div>
  );
};
```

### 2. Open high-priority groups by default

Change the following groups to `open` by default in the `<details>` element:
- `Admin Only` — always open
- `Core App` — open by default
- `Settings & Exports` — open by default

```tsx
// In the groups map:
<details
  key={group}
  open={['Admin Only', 'Core App', 'Settings & Exports'].includes(group)}
  className="..."
>
```

### 3. Add short route descriptions

Extend the `SITE_MAP` route entries with an optional `description` field:

```tsx
// Example entries:
{ path: '/search', description: 'Protocol & drug search' },
{ path: '/analytics', description: 'Session outcomes & benchmarks' },
{ path: '/wellness-journey', description: 'Arc of Care — live sessions' },
{ path: '/settings', description: 'Account & notification settings' },
{ path: '/admin/dashboard', description: 'This page' },
// ... add for all non-parameterized routes
```

Display inline next to the path in muted text:
```tsx
<code className="flex-1 text-xs text-slate-400 font-mono">{path}</code>
{description && (
  <span className="text-xs text-slate-600 hidden sm:inline">{description}</span>
)}
```

---

## Acceptance Criteria

- [ ] Search box filters routes across all groups as you type
- [ ] Groups with no matching routes are hidden during search
- [ ] Admin Only, Core App, and Settings groups open by default
- [ ] Route descriptions visible at sm+ breakpoints
- [ ] Clearing search restores all groups
- [ ] `npm run build` clean
