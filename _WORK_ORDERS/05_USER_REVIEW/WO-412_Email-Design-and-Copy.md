---
id: WO-412
status: 03_BUILD
owner: MARKETER
cue_verified: true
cue_note: "Ticket complete. Route: MARKETER (copy approval) → DESIGNER (3 HTML email files) → BUILDER (swap into WO-411 Edge Function). No blockers."
priority: P1
failure_count: 0
created: 2026-02-24
parent_ticket: WO-408
sprint: Sprint 2
tags: [email, copy, design, marketer, designer, builder]
---

## LEAD ARCHITECTURE
- **Routing:** Route to 03_BUILD for `owner: MARKETER`.
- **Strategy:** MARKETER is to finalize and approve the copy for the 3 emails. Once complete, HANDOFF to DESIGNER to create the HTML files.

# WO-412: Email Design + Copy — Waitlist Welcome Sequence (3 Emails)

## User Prompt (verbatim)
"We will want beautifully designed, simple, minimal-text emails."

## Overview
Three emails for the waitlist welcome sequence. Each email must be:
- **Beautifully designed** — premium dark aesthetic matching the landing page
- **Simple and minimal-text** — nothing a practitioner would skim past
- **Honest** — zero fabricated stats, zero claims we can't back up (GLOBAL_CONSTITUTION §5)
- **Clinically credible** — tone is "intelligent colleague" not "startup founder"
- **No dead ends** — every email has exactly one clear next step

## Design Constraints (DESIGNER)

### Visual System
- **Background:** `#0a1628` (matches the app/landing page)
- **Text:** `#9fb0be` (primary), `#6b7a8d` (secondary/descriptor)
- **Accent:** `#388bfd` (blue, sparingly — links and CTAs only)
- **Font:** Inter (Google Fonts, load via `<link>` in email `<head>`)
- **Container:** Max-width 560px, centered, with `32px` padding on desktop
- **Card style:** `background: rgba(12,26,50,0.95); border: 1px solid rgba(56,139,253,0.15); border-radius: 16px;`
- **CTA button:** `background: linear-gradient(135deg, #388bfd, #2060cc); color: white; padding: 14px 32px; border-radius: 10px; font-weight: 700; text-decoration: none; display: inline-block;`
- **Minimum font size:** 14px body copy. 12px for legal footer only.

### Structure (Same for All 3 Emails)
```
[Logo: PPN Portal wordmark — small, top-left of card]
[Divider line: rgba(56,139,253,0.15)]
[Body copy: 2–4 short paragraphs maximum]
[Single CTA button]
[Footer: "PPN Research Portal · info@ppnportal.net · Unsubscribe"]
```

### What NOT to Do
- No image-heavy layouts (images break in many email clients)
- No hero images (use CSS-only design instead)
- No confetti, emojis, or playful decorations — this is a clinical product
- No more than one CTA per email
- No fabricated numbers or social proof claims

---

## Email 1 — Immediate Confirmation

**Subject:** `You're on the list — here's what happens next`
**Trigger:** Immediately on waitlist form submission
**Track:** All practitioners (same email, both sources)

### Copy (MARKETER to refine, this is the spec):

**Opening:**
> Hi [First Name],
>
> You're on the waitlist for PPN Research Portal.

**Body (short):**
> PPN is clinical infrastructure for psychedelic therapy practitioners. One platform for session documentation, safety surveillance, and outcomes benchmarking — built on a zero-PHI architecture so your data is defensible by design.
>
> When our founding cohort opens (targeted: early spring 2026), you'll be among the first we contact.

**What happens next (3 bullets, minimal):**
- You'll receive a confirmation email from our team
- We'll notify you directly when founding access opens
- Founding practitioners get priority onboarding and direct access to our team

**CTA:**
> [Watch the 2-minute demo →]
> (links to `/partner-demo`)

**Footer note (1 line, secondary color):**
> No payments. No spam. You can unsubscribe at any time.

---

## Email 2 — Day 3 Follow-up

**Subject:** `"I feel like I'm practicing completely alone."`
**Trigger:** 3 days after waitlist signup
**Track:** Clinical/Licensed practitioners

### Copy spec:

**Opening:**
> That's a direct quote from a licensed practitioner we spoke with in Oregon.
>
> She had completed her training, built her practice, and was doing the work she believed in. But every session, every protocol, every outcome lived in a different spreadsheet.

**Body:**
> PPN exists because this practitioner — and dozens like her we've interviewed — deserve better infrastructure. Not a generic EHR with a psychedelic label on it. Purpose-built documentation architecture for the unique safety, privacy, and longitudinal tracking demands of this field.
>
> The platform is in demo stage now. Here's a 2-minute look at what's inside.

**CTA:**
> [See the platform →]
> (links to `/partner-demo`)

**Note for MARKETER:** Pull an actual verbatim VoC quote from the podcast transcripts or Jason's interviews to replace the Oregon example above, if a more specific/real quote is appropriate. Get written consent before using any attributable quotes.

---

## Email 3 — Day 7 Follow-up

**Subject:** `A quick question before we open the pilot`
**Trigger:** 7 days after waitlist signup
**Track:** All practitioners

### Copy spec:

**Opening:**
> We're preparing to open our founding practitioner cohort.
>
> Before we do, we have one question for you.

**Body:**
> What's the single biggest challenge in your clinical documentation practice right now?
>
> Not a trick question. We're asking because the answer directly shapes what we build first. If ten practitioners tell us the same thing, that becomes our next sprint.
>
> Reply to this email. We read every response.

**CTA:**
> [Reply to this email →]
> (mailto: reply — this opens a direct email thread, no external link)

**Footer note:**
> You're receiving this because you joined the PPN Portal waitlist. [Unsubscribe]

---

## Deliverables from DESIGNER + MARKETER

| Deliverable | Owner | Format |
|---|---|---|
| Email 1 HTML (dark theme, branded) | DESIGNER | Self-contained HTML file |
| Email 2 HTML (dark theme, branded) | DESIGNER | Self-contained HTML file |
| Email 3 HTML (dark theme, branded) | DESIGNER | Self-contained HTML file |
| Final copy for all 3 emails | MARKETER | Approved in ticket before DESIGNER implements |
| Two-track variant of Email 1 opening (ceremonial vs. clinical) | MARKETER | Optional, if audience segmentation is ready |

## Delivery Note for BUILDER
DESIGNER will produce self-contained HTML files. BUILDER inserts them into the `buildConfirmationEmail()` function in the Edge Function created in WO-411. The WO-411 function has a placeholder that BUILDER will swap out once WO-412 HTML is approved.

## Acceptance Criteria
- [ ] All 3 email HTML files render correctly in Gmail (desktop + mobile)
- [ ] All 3 email HTML files render correctly in Apple Mail
- [ ] Font sizes: body ≥ 14px, footer ≥ 12px
- [ ] Zero fabricated statistics or unsupported claims (GLOBAL_CONSTITUTION §5 compliance)
- [ ] Each email has exactly one CTA
- [ ] Reply-to is `info@ppnportal.net` on all emails
- [ ] Unsubscribe link present in footer of all emails
- [ ] INSPECTOR: review copy for prohibited words (GLOBAL_CONSTITUTION §4)
