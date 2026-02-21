---
id: WO-312
title: "Wellness Journey Output Engine — Phase 3: Longitudinal Outcome Visualizations"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-21
created_by: CUE
failure_count: 0
priority: P0_CRITICAL
tags: [wellness-journey, longitudinal, outcomes, meq30-correlation, phase-3, per-patient, charts]
depends_on: []
skills_required: [visual-data-storytelling, advanced-chart-engineering]
user_prompt: |
  "Longitudinal Outcome Visualizations: the most critical clinical output.
  Charts comparing baseline symptom scores against post-treatment scores, overlaid with
  the patient's subjective experience scores (MEQ-30, Emotional Breakthrough Inventory).
  This allows the provider to clearly see if the intensity of the psychedelic experience
  correlates with symptom reduction, which informs future dosing decisions."
---

# WO-312: Per-Patient Longitudinal Outcome Visualizations

## STRATEGIC IMPORTANCE

This is labelled P0 not because it's a safety issue but because it is the **core clinical value
proposition of the entire platform**.

If a practitioner can look at one chart and see:
- Their patient's PHQ-9 dropped from 24 → 11 (54% reduction) over 8 weeks
- Their MEQ-30 was 78/100 (high mystical experience)
- The Phase 3 trial benchmark shows 52% average response
- This patient is performing in the top 20% of published benchmarks

...they will never leave PPN. This is the moment the platform becomes indispensable.

This chart must be built with both the `visual-data-storytelling` AND `advanced-chart-engineering`
skills active — it is the most important visualization in the product.

---

## WHERE IN THE UI (confirmed by LEAD)

**First panel in Phase 3, above "Early Follow-up" and "Integration Work" buttons.**
The clinician sees this immediately when they switch to Phase 3.

---

## GAP ANALYSIS

### What Exists
- `log_baseline_assessments` — PHQ-9, GAD-7, CAPS-5, PCL-5, ACE at Week 0
- `log_longitudinal_assessments` — follow-up scores at each timepoint
- `log_clinical_records` — links session to patient, includes MEQ-30 score field
- Analytics page has aggregate outcome charts — but NO per-patient view in Wellness Journey

### What's Missing
- `PatientOutcomePanel` — the per-patient chart panel for Phase 3
- `getPatientLongitudinalData()` — query function pulling baseline + all follow-ups for one patient
- MEQ-30 correlation overlay on the symptom trajectory
- Per-patient benchmark comparison (vs. published Phase 3 data)

---

## DELIVERABLE 1: Query Layer (`src/services/patientOutcomes.ts`)

```typescript
export interface PatientTimepoint {
  week: number;           // 0 = baseline, 1, 3, 6, 12 weeks post
  label: string;          // 'Baseline', 'Week 3', 'Week 6', 'Week 12'
  phq9: number | null;
  gad7: number | null;
  caps5: number | null;
  pcl5: number | null;
  recordedAt: string;
}

export interface PatientExperienceScore {
  sessionNumber: number;
  meq30: number | null;     // 0–100
  edi: number | null;       // Emotional Breakthrough Inventory
  ceq: number | null;       // Challenging Experience Questionnaire
}

export interface PatientOutcomeData {
  patientId: string;
  substance: string;
  timepoints: PatientTimepoint[];
  experienceScores: PatientExperienceScore[];
  responseAchieved: boolean | null;  // ≥50% reduction in primary instrument
  remissionAchieved: boolean | null; // PHQ-9 < 5 or CAPS-5 < 20
  primaryInstrument: 'PHQ-9' | 'CAPS-5' | 'GAD-7' | 'PCL-5';
}

export async function getPatientOutcomeData(
  patientId: string,
  sessionId: string
): Promise<PatientOutcomeData | null>
```

---

## DELIVERABLE 2: PatientOutcomePanel (`src/components/wellness-journey/PatientOutcomePanel.tsx`)

### THE CLAIM (defined per skill requirement)
> "This patient's symptom score dropped [X]% since baseline — [above/at/below] the Phase 3 benchmark
> response rate — and their MEQ-30 of [N] suggests [sustained benefit is expected / limited experience
> may explain slower response]."

### Visual Layout: Two Charts Side by Side (or stacked on mobile)

---

### Chart 1: Symptom Trajectory (PRIMARY — left panel)

Uses `OutcomeBenchmarkRibbon` pattern from `advanced-chart-engineering` skill.

```
PHQ-9 Score Over Time                    ↓ Lower = Better

Score
  │
24 ┤ ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Phase 3 Trial Range (shaded)
   │
18 ┤
   │                    ╭────────────── Real-World Avg (dashed)
12 ┤                   ╱
   │ ○ ← This Patient ╱
 8 ┤                  ●━━━━━━━━━━●     ← Phase 3 lower bound
   │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Response Threshold (50% of baseline)
 5 ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Remission Line (PHQ-9 < 5)
   │
   └────────────────────────────────────
   Baseline   Week 3   Week 6   Week 12
```

**Layers (in render order — context before data):**
1. Phase 3 benchmark range ribbon (gray shaded Area) — `animationBegin: 200`
2. Real-world average dashed line — `animationBegin: 500`
3. Response threshold reference line (50% of baseline value) — `animationBegin: 600`
4. Remission reference line — `animationBegin: 700`
5. Patient's score line (violet, with CI dots) — `animationBegin: 900`

**Endpoint label** at final timepoint:
```
● Week 12: 11 pts  [RESPONSE ✓] [54% reduction]
```

---

### Chart 2: MEQ-30 Correlation (RIGHT panel / secondary)

**The Claim:** "Does the depth of the experience predict the depth of the healing?"

```
Experience Depth vs. Outcome
                    MEQ-30 Score
                    ───────────────────────
High   (80–100)     ████████████████  92%  response rate (published)
                    ▓▓▓▓▓▓ This patient: 78 ← marked with vertical line

Medium (50–79)      ████████  67% response rate

Low    (< 50)       ████  34% response rate

   ← Your patient's MEQ-30: 78/100 (High bracket)
   → Expected response rate at this MEQ-30 level: ~87%
   → Actual response: [RESPONSE ACHIEVED ✓]
```

Visual: Horizontal bar chart with the patient's MEQ-30 score as a vertical marker line.
When patient data is in the "High" bracket, highlight that row in emerald.
When in "Low" bracket, display: "Consider dose escalation for next session — low experience depth associated with lower response rates in published literature."

---

### Insight Headline (above the charts, always visible)

```tsx
// Computed dynamically from PatientOutcomeData
const headline = buildOutcomeHeadline(data);

// Examples:
// "PHQ-9 dropped 54% since baseline — Above the Phase 3 trial benchmark (52% response)"
// "GAD-7 improved 31% in 8 weeks — Approaching response threshold (50% needed)"
// "CAPS-5 unchanged after 6 weeks — MEQ-30 of 32 suggests dose review may be warranted"
```

---

### Footer: Clinician Action Prompt

```tsx
// Conditional on outcome data:
if (!responseAchieved && meq30 < 50) {
  // Show: "Low experience depth + limited response — consider dose escalation before next session"
  // Button: "Open Dosing Protocol" → handleOpenForm('dosing-protocol')
}

if (responseAchieved && meq30 > 70) {
  // Show: "Strong response + high experience depth — maintain current protocol"
  // Button: "Generate Discharge Summary" (if Phase 3 near completion)
}
```

---

## DELIVERABLE 3: Empty / Loading States

```
Loading:  [Skeleton of two side-by-side chart outlines — matches shape of rendered charts]

Not enough data:
  "Outcome tracking begins after first post-session assessment.
   Complete a Longitudinal Assessment to unlock this panel."
  [Button: Open Longitudinal Assessment]

Baseline only (no follow-ups yet):
  "Baseline captured: PHQ-9 = 24 | GAD-7 = 18 | PCL-5 = 55
   Post-session assessment data will appear here after Week 3 follow-up."
  [Baseline scores shown as horizontal reference lines on an empty timeline]
```

---

## ACCEPTANCE CRITERIA

- [ ] Instrument auto-selected based on patient's primary diagnosis (CAPS-5 for PTSD, PHQ-9 for MDD, GAD-7 for anxiety)
- [ ] Benchmark ribbon uses `ref_benchmark_cohorts` data matching patient's substance + condition
- [ ] `animationBegin` stagger: benchmark ribbon before patient line
- [ ] Response threshold line = exactly 50% of baseline primary instrument score (computed per patient)
- [ ] Remission line = instrument-specific (PHQ-9: 5, CAPS-5: 20, GAD-7: 5)
- [ ] MEQ-30 correlation chart shows published bracket response rates
- [ ] MEQ-30 vertical marker correctly placed at patient's actual score
- [ ] Action prompt correctly fires based on outcome + experience score
- [ ] Outcome headline is specific (includes actual numbers and benchmark comparison)
- [ ] All threshold lines have text labels (position only is not sufficient)
- [ ] "Lower = Better" annotation present on symptom chart
- [ ] Loading skeleton matches chart shape
- [ ] Empty state includes "Open Longitudinal Assessment" CTA
- [ ] Panel only renders when `activePhase === 3`
- [ ] All fonts ≥ 12px
- [ ] No PHI — patient referenced by Subject_ID only in any export
