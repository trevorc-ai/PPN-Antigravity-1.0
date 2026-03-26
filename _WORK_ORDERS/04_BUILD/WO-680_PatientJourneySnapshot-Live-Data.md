---
id: WO-680
title: "Connect PatientJourneySnapshot to live session timeline data"
owner: BUILDER
status: 04_BUILD
priority: P1
created: 2026-03-24
origin: "Intelligence Gap Audit — Tier 2"
files:
  - src/components/analytics/PatientJourneySnapshot.tsx
---
## Problem
`PatientJourneySnapshot` renders a session timeline view. Its DB connection is unclear — it may use props passed from a parent page, or it may render static/placeholder data. Either way, it is not confirmed to be pulling from `log_clinical_records` + `log_session_vitals`.

## Required Fix
1. **Audit first** — read the current component to determine exactly what data source it uses
2. If disconnected: wire to `log_clinical_records` for the selected session, plus `log_session_vitals` for vital timestamps
3. Phase bands (onset, peak, integration, afterglow, descent) must be labeled as **"Protocol-estimated"** throughout — not as measured biological windows
4. Events on the timeline (AE, rescue med, clinician note) must come from `log_safety_events` joined on `session_id`
5. The transport readiness window must come from `dose_administered_at` + substance-specific protocol window (config, not hardcoded per session)

## Phase Label Standard (mandatory)
> Every phase band label must include a sub-label: _"Protocol-estimated timing. Not a pharmacokinetic measurement."_
> This is a P0 correctness fix per the intelligence gap audit.

## Success Criteria
- Timeline events match `log_safety_events` for the selected session
- Phase bands render from dose time + configured protocol window, not static values
- "Protocol-estimated" label visible on all phase bands

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS
No DB impact detected. Cleared for build.
Signed: INSPECTOR | Date: 2026-03-24
