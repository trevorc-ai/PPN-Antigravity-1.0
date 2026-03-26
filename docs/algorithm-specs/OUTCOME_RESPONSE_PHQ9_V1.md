# PPN Algorithm Specification — OUTCOME_RESPONSE_PHQ9_V1

---

## 1. Algorithm Identity

| Field | Value |
|---|---|
| **Algorithm ID** | `OUTCOME_RESPONSE_PHQ9_V1` |
| **Class** | Outcome Scoring — Depression Instrument |
| **Status** | ACTIVE |
| **Version** | V1.0.0 |
| **Owner** | LEAD / Clinical Intelligence |
| **Created** | 2026-03-25 |
| **Last Reviewed** | 2026-03-25 |
| **WO Origin** | WO-685 |

---

## 2. Business and Clinical Purpose

Computes response and remission status for a treatment episode using PHQ-9 (Patient Health Questionnaire-9) scores. PHQ-9 is the primary validated instrument for depression outcome measurement in PPN, used in Phase 3 integration assessments and longitudinal benchmarks.

**Response** = ≥50% reduction in PHQ-9 total score from baseline to follow-up.  
**Remission** = PHQ-9 total score ≤ 4 at follow-up, regardless of baseline.

These determinations are the primary outcome variables used in the Global Benchmark Intelligence layer for cohort comparison.

---

## 3. Algorithm Type

`scoring_engine` — computes a percentage change and applies two threshold rules to produce ordinal outcome classifications.

---

## 4. Input Contract

| Field | Source Table | Data Type | Required | Validation |
|---|---|---|---|---|
| `phq9_baseline_total` | `log_phq9_assessments.total_score` (timing = 'baseline') | INTEGER (0–27) | YES | Range 0–27; NULL rejected |
| `phq9_followup_total` | `log_phq9_assessments.total_score` (timing = 'post_90d' or specified window) | INTEGER (0–27) | YES | Range 0–27; NULL rejected |
| `assessment_window` | `log_phq9_assessments.assessment_timing` | ENUM (baseline / post_7d / post_30d / post_90d / post_180d) | YES | FK to `ref_assessment_timings` |
| `session_id` | `log_phq9_assessments.session_id` | UUID | YES | FK to `log_sessions` |
| `practitioner_id` | `log_sessions.practitioner_id` | UUID | YES | RLS-enforced |

---

## 5. Plain-English Logic Summary

1. Retrieve the patient's baseline PHQ-9 total score for the episode.
2. Retrieve the follow-up PHQ-9 total score at the target window (typically 90-day primary outcome).
3. Calculate `pct_change = (baseline - followup) / baseline * 100`.
4. Classify:
   - If `followup_total <= 4`: **REMISSION**
   - Else if `pct_change >= 50`: **RESPONSE**
   - Else if `pct_change >= 25 and pct_change < 50`: **PARTIAL RESPONSE** (informational, not a benchmark category)
   - Else: **NON-RESPONSE**
5. Store classification in `log_episode_outcomes.phq9_response_class`.

---

## 6. Formal Pseudo-Logic

```
FUNCTION phq9_outcome(baseline: INTEGER, followup: INTEGER) -> ENUM
  PRECONDITION: baseline IN [0..27], followup IN [0..27]
  
  IF followup <= 4 THEN
    RETURN 'REMISSION'
  END IF
  
  pct_change = ((baseline - followup) / baseline) * 100
  
  IF pct_change >= 50 THEN
    RETURN 'RESPONSE'
  ELSE IF pct_change >= 25 THEN
    RETURN 'PARTIAL_RESPONSE'
  ELSE
    RETURN 'NON_RESPONSE'
  END IF
  
EDGE CASE: IF baseline = 0 THEN
  -- Avoid division by zero; patient was in remission at baseline
  RETURN 'BASELINE_REMISSION'
END IF
END FUNCTION
```

---

## 7. Thresholds and Controlled Vocabulary

| Classification | PHQ-9 Total | % Reduction | Notes |
|---|---|---|---|
| `REMISSION` | ≤ 4 | Any | Supersedes RESPONSE |
| `RESPONSE` | > 4 | ≥ 50% | Standard clinical definition |
| `PARTIAL_RESPONSE` | > 4 | 25–49% | PPN internal only; not a benchmark export category |
| `NON_RESPONSE` | > 4 | < 25% | |
| `BASELINE_REMISSION` | No valid baseline (baseline = 0) | N/A | Flagged for review |

---

## 8. Confidence Level

`deterministic` — calculation is arithmetic with fixed thresholds. Output is fully reproducible.

---

## 9. Missing Data Handling

| Scenario | Behavior |
|---|---|
| Baseline score missing | Cannot compute. Episode excluded from benchmark cohort. `phq9_response_class = NULL`. UI shows "Insufficient data." |
| Follow-up score missing at target window | Episode excluded from primary outcome cohort. Retained in safety-only cohort. |
| Both scores present but baseline = 0 | Classified as `BASELINE_REMISSION`. Flagged for practitioner review. |

---

## 10. Override Policy

No practitioner override of classification at V1. Classification is computed and stored automatically from assessment inputs. Practitioners may add a free-text clinical note on outcomes (separate field, not in clinical tables).

---

## 11. Report Surfaces

| Surface | Location |
|---|---|
| Phase 3 assessment card | PHQ-9 response badge displayed after post-session assessment |
| Session PDF | Outcome section — shows baseline, follow-up, % change, classification |
| ArcOfCare longitudinal chart | PHQ-9 severity trajectory with response/remission zone overlays |
| Global Benchmark Intelligence | Cohort response/remission rate calculations |
| Practice export (CSV) | `phq9_response_class` column |

---

## 12. Limitations

- REMISSION threshold (≤4) is the standard validated cutpoint but may be conservative for some patient populations.
- PARTIAL_RESPONSE is a PPN-internal category not recognized in published clinical trial definitions — do not export as a benchmark category.
- The algorithm uses a single follow-up point; it does not model durability (score at 30d vs 90d vs 180d are separate computations).
- PHQ-9 scores are self-reported — the algorithm assumes instrument administration integrity.

---

## 13. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| V1.0.0 | 2026-03-25 | LEAD (WO-685) | Initial specification authored |
