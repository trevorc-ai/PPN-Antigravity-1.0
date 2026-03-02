---
id: WO-520
title: Benchmark Aggregation Strategy — Research Brief for INSPECTOR
owner: INSPECTOR
status: 01_TRIAGE
authored_by: PRODDY
priority: P1
created: 2026-02-28
---

## PRODDY PRD

> **Work Order:** WO-520 — Benchmark Aggregation Strategy — Research Brief for INSPECTOR
> **Authored by:** PRODDY
> **Date:** 2026-02-28
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

The platform holds ~1,500 seeded benchmark records across `ref_benchmark_cohorts`, `ref_benchmark_trials`, and `ref_population_baselines`. As practitioners enter real protocol records into `log_clinical_records`, those live records are aggregated separately via materialized views (`mv_outcomes_summary`, `mv_network_benchmarks`). The practitioner wants to understand, before any build begins: how the seeded benchmark set and the growing live practitioner dataset can be combined into a single comparison average — and whether the existing schema can accommodate that cleanly.

**No build, migration, or code is required from this work order. INSPECTOR delivers a written explanation only.**

---

### 2. Target User + Job-To-Be-Done

The practitioner-owner needs to understand the aggregation strategy for combining seeded benchmark data and live protocol records so that they can make an informed architectural decision before any build work begins on the global comparison feature.

---

### 3. Success Metrics

1. INSPECTOR delivers a written explanation within 1 work session covering all 4 Open Questions below — completeness verified by the practitioner in a single review pass.
2. The explanation is readable without SQL expertise — no raw queries in the response (pseudocode or plain English descriptions only).
3. The practitioner can answer "yes" or "no" to whether the existing schema accommodates combined aggregation, without asking a follow-up question.

---

### 4. Feature Scope

#### ✅ In Scope — INSPECTOR Must Address

**The current state (what INSPECTOR must verify and explain):**

- `ref_benchmark_cohorts` stores **pre-aggregated** summary rows (means, SDs, response rates, effect sizes) from published peer-reviewed trials — NOT individual patient rows.
- `log_clinical_records` stores **individual session rows** from live practitioners — each row is one session.
- `mv_outcomes_summary` and `mv_network_benchmarks` aggregate `log_clinical_records` in real-time, but they **do not reference `ref_benchmark_cohorts`** at all — the two datasets are currently siloed.

**The question INSPECTOR must research and explain in plain language:**

1. **Can the two datasets be combined into a single average?** The `ref_benchmark_cohorts` table holds pre-computed summary stats (mean, SD, n). Live practitioner data in `log_clinical_records` holds raw individual rows. Can a statistically valid weighted average be computed from a mix of pre-aggregated summaries and raw individual rows? What is the correct method (e.g. pooled mean, meta-analytic weighted average)?

2. **Is the current schema compatible?** Does `log_clinical_records` store outcome fields (instruments, scores) that map to the fields in `ref_benchmark_cohorts` (`instrument`, `baseline_mean`, `endpoint_mean`, `response_rate_pct`, `remission_rate_pct`, `effect_size_hedges_g`)? If there are gaps — fields that exist in one table but not the other — INSPECTOR must list them explicitly.

3. **What is the aggregation mechanism?** Given the existing materialized view pattern (`mv_outcomes_summary` refreshes every 5 minutes via `auto_refresh_analytics`), is the right approach: (a) a new view that UNIONs/JOINs `ref_benchmark_cohorts` with `mv_outcomes_summary`, (b) expanding `ref_benchmark_cohorts` to receive live-entered rows, or (c) something else? INSPECTOR describes the options and their tradeoffs — does NOT recommend one.

4. **What happens at scale?** As the live practitioner dataset grows from 0 toward 1,500+ records, does the relative weight of the seeded benchmark set become statistically diluted? At what approximate live-record count does the seeded set start to matter less than the live set? INSPECTOR explains the concept — no calculation required.

#### ❌ Out of Scope

- Writing any SQL, migrations, or code.
- Making a schema recommendation — practitioner makes that call.
- Touching any live database tables or views.
- Addressing any other benchmark feature beyond the aggregation strategy question.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** The practitioner needs this answer before authorizing any build work on the global comparison feature (planned for a future sprint). Without it, BUILDER has no clear brief and could build in a direction that is later reversed.

---

### 6. Open Questions for LEAD

✅ All questions resolved by LEAD (2026-02-28).

1. ~~Live schema query?~~ → **Yes** — INSPECTOR should query the live Supabase schema directly (read-only) to confirm the current columns in `log_clinical_records`, in addition to the migration file audit. Migration files may lag the live state.
2. ~~Scope of benchmark tables in analysis?~~ → **Focus on `ref_benchmark_cohorts` as the primary table.** Mention `ref_benchmark_trials` and `ref_population_baselines` briefly for completeness but do not deeply analyze them — they are not the aggregation concern.

*None — spec is complete.*

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: INSPECTOR`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
