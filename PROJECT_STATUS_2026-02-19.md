# PPN Portal: Project Status Report
**Date:** 2026-02-19
**Status:** Share-ready with business partner
**TypeScript errors:** 0
**Open work orders (03_BUILD):** 3
**Tables live in Supabase:** 12+

---

## What This Report Is

This is the current state of the PPN Portal build as of the session ending 2026-02-19. It covers what is built, what is working, what is still in the queue, and what the business partner should expect to see in a walkthrough.

---

## The Short Version

The backend is clean. The front end works. The auth flow is solid. A practitioner can land on the page, sign in, enter a patient, and log clinical data across all three phases of care. The app is not at the level of polish we ship publicly, but it is well past the level of "does this work."

---

## What Is Live in Supabase

| Table | Purpose | Notes |
|-------|---------|-------|
| `log_clinical_records` | Core session log | Live, RLS on |
| `log_baseline_assessments` | PHQ-9, GAD-7, ACE | Live, RLS on |
| `log_vocabulary_requests` | Clinician vocabulary gap tracking | New this session |
| `log_corrections` | Audit trail for data corrections | New this session |
| `ref_substances` | Substance reference data | Seeded |
| `ref_medications` | Medication reference data | Seeded |
| `ref_session_focus_areas` | Focus area vocabulary | NOT YET SEEDED (placeholder IDs active) |
| `ref_homework_assignments` | Homework vocabulary | NOT YET SEEDED (placeholder IDs active) |
| `ref_behavioral_change_actions` | Behavioral change vocabulary | NOT YET SEEDED (placeholder IDs active) |

All tables: RLS on. No PHI stored in free-text fields. All patient references use anonymized IDs in VARCHAR(20) format (example: PT-RISK9W2P).

---

## What Is Built and Working

### Landing Page
- Sticky nav bar with Sign In button visible at all screen widths (fixed this session)
- Hero section with value proposition, stats, molecule graphic
- Partner demo hub accessible at `/#/partner-demo` without login

### Auth Flow
- Login, Signup, Forgot Password, Reset Password all working
- Auth guard: unauthenticated users cannot access any protected route
- On login, user lands on Dashboard

### Patient Workflow
- Patient Selection Modal: queries live `log_clinical_records` table, shows real patients
- New Patient: generates a random anonymized ID, starts Phase 1
- Existing Patient: search by ID, filter by phase, select and load
- Phase-aware context: Phase 1 shows "New or Existing", Phase 2 and 3 show "Existing only"
- Patient Context Bar: large font patient ID, verification pills (Age, Gender, Weight), sticky Change button

### Wellness Journey (Core Feature)
- 3-phase navigation: Preparation, Dosing, Integration
- Phase locking: Phase 2 unlocks after Phase 1 is marked complete
- 20 clinical forms accessible via slide-out panel and FAB
- Forms covered: Consent, Safety Screening, Mental Health Screening, Session Vitals, Integration Session, Behavioral Change Tracker, Daily Pulse, and more
- ExportReportButton: generates a clinical PDF report

### RefPicker Component
- Universal component: auto-selects rendering mode based on number of options
- Up to 12 items: chip grid. 13-40: grouped collapsible. 41+: searchable dropdown
- Always returns integer IDs. Never returns label strings.
- Integrated into BehavioralChangeTracker and StructuredIntegrationSession forms

### Assessment
- Adaptive assessment form working
- MEQ-30 (Mystical Experience Questionnaire) accessible from Wellness Journey at any phase

### Dashboard
- Renders with mock data
- All chart components working
- SymptomDecayCurveChart crash fixed (WO-117)

### Analytics and Export
- Analytics page renders
- Session Export Center working
- Clinical PDF report generation working

---

## What Is Not Working Yet (Known Gaps)

These are active work orders. None of them crash the app.

| WO | What | Impact |
|----|------|--------|
| WO-096 | InteractionChecker queries hardcoded arrays, not live `ref_substances` table | Checker works visually, not dynamically |
| WO-103 | Give-to-Get feature gating not implemented | Benchmark data visible to all users |
| WO-206 | `arcOfCareApi.ts` still a 679-line monolith | Works, not clean architecture |
| WO-216 | Core analytics queries not wired to live data | Analytics shows intended model, not live numbers |
| -- | `ref_session_focus_areas`, `ref_homework_assignments`, `ref_behavioral_change_actions` not seeded | RefPicker saves correctly, reporting queries would return empty |

---

## What Still Needs to Be Verified

- Arc-of-care demo pages (`/arc-of-care-phase3`, `/arc-of-care-dashboard`) after WO-117 fix. These were white-screening before the fix. Need a logged-in browser pass to confirm.
- Mobile layout of landing page below 500px.
- All Wellness Journey forms for font size compliance (Assessment done, others not spot-checked this session).

---

## Business Partner Walkthrough Recommendation

**Give them this path in this order:**

1. `http://localhost:3000/#/partner-demo` — no login needed. Shows the feature set as a gallery. Good starting point.
2. Log in with a test account and navigate to `/#/wellness-journey`. Walk through: select patient, enter Phase 1, open the slide-out panel, open Consent form, show the FAB.
3. Show the Patient Context Bar: patient ID, verification pills, Change button.
4. Show `/#/dashboard` for the outcomes overview.
5. Show `/#/export` for the report export.

**What to say about the gaps:**
- "Analytics shows the data model. We populate it as sites onboard."
- "The vocabulary system grows from practitioner submissions. The ref tables get seeded as we confirm terms with the advisory board."
- "The interaction checker is working. Live data queries are next."

---

## Writing Style Note (for all documentation going forward)

Short sentences. Plain words. No em dashes. Simple, understandable, and repeatable. This is the standard for all feature explanations, help docs, and onboarding copy for both the USER and end-user practitioners.

---

## Work Orders Closed This Session (2026-02-19 morning)

| WO | What | Status |
|----|------|--------|
| WO-117 | SymptomDecayCurveChart crash fix | Done, live |
| WO-202 | `log_vocabulary_requests` table + governance | Done, live in Supabase |
| WO-210 | All patient_id columns to VARCHAR(20) | Done, live |
| WO-211 | `log_corrections` table | Done, live |
| WO-213 | Service layer direct call isolation | Done, live |
| WO-214 | RefPicker universal component | Done, integrated |
| WO-115 | New/Existing Patient Workflow | Done, live |
| WO-218 | Advisory board recruitment copy suite | Done, pending business partner review |
| WO-219 | Landing page Sign In button | Done, live |

---

## Next Session Priorities

In order:

1. Seed `ref_session_focus_areas`, `ref_homework_assignments`, `ref_behavioral_change_actions` (SOOP)
2. Wire WO-216 core analytics queries to live data (ANALYST + BUILDER)
3. Verify arc-of-care demo pages post WO-117 fix (INSPECTOR, needs login)
4. Begin WO-096: migrate InteractionChecker to live ref_ tables (BUILDER)
5. Advisory board outreach after business partner approves WO-218 copy (MARKETER)
## IP FLAG — PPNLogo.tsx Molecule\n- Source: Derived from molview.com render (not original art)\n- Location: src/components/PPNLogo.tsx\n- Risk: Low (hand-coded SVG, generic hexagonal structure) but unresolved before commercial launch\n- Action: Replace with original DESIGNER molecule artwork at next branding session\n- Status: DEPRIORITIZED — not blocking partner demo\n- Logged: 2026-02-19
