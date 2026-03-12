---
id: GO-591-BUILD
owner: BUILDER
status: 05_IMPLEMENTATION
authored_by: MARKETER
routed_by: PRODDY
priority: P1
created: 2026-03-12
approved_by: USER
approved_date: 2026-03-12
approved_wireframe: _GROWTH_ORDERS/04_VISUAL_REVIEW/Clinical_Front_Door_Wireframe.html
approved_design_system: _GROWTH_ORDERS/03_MOCKUP_SANDBOX/design.md
source_content_matrix: _GROWTH_ORDERS/01_DRAFTING/WO-559_Variation_1_Clinical_Matrix.md
epic_ref: _GROWTH_ORDERS/00_BACKLOG/GO-591_Front_Door_Epic.md
target_route: /for-clinicians (or new public route — LEAD to confirm)
---

# BUILDER TICKET — GO-591: Clinical Front Door Landing Page (Variation 1)

## Status
USER approved wireframe layout on 2026-03-12. BUILDER implements live React page now.
Read all three source documents above before writing any code.

---

## What To Build

A public-facing React landing page for the **Clinical Audience** (licensed practitioners/therapists).
This is **Variation 1** of the Front Door Epic (WO-559). Variations 2-5 reuse this blueprint component.

---

## Layout Structure (USER-approved — do not deviate)

The approved section order from `Clinical_Front_Door_Wireframe.html`:

1. **Nav** — Logo + wordmark + 2 nav links + Sign In CTA (pill button, right-aligned)
2. **Hero Section** — Eyebrow badge + H1 + H2 subtitle + Primary CTA + Secondary CTA (both above fold)
3. **Hero Image** — Full-width abstract visual (generate with image tool using the prompt in `design.md`)
4. **3-Column Benefit Cards** — Frictionless Documentation · Zero-PHI Architecture · Global Benchmarking
5. **Trust Signal** — Centered pull quote, full-width
6. **Footer CTA** — H2 + body + single primary CTA, full-width centered

---

## Design System (from approved `design.md`)

| Token | Value |
|---|---|
| Background | `bg-slate-950` (`#020408`) |
| Surface/Cards | `bg-slate-900/60 backdrop-blur-md border border-white/10` |
| Primary Text | `text-slate-50` |
| Secondary Text | `text-slate-400` |
| Accent | `bg-indigo-600 hover:bg-indigo-500` |
| H1 | `text-4xl md:text-5xl font-semibold tracking-tight` |
| H2 | `text-2xl font-medium tracking-tight` |
| H3 | `text-xl font-medium tracking-tight text-slate-200` |
| Body | `text-base text-slate-300 leading-relaxed` (min 14px) |
| Primary Button | `px-6 py-3 rounded-full bg-indigo-600 text-white font-medium transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-600/20` |
| Secondary Button | `px-6 py-3 rounded-full bg-slate-800 text-white font-medium transition-all duration-200 hover:scale-[1.02] hover:bg-slate-700 border border-slate-700 active:scale-[0.98]` |

---

## Copy (from approved `WO-559_Variation_1_Clinical_Matrix.md`)

| Element | Copy |
|---|---|
| H1 | `Elevate Your Practice with Zero-PHI Clinical Intelligence.` |
| H2 subtitle | `The first documentation and network intelligence platform built specifically for psychedelic therapy practitioners. Log sessions effortlessly, benchmark your outcomes against a global peer network, and guarantee absolute patient anonymity.` |
| Primary CTA | `Join the Network` |
| Secondary CTA | `View Demo Showcase` (links to `trevor-showcase.html`) |
| Benefit 1 H3 | `Documenting a treatment should be as natural as conducting one.` |
| Benefit 2 H3 | `Absolute privacy. Zero compromise.` |
| Benefit 3 H3 | `Smarter decisions with every session logged.` |
| Trust Quote | `"PPN is creating the gold standard for clinical documentation in the evolving field of psychedelic medicine."` |
| Footer H2 | `Ready to join the vanguard of psychedelic medicine?` |
| Footer CTA | `Create Your Zero-PHI Account Now` |

(Full body copy for each benefit in the content matrix file.)

---

## SEO Requirements (from content matrix frontmatter)

- `<title>`: `Zero-PHI Clinical Outcomes Tracking for Psychedelic Practitioners`
- `<meta name="description">`: `Join the Psychedelic Practitioner Network to effortlessly track patient outcomes, benchmark against global peers, and maintain zero-PHI compliance.`
- JSON-LD schema type: `MedicalOrganization`
- JSON-LD description: `The Psychedelic Practitioner Network (PPN) provides secure, zero-PHI clinical documentation and outcome benchmarking tools for psychedelic therapists and clinicians.`
- Internal link: `practitioner capabilities showcase` → `trevor-showcase.html`

---

## Open Question for LEAD (resolve before build)

1. What is the target route for this page? (`/for-clinicians`, a new `/` public route, or a standalone public HTML page like `phantom-shield.html`)?

---

## Acceptance Criteria

- [ ] Page renders correctly on mobile (390px) and desktop (1280px)
- [ ] All 6 sections present in approved order
- [ ] H1 is the single `<h1>` on the page
- [ ] `<title>` and `<meta name="description">` present via Helmet or equivalent
- [ ] JSON-LD `MedicalOrganization` schema block present
- [ ] Hero image generated using the prompt in `design.md` and embedded
- [ ] Passes `ppn-ui-standards` audit
- [ ] Passes `marketing-qa-checklist`
- [ ] Passes `inspector-qa-script`
