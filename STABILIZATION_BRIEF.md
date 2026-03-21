# PPN Portal — Stabilization Brief
**Version:** 1.2 — 2026-03-21 (updated after full ChatGPT decision memo review)  
**Status:** Active — All agents must read this before touching any file  
**Author:** INSPECTOR (Antigravity) on behalf of Trevor Calton  
**Purpose:** This document is the single source of truth for what we are doing, why, in what order, and under what constraints. It is written to be shared with any LLM (ChatGPT, Gemini, Claude/Antigravity) to provide consistent context across all sessions.

---

## SECTION 1 — What PPN Portal Is

PPN Portal (Psychedelic Practitioners Network) is a **clinical documentation and network intelligence platform** built specifically for psychedelic therapy (PAT) practitioners. Its core purpose is:

1. Give every practitioner a fast, structured, clinically validated way to document every treatment protocol
2. Use a secure, schema-stable, Zero-PHI repository where every entry is a permanent, immutable clinical record
3. Generate real-time visual analytics that enable practitioners to benchmark their outcomes against a growing global peer network

**The North Star test for every proposed change:**  
> "Does this make documentation and decision-making easier, safer, or more insightful for the practitioner? Does it maintain consistency by improving or refining the existing process?"  
> If the answer to either question is no, or if you are unsure — **STOP and notify the user.**

---

## SECTION 2 — Current Application State (as of 2026-03-21)

### What is working
- Phase 1 (Preparation): Form flows, baseline assessments, safety screening, consent — functional
- Phase 2 (Dosing): Live session cockpit, session timer, quick-action chips, companion overlay — functional with known bugs (see Section 6)
- Phase 3 (Integration): Integration session forms, pulse checks, longitudinal assessments — forms save correctly
- Patient PDF reports: Clinical Report, Discharge PDF, MEQ-30, Flight Plan — functional
- Drug interaction checker — functional
- Analytics / benchmarking — partially functional (Phase 3 visualizations broken due to data model gap)
- Authentication, RLS, Zero-PHI compliance — intact

### The two environments
| Environment | Where | Git Commit | Supabase DB |
|---|---|---|---|
| Production | www.PPNportal.net (Vercel) | `7d0ae38` (2026-03-17) | **Live production** |
| Local dev | `npm run dev` on Trevor's machine | `7d0ae38` (same) | **Same live production DB** |

> **Critical note:** There is no isolated staging environment. Local dev hits production data. All schema changes affect live data immediately.

### What is NOT working correctly
1. **Treatment cycle boundary undefined** — The app treats the entire patient arc as one flat record. There is no model for Session 1 → Integration 1 → Session 2 → Integration 2. This is the root cause of Phase 3 visualization failures and the timeline bleed bug.
2. **Session Vitals Trend Chart is not DB-backed on reads** — The chart renders from in-memory React state only. A page refresh during a live session blanks the chart. Data is being written to `log_session_vitals` correctly but never re-read on mount.
3. **Timeline bleeding between sessions** — Starting a second dosing session for an existing patient can show timeline entries from the previous session. Root cause: localStorage optimistic state is not fully isolated per session, and the session-loading logic for "existing patient" resumes the most recent `log_clinical_records` row without verifying it is the correct new session.
4. **No cross-page patient context** — There is no persistent "currently selected patient" that follows the practitioner as they navigate between Protocol Detail, Wellness Journey, and Analytics. Each page bootstraps independently.
5. **Navigation silos** — Protocol Detail (`/protocol/:id`) is not reachable from the sidebar directly. There is no navigation path from Wellness Journey → Analytics (filtered to patient) or from Analytics → Protocol Detail for a specific patient.
6. **Phase 3 visualizations broken** — Because the app has no treatment cycle sequencing, charts that should show a patient's progression across multiple sessions have no data model to read from.

---

## SECTION 3 — Locked Clinical Phase Definitions

**These definitions are now final. They are derived from Gemini and ChatGPT clinical analysis of PAT literature (MAPS, EMBARK, psilocybin trial protocols, Oregon OAR 333-333). They are not open for debate. All code must conform to them.**

### Phase 1: Preparation
- **What it is:** Psychoeducation, therapeutic alliance building, safety screening, consent, intention setting, set and setting assessment, medication review and taper planning, contraindication review. **Forward-looking** — its primary purpose is readiness for the next dosing session.
- **Begins:** The moment a new treatment cycle is explicitly opened by the practitioner (for the first session: at patient enrollment; for subsequent sessions: when the practitioner formally closes the prior integration period and opens a new cycle).
- **Ends:** When the practitioner records `dose_administered_at` — the moment medicine is administered. Pre-dose conversation and vitals on dosing day are still Preparation.

### Phase 2: Dosing
- **What it is:** Supervised medicine administration. Includes acute medicine period, monitoring, vital sign recording, in-session observations, supplemental dosing if protocol allows, companion support.
- **Begins:** At `dose_administered_at` — when the first dose is physically administered.
- **Ends:** When the practitioner formally ends the acute session and discharges the patient (`session_ended_at`). This requires an **explicit practitioner action** in the UI. It does not end automatically.

### Phase 3: Integration
- **What it is:** Post-dose processing and meaning-making. Includes immediate debrief, structured integration sessions, pulse checks, longitudinal assessments, behavioral change tracking. **Backward-looking** — its primary purpose is processing the most recently completed dosing session.
- **Begins:** Immediately after `session_ended_at` is recorded (dosing discharge).
- **Ends:** At the **earlier** of:
  1. The practitioner explicitly closes post-dose follow-up for that dosing session (clicks a "Close Integration" action, analogous to a phase transition form)
  2. The practitioner explicitly opens Preparation for the **next** dosing session

### The Inviolable Rules

> **Rule 1:** Phase transitions are ALWAYS practitioner-gated. Never time-based. Never form-completion-based. Never inferred from data gaps.

> **Rule 2:** Integration is tied to a **specific prior dosing session** (`dosing_session_id` FK). It never floats.

> **Rule 3:** A new Preparation phase always creates a new **dose cycle** — a new child record in the data model, not a mutation of the previous one.

> **Rule 4:** Assessments (PHQ-9, GAD-7, MEQ-30, etc.) are measurement events anchored to a time point. They do not define or end a phase.

> **Rule 5:** A reporting window (e.g., the current 45-day follow-up view) is an analytics convenience. It is not the clinical definition of a phase boundary.

---

## SECTION 4 — The Data Model (What Exists vs. What Is Needed)

### What exists in the DB today (confirmed from schema docs and code inspection)

| Table | Purpose | Status |
|---|---|---|
| `log_clinical_records` | One row per dosing session. Has `dose_administered_at`, `session_ended_at`, `is_submitted`, `patient_uuid`, `patient_link_code_hash` | ✅ Correct per-session |
| `log_session_timeline_events` | Timestamped clinical events during a session, keyed by `session_id` | ✅ DB-backed, polling correctly |
| `log_session_vitals` | HR, BP readings during dosing, keyed by `session_id` | ✅ Written correctly; ❌ never re-read on chart mount |
| `log_integration_sessions` | Integration session records with `dosing_session_id` FK back to the dosing session | ✅ Correctly modeled |
| `log_patient_site_links` | Links `patient_link_code` → canonical `patient_uuid` | ✅ Working |
| `log_patient_profiles` | Demographics, keyed by `patient_uuid` | ✅ Working |
| `log_baseline_assessments` | PHQ-9, GAD-7, ACE scores, keyed by `patient_uuid` | ✅ Working |
| `log_longitudinal_assessments` | Follow-up outcome measurements | ✅ Written; ❌ visualization broken |
| `log_patient_flow_events` | Phase transition events (ref_stage_id ordering) | ✅ Exists; partially wired |
| `ref_flow_event_types` | Event type codes for timeline events | ✅ Working |

### What is MISSING from the data model

| Gap | Description | Impact |
|---|---|---|
| **Treatment cycle / dose cycle record** | There is no explicit parent record grouping multiple dosing sessions into one treatment course. `log_clinical_records` rows are currently treated as standalone, not as a sequence. | Root cause of all multi-session bugs |
| **Cycle ordering field** | `log_clinical_records` has no `cycle_number` integer or `previous_session_id` FK. Analytics cannot definitively determine that Session B followed Session A for the same patient. | Multi-session charts unreliable |
| **Phase transition events with explicit semantics** | `log_patient_flow_events` exists but is not the authoritative practitioner-gated phase gate, and may lack a session-level FK — meaning events cannot be unambiguously tied to a specific dose cycle. Must verify before building reporting. | Phase charts bleed across sessions |
| **"Open Preparation for next cycle" action** | No UI action or DB record that formally closes one integration period and opens the next preparation phase | Cannot do multi-session arcs |
| **"Close Integration" attestation** | No record of when and by whom the integration period was formally concluded, nor which `dosing_session_id` that closure is tied to | Cannot report on integration completeness |
| **Three separate status fields** | `log_clinical_records.session_status` currently does four jobs: clinical phase state, treatment-course status, analytics state, and submission state. These must be separated (see below). | Dashboards answer wrong questions |

### The Three-Status Problem (ChatGPT — Critical)

`session_status` currently conflates concepts that must be separated. The following three statuses are distinct and must not be stored in a single field:

| Status Type | What It Tracks | Example Values |
|---|---|---|
| **Clinical Phase Status** | Current local state for the active dose cycle | `preparation`, `dosing`, `integration` |
| **Treatment Course Status** | Whether the patient is active in a care plan | `active`, `paused`, `hold`, `completed`, `discontinued` |
| **Assessment Schedule Status** | Whether a specific follow-up measurement is due | `not_yet_due`, `due`, `completed`, `overdue`, `waived` |

If these remain conflated, dashboards will silently produce wrong answers (e.g., calling integration incomplete because a survey is late, or calling a patient inactive because no event occurred in a window).

### What does NOT need a new table (Stabilization Posture)

The existing `log_clinical_records` + `log_integration_sessions` + `log_patient_flow_events` structure is sufficient for stabilization, provided:
- `log_patient_flow_events` is used as the authoritative phase transition ledger
- A new `log_clinical_records` row is created for each dosing session (already the intent — the frontend just doesn't consistently do it)
- The frontend maintains `patient_uuid` context across all phase transitions

> **Known Future Gap:** Both Gemini and ChatGPT agree that "no new table" is a valid stabilization posture *only if* next-cycle preparation is always attached to a specific upcoming dosing-session record. If that condition cannot be enforced, an explicit `cycle_id` parent record will be needed in a future track. This does not change the Track B plan but must be honestly acknowledged. If at any point during Track B implementation it becomes clear that `log_clinical_records` cannot cleanly represent the cycle ordering, we STOP and revisit before proceeding.

---

## SECTION 5 — The Navigation Architecture Gap

### Current state (silos)
```
Sidebar → Dashboard
Sidebar → Analytics                  (no patient filter context)
Sidebar → My Protocols               → Protocol Detail (/protocol/:id)
Sidebar → Wellness Journey           (patient selection modal fires on every visit)
```

No page passes patient context to another. When you leave Wellness Journey and go to Analytics, analytics doesn't know which patient you were working with.

### Required state (patient-contextual flow)
```
My Protocols → Protocol Detail → [Open in Wellness Journey] → (patient pre-loaded, correct phase)
                               → [View Analytics]           → (analytics filtered to this patient)
Wellness Journey → [View Protocol] → Protocol Detail
                 → [View Analytics] → Analytics (patient-filtered)
Analytics → [View Journey] → Wellness Journey (patient pre-loaded)
```

### The minimum mechanism required
A **patient URL context parameter** — `?patientUuid=<uuid>` carried across routes. This is a prerequisite to the treatment cycle UI work because:
- "Begin New Session for Patient X" requires the current page to know it's working with Patient X
- "View Analytics for Patient X" from Protocol Detail requires passing the UUID to the analytics route
- Deep-link navigation (already partially built via `?sessionId=`) can be extended to carry `?patientUuid=` as well

**Implementation approach (Gemini recommendation):** Use a hybrid model:
1. `?patientUuid=` in the URL initializes the context on page load (supports deep-linking, bookmarking, page refresh survival)
2. A lightweight `ActivePatientContext` React provider holds the resolved `{ activePatientUuid, activeSessionId }` globally, so child components and navigation elements read from context rather than manually parsing the URL on every render

> **Critical distinction (ChatGPT):** The URL parameter **carries context — it does not define clinical state.** The source of truth for which patient is being viewed, which session is active, which cycle is current, and which phase is open must remain in the database. The URL is navigation metadata only. Never derive clinical state from URL parameters.

This is a **medium-scope change to WellnessJourney, ProtocolDetail, Analytics, and the Sidebar** — but it is surgical if scoped correctly. No new pages. `ActivePatientContext` is a new context file (additive only). URL parameter reads and navigation link updates only.

---

## SECTION 6 — Approved Work Sequence

**No agent may work on items out of this sequence. Each item requires its own approved implementation plan before any code is touched. Items are not started until the preceding item is complete and stable.**

### Track A — Immediate Surgical Fixes (no schema changes, no new features)

| # | Item | Files Affected | Risk |
|---|---|---|---|
| A1 | Write and commit `STABILIZATION_BRIEF.md` (this document) | 1 file (docs only) | Zero |
| A2 | Fix vitals chart DB hydration on mount | `DosingSessionPhase.tsx` only | Low |
| A3 | Fix session timeline/state bleeding on new session for existing patient | `WellnessJourney.tsx`, `DosingSessionPhase.tsx` | Low-Medium |
| A4 | Cosmetic UI regressions (user to specify) | TBD | Low |

### Track B — Core Feature Completion (foundational, must follow Track A)

| # | Item | Files Affected | Risk | Added Requirements |
|---|---|---|---|---|
| B1 | Add `?patientUuid=` URL context + `ActivePatientContext` provider | 3-4 pages + Sidebar + new context file | Medium | URL param initializes context; DB is source of truth |
| B2a | **Status model disambiguation** — resolve the three-status problem before writing any cycle transition code; document exact field names and values | Schema migration (additive columns) + clinicalLog service | Medium | MUST precede B2; SQL via ChatGPT/Supabase dashboard |
| B2 | "Begin New Treatment Cycle" action — creates new `log_clinical_records` row with `cycle_number` or `previous_session_id`; opens Phase 1 for new cycle | WellnessJourney, clinicalLog service | Medium | Cycle must have explicit ordering field (Gemini); B2a must be complete first |
| B3 | "Close Integration / Open Next Cycle" practitioner gate — phase transition UI + `log_patient_flow_events` record stamped with `practitioner_id`, timestamp, and `dosing_session_id` FK | IntegrationPhase, WellnessJourney | Medium | All three fields (Gemini) required on every transition event; verify `log_patient_flow_events` has session FK before coding |
| B4 | Sidebar and navigation improvements — patient-contextual links between Protocol Detail → Wellness Journey → Analytics | Sidebar, TopHeader | Medium | Depends on B1 (ActivePatientContext) |
| B5 | Phase 3 visualization wiring — wire charts to read from correct cycle's session | Analytics, PatientReport | Medium | Depends on B2 + B3 being stable |

### Required Design Specification Before B2/B3 Code (ChatGPT — Edge Cases)

Before any Track B implementation plan is written, the following seven edge cases must have explicit, agreed rules. They are **normal longitudinal-care realities**, not fringe scenarios:

| # | Edge Case | Required Rule |
|---|---|---|
| EC-1 | Cycle opened (Preparation started) but patient never dosed | Must have a "Cancel Cycle" action that closes the cycle without creating a dosing record. Status: `abandoned`. |
| EC-2 | Dose administered but integration never formally closed | System flags as "integration open" indefinitely. Never auto-closes. Practitioner must explicitly close or escalate. |
| EC-3 | One encounter covers both integration (prior dose) and preparation (next dose) | Encounter must declare a **primary purpose**. Best practice: log as two separate segments linked to prior and next session respectively. |
| EC-4 | Patient placed on Clinical Hold | New locked status: `hold`. Prevents opening next-cycle Preparation. Requires explicit release by practitioner. Flagged on dashboard. |
| EC-5 | Patient discontinued after one dose | "Close Treatment Course" action. All cycle data preserved. Course status: `discontinued`. Remaining prep/integration steps marked `waived`. |
| EC-6 | Next dose planned then canceled or postponed | The `log_clinical_records` row for that intended next cycle is marked `canceled`. Does NOT delete the row. Analytics must filter out `canceled` cycles from completion rates. |
| EC-7 | Safety event detected during next-cycle prep but causally linked to prior dose | Safety event must store BOTH `detected_during_session_id` (next cycle) AND `attributed_to_session_id` (prior dose). Two separate FKs. |

> **These edge case rules must be agreed upon by the user before any B2/B3 implementation plan is written.** This table will become part of the work order specifications.

### Track C — Deferred (do not begin until Tracks A and B are complete)
- Reporting denominators (per dose cycle, per patient, per protocol)
- Full "Clinical Hold" workflow (EC-4 above covers the basic state; full workflow including notifications deferred)
- Protocol abandonment / early termination full workflow (EC-5 covers basic state)
- Billing code triggers
- Longitudinal symptom tracking by anchor time point (not by phase label)
- Alliance and expectancy as structured data points
- Setting variable metadata capture
- `cycle_id` explicit parent record (if B2 cycle ordering proves insufficient)

---

## SECTION 7 — Constraints for All Agents (Non-Negotiable)

### The Hard Rules

**RULE 1 — PLAN GATE (NO EXCEPTIONS)**  
Before writing, modifying, or deleting ANY file — you MUST write an `implementation_plan.md` listing every file you intend to touch, present it to the user, and receive explicit written approval. "Quick fixes" and "obvious changes" are not exceptions.

**RULE 2 — SCOPE LOCK**  
You may ONLY modify files explicitly listed in the approved plan. If you discover a problem in an unlisted file, you STOP, report it to the user, and wait for a plan amendment. You do NOT fix it in the same pass.

**RULE 3 — TWO-STRIKE RULE**  
If a fix fails twice, STOP. Revert to the last working state via git. Request a new strategy from the user. Do not patch the patch.

**RULE 4 — STOP, DON'T PATCH**  
If a change causes a new problem, STOP immediately. Do NOT apply a second fix. Do NOT patch the patch. Report the new problem and wait for a new plan.

**RULE 5 — ZERO PHI**  
No free-text patient inputs in logging tables. Store selections as foreign key IDs. Use `patient_uuid` only, never raw `patient_link_code` as the insertion key.

**RULE 6 — ADDITIVE DATABASE ONLY**  
Never drop columns. Never change column types. Never truncate tables. Only add tables or columns. All new tables must have RLS enabled.

**RULE 7 — LAYOUT AND STYLING FREEZE**  
CSS/Tailwind class changes, height/width/z-index/overflow/spacing changes are HIGH RISK with cascading side effects. These require their own dedicated plan section. Never bundle layout changes into a functional fix without explicit approval for both.

**RULE 8 — SCHEMA CHANGE PROTOCOL**  
Per the user's established workflow with ChatGPT:
- Antigravity (any agent) proposes and documents the migration SQL in a plan
- User reviews the SQL with ChatGPT and/or executes via Supabase dashboard
- Antigravity does NOT execute migrations directly
- After execution, Antigravity reads the live schema to verify before writing any dependent code

**RULE 9 — STABILIZATION MODE**  
We are in stabilization mode. The definition of stabilization is:
- Fix what is broken
- Finish what is incomplete but foundational to the core product
- Do NOT add features that are not in the approved work sequence above
- When in doubt about whether something is a "fix" or a "feature," escalate to the user

**RULE 10 — SEQUENCE COMPLIANCE**  
Track B items cannot begin until Track A is complete. Track C items cannot begin until Track B is complete. Items within a track are done in the listed sequence, not in parallel, unless the user explicitly approves parallel execution.

**RULE 11 — UI ACCEPTANCE CRITERIA (ChatGPT)**  
No UI-touching implementation plan may be approved unless it can answer YES to all ten questions below. If any answer is NO, the plan must be revised before approval:

| # | Question | Must Answer |
|---|---|---|
| 1 | Does the screen make patient identity obvious? | Yes |
| 2 | Does it make current dose cycle obvious? | Yes |
| 3 | Does it make current phase obvious? | Yes |
| 4 | Does it separate active workflow from historical review? | Yes |
| 5 | Does it preserve patient context across navigation? | Yes |
| 6 | Does it avoid using color alone for state? | Yes |
| 7 | Does it avoid redefining clinical state based on reporting logic? | Yes |
| 8 | Does it keep layout risk low and localized? | Yes |
| 9 | Does it match the locked phase definitions in Section 3? | Yes |
| 10 | Does it reduce the chance of acting on the wrong record? | Yes |

---

## SECTION 8 — Context Briefing for External LLMs

**Review Status (v1.1):** This document has been reviewed by Gemini and ChatGPT. Their feedback has been incorporated into Sections 4, 5, and 6. The document is now considered complete and ready for work order creation. If you are an external LLM reviewing v1.1 or later, focus on the edge case rules in Section 6 and the three-status model in Section 4.

**What this app is:** A clinical documentation platform for psychedelic therapy (PAT) practitioners. It tracks patient treatment arcs across three phases: Preparation, Dosing, and Integration. The database is Supabase (PostgreSQL). The frontend is React + TypeScript + Tailwind CSS, using React Router (HashRouter). Authentication is Supabase Auth. Deployment is Vercel.

**What we are doing right now:**
1. Track A — Fixing two specific bugs (vitals chart DB hydration; session timeline bleeding)
2. Track B — Completing the treatment cycle data model and cross-page navigation
3. All work follows the strict sequence in Section 6. No parallel execution without explicit user approval.

**If you are being asked to help with SQL:**
- Per Rule 8, you are the preferred executor of schema changes
- Antigravity (INSPECTOR/BUILDER) proposes and documents the migration SQL
- You review and confirm before the user executes it in the Supabase dashboard
- After execution, Antigravity reads the live schema to verify

**What we DON'T need from you:**
- Suggestions to restructure the overall architecture beyond what's scoped in Section 6
- Implementation code without a reviewed plan that has user approval
- Features outside the approved sequence

---

## SECTION 9 — Git and Version Control State

```
HEAD → main → origin/main → Vercel production
Last commit: 7d0ae38 (2026-03-17)
Message: "fix: broaden alliance copy — inclusive language, discovery framing, evidence base"
```

The full commit history shows the multi-patient capability was introduced across commits from 2026-03-09 through 2026-03-14 (WO-INCIDENT-001/002/003/004). The most recent stable baseline before multi-patient complexity was introduced was approximately commit `ebe3f78` (2026-03-07, "FULL EXTRACTION — Complete restoration of perfectly working V2 Demo UI").

> The user has decided NOT to revert. We are fixing forward. This decision is final.

---

## SECTION 10 — How to Use This Document

**Every new Antigravity session:**
- INSPECTOR or BUILDER must read this brief before any planning or coding begins
- The work sequence in Section 6 is the only valid queue; no agent adds work items without user approval

**Every work order:**
- Must reference which Track and item number it addresses
- Must confirm it is not touching items outside the approved sequence
- Must include a verification plan

**Every implementation plan:**
- Must list this brief as a dependency read
- Must not propose changes that contradict Section 7 constraints

**User self-check:**
- Before approving any plan, reference Section 6 to confirm it fits the sequence
- If an agent proposes something that feels like scope expansion, reference the North Star test in Section 1
- You are allowed to say "stop, that's outside scope" at any time — agents must comply immediately

---

## SECTION 11 — Canonical Reporting Rules (Locked)

*Source: ChatGPT decision memo, verified against PPN schema. These five rules prevent future agents from sliding back into patient-level flattening.*

### The Five-Layer Hierarchy

All data in PPN belongs to one of these five levels, in this order. **Do not collapse them.**

| Layer | Definition |
|---|---|
| **1. Treatment Course** | The full arc of care for one patient under one protocol or care episode |
| **2. Dose Cycle** | One Preparation → Dosing → Integration sequence tied to one intended dosing event |
| **3. Encounter / Session** | A specific documented interaction (prep visit, dosing session, integration visit, safety follow-up) |
| **4. Measurement Time Point** | A structured anchor: `baseline`, `pre-dose`, `acute`, `day-1-3`, `week-1`, `week-2`, `month-1`, `month-3`, `month-6`, `final` |
| **5. Observation / Assessment** | PHQ-9, GAD-7, MEQ-30, vitals, behavioral changes, safety events, alliance, expectancy |

### Five Locked Rules

1. **Canonical analytical unit = dose cycle.** Dashboards default to cycle-level denominators unless explicitly stated otherwise.
2. **Phase truth source = practitioner-gated `log_patient_flow_events`.** Not form completion. Not elapsed time. Not views.
3. **Dosing anchor = one `log_clinical_records` row per dosing session.** This is not the treatment course. It is not the sole source of phase truth.
4. **Integration attribution = always to a specific prior `dosing_session_id`.** Integration never floats at the patient level without an originating dose.
5. **Assessments = anchored to time points, not used to define phase boundaries.** A patient in Preparation for Dose 2 can still be contributing outcome data from Dose 1.

### Locked Phase State Enum Values

These are the canonical values for `clinical_phase_status`. No other values are valid without a new approved plan:

| Value | Meaning |
|---|---|
| `preparation_open` | Practitioner has opened Preparation for an intended dose |
| `dosing_active` | Medicine has been administered; acute session in progress |
| `integration_open` | Dosing session ended; post-dose integration period open |
| `integration_closed` | Practitioner has explicitly closed integration for this dose |

### Locked Reporting Denominators

If no denominator is explicitly stated on a dashboard or chart, the default is **per dose cycle**.

| Metric | Numerator | Denominator |
|---|---|---|
| Integration completion rate | Cycles with explicit integration close | Cycles with completed dosing |
| Prep-to-dose conversion | Cycles with dose administered | Cycles with prep opened |
| Follow-up completion at month 1 | Cycles with month-1 assessment complete | Cycles for which month-1 is due |
| Adverse event rate | Dose cycles with ≥1 attributable adverse event | Completed dosing sessions |

### The 45-Day Follow-Up Window — Locked Rule

The `v_followup_compliance` 45-day window is a **reporting convenience**, not a phase boundary. It:
- May remain useful for compliance dashboards
- Must NOT auto-close integration
- Must NOT infer treatment discontinuation
- Must NOT redefine readiness for the next cycle

---

*This document was last updated: 2026-03-21T07:31:14-07:00*  
*Version: 1.2 — Final. Ready for work order creation.*
