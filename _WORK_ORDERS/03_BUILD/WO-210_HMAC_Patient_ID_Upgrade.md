---
id: WO-210
title: "SOOP: HMAC Patient ID Upgrade — VARCHAR(20) Cryptographic Patient IDs"
status: 03_BUILD
owner: SOOP
priority: P0
created: 2026-02-19
failure_count: 0
ref_tables_affected: none
depends_on: Turning_Point.md directive
---

## MANDATE (from Turning_Point.md)

> "patient_id VARCHAR(10) → VARCHAR(20) — cryptographically random suffix. Not guessable. Not sequential."  
> Sequential IDs reveal enrollment count and order. Random alphanumerics reveal nothing.

## SCOPE

Extend `patient_id` VARCHAR column from 10 to 20 characters across all clinical log tables.  
Document the cryptographic generation pattern for BUILDER to implement.

## SOOP DELIVERABLE

Write `supabase/migrations/20260219_hmac_patient_id.sql` with the following:

1. `ALTER TABLE ... ALTER COLUMN patient_id TYPE VARCHAR(20)` on all 6 log_ tables that store it (see list below)  
2. Add a comment documenting the intended ID format and generation function  

### Tables to Extend

```sql
ALTER TABLE public.log_baseline_assessments ALTER COLUMN patient_id TYPE VARCHAR(20);
ALTER TABLE public.log_clinical_records     ALTER COLUMN patient_id TYPE VARCHAR(20);
ALTER TABLE public.log_pulse_checks         ALTER COLUMN patient_id TYPE VARCHAR(20);
ALTER TABLE public.log_integration_sessions ALTER COLUMN patient_id TYPE VARCHAR(20);
ALTER TABLE public.log_behavioral_changes   ALTER COLUMN patient_id TYPE VARCHAR(20);
ALTER TABLE public.log_longitudinal_assessments ALTER COLUMN patient_id TYPE VARCHAR(20);
```

### ID Format (document in migration comment)

```
Format:  PT-{site_code_3chars}{random_9chars}
Example: PT-PDX7K2MX9QR
         └── 3-char site prefix (SET per site: PDX = Portland)
                └── 9 chars from: randomBytes(8).toString('base64url').slice(0,9).toUpperCase()

Total length: 15 chars — well within VARCHAR(20)
Collision space: ~1 trillion per site prefix
Cannot be reversed to real identity — no PII in the hash input
```

## BUILDER FOLLOW-ON (WO-213 addendum)

After SOOP migration runs, BUILDER updates `src/services/identity.ts` to export a `generatePatientId(siteCode: string): string` function using the documented format.

## Acceptance Criteria

- [ ] Migration runs idempotently (use `IF NOT EXISTS` / safe ALTER)
- [ ] All 6 tables now accept VARCHAR(20) patient_ids
- [ ] Existing VARCHAR(10) data still reads correctly (extending, not shrinking)
- [ ] Migration comment documents the generation pattern
- [ ] RLS policies unaffected (column name unchanged)
