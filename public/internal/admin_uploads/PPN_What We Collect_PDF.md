# **PPN "What We Collect" PDF**

In the psychedelic therapy space, data is often viewed as evidence of a crime rather than evidence of care. Before a practitioner or clinic owner agrees to test our software, their first question will be about legal defensibility.

As noted in our strategy files, this document is a permanent, high-leverage asset. We will use it in every partner packet, send it to VC advisors, and feature it on our website's trust/compliance section. It provides disproportionate legal clarity and instantly validates our "No PHI" architecture.

This document is designed to immediately neutralize practitioner anxiety by proving that PPN Portal’s architecture protects them from liability, HIPAA breaches, and subpoenas.

---

## **Visual Design & Layout Specifications for the PDF**

* **Background:** Dark Navy (\#0f172a) or clean White (\#ffffff) with Dark Navy text for printability.  
* **Primary Accent Colors:** Indigo (\#6366f1), Cyan (\#06b6d4), and Purple (\#8b5cf6).  
* **Typography:** Inter (Bold 600-700 for headings; Regular 400 for body). Use JetBrains Mono for data codes/examples.  
* **Tone:** Professional, evidence-based, scientific, and protective.

---

## **Document Copy**

# **PPN Portal: The "Sterile Schema" Data Architecture**

**What We Collect. What We Protect. Why It Matters.**

For psychedelic therapy practitioners, data is often viewed as a liability, evidence that could invite regulatory scrutiny or legal exposure. PPN Portal fundamentally changes this dynamic.

We utilize a Zero-Knowledge, "No PHI" architecture. By cryptographically separating the process of care from the identity of the patient, PPN Portal ensures your data acts as an immutable shield of clinical diligence, not a legal vulnerability.

Here is exactly what our system captures, and what it strictly prohibits.

---

## **PART 1: The Hard Boundaries (What We NEVER Collect)**

Our architecture is designed around "Structural Rejection." We actively block the entry of high-risk data to eliminate breach liability and subpoena risk.

* **🚫 NO Personally Identifiable Information (PII/PHI):** We never ask for, or store, patient names, email addresses, street addresses, or Social Security Numbers.  
* **🚫 NO Dates of Birth:** We collect age ranges (e.g., 36-45) to ensure demographic tracking without creating re-identification risk.  
* **🚫 NO Free-Text Clinical Notes:** To prevent the accidental entry of PHI or sensitive narrative disclosures, our clinical forms enforce a strict "No Free Text" policy. All inputs are driven by standardized dropdowns, toggles, and sliders.

**How We Track Patients:** The application is "amnesiac" regarding patient identity. The system relies entirely on a Client-Side Random ID Generator (e.g., PT-KXMR9W2P). You hold the key connecting that ID to your patient; PPN Portal only sees the anonymized string of characters.

---

## **PART 2: The Evidence of Care (What We DO Collect)**

PPN Portal captures the exact data required to prove you followed the standard of care, mapped automatically to institutional-grade medical dictionaries.

**1\. Subject Baseline & Demographics**

*We capture demographic trends to enable cross-site benchmarking without exposing identity.*

* **Biological Sex**  
* **Primary Indication** (e.g., Treatment-Resistant Depression, mapped to standard codes)

**2\. The Container Metrics (Set & Setting)**

*We capture the physical and psychological wrapper of the session to standardize real-world evidence.*

* **Setting Code:** Clinic (Medical), Clinic (Soft), Home (Supervised), or Retreat Center.  
* **Support Ratio:** 1:1 (Single Sitter), 2:1 (Co-Therapy Pair), or Group Setting.  
* **Preparation & Integration Hours:** Numeric inputs of time spent outside the dosing session.  
* **Support Modalities:** Checkbox selections (e.g., CBT, Somatic, Internal Family Systems, Music/Playlist presence).

**3\. The Clinical Intervention**

*We translate your inputs into standardized, research-grade taxonomy.*

* **Substance:** Mapped to RxNorm Codes (e.g., Psilocybin \= 1433, Ketamine \= 6130).  
* **Dosage & Route:** Mapped to UCUM Codes (e.g., 25mg, Oral; 0.5mg/kg, IV).  
* **Concomitant Medications:** Selected via a smart grid (e.g., SSRIs, MAOIs, Lithium) to automatically log interaction risk checks.

**4\. Safety & Outcomes Tracking**

*We capture quantifiable efficacy and safety signals.*

* **Psychometric Scores:** Baseline and post-session tracking via validated scales (e.g., PHQ-9, GAD-7), mapped to LOINC codes.  
* **Adverse Events:** Coded to the MedDRA standard (e.g., Nausea, Mild Distress) to prove diligent monitoring and resolution.  
* **Session Experience:** Sliders for "Intensity" and "Therapeutic" challenge vs. bliss.

---

## **PART 3: Why This Architecture Protects You**

**1\. Audit-Ready Documentation** If your clinic is ever audited by a medical board or an insurer, "no notes" equates to negligence. PPN Portal allows you to export a forensic, timestamped log proving you checked for contraindications, monitored vitals, and followed a data-backed safety protocol.

**2\. Immunity to Subpoenas** Because PPN Portal operates on a Zero-Knowledge framework, if law enforcement were to subpoena our data, we have nothing to surrender but a string of random numbers and vital sign readings. The risk of a targeted raid fueled by a centralized database is eliminated.

**3\. Network Benchmarking** Because we do not store PHI, we bypass the regulatory deadlock that prevents traditional EHRs from sharing data. This allows your anonymized clinical outcomes to be benchmarked in real-time against network averages, giving you the evidence you need to refine your protocols and prove your efficacy.

---

*PPN Portal. Augmented Intelligence for Psychedelic Therapy.* 