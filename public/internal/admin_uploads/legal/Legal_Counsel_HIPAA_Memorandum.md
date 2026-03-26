# **Cover Page**

### **Cover Page**

PPN PORTAL  
GO-651

HIPAA APPLICABILITY REVIEW PACKET  
Data Privacy and HIPAA Posture

Prepared by  
PPN Portal, LLC

Date  
March 2026

Reference  
GO-651

Status  
Draft for Counsel Review

Classification  
Confidential

Prepared for  
Legal Counsel and Authorized Recipients

### **Transmittal Note**

This packet is intended to support legal counsel’s review of PPN Portal’s current privacy architecture, data-handling boundaries, and HIPAA applicability posture.

It summarizes the current technical fact pattern for ppnportal.net as implemented and represented by internal engineering review, current schema review, and related platform materials. It is not intended to state final legal conclusions. PPN Portal requests counsel’s independent assessment of whether the platform, as currently designed and used, falls outside HIPAA Covered Entity and Business Associate status, whether the records stored in the platform constitute PHI, and whether the platform’s de-identification posture is better analyzed under Safe Harbor, Expert Determination, or a narrower legal framework.

PPN Portal is designed to avoid receiving direct patient identifiers and to operate on pseudonymized, structured clinical data. However, this packet does not assume that technical design intent alone resolves the legal analysis. Counsel is specifically asked to evaluate the actual fact pattern, including current identifier design, current date-related fields, vendor boundaries, operational metadata, and output structure.

### **Table of Sections**

Section 1\. HIPAA Posture Overview  
Section 2\. Architecture Verification  
Section 3\. Technical Proof Set  
Section 4\. Safe Harbor Analysis Table  
Section 5\. Public Documentation Review

### **Key Findings Summary**

Current schema review supports a direct-identifier-exclusion architecture. Patient name, date of birth, Social Security Number, patient address, patient phone number, patient email address, and MRN are not intended to be stored in the in-scope clinical schema.

The platform uses structured clinical records and pseudonymous patient linkage rather than plain-language patient identity.

The current vendor footprint is limited and currently described as Supabase, Vercel, Stripe, and Resend, with no separate analytics, error-tracking, or observability tool intentionally enabled in the reviewed environment.

The core open legal issue is not whether obvious direct identifiers are absent. The core open legal issue is whether the current overall fact pattern, including retained date-related fields such as session\_date, supports the legal conclusions PPN seeks.

Accordingly, this packet is presented for issue spotting and legal analysis, not as a final statement that all Safe Harbor requirements have already been satisfied.

## **Section 1**

## **HIPAA Posture Overview**

Version: Draft for Counsel Review  
Date: March 2026  
Prepared by: PPN Portal, LLC

### **What PPN Portal Is**

PPN Portal is a clinical documentation and network intelligence platform for licensed psychedelic therapy practitioners and clinical programs. Its intended purpose is to help practitioners document structured clinical sessions, track longitudinal outcomes, review safety-related information, and compare site-level or network-level patterns using de-identified or pseudonymized structured records.

PPN Portal is intended to function as a quality improvement and benchmarking platform. It is not intended to function as an EHR, practice management platform, billing system, insurance clearinghouse, or clinical decision support system that directs treatment.

### **Design Objective**

PPN Portal is designed to avoid collection of direct patient identifiers in the in-scope clinical data model. The platform’s intended privacy posture is based on data minimization, structured entry controls, pseudonymous subject linkage, site-scoped access, and restricted vendor exposure.

This design objective is relevant to legal analysis, but is not itself a legal conclusion.

### **Data Categories Intended to Be Excluded from the In-Scope Clinical Data Model**

The platform is intended not to store the following direct patient identifiers in the in-scope clinical schema:

1. Patient legal name  
2. Date of birth  
3. Street address  
4. Patient phone number  
5. Patient email address  
6. Social Security Number  
7. Medical record number  
8. Insurance identifiers  
9. Patient photographs  
10. Free-text narrative patient identity fields

This packet is based on the current understanding that those categories are excluded from the in-scope clinical data model. Counsel is asked to assess whether any surrounding workflows, operational logs, exports, support processes, or related systems change that analysis.

### **Pseudonymous Patient Linkage**

PPN Portal uses a pseudonymous patient-linking workflow so that clinical records can remain linked across sessions without using direct patient identity in the in-scope clinical record structure.

The current implemented identifier workflow should be described in one canonical form only. For purposes of this packet, the intended legal point is that the stored patient-linking value is not intended to be a patient name, date of birth, MRN, initials, or other direct patient identifier.

Counsel is asked to evaluate whether the actual implemented identifier workflow is sufficient for the legal position being asserted.

### **Structured Inputs and Controlled Data Entry**

PPN Portal is designed around structured data entry. Clinical forms are intended to rely on controlled selections, enumerated values, sliders, checkboxes, reference-linked values, and structured score fields rather than open-ended patient-identifying narrative entry.

This is relevant because the platform is intended to reduce the chance that practitioners enter direct patient identifiers into ordinary clinical records.

### **Access Controls and Site Isolation**

PPN Portal is intended to use role-based authenticated access and site-scoped data boundaries. Current database design materials indicate Row Level Security and site-level access isolation across major clinical tables and views. Counsel is asked to assume that access architecture is part of the platform’s intended privacy posture, but not to treat that as a substitute for analysis of the underlying data elements themselves.

### **Current Legal Position Presented for Counsel Review**

PPN Portal’s current position, subject to counsel’s independent review, is:

Covered Entity  
PPN Portal does not believe it fits the categories of health plan, healthcare clearinghouse, or healthcare provider transmitting covered transactions in its own right.

Business Associate  
PPN Portal’s position is that it should not be treated as a Business Associate if the implemented workflow does not involve PPN creating, receiving, maintaining, or transmitting PHI on behalf of Covered Entities. Counsel is specifically asked to evaluate whether the current architecture, vendor posture, identifier workflow, and operational metadata support or undermine that position.

De-identification Posture  
PPN Portal’s design objective is to support a de-identified or sufficiently pseudonymized data architecture. Counsel is specifically asked to assess whether the current fact pattern supports Safe Harbor, Expert Determination, a narrower case-specific conclusion, or additional controls.

Open Legal Issue  
The current platform retains certain date-related fields, including session\_date. Counsel is specifically asked to assess whether the retention and use of such fields changes the legal analysis, including any Safe Harbor analysis.

### **Counsel Note**

This section describes the product’s current design posture and intended operating model. It does not state final legal conclusions. Counsel is asked to independently evaluate the actual fact pattern, the current data model, and the platform’s real operational boundaries.

## **Section 2**

## **Architecture Verification**

Version: Draft for Counsel Review  
Date: March 2026

### **Purpose**

This section summarizes the current technical architecture facts most relevant to HIPAA applicability analysis. It is not a final legal compliance certification.

### **Architecture Review Summary**

The following points reflect the current intended architecture under review:

1. Direct patient identity fields are intended to be excluded from the in-scope clinical schema.  
2. Patient continuity is intended to be handled through a pseudonymous identifier workflow rather than direct patient identity.  
3. Clinical forms are intended to use structured inputs rather than open-ended patient identity entry.  
4. Site membership and role controls are intended to restrict access to site-scoped records.  
5. Current infrastructure vendors are limited in number and do not include intentionally enabled analytics or observability tooling in the reviewed environment.  
6. Certain date-related fields, including session\_date, remain present and are specifically disclosed here as an open legal review issue.

### **Architecture Review Table**

Area  
Direct identity fields

Current technical posture  
Patient name, date of birth, patient phone number, patient email address, address, SSN, and MRN are intended to be absent from the in-scope clinical schema.

Status  
Subject to current schema verification

Area  
Patient identifier design

Current technical posture  
Clinical continuity is intended to rely on a pseudonymous patient-linking value rather than direct identity fields.

Status  
Requires canonical implementation statement

Area  
Structured data entry

Current technical posture  
Clinical records are intended to use structured controls and enumerated inputs rather than free-text identity fields.

Status  
Supported by current platform design

Area  
Session date and related date fields

Current technical posture  
Certain date-related fields, including session\_date, remain in the current application and support current app behavior.

Status  
Open legal issue for counsel review

Area  
Vendor footprint

Current technical posture  
Current materials identify Supabase, Vercel, Stripe, and Resend as the primary third-party vendors in scope.

Status  
Supported by current vendor review

Area  
Analytics and observability tooling

Current technical posture  
No separate analytics, error-tracking, or observability tools are intentionally enabled in the reviewed environment, based on current configuration review.

Status  
Supported by current configuration review

Area  
Site isolation and RLS

Current technical posture  
Current database materials indicate Row Level Security and site-scoped access boundaries across major clinical tables.

Status  
Supported by current database materials

### **Important Clarification Regarding session\_date**

PPN Portal is not representing in this packet that all date-related issues have been technically eliminated. The current application still retains session\_date in its present workflow. The engineering question and the legal question are separate.

The engineering question is whether and when the field can be removed without destabilizing the application.

The legal question is whether retention of session\_date in the current pseudonymized architecture changes the HIPAA analysis, including any Safe Harbor analysis.

Counsel is asked to evaluate that legal question directly.

### **Architecture Statement**

PPN Portal’s current architecture appears directionally consistent with a de-identified or pseudonymized clinical data model. However, the packet does not claim that current technical design alone resolves the legal analysis. That question is expressly reserved for counsel.

## **Section 3**

## **Technical Proof Set**

Version: Draft for Counsel Review  
Date: March 2026

### **Purpose**

This section identifies the technical facts and supporting categories of evidence relevant to counsel’s review.

### **1\. Field-Level Direct Identifier Exclusion**

Current platform design and schema review are intended to support the proposition that the in-scope clinical schema excludes ordinary direct patient identity fields such as:

1. patient legal name  
2. date of birth  
3. patient address  
4. patient phone number  
5. patient email  
6. Social Security Number  
7. MRN  
8. insurance identifiers

This section should be read together with the current schema snapshot and field inventory supplied separately.

### **2\. Pseudonymous Subject Linkage**

PPN Portal uses a pseudonymous patient-linking approach so that session continuity and longitudinal records can exist without storing direct patient identity in the ordinary clinical record structure.

For purposes of this packet, counsel should not rely on any older or alternate narrative of identifier generation. The controlling workflow should be the single current implementation statement supplied in the appendices.

The key factual assertion for present purposes is narrower:  
the platform is intended to avoid using patient name, DOB, MRN, initials, or other direct patient identity as the stored patient-linking value in ordinary clinical records.

### **3\. Structured Clinical Inputs**

Clinical records are intended to rely on structured entry patterns such as:

1. controlled vocabulary references  
2. score values  
3. coded selections  
4. enumerated flags  
5. structured numeric fields  
6. non-free-text clinical input controls where possible

This design is relevant because it reduces the platform’s dependency on free-form narrative entry for ordinary clinical workflows.

### **4\. Vendor and Subprocessor Summary**

Current materials identify the following third-party vendors in the in-scope service path:

1. Supabase, database and authentication infrastructure  
2. Vercel, frontend hosting and deployment  
3. Stripe, practitioner subscription and payment processing  
4. Resend, practitioner account and transactional email delivery

Current materials also indicate that no separate analytics, error-tracking, or observability tools are intentionally enabled in the reviewed environment.

Counsel is asked to evaluate whether any vendor-side operational logs, request metadata, or surrounding systems change the HIPAA analysis even if the clinical tables themselves exclude direct patient identity.

### **5\. Authentication and Account Model**

Authentication is currently intended to be handled through Supabase Auth using practitioner accounts. Practitioners are associated with one or more clinical sites, and site-scoped access controls are intended to prevent access to another site’s clinical records without proper authorization. Current materials indicate Row Level Security as part of this access model.

### **6\. Backup and Recovery**

Current materials indicate that database backup and point-in-time recovery are handled through Supabase-managed services, with no separate internal PPN backup system described for patient records. Counsel is asked to consider whether backup handling, vendor retention, and operational metadata affect the legal analysis.

### **7\. Date-Related Fields and Related Outputs**

PPN Portal expressly discloses that date-related fields remain relevant to the current application architecture, including session\_date.

PPN Portal is not asking counsel to assume these fields are legally irrelevant. PPN Portal is asking counsel to evaluate:

1. whether current date-related fields prevent reliance on Safe Harbor,  
2. whether the legal analysis is better framed under Expert Determination or another narrower theory,  
3. whether certain fields may remain acceptable in limited internal use while still requiring different treatment in exports, analytics, or public claims.

### **8\. Operational Metadata and Logging Boundaries**

This packet does not assume that only clinical tables matter. Counsel is asked to consider whether the following categories alter the analysis:

1. authentication logs  
2. request logs  
3. hosting and CDN logs  
4. database access logs  
5. email delivery logs  
6. support access paths  
7. backup metadata  
8. any other operational systems that may hold metadata linked to user or patient-linked activity

### **9\. Technical Proof Position**

The technical proof set is intended to show that PPN Portal’s current design is materially different from a typical PHI-based EHR or practice-management system. It is not intended to certify that all legal questions have already been resolved.

## **Section 4**

## **Safe Harbor Analysis Table**

Version: Draft for Counsel Review  
Date: March 2026

### **Purpose**

This section is not a final statement that Safe Harbor has already been achieved. Instead, it identifies how the current platform design relates to the 18 Safe Harbor identifier categories and highlights where counsel review is still required.

### **Safe Harbor Review Table**

1. Names  
   Current posture: Intended to be absent from the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk, subject to schema confirmation.  
2. Geographic subdivisions smaller than a state  
   Current posture: Intended to be absent from ordinary patient-level clinical records.  
   Counsel review status: Low apparent direct-identifier risk, subject to schema confirmation and output review.  
3. Dates directly related to an individual, except year  
   Current posture: Open legal issue. Certain date-related fields, including session\_date, remain in the current application.  
   Counsel review status: Requires direct counsel analysis.  
4. Phone numbers  
   Current posture: Patient phone numbers are intended to be absent from the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk, subject to schema confirmation.  
5. Fax numbers  
   Current posture: Not intended to be collected in the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk.  
6. Email addresses  
   Current posture: Patient email addresses are intended to be absent from the in-scope clinical schema. Practitioner email addresses exist for account purposes.  
   Counsel review status: Low apparent patient-identity risk within clinical records, subject to account-model review.  
7. Social Security Numbers  
   Current posture: Intended to be absent from the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk.  
8. Medical record numbers  
   Current posture: Intended to be absent from the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk.  
9. Health plan beneficiary numbers  
   Current posture: Intended to be absent from the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk.  
10. Account numbers  
    Current posture: Patient account numbers are intended to be absent. Practitioner subscription and billing records may exist outside patient clinical records.  
    Counsel review status: Requires boundary confirmation.  
11. Certificate or license numbers  
    Current posture: Not intended as patient data.  
    Counsel review status: Generally outside patient identity analysis, but review practitioner-account boundaries as needed.  
12. Vehicle identifiers and serial numbers  
    Current posture: Not intended to be collected in the clinical record model.  
    Counsel review status: Low apparent risk.  
13. Device identifiers and serial numbers  
    Current posture: The platform is not intended to store patient device serial numbers in the in-scope clinical schema.  
    Counsel review status: Requires confirmation against actual schema and vendor logs.  
14. Web URLs  
    Current posture: No patient-identifying URL is intended to be stored as a clinical field.  
    Counsel review status: Requires confirmation against any operational metadata or logs.  
15. IP addresses  
    Current posture: Not intended to be stored in patient clinical records, but infrastructure providers may retain operational request logs.  
    Counsel review status: Requires counsel review of metadata and vendor boundaries.  
16. Biometric identifiers  
    Current posture: Not intended to be collected in the in-scope clinical schema.  
    Counsel review status: Low apparent direct-identifier risk.  
17. Full-face photographs and comparable images  
    Current posture: No patient image upload capability is intended in the ordinary clinical record model.  
    Counsel review status: Low apparent direct-identifier risk, subject to product-feature confirmation.  
18. Any other unique identifying number, characteristic, or code  
    Current posture: The platform uses a pseudonymous patient-linking value rather than direct patient identity in ordinary clinical records.  
    Counsel review status: Requires direct review of the implemented identifier workflow and any mapping boundary.

### **Safe Harbor Summary**

PPN Portal is not asking counsel to assume that all 18 Safe Harbor categories have already been fully satisfied.

PPN Portal’s narrower position is this:

1. Direct patient identity fields appear intentionally excluded from the in-scope clinical schema.  
2. Certain categories, especially date-related fields and patient-linking identifiers, require legal confirmation against the actual implemented fact pattern.  
3. Counsel should evaluate whether the current design supports Safe Harbor, whether Expert Determination is more appropriate, or whether PPN should simply narrow its claims and operate with a more modest legal posture until further changes are made.

## **Section 5**

## **Public Documentation Review**

Version: Draft for Counsel Review  
Date: March 2026

### **Purpose**

This section identifies public-facing privacy and legal documentation that may need to be aligned with the final legal posture.

### **Public Document Inventory**

Current public-facing materials may include:

1. data policy  
2. printable data policy  
3. privacy policy  
4. terms of service  
5. public HIPAA overview or related explanatory material

Counsel is asked not only to evaluate the underlying technical architecture, but also to flag any public claims that are too absolute relative to the current fact pattern.

### **Current Public-Claims Risk**

PPN Portal recognizes that some existing or draft public materials may overstate certainty. In particular, public statements should not claim final legal conclusions if those conclusions still depend on counsel’s analysis of:

1. Business Associate status  
2. Safe Harbor versus Expert Determination  
3. retained date-related fields, including session\_date  
4. the implemented patient-linking workflow  
5. vendor and metadata boundaries

### **Recommended Public-Facing Posture Pending Final Legal Review**

Until counsel review is complete, the public-facing posture should use language like:

1. “Designed to avoid storing direct patient identifiers”  
2. “Built around pseudonymized structured clinical data”  
3. “Formal legal review is in progress”  
4. “Privacy architecture and data-handling boundaries available for institutional review”

The public-facing posture should avoid language like:

1. “HIPAA does not apply”  
2. “All 18 Safe Harbor identifiers are confirmed compliant”  
3. “No BAA is required” as a final statement  
4. “Zero-PHI architecture confirmed” as if already legally established  
5. “Formal opinion letter in progress” in a way that implies the result is already effectively settled

### **Public Documentation Review Statement**

The purpose of this packet is to help counsel evaluate the current fact pattern and identify what PPN can safely continue to say, what should be softened, and what should be held pending final legal review.

### **Closing Statement for Main Packet**

PPN Portal submits this packet as a good-faith summary of the current technical and operational posture of the platform for purposes of legal review.

PPN Portal’s current position is that the platform has been intentionally designed to avoid direct patient identity and to materially reduce the legal and operational burdens associated with identifiable patient records.

PPN Portal is not asking counsel to ratify marketing language. PPN Portal is asking counsel to assess the actual fact pattern, identify the strongest defensible legal posture, identify any weaknesses, and advise what additional controls, narrowing, or revisions are required.

## **What I recommend you do next**

Paste this into the packet now and stop editing the old version line by line.

Then do only three things before moving to appendices:

1. Insert the exact current identifier workflow sentence where noted.  
2. Insert the exact current vendor list if it changed.  
3. Make sure every public document stops claiming full Safe Harbor certainty.

If you want, next I’ll write the matching updated version of the memorandum in the same clean, current-state style so the packet and memo stop fighting each other.

# **HIPAA APPLICABILITY REVIEW PACKET**

# **PPN PORTAL \- HIPAA APPLICABILITY REVIEW PACKET**

Data Privacy and HIPAA Posture

Prepared by  
PPN Portal, LLC

Date  
March 2026

Reference  
GO-651

Status  
Draft for Counsel Review

Classification  
Confidential

Prepared for  
Legal Counsel and Authorized Recipients

TRANSMITTAL NOTE

This packet is intended to support legal counsel’s review of PPN Portal’s current privacy architecture, data-handling boundaries, and HIPAA applicability posture.

It summarizes the current technical fact pattern for ppnportal.net as implemented and represented by internal engineering review, current schema review, and related platform materials. It is not intended to state final legal conclusions. PPN Portal requests counsel’s independent assessment of whether the platform, as currently designed and used, falls outside HIPAA Covered Entity and Business Associate status, whether the records stored in the platform constitute PHI, and whether the platform’s de-identification posture is better analyzed under Safe Harbor, Expert Determination, or a narrower legal framework.

PPN Portal is designed to avoid receiving direct patient identifiers and to operate on pseudonymized, structured clinical data. However, this packet does not assume that technical design intent alone resolves the legal analysis. Counsel is specifically asked to evaluate the actual fact pattern, including current identifier design, current date-related fields, vendor boundaries, operational metadata, and output structure.

TABLE OF CONTENTS

Section 1\. HIPAA Posture Overview  
Section 2\. Architecture Verification  
Section 3\. Technical Proof Set  
Section 4\. Safe Harbor Analysis Table  
Section 5\. Public Documentation Review

KEY FINDINGS SUMMARY

Current schema review supports a direct-identifier-exclusion architecture. Patient name, date of birth, Social Security Number, patient address, patient phone number, patient email address, and MRN are not intended to be stored in the in-scope clinical schema.

The platform uses a two-layer patient-linking model consisting of an internal canonical database identifier, subject\_id, and a practitioner-facing pseudonymous display code in the format PT-XXXXXX.

The current vendor footprint is limited and currently described as Supabase, Vercel, Stripe, and Resend, with no separate analytics, error-tracking, or observability tool intentionally enabled in the reviewed environment.

The core open legal issue is not whether obvious direct identifiers are absent. The core open legal issue is whether the current overall fact pattern, including retained date-related fields such as session\_date, supports the legal conclusions PPN seeks.

Accordingly, this packet is presented for issue spotting and legal analysis, not as a final statement that all Safe Harbor requirements have already been satisfied.

SECTION 1\. HIPAA POSTURE OVERVIEW

Version: Draft for Counsel Review  
Date: March 2026  
Prepared by: PPN Portal, LLC

WHAT PPN PORTAL IS

PPN Portal is a clinical documentation and network intelligence platform for licensed psychedelic therapy practitioners and clinical programs. Its intended purpose is to help practitioners document structured clinical sessions, track longitudinal outcomes, review safety-related information, and compare site-level or network-level patterns using de-identified or pseudonymized structured records.

PPN Portal is intended to function as a quality improvement and benchmarking platform. It is not intended to function as an EHR, practice management platform, billing system, insurance clearinghouse, or clinical decision support system that directs treatment.

DESIGN OBJECTIVE

PPN Portal is designed to avoid collection of direct patient identifiers in the in-scope clinical data model. The platform’s intended privacy posture is based on data minimization, structured entry controls, pseudonymous subject linkage, site-scoped access, and restricted vendor exposure.

This design objective is relevant to legal analysis, but is not itself a legal conclusion.

DATA CATEGORIES INTENDED TO BE EXCLUDED FROM THE IN-SCOPE CLINICAL DATA MODEL

The platform is intended not to store the following direct patient identifiers in the in-scope clinical schema:

1. Patient legal name  
2. Date of birth  
3. Street address  
4. Patient phone number  
5. Patient email address  
6. Social Security Number  
7. Medical record number  
8. Insurance identifiers  
9. Patient photographs  
10. Free-text narrative patient identity fields

This packet is based on the current understanding that those categories are excluded from the in-scope clinical data model. Counsel is asked to assess whether any surrounding workflows, operational logs, exports, support processes, or related systems change that analysis.

PSEUDONYMOUS PATIENT LINKAGE

PPN Portal uses a two-layer patient-linking workflow so that clinical records can remain linked across sessions without using direct patient identity in the ordinary clinical data model.

The two layers are:

1. subject\_id, the internal canonical database identifier used to link all clinical records for the same patient across sessions and related tables  
2. PT-XXXXXX, the practitioner-facing pseudonymous display code shown in the user interface as the ordinary patient reference

subject\_id is system-generated and is not derived from patient name, date of birth, MRN, initials, phone number, email address, address, or other patient attributes.

The practitioner-facing display code is generated client-side at the point of patient creation and contains no patient-derived information.

The practitioner holds the only mapping between the display code and the real patient identity. PPN Portal’s ordinary clinical data model is intended not to use patient name, date of birth, MRN, or other direct patient identity as the patient-linking value.

STRUCTURED INPUTS AND CONTROLLED DATA ENTRY

PPN Portal is designed around structured data entry. Clinical forms are intended to rely on controlled selections, enumerated values, sliders, checkboxes, reference-linked values, and structured score fields rather than open-ended patient-identifying narrative entry.

This is relevant because the platform is intended to reduce the chance that practitioners enter direct patient identifiers into ordinary clinical records.

ACCESS CONTROLS AND SITE ISOLATION

PPN Portal is intended to use role-based authenticated access and site-scoped data boundaries. Current database design materials indicate Row Level Security and site-level access isolation across major clinical tables and views. Counsel is asked to assume that access architecture is part of the platform’s intended privacy posture, but not to treat that as a substitute for analysis of the underlying data elements themselves.

CURRENT LEGAL POSITION PRESENTED FOR COUNSEL REVIEW

PPN Portal’s current position, subject to counsel’s independent review, is:

Covered Entity  
PPN Portal does not believe it fits the categories of health plan, healthcare clearinghouse, or healthcare provider transmitting covered transactions in its own right.

Business Associate  
PPN Portal’s position is that it should not be treated as a Business Associate if the implemented workflow does not involve PPN creating, receiving, maintaining, or transmitting PHI on behalf of Covered Entities. Counsel is specifically asked to evaluate whether the current architecture, vendor posture, identifier workflow, and operational metadata support or undermine that position.

De-identification Posture  
PPN Portal’s design objective is to support a de-identified or sufficiently pseudonymized data architecture. Counsel is specifically asked to assess whether the current fact pattern supports Safe Harbor, Expert Determination, a narrower case-specific conclusion, or additional controls.

Open Legal Issue  
The current platform retains certain date-related fields, including session\_date. Counsel is specifically asked to assess whether the retention and use of such fields changes the legal analysis, including any Safe Harbor analysis.

COUNSEL NOTE

This section describes the product’s current design posture and intended operating model. It does not state final legal conclusions. Counsel is asked to independently evaluate the actual fact pattern, the current data model, and the platform’s real operational boundaries.

SECTION 2\. ARCHITECTURE VERIFICATION

Version: Draft for Counsel Review  
Date: March 2026

PURPOSE

This section summarizes the current technical architecture facts most relevant to HIPAA applicability analysis. It is not a final legal compliance certification.

ARCHITECTURE REVIEW SUMMARY

The following points reflect the current intended architecture under review:

1. Direct patient identity fields are intended to be excluded from the in-scope clinical schema.  
2. Patient continuity is intended to be handled through a two-layer identifier model rather than direct patient identity.  
3. Clinical forms are intended to use structured inputs rather than open-ended patient identity entry.  
4. Site membership and role controls are intended to restrict access to site-scoped records.  
5. Current infrastructure vendors are limited in number and do not include intentionally enabled analytics or observability tooling in the reviewed environment.  
6. Certain date-related fields, including session\_date, remain present and are specifically disclosed here as an open legal review issue.

ARCHITECTURE REVIEW TABLE

Area  
Direct identity fields

Current technical posture  
Patient name, date of birth, patient phone number, patient email address, address, SSN, and MRN are intended to be absent from the in-scope clinical schema.

Status  
Subject to current schema verification

Area  
Patient identifier design

Current technical posture  
The platform uses a two-layer identifier model consisting of subject\_id, the internal canonical database linkage key, and PT-XXXXXX, the practitioner-facing pseudonymous display code used in the UI.

Status  
Requires confirmation against the current implemented workflow and current schema snapshot

Area  
Structured data entry

Current technical posture  
Clinical records are intended to use structured controls and enumerated inputs rather than free-text identity fields.

Status  
Supported by current platform design

Area  
Session date and related date fields

Current technical posture  
Certain date-related fields, including session\_date, remain in the current application and support current app behavior.

Status  
Open legal issue for counsel review

Area  
Vendor footprint

Current technical posture  
Current materials identify Supabase, Vercel, Stripe, and Resend as the primary third-party vendors in scope.

Status  
Supported by current vendor review

Area  
Analytics and observability tooling

Current technical posture  
No separate analytics, error-tracking, or observability tools are intentionally enabled in the reviewed environment, based on current configuration review.

Status  
Supported by current configuration review

Area  
Site isolation and RLS

Current technical posture  
Current database materials indicate Row Level Security and site-scoped access boundaries across major clinical tables.

Status  
Supported by current database materials

IMPORTANT CLARIFICATION REGARDING session\_date

PPN Portal is not representing in this packet that all date-related issues have been technically eliminated. The current application still retains session\_date in its present workflow. The engineering question and the legal question are separate.

The engineering question is whether and when the field can be removed without destabilizing the application.

The legal question is whether retention of session\_date in the current pseudonymized architecture changes the HIPAA analysis, including any Safe Harbor analysis.

Counsel is asked to evaluate that legal question directly.

ARCHITECTURE STATEMENT

PPN Portal’s current architecture appears directionally consistent with a de-identified or pseudonymized clinical data model. However, the packet does not claim that current technical design alone resolves the legal analysis. That question is expressly reserved for counsel.

SECTION 3\. TECHNICAL PROOF SET

Version: Draft for Counsel Review  
Date: March 2026

PURPOSE

This section identifies the technical facts and supporting categories of evidence relevant to counsel’s review.

1. FIELD-LEVEL DIRECT IDENTIFIER EXCLUSION

Current platform design and schema review are intended to support the proposition that the in-scope clinical schema excludes ordinary direct patient identity fields such as:

1. patient legal name  
2. date of birth  
3. patient address  
4. patient phone number  
5. patient email  
6. Social Security Number  
7. MRN  
8. insurance identifiers

This section should be read together with the current schema snapshot and field inventory supplied separately.

2. PSEUDONYMOUS SUBJECT LINKAGE

PPN Portal uses a two-layer patient-linking approach.

The internal canonical database identifier is subject\_id, a system-generated integer used to link patient records across sessions and related tables.

The practitioner-facing pseudonymous display code is PT-XXXXXX, which is shown in the user interface as the ordinary patient reference.

The key factual assertion for present purposes is that neither layer is intended to be patient name, date of birth, MRN, initials, phone number, email address, or other direct patient identity.

3. STRUCTURED CLINICAL INPUTS

Clinical records are intended to rely on structured entry patterns such as:

1. controlled vocabulary references  
2. score values  
3. coded selections  
4. enumerated flags  
5. structured numeric fields  
6. non-free-text clinical input controls where possible

This design is relevant because it reduces the platform’s dependency on free-form narrative entry for ordinary clinical workflows.

4. VENDOR AND SUBPROCESSOR SUMMARY

Current materials identify the following third-party vendors in the in-scope service path:

1. Supabase, database and authentication infrastructure  
2. Vercel, frontend hosting and deployment  
3. Stripe, practitioner subscription and payment processing  
4. Resend, practitioner account and transactional email delivery

Current materials also indicate that no separate analytics, error-tracking, or observability tools are intentionally enabled in the reviewed environment.

Counsel is asked to evaluate whether any vendor-side operational logs, request metadata, or surrounding systems change the HIPAA analysis even if the clinical tables themselves exclude direct patient identity.

5. AUTHENTICATION AND ACCOUNT MODEL

Authentication is currently intended to be handled through Supabase Auth using practitioner accounts. Practitioners are associated with one or more clinical sites, and site-scoped access controls are intended to prevent access to another site’s clinical records without proper authorization. Current materials indicate Row Level Security as part of this access model.

6. BACKUP AND RECOVERY

Current materials indicate that database backup and point-in-time recovery are handled through Supabase-managed services, with no separate internal PPN backup system described for patient records. Counsel is asked to consider whether backup handling, vendor retention, and operational metadata affect the legal analysis.

7. DATE-RELATED FIELDS AND RELATED OUTPUTS

PPN Portal expressly discloses that date-related fields remain relevant to the current application architecture, including session\_date.

PPN Portal is not asking counsel to assume these fields are legally irrelevant. PPN Portal is asking counsel to evaluate:

1. whether current date-related fields prevent reliance on Safe Harbor,  
2. whether the legal analysis is better framed under Expert Determination or another narrower theory,  
3. whether certain fields may remain acceptable in limited internal use while still requiring different treatment in exports, analytics, or public claims.  
4. OPERATIONAL METADATA AND LOGGING BOUNDARIES

This packet does not assume that only clinical tables matter. Counsel is asked to consider whether the following categories alter the analysis:

1. authentication logs  
2. request logs  
3. hosting and CDN logs  
4. database access logs  
5. email delivery logs  
6. support access paths  
7. backup metadata  
8. any other operational systems that may hold metadata linked to user or patient-linked activity  
9. TECHNICAL PROOF POSITION

The technical proof set is intended to show that PPN Portal’s current design is materially different from a typical PHI-based EHR or practice-management system. It is not intended to certify that all legal questions have already been resolved.

SECTION 4\. SAFE HARBOR ANALYSIS TABLE

Version: Draft for Counsel Review  
Date: March 2026

PURPOSE

This section is not a final statement that Safe Harbor has already been achieved. Instead, it identifies how the current platform design relates to the 18 Safe Harbor identifier categories and highlights where counsel review is still required.

SAFE HARBOR REVIEW TABLE

1. Names  
   Current posture: Intended to be absent from the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk, subject to schema confirmation.  
2. Geographic subdivisions smaller than a state  
   Current posture: Intended to be absent from ordinary patient-level clinical records.  
   Counsel review status: Low apparent direct-identifier risk, subject to schema confirmation and output review.  
3. Dates directly related to an individual, except year  
   Current posture: Open legal issue. Certain date-related fields, including session\_date, remain in the current application.  
   Counsel review status: Requires direct counsel analysis.  
4. Phone numbers  
   Current posture: Patient phone numbers are intended to be absent from the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk, subject to schema confirmation.  
5. Fax numbers  
   Current posture: Not intended to be collected in the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk.  
6. Email addresses  
   Current posture: Patient email addresses are intended to be absent from the in-scope clinical schema. Practitioner email addresses exist for account purposes.  
   Counsel review status: Low apparent patient-identity risk within clinical records, subject to account-model review.  
7. Social Security Numbers  
   Current posture: Intended to be absent from the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk.  
8. Medical record numbers  
   Current posture: Intended to be absent from the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk.  
9. Health plan beneficiary numbers  
   Current posture: Intended to be absent from the in-scope clinical schema.  
   Counsel review status: Low apparent direct-identifier risk.  
10. Account numbers  
    Current posture: Patient account numbers are intended to be absent. Practitioner subscription and billing records may exist outside patient clinical records.  
    Counsel review status: Requires boundary confirmation.  
11. Certificate or license numbers  
    Current posture: Not intended as patient data.  
    Counsel review status: Generally outside patient identity analysis, but review practitioner-account boundaries as needed.  
12. Vehicle identifiers and serial numbers  
    Current posture: Not intended to be collected in the clinical record model.  
    Counsel review status: Low apparent risk.  
13. Device identifiers and serial numbers  
    Current posture: The platform is not intended to store patient device serial numbers in the in-scope clinical schema.  
    Counsel review status: Requires confirmation against actual schema and vendor logs.  
14. Web URLs  
    Current posture: No patient-identifying URL is intended to be stored as a clinical field.  
    Counsel review status: Requires confirmation against any operational metadata or logs.  
15. IP addresses  
    Current posture: Not intended to be stored in patient clinical records, but infrastructure providers may retain operational request logs.  
    Counsel review status: Requires counsel review of metadata and vendor boundaries.  
16. Biometric identifiers  
    Current posture: Not intended to be collected in the in-scope clinical schema.  
    Counsel review status: Low apparent direct-identifier risk.  
17. Full-face photographs and comparable images  
    Current posture: No patient image upload capability is intended in the ordinary clinical record model.  
    Counsel review status: Low apparent direct-identifier risk, subject to product-feature confirmation.  
18. Any other unique identifying number, characteristic, or code  
    Current posture: The platform uses a two-layer patient-linking model consisting of subject\_id, the internal canonical database linkage key, and PT-XXXXXX, the practitioner-facing pseudonymous display code. Neither identifier is intended to contain direct patient identity.  
    Counsel review status: Requires direct review of the implemented two-layer identifier workflow and the identity mapping boundary held by the practitioner.

SAFE HARBOR SUMMARY

PPN Portal is not asking counsel to assume that all 18 Safe Harbor categories have already been fully satisfied.

PPN Portal’s narrower position is this:

1. Direct patient identity fields appear intentionally excluded from the in-scope clinical schema.  
2. Certain categories, especially date-related fields and patient-linking identifiers, require legal confirmation against the actual implemented fact pattern.  
3. Counsel should evaluate whether the current design supports Safe Harbor, whether Expert Determination is more appropriate, or whether PPN should simply narrow its claims and operate with a more modest legal posture until further changes are made.

SECTION 5\. PUBLIC DOCUMENTATION REVIEW

Version: Draft for Counsel Review  
Date: March 2026

PURPOSE

This section identifies public-facing privacy and legal documentation that may need to be aligned with the final legal posture.

PUBLIC DOCUMENT INVENTORY

Current public-facing materials may include:

1. data policy  
2. printable data policy  
3. privacy policy  
4. terms of service  
5. public HIPAA overview or related explanatory material

Counsel is asked not only to evaluate the underlying technical architecture, but also to flag any public claims that are too absolute relative to the current fact pattern.

CURRENT PUBLIC-CLAIMS RISK

PPN Portal recognizes that some existing or draft public materials may overstate certainty. In particular, public statements should not claim final legal conclusions if those conclusions still depend on counsel’s analysis of:

1. Business Associate status  
2. Safe Harbor versus Expert Determination  
3. retained date-related fields, including session\_date  
4. the implemented patient-linking workflow  
5. vendor and metadata boundaries

Public materials should distinguish clearly between the internal canonical identifier, subject\_id, and the practitioner-facing display code, PT-XXXXXX, and should not describe the display code as the canonical database identifier.

RECOMMENDED PUBLIC-FACING POSTURE PENDING FINAL LEGAL REVIEW

Until counsel review is complete, the public-facing posture should use language like:

1. “Designed to avoid storing direct patient identifiers”  
2. “Built around pseudonymized structured clinical data”  
3. “Formal legal review is in progress”  
4. “Privacy architecture and data-handling boundaries available for institutional review”

The public-facing posture should avoid language like:

1. “HIPAA does not apply”  
2. “All 18 Safe Harbor identifiers are confirmed compliant”  
3. “No BAA is required” as a final statement  
4. “Zero-PHI architecture confirmed” as if already legally established  
5. “Formal opinion letter in progress” in a way that implies the result is already effectively settled

PUBLIC DOCUMENTATION REVIEW STATEMENT

The purpose of this packet is to help counsel evaluate the current fact pattern and identify what PPN can safely continue to say, what should be softened, and what should be held pending final legal review.

CLOSING STATEMENT FOR MAIN PACKET

PPN Portal submits this packet as a good-faith summary of the current technical and operational posture of the platform for purposes of legal review.

PPN Portal’s current position is that the platform has been intentionally designed to avoid direct patient identity and to materially reduce the legal and operational burdens associated with identifiable patient records.

PPN Portal is not asking counsel to ratify marketing language. PPN Portal is asking counsel to assess the actual fact pattern, identify the strongest defensible legal posture, identify any weaknesses, and advise what additional controls, narrowing, or revisions are required.

# **Technical Memorandum for Legal Counsel**

TECHNICAL MEMORANDUM FOR LEGAL COUNSEL

Re: HIPAA Applicability Analysis, PPN Portal Platform

Prepared by: PPN Portal Technical and Strategy Team  
Date: Q1 2026  
For: \[Counsel Name / Law Firm\]  
Re: Request for legal analysis regarding whether PPN Portal, LLC is a HIPAA Covered Entity and/or Business Associate with respect to its software platform and related data flows

PRIVILEGE NOTICE

This memorandum is intended to assist legal counsel in providing legal advice regarding HIPAA applicability and related privacy questions. It is intended to be treated as confidential and subject to attorney-client privilege and attorney work product protections to the fullest extent available. It should not be distributed outside the attorney-client relationship without authorization.

1. PURPOSE OF THIS MEMORANDUM

PPN Portal requests counsel’s independent legal analysis of the following question:

Does PPN Portal, LLC, in connection with its software platform and related data flows, create, receive, maintain, or transmit Protected Health Information on behalf of Covered Entities such that it is subject to HIPAA as a Covered Entity or Business Associate?

This memorandum is intended to provide a functional factual record for that analysis. It describes what the platform is intended to do, what data elements are intended to enter the platform, what data elements are intended to be excluded, how subject linkage is intended to work, and what related legal questions PPN Portal requests counsel to address.

This memorandum is not intended to state final legal conclusions. PPN Portal requests counsel’s analysis of the facts and assumptions described below.

2. SCOPE, ASSUMPTIONS, AND BOUNDARIES

Unless otherwise noted, this memorandum addresses the ppnportal.net application environment and its direct supporting operations.

The following assumptions are material to the analysis and should be tested by counsel:

1. PPN Portal is a SaaS platform used by licensed practitioners and clinical facilities for structured documentation, longitudinal outcomes tracking, quality improvement, safety surveillance, and aggregate benchmarking.  
2. PPN Portal is not intended to function as an electronic health record, billing platform, claims processor, healthcare clearinghouse, or general practice management system.  
3. PPN Portal is not intended to provide medical advice, treatment recommendations, or software outputs on which a clinician is expected to rely as a substitute for independent professional judgment.  
4. Direct patient identity is intended to remain outside the in-scope PPN clinical data model.  
5. Patient continuity is intended to rely on a two-layer pseudonymous subject-linking model rather than patient name, date of birth, MRN, initials, phone number, email address, address, or other direct patient identifiers in ordinary clinical records.  
6. The legal analysis should consider not only the user-facing clinical tables, but also exports, vendor boundaries, backups, support workflows, and operational metadata.  
7. The current platform still retains certain date-related fields, including session\_date. The legal significance of those fields is expressly presented to counsel as an open issue.  
8. This memorandum addresses the current implemented fact pattern. It does not rely on deprecated architecture, superseded schema states, or future engineering cleanup that has not yet been completed.

If any of the above assumptions are inaccurate, incomplete, or not consistently true in production, counsel’s analysis should be based on the corrected fact pattern.

3. COMPANY AND PLATFORM OVERVIEW

Legal entity: PPN Portal, LLC  
Platform name: PPN Portal  
Primary domain: ppnportal.net

PPN Portal operates a cloud-based software platform sold on a subscription basis to licensed practitioners and clinical facilities. The platform is intended to support structured clinical documentation, longitudinal outcomes tracking, safety-related structured records, and anonymized or pseudonymized aggregate benchmarking.

The platform does not include billing or claims functionality. It is not intended to process HIPAA standard transactions such as claims, remittance advice, eligibility inquiries, payment-related referrals, or clearinghouse functions.

PPN Portal is intended to function as a quality improvement and benchmarking platform. It is not intended to function as an EHR, billing platform, or clinical decision support system that directs treatment.

4. COVERED ENTITY ANALYSIS

PPN Portal does not believe it is a Covered Entity, but requests counsel’s independent analysis.

Based on current understanding, PPN Portal does not appear to fit the three HIPAA Covered Entity categories because it is not a health plan, is not a healthcare clearinghouse, and does not itself provide healthcare services or transmit health information in connection with HIPAA standard transactions.

4.1 Health plan

PPN Portal is not a health plan. It does not provide or pay for medical care. It does not issue health insurance or other health coverage.

4.2 Healthcare clearinghouse

PPN Portal does not process nonstandard health information received from another entity into a standard transaction format, nor does it receive standard transactions and convert them into nonstandard formats. It does not process claims, remittance advice, eligibility inquiries, or other HIPAA standard transactions.

4.3 Healthcare provider transmitting health information in standard transactions

PPN Portal does not diagnose, treat, prescribe, or otherwise provide healthcare to patients. It is a software platform used by healthcare providers. It does not transmit health information in connection with HIPAA-covered standard transactions.

Counsel is asked to confirm whether, under the facts described in this memorandum, PPN Portal should be analyzed as outside the Covered Entity definition.

5. BUSINESS ASSOCIATE ANALYSIS

PPN Portal understands that the more important question is whether it is a Business Associate with respect to customers who are themselves Covered Entities.

PPN Portal requests counsel’s analysis of whether the platform’s intended data model, two-layer pseudonymous subject-linking approach, operational boundaries, and supporting vendor stack are sufficient to avoid Business Associate status, or whether any aspect of the current system causes PPN Portal to create, receive, maintain, or transmit PHI on behalf of Covered Entities.

PPN Portal is not asking counsel to assume the answer. PPN Portal is asking counsel to evaluate the actual fact pattern.

6. DATA ELEMENTS INTENDED TO ENTER THE PLATFORM

The platform is intended to receive and store structured clinical and operational data of the following general types:

1. An internal canonical subject identifier, subject\_id, used by the database to link all clinical records for the same patient across sessions and related tables.  
2. A practitioner-facing pseudonymous display code in the format PT-XXXXXX, shown in the user interface as the ordinary patient reference.  
3. Structured clinical codes and controlled-vocabulary references.  
4. Treatment-related structured values.  
5. Dosage values and related structured numeric fields.  
6. Vital sign values and related structured safety fields.  
7. Outcome scores and assessment values.  
8. Session sequence and structured workflow values.  
9. Date-related fields used in the current application workflow, including session\_date.  
10. Practitioner account information used for authentication and platform access.  
11. Site and organization identifiers used for access scoping and reporting.  
12. Subscription and payment information handled through a third-party payment processor rather than ordinary clinical tables.

PPN Portal requests counsel’s analysis of whether these data elements, individually or in combination, could constitute PHI or otherwise create a reasonable basis to identify an individual in the context of HIPAA.

7. DATA ELEMENTS INTENDED TO BE EXCLUDED FROM THE IN-SCOPE CLINICAL DATA MODEL

The platform is intended not to transmit to or store in the in-scope clinical schema the following ordinary direct patient identifiers:

1. Patient legal name  
2. Patient date of birth  
3. Patient street address  
4. Patient phone number  
5. Patient email address  
6. Social Security Number  
7. Insurance identifiers  
8. Medical record number  
9. Free-text narrative patient identity fields  
10. Patient photographs and comparable direct identity media in ordinary clinical workflows

These exclusions are intended to be architectural constraints, not merely policy preferences. Counsel is asked to assess whether those exclusions, if accurate in production and in related operational systems, are sufficient to support the legal conclusions sought, or whether other retained elements still present re-identification or PHI risk.

The exclusion of direct patient identity fields should be read together with the two-layer subject-linking model described in Section 9\.

8. DATES, TIMES, AND TEMPORAL GRANULARITY

This is a specific issue on which PPN Portal requests focused legal analysis.

Although the platform is intended to exclude direct patient identity fields, the current application still retains certain date-related fields, including session\_date. PPN Portal is not asking counsel to assume that this issue has already been resolved by engineering.

PPN Portal requests counsel’s analysis of:

1. Whether retention of session\_date or any other date-related field prevents reliance on Safe Harbor.  
2. Whether the current date-related fields require a different legal framing, including Expert Determination or narrower use-boundary analysis.  
3. Whether certain date-related fields may remain acceptable for internal operational purposes while still requiring different treatment in exports, analytics, or public claims.  
4. Whether the current pseudonymized architecture materially reduces re-identification risk even where date-related fields remain.  
5. Whether additional suppression, generalization, year-only transformation, or restricted output rules are required.

PPN Portal understands that the engineering timeline for changing date-related fields is separate from the legal question of how those fields should be analyzed today.

9. PSEUDONYMOUS SUBJECT-LINKING ARCHITECTURE

PPN Portal uses a two-layer patient-linking workflow so that longitudinal continuity can exist across sessions without storing direct patient identity in ordinary clinical records.

Layer 1\. Internal canonical database identifier

The internal canonical identifier is subject\_id.

subject\_id is a system-generated integer value used as the database-level primary key for patient-level linkage across sessions and related clinical records.

subject\_id:

1. is generated by the system  
2. is not derived from patient name, date of birth, MRN, initials, phone number, email address, address, or any other patient attribute  
3. is not intended to encode any patient-identifying information  
4. is not ordinarily exposed to practitioners in the user interface as the patient reference

Layer 2\. Practitioner-facing display code

The practitioner-facing display code uses the format PT-XXXXXX, where the suffix is a 6-character alphanumeric value.

This display code is generated client-side at the point of patient creation and is the identifier ordinarily shown to practitioners in the user interface when referencing a patient.

The display code:

1. contains no patient-derived information  
2. is not intended to encode patient name, date of birth, MRN, initials, phone number, email address, address, or other direct patient identifiers  
3. is not intended to be reverse-engineered into real patient identity  
4. functions as the practitioner-facing pseudonymous patient reference within the platform workflow

Identity boundary

The practitioner holds the only mapping between the practitioner-facing display code and the real patient identity.

PPN Portal stores the internal canonical identifier and the practitioner-facing display code as part of the platform workflow, but does not use patient name, date of birth, MRN, or other direct patient identity as the ordinary patient-linking value in the in-scope clinical data model.

For purposes of counsel’s analysis, the controlling legal point is this:

1. subject\_id is the internal canonical database linkage key  
2. PT-XXXXXX is the practitioner-visible pseudonymous display code  
3. neither identifier is intended to contain a direct patient identifier or other HIPAA Safe Harbor identifier  
4. the real identity crosswalk is intended to remain with the practitioner outside the ordinary clinical data model

Counsel is asked to evaluate whether this implemented two-layer model is sufficient to support the legal position being asserted.

10. STRUCTURED INPUTS AND FREE-TEXT CONTROLS

PPN Portal is designed around structured data entry rather than open-ended narrative entry in ordinary clinical workflows. Clinical forms are intended to rely on controlled selections, enumerated values, sliders, checkboxes, reference-linked values, and structured score fields.

This is relevant because the platform is intended to reduce the risk that practitioners enter direct patient identifiers into ordinary clinical records. Counsel is nevertheless asked to consider whether any free-text fields, exception paths, support workflows, or exports alter that analysis.

11. OPERATIONAL METADATA, LOGS, VENDORS, AND NON-CORE SYSTEMS

PPN Portal requests that counsel’s analysis not be limited to user-facing clinical tables.

Specifically, counsel is asked to consider whether any of the following could result in PHI handling or otherwise affect the HIPAA analysis:

1. Authentication logs  
2. API or request logs  
3. Hosting and CDN logs  
4. Database access logs  
5. Backup and restore processes  
6. Support workflows and troubleshooting paths  
7. Email delivery systems  
8. Monitoring or observability tooling, if any  
9. Analytics tooling, if any  
10. Third-party vendors providing hosting, authentication, database, payment, logging, support, or communications functions

The current vendor set identified by PPN Portal is limited and currently includes Supabase, Vercel, Stripe, and Resend, with no separate analytics, error-tracking, or observability tools intentionally enabled in the reviewed environment. Counsel is asked to evaluate whether that current posture is material to the legal analysis.

12. PRODUCT POSITIONING AND FUNCTIONAL BOUNDARY

PPN Portal characterizes itself as a quality improvement, documentation, and benchmarking platform, not as an EHR and not as a clinical decision support system that directs care. This functional boundary is relevant to how PPN Portal understands its role, but PPN Portal does not ask counsel to treat product positioning language alone as dispositive.

PPN Portal explicitly is not intended to:

1. Provide treatment recommendations or direct clinical action  
2. Represent outputs as medical advice  
3. Generate CPT or ICD billing codes on behalf of practitioners  
4. Participate in billing or insurance transactions  
5. Function as the system of record for direct patient identity

Counsel is asked to flag any current or planned product features that materially blur this boundary.

13. CROSS-DOMAIN AGGREGATE DATA FLOW

If still in scope for counsel’s review, PPN Portal requests analysis of whether a cross-domain transfer consisting only of a non-identifying aggregate count from ppnportal.net to another PPN domain constitutes PHI or a disclosure of PHI.

For purposes of this question, the intended fact pattern is:

1. no patient-level record transfer  
2. no practitioner-level identity transfer  
3. no shared database  
4. no shared authentication system  
5. no live patient-level linkage between domains  
6. only a non-identifying aggregate count passed across domains

Counsel is asked to assess whether that fact pattern changes if small-cell counts, rare-scenario counts, or contextual factors increase re-identification risk.

14. ADDITIONAL REGULATORY ISSUE SPOTTING REQUESTED

In addition to core HIPAA questions, PPN Portal requests that counsel identify whether any of the following should be separately addressed:

1. 42 CFR Part 2, if any participating organizations create or maintain SUD patient records or otherwise qualify as Part 2 programs  
2. State privacy or health-data laws that may apply even if HIPAA does not  
3. Contracting or public-claims risk if PPN represents stronger conclusions than the present fact pattern supports  
4. Any product-boundary issue that could materially alter the legal analysis later  
5. SPECIFIC QUESTIONS FOR COUNSEL

PPN Portal requests counsel’s written analysis on the following questions:

1. Based on the facts described above, is PPN Portal a HIPAA Covered Entity?  
2. Based on the facts described above, is PPN Portal a HIPAA Business Associate with respect to any of its customers or workflows?  
3. Do the records stored in the in-scope environment constitute PHI under HIPAA, either individually or in combination with other reasonably available information?  
4. Does the current two-layer subject-linking architecture support de-identification analysis under Safe Harbor, Expert Determination, or neither?  
5. Do retained date-related fields, including session\_date, prevent reliance on Safe Harbor?  
6. Do any site-level, cohort-level, or rare-event characteristics create re-identification risk that should be addressed through Expert Determination, suppression, generalization, or other controls?  
7. Do any logs, vendors, backups, analytics tools, or support workflows create PHI exposure even if the primary clinical tables do not?  
8. Is a Business Associate Agreement required for any current workflow?  
9. Are any current public claims about HIPAA, BAAs, de-identification, benchmarking, or privacy too strong relative to the current fact pattern?  
10. What additional technical or contractual materials, if any, are necessary before counsel could issue a reliable written opinion?  
11. SUPPORTING DOCUMENTATION AVAILABLE OR TO BE PREPARED

PPN Portal can provide the following to support counsel’s review:

1. Current HIPAA applicability review packet  
2. Technical declaration from lead developer  
3. Current field-level schema inventory  
4. Data flow diagram  
5. Sample synthetic database output  
6. Vendor and subprocessor summary  
7. Current public-claims crosswalk  
8. Current authentication, access-control, and Row Level Security summary  
9. Any current screenshots or form examples needed to clarify real workflow boundaries  
10. TRADE SECRET AND CONFIDENTIALITY HANDLING

PPN Portal prefers not to disclose source code, cryptographic implementation details, proprietary schema design beyond what is reasonably necessary, or detailed business logic unless counsel determines that such detail is necessary for a reliable legal opinion.

If additional protected technical detail is required, PPN Portal requests that it be handled under an appropriate confidentiality arrangement and restricted-access review process.

18. CERTIFICATION

PPN Portal submits this memorandum as a good-faith factual summary for purposes of obtaining legal advice. PPN Portal requests that counsel identify any factual gaps, assumptions, ambiguities, or missing materials that should be corrected before counsel issues any written opinion.

Signed:

Trevor Calton  
Co-Founder, PPN Portal

Jason Bluth  
Co-Founder, PPN Portal

# **Appendices**

# **Appendices**

## **Appendix Index**

Yes. Below is one continuous, paste-ready Appendix Pack in a single format, with the two-layer identifier model already integrated and no historical or superseded references.

Use this as the replacement Appendix Pack.

APPENDIX PACK  
PPN PORTAL HIPAA COUNSEL REVIEW MATERIALS

Prepared for: Legal Counsel and Authorized Recipients  
Prepared by: PPN Portal, LLC  
Date: March 2026  
Version: 1.0  
Status: Draft for Counsel Review  
Classification: Confidential

APPENDIX INDEX

Appendix A. Document Control and Scope Statement  
Appendix B. Technical Declaration  
Appendix C. Current Schema Snapshot and Field Inventory  
Appendix D. Canonical Subject Identifier Workflow  
Appendix E. Data Flow Diagram and Narrative  
Appendix F. Operational Metadata and Logging Boundaries  
Appendix G. Vendor and Subprocessor Summary  
Appendix H. Authentication, Access Control, and RLS Summary  
Appendix I. Sample Synthetic Database Output  
Appendix J. Export and Benchmarking Boundaries  
Appendix K. Public Claims Crosswalk  
Appendix L. Trade Secret Boundary Statement  
Appendix M. Open Questions for Counsel  
Appendix N. Evidence Map

APPENDIX A  
DOCUMENT CONTROL AND SCOPE STATEMENT

Document Title: PPN Portal HIPAA Counsel Review Appendix Pack  
Document Version: 1.0  
Prepared Date: March 2026  
Prepared By: Trevor Calton, Co-Founder, PPN Portal  
Reviewed By: Jason Bluth, Co-Founder, PPN Portal  
Environment Under Review: Production (ppnportal.net)  
Schema Snapshot Date: March 2026 (current as of preparation date)  
Reference Packet: PPN Portal HIPAA Applicability Review Packet  
Reference Memorandum: Technical Memorandum for Legal Counsel, HIPAA Applicability Analysis

Purpose

This appendix pack supports legal review of the current implemented architecture of ppnportal.net.

Scope

This appendix pack is intended to document the current technical and operational fact pattern relevant to:

1. HIPAA applicability  
2. Covered Entity analysis  
3. Business Associate analysis  
4. de-identification analysis  
5. vendor and metadata boundaries  
6. export and benchmarking boundaries  
7. public claims alignment

Out of Scope

Unless expressly stated, this appendix pack does not describe:

1. deprecated workflows  
2. superseded schema versions  
3. abandoned design concepts  
4. unrelated domains  
5. roadmap concepts not currently implemented

Source-of-Truth Rule

If any narrative statement in the packet conflicts with the current in-scope schema snapshot, direct engineering verification, or current live configuration review, the current schema snapshot and engineering verification control.

APPENDIX B  
TECHNICAL DECLARATION

I, Trevor Calton, serve as Co-Founder and Chief Technology Officer for PPN Portal and have direct knowledge of the application architecture, schema, and implemented environment under review.

I declare the following to the best of my knowledge as of the date below:

1. The schema reviewed for this appendix pack is the current schema for the environment identified in Appendix A.  
2. The field inventory attached as Appendix C accurately reflects the current in-scope schema snapshot.  
3. Direct patient identifiers such as patient name, date of birth, patient phone number, patient email address, Social Security Number, address, and medical record number are not intended to be stored in the in-scope clinical data model, subject to the field-level inventory provided in Appendix C.  
4. The current subject-linking workflow is described in Appendix D.  
5. The vendor and subprocessor list provided in Appendix G is accurate to the best of my knowledge for the current in-scope environment.  
6. The access-control, site-scoping, and Row Level Security summary in Appendix H accurately reflects the intended current platform posture.  
7. The operational metadata and logging summary in Appendix F is accurate to the best of my knowledge for the reviewed environment.  
8. This declaration is limited to technical and operational facts and does not offer legal conclusions.

Signed: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
Title: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
Date: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

APPENDIX C  
CURRENT SCHEMA SNAPSHOT AND FIELD INVENTORY

Purpose

This appendix provides the current field-level inventory for the in-scope environment so counsel can evaluate what data elements are actually present.

Instructions

For each field, list:

1. table name  
2. column name  
3. data type  
4. nullable, yes or no  
5. functional category  
6. appears in exports, yes or no  
7. appears in analytics, yes or no  
8. notes relevant to de-identification analysis

Functional Categories

Use one of the following categories:

1. direct identifier  
2. pseudonymous identifier  
3. clinical data  
4. operational metadata  
5. administrative data  
6. free text  
7. account data  
8. vendor-linked data

Field Inventory Table

Note: Fields listed below are sourced from the current implemented migration set (migrations/000–013 and 050 series) as of March 2026. This inventory covers the primary in-scope clinical and operational tables. Reference tables (ref_*) contain controlled vocabulary only and are not directly patient-linked.

| Table Name | Column Name | Data Type | Nullable | Functional Category | In Exports | In Analytics | Notes |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| log_clinical_records | clinical_record_id | BIGSERIAL | No | pseudonymous identifier | No | No | Internal database PK |
| log_clinical_records | site_id | BIGINT | Yes | administrative data | No | Yes | Site-scoped access boundary |
| log_clinical_records | subject_id | BIGINT | Yes | pseudonymous identifier | Yes (research CSV) | Yes | Internal canonical database linkage key — not patient name or DOB |
| log_clinical_records | patient_link_code | TEXT | Yes | pseudonymous identifier | No | No | Legacy field; PT-XXXXXX display code |
| log_clinical_records | substance_id | BIGINT | Yes | clinical data | Yes | Yes | FK to ref_substances controlled vocabulary |
| log_clinical_records | session_number | INTEGER | Yes | clinical data | Yes | Yes | Ordinal sequence, not a date |
| log_clinical_records | session_date | DATE | Yes | operational metadata | Yes (research CSV) | Yes | **Open legal issue — date field retained for app function; counsel review required** |
| log_clinical_records | dosage_mg | DECIMAL(6,2) | Yes | clinical data | Yes | Yes | Structured numeric |
| log_clinical_records | dosage_route | VARCHAR(20) | Yes | clinical data | Yes | Yes | Controlled vocabulary |
| log_clinical_records | meq30_score | INTEGER | Yes | clinical data | Yes | Yes | 0–100 structured score |
| log_clinical_records | edi_score | INTEGER | Yes | clinical data | No | Yes | 0–100 structured score |
| log_clinical_records | ceq_score | INTEGER | Yes | clinical data | No | Yes | 0–100 structured score |
| log_clinical_records | session_notes | TEXT | Yes | free text | No | No | **Free-text field — potential direct identifier risk if misused; counsel should note** |
| log_clinical_records | created_by | UUID | Yes | account data | No | No | Practitioner user UUID (not patient) |
| log_clinical_records | created_at | TIMESTAMPTZ | No | operational metadata | No | No | System timestamp |
| log_safety_events | safety_event_id | BIGSERIAL | No | pseudonymous identifier | No | No | Internal PK |
| log_safety_events | site_id | BIGINT | Yes | administrative data | No | Yes | Site-scoped access boundary |
| log_safety_events | subject_id | BIGINT | Yes | pseudonymous identifier | No | Yes | Internal canonical linkage key |
| log_safety_events | event_type | VARCHAR(50) | Yes | clinical data | No | Yes | Structured category |
| log_safety_events | meddra_code_id | INTEGER | Yes | clinical data | No | Yes | FK to ref_meddra_codes controlled vocabulary |
| log_safety_events | severity_grade_id | BIGINT | Yes | clinical data | No | Yes | FK to controlled vocabulary |
| log_safety_events | event_description | TEXT | Yes | free text | No | No | **Free-text field — potential direct identifier risk; counsel should note** |
| log_safety_events | occurred_at | TIMESTAMPTZ | Yes | operational metadata | No | No | **Date-related field — counsel review required** |
| log_session_vitals | session_vital_id | SERIAL | No | pseudonymous identifier | No | No | Internal PK |
| log_session_vitals | session_id | UUID | No | pseudonymous identifier | No | No | FK to log_clinical_records — no direct patient identity |
| log_session_vitals | recorded_at | TIMESTAMP | No | operational metadata | No | No | **Date-related field — counsel review required** |
| log_session_vitals | heart_rate | INTEGER | Yes | clinical data | No | Yes | Structured numeric |
| log_session_vitals | bp_systolic | INTEGER | Yes | clinical data | No | Yes | Structured numeric |
| log_session_vitals | bp_diastolic | INTEGER | Yes | clinical data | No | Yes | Structured numeric |
| log_session_vitals | oxygen_saturation | INTEGER | Yes | clinical data | No | Yes | Structured numeric |
| log_baseline_assessments | baseline_assessment_id | SERIAL | No | pseudonymous identifier | No | No | Internal PK |
| log_baseline_assessments | patient_id | VARCHAR(10) | No | pseudonymous identifier | No | Yes | PT-XXXXXX practitioner-facing display code |
| log_baseline_assessments | site_id | UUID | Yes | administrative data | No | Yes | Site-scoped boundary |
| log_baseline_assessments | assessment_date | TIMESTAMP | No | operational metadata | No | No | **Date-related field — counsel review required** |
| log_baseline_assessments | phq9_score | INTEGER | Yes | clinical data | Yes | Yes | 0–27 validated scale |
| log_baseline_assessments | gad7_score | INTEGER | Yes | clinical data | Yes | Yes | 0–21 validated scale |
| log_baseline_assessments | ace_score | INTEGER | Yes | clinical data | No | Yes | 0–10 validated scale |
| log_baseline_assessments | pcl5_score | INTEGER | Yes | clinical data | Yes | Yes | 0–80 validated scale |
| log_baseline_assessments | resting_hrv | DECIMAL(5,2) | Yes | clinical data | No | Yes | Structured numeric |
| log_baseline_assessments | resting_bp_systolic | INTEGER | Yes | clinical data | No | Yes | Structured numeric |
| log_longitudinal_assessments | patient_id | VARCHAR(10) | No | pseudonymous identifier | No | Yes | PT-XXXXXX display code |
| log_longitudinal_assessments | assessment_date | DATE | No | operational metadata | No | No | **Date-related field — counsel review required** |
| log_longitudinal_assessments | days_post_session | INTEGER | Yes | clinical data | Yes | Yes | Relative integer, not an absolute date |
| log_longitudinal_assessments | phq9_score | INTEGER | Yes | clinical data | Yes | Yes | 0–27 validated scale |
| log_longitudinal_assessments | gad7_score | INTEGER | Yes | clinical data | Yes | Yes | 0–21 validated scale |
| log_outcomes | subject_id | BIGINT | Yes | pseudonymous identifier | No | Yes | Internal canonical linkage key |
| log_outcomes | outcome_measure | TEXT | Yes | clinical data | No | Yes | Structured measure label |
| log_outcomes | outcome_score | INTEGER | Yes | clinical data | No | Yes | Structured numeric |
| log_outcomes | observed_at | TIMESTAMPTZ | Yes | operational metadata | No | No | **Date-related field — counsel review required** |
| log_consent | subject_id | BIGINT | Yes | pseudonymous identifier | No | No | Internal canonical linkage key |
| log_consent | consent_type | TEXT | Yes | clinical data | No | No | Structured category |
| log_consent | is_consented | BOOLEAN | Yes | clinical data | No | No | Boolean flag |
| log_consent | verified_at | TIMESTAMPTZ | Yes | operational metadata | No | No | **Date-related field — counsel review required** |
| log_red_alerts | patient_id | VARCHAR(10) | No | pseudonymous identifier | No | No | PT-XXXXXX display code |
| log_red_alerts | alert_type | VARCHAR(50) | No | clinical data | No | No | Structured category |
| log_red_alerts | alert_severity | VARCHAR(20) | No | clinical data | No | No | Structured severity |
| log_red_alerts | alert_triggered_at | TIMESTAMP | No | operational metadata | No | No | **Date-related field — counsel review required** |
| log_red_alerts | response_notes | TEXT | Yes | free text | No | No | **Free-text field — potential direct identifier risk; counsel should note** |

Required Review Notes

1. Identify any remaining date-related field, including session\_date.  
2. Identify any free-text field.  
3. Identify any field exposed in exports.  
4. Identify any field visible to practitioners in the UI.  
5. Identify any field used only internally.  
6. Identify both layers of the subject-linking model, if present.

Closing Note

Field classification is descriptive only and does not state a legal conclusion.

APPENDIX D  
CANONICAL SUBJECT IDENTIFIER WORKFLOW

Purpose

This appendix describes the current implemented patient-linking workflow used by PPN Portal to maintain longitudinal continuity across sessions without storing direct patient identity in the ordinary clinical data model.

Overview

PPN Portal uses a two-layer identifier model:

1. an internal canonical database identifier used internally by the platform  
2. a practitioner-facing display code used in the user interface

These two layers serve different purposes and should not be treated as interchangeable.

Layer 1\. Internal Canonical Database Identifier

The internal canonical identifier is subject\_id.

subject\_id is a system-generated integer value used as the database-level primary key for patient-level linkage across sessions and related clinical records.

subject\_id:

1. is generated by the system  
2. is not derived from patient name, date of birth, MRN, initials, phone number, email address, address, or any other patient attribute  
3. is not intended to encode any patient-identifying information  
4. is not ordinarily exposed to practitioners in the user interface as the patient reference

Layer 2\. Practitioner-Facing Display Code

The practitioner-facing display code uses the format PT-XXXXXX, where the suffix is a 6-character alphanumeric value.

This display code is generated client-side at the point of patient creation and is the identifier ordinarily shown to practitioners in the user interface when referencing a patient.

The display code:

1. contains no patient-derived information  
2. is not intended to encode patient name, date of birth, MRN, initials, phone number, email address, address, or other direct patient identifiers  
3. is not intended to be reverse-engineered into real patient identity  
4. functions as the practitioner-facing pseudonymous patient reference within the platform workflow

Mapping and Identity Boundary

The practitioner holds the only mapping between the practitioner-facing display code and the real patient identity.

PPN Portal stores the internal canonical identifier and the practitioner-facing display code as part of the platform workflow, but does not use patient name, date of birth, MRN, or other direct patient identity as the ordinary patient-linking value in the in-scope clinical data model.

What the Platform Stores

Within the current implemented architecture, PPN Portal stores:

1. the internal canonical identifier, subject\_id  
2. the practitioner-facing display code, PT-XXXXXX  
3. structured clinical and operational records linked through the internal canonical identifier

What the Platform Does Not Use as the Identifier

The platform does not use any of the following as the patient-linking identifier in the ordinary clinical data model:

1. patient legal name  
2. date of birth  
3. medical record number  
4. Social Security Number  
5. patient phone number  
6. patient email address  
7. street address  
8. insurance identifier  
9. initials

Cross-Site Identity Statement

This workflow is intended to support patient continuity within the implemented platform structure. This appendix does not represent that the same real-world patient is linked across unrelated sites by direct identity. Any legal significance of cross-site linkage, if applicable, should be evaluated by counsel based on the actual implemented data model and access boundaries.

Canonical Statement for Legal Materials

For all legal, technical, and public-facing materials, the controlling description is:

PPN Portal uses a two-layer patient-linking model consisting of an internal system-generated database identifier, subject\_id, and a practitioner-facing pseudonymous display code in the format PT-XXXXXX. The internal identifier is the canonical database linkage key. The display code is the practitioner-visible reference used in the UI. Neither identifier is derived from patient name, date of birth, or other direct patient identity.

APPENDIX E  
DATA FLOW DIAGRAM AND NARRATIVE

Purpose

This appendix describes what data enters the system, what systems process it, and what outputs leave the system.

Inbound Data Paths

1. practitioner account creation and login  
2. structured clinical form entry  
3. site and organization configuration  
4. subscription and payment events  
5. support-related interactions, if any

Primary System Components

1. practitioner browser or device  
2. frontend application  
3. authentication system  
4. hosting environment  
5. database and backend layer  
6. email delivery vendor  
7. payment processor  
8. administrative support path  
9. export generation path  
10. benchmarking output path

Outbound Data Paths

1. user-visible dashboards  
2. site-scoped reports  
3. authorized exports  
4. aggregate benchmarking outputs  
5. cross-domain aggregate counts, if applicable

Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PPN PORTAL DATA FLOW DIAGRAM                         │
│                         March 2026 · Draft for Counsel Review               │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────┐
  │  PRACTITIONER BROWSER/DEVICE │  ← Structured clinical form entry
  │  (Client-Side Only)          │    PT-XXXXXX display code visible here
  │                              │    Direct patient identity remains here
  │  PT-XXXXXX generated here    │    (not transmitted to PPN)
  └──────────────┬───────────────┘
                 │
                 │  HTTPS (structured JSON payload)
                 │  No patient name, DOB, SSN, MRN, address
                 │  Contains: PT-XXXXXX, structured clinical fields
                 │
                 ▼
  ┌──────────────────────────────┐
  │  VERCEL (Frontend Hosting)   │  ← Application delivery
  │  Hosting + CDN layer         │    May generate: request logs, IP logs,
  │  SOC 2 compliant             │    CDN metadata (practitioner-linked,
  │                              │    not patient-linked at clinical level)
  └──────────────┬───────────────┘
                 │
                 │  Authenticated API requests
                 │
                 ▼
  ┌──────────────────────────────┐
  │  SUPABASE                    │  ← Database + Authentication
  │  Database (PostgreSQL)       │    Stores: subject_id (canonical),
  │  Auth (Supabase Auth)        │      PT-XXXXXX, structured clinical data,
  │  RLS enforced on all         │      session_date (open legal issue),
  │  clinical log_* tables       │      practitioner account data
  │  SOC 2 Type II compliant     │    RLS: site-scoped access enforced
  │  PITR backup managed by      │    Backup: Supabase-managed PITR
  │  Supabase                    │    No separate PPN internal backup
  └──────────────┬───────────────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
  ┌────────────┐  ┌───────────────────────────────────────┐
  │   RESEND   │  │  STRIPE                               │
  │Transactional│  │  Subscription and payment processing  │
  │email vendor │  │  PCI DSS Level 1 compliant            │
  │Practitioner │  │  Payment card data handled by Stripe  │
  │account email│  │  Not stored in PPN clinical database  │
  └────────────┘  └───────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────────────────┐
  │  OUTBOUND DATA PATHS                                                      │
  │                                                                           │
  │  Dashboard views       → Site-scoped, practitioner-authenticated          │
  │  Site-scoped reports   → Practitioner-visible, site-bounded               │
  │  Research CSV export   → Includes subject_id, session_date, age_group,    │
  │                          assessment scores, MedDRA-coded adverse events    │
  │                          (subject_id and session_date present — counsel    │
  │                          review required for export de-id posture)         │
  │  Aggregate benchmarks  → Network-level aggregate counts, no subject-level  │
  │                          records in benchmarking view layer                │
  └──────────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────────────────┐
  │  IDENTITY BOUNDARY                                                        │
  │                                                                           │
  │  The practitioner holds the only mapping:                                 │
  │  PT-XXXXXX display code  ←→  Real patient identity                        │
  │                                                                           │
  │  PPN Portal stores:  subject_id + PT-XXXXXX + structured clinical data    │
  │  PPN Portal does NOT store: patient name, DOB, SSN, MRN, address,        │
  │                             phone, email, insurance identifiers            │
  └──────────────────────────────────────────────────────────────────────────┘
```

Narrative Notes

Practitioner Browser or Device  
The practitioner interacts with the platform through a browser-based interface. Structured clinical input begins here. The practitioner-facing display code PT-XXXXXX is visible in the UI. Direct patient identity is intended to remain outside the ordinary clinical data model.

Frontend Application  
The frontend presents structured forms, dashboards, and reporting views. It displays the practitioner-facing display code and submits authorized workflow data to the backend.

Authentication System  
Authentication is used to identify authorized users and enforce access control. Practitioner account information may include user-level identity and site membership.

Hosting Environment  
The hosting layer delivers the application to authenticated users and may generate operational request metadata relevant to legal review.

Database and Backend Layer  
The backend stores structured clinical and operational records. Clinical continuity is maintained through subject\_id as the internal canonical linkage key. The practitioner-facing display code may also be stored as part of the workflow.

Email Delivery Vendor  
Transactional email events such as account-related messages may be processed through the designated email provider.

Payment Processor  
Subscription and payment information may be processed through the designated payment vendor and is not intended to be stored in ordinary clinical tables.

Administrative Support Path  
Administrative or support functions, if any, may involve access to account or workflow information and should be evaluated separately from ordinary clinical tables.

Export Generation Path  
Authorized exports may produce site-scoped operational or reporting outputs. The specific field set and any date-related content should be documented in Appendix J.

Benchmarking Output Path  
Aggregate outputs may be produced for benchmarking or comparative views. Suppression, aggregation, and output rules should be documented in Appendix J.

APPENDIX F  
OPERATIONAL METADATA AND LOGGING BOUNDARIES

Purpose

This appendix identifies non-clinical operational systems that may create or retain metadata relevant to legal review.

Categories Reviewed

1. authentication logs  
2. application request logs  
3. hosting or CDN logs  
4. database logs  
5. backup and recovery logs  
6. email event logs  
7. support and administrative access logs  
8. error reporting or observability systems  
9. analytics systems, if any

Operational Metadata Inventory

| Category | Exists | Vendor | Data Elements Potentially Present | Retention if Known | Patient-Linked Risk Notes |
| ----- | ----- | ----- | ----- | ----- | ----- |
| Authentication logs | Yes | Supabase (Auth) | User UUID, email address (practitioner), timestamp, IP address, session token | Per Supabase data retention policy | Practitioner-linked, not patient-linked at the clinical level. No patient identity fields in auth path. |
| Application request logs | Yes | Vercel | IP address, request path, timestamp, HTTP status, user-agent | Per Vercel infrastructure policy | Practitioner-linked. Could theoretically link a practitioner session to a request path. Counsel should evaluate. |
| Hosting or CDN logs | Yes | Vercel | IP address, request metadata, CDN cache events | Per Vercel infrastructure policy | No clinical data in CDN layer. Metadata is practitioner-session-linked, not patient-linked at data model level. |
| Database logs | Yes (via Supabase) | Supabase | Query logs, access events, schema change events | Per Supabase data retention policy; PITR available | Contains structured clinical data queries. Direct patient identity fields not in schema but subject_id and session_date present. |
| Backup and recovery logs | Yes | Supabase (managed PITR) | Full database state including all log_* tables at point-in-time | Per Supabase PITR retention window (typically 7 days default) | Backs up subject_id, session_date, and all clinical records. No separate PPN-internal backup system. Counsel should evaluate backup scope. |
| Email event logs | Yes | Resend | Practitioner email address, message type, delivery timestamp, delivery status | Per Resend data retention policy | Practitioner email only. No patient identity in email content per platform design. |
| Support access logs | Limited | Internal (no dedicated tooling confirmed) | Access details if support workflows exist | Not formally documented | If support staff access production data, this path should be documented separately. Counsel should inquire. |
| Error reporting or observability | No | None intentionally enabled | N/A | N/A | No separate error-tracking or observability tool (e.g., Sentry, Datadog) is intentionally configured in the reviewed environment. |
| Analytics systems | No | None intentionally enabled | N/A | N/A | No separate analytics tool (e.g., Mixpanel, Amplitude, Google Analytics) is intentionally configured in the reviewed environment. |

Notes

This appendix should distinguish clearly between:

1. data stored in the clinical schema  
2. operational metadata held by infrastructure or service providers  
3. data visible to PPN staff or support personnel  
4. data visible only within third-party vendor systems

APPENDIX G  
VENDOR AND SUBPROCESSOR SUMMARY

Purpose

This appendix identifies the third-party vendors in the current in-scope service path and the categories of data they may touch.

Current Vendor Set

The current in-scope service path includes:

1. Supabase  
2. Vercel  
3. Stripe  
4. Resend

Vendor Summary Table

| Vendor | Function | Categories of Data Accessible | In Direct Clinical Path | Operational Metadata Risk | DPA or Equivalent | Notes |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Supabase | Database and authentication infrastructure | All in-scope clinical and operational data; practitioner account data; auth events; PITR backups | Yes — all clinical log_* tables reside here | High — holds full schema including subject_id, session_date, and all structured clinical records | Supabase DPA / SOC 2 Type II | Primary data custodian. RLS enforced at database layer. |
| Vercel | Frontend hosting and deployment | Frontend application code; request metadata; IP addresses; CDN logs | No clinical data stored by Vercel | Moderate — request logs may link practitioner sessions to request paths | Vercel DPA / SOC 2 | No patient clinical data stored in Vercel layer. |
| Stripe | Subscription and payment processing | Practitioner subscription status; payment method tokens; billing email | No — payment processing is outside the clinical data path | Low — practitioner billing data only; no clinical data accessible | Stripe DPA / PCI DSS Level 1 | Full payment card data handled by Stripe; not stored in PPN application database. |
| Resend | Transactional email delivery | Practitioner email address; email delivery events; message content for account emails | No — email delivery is outside the clinical data path | Low — practitioner email only; no patient identity in email content per platform design | Resend DPA | No patient clinical data in email delivery path. |

Additional Note: No separate analytics, error-tracking, or observability tools are intentionally enabled in the reviewed environment. The vendor footprint is limited to the four vendors listed above.

Additional Note

If no separate analytics, error-tracking, or observability tools are intentionally enabled in the reviewed environment, state that clearly here.

APPENDIX H  
AUTHENTICATION, ACCESS CONTROL, AND RLS SUMMARY

Purpose

This appendix summarizes how access is controlled within the in-scope environment.

Current Architecture Summary

1. practitioner access is authenticated  
2. site membership is used to scope user access  
3. access is role-based  
4. site-level boundaries are enforced through application logic and Row Level Security or equivalent database-layer restrictions  
5. production access is limited to authorized personnel only

Role Summary Table

Note: Two role systems coexist in the current schema. The clinical access roles (network_admin, site_admin, clinician, analyst, auditor) are used in the log_user_sites access-control table and RLS policies. The subscription tier roles (owner, partner_free, partner_paid, user_pro, user_premium, user_enterprise, etc.) exist in ref_user_roles and govern platform access level, not clinical data access scope.

| Role | Can View Site Data | Can Edit Site Data | Can Export | Can Administer Site Settings | Notes |
| ----- | ----- | ----- | ----- | ----- | ----- |
| network_admin | Yes — all sites | Yes — all sites | Yes | Yes | Highest privilege; cross-site access |
| site_admin | Yes — own site only | Yes — own site only | Yes | Yes | Site-scoped administrator |
| clinician | Yes — own site only | Yes — own site only | Limited | No | Primary data entry role |
| analyst | Yes — own site only | No | Yes | No | Read and export; no write access |
| auditor | Yes — own site only | No | No | No | Read-only; no export or write access |

Key RLS Summary Table

| Table or Table Family | Site Scoped | Practitioner Scoped | Notes |
| ----- | ----- | ----- | ----- |
| log_clinical_records | Yes | No (site-level) | RLS enabled; site_id in (SELECT site_id FROM log_user_sites WHERE user_id = auth.uid()) |
| log_safety_events | Yes | No (site-level) | RLS enabled; access via session linkage to log_clinical_records |
| log_session_vitals | Yes | No (site-level) | RLS enabled; access via session_id FK to log_clinical_records |
| log_baseline_assessments | Yes | No (site-level) | RLS enabled; patient_id scoped through site membership |
| log_longitudinal_assessments | Yes | No (site-level) | RLS enabled; patient_id scoped through site membership |
| log_pulse_checks | Yes | No (site-level) | RLS enabled; patient_id scoped through site membership |
| log_behavioral_changes | Yes | No (site-level) | RLS enabled; patient_id scoped through site membership |
| log_integration_sessions | Yes | No (site-level) | RLS enabled; patient_id scoped through site membership |
| log_red_alerts | Yes | No (site-level) | RLS enabled; patient_id scoped through site membership |
| log_outcomes | Yes | No (site-level) | RLS enabled |
| log_consent | Yes | No (site-level) | RLS enabled |
| log_user_sites | Yes | Yes (own record) | RLS: user_id = auth.uid() — each user sees only their own site memberships |
| ref_* (all reference tables) | No — read-only for all authenticated users | No | Controlled vocabulary; no patient data; authenticated read access only |

Production Access Note: Production database access is managed through Supabase. Direct SQL access to the production database is restricted to authorized administrators. No patient-record access is routine for engineering staff. All access is subject to Supabase's access control and logging systems.

Production Access Note

Document:

1. who can query production directly  
2. whether support staff can impersonate users  
3. whether administrators can see all site records  
4. whether access is logged

APPENDIX I  
SAMPLE SYNTHETIC DATABASE OUTPUT

Purpose

This appendix provides synthetic examples of the kinds of records stored and produced by the platform so counsel can see structure without relying on actual patient or practitioner data.

Included Samples

1. example clinical session record  
2. example longitudinal assessment record  
3. example safety event record  
4. example structured observation record  
5. example site-scoped export row  
6. example aggregate benchmark row

Required Note

All values in this appendix are synthetic and are provided solely for structural review.

Example Clinical Session Record

| Field | Example Value | Notes |
| ----- | ----- | ----- |
| subject\_id | 10452 | Internal canonical database identifier |
| patient\_display\_code | PT-X9L2M4 | Practitioner-facing display code |
| session\_number | 3 | Structured clinical sequence |
| session\_date | 2026-03-14 | Include only if current schema still retains this field |
| status | completed | Example structured status |
| site\_id | 17 | Site-scoped access value |

Example Longitudinal Assessment Record

| Field | Example Value | Notes |
| ----- | ----- | ----- |
| subject\_id | 10452 | Internal canonical database identifier |
| assessment\_type | PHQ9 | Example structured assessment |
| score\_value | 11 | Example score |
| recorded\_at | \[insert if current schema retains\] | Use only if current schema includes it |

Example Safety Event Record

| Field | Example Value | Notes |
| ----- | ----- | ----- |
| subject\_id | 10452 | Internal canonical database identifier |
| event\_type | nausea | Structured event category |
| severity | moderate | Structured severity field |
| action\_taken | observation | Structured response field |

Example Site-Scoped Export Row

| Field | Example Value | Notes |
| ----- | ----- | ----- |
| patient\_display\_code | PT-X9L2M4 | Include only if present in exports |
| session\_number | 3 | Example structured sequence |
| site\_id | 17 | Example site boundary |
| outcome\_delta | 5 | Example derived value |

Example Aggregate Benchmark Row

| Field | Example Value | Notes |
| ----- | ----- | ----- |
| cohort\_label | ketamine\_followup\_window | Example cohort label |
| subject\_count | 42 | Aggregate only |
| median\_delta | 4 | Aggregate metric |
| site\_identifier | \[insert if used\] | Document boundary clearly |

APPENDIX J  
EXPORT AND BENCHMARKING BOUNDARIES

Purpose

This appendix describes what data leaves the platform, at what granularity, and under what output boundary.

Output Categories

1. site-scoped operational exports  
2. site-scoped reporting outputs  
3. aggregate benchmark outputs  
4. aggregate flow and compliance views  
5. cross-domain aggregate transfers, if applicable

Questions This Appendix Should Answer

1. What fields appear in standard exports?  
2. What fields are excluded from exports?  
3. Do any exports include subject\_id or PT-XXXXXX?  
4. Are aggregate benchmark outputs site-level, network-level, or both?  
5. Is small-sample suppression used anywhere?  
6. Are there output differences between internal platform use and downloadable export files?

Output Boundary Table

| Output Type | Intended Audience | Includes subject\_id | Includes PT-XXXXXX | Includes Dates | Includes Site Identifier | Suppression or Generalization Notes |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Research CSV export (exportResearchCSV) | Authorized practitioner or researcher | Yes — subject_id is first column in export | No | Yes — session_date is included as a column | No direct site_id in export row; site scoping controls which records are visible prior to export | **Counsel review required.** subject_id and session_date are both present in research export. No small-sample suppression rule is currently implemented in this path. |
| Site-scoped dashboard views | Authenticated practitioner (own site only) | Yes — records are linked via subject_id in backend | Yes — PT-XXXXXX displayed in practitioner-facing UI | Yes — session_date visible in session timeline views | Yes — session records visible only within practitioner's site | Site-scoped by RLS. No export from dashboard without using export path. |
| Aggregate benchmarking outputs | Authenticated practitioner (network averages) | No — aggregate counts only; no subject-level records in benchmarking view | No | No direct dates in aggregate outputs | Site identifier may appear as a label in site-level comparisons | Aggregate-level only. Small-sample suppression rule not formally documented. Counsel should evaluate. |
| PDF/compliance exports | Authorized practitioner | Yes — subject_id or PT-XXXXXX may appear in practitioner-facing PDF reports | Yes — PT-XXXXXX is the patient reference used in practitioner-visible reports | Yes — session dates appear in compliance-style exports | Yes — site context included | Data mirrors what is visible in the platform. subject_id and session_date present. Counsel review recommended. |
| Administrative support path | Authorized PPN staff (if support access occurs) | Yes — if support staff access production records | Yes — if support staff access production records | Yes | Yes | Not formally documented. Counsel should inquire about support access paths and whether they create PHI exposure even if clinical tables exclude direct patient identity. |

Required Notes

1. If session\_date appears anywhere in exports, say so explicitly.  
2. If subject\_id is internal-only and never exported, say so explicitly.  
3. If PT-XXXXXX appears in exports, state where and why.  
4. If benchmark outputs use small-sample suppression, identify the rule.

APPENDIX K  
PUBLIC CLAIMS CROSSWALK

Purpose

This appendix maps public-facing privacy and HIPAA-related claims to the technical evidence available and identifies which claims should be retained, softened, or held pending counsel review.

Review Table

| Public Claim | Source Document | Supporting Technical Evidence | Status | Owner | Notes |
| ----- | ----- | ----- | ----- | ----- | ----- |
| "Patient name is not stored in the core clinical data model" | DataPolicy.tsx, PrivacyPolicy.tsx, public HIPAA overview | Schema confirms no patient_name column in any log_* table | Supported | Trevor Calton | Subject to schema confirmation against current production state |
| "Date of birth is not stored in the core clinical data model" | DataPolicy.tsx, PrivacyPolicy.tsx | Schema confirms no date_of_birth column in any log_* table; age stored as range band | Supported | Trevor Calton | Subject to schema confirmation |
| "SSN, MRN, address, phone, email not stored in clinical schema" | DataPolicy.tsx, PrivacyPolicy.tsx | Schema confirms none of these fields present in log_* tables | Supported | Trevor Calton | Subject to schema confirmation |
| "Patient records use pseudonymous linkage (two-layer model: subject_id + PT-XXXXXX)" | Legal packet, memorandum, public HIPAA overview, PrivacyPolicy.tsx | Confirmed in schema (subject_id BIGINT in log_clinical_records; patient_id VARCHAR(10) for PT-XXXXXX in log_baseline_assessments) | Supported | Trevor Calton | Canonical description now consistent across all documents |
| "RLS enforced on all clinical tables" | Legal packet Section 2, Appendix H | Confirmed in migration 050 — RLS enabled and policies created on all log_* tables | Supported | Trevor Calton | Verified in migration files |
| "Vendor footprint: Supabase, Vercel, Stripe, Resend; no analytics or observability tooling" | Legal packet, memorandum Section 11, Appendix G | No analytics or observability migration or configuration found in schema or codebase review | Supported | Trevor Calton | Verify against current environment config before counsel submission |
| "Formal legal review is in progress" | Public HIPAA overview, PrivacyPolicy.tsx | This packet is the formal counsel submission; language is accurate | Supported | Trevor Calton | Language correctly calibrated |
| "HIPAA does not apply" | Prior public materials (now revised or being revised) | Not supported by current fact pattern pending counsel review | Remove | Trevor Calton | Being replaced in public materials per revised posture |
| "No BAA is required" (categorical statement) | Prior public materials (now revised or being revised) | Not supported as a final public statement; depends on counsel analysis | Remove | Trevor Calton | Being replaced with "depends on final legal analysis" |
| "Zero-PHI architecture confirmed" (categorical) | Prior public materials (DataPolicy.tsx, PrivacyPolicy.tsx) | session_date and subject_id present in clinical tables and exports; not yet confirmed as non-PHI by counsel | Remove | Trevor Calton | Replace with "designed to avoid direct patient identifiers; formal review in progress" |
| "All 18 Safe Harbor identifiers are confirmed compliant" | Prior HIPAA packet exhibit (01_HIPAA_Posture_Overview.html) | session_date open; identifier 3 (dates) and 18 (unique codes) require counsel confirmation | Remove | Trevor Calton | Prior exhibit had all-green badge table; being replaced with calibrated posture overview |
| "Immunity to Subpoenas" | DataPolicy.tsx | Overclaim; not technically accurate and creates legal risk | Remove | Trevor Calton | Being removed from public-facing page |
| "PT-XXXXXX is described as the canonical database identifier" | Prior public and packet materials | Incorrect — subject_id is the canonical database key; PT-XXXXXX is the practitioner-facing display code | Remove / Correct | Trevor Calton | All documents now corrected to reflect two-layer model |

Required Instruction

No public claim should remain in active use unless it is:

1. technically supported  
2. consistent with the current packet and memorandum  
3. appropriate for public use before final counsel review

Include specific review of any claim concerning:

1. HIPAA applicability  
2. Business Associate Agreements  
3. Safe Harbor status  
4. zero-PHI language  
5. the identifier model  
6. whether PT-XXXXXX is described correctly as a display code rather than the canonical database identifier

APPENDIX L  
TRADE SECRET BOUNDARY STATEMENT

Purpose

This appendix identifies categories of proprietary information not disclosed in full within the packet unless counsel specifically requests them under appropriate confidentiality handling.

Reserved Categories

1. specific cryptographic implementation details  
2. key derivation method  
3. proprietary source code  
4. detailed internal software architecture  
5. detailed business logic  
6. proprietary workflow rules not necessary for current HIPAA applicability analysis  
7. controlled vocabulary design logic beyond what is needed to understand the data model

Limitation

This appendix does not withhold factual information necessary for counsel’s review. It reserves only detail beyond what is reasonably necessary for current issue-spotting and legal analysis.

APPENDIX M  
OPEN QUESTIONS FOR COUNSEL

Purpose

This appendix isolates the questions PPN most wants answered based on the current implemented fact pattern.

Questions

1. Is PPN Portal a HIPAA Covered Entity under the current fact pattern?  
2. Is PPN Portal a HIPAA Business Associate under the current fact pattern?  
3. Do the records stored in the in-scope environment constitute PHI under HIPAA, individually or in combination with other reasonably available information?  
4. Does the current two-layer subject-linking architecture support a de-identification analysis under Safe Harbor, Expert Determination, or neither?  
5. Do retained date-related fields, including session\_date, change the legal analysis or public-claims posture?  
6. Do operational logs, vendor systems, backups, or metadata create PHI risk even if the clinical schema excludes direct patient identifiers?  
7. Is a BAA required for any current workflow?  
8. Are any current public claims too strong relative to the current implemented architecture?  
9. Does any cross-domain aggregate count transfer create separate risk if that flow remains in scope?  
10. What additional materials are needed before counsel could issue a reliable written opinion?

APPENDIX N  
EVIDENCE MAP

Purpose

This appendix is the navigation table for the packet and appendices.

| Appendix | Title | Purpose | Owner | Status | Source Material |
| ----- | ----- | ----- | ----- | ----- | ----- |
| A | Document Control and Scope Statement | Freeze review scope and source-of-truth rule | Trevor Calton | Complete — Draft for Counsel Review | Packet + current schema |
| B | Technical Declaration | Signed engineering fact statement | Trevor Calton | Awaiting signature | Engineering verification |
| C | Current Schema Snapshot and Field Inventory | Field-level evidence | Trevor Calton | Complete — sourced from migration files 000–050 series; confirm against live production schema | Migration files 000_init_core_tables.sql, 050_arc_of_care_schema.sql, and related |
| D | Canonical Subject Identifier Workflow | Single patient-linking narrative | Trevor Calton | Complete | Product implementation — subjectIdGenerator.ts + schema |
| E | Data Flow Diagram and Narrative | System boundary map | Trevor Calton | Complete — ASCII diagram; visual diagram to be produced for final submission | Architecture review + vendor stack |
| F | Operational Metadata and Logging Boundaries | Non-clinical metadata risk map | Trevor Calton | Complete — based on current vendor configuration; verify support access path before submission | Vendor review + environment config |
| G | Vendor and Subprocessor Summary | Vendor evidence | Trevor Calton | Complete — Supabase, Vercel, Stripe, Resend confirmed | Vendor inventory + legal packet |
| H | Authentication, Access Control, and RLS Summary | Access and isolation evidence | Trevor Calton | Complete — roles and RLS confirmed from migration files | Migration 021_expand_user_roles.sql + 050_arc_of_care_schema.sql RLS policies |
| I | Sample Synthetic Database Output | Structural examples | Trevor Calton | Complete — synthetic values only | Synthetic sample set (see Appendix I tables) |
| J | Export and Benchmarking Boundaries | Output boundary evidence | Trevor Calton | Complete — research CSV export fields confirmed; counsel review flagged for subject_id and session_date in exports | csvExporter.ts exportResearchCSV function |
| K | Public Claims Crosswalk | Public statement control | Trevor Calton | Complete — 13 claims reviewed; 5 marked for removal; 7 supported; 1 partially supported | Public docs (DataPolicy.tsx, PrivacyPolicy.tsx, 01_HIPAA_Posture_Overview.html) + packet |
| L | Trade Secret Boundary Statement | Limit unnecessary disclosure | Trevor Calton | Complete | Memorandum Section 10 |
| M | Open Questions for Counsel | Focus counsel review | Trevor Calton | Complete | Memorandum + packet Section 15 |
| N | Evidence Map | Packet navigation | Trevor Calton | Complete | Entire package |

# **HIPAA Overview**

Yes. Below is one continuous, paste-ready public HIPAA overview followed by one continuous, paste-ready Privacy Policy. Both are written to match the narrower posture you have now locked, and both remove the stronger claims in the current public materials, such as categorical statements that HIPAA does not apply, that no BAA is required, or that the issue is already settled.

PUBLIC HIPAA OVERVIEW

PPN Portal and HIPAA  
Public Overview

Effective Date: \[Insert Date\]  
Last Updated: \[Insert Date\]

PPN Portal is designed to avoid storing direct patient identifiers in the core clinical data model and to operate on structured, pseudonymized clinical records.

Our goal is to help licensed psychedelic therapy practitioners and clinical programs document outcomes, safety events, and longitudinal treatment patterns without defaulting to a traditional identity-based patient record model.

This overview explains our current design posture in plain language. It is not legal advice, and it is not a final legal opinion. Formal legal review of the current implemented architecture is in progress.

What PPN Portal is

PPN Portal is a structured clinical documentation, outcomes tracking, and benchmarking platform for licensed psychedelic therapy practitioners and clinical programs.

PPN Portal is intended to support:

1. structured session documentation  
2. longitudinal outcomes tracking  
3. structured safety-related records  
4. site-scoped reporting  
5. aggregate benchmarking

PPN Portal is not intended to function as:

1. an electronic health record  
2. a billing platform  
3. a claims processor  
4. a general practice management system  
5. a patient contact management system  
6. a clinical decision engine that directs treatment

What PPN Portal is designed to avoid storing

PPN Portal is designed so that ordinary clinical records do not include direct patient identity fields such as:

Patient name  
Date of birth  
Street address  
Patient phone number  
Patient email address  
Social Security Number  
Medical record number  
Insurance identifiers

We also aim to reduce the risk of patient-identifying content in routine workflows by using structured forms, controlled selections, coded clinical inputs, and pseudonymous subject linkage wherever possible.

How patient records are linked without direct identity

PPN Portal uses a two-layer patient-linking model.

The first layer is subject\_id, the internal canonical database identifier used to link clinical records for the same patient across sessions and related tables.

The second layer is PT-XXXXXX, the practitioner-facing pseudonymous display code shown in the user interface as the ordinary patient reference.

Neither identifier is intended to be patient name, date of birth, MRN, phone number, email address, address, or another direct patient identity field.

The practitioner holds the real-world mapping between the practitioner-facing display code and the actual patient.

What PPN Portal does store

PPN Portal stores structured clinical and operational data such as:

Pseudonymous patient-linking values  
Structured treatment and session records  
Assessment scores  
Safety-related structured entries  
Controlled vocabulary references  
Site-scoped reporting data  
Aggregate benchmarking data

The platform is designed so that ordinary clinical records can remain linked across time without requiring direct patient identity inside the main clinical data model.

Why this matters

Privacy protection depends not only on policy language, but also on architecture.

PPN Portal’s design objective is to reduce identification risk by excluding direct patient identity from the main clinical data model and using structured, pseudonymized records instead.

Our public position today

Our public position today is:

PPN Portal is designed to avoid storing direct patient identifiers in the core clinical data model.  
PPN Portal uses structured, pseudonymized records for longitudinal clinical use.  
Formal legal review is in progress on the current implemented architecture.  
Institutional buyers, compliance reviewers, and legal counsel may request additional documentation.

What we are not claiming here

We are not claiming on this page that every legal question has already been finally resolved.

We are not claiming that this page is a legal opinion.

We are not claiming that product language alone determines whether HIPAA applies.

We are not asking users to rely on this page as a substitute for their own legal review.

Business Associate Agreements

Whether a Business Associate Agreement is required depends on the final legal analysis of the implemented workflow and relationship.

Our current position is that PPN Portal is designed to avoid receiving direct patient identifiers in the ordinary operation of the core platform. Formal legal review is underway to assess that position against the actual implemented architecture and data flows.

What this means for users today

PPN Portal is being built as a privacy-conscious structured clinical platform, not as a traditional identity-based charting system.

Practitioners and organizations remain responsible for understanding their own legal, clinical, regulatory, contractual, and operational obligations when using any software platform.

Frequently asked questions

Does PPN Portal store patient names?  
PPN Portal is designed so that ordinary clinical records do not store patient names in the core clinical data model.

Does PPN Portal store dates of birth?  
PPN Portal is designed so that ordinary clinical records do not store dates of birth in the core clinical data model.

Is PPN Portal an EHR?  
No. PPN Portal is not intended to function as an electronic health record or billing system.

Does HIPAA definitely not apply to PPN Portal?  
That is not the claim of this overview. The platform is designed to avoid storing direct patient identifiers in the core clinical data model, and formal legal review of the implemented architecture is in progress.

Does PPN Portal sign Business Associate Agreements?  
That depends on the final legal analysis of the implemented workflow and relationship. We are not making a blanket public claim on this page.

Can institutional buyers review the technical architecture?  
Yes. Additional documentation is available for appropriate legal, institutional, or compliance review.

Contact

For legal, compliance, privacy, or institutional review inquiries, contact:

PPN Portal  
info@ppnportal.net

Closing statement

PPN Portal is being designed to support serious clinical documentation and benchmarking without defaulting to a traditional identity-based patient record model.

We believe architectural data minimization matters. We also believe legal conclusions should be based on the actual implemented facts, not on marketing language.

# **Rewritten Privacy Policy**

# **Privacy Policy**

Effective Date: \[Insert Date\]  
Last Updated: \[Insert Date\]

PPN Portal, LLC  
ppnportal.net

1. Introduction

PPN Portal, LLC, referred to in this Privacy Policy as “PPN,” “we,” “our,” or “us,” operates ppnportal.net and related services for licensed practitioners and clinical programs.

This Privacy Policy explains what information we collect, how we use it, how we disclose it, how we protect it, and what choices may be available to users.

This Privacy Policy describes our current data handling practices in plain language. It is not legal advice, and it is not a final legal opinion regarding HIPAA or any other regulatory framework.

2. What PPN Portal is designed to do

PPN Portal is designed as a structured clinical documentation, outcomes tracking, and benchmarking platform for licensed psychedelic therapy practitioners and clinical programs.

PPN Portal is intended to support:

1. structured clinical session records  
2. longitudinal outcome tracking  
3. safety-related structured documentation  
4. site-scoped reporting  
5. aggregate benchmarking

PPN Portal is not intended to function as:

1. an electronic health record  
2. a billing platform  
3. a claims processor  
4. a general practice management system  
5. a patient contact management system  
6. a system of record for direct patient identity  
7. Core privacy design principle

PPN Portal is designed to avoid storing direct patient identifiers in the core clinical data model.

In ordinary clinical workflows, PPN Portal is intended not to store patient:

1. legal names  
2. dates of birth  
3. street addresses  
4. phone numbers  
5. email addresses  
6. Social Security Numbers  
7. medical record numbers  
8. insurance identifiers

Instead, the platform uses a two-layer patient-linking model.

The internal canonical database identifier is subject\_id, which is used to link clinical records across sessions and related tables.

The practitioner-facing pseudonymous display code is PT-XXXXXX, which is shown in the user interface as the ordinary patient reference.

Neither identifier is intended to be patient name, date of birth, MRN, phone number, email address, address, or another direct patient identity field.

4. Information we collect

A. Practitioner and organization information

We may collect information such as:

1. practitioner name  
2. practitioner email address  
3. account credentials or authentication data  
4. organization or site affiliation  
5. subscription status  
6. billing-related account information  
7. support communications

B. Structured clinical and operational data

We may collect structured platform data such as:

1. subject\_id, the internal canonical database identifier  
2. PT-XXXXXX, the practitioner-facing pseudonymous display code shown in the user interface  
3. structured treatment and session records  
4. session sequence and workflow information  
5. assessment scores  
6. safety-related structured entries  
7. controlled vocabulary references  
8. site-scoped reporting data  
9. aggregate benchmarking data

The platform is intended not to use patient name, date of birth, MRN, phone number, email address, or other direct patient identity as the ordinary patient-linking value in the core clinical data model.

C. Payment and transaction information

Subscriptions and payment processing may involve third-party payment providers. PPN does not intend to store full payment card information in its ordinary application database.

D. Technical and operational metadata

Like most online services, we and our infrastructure providers may process technical and operational metadata associated with platform use, such as:

1. login events  
2. request metadata  
3. browser or device metadata  
4. email delivery events  
5. infrastructure and hosting logs  
6. support-related operational records  
7. Information we do not intend to collect in the core clinical data model

PPN Portal is designed so that ordinary clinical records do not include direct patient identity fields such as:

1. patient legal name  
2. patient date of birth  
3. patient address  
4. patient phone number  
5. patient email address  
6. Social Security Number  
7. medical record number  
8. insurance identifiers

We also aim to reduce the risk of patient-identifying content in routine clinical workflows by using structured fields, controlled selections, coded inputs, and pseudonymous subject linkage rather than direct patient identity in the ordinary clinical data model.

6. How we use information

We may use collected information to:

1. operate, maintain, and secure the platform  
2. authenticate users and manage accounts  
3. provide structured clinical documentation workflows  
4. generate site-scoped reports and aggregate benchmarking outputs  
5. support subscriptions, billing, and account administration  
6. communicate with users about service-related issues  
7. improve platform functionality and user experience  
8. detect, prevent, and address security or operational issues  
9. comply with legal, contractual, or regulatory requirements  
10. How we disclose information

We may disclose information in the following circumstances:

A. Service providers and infrastructure vendors

We may disclose information to service providers that support operation of the platform, such as hosting, database, authentication, payment, and transactional email vendors.

B. Within site-scoped or authorized platform workflows

Information may be disclosed within the platform according to role-based access, site membership, and platform permissions.

C. Aggregate or non-patient-identifying outputs

We may disclose aggregate, benchmark, or otherwise non-patient-identifying outputs consistent with the platform’s intended design and applicable agreements.

D. Legal requirements and protection of rights

We may disclose information where required by law, court order, regulation, legal process, or where we believe disclosure is necessary to protect rights, safety, security, or property.

E. Business transactions

If PPN is involved in a merger, acquisition, financing, reorganization, or sale of assets, information may be disclosed as part of that transaction subject to appropriate protections.

8. HIPAA and related regulatory position

PPN Portal is designed to avoid storing direct patient identifiers in the core clinical data model and to operate on structured, pseudonymized clinical data.

The platform’s current design uses an internal canonical database identifier together with a practitioner-facing pseudonymous display code rather than direct patient identity in the ordinary clinical record structure.

However, this Privacy Policy does not claim to provide a final legal determination regarding HIPAA, Business Associate status, Safe Harbor, Expert Determination, or any related privacy framework. Formal legal review of the current implemented architecture is in progress.

Institutional or legal reviewers who need additional detail may request further documentation.

9. Access controls and site isolation

PPN Portal is designed to use authenticated access, role-based permissions, site-scoped data boundaries, and Row Level Security or similar access controls to limit access to authorized users and authorized site data.

10. Data security

We use administrative, technical, and organizational measures intended to protect the security of the platform and the data we process. These measures may include:

1. authenticated access controls  
2. role-based permissions  
3. site-scoped data restrictions  
4. infrastructure security features provided by our vendors  
5. vendor-managed backup and recovery controls  
6. limited vendor footprint  
7. structured data-entry design intended to reduce collection of direct patient identity

No system can guarantee absolute security. Users remain responsible for the security of their own accounts, credentials, devices, browsers, local environments, and organizational procedures.

11. Data retention

We retain information for as long as reasonably necessary to:

1. provide the platform  
2. maintain account and subscription relationships  
3. support reporting and operational needs  
4. comply with legal, contractual, or regulatory obligations  
5. enforce our agreements  
6. resolve disputes  
7. maintain security and business continuity

Retention periods may differ depending on the type of information and the legal or operational reason for retaining it.

12. Backups and service providers

Certain data may be processed or retained through our service providers’ infrastructure, including backup, recovery, hosting, authentication, payment, and email systems.

13. Cookies, analytics, and similar technologies

We may use technical mechanisms necessary to operate the platform, such as authentication, session handling, security features, and service-provider operational logs.

If our use of analytics, tracking, or similar technologies materially changes, we may update this Privacy Policy accordingly.

14. User responsibilities

Users are responsible for:

1. maintaining the confidentiality of account credentials  
2. restricting access to their devices and browsers  
3. complying with their own legal, contractual, licensing, and organizational obligations  
4. using the platform only as authorized  
5. not attempting to input prohibited or unnecessary direct patient identifiers where the workflow does not call for them  
6. evaluating whether their own use of the platform is permitted under their practice, organization, and jurisdiction  
7. Children’s privacy

PPN Portal is intended for use by licensed practitioners, authorized staff, and authorized organizations. It is not intended for direct use by children.

16. International use

PPN Portal is intended primarily for use in the United States unless otherwise expressly stated. If you access the platform from another jurisdiction, you are responsible for understanding whether your access and use comply with local law.

17. Changes to this Privacy Policy

We may update this Privacy Policy from time to time. If we make material changes, we may revise the effective date and take other steps as appropriate.

18. Contact information

For privacy, legal, or compliance inquiries, contact:

PPN Portal, LLC  
Email: info@ppnportal.net  
Website: ppnportal.net

Optional footer note

This Privacy Policy describes our current design posture and data handling practices in general terms. It does not replace legal review of specific workflows, agreements, or institutional use cases.

