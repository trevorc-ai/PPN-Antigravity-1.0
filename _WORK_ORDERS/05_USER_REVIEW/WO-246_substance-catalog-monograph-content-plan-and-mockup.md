---
status: 05_USER_REVIEW
owner: USER
failure_count: 0
priority: HIGH
created: 2026-02-21
gate: "USER must approve visual mockup before BUILDER writes any code"
---

# WO-246: PRODDY Content Strategy → DESIGNER Visual Mockup
## Substance Catalog + Monograph Pages

---

## PRODDY: MARKET ANALYSIS

### Who Is Using This

**Primary user:** Psychedelic-assisted therapy practitioner (psychiatrist, psychologist, licensed therapist with psychedelic certification). Clinically trained. Evidence-oriented. Time-constrained.

**Secondary user:** Clinical advisor, researcher, institutional review (e.g., Dr. Jason Allen, advisory board). Scientific. Will immediately evaluate the tool's molecular and pharmacological rigor. Credibility is earned or lost in the first 30 seconds.

### What the Market Currently Has (and Lacks)

| Resource | Molecular Structure | Toxicity/Risk | Drug Interactions | Clinical Trials | Evidence Synthesis |
|----------|-------------------|--------------|-------------------|----------------|-------------------|
| Erowid | ❌ | Partial | Partial | ❌ | Consumer-grade |
| Drugs.com | N/A (no psychedelics) | N/A | N/A | N/A | N/A |
| PubMed | ❌ | Raw literature | Raw literature | Raw data | None — raw only |
| RxList | N/A | N/A | N/A | N/A | N/A |
| PDSP Database | ❌ | ❌ | ❌ | ❌ | Academic only |
| **PPN** | **✅ 3D Interactive** | **✅ Must build** | **✅ Built** | **✅ Built** | **✅ Synthesized** |

**The two features with zero credible competition:** (1) Interactive molecular structure visualization → scientific rigor signal. (2) Toxicity & Risk Analysis → active clinical consultation need. Both must be built and prominently featured.

### Voice of the Market (Practitioner Pain Points)

1. *"I need to counsel patients who are combining their antidepressants with a retreat — there's nothing authoritative to point to."* → Drug Safety Matrix. Already built. Need to surface it.
2. *"I want to understand WHY psilocin works but only lasts 4 hours when LSD lasts 12."* → Molecular structure + receptor binding. Dr. Allen's exact use case.
3. *"My patient had a cardiac event during an Ibogaine session in Mexico. What should I know about the toxicity profile before I refer another patient?"* → Toxicity & Risk section. Currently absent from all tools.
4. *"I need something I can reference in front of a hospital board that demonstrates scientific credibility."* → Molecular visualization + Ki radar + citations. The board will not be impressed by a wellness app.

---

## PRODDY: CONTENT SPECIFICATION

---

### PAGE 1 — SUBSTANCE CATALOG
**Job-to-be-done:** "Give me a fast, credible overview of all 10 substances so I can orient, compare, and navigate."

#### WHAT BELONGS ON EACH CARD

**Visual Anchor — Molecular Structure**
The molecule image is not decoration. It is the primary credibility signal for scientific advisors. Every card leads with it. The image should be the most prominent visual element.
- Source: `.webp` molecular structure assets (isometric CSS 3D effect in Sprint 1; `MoleculeViewer` WebGL on Monograph)
- Glow color: substance-specific (already in `constants.ts`)
- Ayahuasca exception: show composite image of DMT + Harmine molecular structures (the two active components). Not botanical art — molecular chemistry.

**Identity Block**
- Substance name — large, primary
- IUPAC or common chemical name — secondary
- Drug class chip: `TRYPTAMINE` / `PHENETHYLAMINE` / `DISSOCIATIVE` / `BOTANICAL COMBINATION`

**Status Block**
- Regulatory badge: `FDA APPROVED` (Ketamine, Esketamine) / `PHASE 3` (MDMA) / `PHASE 2` / `PHASE 1` / `SCHEDULE I`
- For Esketamine specifically: dual badge — `FDA APPROVED` + `REMS PROGRAM`

**Clinical Signal**
- Aggregate efficacy bar (thin, substance-colored, percentage label)
- Known interaction count: `⚠️ 4 documented interactions` — links to `/safety` filtered by this substance

**Risk Indicator** ← NEW (currently absent from all competitor tools)
- Single-line risk classification chip:
  - `CARDIAC RISK` (Ibogaine — QTc prolongation)
  - `SEROTONIN SYNDROME RISK` (Ayahuasca — MAOI + SSRI)
  - `STANDARD MONITORING` (Psilocybin, Mescaline, DMT, LSD, 5-MeO-DMT)
  - `APPROVED · REMS MONITORING` (Esketamine)
  - `DISSOCIATIVE PROTOCOL` (Ketamine)
- This single line differentiates PPN from every competitor. No other tool surfaces risk classification at the catalog level for these substances.

**Navigate CTA**
- `View Full Monograph →` — full-width, bottom of card

#### CATALOG PAGE CHROME
- **Header:** "Substance Reference Library" · "10 substances · Clinical-grade pharmacological reference"
- **Filter bar:** All · Tryptamines · Phenethylamines · Dissociatives · FDA-Approved · Botanical
- **Search:** Text input — filter by name or chemical name (simple, fast)
- **Grid:** Responsive — 4 cols at 1440px, 3 cols at 1280px, 2 cols at tablet, 1 col at mobile

---

### PAGE 2 — SUBSTANCE MONOGRAPH TEMPLATE
**Job-to-be-done:** "Give me everything I need to know about this substance to practice safely and credibly."

This is a single template that renders for any of the 10 substances. Sections are component slots — each can be built and upgraded independently.

---

#### SECTION 1: HERO
| Element | What It Shows | Why |
|---------|--------------|-----|
| Molecular structure | Isometric CSS 3D → WebGL 3D (auth) | Scientific credibility. Dr. Allen's #1 ask. |
| Substance name | Large | Primary identifier |
| Chemical name + CAS | Secondary | Clinical reference standard |
| Class + Schedule badges | Chips | Fast regulatory read |
| Primary mechanism | One line: "5-HT2A Partial Agonism" | Most-asked pharmacology question |
| 3 stat pills | Efficacy · Duration · Primary Target | At-a-glance clinical summary |

---

#### SECTION 2: PHARMACOLOGICAL IDENTITY
*Left column — 7/12*

**2a. Registry Panel**
Standard pharmaceutical reference fields:
- CAS Number, Molecular Weight, Molecular Formula
- DEA Schedule, Drug Class
- Primary Routes of Administration
- Bioavailability (by route), Half-Life, Tmax
- Source citation for PK data

**2b. Mechanism of Action** ← Clinical narrative, 3 sub-sections
- **Primary Mechanism:** What receptor, what action, what functional consequence (2 sentences)
- **Therapeutic Hypothesis:** Why this receptor interaction may produce the observed therapeutic effect (2 sentences)
- **Critical Safety Signal:** The one thing every practitioner must know before using this substance (1 sentence, visually emphasized)

Examples:
- Psilocybin: *"Critical: Lithium prescribed for bipolar disorder significantly lowers seizure threshold when combined with psilocybin/psilocin. This combination is contraindicated."*
- Ibogaine: *"Critical: Ibogaine prolongs QTc interval — potentially fatal cardiac arrhythmia risk. Mandatory cardiac screening (EKG, electrolytes) required before administration."*
- Ayahuasca: *"Critical: Ayahuasca contains reversible MAO-A inhibitors. Concurrent SSRI/SNRI use may cause serotonin syndrome. Serotoninergic medications must be tapered before ceremony."*

*Right column — 5/12*

**2c. Receptor Affinity Radar**
- 6 axes: 5-HT2A · 5-HT1A · 5-HT2C · D2 · SERT · NMDA
- Data: Ki values from `ref_substances` (Supabase)
- Normalization: inverse log scale (lower Ki = higher bar)
- Color: substance-specific (`constants.ts color`)
- Tooltip: raw Ki value + literature source on hover
- Note for Ayahuasca: "Values represent DMT component only. β-carboline MAO-A inhibition not reflected in receptor binding axes."
- Loading state: grey skeleton radar while query loads

---

#### SECTION 3: TOXICITY & RISK ANALYSIS ← HIGHEST PRIORITY NEW FEATURE
*This section is the primary unmet market need. No competitor surface this.*

**3a. Risk Classification Header**
Visual risk tier — prominently displayed:
- 🔴 `HIGH RISK — CARDIAC MONITORING REQUIRED` (Ibogaine)
- 🟡 `MODERATE RISK — STANDARD CLINICAL MONITORING` (MDMA, Ketamine, Esketamine, Ayahuasca)
- 🟢 `STANDARD PROFILE — PHYSIOLOGICALLY WELL-TOLERATED` (Psilocybin, LSD, 5-MeO-DMT, Mescaline, DMT)

**3b. Toxicity Data Table**
Per-substance static data from published literature:

| Field | What It Shows |
|-------|--------------|
| LD50 (rodent) | Published lethal dose data — establishes therapeutic window context |
| Therapeutic Index | Estimated ratio of toxic dose to effective dose |
| Primary Organ Risk | Organ systems at risk (cardiac / hepatic / neurological / none documented) |
| Cardiovascular Risk | QTc prolongation, hypertension risk, tachycardia profile |
| Hepatotoxicity | Liver risk profile (Ibogaine: documented; others: minimal/none) |
| Neurotoxicity | MDMA serotonin neurotoxicity at high doses; others: not documented |
| Addiction Potential | DEA/WHO schedule basis + physiological dependence data |

**3c. Absolute Contraindications** (list)
- Specific co-occurring conditions that are absolute contraindications
- Example for Ibogaine: Long QT syndrome, bradycardia, liver disease, opioid withdrawal without monitoring
- Example for MDMA: Uncontrolled hypertension, MAOI use within 14 days, liver disease

**3d. Required Pre-Session Screening**
- What a practitioner should screen for before administering
- Ibogaine: EKG, electrolytes (K+, Mg2+), liver function tests, full cardiac workup
- MDMA: Cardiovascular assessment, liver function
- All: Psychiatric history, current medication list (INTERACTION_RULES)

**3e. Adverse Event Profile**
Common adverse events from clinical trial data, frequency-ranked:
- Source: Published Phase 2/3 trial data
- Display: Horizontal bar chart or frequency table
- Events: Nausea, headache, anxiety, cardiovascular effects, etc.

---

#### SECTION 4: DRUG INTERACTIONS
*Existing InteractionChecker component — upgrade presentation*

- Section header shows total interaction count for this substance
- Each interaction card shows: severity badge (text + icon, not color-only) · interactor name · mechanism · clinical guidance · source
- "View full interaction database →" links to `/safety` pre-filtered

---

#### SECTION 5: CLINICAL EVIDENCE BASE *(Auth-required — Sprint 2)*

**5a. Global Benchmark Panel**
- Published outcome benchmarks from `benchmark_cohorts`
- By instrument: MADRS, PHQ-9, GRID-HAMD, CAPS-5
- Shows: n, response %, remission %, effect size, trial name

**5b. Active Clinical Trials**
- Recruiting trials from `benchmark_trials`
- Shows: trial name, phase, condition, NCT number, site

---

#### SECTION 6: AI SYNTHESIS PANEL
- Existing Neural Synthesis component
- Keep as-is
- Substance-specific Gemini prompt

---

### AYAHUASCA — SPECIFIC CONTENT MANDATES

Because Ayahuasca is a combination brew, not a single compound, every molecular/chemical display must be handled differently:

| Element | Standard Substances | Ayahuasca |
|---------|--------------------|---------  |
| Molecular image | Single compound structure | DMT + Harmine molecular structures (two compounds, side by side) |
| MoleculeViewer | Single PubChem CID | DMT structure (6089) as primary; note: "Active component. Full brew also contains β-carbolines." |
| Formula field | Single molecular formula | "DMT + Harmine + Harmaline + THH" |
| Affinity Radar | Compound's Ki values | DMT Ki values with footnote |
| Toxicity section | Compound-specific | Emphasize MAOI interaction as primary risk; no hepatotoxicity documented for brew |

---

### ESKETAMINE — SPECIFIC CONTENT MANDATES

| Element | Requirement |
|---------|-------------|
| Hero badge | Dual badge: `FDA APPROVED` + `REMS PROGRAM` |
| Registry: Route | Intranasal ONLY (Spravato) — not IV/IM |
| Registry: Setting | "Administered in certified healthcare settings only. Patient cannot self-administer." |
| Mechanism note | "S-enantiomer of racemic ketamine. ~2x NMDA receptor potency vs racemic form." |
| Toxicity | Dissociation, blood pressure elevation, sedation — monitor for 2hrs post-administration (FDA label) |
| Contraindications | "Not approved for at-home use. REMS certification required for prescribing facility." |

---

## ROUTING

**→ DESIGNER:** Using this specification, create high-fidelity visual mockups of:
1. **Substance Catalog page** — full desktop view, all 10 cards visible, filter bar, with Psilocybin and Ibogaine cards showing the risk indicator difference
2. **Substance Monograph page** — full desktop view using Psilocybin as the example, all 6 sections rendered
3. **Single card close-up** — detailed view of one card showing all elements

**→ Present all three mockups to USER for approval before any code is written.**

**DESIGNER constraints:**
- No color-only status indicators (accessibility rule — pair every color with a text label)
- Minimum 14px all text
- Dark aesthetic — consistent with existing app (`#0a0e1a` background family)
- Molecular structure image must be the visual hero of every card
- Toxicity & Risk section must be visually prominent — this is the market differentiator

---

*PRODDY strategy complete. Routing to DESIGNER for mockup.*
