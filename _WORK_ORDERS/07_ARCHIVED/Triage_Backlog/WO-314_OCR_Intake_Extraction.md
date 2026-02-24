---
status: "01_TRIAGE"
owner: "LEAD"
failure_count: 0
---
# WO-314: OCR Intake Extraction Pipeline

## User Prompt
"Also, I had done some research about using OCR to allow practitioners to scan their handwritten forms and notes. This was a feature that was actually requested by one of the partners/advisory board members. How would we go about implementing this?"

## LEAD ARCHITECTURE
The user requested we spec out the OCR extraction feature they researched for converting handwritten notes into structured data.

**Objective**: 
Implement an OCR/Computer Vision pipeline that enables practitioners to scan handwritten intake documents, intelligently parse the raw text, and formally map it to PPN's structured data model.

**Strategic & Technical Approach**:
1. **Frontend Capture**: Add an "Upload/Scan Document" entry point in the Wellness Journey (Phase 1) and global Quick Actions.
2. **Backend Edge Function**: Formulate a secure, isolated Supabase Edge Function endpoint responsible for fielding the image payload.
3. **Deterministic Vision Extraction**: Leverage a state-of-the-art vision model (e.g., `gpt-4-vision-preview` or Claude 3.5 Sonnet) invoked from the Edge Function. The prompt must strictly enforce a JSON Schema (utilizing structured outputs or Zod) to categorize handwritten answers directly into existing boolean, numeric, or enum database columns rather than dumping free-text.
4. **Intelligent Review UI**: Supply the structured JSON to the React frontend. Present a "Review & Approve" interface showing the original document adjacent to the extracted clinical fields. The practitioner must explicitly hit "Confirm & Save".
5. **Privacy / Zero Data Retention Protocol**: Institute a strict data handling policy. If the image contains PHI, it should either be processed ephemerally in memory and immediately discarded, or deposited in a highly-secured `raw_scans` bucket shielded by maximum RLS before parsing, then purged.

## Routing
Routing to PRODDY to assess business rules, product requirements, and priority placement before BUILDER implementation.

## PRODDY - Product Requirements & Strategy (PRD)
**1. Strategic Alignment & Value Proposition**
This feature directly targets practitioners burdened by legacy intake workflows. It bridges the gap between paper-based documentation and PPN's structured environment, turning data entry from a dreaded post-session chore into an automated, seamless flow. This dramatically reduces practitioner friction, meaning faster activation and higher retention rates.

**2. Core Use Cases (V1 - MVP)**
- **Intake Scan:** Practitioner uploads a photo/scan of a multi-page handwritten intake form (demographics, history, simple questionnaires).
- **Session Notes Scan:** Practitioner snaps a photo of rough unstructured session notes, and we extract structured vitals or follow-up tasks.

**3. Product Functionality Breakdown**
- **Trigger:** "Upload Document" via the `QuickActionsMenu` or within the Phase 1: Intake components of the Wellness Journey.
- **Accepted Files:** JPG, PNG, single/multi-page PDFs.
- **The "Review & Approve" Interface (Crucial):** Extracted data MUST be placed side-by-side with an image of the original document. We do not automatically save parsed medical data without human-in-the-loop verification. Fields with low confidence should be highlighted visually for closer inspection.

**4. Privacy & Compliance Mandates**
- Follows the Zero Data Retention Protocol defined by LEAD. 
- The user interface must clarify to the practitioner that "images are securely processed and immediately purged." Let's treat raw PHI scans as toxic waste—process it, and burn it.

**5. Success Metrics**
- **Activation:** % of clinics adopting the OCR intake button within 30 days of launch.
- **Efficiency:** Average manual edits required per scanned form.

**Handoff to LEAD:** The business case is extremely strong. Prioritize. Please review and route to BUILDER/SOOP for architecture schema and implementation.
