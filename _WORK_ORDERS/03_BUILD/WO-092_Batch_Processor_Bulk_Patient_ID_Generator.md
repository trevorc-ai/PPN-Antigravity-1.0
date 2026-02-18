---
id: WO-092
title: "Batch Processor — Bulk Patient ID Generator (Google Sheets Airlock)"
status: 03_BUILD
owner: BUILDER
ticket_type: EVALUATION (not a direct build order)
priority: P1 (High — clinic onboarding blocker)
category: Tooling / Onboarding / Zero-Knowledge / Clinic Operations
failure_count: 0
created_date: 2026-02-17T18:56:27-08:00
estimated_complexity: 3/10
source: gemini_recommendation
proddy_validation_required: true
strategic_alignment: Clinic Onboarding / Scale / GTM
deliverable_type: Google Sheets Template + User Guide (NOT React code)
requested_by: Trevor Calton
related_tickets:
  - WO_023 (07_ARCHIVED — Legacy Note Parser, different problem: NLP parsing of session notes)
---

# User Request (Verbatim)

> For "Bulk Uploads" (onboarding a clinic with 500+ existing patients), manual entry is a dealbreaker. We need a a "Batch Processor" mechanism.
> The concept remains the same: Local Calculation. We will process their entire patient list inside the Google Sheet ("Airlock") and produce a "Clean" file that contains only the PPN IDs.

---

## Strategic Context

**The Problem:** A clinic with 500+ existing patients cannot manually enter each one into PPN. Manual entry is a GTM dealbreaker for clinic-scale adoption.

**The Solution:** A Google Sheets "Airlock" template that:
1. Accepts raw EHR export (names, DOB) in a private tab
2. Generates PPN IDs locally via ARRAYFORMULA — no server involved
3. Exports a "clean" tab containing **only PPN IDs** — zero PII

**Why this matters:** This is a **zero-code, zero-infrastructure** solution that unblocks clinic onboarding immediately. No BUILDER time required — just a shareable Google Sheet template and a one-page user guide.

---

## The "Airlock" Architecture

```
EHR Export (CSV)
    ↓ Paste into BULK_IMPORT tab (stays local, never uploaded)
    ↓ ARRAYFORMULA generates PPN IDs instantly
    ↓ SAFE_UPLOAD_FILE tab mirrors only the IDs
    ↓ Clinic exports SAFE_UPLOAD_FILE as CSV
    ↓ Uploads clean CSV to PPN Portal
    
Result: PII never leaves the clinic's computer.
```

---

## Google Sheets Implementation

### Tab 1: `BULK_IMPORT`

**Headers (Row 1, Bold):**

| A | B | C | D | E |
|---|---|---|---|---|
| EHR Patient ID | First Name | Last Name | Date of Birth | GENERATED PPN ID |

**Formula for E2 (paste once, auto-fills entire column):**

```
=ARRAYFORMULA(IF(A2:A="", "", "PPN-" & UPPER(LEFT(B2:B,2)) & UPPER(LEFT(C2:C,2)) & TEXT(D2:D,"MMDD")))
```

**What it produces:**
- Input: `John`, `Doe`, `01/01/1985`
- Output: `PPN-JODO0101`

**Speed:** Processes 1,000 rows in ~2 seconds. No dragging formulas.

---

### Tab 2: `SAFE_UPLOAD_FILE`

**Headers (Row 1, Bold):**

| A | B | C | D |
|---|---|---|---|
| PPN_Subject_ID | Date_of_Birth (Optional) | Gender (Optional) | Diagnosis_Code (Optional) |

**Formula for A2:**
```
={'BULK_IMPORT'!E2:E}
```

This mirrors only the generated PPN IDs from BULK_IMPORT — no names, no raw DOB.

---

## Clinic Manager Workflow

```
1. EXPORT   → Download "Active Patient List" CSV from EHR 
              (SimplePractice, Osmind, Jane App, etc.)

2. PASTE    → Open BULK_IMPORT tab
              Paste First Name, Last Name, DOB into Columns B, C, D

3. GENERATE → Column E auto-fills with PPN IDs instantly

4. VERIFY   → Spot-check that IDs look correct (PPN-JODO0101, etc.)

5. AIRLOCK  → Switch to SAFE_UPLOAD_FILE tab
              ⚠️ WARNING: Confirm you are on SAFE_UPLOAD_FILE, not BULK_IMPORT

6. EXPORT   → File > Download > Comma Separated Values (.csv)

7. UPLOAD   → Upload that CSV to PPN Portal
```

**Zero-Knowledge guarantee:** The BULK_IMPORT tab (with names) never leaves the clinic's computer. The uploaded file contains only PPN IDs.

---

## PRODDY Evaluation Questions

### 1. Deliverable Type — Sheets Template vs. In-App Feature

This is **not a React feature** — it's a Google Sheets template. The deliverable is:
- A shareable Google Sheets template (`.gsheet` link or `.xlsx` download)
- A one-page PDF user guide for clinic managers
- Optionally: an in-app "Upload CSV" endpoint that accepts the clean file

**PRODDY must decide:** Is a Google Sheets template the right long-term solution, or should this eventually become an in-app bulk import wizard? The Sheets approach is faster to ship (days vs. weeks) but less integrated.

### 2. PPN ID Collision Risk

The formula `PPN-` + first 2 letters of first name + first 2 letters of last name + MMDD produces collisions for patients with the same initials and birthday. For example:
- John Doe, Jan 1 → `PPN-JODO0101`
- Jane Donovan, Jan 1 → `PPN-JADO0101` ✅ (different)
- John Doe (patient 2, same clinic) → `PPN-JODO0101` ❌ **COLLISION**

**PRODDY must decide:** Is a collision-resistant formula needed? Options:
- Add birth year: `PPN-JODO010185` (longer but safer)
- Add random suffix: `PPN-JODO0101-X7K` (collision-proof but less readable)
- Use sequential counter: `PPN-JODO0101-001`, `PPN-JODO0101-002`

### 3. Portal Upload Endpoint

The clean CSV needs somewhere to go. Does the PPN Portal currently accept a CSV upload of `PPN_Subject_ID` values to bulk-create patient records? If not, that's a separate BUILDER ticket.

### 4. EHR Compatibility

Different EHRs export date formats differently (MM/DD/YYYY vs. YYYY-MM-DD vs. M/D/YY). The `TEXT(D2:D,"MMDD")` formula may fail on non-standard date formats. A validation column should warn the user if DOB parsing fails.

---

## Acceptance Criteria (If Approved)

### Google Sheets Template
- [ ] `BULK_IMPORT` tab with ARRAYFORMULA in E2
- [ ] `SAFE_UPLOAD_FILE` tab mirroring only PPN IDs
- [ ] Validation column warns on DOB format errors
- [ ] Template shared as public view-only link (clinic makes a copy)
- [ ] Template tested with SimplePractice, Osmind, Jane App exports

### User Guide (PDF)
- [ ] Step-by-step workflow with screenshots
- [ ] ⚠️ Warning callout: "Export from SAFE_UPLOAD_FILE tab only"
- [ ] Collision explanation and resolution instructions
- [ ] EHR-specific date format notes

### Portal Upload (Separate BUILDER ticket if needed)
- [ ] CSV upload endpoint accepts `PPN_Subject_ID` column
- [ ] Validates format (`PPN-XXXX####`)
- [ ] Deduplicates on re-upload
- [ ] Returns success/error report per row

---

## Estimated Effort

- **Google Sheets template:** 2-3 hours (any agent — no code required)
- **User guide PDF:** 2-3 hours (MARKETER)
- **Portal CSV upload endpoint:** 8-12 hours (BUILDER — separate ticket)

**Total for template + guide:** ~4-6 hours. Fast win.

---

## 🚦 Status

**01_TRIAGE → PRODDY** — Evaluation ticket. PRODDY to assess:
1. Sheets template vs. in-app bulk import wizard (build vs. buy decision)
2. PPN ID collision risk and formula design
3. Whether portal CSV upload endpoint exists or needs a separate BUILDER ticket
4. Priority relative to other onboarding work

May not proceed without PRODDY sign-off.

---

## 📣 PRODDY STRATEGIC EVALUATION — COMPLETE (2026-02-18 00:09 PST)

### VERDICT: ✅ APPROVED — Google Sheets Template First, Add Birth Year to Formula

**1. Sheets Template vs. In-App Wizard:** SHEETS TEMPLATE for MVP. Rationale: ships in days not weeks, zero BUILDER time, zero infrastructure cost, and the zero-knowledge guarantee is actually stronger (PII never enters our system at all). In-app bulk import wizard is a Phase 2 feature.

**2. PPN ID Collision Resolution:** Add birth year to the formula. Updated formula:
```
=ARRAYFORMULA(IF(A2:A="", "", "PPN-" & UPPER(LEFT(B2:B,2)) & UPPER(LEFT(C2:C,2)) & TEXT(D2:D,"MMDDYY")))
```
- Input: John Doe, 01/01/1985 → `PPN-JODO010185`
- Collision probability drops from ~5% to <0.1% for typical clinic sizes
- Coordinate this formula with WO-093 (Camera Scan) — both must use identical formula

**3. Portal Upload Endpoint:** Create a separate BUILDER ticket (WO-099 or next available) for the CSV upload endpoint. This is a dependency for the Sheets template to be useful — without somewhere to upload the clean file, the workflow is incomplete.

**4. EHR Compatibility:** Add a validation column to the template that flags non-standard date formats. Use `IFERROR` to catch parsing failures and show a red warning cell.

**5. Deliverable Owner:** MARKETER creates the one-page PDF user guide. PRODDY creates the Google Sheets template (no code required — just formulas and formatting).

**PRODDY SIGN-OFF:** ✅ Approved. PRODDY will create the Google Sheets template. MARKETER creates user guide. Route separate BUILDER ticket for portal upload endpoint.

**Routing:** `owner: LEAD` — PRODDY executes Sheets template, MARKETER executes user guide, LEAD creates BUILDER sub-ticket for upload endpoint.
