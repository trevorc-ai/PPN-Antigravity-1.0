# Session Handoff — March 12, 2026 @ 5:11 PM

---

## What Was Completed

| Item | Status |
|---|---|
| Last Name field added to invite tool (`vip-invite-flow.html`) | DONE |
| Edge Function (`generate-invite`) stores `invited_first_name` + `invited_last_name` | DONE + DEPLOYED |
| ResetPassword redirects to `/signup?invited=true` instead of `/search` | DONE |
| `SignUpGuard` in App.tsx — lets invited users through the wizard | DONE |
| SignUp.tsx — pre-populates name/email from metadata, auto-selects Solo route | DONE |
| Invite-code dead-end path removed | DONE |
| All public CTAs patched: `/signup` → `/waitlist` (ForClinicians, WorkflowChaosPage) | DONE |
| Login page centering fix (items-center + mx-auto) | DONE |
| OTP expired error renders human-readable message on login page | DONE |
| Admin Dashboard (WO-612) — route registered, component built | DONE |
| Admin Console nav link added to user dropdown (amber, admin-only) | DONE |
| `ppn-ui-standards` SKILL.md reformatted with tables | DONE |
| All changes committed and pushed | DONE — HEAD: `2f39d96` |

---

## 🔴 P1 OPEN BUG — Invite Link Expires Immediately

**Symptom:** An invite link shows "Invite link expired / otp\_expired" within seconds of being clicked — not a timing issue.

**Confirmed by:** Trevor pasted his own test link in under 10 seconds and got the error.

**Likely root cause:** The `generate-invite` Edge Function calls Supabase `inviteUserByEmail`. Supabase may be rejecting the token because:
- The same email was previously invited and the prior token invalidates the new one
- The `redirectTo` URL in the Edge Function doesn't match an allowed redirect URL in Supabase Auth settings

**File to inspect:** `supabase/functions/generate-invite/index.ts`

**First debug step:** Check Supabase Dashboard → Authentication → URL Configuration → confirm `ppnportal.net` is in the allowed redirect URLs list. Also check if re-inviting the same email invalidates prior tokens.

**Do NOT send Dr. Allen's invite until this is resolved.**

---

## Dr. Allen Setup (On Hold)

Trevor plans to send Dr. Allen a Clinician invite manually. Once he clicks the link and completes the wizard, run this to verify his site was created:

```sql
SELECT p.user_id, p.display_name, s.site_id, s.is_active
FROM log_user_profiles p
JOIN log_user_sites s ON s.user_id = p.user_id
WHERE p.email = 'jason@drallensemail.com';
```

If no rows returned, manually create his site — ask next agent to write the INSERT statements.

---

## Admin Dashboard Access (Trevor)

Trevor's `app_metadata.role` was updated to `"admin"` via Supabase SQL. After signing out and back in, he can access:

> `https://ppnportal.net/#/admin/dashboard`

Also accessible via the amber **Admin Console** item in the user dropdown menu (top-right avatar).

---

## Next Priorities

1. **URGENT — Fix the OTP/invite link bug** (P1 — blocks all new user onboarding)
2. **Test full registration flow end-to-end** once bug is resolved
3. **WO-635** — Waitlist Application Form (spec + build): structured intake with clinic info, feeds into beta selection
4. **Dr. Allen invite** — hold until invite bug is fixed
