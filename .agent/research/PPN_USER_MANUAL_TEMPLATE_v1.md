# PPN Research Portal — User Manual
## Version 1.0 | Beta Preview Edition
**Last Updated:** February 2026  
**Audience:** Licensed Practitioners, Clinic Administrators, Integration Specialists  
**Status:** [DRAFT — Screenshots Pending]

> **PRODDY NOTE TO TREVOR:** This is a living template. Placeholders marked `[SCREENSHOT: ...]` are exactly where your screenshots should be inserted. I've structured each section so you can drop screenshots in without rewriting anything. See the "Screenshot Collection Guide" at the end of this document (Appendix B) for the full capture list.
>
> **v1.1 UPDATE (Gap Audit Complete):** Cross-referenced `ComponentShowcase.tsx`, `FormsShowcase.tsx`, `HiddenComponentsShowcase.tsx`, `PartnerDemoHub.tsx`, and all 65+ page files. Added 8 missing sections: Security Suite (Dosage Calculator, Crisis Logger, Blind Vetting), NeuralCopilot AI Assistant, Registry Upload, Substance Monograph, MEQ-30 Assessment Page, Deep Dives, Partner Demo Hub. Also corrected MEQ-30 placement (it belongs to Phase 1 Preparation, not Phase 2).

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
   - 2.1 Account Access & Login
   - 2.2 First-Time Setup
   - 2.3 Taking the Guided Tour
   - 2.4 Navigating the Interface
3. [Dashboard](#3-dashboard)
4. [Clinical Workflow](#4-clinical-workflow)
   - 4.1 Wellness Journey (Arc of Care)
   - 4.2 My Protocols
   - 4.3 Drug Interaction Checker
   - 4.4 MEQ-30 Assessment Page
5. [Knowledge Base](#5-knowledge-base)
   - 5.1 Substance Catalog
   - 5.2 Substance Monograph (Individual Substance Pages)
   - 5.3 Intelligence Hub
6. [Insights & Analytics](#6-insights--analytics)
   - 6.1 Analytics Dashboard
   - 6.2 Deep Dive Analytics
   - 6.3 Adaptive Assessment
   - 6.4 Data Export & Reporting
7. [Security Suite (Phantom Shield)](#7-security-suite-phantom-shield)
   - 7.1 Dosage Calculator (Potency Normalizer)
   - 7.2 Crisis Logger
   - 7.3 Blind Vetting Scanner
8. [AI Features](#8-ai-features)
   - 8.1 NeuralCopilot AI Assistant
9. [Registry Upload (Ingestion Hub)](#9-registry-upload-ingestion-hub)
10. [Network Features](#10-network-features)
    - 10.1 Clinician Directory
11. [Settings & Account Management](#11-settings--account-management)
12. [Privacy & Data Security](#12-privacy--data-security)
13. [Troubleshooting & FAQ](#13-troubleshooting--faq)
14. [Glossary](#14-glossary)
15. [Contact & Support](#15-contact--support)
16. [Appendix A: Form Reference Guide](#appendix-a-form-reference-guide)
17. [Appendix B: Screenshot Collection Guide](#appendix-b-screenshot-collection-guide)

---

## 1. Introduction

### What Is PPN Research Portal?

The PPN Research Portal is a **clinical intelligence platform** built specifically for psychedelic therapy practitioners. It provides the operational infrastructure to:

- **Document treatment episodes** using structured, de-identified data
- **Check drug interactions** before administering substances
- **Track patient outcomes** across the full Arc of Care
- **Benchmark performance** against an anonymized network of peer clinics
- **Export audit-ready reports** for insurance, compliance, and quality improvement

> **Who This Manual Is For:**  
> This manual is written for licensed practitioners, clinic administrators, and integration specialists using the PPN Portal to manage psychedelic-assisted therapy (PAT) protocols—including ketamine, psilocybin, MDMA-assisted therapy, and adjacent modalities.

### A Note on Privacy

The PPN Portal is built on a **Zero-PHI architecture**. This means:

- We **never** collect patient names, emails, phone numbers, dates of birth, or medical record numbers (MRNs)
- All patient records use hashed, de-identified Subject IDs
- Dates are stored as **year only** (HIPAA Safe Harbor compliant)
- Your data is encrypted with TLS 1.3 + AES-256 at rest and in transit

See [Section 9: Privacy & Data Security](#9-privacy--data-security) for full details.

---

## 2. Getting Started

### 2.1 Account Access & Login

**Step 1: Navigate to the Portal**

Open your browser and go to:
```
https://ppnportal.com
```
*(During beta preview, use the URL provided by your account administrator.)*

**Step 2: Log In**

Enter your credentials on the login screen and click **Sign In**.

`[SCREENSHOT: Login page — full view]`

> **First-time users:** If this is your first login, you will be prompted to change your temporary password immediately. Use a strong password (minimum 12 characters).

**Forgot your password?**
1. Click **Forgot Password** on the login screen
2. Enter your email address
3. Check your inbox for a reset link (valid for 24 hours)

---

### 2.2 First-Time Setup

After your first login, you will land on the **Dashboard**. Here's what to do first:

| Step | Action | Where to Find It |
|------|--------|-----------------|
| 1 | Review the Dashboard overview | Dashboard → top of page |
| 2 | Take the Guided Tour | Dashboard → "Start Tour" button |
| 3 | Set up your first protocol | Dashboard → Quick Actions → "Log Protocol" |
| 4 | Run a drug interaction check | Sidebar → Interaction Checker |
| 5 | Explore the Substance Catalog | Sidebar → Knowledge Base → Substance Catalog |

---

### 2.3 Taking the Guided Tour

The Guided Tour is a 5-step walkthrough of the portal's core features. It takes approximately 5 minutes.

**To start the tour:**
1. From the Dashboard, locate the **"Start Tour"** button in the top navigation area
2. Click it — the tour will begin immediately

`[SCREENSHOT: Dashboard with "Start Tour" button highlighted]`

**Tour Steps:**
- **Step 1:** Welcome to Your Command Center (Dashboard overview)
- **Step 2:** Log Your First Patient Journey (Wellness Journey)
- **Step 3:** Prevent Dangerous Interactions (Interaction Checker)
- **Step 4:** Access Evidence-Based Guidance (Substance Catalog)
- **Step 5:** Get Help Anytime (Help Center)

> **Tip:** You can restart the tour at any time by navigating to **Help & FAQ** and clicking **"Restart Tour"**.

---

### 2.4 Navigating the Interface

The PPN Portal uses a **sidebar navigation** on the left side of every page.

`[SCREENSHOT: Full sidebar — all sections visible]`

**Navigation Sections:**

| Section | Pages |
|---------|-------|
| **Core** | Dashboard |
| **Clinical Tools** | My Protocols, Interaction Checker |
| **Knowledge Base** | Substance Catalog, Intelligence Hub |
| **Network** | Clinician Directory |
| **Support** | Help & FAQ |

**Top Navigation Bar:**  
The top bar shows:
- Current page title
- System status indicator
- Notification bell icon
- Your account avatar/menu

`[SCREENSHOT: Top navigation bar — annotated]`

---

## 3. Dashboard

The Dashboard is your command center — a high-level view of your clinic's performance, safety status, and recommended next actions.

`[SCREENSHOT: Full Dashboard — annotated with callouts for each section]`

### Dashboard Sections

**1. Clinic Performance Metrics**  
Four summary cards displaying key performance indicators:
- Total protocols logged
- Active subjects
- Average session duration
- Network benchmark position

**2. Safety Risk Assessment Matrix**  
A visual matrix showing current risk levels across your active protocols. Risk levels are displayed in labeled categories — **Low**, **Moderate**, **High**, **Critical** — and are never communicated by color alone.

`[SCREENSHOT: Safety Risk Matrix]`

**3. Recommended Next Steps**  
Context-aware action items based on your current data. Examples include:
- "3 protocols are missing follow-up assessments"
- "2 subjects have not completed integration check-ins"

**4. Quick Actions**  
Fast-access buttons for the most common tasks:
- Log Protocol
- Check Interactions
- Export Data
- View Analytics
- View Reports

**5. Network Activity Feed**  
Anonymized network insights showing aggregate trends from peer clinics. No individual clinic or patient data is identifiable in this feed.

---

## 4. Clinical Workflow

### 4.1 Wellness Journey (Arc of Care)

The **Wellness Journey** is the centerpiece of the clinical workflow. It tracks the complete arc of care for each patient episode across three phases.

`[SCREENSHOT: Wellness Journey main view — showing all three phases]`

#### The Three Phases of Care

---

**Phase 1: Preparation**

Everything that happens before a dosing session. This phase uses five structured forms:

| Form | Purpose |
|------|---------|
| Mental Health Screening | PHQ-9, GAD-7, and ACE screening to establish baseline |
| Set & Setting Assessment | Documents the session environment and therapeutic container |
| Baseline Physiology | Records vital signs before the session |
| Baseline Observations | Clinician's pre-session clinical observations |
| Informed Consent | Structured consent documentation (not free-text) |

`[SCREENSHOT: Phase 1 panel — expanded, showing form options]`

**To open a Preparation form:**
1. From the Wellness Journey page, click on the **Phase 1: Preparation** panel
2. Click the form name you want to complete
3. A slide-out panel will appear on the right side of the screen
4. Fill in all required fields (marked with an asterisk *)
5. Click **Save** when complete

> **Important:** All forms use structured inputs (dropdowns, checkboxes, pre-defined scales). Free-text fields are intentionally restricted to preserve de-identification and data comparability.

---

**Phase 2: Dosing Session**

Real-time documentation during an active dosing session. Nine forms cover every aspect of session monitoring:

| Form | Purpose |
|------|---------|
| Dosing Protocol | Substance, dose, route, and session number |
| Session Vitals | Real-time vital sign monitoring during the session |
| Session Timeline | Log of timestamped session events |
| Session Observations | Clinician's structured observations during the session |
| Post-Session Assessments | Evaluation immediately after substance effects resolve |
| MEQ-30 Questionnaire | Mystical Experience Questionnaire (30 items) |
| Adverse Event Report | Structured documentation of any adverse events |
| Safety Event Observations | Deeper documentation for safety-related incidents |
| Rescue Protocol | Documents any rescue medications or interventions used |

`[SCREENSHOT: Phase 2 panel — expanded, showing 9 form options]`

> **During a session:** The Quick Actions button (floating action button, lower right corner) provides fast access to the most time-sensitive forms — particularly Session Vitals, Safety Event Observations, and Rescue Protocol.

`[SCREENSHOT: Quick Actions floating button — expanded]`

---

**Phase 3: Integration**

Post-session follow-up and longitudinal tracking. Four forms support ongoing integration work:

| Form | Purpose |
|------|---------|
| Daily Pulse Check | Brief daily wellness check-in |
| Longitudinal Assessment | Long-term outcomes measurement at defined follow-up intervals |
| Structured Integration Session | Notes from integration therapy sessions |
| Behavioral Change Tracker | Tracks progress on behavioral goals identified in therapy |

`[SCREENSHOT: Phase 3 panel — expanded]`

---

**Ongoing Safety Monitoring**

One additional form runs parallel to all phases:

| Form | Purpose |
|------|---------|
| Structured Safety Check | Ongoing safety monitoring at any point in the arc of care |

---

#### Viewing the Timeline

The Wellness Journey includes a **Visual Timeline** that shows all logged events for a subject in chronological order.

`[SCREENSHOT: Visual Timeline component — with sample data]`

---

#### Using the Slide-Out Panel

All forms open in a **Slide-Out Panel** on the right side of the screen, keeping the Wellness Journey visible in the background.

`[SCREENSHOT: Slide-Out Panel open — showing a sample form]`

- To close the panel without saving: click the **X** in the top right corner of the panel, or press **Escape**
- To save your work: click the **Save** button at the bottom of the form

---

### 4.2 My Protocols

The **My Protocols** page is your library of all logged treatment protocols.

`[SCREENSHOT: My Protocols page — list view]`

**What you can do here:**
- View all protocols in a sortable, filterable list
- Click any protocol to view its full detail
- See completion status for each phase of care
- Navigate directly to the Wellness Journey for any protocol

**Filtering Protocols:**
Use the filter bar at the top to filter by:
- Date range
- Substance type
- Completion status
- Phase of care

`[SCREENSHOT: Protocol detail page]`

---

### 4.4 MEQ-30 Assessment Page

The **MEQ-30** (Mystical Experience Questionnaire, 30-item) has a dedicated full-page interface in addition to appearing as a form within the Wellness Journey.

`[SCREENSHOT: MEQ-30 standalone page — full view]`

This page provides:
- The complete 30-item questionnaire in a clean, single-focus layout
- Real-time scoring with subscale breakdowns (Mystical, Transcendence, Positive Affect, Noetic Quality)
- Score interpretation and clinical context

**When to use the standalone page vs. the form:**
- **Standalone page** (`/meq30`): Useful when conducting a dedicated MEQ scoring session separately from the full Wellness Journey workflow
- **Wellness Journey form**: Use when MEQ-30 is part of a complete preparation or post-session documentation workflow

---

### 4.3 Drug Interaction Checker

The **Interaction Checker** screens for potentially dangerous drug interactions before you administer any substance.

`[SCREENSHOT: Interaction Checker — main view, empty state]`

#### How to Run an Interaction Check

**Step 1:** Select the primary psychedelic substance from the dropdown
- Examples: Psilocybin, MDMA, Ketamine, LSD, Ayahuasca

**Step 2:** Add any concurrent medications the patient is taking
- Use the search field to find medications by name
- Add multiple medications by selecting each one

**Step 3:** Click **Check Interactions**

`[SCREENSHOT: Interaction Checker — with substances selected, pre-check]`

#### Understanding Results

Results are displayed with a **severity label** (never color alone):

| Label | Meaning | What to Do |
|-------|---------|-----------|
| **SEVERE — Contraindicated** | Do not proceed | Discontinue the combination. Consult immediately. |
| **MODERATE — Caution** | Proceed with heightened monitoring | Document risk mitigation steps. Monitor closely. |
| **MILD — Monitor** | Low-level interaction | Note in session record. Standard monitoring applies. |

`[SCREENSHOT: Interaction Checker — results view with multiple severity levels]`

Each result card shows:
- Substance names involved
- Severity label
- Risk description (what happens and why)
- Mechanism of interaction
- Clinical recommendation
- PubMed reference link (where available)

> **Medical Disclaimer:** The Interaction Checker is a clinical decision support tool. It does not replace clinical judgment, formal pharmacology review, or consultation with a licensed physician. Always verify interactions with appropriate medical references and consult with a physician when in doubt.

#### Hovering for More Context

Hover over the **Severity Score** label on any result to see a tooltip explaining the rating criteria.

`[SCREENSHOT: Interaction Checker — tooltip visible on severity score label]`

---

## 5. Knowledge Base

### 5.2 Substance Monograph (Individual Substance Pages)

Every substance in the catalog has a dedicated **Monograph** page — a deep reference document for that specific compound.

`[SCREENSHOT: Substance Monograph page — Psilocybin — full view]`

**Monograph pages include:**
- Overview and mechanism of action
- Receptor affinity profile
- Dose-response curves
- Pharmacokinetics (onset, peak, duration by route)
- Contraindications and drug interactions
- Clinical evidence summary
- Safety considerations
- Regulatory status by jurisdiction

**To navigate to a Monograph:**
1. Go to **Substance Catalog**
2. Click on any substance tile
3. You will be taken directly to that substance's Monograph page

`[SCREENSHOT: Clicking through from Catalog tile to Monograph page]`

---

### 5.1 Substance Catalog

The **Substance Catalog** is a reference library covering 50+ psychedelic and psychedelic-adjacent substances.

`[SCREENSHOT: Substance Catalog — home/grid view]`

**Each substance entry includes:**
- Clinical overview and mechanism of action
- Typical dosing ranges (low / medium / high / very high)
- Routes of administration
- Onset, peak, and duration timelines
- Known contraindications
- Drug interaction considerations
- Adverse event profile
- Safety protocols
- Research citations

`[SCREENSHOT: Single substance page — e.g., Psilocybin — annotated]`

**Searching the Catalog:**
Use the search bar at the top to find any substance by name or common alias.

`[SCREENSHOT: Substance Catalog — search in use]`

---

### 5.2 Intelligence Hub

The **Intelligence Hub** (also called the News page) aggregates real-time updates from the psychedelic therapy field.

`[SCREENSHOT: Intelligence Hub — main view]`

**Content includes:**
- Regulatory updates (FDA, DEA, state-level)
- Peer-reviewed research publications
- Safety alerts and adverse event notices
- Training and continuing education opportunities
- Policy and legal developments

**Filtering the Feed:**
Use the category filters to narrow the feed by topic area.

---

## 6. Insights & Analytics

### 6.2 Deep Dive Analytics

Beyond the main Analytics Dashboard, PPN offers a suite of **14 Enterprise-grade Deep Dive** visualizations accessible from the Analytics section or via the Partner Demo Hub.

`[SCREENSHOT: Deep Dive navigation grid]`

| Deep Dive | What It Shows | Tier |
|-----------|--------------|------|
| Patient Flow Analysis | Sankey diagram — patient retention and drop-off between phases | Enterprise |
| Clinic Performance Radar | Multi-dimensional performance vs. network average | Enterprise |
| Patient Constellation | 3D clustering of patient outcomes | Enterprise |
| Molecular Pharmacology | Receptor binding profiles and pharmacodynamics | Enterprise |
| Protocol Efficiency | ROI analysis and financial efficiency modeling | Enterprise |
| Workflow Chaos Analysis | Operational bottleneck identification | Enterprise |
| Safety Surveillance | Adverse event monitoring over time | Enterprise |
| Regulatory Mosaic | Multi-jurisdiction compliance tracking | Enterprise |
| Revenue Forensics | Financial performance deep dive | Enterprise |
| Metabolic Risk Analysis | CYP450 genetic risk assessment | Enterprise |
| Confidence Cone | Statistical confidence intervals for outcomes | Enterprise |
| Safety Benchmark | Comparative safety performance | Enterprise |
| Regulatory Weather | Regulatory climate and compliance forecasting | Enterprise |
| Patient Journey Snapshot | Visual arc-of-care progression for a cohort | Enterprise |

> **Access:** Deep Dive pages are available on the **Clinic Benchmark** and **Enterprise** tiers. They are accessible via the Partner Demo Hub during your preview period.

`[SCREENSHOT: Sample Deep Dive — e.g., Patient Flow Sankey]`

---

### 6.1 Analytics Dashboard

The **Analytics** section provides deeper data visualization beyond the main Dashboard.

`[SCREENSHOT: Analytics page — overview]`

#### Available Visualizations

**Clinic Performance:**
- **Clinic Performance Radar** — Your clinic's metrics vs. the network average across multiple dimensions
- **Safety Benchmark** — Adverse event rate benchmarking against network norms

**Patient Analytics:**
- **Patient Constellation** — Outcomes clustering analysis showing how your patient population clusters by outcome
- **Patient Journey Snapshot** — Visual representation of a cohort's journey through the arc of care
- **Patient Flow Sankey** — Patient retention and flow analysis between phases

**Protocol Analytics:**
- **Protocol Efficiency** — Financial efficiency modeling by protocol type
- **Molecular Pharmacology** — Receptor affinity profiles for substances in your formulary
- **Metabolic Risk Gauge** — CYP450 metabolic risk analysis for your active patients

**Deep-Dive Components:**
- **Regulatory Mosaic** — Regulatory landscape by jurisdiction
- **Revenue Forensics** — Revenue analysis by protocol and payer type
- **Confidence Cone** — Confidence interval visualization for outcome trends
- **Safety Risk Matrix** — Detailed risk matrix view

`[SCREENSHOT: Each major visualization — one screenshot per component]`

> **Important — Benchmark Suppression:** Network benchmark data is only displayed when the comparison group has **N ≥ 10** subjects. Below this threshold, data is suppressed to protect individual privacy. This is enforced at the database level, not just the interface.

---

### 6.2 Assessment Tools

#### Adaptive Assessment

The **Adaptive Assessment** tool provides an interactive, branching questionnaire experience for clinical evaluation.

`[SCREENSHOT: Assessment page — question view]`

---

### 6.3 Data Export & Reporting

The **Export Center** allows you to generate and download structured data exports for:
- Insurance and payer submissions
- Quality improvement reporting
- Research and audit preparation
- Internal clinic reviews

`[SCREENSHOT: Export Center — main view]`

#### Generating a Report

**Step 1:** Navigate to **Export Center** via the Dashboard Quick Actions or sidebar

**Step 2:** Select a report type:
- Session Export (CSV)
- Outcomes Summary (PDF)
- Clinical Report (multi-page PDF with data visualizations)
- Safety Event Log (CSV)

**Step 3:** Set filters:
- Date range
- Substance type
- Protocol type
- Phase of care

**Step 4:** Click **Generate Report**

**Step 5:** Download the file when generation is complete

`[SCREENSHOT: Export Center — report generated, download ready]`

#### Clinical Report PDF

The Clinical Report PDF is a professionally formatted, multi-page document suitable for:
- Insurance submissions
- Regulatory audits
- Peer review and consultation

It includes:
- Clinic performance summary
- Outcomes trend charts
- Safety event log
- Protocol breakdown

`[SCREENSHOT: Clinical Report PDF — first page preview]`

---

## 7. Security Suite (Phantom Shield)

The **Phantom Shield** is a suite of specialized tools designed for session-level safety, dosing accuracy, and practitioner protection. These components are available from the Component Showcase and, where integrated, from the Wellness Journey quick actions.

> **Note:** Phantom Shield features focus on practitioner-side operational safety. They do not collect PHI.

---

### 7.1 Dosage Calculator (Potency Normalizer)

The **Dosage Calculator** standardizes dose comparisons across different preparations, concentrations, and batch potencies.

`[SCREENSHOT: Dosage Calculator component — active calculation]`

**Use cases:**
- Converting between different unit systems (mg, μg, mg/kg)
- Normalizing potency across different batch sources
- Calculating adjusted doses based on body weight
- Equivalent dose cross-referencing between substances

**To access:**
- Via **Component Showcase** → WO_003: Dosage Calculator
- Via **Wellness Journey** → Phase 2 → Dosing Protocol form (integrated)

---

### 7.2 Crisis Logger

The **Crisis Logger** is a real-time tactical incident logging interface for use during an active dosing session when a safety event occurs.

`[SCREENSHOT: Crisis Logger component — active, during a session]`

**Key features:**
- Timestamped incident logging (auto-captures current session time)
- Structured event type selection (no free-text)
- Escalation level tracking
- One-tap logging designed for use while managing a clinical situation
- Exports to the session's Adverse Event record

> **Important:** The Crisis Logger is designed for speed under pressure. Every field uses a structured selector — there is no free-text input. This protects both the practitioner (defensible documentation) and the data network (no PHI).

**To access:**
- Via **Wellness Journey** → Quick Actions FAB → Crisis Logger
- Via **Component Showcase** → WO_004: Crisis Logger

---

### 7.3 Blind Vetting Scanner

The **Blind Vetting Scanner** is a practitioner-facing security check for evaluating potential clients with minimum information disclosure.

`[SCREENSHOT: Blind Vetting Scanner — terminal interface]`

This tool allows practitioners to:
- Screen clients against de-identified risk indicators
- Evaluate suitability without collecting or storing PHI
- Generate a structured risk profile using coded inputs only

**To access:**
- Via **Component Showcase** → WO_005: Blind Vetting Scanner

---

## 8. AI Features

### 8.1 NeuralCopilot AI Assistant

The **NeuralCopilot** is an AI-powered clinical assistant built with Google Gemini integration.

`[SCREENSHOT: NeuralCopilot component — active conversation]`

**Capabilities:**
- Real-time substance interaction warnings generated by AI
- Safety flag detection during session documentation
- Terminal-style neural trace animations showing AI reasoning
- Contextual clinical support based on the current protocol

> **Status:** NeuralCopilot is currently available as a preview component. It is accessible via the Hidden Components Showcase. Full platform integration is planned for a future release.

**To access (preview):**
- Navigate to **Hidden Components Showcase** → NeuralCopilot
- URL: `/#/hidden-components`

---

## 9. Registry Upload (Ingestion Hub)

The **Registry Upload** (also called the **Ingestion Hub**) allows institutional users to contribute legacy clinical data to the PPN registry through two methods.

`[SCREENSHOT: Registry Upload page — full view with both modules]`

### Method 1: Legacy Chart OCR

Upload physical clinical records (PDFs or images) for automated digitization and de-identification.

- **Supported formats:** PDF, JPG, PNG
- **Privacy Guard:** All documents are automatically de-identified at the edge before storage. PHI is never cached in cleartext.
- **Process:** Drag-and-drop or select files → automated OCR → review queue → registry sync (24-hour review window)

`[SCREENSHOT: Legacy Chart OCR module — drag-and-drop zone]`

### Method 2: Neural Dictation

Real-time voice-to-protocol synthesis for capturing session notes via audio.

- **HIPAA Buffer:** Audio is processed through an institutional HIPAA buffer — raw audio is not stored
- **Process:** Initialize recording → speak session observations → AI transcribes and structures into coded protocol fields → review before registry sync

`[SCREENSHOT: Neural Dictation module — recording active state]`

### Upload Queue

All uploaded jobs appear in the **Upload Queue** with real-time status tracking:
- **Processing** — Active OCR or transcription in progress
- **Verifying** — De-identification check in progress
- **Pending** — Awaiting 24-hour practitioner manual review before final registry sync

> **Important:** Records remain in Pending state for 24 hours, giving practitioners the opportunity to review before the data is committed to the registry.

---

## 10. Network Features

### 10.1 Clinician Directory

The **Clinician Directory** is an opt-in network of PPN practitioners.

`[SCREENSHOT: Clinician Directory — main view]`

**Important:** The directory is **opt-in only**. Your profile will not appear in the directory unless you explicitly choose to list yourself in your [Settings](#8-settings--account-management).

Search and filter practitioners by:
- Specialty
- Modality (Ketamine, Psilocybin, MDMA, etc.)
- Location (state/region)
- Training credentials

---

## 11. Settings & Account Management

Access your Settings from the avatar icon in the top right navigation bar.

`[SCREENSHOT: Settings page — full view]`

### What You Can Configure

| Setting | Description |
|---------|-------------|
| **Profile** | Name, affiliation, credentials, bio |
| **Directory Listing** | Opt in or out of the Clinician Directory |
| **Notifications** | Email and in-app notification preferences |
| **Data Preferences** | Data contribution settings for benchmark participation |
| **Account Security** | Change password, enable two-factor authentication (2FA) |
| **Billing** | View subscription tier and manage billing information |

### Changing Your Password

1. Go to **Settings → Account Security**
2. Click **Change Password**
3. Enter your current password
4. Enter and confirm your new password (minimum 12 characters)
5. Click **Save**

---

## 12. Privacy & Data Security

### Zero-PHI Architecture

The PPN Portal is built on a **Zero-PHI (Protected Health Information) architecture**. This is not simply a policy — it is enforced at the database level.

**What We NEVER Collect:**
- Patient names
- Email addresses
- Phone numbers
- Dates of birth
- Medical record numbers (MRNs)
- Social Security Numbers
- Addresses or geographic locators more specific than state

**What We DO Collect:**
- De-identified **Subject IDs** (hashed, anonymous identifiers you create)
- Structured clinical data (coded values, not free-text narratives)
- Session-level exposure records (substance, route, dose unit — coded)
- Outcome scale scores (PHQ-9 total, GAD-7 total, MEQ-30 total — not item-level free text)
- Safety event records (coded taxonomy, not narrative descriptions)

### HIPAA Safe Harbor Compliance

All date fields comply with HIPAA Safe Harbor de-identification standards:
- Dates are stored as **year only** (not month or day)
- Ages over 89 are grouped into a single category
- Small cohorts (N < 10) are automatically suppressed in all benchmark outputs

### Network Data & Benchmarking

When your data contributes to network benchmarks:
- Only **aggregate, suppressed statistics** are shared across clinics
- No individual subject's data is ever identifiable in any benchmark output
- Suppression is enforced in the database layer (SQL), not just the interface

### Your Rights

You may:
- **Download** all data associated with your clinic at any time (via Export Center)
- **Delete** your account and all associated data by contacting support
- **Opt out** of network benchmark contribution at any time in Settings

### Data Security Technical Details

| Layer | Standard |
|-------|---------|
| Encryption in transit | TLS 1.3 |
| Encryption at rest | AES-256 |
| Database access control | Row-Level Security (RLS) — every query is tenant-scoped |
| Authentication | Supabase Auth with JWT tokens |

---

## 13. Troubleshooting & FAQ

### Common Issues

---

**Q: Why can't I enter free-text notes in the Protocol Builder or Wellness Journey forms?**

A: This is by design. The PPN Portal uses **structured inputs only** — dropdowns, checkboxes, scales, and coded values. This protects de-identification, enables benchmarking, and ensures your data is audit-ready. Free-text clinical narratives cannot be de-identified reliably and would compromise the integrity of network benchmarks.

*If you want to document clinical observations, please use the **Session Observations** form, which provides structured observation options.*

---

**Q: How is the Interaction Checker validated? Can I trust it clinically?**

A: The Interaction Checker is built from peer-reviewed pharmacology literature and references PubMed citations where available. However, it is a **clinical decision support tool** — it assists your judgment, it does not replace it. Always verify critical interactions with a pharmacist or physician, especially for novel combinations.

---

**Q: Do you store patient information?**

A: No. We never store any Protected Health Information (PHI). All patient records use de-identified Subject IDs created by your clinic. See [Section 9: Privacy & Data Security](#9-privacy--data-security) for full details.

---

**Q: Why can't patients log in to enter their own data?**

A: The PPN Portal is a **practitioner-only platform**. Patients do not have accounts; they are never directly identifiable in the system. Practitioner-entered, structured data maintains the integrity of the de-identification model.

---

**Q: The data export didn't include all my protocols — what happened?**

A: Check your filter settings. The most common cause is an active date range or substance filter that is excluding some records. Clear all filters and try again.

---

**Q: My benchmark numbers are not showing — just dashes. Why?**

A: Network benchmarks are only displayed when the comparison group has N ≥ 10 subjects. If you are seeing suppressed data (—), it means the filter you've applied results in a group smaller than the suppression threshold. Try broadening your filters, or allow more time for network data to accumulate in your region.

---

**Q: How do I restart the Guided Tour?**

A: Navigate to **Help & FAQ** and click the **"Restart Guided Tour"** button at the top of the page.

---

**Q: Something is broken. How do I report a bug?**

A: Email **support@ppnportal.com** with:
1. A brief description of the issue
2. The page you were on
3. What you expected to happen
4. What actually happened
5. A screenshot (if possible)

---

## 14. Glossary

| Term | Definition |
|------|-----------|
| **Arc of Care** | PPN's framework for the complete treatment journey: Preparation → Dosing Session → Integration |
| **Benchmark-Ready Episode** | A treatment episode with: (1) a baseline outcome measure, (2) at least one follow-up timepoint, (3) a coded exposure record, (4) a coded setting, and (5) coded safety event capture |
| **CYP450** | Cytochrome P450 — a family of liver enzymes responsible for metabolizing most drugs. Relevant for predicting drug interactions |
| **De-identification** | The process of removing or obscuring personal identifiers from data, per HIPAA Safe Harbor standards |
| **GAD-7** | Generalized Anxiety Disorder 7-item questionnaire. A validated clinical measure of anxiety severity |
| **Give-to-Get** | PPN's data contribution model: clinics that contribute benchmark-ready episodes gain access to network benchmark comparisons |
| **HIPAA Safe Harbor** | A de-identification standard defined by HHS that specifies 18 identifiers to be removed from health data |
| **Integration** | The post-session therapeutic process in which patients and practitioners work to understand and apply insights from a psychedelic experience |
| **MEQ-30** | Mystical Experience Questionnaire, 30-item version. A validated measure of the quality of psychedelic experience |
| **PAT** | Psychedelic-Assisted Therapy. An umbrella term for therapeutic modalities that use psychedelic compounds |
| **PHI** | Protected Health Information. Any information that can be used to identify a patient |
| **PHQ-9** | Patient Health Questionnaire, 9-item version. A validated clinical measure of depression severity |
| **Protocol** | A structured, documented treatment episode captured in PPN |
| **RLS** | Row-Level Security. A database security model that ensures each user or clinic can only access their own data |
| **RWE** | Real-World Evidence. Clinical data collected outside of controlled trials, used to demonstrate treatment effectiveness to payers and regulators |
| **Set & Setting** | The mindset ("set") and physical/social environment ("setting") of a psychedelic session. Both are documented in PPN's preparation forms |
| **Subject ID** | A de-identified, hashed identifier that PPN uses instead of patient names or MRNs |
| **Serotonin Syndrome** | A potentially life-threatening drug reaction caused by excess serotonin activity. A key interaction risk when combining psychedelics with SSRIs/SNRIs |
| **SSRI** | Selective Serotonin Reuptake Inhibitor. A class of antidepressants commonly used by patients considering psychedelic therapy |
| **Zero-PHI** | PPN's architectural commitment to never storing Protected Health Information |

---

## 15. Contact & Support

### Getting Help

**In-App Help:**
- Navigate to **Help & FAQ** from the sidebar at any time
- Search the FAQ by keyword
- Filter topics by category: Getting Started, Clinical Toolsets, Regulatory, Troubleshooting

**Email Support:**  
support@ppnportal.com  
*(Response time: within 1 business day)*

**Founder/Partner Inquiries:**  
PPN Admin  
info@ppnportal.com

**Partner Office Hours:**  
Fridays at 2:00 PM PT  
*(Zoom link provided upon request)*

---

## Appendix A: Form Reference Guide

A complete reference of all Arc of Care forms, organized by phase. *(Source of truth: `FormsShowcase.tsx`)*

### Phase 1: Preparation (4 Forms)

| Form Name | Key Data Captured | Notes |
|-----------|------------------|-------|
| MEQ-30 Questionnaire | 30-item mystical experience scale, pre-session expectancy | Also available as standalone `/meq30` page |
| Set & Setting Assessment | Session location, therapeutic container, support persons | Structured selections only |
| Baseline Observations | Clinical observations, affect, orientation, alertness | Coded taxonomy — no free text |
| Informed Consent | Consent elements documented, consent date (year), witness role | Structured consent items only |

### Phase 2: Dosing Session (8 Forms)

| Form Name | Key Data Captured | Notes |
|-----------|------------------|-------|
| Dosing Protocol | Substance, route, dose (mg), dose unit, session number, setting type | Use the Potency Normalizer (Section 7.1) for dose equivalence calculations |
| Session Vitals | Time-stamped vital signs (HR, BP, SpO2, RR) | Repeat as needed throughout session; also captures baseline physiology |
| Session Timeline | Timestamped event log (onset, peak, resolution, notable moments) | Tap "Now" button for instant timestamp |
| Session Observations | Structured clinician observations at session intervals | Coded taxonomy |
| Safety & Adverse Events | Unified adverse event and safety event form (severity, type, intervention, resolution) | REQUIRED for any adverse event. Triggers auto-flag in Safety Risk Matrix. |
| Post-Session Assessments | Immediate post-session evaluation across multiple domains | Administered after effects resolve |
| Rescue Protocol | Rescue medication, dose, route, rationale, response | Complete within 1 hour of any rescue intervention |

> **Note:** `SafetyAndAdverseEventForm` is a unified replacement for the previously separate Adverse Event Report and Safety Event Observations forms. One form covers both.

### Phase 3: Integration (4 Forms)

| Form Name | Key Data Captured | Notes |
|-----------|------------------|-------|
| Daily Pulse Check | Brief daily wellness indicators | Designed for daily use post-session |
| Longitudinal Assessment | Follow-up outcomes at defined timepoints (1 week, 1 month, 3 months, 6 months) | PHQ-9 and GAD-7 repeated for comparison |
| Structured Integration Session | Session structure, themes, insights, homework | One per integration therapy session |
| Behavioral Change Tracker | Target behaviors, baseline, progress, goals | Tracks behavioral goals from session insights |

### Ongoing Safety (1 Form)

| Form Name | Key Data Captured | Notes |
|-----------|------------------|-------|
| Structured Safety Check | Safety status, risk indicators, follow-up plan | Complete at any point in the arc, as clinically indicated |

---

## Appendix B: Screenshot Collection Guide

> **Note to Admin:**  
> Below is the complete list of screenshots needed to finish this manual. Each item corresponds to a `[SCREENSHOT: ...]` placeholder in the document above. Capture at `localhost:3000` while running `npm run dev`. Recommended resolution: 1440px wide browser window. Use Chrome or Safari.  
> Recommended tool: macOS `Cmd+Shift+4` for region capture, or a screen recording tool for annotated captures.

### Priority 1 — Core Flow (Collect First)

1. **Login page** — full view
2. **Dashboard** — full view, annotated with callouts for each section
3. **Full sidebar** — all sections visible
4. **Top navigation bar** — annotated

### Priority 2 — Clinical Workflow

5. **Dashboard with "Start Tour" button highlighted**
6. **Wellness Journey main view** — all three phases visible
7. **Phase 1 panel expanded** — showing form options
8. **Phase 2 panel expanded** — showing 9 form options
9. **Phase 3 panel expanded**
10. **Quick Actions floating button expanded**
11. **Slide-Out Panel open** — showing a sample form (e.g., Session Vitals)
12. **Visual Timeline component** — with placeholder/sample data
13. **MEQ-30 standalone page** — full view

### Priority 3 — Interaction Checker

14. **Interaction Checker — empty state** (no substances selected)
15. **Interaction Checker — substances selected, pre-check**
16. **Interaction Checker — results view** (multiple severity levels showing)
17. **Interaction Checker — tooltip visible on severity score label**

### Priority 4 — Knowledge Base

18. **Substance Catalog — grid view** (all substances)
19. **Substance Catalog — search in use** (search bar with a query)
20. **Single substance page** — e.g., Psilocybin — annotated
21. **Substance Monograph page** — e.g., Psilocybin — full view
22. **Clicking through from Catalog tile to Monograph page**
23. **Intelligence Hub — main feed view**

### Priority 5 — Analytics, Export & Assessment

24. **Analytics page — overview**
25. **Each major visualization** — one screenshot per component
26. **Deep Dive navigation grid**
27. **Sample Deep Dive** — e.g., Patient Flow Sankey
28. **Assessment page** — question view
29. **Export Center — main view**
30. **Export Center — report generated, download ready**
31. **Clinical Report PDF — first page preview**

### Priority 6 — Security Suite & AI Tools (Phantom Shield)

32. **Dosage Calculator component** — active calculation
33. **Crisis Logger component** — active, during a session
34. **Blind Vetting Scanner** — terminal interface
35. **NeuralCopilot component** — active conversation

### Priority 7 — Ingestion Hub

36. **Registry Upload page** — full view with both modules
37. **Legacy Chart OCR module** — drag-and-drop zone
38. **Neural Dictation module** — recording active state

### Priority 8 — Settings & Misc

39. **My Protocols — list view**
40. **Protocol detail page**
41. **Clinician Directory — main view**
42. **Settings page — full view**
43. **Help & FAQ page**

---

*End of PPN Research Portal User Manual — Version 1.1 Draft*  
*Prepared by PRODDY | PPN DreamTeam | February 2026*

==== PRODDY ====
