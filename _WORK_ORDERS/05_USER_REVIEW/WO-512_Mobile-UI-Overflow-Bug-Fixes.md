---
id: WO-512
title: "Mobile UI Bug Fixes — Overflow, Truncation & Z-Index Issues (Change Orders IMG_3448–IMG_3771)"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-26
created_by: CUE
failure_count: 0
priority: P1
tags: [mobile, ui-bugs, overflow, truncation, z-index, responsive, change-orders]
evidence_source: public/admin_uploads/change_orders/
---

# WO-512: Mobile UI Bug Fixes — Change Order Batch (IMG_3448–IMG_3771)

## User Request (Verbatim)

> "Done. See more @[public/admin_uploads/change_orders]"

Photos submitted by user (Trevor) showing 7 red-circled issues across the production site at `ppnportal.net`, captured on mobile (iOS Safari) between 3:50–4:00 PM.

---

## Evidence Files

All screenshots are in: `public/admin_uploads/change_orders/`

| File | Timestamp | Page |
|------|-----------|------|
| IMG_3448.webp | 3:50 PM | Protocol Builder / Workspace Customization |
| IMG_3449.webp | 3:56 PM | Clinic Performance — Performance Radar |
| IMG_3450.webp | 3:57 PM | Patient Galaxy (Global Intelligence) |
| IMG_3452.webp | 3:58 PM | Safety Surveillance — Drug Interaction Checker |
| IMG_3453.webp | 3:59 PM | Audit Logs |
| IMG_3454.webp | 4:00 PM | Substance Monograph — Molecular Pharmacology |
| IMG_3771.webp | 12:52 PM | Invite Email Preview |

---

## Bug Inventory

### BUG-512-A — Patient Galaxy: Duplicate Title Rendering (HIGH)
- **File:** IMG_3450.webp
- **Page:** Patient Galaxy / Global Intelligence
- **What's happening:** The title "Patient Galaxy" renders twice — once in large bold text and once again stacked below it, overlapping with the "Analysis" subtitle. This is a z-index or absolute positioning conflict, likely in the card header.
- **Expected:** Single, clean title "Patient Galaxy" with subtitle "Outcomes clustering analysis" on one clean line below.

---

### BUG-512-B — Substance Monograph: Compound Tab Row Clipping (HIGH)
- **File:** IMG_3454.webp
- **Page:** Substance Monograph → Molecular Pharmacology tab → Molecular Bridge section
- **What's happening:** The compound selector tab row (`PSILOCYBIN | MDMA | LSD | KETAMINE`) is overflowing its container. "PSILOCYBIN" is clipped to "OCYBIN" on the left edge.
- **Expected:** All 4 compound tabs visible and scrollable, or the tab row wraps/scrolls horizontally with the full word "PSILOCYBIN" always visible.

---

### BUG-512-C — Audit Logs: Tab Bar Overflows Right Edge (HIGH)
- **File:** IMG_3453.webp
- **Page:** Audit Logs
- **What's happening:** The 3-tab filter bar (`All | Security | Clinical`) is cut off on the right side — "Clinical" tab is partially off-screen.
- **Expected:** All 3 tabs fit within the mobile viewport (375px+), either by reducing padding, allowing scroll, or wrapping.

---

### BUG-512-D — Drug Interaction Checker: Dropdown Truncated + Double Chevron (MEDIUM)
- **File:** IMG_3452.webp
- **Page:** Safety Surveillance → Drug Interaction Checker
- **What's happening:** The "Primary Agent (Psychedelic)" dropdown label reads "Select Controlled Subs▼▼" — the text is truncated AND there appear to be two chevron icons rendering.
- **Expected:** Full placeholder text "Select Controlled Substance..." visible (or a shorter mobile-appropriate label), and only one chevron icon.

---

### BUG-512-E — Performance Radar: Tab Button Styling/Contrast (MEDIUM)
- **File:** IMG_3449.webp
- **Page:** Clinic Performance → Performance Radar card
- **What's happening:** The "Q1 2026" and "LAST 12 MO" period toggle buttons lack sufficient visual distinction. The active state (`Q1 2026` filled blue) vs inactive is hard to differentiate at a glance on mobile.
- **Expected:** Clear, high-contrast active/inactive tab states with properly-sized tap targets for mobile (min 44×44px touch targets).

---

### BUG-512-F — Protocol Builder: Header Element Clipping (LOW)
- **File:** IMG_3448.webp
- **Page:** Protocol Builder / Customize Your Workspace setup screen
- **What's happening:** The element just above the "Customize Your Workspace" info card is cropped at the top — a button or heading is being clipped and only shows partial text "…layout."
- **Expected:** All content above the workspace card is fully visible before the user scrolls.

---

### BUG-512-G — Invite Email: "Background" Badge Artifact (LOW)
- **File:** IMG_3771.webp
- **Page:** PPN Portal invite email (viewed in iOS Mail)
- **What's happening:** A red "Background" browser-annotation badge appears inline next to "You're in." in the email. This is likely a browser reader mode annotation or iOS Mail accessibility labeling artifact.
- **Expected:** Confirm this does NOT appear in production email rendering. If it does, the email template has an element with an unintended aria-label or hidden label saying "Background" that iOS Mail is surfacing. Needs investigation.

---

## LEAD Architecture (to be filled in by LEAD)

*Awaiting LEAD triage and routing.*

---

## Acceptance Criteria

- [ ] BUG-512-A: Patient Galaxy title renders once, no overlap
- [ ] BUG-512-B: All compound tab names fully visible on mobile (no clipping)
- [ ] BUG-512-C: Audit Logs tab bar fits within mobile viewport
- [ ] BUG-512-D: Drug Interaction dropdown has single chevron and readable placeholder text
- [ ] BUG-512-E: Performance Radar tab buttons have clear active/inactive states with 44px touch targets
- [ ] BUG-512-F: Protocol Builder header content fully visible above workspace card
- [ ] BUG-512-G: Invite email confirmed free of "Background" label artifact in production
- [ ] All fixes verified on mobile viewport (375px width minimum)
- [ ] INSPECTOR sign-off before close
