---
id: WO-250
title: "Redirect /signup and /checkout to Academy Waitlist (Pre-Launch Gate)"
status: 00_INBOX
owner: PENDING
failure_count: 0
priority: P1
created: 2026-02-20T15:20:00-08:00
created_by: CUE
tags: [routing, waitlist, pre-launch, signup, checkout, academy]
ref_tables_affected: log_academy_waitlist (existing)
user_prompt: |
  "now that we've done the demo and disabled new sign ups, we should probably
  redirect people to a waitlist (instead of the checkout) until we're ready
  to launch."
---

## CONTEXT

PPN Portal is currently in demo / pre-launch mode. New sign-ups have been
disabled. However, the `/signup` and `/checkout` routes still serve their
original pages, which means any visitor who finds those URLs (via a CTA button,
a shared link, or direct navigation) gets a broken or confusing experience.

The fix: redirect both routes to `/academy` (the existing waitlist page,
backed by `log_academy_waitlist` table from migration 060) until the USER
manually re-enables open sign-ups.

---

## SCOPE

### What to redirect

| Route | Current behavior | New behavior |
|---|---|---|
| `/signup` | Renders `<SignUp />` (disabled form) | → Redirect to `/academy` |
| `/checkout` | Renders `<Checkout />` | → Redirect to `/academy` |

### What NOT to touch

- The `/login` route stays as-is (existing users must still be able to log in)
- The `/academy` page stays as-is (this IS the waitlist destination)
- No changes to auth logic or Supabase config
- Do NOT delete the SignUp or Checkout pages — just suppress the routes

---

## LEAD ARCHITECTURE

Two options — LEAD to select one:

**Option A — React Router `<Navigate>` (recommended)**
Replace the route elements in `App.tsx`:
```tsx
// Before
<Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignUp />} />
<Route path="/checkout" element={<Checkout />} />

// After
<Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/academy" replace />} />
<Route path="/checkout" element={<Navigate to="/academy" replace />} />
```
Zero new components. One file change. Fully reversible — swap back when launch is ready.

**Option B — Feature flag constant**
Add `const PRE_LAUNCH_MODE = true` to `src/constants/index.ts`.
Gate routes conditionally. More surgical but adds indirection.

**Recommendation:** Option A. Simplest, most reversible, no ambiguity.

---

## CTA AUDIT — Landing Page

Any "Get Started", "Sign Up", or "Subscribe" buttons on the Landing Page
that currently link to `/signup` or `/checkout` should also be updated to
link to `/academy`. BUILDER to grep and patch these simultaneously.

```bash
grep -rn '"/signup"\|"/checkout"\|href.*signup\|href.*checkout\|to="/signup"\|to="/checkout"' src/
```

---

## ACCEPTANCE CRITERIA

- [ ] Visiting `/signup` as a non-logged-in user lands on `/academy` (waitlist form visible)
- [ ] Visiting `/checkout` as any user lands on `/academy`
- [ ] Logged-in users visiting `/signup` still redirect to `/dashboard` (unchanged)
- [ ] No CTA button on Landing Page links to `/signup` or `/checkout`
- [ ] `SignUp.tsx` and `Checkout.tsx` files are NOT deleted (preserved for launch re-enable)
- [ ] INSPECTOR verifies: login route unaffected, existing user sessions unaffected

---

## REVERSAL PLAN (When Launch Is Ready)

Swap the two App.tsx lines back to their original elements. One-line change per route.
Optionally add a `PRE_LAUNCH_MODE` flag to make this toggle-able without a code deploy.

---

**Estimated effort:** 15 minutes. One file (`App.tsx`) + CTA link grep/patch.
**Blocks:** Nothing else is blocked by this. Safe to execute in parallel with P1 accessibility items.
