---
id: WO-630
title: "Protocol Detail — Clinical Decision-Support Enhancements"
owner: BUILDER
authored_by: LEAD
routed_by: LEAD
status: 03_BUILD
priority: P1
created: 2026-03-11
routed_at: ""
depends_on: "none"
skip_approved_by: ""
hold_reason: ""
held_at: ""
failure_count: 0
completed_at: ""
builder_notes: ""
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
  - ".agent/skills/frontend-surgical-standards/SKILL.md"
---

## Context

The Protocol Details page (`/protocol/:id`) currently functions as a data preview rather than a clinical decision-support tool. A practitioner arriving at this page before or after a session cannot answer the most important clinical question — *"Is this patient cleared to dose today, and what happened last time?"*

A gap analysis against `public/internal/admin_uploads/research/Session-research.md` (CANMAT, CPSBC, APA consensus, Oregon psilocybin program standards) identified the following missing or broken outputs.

**Database note:** `log_longitudinal_assessments` and `log_baseline_assessments` join on `patient_uuid`, but `log_clinical_records` does not expose `patient_uuid` directly. The current data-fetch in `ProtocolDetail.tsx` skips those tables (lines 197–201) with a `Promise.resolve` stub. Fixing the PHQ-9/GAD-7 trajectory requires resolving this join — either by adding a `patient_uuid` select to the `log_clinical_records` query (if the column exists) or by joining through `patient_link_code_hash` via a secondary lookup. BUILDER must verify the live schema before writing the join.

---

## Acceptance Criteria

### 1. Vitals Chart — Diastolic BP + Safety Threshold Lines
- [ ] Add `bp_diastolic` to the `Vital` interface and the Supabase `.select()` query
- [ ] Plot diastolic BP as a third `<Area>` series (color: orange, `dataKey="dia"`) on the Session Vitals chart
- [ ] Add two `<ReferenceLine>` horizontal markers to the vitals `<AreaChart>`:
  - `y={140}` — label "Do Not Start (SBP)" — color `#f59e0b` (amber), dashed
  - `y={160}` — label "Pause / Stop (SBP)" — color `#ef4444` (red), dashed
- [ ] Update the vitals summary stats row to include Avg Diastolic alongside existing stats
- [ ] Tooltip content for both reference lines: cite the CANMAT threshold (text can be hardcoded)

### 2. Protocol Card — Route + Dose
- [ ] `route_id` already exists on `SessionRecord`. Add a `routeLabel` derived value using a `ROUTE_LABELS` map (e.g., `1: 'IV'`, `2: 'IM'`, `3: 'Oral/Sublingual'`, `4: 'Intranasal'`). Display in Protocol Card below Session Type
- [ ] `dosage` was previously removed from the select query due to a crash (WO-615). **Before re-adding**, verify the column exists in the live schema by running: `select column_name from information_schema.columns where table_name = 'log_clinical_records' and column_name = 'dosage'`. If present, add to interface and display in Protocol Card (unit: mg). If absent, skip and note in builder_notes.

### 3. Session Series Context
- [ ] Replace the bare "Total Sessions" count in the Protocol Card with a session series indicator: e.g., **"Session 2 of 5"** — meaning this session's position (by date) within all sessions for this patient
- [ ] Derive by sorting `patientSessions` ascending by `session_date` and finding `indexOf(session.id) + 1`

### 4. PHQ-9 + GAD-7 Longitudinal Trajectory (Conditional)
- [ ] Investigate whether `log_clinical_records` exposes a `patient_uuid` column. If yes:
  - Add `patient_uuid` to the session `.select()` query
  - Use it to query `log_baseline_assessments` and `log_longitudinal_assessments` (replacing the current `Promise.resolve` stubs on lines 197–201)
  - Fetch `gad7_score` alongside `phq9_score` from both tables
- [ ] If `patient_uuid` is NOT on `log_clinical_records`: leave PHQ-9/GAD-7 queries as stubs and add a `// TODO WO-630: patient_uuid not available on log_clinical_records — trajectory blocked` comment. Do not break the page.
- [ ] If trajectory data IS available: render a second `<Area>` for GAD-7 on the Efficacy Trajectory chart (green, `domain={[0, 21]}`, `<ReferenceLine y={10}` label="GAD-7 Concern"`)
- [ ] Add a severity band label beneath each baseline score in the Protocol Card sidebar: PHQ-9 (0–4 None, 5–9 Mild, 10–14 Moderate, 15–19 Mod-Severe, ≥20 Severe). GAD-7 (0–4 None, 5–9 Mild, 10–14 Moderate, ≥15 Severe).

### 5. Pre-Session Clearance Checklist Strip (Read-Only)
- [ ] Add a new compact section between the Protocol Card and Safety Monitor titled **"Session Clearance"**
- [ ] Render as a vertical list of read-only indicator rows. Each row has: icon (✓ green / ⚠ amber / — grey), label, and value:
  - **BP Pre-Dose** — show last recorded systolic/diastolic from vitals, colored green (<140/90), amber (140–160), red (>160). If no vitals: `—` grey
  - **Concomitant Meds** — if `concomitant_med_ids` is non-empty, show count + amber warning icon; if empty/null show `—`
  - **Safety Events** — mirror Safety Monitor: `None` (green) or count (red)
  - **Sessions on Record** — session series position (from #3)
- [ ] This section is **display-only** — no edit capability. No new DB writes.

### 6. No Regressions
- [ ] `npm run build` clean — zero TypeScript errors
- [ ] Vitals chart renders correctly with 0, 1, or 9+ readings
- [ ] Safety Monitor unchanged in behavior
- [ ] Session History cards unchanged
- [ ] Print layout (`window.print()`) still renders all sections

---

## Files to Modify

| File | Action |
|---|---|
| `src/pages/ProtocolDetail.tsx` | MODIFY — all changes above |

---

## Constraints

- **No schema changes.** This WO is frontend-only. If `patient_uuid` is missing from `log_clinical_records`, document and skip — do not add columns.
- **Surgical only** — do not refactor the data-fetch architecture, layout grid, or component structure outside the exact scope above.
- **Zero PHI in UI** — patient reference display uses `patient_link_code_hash` / the 10-digit public ID only, never raw UUIDs.
- The `dosage` field investigation (AC #2) is required before any code change. Two-strike rule applies.
- Do not remove the existing Receptor Affinity Profile radar — it stays as-is.

---

## LEAD Architecture

**Routing Decision:** All changes are contained to `ProtocolDetail.tsx`. The most complex item is AC #4 (PHQ-9/GAD-7 trajectory) which depends on a live schema check — BUILDER must run the schema query first and branch accordingly. AC #1–3 and #5 are safe to implement in parallel. Ship as a single commit: `feat(WO-630): protocol detail clinical decision-support enhancements`.

**Reference:** `public/internal/admin_uploads/research/Session-research.md` — CANMAT BP thresholds (section: "Screening tools and practical thresholds"), PHQ-9 severity bands (section: "Recommended measurement-based intake"), session monitoring timepoints (section: "Ketamine clinic measurement schedule").
