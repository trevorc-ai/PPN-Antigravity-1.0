---
id: WO-200
title: "Ref_ Tables Reseed — Sync Seeds to Form Component Constants"
status: 03_BUILD
owner: SOOP
priority: CRITICAL
created: 2026-02-19
failure_count: 0
ref_tables_affected: ref_session_focus_areas, ref_homework_types, ref_therapist_observations, ref_behavioral_change_types
---

## Problem

The ref_ table seeds currently in the database do NOT match the hardcoded arrays in the form components. This means:

- A practitioner selects "Trauma Processing" (form constant index 1)
- `log_integration_sessions.session_focus_ids = [1]` is stored
- JOIN back to `ref_session_focus_areas` returns a different label (or nothing)
- **Every analytics query produces wrong or missing results**

This is a data integrity problem. Until this migration runs, no form save produces correctly decodable FK data.

## Scope

Four ref_ tables must be reseeded to exactly mirror their form component constants:

### 1. `ref_session_focus_areas`
Source: `StructuredIntegrationSessionForm.tsx` SESSION_FOCUS_AREAS constant

### 2. `ref_homework_types`
Source: `StructuredIntegrationSessionForm.tsx` HOMEWORK_TYPES constant

### 3. `ref_therapist_observations`
Source: `StructuredIntegrationSessionForm.tsx` THERAPIST_OBSERVATIONS constant

### 4. `ref_behavioral_change_types`
Source: `BehavioralChangeTrackerForm.tsx` CHANGE_TYPES constant

## SOOP Instructions

1. Read each form component to extract the exact label arrays and their implied IDs (array index + 1 = FK ID)
2. Write `migrations/059_reseed_ref_tables.sql` using `TRUNCATE ... CASCADE` then `INSERT` with explicit IDs
3. Verify: after migration, every form save produces a FK ID that JOINs back to the correct label
4. Run INSPECTOR checklist before handoff

## Acceptance Criteria

- [ ] All 4 ref_ tables have rows that exactly match their form component constants
- [ ] `SELECT * FROM ref_session_focus_areas ORDER BY focus_area_id` matches the form array order
- [ ] A test INSERT + JOIN round-trip returns the correct label
- [ ] RLS SELECT policy exists on all 4 tables for `authenticated` role
- [ ] Migration is idempotent (safe to run twice)

## Why This Is CRITICAL

Without this, analytics are structurally broken. Every session logged today stores IDs that decode incorrectly. The longer this runs, the more corrupt data accumulates. No BUILDER work should be tested for correctness until this deploys.
