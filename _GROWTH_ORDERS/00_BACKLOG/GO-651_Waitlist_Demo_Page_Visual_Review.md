---
id: GO-651
title: "Waitlist & Partner Demo Page — Denver Launch Visual Review"
owner: MARKETER
status: 00_BACKLOG
authored_by: LEAD
priority: P0
created: 2026-03-22
epic_type: Landing_Page
target_audience: "Clinic directors, medical directors, and enterprise psychedelic therapy operators arriving via QR code at PsyCon Denver (April 9, 2026)"
notebook_source: "N/A"
prototype_reference: "src/pages/Waitlist.tsx, src/pages/PartnerDemoHub.tsx, supabase/functions/send-waitlist-welcome/index.ts"
linked_wo: "WO-654"
fast_lane: true
---

# GO-651 — Waitlist & Partner Demo Page: Denver Launch Visual Review

## Brief

WO-654 requires major public-facing changes to two pages:
1. **`/partner-demo`** — The current route points to `PartnerDemoHub` (an authenticated feature gallery). Sub-ticket A of WO-654 replaces this with a **new standalone, unauthenticated 2-minute video player page** (`PartnerDemoPage.tsx`) that is the primary CTA destination from every waitlist confirmation email.
2. **`/waitlist`** — Sub-tickets C, D, and E add a hero video embed (above the fold), a post-signup share mechanic, and a live social proof counter.

Per `proddy-protocol` v1.2 §Public-Facing Engineering Gate, MARKETER/DESIGNER must review and approve the UX intent for all public-facing deliverables before BUILDER implements. This GO captures that approval gate.

**Fast-Lane:** No full CONTENT_MATRIX is required. This is a visual/UX intent review, not a copy production sprint. MARKETER should review the WO-654 PRD scope and confirm: (a) the video player page design intent aligns with the PPN brand, and (b) the waitlist additions (video embed, share mechanic, counter) do not conflict with the existing page brand expression.

---

## MARKETER Task List

1. **Review PartnerDemoPage design intent** (WO-654 Sub-ticket A):
   - Dark background `#070b14`
   - Autoplay muted, controls visible
   - PPN wordmark top-left
   - "Join the Waitlist →" CTA below player
   - Mobile-first (iPhone Safari, no horizontal scroll)
   - Confirm: does this match brand standards for the first thing a Denver contact sees?

2. **Review Waitlist hero video embed** (WO-654 Sub-ticket C):
   - Muted autoplay loop, poster fallback, controls on hover
   - Max-height 280px desktop, full-width mobile
   - Replaces whitespace between headline and value-props cards in left column
   - Confirm: does placement above value-props match the intended conversion narrative?

3. **Review Share Mechanic copy** (WO-654 Sub-ticket D):
   - Post-signup success screen only
   - Three options: copy link, email share (pre-filled mailto), copy to clipboard
   - Pre-filled email subject/body must be reviewed for tone and brand voice
   - Confirm: copy for pre-filled mailto subject and body

4. **Review Social Proof Counter** (WO-654 Sub-ticket E):
   - Copy: `{N}+ practitioners already on the list`
   - Displayed only if count ≥ 10
   - Left column of waitlist page
   - Confirm: approve counter copy and placement

---

## Reference Assets

- WO-654 PRD: `_WORK_ORDERS/00_INBOX/WO-654_Waitlist_Full_Overhaul_Denver_Launch.md`
- Existing waitlist page: `src/pages/Waitlist.tsx`
- Existing feature hub (current /partner-demo): `src/pages/PartnerDemoHub.tsx`
- Confirmation email (contains the broken CTA): `supabase/functions/send-waitlist-welcome/index.ts` (line 164)
- Video asset: `public/video/PPN Portal - Navigating the Psychedelic Frontier HB.mp4`

---

## Audience-Specific Exclusions

- Do NOT show pricing, billing, or insurance messaging on the `/partner-demo` page
- Do NOT include any patient-identifiable language in the share mechanic copy
- Do NOT display the social proof counter if N < 10 (no embarrassing low-count state)

---

## Fast-Lane Flag

**DESIGNER mockup pass: NOT required.** The WO-654 PRD fully specifies the layout and design constraints. MARKETER review is needed only for:
1. Brand alignment sign-off on the video player design intent
2. Copy approval for the share mechanic pre-filled email (Sub-ticket D)
3. Copy confirmation for the social proof counter string (Sub-ticket E)

Once MARKETER approves and this ticket reaches `04_VISUAL_REVIEW`, LEAD will create the BUILDER WOs with `growth_order_ref: GO-651`.

---

✅ GO-651 placed in `_GROWTH_ORDERS/00_BACKLOG/`. MARKETER action needed: review WO-654 Sub-tickets A, C, D, E for brand alignment and copy approval before BUILDER sub-tickets can enter `03_BUILD`.

**P0 EXCEPTION NOTE:** Sub-tickets A and B of WO-654 are active trust failures (broken link in live emails; zero operator notification). LEAD is requesting fast-lane approval so A and B can enter BUILD before GO-651 completes full MARKETER review. See LEAD Architecture Note in WO-654-A and WO-654-B.
