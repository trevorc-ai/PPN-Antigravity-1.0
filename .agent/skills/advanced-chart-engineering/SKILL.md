---
name: advanced-chart-engineering
description: BUILDER-owned skill for implementing advanced Recharts and D3 chart patterns in PPN's analytics layer. Covers layered ComposedCharts, radar overlays, animated reveal sequences, synchronized brushing, custom SVG annotations, and print-optimized rendering. Use whenever implementing any chart from the analytics sprint (WO-303 through WO-308) or whenever the visual-data-storytelling spec calls for implementation patterns beyond a basic chart render.
---

# Advanced Chart Engineering Skill
**Owner: BUILDER**

> *"The difference between a chart that informs and one that compels is always in the implementation details."*

---

## 🧱 PPN Chart Stack

```typescript
// The approved stack — do not introduce other charting libraries
import {
  ComposedChart, LineChart, AreaChart, BarChart, RadarChart,
  Line, Area, Bar, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ReferenceArea, ReferenceLine, ReferenceDot,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Brush,
  LabelList
} from 'recharts';

// D3 — only for custom SVG that Recharts cannot produce
// (forest plots, slope charts, custom heatmap cells)
import * as d3 from 'd3';
import { scaleSequential, scaleDiverging } from 'd3-scale';
import { interpolateBlues, interpolatePuOr } from 'd3-scale-chromatic';
```

---

## 🎯 Pattern 1: The Benchmark Ribbon ComposedChart (WO-303)

The flagship chart. Four visual layers stacked in a single `ComposedChart`.

```tsx
import { FC, useMemo } from 'react';
import {
  ComposedChart, Line, Area, ReferenceLine,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceArea
} from 'recharts';

interface RibbonDataPoint {
  week: number;
  label: string;
  clinicMean: number;
  clinicCILow: number;
  clinicCIHigh: number;
  trialMin: number;       // Bottom of Phase 3 range
  trialMax: number;       // Top of Phase 3 range
  realWorldAvg: number;
  n: number;
}

interface OutcomeBenchmarkRibbonProps {
  data: RibbonDataPoint[];
  instrument: string;      // 'MADRS', 'PHQ-9', 'CAPS-5'
  cmc: number;             // Clinically Meaningful Change threshold
  direction: 'lower' | 'higher';  // Lower or higher = better
}

const OutcomeBenchmarkRibbon: FC<OutcomeBenchmarkRibbonProps> = ({
  data, instrument, cmc, direction
}) => {
  const yDomain = useMemo(() => {
    const allValues = data.flatMap(d => [
      d.clinicCILow, d.clinicCIHigh, d.trialMin, d.trialMax, d.realWorldAvg
    ]);
    const min = Math.floor(Math.min(...allValues) * 0.9);
    const max = Math.ceil(Math.max(...allValues) * 1.1);
    return [min, max];
  }, [data]);

  return (
    <div className="w-full">
      {/* Direction label — always present */}
      <p className="text-xs text-slate-500 mb-2" style={{ fontSize: '12px' }}>
        {direction === 'lower' ? '↓ Lower = Better' : '↑ Higher = Better'}
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 0 }}>
          <defs>
            {/* Clinic CI band gradient */}
            <linearGradient id="clinicCI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.04} />
            </linearGradient>
            {/* Phase 3 ribbon gradient */}
            <linearGradient id="trialRibbon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.14} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.06} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />

          <XAxis
            dataKey="label"
            stroke="#475569"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            domain={yDomain}
            stroke="#475569"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{
              value: instrument,
              angle: -90,
              position: 'insideLeft',
              fill: '#64748b',
              fontSize: 11,
            }}
          />

          {/* LAYER 1: Phase 3 trial range ribbon (farthest back) */}
          {/* Bottom of ribbon is trialMin, top is trialMax — rendered as stacked areas */}
          <Area
            dataKey="trialMin"
            fill="transparent"
            stroke="transparent"
            animationBegin={200}
            animationDuration={600}
            legendType="none"
            name="__phase3_base"
          />
          <Area
            dataKey="trialMax"
            fill="url(#trialRibbon)"
            stroke="rgba(148,163,184,0.3)"
            strokeDasharray="5 3"
            animationBegin={200}
            animationDuration={600}
            name="Phase 3 Trial Range"
          />

          {/* LAYER 2: Real-world average dashed line */}
          <Line
            type="monotone"
            dataKey="realWorldAvg"
            stroke="#64748b"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            dot={false}
            animationBegin={500}
            animationDuration={600}
            name="Real-World Average (n=8,000+)"
          />

          {/* LAYER 3: Clinic CI band */}
          <Area
            type="monotone"
            dataKey="clinicCIHigh"
            fillOpacity={1}
            fill="url(#clinicCI)"
            stroke="transparent"
            animationBegin={700}
            animationDuration={700}
            name="__ci_band"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="clinicCILow"
            fillOpacity={1}
            fill="#0a0c12"
            stroke="transparent"
            animationBegin={700}
            animationDuration={700}
            legendType="none"
          />

          {/* LAYER 4: Clinic mean line (on top of everything) */}
          <Line
            type="monotone"
            dataKey="clinicMean"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#818cf8' }}
            animationBegin={900}
            animationDuration={800}
            name="Your Clinic"
          />

          {/* CMC threshold reference line */}
          <ReferenceLine
            y={cmc}
            stroke="#f59e0b"
            strokeWidth={1}
            strokeDasharray="3 2"
            label={{
              value: 'Clinically Meaningful Threshold',
              position: 'right',
              fill: '#f59e0b',
              fontSize: 10,
            }}
          />

          <Tooltip content={<BenchmarkRibbonTooltip instrument={instrument} />} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend — text labels, not color-only */}
      <div className="flex flex-wrap gap-4 mt-3 justify-center">
        <LegendItem color="#6366f1" solid label="Your Clinic (95% CI)" />
        <LegendItem color="#94a3b8" dashed label="Phase 3 Trial Range" />
        <LegendItem color="#64748b" dashed label="Real-World Average" />
        <LegendItem color="#f59e0b" dashed label="CMC Threshold" />
      </div>
    </div>
  );
};

// Legend item component — always text + color (never color alone)
const LegendItem: FC<{ color: string; solid?: boolean; dashed?: boolean; label: string }> = ({
  color, solid, label
}) => (
  <div className="flex items-center gap-1.5">
    <svg width="24" height="12">
      <line
        x1="0" y1="6" x2="24" y2="6"
        stroke={color}
        strokeWidth={solid ? 2.5 : 1.5}
        strokeDasharray={solid ? undefined : '5 3'}
      />
    </svg>
    <span className="text-xs text-slate-400" style={{ fontSize: '12px' }}>{label}</span>
  </div>
);
```

---

## 🎯 Pattern 2: Dual-Polygon Radar Chart (WO-306)

Two overlapping polygons: benchmark (back, neutral) + practitioner (front, brand color).

```tsx
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';

interface RadarDimension {
  dimension: string;
  label: string;        // Human-readable axis label
  clinic: number;       // 0–100 normalized score
  network: number;      // Anonymized network average
  fullMark: number;     // Usually 100
}

const PractitionerRadar: FC<{ data: RadarDimension[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={320}>
    <RadarChart data={data} margin={{ top: 16, right: 32, bottom: 16, left: 32 }}>
      <PolarGrid
        gridType="polygon"
        stroke="rgba(148,163,184,0.12)"
      />
      <PolarAngleAxis
        dataKey="label"
        tick={{ fill: '#94a3b8', fontSize: 12 }}
      />
      <PolarRadiusAxis
        angle={90}
        domain={[0, 100]}
        tick={{ fill: '#475569', fontSize: 10 }}
        tickCount={4}
      />

      {/* Network benchmark — render FIRST (behind), dashed border, no fill */}
      <Radar
        name="Network Average (Anonymized)"
        dataKey="network"
        stroke="rgba(148,163,184,0.5)"
        strokeWidth={1.5}
        strokeDasharray="5 3"
        fill="rgba(148,163,184,0.07)"
        animationBegin={0}
        animationDuration={600}
      />

      {/* Practitioner — render SECOND (in front), solid border, light fill */}
      <Radar
        name="Your Profile"
        dataKey="clinic"
        stroke="#6366f1"
        strokeWidth={2}
        fill="rgba(99,102,241,0.2)"
        animationBegin={400}
        animationDuration={700}
      />

      <Tooltip content={<RadarTooltip />} />
    </RadarChart>
  </ResponsiveContainer>
);

// Radar tooltip with directional context
const RadarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const clinic = payload.find((p: any) => p.name === 'Your Profile')?.value;
  const network = payload.find((p: any) => p.name === 'Network Average (Anonymized)')?.value;
  const delta = clinic != null && network != null ? clinic - network : null;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-bold text-white mb-1" style={{ fontSize: '13px' }}>{label}</p>
      {clinic != null && (
        <p className="text-indigo-300" style={{ fontSize: '12px' }}>Your profile: {clinic}</p>
      )}
      {network != null && (
        <p className="text-slate-400" style={{ fontSize: '12px' }}>Network avg: {network}</p>
      )}
      {delta != null && (
        <p className={`text-xs mt-1 font-semibold ${delta >= 0 ? 'text-emerald-400' : 'text-slate-400'}`}
           style={{ fontSize: '12px' }}>
          {delta >= 0 ? `▲ Strength (+${delta.toFixed(0)})` : `Growth Opportunity (${delta.toFixed(0)})`}
        </p>
      )}
    </div>
  );
};
```

---

## 🎯 Pattern 3: Heatmap Grid (WO-307)

Custom CSS grid heatmap — no SVG library dependency, fully colorblind-safe.

```tsx
import { FC, useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { interpolate } from 'd3-interpolate';
import type { HeatmapCell } from '@/lib/benchmarks';

// Colorblind-safe diverging scale: violet (low) → white (mid) → cyan (high)
const HEATMAP_COLORS = {
  low:  '#7c3aed',  // strong violet
  mid:  '#1e293b',  // near-black (looks "empty" / no evidence)
  high: '#0891b2',  // strong cyan
};

const GlobalCohortHeatmap: FC<{ cells: HeatmapCell[]; modalities: string[]; conditions: string[] }> = ({
  cells, modalities, conditions
}) => {
  const effectSizes = cells.map(c => c.effectSize ?? 0).filter(v => v > 0);
  const maxEffect = Math.max(...effectSizes, 1);

  const colorScale = useMemo(() => {
    return scaleLinear<string>()
      .domain([0, maxEffect * 0.5, maxEffect])
      .range([HEATMAP_COLORS.mid, '#3b4d6e', HEATMAP_COLORS.high])
      .clamp(true);
  }, [maxEffect]);

  const cellMap = useMemo(() => {
    const m: Record<string, HeatmapCell> = {};
    for (const cell of cells) m[`${cell.condition}::${cell.modality}`] = cell;
    return m;
  }, [cells]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse" role="grid" aria-label="Condition × Modality outcome heatmap">
        <thead>
          <tr>
            <th className="p-2 text-left text-slate-500 font-normal" style={{ fontSize: '11px', minWidth: '120px' }}>
              Condition ↓ / Modality →
            </th>
            {modalities.map(mod => (
              <th key={mod} className="p-2 text-center text-slate-300 font-bold uppercase tracking-wide"
                  style={{ fontSize: '11px', minWidth: '90px' }}>
                {mod}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {conditions.map(condition => (
            <tr key={condition}>
              <td className="p-2 text-slate-300 font-medium" style={{ fontSize: '12px' }}>
                {condition}
              </td>
              {modalities.map(modality => {
                const cell = cellMap[`${condition}::${modality}`];
                const bg = cell?.effectSize != null
                  ? colorScale(cell.effectSize)
                  : 'rgba(30,41,59,0.4)';

                return (
                  <td key={modality}
                    className="p-1"
                    role="gridcell"
                    aria-label={
                      cell
                        ? `${condition} × ${modality}: effect size ${cell.effectSize?.toFixed(2)}, n=${cell.totalParticipants}`
                        : `${condition} × ${modality}: no data`
                    }
                  >
                    <div
                      className="rounded-lg p-2 text-center cursor-default transition-transform hover:scale-105"
                      style={{ backgroundColor: bg, minHeight: '56px' }}
                      title={cell?.landmarkStudy ?? 'No data'}
                    >
                      {cell?.effectSize != null ? (
                        <>
                          <div className="text-white font-bold" style={{ fontSize: '13px' }}>
                            g = {cell.effectSize.toFixed(2)}
                          </div>
                          <div className="text-slate-300 mt-0.5" style={{ fontSize: '10px' }}>
                            n={cell.totalParticipants.toLocaleString()}
                          </div>
                        </>
                      ) : (
                        <div className="text-slate-600 mt-3" style={{ fontSize: '12px' }}>—</div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Color legend — labeled, not color-only */}
      <div className="flex items-center gap-3 mt-4 justify-end">
        <span className="text-xs text-slate-500" style={{ fontSize: '11px' }}>Effect size (Hedges′ g):</span>
        <div className="flex items-center gap-1">
          {[0, 0.25, 0.5, 0.75, 1.0].map(v => (
            <div key={v} className="flex flex-col items-center gap-0.5">
              <div className="w-8 h-4 rounded" style={{ backgroundColor: colorScale(v * maxEffect) }} />
              <span className="text-slate-600" style={{ fontSize: '10px' }}>{v.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 🎯 Pattern 4: Printable Chart Export

Charts that must survive `@media print`:

```tsx
// Always wrap print-destined charts in this class
<div className="print:shadow-none print:border-0 print:bg-white">
  {/* Chart */}
</div>

// In your global CSS or Tailwind config:
// @media print {
//   .recharts-wrapper { color: #000 !important; }
//   .recharts-cartesian-grid line { stroke: #ccc !important; }
//   .recharts-tooltip-wrapper { display: none !important; }
//   svg text { fill: #000 !important; }
// }
```

For the `PatientProgressSummary` (WO-304), replace chart with a static SVG-equivalent in the print view:
```tsx
const [isPrinting, setIsPrinting] = useState(false);

useEffect(() => {
  const handler = () => setIsPrinting(true);
  window.addEventListener('beforeprint', handler);
  return () => window.removeEventListener('beforeprint', handler);
}, []);

{isPrinting ? <StaticProgressBar value={improvementPct} /> : <AnimatedChart />}
```

---

## 🎯 Pattern 5: Staggered Chart Load Sequence

Use `animationBegin` on each chart layer to control the reveal sequence:

```tsx
// The sequence that tells the story:
// 1. Background context (benchmark) appears first → 200ms
// 2. Comparison reference lines → 500ms
// 3. Your clinic's data arrives → 800ms
// This way, viewers understand the context before they see their own results.

<Area dataKey="benchmarkRange" animationBegin={200} animationDuration={600} />
<Line dataKey="realWorldAvg"   animationBegin={500} animationDuration={500} />
<Line dataKey="clinicMean"     animationBegin={800} animationDuration={900} />
```

---

## ✅ BUILDER Chart Implementation Checklist

Before handing any chart to INSPECTOR:

- [ ] `animationBegin` stagger is set — context renders before clinic data
- [ ] Custom tooltip matches the 6-element spec (context, clinic value, benchmark, delta, N, source)
- [ ] All reference lines have `label` prop with text — not position-only
- [ ] Legend items use `LegendItem` SVG lines (not colored squares) — dashed vs. solid matches layer type
- [ ] `ResponsiveContainer` wraps every chart
- [ ] `aria-label` on the chart wrapper
- [ ] Loading skeleton shape matches the chart (bar-shaped skeleton for bar chart, etc.)
- [ ] Print media behavior tested or `print:hidden` applied appropriately
- [ ] No `any` TypeScript types in chart components
- [ ] All color values from the approved PPN palette (not arbitrary hex)

---

**END OF ADVANCED CHART ENGINEERING SKILL**
