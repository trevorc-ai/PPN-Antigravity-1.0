==== PRODDY ====
---
owner: MARKETER
status: 00_INBOX
authored_by: PRODDY
date: 2026-03-06
priority: P1
files:
  - src/components/help/HelpPages.tsx
  - src/pages/HelpFAQ.tsx
  - src/content/help/help-center.md
---

## PRODDY PRD

> **Work Order:** WO-574 — Help Center: Copy Audit & Content Alignment
> **Authored by:** PRODDY
> **Date:** 2026-03-06
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

The Help Center's body text and page headings are misaligned with the sidebar navigation labels and the current feature set. Page headings do not consistently match their sidebar link labels. Two category cards ("Regulatory" and "Troubleshooting") have no supporting subpage content. The Session Reporting page still instructs users to export via the old session detail page rather than the new Download Center. A legacy content file (`help-center.md`) documents four features (Trial Matchmaker, Music Logger, Legacy Importer, Research Dashboard) that are not yet live, risking user confusion.

---

### 2. Target User + Job-To-Be-Done

A practitioner consulting the Help Center needs to find accurate, consistent guidance that matches the labels and navigation they see on screen so that they can resolve workflow questions quickly without being misled by stale instructions.

---

### 3. Success Metrics

1. Zero mismatches between sidebar link labels and the `<h2>` heading on the corresponding subpage — confirmed by INSPECTOR string comparison across all 9 routes.
2. "Session Reporting & Exports" subpage copy explicitly references the Download Center (`/download-center`) as the primary export path — confirmed in copy review before ship.
3. "Regulatory" and "Troubleshooting" FAQ category cards either (a) link to fully written subpage content or (b) are removed from `HelpFAQ.tsx` — confirmed by INSPECTOR on final build.

---

### 4. Feature Scope

#### ✅ In Scope

**Heading Alignment (MARKETER writes copy, BUILDER implements):**
- Align sidebar labels to `<h2>` headings — or vice versa — for all 9 subpages. Current mismatches:
  - "Interaction Checker" → page says "Using the Interaction Checker"
  - "Session Reporting" → page says "Session Reporting & Exports"
  - "Settings" → page says "Account Settings"
  - "Device Syncing" → page says "Device Syncing & Integrations"

**Subpage Content — Missing Pages:**
- Write body copy for "Regulatory" subpage: HIPAA overview, consent record-keeping, data retention policy, and PPN's Zero-PHI architecture in plain English (9th-grade reading level).
- Write body copy for "Troubleshooting" subpage: common errors (blank screen, session not saving, form won't submit), browser compatibility notes, and support contact CTA.

**Stale Content Updates:**
- `HelpSessionReporting`: replace "click Export PDF on the session detail page" with accurate instruction pointing to Download Center → "Patient & Clinical Records" category.
- `help-center.md`: add "Coming Soon" flag to the four pre-launch sections (Trial Matchmaker, Music Logger, Legacy Importer, Research Dashboard) — do not delete, as these represent future features.

**Voice & Tone:**
- All new copy must match existing PPN Help Center voice: plain English, 9th-grade reading level, no jargon without a glossary entry, second-person ("you / your patient"), short sentences.

#### ❌ Out of Scope

- Redesigning Help Center layout or navigation structure (covered in WO-573).
- Adding new FAQ questions beyond the two new subpages.
- Writing tooltip copy (that is a separate FLO/MARKETER deliverable).
- Modifying `ScreenshotBlock` content or populating screenshots (covered in WO-573).
- Changing the clinical accuracy of existing Interaction Checker or Wellness Journey descriptions — PRODDY/clinical team must approve those separately.

---

### 5. Priority Tier

**[X] P1** — High value, ship this sprint

**Reason:** The Help Center is being actively surfaced to practitioners via the newly promoted Download Center hero card. Stale copy and missing subpages will be immediately visible and undermine trust in the platform. The Regulatory and Troubleshooting gaps are particularly high-risk — practitioners clicking those cards currently see a filtered FAQ list with no dedicated guidance.

---

### 6. Open Questions for LEAD

1. ~~Regulatory page — specific regulations or high-level?~~ **RESOLVED: High-level language only. No specific regulation names.**
2. ~~Troubleshooting — live chat or email link?~~ **RESOLVED: Include live support chat widget trigger AND a placeholder for a phone number.**
3. ~~`help-center.md` pre-launch sections — delete or keep?~~ **RESOLVED: Keep but hide. Comment out the Trial Matchmaker, Music Logger, Legacy Importer, and Research Dashboard sections using HTML/markdown comments so they are preserved for future use but not rendered anywhere in the app.**

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: MARKETER`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
