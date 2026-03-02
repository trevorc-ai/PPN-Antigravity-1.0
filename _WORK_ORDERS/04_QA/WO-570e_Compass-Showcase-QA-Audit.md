---
id: WO-570e
title: "Integration Compass — Showcase Registration, Print QA, WCAG Audit, Full Journey Test"
owner: INSPECTOR
status: 04_QA
authored_by: LEAD
parent: WO-570
sequence: 5
date: 2026-03-02
priority: P0
tags: [compass, showcase, qa, inspector, wcag, print, journey-test, demo]
failure_count: 0
depends_on: [WO-570a, WO-570b, WO-570c, WO-570d, WO-571]
blocks: []
---

## LEAD Architecture

Final ticket. INSPECTOR owns this. Two parts: (1) showcase registration by BUILDER,
(2) full journey QA by INSPECTOR from both practitioner and patient perspectives.
User requirement: "tested for full functionality from both the practitioner's
perspective and the patient's perspective."

---

### Part 1 — BUILDER: Showcase Registration

Register all 12 Compass components in `ComponentShowcase.tsx`.

| Component | Category in Showcase |
|---|---|
| `CompassSpiderGraph` | Compass — Wonder Layer |
| `FlightPlanChart` | Compass — Wonder Layer |
| `BrainNetworkMap` | Compass — Wonder Layer |
| `EmotionalWaveform` | Compass — Wonder Layer |
| `CompassEMAGraph` | Compass — Integration Layer |
| `CompassZone` | Compass — Shell |
| `CompassSlider` | Compass — Input |
| `FeelingWave` | Compass — Integration Layer |
| `DailyCheckInCard` | Compass — Daily Ritual |
| `DayAwarenessHeader` | Compass — Daily Ritual |
| `CompassInsightLine` | Compass — Daily Ritual |
| `NetworkBenchmarkBlock` | Compass — Intelligence |
| `IntegrationStoryChart` | Compass — Intelligence |

Each showcase entry must render the component with sample props (use `DEMO_COMPASS_DATA`
values). No component may render as a blank card in the showcase.

---

### Part 2 — INSPECTOR: Full Journey Test

#### Test Session Setup

INSPECTOR must verify using a real test session with:
- A real `sessionId` in Supabase (test practitioner account)
- At least 1 `log_pulse_checks` entry (to trigger Daily Mode)
- `log_dose_events` entry with `substance_id` set to psilocybin
- No PHI in any field

OR use `?demo=1` for all non-write verification steps.

---

#### Journey A: Practitioner Journey

| Step | Action | Expected Outcome | Pass/Fail |
|---|---|---|---|
| A1 | Open Phase 3 for a test session | "Preview Compass" button visible | |
| A2 | Click "Preview Compass" | Opens `/patient-report?demo=1` in new tab — 2 clicks total | |
| A3 | Verify demo mode | Gold "Demo Mode" banner visible at top | |
| A4 | Open Phase 3 "Share Compass" | Copies `/patient-report?sessionId={uuid}` to clipboard | |
| A5 | Open `/patient-report?sessionId={uuid}&pv=1` | `CompassCustomizePanel` visible | |
| A6 | Open `/patient-report?sessionId={uuid}` (no pv) | `CompassCustomizePanel` NOT in DOM | |
| A7 | Trigger print via panel | Print preview renders on warm cream bg, no dark colors | |

---

#### Journey B: Patient Journey — First Visit (Full Report Mode)

| Step | Action | Expected Outcome | Pass/Fail |
|---|---|---|---|
| B1 | Open `/patient-report?sessionId={uuid}` with 0 check-ins | Full Report Mode: Zone 1 visible immediately | |
| B2 | Verify CompassSpiderGraph | Predicted polygon + empty-state copy (no lived data) | |
| B3 | Verify FlightPlanChart | Correct substance curve, no patient event dots (no events) | |
| B4 | Verify BrainNetworkMap | Two brain states, correct accent color, correct copy | |
| B5 | Scroll to Zone 3 | DayAwarenessHeader + DailyCheckInCard visible inline | |
| B6 | Submit a check-in | Success state + CompassInsightLine appears | |
| B7 | Reload page | Now in Daily Mode (≥1 check-in) — check-in card above Zone 1 | |

---

#### Journey C: Patient Journey — Return Visit (Daily Mode)

| Step | Action | Expected Outcome | Pass/Fail |
|---|---|---|---|
| C1 | Open Compass with ≥1 prior check-ins | Daily Mode: DayAwarenessHeader + DailyCheckInCard above the fold | |
| C2 | Verify no scroll needed | Check-in card fully visible at 390×844 without scroll | |
| C3 | Verify day-aware copy | Copy matches correct tier for daysPostSession | |
| C4 | Submit check-in | `log_pulse_checks` row created — verify in Supabase | |
| C5 | Verify CompassInsightLine | One of 3 insight types renders after submit | |
| C6 | Click "See your full journey ↓" | Smooth scroll to Zone 1 | |
| C7 | Verify CompassEMAGraph | New data point visible on graph within 5s | |

---

#### Journey D: Safety Gate Test

| Step | Action | Expected Outcome | Pass/Fail |
|---|---|---|---|
| D1 | Open DailyCheckInCard | Safety gate question visible at bottom | |
| D2 | Tap "I need support" | Fireside Project number 623-473-7433 displayed immediately | |
| D3 | Verify `log_red_alerts` | New row exists with `alert_type: 'self_harm_flag'` | |
| D4 | Verify: patient NOT blocked | Can still scroll and access rest of Compass | |

---

#### Journey E: Demo Mode Test (2-Click Demo Requirement)

| Step | Action | Expected Outcome | Pass/Fail |
|---|---|---|---|
| E1 | From any authenticated practitioner view | Find "Preview Compass" button — 1 click | |
| E2 | Click button | Opens `/patient-report?demo=1` in new tab — gold banner visible | |
| E3 | Verify all components render | SpiderGraph, FlightPlan, BrainMap, EMAGraph, all zones | |
| E4 | Verify no Supabase calls | Network tab: zero requests to Supabase in demo mode | |
| E5 | Verify demo data is compelling | Spider graph shows predicted vs. lived gap, 12-day EMA trend showing improvement | |

---

#### Accessibility Audit

```bash
grep -rn 'text-\[1[01]px\]\|text-\[9px\]\|font-size.*[89]px' src/components/compass/
grep -rn '"[^"]*text-xs[^"]*"' src/components/compass/ --include="*.tsx" | wc -l
```
Both must return 0 results.

---

#### Zero-PHI Audit

- [ ] Load `/patient-report?sessionId={uuid}` and inspect all rendered text
- [ ] Confirm: no patient name, DOB, practitioner name, NPI number, or site name visible
- [ ] Confirm: Patient ID in footer shows only first 8 chars of UUID in uppercase

---

### Final INSPECTOR Approval Required For

- [ ] All 12 components registered in ComponentShowcase (Part 1)
- [ ] All Journey A steps pass (practitioner journey)
- [ ] All Journey B steps pass (first visit)
- [ ] All Journey C steps pass (return visit / Daily Mode)
- [ ] All Journey D steps pass (safety gate)
- [ ] All Journey E steps pass (2-click demo)
- [ ] Accessibility audit: zero violations
- [ ] Zero-PHI audit: clean
- [ ] `git log --oneline -1` shows `(HEAD -> main, origin/main)` — pushed ✅
- [ ] `PatientReport.tsx.deprecated` exists (old file not deleted)
