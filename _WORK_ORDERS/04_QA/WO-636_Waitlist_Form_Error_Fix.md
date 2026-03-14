---
id: WO-636
title: "Waitlist Form - Error Recovery, UI Standards Compliance, and Welcome Email Trigger"
owner: BUILDER
authored_by: LEAD
routed_by: LEAD
status: 04_QA
priority: P0
created: 2026-03-13
depends_on: "WO-634 (Resend SMTP config — welcome email requires delivery to work in production)"
skip_approved_by: ""
hold_reason: ""
held_at: ""
failure_count: 0
completed_at: "2026-03-13"
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
  - ".agent/skills/ppn-ui-standards/SKILL.md"
---

# WO-636 - Waitlist Form: Error Recovery, UI Standards Compliance, and Welcome Email Trigger

## Context

The waitlist signup form (`/waitlist` page + `WaitlistModal`) is the **primary conversion surface** for the PPN founding cohort. The user observed a failing submission state (see attached screenshots): the `log_waitlist` insert throws an unhandled error, the form retains the user's data after failure, and no welcome email is dispatched on success. Additionally, both files contain `text-xs` label classes that violate ppn-ui-standards Rule 2.

This is a P0 because it breaks the only public signup flow and risks losing inbound practitioners.

---

## Root Cause Analysis

### Bug 1 - Insert failure does not recover gracefully (`Waitlist.tsx` + `WaitlistModal.tsx`)

Screenshot 1 shows the `error` state banner firing with user data still populated in the form. The current `catch` block sets `status = 'error'` but does NOT clear the form or provide a retry path. The banner says "Please try again or email info@ppnportal.net" but the form fields remain locked in their filled state — the user cannot tell whether they should re-type or just click submit again.

Most likely root cause: the `log_waitlist` table has an RLS policy that blocks anonymous/unauthenticated inserts, OR the `source` column value `'ppn_portal_main'` does not match a CHECK constraint. BUILDER must inspect the Supabase dashboard error code returned in `sbError` and note it in `builder_notes`.

### Bug 2 - Welcome email never fires on success

`supabase/functions/send-waitlist-welcome/` exists and is deployed. Neither `Waitlist.tsx` nor `WaitlistModal.tsx` call it after a successful insert. Every founder who signs up is not receiving the branded confirmation email (`"You're in."` email designed in WO-411/WO-412).

### Bug 3 - `text-xs` labels violate ppn-ui-standards Rule 2

**Minimum font size is `text-sm` (14px). `text-xs` is strictly forbidden.**

Violations:
- `Waitlist.tsx` lines 245, 261, 277, 293: `className="block text-xs font-black ..."`
- `Waitlist.tsx` line 189: `className="text-xs font-black uppercase ..."`
- `WaitlistModal.tsx` lines 178, 191, 204, 217: `className="block text-[11px] font-black ..."` (11px — worse than text-xs)
- `Waitlist.tsx` line 333: `className="text-xs font-bold text-slate-600 ..."` (reassurance line)

---

## Acceptance Criteria

### AC-1 - Insert succeeds for new email
- [ ] Submit the form with a brand-new email. Row appears in `log_waitlist` in Supabase dashboard. `status` transitions to `'success'`.

### AC-2 - Duplicate email shows correct state
- [ ] Submit with an already-registered email. `status` transitions to `'duplicate'`. No error banner shown.

### AC-3 - Error state recovers cleanly
- [ ] If the insert fails for any reason other than duplicate, the `error` banner appears AND the form fields are still interactable (not disabled). The submit button shows "Try Again" instead of "Join the Waitlist". `status` resets to `'idle'` when the user starts typing in any field, clearing the error banner.

### AC-4 - Welcome email fires on success
- [ ] After a successful insert, `supabase.functions.invoke('send-waitlist-welcome', { body: { email, firstName, lastName } })` is called. Failure of the edge function call is caught silently (does NOT cause the UI to show an error — the insert already succeeded).

### AC-5 - No `text-xs` or sub-14px font sizes remain
- [ ] All label and reassurance text in both files uses `text-sm` minimum.
- [ ] Run: `grep -n "text-xs\|text-\[1[01]px\]" src/pages/Waitlist.tsx src/components/modals/WaitlistModal.tsx` — result must be empty.

### AC-6 - No regression on success/duplicate flows
- [ ] The `success` and `duplicate` UI states render correctly after the fix.

---

## Implementation Steps

### Step 1 - Diagnose the insert error (BUILDER must do this first)

Open the browser console on the `/waitlist` page. Attempt a submission with valid data. Capture the exact Supabase error (`sbError.code`, `sbError.message`). Log it in `builder_notes` before writing any fix.

Common causes:
- `42501` (insufficient privilege) = RLS policy blocks anon inserts. Fix: verify `log_waitlist` has `INSERT` policy for `anon` role in Supabase dashboard, or add one via migration.
- `23514` (check violation) = `source` value rejected. Fix: confirm allowed values for the `source` column.
- Network / CORS error = Supabase URL or anon key misconfigured in `supabaseClient.ts`.

**If the fix requires a migration (RLS policy change on `log_waitlist`), BUILDER must follow `/schema-change-policy` and `/migration-execution-protocol` before executing. File a sub-ticket if the migration is non-trivial.**

### Step 2 - Fix error state UX (`Waitlist.tsx` and `WaitlistModal.tsx`)

In the `catch` block (and in the `sbError` branch for non-duplicate errors), add:

```typescript
// After setting status to 'error', do NOT clear the form.
// Instead, let the user re-submit after correcting.
// Reset the error banner when the user begins typing.
```

In the `onChange` handlers for all four fields, add a single guard:
```typescript
onChange={(e) => {
  if (status === 'error') setStatus('idle');
  setForm(f => ({ ...f, firstName: e.target.value }));
}}
```

Change the submit button label when `status === 'error'`:
```tsx
{status === 'loading' ? (
  <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
) : status === 'error' ? (
  <>Try Again <ArrowRight className="w-4 h-4" /></>
) : (
  <>Join the Waitlist <ArrowRight className="w-4 h-4" /></>
)}
```

Apply the identical pattern to `WaitlistModal.tsx` (the modal uses the same status machine).

### Step 3 - Wire `send-waitlist-welcome` Edge Function (`Waitlist.tsx` and `WaitlistModal.tsx`)

In the success branch of `handleSubmit`, after confirming no `error` from the insert:

```typescript
// Fire and forget — do not await or let failure block the success state
supabase.functions
  .invoke('send-waitlist-welcome', {
    body: {
      email: form.email.trim().toLowerCase(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
    },
  })
  .catch((fnErr) => console.warn('[send-waitlist-welcome] invoke failed:', fnErr));

setStatus('success');
```

Apply the identical call in `WaitlistModal.tsx` `handleSubmit`.

### Step 4 - Fix `text-xs` violations (`Waitlist.tsx` and `WaitlistModal.tsx`)

Replace ALL occurrences of `text-xs` and `text-[11px]` in both files with `text-sm`.

Files and line targets:
- `Waitlist.tsx`: lines 132, 189, 245, 261, 277, 293, 333
- `WaitlistModal.tsx`: lines 88 (eyebrow span), 110, 178, 191, 204, 217

Do NOT alter any other class on those lines. Surgical change only.

---

## Do NOT Touch

- The `PRACTITIONER_TYPES` array — no changes to dropdown options
- The success or duplicate JSX panels (beyond the font fix)
- `supabaseClient.ts`
- Any file outside `Waitlist.tsx` and `WaitlistModal.tsx` unless a migration is required per Step 1

---

## INSPECTOR QA Checklist (Post-Implementation)

- [ ] `grep -rn "text-xs\|text-\[1[01]px\]" src/pages/Waitlist.tsx src/components/modals/WaitlistModal.tsx` returns empty
- [ ] Submit with new email: row in `log_waitlist`, success state shown, `send-waitlist-welcome` invoked (check browser Network tab for the function call)
- [ ] Submit with existing email: duplicate state shown (no error banner)
- [ ] Simulate error (temporarily break the Supabase key): error banner appears, form fields remain editable, typing clears the banner, "Try Again" label on button
- [ ] Zero TypeScript compilation errors: `npm run build` passes clean
- [ ] No regression on modal open/close scroll lock behavior
