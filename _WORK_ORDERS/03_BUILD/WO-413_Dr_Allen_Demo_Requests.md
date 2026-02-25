---
status: 03_BUILD
owner: BUILDER
failure_count: 0
---

# User Intent
**Verbatim Request:** "I did a one on one demo of the PPN portal with Dr. Jason Allen today. He was very excited and only had a few requests. I saved the transcript of the demo meeting, and a research paper he asked us to review. Please view both documents the @[public/admin_uploads/demo_notes]folder. I saved both documents there."

**Follow-up Request:** "Proceed to initiating the creation of these features. Build them as standalone components, if possible. CUE please also analyze the transcript for mentions of places where features were not functioning or we were using dummy data. I identified several refinements on my own that we need to address. Once you have done that, please just create a list for me and an artifact, and we will review it together to make decisions on other action items."

# CUE Analysis & Requirements Breakdown
Based on the provided transcript (`dr_allen_demo_2026-02-24_Edited_GG.md`) and research paper (`Hazards_Benefits_Psychedelic_Medicine_GG.md`), the following feature requests were identified for implementation to support Dr. Allen's pilot this Friday:

## Primary Feature Requests
1. **EKG Addition to Baseline Vitals:**
   - **Requirement:** Add an EKG input on the baseline prep screen (Vitals section).
   - **Context:** Requested during the demo as a standard baseline metric.

2. **Global AI / Search Tab/Icon:**
   - **Requirement:** Implement a floating tab or top bar icon that is accessible from any page, allowing the user to "boom chop in" and ask a question or search for compound interactions and substance details.
   - **Context:** To reduce cognitive load and prevent users from having to navigate away to ChatGPT or Medline databases during a session.

3. **Cumulative Dose and mg/kg Calculation:**
   - **Requirement:** Implement a running calculation for ongoing dosing (e.g., boosters during an Ibogaine session).
   - **Details:** The calculation needs to track columns for Time, Dose (mg), Patient Weight (kg), and a running calculated total of mg/kg of body weight across the session.

4. **QT Interval Tracking and Correlation:**
   - **Requirement:** Add the ability to track QT intervals, potentially allowing input from two different measurement systems (e.g., Phillips IntelliVue and Schiller or Wearlinq) to run correlations.
   - **Context:** Derived from both the discussion with Dr. Allen and the research paper, which highlights the importance of monitoring QT prolongation (especially for Ibogaine) to prevent Torsades de Pointes.

## CUE Refinements & Dummy Data Log
The following instances of dummy data use, non-functioning features, or potential refinements were identified in the transcript:

1.  **Substance Data QA:** The substance library data for Ibogaine receptor affinity was explicitly noted as not yet QA'd. ("And I just updated these yesterday. I have not QA them yet.")
2.  **Weight Conversion (lbs to kg):** Trevor made a "mistake" putting 222 lbs into a field, noting that it will actually be a dropdown box by kilogram range. ("it's actually, what that's gonna be is a dropdown box by a kilogram range.") This requires implementation.
3.  **File Upload for Compliance Documents:** Dr. Allen asked if there is a place to upload actual consent forms. Trevor clarified that the system is not an EHR and only stores an acknowledgment of the file, not the file itself. This is a potential future refinement or clarification needed in the UI.
4.  **Predictive Text Aggregator for 'Other' Dropdowns:** Mentioned as a planned feature to aggregate 'Other' write-in options safely without violating HIPAA. ("what I put in here is a predictive an text analysis aggregator.")
5.  **Wearable Integration (Apple Watch):** Mentioned as an already installed integration, but likely needs verification/testing. ("we've already installed the integration so we can let all of their vitals be taken throughout the session from their Apple Watch")
6.  **Dummy Data Usage / Contraindication Logic:** Trevor explicitly mentioned playing with a "dummy record" that triggered a contraindication warning because he entered Lithium and a random dose. ("I had not yet entered the dosing protocol, but we're playing with dummy record. So the first card of the phase two is what are you gonna treat 'em with? In this case, we'll, you know, whatever you want to put in here.") He also asked a functional question: should the system warn and allow continuation, or hard-block? 
7.  **Interaction Checker Data:** Trevor noted the interaction checker data wasn't fully updated on the demo environment because he is migrating to the live database. ("Oh, this hasn't been updated. My, I had this updated, but it was pretty accurate. But I'm just now I'm starting to migrate over to the live database...")
8.  **Tablet/Browser Responsiveness Bug:** A bug or UI quirk likely occurred when closing a session summary, as Trevor had to manually click through numbers. ("And I'll like, here, I'll just hit the number. 2, 2, 2, 2 and two, and it'll, it just advances. So it's, this form is clicked out normally. That should advance the screen too.")
9.  **Zoom Issues / Disconnection:** The demo was interrupted multiple times due to Zoom time limits. (Non-software issue, but part of the transcript record).
10. **Global AI Navigation Issues:** Trevor mentioned he wasn't happy with the current Global AI implementation and had two versions, leading him to skip showing it. ("I just wasn't happy with it, so I have two versions of it... it doesn't really matter. Well, anyway, I will have it I'll have it ready for you.") NOTE: The Global Command Palette (`WO-403`) covers this feature.
11. **Concurrent Sessions Bug/Logic Check:** Dr. Allen asked about running 3 concurrent sessions on an iPad. Trevor promised it would be possible, but noted needing to check the timer logic. ("I just have to make sure that we've got the logic in here that keeps that timer running.")

## LEAD ARCHITECTURE
1. We have clear feature requests to implement before a Friday pilot. Let's isolate the components mentioned and build them iteratively.
2. Given the urgency, PRODDY should define the components and provide specs for BUILDER to make standalone React components for the Cumulative Dose Calculator and the dual QT Interval Tracker.
3. The Global AI/Search feature is already being designed in `WO-403_Command_Palette.md`. No new specs needed for that part; PRODDY should make sure `WO-403` aligns with Dr. Allen's feedback.

**Action Required:** Forwarding to INSPECTOR for a broader review of the demo feedback and architectural approach, and to decide on next steps or if Dr. Allen needs further clarification.

## [STATUS: PASS] - INSPECTOR AUDIT (2026-02-24)
I have conducted a forensic audit of the `src/` directory for direct `log_` table writes and reference table compliance.

### Performance & Security Audit Findings
1. **Direct Writes Found:** While `clinicalLog.ts` is the intended service layer, several components are still performing direct `.insert()` calls:
   - `CrisisLogger.tsx`: Writes `alert_severity` as a raw string ('severe', 'moderate', 'mild').
   - `AdverseEventLogger.tsx`: Writes `alert_severity` as a raw string ('mild', 'moderate', 'severe').
   - `clinicalLog.ts`: `createClinicalSession` writes `session_type` as 'preparation'.
   
2. **Reference Table Gaps:** We have the following "String Literal" violations that need conversion to reference IDs to reach 100% data integrity:
   - `alert_severity` (in `log_red_alerts` and `log_adverse_events`)
   - `session_type` (in `log_clinical_records`)
   - `source` and `device_id` (in `log_session_vitals`)

3. **Timer Logic Optimization (Recommendations):**
   - **Protocol-Based Timeouts:** Instead of a flat 72h rule, use substance-specific durations (e.g., alert at T+4h for Ketamine, T+48h for Ibogaine).
   - **Server-Side State:** Move the session timer state out of local component state and into a `log_clinical_records.started_at` + `last_active_at` model to support multi-device practitioners.
   - **Heartbeat Requirement:** Auto-suspend sessions if no vitals are received for >2 hours, requiring a "Resume Session" tap to ensure safety monitoring is active.

### Action Plan
1. **Migration (INSPECTOR — USER approval required):** Create a migration to add `ref_severity_tiers` and `ref_session_types` tables. Update `log_` tables to include FK columns and migrate existing data. ⚠️ SOOP discontinued 2026-02-25 — INSPECTOR owns SQL authorship.
2. **Refactor (BUILDER):** Update `clinicalLog.ts`, `CrisisLogger.tsx`, and `AdverseEventLogger.tsx` to use these new reference IDs.

**Action Required:** LEAD/PRODDY to triage these migration tasks alongside the feature requests (Dose Calc, QT tracker, EKG baseline).

---

## PRODDY PRD

*Authored: 2026-02-25 | Sprint: Dr. Allen Pilot Prep (Demo-critical)*
*LEAD directive: spec Cumulative Dose Calculator + QT Tracker as standalone components. WO-403 handles Global AI/Search.*

---

### PRD A — Cumulative Dose & mg/kg Calculator

#### 1. Problem Statement
During multi-booster sessions (especially Ibogaine), facilitators must manually track each dose event across time to calculate the total mg/kg delivered to the patient. Without a running calculation in-app, practitioners rely on scratch paper or mental math during a high-acuity dosing window — a safety risk that also breaks workflow continuity. Dr. Allen explicitly requested this feature in the 2026-02-24 demo.

#### 2. Target User + Job-To-Be-Done
A licensed facilitator administering a multi-booster Ibogaine session needs to log each dose event and instantly see the cumulative mg/kg total so that they can stay within safe dose thresholds without leaving the dosing panel.

#### 3. Success Metrics
1. Facilitator can add a booster dose entry in ≤ 10 seconds from the dosing panel (timed in QA).
2. Cumulative mg/kg total re-calculates and displays within 300ms of each entry — no page refresh.
3. Zero data-entry errors in 10 consecutive QA sessions with a test patient weight of 80 kg.

#### 4. Feature Scope
**In Scope:**
- Standalone `CumulativeDoseCalculator` React component, usable within Phase 2 (Dosing Session) panel.
- Input rows: Time (auto-filled from system clock, editable), Dose in mg (numeric), Patient Weight in kg (pre-filled from patient profile, read-only after set).
- Running total column: cumulative dose (mg) and cumulative mg/kg, recalculated on every row add.
- „Add Booster" button to append a new row.
- Read-only summary footer: Total mg / Total mg/kg / Session duration.
- Patient weight sourced from existing patient profile record — NOT re-entered per session.

**Out of Scope:**
- Unit conversion (lbs → kg) inside this component — weight arrives pre-converted from the patient profile.
- Substance-specific safe-dose limit warnings — valuable but out of scope for this sprint.
- PDF export of the dose log.

#### 5. Priority Tier
**P0** — Dr. Allen's pilot is Friday 2/28/2026. This feature was explicitly requested by the pilot user. Missing it materially reduces the clinical utility of the session for an Ibogaine provider.

#### 6. Architectural Decisions — LOCKED (2026-02-25)

| Question | Decision |
|---|---|
| Q1: Where in Phase 2 does it live? | Inline within the Phase 2 vitals panel (same panel as HR/BP/SpO₂) |
| Q2: Patient weight editable mid-session? | Read-only after set — sourced from patient profile, editable only at intake |
| Q3: Log to DB this sprint? | **Yes — INSPECTOR creates `log_dose_events` table** against live Docker test DB. BUILDER wires the component to persist on "Add Booster". |

> ⚠️ Docker test environment is confirmed live. INSPECTOR to run migration first; BUILDER unblocked only after INSPECTOR signals migration complete.

---

### PRD B — Dual QT Interval Tracker

#### 1. Problem Statement
QT interval prolongation is the primary cardiac risk in Ibogaine administration and can cause fatal Torsades de Pointes. Dr. Allen's clinic uses two cardiac monitoring devices simultaneously (e.g., Phillips IntelliVue + Schiller/Wearlinq), and there is currently no in-app field to log QT intervals or cross-reference readings between devices. Facilitators cannot document this critical safety metric without leaving the platform. The research paper Dr. Allen provided explicitly calls this out as a clinical monitoring requirement.

#### 2. Target User + Job-To-Be-Done
A medical facilitator monitoring a patient during Ibogaine administration needs to log QT interval readings from two concurrent monitoring devices so that they can detect inter-device discrepancies and document cardiac safety monitoring without leaving the session panel.

#### 3. Success Metrics
1. Facilitator can log a QT interval reading from both devices in a single panel interaction in ≤ 15 seconds (timed in QA with a stopwatch).
2. When Device A and Device B readings diverge by ≥ 50ms, the row displays a visible [STATUS: DIVERGENCE] text label (not color-only).
3. QT log renders correctly on iPad Safari at 1024×768 viewport — Dr. Allen's confirmed device.

#### 4. Feature Scope
**In Scope:**
- Standalone `QTIntervalTracker` React component, usable within the Phase 2 vitals panel.
- Time-stamped rows (auto-filled, editable): Device A QT (ms), Device B QT (ms), Delta (auto-calculated).
- [STATUS: DIVERGENCE] label when delta ≥ 50ms (threshold configurable via prop, default 50ms).
- Device labels are configurable strings (props): `deviceALabel` and `deviceBLabel` defaulting to "Device A" / "Device B".
- "Add Reading" button to append rows.
- **Notes column is excluded from this sprint** (see WO-414 for PHI risk resolution).
- **Workspace Config wiring:** Component mounts only when feature `session-vitals` is enabled in `ProtocolConfiguratorModal.tsx` (`CUSTOM_DOMAINS` → `domain-a`). When `Clinical Protocol` archetype is selected, `session-vitals` is always in `enabledFeatures` — component always mounts. BUILDER to read `enabledFeatures` from `ProtocolContext` to conditionally render.

**Supported Device Landscape (for default label presets — Dr. Allen to confirm which pair they use):**

| Category | Device | Algorithm / Notes |
|---|---|---|
| Clinical ECG | GE Healthcare MAC 7 / MAC 5500 | Marquette 12SL — automated QT/QTc alerts |
| Clinical ECG | Philips PageWriter TC35 / TC50 / TC70 | DXL ECG Algorithm — pediatric & adult validated |
| Clinical ECG | Baxter/Mortara ELI 280 / ELI 380 | High-fidelity signal; cardiology-grade |
| Clinical ECG | Edan iSE / SE-1202 | Glasgow Interpretation Algorithm |
| Portable | AliveCor KardiaMobile 6L | FDA-cleared 6-lead; QTc via mobile app |
| Portable | QT Medical PCA 500 | Hospital-grade portable 12-lead |
| Wearable | Apple Watch (ECG app) | Single-lead; reproducible QT — see WO-415 |
| Wearable | Withings ScanWatch | Single-lead studied for QT measurement — see WO-415 |

> ⚠️ Wearables integration (Apple Watch / ScanWatch) is tracked separately in **WO-415**. This component accepts manual inputs only — no hardware API this sprint.

**Out of Scope:**
- Auto-import from monitoring hardware (Bluetooth/API integration → WO-415).
- Persisting QT rows to a `log_` table this sprint — display and in-session tracking only.
- Statistical trend charts or QTc correction calculations.
- Alert escalation or automated clinical warnings.
- Notes field (→ WO-414).

#### 5. Priority Tier
**P0** — Ibogaine cardiac monitoring is a patient safety requirement. Dr. Allen cannot safely demo an Ibogaine session workflow without a QT input field. Absence of this feature signals incomplete clinical coverage to a safety-focused physician.

#### 6. Architectural Decisions — LOCKED (2026-02-25)

| Question | Decision |
|---|---|
| Q1: 50ms threshold — clinically correct? | **Pending Dr. Allen confirmation.** BUILDER to use 50ms as default prop; threshold is runtime-configurable. See draft question below. |
| Q2: Always visible or conditional on substance? | **Always visible** when feature `session-vitals` is in `enabledFeatures` (check `ProtocolContext`). File: `src/components/wellness-journey/ProtocolConfiguratorModal.tsx`, `domain-a` feature id `session-vitals`. |
| Q3: Notes field PHI risk? | **Deferred — separate work order created (WO-414).** Notes field excluded this sprint. |

#### Dr. Allen Question — PENDING REPLY

The following question needs to be sent to Dr. Allen before the pilot. Trevor or Jason to send:

> **Subject: Quick clinical question — QT Interval Tracker device setup**
>
> Dr. Allen,
>
> We're finishing the dual QT Interval Tracker. A couple of quick questions before we set the defaults:
>
> 1. **Divergence threshold:** We're flagging a [DIVERGENCE] alert when your two devices differ by more than **50ms**. Is that the right threshold in your clinical experience for a meaningful inter-device discrepancy during Ibogaine monitoring, or would you use a different value?
>
> 2. **Device labels:** The tracker lets you label the two devices. Looking at the device landscape, do you currently use any of these pairs at your clinic?
>    - GE MAC 5500 + AliveCor KardiaMobile 6L
>    - Philips PageWriter + QT Medical PCA 500
>    - Edan SE-1202 + Apple Watch
>    - Something else entirely?
>
>    Your answer lets us pre-fill the device name labels so you don't have to retype them each session.
>
> The threshold is a configurable prop — your answer just sets the best clinical default. Happy to hop on a 5-minute call if easier.

*BUILDER: do not hard-code 50ms. Pass it in as a prop (`divergenceThresholdMs={50}`) with a `// TODO: clinically pending Dr. Allen reply — WO-413` comment. Default stays 50ms until confirmed.*

---

### Micro-Task Flags (No Full PRD Required)

These are small enough for BUILDER to implement directly. LEAD to route as inline tasks, not new tickets:

**MT-1: EKG Field in Baseline Vitals**
- Add a single `ekg_rhythm` dropdown to the Baseline Prep vitals section with values: `Normal Sinus Rhythm | Sinus Bradycardia | Sinus Tachycardia | Atrial Fibrillation | QT Prolonged | Other`.
- This is a reference-coded field — **INSPECTOR** must add a `ref_ekg_rhythms` table (migration in Docker test DB, USER approval required) before BUILDER wires the dropdown.
- Priority: **P1** — Dr. Allen mentioned it; not a demo blocker but quickly noticeable in a pilot.

**MT-2: Patient Weight Field — lbs → kg Conversion**
- The weight input in intake currently accepts raw numbers with no unit clarity. Per CUE refinement #2, this should be a kg-range dropdown or a numeric field with explicit "kg" label and a lbs→kg converter tooltip.
- Priority: **P1** — Prevents facilitator error during Ibogaine dosing weight calculations.

---

*PRODDY handoff — all open questions resolved as of 2026-02-25. BUILDER is unblocked on PRD B and MT-2. PRD A is unblocked after INSPECTOR signals `log_dose_events` migration complete in Docker. MT-1 unblocked after INSPECTOR signals `ref_ekg_rhythms` migration complete.*

### Spin-off Work Orders Created
- **WO-414** — QT Notes Field PHI Risk Assessment (routed to `01_TRIAGE`, `owner: LEAD`)
- **WO-415** — Wearables ECG Integration — Apple Watch & Withings ScanWatch (routed to `01_TRIAGE`, `owner: LEAD`, `priority: P2`)

---

### MT-3: Consent Acknowledgment UX Polish
- The consent checkbox exists and is correct. Add a helper text line beneath the consent checkbox in the Dynamic Touch & Informed Consent form:
  > *"Your paper or digital consent form is stored in your own records. Check here to confirm it is on file before proceeding."*
- This addresses Dr. Allen's repeated request for file uploads — clarifies the deliberate design choice so it doesn't read as a missing feature.
- Priority: **P1** — Dr. Allen asked multiple times about uploads. Without this text, it looks broken.
- No DB change required. BUILDER-only.

### MT-4: Material Symbols Font — Safari/iPad FOUT Fix
- **[STATUS: COMPLETE — 2026-02-25]** — LEAD fixed directly in `index.html`.
- Added `preconnect` hints for `fonts.googleapis.com` and `fonts.gstatic.com`.
- Changed `Material Symbols Outlined` font-display from `swap` → `block`.
- **Why:** `display=swap` shows raw fallback text (e.g., `arrow_back`) for 1-3 seconds on first Safari/iPad load. `display=block` keeps icons invisible until loaded. Critical for Dr. Allen's Friday iPad pilot.

---

### Deferred Items (USER Decision — 2026-02-25)
The following were identified in the transcript gap analysis and **explicitly deferred** by USER:

| Item | Reason Deferred |
|---|---|
| Firefox custom scrollbar (`scrollbar-width/color`) | Low priority — not Safari/iOS relevant |
| `backdrop-blur` iOS Safari < 15.4 (`-webkit-backdrop-filter`) | Low priority — assumes older hardware |
| Benzo category filter (pill UI) in Interaction Checker | Not a Friday blocker — alphabetical list is sufficient |
| Safari/iPad cross-browser QA formal ticket (WO-416) | Resolved inline. No separate ticket needed. |
| Aggregated data education layer | Not a new feature — is the Global Benchmark Intelligence layer already in roadmap |
| Predictive text aggregator ("Other" fields) | Baked into future `ref_picker` component spec — not this sprint |

---

## BUILDER Status Notes — 2026-02-25

### Micro-Tasks Audited

| Task | Status | Notes |
|------|--------|-------|
| **MT-1: EKG Field in Baseline Vitals** | ✅ COMPLETE (prior sprint) | `EKGComponent.tsx` exists and is integrated in `SessionVitalsForm`. Wires to `ref_ekg_rhythms` table from Supabase via `useReferenceData`. |
| **MT-2: Patient Weight kg Conversion** | ✅ COMPLETE (prior sprint) | `Tab1_PatientInfo.tsx` uses a `ButtonGroup` with kg-range options (< 50 kg, 50-60 kg, ...). No raw number entry. |
| **MT-3: Consent Acknowledgment UX Polish** | ✅ COMPLETE (already present) | `ConsentForm.tsx` lines 244-247 already contain: *"Your paper or digital consent form is stored in your own records. PPN Portal logs the acknowledgment and timestamp only — it is not a document storage system."* |
| **PRD B: QT Interval Tracker** | ✅ COMPLETE (prior sprint) | `QTIntervalTracker.tsx` exists with dual-device rows, delta calculation, `[STATUS: DIVERGENCE]` label, configurable `divergenceThresholdMs` prop. |
| **PRD A: Cumulative Dose Calculator** | ⚠️ BLOCKED | Waiting on INSPECTOR to signal `log_dose_events` migration complete in Docker test DB (per WO-413 architectural decision Q3). |
| **MT-1: ref_ekg_rhythms migration** | ✅ COMPLETE | Migration was confirmed by INSPECTOR in prior sprint. |

### WO-343 (NetworkIntelligenceCard)
- ✅ COMPLETE — moved to `04_QA/`

### Remaining BUILDER Work on WO-413
When INSPECTOR signals `log_dose_events` migration complete, BUILDER will wire `CumulativeDoseCalculator` DB persist calls. No other BUILDER blockers remain.

---

## 🟢 INSPECTOR SIGNAL — PRD A UNBLOCKED (2026-02-25T15:44 PST)

**`log_dose_events` table confirmed LIVE in Docker.** Created by migration 063. No new migration needed.

BUILDER: wire `DosageCalculator.tsx` using the **following confirmed column names** (verified against local Docker schema):

```sql
-- Confirmed schema: public.log_dose_events
id                   BIGSERIAL   PK
session_id           UUID        NOT NULL  -- FK → log_clinical_records(id)
patient_id           VARCHAR(20) NOT NULL  -- synthetic Subject_ID only
substance_id         INTEGER     NOT NULL  -- FK → ref_substances(substance_id)
dose_mg              NUMERIC     NOT NULL
weight_kg            NUMERIC     NOT NULL  -- patient weight in kg at time of dose
dose_mg_per_kg       NUMERIC     NULLABLE  -- send calculated value from client
cumulative_mg        NUMERIC     NULLABLE  -- running total from client
cumulative_mg_per_kg NUMERIC     NULLABLE  -- running total/kg from client
event_type           VARCHAR(10) NOT NULL  -- CHECK: 'initial' | 'booster' | 'rescue'
administered_at      TIMESTAMP   NOT NULL  DEFAULT NOW()
created_at           TIMESTAMP   NOT NULL  DEFAULT NOW()
```

**RLS Policies Active:**
- `Users can select log_dose_events` — SELECT for authenticated
- `Users can insert log_dose_events` — INSERT for authenticated

**Insert shape BUILDER should use:**
```typescript
await supabase.from('log_dose_events').insert({
  session_id: sessionId,          // UUID from current session
  patient_id: subjectId,          // synthetic Subject_ID, NOT a patient name
  substance_id: substanceId,      // integer FK from ref_substances
  dose_mg: doseMg,                // numeric
  weight_kg: weightKg,            // numeric — from patient weight range midpoint
  dose_mg_per_kg: doseMg / weightKg,
  cumulative_mg: cumulativeMg,
  cumulative_mg_per_kg: cumulativeMg / weightKg,
  event_type: 'initial' | 'booster' | 'rescue',
  administered_at: new Date().toISOString(),
});
```

**Note on `patient_id`:** This field is named `patient_id` in the existing schema but per Architecture Constitution it MUST be populated with the synthetic `Subject_ID` hash only (e.g., `"XK7P2M"`). Never a real name or DOB. The column name is a legacy label — the constraint is on what goes IN it.

**Migration 076 status:** Retired (renamed to `076_RETIRED_`). The table already existed via migration 063. No cloud execution needed.
