---
name: data-analysis
description: ANALYST-owned skill for performing rigorous data analysis on PPN's clinical outcomes, benchmark datasets, population data, and operational metrics. Covers statistical methods, cohort analysis, signal detection, anomaly identification, and translating numbers into executive-level insights. Use whenever asking "what does the data say?" or "is this result meaningful?"
---

# 🔬 Data Analysis Skill
**Owner: ANALYST**

> *"Anyone can pull a number. An analyst pulls a number, compares it to the right baseline, checks if the difference is real, and tells you exactly what to do next."*

---

## 🎯 When to Use This Skill

Activate this skill when:
- Evaluating whether an observed outcome is statistically AND clinically meaningful
- Designing a benchmarking query against the `benchmark_cohorts` table
- Interpreting trends in `log_outcomes`, `log_safety_events`, or `log_interventions`
- Answering a practitioner's question: "How are my patients doing compared to the literature?"
- Detecting anomalies, outliers, or signals requiring clinical review
- Computing effect sizes, response rates, or remission rates from raw session data
- Building a cohort filter for a specific subpopulation analysis

---

## 🧮 Statistical Methods Toolkit

### Tier 1 — Always Available (No Special Libraries)

#### 1.1 Effect Size: Hedges' g
The standard for comparing PPN data to published benchmarks. Use Hedges' g (not Cohen's d) for small samples N<20.

```
g = (M₁ - M₂) / S_pooled × J
where J = correction factor for small samples
S_pooled = √[((n₁-1)SD₁² + (n₂-1)SD₂²) / (n₁+n₂-2)]
```

Interpretation rubric:
| g value | Interpretation | Clinical relevance |
|---------|---------------|-------------------|
| < 0.2 | Negligible | Not clinically meaningful |
| 0.2–0.5 | Small | Modest benefit worth tracking |
| 0.5–0.8 | Medium | Clinically significant |
| 0.8–1.2 | Large | Substantial benefit |
| > 1.2 | Very Large | Exceptional — verify data quality |

PPN Benchmark: Published psilocybin-depression trials average **g = −0.91** vs. control.

---

#### 1.2 Clinically Meaningful Change (CMC) Thresholds
These are the published minimum thresholds before we call a score change "real" for a patient:

| Instrument | CMC Threshold | Response Definition | Remission Definition |
|-----------|--------------|---------------------|---------------------|
| MADRS | ≥ 50% reduction | ≥ 50% reduction from baseline | Score ≤ 10 |
| PHQ-9 | ≥ 5 points | ≥ 50% reduction | Score ≤ 4 |
| GAD-7 | ≥ 4 points | ≥ 50% reduction | Score ≤ 4 |
| CAPS-5 | ≥ 10 points | ≥ 12 points reduction | Score ≤ 11 |
| QIDS-SR-16 | ≥ 6 points | ≥ 50% reduction | Score ≤ 5 |
| PCL-5 | ≥ 10 points | ≥ 50% reduction | Score < 33 |
| AUDIT | ≥ 4 points | — | Score < 8 |
| BDI-II | ≥ 8 points | ≥ 50% reduction | Score ≤ 13 |

**ANALYST Rule:** Never report only a mean score change. Always report the % of patients who exceeded the CMC threshold — that's the number practitioners care about.

---

#### 1.3 Confidence Intervals (95% CI)
For proportions (response rates, remission rates):
```
CI = p ± 1.96 × √(p(1-p)/n)
```

For means:
```
CI = M ± t(α/2, df) × (SD/√n)
```

Use n ≥ 5 as minimum before reporting any statistic. For n < 5, report raw counts only with a [SMALL SAMPLE] flag.

---

#### 1.4 Number Needed to Treat (NNT)
The most clinician-friendly statistic in the toolkit. Always compute when we have response rates:

```
NNT = 1 / (Response_Rate_Treatment - Response_Rate_Control)
```

Example framing:
> *"For every 2.8 patients treated with your psilocybin protocol, 1 achieves clinical response — compared to an NNT of 4.7 in the Phase 3 trial benchmark."*

---

### Tier 2 — Cohort Analysis Patterns

#### 2.1 Pre/Post Within-Subject Analysis
The standard design for PPN — no randomized control, but we have baseline.

```sql
-- Pattern for computing within-subject change
SELECT
  subject_id,
  MAX(CASE WHEN timepoint = 'baseline' THEN score END) AS baseline_score,
  MAX(CASE WHEN timepoint = 'week_4' THEN score END) AS week4_score,
  MAX(CASE WHEN timepoint = 'baseline' THEN score END) -
  MAX(CASE WHEN timepoint = 'week_4' THEN score END) AS absolute_change,
  ROUND(
    100.0 * (
      MAX(CASE WHEN timepoint = 'baseline' THEN score END) -
      MAX(CASE WHEN timepoint = 'week_4' THEN score END)
    ) / NULLIF(MAX(CASE WHEN timepoint = 'baseline' THEN score END), 0),
    1
  ) AS pct_change,
  CASE
    WHEN 100.0 * (
      MAX(CASE WHEN timepoint = 'baseline' THEN score END) -
      MAX(CASE WHEN timepoint = 'week_4' THEN score END)
    ) / NULLIF(MAX(CASE WHEN timepoint = 'baseline' THEN score END), 0)
    >= 50 THEN 'Responder'
    ELSE 'Non-Responder'
  END AS response_status
FROM log_outcomes
WHERE instrument = 'MADRS'
GROUP BY subject_id;
```

---

#### 2.2 Benchmark Comparison Pattern
Comparing a clinic's observed outcomes to our seeded `benchmark_cohorts`:

```sql
-- Get clinic outcomes vs. global benchmark for same condition/modality
WITH clinic_outcomes AS (
  SELECT
    AVG(outcome_score_endpoint) AS clinic_mean,
    STDDEV(outcome_score_endpoint) AS clinic_sd,
    COUNT(*) AS clinic_n,
    COUNT(CASE WHEN response_status = 'Responder' THEN 1 END)::FLOAT / COUNT(*) * 100 AS clinic_response_rate
  FROM log_outcomes lo
  JOIN log_clinical_records lcr ON lo.subject_id = lcr.subject_id
  WHERE lcr.site_id = :site_id
    AND lo.instrument = :instrument
    AND lo.timepoint = 'week_4'
),
global_benchmark AS (
  SELECT
    endpoint_mean AS benchmark_mean,
    endpoint_sd AS benchmark_sd,
    n_participants AS benchmark_n,
    response_rate_pct AS benchmark_response_rate,
    effect_size_hedges_g AS benchmark_effect_size,
    source_citation
  FROM benchmark_cohorts
  WHERE condition = :condition
    AND modality = :modality
    AND instrument = :instrument
  ORDER BY n_participants DESC  -- prefer largest sample benchmark
  LIMIT 1
)
SELECT
  co.*,
  gb.*,
  -- Is clinic doing better or worse?
  CASE
    WHEN co.clinic_mean < gb.benchmark_mean THEN 'Better than benchmark'
    WHEN co.clinic_mean > gb.benchmark_mean THEN 'Worse than benchmark'
    ELSE 'At benchmark'
  END AS vs_benchmark_label,
  -- Effect size of clinic vs benchmark
  (gb.benchmark_mean - co.clinic_mean) /
  SQRT((gb.benchmark_sd^2 + co.clinic_sd^2) / 2) AS clinic_vs_benchmark_g
FROM clinic_outcomes co, global_benchmark gb;
```

---

#### 2.3 Dropout/Attrition Analysis
Critical for honest reporting — always analyze who leaves and when:

```sql
-- Attrition funnel by cohort
SELECT
  'Enrolled' AS stage,
  COUNT(DISTINCT subject_id) AS n
FROM log_clinical_records
WHERE site_id = :site_id

UNION ALL

SELECT 'Completed Baseline', COUNT(DISTINCT subject_id)
FROM log_outcomes
WHERE timepoint = 'baseline' AND site_id IS NOT NULL

UNION ALL

SELECT 'Completed Week 4 Follow-up', COUNT(DISTINCT subject_id)
FROM log_outcomes
WHERE timepoint = 'week_4'

UNION ALL

SELECT 'Responders', COUNT(DISTINCT subject_id)
FROM log_outcomes
WHERE response_status = 'Responder';
```

---

#### 2.4 Subgroup Analysis
Always pre-specify subgroups before looking at data. Approved PPN subgroups:

```
Primary subgroups (always report):
  - Modality (psilocybin / MDMA / ketamine / esketamine)
  - Condition (PTSD / MDD / TRD / AUD / GAD / other)
  - Setting (group / individual / home / clinic)

Secondary subgroups (report if N ≥ 20 per cell):
  - Prior treatment failures (0 / 1-2 / 3+ failed treatments)
  - Facilitator experience level
  - Session count (1 / 2 / 3+)
  - Geographic region (if seeded from SAMHSA/ClinicalTrials.gov)
```

**ANALYST Rule:** Never run subgroup analyses on N < 10 per cell. Label any N < 20 subgroup result as [PRELIMINARY — interpret with caution].

---

### Tier 3 — Signal Detection

#### 3.1 Outlier Flagging (Clinical Safety)
```typescript
// Z-score based outlier flag — flag patients 2.5+ SDs from cohort mean
const flagOutliers = (scores: number[], threshold = 2.5) => {
  const mean = scores.reduce((a, b) => a + b) / scores.length;
  const sd = Math.sqrt(
    scores.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / scores.length
  );
  return scores.map((score, i) => ({
    index: i,
    score,
    zScore: (score - mean) / sd,
    flagged: Math.abs((score - mean) / sd) >= threshold
  }));
};
```

#### 3.2 Trend Change Detection
Flag when a patient's trajectory changes direction unexpectedly:

```typescript
// Detect unexpected worsening after initial improvement
const detectReversal = (timepoints: { week: number; score: number }[]) => {
  const sorted = timepoints.sort((a, b) => a.week - b.week);
  const changes = sorted.slice(1).map((pt, i) => ({
    week: pt.week,
    delta: pt.score - sorted[i].score
  }));
  
  // Flag if worsening (positive delta for symptom scales) > 30% after improvement
  const hadImprovement = changes.some(c => c.delta < -2);
  const hasWorsening = changes.some(c => c.delta > 4);
  
  return { reversal: hadImprovement && hasWorsening, changes };
};
```

#### 3.3 Safety Signal Rules
Automatic flags ANALYST will always check for:

| Signal | Threshold | Action |
|--------|-----------|--------|
| CAPS-5 increase > 15 pts | Any timepoint | [ALERT: PTSD WORSENING] → safety review |
| PHQ-9 item 9 (suicidality) ≥ 2 | Any session | [ALERT: SAFETY ITEM] → immediate flag |
| GAE (Grade 3+ adverse event) | Any occurrence | [ALERT: SERIOUS AE] → safety log review |
| Zero follow-up data after baseline | 4+ weeks | [FLAG: DROPOUT] → retention review |
| Score stuck (±1 across 3+ timepoints) | All timepoints | [FLAG: NON-RESPONDER] → protocol review |

---

## 🔍 The ANALYST 5-Step Analysis Protocol

Every analysis ANALYST performs must follow this sequence:

### Step 1: STATE THE QUESTION (in plain English)
Never start with data. Start with the question.
```
✅ "Are patients at this clinic achieving response rates consistent with MAPS Phase 3 benchmarks?"
❌ "Let me pull the data and see what we find."
```

### Step 2: DEFINE WHAT A GOOD ANSWER LOOKS LIKE
Specify before looking at data:
- What metric will answer the question?
- What comparison will make the answer meaningful?
- What threshold separates "good" from "needs attention"?

### Step 3: PULL THE DATA WITH FULL PROVENANCE
Every data pull must record:
- Date pulled
- Filter criteria applied
- N before and after filtering
- Missing data handling method

### Step 4: CHECK THE DATA QUALITY FIRST
Before any interpretation:
- Are there impossible values? (Scores below 0 or above instrument max)
- Are timepoints labeled consistently?
- Are there duplicate records for same subject/timepoint?
- What % of subjects have complete data?

### Step 5: REPORT THE FINDING WITH CONFIDENCE LEVEL
Every finding is classified:
```
[STRONG SIGNAL] — N ≥ 50, consistent across subgroups, p < 0.05, effect size meaningful
[MODERATE SIGNAL] — N ≥ 20, directionally consistent, but CI is wide
[WEAK SIGNAL] — N < 20, pattern visible but preliminary
[NO SIGNAL] — Data is consistent with random variation
```

---

## 📋 PPN Analytics Report Templates

### Template A: Clinic Performance Summary
```
📊 [CLINIC NAME] | [DATE RANGE] | [N] Patients | [N] Sessions

HEADLINE FINDING:
[One sentence: specific metric, comparison, implication]

OUTCOMES:
  Instrument: [MADRS / PHQ-9 / CAPS-5 / GAD-7]
  Baseline mean: [X] (SD ± Y)
  Endpoint mean: [X] (SD ± Y) at Week [N]
  Absolute change: [ΔX] points
  % Change: [X%]
  Responders: [X/N] ([%], 95% CI [low–high])
  Remission: [X/N] ([%], 95% CI [low–high])
  
BENCHMARK COMPARISON:
  vs. [Study Name, Year, N]: [Better / Worse / At par]
  Clinic effect size: g = [X]
  Benchmark effect size: g = [X]
  Difference: [Clinically meaningful / Not meaningful]

SAFETY:
  Grade 1-2 AEs: [X] events in [N] sessions ([rate])
  Grade 3+ AEs: [X] events (target: <1%)
  Dropouts: [X/N] ([%]) — reason breakdown: [reasons]

SIGNAL FLAGS:
  [Any ALERT or FLAG items from signal detection]

DATA QUALITY:
  Complete baseline + endpoint pairs: [X/N] ([%])
  Missing data handling: [Method]
```

### Template B: Global Benchmark Comparison Card
```
🌐 GLOBAL BENCHMARK: [Condition] × [Modality]

YOUR CLINIC                    │ GLOBAL BENCHMARK
─────────────────              │ ─────────────────
Response Rate:  [X%] (n=[N])   │ [X%] (n=[N], source: [Study])
Remission Rate: [X%]           │ [X%]
Median Change:  [ΔX] pts       │ [ΔX] pts
AE Rate (<G3):  [X%]           │ [X%]

STATUS: [✅ Above benchmark / ⚠️ At benchmark / ❌ Below benchmark]
INTERPRETATION: [1 sentence — what should the practitioner do?]
```

---

## 🚫 ANALYST Integrity Rules

These are non-negotiable. Violating them is a two-strike offense.

1. **Never cherry-pick the benchmark.** Always use the largest-N published benchmark for a given condition/modality. Do not select the benchmark that makes the clinic look best.

2. **Never omit dropouts.** Attrition is data. Report it separately and account for it in all rate calculations.

3. **Never extrapolate beyond the data.** If the study endpoint is Week 4, do not make statements about Week 12 outcomes unless there is Week 12 data.

4. **Never confuse statistical significance with clinical significance.** A p < 0.05 with g = 0.1 is statistically significant and clinically meaningless.

5. **Never present synthetic seed data as live practitioner data.** All `benchmark_cohorts` and `benchmark_trials` records must be labeled [EXTERNAL BENCHMARK — Source: {citation}] in every UI display.

6. **Always label direction.** "A significant improvement" without specifying which direction, how much, and compared to what is not analysis — it is marketing copy.

---

**END OF DATA ANALYSIS SKILL**
