---
id: GO-658
title: "PsyCon Denver 2026 — Two-Sided Print Leave-Behind"
owner: MARKETER
authored_by: PRODDY
status: 00_BACKLOG
priority: P0
created: 2026-03-23
epic_type: Print_Asset
target_audience: "Multi-site premium clinic networks and licensed psychedelic therapy practitioners at PsyCon Denver, April 9, 2026"
notebook_source: "N/A"
prototype_reference: "public/internal/admin_uploads/denver-2026/PPN_Leave_Behind_Print.html"
growth_order_ref: ""
stage_waived_by: ""
print_deadline: 2026-04-05
event_date: 2026-04-09
quantity: 25
---

## Brief

Two-sided US Letter print leave-behind for PsyCon Denver (April 9, 2026). Handed to qualified prospects at the booth immediately after the demo or after entering email. The artifact must be legible in 90 seconds without verbal explanation.

A prototype HTML draft exists at `public/internal/admin_uploads/denver-2026/PPN_Leave_Behind_Print.html` — MARKETER reviews and refines the copy, DESIGNER validates the layout, BUILDER implements any copy or layout corrections, INSPECTOR runs the `ppn-ui-standards` print pre-flight checklist before USER approves for print.

**Print deadline: April 5, 2026. No extensions.**

---

## MARKETER Task List

1. **Side A — Review and refine all copy:**
   - Company wordmark, tagline (`The first clinical documentation platform built for psychedelic therapy practitioners`)
   - Sub-tagline (`Document every treatment. Benchmark every outcome. Protect every patient — without storing a single name.`)
   - Zero-PHI badge text
   - Phase 01 / 02 / 03 card headings and bullet features (4 bullets each)
   - Guarantee bar (three columns: Architecture / Record Integrity / Audit Compliance)
   - Footer tagline and Founding Cohort CTA line

2. **Side B — Review and refine all copy:**
   - Section label: `The Practitioner Network`
   - H2: `Every session logged makes you smarter.`
   - Body paragraph (network intelligence description)
   - Four feature card titles and body text (Clinic Performance Radar / Cross-Site Benchmarking / Efficacy Trajectory / Structured Export)
   - Researcher section label and four standards grid items (RxNorm / MedDRA / UCUM / LOINC)
   - Two QR block CTAs and description lines

3. **Verify against brand rules:**
   - No em dashes anywhere
   - Brand name is always `PPN Portal` — never `PPN` alone as a standalone brand reference
   - Founding Cohort urgency: Spring 2026 / April 9 framing
   - No grey-market, patient, insurance, or researcher-primary messaging

4. **Produce `CONTENT_MATRIX.md`** and place it in `01_DRAFTING/` for USER review before any DESIGNER or BUILDER action.

---

## Reference Assets

- **Prototype HTML:** `public/internal/admin_uploads/denver-2026/PPN_Leave_Behind_Print.html`
- **QR codes:** Embedded as base64 in the prototype (`ppnportal.net/join` and `ppnportal.net`)
- **Strategy doc:** `public/internal/admin_uploads/strategy/Landing-Page-and-Denver-Launch-03-22-26.md`
- **Demo script (for tone matching):** `public/internal/admin_uploads/denver-2026/PsyCon_Demo_Script_April9.md`

---

## Audience-Specific Exclusions

- No grey-market or facilitator language
- No patient-facing or self-reporting references
- No insurance or payor messaging
- No academic research-first framing — researchers are secondary, clinic directors are primary

---

## Fast-Lane Flag

DESIGNER mockup pass is **required** before BUILDER implements any copy changes. The prototype HTML exists and may be used as the direct implementation base — BUILDER does not start from scratch. DESIGNER reviews Side A and Side B layouts against `ppn-ui-standards` Rule 5 (print) and Rule 7 (public-facing polish) and notes any layout corrections needed.

---

## INSPECTOR QA Gate (06_QA)

INSPECTOR must complete the full `ppn-ui-standards` **Print Pre-flight Checklist** (Rule 5) before USER review:

- [ ] `@page { size: letter; margin: 0.6in; }` present
- [ ] `@media print` block hides all nav
- [ ] Background is `#ffffff` — Side B dark navy must have `print-color-adjust: exact`
- [ ] All images have explicit `width` defined
- [ ] `break-inside: avoid` applied to phase cards, guarantee bar, network cards, standards grid
- [ ] PPN wordmark visible in header (Side A)
- [ ] Footer: document title, date, legal line on every page
- [ ] Fonts loaded from Google Fonts `@import` (Inter + Roboto Mono only — not JetBrains Mono)
- [ ] All text passes 4.5:1 contrast on white (Side A) and on `#0a1628` navy (Side B)
- [ ] No em dashes in any rendered text
- [ ] QR codes scan correctly on iPhone Safari (physical test — flag to USER if untested)

---

## Acceptance Criteria

- [ ] MARKETER `CONTENT_MATRIX.md` filed and USER-approved at `02_USER_REVIEW`
- [ ] DESIGNER layout review complete and any corrections noted at `03_MOCKUP_SANDBOX`
- [ ] USER approves final design at `04_VISUAL_REVIEW`
- [ ] BUILDER implements all approved copy and layout corrections
- [ ] INSPECTOR completes print pre-flight checklist — all items pass
- [ ] USER opens final HTML in Chrome → Print → US Letter, no margins, confirms both pages render correctly
- [ ] Print order placed by April 5, 2026
- [ ] 25 copies in hand by April 8, 2026 (day before event)
