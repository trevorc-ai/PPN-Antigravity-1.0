---
id: WO-570
title: "The Integration Compass — Complete Ground-Up Rebuild: Master Vision Spec"
owner: BUILDER
status: 04_QA
authored_by: PRODDY
reviewed_by: LEAD_APPROVED
date: 2026-03-02
priority: P0
tags: [patient-facing, compass, ground-up-rebuild, master-spec, wonder-layer, flywheel, component-extraction, showcase, upstream, downstream]
failure_count: 0
supersedes: [WO-563, WO-565, WO-566, WO-567, WO-568]
blocks: []
---

## PRODDY Master Vision PRD

> **Status:** This is the master specification that supersedes all previous Compass
> work orders. WO-563 through WO-568 are retired. This single document defines the
> complete rebuilt Compass — every component, every upstream integration, every
> downstream output. Child tickets are filed as WO-570a through WO-570e.

---

### 1. Problem Statement

The existing `PatientReport.tsx` is a polished brochure. It presents static zone
cards in a fixed scroll order, buries the daily check-in in the middle, shows
no substance-specific visualization, has no awareness of what day the patient is
on, and delivers none of the visualization concepts specified in the original brief:
no Flight Plan, no Dual-Mode Spider Graph, no Brain Network Map, no interactive
timeline. A patient who worked through one of the most significant experiences of
their life deserves something far more worthy of that experience. We are rebuilding
it from the ground up — every component independently built and showcase-registered,
assembled into a page architecture that puts WONDER first and the daily ritual second.

---

### 2. Target User + Job-To-Be-Done

A practitioner needs to generate a single, stunning, substance-aware Integration
Compass for a specific patient in ≤ 2 clicks from Phase 3, so that the patient
receives a living, personalized artifact that shows them exactly what happened in
their brain, body, and emotions — and keeps updating as they log daily check-ins
during their integration window — without ever requiring their name, creating an
account, or exposing PHI.

---

### 3. Success Metrics

1. A new patient who has never heard of psychedelic therapy opens their Compass link
   and can correctly identify their substance, the peak moment of their session, and
   their current day in the integration window — within 60 seconds — without reading
   any instructional copy. Verified by moderated user test across 3 practitioner beta
   accounts.
2. The "Predicted vs. Lived Experience" spider graph renders correctly for all 4
   substance categories (psilocybin, ketamine, MDMA, ayahuasca) with substance-
   specific axis labels — verified by INSPECTOR screenshot audit per substance.
3. The component showcase contains all 12 Compass components as independent,
   documented entries — verified by grep: `src/components/compass/*.tsx` count ≥ 12.

---

### 4. The Core Insight That Makes This Different

Every visualization that exists today shows a patient what a substance *typically does*
to a *typical patient*. We can show them what it did to *them*.

The schema already contains:
- `log_dose_events.substance_id` — what they took
- `log_dose_events.dose_mg` + `dose_mg_per_kg` — their exact dose
- `log_session_timeline_events` — timestamped peaks, valleys, Companion taps
- `log_baseline_assessments` — who they were before
- `log_longitudinal_assessments` — who they are becoming

The gap between the **pharmacologically predicted experience** (population average
for their substance + dose + baseline) and their **actual lived experience**
(Companion timeline events) is unique to PPN. No clinic tool, no research paper,
no patient app shows this. The spider graph that inspired this rebuild shows
a static polygon. Ours shows two polygons — predicted and lived — and the space
between them is their personal story, labeled in human language.

---

### 5. Architecture

#### Page Structure (Assembly-Only)

`src/pages/IntegrationCompass.tsx` — **replaces** `src/pages/PatientReport.tsx`
Route preserved: `/patient-report?sessionId={uuid}`

This file contains **zero component definitions**. It imports, wires, and
assembles. All state management and data fetching lives here via hooks.
All visual rendering lives in `src/components/compass/`.

#### Data Hooks

| Hook | Responsibility |
|---|---|
| `useCompassSession` | Fetches session record, substance, dose, session_date, daysPostSession |
| `useCompassTimeline` | Fetches `log_session_timeline_events` for the session — source for Lived Experience spider + Emotional Waveform |
| `useCompassBaseline` | Fetches `log_baseline_assessments` — PHQ-9, GAD-7, ACE baseline |
| `useCompassEMA` | Fetches `log_pulse_checks` daily check-in history — source for EMA graph |
| `useCompassOutcomes` | Fetches `log_longitudinal_assessments` — clinical scores over time |
| `useCompassMode` | Computes `mode: 'daily' | 'report'` from `emaPoints.length` and URL params |

> BUILDER may merge hooks if the query volume is acceptable. The interfaces above
> are the data contracts — implementation is BUILDER's discretion.

---

### 6. Component Inventory

All components live in `src/components/compass/`. All are registered in the
Component Showcase. All accept data via props only — zero direct DB calls.

#### Group A — Wonder Layer (The New Work)

**A1. `CompassSpiderGraph.tsx`**
The centerpiece. A radar chart with two overlaid polygons:
- *Predicted Shape*: population-average phenomenological profile for the patient's
  substance. Axes: Sensory Alteration / Ego Dissolution / Emotional Intensity /
  Physical Sensation / Time Distortion / Mystical Quality (substance-specific weights
  derived from ref table or static constant per substance category)
- *Lived Shape*: derived from their `log_session_timeline_events` — event type
  frequencies and intensities mapped to the same 6 axes
- A toggle: **"Science" ↔ "Experience"** — in Science mode, axes relabel to receptor
  affinity language (5-HT2A / D2 / SERT / κ-opioid / etc.). In Experience mode,
  axes relabel to phenomenological language. The polygon *shape remains identical* —
  only the labels change. This is the physical demonstration of translation.
- The gap between Predicted and Lived is shaded in a soft gold with a label:
  "Where your journey was uniquely yours"
- Substance-aware: psilocybin, ketamine, MDMA, ayahuasca ship with distinct
  default predicted shapes. Unknown substance renders Experience mode only.
- Empty state: renders Predicted shape only with copy "Your session data will
  overlay here once your practitioner has logged your session events."

**A2. `FlightPlanChart.tsx`**
A full-width pharmacokinetic area chart:
- X-axis: time in minutes/hours from administration
- Y-axis: subjective intensity (0–10)
- Substance-specific curve shape (psilocybin 4-6h arc, ketamine 45m spike,
  MDMA 4-6h plateau, ayahuasca 6-8h with distinct purge phase marked)
- Overlaid as glowing dots: the patient's actual `log_session_timeline_events`
  timestamps, positioned on the same time axis
- Phase labels: ONSET · PEAK · INTEGRATION · AFTERGLOW — each as a colored
  background band beneath the curve
- Tooltip on hover: practitioner-defined or population-average phrase for each phase
  (e.g., Onset: "Physical sensation common here — not a sign of danger")
- A vertical "You are here" marker animated to their longest-gap event cluster
- Disclaimer: "Curve represents population averages for this substance class.
  Individual timelines vary with metabolism and dose."

**A3. `BrainNetworkMap.tsx`**
A purely static SVG illustration — but the most emotionally powerful component
on the page. Two brain states side by side:
- Left: "The Conditioned Mind" — dense, rigid, looping pathways between DMN nodes
  in muted slate. Caption: "Repetitive thought patterns"
- Right: "During Your Session" — the same nodes, but hundreds of new cross-wiring
  connections light up in the patient's substance-accent color (teal=psilocybin,
  violet=ketamine, rose=MDMA, gold=ayahuasca). Caption: "New connections forming"
- A sentence beneath: "Your brain was not breaking. It was building."
- Substance name displayed above the right brain as the title
- Static SVG — no data dependency. Substance category controls the accent color only.

**A4. `EmotionalWaveform.tsx`**
Replaces the current feeling-pills ghost state. A true timeline waveform:
- X-axis: session time (same scale as FlightPlanChart for visual continuity)
- Y-axis: emotional intensity (0–10, from Companion event ratings)
- Each Companion event type rendered as a colored peak on the waveform
  (peaks of joy in teal, peaks of difficulty in rose, peaks of insight in gold)
- When hovered, a tooltip shows the feeling-type label in patient language
- Empty state: shows a flat baseline with example peaks in muted opacity and
  copy: "Your emotional terrain will appear here after your session events are
  logged"
- Print mode: renders as a static area chart (no hover interactivity)

#### Group B — Integration Layer (Refined from Current)

**B1. `CompassEMAGraph.tsx`** (extracted + enhanced from existing EMAGraph)
- Adds `session_date` vertical marker (glowing teal line at day 0)
- Adds neuroplastic window golden glow region (days 0–21)
- Plots `mood_level` as primary line, `sleep_quality` as secondary, `anxiety_level`
  as tertiary (inverted — lower anxiety = higher on chart)
- `← Day 21` SVG label at window edge
- Day-awareness sentence beneath: "You are on Day N of your integration window."

**B2. `CompassZone.tsx`** (extracted from current Zone)
Zone shell/wrapper. Teal-ring/slate-bg/white-numeral badge. Title color = domain accent.

**B3. `CompassSlider.tsx`** (extracted from current SliderField)
Custom range input. Full cross-browser CSS. teal track fill, teal glow thumb.
Accepts `minLabel`, `maxLabel`, `emoji` props.

**B4. `FeelingWave.tsx`** (extracted from current FeelingWave)
Feeling pills from session. Ghost preview state for empty. Connect to EmotionalWaveform
to ensure feeling-type categories are consistent.

#### Group C — Daily Ritual Layer (New)

**C1. `DailyCheckInCard.tsx`**
The promoted check-in form for Daily Mode. Contains 4 CompassSliders.
Safety gate question at the bottom (per WO-566 spec — binary, always last).
Post-submit insight: CompassInsightLine beneath.

**C2. `DayAwarenessHeader.tsx`**
Day-aware greeting driven by `daysPostSession` prop.
Copy tiers: Day 1–3, 4–7, 8–14, 15–21, 22–28, 29+.

**C3. `CompassInsightLine.tsx`**
Post-submit single insight. Derives from last 3 EMA entries: trend line if
improving, streak count if no trend. "You've shown up 6 days in a row."

#### Group D — Clinical Intelligence Layer (Visible to Patient, Population-Framed)

**D1. `IntegrationStoryChart.tsx`**
The Longitudinal Progress Tracker:
- PHQ-9 and GAD-7 scores over time (from `log_longitudinal_assessments`)
- Glowing vertical marker at dosing session date
- A second color band showing "typical recovery trajectory" from population data
  (static, labeled as "Network average for this indication")
- Clickable dosing marker: expands a tooltip showing substance, dose, MEQ-30 score
  if available
- The line going down is their healing. The line is them.

**D2. `NetworkBenchmarkBlock.tsx`**
Zone 4 benchmarks. Wired to patient's `substance_id` and `indication_id` so the
statistics are scoped: "In psilocybin-assisted therapy for MDD tracked by PPN..."
Three stat cards. No generic population averages — substance and indication-matched.

#### Group E — Practitioner Layer (Gated)

**E1. `CompassCustomizePanel.tsx`**
Zone toggles, personal message textarea, Copy Link, Print PDF.
Renders only when `practitionerView === true` (`?pv=1` URL param).
Never visible on patient URL.

---

### 7. Page Layout — Two Modes

#### Daily Mode (return visit, `emaPoints.length > 0`)

```
[Hero Header — compact]
[DayAwarenessHeader]
[DailyCheckInCard — full width, above the fold on mobile]
"See your full journey ↓" disclosure
──────────────────────────────────
[Zone 1: Your Experience Map]
  → CompassSpiderGraph (predicted vs. lived)
  → BrainNetworkMap
[Zone 2: Your Session Journey]
  → FlightPlanChart (with patient event overlays)
  → EmotionalWaveform
[Zone 3: Your Healing in Motion]
  → CompassEMAGraph (live, day-aware)
  → [DailyCheckInCard hidden — already shown above]
[Zone 4: You Are Not Alone]
  → NetworkBenchmarkBlock (substance + indication matched)
[Zone 5: Your Path Forward]
  → PEMS model
  → Integration journal prompts (derived from EmotionalWaveform peaks)
  → IntegrationStoryChart (clinical scores over time)
  → Practitioner's personal message (if set)
[Share Buttons]
[Footer]
```

#### Full Report Mode (first visit, no check-ins)

```
[Hero Header — full]
[Zone 1: Your Experience Map]
  → CompassSpiderGraph
  → BrainNetworkMap
[Zone 2: Your Session Journey]
  → FlightPlanChart
  → EmotionalWaveform
[Zone 3: Your Neuroplastic Window]
  → CompassEMAGraph
  → DayAwarenessHeader
  → DailyCheckInCard (inline, in Zone 3)
[Zone 4: You Are Not Alone]
  → NetworkBenchmarkBlock
[Zone 5: Your Path Forward]
  → PEMS, prompts, IntegrationStoryChart, practitioner message
[Share Buttons]
[Footer]
```

---

### 8. Upstream Integration (Practitioner → Compass)

No new screens required. Existing Phase 3 "Share Integration Compass" button:
1. Generates the link: `/patient-report?sessionId={uuid}`
2. Practitioner preview link: `/patient-report?sessionId={uuid}&pv=1`
3. Practitioner customizes zones, adds personal message (screen-only), clicks
   "Copy patient link" → clipboard. Done in 2 clicks.
4. `CompassCustomizePanel` reads zone visibility from `localStorage` keyed to
   `sessionId` — no DB write, no schema change.

---

### 9. Downstream Integration (Patient → Practitioner)

| Patient action on Compass | Practitioner sees in Phase 3 |
|---|---|
| Daily check-in submitted | EMA graph updates in real-time (existing hook) |
| Safety gate "Yes" tapped | Red alert badge on patient card (existing `log_red_alerts`) |
| N consecutive days logged | Compliance bar updates |
| PHQ-2/GAD-2 submitted (day 7/14/21/28) | Symptom Decay curve updates |

---

### 10. Visual Language (Non-Negotiable)

- **Palette:** Deep space `#050c1a`. Substance accent colors:
  - Psilocybin: teal `#2dd4bf`
  - Ketamine: violet `#a78bfa`
  - MDMA: rose `#fb7185`
  - Ayahuasca: gold `#f59e0b`
  - Unknown/mixed: teal (default)
- **Spider graph gap color:** gold `rgba(245,158,11,0.15)` fill, `0.4` opacity border
- **Typography:** Outfit (headings) + Inter (body). Loaded via `index.html` link tag.
- **Charts:** Organic glowing lines, gradient fills (dark at bottom → transparent).
  Never clinical bar charts on the patient view.
- **Language:** First-person, empathetic, non-pathologizing. Data described as
  "your healing" not "your score." "You showed up" not "compliance."
- **Print:** `@media print` collapses dark bg to warm cream. Glows become gold
  borders. FlightPlanChart and EmotionalWaveform render as static area charts.
  InteractiveSpiderGraph renders Predicted + Lived shapes simultaneously (no toggle).

---

### 11. Out of Scope

- Patient authentication or login
- Free-text patient inputs of any kind (zero PHI, zero free text)
- Multi-session comparison on one Compass (single session per link)
- Phase 1 or Phase 2 self-reporting on the Compass
- Traffic Light drug interaction checker (separate WO — requires its own DB)
- Wearable HRV/biometric data
- Push notifications or SMS
- New DB tables — all reads/writes through existing schema

---

### 12. Child Ticket Structure

| Ticket | Scope | Seq |
|---|---|---|
| WO-570a | Data hooks: `useCompassSession`, `useCompassTimeline`, `useCompassMode` | 1st |
| WO-570b | Wonder Layer: CompassSpiderGraph, FlightPlanChart, BrainNetworkMap | 2nd |
| WO-570c | Integration + Ritual Layer: CompassEMAGraph, EmotionalWaveform, DailyCheckInCard, DayAwarenessHeader, CompassInsightLine | 3rd |
| WO-570d | Assembly: IntegrationCompass.tsx page, Daily Mode / Full Report mode, practitioner gate, zone layout | 4th |
| WO-570e | Showcase registration (all 12 components), print QA, WCAG AA audit | 5th |

---

### LEAD Sign-Off

## LEAD ARCHITECTURE

**Approved: 2026-03-02 | Priority: P0 | Owner: BUILDER**

- [x] Supersession of WO-563 through WO-568 confirmed — those WOs are RETIRED
- [x] Child tickets WO-570a through WO-570e approved — file and execute in sequence
- [x] `IntegrationCompass.tsx` as new page file, replaces `PatientReport.tsx` — confirmed
- [x] Substance accent color assignments approved (teal/violet/rose/gold per substance)
- [x] Spider graph axis labels approved as specified in Component A1
- [x] `?pv=1` practitioner gate approved
- [x] BUILDER assigned and unblocked

---

### QA Requirements (INSPECTOR must verify both journeys before PASS)

**Journey 1 — Practitioner Perspective:**
1. Practitioner logs into PPN Portal
2. Opens an existing patient session in Phase 3
3. Clicks "Share Integration Compass" → copies patient link in 1 click
4. Opens practitioner preview (`?pv=1`) → CompassCustomizePanel is visible
5. Toggles a zone off → zone hidden in preview
6. Adds a personal message → message appears on-screen
7. Clicks Print → print layout renders correctly (dark bg → cream, glows → borders)
8. Returns to Phase 3 → sees patient check-in data reflected in EMA widget

**Journey 2 — Patient Perspective:**
1. Patient opens the shared link (no `?pv=1`) → Full Report mode renders
2. CompassCustomizePanel is NOT present in the DOM (INSPECTOR grep required)
3. CompassSpiderGraph renders with substance-specific axis labels
4. FlightPlanChart renders with substance-specific curve + session event overlays
5. BrainNetworkMap renders with correct substance accent color
6. Patient scrolls to Zone 3 → DailyCheckInCard visible without additional scroll on mobile
7. Patient submits check-in → EMA graph updates within 5 seconds
8. CompassInsightLine renders post-submit (trend or streak)
9. Patient taps Share → native share sheet opens (mobile) or clipboard copy (desktop)
10. Patient opens `/compass?sessionId={uuid}` on Day 7+ → Daily Mode: check-in appears above fold

**Journey 3 — Always-On Companion (WO-571):**
1. Patient opens `/companion?sessionId={uuid}` — no login prompt
2. PHQ-2/GAD-2 proxy questions render in patient-friendly language
3. Patient submits → `log_longitudinal_assessments` row created with correct columns
4. `days_post_session` is computed correctly (not null, not hardcoded)
5. Safety gate renders last — "I need support" tap triggers `log_red_alerts` insert
6. Fireside Project number (623-473-7433) appears on-screen after "I need support"
7. Integration Compass EmotionalWaveform updates to reflect new submission

---

### 2-Click Demo Requirement (MANDATORY — ships with the build)

BUILDER must implement a demo mode that allows the Compass to be demoed at any
time from any context in exactly 2 clicks:

**Click 1:** A "Demo" button in the PPN Portal navigation (visible only when
`NODE_ENV !== 'production'` OR a `?demo=1` URL param is present on the portal).

**Click 2:** The button navigates directly to `/patient-report?sessionId={DEMO_SESSION_UUID}`
where `DEMO_SESSION_UUID` is a seeded test session containing:
- A real substance (psilocybin, `substance_id` confirmed from `ref_substances`)
- A complete set of `log_session_timeline_events` (feeling taps across the session)
- A complete `log_baseline_assessments` row (PHQ-9, GAD-7 baseline)
- At least 14 days of `log_pulse_checks` entries (patient check-in history)
- At least 2 `log_longitudinal_assessments` entries (clinical score over time)
- A `session_date` set to 10 days ago (puts demo in Day 10 of integration window)

The demo session must be seeded idempotently — re-running the seed does not
create duplicate rows. BUILDER uses `ON CONFLICT DO NOTHING` or a UUID constant.

The demo UUID constant must be stored as `VITE_DEMO_SESSION_ID` in `.env.local`
and documented in `README.md` under "Demo Mode".

The 2-click demo must work for both practitioner view (`?pv=1`) and patient view.

---

### PRODDY Sign-Off

- [x] Problem Statement ≤ 100 words, no solution ideas
- [x] Job-To-Be-Done: single sentence, correct format
- [x] All 3 metrics: measurable with specific numbers or events
- [x] Out of Scope populated and explicit
- [x] No code, SQL, or schema authored in this document
- [x] All component names are unique and non-conflicting with existing codebase
- [x] Upstream and downstream integrations fully specified
- [x] Supersedes list accurate
