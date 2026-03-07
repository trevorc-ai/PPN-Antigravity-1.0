---
id: WO-SAVS-P3-P1
title: "SAVS Fix: Phase 3 P1 Gaps — Dead Action Cards, Discharge Timestamp, Dummy Data"
status: READY_FOR_BUILD
owner: BUILDER
priority: P1
phase: Phase 3
skill: inspector-qa-script
---

## Summary

P1 (non-critical but important) issues in Phase 3 identified during the SAVS audit. Covers two dead action card buttons, a missing DB timestamp on Discharge Summary generation, and 10 hardcoded dummy data values in the Discharge Summary builder.

## Context

See `WO-SAVS-P3-P0` for P0 fixes. This work order handles all P1 items for Phase 3. Complete the P0 work order first.

## Gaps to Fix

### GAP P3-A — Step 1 & 2 Integration Cards Have No `onOpen` Prop

**File:** `src/components/wellness-journey/IntegrationPhase.tsx`
**Lines:** ~409–423

Step 1 "Safety Check" (Day 0–3) and Step 2 "Daily Pulse, First Check-In" render an "Open" button via `IntegrationCard` but pass no `onOpen` prop. The button is dead.

**Fix:** Add `onOpen` props:
```tsx
// Step 1 Safety Check
<IntegrationCard
    stepNum={1}
    ...
    status={daysPostSession > 3 ? 'archived' : completedForms.has('structured-safety') ? 'completed' : 'pending'}
    onOpen={onOpenForm && daysPostSession <= 3 ? () => onOpenForm('structured-safety') : undefined}
/>

// Step 2 Daily Pulse First Check-In
<IntegrationCard
    stepNum={2}
    ...
    status={daysPostSession > 3 ? 'archived' : completedForms.has('daily-pulse') ? 'completed' : 'pending'}
    onOpen={onOpenForm && daysPostSession <= 3 ? () => onOpenForm('daily-pulse') : undefined}
/>
```

> **Note:** The `'archived'` state correctly overrides `onOpen` in the `IntegrationCard` component (it renders no button when `isArchived`), so this is safe.

---

### GAP P3-D — Discharge Summary Generation Not Timestamped in DB

**File:** `src/components/wellness-journey/IntegrationPhase.tsx`  
**Function:** `handleDischargeSummary` (~line 299)

Add a `createTimelineEvent()` call after `downloadDischargeSummary()` to record that a clinical discharge document was generated.

```ts
// Add import at top of IntegrationPhase.tsx:
import { createTimelineEvent, createPulseCheck } from '../../services/clinicalLog';

// In handleDischargeSummary, after downloadDischargeSummary():
const sidD = journey.session?.sessionId ?? journey.sessionId;
if (sidD && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sidD)) {
    createTimelineEvent({
        session_id: sidD,
        event_timestamp: new Date().toISOString(),
        event_type: 'clinical_decision',
        metadata: { event_description: 'Discharge summary PDF generated and exported by practitioner.' },
    }).catch(err => console.warn('[SAVS-P3D] Discharge summary DB timestamp failed:', err));
}
```

---

### Dummy Data Cleanup — Discharge Summary Builder

**File:** `src/components/wellness-journey/IntegrationPhase.tsx`  
**Function:** `handleDischargeSummary` (lines ~299–327)

Replace hardcoded sentinel values with live data where available. Mark fields where the data doesn't exist yet with a clear `// TODO: wire when [field] is available` comment.

| Field | Current Value | Replace With |
|---|---|---|
| `siteId` | `'SITE-001'` | `journey.siteId ?? 'SITE-UNKNOWN'` |
| `clinicianId` | `'Provider-1'` | `journey.clinicianId ?? 'Provider-Unknown'` |
| `treatmentStart` | `'2025-08-01'` | `journey.sessionDate ?? new Date().toISOString().split('T')[0]` |
| `treatmentEnd` | `'2025-11-20'` | `new Date().toISOString().split('T')[0]` (today) |
| `dosingSessionsCount` | `3` | `1` (single session — multi-session not yet supported) |
| `diagnosis` | `'Treatment-Resistant Depression (F33.2)'` | `journey.diagnosis ?? 'Not recorded'` |
| `protocolName` | `'TRD Standard 3-Dose'` | `journey.protocolName ?? 'Standard Protocol'` |
| `gad7` (baseline) | `15` | `journey.risk?.baseline?.gad7 ?? null` with `// TODO: wire when column available` |
| `caps5` (baseline/final) | `20`, `12` | Mark as `// TODO: CAPS-5 not yet collected` |
| `clinicianName/clinicName` | Hardcoded strings | `journey.clinicianName ?? 'Attending Practitioner'`, `journey.clinicName ?? 'PPN Partner Clinic'` |

## Acceptance Criteria

- [ ] Step 1 & 2 cards are wired to `onOpenForm('structured-safety')` and `onOpenForm('daily-pulse')` 
- [ ] Discharge Summary generation logs a `createTimelineEvent()` to the DB
- [ ] Discharge Summary dummy data replaced with real `journey.*` fields where available
- [ ] Remaining unavailable fields have `// TODO` comments explaining what data is needed
- [ ] TypeScript compiles with zero new errors
- [ ] Run INSPECTOR QA script after build
