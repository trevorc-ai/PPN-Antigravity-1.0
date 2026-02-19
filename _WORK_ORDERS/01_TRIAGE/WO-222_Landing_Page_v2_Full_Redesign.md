---
status: 01_TRIAGE
owner: PRODDY
failure_count: 0
priority: HIGH
created: 2026-02-19
---

# WO-222: Landing Page v2 — Full Redesign

## User Feedback (verbatim, 2026-02-19)
> "This needs serious work on the copy... doesn't look very professional. Average at best from a marketing perspective."

**Specific issues identified by USER during live crawl:**

### Visual / Design
- [ ] **Background animation** — The "stars" effect is a bobbing grid/perpendicular line pattern, not a quality night sky. Needs to be replaced with something premium
- [ ] **Color inconsistency** — Colors in hero/body sections don't match the footer gradient palette. Needs a single consistent palette applied throughout
- [ ] **Gradient overuse** — Currently applied to random nouns/adjectives. Rule: gradients should ONLY highlight VOC keywords that will resonate emotionally with the practitioner audience
- [ ] **"Built for Safety / Designed for Growth" middle sections** — Crowded, bland, not colorful, not beautiful. Needs a full visual rework
- [ ] **Overall layout** — No logical story flow; by "Clinical Intelligence Infrastructure" a first-time visitor is bored and not compelled to continue

### Copy / Messaging
- [ ] **Fabricated stats** — Still being cleaned up (partially done). Zero tolerance going forward
- [ ] **"Network" → "Alliance"** — Favor the word "alliance" over "network" throughout all messaging
- [ ] **Vague headings** — Not what a senior copywriter from a top-tier agency would produce. Need to be specific, pain-point-driven, VOC-anchored
- [ ] **"Is your clinical workflow fragmented?" section** — Different background, confusing component with unexplained lines. Copy implies nothing actionable
- [ ] **No story or logical flow** — Page should take visitor on a journey: Problem → Agitation → Solution → Proof → CTA
- [ ] **Veterans section** — Currently the very last thing on page, an afterthought. No CTA, no story arc. Should be elevated, given a proper narrative frame

### UX / Interaction
- [ ] **Login button** — Not prominent enough / possibly disappearing at certain zoom levels
- [ ] **Dead links and buttons** — Several CTAs go nowhere or lead to broken flows
- [ ] **No clear CTA hierarchy** — Multiple CTAs competing; "Request Early Access" should be the single dominant action
- [ ] **Footer "spaceship" copy** — "GLOBAL SYNC ACTIVE", "IDENTITY GUARD", "SYSTEM SECURITY LOGIN" are sci-fi filler that undermine clinical credibility. Replace with plain, professional language (e.g., "System Status: Operational", "Secure Login")


---

## 📁 Reference Materials — READ BEFORE STARTING
`/public/admin_uploads/Landing_Page_Old_Artifacts/` — 20+ prior concept studies. Key files:
- `LANDING_CONCEPT_1_THE_CONSTELLATION.md` — visual concept study
- `LANDING_CONCEPT_2_THE_PRISM.md` — visual concept study
- `LANDING_CONCEPT_3_THE_PORTAL_SEQUENCE.md` — visual concept study
- `LANDING_CONCEPTS_EXECUTIVE_SUMMARY.md` — summary of all concepts
- `LANDING_PAGE_VISION.md` — original vision document
- `LANDING_PAGE_UX_AUDIT.md` — previous UX audit findings
- `LANDING_PAGE_ULTIMATE_REDESIGN.md` — most ambitious prior pass

Also: `/public/admin_uploads/Descript/` — 8 podcast transcripts with authentic VOC language (Frankenstein Stack, operating system framing, neuroplasticity window). **Mine these for headlines.**

---

## PRODDY Brief
Anchor the page narrative to the Descript transcripts (already in `/public/admin_uploads/Descript/`). Key themes to extract:
- **"The Frankenstein Stack"** — 5-10 hrs/week lost to context switching. This is the pain point for the hero.
- **"Operating System, not a Tool"** — the platform positioning
- **"Neuroplasticity Window"** — integration support differentiation
- **"Post-Certification Cliff"** — isolation pain point
- **Veteran PTSD angle** — move this UP the page, not to the bottom

Page narrative arc (suggested):
1. **Hero:** Name the pain (Frankenstein Stack / admin burnout)
2. **Agitation:** Show the cost (5-10 hrs/week, 60-70% churn, flying blind)
3. **Solution:** PPN is the OS — one tab, everything integrated
4. **Proof:** Safety infrastructure, de-identified outcomes, peer benchmarking
5. **Mission:** Veterans, the evidence base, why it matters
6. **CTA:** Request Early Access (invitation-only, founding practitioner)

## MARKETER Brief
- Write headlines and body copy at senior agency level — specific, pain-driven, zero filler
- Gradient highlights ONLY on VOC keywords: "admin burnout," "flying blind," "integration," "alliance"
- The word "alliance" over "network" throughout
- No fabricated stats anywhere — honest claims only
- "Request Early Access" as single dominant CTA

## DESIGNER Brief
- Replace background with a premium, subtle alternative (not a bobbing grid)
- Single consistent brand color palette — anchored to footer gradient as source of truth
- Veterans section redesigned with emotional weight and a real CTA
- "Built for Safety" middle sections: more breathing room, more color, more beautiful
- Gradient usage: strict rule — VOC keywords only

## BUILDER Notes (after DESIGNER handoff)
- Fix all dead links / broken CTAs
- Ensure login button is consistently visible across all zoom levels
- `network` → `alliance` swap in all remaining copy (partial fix already committed)

## Status
- [x] Fabricated stats removed from hero headline + subtext (committed 2026-02-19)
- [x] "Start Free Trial" → "Request Early Access" (committed 2026-02-19)
- [ ] Full v2 redesign — PRODDY leads
