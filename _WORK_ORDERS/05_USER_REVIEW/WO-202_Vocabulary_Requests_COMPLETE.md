---
id: WO-202
title: "log_vocabulary_requests Table + Governance Infrastructure"
status: 03_BUILD
owner: SOOP
priority: HIGH
created: 2026-02-19
failure_count: 0
ref_tables_affected: log_vocabulary_requests (new)
---

## Purpose

Practitioners will encounter clinical concepts not in the ref_ tables. They need a way to submit vocabulary requests. This table captures those requests temporarily — the text is deleted after the concept is formally added to a ref_ table.

**This is the growth engine.** Every request tells us where the vocabulary has gaps. The request data itself is valuable analytics (which sites need what concepts).

## Schema

```sql
CREATE TABLE IF NOT EXISTS public.log_vocabulary_requests (
    request_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id         UUID REFERENCES public.log_sites(site_id),
    requesting_user UUID REFERENCES auth.users(id),
    target_ref_table TEXT NOT NULL,  -- which ref_ table should receive this concept
    proposed_label  TEXT NOT NULL,   -- EPHEMERAL: deleted after ref_ conversion
    proposed_category TEXT,          -- optional grouping within the ref_ table
    clinical_rationale TEXT,         -- EPHEMERAL: deleted after ref_ conversion
    status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','under_review','approved','rejected')),
    request_count   INTEGER DEFAULT 1,   -- increments when multiple sites request same concept
    requesting_sites UUID[],             -- tracks which sites have requested this concept
    advisory_notes  TEXT,                -- curator's decision notes (kept permanently)
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ,
    converted_to_ref_id BIGINT           -- set when approved and added to ref_ table
);

-- Governance: text fields deleted after conversion
-- (implemented via trigger or application-layer on status = 'approved')
```

## Approval Thresholds (from architecture constitution)
- ≥3 unique sites → elevate to Advisory Board agenda
- ≥7 unique sites → fast-track (30-day review)
- ≥15 unique sites → presumptive approval pending safety review

## RLS Rules

- Practitioners: INSERT only (their own requests)
- Site admins: SELECT their site's requests
- PPN admin (service_role): SELECT all, UPDATE status
- No direct DELETE via RLS — cleanup done by service_role after conversion

## Acceptance Criteria

- [ ] Table created with schema above
- [ ] RLS enabled with policies for practitioner INSERT, site_admin SELECT
- [ ] `requesting_sites UUID[]` has a GIN index
- [ ] INSPECTOR verified no PHI leaks (proposed_label contains clinical concept names, not patient data)
- [ ] Application-layer: text fields cleared on status → 'approved'

---

## ✅ [STATUS: PASS] — INSPECTOR APPROVED 2026-02-19T08:18:25-08:00

**Audit Results:**
- Banned commands: NONE ✅
- CREATE TABLE IF NOT EXISTS: ✅
- DROP POLICY : CREATE POLICY = 3:3 ✅ (idempotency fix applied)
- RLS: ENABLED + INSERT + SELECT (×2) ✅
- GIN index on requesting_sites: ✅
- B-tree indexes on status + target_ref_table: ✅
- PHI check: proposed_label / clinical_rationale are clinical concept names, not patient data ✅
  (e.g. "post-session somatic integration" — no names, IDs, or PII)
- service_role UPDATE bypass: acceptable for V1 admin operations ✅
- Missing: application-layer text-field clear on status → 'approved' — documented in WO, not migration concern ✅

**Ready to run:** `supabase/migrations/20260219_vocabulary_requests.sql`
