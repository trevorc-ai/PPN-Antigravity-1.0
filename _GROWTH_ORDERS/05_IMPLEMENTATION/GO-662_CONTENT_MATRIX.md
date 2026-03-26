---
id: GO-662-CONTENT_MATRIX
title: "Help & Export Hub — UX Audit, IA Redesign & Improvement Backlog"
type: CONTENT_MATRIX
authored_by: PRODDY
status: 02_USER_REVIEW
created: 2026-03-23
linked_wo: WO-665
screens_audited:
  - HelpFAQ.tsx (303 lines) — /help
  - DownloadCenter.tsx (346 lines) — /download-center
  - SessionExportCenter.tsx (683 lines) — /session-export
  - DataExport.tsx (452 lines) — /data-export
---

==== PRODDY ====

# GO-660 CONTENT MATRIX
## Help & Export Hub — UX Audit, IA Redesign & Improvement Backlog

---

## PRODDY PRD

### 1. Problem Statement

The PPN Portal has four interconnected screens serving export and support needs (Help & FAQ, Download Center, Export Clinical Records, Data Export Manager) that have grown independently without a shared mental model, resulting in overlapping content, contradictory CTAs, broken help articles, and no onboarding path for first-time users. Practitioners arriving at any of these screens currently cannot determine which screen owns their task. The Download Center and Session Export Center present the same export packages (Audit & Compliance Report, Clinical Outcomes PDF) with no differentiation, forcing practitioners to guess.

### 2. Target User + Job-To-Be-Done

A licensed psychedelic therapy practitioner needs to quickly locate the correct export tool or help article for their immediate clinical task (legal record export, research dataset generation, compliance question, blank form download) so that they can complete their documentation workflow without navigating to the wrong screen or abandoning the task.

### 3. Success Metrics

1. Time-to-correct-screen drops from estimated 3+ clicks to ≤ 1 click for any export task (measured by INSPECTOR browser recording)
2. Zero export package cards appear on more than one screen without explicit contextual differentiation (measurable at code review)
3. Help & FAQ topic categories each link to at least one real article with one screenshot or video placeholder within 30 days of ship

### 4. Feature Scope

#### In Scope:
- IA restructure of all four screens with a unified mental model
- Removal of redundant export cards from Download Center (defer to SessionExportCenter)
- Addition of video placeholder slots in Help & FAQ
- Addition of screenshot placeholder zones in Help & FAQ articles
- DataExport integration with Download Center navigation
- Contextual inline help tooltips on SessionExportCenter
- Consistent CTA pattern across all four screens (OPEN TOOL vs DOWNLOAD disambiguation)
- Mobile-first audit pass (Rule 8 compliance)
- PPN UI Standards compliance audit (font sizes, phase colors, em dashes, touch targets)

#### Out of Scope:
- Actual content writing for help articles (future GO)
- Backend search indexing for Help & FAQ search bar
- Real video recording or production
- New export types or format additions
- Backend wiring of DataExport to Supabase (separate WO)

### 5. Priority Tier

**P1** — This audit directly blocks practitioner confidence during onboarding and first clinical export workflows. The Download Center duplicate card issue creates legal risk ambiguity (a practitioner could use the wrong export type for a compliance submission).

### 6. Open Questions for LEAD

1. Should Download Center and SessionExportCenter be merged into a single unified `/exports` page, or remain separate routes with a disambiguation modal on first visit?
2. Is the Help & FAQ search bar (currently client-side filter only) planned for Supabase full-text search in the next sprint?
3. Are there tutorial video assets already recorded, or should video zones be `<iframe>` YouTube/Loom placeholders?
4. Should DataExport remain at `/data-export` as a standalone route, or be embedded as a tab within Download Center?
5. Is the `admin_chen_1` hardcoded user reference in DataExport.tsx intentional test data, or a placeholder that must be replaced with the authenticated user's identity before production?

---

## Part 1: Current State Audit

### Screen 1: Help & FAQ (`/help` — HelpFAQ.tsx, 303 lines)

**What it does:** Entry point for practitioner support. Contains a Download Center promotional card, four topic category cards (Getting Started, Clinical Toolsets, Regulatory, Troubleshooting), and 7 FAQ accordion items in a 8/12 + 4/12 grid layout with a Contact Support sidebar.

#### Critical Issues Found

| Severity | Issue | Code Location |
|---|---|---|
| 🔴 HIGH | Left sidebar nav (in HelpCenterLayout) presents "Download Center / Quickstart Guide / Platform Overview / Clinical Tools..." — these menu items are redundant with the topic cards on the main canvas | `HelpCenterLayout.tsx` |
| 🔴 HIGH | Download Center appears TWICE: once as a link in the left nav sidebar AND once as the large hero card on the main canvas — no differentiation between the two appearances | Lines 119–147, HelpCenterLayout |
| 🔴 HIGH | Four topic categories are **empty stubs** — clicking "Clinical Toolsets" filters the 7 FAQs but there are zero articles behind the category concept. The topic card suggests content that doesn't exist. | Lines 18–23, 150–175 |
| 🟡 MEDIUM | No video tutorial slots anywhere on the page. No `<iframe>` placeholders. No "Watch Tutorial" CTAs. | Entire component |
| 🟡 MEDIUM | No screenshots in any FAQ answer. Answer text describes processes but shows nothing. | Lines 25–87 |
| 🟡 MEDIUM | FAQ items have no jump-link anchors. No way to link directly to a specific FAQ from external content. | Lines 195–236 |
| 🟡 MEDIUM | Contact Support sidebar appears at the BOTTOM of the grid on mobile — the most critical support action is visually buried | Line 240, `col-span-1 lg:col-span-4` |
| 🟠 LOW | "New" badge on Download Center hero card uses `text-[10px]` — violates Rule 2 (12px minimum) | Line 136 |
| 🟠 LOW | "BROWSE TOPICS" label uses `text-xs font-black text-slate-500` — Rule 2 violation | Line 151 |
| 🟠 LOW | Search bar is wired to client-side filter only, not a real search backend. Users will search and find nothing for valid terms not in the 7 FAQ questions. | Lines 89–98 |
| 🟠 LOW | "Schedule Tech Demo" is a primary indigo button in the Contact Support sidebar — wrong priority for a practitioner help center (they need clinical support, not a demo) | Line 254 |

#### PPN UI Standards Violations (HelpFAQ.tsx)
- `text-[10px]` on "NEW" badge (line 136) — Rule 2 violation
- `text-xs font-black text-slate-500` on "BROWSE TOPICS" label (line 151) — Rule 2 violation (text-xs = 12px, minimum is 14px per Rule 2 which states `text-sm` is the floor)
- `text-xs text-indigo-400` category pill inside FAQ answer (line 211) — Rule 2 violation

---

### Screen 2: Download Center (`/download-center` — DownloadCenter.tsx, 346 lines)

**What it does:** A categorized hub presenting export tools in three sections: Patient & Clinical Records (3 cards), Network & Research Data (2 cards), Compliance & Infrastructure (2 cards). Missing "Forms & Templates" section visible in screenshots but absent from component file — this section may be in a different version or was removed.

#### Critical Issues Found

| Severity | Issue | Code Location |
|---|---|---|
| 🔴 HIGH | "Patient & Clinical Records" section contains Full Treatment Series Bundle, Clinical Outcomes PDF, and Audit & Compliance Reports — ALL THREE of these cards use `actionType: 'route'` pointing to `/session-export` with no explanation of why they navigate away. This is the core duplication problem. | Lines 36–80 |
| 🔴 HIGH | ALL three "Patient & Clinical Records" cards open `/session-export` but look like download cards. A practitioner clicking "Audit & Compliance Reports" expects a download, not a navigation to another screen. | Lines 47, 59, 73 |
| 🟡 MEDIUM | Mixed CTA logic: some items use "OPEN TOOL" (route navigation), others use "DOWNLOAD" (direct file download) — the button renders different labels but the visual distinction is minimal (same gray ghost button style) | Lines 293–297 |
| 🟡 MEDIUM | No section ordering logic. "Compliance & Infrastructure" (least used) appears before "Forms & Templates" (high daily use). Section ordering is wrong for practitioner workflow. | Lines 115–148 |
| 🟡 MEDIUM | No progressive disclosure. All 7+ cards dump simultaneously with no filtering, search, or tabs to help practitioners find what they need | Lines 219–308 |
| 🟡 MEDIUM | "Network & Research Data" section's two cards (Custom Research Datasets, Machine-Readable JSON) both route to `/data-export` — leaving the practitioner on a completely different-looking screen with no context or back-link | Lines 82–113 |
| 🟠 LOW | `text-[10px]` format labels (ZIP, PDF, CSV, JSON) in card footers — Rule 2 violation | Line 267 |
| 🟠 LOW | `text-xs font-black uppercase tracking-widest` "Resource Hub" eyebrow label — Rule 2 violation | Line 208 |
| 🟠 LOW | `text-sm font-medium text-slate-500` category description — borderline; `text-sm` passes Rule 2 but `text-slate-500` on `bg-slate-900` may fail 4.5:1 contrast | Line 225 |
| 🟠 LOW | Hardcoded `bg-[#0a1628]` in wrapper div — uses inline color instead of design token | Line 198 |

#### Missing from DownloadCenter that was visible in user screenshots:
- "Forms & Templates" section with Informed Consent Template and Blank MEQ-30 Assessment (visible in screenshot as a 4th section below Compliance & Infrastructure) — this section is **completely absent from the source code**. It was either removed or exists in a different branch.

---

### Screen 3: Export Clinical Records (`/session-export` — SessionExportCenter.tsx, 683 lines)

**What it does:** The most feature-rich export screen. Shows a patient summary card (mock data), session scope selector (single session vs full series), 7 export package cards (Audit, Insurance, Research, Full Bundle, Clinical PDF, Patient Report, Data Policy), and a session-by-session dosing log table.

#### Critical Issues Found

| Severity | Issue | Code Location |
|---|---|---|
| 🔴 HIGH | Entire screen is **hardcoded to a mock patient** (`MOCK_PATIENT`, `MOCK_SESSIONS`). There is no patient selection mechanism. A practitioner navigating here cannot choose a different patient — the page always shows SUB-2024-0842. | Lines 15–50 |
| 🔴 HIGH | No entry-point decision tree. A practitioner arriving for the first time sees 7 export packages simultaneously. "Which one do I need for my insurance claim?" is unanswered. | Lines 490–584 |
| 🔴 HIGH | This screen duplicates 3 cards already in Download Center (Audit & Compliance Report, Clinical Outcomes PDF, Full Treatment Series Bundle) with different names and descriptions — creating split-brain: same content, different framing, different pages | Lines 71–163 |
| 🟡 MEDIUM | Patient summary stats bar (PHQ-9 Δ 62%, 3 dosing sessions, 80% integration, 91% pulse checks) has no explanation for first-time users. What does "PHQ-9 Δ" mean? Why is 62% good? | Lines 390–432 |
| 🟡 MEDIUM | Session scope chips (date buttons) provide no explanation of what changes when you select a single session vs full series. Tooltip text is missing. | Lines 434–488 |
| 🟡 MEDIUM | HIPAA COMPLIANT and 21 CFR PART 11 LOGGED badges in the page header are not linked to any explanation or the Help & FAQ page | Lines 358–367 |
| 🟡 MEDIUM | 7 export cards in a 2-column grid = 3.5 rows of cards with one orphaned at bottom. On mobile this is 7 stacked cards with no progressive disclosure. | Lines 492–584 |
| 🟡 MEDIUM | "Insurance & Billing Report" downloads as `.txt` format (line 115) — a `.txt` file for a billing report is almost certainly wrong and will confuse practitioners attempting to submit to insurers | Line 115–116 |
| 🟠 LOW | `text-xs font-black uppercase tracking-widest` used extensively throughout (session scope labels, table headers, stat labels) — Rule 2 violations | Multiple |
| 🟠 LOW | `violet-400` / `violet-500` colors used for Data Policy card — **not in the PPN phase palette**. Only indigo, amber, and teal are approved. | Lines 220–222 |
| 🟠 LOW | Export includes list uses `text-xs text-slate-400` — Rule 2 violation | Line 534 |

---

### Screen 4: Data Export Manager (`/data-export` — DataExport.tsx, 452 lines)

**What it does:** A form-based research dataset configurator. Left panel is a filter form (date range, substance protocol, clinical indications chip selector, output format picker, Generate Export button). Right panel is a Recent Exports history table showing 4 mock records with pagination controls.

#### Critical Issues Found

| Severity | Issue | Code Location |
|---|---|---|
| 🔴 HIGH | Hardcoded `admin_chen_1` as the logged user in the PII warning: `"Action logged as: admin_chen_1"` — this is test data that should be the authenticated user's identity | Line 312 |
| 🔴 HIGH | No navigation connection to any other screen. Zero links to Download Center, Help, or Export Clinical Records. Practitioners arriving here via direct link are completely isolated. | Entire component |
| 🟡 MEDIUM | "STRICTLY CONFIDENTIAL" amber warning banner appears at the very top of the content area — before the user has even touched the form. Creates friction and anxiety before any action. | Lines 166–178 |
| 🟡 MEDIUM | Output format selector (CSV/JSON/PDF) shows a `FileText` icon for all three formats with no explanation of which format to use for which downstream tool. CSV vs JSON vs PDF for research data is a non-obvious choice. | Lines 249–269 |
| 🟡 MEDIUM | Clinical Indication chip group (MDD/PTSD/TRD/Anorexia/AUD/OCD) has no "Select All" or "Clear" action. To select all 6, a user must click each chip individually. | Lines 228–246 |
| 🟡 MEDIUM | Recent Exports table uses `material-symbols-outlined` Google font icon class for search (`text-lg`) — if this font fails to load, the icon is invisible. Should be replaced with Lucide `Search` | Line 333 |
| 🟡 MEDIUM | Recent Exports table file names are full strings but the "ID" row below is `font-mono text-slate-500` — the ID is more important for lookup than the filename but is visually de-emphasized | Lines 356–358 |
| 🟡 MEDIUM | `style={{ color: '#8BA5D3' }}` and `style={{ color: '#8B9DC3' }}` inline styles on h1 and subtitle — uses hardcoded hex instead of design token `text-[#A8B5D1]` | Lines 152–155 |
| 🟡 MEDIUM | "Showing 1-4 of 28 exports" with Previous/Next pagination but table only shows 4 records and pagination is non-functional | Lines 412–424 |
| 🟠 LOW | `text-xs font-black text-slate-500 uppercase` on every form field label — Rule 2 violation throughout | Lines 193, 212, 230, 251 |
| 🟠 LOW | `text-xs text-slate-500 font-mono` on Export IDs in table — Rule 2 violation | Line 357 |
| 🟠 LOW | `text-xs text-slate-600` on footer copyright — barely readable, likely fails 4.5:1 contrast | Lines 432–444 |

---

## Part 2: Information Architecture Analysis

### Current IA Map (The Problem)

```
User Task: "I need to export a compliance report for my malpractice defense"
  → Goes to Download Center
    → Sees "Audit & Compliance Reports" card → clicks "OPEN TOOL"
    → Gets navigated to /session-export (no warning this would happen)
    → Now on Export Clinical Records with SUB-2024-0842 displayed
    → Sees another "Audit & Compliance Report" card (different description)
    → Also sees 6 other export packages
    → Confused: which one is right? Are these the same thing?
    → No help link. No tooltip. No "back" semantic navigation.
```

### Proposed Mental Model (Two Pillars)

The four screens should be reorganized into **two conceptual pillars**:

| Pillar | User Question Answered | Screens Owned |
|---|---|---|
| **📚 Learn & Get Help** | "How do I use this platform? What does X mean? How do I get support?" | Help & FAQ (primary) |
| **📦 Export & Download** | "I need to generate/download a document or dataset." | Unified Export Hub (restructured Download Center + SessionExportCenter + DataExport as tabs/modes) |

### Proposed IA Redesign

#### Pillar 1: Help & FAQ (renamed "Help & Learning Center")

```
/help
├── [HERO] Featured Resource of the Week (video or article)
├── [SEARCH] Intelligent search (client-side now, Supabase FTS later)
├── [QUICK LINKS] Most-used actions (5 chips max)
│   ├── Exporting Records →
│   ├── Managing Patients →
│   ├── Interaction Checker →
│   ├── Regulatory & Compliance →
│   └── Contact Support
├── [VIDEO GALLERY] Tutorial Videos (grid of 4 slots — embed-ready)
│   ├── Getting Started (Slot 1 — placeholder)
│   ├── First Clinical Protocol (Slot 2 — placeholder)
│   ├── Session Documentation (Slot 3 — placeholder)
│   └── Exporting Records (Slot 4 — placeholder)
├── [TOPIC BROWSE] 4 categories (existing, but with real article counts)
└── [FAQ] Accordion (existing 7 items, to be expanded by category)
└── [SIDEBAR] Contact Support (moved to TOP of sidebar, not bottom)
```

#### Pillar 2: Unified Export Hub (restructured)

```
/download-center (renamed "Export & Download Hub")
├── [PAGE HEADER] Clear title + "What do I need?" decision helper
├── [TABS or SECTIONS] — User picks their task first:
│   ├── Tab 1: My Patient Records (→ SessionExportCenter UX, with patient picker)
│   │   ├── Select patient (picker, not hardcoded mock)
│   │   ├── Select scope (session or full series)
│   │   └── Choose export type (Audit, Insurance, Research, etc.)
│   ├── Tab 2: Research & Network Data (→ DataExport UX, redesigned)
│   │   ├── Build query (date, substance, indication)
│   │   └── Output format with explanation
│   ├── Tab 3: Documents & Templates
│   │   ├── Informed Consent Template
│   │   ├── Blank MEQ-30 Assessment
│   │   └── Data Policy PDF
│   └── Tab 4: Compliance & Audit Logs
│       ├── System Audit Logs (CSV)
│       └── HIPAA / 21 CFR Part 11 documentation
└── [FOOTER] Recent Exports (consolidated view of all export history)
```

**Result:** Zero content duplication. Each export type lives in exactly one tab. A practitioner knows exactly where to go based on the tab question: "My Patient Records / Research Data / Documents / Compliance."

---

## Part 3: Per-Screen Redesign Specifications

### 3.1 Help & FAQ Redesign Spec (WO-665a)

**Primary changes:**
1. **Remove left sidebar nav** (HelpCenterLayout) — replace with inline breadcrumb + top search bar spanning full width
2. **Add video gallery section** above FAQ — 4 placeholder cards with play button overlay, title, and duration. Connect to real videos when available.
3. **Add in-article screenshot zones** to each FAQ — `<div>` with dashed border, `[Screenshot Placeholder]` label, and dimensions comment for future media team
4. **Move Contact Support card** to the TOP of the right sidebar (before Vocabulary Request), not below it
5. **Remove "NEW" badge** from Download Center hero card (or change to `text-sm`)
6. **Fix text-xs violations**: "BROWSE TOPICS" → `text-sm`, category pill inside FAQ → `text-sm`, "Open" text in CTA → minimum `text-sm`
7. **Add jump-link anchors** to each FAQ for deep-linking
8. **Replace "Schedule Tech Demo"** with "Submit Support Ticket" as the primary action in Contact Support sidebar

### 3.2 Download Center Redesign Spec (WO-665b)

**Primary changes:**
1. **Rename to "Export & Download Hub"** — clearer, task-oriented
2. **Replace 3-section card grid** with 4-tab interface: My Patient Records / Research Data / Documents & Templates / Compliance & Audit
3. **Remove "Patient & Clinical Records" card section** — this content lives in Tab 1 (SessionExportCenter UX) — not on the Download Center canvas
4. **Fix "Forms & Templates" gap** — re-add the Informed Consent + MEQ-30 cards (they're in the screenshot but not the source code)
5. **Unify CTA pattern** — every card that triggers navigation gets an "OPEN" icon (ArrowRight), every direct download gets a "DOWNLOAD" icon (Download). No mixing.
6. **Fix text-[10px] format badges** → `text-xs` minimum (Rule 2 says 12px print min but screen min is `text-sm`; format badge can use `text-xs` only if it's a badge/label not body text — confirm with standards)
7. **Add "Recently Downloaded" section** at page bottom showing last 3 exports

### 3.3 Export Clinical Records Redesign Spec (WO-665c)

**Primary changes:**
1. **Patient picker at entry** — Replace hardcoded `MOCK_PATIENT` with the ActivePatient context + a "Change Patient" button in the summary card header
2. **Decision tree / guided entry** — Add a 2-question guided flow at the top: "What do you need this export for? → Legal/Compliance / Insurance/Billing / Research / Patient Copy" → each answer highlights the recommended export package
3. **Remove 3 duplicate cards** (Audit & Compliance, Clinical Outcomes PDF, Full Treatment Series Bundle) that also appear in Download Center — replace with clear cross-links: "Looking for other document types? → Download Center"
4. **Add inline contextual tooltips** on: session scope selector (what changes), patient stats metrics (what each number means), format badges (who uses each format)
5. **Fix violet color** on Data Policy card → use `indigo` (approved palette)
6. **Fix Insurance report format** → currently downloads as `.txt`, should be `.pdf` or `.csv`
7. **Fix all `text-xs` violations** in includes lists, stat labels, and badge overlays
8. **Add "Help" link** in compliance badge area → links to `/help#hipaa-compliance`

### 3.4 Data Export Manager Redesign Spec (WO-665d)

**Primary changes:**
1. **Fix `admin_chen_1` hardcoded user** → replace with `{currentUser.email}` or `{currentUser.user_metadata.full_name}` from Supabase auth context
2. **Add breadcrumb navigation** → "Export Hub > Research Data" to anchor the user in context
3. **Move STRICTLY CONFIDENTIAL banner** below the form (or collapse into a footer note) — don't gate the form with anxiety
4. **Add format explanations** — change the format picker to include one-line descriptions: CSV: "Best for Excel/SPSS", JSON: "Best for API/R ingestion", PDF: "Formatted report for sharing"
5. **Add "Select All" and "Clear All" actions** for Clinical Indication chips
6. **Fix `material-symbols-outlined` search icon** → replace with Lucide `<Search />`
7. **Fix inline `style={{color: '#...'}}` hardcodings** → use Tailwind design tokens
8. **Wire pagination** or display actual record count correctly (shows "28 exports" but only 4 are real)
9. **Add cross-navigation links**: "Exporting a patient record instead? → Patient Records" / "Need compliance documents? → Download Hub"

---

## Part 4: PPN UI Standards Compliance Summary

| Screen | Rule 2 (Font) | Rule 4 (Em Dash) | Rule 6 (Color) | Rule 8 (Mobile) | Status |
|---|---|---|---|---|---|
| HelpFAQ.tsx | ❌ 3 violations | ✅ Pass | ✅ Pass (indigo only) | ✅ Pass (grid-cols-1 sm:grid-cols-2) | FAIL |
| DownloadCenter.tsx | ❌ 2 violations | ✅ Pass | ✅ Pass (multi-color but semantic) | ✅ Pass (grid responsive) | FAIL |
| SessionExportCenter.tsx | ❌ 5+ violations | ✅ Pass | ❌ violet-400 not in palette | ✅ Pass (responsive grid) | FAIL |
| DataExport.tsx | ❌ 4+ violations | ✅ Pass | ⚠️ Low contrast footer text | ✅ Pass (lg:col-span-5/7) | FAIL |

**All four screens fail PPN UI Standards** primarily on Rule 2 (text-xs widespread usage). No em dash violations found. Phase palette violations are limited to SessionExportCenter's violet usage.

---

## Part 5: Prioritized Improvement Backlog (Feeds WO-665)

### P0 — Fix Before Any Clinical Demo

| # | Issue | Screen | Effort |
|---|---|---|---|
| P0-1 | Remove hardcoded `admin_chen_1` from DataExport | DataExport.tsx | XS |
| P0-2 | Fix hardcoded mock patient — wire to ActivePatient context | SessionExportCenter.tsx | M |
| P0-3 | Add patient selector to SessionExportCenter | SessionExportCenter.tsx | M |

### P1 — Ship This Sprint (Core UX Repair)

| # | Issue | Screen | Effort |
|---|---|---|---|
| P1-1 | Remove duplicate "Patient & Clinical Records" cards from Download Center — they belong only in SessionExportCenter | DownloadCenter.tsx | S |
| P1-2 | Add decision tree / guided entry ("What do you need this for?") to SessionExportCenter | SessionExportCenter.tsx | M |
| P1-3 | Re-add missing "Forms & Templates" section (Informed Consent, MEQ-30) to Download Center | DownloadCenter.tsx | S |
| P1-4 | Unify CTA patterns: OPEN (ArrowRight icon) for route-navigation, DOWNLOAD (Download icon) for direct files | DownloadCenter.tsx + SessionExportCenter.tsx | S |
| P1-5 | Add breadcrumb/back-nav to DataExport connecting it to Download Center | DataExport.tsx | XS |
| P1-6 | Fix violet color in Data Policy card → indigo | SessionExportCenter.tsx | XS |
| P1-7 | Fix Insurance report format from .txt → .pdf | SessionExportCenter.tsx | XS |
| P1-8 | Move Contact Support to top of Help sidebar | HelpFAQ.tsx | XS |

### P2 — Next Sprint (Content & Polish)

| # | Issue | Screen | Effort |
|---|---|---|---|
| P2-1 | Add 4 video tutorial placeholder cards to Help & FAQ | HelpFAQ.tsx | S |
| P2-2 | Add screenshot placeholder zones to FAQ answers | HelpFAQ.tsx | S |
| P2-3 | Add jump-link anchors to FAQ items | HelpFAQ.tsx | XS |
| P2-4 | Fix all text-xs violations across all 4 screens | All | M |
| P2-5 | Add "Select All / Clear All" to DataExport indication chips | DataExport.tsx | XS |
| P2-6 | Add format explanations to DataExport format picker | DataExport.tsx | S |
| P2-7 | Add contextual tooltips to session scope selector | SessionExportCenter.tsx | S |
| P2-8 | Fix material-symbols search icon → Lucide Search in DataExport | DataExport.tsx | XS |
| P2-9 | Add inline help links from SessionExportCenter compliance badges → /help | SessionExportCenter.tsx | XS |
| P2-10 | Replace "Schedule Tech Demo" button in Help sidebar with "Submit Support Ticket" | HelpFAQ.tsx | XS |

### P3 — Architecture (Requires LEAD Decision)

| # | Issue | Screen | Effort |
|---|---|---|---|
| P3-1 | Unify Download Center + DataExport into tabbed Export Hub (LEAD decision required) | DownloadCenter.tsx + DataExport.tsx | L |
| P3-2 | Rename DownloadCenter to "Export & Download Hub" | DownloadCenter.tsx + routing | S |
| P3-3 | Remove HelpCenterLayout's left sidebar nav | HelpCenterLayout.tsx | M |
| P3-4 | Add consolidated "Recent Exports" section at bottom of Export Hub | New component | M |

---

## Part 6: Reference SaaS Patterns (2026 Best Practices Applied)

| Pattern | Source | Recommended Application |
|---|---|---|
| **Intercom Help Center** — Single search bar dominates above the fold; categories below | Intercom | Help & FAQ hero redesign: make search 100% width, categories secondary |
| **Notion Docs** — "What do you want to do?" entry question drives progressive disclosure | Notion | SessionExportCenter decision tree: 4-question entry path recommended |
| **Stripe Dashboard** — Download/Export uses a unified Downloads page with type filters as tabs | Stripe | Tabbed Export Hub architecture (P3-1) |
| **Epic Systems** — Export forms include one-sentence format guidance inline | Epic EHR | DataExport format picker explanations |
| **Zendesk Help Center** — Related articles surfaced inside support article answers | Zendesk | Cross-linking between Help & FAQ and Export screens |

---

## Handoff Notes

**WO-665 sub-tasks are ready to be created** once this CONTENT_MATRIX is approved:
- WO-665a: HelpFAQ.tsx — P2-1, P2-2, P2-3, P2-4 (Help subset), P1-8, P2-10
- WO-665b: DownloadCenter.tsx — P1-1, P1-3, P1-4 (DC side), P2-4 (DC subset)
- WO-665c: SessionExportCenter.tsx — P0-2, P0-3, P1-2, P1-4 (SEC side), P1-6, P1-7, P2-4 (SEC), P2-7, P2-9
- WO-665d: DataExport.tsx — P0-1, P1-5, P2-4 (DE), P2-5, P2-6, P2-8
- WO-665e: HelpCenterLayout + HelpPages — P3-3 (requires LEAD decision)

**LEAD must first answer the 5 Open Questions above** before WO-665 sub-tasks can be routed to BUILDER.

==== PRODDY ====
