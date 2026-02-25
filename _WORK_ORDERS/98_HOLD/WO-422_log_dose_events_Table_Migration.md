---
id: WO-422
status: 98_HOLD
owner: INSPECTOR
failure_count: 0
created: 2026-02-25
parent_ticket: WO-413
depends_on: [WO-413]
priority: P3
tags: [database, migration, log_dose_events, no-urgency]
---

# WO-422: Create log_dose_events Table — Prerequisite for CumulativeDoseCalculator

## Why This Is On Hold

The `log_dose_events` table does not exist in the database. No production workflow
depends on it today. The `DosageCalculator.tsx` insert was commented out (WO-420 Item 6,
2026-02-25). The `CumulativeDoseCalculator` component (WO-413 PRD A) has not been
built yet. No code is blocked.

Hold until WO-413 PRD A is activated and BUILDER is ready to wire the component.

## Proposed Schema

| Column | Type | Notes |
|---|---|---|
| `dose_event_id` | `BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY` | |
| `session_id` | `UUID NOT NULL REFERENCES log_clinical_records(id)` | Links to session |
| `patient_id` | `UUID NOT NULL` | Required — no null patient context |
| `substance_id` | `BIGINT REFERENCES ref_substances(substance_id) ON DELETE SET NULL` | FK — not text |
| `dose_mg` | `NUMERIC(10,3) NOT NULL` | Actual dose administered |
| `weight_kg` | `NUMERIC(5,2)` | Patient weight at time of dose |
| `event_type` | `TEXT CHECK (event_type IN ('initial','booster','rescue')) NOT NULL` | Controlled vocab |
| `logged_at` | `TIMESTAMPTZ DEFAULT NOW() NOT NULL` | Auto-timestamp |
| `created_by` | `UUID REFERENCES auth.users(id) ON DELETE SET NULL` | Practitioner UUID |

## Pre-Flight Required Before Migration

```sql
-- Confirm session_id FK target column name in log_clinical_records
SELECT column_name FROM information_schema.columns
WHERE table_name = 'log_clinical_records'
ORDER BY ordinal_position LIMIT 5;

-- Confirm substance_id PK name in ref_substances
SELECT column_name FROM information_schema.columns
WHERE table_name = 'ref_substances'
ORDER BY ordinal_position LIMIT 3;
```

## When This Unblocks

When WO-413 PRD A (CumulativeDoseCalculator) is activated and BUILDER is
ready to implement. INSPECTOR authors migration, USER executes, then BUILDER
is unblocked to wire the component.
