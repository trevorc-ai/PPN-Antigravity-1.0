# PPN Portal — Three-Domain Architecture Strategy
## Full Technical, Legal, and Business Deep-Dive

*Version 1.0 — February 23, 2026*
*Classification: Internal — For Legal, Investment, and Technical Review*

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Strategic Rationale — Why Three Domains](#2-strategic-rationale--why-three-domains)
3. [Domain-by-Domain Specification](#3-domain-by-domain-specification)
   - 3.1 [ppnportal.net — The Clinical Tool](#31-ppnportalnet--the-clinical-tool)
   - 3.2 [ppnportal.com — The Practitioner Network](#32-ppnportalcom--the-practitioner-network)
   - 3.3 [ppnportal.org — The Research Layer](#33-ppnportalorg--the-research-layer)
4. [Data Architecture — What Crosses Between Domains](#4-data-architecture--what-crosses-between-domains)
5. [HIPAA & Regulatory Compliance Analysis](#5-hipaa--regulatory-compliance-analysis)
6. [Legal Defense Posture](#6-legal-defense-posture)
7. [Business Model by Domain](#7-business-model-by-domain)
8. [SEO & Market Positioning by Domain](#8-seo--market-positioning-by-domain)
9. [Competitive Landscape & Differentiation](#9-competitive-landscape--differentiation)
10. [Risk Analysis & Mitigations](#10-risk-analysis--mitigations)
11. [Governance & Data Policies](#11-governance--data-policies)
12. [Implementation Timeline & Milestones](#12-implementation-timeline--milestones)
13. [Appendix A — Technical Stack Overview](#appendix-a--technical-stack-overview)
14. [Appendix B — Regulatory Reference Framework](#appendix-b--regulatory-reference-framework)
15. [Appendix C — Decision Log](#appendix-c--decision-log)

---

## 1. Executive Summary

PPN Portal operates three distinct web properties under a unified brand identity.
This is not a corporate structure for tax purposes, nor a vanity domain strategy.
It is a deliberate **compliance-by-architecture** decision: each domain handles
a fundamentally different category of data and serves a fundamentally different
audience, and keeping them separate is what makes each one legally defensible.

**The Three Domains:**

| Domain | Function | Data Type | Primary Audience |
|---|---|---|---|
| ppnportal.net | Clinical documentation tool | Anonymous clinical records (no PHI) | Practitioners (authenticated) |
| ppnportal.com | Practitioner professional network | Voluntarily disclosed professional profiles | Practitioners (public-facing) |
| ppnportal.org | Research and public data layer | Aggregate anonymized statistics only | Researchers, payers, regulators, public |

The architecture is explicitly designed so that no single domain holds enough
information to compromise patient privacy, implicate a practitioner in illegal
activity, or create liability for PPN Portal as an organization.

**The governing principle:** *Each domain knows only what it needs to know,
and nothing more.*

---

## 2. Strategic Rationale — Why Three Domains

### 2.1 The Compliance Problem This Solves

Psychedelic-assisted therapy occupies a complex legal and regulatory space:

- **Federal Schedule I status** of psilocybin and MDMA means that detailed
  session records stored in a centralized, identifiable database could, in
  theory, be subpoenaed and used as evidence against practitioners or patients
- **HIPAA** (Health Insurance Portability and Accountability Act) imposes
  compliance obligations — and associated costs — on any entity that stores,
  transmits, or processes Protected Health Information (PHI)
- **Social networking features** integrated directly into a clinical database
  create HIPAA entanglement: if a practitioner discusses a patient case in a
  forum that lives on the same platform as the clinical records, the forum
  becomes subject to HIPAA even if the conversation itself contains no PHI

The three-domain architecture resolves all three of these problems by ensuring
the clinical tool stores **no PHI** (by design, not just by policy), the
practitioner network is **categorically separate** from the clinical database,
and the research layer handles **only aggregate statistics** that meet or exceed
the de-identification standards of 45 CFR §164.514.

### 2.2 The Business Problem This Solves

PPN Portal's five business models (Clinic Commander, Risk Management Engine,
Wisdom Trust, Protocol Library, and Practitioner Guild) require access to
different legal frameworks, different pricing structures, and different
audiences. Attempting to serve all five audiences from a single domain
creates brand confusion, legal exposure, and operational complexity.

The three-domain structure maps cleanly:
- ppnportal.net serves the **Clinic Commander (SaaS)** and **Risk Management Engine**
- ppnportal.com serves the **Practitioner Guild (Network)** and **Protocol Library (EdTech)**
- ppnportal.org serves the **Wisdom Trust (Data Brokerage)**

Each domain can evolve independently — with its own product roadmap, pricing
model, compliance framework, and team — while maintaining unified brand equity.

### 2.3 The SEO and Market Positioning Problem This Solves

In healthcare technology, the `.org` TLD carries institutional trust that
`.net` and `.com` do not. Academic citations, regulatory references, and
insurance company analyses all preferentially link to `.org` sources.
Conversely, `.com` is the default target for press coverage and word-of-mouth
referrals. `.net` is understood as technical infrastructure.

By owning all three TLDs under the same brand, PPN Portal:
- Captures credibility signals from `.org` without abandoning `.com` commercial positioning
- Benefits from link equity flowing between all three domains (internal cross-domain linking)
- Prevents competitors from squatting on adjacent TLDs and creating brand confusion

---

## 3. Domain-by-Domain Specification

### 3.1 ppnportal.net — The Clinical Tool

**Status:** Live and in active use
**Classification:** B2B SaaS application
**Authentication:** Required — practitioners must create verified accounts
**Database:** Supabase (PostgreSQL), hosted separately from ppnportal.com

#### 3.1.1 What It Does

ppnportal.net is the primary clinical documentation and intelligence platform.
It provides practitioners with:

**Phase 1 — Pre-Session:**
- Informed consent capture
- Psychometric baseline scoring (PHQ-9, GAD-7, MEQ-30, custom scales)
- Safety check: contraindication screening against current medications
- Eligibility determination

**Phase 2 — Dosing Session:**
- Timestamped vital sign logging (temperature, heart rate, respiratory rate,
  blood pressure, QT interval for ibogaine protocols)
- Substance and dosage logging (with route of administration)
- Safety warning system with real-time alerts for known drug interactions
- Session event logging (rescue protocols, amendments to dosage, observations)
- Patient-facing companion screen (separate device, logs patient self-reports)

**Phase 3 — Integration:**
- Post-session outcome scoring
- Longitudinal outcome tracking across multiple sessions
- Network benchmarking: comparison against anonymized aggregate network data
- Integration plan documentation
- Patient portal for between-session follow-up

#### 3.1.2 What It Does NOT Do

- Store patient legal names, dates of birth, addresses, social security numbers,
  insurance ID numbers, or any other HIPAA-defined PHI
- Store practitioner social security numbers or DEA registration numbers
- Handle billing, insurance claims, or scheduling
- Provide medical advice or legally constitute a clinical decision support tool
  (it presents data; it does not direct treatment decisions)
- Connect directly to the ppnportal.com database

#### 3.1.3 Patient Identification Architecture

Patients are identified within ppnportal.net using **HMAC-pseudonymized Subject IDs**.

The process:
1. The clinic generates a patient identifier (e.g., a clinic-assigned patient number)
2. That identifier is hashed using HMAC-SHA256 with a site-specific secret key
3. The resulting hash is stored in the ppnportal.net database as the `subject_id`
4. The secret key never leaves the clinic's system
5. PPN Portal's servers see only the hash — never the underlying identifier

**Consequence:** Even if the entire ppnportal.net database were subpoenaed or
breached, it would contain no information that could identify any patient.
The hash is meaningless without the clinic's secret key, which PPN Portal
does not possess.

This architecture was designed specifically to be defensible in federal court
under a criminal investigation scenario.

#### 3.1.4 Data Architecture Principles

All data stored in ppnportal.net follows three rules:

1. **Reference codes only** — no free-text patient descriptions. Everything
   is stored as foreign key references to controlled vocabulary tables
   (`ref_` prefix). Example: the route of administration is stored as an
   integer foreign key pointing to a `ref_routes` table entry (e.g., `7`
   for "oral, capsule"), not as the text string "oral capsule."

2. **Measured scalars only** — vitals, dosages, and outcomes are stored as
   numbers (e.g., `heart_rate: 84`), not as descriptive text.

3. **UUIDs for session tracking** — every session is tracked by a UUID that
   has no relationship to any external identifier system.

These three rules mean the database cannot be read as a narrative about any
specific person. It is, in effect, a structured dataset of numbers and codes.

#### 3.1.5 Pricing and Revenue

- **Individual practitioner:** $X/month (TBD — pricing strategy in WO-342)
- **Clinic/multi-site:** $500–$2,000/month per location (Clinic Commander tier)
- **Insurance partnership tier:** Included in malpractice group membership
  (Risk Management Engine)
- **Pilot/data bounty model option:** Free access in exchange for minimum
  5 valid protocol contributions per month

---

### 3.2 ppnportal.com — The Practitioner Network

**Status:** Planned — Q2 2026
**Classification:** Professional social network / marketplace
**Authentication:** Optional (browsing is public; participation requires account)
**Database:** Separate from ppnportal.net — no shared tables, no shared auth

#### 3.2.1 What It Does

ppnportal.com is the practitioner-facing community and professional network.
It is architecturally and legally independent of the clinical tool.

**Core Features (Phase 1 — Q2 2026):**

*Opt-In Professional Directory:*
- Practitioners voluntarily submit a public profile
- Profile contains: credentials, license type, state, modalities (from a
  controlled vocabulary list), languages, years of experience, and areas
  of documented case experience
- Profile does NOT contain: patient information of any kind, session records,
  or any data pulled from ppnportal.net
- Contact is handled via a brokered contact form — no direct email or phone
  exposure unless the practitioner explicitly adds it

*Contextual Network Intelligence Link (from ppnportal.net):*
- When a safety warning fires in ppnportal.net (e.g., lithium + psilocybin
  contraindication), the clinical tool surfaces a count: *"N practitioners
  in the network have documented experience managing this contraindication."*
- That count is derived from a periodic, anonymized aggregate query — not
  a live join between databases
- The link points to a filtered view on ppnportal.com:
  `https://ppnportal.com/practitioners?experience=lithium-interaction`
- No session data, patient data, or practitioner identity from ppnportal.net
  crosses this link — only the URL parameter (a controlled vocabulary term)

**Core Features (Phase 2 — Q3 2026):**

*Supervision Circles:*
- Curated cohorts of 4–8 practitioners matched by modality, experience level,
  and case complexity focus
- Groups meet on a scheduled basis (video, facilitated)
- Facilitator receives a fee (set by the facilitator); ppnportal.com retains
  20% as a platform transaction fee
- Case discussions within circles may reference anonymized case data from
  ppnportal.net — but only aggregate statistics, never individual session records
- Circles are governed by a participation agreement that prohibits sharing of
  patient-identifying information within the circle forum

*Case Consultation Request:*
- A practitioner encountering an unusual clinical scenario can post an
  anonymized case summary (no patient identifiers) and request consultation
  from colleagues with documented experience
- Responding practitioners are matched based on their profile's documented
  experience tags
- The platform explicitly does not constitute the provision of medical advice
  (disclaimer language: "Practitioner-to-practitioner peer consultation.
  This platform does not establish a physician-patient relationship and does
  not constitute medical advice.")

#### 3.2.2 What It Does NOT Do

- Store or display any patient information from ppnportal.net
- Allow practitioners to discuss individually identifiable patient cases
  (platform terms of service prohibit this; moderation enforces it)
- Provide or imply medical advice
- Share practitioner session data without explicit opt-in from that practitioner
- Directly access the ppnportal.net database

#### 3.2.3 The Data Separation Wall

The only mechanism by which ppnportal.net and ppnportal.com exchange information is:

1. **The count** — ppnportal.net runs a periodic aggregate query (e.g., nightly)
   against its own database to count how many practitioners have logged cases
   involving specific contraindication tags. These counts are written to a
   **read-only public API endpoint** (e.g., `api.ppnportal.net/v1/network/counts`).
   This endpoint returns only numbers by contraindication category — no practitioner
   identities, no patient data.

2. **The URL parameter** — when a practitioner clicks the contextual link
   from ppnportal.net, the URL passed to ppnportal.com contains only a
   controlled vocabulary term (e.g., `?experience=lithium-interaction`).
   No session ID, no user ID, no patient ID is included.

3. **The practitioner's own opt-in choice** — a practitioner who uses
   ppnportal.net can separately choose to create a profile on ppnportal.com.
   This is an explicit, voluntary action. The two accounts are not linked
   by the platform — the practitioner self-declares their experience on
   ppnportal.com independent of what their ppnportal.net records contain.

**Legal significance:** Because the data separation is architectural (not
just policy-based), there is no mechanism by which a court order served
against ppnportal.com could produce ppnportal.net clinical records, and
vice versa.

#### 3.2.4 Revenue Model

- **Practitioner directory listing:** Free tier (basic profile) / premium tier
  ($X/month — enhanced visibility, analytics, referral tracking)
- **Supervision circle facilitation fee:** 20% platform transaction fee
- **Institutional/clinic membership:** Bulk listing for multi-practitioner clinics
- **Training program partnership:** Affiliate revenue from partner programs
  (Fluence, CIIS, MAPS clinical programs) that list in the resource directory

---

### 3.3 ppnportal.org — The Research Layer

**Status:** Planned — Q3 2026 (contingent on reaching threshold data volume)
**Classification:** Public research platform / open data resource
**Authentication:** None required for public access
**Database:** Read-only views of aggregated ppnportal.net data, plus
separately submitted research contributions

#### 3.3.1 What It Does

ppnportal.org is the public-facing face of the Wisdom Trust business model.
It transforms the anonymized aggregate data collected through ppnportal.net
into publicly accessible research assets.

**Core Features:**

*Annual State-of-the-Field Reports:*
- Aggregate outcomes data published annually (or quarterly, at scale)
- Format: "In 2026, the PPN network documented [N] sessions across [N] sites.
  Of these, [N]% utilized ketamine as the primary substance. Aggregate PHQ-9
  improvement across the network was [X] points at 30-day follow-up."
- All statistics meet HIPAA Safe Harbor de-identification standards:
  any cell with fewer than 5 distinct subject IDs is suppressed (k-anonymity
  floor of N=5)
- Published as freely downloadable PDF and interactive web visualization

*Open Vocabulary Standard:*
- The `ref_` controlled vocabulary tables (substances, routes of administration,
  outcome scales, adverse event codes, integration modalities) are published
  as an open standard on ppnportal.org
- Third-party platforms, researchers, and regulatory bodies can adopt the
  vocabulary, creating interoperability and establishing PPN Portal as the
  de facto standards body for the field
- Vocabulary additions and changes governed by the Advisory Board (see Section 11)
- Published in machine-readable formats (JSON, CSV) compatible with existing
  healthcare standards (SNOMED, RxNorm, MedDRA, LOINC)

*Policy Submissions Archive:*
- When PPN Portal submits data or commentary to regulatory proceedings
  (FDA, DEA, state legislatures), those submissions are published openly on ppnportal.org
- This creates a permanent, citable record of PPN Portal's evidence contributions

*Research Partnership Portal:*
- Institutional researchers (universities, pharmaceutical companies, CROs)
  can request access to custom aggregate datasets
- Requests are reviewed by the Advisory Board
- Approved datasets are delivered as de-identified flat files (Parquet/CSV)
  under a data use agreement specifying permitted uses, attribution requirements,
  and prohibition on re-identification attempts

#### 3.3.2 De-Identification Standards

All data published on or distributed through ppnportal.org complies with:

**HIPAA Safe Harbor Method (45 CFR §164.514(b)):**
The following 18 identifiers are absent from all PPN Portal records:
names, geographic subdivisions smaller than state, dates other than year,
phone/fax numbers, email addresses, SSNs, medical record numbers, health
plan beneficiary numbers, account numbers, certificate/license numbers,
VINs, device identifiers, URLs, IP addresses, biometric identifiers,
full-face photographs, and any other unique identifier.

**K-Anonymity Floor:**
Any aggregate statistic derived from fewer than 5 distinct subject IDs
is suppressed entirely and replaced with "<5" in published outputs.
This prevents inference attacks where a small cohort could be
reverse-engineered to identify individuals.

**Expert Determination Method (available as needed):**
For datasets intended for pharmaceutical or regulatory use, PPN Portal
engages a qualified statistical expert to certify that the risk of
re-identification is "very small" as required by 45 CFR §164.514(b)(1).

#### 3.3.3 Revenue Model

- **Custom aggregate dataset licensing:** $50,000–$250,000 per dataset
  (pharmaceutical companies, CROs, insurance payers)
- **Annual data subscription (Pharma):** $X/year for rolling access to updated
  aggregate datasets
- **Decentralized CRO / trial recruitment:** Per-referral fee for connecting
  eligible patient cohorts (via opt-in practitioner network) with clinical
  trial sponsors
- **Grant funding:** NIH, NIDA, and foundation grants for open data infrastructure

---

## 4. Data Architecture — What Crosses Between Domains

This section is the technical heart of the compliance argument. The table below
documents every sanctioned data flow between domains, the mechanism, and the
legal basis for each flow.

### 4.1 Sanctioned Cross-Domain Data Flows

| Flow | From | To | What Crosses | Mechanism | Legal Basis |
|---|---|---|---|---|---|
| Contraindication count | ppnportal.net | ppnportal.com (via URL) | A single integer (count of opt-in practitioners) and a controlled vocabulary term (contraindication category) | Read-only public API endpoint → URL parameter | Not PHI; aggregate statistic; no individual identification possible |
| Practitioner opt-in profile | ppnportal.com (practitioner-authored) | ppnportal.net (display only) | Practitioner's voluntarily disclosed professional information | Practitioner-initiated; explicit consent at account creation | Voluntary disclosure; no PHI involved |
| Aggregate outcomes data | ppnportal.net | ppnportal.org | De-identified aggregate statistics (counts, means, distributions) — never individual records | Nightly batch job; k-anonymity filter applied before export | HIPAA Safe Harbor de-identification; 45 CFR §164.514(b) |
| Vocabulary standard | ppnportal.net (ref_ tables) | ppnportal.org (published) | Controlled vocabulary terms and codes — no patient or practitioner data | Advisory Board review → publication | No personal data involved |
| Research dataset | ppnportal.net (processed) | ppnportal.org → researcher | De-identified flat file under data use agreement | Manual request process; Advisory Board approval | Expert determination de-identification; data use agreement |

### 4.2 Prohibited Cross-Domain Data Flows

The following data flows are **architecturally prevented** — not merely
prohibited by policy:

- Individual session records from ppnportal.net → ppnportal.com or ppnportal.org
- Subject IDs (even hashed) from ppnportal.net → ppnportal.com or ppnportal.org
- Practitioner ppnportal.net user IDs → ppnportal.com (accounts are independent)
- Any data from ppnportal.com practitioner discussions → ppnportal.net
- Any raw (non-aggregated) data from ppnportal.net → ppnportal.org

**How "architecturally prevented" is enforced:**
- The ppnportal.net and ppnportal.com databases are hosted as separate Supabase
  projects with separate API keys and separate Row Level Security (RLS) policies
- No shared authentication tokens between domains
- The only programmatic connection between ppnportal.net and the outside world
  is the read-only public aggregate API endpoint, which is designed to return
  only integer counts by category
- All outbound data from ppnportal.net to ppnportal.org passes through a
  de-identification layer that applies the k-anonymity filter before any data
  leaves the ppnportal.net environment

---

## 5. HIPAA & Regulatory Compliance Analysis

### 5.1 Is PPN Portal a Covered Entity?

Under HIPAA, a Covered Entity is defined as a health plan, a healthcare
clearinghouse, or a healthcare provider who transmits any health information
in electronic form in connection with a HIPAA-covered transaction (e.g.,
billing, claims).

**ppnportal.net:** PPN Portal does not bill insurance, submit claims, or
process payment transactions. It does not store PHI. It is therefore
**not a Covered Entity** under HIPAA with respect to ppnportal.net.
(Note: This analysis should be confirmed by qualified healthcare counsel
given the evolving regulatory interpretation of digital health tools.)

**ppnportal.com:** A professional directory and peer support network.
No clinical data is stored. No PHI is stored. Not a Covered Entity.

**ppnportal.org:** Publishes only de-identified aggregate data that does
not constitute PHI by definition. Not a Covered Entity with respect
to this domain.

### 5.2 Is PPN Portal a Business Associate?

A Business Associate is an entity that performs functions or activities
on behalf of a Covered Entity that involve the use or disclosure of PHI.

If a practitioner who is a Covered Entity (e.g., a licensed psychiatrist
billing insurance for ketamine infusions) uses ppnportal.net, does that
make PPN Portal a Business Associate?

**Analysis:** Because ppnportal.net does not receive, store, or process
PHI — it receives only hashed subject IDs, controlled vocabulary codes,
and measured scalars — there is no PHI to associate. PPN Portal does not
become a Business Associate because it never handles PHI on behalf of the
practitioner.

**The key architectural fact supporting this:** The HMAC pseudonymization
occurs on the clinic's system before any data is transmitted to ppnportal.net.
PPN Portal's servers never see the underlying patient identifier.

### 5.3 Controlled Substances Act Considerations

The Controlled Substances Act (21 U.S.C. § 801 et seq.) schedules psilocybin
and MDMA as Schedule I substances. Practitioners using ppnportal.net to
document sessions involving these substances may be engaged in activities
that are federally illegal.

**PPN Portal's legal position:**
- PPN Portal is a documentation tool. It does not manufacture, distribute,
  dispense, or possess controlled substances.
- PPN Portal does not recommend, prescribe, or endorse any specific treatment
  protocol.
- The data stored in ppnportal.net does not constitute a record of illegal
  activity that could be attributed to PPN Portal, because:
  (a) the subject IDs are pseudonymized and cannot be traced to individuals
  (b) the substance data is stored as anonymous reference codes
  (c) PPN Portal has no knowledge of whether the substances described in
      any given session record were obtained or administered lawfully or unlawfully

**Positioning:** PPN Portal describes itself as "quality improvement infrastructure"
— consistent with the legal framework established for quality improvement
activities in healthcare. It explicitly does not make medical device claims,
does not constitute a clinical decision support system for regulatory purposes,
and does not hold itself out as providing medical advice.

### 5.4 State-by-State Legal Landscape

Relevant legal contexts for practitioners using ppnportal.net:

| Jurisdiction | Status | Notes |
|---|---|---|
| Oregon | Legal (psilocybin services) | Oregon Health Authority licensing framework; practitioners fully legal |
| Colorado | Legal (natural medicine) | DORA licensing framework; practitioners legal in licensed service centers |
| All other US states | Federally illegal Schedule I; state laws vary | Grey market or ceremonial/religious use; RFRA arguments in some jurisdictions |
| Canada | Legal with exemptions | Health Canada Section 56 exemptions; practitioners may be licensed |
| Netherlands | Legal (truffles) | Not a controlled substance; open clinical use |

ppnportal.net's no-PHI architecture is specifically designed to serve
practitioners across all of these jurisdictions without requiring different
compliance postures per jurisdiction. The data abstraction layer is
jurisdiction-agnostic.

---

## 6. Legal Defense Posture

### 6.1 The "Audit Defense" Value Proposition

One of the primary value propositions of ppnportal.net is that it creates
a documented record of a practitioner's safety-conscious decision-making
process. If a practitioner faces a legal challenge — criminal prosecution,
malpractice claim, licensing board complaint — ppnportal.net records
demonstrate:

1. **Informed consent was obtained** (timestamped record)
2. **Contraindication screening was performed** (safety check log)
3. **Vital signs were monitored** (timestamped vital log)
4. **Substance and dosage were intentionally selected** (documented protocol)
5. **Adverse events were recognized and responded to** (rescue protocol log)
6. **Outcome was assessed** (post-session scoring)

This is the clinical equivalent of a flight recorder — not proof of legality,
but proof of professional diligence. In malpractice litigation, demonstrated
diligence is the primary defense.

### 6.2 The No-PHI Seizure Defense

In the event of a law enforcement action targeting a practitioner, a
subpoena of ppnportal.net records would return:
- A list of hashed subject IDs (useless without the clinic's secret key)
- A list of reference code integers (useless without the ref_ table definitions)
- Dosage values and vitals (medical data with no patient attribution)

This data cannot be used to identify patients, confirm their identities,
or establish that any specific illegal act was committed against any
specific person. It is, in effect, unactionable as evidence in a patient
identification proceeding.

**Contrast with a standard EHR subpoena:** A subpoena of a standard EHR
(e.g., SimplePractice, Osmind) would return full patient names, addresses,
dates of birth, diagnosis codes, and session notes — a complete record
of identified individuals who received an illegal substance from an
identified practitioner.

### 6.3 The Phantom Shield (Entheogenic Operator Use Case)

For practitioners operating under religious freedom claims (RFRA), the
Bridger Lee Jensen case established that documentation practices are
central to legal defensibility. ppnportal.net's ceremonial workflow
(selected at login) provides:
- Documented safety screening
- Documented informed consent
- Timestamped event logs
- Incident reports

All stored without patient PHI. A SWAT team that seizes ppnportal.net
records from a church server gets unusable data. The church's legal
defense files remain intact.

**Critical limitation:** PPN Portal does not provide legal advice and
does not warrant that use of ppnportal.net constitutes a defense against
any specific legal claim. Practitioners should consult qualified legal
counsel regarding their specific jurisdiction and circumstances.

---

## 7. Business Model by Domain

### 7.1 ppnportal.net Revenue Streams

| Revenue Stream | Model | Timeline | Target ARR |
|---|---|---|---|
| Individual practitioner SaaS | Monthly subscription | Now | $X |
| Clinic Commander (multi-site) | $500–$2,000/site/month | Now | $X |
| Risk Management Engine | Insurance group membership fee | Q3 2026 | $X |
| Data Bounty (access for data) | Free access in exchange for protocol contributions | Now (pilot) | $0 (data accrual) |

### 7.2 ppnportal.com Revenue Streams

| Revenue Stream | Model | Timeline | Target ARR |
|---|---|---|---|
| Premium practitioner listings | Monthly subscription | Q2 2026 | $X |
| Supervision circle transaction fee | 20% of facilitation fees | Q3 2026 | $X |
| Training program affiliate | Per-referral / revenue share | Q3 2026 | $X |
| Institutional clinic listings | Annual membership | Q3 2026 | $X |

### 7.3 ppnportal.org Revenue Streams

| Revenue Stream | Model | Timeline | Target ARR |
|---|---|---|---|
| Custom dataset licensing | Per-dataset license | Q3 2026 (post 10K records) | $50K–$250K/deal |
| Annual data subscription | Annual license (Pharma) | 2027 | $X |
| Clinical trial recruitment | Per-referral fee | Q3 2026 (post 1K records) | $10K/100 referrals |
| Grant funding | Non-dilutive grants | Ongoing | Variable |

### 7.4 Strategic Sequencing

```
Phase 1 (Now – Q2 2026): ppnportal.net
Revenue: SaaS subscriptions
Goal: Reach 50 active sites; build data volume

Phase 2 (Q2–Q4 2026): Add ppnportal.com
Revenue: + practitioner network subscriptions + supervision fees
Goal: Activate practitioner community; reduce churn; increase referrals

Phase 3 (Q4 2026+): Activate ppnportal.org
Revenue: + data licensing + grant funding
Goal: Wisdom Trust activation; institutional buyer relationships
Exit thesis: Acquisition by IQVIA, Datavant, or major Pharma data buyer
```

---

## 8. SEO & Market Positioning by Domain

### 8.1 ppnportal.net — SEO Strategy

**Target keyword clusters:**
- Practice management: "psychedelic therapy software," "ketamine clinic management"
- Safety/compliance: "psychedelic documentation tool," "audit defense psychedelic"
- Benchmarking: "clinical outcomes benchmarking psychedelic," "ketamine outcomes tracking"

**Content strategy:** Clinical, evidence-based, boring-by-design. No hype language.
The brand voice positions ppnportal.net as the tool a practitioner's malpractice
attorney would recommend, not the tool a wellness influencer would promote.

**Primary conversion goal:** Demo request / free trial signup

### 8.2 ppnportal.com — SEO Strategy

**Target keyword clusters:**
- Community: "psychedelic practitioner network," "psychedelic therapist community"
- Supervision: "peer supervision psychedelic therapy," "psychedelic therapist supervision"
- Directory: "find psychedelic therapist," "verified psychedelic facilitator directory"

**Content strategy:** Practitioner-first. Case studies, practitioner spotlights,
clinical opinion pieces, supervision best practices guides.

**Primary conversion goal:** Practitioner profile signup / supervision circle enrollment

### 8.3 ppnportal.org — SEO Strategy

**Target keyword clusters:**
- Research: "psychedelic real world evidence," "psilocybin outcomes data"
- Policy: "psychedelic therapy insurance reimbursement," "psilocybin clinical evidence"
- Standards: "psychedelic therapy clinical vocabulary," "RWE psychedelic"

**Content strategy:** Academic and institutional voice. Annual reports, white papers,
policy submissions, open data documentation.

**Primary conversion goal:** Research partnership inquiry / dataset licensing inquiry

### 8.4 Cross-Domain Link Architecture

Each domain links to the others in contextually appropriate ways:

```
ppnportal.net (tool) links to:
  → ppnportal.com (network) when contextual network intelligence is displayed
  → ppnportal.org (research) in the "About" section and outcomes benchmarking

ppnportal.com (network) links to:
  → ppnportal.net (tool) in all practitioner-facing calls-to-action
  → ppnportal.org (research) in educational content and protocol library

ppnportal.org (research) links to:
  → ppnportal.net (tool) as the source of data collection infrastructure
  → ppnportal.com (network) for practitioner directory and participation
```

This creates a **link equity cluster** — each domain strengthens the others'
search authority, mimicking the way Wikipedia's internal cross-linking
builds domain authority across a unified topic space.

---

## 9. Competitive Landscape & Differentiation

### 9.1 Direct Competitors by Domain

**ppnportal.net competitors:**
| Competitor | Positioning | PPN Advantage |
|---|---|---|
| Osmind | Full EHR for psychedelic clinics; stores PHI | PHI-lock prevents network benchmarking; seizure risk; $4M+ compliance overhead |
| SimplePractice | General-purpose therapy PM | No psychedelic-specific workflows; no safety checks; no benchmarking |
| Jane App | Clinic management | No psychedelic specificity; no network data |

**ppnportal.com competitors:**
| Competitor | Positioning | PPN Advantage |
|---|---|---|
| Safar (joinsafar.com) | "OS for Human Transformation"; spiritual aesthetic | PPN wins on clinical rigor and professional credibility |
| Psychology Today directory | General therapist directory | No psychedelic-specific filtering or supervision features |
| MAPS community forums | Community for MAPS-trained practitioners | Limited to MAPS methodology; no structured supervision |

**ppnportal.org competitors:**
| Competitor | Positioning | PPN Advantage |
|---|---|---|
| IQVIA / Symphony Health | Pharmaceutical data brokerage at scale | Can't capture underground/grey market data; PHI-dependent model |
| Psychedelic Alpha | Media + data reporting | Editorial, not systematic; no structured data collection |
| Academic registries (e.g., ClinicalTrials.gov) | Public clinical trial data | Prospective trials only; misses real-world practice |

### 9.2 The Unreplicable Moat

The combination of all three domains creates a moat that cannot be replicated
by any existing competitor because it requires:

1. **First-mover data advantage** — the value of ppnportal.org's Wisdom Trust data
   grows with each session logged in ppnportal.net; competitors starting now
   are 12–24 months behind on data accumulation

2. **No-PHI architecture** — competitors who have already stored PHI cannot
   retroactively erase it to adopt PPN's compliance-by-architecture approach
   without destroying their existing data and user relationships

3. **Simultaneous multi-segment presence** — serving clinics (.net), practitioners
   (.com), and institutions (.org) under one brand concentrates market perception
   in a way that any single-domain competitor cannot match

---

## 10. Risk Analysis & Mitigations

### 10.1 Legal Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| DOJ/DEA investigation of practitioners who use ppnportal.net | Medium | High (for practitioners) / Low (for PPN Portal) | No-PHI architecture; quality improvement positioning; "scoreboard, not coach" language |
| FTC scrutiny of "audit defense" marketing claims | Low | Medium | Avoid legal guarantee language; use "supports" not "provides" legal defense |
| State licensing board action against practitioners citing ppnportal.net records | Low-Medium | Medium | Not PPN's liability; practitioners are independent; no PPN endorsement of clinical decisions |
| HIPAA enforcement action claiming PPN Portal is a Business Associate | Low | High | Legal opinion letter confirming no-PHI architecture; proactive counsel engagement |
| Grey market content on ppnportal.com (Track B) attracting regulatory attention | Medium | Medium | Attorney review before publication; harm reduction framing; no promotion of illegal activity |

### 10.2 Business Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cold start problem — insufficient data volume for Wisdom Trust | High (near-term) | High (long-term) | Sequencing: SaaS first, data trust second; data bounty model to accelerate accumulation |
| ppnportal.com churns because practitioners don't value directory listing | Medium | Medium | Supervision circles (high-value) > directory listing (low-value); lead with circles |
| Competitor acquires ppnportal.com or ppnportal.org domains before registration | N/A | N/A | RESOLVED — Trevor already owns all three TLDs |
| Advisory Board recruitment stalls, delaying vocabulary governance | Medium | Medium | Interim: founder/core team serves as governance body; Board formalized in Q2 2026 |

### 10.3 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Database breach of ppnportal.net | Low | Low (by design) | No PHI to steal; HMAC pseudonymization makes subject IDs useless; regular security audits |
| API endpoint leaking more than counts | Low | High | Rate limiting; output schema validation; no query parameters that can expose individual records |
| Cross-domain authentication confusion leading to PHI leakage | Low | High | Separate Supabase projects; no shared tokens; regular architecture audit |
| practitioner.com content violates HIPAA via case discussion forum | Medium | High | Terms of service prohibition; moderation; no patient identifiers allowed in any post |

---

## 11. Governance & Data Policies

### 11.1 Advisory Board

The PPN Portal Advisory Board is the governance body for vocabulary standards,
data use agreements, and research partnerships. It provides:

- **Vocabulary governance:** Reviews and approves additions/changes to ref_ tables
- **Research oversight:** Reviews and approves custom dataset requests for ppnportal.org
- **Clinical standards:** Establishes best practices communicated through the Protocol Library
- **Institutional credibility:** Member credentials lend authority to PPN Portal's
  data and policy submissions

**Target composition:**
- 2–3 Clinical practitioners (MD/DO with psychedelic therapy experience)
- 1 Biostatistician or epidemiologist
- 1 Healthcare attorney (regulatory/compliance focus)
- 1 Pharmacologist (receptor binding / drug interaction expertise)
- 1 Community representative (patient/participant advocate)
- 1 Regulatory affairs specialist (FDA experience)

**Compensation model:** TBD (equity, stipend, or co-authorship credit on
ppnportal.org publications)

### 11.2 Vocabulary Governance Policy

The controlled vocabulary (ref_ tables) that forms the backbone of
ppnportal.net's data integrity is governed as follows:

- **Additions:** Proposed by practitioners via "request to add" feature;
  reviewed by Advisory Board on a monthly cycle; approved additions
  deployed in the next release
- **Changes:** Never retroactive changes to existing codes (additive-only policy);
  deprecated terms marked with `is_active: false` and `deprecated_at` timestamp;
  historical data references preserved
- **Publication:** Approved vocabulary published to ppnportal.org as open standard
  on quarterly basis
- **Versioning:** Each vocabulary release tagged with semantic version number;
  data exports include vocabulary version in metadata

### 11.3 Data Use Agreement Template (ppnportal.org)

All custom dataset recipients must execute a data use agreement that includes:

- Prohibition on re-identification attempts
- Prohibition on combining PPN Portal data with other datasets in a manner
  that could enable individual identification
- Attribution requirement: "Data provided by PPN Portal (ppnportal.org)"
- Permitted uses: Research, regulatory submissions, publication (with approval)
- Prohibited uses: Marketing, insurance underwriting of identified individuals,
  law enforcement
- Retention and destruction requirements
- Breach notification obligations

---

## 12. Implementation Timeline & Milestones

### Phase 1 — Current (Live)
- [x] ppnportal.net live with Phase 1, 2, and 3 workflows
- [x] HMAC pseudonymization architecture in place
- [x] ref_ table controlled vocabulary operational
- [x] Safety check / contraindication system operational
- [x] Benchmarking layer (basic)

### Phase 1b — Wednesday, February 26, 2026
- [ ] Contextual Network Intelligence Card (WO-343) — BUILDER
- [ ] Static ppnportal.com placeholder page
- [ ] Dr. Allen demo: new patient module walkthrough
- [ ] Dynamic substance affinity profile (WO-341)

### Phase 2 — Q2 2026
- [ ] ppnportal.com: practitioner opt-in directory (Phase 1)
- [ ] ppnportal.com: supervision circles feature (Phase 1)
- [ ] Advisory Board formally seated
- [ ] Vocabulary governance process operational
- [ ] Email newsletter segmentation (clinical vs. grey market tracks)
- [ ] Blog content published (Track A — 8 articles)
- [ ] Track B content (grey market) — attorney reviewed and published

### Phase 3 — Q3 2026
- [ ] ppnportal.org: first annual outcomes report published
- [ ] ppnportal.org: open vocabulary standard published
- [ ] ppnportal.com: case consultation feature launched
- [ ] Risk Management Engine: insurance partnership active
- [ ] First institutional research dataset sold

### Phase 4 — Q4 2026 / 2027
- [ ] ppnportal.org: Wisdom Trust activated (10,000+ records)
- [ ] Custom dataset licensing to pharmaceutical buyers
- [ ] Clinical trial recruitment (Decentralized CRO model)
- [ ] Series A / exit thesis documentation

---

## Appendix A — Technical Stack Overview

### ppnportal.net
- **Frontend:** React (Vite), TypeScript
- **Backend/Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel (ppnportal.net)
- **Authentication:** Supabase Auth (email/password; no social login
  to prevent OAuth token cross-contamination)
- **Security:** Row Level Security (RLS) on all tables; all writes
  go through authenticated API; no direct database access
- **Data isolation:** Separate Supabase project from ppnportal.com

### ppnportal.com (planned)
- **Frontend:** React (Vite) or Next.js (SEO-optimized routing)
- **Backend/Database:** Separate Supabase project
- **Hosting:** Vercel (ppnportal.com)
- **Authentication:** Supabase Auth — independent from ppnportal.net
- **Cross-domain data:** Read-only API endpoint from ppnportal.net
  (integer counts only); no database joins across projects

### ppnportal.org (planned)
- **Frontend:** Static site (Next.js or similar) — optimized for
  academic/institutional readability
- **Backend:** Serverless functions for dataset request handling
- **Data source:** De-identified exports from ppnportal.net
  (batch process; k-anonymity filter applied at source)
- **Hosting:** Vercel (ppnportal.org)
- **Authentication:** Not required for public content; researcher
  portal requires credentialed account

---

## Appendix B — Regulatory Reference Framework

| Regulation | Relevance | How PPN Portal Addresses It |
|---|---|---|
| HIPAA Privacy Rule (45 CFR Part 164) | Data privacy for health information | No PHI collected; Safe Harbor de-identification for published data |
| 21 CFR Part 11 | Electronic records in FDA-regulated activities | ppnportal.net not currently FDA-regulated; architecture compatible with 21 CFR 11 if required |
| Controlled Substances Act (21 U.S.C. § 801) | Federal scheduling of psilocybin/MDMA | Quality improvement positioning; no possession/distribution; pseudonymized records |
| Oregon Psilocybin Services Act (ORS Chapter 475) | Oregon licensing framework | ppnportal.net compatible with OHA record-keeping guidelines |
| Colorado Natural Medicine Health Act | Colorado licensing framework | ppnportal.net compatible with DORA guidelines |
| GDPR (EU 2016/679) | EU data protection | No EU operations currently; architecture compatible with GDPR principles |
| 42 CFR Part 2 | Substance use disorder records | Not currently applicable (no SUD treatment records stored) |

---

## Appendix C — Decision Log

| Date | Decision | Rationale | Owner |
|---|---|---|---|
| 2026-02-23 | Three-domain architecture confirmed | Compliance, business model, and SEO requirements each favor domain separation; Trevor already owns all three TLDs | PRODDY |
| 2026-02-23 | Network domain: ppnportal.com (not a new brand) | Single brand equity; no multi-brand management overhead; .com is the default press/public-facing destination | PRODDY |
| 2026-02-23 | Data separation wall: architectural, not policy-only | Policy can be violated; architecture cannot; legal defensibility requires the wall to be structural | PRODDY |
| 2026-02-23 | ppnportal.org for research layer | .org TLD carries institutional trust; compatible with academic citation norms | PRODDY |
| 2026-02-23 | K-anonymity floor: N=5 minimum | Industry standard for suppression; prevents inference attacks on small cohorts | PRODDY |
| TBD | Track B content attorney review | Grey market content requires legal clearance before publication | PRODDY |
| TBD | Advisory Board composition and compensation | Required before vocabulary governance and institutional research partnerships | PRODDY/LEAD |

---

*Document prepared by PRODDY — PPN Portal Strategy Team*
*February 23, 2026*
*For internal use, legal counsel, investor review, and partner briefings*
*Do not distribute externally without removing the Decision Log and Risk sections,
or obtaining Trevor Calton's approval for full distribution.*

==== PRODDY ====
