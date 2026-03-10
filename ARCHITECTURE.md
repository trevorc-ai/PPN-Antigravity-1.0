# PPN Portal - System Architecture & Clinical Flow

## 1. Core Data Architecture & Compliance Rules
**STRICT RULES FOR ALL AGENTS AND CODE GENERATION:**
* **Zero PII/PHI:** No personally identifiable information or protected health information is collected or stored.
* **Patient Identification:** All patients are tracked exclusively via an anonymized, randomly generated 10-digit alphanumeric `patient_id`.
* **Free Text Constraint:** Free text inputs are stored **locally only** (e.g., for PDF export generation) and are **NEVER** written to the database.
* **Database Schema:** All database log tables are connected to reference tables. The database strictly stores only integers, dates, timestamps, and alphanumeric codes. No free text is stored.

## 2. Core Function & Initialization
The core function of the application is tracking every aspect of psychedelic therapy protocols over three phases of the "Wellness Journey": Preparation, Dosing Session (Treatment), and Integration.

### Configuration Modals
Before a wellness session starts, the practitioner/facilitator completes configuration modals:
1.  **Patient Selection:** Choose 'New Patient' or 'Existing Patient'.
2.  **Workspace Configuration:** Choose between Clinical Protocol, Ceremonial Wellness, or Custom. (This determines which components are shown/hidden to reduce cognitive load).
3.  **New Patient Setup (If Applicable):** Input "What are you treating?", Gender, Smoking Status, Age, and Weight.
*Once configuration is set, the user advances to Phase 1.*

## 3. The Wellness Journey (3 Phases)

### Phase 1: PREPARATION (4 Steps)
Each step is a separate screen containing various inputs. The user must complete or skip through all 4 steps to complete Phase 1 and activate the button to advance to Phase 2.
* **Step 1:** Informed Consent
* **Step 2:** Safety Check
* **Step 3:** Mental Health Screening
* **Step 4:** Set & Setting

### Phase 2: DOSING SESSION (The "Killer App")
This is the central execution phase of the application.
* **Step 1: Dosing Protocol:** Input substance, dosage, and route of administration.
* **Step 2: Baseline Vitals (Timestamped):** Optional inputs for Heart Rate, HRV, SpO2, Systolic/Diastolic BP, Respiratory Rate, Temperature, Diaphoresis, LOC (AVPU), Neurological Observations, and QT Interval.
* **Step 3: Start Dosing Session (Active State):**
    * *UI State Change:* Hides the three step cards, starts the 'Session active' timer, and opens the HUD.
    * *Data Visualization:* Displays the 'Session Vitals Trend Real-time Physiological Monitoring' dynamic graph. This updates over elapsed time and mirrors the 'Session Updates' timestamped activity ledger.
    * *Practitioner Inputs:* Rescue protocol, additional dose, adverse event, patient spoke, music, etc.
    * *Companion App:* A built-in side app allowing the patient to register their own notes via 16 quick-buttons.
    * *Data Logging:* Every action taken while the timer is running is entered on the ledger associated with the `patient_id`.
* **Post-Session:** At the end of the dosing session, 'Post-Session Assessments' appear (as slides on desktop, or new screens on tablet). Upon completion, advances to Phase 3.

### Phase 3: INTEGRATION
Captures all activity after the dosing session, both on-site and post-discharge.
* **Session Summary:** Displays Substance, Experience, Difficulty, Safety, and Neuroplasticity Window.
* **Integration & Post-Session Steps:** Renders a series of components and visualizations.
* **Export & Handoff Generation:** Options to generate a Progress Summary, unique patient link, Discharge Summary, "Early Follow-Up (0–72 hrs)", and "Integration Work (Days to Weeks)".
* **Export Report Options:** Audit Report, Insurance Report, or Research Report.