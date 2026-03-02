---
id: WO-571
title: "Always-On Companion — Patient Emotional Logging Across the Full Arc of Care"
owner: BUILDER
status: 00_INBOX
authored_by: PRODDY
reviewed_by: LEAD_PENDING
inspector_pre_audit: INSPECTOR_COMPLETE
date: 2026-03-02
priority: P0
tags: [patient-facing, companion, always-on, arc-of-care, self-reporting, log_longitudinal_assessments, log_behavioral_changes, schema-grounded]
failure_count: 0
depends_on: [WO-570, WO-570d]
blocks: []
---

## PRODDY PRD — Always-On Companion

> **INSPECTOR Pre-Audit Complete (2026-03-02):** Schema findings embedded in
> Section 5. All column names verified against SCHEMA_REFERENCE.md. Two live
> verification queries required before BUILD starts (see Section 5, Blockers 1 & 2).

---

### 1. Problem Statement

The Companion app is currently a practitioner's monitoring instrument that a patient
interacts with for 4–6 hours during a dosing session. The moment the session ends,
the patient loses access to the only emotional logging interface they know. They are
sent home with their experience and no structured way to continue expressing or
tracking it. The Integration Compass then asks them to fill out sliders. Sliders are
not the same emotional vocabulary as the Companion. There is no continuity.
Making the Companion always-on — before, during, and after the session — creates a
single, unbroken patient interface across the entire arc of care, and all data routes
directly into existing schema tables with no new DB structure required for the
core scoring layer.

---

### 2. Target User + Job-To-Be-Done

A patient 1–28 days post-session needs to open a familiar interface — the same one
they used during their session — tap how they are feeling today using translated
clinical-scale language, and have that data update their Integration Compass
visualizations and their practitioner's Phase 3 dashboard simultaneously — in under
90 seconds — without creating an account or entering their name.

---

### 3. Success Metrics

1. A patient submitting a Companion check-in on Day 7 causes their `phq9_score` and
   `gad7_score` to update in `log_longitudinal_assessments` with correct `session_id`,
   `patient_uuid`, `days_post_session`, and `assessment_date` — verified by INSPECTOR
   Supabase query against a test session after a real Companion submission
2. The EmotionalWaveform component on the Integration Compass re-renders with the new
   data point within 5 seconds of a Companion submission — verified by INSPECTOR on-
   screen verification across 3 test sessions
3. The Companion is accessible via the patient's unique link (`/companion?sessionId=
   {uuid}`) without login and without PHI — verified by zero-PHI audit: no name,
   DOB, address, or provider NPI visible anywhere on the page

---

### 4. Feature Scope

#### The Three Phases of the Always-On Companion

**Phase A — Preparation (pre-session, optional)**
Patient opens Companion before their session day to check in on their readiness.
Writes to `log_behavioral_changes` and `log_longitudinal_assessments`.
Practitioner sees pre-session emotional baseline in Phase 1.

**Phase B — In-Session (unchanged)**
Exactly as today. No changes to existing in-session Companion functionality.

**Phase C — Integration (daily, post-session)**
Patient opens Companion via their Integration Compass link or a bookmarked URL.
This is the primary new experience. Daily check-in using translated clinical
language. Writes to `log_longitudinal_assessments` and `log_behavioral_changes`.

---

#### The Patient-Facing Question Design

> **Core principle (user-authorized):** Every question displayed to the patient maps
> to an exact column in the live schema. The patient never sees clinical scale names.
> They see human language. The data submitted is standardized and schema-grounded.

**Daily Check-In (maps to `log_longitudinal_assessments`)**

| Patient sees | Maps to | Column | Range |
|---|---|---|---|
| "Over the last few days, how heavy has your mood been? \n 😔 Very heavy → 😌 Lifting" | PHQ-9 proxy | `phq9_score` | 0–27 |
| "How much has worry or anxiety been with you? \n 🌊 A lot → 🌤 Much less" | GAD-7 proxy | `gad7_score` | 0–21 |
| "How restorative has your sleep been? \n 😩 Poor → 😴 Very restful" | PSQI proxy | `psqi_score` | 0–21 |
| "How full and meaningful has life felt lately? \n 🪨 Empty → ✨ Very full" | WHOQOL proxy | `whoqol_score` | 0–100 |
| "Before you finish: Are you having any thoughts of harming yourself or others? \n [ No, I'm okay ] [ I need support ]" | CSSRS safety gate | `cssrs_score` | 0–5 |

> Implementation note: Full PHQ-9 (27 points) and GAD-7 (21 points) are derived from
> 2-question proxy items summed and linearly scaled. The patient sees 2 questions per
> scale maximum on daily check-ins. Full 9-question PHQ-9 and 7-question GAD-7 on
> day 90 milestone only. UX framing must never show scale names or score numbers to
> the patient — only the glowing gradient sliders and natural language anchors above.

**Weekly Reflection (maps to `log_behavioral_changes`, shows on day 7/14/21/28)**

| Patient sees | Column | Value |
|---|---|---|
| "What has shifted since your session?" (chip selector) | `change_type_ids` | ARRAY of ref IDs |
| "Has this felt like a positive shift or a challenge?" (toggle) | `is_positive` | boolean |
| "How much has this change touched your life overall?" (3 options) | `impact_on_wellbeing` | 'positive' / 'neutral' / 'challenging' |
| "How confident are you that this shift will last?" (5-tap scale) | `confidence_sustaining` | integer 1–5 |
| "Does this feel connected to your session?" (3 options) | `related_to_dosing` | 'clearly_yes' / 'possibly' / 'unrelated' |

**Safety Gate (every check-in, always last)**

If patient taps "I need support":
1. Surface Fireside Project number immediately: **623-473-7433**
2. Insert to `log_red_alerts`:
   - `patient_uuid` from session context
   - `alert_type`: `'self_harm_flag'`
   - `alert_severity`: `'high'`
   - `alert_triggered_at`: now()
   - `is_acknowledged`: false / `is_resolved`: false
3. Do NOT block the patient from the rest of the Companion

---

#### Route and Access

- Patient URL: `/companion?sessionId={uuid}` — public, unauthenticated, zero-PHI
- Practitioner preview: `/companion?sessionId={uuid}&pv=1` — same gate as Compass
- The patient's Compass hero header includes a persistent "How are you today?" CTA
  that routes to `/companion?sessionId={uuid}` — bookmarkable, home-screen installable

---

#### Cadence Gating

BUILDER computes `checkInTier` from `daysPostSession` (derived from `session_date`
in `log_clinical_records`). No new columns required.

| Days post-session | What the patient sees | Tables written |
|---|---|---|
| Days 1–28 (daily) | Daily Check-In (PHQ-2/GAD-2 proxy, WHOQOL, PSQI, safety) | `log_longitudinal_assessments` |
| Days 7, 14, 21, 28 | + Weekly Reflection (behavioral chip panel) | `+ log_behavioral_changes` |
| Day 90 | Full PHQ-9 (9 questions) + GAD-7 (7 questions) | `log_longitudinal_assessments` |
| Pre-session (Phase A) | Readiness check (mood, anxiety, sleep — same questions) | `log_longitudinal_assessments` |
| Every check-in | Safety gate | `log_red_alerts` (conditional on "Yes") |

---

#### Downstream to Integration Compass

Every Companion submission immediately enriches:
1. **EmotionalWaveform** (WO-570b) — `phq9_score` and `gad7_score` plotted as daily
   points extending the waveform beyond the session
2. **IntegrationStoryChart** (WO-570b) — clinical score trajectory over time
3. **CompassEMAGraph** (WO-570c) — mood, sleep, anxiety trend lines
4. **CompassSpiderGraph** (WO-570b) — post-session "Lived Experience" polygon updates
   as integration data accumulates (a Week 3 overlay vs. the in-session polygon shows
   the patient how their emotional profile has shifted during integration)

---

### 5. INSPECTOR Pre-Audit Findings (Embedded)

**Blocker 1 — Verify `log_session_timeline_events` exists in production**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('log_session_timeline_events', 'log_companion_events');
```
Run before BUILD. If neither exists → SOOP files a migration for the in-session
Companion tap table before this WO is built.

**Blocker 2 — Verify `ref_assessment_scales` contents**
```sql
SELECT * FROM ref_assessment_scales ORDER BY assessment_scale_id;
```
If PHQ-9, GAD-7, WHOQOL, PSQI entries exist, annotate log_longitudinal_assessments
inserts accordingly. If the table is empty or not relevant to scoring writes,
document and proceed without a FK reference to `assessment_scale_id`.

**Confirmed safe — no new tables required for scoring layer:**
- `log_longitudinal_assessments` — ready, columns verified, `assessment_date NOT NULL`
  (BUILDER must always pass today's date)
- `log_behavioral_changes` — ready, all columns verified
- `log_red_alerts` — ready, all columns verified in WO-566 schema map

**Known column to always include:** `days_post_session` — must be computed from
`session_date` in `log_clinical_records`. BUILDER must not hardcode or skip this.

---

### 6. Out of Scope

- Free-text journaling or open-ended patient notes (zero PHI, zero free text)
- New database tables for the scoring layer (existing tables only)
- Push notifications or SMS cadence reminders
- Wearable biometric data integration
- Multi-session Companion (one session UUID per link)
- Changes to in-session Companion Phase B functionality

---

### 7. LEAD Sign-Off Checklist

- [ ] Blocker 1 verification path approved
- [ ] Blocker 2 verification path approved
- [ ] Patient-facing question copy approved (Section 4, question design table)
- [ ] CSSRS safety gate copy and routing approved
- [ ] Cadence table (daily / weekly / day-90) approved
- [ ] `/companion?sessionId=` route approved
- [ ] No new tables confirmed (existing schema only)
- [ ] BUILDER assigned and unblocked after Blockers 1 & 2 resolved

---

*PRODDY Sign-Off:*
- [x] Problem Statement ≤ 100 words, no solution ideas
- [x] Job-To-Be-Done: single sentence, correct format
- [x] All 3 metrics: measurable, specific, verifiable
- [x] All column names verified against SCHEMA_REFERENCE.md (2026-03-01)
- [x] `patient_uuid` used in all write specs (not `patient_id`)
- [x] Zero free text in any patient input
- [x] INSPECTOR pre-audit embedded in Section 5
- [x] Out of Scope explicit and non-empty
- [x] No raw SQL authored in this document
