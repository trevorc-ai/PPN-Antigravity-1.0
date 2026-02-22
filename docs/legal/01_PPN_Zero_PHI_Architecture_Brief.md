# PPN Architecture Brief: The Zero-PHI "Data Moat"

**CONFIDENTIAL – FOR LEGAL COUNSEL REVIEW ONLY**

## 1. Executive Summary
Psychedelic Practitioner Network (PPN) is a B2B SaaS platform designed to provide clinical intelligence, outcome tracking, and benchmark analytics to independent practitioners and clinics. 

A core tenet of our platform architecture is the total elimination of Protected Health Information (PHI) and Personally Identifiable Information (PII) from our centralized analytical databases. PPN operates strictly as an "analytics play" by enforcing a structural and cryptographically secure separation between a patient's identity and their clinical outcome data.

Because PPN never receives, stores, or processes PHI, we believe the platform operates outside the jurisdiction of HIPAA and does not require Business Associate Agreements (BAAs).

## 2. The Identity Segregation Model
Our system is designed so that the PPN application servers and databases are "blind" to the true identity of the individuals generating the clinical data. 

**How it works structurally:**
1.  **Clinic-Level Identity:** When a clinic or practitioner creates a new patient record, the true PII (Name, Email, Date of Birth, Contact Info, EHR Medical Record Number) remains in the clinic's local physical records or their fully compliant 3rd-party Electronic Health Record (EHR) system. 
2.  **Synthetic Subject ID Generation:** The clinic maps that patient to a randomly generated, alphanumeric **Synthetic Subject_ID** (e.g., `SUBJ-9X4B-22`). 
3.  **Data Transmission:** When the clinic inputs data into the PPN platform (e.g., protocol used, dosage, survey results, adverse events), it is *only* tagged with the `Subject_ID`. 
4.  **No Reverse-Lookup Mechanism:** PPN maintains absolutely no key, index, or mapping table capable of resolving a `SUBJ-9X4B-22` back to a human being. The translation key exists *solely* in the physical possession or proprietary EHR of the practitioner.

## 3. Data Ingestion & Storage
All clinical outcomes, psychometric survey scores (e.g., MEQ-30), and protocol efficacy metrics stored in PPN's PostgreSQL database are purely relational to the `Subject_ID`. 

By strictly enforcing this at the schema level, the aggregated data becomes a highly valuable, proprietary dataset capable of training predictive models and generating cross-clinic benchmarks, completely devoid of toxic data liabilities.

## 4. Legal Counsel Review Request
We request legal review on the following assertions to ensure our technical intent aligns with statutory realities:

1.  **HIPAA Applicability:** Verify that our zero-PHI, strict `Subject_ID` architecture accurately places PPN outside the definition of a "Covered Entity" or "Business Associate" under HIPAA.
2.  **"De-Identified Data" Safe Harbor:** Confirm whether data that *never contained PII in the first place* requires the formal statistical or expert de-identification processes outlined in the HIPAA Privacy Rule.
3.  **Ancillary Liability:** Does hosting purely analytical (non-PHI) data regarding federally scheduled substances (even if state-legal) expose the software vendor to any distinct liability?
