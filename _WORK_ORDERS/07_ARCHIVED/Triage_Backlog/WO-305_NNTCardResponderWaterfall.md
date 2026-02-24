---
id: WO-305
title: "NNT Card + ResponderWaterfall — Clinic Outcome KPI Cards"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-21
created_by: ANALYST + PRODDY
failure_count: 0
priority: P2
tags: [analytics, clinic-level, NNT, waterfall, funnel, outcomes, kpi]
depends_on: [WO-231 data seeding, WO-303 OutcomeBenchmarkRibbon]
parent: null
user_prompt: |
  ANALYST identified NNT as the most clinician-friendly statistic in the toolkit.
  PRODDY: "NNT converts abstract effect sizes into a human-scale statement that gets 
  shared in conversations with referring psychiatrists, at conferences, in grant applications.
  It should be copy-exportable."
---

# WO-305: NNT Card + ResponderWaterfall — Clinic Outcome KPI Cards

**Owner: LEAD → BUILDER**
**Priority: P2 — Clinic-director retention; upgrades Solo → Practice tier**

---

## COMPONENT 1: `NNTCard`

### What Is NNT?
Number Needed to Treat — how many patients you must treat with a given protocol for one to achieve clinical response who wouldn't have otherwise. The lower the NNT, the more effective the treatment.

### The Practitioner Statement This Enables
> *"For every 3.1 patients treated with your psilocybin protocol, 1 achieves clinical response — compared to an NNT of 4.7 in the MAPS Phase 3 trial benchmark."*

This is the single most compelling statistic a clinic director can share externally.

### Calculation
```
NNT = 1 / (Clinic Response Rate - Benchmark Control Rate)

Clinic Response Rate = patients achieving ≥ CMC threshold / total treated (with follow-up data)
Benchmark Control Rate = from benchmark_cohorts WHERE setting = 'control_arm' (or use published placebo rates)
```

**Published placebo/control rates to use (seeded in benchmark_cohorts):**
- MDMA-PTSD (MAPS): Placebo response rate = 32%
- Psilocybin-MDD (Hopkins): waitlist control response = 15%
- Psilocybin-TRD (COMPASS): 1mg (active control) response = 18%
- Ketamine-MDD: Standard care comparator ≈ 12%

### UI Specification

```
┌─────────────────────────────────────────────────────────┐
│ NUMBER NEEDED TO TREAT                                  │
│ Psilocybin · Depression (PHQ-9)        [Copy to Clipboard] │
│                                                         │
│         ╔══════╗                                        │
│         ║  3.1 ║  ← Your NNT                           │
│         ╚══════╝                                        │
│                                                         │
│  vs. 4.7  published Phase 3 benchmark (COMPASS N=233)  │
│                                                         │
│  Interpretation: Your protocol requires 34% fewer      │
│  patients treated per response than the clinical trial │
│  comparator.                                           │
│                                                         │
│  Based on n=31 patients with complete follow-up data   │
│  [EXTERNAL BENCHMARK — Nature Medicine 2022]           │
└─────────────────────────────────────────────────────────┘
```

**[Copy to Clipboard]** button — copies plain-text version:
> "NNT = 3.1 for psilocybin-assisted therapy for depression at [Clinic Name], vs. 4.7 in the COMPASS Phase 3 trial benchmark (n=233). Based on 31 patients with complete 6-week follow-up data. Source: PPN Portal Clinical Intelligence."

### k-anonymity: N ≥ 5 with follow-up data required before NNT is shown

---

## COMPONENT 2: `ResponderWaterfall`

### What It Shows
How many patients entered each stage of the treatment pipeline, and how many made it through. Honest attrition reporting — including why people left at each stage.

### Visual: Horizontal Population Funnel

```
Enrolled          ████████████████████  N=47
Baseline Done     ████████████████████  N=45  (95%)
Dosing Session    ████████████████      N=38  (80%)
Integration Done  ████████████          N=29  (61%)
Follow-up Data    ████████              N=23  (49%)
Improved (CMC)    ██████                N=18  (38%)
Responded (≥50%)  █████                 N=16  (34%)
Remitted          ████                  N=11  (23%)
```

Bar widths proportional to N. Percentages shown on right (% of enrolled, not % of prior stage — prevents misleading compounding).

### Dropout Annotation
At each stage where N drops by >10%, show a small annotation:
- "7 patients: no dosing session logged"
- "9 patients: no integration data"

This is the **documentation gap detector** in funnel form.

### Benchmark Overlay
Add small markers at the Responded and Remitted stages showing the benchmark rates:
- "Phase 3 benchmark: 67% response" → vertical tick mark at 67% of enrolled

### Source Annotations
All benchmark markers: `[EXTERNAL BENCHMARK — Source: {citation}]`

---

## TECHNICAL IMPLEMENTATION

### New Components
- `src/components/analytics/NNTCard.tsx`
- `src/components/analytics/ResponderWaterfall.tsx`

### New Service Functions in `src/services/analytics.ts`
```typescript
// Calculate NNT for a given modality + instrument
async function getNNT(siteId: number, modality: string, instrument: string): Promise<{
  clinicResponseRate: number;
  benchmarkControlRate: number;
  nnt: number;
  n: number;
  benchmarkSource: string;
} | null>

// Get waterfall data
async function getResponderWaterfall(siteId: number): Promise<{
  enrolled: number;
  baselineComplete: number;
  dosingComplete: number;
  integrationComplete: number;
  followupComplete: number;
  improved: number;
  responded: number;
  remitted: number;
  dropoutAnnotations: { stage: string; n: number; note: string }[];
}>
```

---

## ACCEPTANCE CRITERIA
- [ ] NNT calculated correctly using ANALYST formula
- [ ] [Copy to Clipboard] button produces clean plain-text NNT statement
- [ ] Benchmark source citation shown (`[EXTERNAL BENCHMARK — Source: ...]`)
- [ ] Waterfall shows absolute N at each stage AND % of enrolled
- [ ] Waterfall dropout annotations appear when >10% drop at a stage
- [ ] Benchmark overlay marks shown at Responded and Remitted stages
- [ ] k-anonymity: both components hidden if N < 5
- [ ] No PHI — aggregate data only
- [ ] Fonts ≥ 12px
- [ ] Modality selector on NNTCard (Psilocybin / MDMA / Ketamine)

## ROUTING
LEAD → BUILDER (both components are data-heavy, minimal layout complexity) → INSPECTOR
