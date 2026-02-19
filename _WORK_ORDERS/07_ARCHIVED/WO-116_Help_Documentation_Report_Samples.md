---
work_order_id: WO-116
title: Help Documentation & Report Samples
type: CONTENT_CREATION
category: Frontend / Documentation
priority: P2 (High)
status: 03_BUILD
created: 2026-02-18T10:41:00-08:00
requested_by: USER
owner: BUILDER
failure_count: 0
triage_status: APPROVED
---

# Work Order: Help Documentation & Report Samples

## 🚨 USER REQUEST
"We will want to see samples of each [report] and put images of each in the help section... when I clicked on the button the wheel is just spinning, but I assume that's because the reports haven't been built yet, correct?"

## 🎯 THE GOAL
1.  **Generate Sample Reports:** Create realistic, visual PDF mockups for:
    *   **Audit Report:** Full compliance log + Safety Timeline.
    *   **Insurance Report:** Billing codes (ICD-10/CPT) + Outcomes.
    *   **Research Export:** De-identified data + CSV format.
2.  **Populate Help Section:** Add a section in `/help` explaining these exports with the sample images.
3.  **Fix Button State:** Ensure the "Export" button doesn't spin indefinitely; connect it to the actual report generation logic (even if it downloads a mock file for now).

## 🔍 CONTEXT
The `ExportReportButton` currently has a simulated delay but might be erroring out or stuck in loading state. We need to make it actually deliver a file (Mock PDF/CSV) so the user sees the value loop close.

---

## 🛠 IMPLEMENTATION PLAN

### 1. Fix `ExportReportButton.tsx` Logic
- **File:** `src/components/export/ExportReportButton.tsx`
- **Current Issue:** Likely stuck in `isGenerating` state without resolving.
- **Fix:** Connect to `src/services/reportGenerator.ts`. Ensure it handles the promise resolution and actually triggers a file download (using `jspdf` or a mock blob).

### 2. Create Sample Assets
- **Action:** Generate (or mock) 3 high-quality images representing the reports:
    - `audit_report_sample.jpg`
    - `insurance_report_sample.jpg`
    - `research_export_sample.jpg`
- **Location:** Store in `src/assets/images/help/` (create if needed).

### 3. Update Help & FAQ Page
- **File:** `src/pages/HelpFAQ.tsx`
- **Action:** Add a "Data & Reporting" section.
- **Content:**
    - "How to generate compliance reports?"
    - "What is included in the Insurance Billing export?"
    - Display the sample images with "View Sample" lightboxes.

---

## 🧪 RELEASE CRITERIA
1.  **Button Works:** Clicking "Export" -> "Audit Report" downloads a file (PDF) and stops spinning.
2.  **Help Content:** The `/help` page has a new section for Reports.
3.  **Visuals:** Sample images are visible in the Help section.

## 📝 NOTES
- Use `jspdf` for generating a basic real PDF on the fly if possible, otherwise serve a static generated PDF from assets.
- **Priority:** Fix the spinning button first so the user's test succeeds.

## BUILDER IMPLEMENTATION NOTES
- Implemented fix/feature as requested.
- Verified in codebase.
