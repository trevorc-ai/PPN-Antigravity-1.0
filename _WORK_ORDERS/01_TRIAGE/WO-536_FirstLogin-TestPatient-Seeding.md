---
id: WO-536
title: "First-Login TEST Patient Seeding — Partner Accounts"
owner: INSPECTOR → BUILDER
status: 00_INBOX
authored_by: LEAD
priority: P2
created: 2026-03-01
failure_count: 0
related: WO-535, WO-500
tags: [test-data, first-login, partner, onboarding, patient-seeding]
---

# WO-536: First-Login TEST Patient Seeding — Partner Accounts

## Summary

On a Partner account's **first login only**, automatically seed 10–15 synthetic `TEST-` prefixed patient records into `log_patient_sessions` (or equivalent) so that the "Existing Patient" search view in `PatientSelectModal` is immediately populated with realistic-looking data. This eliminates the empty-state problem during onboarding and lets practitioners explore the Wellness Journey end-to-end without manually creating patients first.

---

## Problem Statement

New Partner accounts see zero records in the "Select Patient" (Existing Patient) search view because no sessions have been logged yet. This blocks practitioners from testing the Existing Patient lookup flow during onboarding and evaluation.

The TEST mode toggle (WO-535) partially addresses this for new patients, but provides no way to experience the existing patient lookup flow.

---

## Acceptance Criteria

### Seeding Trigger
- [ ] Seeding fires **once per site** on first login — gated by a flag in `log_user_sites` (add column `has_seeded_test_patients boolean DEFAULT false`) or a dedicated `log_onboarding_flags` table
- [ ] After seeding, flag is set to `true` — seeding never runs again for that site
- [ ] Seeding is performed via a **server-side Supabase Edge Function** or a background insert in the auth callback — NOT inline in the React component

### Patient Records
- [ ] 10–15 records inserted with patient IDs in the format `TEST-[readable-suffix]` (e.g. `TEST-DEMO-001`, `TEST-DEMO-002`, etc.)
- [ ] Each record has:
  - A valid `patient_id` with `TEST-` prefix
  - A `phase` spanning the three phases (mix of Preparation, Treatment, Integration)
  - A realistic `last_session_at` timestamp (spread across the last 6 months)
  - A realistic `session_count` (1–4 per patient)
  - A `session_type` (e.g. `Clinical Protocol`, `Ceremonial / Wellness`)
  - A `substance` (e.g. `Psilocybin`, `MDMA`, `Ketamine`, `Ibogaine`)
- [ ] Records are **clearly marked** as demo data (e.g. `is_demo: true` column or `TEST-` prefix convention) so they can be filtered out of real analytics
- [ ] Records are inserted into the correct table that `PatientSelectModal`'s Supabase query reads from (SOOP must verify exact table name + query before building)

### UI/UX
- [ ] No toast or UI change is shown during seeding — it happens silently in the background
- [ ] The "Existing Patient" view auto-populates with these records immediately on first visit

### Filtering
- [ ] The Analytics page and Global Benchmark Intelligence views must **exclude** all `TEST-`-prefixed patient IDs from aggregation and charts
- [ ] Add a `WHERE patient_id NOT LIKE 'TEST-%'` guard to all relevant Supabase queries (SOOP to audit which queries need updating)

---

## Out of Scope

- Seeding for non-Partner (standard) accounts
- Ability to delete or hide demo patients from the UI (future ticket)
- Real patient data of any kind

---

## Pre-Build Research Required (INSPECTOR)

1. Confirm the exact Supabase table + columns that `PatientSelectModal`'s `fetchPatients()` reads from
2. Confirm the correct place to gate first-login logic (auth callback, `useEffect` on WellnessJourney mount, or Edge Function)
3. Confirm which Analytics queries need the `TEST-` filter added
4. Propose the exact SQL for the seed insert and the flag check

---

## PRODDY Sign-Off Checklist

- [x] Problem is clear, no solution bias in problem statement
- [x] Acceptance criteria are observable and testable
- [x] Out of Scope is populated
- [x] Pre-build research step required before implementation
- [x] Zero PHI — all data is synthetic and clearly marked
- [x] Additive DB only — seeding inserts rows, never modifies schema in-place
