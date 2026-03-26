# PPN Algorithm Specification — BENCH_SAFETY_RATE_V1

---

## 1. Algorithm Identity

| Field | Value |
|---|---|
| **Algorithm ID** | `BENCH_SAFETY_RATE_V1` |
| **Class** | Benchmark Analytics — Safety Rate Calculation |
| **Status** | ACTIVE |
| **Version** | V1.0.0 |
| **Owner** | LEAD / Global Benchmark Intelligence |
| **Created** | 2026-03-25 |
| **Last Reviewed** | 2026-03-25 |
| **WO Origin** | WO-685 |

---

## 2. Business and Clinical Purpose

Computes the adverse event (AE) rate per session for a practitioner's practice and compares it against peer network benchmarks. This is the primary safety comparison metric in the Global Benchmark Intelligence layer, enabling practitioners to understand how their AE incidence compares to similar practices (by substance, protocol type, indication, etc.).

**Suppression rule:** Any cohort or segment with fewer than n=5 contributing sessions is suppressed in benchmark output to prevent de-anonymization of small practices.

---

## 3. Algorithm Type

`aggregation_engine` — counts events across a defined cohort, computes rates, and applies suppression rules before surfacing values.

---

## 4. Input Contract

| Field | Source Table | Data Type | Required | Notes |
|---|---|---|---|---|
| `session_count` | `mv_site_monthly_quality.session_count` | INTEGER | YES | Min 5 for benchmark output |
| `ae_count_total` | `log_adverse_events` COUNT per practitioner | INTEGER | YES | All grades |
| `ae_count_grade3plus` | `log_adverse_events` WHERE `ae_grade >= 3` | INTEGER | YES | Grade 3+ specifically |
| `practitioner_id` | `log_sessions.practitioner_id` | UUID | YES | RLS-enforced — own practice data only |
| `substance_filter` | `ref_substances.substance_name` | VARCHAR | NO | Optional cohort filter |
| `date_range_start` | Query parameter | DATE | NO | Default: trailing 12 months |
| `date_range_end` | Query parameter | DATE | NO | Default: today |

---

## 5. Plain-English Logic Summary

1. Count all sessions within the date range and substance filter for the practitioner (own practice rate).
2. Count all AE events for those sessions — total and Grade 3+.
3. Compute own practice AE rate: `ae_count_total / session_count * 100` (as percentage).
4. Compute own practice Grade 3+ rate: `ae_count_grade3plus / session_count * 100`.
5. Retrieve peer cohort benchmark from `mv_benchmark_by_subgroup` for the same substance/indication segment.
6. Apply suppression: if peer cohort session_count < 5, suppress peer rate (display "Insufficient data — n < 5").
7. Apply suppression: if own practice session_count < 5, suppress own rate (display "Insufficient data — log more sessions").
8. Return: own rate, peer benchmark rate, delta (own - benchmark), percentile rank if available.

---

## 6. Formal Pseudo-Logic

```
FUNCTION bench_safety_rate(practitioner_id, substance_filter, date_range) -> BenchmarkResult

  // Own practice computation
  own_sessions = COUNT(log_sessions WHERE practitioner_id = practitioner_id AND date IN date_range AND substance LIKE substance_filter)
  own_ae_total = COUNT(log_adverse_events WHERE session_id IN own_sessions)
  own_ae_grade3 = COUNT(log_adverse_events WHERE session_id IN own_sessions AND ae_grade >= 3)

  IF own_sessions < 5 THEN
    own_rate = SUPPRESSED
    own_grade3_rate = SUPPRESSED
  ELSE
    own_rate = (own_ae_total / own_sessions) * 100
    own_grade3_rate = (own_ae_grade3 / own_sessions) * 100
  END IF

  // Peer cohort benchmark
  peer_data = SELECT FROM mv_benchmark_by_subgroup WHERE substance = substance_filter AND segment = indication
  
  IF peer_data.session_count < 5 THEN
    peer_rate = SUPPRESSED
  ELSE
    peer_rate = peer_data.ae_rate_pct
    peer_grade3_rate = peer_data.ae_grade3_rate_pct
  END IF

  RETURN {
    own_rate:         own_rate,
    own_grade3_rate:  own_grade3_rate,
    peer_rate:        peer_rate,
    peer_grade3_rate: peer_grade3_rate,
    delta:            own_rate - peer_rate (if both available),
    n_own:            own_sessions,
    n_peer:           peer_data.session_count
  }

END FUNCTION
```

---

## 7. Thresholds and Controlled Vocabulary

| Parameter | Value | Rationale |
|---|---|---|
| Minimum n for benchmark display | n >= 5 | Prevents de-anonymization of small single-practitioner cohorts |
| AE rate display unit | Per-session percentage | Intuitive for practitioners — "X% of sessions had at least one AE" |
| Grade 3+ rate display unit | Per-session percentage | Regulatory-relevant severity tier |
| Benchmark comparison window | Trailing 12 months (default) | Stable longitudinal comparison; configurable |

**Suppression is non-negotiable.** Any segment below n=5 displays "Insufficient data" — no rate, no delta, no percentile.

---

## 8. Confidence Level

`estimated` — the benchmark value is accurate to the cohort data in `mv_benchmark_by_subgroup`. As the network grows, the benchmark stabilizes. Small network size = high variance in benchmark values. UI should display confidence interp (e.g., "Based on N=32 sessions from 7 practices") when available.

---

## 9. Missing Data Handling

| Scenario | Behavior |
|---|---|
| No AE events for a practice | Rate = 0.0% (zero is a valid and meaningful result, not missing data) |
| Session count < 5 (own practice) | Suppress own rate — show "Log more sessions to unlock comparison" |
| Peer cohort n < 5 | Suppress peer rate — show "Insufficient peer data for this segment" |
| Substance filter yields no peer cohort | Suppress benchmark — show "No benchmark data for this substance yet" |

---

## 10. Override Policy

No overrides. Suppression of n < 5 cohorts is enforced at the query layer (`mv_benchmark_by_subgroup` enforces suppression via WHERE clause before values reach the UI). This cannot be overridden by any role including ADMIN at V1.

---

## 11. Report Surfaces

| Surface | Location |
|---|---|
| Safety Benchmark panel | `SafetyRiskMatrix.tsx` — "Your AE Rate vs. Peers" widget |
| Practice analytics dashboard | AE rate trend chart (own practice) |
| Session PDF | Practice safety profile section (own rates only — no peer data in individual PDFs) |
| Global benchmark export (future) | Aggregated, suppressed report for IRB/research audiences |

---

## 12. Limitations

- Early network (n < 50 total practices) will produce suppressed benchmarks for many segments — expected behavior, not a bug.
- AE rate does not weight by severity (a Grade 1 event counts the same as a Grade 4 in the aggregate rate). Grade 3+ rate is provided separately for severity-adjusted comparison.
- The algorithm counts sessions with at least one AE — multiple AEs in one session count once (per-session rate, not per-event rate).

---

## 13. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| V1.0.0 | 2026-03-25 | LEAD (WO-685) | Initial specification authored |
