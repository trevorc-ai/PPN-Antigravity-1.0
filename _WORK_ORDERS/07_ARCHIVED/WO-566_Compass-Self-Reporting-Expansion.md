---
id: WO-566
title: Integration Compass — Schema-Grounded Self-Reporting Expansion
owner: BUILDER
status: 00_INBOX
authored_by: PRODDY + INSPECTOR
reviewed_by: LEAD_PENDING
date: 2026-03-02
priority: P1
tags: [patient-facing, self-reporting, schema, compass, log_daily_pulse, log_behavioral_changes, log_longitudinal_assessments, log_red_alerts, PatientReport]
failure_count: 0
depends_on: [WO-563, WO-565]
---

## Strategic Rationale

> "If we guide patients to fit their responses into our schema, we can serve them
> so much better in a way that helps the practitioners."
> — Product Owner, 2026-03-02

The current Compass check-in collects 4 sliders: mood, sleep, connection, anxiety.
These map to 4 columns in `log_daily_pulse` — a table that does not appear in any
migration file and whose existence in production must be confirmed (see Blocker 0).

The live schema (`supabase/SCHEMA_REFERENCE.md`, exported 2026-03-01) contains three
additional tables that are fully ready to receive patient self-reported data but are
currently untouched by the Compass:

- `log_behavioral_changes` — structured life changes since session
- `log_longitudinal_assessments` — validated clinical scale scores (PHQ-9, GAD-7, WHOQOL, PSQI)
- `log_red_alerts` — patient-triggered safety flags

The design principle for this WO: **question design is schema design.** Every input
the patient sees has been reverse-engineered from an exact column in the live schema.
No free text. No new tables required. No schema changes required for the expansion.

The only schema-level change required is resolving the `log_daily_pulse` discrepancy
(see Blocker 0), which may require a migration if the table does not exist in production.

---

## Blocker 0 — Confirm log_daily_pulse Existence (MUST RESOLVE BEFORE BUILD)

The Compass writes to `log_daily_pulse`. The schema reference and migration files
define `log_pulse_checks`. These are different names.

**BUILDER must confirm in Supabase SQL Editor:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('log_daily_pulse', 'log_pulse_checks')
AND table_schema = 'public';
```

**If `log_daily_pulse` exists:** Continue. Add column `mood_level` if missing.
**If only `log_pulse_checks` exists:** All Compass writes must be redirected to
`log_pulse_checks` and column names updated to match the live schema exactly.
**If neither exists:** A migration is required before any build work begins.
This escalates to SOOP via the migration protocol.

The scale mismatch must also be confirmed: the migration file defines `CHECK (value
BETWEEN 1 AND 5)` on `log_pulse_checks` columns; the Compass sliders run 1–10.
If the live table has this constraint, all slider maxima must be changed to 5.

---

## Schema Map — Full Self-Reporting Surface

> All column names verified against `supabase/SCHEMA_REFERENCE.md` (2026-03-01).
> BUILDER must use these exact names. Zero deviation.

### Table 1: log_daily_pulse (or log_pulse_checks — resolve Blocker 0)

Daily check-in. Written once per day per session via the Compass.

| Patient input | UI element | Column | Type | Range |
|---|---|---|---|---|
| Mood today | Slider | `mood_level` | integer | 1–5 (confirm constraint) |
| Sleep quality last night | Slider | `sleep_quality` | integer | 1–5 |
| Sense of connection | Slider | `connection_level` | integer | 1–5 |
| Anxiety level | Slider | `anxiety_level` | integer | 1–5 |
| Session reference | auto | `session_id` | uuid | from URL param |
| Patient reference | auto | `patient_uuid` | uuid | from URL param |
| Submission date | auto | `check_in_date` | date | today |
| Submission time | auto | `submitted_at` | timestamptz | now() |

> IMPORTANT: The EMA graph in Zone 3 currently plots `connection_level` as the
> "mood" proxy. After this WO, `mood_level` must be read back and plotted as the
> primary mood line. `connection_level` becomes a separate line. BUILDER must
> update `usePhase3Data.ts` accordingly.

---

### Table 2: log_behavioral_changes

**Cadence:** Weekly (shown on days 7, 14, 21, 28 post-session, then monthly).
**UI:** A chip-selection panel titled "What has shifted since your session?"
**Design principle:** Patient selects from a curated list of change categories.
No free text. Each selection maps cleanly to structured columns.

| Patient input | UI element | Column | Value format |
|---|---|---|---|
| Change category | Chip selector (multi-select) | `change_type_ids` | ARRAY of ref IDs |
| Positive or challenging | Toggle | `is_positive` | boolean |
| Impact on wellbeing | Dropdown (3 options) | `impact_on_wellbeing` | varchar(30): `'positive'`, `'neutral'`, `'challenging'` |
| Confidence sustaining | Slider 1–5 | `confidence_sustaining` | integer |
| Related to session? | Toggle | `related_to_dosing` | varchar(30): `'clearly_yes'`, `'possibly'`, `'unrelated'` |
| Session reference | auto | `session_id` | uuid |
| Patient reference | auto | `patient_uuid` | uuid |
| Date of change | auto | `change_date` | date (today) |

**Chip categories for `change_type_ids`** (Builder queries `ref_behavioral_change_types`
if it exists, otherwise uses these display labels with a future FK migration):
- Physical activity habits
- Sleep patterns
- Diet / nutrition
- Relationship quality
- Work or creative output
- Emotional regulation
- Spiritual or contemplative practice
- Substance use (alcohol, cannabis, other)
- Social engagement
- Sense of meaning or purpose

**UX copy:** "What has changed since your session? Select all that apply."
Followed by: "Has this felt positive or challenging?" (toggle).
Then the confidence and relatedness sliders.

---

### Table 3: log_longitudinal_assessments

**Cadence:** Weekly validated mini-scales (shown at day 7, 14, 21, 28, then monthly).
**Design principle:** Phone-optimized PHQ-2 and GAD-2 (2-question proxies of
PHQ-9 and GAD-7). Patients answer 2 questions each, scores are summed and written
as the full scale score for trend tracking. Full PHQ-9 / GAD-7 at 90-day mark.

**Column:** `patient_uuid` (uuid) — resolved from session context.
**Column:** `session_id` (uuid) — from URL param.
**Column:** `days_post_session` (integer) — computed from session date.
**Column:** `assessment_date` (date) — today.

| Patient input | Clinical scale | Column | Type | Range |
|---|---|---|---|---|
| PHQ-2 score (2 questions, summed) | PHQ-9 proxy | `phq9_score` | integer | 0–27 |
| GAD-2 score (2 questions, summed) | GAD-7 proxy | `gad7_score` | integer | 0–21 |
| Sleep quality rating | PSQI proxy | `psqi_score` | integer | 0–21 |
| Life satisfaction today | WHOQOL proxy | `whoqol_score` | integer | 0–100 |
| CSSRS safety gate (see Safety section) | CSSRS | `cssrs_score` | integer | 0–5 |

**PHQ-2 questions shown to patient (UX copy):**
1. "Over the last week: little interest or pleasure in doing things?" (0–3)
2. "Feeling down, depressed, or hopeless?" (0–3)
Score summed, stored as `phq9_score`.

**GAD-2 questions shown to patient (UX copy):**
1. "Feeling nervous, anxious, or on edge?" (0–3)
2. "Not being able to stop or control worrying?" (0–3)
Score summed, stored as `gad7_score`.

---

### Table 4: log_red_alerts — Safety Gate (MANDATORY)

**Cadence:** Every single daily check-in, always shown last.
**Design principle:** A single binary question. If answered "Yes", an alert is
written to `log_red_alerts` and the Fireside Project number is surfaced immediately.
This is the most important missing input. Infrastructure already exists.

**UX copy (shown at the bottom of every check-in):**
> "Before you finish: Are you having any thoughts of harming yourself or others?"
> [ No, I'm okay ] [ Yes, I need support ]

If patient taps "Yes":
1. Surface Fireside Project number immediately: 623-473-7433
2. Insert a row into `log_red_alerts`
3. Do not block the patient from continuing

**Column mapping for log_red_alerts:**
| Field | Value |
|---|---|
| `patient_uuid` | from session context |
| `alert_type` | `'self_harm_flag'` |
| `alert_severity` | `'high'` |
| `alert_triggered_at` | now() |
| `trigger_value` | `{"source": "compass_checkin", "cssrs_proxy": true}` |
| `alert_message` | `'Patient self-reported thoughts of harm via Integration Compass check-in.'` |
| `is_acknowledged` | false |
| `is_resolved` | false |

> ZERO PHI: Neither patient name nor any identifying text is stored.
> Only the session UUID, the timestamp, and the structured flag fields.

---

## Check-In Cadence Design

The Compass shows different depth of check-in depending on days post-session.
BUILDER implements this as a computed `checkInTier` value derived from `sessionDate`.

| Days post-session | Check-in tier | Tables written | Est. patient time |
|---|---|---|---|
| Days 1–28 (daily) | Daily Pulse | `log_daily_pulse` | 90 seconds |
| Days 7, 14, 21, 28 | Weekly Reflection | `log_behavioral_changes` | 3 minutes |
| Days 7, 14, 21, 28 | Weekly Scale | `log_longitudinal_assessments` | 2 minutes |
| Every check-in | Safety Gate | `log_red_alerts` (conditional) | 5 seconds |
| Day 90 | Deep Assessment | Full PHQ-9 + GAD-7 (10 questions each) | 8 minutes |

UX: Daily Pulse is always shown. Weekly Reflection and Scale appear as a collapsible
section below the daily sliders on weekly milestone days. Safety gate always closes
every check-in.

---

## UX Architecture — Zone 3 Restructure

Zone 3 currently does too much. After this WO, it splits into three sub-panels:

**Sub-panel A: Your Journey Map** (the EMA graph — read only, always shows)

**Sub-panel B: Today's Check-In** (daily pulse sliders — always shows)
- Mood (slider 1–5)
- Sleep quality (slider 1–5)
- Sense of connection (slider 1–5)
- Anxiety (slider 1–5)
- Safety gate (binary, always last)

**Sub-panel C: This Week's Reflection** (collapsible, shows on day 7/14/21/28)
- Behavioral change chip selector
- PHQ-2 (2 questions)
- GAD-2 (2 questions)
- WHOQOL / PSQI single-question proxies

---

## Data Flow to Practitioner

Every submission feeds the practitioner's Phase 3 view directly:

| Patient action | Practitioner sees |
|---|---|
| Daily pulse submitted | EMA graph updates in real-time |
| Safety gate triggered | Red alert badge on patient card |
| Behavioral change logged | Behavioral Changes panel in Phase 3 |
| PHQ-2/GAD-2 submitted | Symptom Decay chart updates |
| WHOQOL submitted | Quality of Life trend line |

This is the flywheel: patient effort → practitioner intelligence → better clinical decisions → patient benefit → patient continues reporting.

---

## Acceptance Criteria

- [ ] **Blocker 0 resolved:** Builder confirms which table (`log_daily_pulse` or `log_pulse_checks`) exists in production and redirects writes accordingly
- [ ] **Scale confirmed:** All slider ranges match the live table constraint (1–5 or 1–10)
- [ ] **`mood_level` plotted:** EMA graph reads and plots `mood_level` as the primary line; `connection_level` as a secondary line
- [ ] **Safety gate:** Binary question shown at the bottom of every check-in; "Yes" writes to `log_red_alerts` with exact columns specified above and surfaces Fireside Project number
- [ ] **Behavioral chip panel:** Renders on day 7/14/21/28; multi-select chips write `change_type_ids` ARRAY; `is_positive`, `impact_on_wellbeing`, `confidence_sustaining`, `related_to_dosing` all written correctly
- [ ] **PHQ-2 / GAD-2:** Two questions each, summed score written to `phq9_score` and `gad7_score` in `log_longitudinal_assessments` with correct `patient_uuid`, `session_id`, `days_post_session`
- [ ] **`patient_uuid` used everywhere:** Zero instances of `patient_id` in new inserts (see SCHEMA_REFERENCE.md Known Invalid Columns)
- [ ] **Zero free text:** No `<textarea>` or `<input type="text">` added to the Compass check-in flow
- [ ] **Cadence gating:** Weekly reflection panels only render on day 7/14/21/28 post-session (or if `sessionDate` is undefined, default to daily tier only)
- [ ] **No new tables:** All writes go to existing live tables only
- [ ] **Print mode:** All new sub-panels hidden in `@media print` via `className="no-print"`
- [ ] **Mobile:** All chip selectors are minimum 44px touch targets; sliders are full-width

---

## Out of Scope

- Free-text journaling capture (violates ZERO PHI / free-text rule)
- Phase 1 or Phase 2 self-reporting on the Compass (future WO)
- Wearable biometric imports (separate WO)
- Push notifications or SMS reminders for check-in cadence (future WO)
- Any new database tables or columns (additive only — existing columns only)
- Any changes to the practitioner portal Phase 3 view (separate WO for that visualization update)

---

## LEAD Sign-Off Checklist

- [ ] Blocker 0 resolution path approved
- [ ] Safety gate copy and `log_red_alerts` field mapping approved
- [ ] Behavioral change chip category list approved
- [ ] PHQ-2 / GAD-2 question copy approved
- [ ] Cadence table (daily / weekly / 90-day) approved
- [ ] No new tables confirmed
- [ ] BUILDER assigned and unblocked

---

## PRODDY + INSPECTOR Sign-Off

- [x] All column names verified against `supabase/SCHEMA_REFERENCE.md` (2026-03-01 export)
- [x] `patient_uuid` used in all new inserts (not `patient_id`)
- [x] Zero free text in any patient input
- [x] Safety gate routes to existing `log_red_alerts` infrastructure
- [x] No new tables required
- [x] Blocker 0 documented with exact SQL to run
- [x] Depends on WO-563 (Compass built) and WO-565 (UX polish) noted in frontmatter
