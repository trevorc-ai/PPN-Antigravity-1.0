Phase 3 — Integration: After the psychedelic dosing session. 

Should It Show Phase 2 Data? Full Answer, Informed by PPN Vision + Practitioner Voice

The Answer: Yes — and the notebooks tell us exactly which Phase 2 data matters.
Both notebooks are in strong agreement. Here is what they say, translated into plain English, and applied directly to what we build.

The three things from Phase 2 that practitioners actually need in Phase 3

1. The "Trip Shape" — MEQ-30 and CEQ scores together
The PPN Deck is explicit: showing MEQ-30 alone is incomplete. What matters is the ratio between the MEQ-30 (how mystical/positive the experience was) and the CEQ (how challenging/difficult it was). A high CEQ score means the integration session needs to focus on resolving distress — somatic grounding, safety. A high MEQ means the patient is ready for meaning-making. Right now we show MEQ-30 in isolation. We need both, side by side, with clear labels explaining what they mean. This is the single most important Phase 2 data point for Phase 3.

2. Psychological Difficulty + Resolution Status
Did the patient exit the session in distress, or resolved? If unresolved, that patient needs a completely different integration approach than one who had a peaceful session. This is currently not surfaced at all in Phase 3. It needs to be visible at the top of the page — not buried, not optional.

3. Safety Events logged during Phase 2
Any adverse events from the dosing session must carry forward into Phase 3 visibility. If there was a blood pressure spike or a dissociative episode, the integration therapist needs to know without going back to Phase 2 to find it.

What does NOT need to come forward: Raw intra-session vitals (heart rate at T+45 minutes, etc.). Those are acute monitoring data — they do not change what happens in Phase 3.

What the Practitioner VoC notebook adds
Practitioners said three things that directly shape the design:

"Numbers without context are useless." Every chart needs a tooltip or one-line explanation. A practitioner shouldn't need training to understand what a chart means.
"We need both the score and the clinical note from that day." The integration dashboard should let a practitioner see a PHQ-9 score and the qualitative note from that same session — not just the number.
"Two views: one for pre-session review, one for showing the patient." The page needs a high-level summary view (for showing a patient their own progress) and a deeper clinical view (for the practitioner reviewing the case alone).
The Revised Recommended Structure for Phase 3
Taking everything together — the code audit, the PPN Deck, and the VoC — here is what Phase 3 should be:

🔴 Section 1 — Session Snapshot (read-only carry-forward from Phase 2, always visible at top)

A compact read-back strip showing what happened in the dosing session. Not editable. Just context.

Field	Source
Substance + Dose	Phase 2 dosing protocol
Session Duration	Phase 2 session timer
MEQ-30 + CEQ side by side	Post-session assessments from Phase 2 closeout
Psychological Difficulty + Resolution Status	Session observations form from Phase 2
Safety Events (count + severity)	Phase 2 adverse events log
🟢 Section 2 — Integration Action Cards (forms, top of page, teal, matching Phase 1 pattern)

Two time horizons, optional, each card opens a form in the slide-out panel:

Day 0–3:

Structured Safety Check
Daily Pulse Check (first one)
Days to Weeks:

Integration Session log
Behavioral Change Tracker
Longitudinal Assessment (PHQ-9/GAD-7 — this unlocks the charts)
MEQ-30 (if not done in Phase 2 closeout)
📊 Section 3 — Data Visualizations (below cards, honest empty states until data exists)

Chart	What it shows	Unlocks when
PHQ-9 Trajectory vs. Trial Benchmark	Patient's symptom score over time vs. clinical trial range	First Longitudinal Assessment filed
Session Experience (MEQ vs. CEQ)	Trip shape — mystical depth vs. challenge level, side by side	Phase 2 post-session assessments complete
Breakthrough Matrix	Difficulty score vs. outcome score — visual "no pain, no gain" test	Two or more sessions logged
Daily Pulse 7-Day Trend	Mood and sleep past 7 days	First Daily Pulse check-in
Compliance bars	Check-in rate, PHQ-9 rate, integration sessions attended	Always visible, honest 0% until data flows
Neuroplasticity Window badge	Real countdown from session date	Always visible
📄 Section 4 — Actions (bottom, unchanged)

Generate Patient Progress Summary
Generate Discharge Summary
Proposed Scope for WO-545
This is still one ticket, but now with a clearly expanded scope:

Add Session Snapshot strip at the very top (carries Phase 2 data forward)
Add Phase 3 action cards in two time horizons (matches Phase 1 visual pattern, teal palette)
Add MEQ + CEQ side-by-side panel (replaces the current MEQ-only bar chart)
Add honest empty states to all charts with one-line tooltips explaining each
Relocate all data visualizations below the action cards
Fix Daily Pulse patientId bug
Time-gate the Day 0–3 cards to visually archive after Day 3

===

Phase 3 — The Complete Plan, Updated with Existing Component Inventory
Important discovery: Three of the visualizations we just designed already exist.
The analytics/ folder contains components that were built for the Analytics page but are perfect matches for Phase 3's integration view. This changes the build cost significantly — these are not new components, they're existing ones that need to be moved, wired to patient-specific data, and given proper context.

Here is what exists and what it does:

Component	What It Does	Fit for Phase 3

PatientJourneySnapshot
A composed chart overlaying PHQ-9 symptom scores (line) with discrete events — Dosing, Integration Sessions, Safety Checks — plotted as icon dots on a timeline. Hoverable.	✅ This IS the "Patient Journey" visualization from the PPN Deck. It directly replaces the current PHQ-9-only trajectory chart and adds the event pins that show what caused each change.

ConfidenceCone
A patient trajectory line plotted against a community benchmark range (shaded confidence band) — currently wired to "N=14k" cohort data.	✅ This is more powerful than the current 

PatientOutcomePanel
 chart. It already has the benchmark ribbon concept, but with a proper confidence interval approach.

PatientFlowSankey
A flow diagram showing patient retention from Intake → Dosing → Integration, showing where patients drop off.	⚠️ Clinic-level, not patient-level. Belongs on the Analytics page or a future clinic operations dashboard — not on a single patient's Phase 3 view.
Revised Phase 3 Visualization Plan
Taking all sources together — the PPN Deck, practitioner VoC, code audit, and the existing analytics components — here is the final recommended set of visualizations for Phase 3:

Visual 1 — Session Snapshot Strip (new, compact, read-only) At the very top. Carries forward from Phase 2:

Substance + Dose
MEQ-30 + CEQ side by side (trip shape)
Psychological Difficulty + Resolution Status
Safety Events (count)
Visual 2 — Patient Journey (use existing 

PatientJourneySnapshot
) The composed chart showing the PHQ-9 line with event pins for Dosing, Integration Sessions, and Safety Checks. This is the most powerful single visualization on the page — it tells the whole story at a glance and directly matches the PPN Deck's "Patient Journey Snapshot" concept. Already built. Needs real data wiring.

Visual 3 — Predictive Trajectory vs. Cohort (use existing 

ConfidenceCone
) The patient's score plotted against the community benchmark band. Currently labeled "N=14k" — in Phase 3, this would be labeled "Compared to similar patients in the PPN network." Already built. Needs patient-specific data and a proper label.

Visual 4 — Daily Pulse 7-Day Trend (existing, keep) The bar chart showing connection and sleep scores for the past 7 days. Keep as-is, but fix the patientId bug.

Visual 5 — Compliance (existing, keep) Three bars: daily check-in rate, weekly PHQ-9 rate, integration sessions attended. Add a low-compliance alert (<60%).

What we are removing / not adding:

The current standalone SymptomDecayCurve (replaced by 

PatientJourneySnapshot
 which does this better and adds event context)
The current 

PatientOutcomePanel
 chart (replaced by 

ConfidenceCone
 which is a superior implementation)
MEQ-only bar chart on the right side (replaced by the MEQ+CEQ side-by-side in the Session Snapshot strip)

PatientFlowSankey
 — belongs on Analytics, not here
Final WO-545 Scope
WO-545 — Phase 3 Complete Restructure

Add Session Snapshot strip at top (Phase 2 carry-forward: substance, MEQ+CEQ, difficulty/resolution, safety events)
Add Phase 3 action cards in two time horizons — Day 0–3 and Days–Weeks (teal, matching Phase 1 pattern)
Replace current trajectory chart with 

PatientJourneySnapshot
 wired to this patient's session ID
Replace current 

PatientOutcomePanel
 chart with 

ConfidenceCone
 wired to this patient's data
Add honest empty states to all charts: "Complete a Longitudinal Assessment to unlock this chart"
Add one-line tooltips to every visualization explaining what it shows
Keep Daily Pulse trend and Compliance section — fix patientId bug
Time-gate Day 0–3 cards — dim and archive once past Day 3
Keep Neuroplasticity Window badge — it's correct and working
Keep Progress Summary + Discharge Summary CTAs at bottom — they're correct

==== PRODDY ====

Phase 3 — Final Component Inventory & Complete WO-545 Scope
This is the definitive answer. After scanning all 29 subfolders, here is every pre-built component that belongs in Phase 3, what it does, and whether it's a direct fit or needs adaptation:

Complete Component Inventory for Phase 3
Component	Folder	What It Does	Status

PatientJourneySnapshot
analytics/	PHQ-9 line chart with Dosing, Integration, Safety event dots on a shared timeline. Tooltip-rich.	✅ Use — replaces current outcome chart

ConfidenceCone
analytics/	Patient trajectory vs. community benchmark range (confidence band).	✅ Use — replaces current 

PatientOutcomePanel

SymptomDecayCurve
arc-of-care/	PHQ-9 over 180 days with severity color zones, "Afterglow Period" highlight, remission threshold, and interactive hover tooltips. This is more complete than the current implementation.	✅ Use — keep as the longitudinal view

PredictedIntegrationNeeds
arc-of-care/	Algorithm that takes ACE, GAD-7, PCL-5, and PHQ-9 scores and outputs: forecasted number of integration sessions needed, recommended frequency (weekly/biweekly/monthly), and a risk-stratified schedule with clinical rationale.	✅ Use — this is a Phase 3 action driver, not just a visualization

ProgressRiskFlags
risk/	Detects declining trends (PHQ-9, GAD-7, PCL-5 regressing 5%+ over 2+ consecutive check-ins) and surfaces risk mitigation strategies. Evidence-cited with tooltips.	✅ Use — this is the "low-compliance alert" PRODDY previously proposed, but more powerful

SafetyTimeline
safety/	Chronological list of all safety checks, color-coded by C-SSRS severity, with actions taken at each event. Exportable.	✅ Use — surfaces Phase 2 adverse events into Phase 3 view

NarrativeViewer
narrative/	Renders a structured clinical narrative (sections + completeness %) with copy/download/save actions.	✅ Use — this should back the "Patient Progress Summary" CTA that currently opens nothing meaningful
Not used in Phase 3:


PatientFlowSankey
 — clinic-level, not patient-level. Belongs on Analytics.
PHQ9SeverityZones, GAD7SeverityZones, PCL5SeverityZones — reference charts, useful in forms not the dashboard.
EKGComponent, QTIntervalTracker — Phase 2 / Ibogaine only (WO-534 handles this).
SessionMonitoringDashboard, RealTimeVitalsPanel — Phase 2 live session tools only.
Revised Phase 3 Page Layout (Final)
Top — Session Snapshot Strip (compact strip, always visible, Phase 2 carry-forward) Substance + Dose · MEQ-30 + CEQ side-by-side · Psychological Difficulty + Resolution Status · Safety Events count

Middle Top — Action Cards (teal, matches Phase 1 pattern) Day 0–3: Safety Check · Daily Pulse (first check-in) Days–Weeks: Integration Session · Longitudinal Assessment (PHQ-9/GAD-7) · Behavioral Tracker · MEQ-30 (if not done at Phase 2 closeout)

Middle — Intelligence Panel (unlocks as data flows in)

Panel	Component	Unlocks When
Forecasted Integration Plan	

PredictedIntegrationNeeds
Phase 1 baseline scores available
Declining Trend Alert	

ProgressRiskFlags
Two or more longitudinal assessments logged
Safety Event History	

SafetyTimeline
Any safety check completed
Patient Journey Timeline	

PatientJourneySnapshot
First longitudinal assessment logged
Symptom Decay (6-month)	

SymptomDecayCurve
First longitudinal assessment logged
Trajectory vs. Cohort	

ConfidenceCone
First longitudinal assessment logged
Daily Pulse 7-Day Trend	(existing)	First Daily Pulse check-in
Compliance	(existing)	Always visible
Neuroplasticity Window	(existing)	Always visible
Bottom — Actions Generate Patient Progress Summary (backed by 

NarrativeViewer
) · Generate Discharge Summary

WO-545 Final Scope
Session Snapshot Strip — compact Phase 2 carry-forward bar at top
Phase 3 Action Cards — two time horizon sections (Day 0–3, Days–Weeks), teal palette
Integrate 

PredictedIntegrationNeeds
 — wire to Phase 1 baseline scores (ACE, GAD-7, PHQ-9)
Integrate 

ProgressRiskFlags
 — wire to longitudinal assessment data from 

usePhase3Data
Integrate 

SafetyTimeline
 — wire to Phase 2 adverse events from session records
Replace current outcome chart with 

PatientJourneySnapshot
 — wire to patient session ID
Replace symptom decay with 

SymptomDecayCurve
 from arc-of-care/ — it's the better version
Replace 

PatientOutcomePanel
 chart with 

ConfidenceCone
 — wire to patient data
Wire 

NarrativeViewer
 to Progress Summary CTA — generate from available form data
Honest empty states on all panels — one-line explanation tooltip on each
Fix patientId bug in Daily Pulse widget
Time-gate Day 0–3 cards — archive once past Day 3
MEQ + CEQ side-by-side in Session Snapshot (replaces MEQ-only bar chart)

Filing WO-545 now.

Created
+228
-0
Now notify LEAD by moving the ticket to the correct queue per protocol — it's filed in 01_INTAKE and ready for LEAD's review and architectural decisions before BUILDER picks it up.


WO-545 is filed. ✅

Here's the handoff summary:

Ticket: 

WO-545_Phase3-Integration-Complete-Restructure.md

Item F — WO-534 (Phase 3 Visualizations) [P1 — needs USER decisions first]
Status: Cannot scope or implement until open questions are answered. The WO has 5 open questions for you:

Which Phase 3 visualizations should populate immediately after Phase 2 ends?
Should "Patient Journey Timeline" pre-populate with Phase 2 session events?
Should "Safety Event History" pull from Phase 2 log_safety_events immediately?
Is "Compliance" section data from a real table or placeholder?
Is "Forecasted Integration Plan" auto-generated or always manual?
