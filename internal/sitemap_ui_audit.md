# Psychedelic Practitioner Network (PPN) — Comprehensive Sitemap & UI Audit

**Date:** March 2026
**Purpose:** Provide a complete architectural catalog of the PPN Portal's pages and components, including UI type, function, and actionable recommendations for mobile-first/AI-driven refactoring.

---

## 1. Complete Sitemap & Page Catalog

The application is vertically sliced into tiers based on authentication, audience, and functional depth.

### Tier 1: Public & Marketing (Unauthenticated)
These pages serve as the "Front Door" of the application, focusing on acquisition, education, and trust-building.

| Page / Route | UI Type | Format | Function & Action | Sources & Value | Recommendations / Rubric |
|---|---|---|---|---|---|
| `/landing` | Marketing Hub | Long-scroll, interactive | Primary conversion, architecture overview. | Public info, high aesthetic value. | **Mobile:** Needs aggressive lazy loading; hero animations might stutter on low-end devices. |
| `/login` / `/signup` | Auth Gate | Centered Form | User authentication and account creation. | Supabase Auth. | **Mobile:** Auto-focus inputs, support biometric (Passkey) if possible. |
| `/about`, `/waitlist`, `/pricing`, `/contribution` | Static Info | Staggered text & cards | Informational narratives. | Local copy. | **Refactor:** Standardize typography scaling across all 4 pages. |
| `/privacy`, `/terms`, `/data-policy` | Legal | Markdown/Prose | Trust & Compliance. | Local copy. | Add sticky Table of Contents for easy mobile scanning. |
| `/for-clinicians`, `/for-patients`, etc. (Audience Pages) | Targeted LP | Storytelling | Segmented value propositions. | Marketing copy. | Combine underlying components; they share ~80% UI structure. |
| `/patient-report`, `/integration-compass` | Deep Link Tool | Dynamic Visuals | Patient-facing tools accessed via Magic Link. | Session DB. | **Critical Mobile Focus:** Must be 100% responsive, as patients view these primarily on phones. |

### Tier 2: Post-Auth Entry Points
The immediate landing zones upon successful authentication.

| Page / Route | UI Type | Format | Function & Action | Sources & Value | Recommendations / Rubric |
|---|---|---|---|---|---|
| `/search` | Global Search | Command Palette / List | Quick navigation and query execution. | All DB resources. | **Refactor:** Make the search bar a fixed bottom-sheet on mobile. |
| `/dashboard` | Command Center | Bento Grid | High-level metrics, active patients, alerts. | Practitioner Stats. | **Mobile:** Stack the bento grid; prioritize "Active Alerts". |

### Tier 3: Core Authenticated Application (The Engine)
The bulk of the clinical and operational workflow.

| Page / Route | UI Type | Format | Function & Action | Sources & Value | Recommendations / Rubric |
|---|---|---|---|---|---|
| `/wellness-journey` | Interactive Map | Canvas / Node Graph | 3-Phase Arc of Care documentation. | `sessions`, `patients`. | **Mobile:** The node-graph is notoriously hard to use on touch. Needs a "List View" fallback. |
| `/protocols`, `/protocol/:id` | Builder | Split Pane | Constructing and viewing treatment plans. | `protocols`. | Complex drag-and-drop needs touch-friendly handles. |
| `/analytics` | Data Viz | Charts Grid | Practitioner vs. Global Benchmark outcomes. | Global DB (anon). | Consolidate charts; use sparklines for mobile to save space. |
| `/interactions` | Utility Tool | Form + Results | Checker for drug-drug interactions. | FDA/Local DB. | High value for safety. Needs voice-to-text input for quick lookups. |
| `/catalog`, `/monograph/:id` | Knowledge Base | Index + Detail | Reference material for substances. | Local copy/DB. | Add "Quick Actions" sticky bar (Bookmark, Print). |
| `/companion/:sessionId` | Patient Tool | Walkthrough | In-session or post-session patient interactive tool. | `sessions`. | **Mobile-First requirement.** |

### Tier 4: Marketing Deep Dives (Data Visualization Showcase)
High-fidelity, interactive "Proof of Concept" charts used to demonstrate the power of the PPN's structured data model.

| Page / Route | Function & Action | Value & Recommendation |
|---|---|---|
| `/deep-dives/patient-constellation` | 3D visual of patient similarity clusters. | High "Wow" factor. Too heavy for mobile; show a fallback static snapshot. |
| `/deep-dives/clinic-performance` | Comparing aggregate clinic outcomes. | B2B sales tool. |
| `/deep-dives/protocol-efficiency` | Heatmaps of protocol success rates. | Needs heavy canvas optimization. |
| `/deep-dives/workflow-chaos` | Visualizing unstructured vs structured data. | Great narrative tool. |

---

## 2. Component Library Catalog

The components are grouped by functional domain, reflecting the structured data philosophy of the app.

| Category / Directory | Description & Included Elements | Mobile / AI Refactoring Notes |
|---|---|---|
| `analytics/`, `benchmark/`, `charts/` | Data visualizations (Recharts, D3). Includes `IntegrationStoryChart`, `CompassEMAGraph`. | **Audit:** Charts must use `ResponsiveContainer`. Consider AI summarizing the chart data into a single text sentence for screen-readers and small screens. |
| `arc-of-care/`, `arc-of-care-forms/` | Core workflow UI. Includes `BaselineAssessmentWizard`, `SessionLogForm`, `ConsentForm`. | **Audit:** Multi-step wizards need aggressive state management optimization. Use `react-hook-form` consistently to prevent re-renders on every keystroke. |
| `compass/`, `narrative/` | Patient integration tools. | Highly interactive. Needs touch-friendly sliders and large tap targets (min 44x44px). |
| `export/` | PDF generators (`ClinicalReportPDF`). | Hidden from UI, structural only. Ensure print stylesheets `@media print` are flawless. |
| `forms/`, `ui/` | Primitives (Inputs, Buttons, `AdvancedTooltip`). | The bedrock. Ensure all buttons use `GravityButton` for consistent haptics/animations. |
| `layouts/` | `Sidebar`, `TopHeader`, `MobileBottomNav`. | **Mobile:** Current `MobileBottomNav` is good, but `Sidebar` logic needs tight coupling to swipe gestures. |
| `safety/`, `risk/` | Adverse events logging, risk calculation. | High liability. Inputs must be strictly validated. No free-text for conditions. |

---

## 3. Planned Pages & Architectures (From Work Orders)

Based on recent triage and active work orders, the following routes/pages are currently in flight or planned:

1. **Patient-Centric Analytics Interface (EPIC-606):**
   - **Type:** Dashboard subset / New Page under `/analytics/patient`.
   - **Function:** Reframing macro benchmark data into individual patient trajectories. Focusing on actionable insights ("What should I do next?") rather than pure data dumps.
2. **Patient Compass & Magic Link (EPIC-572, WO-601):**
   - **Type:** Unauthenticated / Token-gated public routes.
   - **Function:** Stabilizing the handoff between practitioner UI and the email-delivered Magic Link that allows patients to fill out assessments (like MEQ-30) securely.
3. **VIP Beta Provisioning & Invite (WO-586, WO-587):**
   - **Type:** Admin tool (`/admin/invite`).
   - **Function:** Managing invite quotas and tracking VIP link conversions.

---

## 4. Potential / Needed Pages & Functions

To close the loop on the application's vision, the following architectures are missing or require expansion:

1. **Dedicated Practitioner "Inbox" / Command Center:**
   - *Need:* Currently, `Dashboard` serves as a metric hub. Practitioners need a "To-Do" view (e.g., "3 Patients need Post-Session Integration Check-ins"). 
   - *Format:* Action-oriented list view.
2. **Progressive Web App (PWA) Manifest & Service Workers:**
   - *Need:* There is no native app wrapper yet. For the "Mobile-First" vision (especially for offline session logging in rural retreat centers), a PWA manifest and offline-first data sync (via Supabase local-first concepts) is critical.
3. **Structured "Data Export" Builder:**
   - *Need:* Currently there are static PDF exports. Researchers will need a way to build a custom CSV export of anonymized `Subject_ID`s with specific variables.

---

## 5. UI/UX Refinement & Mobile-First Recommendations (Prompt Guidance)

If utilizing an AI agent (like PRODDY or BUILDER) to execute a refactor, use the following prompt principles:

* **The "Touch Target" Rule:** "All interactive elements (buttons, tooltips, list items) MUST have a minimum tap area of 44x44 CSS pixels. Do not rely on margin for spacing; use padding to increase the clickable area."
* **The "No-Panic" Form Rule:** "For all clinical forms in `/arc-of-care-forms`, implement auto-save every 5 seconds or upon blur. Display a subtle 'Saved' indicator. Never force the user to tap a hard 'Save' button to prevent data loss."
* **The "Summary-First" Data Viz Rule:** "When refactoring charts in `/analytics`, render a `<Card>` that contains a natural language summary of the data *above* the chart. Mobile users often cannot read complex legends on a 300px wide screen. Tell them what the data means first."
* **The "Sheet over Modal" Rule:** "On mobile viewports (`max-width: 768px`), all Modals must convert into Bottom Sheets (`vaul` style) that animate up from the bottom of the screen. Standard centered modals are anti-patterns on mobile."

---
*Catalog generated automatically by Antigravity Agent based on codebase state.*
