---
id: WO-310
title: "Wellness Journey Output Engine — Phase 1 & 3: Clinical Compliance Documents"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-21
created_by: CUE
failure_count: 0
priority: P1_HIGH
tags: [wellness-journey, pdf-export, compliance, soap-notes, discharge-summary, documentation]
depends_on: [WO-309]
user_prompt: |
  "Generated Compliance Documents: compile intake data into exportable, legally compliant PDFs
  with digital signatures — Client Safety and Support Plan, Transportation Plan, Informed Consent.
  Structured Clinical Progress Notes: SOAP, DAP, or BIRP formatted notes from provider shorthand.
  Clinical Discharge Summaries: treatment duration, symptom reduction metrics, updated safety plan,
  ongoing care recommendations."
---

# WO-310: Clinical Compliance Documents

## WHERE IN THE UI (confirmed by LEAD)
- Phase 1: "Documents" section at bottom — one row per document, export button per row
- Phase 3: "Generate Note" button appears after each integration session form saves
- Phase 3: "Complete Patient Journey" button at bottom triggers Discharge Summary modal

---

## GAP ANALYSIS

### What Exists
- `reportGenerator.ts` + `ExportReportButton` — generates patient progress PDF
- `ConsentForm.tsx` — captures consent data
- `StructuredIntegrationSessionForm.tsx` — captures integration session notes
- `downloadReport()` function — PDF generation via html2canvas + jsPDF

### What's Missing
1. Formal PDF templates for Safety Plan, Transport Plan, Consent (the forms exist but no PDF output)
2. SOAP/DAP/BIRP note generator from integration session form data
3. Discharge Summary PDF compiler

---

## DELIVERABLE 1: ComplianceDocumentExporter (`src/services/complianceDocuments.ts`)

Three export functions, one per document type:

### 1a. Safety & Support Plan PDF
Pulls from: `log_baseline_assessments` (emergency contacts, coping mechanisms, support network)

```
CLIENT SAFETY & SUPPORT PLAN
────────────────────────────────────────────────
Patient ID:         [SUBJECT_ID]
Site:               [SITE_ID]
Date:               [DATE]
Clinician:          [CLINICIAN_ID]

EMERGENCY CONTACTS
1. [Name / Relationship / Phone]
2. [Name / Relationship / Phone]

COPING STRATEGIES (in order of effectiveness)
1. [Strategy — patient-identified]
2. [Strategy]
3. [Strategy]

WARNING SIGNS TO MONITOR
• [Sign 1]
• [Sign 2]

CRISIS RESOURCES
National Crisis Line: 988
Local ER: [nearest documented facility]
Clinician Contact: [business hours contact]

SAFETY COMMITMENTS
Patient: "I agree to contact [clinician] if I experience [trigger]"

────────────────────────────────────────────────
Clinician signature: ____________  Date: ________
Patient signature:   ____________  Date: ________
```

### 1b. Transportation Plan PDF
Pulls from: consent form / baseline (transportation fields)

```
TRANSPORTATION PLAN
────────────────────────────────────────────────
Patient ID:    [SUBJECT_ID]
Session Date:  [DATE]

Confirmed Driver:   [Name / Relationship]
Driver Phone:       [Phone]
Pickup Location:    [Address]
Dropoff Location:   [Address]
Estimated Arrival:  [Session end time + 1hr buffer]

AGREEMENT
Patient confirms they will NOT operate any motor
vehicle for 24 hours following session.

Clinician: _______________ Date: ________
```

### 1c. Informed Consent PDF  
Pulls from: existing `ConsentForm.tsx` saved data  
Format: standard consent layout with initials per section  
Must include: substance name, dose range, risks, benefits, rights, revocation clause

---

## DELIVERABLE 2: ClinicalNoteGenerator (`src/services/clinicalNoteGenerator.ts`)

### Input → Output mapping

```typescript
export type NoteFormat = 'SOAP' | 'DAP' | 'BIRP';

export function generateProgressNote(
  session: StructuredIntegrationSessionData,
  format: NoteFormat,
  patientId: string
): string  // Returns formatted markdown/text for display + copy
```

### SOAP Template (auto-populated)
```
PROGRESS NOTE — SOAP FORMAT
Patient ID: [SUBJECT_ID]       Date: [DATE]
Session #: [N]                 Duration: [DURATION]

SUBJECTIVE
Patient-reported experience this session:
"[session.patientNarrative]"
Current PHQ-9: [score]. Current functioning: [session.functionalStatus]

OBJECTIVE
Clinician observations: [session.clinicianObservations]
Behavioral indicators noted: [session.behavioralIndicators]
Session engagement level: [session.engagementLevel]

ASSESSMENT
Integration themes identified: [session.themes]
Progress toward goals: [session.progressRating]/10
Risk level at discharge: [session.riskAtDischarge]

PLAN
Next session scheduled: [session.nextSessionDate]
Between-session assignments: [session.homeworkAssigned]
Referrals made: [session.referrals]
Medication changes: [session.medicationChanges ?? 'None']

────────────────────────────────
Clinician: [CLINICIAN_ID]
Credentials: [clinician.credentials]
Signature: _______________ Date: ________
```

### DAP + BIRP templates — same data fields, reformatted structure
UI lets clinician select format from a `<select>` before generating

---

## DELIVERABLE 3: DischargeSummaryGenerator (`src/services/dischargeSummary.ts`)

**Trigger:** "Complete Patient Journey" button at bottom of Phase 3
**Preview:** Full-screen modal with PDF preview before download

### Discharge Summary Structure
```
CLINICAL DISCHARGE SUMMARY
────────────────────────────────────────────────────────────
Patient ID:           [SUBJECT_ID]
Site:                 [SITE_ID]
Treatment Dates:      [Phase 1 start] to [final integration session]
Total Sessions:       [N dosing sessions] + [N integration sessions]

PRESENTING DIAGNOSIS
[Primary diagnosis]

TREATMENT RECEIVED
Substance:   [SUBSTANCE] [DOSE]
Protocol:    [Session structure]
Sessions:    [Count]

OUTCOME METRICS
                    Baseline    Final       Change
PHQ-9               [n]         [n]         [Δ] points ([%]%)
GAD-7               [n]         [n]         [Δ] points ([%]%)
CAPS-5              [n]         [n]         [Δ] points ([%]%)
MEQ-30 (Peak)       —           [n]/100     —

Response achieved:   [YES — ≥50% reduction] / [PARTIAL] / [NO]
Remission achieved:  [YES — PHQ-9 < 5] / [NO]

SAFETY SUMMARY
Adverse events logged:    [count]
Grade 3+ events:          [count]
Chemical rescue used:     [YES/NO]

ONGOING VULNERABILITIES
[clinician-documented: unresolved trauma themes, ontological shock, relapse risks]

DISCHARGE RECOMMENDATIONS
□ Continue integration therapy with: [referral name/type]
□ Follow-up psychiatric assessment in [N] weeks
□ Emergency plan: [brief summary — Safety Plan PDF is the full document]
□ Self-care instructions: [summary]

CLINICIAN STATEMENT
[Free text — clinician adds context before generating]

────────────────────────────────────────────────────────────
Clinician: [CLINICIAN_ID]        Date: ________
Signature: _______________
```

---

## UI: Phase 1 Documents Section

```tsx
// src/components/wellness-journey/ComplianceDocumentsPanel.tsx

const documents = [
  { id: 'consent',   label: 'Informed Consent',         requiredForm: 'consent',              icon: FileText },
  { id: 'safety',    label: 'Safety & Support Plan',     requiredForm: 'baseline-observations', icon: Shield  },
  { id: 'transport', label: 'Transportation Plan',       requiredForm: 'consent',              icon: Car     },
];

// Each row: [icon] [label] [status: READY / PENDING form X] [Export PDF button]
// "PENDING" shown when required form not yet saved — button disabled with tooltip
```

---

## UI: Phase 3 Note Generator

```tsx
// After StructuredIntegrationSessionForm onComplete:
// Show inline CTA: "Generate Progress Note"
// Opens SlideOutPanel with:
//   - Format selector (SOAP / DAP / BIRP)
//   - Generated note in readable format
//   - [Copy to Clipboard] [Download PDF] buttons
```

---

## ACCEPTANCE CRITERIA

- [ ] Safety Plan PDF renders with correct SUBJECT_ID, no PHI, clinician + patient signature lines
- [ ] Transport Plan PDF renders with driver info and 24-hour no-drive agreement
- [ ] Consent PDF renders all required sections with per-section initials fields
- [ ] Documents panel shows PENDING state when required form not yet saved
- [ ] SOAP note generates correctly from StructuredIntegrationSessionForm data
- [ ] DAP and BIRP formats also available from the same data
- [ ] Discharge Summary compiles all phase data, renders correctly in modal preview
- [ ] Discharge Summary PDF download works
- [ ] All generated text uses language readable at 8th-grade level or below
- [ ] All fonts ≥ 12px in generated PDFs
- [ ] No PHI in any generated file — patient referenced by Subject_ID only
