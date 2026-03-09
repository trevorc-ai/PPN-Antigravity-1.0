# WO-552 — Multi-Clinic Patient Architecture Refactor

**Status:** BACKLOG
**Priority:** P1 — Architectural / Data Integrity
**Discovered:** 2026-03-09 during ghost saves audit (constraint cleanup on `log_patient_site_links`)
**Blocks:** True multi-site patient enrollment (same patient at 2+ clinics)

---

## Problem

`log_patient_site_links` was designed as a **junction table** to allow one patient to attend multiple clinics. However, the current schema treats it as a **patient registry** — making true multi-clinic support impossible.

The blocker: `UNIQUE(patient_uuid)` on `log_patient_site_links` cannot be dropped because **9 clinical tables** have FK constraints that reference this index as their patient identity anchor:

- `log_clinical_records.patient_uuid_fkey`
- `log_dose_events.patient_uuid_fkey`
- `log_patient_profiles.patient_uuid_fkey`
- `log_patient_indications.patient_uuid_fkey`
- `log_patient_psychospiritual_history.patient_uuid_fkey`
- `log_phase1_consent.patient_uuid_fkey`
- `log_phase1_safety_screen.patient_uuid_fkey`
- `log_phase1_set_and_setting.patient_uuid_fkey`
- `log_phase3_meq30.patient_uuid_fkey`

As long as `UNIQUE(patient_uuid)` is the FK target, a patient_uuid can only exist in **one row** of `log_patient_site_links` — meaning one site only.

---

## Desired Behavior

A patient (single `patient_uuid`) should be linkable to **multiple sites**. Each site issues its own `patient_link_code` (PT- code). The patient's clinical records are then visible at any site they're enrolled in, subject to RLS.

---

## Required Schema Changes

### 1. Create a standalone `patients` table (new)
```sql
CREATE TABLE public.patients (
    patient_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
This becomes the true patient identity anchor.

### 2. Migrate `log_patient_site_links` to a pure junction table
- Remove `UNIQUE(patient_uuid)` — no longer the PK/anchor
- Add `UNIQUE(patient_uuid, site_id)` — patient can only enroll at a site once
- Add FK: `patient_uuid → patients.patient_uuid`
- Keep `UNIQUE(site_id, patient_link_code)` — PT- code unique per site

### 3. Migrate all 9 clinical table FKs
Each of the 9 tables must have their FK updated:
- Currently: `patient_uuid → log_patient_site_links(patient_uuid)`
- After: `patient_uuid → patients(patient_uuid)`

This is a multi-step migration requiring `ALTER TABLE ... DROP CONSTRAINT ... ADD CONSTRAINT`.

### 4. Update `getOrCreateCanonicalPatientUuid()` in `identity.ts`
- `INSERT INTO patients` first to get/create `patient_uuid`
- Then `INSERT INTO log_patient_site_links (patient_uuid, site_id, patient_link_code)`

### 5. Audit RLS policies
All RLS policies referencing `log_patient_site_links` subqueries need review — the join path may change.

---

## Current Workaround (in place)

- `UNIQUE(patient_uuid)` kept — all FKs intact, one site per patient for now
- `UNIQUE(site_id, patient_link_code)` kept — correct lookup key
- Redundant duplicate composite constraints dropped (separate migration)
- Service layer uses `upsert + onConflict` for resilience

---

## Acceptance Criteria

- [ ] Same `patient_uuid` appears in multiple rows of `log_patient_site_links` (one per site)
- [ ] All 9 clinical tables still resolve `patient_uuid` correctly via FK
- [ ] RLS policies enforce site-scoped access correctly for multi-site patients
- [ ] `getOrCreateCanonicalPatientUuid()` returns the same UUID for a patient at any site they're enrolled in
- [ ] A patient's records are visible at Site B if they were originally enrolled at Site A (given appropriate authorization)

---

## Estimated Effort

**Large** — schema migration touching 11 tables, FK rewiring, RLS audit, service layer update. Requires full SOOP / INSPECTOR cycle and staging verification before production.
