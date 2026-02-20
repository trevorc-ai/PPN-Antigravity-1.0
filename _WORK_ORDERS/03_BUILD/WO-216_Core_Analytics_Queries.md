---
id: WO-216
title: "ANALYST: 5 Core Analytics Queries + K-Anonymity Guard"
status: 03_BUILD
owner: ANALYST
priority: P1
created: 2026-02-19
failure_count: 0
ref_tables_affected: all log_ tables (read-only)
depends_on: WO-201 (GIN indexes), Turning_Point.md
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

### 1. Session Frequency by Substance

```sql
SELECT 
    rs.substance_name,
    COUNT(DISTINCT lcr.session_id) AS session_count,
    COUNT(DISTINCT lcr.patient_id) AS patient_count
FROM log_clinical_records lcr
JOIN ref_substances rs ON rs.substance_id = lcr.substance_id
WHERE lcr.site_id = $1
GROUP BY rs.substance_name
HAVING COUNT(DISTINCT lcr.patient_id) >= 5  -- k-anonymity floor
ORDER BY session_count DESC;
```

### 2. PHQ-9 Trajectory (Symptom Decay)

```sql
SELECT 
    lla.days_post_session,
    AVG(lla.phq9_score)           AS avg_phq9,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY lla.phq9_score) AS median_phq9,
    COUNT(DISTINCT lla.patient_id) AS n_patients
FROM log_longitudinal_assessments lla
WHERE lla.patient_id IN (
    SELECT DISTINCT patient_id FROM log_clinical_records WHERE site_id = $1
)
GROUP BY lla.days_post_session
HAVING COUNT(DISTINCT lla.patient_id) >= 5  -- k-anonymity floor
ORDER BY lla.days_post_session;
```

### 3. Adverse Event Rate

```sql
SELECT 
    rse.event_label,
    COUNT(*)                       AS occurrence_count,
    COUNT(DISTINCT lse.session_id) AS sessions_affected,
    COUNT(DISTINCT lcr.patient_id) AS patients_affected
FROM log_safety_events lse
JOIN log_clinical_records lcr ON lcr.session_id = lse.session_id
LEFT JOIN ref_safety_event_types rse ON rse.event_type_id = lse.meddra_code_id
WHERE lcr.site_id = $1
GROUP BY rse.event_label
HAVING COUNT(DISTINCT lcr.patient_id) >= 5  -- k-anonymity floor
ORDER BY occurrence_count DESC;
```

### 4. Documentation Quality Score

```sql
-- Completeness: % of sessions with all 4 documentation types
WITH session_completeness AS (
    SELECT 
        lcr.session_id,
        lcr.patient_id,
        CASE WHEN EXISTS (SELECT 1 FROM log_session_vitals sv WHERE sv.session_id = lcr.session_id)
             THEN 1 ELSE 0 END AS has_vitals,
        CASE WHEN EXISTS (SELECT 1 FROM log_baseline_assessments ba WHERE ba.patient_id = lcr.patient_id)
             THEN 1 ELSE 0 END AS has_baseline,
        CASE WHEN EXISTS (SELECT 1 FROM log_integration_sessions ints WHERE ints.patient_id = lcr.patient_id AND ints.dosing_session_id = lcr.session_id::uuid)
             THEN 1 ELSE 0 END AS has_integration,
        CASE WHEN EXISTS (SELECT 1 FROM log_longitudinal_assessments la WHERE la.patient_id = lcr.patient_id AND la.days_post_session <= 90)
             THEN 1 ELSE 0 END AS has_followup
    FROM log_clinical_records lcr
    WHERE lcr.site_id = $1
)
SELECT 
    COUNT(DISTINCT patient_id)                                   AS n_patients,
    ROUND(AVG(has_vitals) * 100, 1)                             AS vitals_pct,
    ROUND(AVG(has_baseline) * 100, 1)                           AS baseline_pct,
    ROUND(AVG(has_integration) * 100, 1)                        AS integration_pct,
    ROUND(AVG(has_followup) * 100, 1)                           AS followup_pct,
    ROUND((AVG(has_vitals + has_baseline + has_integration + has_followup) / 4.0) * 100, 1) AS overall_score
FROM session_completeness
HAVING COUNT(DISTINCT patient_id) >= 5;  -- k-anonymity floor
```

### 5. Substance Breakdown — Focus Area Correlation

```sql
SELECT 
    rs.substance_name,
    rfa.focus_label,
    COUNT(*)                        AS frequency,
    COUNT(DISTINCT lis.patient_id)  AS patient_count,
    AVG(lis.insight_integration_rating) AS avg_insight_score
FROM log_integration_sessions lis
CROSS JOIN unnest(lis.session_focus_ids) AS focus_id
JOIN ref_session_focus_areas rfa ON rfa.focus_area_id = focus_id
JOIN log_clinical_records lcr ON lcr.patient_id = lis.patient_id
JOIN ref_substances rs ON rs.substance_id = lcr.substance_id
WHERE lcr.site_id = $1
GROUP BY rs.substance_name, rfa.focus_label
HAVING COUNT(DISTINCT lis.patient_id) >= 5  -- k-anonymity floor
ORDER BY frequency DESC;
```

## HANDOFF

After ANALYST writes/validates these queries:
1. INSPECTOR → validates k-anonymity guard on edge cases (N=4, N=5, N=6)
2. BUILDER → adds to `analytics.ts` service layer as typed async functions
3. BUILDER → exposes as API hooks for dashboard components

## Acceptance Criteria

- [ ] All 5 queries written and tested in Supabase SQL editor
- [ ] Every query has `HAVING COUNT(DISTINCT patient_id) >= 5`
- [ ] All JOINs verified against live schema column names
- [ ] No free text returned in any query result
- [ ] Queries use GIN indexes correctly (array columns use `= ANY()` not `@>` for single values)
- [ ] N=4 returns empty result, N=5 returns result (edge case verified)
