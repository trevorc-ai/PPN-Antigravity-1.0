---
id: WO-421
status: 98_HOLD
owner: INSPECTOR
failure_count: 0
created: 2026-02-25
parent_ticket: WO-420
priority: P3
tags: [database, governance, deprecated-columns, no-urgency]
---

# WO-421: Deprecated Column COMMENT Governance — log_clinical_records

## Why This Is On Hold

These items were reviewed and confirmed write-dead during the WO-420 Phase 2
database integrity session (2026-02-25). No application code writes to any of
these columns. No operational risk exists from deferring.

Hold until a dedicated database governance session is scheduled.

## Columns Requiring DEPRECATED COMMENTs (log_clinical_records)

| Column | Type | Reason for Deprecation |
|---|---|---|
| `session_notes` | TEXT | Free-text practitioner prose — violates Architecture Constitution §2. Write path removed in StructuredIntegrationSession.tsx. |
| `clinical_phenotype` | TEXT | No ref table defined. No active write path. Requires product discussion before any action. |
| `concomitant_meds` | TEXT | ref_medications exists — could be wired. No active write path. Product decision needed. |
| `outcome_measure` | TEXT | ref_assessments exists — could be wired. No active write path. Product decision needed. |

## Deferred Items Requiring Product Discussion Before Migration

- `session_notes`: Remove entirely OR accept as non-PHI clinical annotation?
- `clinical_phenotype`: Build ref table OR accept as research annotation?
- `concomitant_meds`: Wire to ref_medications or accept as structured text?
- `outcome_measure`: Wire to ref_assessments or accept?

## When This Unblocks

When INSPECTOR and USER schedule a dedicated database governance session and
product decisions above are made. No code is blocked by this hold.

## SQL Ready to Execute (when unblocked)

```sql
COMMENT ON COLUMN log_clinical_records.session_notes IS
  'DEPRECATED: Free-text practitioner prose violates Architecture Constitution §2.
   No active write path as of 2026-02-25. Hold ticket WO-421. Do not add new writes.';

COMMENT ON COLUMN log_clinical_records.clinical_phenotype IS
  'HOLD: No ref table defined. No active write path as of 2026-02-25.
   Product decision required before migration. See WO-421.';

COMMENT ON COLUMN log_clinical_records.concomitant_meds IS
  'HOLD: ref_medications exists as FK target. No active write path as of 2026-02-25.
   Wire to ref_medications.medication_id or accept as annotation. See WO-421.';

COMMENT ON COLUMN log_clinical_records.outcome_measure IS
  'HOLD: ref_assessments exists as FK target. No active write path as of 2026-02-25.
   Wire to ref_assessments.assessment_id or accept as annotation. See WO-421.';
```
