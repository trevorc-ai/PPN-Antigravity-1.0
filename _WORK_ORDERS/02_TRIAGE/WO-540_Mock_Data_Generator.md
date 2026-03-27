==== PRODDY ====
---
owner: LEAD
status: 02_TRIAGE
authored_by: PRODDY
---

## PRODDY PRD

> **Work Order:** WO-540 — Mock Data Generator for Beta Cohort
> **Authored by:** PRODDY  
> **Date:** 2026-03-04  
> **Status:** Draft → Pending LEAD review  

### 1. Problem Statement
The PPN platform's value proposition depends heavily on visualizing patient cohorts and session outcomes. If a partner beta tester logs in and sees an empty, pristine database, they cannot experience the "clinical intelligence" or test the core visualizations without spending hours manually entering data. This creates a massive barrier to entry and delays time-to-value during rapid beta testing.

### 2. Target User + Job-To-Be-Done
A brand new partner beta tester needs to log in and immediately see 2-3 realistic, populated patient records and associated dosing sessions so that they can test the dashboard and visualization tools instantly.

### 3. Success Metrics
1. Execution of the script successfully provisions exactly 2 patients and 3-5 combined dosing/integration sessions for a specified `site_id` in < 5 seconds.
2. The generated mock data strictly adheres to the Zero-PHI policy (no realistic names, only system-generated IDs/synthetic demographic descriptors).
3. The script handles missing dependencies gracefully (stops and warns if the specified `site_id` does not exist).

### 4. Feature Scope

#### ✅ In Scope
- A standalone SQL script or Node/TS utility script (run by LEAD/USER) that injects mock patient rows into `log_patients`.
- Associated insertion of mock sessions (Phase 1, 2, and 3) into `log_sessions`, `log_dosing_events`, and `log_integration_progress`.
- Ensuring all mock entities are correctly mapped via foreign keys and inherit the target `site_id` for RLS compliance.
- **UPDATED 2026-03-26:** Seed records MUST be complete to activate the intelligence layer:
  - `protocol_id` must be populated on all seed sessions
  - At least one `log_safety_events` row per seed session
  - Follow-up assessments at day 7 and day 30 in `log_longitudinal_assessments`
  - Without these fields, the seed data will not activate `mv_clinician_work_queue`, trajectory badges, or the follow-up compliance layer
- **Deletion mechanism:** A `site_id`-scoped delete script (`WHERE site_id = $seed_site_id`) that cleanly removes all seed data without touching real records. This script is MANDATORY — the tool is incomplete without it.

#### ❌ Out of Scope
- A user-facing UI button for practitioners to "generate fake data" themselves. This is an admin/developer tool only.
- Complex data randomization logic. Hardcoded, realistic archetype rows (e.g., "Patient Archetype A: Fast Responder", "Patient Archetype B: Requires Rescue Protocol") are sufficient.

### 5. Priority Tier
**[X] P1** — High value, ship this sprint
**Reason:** While technically the platform *works* without this (users can just add their own patients), the reality of beta testing software requires instantly demonstrating value. This significantly reduces onboarding friction for our VIP partners.

### 6. Open Questions for LEAD
1. Should this be a `.sql` file that the USER executes directly in the Supabase shell, or a Typescript script running via the `@supabase/supabase-js` client?
2. If we use hardcoded archetypes, where should those definitions be stored (JSON file, or within the script itself)?
3. How do we cleanly delete this mock data later once the partner starts using the system for real cases, without wiping their actual data?

### PRODDY Sign-Off Checklist
- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
==== PRODDY ====

---
- **Data from:** Script-generated synthetic values; no PHI, no live tables read
- **Data to:** `log_patients`, `log_sessions`, `log_dosing_events`, `log_integration_progress`, `log_safety_events`, `log_longitudinal_assessments`
- **Theme:** No UI — admin/developer CLI or Supabase SQL shell script
