---
status: 01_TRIAGE
owner: LEAD
failure_count: 0
priority: HIGH
created: 2026-02-19
---

# WO-223: SecureGate — Fabricated Testimonials & Pricing Content

## Problem
`SecureGate.tsx` contains fabricated testimonial personas using CLINICIANS stock images:
- **"Dr. Aris Thorne"** (Lead PI, Baltimore) — not real
- **"Sarah Jenkins"** (Senior Research Nurse) — not real
- **"Dr. Marcus Vane"** (Clinical Psychologist) — not real

Quotes are generic marketing language that sounds invented. For a clinical credibility platform, this is a trust liability.

## Additional Issues Found
- Pricing on SecureGate shows "The Guild Member - Free*" and tiered pricing, but the platform is invite-only. This pricing content directly contradicts the invite-only messaging.
- "Institutional Mission" quote: `"Advancing clinical excellence through collaborative research and cross-node data insights."` — generic and vague, not aligned with VOC language.

## PRODDY Decision Needed
1. Are these testimonials from real practitioners who provided consent? If yes — swap names for real ones.
2. If no — should the testimonials section be removed entirely, or replaced with a simple "founding practitioner" placeholder?
3. Should pricing be shown on the SecureGate page at all? Or should it be gated behind "Request Access"?

## BUILDER Notes (after PRODDY decision)
- All testimonials currently reference `CLINICIANS[]` array from `../constants` for images
- Pricing section is in `<div id="membership-tiers">` around line 410
- Easy to replace or remove either section once strategy is confirmed
