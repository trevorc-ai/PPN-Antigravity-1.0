---
id: WO-640
title: Admin Dashboard — Resend Invite from Users Tab
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 097_BACKLOG
priority: P2
created: 2026-03-13
depends_on: WO-612, WO-637
---

## Context

When an invited user's link expires (or is not clicked), there is currently no way to resend the invite from the Admin Dashboard. The admin must open the VIP Invite Tool as a separate page. This WO adds a Resend Invite action to the Users tab for users who have not yet logged in.

---

## Files to Modify

| File | Action |
|---|---|
| `src/pages/admin/AdminDashboard.tsx` | [MODIFY] UserManagement component |

---

## Detecting "Uninitiated" Users

A user who has been invited but never logged in will have:
- A `log_user_profiles` row (created during the wizard OR no row at all if they never clicked the link)
- No `last_sign_in_at` on `auth.users` (not accessible directly from frontend without service role)

**Simpler heuristic:** Surface a "Resend" button for any user where `display_name` is null — this indicates the registration wizard was never completed.

---

## Changes Required

### 1. Add Resend button to Users table

In the Actions column, show Resend instead of Profile for incomplete users:

```tsx
<td className="px-4 py-3">
  {u.display_name ? (
    <a href={`#/clinician/${u.user_id}`} ...>Profile</a>
  ) : (
    <button
      onClick={() => handleResendInvite(u.email)}
      disabled={resendingId === u.user_id}
      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold min-h-[44px] transition-colors disabled:opacity-50"
    >
      {resendingId === u.user_id
        ? <><Loader2 className="w-3 h-3 animate-spin" /> Sending...</>
        : <><RefreshCw className="w-3 h-3" /> Resend Invite</>
      }
    </button>
  )}
</td>
```

### 2. `handleResendInvite` function

Call the existing `generate-invite` Edge Function:

```tsx
const [resendingId, setResendingId] = useState<string | null>(null);

const handleResendInvite = async (email: string | null) => {
  if (!email) return;
  const user = users.find(u => u.email === email);
  if (!user) return;
  setResendingId(user.user_id);
  try {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email,
        firstName: user.display_name?.split(' ')[0] ?? '',
        lastName: user.display_name?.split(' ').slice(1).join(' ') ?? '',
        persona: 'clinician',
      }),
    });
    if (!res.ok) throw new Error('Resend failed');
    addToast({ title: 'Invite Resent', message: `New invite sent to ${email}`, type: 'success' });
  } catch {
    addToast({ title: 'Resend Failed', message: 'Could not resend invite. Try the Invite Tool.', type: 'error' });
  } finally {
    setResendingId(null);
  }
};
```

---

## Acceptance Criteria

- [ ] Users without `display_name` show "Resend Invite" instead of Profile link
- [ ] Resend button shows spinner during request
- [ ] Success toast fires on successful resend
- [ ] Error toast fires if Edge Function returns non-200
- [ ] Users with display_name continue to show Profile link
- [ ] `npm run build` clean
