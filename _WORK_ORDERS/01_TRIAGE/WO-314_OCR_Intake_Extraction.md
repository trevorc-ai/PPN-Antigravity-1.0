---
status: "01_TRIAGE"
owner: "PRODDY"
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
