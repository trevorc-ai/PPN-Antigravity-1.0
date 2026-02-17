---
id: WO-076
status: 03_BUILD
priority: P0 (Blocking)
category: Feature
owner: BUILDER
failure_count: 0
---

# Week 1 Value: Auto-Generated Clinical Narratives

## User Request
Auto-generate professional clinical narratives from structured baseline data, eliminating manual chart writing (top practitioner pain point).

## Strategic Context
> "Auto-generate narrative charts from structured inputs" - Top practitioner request
> "Administrative burnout from fragmented tools is killing us"

**Impact:** Reduces documentation time by 75% for baseline assessment

## LEAD ARCHITECTURE

### Technical Strategy
Build AI-powered narrative generator that creates professional clinical notes from all Phase 1 baseline forms, with clinical interpretations and treatment recommendations.

### Files to Touch
- `src/services/narrativeGenerator.ts` (NEW)
- `src/templates/baselineNarrativeTemplate.ts` (NEW)
- `src/utils/clinicalInterpretations.ts` (NEW)
- `src/components/narrative/NarrativeViewer.tsx` (NEW)
- `src/components/narrative/NarrativeExport.tsx` (NEW)
- `src/hooks/useNarrative.ts` (NEW)

### Constraints
- Must generate within 2 seconds
- Must include all 5 Phase 1 forms
- Must interpret scores with clinical context
- Must be exportable as PDF and copy-paste text

## Proposed Changes

### Feature 1: Narrative Generation Engine

**Input:** All 5 Phase 1 forms
1. Mental Health Screening (PHQ-9, GAD-7, ACE, PCL-5)
2. Set & Setting (Treatment Expectancy)
3. Baseline Physiology (HRV, BP)
4. Baseline Observations (Motivation, Support, Experience)
5. Informed Consent

**Output:** Professional clinical narrative

---

### Example Output:

```
BASELINE ASSESSMENT NARRATIVE
Patient ID: PT-XLMR3WZP
Assessment Date: February 17, 2026
Practitioner: [Redacted]

MENTAL HEALTH SCREENING:
Patient completed baseline mental health screening. PHQ-9 score 
of 21 indicates severe depression (clinical threshold: 20). 
GAD-7 score of 12 indicates moderate anxiety (clinical threshold: 10). 
ACE score of 4 suggests moderate childhood adversity. PCL-5 score 
of 85 indicates significant PTSD symptoms (clinical threshold: 33).

SET & SETTING:
Treatment expectancy score of 50/100 indicates moderate confidence 
in treatment success. Patient demonstrates realistic expectations 
for therapeutic outcomes.

BASELINE PHYSIOLOGY:
Resting HRV: 50.00ms (normal range for age 35-45: 40-60ms). 
Blood pressure: 120/80 mmHg (normal). Cardiovascular health 
appears stable for psychedelic-assisted therapy.

CLINICAL OBSERVATIONS:
Patient presents as motivated and engaged. Strong support system 
identified. No significant contraindications noted.

INFORMED CONSENT:
Informed consent obtained and documented. Patient verbalized 
understanding of treatment risks, benefits, and alternatives.

CLINICAL IMPRESSION:
Patient is appropriate candidate for psychedelic-assisted therapy. 
Baseline depression and PTSD symptoms are significant. Recommend 
trauma-informed approach with close monitoring during dosing session.

TREATMENT PLAN:
Proceed with psilocybin-assisted therapy protocol. Schedule dosing 
session within 2 weeks. Ensure trauma-informed support available 
during session. Plan for 8-12 integration sessions over 6 months.
```

---

### Feature 2: Clinical Interpretations

**Score Interpretation Logic:**

**PHQ-9 (Depression):**
- 0-4: Minimal depression
- 5-9: Mild depression
- 10-14: Moderate depression
- 15-19: Moderately severe depression
- 20-27: Severe depression (clinical threshold)

**GAD-7 (Anxiety):**
- 0-4: Minimal anxiety
- 5-9: Mild anxiety
- 10-14: Moderate anxiety (clinical threshold)
- 15-21: Severe anxiety

**PCL-5 (PTSD):**
- 0-32: Below threshold
- 33+: Significant PTSD symptoms (clinical threshold)

**ACE (Childhood Adversity):**
- 0: No adversity
- 1-3: Low-moderate adversity
- 4+: Moderate-high adversity

**HRV (Heart Rate Variability):**
- Age-specific normal ranges
- Flags if outside normal range

---

### Feature 3: Narrative Viewer UI

**UI:**
```
┌─────────────────────────────────────┐
│ 📄 Clinical Narrative               │
│                                     │
│ [Full narrative text displayed]     │
│                                     │
│ Generated: Feb 17, 2026 at 10:30 AM │
│                                     │
│ [Export PDF] [Copy to Clipboard]    │
└─────────────────────────────────────┘
```

**Features:**
- Formatted text with section headers
- Syntax highlighting for clinical terms
- One-click copy to clipboard
- Export as formatted PDF

---

### Feature 4: Export Options

**A. PDF Export**
- Professional formatting
- Header with patient ID and date
- Section breaks
- Footer with practitioner signature line

**B. Copy-Paste Text**
- Plain text format
- Preserves section structure
- Ready to paste into EHR

---

## Verification Plan

### Automated Tests
```bash
npm run test -- narrativeGenerator.test.ts
npm run test -- clinicalInterpretations.test.ts
npm run test -- NarrativeViewer.test.tsx
```

### Manual Verification
1. **Generation Speed:** Verify generates within 2 seconds
2. **All Forms:** Verify includes all 5 Phase 1 forms
3. **Score Interpretation:** Verify correct clinical thresholds
4. **Age-Appropriate Ranges:** Verify HRV ranges match patient age
5. **PDF Export:** Verify formatted PDF downloads
6. **Copy-Paste:** Verify plain text copies to clipboard
7. **Missing Data:** Verify handles incomplete forms gracefully

### Accessibility
- Screen reader compatible
- Keyboard shortcuts (Cmd+C to copy)
- High contrast mode

---

## Dependencies
- All 5 Phase 1 form components
- Patient demographic data (age for HRV ranges)
- PDF generation library

## Estimated Effort
**8-12 hours** (2-3 days)

## Success Criteria
- ✅ Generates narrative within 2 seconds of wizard completion
- ✅ Includes all 5 Phase 1 forms
- ✅ Interprets scores with clinical context
- ✅ Provides age-appropriate normal ranges
- ✅ Flags concerning findings
- ✅ Generates clinical impression and treatment plan
- ✅ Exportable as PDF (formatted)
- ✅ Copy-paste as plain text

---

**Status:** Ready for LEAD assignment
