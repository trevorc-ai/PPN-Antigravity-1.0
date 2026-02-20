# PPN Portal — Platform Overview Memo
**Prepared for:** Partner Review  
**Date:** February 19, 2026  
**Prepared by:** Product Team  
**Status:** Informal / Internal Draft — Not for distribution

---

## Overview

PPN (Psychedelic Protocol Network) Portal is a clinical intelligence platform purpose-built for practitioners and researchers working with psychedelic-assisted therapy. It serves as the connective tissue between a clinical session, the research literature, regulatory risk management, and longitudinal patient outcomes. The platform is designed to feel like a clinical co-pilot — not an EHR replacement, not a generic practice management tool. It is specifically architected for the nuances of this modality.

The platform operates in three primary modes: a **free public knowledge layer** that positions PPN as a trusted authority, a **core clinical tier** for individual practitioners and small practices, and an **enterprise layer** designed for multi-site clinics, networks, and institutional research programs.

---

## Free Features

These features are publicly accessible and require no subscription. Their purpose is trust-building, SEO, and top-of-funnel lead generation.

**Substance Catalog**  
A browsable reference library covering major psychedelic and adjacent substances (psilocybin, MDMA, ketamine, LSD, ayahuasca, mescaline, and others). Each entry includes a pharmacology summary, mechanism of action, half-life, metabolism pathway, and basic clinical context. Designed to be the most comprehensive and readable substance reference in the space.

**Substance Monograph**  
Deep-dive individual compound pages with full clinical profiles including evidence base, dosing ranges, contraindications, drug interaction highlights, and relevant research citations. Intended as a quick reference for practitioners during preparation or for curious patients.

**Intelligence Hub (News)**  
An aggregated feed of regulatory updates, research publications, clinical trial announcements, and policy news relevant to psychedelic medicine. Keeps practitioners current without leaving the platform.

**Landing Page & About**  
Public-facing positioning, mission statement, and value proposition. Includes live interactive demos accessible without login.

---

## Core Features

These are available to all paid subscribers (individual practitioners and small practices). They represent the primary clinical workflow tools.

**Dashboard**  
A live summary view of active patients, upcoming sessions, recent flags, protocol completions, and KPI metrics. Designed to give a practitioner a full situational picture in under 30 seconds.

**Drug Interaction Checker**  
Real-time contraindication screening against a curated peer-reviewed database (`ref_clinical_interactions`). Practitioners enter a patient's current medications and receive severity-ranked interaction alerts. Currently seeded with 11 high-priority interactions (including Psilocybin + MAOI which is an absolute contraindication). Medications are drawn from the `ref_medications` table (39 medications across 9 categories). Source citations link to PubMed.

**Wellness Journey — Full Arc of Care**  
The most important feature on the platform. A longitudinal patient tracking system organized into three phases: Preparation (Phase 1), Treatment Session (Phase 2), and Integration (Phase 3). Each phase contains structured clinical forms that feed into a live dashboard showing patient progress, risk indicators, and clinical metrics. Described in detail in the Forms section below.

**My Protocols**  
A practitioner's library of saved patient protocols. Allows creating, viewing, editing, and managing protocols for multiple patients. Serves as the home base before launching a Wellness Journey session.

**Protocol Builder (Demo)**  
An interactive tool for constructing a clinical protocol from scratch — selecting substance, dose range, session schedule, and integration plan — with AI-assisted recommendations based on patient baseline data.

**Protocol Detail**  
A comprehensive view of a single protocol including all clinical data collected across all phases, risk flags, vitals, MEQ-30 scores, and integration session notes in one unified record.

**Adaptive Assessment**  
A dynamic branching assessment instrument that adjusts follow-up questions based on previous answers. Implements a smart decision tree covering anxiety, trauma history, substance use history, and treatment goals. Responses feed into the baseline risk model.

**MEQ-30 Assessment**  
A standalone implementation of the Mystical Experience Questionnaire (30-item version), the gold standard for measuring the depth and character of a psychedelic experience. Scores are correlated with sustained therapeutic benefit and feed into the longitudinal outcome model.

**Audit Logs**  
A tamper-evident, timestamped log of all clinical actions taken within the platform — form submissions, protocol changes, data exports, and login events. Supports 21 CFR Part 11 compliance requirements.

**Clinician Directory**  
A searchable network of registered practitioners. Currently functioning as a discovery layer; intended to become a referral network and peer supervision tool.

**Clinician Profile**  
Each practitioner has a profile page including credentials, specialties, treatment modalities, and clinic affiliation. Visible to the network; editable by the practitioner.

---

## Clinic & Network Features

These features are designed for multi-site clinics, group practices, training programs, and research institutions. They require an Enterprise tier subscription.

**Multi-Patient Management**  
The Wellness Journey supports multiple concurrent patients, each identified by an anonymous Subject ID. The patient selection modal at session start allows practitioners to start new sessions or resume existing ones across a patient roster.

**Clinician Network & Coordination**  
The directory and profile system supports clinic-wide visibility. Practitioners can see colleagues' active protocols and flag cases for supervision.

**Batch Registration / Device Registration**  
Located in the shared form components, Batch Registration allows bulk patient onboarding for research cohorts or training programs. Device Registration handles clinical monitoring equipment provisioned at the clinic level.

**AuditLogs with Role-Based Access**  
Enterprise accounts get full audit trails with role-level filtering — a supervising physician can see all actions across their clinic's practitioners, not just their own.

**Session Export Center**  
A multi-report export hub that generates structured exports across all session data for a clinic. Supports filtering by date range, substance protocol, and clinical indication. Output formats: CSV, JSON, PDF. All exports are HIPAA-compliant with automatic PII scrubbing and are logged under 21 CFR Part 11.

**Clinical Report PDF**  
A fully branded, multi-page clinical report generated as a PDF. Covers complete patient arc — baseline, session vitals, MEQ-30 scores, adverse events, integration progress, and outcome metrics. Designed to be submitted to IRBs, referring physicians, or used for supervision.

**Analytics & Deep Dives**  
Aggregate outcome analytics across the clinic's entire patient population. Currently includes deep-dive reports on specific substances and indications. Intended to evolve into a benchmarking tool.

---

## Features for the Shadow / Grey Market

These features are architected with operational security in mind for practitioners operating in jurisdictions where psychedelic therapy is not yet formally legal, or who serve patient populations that require discretion.

**Anonymous Subject ID System**  
No real names, no free-text personal identifiers. Every patient is tracked by a system-generated anonymous ID (e.g., `PT-PF99AHD56L`). Practitioners cannot accidentally store PHI even if they try — the system architecture prevents it.

**Controlled Vocabulary Forms**  
All clinical observations are captured through predefined dropdown and checkbox selections rather than free-text entry fields. This means a practitioner cannot write something inadvertently identifying in a form. Every data point is a foreign key to a reference table.

**Secure Gate**  
An access control layer that allows practitioners to lock specific areas of the platform behind an additional authentication step. Designed for practitioners who may share devices in a clinical setting.

**De-Identified Export**  
All data exports automatically strip the Subject ID and replace it with a research pseudoonym. Re-identification is architecturally prevented, not just policy-prevented.

**No Substance-Specific Red Flags in UI**  
The platform uses clinical language throughout (e.g., "treatment session," "therapeutic agent," "compound protocol") rather than explicitly naming controlled substances in user-visible headers. This allows practitioners to show the platform to patients or observers without causing alarm.

**Ingestion Hub (OCR & Bulk Input)**  
A data ingestion pipeline that accepts scanned documents, lab reports, and legacy records. Currently supports OCR-based extraction for converting handwritten or printed intake forms into structured database records.

---

## Outputs & Exports

**PDF Reports**  
- Clinical Report PDF: Full multi-page formatted patient record (ClinicalReportPDF.tsx) — includes all baseline scores, session vitals, MEQ-30, adverse events, integration notes, and outcome trajectory charts.
- Baseline Export PDF: Quick one-page snapshot of the Set & Setting baseline profile, exported from the Phase 1 Demo or Protocol Detail.

**CSV Exports**  
- Raw session data filterable by date range, substance, and clinical indication.
- Longitudinal outcomes data for research use.

**JSON Exports**  
- Machine-readable format for interoperability with research databases or external analytics tools.

**Session Export Center**  
The Session Export Center (DataExport.tsx) is the primary export hub. It supports all three formats, shows export history with file IDs, status indicators, and action logs. Progress bar feedback during generation. Exports are logged against practitioner ID for audit trail.

---

## Alternate & Bulk Input Options

**OCR / Ingestion Hub**  
The Ingestion Hub (IngestionHub.tsx) is a document ingestion pipeline. It accepts scanned paper intake forms, existing assessment printouts, or lab reports and uses OCR to extract structured data, mapping it to the corresponding form fields and reference IDs. Designed specifically for practitioners transitioning from paper-based workflows or who receive patient records from other providers.

**Batch Registration Modal**  
For research protocols or training cohorts, practitioners can register multiple patients in a single operation. Accepts a list of anonymous Subject IDs and assigns them to a protocol template.

**Device Registration Modal**  
For clinics using monitoring hardware (heart rate, blood pressure, SpO2 during sessions), device registration links hardware identifiers to the session record so vitals can be ingested automatically.

**Vital Presets Bar**  
During session vitals entry, common clinical presets (normal adult ranges) can be applied with one click rather than entering values manually.

**Now Button**  
A timestamp shortcut that populates date/time fields with the current time. Used throughout session forms to reduce friction during live clinical documentation.

---

## Unused & Coming Soon Features

**PCL-5 (PTSD Checklist)** — The PTSD Checklist for DSM-5 is built into the SetAndSettingCard component as an optional fifth score. The form field is wired and the visualization (PCL5SeverityZones) is built, but it is not yet surfaced in the Phase 1 flow UI. Will be added as a toggle in the baseline assessment when the patient has documented PTSD as primary indication.

**Physics Demo / Isometric Molecules Demo** — Two visual demonstration pages (PhysicsDemo.tsx, IsometricMoleculesDemo.tsx) showing 3D molecular visualization capabilities. Currently not linked from any primary navigation. Intended to become an interactive compound explorer within the Substance Monograph.

**Molecular Visualization Demo** — A full 3D protein binding site renderer (MolecularVisualizationDemo.tsx) built with Three.js. Built and functional, not yet integrated into Substance Monograph pages.

**Contribution Model** — A page (ContributionModel.tsx) outlining the platform's data contribution framework — how practitioners contribute anonymized outcomes data to the aggregate research pool. Policy is defined; the data contribution pipeline is not yet fully wired to the backend.

**Help Center** — Currently a placeholder page (10 bytes). Full documentation, video walkthroughs, and clinical protocol guides are planned.

**Component Showcase / Hidden Components Showcase** — Developer-facing pages that display all UI components in their various states. Used internally for QA; not linked from production navigation.

**Pricing Page** — Built (Pricing.tsx) but currently not in primary navigation flow. Will go live at launch.

**Checkout / Billing Portal** — Payment flow (Checkout.tsx, BillingPortal.tsx) is built. Not yet activated — will be enabled at commercial launch.

**Notifications** — Notification center (Notifications.tsx) is built. Push notification infrastructure is not yet wired to the backend event system.

**ref_clinical_observations table** — The controlled vocabulary table for clinical observations is defined in code (ObservationSelector.tsx) but the table does not yet exist in the live database. Currently shows an empty state gracefully.

---

## All Clinical Forms

The platform's Arc of Care form library covers the full therapeutic arc. All forms are built as SlideOut panel components with Zod validation, PHI-safe controlled vocabulary, and Supabase integration.

**Phase 1: Preparation**

- **Informed Consent Form** — Documents patient consent for psychedelic-assisted therapy. Includes acknowledgment checkboxes, practitioner countersignature, and timestamp.
- **Set & Setting Form** — Captures the patient's intentions, environmental preferences, significant life events, and personal history relevant to the session.
- **Baseline Observations Form** — Records pre-treatment clinical observations using controlled vocabulary selectors (PHI-safe, no free text).
- **MEQ-30 Questionnaire Form** — The Mystical Experience Questionnaire for measuring depth of experience. 30 items on a 6-point scale across 4 dimensions.

**Phase 2: Treatment Session**

- **Session Vitals Form** — Continuous vital signs capture during the session: blood pressure, heart rate, SpO2, respiratory rate, temperature. Includes a Vital Presets Bar for rapid entry, Now Button for timestamps, and a Visual Timeline showing readings over time.
- **Session Timeline Form** — Timestamps and clinical annotations throughout the session arc (onset, peak, resolution, closing).
- **Session Observations Form** — Structured behavioral and phenomenological observations using controlled vocabulary.
- **Dosing Protocol Form** — Documents actual dose administered, route, timing, and any re-dosing. Compares to the protocol plan.
- **Safety & Adverse Event Form** — Structured adverse event reporting with severity classification, intervention documentation, and outcome notation. Includes MedWatch-compatible fields.
- **Rescue Protocol Form** — Documents any emergency intervention, anxiolytic use, or session termination with clinical rationale.

**Phase 3: Integration**

- **Structured Integration Session Form** — Session-by-session integration notes covering themes, breakthroughs, challenges, and clinical objectives for the next session.
- **Longitudinal Assessment Form** — Follow-up PHQ-9 and GAD-7 scoring at defined timepoints (2-week, 4-week, 3-month, 6-month) for outcomes tracking.
- **Behavioral Change Tracker Form** — Patient-reported behavioral changes categorized by domain (sleep, relationships, work, substance use, mood).
- **Daily Pulse Check Form** — A lightweight 3-question daily check-in for integration-phase patients. Designed for patient self-completion via a future mobile interface.

**Ongoing Safety**

- **Structured Safety Check Form** — A Columbia Suicide Severity Rating Scale (C-SSRS)-based safety screen with structured contraindication review. Can be used at any phase.

---

## All Component Visualizations

These are interactive data visualization components built specifically for the platform.

**ExpectancyScaleGauge** — A radial gauge showing treatment expectancy (1–100) with color-coded bands (Low/Moderate/High Belief). Animates as the score changes.

**ACEScoreBarChart** — A horizontal bar chart showing the patient's ACE score against a 10-point scale with trauma severity bands. Color transitions from green (low) to red (high trauma).

**GAD7SeverityZones** — An interactive severity zone visualization for GAD-7 scores (0–21). Shows the patient's score marker sliding across color-coded severity bands (Minimal → Mild → Moderate → Severe) with contextual clinical notes.

**PHQ9SeverityZones** — The same severity zone architecture but for PHQ-9 (0–27) depression severity, with 5-band classification and clinical intervention thresholds marked.

**PCL5SeverityZones** — PTSD Checklist severity visualization (0–80) with DSM-5 probable diagnosis threshold marked at 33. Built and functional; not yet surfaced in primary UI flow.

**PredictedIntegrationNeeds** — An algorithm-driven visualization that takes ACE score, GAD-7, PHQ-9, and expectancy scale inputs and outputs a recommended integration session count and schedule (weekly/biweekly). Displays a visual session calendar with risk rationale.

**SetAndSettingCard** — The master composite visualization for Phase 1 baseline profile. Combines all of the above visualizations into a single scrollable card with an Export PDF button.

**ReadinessScore** — A composite score visualization showing overall patient readiness for treatment based on all baseline inputs. Feeds from the augmented intelligence model.

**RequirementsList** — A checklist-style visualization showing which pre-treatment requirements have been met and which are outstanding, with quick-action links to open the relevant forms.

**RiskIndicators** — A live risk flag panel that monitors baseline data, session vitals, and progress data simultaneously and surfaces flags (e.g., "PHQ-9 > 20: psychiatric consult recommended," "MAOI detected: absolute contraindication").

**SafetyTimeline** — A chronological event timeline of all safety-relevant events in the patient's journey — adverse events, safety checks, rescue interventions, and follow-up assessments.

**VisualTimeline** — Used within the Session Vitals Form to display vital sign readings over time during the session. Points plotted as a sparkline with color-coded alert zones.

**Phase1StepGuide** — The primary navigation component for the Wellness Journey Phase 1. Displays the current step as a full-width hero card with a prominent CTA, and a five-step progress rail below it.

---

*This memo reflects the platform state as of February 19, 2026. Several features are under active development. Tier designations (Free / Core / Enterprise) are indicative of intended distribution; final pricing tiers are subject to go-to-market finalization.*
