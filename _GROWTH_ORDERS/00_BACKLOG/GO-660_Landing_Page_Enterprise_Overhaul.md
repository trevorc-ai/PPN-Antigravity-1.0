---
id: GO-660
title: "Landing Page Enterprise Overhaul — PsyCon Denver Launch"
status: 00_BACKLOG
priority: P0
deadline: 2026-04-09
created_at: 2026-03-23
created_by: LEAD
source_brief: "Downloads/PPN Landing Page and Launch 03-22-26.md"
type: public_facing
route: ppnportal.net (Landing.tsx and all front-door pages — see scope below)
pipeline: _GROWTH_ORDERS (mandatory — public-facing deliverable)
---

# GO-660: Landing Page Enterprise Overhaul — PsyCon Denver Launch

> ⛔ **FRONT DOOR COORDINATION LOCK — READ BEFORE ANY IMPLEMENTATION**
>
> The homepage (`Landing.tsx`) is architecturally and visually interrelated with all other front-door pages. **No individual front-door page may go live until the entire front-door set has been fully designed, reviewed, and approved as a cohesive group.**
>
> **Front-door page set (all must be approved together):**
> - `Landing.tsx` — Homepage
> - `ForClinicians.tsx` — Clinical audience entry
> - `ForPayers.tsx` — Payer/institutional entry
> - `Waitlist.tsx` + `WaitlistPage.tsx` (`/join`) — Lead capture
> - `Pricing.tsx` — Commercial model
> - `Login.tsx` — Authentication entry
> - `StructuralPrivacy.tsx` — Privacy policy entry
> - `PartnerDemoPage.tsx` + `PartnerDemoHub.tsx` — Partner sales flow
>
> BUILDER must NOT push any page from this set to production independently. The deploy is a coordinated all-or-nothing release.

## Strategic Context

PsyCon Denver is **April 9, 2026 — 17 days out.** Practitioners will QR-scan `ppnportal.net` from a phone on the convention floor. The current landing page does not communicate enterprise-grade clinical intelligence to that buyer. This GO delivers the homepage rebuild required to support the booth closing flow.

**Source brief:** Dual strategic assessment from ChatGPT + Gemini (03-22-26), reviewed and approved by User.  
**Key constraint from advisor:** Do not over-engineer. Focus entirely on frontend excellence. No new backend integrations before the show.

---

## Buyer Profile (ICP)

- **Primary:** Owner / Medical Director / COO of a 2–10+ provider PAT or ketamine clinic network
- **Secondary:** Compliance Officer or Principal Investigator evaluating the platform
- **Entry point:** QR code scan at PsyCon → mobile phone → 60 seconds max before they put it away
- **What they need to see immediately:** Risk reduction + product credibility + one clear CTA

---

## Required Homepage Architecture (6 Sections)

### Section 1: Hero
- **Headline:** `Clinical Intelligence Built for Psychedelic Therapy.`
- **Subheadline:** `Zero PHI. Zero liability. Full outcomes intelligence.`
- **Primary CTA:** `Request Institutional Access` (links to /waitlist)
- **Trust bar (below CTA, monospace font):** `21 CFR Part 11 Compliant · HIPAA Architectural Exemption · OHA OAR 333-333 Aligned`
- **Mobile-first:** CTA must be `w-full` on mobile, hero text stacked single column

### Section 2: Agitation — The Liability Walled Garden
- **Headline:** `Operating in the dark carries existential risk.`
- **Copy:** The moment a system stores a patient name next to a Schedule I substance protocol, the institution assumes significant legal and financial risk.
- **3 animated stat callouts:**
  - `$10.8M` — Average cost of a healthcare data breach
  - `$500k+` — Annual HIPAA compliance infrastructure cost
  - `Unlimited` — Regulatory subpoena exposure
- **Mobile:** Stats stack 1-col on mobile, 3-col on `md:`

### Section 3: The Phantom Shield
- **Headline:** `The Phantom Shield: Zero-Knowledge by Design.`
- **Copy:** PPN captures zero Protected Health Information by architectural design. Cryptographic Subject IDs eliminate breach liability and subpoena risk at the host institution level.
- **3 pillar cards (hover/tap state):**
  1. `Subpoena Immunity` — Patient identity cannot be disclosed from a system that never recorded it.
  2. `$0 Breach Liability` — If the system were ever breached, there would be nothing of value to take.
  3. `Legal Benchmarking` — Because PPN stores no PHI, it is the only platform that can legally benchmark outcomes across a clinical network.
- **Mobile:** Cards stack 1-col, tap replaces hover

### Section 4: The Product — Interactive Clinical Intelligence
- **Headline:** `Real-Time Intelligence, Not Retrospective Charting.`
- **3-tab interface (mobile: stacked accordion):**
  - Tab 1: `60-Second Interaction Checker` — link to /partner-demo or show screenshot
  - Tab 2: `Efficacy Trajectory` — PHQ-9 outcomes visualization screenshot
  - Tab 3: `Clinic Performance Radar` — network benchmarking screenshot
- **Constraint:** Use `Marketing-Screenshots/webp/` screenshots. No new live interactive chart components in this sprint. Static or screenshot-based is acceptable for Denver.

### Section 5: Interoperability
- **Headline:** `Structured for Meta-Analysis. Ready for the IRB.`
- **Standards table:** RxNorm / MedDRA / UCUM / LOINC/SNOMED
- **Mobile:** Table scrolls horizontally or collapses to stacked list

### Section 6: The Close — Frictionless Rollout CTA
- **Headline:** `The 30-Day Frictionless Rollout.`
- **Copy:** We own the rollout entirely. Zero session downtime. PPN-led staff training. Fully operational in 30 days.
- **Secondary lead capture:** Form with Name, Institution, Role, Professional Email — submits to `log_waitlist` (existing table, no schema change needed)
- **Mobile:** Single-column form, `w-full` inputs, `h-12` submit button

---

## Out of Scope for This Sprint

- Python/FastAPI backend (Supabase/Resend already handles lead capture)
- New live interactive Recharts demos (deferred — too high-risk 17 days pre-Denver)
- Any authenticated app screen changes
- Any DB schema changes

---

## ppn-ui-standards Compliance Requirements

Per Rule 8 (Mobile-First Mandate) — **enforced at INSPECTOR Phase 0 and Phase 4:**

- [ ] All grid layouts begin with `grid-cols-1`, upgrade via `md:grid-cols-N`
- [ ] All flex layouts begin with `flex-col`, upgrade via `md:flex-row`
- [ ] All CTAs use `w-full sm:w-auto`
- [ ] All tappable elements are `h-12` minimum
- [ ] No hardcoded `w-[Npx]` on layout containers
- [ ] No em dashes in body copy
- [ ] No `text-xs` anywhere
- [ ] Inter font only (no JetBrains Mono)
- [ ] INSPECTOR must capture 375px mobile-viewport screenshot before Phase 4 passes

---

## Delivery Requirement

The finished page must be scannable on an iPhone SE (375px) in under 60 seconds:
- Hero + CTA visible without scrolling
- Trust bar legible
- No horizontal overflow

---

## Pipeline Route

```
00_BACKLOG → 01_DRAFTING (PRODDY) → 02_USER_REVIEW → 03_MOCKUP_SANDBOX (DESIGNER)
→ 04_VISUAL_REVIEW → 05_IMPLEMENTATION (BUILDER) → 06_QA (INSPECTOR) → 99_PUBLISHED
```

> ⛔ This GO must NOT bypass any pipeline stage. No shortcut to `_WORK_ORDERS` until this GO reaches `99_PUBLISHED`.
