---
id: WO-EXPORT-REPORTS
title: "Export Reports Upgrade: TXT → PDF + Live Data Wiring (Audit, Insurance, Research)"
status: 04_QA
owner: BUILDER
priority: P1
phase: Phase 3 / Cross-cutting
skill: frontend-best-practices
related: WO-DISCHARGE-PDF
completed_at: "2026-03-14"
builder_notes: "Fix 1: reportGenerator.ts upgraded — buildPDFDoc() shared builder with per-type color themes (Audit=Indigo, Insurance=Teal, Research=Violet), distinct type-specific sections (ICD-10 block, HIPAA Safe Harbor statement, compliance signature), TXT fallback on error. Fix 2: ExportButton.tsx adds optional sessionId prop and non-blocking createTimelineEvent call after each export. Fix 3: IntegrationPhase.tsx adds ExportButtonGroup with live buildPatientReportData() IIFE wired from phase3 + journey context, placed above the final action row."
---

## Summary

The three Wellness Journey export reports (Audit, Insurance, Research) in `reportGenerator.ts` have the same two core problems as the Discharge Summary:

1. **TXT not PDF** — all three download as `.txt` files. For clinical, insurance, and research documents this is unacceptable.
2. **No live data wiring** — `ExportButton.tsx` passes `reportData ?? { patientId }` (line 57). When no `reportData` prop is provided, only the `patientId` is passed to the generator, producing a near-empty report skeleton.

## Current State

### reportGenerator.ts
- `generateAuditReport()`, `generateInsuranceReport()`, `generateResearchReport()` — all generate `\n`-joined plain text
- `downloadReport()` — downloads as `text/plain`, filename `<type>_report_<patientId>_<date>.txt`

### ExportButton.tsx
- `handleExport()` line 57: `const data: PatientReportData = reportData ?? { patientId };`
- When called without `reportData` (most usage patterns), generates an empty report with only a patient ID

### Usage in WellnessJourney / IntegrationPhase
- `ExportButtonGroup` is placed at the bottom of Phase 3 passing only `patientId` and `reportData`
- Live session/integration/baseline data is available from `journey.*` and `usePhase3Data()` but is not being mapped into `PatientReportData`

---

## Fixes Required

### Fix 1 — Upgrade all three generators to PDF output

Use the same `jspdf` approach specified in `WO-DISCHARGE-PDF`. **Implement `WO-DISCHARGE-PDF` first** and reuse the same PDF utility wrapper.

Each report type should have a distinct visual treatment:

| Report | Color accent | Key differentiator |
|---|---|---|
| **Audit** | Indigo | Compliance checklist + signature block + benchmark readiness indicator |
| **Insurance** | Teal | ICD-10/billing codes section, medical necessity statement, PHQ-9/GAD-7 delta table |
| **Research** | Violet | HIPAA Safe Harbor header, de-identified subject ID, no practitioner signature |

All three share: PPN header, patient ID, treatment dates, baseline/outcome metrics table.

### Fix 2 — Wire live session data into PatientReportData at call site

**File:** Wherever `ExportButtonGroup` or `ExportButton` is rendered in the Wellness Journey (check `IntegrationPhase.tsx` and `WellnessJourney.tsx`).

Build a `buildPatientReportData(journey, phase3)` helper to assemble the full `PatientReportData` object from the available journey context:

```ts
function buildPatientReportData(journey: any, phase3: ReturnType<typeof usePhase3Data>): PatientReportData {
    return {
        patientId: journey.patientId,
        treatmentPeriod: journey.sessionDate
            ? { start: new Date(journey.sessionDate).toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] }
            : undefined,
        baseline: {
            phq9: journey.risk?.baseline?.phq9 ?? undefined,
            gad7: journey.risk?.baseline?.gad7 ?? undefined,
            ace: journey.risk?.baseline?.ace ?? undefined,
            pcl5: journey.risk?.baseline?.pcl5 ?? undefined,
        },
        dosingSession: {
            date: journey.sessionDate,
            substance: journey.session?.substance ?? undefined,
            doseMg: journey.session?.dose ? parseFloat(journey.session.dose) : undefined,
            vitalsCount: journey.session?.vitalsCount ?? undefined,
            meq30Score: journey.session?.meq30Score ?? undefined,
            adverseEvents: journey.session?.adverseEventCount ?? 0,
        },
        integration: {
            sessionsAttended: phase3.integrationSessionsAttended ?? undefined,
            sessionsScheduled: phase3.integrationSessionsScheduled ?? undefined,
            pulseCheckDays: phase3.pulseTrend?.length ?? undefined,
            phq9Followup: phase3.currentPhq9 ?? undefined,
        },
        benchmarkReadiness: journey.benchmarkReadiness ?? undefined,
    };
}
```

Pass this as `reportData` to `ExportButtonGroup`.

### Fix 3 — SAVS: Add createTimelineEvent to each export button click

Each export (audit, insurance, research) is a practitioner clinical action that must be timestamped in the DB log. 

In `ExportButton.tsx` `handleExport()`, after `downloadReport()` succeeds, call `createTimelineEvent()`:
```ts
import { createTimelineEvent } from '../../services/clinicalLog';

// After downloadReport():
if (sessionId && UUID_REGEX.test(sessionId)) {
    createTimelineEvent({
        session_id: sessionId,
        event_timestamp: new Date().toISOString(),
        event_type: 'clinical_decision',
        metadata: { event_description: `${reportType} report exported by practitioner.` },
    }).catch(() => {}); // non-blocking
}
```

> **Note:** `ExportButton` will need `sessionId` as a new optional prop for this to work.

---

## Acceptance Criteria

- [ ] All three report types download as `.pdf` (not `.txt`)
- [ ] `ExportButtonGroup` in Phase 3 receives fully populated `reportData` from live `journey.*` + `usePhase3Data()` data
- [ ] Empty/null fields render as "Not recorded" (no crashes)
- [ ] Each export click fires `createTimelineEvent()` when `sessionId` is a valid UUID
- [ ] PDF filenames: `audit_report_<patientId>_<date>.pdf`, etc.
- [ ] TypeScript compiles with zero errors
- [ ] Run INSPECTOR QA script after build

## Files to Modify

| File | Change |
|---|---|
| `src/services/reportGenerator.ts` | Add PDF generators per report type; update `downloadReport()` |
| `src/components/wellness-journey/ExportButton.tsx` | Add `sessionId` prop; wire `createTimelineEvent` on export; pass populated `reportData` |
| `src/components/wellness-journey/IntegrationPhase.tsx` | Call `buildPatientReportData(journey, phase3)` and pass to `ExportButtonGroup` |
| `package.json` | Add `jspdf` (shared with WO-DISCHARGE-PDF, install once) |

## Dependency

**Complete `WO-DISCHARGE-PDF` first.** Install `jspdf` in that WO and reuse the same PDF utility patterns here.
