---
id: GO-660-CONTENT_MATRIX
title: "Landing Page Enterprise Overhaul — PsyCon Denver Launch"
type: CONTENT_MATRIX
authored_by: MARKETER
status: 02_USER_REVIEW
created: 2026-03-25
linked_go: GO-660
deadline: 2026-04-09
audience: "Owner / Medical Director / COO of 2–10+ provider PAT or ketamine clinic network"
entry_point: "QR scan at PsyCon Denver → mobile browser → 60 seconds max"
---

==== MARKETER ====

# GO-660 CONTENT MATRIX
## Landing Page Enterprise Overhaul — PsyCon Denver

> **Audience:** Clinical director / medical director / COO scanning a QR code on a convention floor.
> **Time budget:** 60 seconds on an iPhone SE before the phone goes back in their pocket.
> **One job:** Risk reduction + product credibility + one CTA above the fold.

---

## Current State Assessment

The current `Landing.tsx` (1,114 lines) is written for a **practitioner-first** audience — solo therapists and facilitators looking to "Elevate your practice." The hero headline, Global Alliance framing, and "Frankenstein Stack" copy all speak to individual practitioners.

The PsyCon Denver buyer is **enterprise**: a clinic owner or medical director evaluating institutional liability exposure and ROI. They are not looking for a practice management tool — they are evaluating whether PPN can replace their existing compliance infrastructure and give them a legal defensibility story.

**The pivot required:** Individual empowerment → Institutional risk reduction + clinical intelligence.

---

## Architecture: 6-Section Overhaul

### Section 1: Hero

**Headline:** `Clinical Intelligence Built for Psychedelic Therapy.`
**Subheadline:** `Zero PHI. Zero liability. Full outcomes intelligence.`

**Why this works:** "Zero PHI" is the opening argument for the institutional buyer — it answers the subpoena risk question before they ask it. "Full outcomes intelligence" anchors the product promise.

**Primary CTA:** `Request Clinic Access →` (full-width on mobile, links to `/waitlist`)

**Trust bar (below CTA, monospace/tabular font):**
```
21 CFR Part 11 Compliant  ·  HIPAA Architectural Exemption  ·  OHA OAR 333-333 Aligned
```

**Right column visual:** Replace the current animated dashboard widget with a static screenshot montage — 2–3 overlapping `.webp` screenshots from `Marketing-Screenshots/webp/`:
- Primary: `Clinic Performance Radar.webp` (benchmarking = enterprise value prop)
- Secondary (offset, partial): `Safety Performance Benchmark.webp`
- Accent badge: `Patient Flow Sankey Diagram.webp` (small, lower-right)

**Mobile behavior:** Single column. CTA `w-full`. Trust bar wraps to 3 lines. Screenshots stack below copy.

---

### Section 2: Agitation — The Liability Walled Garden

**Headline:** `Operating in the dark carries existential risk.`

**Body:** The moment a system stores a patient name next to a Schedule I substance protocol, the institution assumes significant legal and financial exposure. Most platforms were not designed for this.

**3 animated stat callouts (stagger on scroll):**
| Stat | Label |
|------|-------|
| `$10.8M` | Average cost of a healthcare data breach (IBM Cost of a Data Breach, 2023) |
| `$500k+` | Annual HIPAA compliance infrastructure overhead |
| `Unlimited` | Regulatory subpoena exposure from identifiable records |

**Mobile:** 1-column stack. Stats: large `text-4xl` number, `text-sm` label below. Stagger animation: 0.15s delay between each.

**Design note:** Use amber/warning palette for this section — `text-amber-400`, `border-amber-500/30 bg-amber-500/5` — to signal risk. Do not use red (reserved for safety alerts inside the app).

---

### Section 3: The Phantom Shield

**Headline:** `The Phantom Shield: Zero-Knowledge by Design.`

**Body:** PPN captures zero Protected Health Information by architectural design. Cryptographic Subject IDs eliminate breach liability and subpoena risk at the host institution level. If the system were breached, there would be nothing of value to disclose.

**3 pillar cards (hover state = flip or border glow):**

| Card | Headline | Body |
|------|----------|------|
| 🛡 | **Subpoena Immunity** | Patient identity cannot be disclosed from a system that never recorded it. |
| 💰 | **$0 Breach Liability** | If the system were ever breached, there would be nothing of value to take. |
| 📊 | **Legal Benchmarking** | Because PPN stores no PHI, it is the only platform that can legally benchmark outcomes across a clinical network. |

**Mobile:** 1-column stack. Cards: `h-auto`, tap triggers the hover glow state.

**Design note:** Indigo (`#4F46E5`) accent for this section — "calm authority." Use the existing `AdvancedTooltip` component on "Cryptographic Subject IDs" → tooltip body = the existing Zero-PHI explanation from `Landing.tsx` line 545–558.

---

### Section 4: The Product — Interactive Clinical Intelligence

**Headline:** `Real-Time Intelligence, Not Retrospective Charting.`

**Tab interface (3 tabs — mobile: accordion):**

| Tab | Label | Content |
|-----|-------|---------|
| 1 | `60-Second Interaction Checker` | Screenshot: `Substance Monograph - 4 Interactions.webp` + caption: "Cross-checks every medication against your selected protocol before treatment begins." Link: `/partner-demo` |
| 2 | `Efficacy Trajectory` | Screenshot: `Efficacy Trajectory Timline.webp` + caption: "PHQ-9 outcome curves from baseline through integration. Per patient, per protocol." |
| 3 | `Clinic Performance Radar` | Screenshot: `Clinic Performance Radar.webp` + caption: "Benchmark your site against the anonymized network. Identify gaps before they compound." |

**Constraint (per GO-660 brief):** Use `.webp` screenshots from `Marketing-Screenshots/webp/`. No new live chart components. Static or screenshot-based only for Denver.

**Active tab state:** Indigo underline indicator. Screenshot fades in with 200ms ease. On mobile, accordion chevron rotates.

---

### Section 5: Interoperability

**Headline:** `Structured for Meta-Analysis. Ready for the IRB.`

**Body:** Every data point entered into PPN maps to a validated international standard. Your cohort data is IRB-submission-ready the moment it is logged.

**Standards table:**

| Standard | Domain | Use Case |
|----------|--------|----------|
| RxNorm | Drug nomenclature | Protocol identification and safety cross-checks |
| MedDRA | Adverse events | Regulatory-grade adverse event coding |
| UCUM | Units of measure | Dose, weight, volume — machine-readable |
| LOINC / SNOMED | Clinical observations | Assessment scores and clinical findings |

**Mobile:** Table becomes a stacked card list. Each row = a card with standard name as heading, domain as subheading, use case as body.

---

### Section 6: The Close — Frictionless Rollout CTA

**Headline:** `The 30-Day Frictionless Rollout.`

**Body:** We own the onboarding entirely. Zero session downtime. PPN-led staff training. Fully operational in 30 days — or we extend your trial at no cost.

**Secondary lead capture form:**
| Field | Type | Placeholder |
|-------|------|-------------|
| Full Name | text | `Your name` |
| Institution | text | `Clinic or organization name` |
| Role | text | `Medical Director, COO, etc.` |
| Professional Email | email | `your@institution.com` |
| [Request Clinic Access] | submit (indigo, `w-full`, `h-12`) | — |

**Submission:** Inserts to `log_waitlist` table (existing schema — no migration needed per GO-660 brief).

**Mobile:** Single-column, all inputs `w-full`, submit `h-12`.

**Trust footnote below form:** `🔒 Institutional inquiries only. No PHI collected in this form.`

---

## UI Standards Compliance Pre-Check

Per ppn-ui-standards SKILL requirements — flagged before BUILDER receives ticket:

| Rule | Status | Note |
|------|--------|------|
| Rule 1 — Mobile-first grids | ✅ Specified | All sections: `grid-cols-1`, upgrade via `md:` |
| Rule 2 — No text-xs | ✅ Specified | Trust bar and table: `text-sm` minimum |
| Rule 3 — Touch targets | ✅ Specified | CTA: `h-12`; form inputs: `h-12` |
| Rule 4 — No em dashes | ✅ Compliant | All copy uses standard punctuation |
| Rule 5 — Font: Inter only | ✅ Specified | Trust bar: tabular font variant of Inter, not JetBrains Mono |
| Rule 6 — Phase palette | ✅ Compliant | Amber (agitation), Indigo (shield), Indigo (CTA) — no violet |
| Rule 7 — No w-[Npx] layout | ✅ Specified | No hardcoded pixel widths on containers |
| INSPECTOR mobile gate | ⚠️ Required | 375px screenshot required before Phase 4 passes |

---

## Screenshot Assets Confirmed

Available in `public/screenshots/Marketing-Screenshots/webp/`:

| Section | Asset | Status |
|---------|-------|--------|
| Hero right col (primary) | `Clinic Performance Radar.webp` | ✅ Confirmed |
| Hero right col (secondary) | `Safety Performance Benchmark.webp` | ✅ Confirmed |
| Hero right col (accent) | `Patient Flow Sankey Diagram.webp` | ✅ Confirmed |
| Tab 1 — Interaction Checker | `Substance Monograph - 4 Interactions.webp` | ✅ Confirmed |
| Tab 2 — Efficacy Trajectory | `Efficacy Trajectory Timline.webp` | ✅ Confirmed |
| Tab 3 — Clinic Radar | `Clinic Performance Radar.webp` | ✅ Confirmed |

---

## Open Questions for LEAD

1. **Hero visual direction:** Static screenshot montage (recommended — safe for Denver) or keep the existing animated dashboard widget? The animated widget uses Recharts and works, but the screenshot montage communicates enterprise benchmarking more directly.
2. **Existing sections to keep:** The "Frankenstein Stack" section (lines 439–575 in Landing.tsx) and "How It Works" 4-step section do not appear in the GO-660 brief. Should they be removed, preserved below the 6 new sections, or culled to condense the page for mobile?
3. **Front-door coordination lock:** GO-660 brief includes `ForClinicians.tsx`, `ForPayers.tsx`, `Pricing.tsx`, etc. as a coordinated all-or-nothing deploy. Is the landing page the only priority for Denver, or must all 8 front-door pages be rebuilt before any go live?
4. **Lead capture table:** The brief says submit to `log_waitlist`. Is this the same table the existing WaitlistModal uses, or a separate institutional inquiry table?
5. **AllianceWall component:** Currently used in `Landing.tsx`. Keep it in the new layout? The enterprise buyer may not be moved by a "founding practitioner" marquee.

---

## DESIGNER Stitch Prompts (for 03_MOCKUP_SANDBOX)

Ready after user approves this CONTENT_MATRIX.

### Prompt 1 — Hero Section
```
Design a dark-mode enterprise SaaS landing page hero section for PPN Portal, a psychedelic therapy clinical intelligence platform targeting medical directors and clinic COOs. Background: deep slate #020408. Inter font throughout, 14px minimum. Left column: headline "Clinical Intelligence Built for Psychedelic Therapy." in 64px bold Inter, subheadline "Zero PHI. Zero liability. Full outcomes intelligence." in 24px, full-width indigo CTA button "Request Clinic Access →", monospace trust bar below ("21 CFR Part 11 Compliant · HIPAA Architectural Exemption · OHA OAR 333-333 Aligned") in text-sm. Right column: dark glassmorphism panel with 3 overlapping clinical dashboard screenshots (radar chart primary, safety benchmark secondary offset right, sankey diagram accent lower-right). Mobile-first: single column on mobile, CTA full-width. Premium clinical dark mode aesthetic.
```

### Prompt 2 — Phantom Shield Section
```
Design a dark-mode "Phantom Shield" section for PPN Portal landing page. Background #020408. Headline "The Phantom Shield: Zero-Knowledge by Design." in bold Inter. Below: 3 glassmorphism cards in a horizontal row (1 col on mobile): Card 1 — shield icon, "Subpoena Immunity", body text 14px. Card 2 — dollar icon, "$0 Breach Liability", body text. Card 3 — bar chart icon, "Legal Benchmarking", body text. hover state: indigo border glow (box-shadow: 0 0 20px rgba(79,70,229,0.3)). Indigo accent color only. No purple or violet. Premium glassmorphism with border-white/10.
```

### Prompt 3 — Product Tab Interface
```
Design a dark-mode 3-tab product showcase section for PPN Portal landing page. Background #020408, Inter font. Headline "Real-Time Intelligence, Not Retrospective Charting." Below: horizontal pill tab bar (3 tabs: "60-Second Interaction Checker", "Efficacy Trajectory", "Clinic Performance Radar") — active tab has indigo underline indicator. Tab content area: dark panel with a large clinical dashboard screenshot placeholder (labeled with tab name), 1–2 sentence caption below. On mobile, tabs become an accordion with chevron rotation. Premium dark SaaS aesthetic.
```

### Prompt 4 — Close / Lead Capture
```
Design a dark-mode lead capture CTA section for PPN Portal landing page. Background #020408. Headline "The 30-Day Frictionless Rollout." bold Inter. Body text 16px. Below: a glassmorphism form card with 4 fields (Full Name, Institution, Role, Professional Email) — all full-width, h-12, dark inputs with border-white/10. Primary submit button: "Request Clinic Access" indigo, full-width, h-12. Footer note: "🔒 Institutional inquiries only. No PHI collected in this form." in text-sm text-slate-500. Premium clinical dark mode aesthetic.
```

==== MARKETER ====
