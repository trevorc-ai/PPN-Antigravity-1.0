---
id: WO-570c
title: "Integration Compass — Integration & Ritual Layer: EMA Graph, Waveform, Daily Check-In, Day Awareness"
owner: BUILDER
status: 04_QA
authored_by: LEAD
parent: WO-570
sequence: 3
date: 2026-03-02
priority: P0
tags: [compass, ema-graph, daily-check-in, day-awareness, integration-layer, showcase]
failure_count: 0
depends_on: [WO-570a, WO-570b]
blocks: [WO-570d]
---

## LEAD Architecture

Ticket 3 of 5. Extracts and enhances all existing Compass components from
`PatientReport.tsx`, plus builds the new daily ritual components.
After this ticket, the old `PatientReport.tsx` can be replaced entirely.

---

### Extracted Components (from PatientReport.tsx)

These exist in `PatientReport.tsx` today as inline definitions. BUILDER extracts
them to `src/components/compass/` with no functional changes — only prop-interface
cleanup and showcase readiness.

**B2. `CompassZone.tsx`** — Zone shell wrapper
- Props: `number`, `title`, `accentColor`, `children`, `icon?`
- Badge: teal ring / slate bg / white numeral (current implementation kept)
- Title text color: `accentColor`

**B3. `CompassSlider.tsx`** — Custom range input
- Props: `label`, `emoji`, `value`, `onChange`, `minLabel`, `maxLabel`, `name`
- All custom CSS (`.compass-slider`) extracted as a CSS module or inline style block
- Full `-webkit-` and `-moz-` prefix coverage

**B4. `FeelingWave.tsx`** — Feeling pills display
- Props: `feelings: string[]`, `maxVisible?: number`
- Current ghost preview state for empty retained and polished
- Connected to EmotionalWaveform (A4): feeling categories use same color map

---

### New Ritual Components

**C1. `DailyCheckInCard.tsx`**

**Props:**
```typescript
interface DailyCheckInCardProps {
  sessionId: string;
  patientUuid: string;
  daysPostSession: number | null;
  checkInTier: 'daily' | 'weekly' | 'milestone-90';
  onSubmitSuccess: (newPoint: EMAPoint) => void;
}
```

**Contents:**
1. `DayAwarenessHeader` (C2) at top
2. Four `CompassSlider` instances:
   - Mood: "How heavy has your mood been?" Low/High, emoji 🌤
   - Sleep: "How restorative was your sleep?" Poor/Restful, emoji 🌙
   - Connection: "How connected have you felt?" Isolated/Connected, emoji 💛
   - Anxiety: "How much has worry been with you?" Calm/Anxious, emoji 🌊
3. Safety gate (binary, always last):
   "Are you having any thoughts of harming yourself or others?"
   [ No, I'm okay ] [ I need support — get help now ]
   - "I need support" triggers: surface Fireside Project 623-473-7433,
     write to `log_red_alerts`, do NOT block submission
4. Submit button: solid teal gradient
5. Post-submit: `CompassInsightLine` (C3) replaces submit button

**Write target:** `log_pulse_checks` with columns:
`session_id`, `patient_uuid`, `check_in_date` (today), `completed_at` (now()),
`mood_level`, `sleep_quality`, `connection_level`, `anxiety_level`

**Weekly panels** (render only when `checkInTier === 'weekly'`):
collapsible section below daily sliders with behavioral change chips
(per WO-566 spec — `log_behavioral_changes` write target)

---

**C2. `DayAwarenessHeader.tsx`**

**Props:** `daysPostSession: number | null`

**Copy by tier:**
```
null / unknown → "How are you today?"
Days 1–3   → "Day {N} — The first days are often the most intense. How are you?"
Days 4–7   → "Day {N} of your integration window. How are you?"
Days 8–14  → "Day {N} — You're in the heart of the neuroplastic window. How are you today?"
Days 15–21 → "Day {N} — Your window is still open. How are you showing up?"
Days 22–28 → "Day {N} — You're approaching the end of the standard window. How do you feel?"
Days 29+   → "Integration continues. How are you today?"
```

**Style:** 26px, weight 700, white, centered, margin-bottom 8px.
Sub-line (always): "Log today's check-in and watch your journey grow." 13px slate-400.

---

**C3. `CompassInsightLine.tsx`**

**Props:** `points: EMAPoint[]` (last 7 entries from useCompassEMA)

**Logic:**
1. If mood improved over last 3 entries → "Your mood has risen {N} points over 3 days."
2. Else if sleep improved → "Your sleep quality has improved for {N} consecutive days."
3. Else → "You've shown up {streakDays} days in a row. That matters."

**Style:** 16px, teal, centered, with a ✦ icon prefix. Fades in on render (300ms).

---

**B1. `CompassEMAGraph.tsx`** (enhanced extraction)

**Props:**
```typescript
interface CompassEMAGraphProps {
  points: EMAPoint[];
  sessionDate: Date | null;
  daysPostSession: number | null;
  accentColor: string;
}
```

**Enhancements from current EMAGraph:**
- Glowing teal vertical marker at session date (day 0)
- Gold glow region overlay for days 0–21 (neuroplastic window)
- `← Day 21` SVG text label at window right edge
- Three lines: mood (teal), sleep (violet), anxiety (rose, inverted)
- Day-awareness sentence beneath graph:
  "You are on Day {N} of your integration window." in teal 14px bold
  OR "Your standard integration window has closed, but integration continues."
  if daysPostSession > 28

---

**D1. `IntegrationStoryChart.tsx`**

**Props:**
```typescript
interface IntegrationStoryChartProps {
  outcomes: LongitudinalPoint[];       // from log_longitudinal_assessments
  baselinePhq9: number | null;
  sessionDate: Date | null;
  accentColor: string;
}
```

**Visual:**
- Area chart: PHQ-9 score over time (lower = better, Y-axis inverted for visual)
- Second line: GAD-7 score
- Glowing marker at `sessionDate` (dosing session vertical line)
- Color band: "Typical recovery range" (static population reference, labeled)
- Hover on session marker: tooltip with dose info if available
- Empty state: "Complete a weekly check-in to see your scores over time."

---

**D2. `NetworkBenchmarkBlock.tsx`**

**Props:**
```typescript
interface NetworkBenchmarkBlockProps {
  substanceName: string | null;
  indicationName: string | null;
}
```

Three stat cards, copy scoped to substance + indication:
- "84% of people in {substanceName}-assisted therapy for {indicationName}
  report meaningful relief by week 6."
- "3.2x more likely to sustain improvements with active integration practice."
- "91% say they would recommend this therapy to others in similar circumstances."

If substance or indication unknown: use generic population framing.

---

### Acceptance Criteria

- [ ] `CompassZone`, `CompassSlider`, `FeelingWave` extracted from PatientReport.tsx
  to `src/components/compass/` — PatientReport.tsx no longer defines them inline
- [ ] `DailyCheckInCard` writes to `log_pulse_checks` with all required columns
- [ ] `DailyCheckInCard` safety gate: "I need support" writes to `log_red_alerts`
  AND surfaces Fireside Project number 623-473-7433
- [ ] `DayAwarenessHeader` renders correct copy for all 6 day tiers
- [ ] `CompassInsightLine` renders one of 3 insight types based on point data
- [ ] `CompassEMAGraph` renders session date marker and neuroplastic window glow
- [ ] `IntegrationStoryChart` renders empty state when no outcome data
- [ ] `NetworkBenchmarkBlock` scopes copy to substance + indication when available
- [ ] All 8 components: typed Props, zero `any`, zero direct Supabase calls
- [ ] All custom slider CSS cross-browser verified (Chrome, Firefox, Safari iOS)
