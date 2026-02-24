# Technical Memorandum for Legal Counsel
## Re: HIPAA Applicability Analysis — PPN Portal Platform
### Prepared at the Direction of Counsel — Attorney-Client Privileged Communication

*Prepared by: PPN Portal Technical and Strategy Team*
*Date: February 23, 2026*
*For: [Counsel Name / Law Firm — to be inserted]*
*Re: Determination of whether PPN Portal, LLC constitutes a HIPAA Covered Entity
     or Business Associate with respect to its database and software platform*

---

> **PRIVILEGE NOTICE:** This memorandum has been prepared at the direction of legal
> counsel in connection with obtaining legal advice regarding HIPAA compliance. It
> is protected by attorney-client privilege and the work product doctrine. Do not
> distribute outside of the attorney-client relationship without written authorization
> from Trevor Calton, PPN Portal.

---

## PURPOSE OF THIS MEMORANDUM

PPN Portal requests a written legal opinion from counsel on the following question:

> **Does PPN Portal, LLC constitute a HIPAA Covered Entity or Business Associate
> with respect to its clinical documentation platform, such that it is subject to
> the requirements of the HIPAA Privacy Rule (45 CFR Part 164), Security Rule,
> or Breach Notification Rule?**

This memorandum provides counsel with the factual record necessary to render
that opinion. It describes what the platform does and does not do, what data
it does and does not store, and the structural relationship between PPN Portal
and the practitioners who use its software.

This memorandum describes system behavior at a functional level. Implementation
details, proprietary algorithms, database schema, and source code are trade
secrets of PPN Portal and are not disclosed herein.

---

## SECTION 1: COMPANY AND PLATFORM OVERVIEW

**Legal entity:** PPN Portal, LLC
**Platform name:** PPN Portal
**Primary domain:** ppnportal.net
**Description:** PPN Portal operates a cloud-based clinical documentation
and quality improvement platform sold to licensed healthcare practitioners
and clinical facilities on a software-as-a-service (SaaS) subscription basis.

**The platform's stated purpose** is to enable practitioners to document
clinical sessions, monitor patient safety in real time, and compare their
clinical outcomes against anonymized aggregate network benchmarks. It is
explicitly positioned as a **quality improvement tool**, not an electronic
health record (EHR), practice management system, or clinical decision support
system as defined by the FDA.

---

## SECTION 2: IS PPN PORTAL A COVERED ENTITY?

HIPAA defines three categories of Covered Entity:
(a) A health plan
(b) A healthcare clearinghouse
(c) A healthcare provider who transmits any health information in electronic
    form in connection with a HIPAA-covered transaction

**PPN Portal's position on each category:**

### 2.1 Health Plan
PPN Portal is not a health plan. It does not provide or pay for medical care.
It does not issue health insurance, HMO, or PPO coverage of any kind.

**Conclusion: PPN Portal is not a health plan.**

### 2.2 Healthcare Clearinghouse
PPN Portal does not process nonstandard health information received from
another entity into a standard format, nor does it receive standard
transactions and convert them to a nonstandard format. It does not
process insurance claims, remittance advice, eligibility inquiries,
or any other HIPAA standard transaction.

**Conclusion: PPN Portal is not a healthcare clearinghouse.**

### 2.3 Healthcare Provider Transmitting Health Information in Standard Transactions
PPN Portal does not provide healthcare services. It does not diagnose,
treat, prescribe for, or otherwise care for patients. It is a software
platform used by healthcare providers.

Furthermore, PPN Portal does not transmit any health information in
connection with HIPAA-covered transactions (which are specifically defined
as billing transactions: claims, eligibility, remittance, referrals, etc.).
PPN Portal has no billing functionality and does not participate in any
insurance transaction on behalf of any patient or provider.

**Conclusion: PPN Portal is not a healthcare provider for HIPAA purposes.**

### 2.4 Overall Covered Entity Conclusion
PPN Portal does not fall within any of the three Covered Entity categories.
Counsel's opinion is sought to confirm this analysis.

---

## SECTION 3: IS PPN PORTAL A BUSINESS ASSOCIATE?

A Business Associate is a person or entity (other than a member of a Covered
Entity's workforce) that performs functions or activities on behalf of, or
provides certain services to, a Covered Entity, where those functions, activities,
or services involve the use or disclosure of Protected Health Information (PHI).

The Business Associate analysis is the more complex question for PPN Portal,
because its customers include practitioners who are themselves Covered Entities
(e.g., licensed physicians billing insurance for ketamine infusions).

The analysis turns on a single factual question: **does PPN Portal receive,
use, maintain, or disclose PHI on behalf of its Covered Entity customers?**

### 3.1 Definition of PHI

Under 45 CFR §160.103, Protected Health Information means individually
identifiable health information — information that relates to:
- The past, present, or future physical or mental health of an individual
- The provision of healthcare to an individual
- The past, present, or future payment for the provision of healthcare
to an individual

**AND** that identifies the individual, or with respect to which there is a
reasonable basis to believe the information can be used to identify the individual.

De-identified information that does not identify an individual and with respect
to which there is no reasonable basis to believe that the information can be
used to identify an individual is **not** PHI, and HIPAA does not apply to it.

### 3.2 What PPN Portal Receives from Practitioners

When a practitioner uses PPN Portal, the following categories of information
are transmitted to and stored on PPN Portal's servers:

**Category A — Patient-related information transmitted to PPN Portal:**

| Data Element | What PPN Portal Receives | What PPN Portal Does NOT Receive |
|---|---|---|
| Patient identity | A pseudonymous identifier (described in Section 4) | Patient name, date of birth, address, MRN, insurance ID, or any HIPAA-defined identifier |
| Diagnosis | Standardized category codes from a controlled vocabulary | Free-text diagnosis, ICD-10 codes linked to a named patient |
| Treatment substance | Standardized controlled vocabulary codes | Any information linking a named patient to substance use |
| Dosage | Numerical values (e.g., milligrams) | Any prescription records or DEA-reportable transaction data |
| Vital signs | Numerical values (e.g., heart rate in BPM) | Any vital signs linked to an identified patient |
| Outcome scores | Numerical assessment scores | Any assessment linked to an identified patient |
| Session events | Timestamped event categories (standardized codes) | Any narrative clinical notes |

**Category B — Practitioner-related information transmitted to PPN Portal:**
- Practitioner email address (for account authentication)
- Practitioner-designated site/clinic identifier
- Subscription payment information (processed by third-party payment processor;
  not stored on PPN Portal servers)

### 3.3 What PPN Portal Explicitly Does NOT Store

The following information is never transmitted to or stored by PPN Portal
under any circumstances:

- Patient legal names
- Patient dates of birth
- Patient addresses (home, work, or mailing)
- Patient phone numbers or email addresses
- Patient Social Security Numbers
- Patient insurance member IDs or group numbers
- Patient medical record numbers (MRNs)
- Patient IP addresses captured in association with session records
- Any of the 18 Safe Harbor identifiers specified in 45 CFR §164.514(b)(2)
- Free-text clinical notes (narrative documentation is explicitly excluded
  from the platform's input model)
- Billing records, claims, or payment histories
- Prescription records

**This is not a policy restriction — it is an architectural constraint.**
The platform's input forms do not contain fields for this information.
The database schema does not contain columns capable of storing this information.
No pathway exists — in the current or planned architecture — by which this
information could enter PPN Portal's database.

Counsel may wish to request a signed technical declaration from PPN Portal's
lead developer confirming this architectural fact. We are prepared to provide
such a declaration.

---

## SECTION 4: THE PSEUDONYMIZATION ARCHITECTURE

### 4.1 Conceptual Description

The central feature of PPN Portal's compliance architecture is its patient
identification approach. Patients are never identified to PPN Portal by name
or by any standard healthcare identifier.

Instead, each clinic generates its own internal reference for each patient
(the nature and format of this reference is determined entirely by the clinic —
PPN Portal has no visibility into this process). Before any patient reference
is transmitted to PPN Portal, the clinic's system transforms that reference
using a one-way cryptographic process. The output of this transformation — a
fixed-length string of characters that bears no readable relationship to the
original input — is the only patient identifier that PPN Portal's servers
ever receive or store.

### 4.2 Key Properties of This Approach

**One-way:** The transformation cannot be reversed. PPN Portal cannot derive
the original patient reference from the stored identifier, even with full access
to its own database.

**Site-specific:** The transformation incorporates a secret value that is
unique to each clinic and is generated by and stored only at the clinic.
PPN Portal never receives or stores this secret value.

**Consequence for re-identification:** To link a record stored in PPN Portal's
database to a specific named patient, an adversary would need:
(1) Access to PPN Portal's database AND
(2) Access to the specific clinic's internal records AND
(3) Knowledge of that clinic's secret value

PPN Portal's database alone is insufficient to identify any patient.
A breach of PPN Portal's systems would yield no individually identifiable
health information.

### 4.3 HIPAA Safe Harbor Analysis

Under the HIPAA Safe Harbor de-identification method (45 CFR §164.514(b)(2)),
health information is de-identified when all 18 specified identifiers have been
removed AND the covered entity has no actual knowledge that the remaining
information could be used alone or in combination with other information to
identify an individual.

PPN Portal's submitted records do not contain any of the 18 Safe Harbor
identifiers at the point of submission. The pseudonymous identifier described
above is not a medical record number, account number, or any other category
enumerated in the Safe Harbor list. It is a cryptographic output that has
no meaning outside of its generation context.

Counsel's analysis of whether this constitutes de-identification under
45 CFR §164.514(b) is specifically requested.

---

## SECTION 5: THE QUALITY IMPROVEMENT POSITIONING

### 5.1 How PPN Portal Characterizes Its Function

PPN Portal explicitly characterizes its platform as a **quality improvement
and clinical benchmarking tool**, not a clinical decision support system,
and not an EHR. This characterization is material to the HIPAA analysis
for the following reason:

Under 45 CFR §164.506(c)(1), Covered Entities may use and disclose PHI
for treatment, payment, and healthcare operations — including quality
assessment and improvement activities — without individual authorization.

If a practitioner who is a Covered Entity chooses to use PPN Portal data
for quality improvement purposes, that practitioner's use falls within
their permitted healthcare operations. PPN Portal, as the platform enabling
this use, receives no PHI in the process (per the architecture described
above) and therefore does not act as a Business Associate.

### 5.2 What PPN Portal Does Not Do

PPN Portal explicitly:
- Does not provide clinical recommendations or treatment decisions
  (it presents data; it does not direct care)
- Does not represent its outputs as medical advice
- Does not hold itself out as a clinical decision support system under
  the FDA's definition
- Does not generate CPT or ICD codes on behalf of practitioners
- Does not participate in any billing or payment transaction

All of these limitations reduce the regulatory footprint of the platform
and are relevant to the Business Associate determination.

---

## SECTION 6: THE MULTI-DOMAIN ARCHITECTURE (SUMMARY FOR COUNSEL)

PPN Portal operates three distinct web properties. Each is relevant to
the HIPAA analysis:

**ppnportal.net (the clinical tool):**
This is the primary subject of this memorandum. As described above,
it stores no PHI.

**ppnportal.com (the practitioner network — planned Q2 2026):**
A separate platform for practitioner professional profiles and peer
consultation. It operates on a separate database and authentication
system, with no access to ppnportal.net clinical records. It will store
practitioner professional credentials (not patient data) voluntarily
submitted by practitioners. HIPAA analysis of this platform as a
standalone service is not requested at this time but may be requested
prior to its launch.

**ppnportal.org (the research layer — planned Q3 2026):**
A public platform that will publish aggregate, de-identified outcomes
statistics derived from ppnportal.net. All statistics published will
meet or exceed the HIPAA Safe Harbor de-identification standard, including
a k-anonymity floor (suppression of any statistic derived from fewer than
5 distinct patient records). Counsel's review of the publication methodology
prior to first publication is requested.

**Data isolation between domains:**
The three platforms share no database infrastructure, no authentication
systems, and no live data connections. The only information that passes
from ppnportal.net to ppnportal.com is an aggregate count (a single
integer representing how many practitioners in the network have experience
with a given clinical scenario). This count contains no patient or
practitioner identification. Counsel's confirmation that this count does not
constitute PHI or a disclosure of PHI is requested.

---

## SECTION 7: SPECIFIC QUESTIONS FOR COUNSEL

PPN Portal requests legal counsel's written opinion on the following questions:

**Question 1:** Based on the facts described in Sections 2 and 3, does PPN Portal,
LLC constitute a HIPAA Covered Entity?

**Question 2:** Based on the facts described in Sections 2, 3, and 4, does PPN Portal,
LLC constitute a Business Associate as defined by 45 CFR §160.103, with respect
to its relationships with practitioners who are themselves Covered Entities?

**Question 3:** Do the records stored in ppnportal.net's database (as described
in Section 3.2) constitute Protected Health Information under 45 CFR §160.103?

**Question 4:** Does the pseudonymization architecture described in Section 4
satisfy the de-identification safe harbor under 45 CFR §164.514(b), or
alternatively the Expert Determination method under 45 CFR §164.514(a)?

**Question 5:** If PPN Portal is determined to be a Business Associate, what
compliance steps would be required, and at what estimated cost?

**Question 6:** Is a Business Associate Agreement (BAA) required between PPN Portal
and its practitioner customers, given the architecture described above?

**Question 7:** Does the cross-domain data flow described in Section 6 (the
aggregate count passed from ppnportal.net to ppnportal.com) constitute a
disclosure of PHI requiring HIPAA compliance measures?

---

## SECTION 8: SUPPORTING DOCUMENTATION AVAILABLE UPON REQUEST

The following documents are available to provide counsel with additional
context. All are subject to the attorney-client privilege designation
of this memorandum:

1. **PPN Three-Domain Architecture Deep-Dive** (internal strategy document) —
   provides detailed business model context, risk analysis, and regulatory
   reference framework

2. **Technical Declaration from Lead Developer** — a signed statement confirming
   the architectural constraints described in Section 3.3 (no PHI storage fields
   in the database schema)

3. **Data Flow Diagram** (to be prepared) — a schematic representation of what
   data enters and exits the system, suitable for technical legal review, without
   disclosing proprietary implementation details

4. **Sample Database Output** (to be prepared) — a representative sample of the
   type of records stored in ppnportal.net, with all values anonymized to
   demonstrate the data structure without disclosing actual clinical data
   or proprietary schema design

---

## SECTION 9: TRADE SECRET DESIGNATIONS

The following aspects of PPN Portal's platform are trade secrets and are
NOT disclosed in this memorandum. Counsel does not require this information
to render a HIPAA applicability opinion, and PPN Portal requests that
counsel advise immediately if any of the following information appears
necessary for the engagement:

- The specific cryptographic algorithm, key derivation method, or implementation
  details of the pseudonymization architecture (Section 4)
- The database schema, table names, data types, or column structure
- The controlled vocabulary content, categorization logic, or reference table
  structure
- The specific source code or software architecture of the platform
- The business logic, workflow design, or clinical decision rules

To the extent any of this information becomes relevant to counsel's analysis,
PPN Portal requests that a supplemental confidentiality agreement be executed
prior to disclosure, and that this information be maintained in a separate,
restricted-access matter file.

---

## CERTIFICATION

I certify that the factual representations in this memorandum are accurate
to the best of my knowledge and belief, and that I have not omitted any
information that would be material to the HIPAA applicability analysis
requested above.

**Signed:**

___________________________________
Trevor Calton
Founder, PPN Portal, LLC
Date: ________________

---

*This document was prepared at the direction of counsel for purposes of
obtaining legal advice. It is protected by attorney-client privilege and
the work product doctrine. Unauthorized disclosure may waive applicable
privileges.*

==== PRODDY ====
