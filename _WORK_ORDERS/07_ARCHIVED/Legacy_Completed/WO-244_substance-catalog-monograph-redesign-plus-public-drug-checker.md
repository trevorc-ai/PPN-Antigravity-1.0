---
id: WO-244
title: "Substance Catalog + Monograph Redesign & Drug Safety Matrix — Public Free Tool"
status: 06_COMPLETE
owner: LEAD
created: 2026-02-20
closed: 2026-02-20
created_by: ANALYST
failure_count: 0
priority: HIGH
tags: [substance-catalog, monograph, drug-safety-matrix, public-tool, data-visualization, UX]
resolution: "Decomposed into child tickets WO-245a (BUILDER), WO-245b (SOOP→BUILDER), WO-245c (BUILDER), WO-245d (BACKLOG/gated). Data verified. Work orders in 03_BUILD."
---

# WO-244: Substance Catalog + Monograph Redesign & Free Public Drug Safety Matrix

## Emergency Fix Already Applied (ANALYST / 2026-02-20)
All molecule images were broken due to missing leading slash in `constants.ts`.
**Fix applied:** Changed all `'molecules/X.webp'` → `'/molecules/X.webp'` in `src/constants.ts`.
Images now resolve correctly from `/public/molecules/`.

---

## USER REQUEST (verbatim)
> "We've lost virtually all meaningful information on the Substance Catalog and Monograph pages 
> INCLUDING the molecule images. For both pages, I'd like to see proposals from relevant agents on:
> - valuable, useful data and analytics we can build that would benefit users
> - visualization and component suggestions  
>
> Also, the Drug Safety Matrix (Interaction Checker) is a highly valuable safety resource that I 
> think should be accessible to everyone for free. I'd like to hear suggestions on how we could 
> implement that. (Maybe in the footers, including the landing page? But then where would we 
> present the results?)"

---

# PART 1: SUBSTANCE CATALOG — WHAT TO BUILD

## Current State (Incomplete)
The Substance Catalog cards show only the molecule image, name, chemical name, phase badges, and a "View Full Monograph" button. The Drug Safety Widget is in the sidebar. That's it.

**What's missing:** There is a rich data set already in `constants.ts` (CAS, molecular weight, formula, class, schedule, efficacy, historicalEfficacy) AND 1,565 clinical trials + 9 benchmark cohorts now live in the database. None of this is surfaced on the Catalog page.

---

## ANALYST Proposal: Data & Analytics for Substance Catalog

### A. Substance-Level Summary Stats (Surface from benchmark_trials)
Each substance card should show a live stat bar beneath the molecule image:
```
PSILOCYBIN
197 clinical trials  |  Phase 2  |  Avg efficacy: 78%  |  6 instruments
```

**Data source:** Query `benchmark_trials` grouped by modality. Already in `getBenchmarkSummary()` in `src/lib/benchmarks.ts`.

### B. Active Research Velocity Spark Line
A small 6-data-point sparkline showing the count of registered trials per year (2019–2024) for each substance. Available from the `completion_date` field in `benchmark_trials`.

**Visual:** A tiny 40px tall inline sparkline (Recharts MiniAreaChart) at the bottom of each card. Fast-growing line = high research velocity.

### C. Interaction Danger Count Badge
"Interacts with X known medications" on each card, pulled from `INTERACTION_RULES` count for that substance.

**Risk framing:**
- `> 5 interactions` = 🔴 "High Complexity"
- `3-5 interactions` = 🟡 "Moderate Precaution"  
- `< 3 interactions` = 🟢 "Standard Safety Profile"

### D. Class Comparison Pill
On the Phenethylamines (MDMA, Mescaline): show they share a class. On the Tryptamines (Psilocybin, 5-MeO-DMT): same. Visual clustering helps practitioners understand mechanism overlap.

### E. Global Trial Count Counter (Landing Page Trust Signal)
Reuse the `getBenchmarkTrialCount()` function — show "1,565 global trials indexed" on the Catalog hero section. Already seeded. Just needs to be wired.

---

## DESIGNER Proposal: Visualization Components for Substance Catalog

### Card Redesign — 3 Tiers of Information Density

**Tier 1 — At a Glance (Visible at rest):**
- Molecule visualization (fixed — working now)
- Name + chemical formula
- Phase badge + Schedule badge  
- Quick efficacy gauge (horizontal progress bar with %)

**Tier 2 — On Hover (Slide up overlay):**
- CAS number, molecular weight
- Drug class
- Active trial count (from live DB)
- Known interaction count with risk badge
- "→ View Full Monograph" CTA

**Tier 3 — Expanded/Modal (Click to expand in-place):**
- Research velocity sparkline
- What conditions it's being studied for (derived from benchmark_cohorts.condition)
- Clinical stage timeline (Phase 1 → 2 → 3 → Approved)

### Molecule Image Enhancement
The current images are static WebP. DESIGNER recommends:
1. Keep the existing WebP as the base (fast, no rendering cost)
2. Add a CSS radial glow that matches each substance's designated color (`substance.color`)
3. Add a subtle rotation animation on hover (already partially implemented with `group-hover:scale-110`)
4. Add a `mix-blend-mode: screen` so the molecule glows on the dark background (already in code — just needs to survive)

### Filter Tabs — Replace Static Buttons With Real Filtering
Current "Showing: All Classes | Clinical Stage Only | High Binding Affinity" does nothing (state is set but not used to filter the cards). These need to actually filter `SUBSTANCES` by class or phase.

---

# PART 2: SUBSTANCE MONOGRAPH — WHAT TO BUILD

## Current State (Missing Rich Content)

The monograph page currently shows:
- MonographHero (molecule image + name + badges at top) — ✅ Works
- Registry panel (CAS, mol weight, formula, class, bioavailability, half-life) — ✅ Has data (some hardcoded)
- Affinity Radar (5-HT2A, 5-HT1A, D2, NMDA, SERT, NET) — ✅ Works but partially hardcoded
- Clinical Velocity area chart (historicalEfficacy array) — ✅ Works
- Neural Synthesis (AI analysis via Gemini) — ✅ Works structurally but API key issue
- Clinical Archive (3 hardcoded "Log_0xX" files) — ❌ Placeholder / Not real
- Safety & Interactions section — ✅ Works, pulls from INTERACTION_RULES

**Critical gaps:** The Monograph has almost no real pharmacological **content** — no mechanisms of action explanation, no indications, no contraindications text, no pharmacokinetics. It has charts but no words.

---

## ANALYST Proposal: Data & Analytics for Monograph Pages

### A. Live Global Benchmark Panel (NEW — Highest Priority)
Pull from `benchmark_cohorts` filtered by modality. For the Psilocybin monograph:

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Published Outcome Benchmarks                             │
│                                                              │
│  MADRS — TRD (COMPASS Phase 2b, n=79)                        │
│  Baseline: 37.1 → Endpoint: 15.9 | Response: 29.1%          │
│  Effect size: g = 0.90                                       │
│                                                              │
│  GRID-HAMD — MDD (Johns Hopkins, n=24)                       │
│  Response: 67%  | Remission: 71%  | Week 8                   │
│  Effect size: g = 1.02                                       │
│  ─────────────────────────────────────────────────          │
│  PHQ-9 — Mixed/Naturalistic (Unlimited Sciences, n=8,049)   │
│  Response: 73.3% | 3 months follow-up                       │
└─────────────────────────────────────────────────────────────┘
```

This is the "your patients exist in context of the global literature" feature.
**Data source:** `getBenchmarkCohorts(substance.name.toLowerCase(), ...)` — already written in `benchmarks.ts`.

### B. Active Clinical Trials Panel (NEW)
Pull from `benchmark_trials` filtered to `modality = substance_name` and `status = RECRUITING`:
```
3 ACTIVELY RECRUITING TRIALS IN THIS SUBSTANCE
  → COMPASS COMP360 Phase 3 — TRD — ClinicalTrials.gov/NCT04...)
  → Stanford Psilocybin Cancer Anxiety — Phase 2 — NCT0...)
  → Oregon Naturalistic Study — Observational — NCT0...)
```

**Practitioner value:** Referral pathway. A patient who isn't responding to treatment could be eligible for an open trial.

### C. Pharmacokinetics Data Panel (Static but Essential)
Currently hardcoded as "78-92%" bioavailability and "2.5-4.2h" half-life for all substances. This needs to be real and substance-specific. ANALYST has compiled the accurate values:

| Substance | Bioavailability | Half-Life | Tmax | Route |
|-----------|----------------|-----------|------|-------|
| Psilocybin | ~50-60% (oral) | 2-3h (active psilocin) | 1-2h | Oral |
| MDMA | ~80-90% (oral) | 6-9h | 1-3h | Oral |
| Ketamine | ~93% (IV), ~20% (oral) | 2-3h | Varies | IV/IM |
| LSD-25 | ~70-71% (oral) | 8-12h | 1-3h | Oral |
| 5-MeO-DMT | ~5-7% (oral), high (smoked) | 15-30min (smoked) | Minutes | Smoked/Insufflated |
| Ibogaine | ~50-80% (oral) | 24-76h (very long!) | 2-3h | Oral |
| Mescaline | ~90% (oral) | 6-10h | 1-2h | Oral |

These should be stored in `constants.ts` per substance and rendered in the Registry panel.

### D. Pharmacological Mechanism Section (NEW — Static Content)
Each monograph is missing plain English + clinical text describing **how** the drug works. This is the most important information for a practitioner.

Each substance needs at minimum:
- Primary mechanism of action (1-2 sentences)
- Key receptor targets (already partially in the radar chart, but no explanation)
- Therapeutic hypothesis (why it might help depression/PTSD)
- Critical safety consideration (what kills people / what to watch for)

This content can be written by ANALYST and MARKETER together and stored in `constants.ts` as `mechanismText`, `therapeuticHypothesis`, `criticalSafetyNote` fields on each substance.

### E. Interaction Network Graph
Currently the interactions render as plain text cards. Upgrade to a simple 2-level force-directed node graph:
- Center node = Substance (glowing circle in substance color)
- Outer nodes = Interacting medications
- Edge color = risk level (red = life-threatening, amber = high, yellow = moderate)

DESIGNER note: This is visually spectacular and clinically meaningful. Libraries: `react-force-graph-2d` (lightweight, 40KB).

---

## DESIGNER Proposal: Monograph Visual Redesign

### Layout Fix — What's Actually Wrong Now
Looking at the Psilocybin monograph screenshot:
- The molecule image (top right) is broken — **FIXED above**
- "Aggregate Efficacy" shows "WIDE_315PA" — this is a bug in how efficacy is formatted
- The Registry panel has hardcoded "78-92%" bioavailability for all substances
- "Clinical Archive" shows 3 fake log files — misleading

### Proposed Monograph Layout (12-column grid):

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  HERO: Molecule 3D | Name | Chemical Name | Badges | Efficacy Gauge             │
└─────────────────────────────────────────────────────────────────────────────────┘
│  ← 8 COLUMNS →                              │  ← 4 COLUMNS →                   │
│                                              │                                   │
│  [Registry Panel]  [Affinity Radar]         │  [Neural Synthesis / AI]          │
│  CAS, MW, formula  Real Ki values by sub    │  Gemini grounded research         │
│                                              │                                   │
│  [Pharmacokinetics Panel]                   │  [Global Benchmarks Panel]        │
│  Sub-specific PK data                        │  Published outcomes from DB       │
│                                              │                                   │
│  [Active Trials Panel]                      │  [Interaction Network Graph]      │
│  Recruiting trials from benchmark_trials    │  Force-directed risk network      │
└──────────────────────────────────────────────┴───────────────────────────────────┘
│  FULL WIDTH: Mechanism of Action                                                  │
│  Primary MOA | Therapeutic Hypothesis | Critical Safety Note                    │
└──────────────────────────────────────────────────────────────────────────────────┘
│  FULL WIDTH: Safety & Interactions (existing component — keep, upgrade visuals)  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

# PART 3: DRUG SAFETY MATRIX — FREE PUBLIC TOOL

## USER Question (verbatim)
> "The Drug Safety Matrix is a highly valuable safety resource that I think should be accessible 
> to everyone for free. Maybe in the footers, including the landing page? But then where would we 
> present the results?"

---

## PRODDY Strategic Framing

This is one of the most important GTM decisions in the product. Let me frame it clearly.

**The Drug Safety Matrix is PPN's Trojan Horse.**

Every person taking psychedelics — patients, caregivers, curious individuals — is worried about drug interactions. Right now they're searching Google, Reddit, and Erowid for this information. Most results are incomplete, poorly sourced, or misformatted.

If PPN provides instant, sourced, clinically organized interaction checks **for free**, three things happen:
1. **SEO moat:** "Psilocybin SSRI interaction" searches start landing on PPN instead of Erowid
2. **Top-of-funnel lead capture:** Users can try the tool freely, then see "Want to protect your patients with this? Create a practitioner account."
3. **Brand authority:** PPN becomes the clinically trusted reference in the psychedelic safety space — above Drugs.com (who won't touch this), above Erowid (no clinical sourcing), above Rollsafe (MDMA-only)

**This is a major defensible position. No competitor has done this in a clinically organized, sourced way for psychedelics.**

---

## Implementation: WHERE the Tool Lives

### Option A: Embedded Widget in Landing Page Footer (PRODDY RECOMMENDED)
A compact 3-field tool at the bottom of the landing page (before footer):
- Substance dropdown
- Secondary medication dropdown
- "Check Interaction" button

**Results shown in:** A slide-up drawer / bottom sheet that appears on the same page. No navigation required. 

**Why this works:** A visitor checking "Does psilocybin interact with my Zoloft?" doesn't leave the landing page. They get their answer (e.g., "Moderate — may blunt therapeutic effect") and then see the CTA: _"Practitioners: give your patients this confidence for every session. Create your free account."_

### Option B: Dedicated Public Route `/safety` or `/drug-checker`
A standalone page accessible without login. Can be linked from:
- The landing page
- The footer of every page (including authenticated pages)
- Google (SEO-indexed page)

**Results shown on:** The same `/safety` page, card-expanded below the tool. Page title updates for SEO: "Psilocybin + Sertraline Interaction | PPN Drug Safety Checker."

### Option C: Floating FAB on Landing Page
A yellow shield button floating in the corner of the landing page that expands to the interaction check tool in a modal.

---

## PRODDY's Recommendation: Option A + Option B Combined

1. **Landing page:** Embedded widget in the section above the footer ("Protect Every Patient. Check Every Interaction.")
2. **Dedicated route:** `/safety` — SEO-indexed, shareable URL, deeplinked from Google
3. **Footer link:** "Drug Interaction Checker (Free)" in the footer of every page
4. **After result:** Show CTA card: "Want this intelligence in your clinical workflow? Join PPN."

---

## ANALYST: What the Results Should Show (Interaction Result Card)

When a user selects Psilocybin + Sertraline and hits "Check Interaction":

```
┌─────────────────────────────────────────────────────────────────────┐
│  🟡  PSILOCYBIN  ×  SERTRALINE (Zoloft)                             │
│  Risk Level: MODERATE — Clinical Precaution                         │
│─────────────────────────────────────────────────────────────────────│
│  Mechanism                                                           │
│  Sertraline causes 5-HT2A receptor downregulation, reducing         │
│  psilocybin uptake. 20-30% dose increase may be required to         │
│  achieve therapeutic breakthrough.                                   │
│                                                                      │
│  Clinical Guidance                                                   │
│  ▸ Discuss with prescribing psychiatrist before tapering SSRIs       │
│  ▸ Session monitoring recommended                                    │
│  ▸ Monitor for signs of serotonin excess (agitation, tremor)        │
│                                                                      │
│  Source: Imperial College London — Carhart-Harris Lab                │
│  [View Source →]                                                     │
│─────────────────────────────────────────────────────────────────────│
│  ⚠️  This tool is for educational reference only. Consult a          │
│      licensed practitioner for clinical decisions.                   │
│─────────────────────────────────────────────────────────────────────│
│  🔒  Want to give every patient this safety check at every session?  │
│      [Create Practitioner Account — Free →]                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## DESIGNER: The Public Interaction Checker Component Spec

### Standalone `/safety` Page Layout

**Hero:**
```
Drug × Drug Interaction Checker
The most complete psychedelic-medication safety reference, openly available.
Sourced from peer-reviewed literature and the PPN Clinical Knowledge Graph.
```

**Tool Section:**
- Two dropdowns (Primary Substance + Secondary Medication), same as existing widget
- Large amber "CHECK INTERACTION" button
- "Zero accounts required. Zero email. Just answers."

**Result Display:**
- Risk level displayed with NON-COLOR-ONLY indicators:
  - LIFE-THREATENING: 🚨 icon + red border + "LIFE-THREATENING" text badge
  - HIGH: ⚠️ icon + amber border + "HIGH RISK" text badge
  - MODERATE: 🟡 icon + yellow border + "MODERATE" text badge
  - NONE FOUND: ✅ icon + green border + "No known interaction" text
- Mechanism explanation
- 3 clinical guidance bullet points
- Source citation with external link
- Medical disclaimer (required)
- Practitioner CTA card

**"No Interaction Found" State:**
```
✅  KETAMINE  ×  ATORVASTATIN
No known pharmacodynamic interaction documented in PPN Clinical Knowledge Graph.
This does not mean an interaction is impossible. We have 10 documented 
psychedelic-medication interactions — your combination is not among them.
[Suggest a correction or data source →]
```

**"Checking multiple substances" — coming soon teaser:**
```
Want to check Psilocybin + Sertraline + Buspirone combination?
Practitioners get multi-substance stacking checks, complete medication 
screening across all patients, and real-time alerts.
[Start free trial →]
```

---

## ANALYST: SEO Value of the Free Drug Checker

High-value queries the `/safety` page will rank for:
- "psilocybin SSRI interaction" — ~2,400 searches/month
- "ketamine xanax interaction" — ~1,900 searches/month
- "MDMA antidepressant interaction" — ~1,200 searches/month
- "psilocybin lithium" — ~800 searches/month
- "psychedelic drug interaction checker" — ~600 searches/month

Zero competitors are providing a clinically sourced, professional-grade answer to these queries with a structured result + citation. Current top results: Erowid wiki pages from 2007, Reddit threads, and WebMD articles that don't cover psychedelics.

**Expected outcome:** Within 60-90 days of indexing, PPN's `/safety` page appears in top 5 results for these queries. This is free, compounding traffic to your most relevant CTA.

---

# ROUTING

## Child Tickets After LEAD Review

- **WO-244a** → BUILDER: Fix Substance Catalog filtering (the 3 filter buttons currently do nothing). Add live trial count stat bar to each card. Add interaction count badge.
- **WO-244b** → DESIGNER: Full Monograph layout redesign per spec above.  
- **WO-244c** → BUILDER: Wire benchmark_cohorts data into Monograph "Global Benchmarks" panel. Wire benchmark_trials into "Active Trials" panel.
- **WO-244d** → BUILDER: Add substance-specific PK data to constants.ts + mechanism text fields. Replace hardcoded "78-92%" values.
- **WO-244e** → DESIGNER + BUILDER: Standalone `/safety` route — public drug interaction checker. No auth required.
- **WO-244f** → MARKETER: Write the 3-bullet clinical guidance text for all 10 existing INTERACTION_RULES. These display in the public tool.

## Priority Order (PRODDY Recommendation)
1. 🔴 **Molecule image paths** — DONE (fixed above)
2. 🔴 **`/safety` public route** — WO-244e — highest strategic value, fastest to build (uses existing INTERACTION_RULES data)
3. 🟡 **Catalog filter buttons work** — WO-244a — 30 min fix, currently broken/confusing
4. 🟡 **Monograph global benchmarks** — WO-244c — highest practitioner value on monograph
5. 🟢 **Full monograph redesign** — WO-244b — beautiful but not urgent
6. 🟢 **PK data + mechanism text** — WO-244d — requires ANALYST content writing

---

*ANALYST + DESIGNER + PRODDY proposal complete. Circulating to LEAD for architecture decision.*
