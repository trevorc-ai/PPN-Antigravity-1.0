---
id: GO-660-DESIGNER-BRIEF
title: "Help & Export Hub — DESIGNER Wireframe Brief"
type: DESIGNER_BRIEF
authored_by: LEAD
status: 04_VISUAL_REVIEW
created: 2026-03-23
linked_go: GO-660
linked_content_matrix: GO-660_CONTENT_MATRIX.md
screens_to_mock: 4
---

# GO-660 DESIGNER BRIEF
## Help & Export Hub — Wireframe & Visual Specification

> **Input:** GO-660_CONTENT_MATRIX.md (approved direction)
> **Output:** Stitch mockups for 4 screens and 1 new pattern (decision tree entry)
> **Design tool:** Google Stitch
> **Fidelity:** High-fidelity, matches PPN Portal dark design system

---

## Design System Reference

All wireframes must use the PPN Portal design language:
- **Background:** `#020408` / `bg-slate-950`
- **Panels:** `bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem]`
- **Primary accent:** Indigo `#7c6ff7`
- **Phase palette:** Indigo (Phase 1), Amber (Phase 2), Teal (Phase 3) — no violet, no purple
- **Font:** Inter (headings bold/black), Roboto Mono for IDs and codes only
- **Minimum font size:** 14px (`text-sm`) for all visible text
- **CTA pattern:** "OPEN" with ArrowRight icon for navigation; "DOWNLOAD" with Download icon for files

---

## Mockup 1: Help & Learning Center (`/help`) — Redesigned

**Current state problem:** Redundant left nav duplicates the main content canvas. No video slots. Empty topic stubs. Contact Support buried below the fold.

**Target state to design:**

```
┌─────────────────────────────────────────────────────────┐
│  HEADER: "Help & Learning Center"  [SEARCH — full width] │
├─────────────────────────────────────────────────────────┤
│  QUICK LINKS (5 chip row): Export Records | Patients |   │
│  Interaction Checker | Regulatory | Contact Support      │
├─────────────────────────────────────────────────────────┤
│  TUTORIAL VIDEOS (2×2 grid, 4 placeholder cards):        │
│  [▶ Getting Started]  [▶ First Clinical Protocol]        │
│  [▶ Session Documentation]  [▶ Exporting Records]        │
│  Each card: dark panel, play button overlay, title,      │
│  duration badge, "Watch" CTA                             │
├──────────────────────────────────────┬──────────────────┤
│  TOPIC BROWSE (2×2 grid):            │ SIDEBAR (top):   │
│  Getting Started | Clinical Toolsets │ Contact Support  │
│  Regulatory | Troubleshooting        │ (Live Chat,      │
│  [each with article count badge]     │  Email, Ticket)  │
├──────────────────────────────────────│                  │
│  FAQ AREA:                           │ Vocabulary       │
│  [selected category filter chips]    │ Request          │
│  [accordion items with jump anchors] │                  │
│  [screenshot placeholder zone in    │ System Status    │
│   each answer]                       │                  │
└──────────────────────────────────────┴──────────────────┘
```

**Key design decisions to explore:**
- Search bar: full-width hero at top with placeholder text "Search guides, regulations, and FAQs..."
- Video cards: 16:9 ratio, gradient thumbnail placeholder, indigo play button
- Topic cards: article count badge ("4 articles") so users know content exists
- Contact Support: elevated to top of sidebar with indigo primary "Submit Ticket" button

---

## Mockup 2: Export & Download Hub (`/download-center`) — Restructured

**Current state problem:** 3-section card grid with duplicate export cards that navigate away. No tab structure. "Forms & Templates" section missing.

**Target state to design:**

```
┌─────────────────────────────────────────────────────────┐
│  HEADER: "Export & Download Hub"                         │
│  Subtitle: "What do you need today?"                    │
├─────────────────────────────────────────────────────────┤
│  TABS:                                                   │
│  [My Patient Records] [Research Data] [Documents]        │
│  [Compliance & Audit]                                   │
├─────────────────────────────────────────────────────────┤
│  TAB 1 ACTIVE — My Patient Records:                      │
│  "Go to the Export Clinical Record tool to generate      │
│   patient-specific reports."                             │
│  [OPEN EXPORT TOOL →] (large indigo primary CTA)        │
│  Or: preview the 4 available report types as cards       │
│  (Audit PDF | Insurance PDF | Research CSV | Bundle ZIP) │
│  Each card links to /session-export with that type pre-  │
│  selected                                                │
├─────────────────────────────────────────────────────────┤
│  TAB 2 — Research Data: [DataExport manager embedded]   │
│  TAB 3 — Documents: [Informed Consent + MEQ-30 cards]   │
│  TAB 4 — Compliance: [Audit Logs + Data Policy cards]   │
├─────────────────────────────────────────────────────────┤
│  FOOTER: Recent Downloads (last 3 exports, compact row) │
└─────────────────────────────────────────────────────────┘
```

**Key design decisions to explore:**
- Tabs: pill style, indigo active state, matching existing PPN tab patterns
- Tab 1: consider whether it shows a large CTA only or shows the 4 export type preview cards too
- "OPEN" vs "DOWNLOAD" visual distinction: OPEN uses ArrowRight icon in a ghost button; DOWNLOAD uses Download icon in an indigo-tinted button

---

## Mockup 3: Export Clinical Records (`/session-export`) — Decision Tree Entry

**Current state problem:** 7 export packages shown simultaneously with no guidance. No patient picker.

**Target state to design:**

```
┌─────────────────────────────────────────────────────────┐
│  HEADER: "Export Clinical Record"  [HIPAA] [21 CFR]     │
├─────────────────────────────────────────────────────────┤
│  PATIENT SELECTOR (new):                                 │
│  [Patient avatar] SUB-2024-0842  [Change Patient ↓]     │
│  Treatment Period: Jul 14 2025 – Jan 18 2026            │
├─────────────────────────────────────────────────────────┤
│  DECISION HELPER (new — collapsible after first use):    │
│  "What do you need this export for?"                     │
│  [Legal / Compliance] → highlights Audit & Compliance    │
│  [Insurance / Billing] → highlights Insurance Report    │
│  [Research Contribution] → highlights Research Export   │
│  [Patient Copy] → highlights Patient Wellness Report    │
├─────────────────────────────────────────────────────────┤
│  PATIENT STATS ROW (existing, with tooltip triggers):   │
│  PHQ-9 Δ 62% [?]  |  3 Sessions [?]  |  80% [?]  91% [?]│
├─────────────────────────────────────────────────────────┤
│  SESSION SCOPE SELECTOR (existing, with help tooltip)   │
├─────────────────────────────────────────────────────────┤
│  EXPORT PACKAGE CARDS (2×col grid, recommended card     │
│  highlighted by decision helper selection):             │
│  [Audit & Compliance] [Insurance & Billing]             │
│  [Research Export]    [Full Bundle]                     │
│  [Clinical PDF]       [Patient Report]                  │
│  [Data Policy PDF]                                      │
├─────────────────────────────────────────────────────────┤
│  SESSION LOG (existing)                                  │
└─────────────────────────────────────────────────────────┘
```

**Key design decisions to explore:**
- Decision helper: persistent banner or collapsible "Help me choose" accordion?
- Highlighted state when a recommendation is active: glow border, dimmed non-recommended cards
- Patient picker: dropdown vs. modal — recommend dropdown for speed

---

## Mockup 4: Data Export Manager (`/data-export`) — Integrated & Contextualized

**Current state problem:** Isolated screen, no navigation context, STRICTLY CONFIDENTIAL warning gates the form.

**Target state to design:**

```
┌─────────────────────────────────────────────────────────┐
│  BREADCRUMB: Export Hub > Research Data                  │
│  HEADER: "Research Dataset Export"                       │
│  Subtitle: "Generate de-identified cohort datasets"      │
│  [SECURE CONNECTION badge]  [HIPAA badge]               │
├─────────────────────────────────────────────────────────┤
│  [LEFT PANEL — New Export]   [RIGHT PANEL — History]    │
│                                                          │
│  Date Range:                  Recent Exports table       │
│  [Start] [End]                with copyable IDs         │
│                                                          │
│  Substance Protocol:          [Search by ID]            │
│  [Dropdown]                                             │
│                                                          │
│  Clinical Indication:         File | Filters | Date     │
│  [MDD][PTSD][TRD][AUD][OCD]   | Count | Actions        │
│  [Anorexia] [Select All][X]  ─────────────────         │
│                               EXP-2023... | ✓ | ↓       │
│  Output Format:                                          │
│  [CSV — Excel/SPSS]                                     │
│  [JSON — API/R ingestion]                               │
│  [PDF — Formatted report]                               │
│                                                          │
│  [GENERATE EXPORT ↓]                                    │
│                                                          │
│  ⓘ All exports logged as {user}. Re-identification      │
│    is strictly prohibited.                              │
└─────────────────────────────────────────────────────────┘
```

**Key design decisions to explore:**
- Format picker: radio card vs. segmented control vs. dropdown
- "Select All / Clear" for indication chips: inline text links or icon buttons
- Move the confidentiality notice to BELOW the generate button (not at page top)
- Breadcrumb: use existing `<Breadcrumbs />` component

---

## Stitch Generation Prompts

Use the following prompts for Stitch:

### Prompt 1 — Help & Learning Center
```
Design a dark-mode clinical SaaS help center page called "Help & Learning Center" for PPN Portal, a psychedelic therapy documentation platform. Background is deep slate (#020408). Use Inter font throughout (minimum 14px). Top section: full-width intelligent search bar with placeholder "Search guides, regulations, and FAQs..." Below: a horizontal row of 5 quick-link chips in indigo. Below that: a 2x2 grid of video tutorial placeholder cards (16:9 ratio, dark panel with a centered indigo play button icon, title text, duration badge). Left main column: 2x2 grid of topic category cards (Getting Started, Clinical Toolsets, Regulatory, Troubleshooting — each with an article count badge). Below topic grid: FAQ accordion list. Right sidebar (top): Contact Support card with three buttons (Live Chat, Email Support, Submit Ticket — Submit Ticket is the primary indigo CTA). Glassmorphism panels with border border-white/10. Premium, clinical, trustworthy aesthetic.
```

### Prompt 2 — Export & Download Hub Tabs
```
Design a dark-mode export hub page called "Export & Download Hub" for PPN Portal (psychedelic therapy SaaS). Deep slate background (#020408), Inter font, 14px minimum. Page header with title and subtitle "What do you need today?" Below: a horizontal 4-tab pill navigation bar — "My Patient Records" (active, indigo highlight), "Research Data", "Documents & Templates", "Compliance & Audit". Active tab content shows 4 export type preview cards in a 2x2 grid: Audit & Compliance Report (blue accent), Insurance & Billing Report (emerald accent), Research Export (indigo accent), Full Bundle ZIP (amber accent). Each card has an icon, title, one-line description, format badge (PDF/CSV/ZIP), and a ghost "Open Export Tool" button with ArrowRight icon. Footer: compact "Recent Downloads" row showing last 3 exports. Glassmorphism cards, premium clinical aesthetic.
```

### Prompt 3 — Session Export with Decision Helper
```
Design a dark-mode "Export Clinical Record" page for PPN Portal. Deep slate background, Inter font. Top: page header "Export Clinical Record" with HIPAA Compliant and 21 CFR Part 11 badges top-right. Below: a patient summary card showing a patient selector ("SUB-2024-0842" with a "Change Patient" button), and a stats row (PHQ-9 improvement %, session count, integration compliance %, pulse check %). Below the patient card: a collapsible "Help me choose" decision helper panel with 4 selectable options (Legal/Compliance, Insurance/Billing, Research, Patient Copy) rendered as choice chips — selecting one subtly highlights the recommended export package. Below: a 2-column grid of 7 export package cards, each with a colored icon, title, subtitle badge, description, included items checklist, format badge, and Download button. One card shows a highlighted/glow state (recommended). Clinical dark aesthetic with glassmorphism panels.
```

### Prompt 4 — Data Export Manager Integrated
```
Design a dark-mode "Research Dataset Export" page for PPN Portal (formerly "Data Export Manager"). Background #020408. Top: breadcrumb "Export Hub > Research Data", page header, SECURE CONNECTION and HIPAA badges. Two-column layout below: left panel (Export Configuration) with date range inputs, substance dropdown, clinical indication chip group (MDD/PTSD/TRD/Anorexia/AUD/OCD with Select All and Clear links), output format radio cards (CSV with label "Excel/SPSS", JSON with label "API/R", PDF with label "Formatted report"), and a Generate Export primary button. Right panel (Recent Exports): search input, data table with file name, filters column (tag chips), generated date, record count, and action buttons (eye/download for complete, retry for failed). At the bottom of the left panel: a small confidentiality notice referencing the logged user. Premium clinical glassmorphism aesthetic.
```

---

## DESIGNER Sign-Off Checklist

**Stitch Project:** `projects/12562051778255898902` — [Open in Stitch](https://stitch.google.com/projects/12562051778255898902)

| # | Screen | Desktop Screen ID | Mobile Screen ID | Status |
|---|---|---|---|---|
| 1 | Help & Learning Center (`/help`) | `62392771103c43a19610f481f8ca71c1` | `751d903cc0e245129f8f33763221b54f` | ✅ Both generated |
| 2 | Export & Download Hub (`/download-center`) | `b442b76a31fd42f28feaeacd114c30b1` | `b449e3471a0b4dc0aec7d9aaeb2ef09c` | ✅ Both generated |
| 3 | Export Clinical Record (`/session-export`) | `9df290ea8f33498b864a26c6484b4be4` | `8cad03de20544c0eb102b1d766fbb630` | ✅ Both generated |
| 4 | Research Dataset Export (`/data-export`) | `598f9dc5896946a0b25686625398851e` | `2adbf67447b040bbad5bc33d05ef0093` | ✅ Both generated |

**Design system applied:** Aetheris Clinical — Dark mode, Inter font, indigo `#4F46E5`, glassmorphism panels, `bg-slate-950` base, `border-white/10` glass edges.

- [x] All 4 mockups generated in Stitch (desktop + mobile)
- [x] Font minimum 14px (`text-sm`) specified in all prompts
- [x] No violet or purple colors — indigo, amber, teal, emerald only
- [x] Mobile-first layout verified — 4 mobile variants generated at 375px (Rule 8d: PASS)
- [x] OPEN vs DOWNLOAD CTA visual distinction clear (ArrowRight vs Download icon)
- [x] Decision helper (Mockup 3) shows selected/glow state
- [x] All screen IDs captured above

**DESIGNER Signed:** LEAD acting as DESIGNER | 2026-03-23

> ✅ **Status:** In `04_VISUAL_REVIEW`. Review all 8 screens (4 desktop + 4 mobile) in Stitch, then reply `approved` to advance to `05_IMPLEMENTATION`.
