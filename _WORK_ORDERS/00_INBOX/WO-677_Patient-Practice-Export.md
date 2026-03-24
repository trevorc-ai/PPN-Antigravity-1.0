---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
active_sprint: true
priority: P1
database_changes: no
feature_name: PPN Practice Export
project_brief: docs/projects/ppn-local-patient-companion.md
created: 2026-03-24
files:
  - src/components/patients/PracticeExportButton.tsx
  - src/utils/practiceExportBuilder.ts
  - src/components/patients/PatientListPage.tsx
---

## PRODDY PRD

> **Work Order:** WO-677 — PPN Practice Export (Two-Sheet XLSX)
> **Authored by:** PRODDY
> **Date:** 2026-03-24
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Practitioners document sessions against de-identified Subject IDs in PPN. Their real patient contact information lives in a separate system (EMR, spreadsheet, or chart). When they want to call or message a patient after reviewing their PPN chart, they must manually cross-reference two separate systems. There is currently no way to get a rich, portable view of their patient panel that they can annotate with their own contact info outside of PPN. A beta practitioner (Dr. Allen) surfaced this directly as a workflow blocker.

---

### 2. Target User + Job-To-Be-Done

A licensed practitioner needs to download a complete, rich snapshot of their patient panel from PPN so that they can add their own contact information alongside PPN clinical data in their own local file — outside PPN, with zero PHI ever entering our platform.

---

### 3. Success Metrics

1. A practitioner can download a complete Practice Export for a panel of 50 patients in ≤10 seconds, verified across 5 QA sessions.
2. Sheet 2 VLOOKUP formulas in the exported `.xlsx` correctly resolve all Subject ID references against Sheet 1 data with zero formula errors in QA testing on Excel and Google Sheets.
3. Zero bytes of PHI appear in the exported file — INSPECTOR network audit and file content audit must confirm the export contains only de-identified PPN data (no names, phones, emails, or any identifiers added by PPN).

---

### 4. Feature Scope

#### ✅ In Scope

**Export file format:** `.xlsx` (Excel workbook) with two sheets

**Sheet 1 — "PPN Data" (hidden by default, PPN-generated)**
Contains all de-identified clinical data per patient, formatted as a named Excel Table:
- Subject ID
- Arc of care phase
- Protocol name
- Primary substance
- Dosing (mg, route)
- Sessions completed
- Last session date
- Next session scheduled (if exists)
- MEQ-30 score (most recent)
- PHQ-9 score (most recent)
- GAD-7 score (most recent)
- Contraindication flags (comma-separated)
- Integration sessions completed
- Practitioner free-text note (de-identified, if present)

**Sheet 2 — "My Practice" (visible, practitioner-owned)**
Pre-formatted with:
- Column A: Subject ID (practitioner types or pastes)
- Columns B–D: Real Name, Phone, Email (blank — practitioner fills in)
- Column E: Notes (blank — practitioner fills in)
- Columns F onwards: Formula columns using VLOOKUP against Sheet 1 — Protocol, Sessions, Phase, Last Session, MEQ, PHQ, GAD auto-populate when Subject ID is entered in column A

**"Refresh PPN Data" secondary export:** A plain CSV download of Sheet 1 data only — formatted for paste-in to update an existing workbook's Sheet 1 without touching Sheet 2.

**Entry point:** "Download Practice Export" button on the Patients list page. Respects existing patient filter (all patients, or filtered subset).

**Tooltip / one-liner on button:** "Your de-identified patient panel. Add names and contacts in Sheet 2 — stays on your device."

#### ❌ Out of Scope

- Any PHI fields in the export — PPN only exports what it already holds (de-identified)
- Automatic sync or re-import of the file back into PPN
- Cloud storage integration (Google Drive, Dropbox)
- In-app Bridge or local PHI storage (see WO-676, currently in 98_HOLD)
- Scheduling, reminders, or outreach features inside PPN
- Subject ID QR code or barcode generation (separate future ticket if needed)

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Beta practitioner (Dr. Allen) surfaced this as an active workflow blocker. The legal assessment of WO-676 concluded that a pure data-out export is the correct immediate answer — legally clean, immediately useful, and no PHI risk to PPN. Unblocks the current user without requiring legal review before the trade show.

---

### 6. Open Questions for LEAD

1. **XLSX generation library:** Does the current stack have an xlsx generation library (e.g., `xlsx`, `exceljs`, `SheetJS`)? If not, LEAD to select and add. PRODDY recommends `exceljs` for its sheet-level formatting and table support.
2. **Sheet 1 visibility:** Excel "hidden" sheets are trivially unhidden by the user. Is this acceptable (we are not hiding PPN data for security, just to keep UX clean), or should Sheet 1 simply be left visible with a header note: "PPN-generated — do not edit"?
3. **Google Sheets compatibility:** VLOOKUP formulas work in Google Sheets. However, if the practitioner uploads the `.xlsx` to Google Drive and opens it, the hidden sheet visibility behaves differently. Should we test and document Google Sheets as a supported path?
4. **Which patients are included:** Does the export include all of the practitioner's patients, or respect the current filter/search state on the patient list page? Recommend: export all, with a filter option as V2 enhancement.
5. **"Refresh" flow UX:** Should the Sheet 1 CSV "Refresh" download be a separate button, or bundled with the main export instructions? DESIGNER to advise.

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] `database_changes: no` — pure frontend export feature, reads existing patient data
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
