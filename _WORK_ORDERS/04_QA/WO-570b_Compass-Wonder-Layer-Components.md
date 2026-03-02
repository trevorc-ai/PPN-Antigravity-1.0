---
id: WO-570b
title: "Integration Compass — Wonder Layer: CompassSpiderGraph, FlightPlanChart, BrainNetworkMap, EmotionalWaveform"
owner: BUILDER
status: 04_QA
authored_by: LEAD
parent: WO-570
sequence: 2
date: 2026-03-02
priority: P0
tags: [compass, wonder-layer, spider-graph, flight-plan, brain-network, emotional-waveform, showcase]
failure_count: 0
depends_on: [WO-570a]
blocks: [WO-570d]
---

## LEAD Architecture

This is ticket 2 of 5. These are the four WONDER components — the heart of what
makes the rebuilt Compass different from everything that exists in psychedelic
medicine. BUILDER must not cut corners on visual quality here. These components
will be seen by patients on the most significant days of their lives.

All components live in `src/components/compass/`. All are registered in the
Component Showcase after WO-570e.

---

### Component A1: `CompassSpiderGraph.tsx`

**Visual:** Recharts `<RadarChart>` with two overlaid polygons.

**Props interface:**
```typescript
interface CompassSpiderGraphProps {
  substanceCategory: 'psilocybin' | 'ketamine' | 'mdma' | 'ayahuasca' | 'unknown';
  accentColor: string;
  livedData: SpiderAxisData | null;    // from useCompassTimeline
  viewMode?: 'science' | 'experience'; // default 'experience'
}

interface SpiderAxisData {
  sensoryAlteration: number;   // 0–10
  egoDissolution: number;
  emotionalIntensity: number;
  physicalSensation: number;
  timeDistortion: number;
  mysticalQuality: number;
}
```

**Predicted shapes (static constants per substance — BUILDER implements):**
```
psilocybin: { sensoryAlteration:8, egoDissolution:7, emotionalIntensity:7,
              physicalSensation:4, timeDistortion:8, mysticalQuality:9 }
ketamine:   { sensoryAlteration:9, egoDissolution:8, emotionalIntensity:4,
              physicalSensation:6, timeDistortion:9, mysticalQuality:5 }
mdma:       { sensoryAlteration:4, egoDissolution:3, emotionalIntensity:10,
              physicalSensation:8, timeDistortion:4, mysticalQuality:6 }
ayahuasca:  { sensoryAlteration:7, egoDissolution:8, emotionalIntensity:9,
              physicalSensation:7, timeDistortion:7, mysticalQuality:10 }
```

**Axis label sets:**
- Experience mode: "Sensory / Visual", "Ego Dissolution", "Emotional Depth",
  "Body Sensation", "Time Perception", "Transcendence"
- Science mode: "5-HT2A Activity", "DMN Suppression", "5-HT1A / SERT",
  "α1-Adrenergic", "Thalamic Gating", "κ-Opioid / 5-MeO"

**Visual requirements:**
- Predicted polygon: `accentColor` at 15% opacity fill, 40% opacity stroke
- Lived polygon: `accentColor` at 40% opacity fill, 80% opacity stroke, glowing
- Gap region between polygons: gold `rgba(245,158,11,0.12)` shade
- Gap label: small gold text "Where your journey was uniquely yours" positioned
  at the widest divergence point
- Toggle button above chart: pill-style, smooth label crossfade (300ms transition)
- Empty state (no livedData): renders Predicted only + copy beneath:
  "Your session data will appear here once your practitioner logs your events."
- Print mode: renders both polygons simultaneously with legend (no toggle)

---

### Component A2: `FlightPlanChart.tsx`

**Visual:** Recharts `<AreaChart>` spanning full card width.

**Props interface:**
```typescript
interface FlightPlanChartProps {
  substanceCategory: 'psilocybin' | 'ketamine' | 'mdma' | 'ayahuasca' | 'unknown';
  accentColor: string;
  sessionEvents: Array<{ minutesFromDose: number; intensity: number; label: string }>;
  doseAdministeredAt: Date | null;
}
```

**Pharmacokinetic curve data (static per substance — BUILDER implements):**
```
psilocybin: onset=30m, peak=90m, peak_end=240m, comedown=300m, duration=360m
  curve shape: slow onset, long plateau, gentle comedown
ketamine:   onset=5m, peak=20m, peak_end=45m, comedown=90m, duration=120m
  curve shape: very fast spike, rapid fall
mdma:       onset=45m, peak=90m, peak_end=240m, comedown=360m, duration=480m
  curve shape: gradual rise to wide plateau, slow descent
ayahuasca:  onset=20m, purge=30-45m marker, peak=60m, peak_end=240m, duration=480m
  curve shape: fast onset, purge phase dip then rise, long peak
```

**Phase band labels (background regions behind curve):**
- ONSET: `accentColor` at 8% opacity
- PEAK / PLATEAU: `accentColor` at 15% opacity
- INTEGRATION: gold at 10% opacity
- AFTERGLOW: gold at 5% opacity

**Patient event dots:**
- Glowing circle at each `minutesFromDose` position on the X-axis
- Dot color: `accentColor`, size: 8px, glow: `box-shadow: 0 0 8px accentColor`
- Hover tooltip: `eventLabel` in patient language

**Required copy:**
- Y-axis label: "Intensity"
- X-axis label: "Time from your dose"
- Disclaimer below chart (always visible): "This curve represents population
  averages for this substance. Your individual experience may vary."
- Empty state (no events): renders curve only + "Your session moments will
  appear as glowing points once your session events are logged."

---

### Component A3: `BrainNetworkMap.tsx`

**Visual:** Pure SVG. Two brain illustrations side by side. No data dependency.

**Props interface:**
```typescript
interface BrainNetworkMapProps {
  substanceCategory: 'psilocybin' | 'ketamine' | 'mdma' | 'ayahuasca' | 'unknown';
  substanceName: string;
  accentColor: string;
}
```

**Left brain — "The Conditioned Mind":**
- Brain outline SVG path in muted slate (`#334155`)
- 8–12 short, curved path lines between DMN node positions
  (prefrontal cortex, posterior cingulate, angular gyrus, hippocampus)
- Lines: `#475569`, `strokeWidth: 1.5`, `opacity: 0.6`
- Label below: "Repetitive thought patterns" in slate-400

**Right brain — "During Your Session":**
- Same brain outline
- 60–80 lightweight lines cross-wiring ALL node positions to ALL others
- Lines: `accentColor`, `strokeWidth: 0.5`, `opacity: 0.3–0.7` (randomly varied)
- A subtle radial glow behind the brain: `accentColor` at 8% opacity
- Label below: "New connections forming" in `accentColor`
- Subtitle above right brain: `substanceName`

**Below both brains:**
- `"Your brain was not breaking. It was building."`
- Style: 18px, weight 600, teal, centered

**Implementation note:** BUILDER should use React SVG with `useMemo` to
pre-generate the connection line coordinates — 60–80 lines with fixed seed
(same patient always sees same network pattern, not random on each render).

---

### Component A4: `EmotionalWaveform.tsx`

**Visual:** Recharts `<AreaChart>` with colored peaks per event category.

**Props interface:**
```typescript
interface EmotionalWaveformProps {
  accentColor: string;
  events: Array<{
    minutesFromDose: number;
    intensity: number;
    category: 'joy' | 'difficulty' | 'insight' | 'somatic' | 'connection' | 'dissolution';
    label: string;
  }>;
  sessionDurationMinutes: number;
}
```

**Category color map:**
```
joy          → teal  '#2dd4bf'
difficulty   → rose  '#fb7185'
insight      → gold  '#f59e0b'
somatic      → slate '#94a3b8'
connection   → violet '#a78bfa'
dissolution  → white '#f1f5f9' at 60% opacity
```

**Visual requirements:**
- Each event category renders as a colored peak on the waveform
- Baseline: flat line at y=0 in slate at 20% opacity
- Hover on any peak: tooltip with `label` in large patient language
- Areas between peaks: gradient fade to transparent at bottom
- Empty state: flat baseline + 5 ghost peaks in slate at 20% opacity
  + copy: "Your emotional terrain will appear here after your session."
- Print mode: static render, no hover

---

### Acceptance Criteria

- [ ] All 4 component files exist in `src/components/compass/`
- [ ] `CompassSpiderGraph` renders both Predicted and Lived polygons when `livedData` is provided
- [ ] `CompassSpiderGraph` Science/Experience toggle changes axis labels (not shapes)
- [ ] `CompassSpiderGraph` gap region renders in gold between polygons
- [ ] `FlightPlanChart` renders correct curve shape for all 4 substance categories
- [ ] `FlightPlanChart` patient event dots render at correct `minutesFromDose` positions
- [ ] `BrainNetworkMap` renders two brain states with correct line density contrast
- [ ] `BrainNetworkMap` accent color driven by `substanceCategory` prop
- [ ] `EmotionalWaveform` renders category-colored peaks with correct colors
- [ ] All 4 components have typed Props interfaces — zero `any` types
- [ ] All 4 components have empty states as specified
- [ ] Print mode verified for all 4 components (`@media print` renders correctly)
- [ ] WCAG AA: all text elements ≥ 14px, contrast ≥ 4.5:1
- [ ] Components are self-contained — zero direct Supabase calls
