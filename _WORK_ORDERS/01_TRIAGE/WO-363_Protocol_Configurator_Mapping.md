---
status: 01_TRIAGE
owner: LEAD
failure_count: 0
---

# PROTOCOL CONFIGURATION & ARCHETYPE MAPPING

## 1. Overview
We need to categorize every existing input (form) and output (widget) into specific "Archetypes". By doing this, the `ProtocolConfigurator` modal does the heavy lifting of UI customisation automatically, providing three simple paths for the user.

## 2. Archetype Definitions

### A. The Clinical / Medical Protocol (Strict)
*Use Case:* Ketamine clinics, highly regulated trials, strict legal frameworks.
*Key Characteristic:* Zero tolerance for missing vitals or baseline metrics. Emphasizes patient safety and numerical evidence.
* **Phase 1 (Prep):**
  * IN: Consent, Mental Health Screening (PHQ-9/GAD-7), Set & Setting, Structured Safety Check.
* **Phase 2 (Dosing):**
  * IN: Dosing Protocol, Session Vitals, Session Timeline, Adverse Event Logging, Rescue Protocol.
* **Phase 3 (Integration):**
  * IN: Daily Pulse, Longitudinal Assessment (PHQ-9/GAD-7), Structured Safety Check.
* **Outputs / Dashboards:**
  * OUT: Symptom Decay Chart, Risk Engine Status, Vitals Dashboard.

### B. The Wellness / Ceremonial Protocol (Lightweight)
*Use Case:* Retreats, breathwork, ceremonial settings, facilitator models.
*Key Characteristic:* Avoids introducing "clinical" artifacts like blood pressure cuffs or depression scales that break the "Set and Setting". Emphasizes narrative mapping and subjective experience.
* **Phase 1 (Prep):**
  * IN: Consent, Set & Setting.
  * *HIDDEN:* Mental Health Screening, Structured Safety Check.
* **Phase 2 (Dosing):**
  * IN: Session Timeline (Narrative Notes).
  * *HIDDEN:* Vitals, Adverse Events, Rescue Protocol.
* **Phase 3 (Integration):**
  * IN: Daily Pulse, Integration Session, Behavioral Change Tracker, MEQ-30 (Mystical Experience).
  * *HIDDEN:* Longitudinal Assessment (PHQ-9), Structured Safety Check.
* **Outputs / Dashboards:**
  * OUT: MEQ-30 Score, Timeline Output, Behavioral Change Insights.
  * *HIDDEN / BLANK STATE:* Symptom Decay Chart, Clinical Risk Monitor.

### C. The Custom Configuration
*Use Case:* Hybrid clinics that want to mix and match (e.g., Ketamine clinic that wants to track MEQ-30, or a ceremonial retreat that still asks for a PHQ-9).
*Key Characteristic:* A modal interface providing toggles organized by Phase.

## 3. UI Implementation of the Custom Configurator
**Organization Structure for the Modal:**
Do not present a chaotic list of 15 toggles. Group them strictly by Phase, mirroring the actual workflow:

*   **Prep Phase Toggles:** Mental Health Baseline, Set & Setting, Early Safety Check.
*   **Dosing Phase Toggles:** Vitals Monitoring, Safety Event Catchers.
*   **Integration Phase Toggles:** Daily Pulse Checks, Behavioral Tracking, Longitudinal Symptom Tracking, MEQ-30.

*(Note: "Consent" and "Timeline Logging" should likely be non-nullable enforced basics, as you cannot run a session without legal consent and basic time-stamped clinical notes).*

## 4. Next Technical Tasks 
1. **Types:** Define `SessionConfig` type and default templates for Medical/Ceremonial in a central constants file.
2. **Context:** Establish a React Context (`ProtocolContext`) at the top of the app to hold the `SessionConfig` state.
3. **Modal Component:** Build `ProtocolConfiguratorModal.tsx` which injects on page mount before Phase 1.
4. **Conditional Logic:** Intercept the rendering of `WorkflowActionCard` components across all three phases based on the context.
