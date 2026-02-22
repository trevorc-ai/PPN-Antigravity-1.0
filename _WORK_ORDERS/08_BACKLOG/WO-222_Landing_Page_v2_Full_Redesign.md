---
status: 02_DESIGN
owner: DESIGNER
failure_count: 0
priority: HIGH
created: 2026-02-19
proddy_complete: 2026-02-19
proddy_review_gate: REQUIRED — DESIGNER proposals must be approved by PRODDY before routing to BUILDER
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

---

## PRODDY STRATEGIC BRIEF (2026-02-19)

### Core Narrative Positioning

PPN Portal is not software. It is the operating infrastructure for a new category of medicine. The practitioner's problem is not "I need another tool." The problem is that they are running a serious clinical practice with a Frankenstein stack: five apps open at once, two spreadsheets, one inbox full of patient messages, and no way to know if what they are doing works.

The landing page must name that problem before it sells anything. A practitioner who feels seen in the first five seconds will read the rest of the page. One who feels sold to will leave.

### Narrative Arc (Section by Section)

**1. Hero — Name the pain**
- Primary pain: The Frankenstein Stack. "You are running a serious clinical practice on five apps, two spreadsheets, and a hope that everything stays HIPAA-compliant."
- Secondary pain: Flying blind. "There is no standard of care yet. You are making clinical decisions without benchmarks."
- The relief: "PPN is the operating system. One place. Every part of the practice."
- Dominant CTA: "Request Early Access"
- Visual: Premium starfield / dark cosmic background. No grid lines. No bobbing animation.

**2. Agitation — Show the cost**
- 5-10 hrs/week lost to context switching and admin (convert to: "5 hours of charting time per patient.")
- Post-certification isolation: practitioners leave training programs with no peer network. "You certified 6 months ago. You have seen 12 patients. You have no idea how you compare."
- The neuroplasticity window: "The 72 hours after a session are the most important. Most practices have no structured integration protocol."
- Format: Sparse. Three short, punchy statements. Let the silence do work.

**3. Solution — The OS framing**
- "PPN brings everything into one tab: your protocols, your outcomes, your safety checks, your benchmarks."
- Three capability pillars, each with one sentence: Protocol Builder / Safety Surveillance / Alliance Benchmarking
- No feature lists. Just what it does for the practitioner.

**4. Proof — Safety infrastructure + data**
- Interaction Checker: "Flag a contraindication before it becomes a crisis."
- De-identified outcomes: "Your data stays yours. What goes to the Alliance is anonymized and aggregated — never individual, never identifiable."
- Benchmarking: "See how your outcomes compare to the Alliance — without exposing your patients or your site."
- No fabricated stats. If we cite a number, it must be real.

**5. Mission — Veterans + the evidence base**
- Elevate this section. It is not an afterthought.
- The veteran PTSD angle: "MDMA-assisted therapy is showing 67% PTSD remission rates in Phase 3 trials. Veterans deserve practitioners who are supported by real data infrastructure."
- The field-building angle: "Every session you log contributes to the evidence base that will eventually determine whether this medicine gets covered by insurance."
- Tone: Quiet confidence. Mission-driven, not preachy.
- CTA: "Be part of what gets built"

**6. Final CTA — Invitation only**
- Reinforce scarcity and trust: "We are opening to 50 founding practitioners. Each site is reviewed."
- One button: "Request Early Access"
- Below button: "No credit card required. Reviewed by our clinical advisory board."

### VOC Keyword Map (gradient use approved on these words only)

From the Descript transcripts, these are the exact phrases practitioners use in their own voice:
- "admin burnout" — pain
- "flying blind" — pain
- "Frankenstein stack" — pain (use as quoted language if possible)
- "integration" — feature resonance
- "alliance" — community identity
- "neuroplasticity window" — clinical credibility
- "evidence base" — mission alignment

Gradient treatment: apply only to these phrases when they appear in hero or section headlines. Not to verbs, adjectives, or generic nouns.

### What MARKETER Writes

- Final headline copy for each of the 6 sections above
- Button labels and supporting micro-copy
- The Veterans section narrative (this is the most emotionally demanding copy on the page)
- FAQ section (if included): 3-4 questions maximum, focused on data privacy and invitation process
- Tone check: no em dashes, no "leverage", no "seamless", no rhetorical questions as headers

### What DESIGNER Executes

- Visual: Replace star grid with premium organic starfield (already built in `StarField.tsx` — use it)
- Color: Anchor to footer gradient as source of truth. Apply consistently across all sections.
- Gradient rule: VOC keywords only (see list above)
- "Built for Safety" middle sections: add breathing room, more color, less crowding
- Veterans section: emotional visual weight, real CTA button, story arc with image or illustration
- Login button: ensure consistent visibility across zoom levels (test at 80%, 100%, 125%)
- Remove footer sci-fi copy ("GLOBAL SYNC ACTIVE" etc.) and replace with professional equivalents

### Ready-to-Use Copy Fragments (MARKETER refines these)

Hero options:
- "The operating system for psychedelic wellness practice."
- "You certified. You practiced. You are flying blind. PPN changes that."
- "One tab. Every protocol, every outcome, every safety check."

Agitation options:
- "Five apps open. Two spreadsheets. No benchmarks. That is the current standard of care."
- "You finished training and walked into a room with no data, no peers, and no standard protocol."

Solution options:
- "Protocol Builder. Safety Surveillance. Alliance Benchmarking. One place."

### Handoff Sequence

> 🚨 **USER DIRECTIVE (2026-02-20):** DESIGNER must run all layout and visual proposals past PRODDY for strategic alignment review BEFORE routing to BUILDER. No code changes are made until PRODDY signs off. PRODDY should also check for any updates from recent USER conversations before approving.

1. **MARKETER** writes final copy for all 6 sections (this brief as source of truth)
2. **DESIGNER** creates layout proposals and visual direction (existing StarField.tsx approved, no recreating the wheel)
3. **→ DESIGNER submits proposals to PRODDY for review** — PRODDY checks:
   - Strategic alignment with the latest USER direction
   - VOC keyword usage (gradient treatment: approved list only)
   - No fabricated stats or overclaimed language
   - Narrative arc matches the 6-section structure (Pain → Agitation → Solution → Proof → Mission → CTA)
   - Any updates from recent USER ↔ PRODDY conversations that should change the brief
4. **PRODDY approves** → updates frontmatter `proddy_approved: true` and notifies LEAD
5. **BUILDER** implements copy and layout updates (only after PRODDY approval is on record)
6. **INSPECTOR** verifies: no fabricated stats, clinical credibility maintained, fonts ≥ 12px, no color-only status signals

**Owner:** MARKETER (copy) + DESIGNER (layout) | **PRODDY Gate:** Required before BUILDER | **Status:** Routing MARKETER + DESIGNER simultaneously
