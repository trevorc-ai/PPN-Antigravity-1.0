---
id: WO-123
title: "P0 Cleanup: Eradicate Clinical Recommendations and Advice Vocabulary"
status: 05_USER_REVIEW
owner: USER
failure_count: 0
created: 2026-02-22
priority: P0
tags: [compliance, risk, vocabulary, demo-blocker]
---

# WO-123: P0 Cleanup - Eradicate Clinical Recommendations and Advice Vocabulary

## STATUS: P0 URGENT (DEMO BLOCKER)

## USER CONTEXT
The platform must be "structurally immune to narrative data breaches" AND structurally protected against practicing medicine without a license. Currently, the codebase contains multiple instances of words like "recommend", "recommendation", "suggest", and "advise" in clinical contexts. This converts PPN from an informational tool into a Clinical Decision Support (CDS) tool, creating massive liability.

## ARCHITECTURE & COMPLIANCE MANDATE
We must NEVER imply that PPN is providing clinical recommendations. 
The system provides: `Risk Analysis`, `Historical Norms`, `Contraindications`, and `Data Intelligence`.
The system DOES NOT provide: `Recommendations`, `Advice`, or `Clinical Suggestions`.

## SCOPE OF WORK (BUILDER)

### 1. Global Search and Replace
Run a global search across `/src/` for the following terms in clinical contexts:
- `recommend` / `recommendation` / `recommended`
- `suggest` / `suggested` (except when referring to UI "pre-fill suggestions" or "vocabulary suggestions")
- `advise` / `advice` (except in legal disclaimers stating we DO NOT provide advice)

### 2. Specific Target Files & Required Changes
Here is the hit list of files that were audited and must be updated.

#### Services Layer
- **`src/services/insightEngine.ts`**: Change "Protocol recommendation" to "Clinical Insight" or "Historical Pattern".
- **`src/services/protocolIntelligence.ts`**: Change `recommendation: 'Psilocybin (25mg)'` to `historical_norm: 'Psilocybin (25mg)'` or remove it.
- **`src/services/analytics.ts`**: Change "recommended" in rationale to "indicated by historical data" or "standard protocol alignment".
- **`src/services/narrativeGenerator.ts`**: Update the internal prompt instructions to ban the word "recommendation".
- **`src/services/contraindicationEngine.ts`**: Change "preparation and integration support recommended" to "Heightened preparation and integration support historically indicated". Change "Recommend gradual taper" to "Tapering protocols often considered".
- **`src/services/dischargeSummary.ts`**: Change `DISCHARGE RECOMMENDATIONS` to `DISCHARGE OBSERVATIONS` or `POST-SESSION RISK FACTORS`.

#### UI Components & Pages
- **`src/components/analytics/MetabolicRiskGauge.tsx`**: Rename the `recommendation` field in the data array to something like `clinical_insight` or `risk_management_considerations`.
- **`src/components/risk/ProgressRiskFlags.tsx` & `SessionRiskFlags.tsx`**: Change "Recommended Actions" to "Risk Mitigation Strategies" or "Clinical Considerations". Rename the `recommendation` prop to `mitigation` or `insight`.
- **`src/components/arc-of-care/PredictedIntegrationNeeds.tsx`**: Change `recommendedSessions` to `indicatedSessions` or `historicalSessionAverage`. Change "Algorithm-based integration session recommendations" to "Algorithm-based integration session forecasting". Change "Recommended Schedule" to "Forecasted Schedule".
- **`src/components/ProtocolBuilder/DosageSlider.tsx`**: Change "Recommendation:" to "Dosing Insight" or "Historical Benchmark".
- **`src/components/wellness-journey/PreparationPhase.tsx`**: Change "Recommended strict adherence" to "Strict adherence historically correlates with...".
- **`src/components/arc-of-care/PCL5SeverityZones.tsx`**, **`ACEScoreBarChart.tsx`**, **`PatientOutcomePanel.tsx`**: Change instances of "score suggests" to "score correlates with" or "score indicates".
- **`src/pages/ArcOfCareDemo.tsx`**: Change "Algorithm-generated integration recommendations" to "Algorithm-generated integration forecasting". Change "Recommended Sessions" to "Forecasted Sessions".
- **`src/pages/Dashboard.tsx`**: Change "Recommended Next Steps" to "Protocol Insights" or "Risk Management Actions".
- **`src/pages/HiddenComponentsShowcase.tsx`**: Change "Evidence-based clinical recommendations" to "Evidence-based clinical insights".

### 3. Exemptions
- **Legal Disclaimers**: Phrases like "It does not provide medical advice, treatment recommendations, or dosing guidance" (e.g., in `TermsOfService.tsx`, `Landing.tsx`, `WellnessJourney.tsx`) MUST stay. They are legally required.
- **Vocabulary/UI Suggestions**: Features like `RequestNewOptionModal.tsx`, `RefTableRequestModal.tsx` ("Suggest a new clinical observation") and `useSmartPreFill.ts` (Form pre-fill suggestion) are not clinical and should remain.

## DEFINITION OF DONE (INSPECTOR GATE)
- The word "recommendation" or "recommend" does not appear anywhere in `/src/` except in `TermsOfService`, legal disclaimers, or UI tooltips.
- The word "suggest" does not appear in any clinical context (only in component features like "suggest vocabulary").
- The application compiles and tests pass (no broken variable names).

## NEXT ACTIONS
@BUILDER: Claim this ticket and execute the replacements immediately.
@INSPECTOR: Run a code audit `grep -i "recommend"` to verify destruction. Do not pass this ticket to QA until zero clinical hits remain.

*Filed by LEAD / ANTIGRAVITY | February 2026*

## [STATUS: PASS] - INSPECTOR APPROVED
Audit complete based on global recursive search. Zero clinical instances of 'recommend', 'suggest', or 'advise' remain. All UI language has been shifted to 'indicated', 'forecasted', 'correlates with', and 'insight'. Legal and safety disclaimers preserved. Safe to move to USER REVIEW.
