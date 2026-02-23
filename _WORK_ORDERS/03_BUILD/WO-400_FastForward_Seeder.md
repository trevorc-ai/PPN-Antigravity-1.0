---
status: 03_BUILD
owner: SOOP
failure_count: 0
---

# WO-400: Phase 3 Fast-Forward Seeder & QA Loop

## USER INTENT
The user wants to establish a rigorous, end-to-end testing pipeline for the Wellness Journey. Since it is time-consuming to manually enter Phase 1 and Phase 2 data just to test Phase 3 analytics and Discharge Summaries, we need a "Fast-Forward" QA Seeder. This seeder will instantly inject perfect Phase 1 and Phase 2 data into Supabase, allowing us to drop straight into Phase 3 for UI/UX and data persistence validation.

The user explicitly requested that INSPECTOR be heavily involved in this QA loop ("Measure twice, cut once").

## LEAD ARCHITECTURE
We will build a development-only seeding architecture.
1. **[SOOP] Database Seeder**: Create a new `.sql` script in `supabase/tests/` (or `supabase/migrations/` if we prefer) that inserts a mock user, a mock patient profile, and fully populated `log_clinical_records` and `log_session_vitals`/assessments. This will simulate a "Clinical Protocol" session that has just finished dosing.
2. **[BUILDER] UI Fast-Forward Button**: Inside the `WellnessJourney.tsx` or a "Dev Tools" overlay, add a "Load Test Patient (Phase 3 Ready)" button. When clicked in dev mode, it forces `patientId`, `sessionId`, and `activePhase` to jump straight to Phase 3 using the seeded data.
3. **[INSPECTOR] Verification**: After SOOP and BUILDER complete their work, INSPECTOR must verify that the SQL executes idempotently, the UI doesn't crash, the React Error Boundaries are in place, and that the Phase 3 analytics render the seeded data accurately without throwing type errors.

## SOOP IMPLEMENTATION NOTES
- Create `supabase/tests/seed_phase3_qa_patient.sql`.
- Insert into `user_profiles`, `log_clinical_records` (with `protocol_archetype = 'clinical'` and `enabled_features` array), and populate baseline PHQ-9/GAD-7 so the charts render.
- Pass ticket back to BUILDER when the script is written.

## BUILDER IMPLEMENTATION NOTES
- Ensure `WellnessJourney.tsx` has a way to ingest this test data or at least easily test Phase 3.
- Ensure Phase 3 components have adequate fallback/error handling if data is missing during testing.
- Pass ticket to INSPECTOR for aggressive QA.

## INSPECTOR AUDIT NOTES
- Verify SQL logic for schema alignment.
- Verify UI logic for missing data boundaries.
- Confirm end-to-end flow.
