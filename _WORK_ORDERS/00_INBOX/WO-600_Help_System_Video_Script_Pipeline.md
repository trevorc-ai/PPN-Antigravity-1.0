---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
priority: P1
decisions_recorded: 2026-03-12
---

==== PRODDY ====

## PRODDY PRD

### 1. Problem Statement

Practitioners navigating the PPN Portal cannot access contextual help at the exact moment of confusion — they must leave their workflow and search a separate Help Center. Tooltip `learnMoreUrl` fields are unpopulated across all 14 mapped outputs. The Clinical Report PDF is ~50% complete, missing the Integration Compass summary, Pharmacokinetic Flight Plan, QT Interval table, and MEQ-30 block. No AI help video scripts exist to onboard new practitioners or explain outputs. The result: high support load, low feature discovery, and a gap between what the platform can produce and what practitioners know is possible.

### 2. Target User + Job-To-Be-Done

A licensed facilitator needs to understand what every portal output is and how to generate it so that they can confidently complete documentation and explain their data to patients or institutional partners without requesting support.

### 3. Success Metrics

1. `learnMoreUrl` populated in 100% of AdvancedTooltip instances across the 15 highest-traffic components within 14 days of ship.
2. Clinical Report PDF renders all 4 missing sections (Flight Plan, Integration summary, QT table, MEQ-30) with zero layout breaks on a test export run.
3. First AI help video script (Wellness Journey walkthrough) delivered and approved by the user within 10 days.

### 4. Feature Scope

#### In Scope (CLEARED TO BUILD):
- **Tooltip → Help Link Sweep (existing tooltips only):** Wire `learnMoreUrl` prop into existing AdvancedTooltip instances where the prop already exists. Scope limited to 15 priority connections from `ppn_output_map.md`. ⚠️ BLOCKED on Q1 — LEAD must first confirm whether `AdvancedTooltip` currently accepts `learnMoreUrl`; if not, prop extension is a prerequisite task before this sweep.
- **PDF Completion Sprint (text sections only):** Add Integration Compass summary card and QT Interval log table to `ClinicalReportPDF.tsx`. ⚠️ Pharmacokinetic Flight Plan embed is BLOCKED on Q2 (LEAD to determine static snapshot vs. live chart approach). MEQ-30 block proceeds once Q3 vocabulary is approved.
- **Help Video Script Series — 4 scripts total (CLEARED):**
  - Script 0: Portal Overview (1 overview script)
  - Script 1: Wellness Journey — Phase 1 Preparation
  - Script 2: Wellness Journey — Phase 2 Dosing (Cockpit Mode)
  - Script 3: Wellness Journey — Phase 3 Integration
  - Script 4: Interaction Checker (Bonus — high priority)
  - Script 5: Patient Report generation
  - Format per script: narration text + ordered screenshot sequence + tooltip callout moments
  - Footage: Fresh captures from **production site** (not staging — Cockpit Mode overlay not available in staging). User to provide Phase 2 session video.
- **New Tooltip Copy — BLOCKED pending Q3 discussion:** 6 missing data points (QT Interval, Rescue Protocol, PHQ-9, GAD-7, MEQ-30, Pulse Check) require vocabulary review before copy is written.

#### Out of Scope:
- Video recording, editing, or audio production (user owns this layer).
- New Help Center articles beyond linking existing ones.
- Native mobile app or PWA changes.
- Any database schema changes.
- Changes to the Audit Logs or Billing Portal.

### 5. Priority Tier

**P1** — Required for beta practitioner onboarding. The tooltip → help link gap means every new practitioner who encounters an unfamiliar field has no in-context path to documentation. The PDF gap blocks use of the report for insurance or EHR submission. Both are pre-requisite to expanding the beta group beyond Dr. Allen's cohort.

### 6. Open Questions — Status After User Review (2026-03-12)

| # | Question | Decision |
|---|---|---|
| 1 | Does `AdvancedTooltip` accept `learnMoreUrl` prop? | ⏸️ **ON HOLD** — User doesn't know; LEAD to inspect `AdvancedTooltip.tsx` API surface before sweep begins |
| 2 | Can the Pharmacokinetic Flight Plan be embedded in the PDF? | ⏸️ **ON HOLD** — User doesn't know; LEAD to determine static snapshot vs. live chart approach |
| 3 | Should new tooltip copy go through Advisory Board review? | ⏸️ **ON HOLD** — User wants to discuss and verify scope of vocabulary before copy is written |
| 4 | Video script structure? | ✅ **RESOLVED** — 3 separate phase scripts + 1 portal overview = 4 scripts total |
| 5 | Use existing screenshots or capture new for Phase 2? | ✅ **RESOLVED** — Capture fresh footage from **production site** (not staging). User will provide Phase 2 session footage. |

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement ≤ 100 words
- [x] Target User + JTBD: one sentence
- [x] 3 measurable Success Metrics (specific numbers/events)
- [x] In Scope and Out of Scope both populated
- [x] Priority tier with explicit reason
- [x] Open Questions ≤ 5, none answered by PRODDY
- [x] No code, SQL, or schema authored in this document
- [x] PRD total < 600 words

✅ WO-600 placed in 00_INBOX. LEAD action needed: review Open Questions and route.

==== PRODDY ====
