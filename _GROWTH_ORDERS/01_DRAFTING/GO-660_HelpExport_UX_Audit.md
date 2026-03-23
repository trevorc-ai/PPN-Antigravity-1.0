---
id: GO-660
title: "Help & Export Hub — Full UX/UI Audit, Research, and Redesign Proposal"
owner: PRODDY
status: 00_BACKLOG
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-23
fast_track: true
target_audience: PPN Platform Team / Practitioner Users
notebook_source: N/A
prototype_reference: None
linked_wo: WO-665
---

## Request

Conduct a comprehensive UX/UI audit and 2026 best-practices research study of four inter-related screens — Help & FAQ Center, Download Center, Export Clinical Records (SessionExportCenter), and Data Export Manager — then produce a full redesign proposal and planning document that feeds WO-665 for engineering execution.

---

## Problem Statement

These four screens are critical to practitioner workflows (seeking help, downloading templates, exporting clinical records, generating research datasets) but share a set of compounding UX failures:

| Screen | Key Failures Observed |
|---|---|
| **Help & FAQ** (`/help`) | Redundant left nav + topic cards; no video tutorial slots; incomplete help articles; missing screenshots; search bar underutilized |
| **Download Center** (`/download-center`) | "Patient & Clinical Records" section overlaps heavily with SessionExportCenter; card layout inconsistent; button labels ("OPEN TOOL" vs "DOWNLOAD") mixed; no progressive disclosure |
| **Export Clinical Records** (`/session-export`) | 682 lines but no clear decision tree for first-time users; package cards repeat info from Download Center; no contextual help inline |
| **Data Export Manager** (`/data-export`) | Isolated from other export tools; "Recent Exports" table truncates file IDs; confidentiality warning buried; no link back to Download Center |

**Core Principle Failure:** A practitioner should never be confused about which screen to use for which task. Currently they can arrive at all four screens and still not know where to click.

---

## Brief

Produce a structured audit + redesign proposal document that:

1. **Audits the current state** of all four screens against PPN UI Standards and 2026 SaaS help-center best practices
2. **Maps the information architecture** — what belongs where, what's redundant, and what's missing
3. **Recommends a unified mental model** ("Help & Learn" vs "Export & Download") with clear user journeys
4. **Specifies UX improvements** per screen: content hierarchy, progressive disclosure, video placeholder zones, screenshot requirements, inline contextual help, and nav disambiguation
5. **Produces a prioritized improvement backlog** that maps directly to WO-665 engineering sub-tasks

---

## 2026 Research Context (LEAD Pre-Research)

Key best practices to apply from 2026 SaaS clinical UX research:

- **Search-first architecture**: Intelligent search must be the primary wayfinding mechanism, not nav menus
- **Visual aids are mandatory**: GIFs, video embeds, and screenshots are non-negotiable for clinical documentation tools (not optional enhancements)
- **Cognitive load reduction**: 2026 standards require max 2-3 lines of body text per section before a visual break or progressive disclosure
- **Micro-onboarding**: First-time visitors need embedded contextual guides, not a separate help center
- **Zero navigation ambiguity**: Users must never arrive at two screens that appear to serve the same function — "Download Center" and "Export Clinical Records" currently both present export package cards
- **Mobile-first**: Over 51% of help center traffic is mobile; current layout is desktop-only
- **Accessibility (WCAG 2.2 AA)**: Clinical software requires full keyboard navigation and screen reader support

---

## PRODDY Task List

- [ ] Read PPN UI Standards skill (`ppn-ui-standards`) before producing any output
- [ ] Conduct screen-by-screen audit against PPN UI Standards checklist
- [ ] Map current IA across all four screens and identify overlaps, gaps, and contradictions
- [ ] Research and document 3–5 reference SaaS help center patterns that should inform the redesign
- [ ] Draft `CONTENT_MATRIX.md` for the redesign proposal deliverable
- [ ] Define the master mental model: which screen owns which user task
- [ ] Specify per-screen UX improvements with enough detail for BUILDER to implement directly
- [ ] Produce a prioritized improvement backlog feeding WO-665

## Reference Assets

- Screenshots provided by user: `Help & FAQ`, `Download Center`, `Export Clinical Records`, `Data Export Manager`, `Compliance & Infrastructure section`
- Source files:
  - `src/pages/HelpFAQ.tsx` (303 lines)
  - `src/pages/DownloadCenter.tsx` (346 lines)
  - `src/pages/SessionExportCenter.tsx` (682 lines)
  - `src/pages/DataExport.tsx` (451 lines)
  - `src/components/help/HelpCenterLayout.tsx` (138 lines)
  - `src/components/help/HelpPages.tsx` (385 lines)
- PPN UI Standards: `.agent/skills/ppn-ui-standards/SKILL.md`
- Routes: `#/help`, `#/download-center`, `#/session-export`, `#/data-export`
