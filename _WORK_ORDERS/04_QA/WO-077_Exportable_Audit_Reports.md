---
id: WO-077
status: 03_BUILD
priority: P1 (Critical)
category: Feature
owner: INSPECTOR
failure_count: 0
---

# Week 1 Value: Exportable Audit Reports

## User Request
Build one-click export of all patient data for compliance, insurance, and audit purposes (liability protection requirement).

## Strategic Context
> "Documentation must be 'audit-ready' from day one"
> "Liability anxiety is high - practitioners need defensible documentation"

**Impact:** Reduces audit preparation time from hours to seconds

## LEAD ARCHITECTURE

### Technical Strategy
Create PDF report generator that compiles all patient forms, timestamps, signatures, and completeness scores into audit-ready documents.

### Files to Touch
- `src/services/reportGenerator.ts` (NEW)
- `src/templates/auditReportTemplate.ts` (NEW)
- `src/templates/insuranceReportTemplate.ts` (NEW)
- `src/templates/researchReportTemplate.ts` (NEW)
- `src/components/export/ExportButton.tsx` (NEW)
- `src/utils/pdfGenerator.ts` (NEW)
- `src/utils/deidentification.ts` (NEW)

### Constraints
- Must export in < 5 seconds
- Must include all forms with timestamps
- Must be HIPAA-compliant (Safe Harbor for research reports)
- Must support 3 report types (Audit, Insurance, Research)

## Proposed Changes

### Report Type 1: Audit Report (Compliance)

**Purpose:** Board audits, malpractice defense, regulatory compliance

**Contents:**
```
PPN RESEARCH PORTAL - AUDIT REPORT
Generated: February 17, 2026 at 10:30 AM

Patient ID: PT-XLMR3WZP
Treatment Period: Jan 1, 2026 - Feb 17, 2026
Practitioner: [Redacted]

BASELINE ASSESSMENT (Jan 1, 2026):
✅ Mental Health Screening - Complete
   - PHQ-9: 21 (Severe depression)
   - GAD-7: 12 (Moderate anxiety)
   - ACE: 4 (Moderate adversity)
   - PCL-5: 85 (Significant PTSD)
   - Timestamp: Jan 1, 2026 at 9:30 AM
   - Signature: [Digital signature]

✅ Set & Setting - Complete
   - Treatment Expectancy: 50/100
   - Timestamp: Jan 1, 2026 at 9:45 AM

✅ Baseline Physiology - Complete
   - HRV: 50.00ms (normal)
   - BP: 120/80 mmHg (normal)
   - Timestamp: Jan 1, 2026 at 10:00 AM

✅ Baseline Observations - Complete
   - Motivation: High
   - Support: Strong
   - Timestamp: Jan 1, 2026 at 10:15 AM

✅ Informed Consent - Complete
   - Consent Type: Full informed consent
   - Timestamp: Jan 1, 2026 at 10:30 AM
   - Signature: [Digital signature]

DOSING SESSION (Jan 15, 2026):
✅ Dosing Protocol - Psilocybin 25mg oral
✅ Vitals Monitoring - 16 readings, all normal
✅ Session Observations - Complete
✅ MEQ-30 Questionnaire - Score: 85 (mystical experience)
✅ Post-Session Assessment - Complete

INTEGRATION SESSIONS (Jan 22 - Feb 17, 2026):
✅ Session 1-4 documented
✅ Behavioral changes logged (8 entries)
✅ Daily pulse checks (28/35 days)

SAFETY EVENTS:
✅ No adverse events reported
✅ No safety concerns identified

BENCHMARK READINESS: 100%
All 5 requirements met. Episode is benchmark-ready.

[Practitioner signature line]
[Date]
```

---

### Report Type 2: Insurance Report (Billing)

**Purpose:** Insurance reimbursement, medical necessity documentation

**Contents:**
```
TREATMENT SUMMARY FOR INSURANCE
Patient ID: PT-XLMR3WZP
Date of Service: January 15, 2026

DIAGNOSIS CODES:
- F32.2 (Major Depressive Disorder, Severe)
- F43.10 (Post-Traumatic Stress Disorder)

TREATMENT PROVIDED:
- 90791: Psychiatric Diagnostic Evaluation (Jan 1, 2026)
- 90834: Psychotherapy, 45 minutes (Jan 15, 2026)
- 90834: Psychotherapy, 45 minutes x4 (Jan 22 - Feb 17, 2026)

BASELINE ASSESSMENT:
- PHQ-9: 21 (Severe depression)
- GAD-7: 12 (Moderate anxiety)
- PCL-5: 85 (Significant PTSD)

TREATMENT PROTOCOL:
- Psilocybin-assisted therapy (25mg oral)
- 4-hour monitored session
- 4 integration therapy sessions

OUTCOMES (6 weeks):
- PHQ-9: 21 → 12 (43% improvement)
- GAD-7: 12 → 7 (42% improvement)
- PCL-5: 85 → 45 (47% improvement)
- Functional improvement documented

MEDICAL NECESSITY:
Patient met criteria for treatment-resistant depression.
Standard treatments (SSRIs, CBT) previously unsuccessful.
Psychedelic-assisted therapy indicated per current evidence.

[Practitioner signature]
[License number]
```

---

### Report Type 3: Research Report (De-identified)

**Purpose:** Network benchmarking, research contributions, publications

**Contents:**
```
DE-IDENTIFIED RESEARCH DATA EXPORT
Subject ID: [SHA-256 hash]
Export Date: February 17, 2026

DEMOGRAPHICS:
- Age Group: 35-45
- Gender: [Redacted]
- Geographic Region: [Redacted]

BASELINE METRICS:
- PHQ-9: 21
- GAD-7: 12
- ACE: 4
- PCL-5: 85
- HRV: 50.00ms
- BP: 120/80 mmHg

TREATMENT PROTOCOL:
- Substance: Psilocybin
- Dose: 25mg
- Route: Oral
- Duration: 4 hours
- Setting: Clinical
- Support: Practitioner-guided

OUTCOMES (6 weeks):
- PHQ-9: 12 (↓ 43%)
- GAD-7: 7 (↓ 42%)
- PCL-5: 45 (↓ 47%)
- MEQ-30: 85 (mystical experience)

SAFETY:
- Adverse events: 0
- Safety concerns: 0

[All PHI removed per HIPAA Safe Harbor]
[Dates: Year only]
[Ages: Grouped (35-45)]
[Small-cell suppression: N/A (single subject)]
```

---

## Verification Plan

### Automated Tests
```bash
npm run test -- reportGenerator.test.ts
npm run test -- deidentification.test.ts
npm run test -- pdfGenerator.test.ts
```

### Manual Verification
1. **Audit Report:** Verify includes all forms with timestamps
2. **Insurance Report:** Verify includes CPT codes and outcomes
3. **Research Report:** Verify fully de-identified (no PHI)
4. **PDF Format:** Verify professional formatting
5. **Export Speed:** Verify completes in < 5 seconds
6. **Signatures:** Verify digital signatures included
7. **Completeness:** Verify shows benchmark readiness score

### Accessibility
- PDF is screen reader compatible
- High contrast mode
- Searchable text (not images)

---

## Dependencies
- All patient form data
- CPT code mappings
- De-identification utilities
- PDF generation library

## Estimated Effort
**8-12 hours** (2-3 days)

## Success Criteria
- ✅ One-click export to PDF
- ✅ Audit report includes all forms with timestamps
- ✅ Insurance report includes CPT codes and outcomes
- ✅ Research report is fully de-identified (HIPAA Safe Harbor)
- ✅ Exports complete in < 5 seconds
- ✅ Professional formatting with headers/footers
- ✅ Digital signatures included (where applicable)
- ✅ Benchmark readiness score displayed

---

**Status:** Ready for LEAD assignment
