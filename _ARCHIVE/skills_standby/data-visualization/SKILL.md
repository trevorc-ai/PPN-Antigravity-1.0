---
name: data-visualization
description: ANALYST-owned skill for designing and specifying data visualizations across clinical outcomes, benchmark comparisons, longitudinal trends, population distributions, and safety data. Covers chart type selection, narrative framing, interactive patterns, and PPN-specific domain rules. Use when any chart, graph, dashboard panel, or visual data story is needed.
---

# 📊 Data Visualization Skill
**Owner: ANALYST**

> *"The goal is not to show data. The goal is to make the right people see the right thing at the right moment and take the right action."*

---

## 🎯 When to Use This Skill

Activate this skill when:
- Specifying a new chart, graph, or visualization for any PPN page
- Reviewing whether a chosen chart type actually fits the data shape
- Designing the Analytics page, benchmark cards, or population comparison views
- Turning a raw data question ("how are our outcomes?") into a specific visual answer
- Auditing existing charts for misleading patterns or bad defaults

---

## 🧠 ANALYST's First Law of Visualization

**Never choose a chart type before answering these four questions:**

1. **What comparison are we making?** (composition, distribution, trend, relationship, deviation)
2. **How many variables?** (1, 2, or N-dimensional)
3. **What is the time frame?** (single point, before/after, longitudinal, cohort)
4. **Who is the audience?** (practitioner, clinic admin, researcher, investor, regulator)

If you cannot answer all four, you are not ready to specify a chart. Ask first.

---

## 📐 Chart Type Selection Matrix

### Category: COMPOSITION (What makes up the whole?)
| Use Case | Chart Type | Never Use |
|----------|-----------|-----------|
| % breakdown at one point in time | Donut chart (max 5 slices) | Pie chart with >5 categories |
| % breakdown across multiple groups | Grouped bar chart | Stacked 100% area (hard to read) |
| Part-whole with hierarchy | Treemap | Nested pies |
| Patient condition mix | Horizontal bar with labels | Vertical bar (labels overlap) |

### Category: DISTRIBUTION (How is data spread?)
| Use Case | Chart Type | Never Use |
|----------|-----------|-----------|
| Single score distribution | Histogram with rug plot | Bar chart (wrong encoding) |
| Score distribution across groups | Box-and-whisker / violin | Mean-only bar (hides spread) |
| Response rate spread | Dot plot (individual) | Average line alone |
| Adverse event severity distribution | Strip chart with jitter | Stacked bar |

### Category: TREND (How does it change over time?)
| Use Case | Chart Type | Never Use |
|----------|-----------|-----------|
| Outcome score longitudinal | Line chart with confidence band | Bar chart for time series |
| Multiple patients tracked | Spaghetti plot (N<20) or summary ribbon | Overplotted scatter |
| Cohort retention over weeks | Step-area chart | Pie-over-time |
| Pre/post single intervention | Paired dot plot (slope chart) | Bar with error bars |

### Category: COMPARISON (How do groups differ?)
| Use Case | Chart Type | Never Use |
|----------|-----------|-----------|
| Your clinic vs. benchmark | Diverging bar or bullet chart | Raw number tables |
| Multiple clinics vs. global | Lollipop chart with reference line | Grouped bar >5 groups |
| Effect sizes across studies | Forest plot | Standard bar |
| Score change (delta) | Waterfall chart | Absolute score chart |

### Category: RELATIONSHIP (Do variables move together?)
| Use Case | Chart Type | Never Use |
|----------|-----------|-----------|
| Two continuous variables | Scatter with regression line | Line chart (implies time) |
| Correlation matrix | Clustered heatmap | Correlation table |
| Dose-response relationship | Connected scatter | Bar chart |
| Adverse events vs. dosage | Bubble chart | Standard scatter |

---

## 🏥 PPN-Specific Domain Rules

### Rule 1: Always Show N (Sample Size)
Every chart MUST display the sample size somewhere prominent. A 90% response rate from N=5 is not the same as N=500.

```
✅ "Response Rate: 87% (n=143)"
❌ "Response Rate: 87%"
```

### Rule 2: Show Uncertainty — Always
No clinical chart should ever show a point estimate alone. Include:
- Confidence intervals (95% CI preferred)
- Standard deviations for distributions
- Standard errors for means
- Range bars for small samples

### Rule 3: Benchmark Lines Are Mandatory on Outcome Charts
Any chart showing PPN practitioner outcomes MUST include:
- A horizontal reference line at the **published clinical trial benchmark** (labeled)
- A horizontal reference line at the **naturalistic/real-world benchmark** (labeled)
- A visual zone marking clinically meaningful improvement threshold (e.g., MADRS ≥50% reduction)

### Rule 4: Score Direction Must Be Unambiguous
Clinical scales can go in either direction. Always annotate:
- Arrow or label: "Lower = Better" or "Higher = Better"
- For PTSD, depression, anxiety scales: lower is always better
- For functioning, well-being, quality of life: higher is better

### Rule 5: Time Axis Baseline Is Session Zero
Never start the time axis at a calendar date for clinical charts. Always use:
- "Week 0" = baseline (before intervention)
- "Week 1", "Week 3", "Week 6", "Week 12" = standard follow-up windows

### Rule 6: No Rainbow Color Scales
Color scales for sequential data must be:
- **Sequential (light→dark):** Single hue ramp (e.g., blues, teals)
- **Diverging:** Two-hue from midpoint (e.g., purple ↔ orange)
- **Categorical:** Max 6 colors, all distinguishable by users with deuteranopia

Approved palettes for PPN (all WCAG AA compliant, colorblind-safe):
```
Categorical:   #3b82f6 (blue), #f59e0b (amber), #8b5cf6 (violet), #06b6d4 (cyan), #f97316 (orange), #84cc16 (lime)
Sequential:    #0c4a6e → #38bdf8   (sky blue scale)
Diverging:     #7c3aed ↔ #ea580c   (violet → orange)
Alert/Error:   Use text label [ALERT] + amber color, never red/green alone
```

---

## 📊 PPN Signature Chart Patterns

### Pattern 1: The Benchmark Ribbon (Flagship)
**Use for:** Showing a clinic's outcomes against global evidence

**Components:**
1. Primary line: Clinic's mean score at each timepoint (with shaded CI)
2. Ribbon zone: Clinical trial benchmark range (shaded, labeled "Phase 3 Trial Range")
3. Dashed line: Naturalistic/real-world benchmark (labeled "Real-World Average N=8,000")
4. Threshold line: Clinically meaningful improvement marker
5. Response/remission labels at final timepoint

```
Score
  │
40│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●   ← Phase 3 Range (shaded)
  │  
32│  ○ ← Clinic Baseline                       ← Real-World Avg (dashed)
  │     ╲
24│      ╲━━━━━●━━━━━━━━━━━━━━━━━━━━━●  ← Clinic Line
  │             
16│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ← Clinically Meaningful Threshold
  │
  └─────────────────────────────────────
    Week 0    Week 3    Week 6    Week 12
```

**Instruments to use this pattern for:**
- MADRS (depression, lower = better)
- PHQ-9 (depression, lower = better)
- CAPS-5 (PTSD, lower = better)
- GAD-7 (anxiety, lower = better)
- QIDS-SR-16 (depression, lower = better)

---

### Pattern 2: The Population Funnel
**Use for:** Showing how many patients reach each milestone

**Components:**
- Full-width bar: Total enrolled
- Narrowing bars: Completed baseline → completed session → completed follow-up → improved → responded → remitted
- Dropout annotation at each stage with reason distribution

---

### Pattern 3: Safety Scatter (Dose-Response)
**Use for:** Adverse events vs. session variables

**Components:**
- X-axis: Dose (mg) or session duration (minutes)
- Y-axis: Adverse event severity grade (1–4)
- Bubble size: Frequency
- Color: Modality (following categorical palette above)
- Quadrant annotations: Safe Zone / Monitor Zone / Alert Zone

---

### Pattern 4: Global Cohort Heatmap
**Use for:** Comparing outcomes across conditions × modalities matrix

**Components:**
- Rows: Conditions (PTSD, MDD, TRD, AUD, OUD, Anxiety, Burnout)
- Columns: Modalities (Psilocybin, MDMA, Ketamine, Esketamine)
- Cell value: Mean effect size (Hedges' g) from global benchmark data
- Cell color: Diverging scale (small → large effect size)
- Cell label: "g = 0.91 (n=2,847)"
- Hover tooltip: Cite the source study

---

### Pattern 5: Before / After Paired Slope Chart
**Use for:** Individual-level pre/post outcomes within a cohort

**Components:**
- Each patient = one line connecting baseline dot to endpoint dot
- Line slope direction: Down = improvement (for symptom scales)
- Line color: Response status (responded / not responded) — with text label
- Median slope line: Bold, annotated
- Reference lines: Clinically meaningful change threshold

---

## 🎬 Narrative Framing (Analytical Storytelling)

Every visualization must have an **insight headline** — not a description, but a conclusion:

```
❌ "MADRS scores over time by arm"
✅ "Psilocybin patients improved 3.2× faster than clinical trial benchmarks at Week 3"

❌ "Response rate by modality"  
✅ "MDMA shows highest PTSD response rate in your clinic — outpacing published Phase 3 data"

❌ "Adverse events by severity"
✅ "99.1% of sessions completed without a Grade 3+ adverse event — consistent with trial safety profiles"
```

Rules for headlines:
1. Always include a specific number
2. Always include a comparison (to what? vs. when? vs. whom?)
3. Write for the practitioner, not the statistician
4. Never imply causation. Use "associated with" not "caused by"

---

## 🔧 Technical Specifications

### Preferred Libraries (PPN Stack)
```typescript
// Primary: Recharts (standard charts)
import { LineChart, AreaChart, ScatterChart, RadarChart, ComposedChart } from 'recharts';

// Secondary: D3 (custom SVG — forest plots, slope charts, heatmaps)
import * as d3 from 'd3';

// Annotation layer: recharts-reference-lines + custom SVG overlays

// Color: d3-scale-chromatic (colorblind-safe palettes)
import { schemeTableau10 } from 'd3-scale-chromatic';
```

### Responsive Container — Always Use
```tsx
<ResponsiveContainer width="100%" height={height ?? 320}>
  {/* chart here */}
</ResponsiveContainer>
```

### Custom Tooltip Template
```tsx
const ClinicalTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-1 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-4">
          <span className="text-slate-300">{entry.name}:</span>
          <span className="text-white font-bold">{entry.value}</span>
        </div>
      ))}
      {payload[0]?.payload?.n && (
        <p className="text-slate-500 text-xs mt-1">n = {payload[0].payload.n}</p>
      )}
      {payload[0]?.payload?.source && (
        <p className="text-slate-500 text-xs">Source: {payload[0].payload.source}</p>
      )}
    </div>
  );
};
```

### Loading & Error States
```tsx
// Always wrap charts in error boundary + loading skeleton
{isLoading ? (
  <div className="animate-pulse bg-slate-700/30 rounded-xl h-64" />
) : error ? (
  <div className="text-slate-400 text-sm text-center py-8">
    [STATUS: FAIL] Unable to load chart data. Retry?
  </div>
) : (
  <ResponsiveContainer>{/* chart */}</ResponsiveContainer>
)}
```

---

## ✅ ANALYST Pre-Handoff Checklist

Before handing any visualization spec to BUILDER or DESIGNER:

- [ ] Chart type matches the comparison type (composition / distribution / trend / relationship)
- [ ] Sample size (n) is visible on or near every chart
- [ ] Uncertainty (CI, SD, SE) is shown — never a bare point estimate
- [ ] Benchmark reference lines are included for all outcome charts
- [ ] Score direction is labeled ("Lower = Better")
- [ ] Color palette is from the approved colorblind-safe set
- [ ] Insight headline is written (specific number + comparison)
- [ ] Source/citation is stored in the data and shown in tooltip
- [ ] Responsive container is specified
- [ ] Loading and error states are defined

---

## 🚫 Absolute Prohibitions

| Never Do This | Do This Instead |
|--------------|-----------------|
| Pie chart with >4 categories | Horizontal bar chart ranked by value |
| Y-axis that doesn't start at 0 (for bar charts) | Start at 0; use dot/line for change |
| Dual Y-axis (two different scales on same chart) | Two separate charts, synchronized |
| 3D charts of any kind | 2D with depth implied by size/color |
| Animation that obscures data (spin, bounce) | Simple fade-in on load only |
| Truncated axis to "make change look bigger" | Full scale with annotation of change magnitude |
| Color without text label for status | Text label required alongside color |
| Average without spread | Mean ± SD or CI band always |
| Comparing raw N across studies with different enrollment | Normalize to effect size or percentage |

---

**END OF DATA VISUALIZATION SKILL**
