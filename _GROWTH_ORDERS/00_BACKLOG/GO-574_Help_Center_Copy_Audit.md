==== PRODDY ====
---
owner: MARKETER
status: 00_BACKLOG
authored_by: PRODDY
priority: P1
created: 2026-03-06
epic_type: Growth_Marketing
target_audience: Licensed Psychedelic Therapy Practitioners
source_work_order: WO-574 (_WORK_ORDERS/00_INBOX/WO-574_Help_Center_Copy_Audit.md)
---

## PRODDY GROWTH EPIC

> **Epic Work Order:** GO-574 — Help Center: Copy Audit & Content Alignment
> **Epic Type:** In-App Content / Help Documentation

---

### 1. Unified Problem & Strategy

The Help Center is the primary trust-building surface for new practitioners. It has just been elevated via the new Download Center hero card, driving more practitioner eyes to it than ever before. However, the existing copy is misaligned: page headings don't match sidebar labels, two category cards ("Regulatory" and "Troubleshooting") have zero supporting content, the Session Reporting page references an outdated export workflow, and four pre-launch feature sections are rendering in the source file without a "Coming Soon" flag.

The strategy is to write clean, plain-English copy at a 9th-grade reading level that matches the current feature set — making the Help Center a credible, accurate, and complete reference that practitioners trust.

---

### 2. Global Success Metrics

1. Zero mismatches between sidebar link labels and on-page `<h2>` headings across all 9 subpages — confirmed by INSPECTOR string comparison.
2. "Session Reporting & Exports" subpage explicitly references `/download-center` as the primary export path — confirmed in MARKETER copy review before implementation.
3. Both "Regulatory" and "Troubleshooting" subpages have complete, published body copy before WO-573 (mobile build) ships — confirmed by USER review sign-off.

---

### 3. Variations (Content Deliverables)

*MARKETER processes these serially. Draft → USER review → next item.*

- **Deliverable 1: Heading Alignment**
  - Fix 4 sidebar label ↔ page heading mismatches: Interaction Checker, Session Reporting, Settings, Device Syncing
  - Goal: Perfect 1:1 match between sidebar and page heading on all 9 routes
  - Status: `00_BACKLOG`

- **Deliverable 2: "Regulatory" Subpage Copy**
  - Write full body copy: high-level data practices, Zero-PHI architecture, consent record-keeping, retention policy
  - Tone: Plain English, 9th-grade level, no specific regulation names (HIPAA etc. by name)
  - Goal: Practitioners find a complete, reassuring compliance reference in 1 click
  - Status: `00_BACKLOG`

- **Deliverable 3: "Troubleshooting" Subpage Copy**
  - Write full body copy: common errors (blank screen, session not saving, form won't submit), browser notes
  - Must include: live chat widget trigger CTA + phone number placeholder `[PHONE]`
  - Goal: Practitioners self-resolve 80% of common issues without contacting support
  - Status: `00_BACKLOG`

- **Deliverable 4: Session Reporting Copy Update**
  - Replace outdated "click Export PDF on the session detail page" instruction
  - Replace with: accurate path via Download Center → "Patient & Clinical Records"
  - Status: `00_BACKLOG`

- **Deliverable 5: Pre-Launch Section Housekeeping**
  - Comment out (hide, do not delete) the 4 pre-launch sections in `help-center.md`:
    Trial Matchmaker, Music Logger, Legacy Importer, Research Dashboard
  - These are preserved for future use but must not be visible in any rendered UI
  - Status: `00_BACKLOG`

---

### 4. Implementation Fast-Lane Flags

- [x] **Pure Content (Fast-Lane):** Deliverables 1, 4, 5 are content-only edits. Bypass 03_MOCKUP_SANDBOX and 04_VISUAL_REVIEW. Route directly `02_USER_REVIEW → 05_IMPLEMENTATION`.
- [ ] **New Layout/Component:** Deliverables 2 and 3 (new subpages) require BUILDER to scaffold the new page component shells in `HelpPages.tsx` before MARKETER copy can be dropped in. LEAD must confirm shells exist before MARKETER drafts.

---

### Key Decisions Already Resolved (No LEAD Action Required)

| Question | Decision |
|---|---|
| Regulatory page — specific law names? | High-level language only |
| Troubleshooting support contact | Live chat widget + `[PHONE]` placeholder |
| Pre-launch sections in `help-center.md` | Comment out (hide), do not delete |

---

### PRODDY Sign-Off Checklist

- [x] Epic strategy is clearly defined
- [x] Variations are listed as distinct deliverables
- [x] NotebookLM sources (if any) are linked — N/A for this epic
- [x] Frontmatter updated correctly
- [x] Fast-lane flags set appropriately
- [x] Source WO cross-referenced

==== PRODDY ====
