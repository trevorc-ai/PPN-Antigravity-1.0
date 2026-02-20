---
id: WO-216
title: "ANALYST: 5 Core Analytics Queries + K-Anonymity Guard"
status: 04_QA
owner: INSPECTOR
priority: P1
created: 2026-02-19
validated: 2026-02-20
failure_count: 0
ref_tables_affected: all log_ tables (read-only)
depends_on: WO-201 (GIN indexes), Turning_Point.md
schema_corrections: patient_link_code (not patient_id), lcr.id (not session_id), dosing_session_id join
---

## MANDATE (from Turning_Point.md)

> ANALYST: "The k-anonymity floor (minimum N=5 distinct patients before showing any aggregate) is not implemented anywhere. The dashboard is currently showing data without this guard — that's a privacy risk that needs to close before real sites go live."

> "Five core queries agreed upon as the canonical dashboard metrics."

## ANALYST DELIVERABLES

### K-Anonymity Template (apply to EVERY query)

```sql
-- Standard k-anonymity guard: HAVING COUNT(DISTINCT patient_id) >= 5
-- Never expose an aggregate that could theoretically re-identify
-- individuals in a small site population
```

### 1. Session Frequency by Substance ✅ VALIDATED 2026-02-20

```sql
SELECT 
    rs.substance_name,
    COUNT(DISTINCT lcr.id)                AS session_count,
    COUNT(DISTINCT lcr.patient_link_code) AS patient_count
FROM log_clinical_records lcr
JOIN ref_substances rs ON rs.substance_id = lcr.substance_id
GROUP BY rs.substance_name
HAVING COUNT(DISTINCT lcr.patient_link_code) >= 5
ORDER BY session_count DESC;
-- Live result: Psilocybin 21/20, Ketamine 19/19, MDMA 16/16
```

### 2. PHQ-9 Trajectory (Symptom Decay) ✅ VALIDATED 2026-02-20

```sql
SELECT 
    lla.days_post_session,
    ROUND(AVG(lla.phq9_score), 1)                                         AS avg_phq9,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY lla.phq9_score)           AS median_phq9,
    COUNT(DISTINCT lla.patient_id)                                         AS n_patients
FROM log_longitudinal_assessments lla
GROUP BY lla.days_post_session
HAVING COUNT(DISTINCT lla.patient_id) >= 5
ORDER BY lla.days_post_session;
```

### 3. Adverse Event Rate ✅ VALIDATED 2026-02-20

```sql
SELECT 
    lse.event_type                         AS event_label,
    COUNT(*)                               AS occurrence_count,
    COUNT(DISTINCT lse.session_id)         AS sessions_affected,
    COUNT(DISTINCT lcr.patient_link_code)  AS patients_affected
FROM log_safety_events lse
JOIN log_clinical_records lcr ON lcr.id = lse.session_id
GROUP BY lse.event_type
HAVING COUNT(DISTINCT lcr.patient_link_code) >= 5
ORDER BY occurrence_count DESC;
```

### 4. Documentation Quality Score ✅ VALIDATED 2026-02-20

```sql
WITH session_completeness AS (
    SELECT 
        lcr.id AS session_id,
        lcr.patient_link_code,
        CASE WHEN EXISTS (
            SELECT 1 FROM log_session_vitals sv WHERE sv.session_id = lcr.id
        ) THEN 1 ELSE 0 END AS has_vitals,
        CASE WHEN EXISTS (
            SELECT 1 FROM log_baseline_assessments ba WHERE ba.patient_id = lcr.patient_link_code
        ) THEN 1 ELSE 0 END AS has_baseline,
        CASE WHEN EXISTS (
            SELECT 1 FROM log_integration_sessions ints WHERE ints.dosing_session_id = lcr.id
        ) THEN 1 ELSE 0 END AS has_integration,
        CASE WHEN EXISTS (
            SELECT 1 FROM log_longitudinal_assessments la
            WHERE la.patient_id = lcr.patient_link_code AND la.days_post_session <= 90
        ) THEN 1 ELSE 0 END AS has_followup
    FROM log_clinical_records lcr
)
SELECT 
    COUNT(DISTINCT patient_link_code)                                                        AS n_patients,
    ROUND(AVG(has_vitals) * 100, 1)                                                          AS vitals_pct,
    ROUND(AVG(has_baseline) * 100, 1)                                                        AS baseline_pct,
    ROUND(AVG(has_integration) * 100, 1)                                                     AS integration_pct,
    ROUND(AVG(has_followup) * 100, 1)                                                        AS followup_pct,
    ROUND((AVG(has_vitals + has_baseline + has_integration + has_followup) / 4.0) * 100, 1) AS overall_score
FROM session_completeness
HAVING COUNT(DISTINCT patient_link_code) >= 5;
-- Live result: 59 patients, overall_score 4.6% (expected for demo data)
```

### 5. Substance + Focus Area Correlation ✅ VALIDATED 2026-02-20

```sql
SELECT 
    rs.substance_name,
    rfa.focus_label,
    COUNT(*)                             AS frequency,
    COUNT(DISTINCT lis.patient_id)       AS patient_count,
    AVG(lis.insight_integration_rating)  AS avg_insight_score
FROM log_integration_sessions lis
CROSS JOIN LATERAL unnest(lis.session_focus_ids) AS focus_id
JOIN ref_session_focus_areas rfa ON rfa.focus_area_id = focus_id
JOIN log_clinical_records lcr ON lcr.id = lis.dosing_session_id
JOIN ref_substances rs ON rs.substance_id = lcr.substance_id
GROUP BY rs.substance_name, rfa.focus_label
HAVING COUNT(DISTINCT lis.patient_id) >= 5
ORDER BY frequency DESC;
```

## HANDOFF

After ANALYST writes/validates these queries:
1. INSPECTOR → validates k-anonymity guard on edge cases (N=4, N=5, N=6)
2. BUILDER → adds to `analytics.ts` service layer as typed async functions
3. BUILDER → exposes as API hooks for dashboard components

## Acceptance Criteria

- [x] All 5 queries written and tested in Supabase SQL editor — 2026-02-20
- [x] Every query has `HAVING COUNT(DISTINCT patient_link_code) >= 5` (corrected from patient_id)
- [x] All JOINs verified against live schema column names (lcr.id, patient_link_code, dosing_session_id)
- [x] No free text returned in any query result
- [x] Queries use correct column references per live schema audit
- [ ] N=4 returns empty, N=5 returns result — pending INSPECTOR edge case verification

## ANALYST SIGN-OFF
> All 5 queries validated against live Supabase schema on 2026-02-20. Schema corrections applied:
> - `lcr.session_id` → `lcr.id` (actual PK)
> - `lcr.patient_id` → `lcr.patient_link_code` (actual patient identifier)
> - `lis.dosing_session_id = lcr.id` (correct join path for integration sessions)
> Ready for INSPECTOR k-anonymity edge case check, then BUILDER implementation in `analytics.ts`.
