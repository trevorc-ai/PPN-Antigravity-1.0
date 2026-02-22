---
id: WO-309
title: "Wellness Journey Output Engine — Phase 1: Safety & Risk Outputs"
status: 03_BUILD
owner: BUILDER
created: 2026-02-21
created_by: CUE
failure_count: 0
priority: P0_CRITICAL
tags: [wellness-journey, risk-engine, contraindication, adverse-events, patient-safety, regulatory]
depends_on: []
user_prompt: |
  "The data entered during each phase must translate into actionable, easily readable outputs.
  Phase 1 Intake & Preparation needs: Automated Risk & Eligibility Reports that flag severe
  contraindications (lithium use, cardiovascular instability, history of psychosis) — and
  Adverse Event Reports that auto-generate standardized incident reports for regulatory compliance."
---

# WO-309: Wellness Journey Output Engine — Phase 1: Safety & Risk

## WHY THIS IS P0

A practitioner who misses a contraindication faces: patient harm, loss of licensure, regulatory action,
and criminal liability. This is the highest-severity gap in the current system. The forms capture the
data but nothing currently processes it into automated safety decisions.

---

## GAP ANALYSIS — Current State vs. Required

### What Exists
- `useRiskDetection` hook — computes overallRiskLevel from vitals
- `RiskIndicators` component — displays flags from useRiskDetection
- `log_safety_events` table — stores adverse event records
- `SafetyAndAdverseEventForm` — clinician manually records safety events

### What's Missing (This WO Builds)
1. **ContraindicationEngine** — rule-based service that reads intake form data and flags absolute/relative contraindications BEFORE session begins
2. **RiskEligibilityReport** — visual output panel (and PDF) showing the contraindication verdict
3. **AEAutoReport** — when `SafetyAndAdverseEventForm` is saved, auto-generates an exportable standardized incident report

---

## DELIVERABLE 1: ContraindicationEngine (`src/services/contraindicationEngine.ts`)

### Contraindication Rule Set

#### Absolute Contraindications (BLOCK — do not proceed)
| Flag | Data Source | Trigger Condition |
|---|---|---|
| Active lithium use | `baseline_observations.medications` | contains 'lithium' (case-insensitive) |
| MAOI use < 14 days | `baseline_observations.medications` | contains 'phenelzine', 'tranylcypromine', 'selegiline', 'isocarboxazid' |
| Personal history of psychosis | `baseline_observations.psych_history` | contains 'schizophrenia', 'schizoaffective', 'psychosis', 'psychotic episode' |
| Family history of psychosis (first-degree) | `baseline_observations.family_history` | contains 'schizophrenia' + 'parent' or 'sibling' |
| Active suicidal ideation with plan | `structured_safety_check.cssrs_score` | cssrs ≥ 4 (intent + plan) |
| Cardiovascular instability (MDMA only) | `session_vitals.bp_systolic` | > 160 at last reading |
| Pregnancy | `baseline_observations.pregnancy_status` | = true |
| Age < 21 (Oregon regulation) | `baseline_observations.age` | < 21 |

#### Relative Contraindications (WARN — proceed with documented justification)
| Flag | Trigger |
|---|---|
| Borderline personality disorder | psych_history contains 'BPD' |
| Active substance use disorder (other than target) | substanceUseHistory |
| SSRI within 2 weeks of MDMA session | medications contains SSRI + session substance = MDMA |
| PHQ-9 > 24 (extreme severity) | baseline PHQ-9 |
| GAD-7 > 21 (extreme severity) | baseline GAD-7 |
| PCL-5 > 60 (extreme PTSD) | baseline PCL-5 |
| BMI < 17.5 (anorexia risk) | demographics.weightKg + height |
| Uncontrolled hypertension (SBP > 150) | vitals |

### Output Shape
```typescript
export interface ContraindicationResult {
  verdict: 'CLEAR' | 'PROCEED_WITH_CAUTION' | 'DO_NOT_PROCEED';
  absoluteFlags: ContraindicationFlag[];
  relativeFlags: ContraindicationFlag[];
  generatedAt: string;   // ISO timestamp
  patientId: string;
  sessionSubstance: string;
}

export interface ContraindicationFlag {
  id: string;
  severity: 'ABSOLUTE' | 'RELATIVE';
  category: 'MEDICATION' | 'PSYCHIATRIC' | 'CARDIOVASCULAR' | 'DEMOGRAPHIC' | 'ASSESSMENT';
  headline: string;   // "Active lithium detected — MDMA administration contraindicated"
  detail: string;     // Clinical rationale
  source: string;     // "Baseline Observations — Medications"
  regulatoryBasis: string; // "OHA Psilocybin Rule 333-333-4020(3)(c)" or "MAPS Protocol S2 §8.3"
}
```

### Privacy Rules
- `contraindicationEngine.ts` receives ONLY the normalized intake data object — never raw patient text
- No PHI written to any output file — use `patientId` (Subject_ID) only
- Flags reference the **category** of concern, not the specific medication name in any exported document

---

## DELIVERABLE 2: RiskEligibilityReport Component

**File:** `src/components/wellness-journey/RiskEligibilityReport.tsx`

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [VERDICT BANNER]                                            │
│ ● DO NOT PROCEED — 2 Absolute Contraindications Detected   │
│                                                             │
│ ╔══════════════════════════════════════════════════════╗   │
│ ║ [ABSOLUTE — MEDICATION]                              ║   │
│ ║ Active lithium detected                              ║   │
│ ║ Current lithium use significantly raises the risk of ║   │
│ ║ serotonin syndrome in combination with psilocybin.   ║   │
│ ║ Regulatory basis: OHA Rule 333-333-4020              ║   │
│ ╚══════════════════════════════════════════════════════╝   │
│                                                             │
│ ╔══════════════════════════════════════════════════════╗   │
│ ║ [RELATIVE — ASSESSMENT]                              ║   │
│ ║ Extreme PHQ-9 severity (score: 24)                   ║   │
│ ║ Requires documented clinical justification to proceed║   │
│ ╚══════════════════════════════════════════════════════╝   │
│                                                             │
│ [EXPORT PDF] [PROVIDER OVERRIDE — Documented Justification]│
└─────────────────────────────────────────────────────────────┘
```

### Behavior
- Renders in Phase 1 immediately after ALL 4 preparation forms are complete
- DO_NOT_PROCEED verdict: red `[DO NOT PROCEED]` banner, Phase 2 lock button disabled with tooltip
- PROCEED_WITH_CAUTION: amber banner, Phase 2 accessible but provider must check a box: "I acknowledge the flagged relative contraindications and document clinical justification to proceed"
- CLEAR: emerald banner. Phase 2 unlock prompt appears.
- Override is logged to `log_clinical_records.contraindication_override_reason` (additive column)

---

## DELIVERABLE 3: AEAutoReport

**File:** `src/services/aeReportGenerator.ts`
**Trigger:** `SafetyAndAdverseEventForm` → `onComplete` → automatically calls `generateAEReport()`

### Report Format (Exportable PDF)
```
ADVERSE EVENT INCIDENT REPORT
PPN Research Portal — Confidential Clinical Document

Patient ID:        [SUBJECT_ID]
Site ID:           [SITE_ID]
Session Date:      [DATE]
Substance:         [SUBSTANCE] [DOSE]
Report Generated:  [TIMESTAMP]
Report Author:     [CLINICIAN_ID]

INCIDENT DESCRIPTION
Category:          [Behavioral / Medical / Psychiatric / Procedural]
Severity Grade:    [Grade 1 / 2 / 3 / 4] (CTCAE v5.0)
Onset Time:        [Time post-dose]
Duration:          [minutes/hours]
Outcome:           [Resolved / Ongoing / Referred]

INTERVENTION LOG
[Time] [Intervention taken]
[Time] [Pharmacological rescue: drug, dose, route]

RESOLUTION
[Outcome description]

REGULATORY NOTIFICATION REQUIRED:  [YES — Grade 3+] / [NO]

Provider signature: _______________    Date: ___________
```

- PDF export via `html2canvas` + `jspdf` (same stack as `reportGenerator.ts`)
- AE report stored reference in `log_safety_events.report_pdf_url` (additive column)
- Grade 3+ events: UI shows `[ACTION REQUIRED] Submit to oversight board` with contact link

---

## ACCEPTANCE CRITERIA

- [ ] ContraindicationEngine correctly flags all 8 absolute contraindications with mock data
- [ ] ContraindicationEngine correctly flags all 9 relative contraindications with mock data
- [ ] DO_NOT_PROCEED verdict blocks Phase 2 unlock button with descriptive tooltip
- [ ] PROCEED_WITH_CAUTION requires provider checkbox before Phase 2 accessible
- [ ] RiskEligibilityReport renders with [TEXT BADGE] severity labels (not color-only)
- [ ] RiskEligibilityReport PDF export produces a readable, properly formatted document
- [ ] AEAutoReport triggers on `SafetyAndAdverseEventForm` save completion
- [ ] AEAutoReport includes all required fields per CTCAE v5.0 Grade definitions
- [ ] No PHI in any exported file — patient referenced by Subject_ID only
- [ ] All fonts ≥ 12px in the UI and PDF output
- [ ] INSPECTOR: Zero color-only meaning — all flags use [TEXT BADGE] + icon

---

## ROUTING

→ DESIGNER: Review the RiskEligibilityReport layout, verdict banner colors, and badge conventions
→ BUILDER: Implement ContraindicationEngine + RiskEligibilityReport + AEAutoReport
→ SOOP: Add `contraindication_override_reason TEXT` and `report_pdf_url TEXT` columns (additive migration)
