---
id: WO-410
status: 02_DESIGN
owner: DESIGNER
cue_verified: true
cue_note: "Ticket complete. Route to DESIGNER first (design brief), then BUILDER. No blockers."
priority: P1
failure_count: 0
created: 2026-02-24
parent_ticket: WO-408
sprint: Sprint 2
tags: [waitlist, new-page, designer, builder, supabase]
---

## LEAD ARCHITECTURE
- **Routing:** Route to 02_DESIGN for `owner: DESIGNER`.
- **Strategy:** DESIGNER to create a design brief matching the dark navy aesthetics of the current app. Once the design outline is complete, HANDOFF to BUILDER in 03_BUILD to implement the new `/waitlist` page. Reuse `academy_waitlist` table.

# WO-410: New `/waitlist` Page — PPN Portal Waitlist (Option A)

## User Prompt (verbatim)
"Set up an informative waitlist page so we can start collecting email addresses of interested users."

## Decision
Option A confirmed: a **new dedicated `/waitlist` page** — NOT a reuse of `/academy`. The Academy is a separate course product. The Portal waitlist is the core product. These must have separate pages with separate messaging.

## What This Page IS
A clean, conversion-focused waitlist page for the **PPN Research Portal** product (not the Academy). It exists to capture the email and practitioner type of every interested practitioner during the Demo Phase, before billing goes live.

## What This Page IS NOT
- Not a pricing page
- Not a signup/account creation page
- Not the Academy course waitlist (that is `/academy`)
- Not a demo page

## Data Storage
Uses the **existing** `academy_waitlist` table in Supabase. No new table needed.
The `source` column must be set to `'ppn_portal_main'` to distinguish from Academy signups.

## Page Sections (in order)

### 1. Hero (minimal — above the fold)
- **Headline:** "Join the Waitlist for PPN Research Portal"
- **Subheadline:** 2 sentences max. What PPN does. What founding access means.
- **No fabricated stats, no "X practitioners already joined" unless real data exists**
- **Primary action:** The waitlist form (or anchor link to it)

### 2. What You're Joining (3 short points — icon + text only)
Not a feature list. Frame as what founding practitioners get:
1. Priority access when the pilot opens (honest: "targeted for early spring 2026")
2. Founding practitioner pricing (locked rate, details communicated at pilot launch)
3. Direct input on the platform roadmap

### 3. The Waitlist Form
Fields:
- First name (text, required)
- Email address (email, required)
- Practitioner type (dropdown, required — reuse same options from Academy.tsx)
- Optional: "What's your biggest clinical documentation challenge?" (textarea, 280 char max, not required)
  - Label clearly: "Optional — helps us prioritize what to build"
  - This is marketing research data, not clinical data, not PHI

Submit states:
- Loading: "Submitting..."
- Success: See "Post-Submit State" section below
- Duplicate: "You're already on the list. We'll be in touch."
- Error: "Something went wrong. Email us at info@ppnportal.net"

### 4. Post-Submit State (No Dead Ends — per CEO direction)
After successful submission, replace the form with:
- ✅ Confirmation message: "You're on the list."
- **What happens next** (3 short bullets):
  1. You'll receive an email confirmation shortly
  2. We'll notify you when the pilot opens (targeted: early spring 2026)
  3. Founding practitioners get priority onboarding + direct access to our team
- **Next step CTA:** "Watch the 2-minute demo while you wait" → `/partner-demo`
  - This is the "no dead end" principle: always a next step

### 5. One reassurance line (footer of form card)
"No spam. No payments. Just early access when we're ready."

## Design Direction (for DESIGNER)
- Match the existing landing page visual system exactly (dark navy, same card styles, same typography)
- **Simple and minimal** — this is a form page, not a marketing page. Let the form breathe.
- No animations heavier than a fade-in
- Form card should feel premium but not busy
- Mobile-first layout: form should be the primary focus on all screen sizes
- **Emails will be beautiful and minimal (separate WO-412) — the page should set that expectation visually**

## Technical Requirements (for BUILDER)
- New file: `src/pages/Waitlist.tsx`
- New route in `src/App.tsx`: `<Route path="/waitlist" element={<Waitlist />} />`
- Import `supabase` from `../supabaseClient`
- Insert to `academy_waitlist` with `source: 'ppn_portal_main'`
- Handle `23505` (unique violation) as duplicate state
- Page title: `<title>Join the Waitlist — PPN Research Portal</title>`
- No auth required — this is a public page

## Acceptance Criteria
- [ ] `/waitlist` route resolves without login
- [ ] Form submits successfully to `academy_waitlist` with `source = 'ppn_portal_main'`
- [ ] Duplicate email shows "already on the list" state (not an error)
- [ ] Success state shows "what happens next" and a link to `/partner-demo`
- [ ] Zero fabricated counts or statistics on the page
- [ ] Mobile layout reviewed at 375px width
- [ ] Page title tag is set correctly
- [ ] INSPECTOR: fonts ≥ 12px throughout
