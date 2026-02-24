---
id: WO-408
status: 01_TRIAGE
owner: LEAD
priority: P1
failure_count: 0
created: 2026-02-24
sprint: Sprint 2
tags: [waitlist, cta, landing-page, email-automation, monetization, launch-phases]
user_prompt_verbatim: >
  "We currently have various CTAs that are pointing in different directions from the landing page.
  We anticipate moving quickly from demo to paid pilot users, and currently we have people eagerly
  awaiting the launch. We need to define the upcoming launch phases, set up an informative waitlist
  page so we can start collecting email addresses of interested users, determine an email automation
  strategy and method, and define & implement all of the necessary elements involved with going
  quickly from MVP to monetization. What are best practices here, what do we already have prepared,
  what still needs to be done, and how should we approach this?"
---

## PRODDY PRD

### 1. Problem Statement

The landing page at `/landing` has six distinct CTAs pointing to six different destinations — including a broken checkout flow (`/checkout` → Stripe, not yet live), a `/analytics` route that walls off unauthenticated visitors, and a mailto fallback for the Veterans section. There is no unified waitlist capture point on the landing page. Despite an existing `academy_waitlist` table in the database and a functioning waitlist form at `/academy`, **zero landing page CTAs route to it.** People eager to join are hitting dead ends. The gap between "people want in" and "we can capture and nurture them" is a direct revenue risk.

---

### 2. Target User + Job-To-Be-Done

A licensed practitioner or clinic operator who has heard about PPN Portal needs to express interest and receive timely, credibility-building follow-up so that they convert to a paid pilot user when billing goes live.

---

### 3. Success Metrics

1. **Waitlist captures ≥ 30 new email addresses within 14 days of the waitlist CTA going live** on the landing page (measured via `academy_waitlist` table row count delta).
2. **Zero broken CTA destinations on the landing page** — every button routes to a live page (verified in QA via manual click-through of all 6 CTAs within 24h of BUILDER handoff).
3. **Waitlist confirmation email delivered within 60 seconds of form submission** for 100% of submissions (measured via email provider delivery logs, once automation is wired).

---

### 4. Feature Scope

#### In Scope (what this ticket covers):

**Phase Definition (Strategic — PRODDY deliverable, this document):**
- Define 3 launch phases: Demo Phase (now), Paid Pilot Phase, and General Availability — with clear entry criteria and CTA language for each

**CTA Consolidation (BUILDER + DESIGNER):**
- Replace "Start Free Trial" button in hero with "Request Access" or "Join the Waitlist" → routes to `/waitlist` (new dedicated page, see below)
- Replace `/analytics` CTA (currently auth-gated) with `/partner-demo` or a waitlist anchor
- Unify the Veterans "Join the Mission" button to the same waitlist destination
- Keep "Watch Demo (2 min)" → `/partner-demo` ✅ (no change needed)
- Keep all "Sign In" destinations ✅ (no change needed)

**Waitlist Page (`/waitlist`) — New Dedicated Route (BUILDER):**
- Reuse/extend the existing `academy_waitlist` table (add a `source` field value `'ppn_portal_main'` to distinguish from Academy signups — no schema change needed, `source` column exists)
- Fields: First name, Email, Practitioner type (existing dropdown), Optional: "What's your biggest clinical documentation challenge?" (free text, 280 char max — this is marketing research data, not PHI)
- Post-submit state: confirmation message + "What happens next" explanation of the 3 phases
- Page must include: what access means, timeline expectation (honest), what founding member access includes

**Email Automation Strategy (MARKETER + LEAD decision on tooling):**
- Recommended tool: **Resend** (developer-first, 3,000 free emails/month, dead simple Supabase webhook integration — no Mailchimp complexity at this stage)
- Trigger: Supabase Database Webhook → Resend API → send confirmation email on new `academy_waitlist` insert with `source = 'ppn_portal_main'`
- Email sequence (3 emails, built in Resend):
  - Email 1 (immediate): "You're on the list" confirmation + what PPN does (2 paragraphs) + link to `/partner-demo`
  - Email 2 (Day 3): One practitioner pain point story (from VoC) + "Here's what the platform looks like inside" → link to `/partner-demo`
  - Email 3 (Day 7): "We're moving to pilot phase soon" + direct reply-to email for high-intent questions
- **Two-list discipline** (from WO-342): Clinical/licensed track vs. grey market/ceremonial track. The `practitioner_type` dropdown determines which track they enter.

**Landing Page Hero Copy Surgery (DESIGNER + BUILDER):**
- Change primary CTA from "Start Free Trial" → "Request Access" (behavioral: lower friction, accurate to current stage)
- Add social proof line near CTA: "Join [N] practitioners already on the waitlist" (pull live count from Supabase, or use static "50+" until query is wired)

#### Out of Scope (explicitly excluded):

- Stripe billing implementation — this is a separate ticket; no payment collection happens in this scope
- Blog, SEO content, or new landing page sections — covered by WO-342
- Full landing page redesign — covered by WO-226 (already in triage)
- Email list migration from any external source — no external import at this stage
- CEU credit or Academy curriculum changes — Academy is a separate product track
- Any new Supabase tables — existing `academy_waitlist` table is sufficient with `source` field differentiation

---

### 5. Priority Tier

**P1** — High value, ship this sprint. People are actively trying to sign up and hitting dead ends or `/checkout` (which implies billing is live, creating a credibility gap). This is a revenue funnel leak that gets worse every day that demo momentum is active. Not P0 because it doesn't block a specific scheduled demo — it's the post-demo conversion layer.

---

### 6. Open Questions for LEAD

1. **Tooling decision:** Confirm Resend as the email automation tool, or does the existing infrastructure (Vercel, Supabase) have a preferred webhook/email provider already configured? (Check `WEBHOOK_SETUP.md` — it may have a provider already)
2. **Routing:** Should `/waitlist` be a new standalone page (new file, new route in `App.tsx`) or a redesign of `/academy` with `source` differentiation? New page is cleaner but adds a route; `/academy` reuse is faster.
3. **CTA copy:** "Request Access" vs. "Join the Waitlist" — both work. "Request Access" implies credential screening (which we do want). "Join the Waitlist" is more familiar/lower friction. LEAD + Trevor to decide.
4. **Live count display:** Is pulling a live `SELECT COUNT(*)` from `academy_waitlist` acceptable public exposure, or should we use a static number until we have ≥ 50 entries?
5. **Phase 2 (Paid Pilot) entry criteria:** What defines pilot-ready — is it a specific date, a specific user count, Stripe going live, or LEAD's judgment call? This determines what the confirmation email promises about timeline.

---

## Launch Phase Map (For Reference — Informs All CTA Copy)

| Phase | Name | Entry Criteria | Primary CTA | What Users Get |
|---|---|---|---|---|
| Phase 1 (NOW) | **Demo Phase** | Ongoing | "Watch Demo" → `/partner-demo` | Partner-facing demo access, no account |
| Phase 2 (Next) | **Paid Pilot** | Stripe live + ≥5 pilot users committed | "Request Access" → invite-only onboarding | Full platform access, founding member pricing, direct line to Trevor |
| Phase 3 (Q2) | **General Availability** | ≥20 active paying practitioners | "Start Free Trial" → `/checkout` | Self-serve signup, tiered pricing |

> **Key insight:** The "Start Free Trial" button is Phase 3 language. It should not exist on the landing page until Phase 3 is live. Showing it now creates a trust gap when users click and find either a broken checkout or pricing they can't yet act on.

---

## What Already Exists (Do Not Rebuild)

| Asset | Location | Status |
|---|---|---|
| `academy_waitlist` table | Supabase `public` schema | ✅ Live, has `source` column |
| Waitlist form component | `src/pages/Academy.tsx` | ✅ Working, collecting name + email + practitioner_type |
| `/academy` route | `src/App.tsx` line 256 | ✅ Live |
| `/partner-demo` route | `src/App.tsx` line 257 | ✅ Live (`PartnerDemoHub`) |
| `/signup` redirect | `src/App.tsx` line 252 | ✅ Already redirects to `/academy` |
| `WEBHOOK_SETUP.md` | Project root | ⚠️ Needs review — may have existing email provider |

---

## What Needs Building

| Deliverable | Owner | Complexity | Blockers |
|---|---|---|---|
| `/waitlist` page (new route) **or** `/academy` redesign | BUILDER | Medium | LEAD routing decision (Q2 above) |
| Landing page CTA surgery (3 buttons) | BUILDER | Low | None — ready to spec |
| Hero copy update ("Request Access" + count) | BUILDER | Low | CTA copy decision (Q3 above) |
| Email automation (Resend webhook → 3-email sequence) | BUILDER | Medium | Tooling decision (Q1 above) |
| Email copy for 3-email sequence | MARKETER | Low | None |
| Waitlist page design brief | DESIGNER | Low | LEAD routing decision |

---

✅ PRD complete for WO-408. LEAD action needed: answer 5 Open Questions and route sub-tasks to BUILDER (CTA surgery + waitlist page), MARKETER (email copy), and DESIGNER (waitlist page design brief).

==== PRODDY ====
