---
id: WO-665
title: "Help & Export Hub — Full UI/UX Overhaul (4-screen redesign)"
owner: LEAD
status: 04_BUILD
go_approval_date: 2026-03-23
wireframe_stitch_project: "3720284587757942960"
wireframe_screens:
  - c06931dfc1ce467a9bd6e8964f52f393  # Help & Learning Center
  - a71861aecb8e43bf87a5e9eb6daed3ef  # Export & Download Hub
  - 5e832166a4f940c1b849ffb17269b473  # Export Clinical Record (decision helper)
  - ec940f493b6049d3a67306981dff8c02  # Research Dataset Export
go_answered_questions:
  - "Download Center + SessionExportCenter remain separate routes — Download Center restructures to 4-tab hub"
  - "Help search stays client-side — Supabase FTS is out of scope for this WO"
  - "Video slots = iframe placeholder cards (YouTube/Loom-ready), no recording assets yet"
  - "DataExport stays at /data-export but gains breadcrumb + cross-nav links to Export Hub"
  - "admin_chen_1 is a bug — P0 fix — replace with authenticated user identity"
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-23
fast_track: true
origin: "User fast-track request — Help, Download Center, Export Clinical Records, Data Export"
linked_go: GO-660
admin_visibility: no
admin_section: ""
parked_context: ""
files:
  - src/pages/HelpFAQ.tsx
  - src/pages/DownloadCenter.tsx
  - src/pages/SessionExportCenter.tsx
  - src/pages/DataExport.tsx
  - src/components/help/HelpCenterLayout.tsx
  - src/components/help/HelpPages.tsx
---

## Request

The Help & FAQ center, Download Center, Export Clinical Records, and Data Export Center have evolved into a total UI/UX disaster. They are confusing, not intuitive, contain tons of redundant items (e.g., "Patient & Clinical Records" appears in both Download Center and Session Export), have incomplete help sections, missing screenshots, no planned space for tutorial videos, and fail PPN UI standards. We need a full audit, analysis, and planning proposal — then execute a comprehensive redesign that makes these critical, inter-related screens dramatically easier to navigate.

---

## LEAD Architecture

**This is a compound engineering epic spanning four pages and two shared component files.** It must be gated on GO-660 completing its audit and producing the redesign proposal first — BUILDER cannot begin implementation without the IA and UX spec.

**Affected surfaces:**
- `HelpFAQ.tsx` — entry point, needs IA restructure, video slots, screenshot embeds, improved search
- `DownloadCenter.tsx` — needs de-duplication vs SessionExportCenter, clearer card hierarchy, consistent CTAs
- `SessionExportCenter.tsx` — largest file (682L), needs decision tree / wizard flow, contextual help inline, scope disambiguation
- `DataExport.tsx` — needs integration into Download Center mental model, not isolated; table UX improvements
- `HelpCenterLayout.tsx` + `HelpPages.tsx` — shared components that must absorb structural changes without breaking other help articles

**Execution sequencing:**
1. GO-660 produces audit + redesign spec (PRODDY → MARKETER → user approval)
2. WO-665 BUILDER implements per approved spec (sub-tasks to be broken out after GO-660 completes)
3. INSPECTOR runs `/ppn-ui-standards` + `/phase3-integration-regression` before QA pass

**Risk:** SessionExportCenter.tsx at 682 lines may require component extraction. BUILDER must not change export logic — UI/layout only.

---

## Known Issues (from user screenshots + LEAD review)

### Help & FAQ (`/help`)
- [ ] Left nav ("Key Resources / Clinical Tools / Integrations & Setup / Account & Billing") is redundant with the topic cards on the right
- [ ] "Download Center" appears in both the left nav AND as a featured card — double exposure with no differentiation
- [ ] Topic cards (Getting Started, Clinical Toolsets, Regulatory, Troubleshooting) are empty stubs — no content behind them
- [ ] No dedicated space for tutorial videos or platform walkthrough embeds
- [ ] FAQ items are present but not categorized; no jump-links
- [ ] Search bar appears but almost certainly does not work (no backend connected)
- [ ] Missing screenshots throughout all help articles
- [ ] "Contact Support" sidebar is buried at the bottom of the page

### Download Center (`/download-center`)
- [ ] "Patient & Clinical Records" section with Full Treatment Series Bundle, Clinical Outcomes PDF, and Audit & Compliance Reports duplicates what's in SessionExportCenter
- [ ] Mixed CTA patterns: "OPEN TOOL" (navigates away) vs "DOWNLOAD" (direct download) — no visual distinction
- [ ] Cards use both icon + badge + body text + two buttons — too much cognitive load per card
- [ ] "Compliance & Infrastructure" section cards have inconsistent button layouts
- [ ] No progressive disclosure — all sections visible simultaneously with no filtering/tabs
- [ ] "Forms & Templates" section (Informed Consent, Blank MEQ-30) is buried below Compliance — wrong priority order
- [ ] No video tutorial section

### Export Clinical Records (`/session-export`)
- [ ] 682 lines with 4 export package types but no entry-point decision tree ("What do I need?")
- [ ] Repeats Audit & Compliance + Insurance & Billing framing already present in Download Center
- [ ] Export Scope selectors (session date chips) present without explanation of what they do
- [ ] No contextual help, no inline tooltips explaining PHI vs de-identified exports
- [ ] Patient stats bar (PHQ-9, Dosing Sessions, Integration, Pulse Checks) not explained for new users
- [ ] HIPAA COMPLIANT and 21 CFR PART 11 badges present but not linked to explanation

### Data Export Manager (`/data-export`)
- [ ] Visually isolated — no link back to Download Center or Export Clinical Records
- [ ] "STRICTLY CONFIDENTIAL" warning is prominent but creates friction before the form even loads
- [ ] Recent Exports table truncates File IDs making them unusable without copy action
- [ ] Filter selections (Clinical Indication chips: MDD, PTSD, TRD, etc.) have no "select all" or "clear all"
- [ ] Output format selector (CSV/JSON/PDF) has no explanation of which format to choose for which purpose
- [ ] No export preview or confirmation step before generation

### PPN UI Standards Violations (preliminary)
- [ ] Confirm font sizes across all four screens (no `text-xs` in body content per standards)
- [ ] Confirm phase color token usage — no ad-hoc purple/custom colors
- [ ] Button hierarchy needs audit — primary/secondary/ghost consistency
- [ ] Verify WCAG 2.2 AA contrast ratios on badge overlays

---

## Required Deliverables (post GO-660 approval)

Sub-tasks to be created as separate WOs after GO-660 audit completes:

| Sub-WO | Screen | Work Description |
|---|---|---|
| WO-665a | HelpFAQ.tsx | IA restructure: remove redundant left nav, add video embed slots, add screenshot zones, fix search |
| WO-665b | DownloadCenter.tsx | De-duplicate vs SessionExportCenter; unify CTA patterns; add progressive disclosure tabs; reorder sections |
| WO-665c | SessionExportCenter.tsx | Add decision tree entry modal; add inline contextual help tooltips; resolve layout duplication |
| WO-665d | DataExport.tsx | Integrate into Download Center mental model; fix table UX; add format guidance; add confirmation step |
| WO-665e | HelpCenterLayout + HelpPages | Refactor shared layout to support video embeds and screenshot galleries |

---

## Open Questions

- [ ] Should Download Center and SessionExportCenter be merged into a single unified page, or remain separate with clear disambiguation? (GO-660 to answer)
- [ ] Is the Help & FAQ search bar wired to a real backend search, or is it a stub? If stub, is Algolia/Supabase full-text search in scope?
- [ ] Are there video assets already recorded for tutorial slots, or are video zones placeholders for future production?
- [ ] Should DataExport be accessible from the Download Center nav, or remain a standalone page linked from the sidebar?

---

## Acceptance Criteria

- [ ] A practitioner can arrive at any of the four screens and immediately understand which screen serves their current task
- [ ] No export package appears on more than one screen without clear contextual differentiation
- [ ] Help & FAQ has at minimum one video placeholder slot per topic category
- [ ] Every export type has a one-line contextual explanation of who uses it and why
- [ ] All four screens pass PPN UI Standards audit (run `/ppn-ui-standards` workflow)
- [ ] All four screens pass Phase 3 regression checklist
- [ ] Zero content duplication between Download Center and SessionExportCenter
