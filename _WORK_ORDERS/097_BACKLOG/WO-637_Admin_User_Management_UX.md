---
id: WO-637
title: Admin Dashboard — User Management UX Hardening
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 097_BACKLOG
priority: P1
created: 2026-03-13
depends_on: WO-612
---

## Context

The User Management tab saves silently — no confirmation when a role changes. Suspended users are visually identical to active users. The Profile link can 404. These gaps undermine trust in the tool for daily admin use.

---

## Files to Modify

| File | Action |
|---|---|
| `src/pages/admin/AdminDashboard.tsx` | [MODIFY] |

---

## Changes Required

### 1. Toast confirmation on role change

Import and use the existing `useToast` hook from `../../contexts/ToastContext`.

```tsx
// Add inside UserManagement component:
const { addToast } = useToast();

const handleRoleChange = async (userId: string, newRole: UserRole) => {
  // ... existing guard and update logic ...
  // After successful update, add:
  addToast({
    title: 'Role Updated',
    message: `User role changed to ${newRole}.`,
    type: 'success',
  });
};
```

### 2. Suspended user row highlight

```tsx
// Add conditional class to <tr>:
<tr
  key={u.user_id}
  className={`hover:bg-slate-800/20 transition-colors ${
    u.role === 'suspended' ? 'bg-amber-500/5 opacity-60' : ''
  }`}
>
```

Also add a `SUSPENDED` badge in the name cell:
```tsx
<div className="font-bold text-slate-300 flex items-center gap-2">
  {u.display_name ?? '—'}
  {u.role === 'suspended' && (
    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
      SUSPENDED
    </span>
  )}
</div>
```

### 3. Guard the Profile link

Replace the unconditional `<a href>` with a conditional check:

```tsx
// Check if user has any clinical records:
// Simple approach — check if display_name exists as proxy for profile completion
<td className="px-4 py-3">
  {u.display_name ? (
    <a
      href={`#/clinician/${u.user_id}`}
      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold min-h-[44px]"
    >
      Profile <ExternalLink className="w-3 h-3" />
    </a>
  ) : (
    <span className="text-xs text-slate-600 font-bold">No profile</span>
  )}
</td>
```

### 4. User count pill next to search

```tsx
<div className="flex items-center gap-3">
  <input ... />
  <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-400">
    {users.length} users
  </span>
</div>
```

---

## Acceptance Criteria

- [ ] Toast fires with user-readable message when any role is changed
- [ ] Suspended rows have amber tint + SUSPENDED badge
- [ ] Profile link hidden/replaced for users without display_name
- [ ] User count shows next to search box
- [ ] Self-demotion protection remains intact
- [ ] `npm run build` clean
