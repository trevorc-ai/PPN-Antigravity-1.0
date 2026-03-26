---
id: WO-644
title: "Denver Leave-Behind — One-Page Print Artifact"
owner: PRODDY
authored_by: PRODDY
routed_by: LEAD
status: 98_HOLD
priority: P1
created: 2026-03-17
routed_at: 2026-03-17
depends_on: WO-642
skip_approved_by: ""
hold_reason: "Misrouted to 04_BUILD without INSPECTOR 03_REVIEW clearance. Print design artifact owned by PRODDY — requires Figma/Canva layout, QR codes, and USER visual approval. Not a BUILDER code task."
held_at: "2026-03-25"
failure_count: 0
completed_at: ""
builder_notes: ""
skills: []
---

## Context

Conference attendees who see the demo need something physical to take away. A business card
is too small. A brochure is too much. A single well-designed page (front and back) that can
be read in 90 seconds is the correct format.

This WO produces a print-ready PDF leave-behind for PsyCon Denver.

---

## Content Specification

### Side A — The Platform

```
PPN | Psychedelic Practitioner Network
ppnportal.net

The first clinical documentation platform built
specifically for psychedelic therapy practitioners.

────────────────────────────────────────

PHASE 1 — PREPARATION
Structured safety screening · Contraindication detection
Consent documentation · Set & Setting intake

PHASE 2 — FACILITATION
Real-time vitals monitoring · Dose event logging
Session timeline · Safety event classification

PHASE 3 — INTEGRATION
MEQ-30 · PHQ-9 · Longitudinal outcome tracking
Behavioral change monitoring · Integration session logs

────────────────────────────────────────

Zero PHI. Zero free text in clinical tables.
Every selection is a governed reference code.
Every session is a permanent, immutable record.
```

### Side B — The Network Vision

```
What's next: the practitioner network

Every practitioner who documents a session
is building a profile — not by filling out a form,
but by doing their work.

When you've logged 30 preparation sessions,
the system knows you're a preparation specialist.
When a colleague needs that expertise, it surfaces you.

The network is opt-in. Pseudonymous. Governed.
Phase-specialized. Globally connected.

────────────────────────────────────────

For researchers and institutional partners:

· Controlled vocabulary — same codes across every site
· Validated instruments — PHQ-9, GAD-7, MEQ-30, CEQ, PCL-5, C-SSRS
· Benchmark cohorts — published trial data for direct comparison
· Zero-PHI architecture — HIPAA Safe Harbor-compliant by design
· Audit-defensible — append-only correction model, full audit trail

────────────────────────────────────────

[QR — ppnportal.net/join]    [QR — ppnportal.net]
Join the Network             See the Platform
```

---

## Design Requirements

- **Format:** US Letter, landscape or portrait (PRODDY decides based on layout)
- **Colors:** Dark navy palette consistent with platform (`#0a1628`, `#8B9DC3`, white)
- **Print-safe:** White or very light background — no dark fills that waste ink
- **Typography:** Inter or similar geometric sans-serif. Not decorative.
- **QR codes:** Two — one for `/join`, one for main platform. Both tested before print.
- **No stock photography, no illustrations**

---

## Acceptance Criteria

- [ ] PDF produced and print-tested on standard laser printer, white paper
- [ ] Both QR codes scan correctly on iPhone Safari
- [ ] Readable in 90 seconds by someone with no prior PPN context
- [ ] Reviewed and approved by USER before printing
- [ ] 25 copies minimum printed before April 6, 2026

---

## Constraints

- Single page (two sides). Not a brochure. Not a slide deck.
- Must be legible without explanation — it will be read without the USER present.
- ppnportal.com is NOT referenced — the network is described as "what's next," not as live.

---

## LEAD Architecture

**Routing Decision:** PRODDY produces PDF using design tools (Figma, Canva, or similar).
Not a code deliverable — a print design artifact. Target complete: March 31, 2026.
Print deadline: April 5, 2026 (48h before conference).
