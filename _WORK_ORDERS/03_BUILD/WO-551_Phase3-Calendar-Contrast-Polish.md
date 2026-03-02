---
id: WO-551
title: "Phase 3 Calendar Dark Mode & Contrast Polish"
status: 03_BUILD
owner: BUILDER
created: 2026-03-01T16:28:00-08:00
failure_count: 0
priority: P2
authored_by: LEAD
parent_ticket: WO-546
build_order: 5
note: "P2 — May be deferred to next sprint if WO-547–550 capacity is tight. Discuss with user before beginning."
---

## LEAD ARCHITECTURE

### Context

Seven visual polish and functional defects in Phase 3 that do not block core workflows but do create significant eye strain, accessibility failures, and unusable output features (PDF/download). These are isolated CSS/component fixes with low rollback risk.

### Deferral Note

**This ticket is P2.** If sprint capacity after WO-547–550 is tight, defer WO-551 to the next sprint. Confirm with the user before starting. Do not block WO-550 close-out for this ticket.

### Architecture Decisions

1. **Calendar dark mode — 3 instances (Defect #28):** Three calendar date-picker popups are bright white on the dark app background. All must receive dark styling:
   - Integration Session date picker
   - Longitudinal Assessment date picker
   - Daily Pulse date picker
   
   Fix: identify the calendar library in use (likely `react-day-picker`, shadcn `Calendar`, or similar). Apply dark theme via the library's theme/class prop, or override with CSS variables targeting the calendar root. Target: `background: var(--color-surface)` or equivalent dark token, sufficient text contrast (≥4.5:1).

2. **Behavioral Change Tracker button contrast (Defect #29):** The "Impact on Well-Being" and "Related to Dosing Session" button sets are colorful but text is illegible — contrast fails. Fix: for each button color, overlay the label text with either `#ffffff` or `#000000` depending on the button's luminance (use WCAG luminance formula or test both). Maintain the colorful backgrounds — only fix text color. Target: ≥4.5:1 contrast for all button states (default, selected, hover).

3. **Behavioral Change Tracker row labels (Defect #30):** "Homework and Practice Assigned" and "Therapist Observations" render as plain body text. Fix: apply `font-manrope font-bold text-sm` (Title Case) to both labels. They should read as field group headings, not body copy.

4. **Longitudinal Assessment compact layout (Defect #31):** PHQ-9, GAD-7, WHOQOL, PSQI, and CSSRS score input boxes consume ~50% of page width despite only needing 2–3 digits. Fix: refactor the score input grid to use a **compact 2- or 3-column layout**: score name on the left, narrow input box (max-width ~80px) on the right. Group all 5 scores in a tight grid. This frees significant vertical space.

5. **CSSRS alert inline positioning & dismissal (Defect #32):** When a high CSSRS score is entered:
   - The red alert currently appears at the **top of the screen** — move it to **directly beneath the CSSRS score input**, above the Save/Back button row
   - The alert must **disappear automatically** when the score is edited to a value below the threshold. Currently the alert persists even after the score is corrected. Fix: make alert visibility reactive to the current field value, not just triggered on first entry.

6. **PDF print formatting (Defect #33):** "Generate Progress Summary Report" → Print/Save PDF produces only a partial screen capture. Fix: implement proper `@media print` CSS that:
   - Shows the full report content
   - Hides navigation, sidebars, and action buttons
   - Uses `page-break-avoid` on key sections
   - Or use `window.print()` with a dedicated print stylesheet. If a print view is not currently implemented, create a `PrintableReport` component that mirrors report content in a print-safe layout.

7. **Discharge summary download (Defect #34):** "Complete Journey & Discharge Summary" triggers a download that is not discoverable. Investigate:
   - Is the downloaded file being named correctly (not `undefined.pdf` or `blob`)?
   - Is it actually being saved to the filesystem or just to memory?
   - Fix: ensure `<a>` download tag or `FileSaver.js` call uses a descriptive filename (`discharge_summary_[SubjectID]_[date].pdf`) and that the blob URL is properly revoked after download.

### Files Likely Touched

- Integration Session form component (date picker)
- Longitudinal Assessment component (date picker + score inputs + CSSRS alert)
- Daily Pulse component (date picker)
- Behavioral Change Tracker component (button contrast + label styles)
- Progress Summary Report / print component
- Discharge Summary download handler

---

## Acceptance Criteria

- [ ] Integration Session calendar popup has dark background — no white/light background visible
- [ ] Longitudinal Assessment calendar popup has dark background
- [ ] Daily Pulse calendar popup has dark background
- [ ] All calendar popup text has ≥4.5:1 contrast against dark background
- [ ] Behavioral Change Tracker "Impact on Well-Being" buttons: all 5 button labels are legible at ≥4.5:1 contrast in default AND selected state
- [ ] Behavioral Change Tracker "Related to Dosing Session" buttons: same contrast requirement
- [ ] "Homework and Practice Assigned" label renders as Manrope Bold heading
- [ ] "Therapist Observations" label renders as Manrope Bold heading
- [ ] Longitudinal Assessment score inputs (PHQ-9, GAD-7, WHOQOL, PSQI, CSSRS) render in compact grid — each input max-width ~80px
- [ ] Longitudinal Assessment page does not require scrolling on 1024×768 viewport when score grid is compact
- [ ] CSSRS high-score red alert appears directly beneath the CSSRS input field (not at top of screen)
- [ ] CSSRS red alert disappears automatically when score is edited below threshold
- [ ] Print/Save PDF of Progress Summary Report prints full report content (not partial screen)
- [ ] PDF output hides navigation, sidebars, and action buttons via print stylesheet
- [ ] Discharge Summary download produces a named file: `discharge_summary_[SubjectID]_[date].[ext]`
- [ ] Downloaded file is openable and contains readable content
- [ ] No regressions on Behavioral Change Tracker form submission after button styling changes

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
