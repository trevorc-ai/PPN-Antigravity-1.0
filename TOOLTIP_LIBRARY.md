# PPN Research Portal - Master Tooltip Library & Glossary
**Version:** 1.0 (Advanced)  
**Date:** 2026-02-10  
**Reading Level:** 7th Grade (Clear, Simple, jargon-free)

---

## 🟢 1. Design System: Tooltip Tiers

We use three types of tooltips. Choose the right one based on how much help the user needs.

### Tier 1: Micro-Tooltip (Hover only)
*   **Best for:** Icons, Buttons, Status dots.
*   **Content:** 1-5 words. Naming things.
*   **Example:** "Close Window" or "Active Protocol".

### Tier 2: Standard Tooltip (Hover + Focus)
*   **Best for:** Input fields, dropdowns, chart headers.
*   **Content:** 1-2 sentences (20-40 words).
*   **Goal:** Explain *what* to do or *what* something means.

### Tier 3: Contextual Guide (Click/Tap to open)
*   **Best for:** Section headers, complex medical concepts, safety warnings.
*   **Content:** Structured paragraphs (50+ words).
*   **Goal:** Explain *why* it matters and safety details.

---

## 🔵 2. Protocol Builder (Field-by-Field)

### Section: Patient Demographics

| Field / Element | Tier | Type | Content (7th Grade Reading Level) |
| :--- | :--- | :--- | :--- |
| **Subject ID** | 2 | ℹ️ Info | **Enter an existing Subject ID to link this protocol to their history.**<br>Or use the auto-generated code for a new patient. This keeps the patient's identity 100% private. |
| **Biological Sex** | 2 | ℹ️ Info | **Select the sex assigned at birth.**<br>Use this for biological tracking. Current gender identity can be noted in the notes if needed. |
| **Race/Ethnicity** | 2 | ℹ️ Info | **Select the group that best describes the patient's background.**<br>This helps researchers ensure medicines work safely for everyone, regardless of their heritage. |
| **Weight Range** | 2 | ⚠️ Safety | **Choose the patient's weight group.**<br>Weight is very important for calculating the safe amount of medicine to give. |
| **Smoking Status** | 2 | ⚕️ Clinical | **Does the patient smoke?**<br>Smoking can change how fast the body processes medicines. |
| **Primary Indication** | 2 | ⚕️ Clinical | **What condition are you treating today?**<br>Select the main reason the patient needs help, like "Depression" or "Anxiety". |
| **Concomitant Medications** | 3 | 🔴 Critical | **List all other medicines the patient takes.**<br>The system checks this list against the new medicine to stop dangerous mixtures. <br><br>**Strict Rule:** You must list everything, even vitamins, to prevent bad reactions. |

### Section: Protocol Parameters

| Field / Element | Tier | Type | Content (7th Grade Reading Level) |
| :--- | :--- | :--- | :--- |
| **Substance Compound** | 3 | ⚕️ Clinical | **Choose the main active medicine.**<br>Select the exact chemical name (like Psilocybin).<br><br>**Note:** This links to our master list of chemical facts to ensure dosage safety limits are correct. |
| **Administration Route** | 2 | ⚕️ Clinical | **How does the medicine enter the body?**<br>Examples: "Oral" (by mouth) or "Intramuscular" (injection). This changes how fast it starts working. |
| **Standardized Dosage** | 3 | ⚠️ Dosage | **How much medicine are you giving?**<br>Enter the exact number. <br><br>⚠️ **Warning:** The system will alert you if this amount is higher than the normal safe limit. Double-check your numbers. |
| **Frequency** | 2 | ℹ️ Info | **How often is this medicine taken?**<br>Select "Stat" for a one-time session, or choose a schedule like "Daily". |
| **Session Number** | 2 | 📊 Tracking | **Which session is this?**<br>Is this their 1st time, 2nd time, or a follow-up? This helps track progress over time. |

### Section: Therapeutic Context

| Field / Element | Tier | Type | Content (7th Grade Reading Level) |
| :--- | :--- | :--- | :--- |
| **Setting** | 2 | ℹ️ Info | **Where is the session happening?**<br>Example: A medical clinic, a home, or a retreat center. The environment affects how the patient feels. |
| **Prep Hours** | 2 | ⚕️ Clinical | **How much time was spent preparing?**<br>Count the hours spent talking with the patient *before* the medicine session. |
| **Integration Hours** | 2 | ⚕️ Clinical | **How much time is planned for afterwards?**<br>Count the hours planned to talk about the experience *after* the medicine wears off. |
| **Support Modality** | 3 | 🧠 Science | **What therapy style are you using?**<br>Select the methods used to help the patient, like "CBT" (Talk Therapy) or "Somatic" (Body Focus).<br><br>You can select more than one. |

### Section: Clinical Outcomes & Safety

| Field / Element | Tier | Type | Content (7th Grade Reading Level) |
| :--- | :--- | :--- | :--- |
| **Psychological Difficulty** | 2 | 📊 Scale | **How hard was the experience for the patient?**<br>Rate from 1 (Easy/Blissful) to 10 (Extremely Difficult/Distressing). |
| **Baseline PHQ-9 Score** | 3 | 📊 Scale | **Depression Score (Pre-Session).**<br>Enter the score from the standard depression test taken *before* treatment.<br><br>**Scale:** 0-4 (None) to 20-27 (Severe). |
| **Resolution Status** | 2 | ⚕️ Clinical | **Did the patient work through their main issues?**<br>Select if they feel "Resolved" (Finished) or if things are still "Open" (Unfinished). |
| **Adverse Events Toggle** | 3 | 🔴 Critical | **Did anything go wrong?**<br>Turn this ON if there were any bad side effects, physical problems, or safety scares.<br><br>**Action:** You will be asked to describe exactly what happened. |
| **Severity (CTCAE)** | 3 | 🔴 Critical | **How bad was the side effect?**<br>We use a standard 1-5 scale:<br>1: Mild (No problem)<br>2: Moderate (Easy to fix)<br>3: Severe (Needs hospital)<br>4: Life-Threatening<br>5: Fatal |
| **Session Date** | 2 | 📅 Date | **When did this happen?**<br>Pick the exact calendar day of the dosing session. |

### Section: Consent

| Field / Element | Tier | Type | Content (7th Grade Reading Level) |
| :--- | :--- | :--- | :--- |
| **Consent Verification** | 3 | ⚖️ Legal | **Has the patient signed the permission forms?**<br>You confirm that you have a paper or digital document where the patient allows this treatment.<br><br>⚠️ **Required:** You cannot submit data without this. |

---

## 🟣 3. Dashboard & Global Icons

### Navigation & Actions
| Icon/Element | Tier | Type | Content |
| :--- | :--- | :--- | :--- |
| **User Profile (Avatar)** | 1 | Micro | My Account & Settings |
| **Notifications (Bell)** | 1 | Micro | Alerts & Messages |
| **Search Icon** | 1 | Micro | Search Database |
| **Close (X) Button** | 1 | Micro | Close / Cancel |
| **Plus (+) Button** | 1 | Micro | Add New Item |

### Dashboard Widgets
| Widget Title | Tier | Type | Content |
| :--- | :--- | :--- | :--- |
| **Regulatory Map** | 2 | ℹ️ Info | **See the rules for each region.**<br>Click to see which states or countries allow these treatments. |
| **Protocol Efficiency** | 2 | 📊 Data | **See what works best.**<br>This shows which medicines and therapies are getting the best results. |
| **Patient Constellation** | 2 | 🧠 AI | **Find similar patients.**<br>Our system finds patterns to group patients with similar needs. |
| **Pharmacology Lab** | 2 | 🔬 Science | **Drug safety updates.**<br>Read the latest science on how these drugs affect the body. |
| **Clinic Radar** | 2 | 📈 Stats | **Compare your performance.**<br>See how your clinic's results compare to the average of strict network standards. |

---

## 🟡 4. Glossary (Built-in)

**Terms used across the site:**

*   **CTCAE:** "Common Terminology Criteria for Adverse Events." A standard doctor's list used to grade how bad a side effect is.
*   **Indication:** The medical reason or illness being treated (like Depression).
*   **Integration:** Therapy sessions that happen *after* the drug experience to help the patient understand it.
*   **Modality:** The "Mode" or style of therapy used (like talk therapy, art therapy, or body work).
*   **PHI:** "Protected Health Information." Private medical data (like names or birthdates) that must be kept secret by law.
*   **Protocol:** The official plan for a treatment. It includes the medicine, the amount, and the therapy style.
*   **Telemetry:** Remote data collection. We use this to describe data coming from your clinic to the main research database.
