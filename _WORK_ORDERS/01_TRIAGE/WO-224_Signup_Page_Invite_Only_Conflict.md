---
status: 01_TRIAGE
owner: PRODDY
failure_count: 0
priority: HIGH
created: 2026-02-19
---

# WO-224: Signup Page — Strategic Conflict with Invite-Only Model

## Problem
`/signup` is a publicly accessible page that allows anyone to create a practitioner account via email + password. This directly contradicts the "Invitation-only · Licensed practitioners" positioning.

**Current behavior:** User navigates to `/signup`, enters email + password → account created in Supabase.

**Brand promise:** "Invitation-only" gated access for verified, licensed practitioners.

## PRODDY Decision Needed
Choose one of the following strategies:

### Option A — Remove Public Signup (Recommended for invite-only)
- Remove or redirect `/signup` to a "Request Access" form
- All accounts created via admin invite only (magic link from Supabase dashboard)
- `/login` becomes the only auth entry point

### Option B — Gated Signup (Waitlist)
- Keep `/signup` but replace form with a waitlist/request form
- No immediate account creation — triggers email to admin for review
- Approved applicants receive magic link invite

### Option C — Keep Open Signup with Verification Gate
- Keep `/signup` but add post-signup "pending approval" state
- Account created but locked until admin approves the practitioner
- Users see "Your application is under review" on login

## Current File
`/src/pages/SignUp.tsx` — functional Supabase auth signup, 162 lines.

## Impact
- Currently live at `ppnportal.net/#/signup`
- "Don't have an account? Sign Up" link on Login page leads here
- Link in the Login page (`/src/pages/Login.tsx`) also needs to be updated per chosen strategy
