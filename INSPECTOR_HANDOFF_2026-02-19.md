# INSPECTOR HANDOFF BRIEF
**For:** New INSPECTOR session
**Date:** 2026-02-19T08:50:10-08:00
**Repo:** https://github.com/trevorc-ai/PPN-Antigravity-1.0
**Local path:** /Users/trevorcalton/Desktop/PPN-Antigravity-1.0

Read this entire document before doing anything else.

---

## 1. What This Product Is

PPN Portal is a clinical data platform for psychedelic-assisted therapy practitioners.

It is a structured survey instrument for clinical encounters. Every form field is either:
- An integer FK (selection from a ref_ table)
- A numeric score (PHQ-9, heart rate, etc.)
- A date or timestamp
- A boolean
- A constrained VARCHAR (event_type IN ('dose_admin', 'vital_check', ...))
- A UUID (session or user reference)

No free text. No patient names. No DOB. No linkable data. Ever.

The system has two table families:
- `ref_` tables: controlled vocabulary (the possible choices)
- `log_` tables: clinical records (integer FK IDs + scores the practitioner selected)

Analytics = JOIN log_ to ref_ + COUNT / GROUP BY. That is the entire analytics layer.

This architecture comes from a foundational discussion documented in `Turning_Point.md` at the root of the repo. Read that file. It is the constitution of this project.

---

## 2. The Digital Roundabout (Identity Layer)

Every patient record uses a pseudonymized ID (example: PT-7K2MX9QR4F).

The ID is generated using HMAC with a site-specific secret. The secret never touches the database. Even PPN Portal cannot decode a patient ID back to a real person. Each site controls their own secret. No join is possible across sites on patient identity.

This is not just security. It is the legal shield. No subpoena can compel what you do not have.

Patient IDs are VARCHAR(20). WO-210 migrated all existing columns to this format. It is live in Supabase.

---

## 3. Current Database State (as of this session)

All of these are live in Supabase with RLS enabled:

| Table | Status |
|-------|--------|
| `log_clinical_records` | Live, patient_id VARCHAR(20) |
| `log_baseline_assessments` | Live |
| `log_integration_sessions` | Live, session_focus_ids INTEGER[], homework_ids INTEGER[] |
| `log_behavioral_changes` | Live |
| `log_vocabulary_requests` | NEW this session (WO-202) |
| `log_corrections` | NEW this session (WO-211) |
| `ref_substances` | Live, seeded |
| `ref_medications` | Live, seeded |
| `ref_session_focus_areas` | Table exists, NOT YET SEEDED with matching form data |
| `ref_homework_assignments` | Table exists, NOT YET SEEDED |
| `ref_behavioral_change_actions` | Table exists, NOT YET SEEDED |

The unseeded ref_ tables are the single biggest known gap. RefPicker saves integer IDs correctly. Those IDs will decode to wrong labels if you JOIN until the reseed migration runs.

GIN indexes on array FK columns are NOT YET CREATED. This is WO pending. Without GIN indexes, any query using `WHERE 3 = ANY(session_focus_ids)` does a full table scan.

---

## 4. What Was Built in This Session (2026-02-19 morning)

| WO | What | Status |
|----|------|--------|
| WO-117 | SymptomDecayCurveChart crash fix | Done |
| WO-202 | log_vocabulary_requests table + governance rules + 3/7/15 site thresholds | Done, live |
| WO-210 | All patient_id columns to VARCHAR(20) | Done, live |
| WO-211 | log_corrections table for additive audit trail | Done, live |
| WO-213 | Service layer: Supabase direct calls isolated to arcOfCareApi.ts | Done |
| WO-214 | RefPicker universal component (3 modes: chip/grouped/searchable) | Done, in src/components/ui/RefPicker.tsx |
| WO-214 | RefPicker integrated into BehavioralChangeTracker + StructuredIntegrationSession | Done |
| WO-115 | PatientSelectModal: initialView prop, phase-aware open behavior | Done |
| WO-115 | WellnessJourney: larger patient ID, Age/Gender/Weight pills, Change button | Done |
| WO-218 | Advisory board recruitment copy suite (5 emails, 7 seat descriptions) | Done, in 05_USER_REVIEW |
| WO-219 | Landing page: sticky nav bar with Sign In button (was hidden/invisible) | Done |
| -- | App.tsx: removed 6 raw dev/test public routes | Done |
| -- | App.tsx: removed duplicate /audit route | Done |

---

## 5. Current Build Queue (03_BUILD)

Three open work orders:

**WO-096:** InteractionChecker still uses hardcoded substance/medication arrays. Should query live `ref_substances` and `ref_medications`. Works visually today. Not connected to live DB.

**WO-103:** Give-to-Get feature gating not implemented. Benchmark data is visible to all users regardless of subscription tier.

**WO-206:** `arcOfCareApi.ts` is still a 679-line monolith. The agreed service isolation architecture (vocabulary.ts, clinicalLog.ts, analytics.ts, identity.ts) has not been implemented yet. It works. It is not clean architecture.

**WO-216:** Core analytics queries not wired to live data. The analytics page shows the intended data model, not live numbers.

**04_QA:** WO-206_Service_Layer_Isolation.md is in 04_QA awaiting INSPECTOR review.

---

## 6. Turning_Point.md: Alignment Summary

This is what every agent agreed to in the foundational architecture session:

**INSPECTOR's audit checklist (fits on a Post-it):**
1. Does every selectable field FK to a ref_ table?
2. Is RLS enabled on every new table?
3. Is there any TEXT column without a CHECK constraint?
4. Is patient_id always VARCHAR(20) synthetic code?
5. Does the form store IDs (not labels)?
6. patient_id generated via HMAC with site-specific secret?
7. Site secret stored outside the database (env variable only)?
8. k-anonymity floor: no aggregate returned for N < 5 distinct patient_ids?

**What Turning_Point.md says about INSPECTOR's job:**
"A system that's architecturally impossible to get wrong is more reliable than one with great testing. You built the former, not the latter. That's rare."

The architecture structurally prevents: UUID vs integer mismatches, free-text PHI, sequential patient IDs that reveal enrollment count, cross-site patient identity joins.

**Known gaps flagged in Turning_Point.md that are now resolved:**
- log_corrections table: DONE (WO-211)
- log_vocabulary_requests table: DONE (WO-202)
- patient_id VARCHAR(20): DONE (WO-210)
- RefPicker 3-mode component: DONE (WO-214)

**Known gaps flagged in Turning_Point.md still open:**
- ref_ table reseed (migration 056): NOT YET
- GIN indexes on array FK columns (migration 057): NOT YET
- k-anonymity floor on analytics queries: NOT yet implemented
- ref_ table versioning (is_active, valid_from, valid_to): NOT yet implemented
- Branded TypeScript FK ID types (FocusAreaId = number & { __brand }): NOT yet implemented

---

## 7. Safar Competitive Context

Safar (joinsafar.com) is the closest competitor. Key distinction:

- Safar captures what practitioners say (voice AI, unstructured notes)
- PPN captures what practitioners mean (structured ref_ FK selections, controlled vocabulary)

Safar uses: voice analysis, adaptive AI protocols, "Salience Intelligence" branding. They have a Clinical Advisory Board and a Business Advisory Board. Their design is "luminous wellness tech" with soft gradients and glowing orbs.

PPN differentiator: PPN data is structured from the start. Safar data requires NLP to extract concepts from voice notes after the fact. Every PPN analytics query is one SQL JOIN. Safar analytics requires an entire NLP pipeline first.

---

## 8. Key Contacts (Do Not Confuse)

| Person | Who They Are | Role |
|--------|-------------|------|
| Dr. Jason Allen | NIH/research pedigree | Advisory board: Research Credibility seat |
| Sarah Honeycutt | Oregon licensed facilitator | Advisory board: Facilitation Practice seat |
| John Turner | Retired VC attorney, festival community | Advisory board: Legal and Regulatory seat |
| Bridger Lee Jensen | Utah state policy | Advisory board: Policy Intelligence seat |
| Business Partner | Named but not listed here | Gets FIRST LOOK at all materials before external advisory board outreach |

Advisory board copy (WO-218) is complete and in 05_USER_REVIEW. Do not send outreach until business partner approves.

---

## 9. Writing Style Rules (Non-Negotiable)

The USER is explicit about this. Apply to all documentation, feature copy, and help text:

1. Short sentences.
2. Plain words.
3. No em dashes.
4. Simple, understandable, and repeatable.

Example of good writing from this session:
"Every time a clinician types a concept that does not exist in the ref_ tables, the app captures it as a vocabulary request instead of throwing it away. The request_count goes up each time another site submits the same concept. At 3 unique sites, it hits the Advisory Board agenda automatically."

This is the standard. Match it everywhere.

---

## 10. App Route Map (Current State)

**Public routes (no login needed):**
- / (root) - redirects to /landing or /dashboard depending on auth
- /landing - main landing page (sticky nav + Sign In button now fixed)
- /login, /signup, /forgot-password, /reset-password
- /partner-demo - Partner Demo Hub (safe for business partner walkthrough)
- /arc-of-care, /arc-of-care-phase2, /arc-of-care-phase3, /arc-of-care-dashboard
- /meq30, /assessment, /patient-form/:formId
- /secure-gate, /about, /checkout, /billing

**Dev/test routes removed from public router this session:**
/vibe-check, /hidden-components, /component-showcase, /molecules, /isometric-molecules, /molecule-test

**Protected routes (require login):**
/dashboard, /analytics, /wellness-journey, /search, /protocols, /interactions, /audit, /settings, /profile/edit, /data-export, /session-export, /clinical-report-pdf, all /deep-dives/*

---

## 11. Environment and Security

- `.env` contains only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Service role key is NOT in the codebase (verified in Turning_Point.md session)
- All new tables have RLS ON

---

## 12. Immediate Next Session Priorities (in order)

1. Business partner share: send `/#/partner-demo` link first, then offer test login
2. Seed ref_session_focus_areas, ref_homework_assignments, ref_behavioral_change_actions (SOOP: migration 056)
3. Add GIN indexes to array FK columns (SOOP: migration 057)
4. Verify arc-of-care demo pages post WO-117 fix with a logged-in browser pass (INSPECTOR)
5. Wire core analytics queries to live data (WO-216: ANALYST + BUILDER)
6. Begin WO-096: InteractionChecker live ref_ table queries (BUILDER)
7. Add k-anonymity floor to analytics queries (ANALYST)

---

## 13. Key Files to Know

```
src/
  pages/
    WellnessJourney.tsx          - Core clinical page, phase nav, patient context bar
    Landing.tsx                  - Landing page (sticky nav added this session)
  components/
    ui/RefPicker.tsx             - Universal ref_ FK picker (3 modes)
    wellness-journey/
      PatientSelectModal.tsx     - Live DB patient lookup, initialView prop
      BehavioralChangeTracker.tsx
      StructuredIntegrationSession.tsx
  services/
    arcOfCareApi.ts              - API service layer (679 lines, monolith, WO-206)

supabase/migrations/
  20260219_vocabulary_requests.sql  - log_vocabulary_requests (this session)
  [various prior migrations]

_WORK_ORDERS/
  03_BUILD/   - Active work (3 tickets)
  04_QA/      - 2 tickets pending INSPECTOR
  05_USER_REVIEW/ - Completed work awaiting USER sign-off

Turning_Point.md   - Foundational architecture document. Start here.
PROJECT_STATUS_2026-02-19.md  - Current state summary
GLOBAL_RULES.md    - Team operational rules
```

---

## 14. TypeScript Status

Zero errors as of last push. Run `npx tsc --noEmit` to confirm before any review.

---

## 15. Git

Last commit: cleanup of dev routes and pre-status report housekeeping
Branch: main
Remote: https://github.com/trevorc-ai/PPN-Antigravity-1.0.git

Everything from this session is pushed.

---

*This brief was prepared by INSPECTOR at end-of-session for continuity. All information is current as of 2026-02-19T08:50:00-08:00.*
