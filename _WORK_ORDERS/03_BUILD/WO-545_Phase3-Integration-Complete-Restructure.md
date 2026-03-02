---
id: WO-545
title: "Phase 3 Integration — Complete Restructure: Cards-First Layout, Phase 2 Carry-Forward, and Real Component Wiring"
status: 03_BUILD
owner: BUILDER
created: 2026-03-01T14:51:32-08:00
failure_count: 0
priority: HIGH
authored_by: PRODDY
reviewed_by: LEAD
approved_at: 2026-03-01T14:55:36-08:00
---

## User Request (Verbatim)

> "Should we include visualizations that integrate the information or analyze the events that occurred during Phase 2, so that Phase 3 is truly a holistic view of everything the user would need to have a complete and true assessment of both this individual session and the ongoing treatments over time?"

> "Outstanding. good work. Approved to proceed!"

## PRODDY Summary

Phase 3 currently shows disconnected, primarily fake data across four conflicting timelines (21 days, 12 weeks, 6 months, 7 days). Data visualizations appear before any patient data exists, and the page is unexplainable to a new practitioner. A full inventory of `src/components/` revealed 7 pre-built components that were designed for Phase 3 use cases but never wired in. Phase 2 data is not carried forward at all.

This ticket restructures Phase 3 into a coherent, cards-first workflow that:
1. Guides the practitioner through post-session documentation first (matching Phase 1/2 UX pattern)
2. Carries the most clinically relevant Phase 2 data forward into a permanent context strip
3. Replaces fake/duplicate charts with the superior pre-built components already in the codebase
4. Adds honest empty states and tooltips to all panels
5. Surfaces new clinical intelligence (Predicted Integration Needs, Declining Trend Alerts, Safety Timeline)

---

## Scope of Work

### 1. Session Snapshot Strip (NEW — top of page, always visible)
A compact read-only context bar that carries Phase 2 data forward. Sits above the action cards.

Fields to display:
- **Substance + Dose** — from `ppn_dosing_protocol` localStorage / session record
- **MEQ-30 + CEQ side-by-side** — from `assessmentScores` set at Phase 2 closeout (DosingSessionPhase.tsx line 382). Display as two pill chips: MEQ-30: `N` | CEQ: `N`. Add tooltip: "MEQ-30 = mystical depth of the experience. CEQ = how challenging it was. Both together shape what integration requires."
- **Psychological Difficulty + Resolution Status** — from session update log or post-session assessments. Display as: `Difficulty: 7/10 — Unresolved` with amber/red badge if unresolved.
- **Safety Events Count** — count of completed `safety-and-adverse-event` form entries for this session. Display as green "No Events" or amber/red "N Events Logged".

If Phase 2 closeout was skipped (no data), show each chip in a greyed-out "Not recorded" state — do not hide the strip.

---

### 2. Phase 3 Action Cards (NEW — below snapshot strip, above visualizations)
Matching the Phase 1 card pattern exactly (`Phase1StepGuide` anatomy: top accent stripe, step number, icon, title, description on active card, CTA button). Use **teal color palette** (teal-900/20 background, teal-400 stripe, teal-300 text).

Section label: `"Integration · Post-Session Steps"` with a progress bar (completed/total).

**Time Horizon A — Day 0–3: Immediate Follow-Up**
```
Card 1: Safety Check
  form: 'structured-safety' (Phase 3 variant)
  description: "Confirm the patient is stable and safe post-session."
  icon: shield_check

Card 2: Daily Pulse — First Check-In
  form: 'daily-pulse'
  description: "Log the patient's first mood and sleep reading post-session."
  icon: favorite
```

Time-gating logic: If `daysPostSession > 3`, this section header changes to `"Day 0–3 · Completed Window"` and the cards dim to a muted/archived state (not hidden — still accessible via "Open" button). Do NOT remove them; practitioners may still need to backfill.

**Time Horizon B — Days to Weeks: Ongoing Integration**
```
Card 3: Integration Session
  form: 'integration-session'
  description: "Document your clinical integration conversation with the patient."
  icon: psychology

Card 4: Longitudinal Assessment (PHQ-9 / GAD-7)
  form: 'longitudinal-assessment'
  description: "Re-assess symptom scores. This powers all outcome visualizations below."
  icon: clinical_notes

Card 5: Behavioral Change Tracker
  form: 'behavioral-tracker'
  description: "Track habit formation and behavioral shifts since the session."
  icon: track_changes

Card 6: MEQ-30
  form: 'meq30'
  description: "Document the depth and quality of the session experience (24–48 hrs post-session ideal)."
  icon: self_improvement
  conditional: Only show if MEQ-30 was NOT completed in Phase 2 closeout (`assessmentCompleted === false`)
```

All cards are **optional** — no hard gate, no lock. Use the same "Open / Continue / Completed → Amend" pattern from Phase 1.

---

### 3. Intelligence Panel (BELOW cards — replaces current visualization section)

All panels must have:
- A one-line plain-English description beneath the title
- An `AdvancedTooltip` (existing component) on a `?` icon explaining what the chart shows and how to read it
- An honest **empty state** when data is absent: titled "Waiting for data", with the specific form name needed to unlock it (e.g., "Complete a Longitudinal Assessment to unlock this chart")

**Panel order and component wiring:**

#### Panel A — Forecasted Integration Plan
- **Component:** `src/components/arc-of-care/PredictedIntegrationNeeds.tsx`
- **Wire to:** Phase 1 baseline scores — `aceScore` (from intake/safety form), `gad7Score`, `phq9Score`, `expectancyScale` (from Set & Setting form), `pcl5Score` (if available)
- **Description:** "Based on this patient's baseline risk profile, this algorithm forecasts how many integration sessions they are likely to need and at what frequency."
- **Unlocks when:** Phase 1 baseline assessments are present (ACE, GAD-7, PHQ-9 available)
- **Empty state:** "Complete Phase 1 Mental Health Screening to unlock this forecast."

#### Panel B — Declining Trend Alert
- **Component:** `src/components/risk/ProgressRiskFlags.tsx`
- **Wire to:** `usePhase3Data` decayPoints — compare last two longitudinal assessment entries. If any metric has regressed ≥5% toward baseline over 2+ consecutive readings, surface as a flag.
- **Description:** "Monitors for signs that symptom improvement may be reversing. Triggers automatically when two or more assessments show a declining trend."
- **Unlocks when:** `decayPoints.length >= 2`
- **Empty state:** Not rendered until data exists (component already handles empty gracefully by returning null)

#### Panel C — Safety Event History (collapsible, closed by default)
- **Component:** `src/components/safety/SafetyTimeline.tsx`
- **Wire to:** Query `log_clinical_records` or `log_adverse_events` for this `session_id`. Map to `SafetyEvent[]` shape.
- **Header:** Collapsible — show `"Safety Events: N"` badge. Open by default only if N > 0.
- **Description:** "A full chronological record of all safety checks and adverse events from this patient's care journey."
- **Empty state:** The component already handles this: "No safety checks recorded yet."

#### Panel D — Patient Journey Timeline
- **Component:** `src/components/analytics/PatientJourneySnapshot.tsx`
- **Wire to:** Replace `MOCK_JOURNEY_DATA` with real data combining: (a) longitudinal PHQ-9 score entries from `usePhase3Data.decayPoints`, (b) session events — dosing session date as type `'dose'`, integration session form completions as type `'integration'`, safety check completions as type `'safety'`
- **Description:** "Your patient's symptom score over time, with key clinical events marked on the same timeline. Hover any point for details."
- **Unlocks when:** `hasRealDecayData === true`
- **Empty state:** Panel renders with empty chart area + message: "Complete a Longitudinal Assessment to see the journey timeline."

#### Panel E — Symptom Decay Curve (6-month view)
- **Component:** `src/components/arc-of-care/SymptomDecayCurve.tsx` (this is the superior version — replaces the `SymptomDecayCurveChart.tsx` currently used in `IntegrationPhase.tsx`)
- **Wire to:** `usePhase3Data.decayPoints` and `usePhase3Data.baselinePhq9`
- **Description:** "PHQ-9 symptom severity tracked over 6 months post-session, with severity zones and the critical 14-day afterglow window highlighted."
- **Unlocks when:** `hasRealDecayData === true`
- **Empty state:** "Complete a Longitudinal Assessment to unlock Symptom Decay tracking."

#### Panel F — Trajectory vs. Network Cohort
- **Component:** `src/components/analytics/ConfidenceCone.tsx`
- **Wire to:** Replace `MOCK_TRAJECTORY_DATA` with `usePhase3Data.decayPoints` for the patient line. The community benchmark band may remain as the current reference data (to be confirmed by LEAD — if fully static it must be badged as `DEMO DATA`).
- **Description:** "How this patient's recovery compares to similar patients across the PPN network. Gray band = typical range."
- **Unlocks when:** `hasRealDecayData === true`
- **Empty state:** "Complete a Longitudinal Assessment to compare against the network cohort."

#### Panel G — Daily Pulse 7-Day Trend (KEEP — existing)
- **Keep as-is** but fix the `patientId` hardcode bug (see Bug Fixes below).
- Add tooltip: "Patient's self-reported connection and sleep quality over the past 7 days."
- **Unlocks when:** `hasRealPulseData === true`
- **Empty state:** "Log a Daily Pulse check-in to see the 7-day trend."

#### Panel H — Compliance (KEEP — existing)
- **Keep as-is.** Always visible — 0% is an honest and actionable signal.
- Add low-compliance alert: if `pulseCheckCompliance < 60`, render an amber inline notice: `"Low check-in compliance — consider proactive outreach."`
- Add tooltip per bar explaining what each metric measures.

#### Panel I — Neuroplasticity Window Badge (KEEP — existing)
- **Keep as-is.** Always visible.
- Update closed-state copy: change "Integration window has passed" → "Standard integration protocols apply — window is closed."

---

### 4. Progress Summary CTA — Wire to NarrativeViewer
- **Current state:** "Generate Patient Progress Summary" button opens nothing meaningful.
- **Target:** Wire to `src/components/narrative/NarrativeViewer.tsx`. Generate a `GeneratedNarrative` object from available Phase 3 data: current PHQ-9, % improvement from baseline, integration sessions attended, neuroplasticity window status, and any risk flags. Display in the existing `NarrativeViewer` slide-out pattern.
- LEAD to confirm if this should be a slide-out panel or modal.

---

### 5. Bug Fixes (required in this same ticket)

**Bug A — Daily Pulse patientId hardcode:**
In `IntegrationPhase.tsx`, `PulseCheckWidget` is rendered with `patientId="patient-001"` and a potentially incorrect `sessionId`. Fix to:
```tsx
<PulseCheckWidget
  patientId={journey.patientId}
  sessionId={journey.session?.sessionId ?? journey.sessionId}
/>
```

**Bug B — Bottom Static Status Bar (WO-527 carry-over):**
Confirm whether the 3-column static bottom container was removed from Phase 3 by the WO-527 builder pass. If it still exists in `IntegrationPhase.tsx`, remove it now.

---

## Out of Scope

- Patient-facing check-in app (noted for future version backlog)
- `PatientFlowSankey` — clinic-level analytics, does not belong in single-patient Phase 3 view
- Any changes to Phase 1 or Phase 2 forms or their data models
- `QTIntervalTracker` conditional display (covered by WO-534)
- Any changes to the Discharge Summary CTA (keep as-is)
- Music logger or wearable HRV/sleep integrations (PPN Deck vision — future roadmap)
- Database schema changes — all data already exists in `log_longitudinal_assessments`, `log_daily_pulse`, `log_integration_sessions`, `log_clinical_records`, `log_baseline_assessments`

---

## LEAD Decisions (Pre-authorized for BUILDER)

**Q1 — ConfidenceCone benchmark band: real or static?**
Static. `MOCK_TRAJECTORY_DATA` is hardcoded in `src/constants/analyticsData.ts`. BUILDER must render `<DemoDataBadge isDemo={true} />` on this panel. Label it "Compared to reference cohort (N=14k published data)" — do not call it "PPN network" until live aggregate data is wired.

**Q2 — NarrativeViewer for Progress Summary: slide-out or modal?**
Modal. The existing `PatientProgressSummary` already opens as a modal (IntegrationPhase.tsx lines 352–357). Wire `NarrativeViewer` inside the same modal wrapper. Do not build a new slide-out panel. Remove the `Section 4` note referencing "slide-out" from this spec.

**Q3 — ACE score source for PredictedIntegrationNeeds:**
ACE score is stored in `log_baseline_assessments` as `ace_score` (confirmed: `src/services/clinicalLog.ts` line 19). Add it to the existing `log_baseline_assessments` query inside `usePhase3Data`'s `fetchAll`. If absent (older sessions), default `aceScore` to `0` — the algorithm degrades gracefully to Low Risk.

**Q4 — Time horizon sections: collapsible or always expanded?**
Always expanded. No collapsing needed at this stage.

**Additional LEAD Architecture Notes for BUILDER:**
- Primary file: `src/components/wellness-journey/IntegrationPhase.tsx` — this is the only file that needs significant restructuring.
- `WellnessJourney.tsx` passes the `journey` prop — do not change the interface.
- `PatientOutcomePanel` import (line 6) can be fully removed once replaced by `PatientJourneySnapshot` + `ConfidenceCone`.
- `SymptomDecayCurve` from `arc-of-care/` is already imported (line 4) and wired — keep it, just reposition it in the layout.
- `usePhase3Data` hook needs one addition: fetch `ace_score` from `log_baseline_assessments` (already queried at line 136 in that hook — just add `ace_score` to the select).
- Session Snapshot strip reads `assessmentScores` from Phase 2 — these are stored in `localStorage` as set in `DosingSessionPhase.tsx` line 382: `setAssessmentScores(scores)`. BUILDER must read them from localStorage key `ppn_assessment_scores_${sessionId}` or equivalent. Verify the actual key by checking `DosingSessionPhase.tsx` before implementing.
- All new panels must use `<DemoDataBadge isDemo={!hasRealXxxData} />`. No exceptions.
- Two-Strike Rule applies.

---

## Acceptance Criteria

- [ ] Session Snapshot Strip visible at top of Phase 3 with Phase 2 data (or graceful "Not recorded" state)
- [ ] Phase 3 action cards render in two time horizons with correct teal palette, matching Phase 1 card anatomy
- [ ] Day 0–3 cards visually archive (dim + "Completed Window" label) when `daysPostSession > 3`
- [ ] MEQ-30 card only appears if Phase 2 closeout assessment was not completed
- [ ] `PredictedIntegrationNeeds` renders with real Phase 1 baseline data
- [ ] `ProgressRiskFlags` appears only when ≥2 longitudinal assessments exist with a declining trend
- [ ] `SafetyTimeline` is collapsible and wired to real session adverse event data
- [ ] `PatientJourneySnapshot` replaces current outcome chart — wired to real decay + event data
- [ ] `SymptomDecayCurve` (arc-of-care version) replaces `SymptomDecayCurveChart` — wired to real decay data
- [ ] `ConfidenceCone` replaces `PatientOutcomePanel` chart — static benchmark band carries DemoDataBadge if not live
- [ ] All panels show honest empty states when data is absent — no fake/mock data rendered silently
- [ ] All panels have a one-line description and `AdvancedTooltip` explaining how to read them
- [ ] Daily Pulse `patientId` bug fixed — widget writes to correct patient record
- [ ] Low-compliance alert appears on Compliance section when pulse compliance < 60%
- [ ] Neuroplasticity Window Badge closed-state copy updated
- [ ] Progress Summary CTA wired to `NarrativeViewer`
- [ ] Bottom static status bar removed if still present (WO-527 carry-over)
- [ ] Zero regressions in Phase 1 and Phase 2
- [ ] WCAG 2.1 AA maintained throughout
- [ ] All `DemoDataBadge` indicators present on any panel still using mock data
