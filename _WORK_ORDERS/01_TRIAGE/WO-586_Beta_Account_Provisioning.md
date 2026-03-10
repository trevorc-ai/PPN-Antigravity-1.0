==== PRODDY ====
---
owner: TREVOR
status: 01_TRIAGE
authored_by: PRODDY
architected_by: LEAD
note: NO CODE REQUIRED — manual Supabase dashboard process
---

## LEAD Architecture Decisions

**Q1 — `inviteUserByEmail()` status:** Supabase magic link auth IS supported in the current auth config (Supabase project is live with email auth enabled). However, `inviteUserByEmail()` is an **admin API call** requiring the service role key — this must be run from the Supabase Dashboard directly, NOT from client-side code. Trevor executes this manually.

**Q2 — Beta role flag:** Use existing `partner` role from `ref_user_roles` for all 10 invitees. The `AuthContext` already reads `app_metadata.role` — LEAD will instruct Trevor to set role to `partner` in Supabase Dashboard when creating each account. No schema changes required.

**Q3 — Who generates links:** **Trevor via Supabase Dashboard.** Process: Authentication → Users → Invite User → enter email → Supabase sends magic link email. Trevor also sets `app_metadata: { role: 'partner' }` on each account after creation. LEAD will provide a step-by-step checklist below.

**Q4 — Beta access gate:** NOT required for V1. The 10 invitees are individually provisioned accounts. There is no guessable public URL — the magic link token is cryptographically unique and single-use.

### Trevor's Provisioning Checklist (10 steps, one per invitee)

For each invitee:
- [ ] Supabase Dashboard → Authentication → Users → **Invite User**
- [ ] Enter invitee email address
- [ ] After account created: click user → Edit → `app_metadata` → add `{ "role": "partner" }`
- [ ] Copy the magic link from the invite email (Supabase sends it to Trevor's configured email or the invitee directly)
- [ ] Paste link into WO-587 VIP Invite Tool card → Share
- [ ] Log invitee name, email, role segment, and send date in the table below

| # | Name | Email | Segment | Link Sent | Link Expiry | Status |
|---|---|---|---|---|---|---|
| 1 | | | Partner | | 72h | ⏳ |
| 2 | | | Partner | | 72h | ⏳ |
| 3 | | | Partner | | 72h | ⏳ |
| 4 | | | Advisor | | 72h | ⏳ |
| 5 | | | Advisor | | 72h | ⏳ |
| 6 | | | Advisor | | 72h | ⏳ |
| 7 | | | Clinician | | 72h | ⏳ |
| 8 | | | Clinician | | 72h | ⏳ |
| 9 | | | Clinician | | 72h | ⏳ |
| 10 | | | Clinician | | 72h | ⏳ |

---

## PRODDY PRD

> **Work Order:** WO-586 — Beta Account Provisioning & Magic Link Entry  
> **Authored by:** PRODDY  
> **Date:** 2026-03-09  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

Ten beta invitees across three audience segments (partners, advisors, clinicians) need to access the PPN Portal without creating passwords or navigating a standard onboarding flow. Currently, the platform has no mechanism for sending pre-authenticated entry links. Directing high-value invitees through a generic sign-up flow introduces friction, risks confusion, and signals a lack of polish — the opposite of the impression required for a first-round beta cohort.

---

### 2. Target User + Job-To-Be-Done

A beta invitee needs to click a single link in their invitation message and immediately land inside the PPN Portal, authenticated and oriented, so that zero technical setup is required before they experience the platform's value.

---

### 3. Success Metrics

1. All 10 beta invitees successfully authenticate and reach the analytics view via magic link within 60 seconds of clicking, with zero password-creation steps required.
2. Magic link tokens expire after 72 hours, verified by a failed link test after expiry with 100% reliability across 5 QA attempts.
3. Zero PHI is exposed in any URL parameter, token, or redirect path across all 10 provisioned accounts.

---

### 4. Feature Scope

#### ✅ In Scope

- Manual provisioning of 10 individual Supabase accounts (email-based, via Supabase admin invite or magic link API).
- Generation of a personalized magic link per invitee: one-time-use, expiring, routes to `/beta-welcome?name=[FirstName]` on activation.
- Each invitee gets their own account — no shared credentials.
- A simple internal provisioning checklist (non-automated) documenting each invitee's email, role segment, and link status.
- Token expiry: 72 hours from generation.

#### ❌ Out of Scope

- An automated self-serve invitation management UI or dashboard.
- Role-based permissions beyond basic authenticated access (all beta users see the same platform scope).
- Pre-seeded demo patient data per individual account (all see the network benchmark data which is globally available).
- Automated drip sequences or follow-up email tooling.

---

### 5. Priority Tier

**[X] P1** — High value, ship this sprint  

**Reason:** No magic link = no frictionless entry = the invitation strategy falls back to standard sign-up flow, which is a materially worse experience for this high-value cohort. This must ship concurrently with WO-585.

---

### 6. Open Questions for LEAD

1. Does Supabase magic link invite (via `supabase.auth.admin.inviteUserByEmail()`) already work in the current auth configuration, or does it require additional setup?
2. Should the provisioned beta accounts have a specific role flag in the `public.users` or `public.sites` table to distinguish them from future real practitioners?
3. Who generates and sends the magic links — LEAD via admin script, or Trevor manually via Supabase dashboard? (Recommend: Supabase dashboard for this scale.)
4. Should we implement a beta access gate (e.g., specific email domain or allowlist) to prevent unauthorized access via guessed URLs?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
