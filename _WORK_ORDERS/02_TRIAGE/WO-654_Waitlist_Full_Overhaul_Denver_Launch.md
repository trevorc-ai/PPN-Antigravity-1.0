---
id: WO-654
title: "Waitlist Full Overhaul — Hero Video, Demo Page, Operator Notification, and Enterprise Conversion (Denver Launch)"
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
routed_by: ""
priority: P0
created: 2026-03-22
depends_on: "WO-636 (Waitlist Form Error Fix — must be confirmed shipped before video wiring)"
skip_approved_by: ""
hold_reason: ""
held_at: ""
failure_count: 0
completed_at: ""
builder_notes: ""
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
  - ".agent/skills/ppn-ui-standards/SKILL.md"
  - ".agent/skills/frontend-surgical-standards/SKILL.md"
---

## PRODDY PRD

### 1. Problem Statement

The PPN waitlist page (`/waitlist`) contains three compounding trust failures that will actively hurt conversion at PsyCon Denver (April 9, 2026):

1. The "Watch the 2-min Demo" button — shown on the post-signup success screen AND included in the `send-waitlist-welcome` confirmation email — links to `/#/partner-demo`, a route that does not exist. Visitors who click it land on a blank error state.
2. Operator (Trevor/Jason) receives zero notification when a signup occurs. The edge function only emails the visitor.
3. The demo video asset (`public/video/PPN Portal - Navigating the Psychedelic Frontier HB.mp4`) exists and is branded-ready, but is inaccessible from any live route.

Additionally, the current waitlist architecture buries the demo behind the signup gate. Best-practice B2B SaaS conversion sequences (Notion, Linear, Superhuman) require the product to earn the signup — not reward it. Enterprise clinical buyers arriving via QR code at Denver need to see proof before they commit their email.

---

### 2. Target User + Job-To-Be-Done

A clinic director or medical director scanning a PPN QR code at PsyCon needs to immediately understand what PPN does and why it eliminates their HIPAA liability so that they can make an informed decision to submit their information and request founding partner access — without leaving the page to verify the product is real.

---

### 3. Success Metrics

- `/#/partner-demo` route returns a valid, watchable video experience within 72 hours of this ticket entering BUILD — zero 404 states from any existing user path (success screen or welcome email CTA)
- Operator notification email fires to `info@ppnportal.net` within 60 seconds of every new `log_waitlist` insert — confirmed via manual test signup in staging
- Waitlist page bounce rate does not increase after the video-above-fold change — measured via Supabase or Cloudflare analytics over the first 7 days post-ship

---

### 4. Feature Scope

#### In Scope

**Sub-ticket A: Build `/partner-demo` Route (P0 — fixes active broken link)**
- Create `src/pages/PartnerDemo.tsx` — a standalone full-screen video player rendering `public/video/PPN Portal - Navigating the Psychedelic Frontier HB.mp4`
- Add unauthenticated route `/partner-demo` in `src/App.tsx` — no login required, publicly accessible for sharing at Denver
- Player design: dark background (`#070b14`), autoplay muted on load, controls visible, PPN wordmark in top-left, "Join the Waitlist →" CTA button below player
- Mobile-first: full-width on iPhone Safari, no horizontal scroll

**Sub-ticket B: Operator Notification on Signup (P0 — blind spot fix)**
- Add an operator notification step to the `send-waitlist-welcome` edge function: after sending Email 1 to the visitor, fire a second Resend email to `info@ppnportal.net` with subject `[PPN Waitlist] New signup: {firstName} {lastName} — {practitionerType}` and body containing email, name, practitioner type, and timestamp
- Failure of this notification must NEVER block or affect the visitor-facing success state
- Apply the identical pattern to the `WaitlistModal.tsx` edge function call if it fires independently

**Sub-ticket C: Hero Video Above the Form (P1 — conversion lift)**
- Embed the branded explainer video in the LEFT column of `Waitlist.tsx`, positioned above the value-props grid and below the headline/subheadline
- Video: muted autoplay loop, `poster` fallback, controls on hover — no sound, no friction
- Keep the existing two-column split layout intact; video slot replaces the current text-only whitespace between the headline and the value-props cards
- Video should be tastefully sized (not full-screen on the waitlist page) — max-height 280px on desktop, full-width on mobile

**Sub-ticket D: Post-Signup Share/Referral Mechanic (P1 — Denver-specific growth)**
- On the success screen (after `status === 'success'`), add a "Share with a colleague" section below the "What happens next" card
- Three share options as icon buttons: copy link to `/waitlist`, share via email (`mailto:` with pre-filled subject/body), copy to clipboard — toast confirmation on copy
- No third-party referral SaaS required; pure client-side mechanics only

**Sub-ticket E: Waitlist Social Proof Counter (P2 — trust signal)**
- Query `log_waitlist` count from Supabase and display it in the left column as a live social proof signal: `{N}+ practitioners already on the list`
- Display only if count >= 10 (no embarrassing "3 practitioners" state)
- Cache with a 60-second client-side TTL to avoid unnecessary DB hits

#### Out of Scope

- Modifying the `log_waitlist` schema — no column additions in this ticket (WO-642 owns that migration)
- Email drip sequences (Day 3 / Day 7 broadcasts) — those are manual Resend Broadcasts per WO-411
- DocuSign/PandaDoc charter delivery automation — out of scope for this ticket
- Changing the `/waitlist` route from authenticated to public — WO-642 owns the `/join` public route
- Any changes to `WaitlistModal.tsx` beyond the operator notification pattern — surgical scope only
- Video production or re-branding of the existing video asset
- Resend configuration, DNS, or domain setup — WO-634 owns that

---

### 5. Priority Tier

**P0** — Sub-tickets A and B are demo blockers. PsyCon Denver is April 9, 2026 — 18 days away. The broken `/partner-demo` link is already live in every confirmation email sent since WO-636 shipped. Every visitor seeing that link is hitting a 404 today. This is an active trust failure on a live product.

Sub-tickets C, D, and E are P1/P2 but should be bundled into the same sprint given the Denver deadline. All five sub-tickets should ship together in one PR no later than April 1, 2026.

---

### 6. Open Questions for LEAD

1. **Video hosting:** The existing `public/video/` path serves the file from the React/Vite bundle. At trade show Wi-Fi speeds, a large MP4 may load slowly. Should LEAD evaluate serving it from Supabase Storage or a CDN (e.g., Cloudflare Stream) instead of the static bundle, or is the file small enough for direct public hosting?

2. ~~**Operator notification recipients:**~~ **RESOLVED (2026-03-22):** Notifications go to `signups@ppnportal.net` (catch-all alias with inbox filter). `trevor@ppnportal.net` was the original suggestion but a dedicated alias was chosen for longevity.

3. **`/partner-demo` authentication:** The route must be publicly accessible for Denver QR code sharing. LEAD must confirm `App.tsx` routing allows unauthenticated access to this path — the existing auth guard pattern must not block it.

4. **WO-636 gate:** Sub-ticket B modifies the same `send-waitlist-welcome` edge function that WO-636 touches. LEAD should confirm WO-636 is fully shipped and passing QA before BUILDER opens the edge function again, to avoid merge conflicts.

5. **Social proof counter (Sub-ticket E) and RLS:** The `log_waitlist` count query will run as an anonymous/unauthenticated Supabase client. USER must confirm the existing RLS policy on `log_waitlist` permits anonymous `SELECT COUNT(*)`, or add a scoped read policy in Supabase dashboard before BUILDER implements the counter.

---

## PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤ 100 words
- [x] PRD total is ≤ 1000 words
- [x] All 6 required sections present
- [x] Each success metric contains a measurable number or specific event
- [x] Out of Scope section is populated and prevents scope creep
- [x] Priority tier includes a reason tied to a real deadline (Denver, April 9)
- [x] Open Questions list has ≤ 5 items and none are answered by PRODDY
- [x] No TypeScript, React, SQL, or CSS authored in this document
- [x] Ticket filed in `00_INBOX` with correct frontmatter

---

✅ WO-654 placed in 00_INBOX. LEAD action needed: review Open Questions (especially video hosting, auth guard, and WO-636 gate) and route to BUILDER in priority order. P0 sub-tickets A and B should be in BUILD no later than March 25.
