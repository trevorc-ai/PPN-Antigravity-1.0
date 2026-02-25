---
status: 01_TRIAGE
owner: LEAD
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
1. **Migration (SOOP):** Create a migration to add `ref_severity_tiers` and `ref_session_types` tables. Update `log_` tables to include FK columns and migrate existing data.
2. **Refactor (BUILDER):** Update `clinicalLog.ts`, `CrisisLogger.tsx`, and `AdverseEventLogger.tsx` to use these new reference IDs.

**Action Required:** LEAD/PRODDY to triage these migration tasks alongside the feature requests (Dose Calc, QT tracker, EKG baseline).

