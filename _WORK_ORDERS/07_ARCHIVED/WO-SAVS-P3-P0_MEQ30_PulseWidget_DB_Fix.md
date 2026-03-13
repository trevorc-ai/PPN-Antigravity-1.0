---
id: WO-SAVS-P3-P0
title: "SAVS Fix: Phase 3 P0 Gaps — MEQ-30 No-Op & Pulse Widget console.log"
status: 04_QA
completed_at: 2026-03-11
owner: BUILDER
priority: P0
phase: Phase 3
skill: inspector-qa-script
builder_notes: "Both P0 gaps already implemented in prior session: handleMEQ30Save wired to createMEQ30Score + createTimelineEvent (WellnessFormRouter.tsx L448-472); PulseCheckWidget.onSubmit wired to createPulseCheck (IntegrationPhase.tsx L757-771). Verified by source audit 2026-03-11."
---

## Summary

Two P0 data-dropping bugs in Phase 3 identified during the SAVS (State-Action Verification System) audit. Both prevent patient data from reaching the database.

## Context: What Has Already Been Done

The complete SAVS audit has been completed for Phase 1, 2, and 3. The following gaps have **already been fixed** in a previous session (do NOT re-fix):

- Phase 2: GAP #1 (Session Start), GAP #2 (Keyboard V), GAP #3 (Session End), GAP #4 (Submit & Close) — all fixed in `DosingSessionPhase.tsx`
- Phase 1: P1-A (Safety Check localStorage-only), P1-B (Mental Health no onSave), P1-C (Phase 1 completion timestamp) — all fixed in `WellnessFormRouter.tsx`

## Gaps to Fix in This Work Order

### GAP P3-B — MEQ-30 Save is a Stub No-Op

**File:** `src/components/wellness-journey/WellnessFormRouter.tsx`
**Lines:** ~317–322 (`handleMEQ30Save`)

**Current code:**
```ts
const handleMEQ30Save = useCallback(async (_data: MEQ30Data) => {
    // MEQ-30 score is stored on log_clinical_records.meq30_score (the session record)
    // This requires an UPDATE to the existing session record, not a new insert.
    // For now: record that MEQ-30 was completed. Full wiring requires session UPSERT.
    onSaved('MEQ-30 Questionnaire');
}, []);
```

**Fix required:** Replace the stub with a real `createTimelineEvent()` call that records MEQ-30 completion. The score should be passed in `metadata` until a dedicated `meq30_score` column is confirmed available.

```ts
const handleMEQ30Save = useCallback(async (data: MEQ30Data) => {
    if (sessionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
        await createTimelineEvent({
            session_id: sessionId,
            event_timestamp: new Date().toISOString(),
            event_type: 'clinical_decision',
            metadata: {
                event_description: `MEQ-30 assessment completed. Total score: ${data.total_score ?? '—'}.`,
                meq30_score: data.total_score,
            },
        }).catch(err => console.warn('[SAVS-P3B] MEQ-30 DB write failed:', err));
    }
    onSaved('MEQ-30 Questionnaire');
}, [sessionId]);
```

> **Note:** Check the `MEQ30Data` interface to confirm the field name for the composite score (`total_score`). Find it in `src/components/arc-of-care-forms/phase-1-preparation/MEQ30QuestionnaireForm.tsx` or its type export.

---

### GAP P3-C — PulseCheckWidget.onSubmit is console.log Only

**File:** `src/components/wellness-journey/IntegrationPhase.tsx`
**Lines:** ~687–693

**Current code:**
```tsx
<PulseCheckWidget
    patientId={journey.patientId}
    sessionId={journey.session?.sessionId ?? journey.sessionId}
    onSubmit={(data) => {
        console.log('[WO-545] Pulse check submitted:', data);
    }}
/>
```

**Fix required:** Replace `console.log` with a `createPulseCheck()` call. Add the import at the top of `IntegrationPhase.tsx` and wire up the call. Same pattern as `handlePulseCheckSave` in `WellnessFormRouter.tsx`.

```tsx
// At top of IntegrationPhase.tsx — add to imports:
import { createPulseCheck } from '../../services/clinicalLog';

// In PulseCheckWidget onSubmit:
<PulseCheckWidget
    patientId={journey.patientId}
    sessionId={journey.session?.sessionId ?? journey.sessionId}
    onSubmit={async (data) => {
        if (!journey.patientId) return;
        const result = await createPulseCheck({
            patient_id: journey.patientId,
            session_id: journey.session?.sessionId ?? journey.sessionId,
            check_date: new Date().toISOString().split('T')[0],
            connection_level: data.connection_level ?? 3,
            sleep_quality: data.sleep_quality ?? 3,
            mood_level: data.mood_level,
            anxiety_level: data.anxiety_level,
        });
        if (!result.success) {
            console.warn('[SAVS-P3C] Pulse check widget DB write failed:', result.error);
        }
    }}
/>
```

> **Note:** Check `PulseCheckWidget`'s `onSubmit` callback type to confirm the shape of `data` before wiring. Match field names accordingly.

## Acceptance Criteria

- [ ] MEQ-30 form save calls `createTimelineEvent()` with the score in metadata
- [ ] `PulseCheckWidget.onSubmit` calls `createPulseCheck()` with correct field mapping
- [ ] No `onChange` handlers fire DB writes — only explicit save/submit actions
- [ ] TypeScript compiles with zero new errors
- [ ] Run INSPECTOR QA script after build
