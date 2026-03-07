---
id: WO-549
title: "P0 — Full Auth & Login Pipeline Fix"
owner: LEAD
status: 00_INBOX
authored_by: INSPECTOR
priority: P0
date: 2026-03-05
caution: AUTH_CRITICAL — nobody can log in. Blocks ALL users. Fix before any other work.
files_touched:
  - src/supabaseClient.ts
  - src/contexts/AuthContext.tsx
  - src/pages/ResetPassword.tsx
  - src/pages/Login.tsx
no_schema_migration: true
---

# INSPECTOR Filing: WO-549 — Complete Auth & Login Pipeline Fix

> 🚨 **P0 BLOCKER — Nobody can log in. Stop all other work.**

---

## 1. Problem Statement

Auth is completely broken for all users — Trevor, Jason, and agents. Failure presents as: sign-in loops back to `/login`, invited users get no password-set prompt, or users are hard-redirected to `/reset-password` on every normal login.

---

## 2. Bug Inventory (Finalized 2026-03-05)

### BUG-549-01 | `supabaseClient.ts` — No Auth Options Configured

`createClient(url, anonKey)` is called with **no third argument**. Missing:
- `auth.detectSessionInUrl: true` — **CRITICAL**: without this, Supabase never parses `#access_token` from the URL hash. Every magic link, invite, and password recovery flow silently breaks.
- `auth.flowType: 'pkce'` — required for secure email flows
- `auth.persistSession: true` / `auth.storageKey: 'ppn_auth'`

### BUG-549-02 | `AuthContext.tsx` L13–109 — IIFE + Invite Redirect Fires on Normal Logins

A module-level IIFE reads `window.location.hash` to detect invite tokens. But PPN uses `HashRouter` — the hash is used for **routing** (`/#/login`), not for Supabase tokens. Race condition: HashRouter rewrites the hash before OR after the IIFE reads it.

Worse: `onAuthStateChange` (L80–109) redirects to `/reset-password` when `isInviteFlow` is true. Because `hashType` read from `#/login` or `#/dashboard` may or may not be null depending on timing, **normal logins may be redirected to `/reset-password` every session.**

### BUG-549-03 | `ResetPassword.tsx` L23 — `SIGNED_IN` Triggers Password Reset for All Logins

```tsx
// Line 23 — CURRENT (BUG):
if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
    setValidToken(true);
}
```
`SIGNED_IN` fires for **every login** — not just recovery flows. Any user redirected to `/reset-password` (even by mistake from BUG-549-02) will see the reset form as fully "valid" and be able to (or forced to) change their password.

### BUG-549-04 | `Login.tsx` L46–50 — `navigate(from)` Races with `window.location.replace()`

After `signInWithPassword` succeeds, `Login.tsx` calls `navigate(from)`. Simultaneously, `AuthContext.onAuthStateChange` fires `window.location.replace('#/reset-password')` (BUG-549-02). The hard `window.location.replace()` always wins — the user never reaches the dashboard.

### BUG-549-05 | WO-518B — Supabase Dashboard Redirect URLs Not Set (USER Action)
Email recovery/invite links cannot redirect back to the app without this. **5-minute manual configuration in the Supabase dashboard.** (See Section 6.)

---

## 3. Proposed Changes

### `src/supabaseClient.ts` — Add Auth Config

```typescript
// CURRENT:
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// FIX:
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        storageKey: 'ppn_auth',
    },
});
```

---

### `src/contexts/AuthContext.tsx` — Fix Invite/Recovery Detection

**Remove** the module-level IIFE (lines 13–29) entirely.

**Fix** the `onAuthStateChange` handler to only redirect for explicit auth events, never for `SIGNED_IN`:

```typescript
supabase.auth.onAuthStateChange((event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setUserRole((session?.user?.app_metadata?.role as UserRole) ?? null);
    setLoading(false);

    if (!session || typeof window === 'undefined') return;

    // PASSWORD_RECOVERY: Supabase emits this when a forgot-password link is clicked.
    // Redirect to the set-password form.
    if (event === 'PASSWORD_RECOVERY') {
        window.location.replace(
            window.location.origin + window.location.pathname + '#/reset-password'
        );
        return;
    }

    // Invite flow: user has never logged in before (no last_sign_in_at).
    // This only fires once — after first invite link click.
    if (event === 'SIGNED_IN' && !session.user?.last_sign_in_at) {
        window.location.replace(
            window.location.origin + window.location.pathname + '#/reset-password'
        );
        return;
    }

    // All other SIGNED_IN events are normal logins — do NOT redirect.
});
```

---

### `src/pages/ResetPassword.tsx` — Fix Token Validity Check

```typescript
// CURRENT (line 23):
if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {

// FIX:
if (event === 'PASSWORD_RECOVERY' || event === 'USER_UPDATED') {
```

This ensures only actual recovery sessions unlock the set-password form.

---

### `src/pages/Login.tsx` — Remove Competing Navigate Call

The `navigate(from)` call in `handleLogin` (lines 46–50) competes with AuthContext. After the AuthContext fix (above), normal `SIGNED_IN` events no longer trigger a redirect — so `navigate(from)` is the correct and sole navigation. No change needed here once AuthContext is fixed. **Verify only.**

---

## 4. Verification Plan

### Step 1: Local Smoke Test (Agent — Browser)
1. Start dev server: `npm run dev` (already running on port 3000)
2. Navigate to `http://localhost:3000/#/login`
3. Enter valid credentials → click Sign In
4. **Expected:** Lands on `/dashboard` within 2s. **No redirect to `/reset-password`.**
5. Refresh the page
6. **Expected:** Remains logged in (session persists). Stays on dashboard.

### Step 2: Logout → Re-Login
1. Click the user menu → Sign Out
2. **Expected:** Returns to `/` or `/login`
3. Log in again with same credentials
4. **Expected:** Lands on `/dashboard` — does NOT see the Reset Password form

### Step 3: Open Console (DevTools)
1. During login, open browser DevTools Console
2. Confirm: **no** `window.location.replace('#/reset-password')` calls during a normal login
3. Confirm: `[AuthContext]` log shows `SIGNED_IN` without triggering a redirect

### Step 4: Password Reset Flow (requires WO-518B to be complete first)
1. Click "Forgot Password" on login page
2. Enter a valid email → click "Send Reset Link"
3. Click the link in the email
4. **Expected:** Lands on `/reset-password` with a valid token, not the "Invalid Recovery Link" error

---

## 5. USER Action Required — WO-518B

> **This is a 5-minute manual step in the Supabase Dashboard.**
> Email link flows (invite, password reset) **cannot be end-to-end verified** until this is done.

1. Go to [supabase.com](https://supabase.com) → Your project → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://ppnportal.net`
3. Add to **Redirect URLs**:
   - `https://ppnportal.net/#/reset-password`
   - `http://localhost:3000/#/reset-password`
   - `http://localhost:3001/#/reset-password`
4. Click Save

---

## 6. Success Metrics

| # | Scenario | Expected Result |
|---|----------|----------------|
| 1 | Normal email+password login | → `/dashboard`. Zero redirect to `/reset-password`. |
| 2 | Page refresh while logged in | Stays logged in on dashboard. |
| 3 | Sign out → re-login | → `/dashboard`. Does NOT see reset form. |
| 4 | Invite link click (new user) | → `/reset-password` to set password only. |
| 5 | Forgot Password link click | → `/reset-password` and form accepts new password. |
| 6 | Use wrong password | Error shown inline. No crash or white screen. |

---

## INSPECTOR Sign-Off
- [x] All bugs traced to specific files and line numbers
- [x] No schema changes required
- [x] No RLS changes required  
- [x] Implementation is corrective only — no structural changes
- [x] USER action (WO-518B) documented as prerequisite for email-link testing
- [x] Success metrics are explicit and independently verifiable
