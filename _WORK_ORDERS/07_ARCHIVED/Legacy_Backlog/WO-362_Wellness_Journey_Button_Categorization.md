---
status: 03_BUILD
owner: BUILDER
failure_count: 0
---

# WO-362: Wellness Journey Button Categorization
## 1. USER INTENT
We need to categorize, color code, and place in separate sections the buttons on each phase of the wellness journey, grouped by their place in the workflow and separated by inputs and outputs (visualizations, metrics, exports.) For example, all of the actions the provider can do BEFORE a dosing session will be color-coded and grouped all in one place. All of the things the provider can do DURING the dosing session will be a different color and grouped together in a different place. And all of the things for the provider to do AFTER the dosing session will be another different color and grouped together in another different place.

Once we categorize every screen and every button and have organized them in a logical sequence, we can re-order and re-color the interface layout.

## 2. DESIGNER SPEC: BUTTON CATEGORIZATION MAP

### OVERALL COLOR SYSTEM PROPOSAL
- **Phase 1: Preparation (BEFORE DOSING)** -> Primary Color: **SKY BLUE (#0ea5e9)**
- **Phase 2: Dosing Session (DURING DOSING)** -> Primary Color: **FUCHSIA / PURPLE (#d946ef)**
- **Phase 3: Integration (AFTER DOSING)** -> Primary Color: **EMERALD GREEN (#10b981)**
- **Outputs & Exports (ALL PHASES)** -> Dark Slate (#334155) with matching accent border.
- **Primary Phase Transition Buttons** -> Always highly visible (Solid Blue -> Solid Fuchsia -> Solid Emerald).

---

### PHASE 1: PREPARATION (BEFORE DOSING)
**Workflow Context:** Pre-requisite data gathering, safety clearing, and protocol setting.

#### INPUTS (Forms & Actions) - grouped under a "Pre-requisite Actions" section
*Color Code:* **Blue/Slate outlines with Blue hovers (`border-blue-500` / `hover:bg-blue-500/10`)**
1. **Informed Consent** (Input Data)
2. **Baseline Assessments** (Input Data)
3. **Set & Setting Observations** (Input Data)
4. **Dosing Protocol Settings** (Input Data)
5. **Acknowledge Risk Override** (Action - *Color: Amber if manual override needed*)

#### OUTPUTS (Visualizations, Metrics, Exports) - grouped under "Risk & Profile Insights"
*Color Code:* Dark Slate backgrounds with specific alert colors for metrics
1. **Export Audit Report** (Export Button -> *Color: Slate gray with download icon*)
2. **AI Insights** (Visualization Toggle -> *Color: Blue text*)
3. *(Static Metrics)*: Baseline Profile, Forecast, Risk Eligibility Report.

#### WORKFLOW ADVANCEMENT
1. **Proceed to Phase 2 Dosing** (Transition Button -> *Color: Solid Emerald if unlocked, Slate if locked*)

---

### PHASE 2: DOSING SESSION (DURING DOSING)
**Workflow Context:** Live data capture, time-stamped clinical notes, rapid accessibility.

#### PRE-SESSION INPUTS
1. **Pre-Flight Checklist** (Input Form -> *Color: Blue outline*)

#### LIVE SESSION INPUTS (The Cockpit) - grouped under "Live Data Entry"
*Color Code:* **Fuchsia/Purple themes for active session actions**
1. **Log Vitals** (Input Button -> *Color: Solid Blue or Fuchsia depending on urgency*)
2. **Open Timeline Log** (Input Button)
3. **Quick Timeline Actions** (Dose Admin, Vital Check, Observation, Music, etc.) -> Each has their own micro-color but grouped together.
4. **End Session Timer** (Action -> *Color: Solid Red*)

#### LIVE SESSION OUTPUTS (Dashboard)
1. **Launch Companion Device** (Export/Broadcast Action -> *Color: Glowing Cyan*)
2. **Export Session Log** (Export Button -> *Color: Slate gray*)
3. *(Static Visuals)*: HUD Timer, Live Vitals Trend Chart, Live Timeline Stream.

#### POST-SESSION INPUTS & WORKFLOW ADVANCEMENT
1. **Post-Session Assessments (MEQ-30, etc.)** (Input Form -> *Color: Fuchsia/Purple outline*)
2. **Complete Phase 2 (Finish Session)** (Transition Button -> *Color: Solid Fuchsia/Purple*)

---

### PHASE 3: INTEGRATION (AFTER DOSING)
**Workflow Context:** Longitudinal tracking, assessing treatment durability, patient close-out.

#### INPUTS (Forms & Actions) - grouped under "Ongoing Monitoring"
*Color Code:* **Emerald Green outlines (`border-emerald-500`)**
1. **Log Integration Session Note** (Input Form)
2. **Log Follow-up Assessment** (Input Form)
3. **Log Behavioral Change** (Input Form)

#### OUTPUTS (Visualizations, Metrics, Exports) - grouped under "Patient Outcomes"
1. **Export Discharge Summary** (Export Button -> *Color: Slate/Emerald combination*)
2. **Export Final Report** (Export Button -> *Color: Slate*)
3. *(Static Visuals)*: Symptom Decay Curve, Patient Outcome Panel, Timeline Visualization, Compliance Metrics.

#### WORKFLOW ADVANCEMENT
1. **Discharge Patient / Mark Complete** (Transition Button -> *Color: Solid Emerald*)
