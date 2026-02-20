---
id: WO-124
title: "Phantom Shield Field Campaign: Mobile QR Share Card"
status: 05_USER_REVIEW
owner: USER
failure_count: 0
created: 2026-02-20
priority: high
tags: [campaign, phantom-shield, mobile, QR, GTM, Oregon, practitioner-outreach, share]
---

# WO-124: Phantom Shield Field Campaign

## Campaign Brief

**Goal:** Get the Phantom Shield message in front of independent practitioners in grey-market states (Oregon, Colorado, etc.) through peer-to-peer sharing. Practitioners share this with each other via text, Signal, Instagram Story, and in-person.

**Strategy:** Zero paid ads. Word-of-mouth only. The privacy-paranoid audience doesn't click banner ads — they forward things they trust from people they trust.

**No em dashes in any copy, ever.** User preference. Commas and periods only in body text. Headings may use slash (`/`) or colon (`:`) for structure.

---

## Live Assets (All Deployed to ppnportal.net)

| Asset | URL | Purpose |
|-------|-----|---------|
| **Phantom Shield Overview** | `ppnportal.net/phantom-shield.html` | Full partner/practitioner promo sheet |
| **Mobile Share Card** | `ppnportal.net/phantom-shield-card.html` | Shareable QR card for field use |
| **Checkout / Sign Up** | `ppnportal.net/#/checkout` | Conversion destination |

---

## The Mobile Share Card (`phantom-shield-card.html`)

### What it does
A mobile-first card that a practitioner can:
- **Screenshot** and text to a colleague on Signal
- **Scan the embedded QR code** to open the full overview page
- **Tap "Forward"** — triggers native Share Sheet (iOS/Android) or copies link to clipboard
- **Tap "Start Free Access"** — goes directly to checkout

### Design
- Dark navy (`#0a1628`), Phantom Shield brand colors
- Pulsing cyan "ZERO-PHI ENCRYPTED" badge
- Hook: *"Protect your practice. Your data never exists."*
- Three bullets: Zero PHI stored / Crisis Logger / Blind Vetting Scanner
- QR code pointing to `phantom-shield.html`
- "Forward" share button
- No em dashes anywhere

---

## Agent Assignments

### MARKETER
Create 3 copy variants for the hook line (the "Your data never exists" line) for A/B testing:
- Variant A (current): "Protect your practice. Your data never exists."
- Variant B: [write one]
- Variant C: [write one]

Also write:
- A 3-sentence Signal DM message that practitioners can copy/paste when forwarding
- An Instagram Story caption (under 150 chars)
- A LinkedIn post for Trevor to post targeting Oregon/Colorado practitioners

### DESIGNER
Review `phantom-shield-card.html` for:
- Mobile rendering at 375px (iPhone SE)
- QR code legibility when screenshotted
- Confirm the pulsing encryption badge animation works on iOS Safari

Propose: one visual upgrade to the card that makes it more "pass-worthy" (more likely to be forwarded)

### BUILDER
Add the mobile sticky CTA to `phantom-shield.html`:
- On mobile screens only (`max-width: 768px`)
- Sticky bottom bar: `Start Free Access →` linking to checkout
- Dismiss on scroll-up
- Dark background, blue button, no em dashes in button text

Also: Add a "Share this page" button at the bottom of `phantom-shield.html` that triggers native share or clipboard copy

### ANALYST
Define success metrics for this campaign:
- What does a successful "wave" of practitioner sharing look like in the data?
- What UTM parameters should be on the QR code link?
- How do we measure peer-sharing without tracking PHI?

### PRODDY (already complete)
- Campaign concept and brief: DONE
- Copy direction: DONE
- Asset summary: DONE

---

## Distribution Channels (Trevor to activate)

1. **Personal Signal groups** — paste the share card screenshot + link
2. **Oregon Psilocybin facilitator communities** — post in relevant Signal/Telegram groups
3. **In-person (Jason meeting)** — show the card on phone, let him scan
4. **LinkedIn** — MARKETER will draft post
5. **After Jason meeting** — share the phantom-shield.html URL in follow-up email

---

## Copy Rules (Apply to All Campaign Assets)

- No em dashes in body copy. Ever.
- Commas and periods only for body text punctuation
- Headings may use `:` or `/` for structure
- Tone: Direct, serious, protective. Not medical. Not corporate. Not spooky.
- Never say "drug" or "illegal." Say "complex legal territory" or "grey market" if needed.
- "Practitioners" not "patients" not "clients" (they are practitioners, we serve them)

---

## Status
[STATUS: PASS] — USER APPROVED
Assets live at ppnportal.net. Ready for agent execution.
