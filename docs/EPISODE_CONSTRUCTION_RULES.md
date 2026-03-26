# PPN Episode Construction Rules

---

> **Status:** ACTIVE  
> **Version:** V1.0.0  
> **Owner:** LEAD / Clinical Intelligence  
> **Created:** 2026-03-25  
> **WO Origin:** WO-686  
> **Purpose:** Defines what constitutes one treatment episode in PPN. All cohort comparison, longitudinal benchmarking, and outcome analysis depends on these definitions. These rules must be locked before any benchmark engine is built on top of episode-level data.

---

## Why This Matters

Before any comparison engine, cohort builder, or longitudinal benchmark can operate correctly, PPN must formally define what constitutes **one treatment episode**. Without this definition:

- A "cohort of psilocybin patients" might silently mix patients who had one preparation session vs. patients who completed a full 3-phase protocol
- Outcome rates (response, remission, AE rate) become incomparable across practices
- Repeated treatments for the same patient create double-counting or under-counting

**This document is the authoritative definition. All analytics views (v_/mv_) that compute episode-level metrics must implement these rules exactly.**

---

## 1. Episode Start

**Rule:** An episode begins when a practitioner creates the first session record for a patient under a specific protocol.

**Trigger event:** `INSERT INTO log_sessions` with `session_type = 'preparation'` (Phase 1 first contact) OR `session_type = 'dosing'` if preparation was conducted outside PPN.

**Episode anchor:** The earliest session timestamp for a given `(patient_id, substance_id, practitioner_id)` tuple within the allowable session gap window (see Rule 3).

---

## 2. Episode End

**Rule:** An episode ends when ANY of the following occur:

| Condition | Close Trigger |
|---|---|
| Practitioner explicitly marks episode closed | `log_sessions.episode_closed_at IS NOT NULL` |
| Final integration session logged with no follow-up within 90 days | System auto-close after 90-day inactivity |
| Patient withdraws consent | `log_patient_status.status = 'consent_withdrawn'` |
| Patient is deceased | `log_patient_status.status = 'deceased'` |

**Note:** Episode closure is stored as `log_episodes.closed_at`. Episodes are never deleted — only closed.

---

## 3. Allowable Session Gap

**Rule:** A gap of more than **90 days** between sessions, where no new session has been logged, automatically closes the active episode. If a new session is logged after the 90-day gap, it opens a **new episode**.

**Rationale:** The 90-day primary outcome window is the standard therapeutic follow-up period. Sessions beyond 90 days represent either a new treatment course or durability assessment — both are better modeled as a new or attached episode.

**Edge case — follow-up attachment:** Integration and follow-up sessions logged within 90 days of the dosing session are attached to the same episode (see Rule 5). Follow-up sessions logged 91–180 days post-dosing are attached as "extended follow-up" if within the durability window. Sessions after 180 days open a new episode.

---

## 4. Protocol Change Rule

**Rule:** A change in primary substance (`ref_substances.substance_name`) mid-protocol **always** opens a new episode, even if the session gap is less than 90 days.

**Example:**
- Sessions 1–3: Ketamine for depression → Episode A (Ketamine)
- Session 4: Psilocybin (substance changes) → Episode B (Psilocybin), same patient

**Exception:** If a secondary substance is documented alongside the same primary substance (e.g., Ibogaine HCL + IV Metoclopramide), the episode does not change — secondary medications are logged within the active episode via `log_dose_events`.

---

## 5. Follow-Up Attachment Rules

Integration and follow-up sessions attach to the dosing episode as follows:

| Session Type | Window | Attachment |
|---|---|---|
| Phase 2 (Dosing) | — | Episode anchor (primary event) |
| Phase 3 (Integration) | Within 90 days of dosing | Attached to same episode |
| 7-day follow-up | Within 14 days of dosing | Extended early follow-up — same episode |
| 30-day follow-up | Within 45 days of dosing | Same episode |
| 90-day follow-up | Within 120 days of dosing | Same episode (primary outcome) |
| 180-day durability | Within 210 days of dosing | Same episode (durability assessment) |
| Any session after 180+ days | Beyond 210 days | Opens new episode |

---

## 6. Repeated Episodes

**Rule:** One patient may have multiple lifetime episodes in PPN. Each episode is independent for outcome and benchmarking purposes.

**Storage:** Each episode has a unique `log_episodes.id`. All `log_sessions` rows for that episode reference the same `episode_id` FK.

**Analytics handling:** Cohort counts use episode as the unit, not session. Benchmark queries join on `episode_id`. Response/remission rates are episode-level (one classification per episode per outcome window).

---

## 7. Cross-Protocol Episodes

**Rule:** If a patient transitions between substances (e.g., Ketamine Series → Psilocybin), each substance defines its own episode. Do NOT combine cross-substance episodes.

**Rationale:** Substance is the primary clinical differentiator. QTc risks for Ibogaine, dissociative effects of Ketamine, and neural plasticity effects of Psilocybin are not combinable into a single outcome unit without substantial analytical distortion.

**Analytics note:** A patient's cross-substance history is captured in the patient-level profile (`mv_patient_latest_status`) but cross-substance episodes are never merged into a single outcome calculation.

---

## 8. Minimum Data for Episode Validity

An episode is counted in benchmark and outcome cohorts ONLY if ALL of the following are non-null:

| Field | Source | Required Value |
|---|---|---|
| `episode_start_date` | `log_episodes.started_at` | Not NULL |
| `primary_substance_id` | `log_episodes.primary_substance_id` | FK to `ref_substances` |
| `indication_id` | `log_episodes.indication_id` | FK to `ref_indications` |
| At least one Phase 2 (dosing) session | `log_sessions WHERE session_type = 'dosing'` | COUNT >= 1 |
| Baseline assessment score | `log_phq9_assessments / log_gad7_assessments` | At least one baseline instrument |
| `practitioner_id` | `log_episodes.practitioner_id` | Not NULL |

Episodes missing any of the above are retained in the database (append-only rule) but excluded from benchmark cohorts with status `episode_validity = 'incomplete'`.

---

## Standard Time Windows (Locked)

The following time windows are fixed across all PPN analytics. They may NOT be changed without a schema amendment and a new version of this document.

| Window | Definition | Use |
|---|---|---|
| Acute session window | Duration of Phase 2 dosing session (timestamp-bounded) | AE classification, vital monitoring |
| 24-hour safety window | 0–24h post-dosing | Immediate adverse event surveillance |
| 7-day early follow-up | 0–14 days post-dosing (captured at day 7) | Early PHQ-9, GAD-7, subjective report |
| 30-day follow-up | 15–45 days post-dosing (captured at day 30) | Intermediate outcome |
| 90-day primary outcome | 46–120 days post-dosing (captured at day 90) | Primary response/remission endpoint |
| 180-day durability follow-up | 121–210 days post-dosing (captured at day 180) | Durability of response |

---

## Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| V1.0.0 | 2026-03-25 | LEAD (WO-686) | Initial rules defined. Pending clinical validation by user if ambiguous rules need adjustment (see Rules 3, 7). |
