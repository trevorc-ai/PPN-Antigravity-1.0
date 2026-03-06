---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-539 — Phase 3 Patient Visualizations (Magic Link Charts)
> **Authored by:** PRODDY  
> **Date:** 2026-03-04
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement
Psychedelic therapy patients experience high fear and confusion post-session when attempting to integrate intense subjective experiences without biological context. Without objective visual mapping, integration fails, leading to patient drop-off and lost clinical value for the provider. Current follow-up methods rely on subjective journaling rather than validating the experience through clinical neuroscience, breaking the feedback loop necessary to capture high-value longitudinal data.

---

### 2. Target User + Job-To-Be-Done
A post-session patient needs to visually map their subjective experience to the pharmacokinetic timeline and receptor data so that they feel biologically validated, reducing anxiety and increasing their willingness to self-report daily metrics via the Magic Link.

---

### 3. Success Metrics
1. The Dual-Mode Spider Graph successfully toggles and renders both biological and experiential axes with zero console errors across 10 test patient loads.
2. The Flight Plan Chart renders the pharmacokinetic area curve and overlays 3 distinct somatic zones (e.g., Stomach, Head, Chest) across the designated time axis without rendering overlaps.
3. Both charts pass automated WCAG AAA contrast ratio checks against the Deep Slate (`#020408`) background.

---

### 4. Feature Scope

#### ✅ In Scope
- A Dual-Mode Spider (Radar) Chart detailing pharmacological drivers (5-HT2A, D2) vs subjective experiences (Ego Dissolution, Sensory Alteration).
- A Flight Plan (Area) Chart mapping subjective intensity over time (Onset, Peak, Comedown) synchronized with somatic body zones.
- "Smart Tooltips" on both charts explaining the data at a 9th-grade reading level.
- Compliance with AGENT_VIZ's 14px typography and color-blindness mandates (incorporating appropriate stroke dashes and shapes).

#### ❌ Out of Scope
- Building the Supabase Magic Link generation or authentication architecture (this ticket is for visualizations only).
- Creating the Daily Pulse sliders or journal prompt components.
- Connecting the charts to a live database (they will accept mock/prop data structures for now).

---

### 5. Priority Tier

**[X] P1** — High value, ship this sprint  

**Reason:** These charts are the core "payoff" that makes the Magic Link irresistible to the patient. Without them, the patient has no incentive to self-report longitudinal data, which destroys the valuation multiplier of the Beta launch.

---

### 6. Open Questions for LEAD

1. Is Recharts performant enough to handle the Dual-Mode toggle animation seamlessly, or should we render two separate components and flip their opacity?
2. How should the Flight Plan Chart receive the timeline data: as a continuous array or as discrete phase blocks (Onset, Peak, Comedown)?
3. Does AGENT_FLO need to audit the raw SVG assets for the somatic body heatmap before AGENT_VIZ mounts them into the Recharts container?

---

### PRODDY Sign-Off Checklist
- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
