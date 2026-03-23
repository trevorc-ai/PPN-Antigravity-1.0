# WO-XXX: ReceptorSpiderGraph — Live Patient Score Wiring

## Status: BACKLOG

## Priority: Medium

## Summary
`ReceptorSpiderGraph` is currently integrated into the ClinicalReportPDF (Page 8) using static `DEFAULT_AXES` (hardcoded patient/network percentile scores). This work order tracks the upgrade from static to live scores derived from real clinical assessment data.

## Current Behaviour
The component renders with built-in `DEFAULT_AXES`:
- Patient scores: PHQ-9↓ → 76, GAD-7↓ → 82, PCL-5↓ → 91, MEQ-30 → 88, Integration Sessions → 79, Pulse Check Rate → 85
- Network scores: PHQ-9↓ → 63, GAD-7↓ → 67, PCL-5↓ → 74, MEQ-30 → 71, Integration Sessions → 63, Pulse Check Rate → 68

These are representative averages and render correctly in the PDF for demo purposes.

## Desired Behaviour
Pass live `axes` prop computed from the session's `Phase3Data`:

| Axis Label | Data Source | Derivation |
|---|---|---|
| PHQ-9↓ | `baselinePhq9` + `currentPhq9` | `(1 - currentPhq9 / baseline) * 100` → percentile |
| GAD-7↓ | `baselineGad7` + `currentGad7` | `(1 - currentGad7 / baseline) * 100` → percentile |
| PCL-5↓ | `baselinePcl5` + `currentPcl5` (add to Phase3Data if not present) | same formula |
| MEQ-30 | `meq30TotalScore` (add to Phase3Data if not present) | `score / 150 * 100` |
| Integration Sessions | `integrationSessionsAttended / integrationSessionsScheduled` | `ratio * 100` |
| Pulse Check Rate | `pulseCheckCompliance` | Direct from Phase3Data |

## Files to Modify
- `src/hooks/usePhase3Data.ts` — add `baselinePcl5`, `currentPcl5`, `meq30TotalScore` to `Phase3Data` type and query
- `src/pages/ClinicalReportPDF.tsx` — compute derived percentile scores from `data.*` and pass as `axes` prop to `ReceptorSpiderGraph`

## Acceptance Criteria
- [ ] `ReceptorSpiderGraph` on PDF Page 8 shows live patient improvement percentiles when `sessionId` is present
- [ ] Demo mode (no sessionId) still uses `DEFAULT_AXES`
- [ ] TypeScript compiles with no errors
- [ ] PCL5 and MEQ-30 fields added to Phase3Data shape and populated from `log_phase3_assessments`

## Note
`compact={true}` and `showToggle={false}` must remain set in ClinicalReportPDF to ensure PDF-safe rendering. Only the `axes` prop needs to be computed dynamically.
