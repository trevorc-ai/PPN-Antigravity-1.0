---
name: visual-data-storytelling
description: Teaches agents how to bridge the gap between raw data and self-evident visual narrative. Covers encoding meaning through shape, color, animation, and layering — so the 'why' is visible before a word is read. Mandatory for ANALYST (speccing), DESIGNER (layout and encoding), and BUILDER (implementation) when working on any analytics chart or dashboard panel. This is the 'connect the dots' skill.
---

# Visual Data Storytelling Skill
**Owners: ANALYST (spec) · DESIGNER (encoding) · BUILDER (implementation)**

> *"The best visualization doesn't explain the data — it makes the data explain itself."*

The gap this skill closes: agents can query, agents can render. What they often miss is the **translation layer** — the intentional design decisions that turn a number on a screen into a feeling of understanding. That translation is not decoration. It is the product.

---

## 🧠 The Three-Layer Framework

Every visualization must be built in three layers — in this exact order:

### Layer 1: THE CLAIM
Before touching code or design, write the single sentence this chart must prove.

```
❌ "Show response rates over time"
✅ "Your patients improve 2.3× faster than the Phase 3 trial average by Week 6"

❌ "Show substance receptor binding"  
✅ "Psilocybin's 5-HT2A dominance explains its rapid anti-depressant onset vs. ketamine"

❌ "Show documentation completeness"
✅ "Documentation dropped 23 points in 4 weeks — here's exactly where the gap is"
```

**Rule:** If you cannot write the claim in one sentence before designing the chart, you are not ready to design the chart. Define the claim first.

---

### Layer 2: THE ENCODING
Choose how each data dimension maps to a visual channel. Channels carry different cognitive loads:

| Visual Channel | Cognitive Load | Best For |
|---|---|---|
| **Position (Y-axis value)** | Lowest — instant | Primary metric (score, rate) |
| **Length (bar width/height)** | Very low | Quantity comparison |
| **Slope (line angle)** | Low | Rate of change — most powerful for trend stories |
| **Area (filled region)** | Medium | Uncertainty, range, magnitude |
| **Color hue** | Medium | Category membership (substance, condition) |
| **Color saturation/brightness** | Medium | Intensity, confidence, effect size |
| **Shape** | Higher | Binary status (responder/non-responder) or small category sets |
| **Size** | Higher | Population weight (bubble size = N participants) |
| **Animation/Motion** | Context-specific | Time passage, reveal sequence, state transition |
| **Texture/Pattern** | Fallback | Accessibility overlay when color is already used |

**The rule:** Use the lowest-load channel for your most important data dimension. Never encode your primary insight in size or texture — those are for secondary dimensions.

---

### Layer 3: THE REVEAL SEQUENCE
Plan the order in which visual elements appear or are understood — because eyes move in a predictable pattern and a well-sequenced chart tells a story in milliseconds.

**On-load sequence for clinical charts:**
1. **Benchmark context first** — render the Phase 3 ribbon/zone before the clinic line. The audience needs the comparison frame before they can understand the clinic's performance.
2. **The clinic line enters** — now the comparison is instant. They see it *relative to* something already established.
3. **Threshold line** — the minimum clinically meaningful improvement. Now achievement is visible.
4. **Response label** — final annotation confirming whether the threshold was crossed.
5. **Tooltip on hover** — the narrative micro-moment that adds the "why" when they want more.

**Animation rule:** Never animate to decorate. Animate only to guide **attention sequencing** or to represent the **passage of time in the data itself.**

---

## 🎨 The Visual Encoding Playbook for PPN Charts

### RADAR CHART — multi-dimensional profile
**What it tells:** How one entity performs across N dimensions simultaneously.
**When to use it:** Receptor binding profiles (as shown), practitioner performance profile (WO-306), substance comparison across criteria.

**The PPN standard:**
- Dark background (#0a0c12) with hexagonal grid lines at 20% opacity
- Fill: single entity = one semi-transparent filled polygon (opacity 0.3) + solid border stroke (2px)
- Multi-entity: two overlapping polygons in contrasting colors + **text labels on both** (not color-only)
- Axis labels: white, 12px minimum, always visible
- **Story layer:** Add a reference polygon (the "benchmark" shape in a neutral gray at 0.15 opacity) — the practitioner immediately sees where their shape exceeds or falls short of the benchmark shape
- Tooltip on vertex hover: show dimension name, value, and benchmark comparison — "D2: 86 — 23 points above published psilocybin profile"
- Animation: polygon fills in from center outward, 600ms ease-out

```tsx
// Reference shape (benchmark) always rendered BEHIND the active shape
<PolarAngleAxis dataKey="dimension" />
<Radar name="Phase 3 Benchmark" data={benchmarkData}
  stroke="rgba(148,163,184,0.4)" fill="rgba(148,163,184,0.1)"
  strokeDasharray="4 2"
/>
<Radar name="Your Clinic" data={clinicData}
  stroke="#6366f1" fill="rgba(99,102,241,0.25)"
/>
```

---

### OUTCOME TRAJECTORY — before/after over time
**What it tells:** How fast patients improve, relative to what's expected.
**Story:** "Look at the slope — steeper means faster relief."

**The PPN standard:**
- **Phase 3 Range ribbon:** A gray shaded `<Area>` from trial minimum to trial maximum (the "expectation zone")
- **Real-world average:** Dashed line in slate-400 ("what usually happens")
- **Clinic line:** Solid emerald or violet line with a 95% CI shaded band (same hue, 15% opacity)
- **CMC threshold:** Horizontal reference line with a label "Clinically Meaningful Threshold"
- **Direction annotation:** Small downward arrow near Week 0 label: "↓ Lower = Better"
- **Slope emphasis:** For each line segment where the clinic outperforms, add a faint emerald glow under the line — this is the moment the chart becomes a story
- **On-load animation:** Axes draw first (200ms), then ribbon fills (400ms), then benchmark lines appear (600ms), then clinic line draws from left to right (800ms ease-out)
- **Final state label:** At the rightmost data point, floating label: "Week 12: 67% response"

---

### WATERFALL / FUNNEL — attrition storytelling
**What it tells:** Where patients drop out, and how many remain.
**Story:** "Every bar that shrinks is a person we lost — and we can see exactly where."

**The PPN standard:**
- Horizontal bars, not vertical (labels don't get cut off)
- Each bar = a stage. Width encodes count.
- Color gradient from full (emerald-600) to diminished (slate-600) — the color itself tells the attrition story
- Dropout annotation: a small notch cut from the right edge of each narrowing bar with the count delta: "↑ 4 dropped here"
- Benchmark overlay: a secondary bar outline in dashed gray showing where the benchmark funnel reaches — the gap is visible instantly
- No Y-axis percentage labels needed — the shape is the data

---

### HEATMAP — condition × modality matrix
**What it tells:** Where evidence is strongest or weakest.
**Story:** "The hot cells are where the best outcomes live."

**The PPN standard:**
- Colorblind-safe diverging palette: `#7c3aed` (violet, low/weak) → `#f8fafc` (white, neutral) → `#0891b2` (cyan, strong)
- **Never rainbow** — one ramp direction only for sequential effect size data
- Cell value: Hedges' g rendered bold in high-contrast text (white or dark depending on cell brightness)
- Cell subtitle: "(n=1,247)" — the N is always visible
- Empty cells: `—` with a 30% opacity fill — not blank (blank implies missing data, dashes imply "no studies")
- Border: subtle 1px slate-800 grid
- Hover: cell lifts with box-shadow, full tooltip with study name + citation
- Column headers: modality names with the substance icon (🍄 psilocybin, etc.) — not text alone
- Row headers: condition names with a small ICD-level descriptor

---

### RADAR — practitioner performance profile (WO-306)
**The sensitivity rule applies here above all others:**

The benchmark shape must be labeled "Network Average (Anonymized)" — never "What you should be." The practitioner's shape exceeding the benchmark in any dimension must be highlighted in emerald with a label "Strength." The shape falling short must be labeled in slate-400 with "Growth Opportunity" — never "Underperforming."

The story must read: *"Here is what you're exceptional at. Here is where your peers have found approaches worth exploring."*

Animation: the benchmark polygon appears first (it's the context). The practitioner polygon grows into it second. This sequence says: "here's the field — here's where you stand in it." Not the other way around.

---

## 🎬 Animation Rules (Non-Negotiable)

### Animations Are Allowed For:
| Purpose | Implementation |
|---|---|
| **Attention sequencing** — what the eye should see first | `animationBegin` delay staggering across Recharts components |
| **Drawing time-series** — the line travels through time | `isAnimationActive={true}` on Line/Area with `animationDuration={800}` |
| **State transitions** — filter change, hover reveal | CSS `transition: all 300ms ease` on SVG elements |
| **Progressive disclosure** — "there's more" | Expand-on-hover with `overflow: hidden` + `max-height` transition |

### Animations Are Never Allowed For:
- Continuous looping (spinning, pulsing, floating forever). Use once on load, then stop.
- Decorative bounce or elastic easing — clinical context requires calm, measured motion
- Hiding information then revealing it (data must be accessible on load, even if visually de-emphasized)

---

## 🔲 Shape as Meaning

Shapes carry pre-attentive cognitive signals that precede conscious reading:

| Shape | Signal | Use For |
|---|---|---|
| Circle | Singular data point, individual, precision | Individual patient dot, single measurement |
| Square/Rectangle | Category, container, quantity | Bar segments, heatmap cells |
| Triangle (▲) | Increase, alert, magnitude | Safety flag, upward trend indicator |
| Triangle (▽) | Decrease, improvement | Score reduction annotations |
| Hexagon | Network, interconnection | Radar chart grid (default) |
| Diamond | Special event, exception | Adverse event marker on timeline |
| Dash `— — —` | Estimated, external, benchmark | All benchmark reference lines — never solid |
| Solid line | Clinic's own data, certain, present | All primary outcome lines |

**Rule:** Dashed lines are for external/benchmark data. Solid lines are for the practitioner's own data. Never reverse this convention.

---

## 🔠 Typography as Visual Channel

Text in charts is data. Treat it as such:

- **Insight headline** (above chart): `text-base font-bold text-white` — the conclusion, not the description
- **Axis labels**: `text-xs text-slate-400` — context, not focus
- **Data point labels** (on chart): `text-sm font-bold` in white when on dark bg — these are the numbers that matter
- **Source citations** (below chart): `text-xs text-slate-600 italic` — present but not demanding attention
- **Annotation text** (on reference lines): `text-xs text-slate-300 uppercase tracking-wide` — labels that explain meaning

Never label every data point. Label only: the first point, the last point, and any point that crosses a threshold.

---

## 📐 The Tooltip as Narrative Micro-Moment

A tooltip is not a data readout. It is a **micro-story** that happens when someone slows down to understand. Design it accordingly:

```
┌───────────────────────────────────────────┐
│ Week 6 · Psilocybin / TRD                │  ← Context (where am I?)
│                                           │
│ Your Clinic: 18.4 pts                     │  ← Primary: the clinic number
│ Phase 3 Benchmark: 23.1 pts               │  ← Comparison: the benchmark
│ Difference: −4.7 pts better ✓             │  ← The insight: am I winning?
│                                           │
│ n = 34 patients                           │  ← Trust: is this meaningful?
│ Source: COMP360 Phase 2b (2022)           │  ← Authority: where does this come from?
└───────────────────────────────────────────┘
```

Rules for tooltips:
1. **Context first** — what timepoint / group is this?
2. **Primary value** — your clinic's number
3. **Comparison** — the benchmark
4. **The delta** — the difference, with directional language ("better" / "worse" — not just +/-)
5. **Sample size** — always
6. **Source** — always for benchmark data

---

## ✅ Pre-Implementation Checklist

Before BUILDER writes a single line of chart code, ANALYST must confirm:

- [ ] The claim is written in one sentence (what does this chart prove?)
- [ ] Each data dimension is mapped to a visual channel (position, color, size, etc.)
- [ ] The reveal sequence is defined (what appears first, second, third?)
- [ ] Reference/benchmark lines are specified (what are we comparing against?)
- [ ] Animation sequence is defined (on-load timing, no loops)
- [ ] Tooltip content is specified (6-element micro-story above)
- [ ] Typography hierarchy is defined (headline → labels → source)
- [ ] Colorblind-safe palette is selected
- [ ] Empty/edge case states are designed (no data, insufficient N, loading)

Before DESIGNER signs off:

- [ ] Benchmark shape/line is visually distinguishable from clinic data (dashed vs. solid)
- [ ] The most important number is the most visually dominant element
- [ ] Direction is labeled ("↓ Lower = Better")
- [ ] The chart can be understood in 3 seconds without reading the headline

Before BUILDER ships:

- [ ] `animationBegin` stagger is implemented to create reveal sequence
- [ ] Custom tooltip matches the 6-element micro-story spec
- [ ] Loading skeleton matches the chart's shape (not a generic box)
- [ ] All reference lines have text labels (not just visual position)
- [ ] Print stylesheet hides animations, shows static final state

---

**END OF VISUAL DATA STORYTELLING SKILL**
