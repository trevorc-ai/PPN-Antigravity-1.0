---
id: WO-657
title: "Homepage Enterprise Overhaul — Denver Launch Positioning (ppnportal.net)"
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
routed_by: ""
priority: P1
created: 2026-03-22
depends_on: "WO-654 (Waitlist Overhaul — hero video and /partner-demo must exist before homepage links to them)"
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

The current `ppnportal.net` homepage is not positioned for the enterprise clinical buyer PPN is targeting at PsyCon Denver (April 9, 2026). Multi-site clinic directors and medical directors arriving by QR code will judge PPN's technical credibility within 3 seconds on an iPhone. The current page reads like a product overview for practitioners already familiar with the concept. It does not lead with the two things enterprise buyers need: immediate proof of differentiation (Zero-PHI architecture) and evidence the platform is real and live. The strategy review (2026-03-22) confirms: "the page makes the product look broad before it makes it look necessary."

---

### 2. Target User + Job-To-Be-Done

A multi-site clinic director or medical director arriving via QR code at PsyCon needs to immediately understand that PPN eliminates their HIPAA liability exposure through architectural design so that they trust the claim enough to watch the demo and request founding partner access — within one mobile screen.

---

### 3. Success Metrics

- Above-the-fold section communicates Zero-PHI differentiation without scrolling on a 390px-wide iPhone 15 viewport — verified by INSPECTOR screenshot at that breakpoint
- Waitlist CTA click-through rate from homepage to `/waitlist` increases measurably (baseline: current rate from Cloudflare/Supabase analytics at ship date; target: ≥ 20% lift over 14 days)
- Zero TypeScript or build errors introduced: `npm run build` passes clean

---

### 4. Feature Scope

#### In Scope

**Section 1 — Hero (above the fold on mobile)**
- Headline: `Clinical Intelligence Built for Psychedelic Therapy.`
- Subheadline: `Zero PHI. Zero liability. Full outcomes intelligence.` — max 2 lines on mobile
- Primary CTA button: `Request Founding Access →` — links to `/waitlist`
- Secondary CTA button: `Watch the 2-min Demo` — links to `/partner-demo` (requires WO-654 Sub-ticket A)
- Trust bar directly below CTAs (monospace font): `Zero PHI Architecture · Immutable Audit Trail · Clinical-Grade Infrastructure`
- Animated pulse indicator (existing pattern from waitlist eyebrow) next to a live signal: `Pilot Opens: Spring 2026`

**Section 2 — Agitation Block ("The Risk You're Carrying")**
- Headline: `Operating without de-identified infrastructure carries real risk.`
- Three stat callouts (animated count-up on scroll entry): `$10.8M` avg healthcare breach cost, `$500K+` annual HIPAA overhead, `Unlimited` subpoena exposure
- Brief copy: one sentence per stat, no jargon, no em dashes
- Dark background section — visually distinct from hero

**Section 3 — The Phantom Shield (PPN's moat)**
- Headline: `The Phantom Shield: Zero-Knowledge by Design.`
- Three pillar cards (hover-lift effect on desktop, tap-expand on mobile):
  1. **Subpoena Immunity** — Patient identity cannot be disclosed from a system that never recorded it
  2. **$0 Breach Liability** — If the system were ever breached, there is nothing of value to take
  3. **Legal Cross-Site Benchmarking** — PPN is the only platform that can legally benchmark outcomes across an entire clinical network
- Visual: shield icon with subtle glow animation — use existing indigo/emerald palette, no new design tokens

**Section 4 — Product Evidence (real screenshots, no placeholders)**
- Tabbed component: three tabs — `Interaction Checker`, `Efficacy Trajectory`, `Clinic Performance Radar`
- Each tab shows an actual screenshot from the live platform (BUILDER must source from `public/internal/` or the marketing screenshots directory)
- One-sentence caption per tab in clinical buyer language (no feature names, only outcomes)
- No interactive live data — static screenshots only per Denver timeline constraint

**Section 5 — Founding Partner CTA (close)**
- Headline: `We are accepting a limited founding cohort.`
- Body: two sentences max — founding pricing, direct team access, roadmap influence
- CTA: `Request Founding Access →` links to `/waitlist`
- Social proof: practitioner count from `log_waitlist` (same component as WO-654 Sub-ticket E, reused here)

#### Out of Scope

- The interactive React Interaction Checker demo (strategy doc recommends it; PRODDY is deferring this to post-Denver given the April 9 timeline — it would take 3+ days and introduce untested live state)
- Recharts/D3 interactive radar or efficacy chart embeds — static screenshots only for this sprint
- Backend FastAPI lead-capture microservice — Supabase + Resend already handles this
- "Download the Technical Specifications" lead magnet document — separate content production task
- Domain/DNS/hosting changes — existing Vite hosting remains unchanged
- Any changes to authenticated app routes, sidebar, or nav
- Multi-page architecture changes — this ticket modifies the existing home/landing component only
- Free email domain validation on the waitlist form — scope of WO-642

---

### 5. Priority Tier

**P1** — High value, ship this sprint. Not a demo blocker (the waitlist page works independently), but strategically critical for Denver credibility. WO-654 P0 tickets must ship first. Target: built and QA'd by April 5, 2026 — 4 days before Denver — leaving time for regression testing.

Downgrade to P2 if WO-654 P0 tickets are not shipped by March 28, as maintaining timeline buffer for Denver takes priority over homepage aesthetics.

---

### 6. Open Questions for LEAD

1. **Which file is the homepage?** PRODDY could not definitively identify the landing/marketing home component from the codebase search. LEAD must locate the correct component (likely `src/pages/LandingPage.tsx`, `src/pages/Home.tsx`, or `src/App.tsx` default route) before BUILDER touches anything.

2. **Screenshot sourcing:** BUILDER needs 3 actual platform screenshots for Section 4. LEAD should confirm which images from `public/internal/admin_uploads/` or `marketing-screenshots/` are approved for public-facing use (no PHI visible, no debug states, no placeholder data).

3. **Denver timeline gate:** Should INSPECTOR enforce a hard April 5 ship deadline to force the issue — or should LEAD retain discretion to defer Section 3 and 4 to post-Denver if the sprint falls behind? PRODDY recommends LEAD decide this up front rather than discovering it during QA.

4. **Practitioner count reuse:** Sub-ticket E in WO-654 introduces a `log_waitlist` count component. If WO-655 ships before WO-654, this component will not exist yet. LEAD must sequence these sprints so WO-654 ships first, or mark the practitioner count in WO-655 as blocked on WO-654 E.

5. **Navigation update:** The current nav does not prominently link to `/waitlist` from the homepage. Should BUILDER add a `Request Access` nav CTA as part of this ticket, or is that a separate layout freeze item requiring its own plan? Per our rules, any nav change is HIGH-RISK and requires explicit scope inclusion here.

---

## PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤ 100 words
- [x] PRD total is ≤ 1000 words
- [x] All 6 required sections present
- [x] Each success metric contains a measurable number or specific event
- [x] Out of Scope section is populated and prevents scope creep (interactive demo deferred explicitly)
- [x] Priority tier includes a reason and a hard date (April 5 ship, April 9 Denver)
- [x] Open Questions list has ≤ 5 items and none are answered by PRODDY
- [x] No TypeScript, React, SQL, or CSS authored in this document
- [x] Ticket filed in `00_INBOX` with correct frontmatter

---

✅ WO-655 placed in 00_INBOX. LEAD action needed: identify the homepage component (Open Question #1), confirm screenshot sourcing, and sequence after WO-654 P0 sub-tickets. Target build window: March 26 – April 5.
