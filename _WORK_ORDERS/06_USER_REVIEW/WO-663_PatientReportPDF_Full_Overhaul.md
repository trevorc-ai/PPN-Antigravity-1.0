---
id: WO-663
title: "PatientReportPDF — Full UI/UX audit, data-viz review, PPN UI Standards overhaul, print formatting fix, and bidirectional navigation improvement"
owner: LEAD
status: 06_USER_REVIEW
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-23
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
files:
  - src/pages/PatientReportPDF.tsx
---

## Request

PatientReportPDF.tsx needs a full FLO UI/UX audit, VIZ data-viz review, PPN UI Standards compliance overhaul, complete print formatting fix, and improved bidirectional navigation UX.

## LEAD Architecture

This is a single-file overhaul of `src/pages/PatientReportPDF.tsx`. The file is 423 lines of inline-styled JSX with three PDF "pages" (wellness journey, how you've changed, what comes next), two inline SVG charts (WellnessRadar + WaveformSummary), a QRCodePlaceholder, and a print toolbar. The overhaul touches: (1) print CSS — switch from A4 to US Letter, add 0.6in margins, inter Google Fonts import, PPN wordmark in header, proper legal footer; (2) typography — all sub-12px inline font sizes must be raised to 9pt minimum for print, 14px for screen; (3) color — red/green alone used in table cells and chart polygons must gain text or icon pairings; (4) radar chart label font size raised from 9px to 12px; (5) waveform axis labels raised from 8px to 9pt; (6) QR URL font size from 8px to 9pt monospace with Roboto Mono; (7) navigation — add a "Back to Protocol" button in the toolbar that uses `window.history.back()` or a router link; (8) table header dark fill (#065f46) must switch to light indigo tint per standards.

## Open Questions

- [ ] Is the back-navigation button supposed to link to a specific protocol detail page (needs sessionId in URL) or just `history.back()`?
- [ ] Should the PPN wordmark image be embedded as a base64 img or loaded from `public/assets/ppn_portal_wordmark.png`?

---

## INSPECTOR QA REPORT — WO-663
**Date:** 2026-03-23 | **Inspector:** INSPECTOR | **File:** `src/pages/PatientReportPDF.tsx`

### Phase 0: Pre-Build Review
- [x] **Fast-Pass:** `database_changes: no` — no DB impact. No SQL files. Fast-pass applies.
- [x] **UI Standards Pre-Build Gate:** PASS (run retroactively as post-build QA gate)

### Phase 1: Scope & Database Audit
- [x] **Database Freeze Check:** PASS — 0 CREATE/DROP/ALTER in `PatientReportPDF.tsx`
- [x] **Scope Check:** PASS — only `src/pages/PatientReportPDF.tsx` modified, matching plan
- [x] **Refactor Check:** PASS — full planned rewrite, no out-of-scope files touched

### Phase 2: UI & Accessibility Audit
- [x] **Color Check:** PASS — Before column uses amber `#92400e`; Now column uses teal `#0d9488`. Change badge uses `▼ Improved` / `▲ Watching` text labels. No color-alone state differentiation.
- [x] **Typography Check:** PASS — `grep` confirms all inline font sizes are 12px minimum. QR URL, footer, and labels all at 12px. No sub-12px in rendered text.
- [x] **Character Check:** PASS — 0 em dashes in rendered text (4 in JSX comments only — not rendered to DOM).
- [x] **Input Check:** PASS — 0 free-text `textarea` elements. Report is read-only.
- [x] **Mobile-First Check:** PASS — No Tailwind classes used (file is inline-style JSX). All grid layouts use `gridTemplateColumns` inline styles. No hardcoded `w-[Xpx]` or bare `grid-cols-N` Tailwind classes.

### Phase 3: Verdict (React/TSX)
**STATUS: ✅ APPROVED**

### Phase 3.5: Regression Testing Gate
**Trigger matched:** `src/pages/*PDF.tsx` — PDF print preview audit required (WO-644 checklist)

| Scenario | Result |
|---|---|
| Screen render at `/#/patient-report-pdf` — toolbar, badge, back button | ✅ PASS |
| All 3 pages render with correct section content, no blank pages on screen | ✅ PASS |
| Print dialog (Cmd+P) shows exactly 3 pages, content flows correctly | ✅ PASS — confirmed by browser subagent |
| Page 2 table header light indigo (not dark green `#065f46`) | ✅ PASS |
| Footer `ppnportal.net` present on every page | ✅ PASS |
| Wordmark image loads or graceful text fallback activates | ✅ PASS — PPN Portal wordmark renders |
| Radar chart legend uses text labels, not color alone | ✅ PASS — "Now (larger area = better)" / "Before (starting point)" labels present |

**Overall: ✅ REGRESSION CLEAR**

### Phase 5: Color Blindness & WCAG AA
- [x] **Contrast — Body Text:** PASS — all body text is `#1e293b` or `#475569` on white. Both exceed 4.5:1.
- [x] **Contrast — Large Text:** PASS — headings are `#4338ca` / `#3730a3` on near-white backgrounds.
- [x] **Banned Pair (red/green):** PASS — Before is amber (`#92400e`), Now is teal (`#0d9488`). Not a red/green pair.
- [x] **Banned Pair (teal/purple):** N/A — teal and purple are used on different elements, not as a paired state differentiator.
- [x] **Low-Contrast Gray:** PASS — `grep` found 0 `text-gray-[1-4]00` (Tailwind) or `color: #[89a-f]` patterns.
- [x] **Phase Palette:** PASS — Phase 3 uses indigo/teal throughout. No ad hoc colors.
- [x] **Icon Pairing:** PASS — change badge uses `▼` / `▲` directional arrows + text labels.

### Phase 6: Print & PDF Readiness
- [x] **`@page` rule:** PASS — `size: letter; margin: 0.6in;` confirmed
- [x] **`@media print` block:** PASS — hides `.no-print` toolbar, clears dark wrapper background
- [x] **Background:** PASS — `pdf-wrapper` forced to `#ffffff` in print
- [x] **Image bounds:** PASS — wordmark uses `height: 28px; objectFit: contain`; SVG charts have bounded viewBoxes
- [x] **Page break safety:** PASS — `.pdf-grid`, `.pdf-table-wrapper` all have `break-inside: avoid` (6 instances in CSS rule)
- [x] **Wordmark:** PASS — `<img src="/assets/ppn_portal_wordmark.png">` with graceful text fallback
- [x] **Footer:** PASS — `© 2026 PPN Portal · ppnportal.net · Confidential` on every page
- [x] **Fonts:** PASS — Google Fonts `@import` is first line of `PRINT_CSS` constant
- [x] **Legal contact email:** N/A — `info@ppnportal.net` is required on outreach collateral per Phase 4. Patient-confidential reports are not outreach; contact email would be inappropriate here.

**Phase 6 Verdict: ✅ APPROVED**

---

## INSPECTOR QA — Visual Evidence

![WO-663: Toolbar with ← Back button, 3-page badge, Download PDF button, and Page 1 content at /#/patient-report-pdf](/Users/trevorcalton/.gemini/antigravity/brain/28ebaf0d-01c7-4d56-83d4-f04e56f3d4a6/page1_toolbar_top_1774283708642.png)
![WO-663: Page 2 — Radar chart with descriptive legend, light indigo table header, amber/teal Before-Now columns at /#/patient-report-pdf](/Users/trevorcalton/.gemini/antigravity/brain/28ebaf0d-01c7-4d56-83d4-f04e56f3d4a6/page2_full_comparison_table_1774283718099.png)
![WO-663: Page 3 — What Comes Next cards, QR code, legal footer with ppnportal.net at /#/patient-report-pdf](/Users/trevorcalton/.gemini/antigravity/brain/28ebaf0d-01c7-4d56-83d4-f04e56f3d4a6/page3_cards_qr_1774283723031.png)

**INSPECTOR VERDICT: ✅ APPROVED | Date: 2026-03-23**
