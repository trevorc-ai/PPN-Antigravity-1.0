---
id: WO-132
title: "Checkout Page Redesign: Premium Conversion-Optimized Layout"
status: 03_BUILD
owner: BUILDER
failure_count: 0
created: 2026-02-20
priority: high
tags: [checkout, pricing, conversion, UI, redesign, stripe, react]
---

## Context

The current `Checkout.tsx` is functionally correct — Stripe integration, billing toggle, tier selection, and error handling all work. The problem is entirely visual. It reads like a generic Tailwind utility page, not a premium clinical platform. Before Jason demos this to anyone or shares the checkout link, it needs to look like the rest of the product. The Phantom Shield pages ship at a much higher design bar than the checkout. This should match that bar.

**No logic changes.** All existing checkout logic (`handleCheckout`, billing toggle, tier selection, Stripe redirect, error state) stays exactly as-is. This is a pure JSX/className redesign. Do not touch `stripe.ts`, `supabaseClient`, or the Edge Function.

---

## Current Pain Points (What PRODDY Identified)

1. **Emerald green color scheme** is disconnected from the site's blue/cyan identity system (`#388bfd`, `#39d0d8`). Checkout currently looks like a different product.
2. **No trust signals** — a conversion-critical page with no security badges, no HIPAA mention, no "no credit card" callout other than a small text line.
3. **Generic card layout** — two side-by-side cards with no visual hierarchy between them. The research partner offer is not prominent enough given its strategic importance (it's the data acquisition play).
4. **Billing toggle is low-contrast and small** — Annual discount should be more prominent. The "Save 20%" text is weak given it's actually saving $480/year.
5. **No social proof or context** — This is an expensive purchase. The page does nothing to remind the practitioner why this is worth $199/month.
6. **Enterprise section is placeholder-level** — Needs to be a proper CTA card, not a gray box at the bottom.
7. **Font sizes** — Some labels are too small for the accessibility standard (min 12px per global rules).

---

## Design Specification

### Color System — Match the Site
Stop using `emerald-*`. Use the platform color system:

```
Primary blue:    #388bfd  (selected state, CTA button, check icons)
Cyan accent:     #39d0d8  (Annual badge, Research Partner accent)
Background:      #0a1628  (full-bleed)
Card surface:    rgba(12, 26, 50, 0.95)  — use bg-[rgba(12,26,50,0.95)] or similar
Border default:  rgba(56, 139, 253, 0.18)
Border active:   rgba(56, 139, 253, 0.5)
Text primary:    #9fb0be  (headings)
Text secondary:  #6b7a8d  (muted, labels)
Success:         #3fb950  (check marks, savings labels)
Amber:           #f0a500  (Research Partner badge, requirement notice)
```

---

### Layout — Three-Zone Page

```
┌─────────────────────────────────────────────┐
│  ZONE 1: HEADER (trust-first, centered)      │
│  Logo mark | "Choose Your Plan"              │
│  Subhead + trust badges row                  │
│  Billing toggle (Monthly / Annual)           │
└─────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────┐
│  ZONE 2A:        │  ZONE 2B:                │
│  Standard Plan   │  Research Partner Plan   │
│  (left / top)    │  (right / bottom)        │
│                  │  [FEATURED ribbon]        │
└──────────────────┴──────────────────────────┘

┌─────────────────────────────────────────────┐
│  ZONE 3: ENTERPRISE CARD (full width)        │
│  Dark, low-key. "Clinic networks & orgs."   │
└─────────────────────────────────────────────┘
```

On mobile, everything stacks vertically. Research Partner card appears BELOW Standard.

---

### Zone 1: Header

```tsx
// PPN Logo mark (small SVG — same as used in other pages)
// h1: "Choose Your Plan"  — 28–32px, font-weight 900, color #9fb0be
// p: "14-day free trial on all plans. No credit card required."  — 15px, #6b7a8d

// Trust badges row — horizontal flex, centered, mt-4
<div className="trust-badges-row">
  <span>🔒 HIPAA-Compliant</span>
  <span>•</span>
  <span>🛡️ Zero-PHI Architecture</span>
  <span>•</span>
  <span>💳 No Card for Trial</span>
  <span>•</span>
  <span>✗ Cancel Anytime</span>
</div>
// Style: 12px, #6b7a8d, letter-spacing 0.04em, gap 12px
```

**Billing Toggle (redesigned):**
```tsx
// Replace the emerald-500 active state with blue
// Add "SAVE $480/YR" amber badge that appears only when Annual is active
// Pill-style toggle, not rectangle buttons

<div className="billing-toggle"> // centered, inline-flex, rounded-full, border 1px solid border-color
  <button data-active={monthly}> Monthly </button>
  <button data-active={annual}>
    Annual
    <span className="savings-badge">Save $480/yr</span>  // amber, only shows when annual active
  </button>
</div>
```

---

### Zone 2: Pricing Cards

#### Standard Plan Card
- Border: `rgba(56,139,253,0.18)` default → `rgba(56,139,253,0.5)` when selected
- Background when selected: `rgba(56,139,253,0.06)`
- **Price display:** `$199` in 48px, weight 900, color `#388bfd`. `/mo` in 18px muted
- Annual price shows: `$159/mo` with strikethrough of `$199` and "Billed $1,908/yr"
- No "POPULAR" badge on this one — save badge prominence for Research Partner
- CTA within card: "Start 14-Day Free Trial" — full-width button, blue background, white text

#### Research Partner Card ⭐ (the data acquisition play)
This card needs to visually earn attention. It exists to sign up practitioners who will contribute sessions, which is PPN's core data moat.

- Top ribbon: `RESEARCH PARTNER` — amber gradient banner across the top
- Border: `rgba(240,165,0,0.3)` default → `rgba(240,165,0,0.6)` when selected
- Background when selected: `rgba(240,165,0,0.05)`
- Show the crossout price prominently: ~~$199/mo~~ → `$49/mo`
- Show savings: "Save $1,800/year" in green
- Requirement notice (amber callout box within card):
  ```
  ⚡ Requires contributing 5+ de-identified session records/month to the PPN Research Alliance.
  Quality threshold: Bronze tier or above. 2-month grace period.
  ```
- CTA: "Join as Research Partner" — amber outlined button

#### Card Check List
- Check icon: `#3fb950` green — use Lucide `<Check />`  (already imported, keep it)
- Feature text: 14px, color `#889aab`
- Last feature in Research Partner list ("Save $1,800/year") should be bold and green

---

### Zone 3: Enterprise Card

Full-width, distinct from the pricing cards above. Should feel like a separate tier — heavy orgs, not individual practitioners.

```
Background: rgba(12, 26, 50, 0.7)
Border: rgba(56,139,253,0.15)
Border-radius: 16px
Padding: 40px

Layout: Two columns on desktop
  Left:  "Enterprise" heading + description + bullet list
  Right: "Contact Sales" button + email + response time note

Heading: "Multi-Site and Organizational Access"  — NOT "Need Enterprise?" (too generic)
Sub:     "Group malpractice insurance access, multi-site dashboards, Center of Excellence certification, and dedicated account management."
CTA:     "Contact Sales →"  — outlined blue button, links to mailto:sales@ppnportal.net
Note:    "Typical response under 24 hours."  — 12px muted
```

---

### Zone 4: CTA Section (below cards, above Enterprise)

This is the primary conversion CTA. Currently it's a single button at the bottom — elevate it.

```tsx
<div className="cta-section"> // text-center, mt-8
  <button onClick={handleCheckout} disabled={loading}>
    {loading ? (
      <span>Processing...</span>
    ) : (
      <>Start 14-Day Free Trial — {selectedTierName}</>
    )}
  </button>
  <p>No credit card required for trial period. Cancel anytime from your settings.</p>
  
  // Security row
  <div className="security-row">
    <span>🔐 Secured by Stripe</span>
    <span>•</span>
    <span>256-bit TLS encryption</span>
    <span>•</span>  
    <span>PCI-DSS compliant</span>
  </div>
</div>
```

Button styles:
- Background: `#388bfd`
- Hover: `#2070d0` (slightly darker)
- Text: white, 16px, font-weight 700
- Padding: `14px 40px`
- Border-radius: `10px`
- Box-shadow on hover: `0 0 20px rgba(56,139,253,0.3)`
- Disabled: opacity 0.5, cursor not-allowed

---

## Explicit Constraints for BUILDER

1. **Do NOT change any logic** in `handleCheckout`, the billing toggle state, tier selection, or the Stripe redirect path. Only change JSX structure and className values.
2. **Do NOT change `stripe.ts`** or any imports except adding new icons if needed.  
3. **All tier data still comes from `SUBSCRIPTION_TIERS`** — do not hardcode prices or feature lists.
4. **Min font size: 14px** for all body/feature text. Labels may use 12px but not less.
5. **The `filter(key !== 'enterprise' && key !== 'free')` line stays** — enterprise stays in the dedicated section below, free tier stays hidden.
6. **Annual billing: Research Partner plan does not support annual** (`priceIdAnnual: null`). When billing interval is "annual", the Research Partner card should show a note: "Monthly billing only for Research Partner rate" and disable the CTA temporarily — or just show the monthly price without annual toggle effects.
7. **Keep the error message display** (`{error && <div>...`)` — just restyle it to match the new color system (use `border-red-500/30` instead of rose).
8. **Accessibility**: All interactive elements need focus rings. Use `focus:outline-none focus:ring-2 focus:ring-[#388bfd] focus:ring-offset-2 focus:ring-offset-[#0a1628]`.

---

## Files to Modify

| File | Change Type |
|------|-------------|
| `src/pages/Checkout.tsx` | Full JSX redesign (keep all logic) |

No other files need changing. Do not create new component files for this — keep it self-contained.

---

## Definition of Done

- [ ] Page background matches site (`#0a1628`), no residual `slate-*` or `emerald-*` colors
- [ ] Billing toggle uses blue active state, not green
- [ ] Research Partner card has amber ribbon and prominent crossout pricing
- [ ] Standard Plan card has blue selected state
- [ ] Enterprise section is a two-column card, not a gray footer box
- [ ] CTA button is blue with hover glow
- [ ] Trust badges and security row are present
- [ ] All fonts >= 14px for body text
- [ ] Annual toggle shows Research Partner limitation note
- [ ] No changes to any checkout logic
- [ ] Tested on mobile (375px) — single column stack, all cards readable

## INSPECTOR Checklist (pre-approval)
- [ ] No `emerald-*` class names remain
- [ ] No `slate-*` used for primary UI surfaces (bg or border)
- [ ] All text >= 12px
- [ ] Error state still renders correctly
- [ ] Loading state still disables the button
- [ ] Stripe redirect still fires on submit
