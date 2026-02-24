---
id: WO-402
title: "Phase 3 Real Data Wiring — Replace Mock with Live Supabase Queries"
status: 03_BUILD
owner: BUILDER
created: 2026-02-22
created_by: LEAD
failure_count: 0
priority: P1
tags: [supabase, data, phase3, integration, log_longitudinal_assessments, real-data, testing]
depends_on: [WO-225 session creation flow — sessionId must exist before Phase 2 form saves]
parent: null
user_prompt: |
  "Clean up the page and keep testing with actual data until we have confidence
  everything is working properly."
---

# WO-402: Phase 3 Real Data Wiring

**Owner: BUILDER**
**Priority: P1 — Confidence gate: nothing is validated until real data flows**

---

## LEAD ARCHITECTURE

### Problem Statement
Every Phase 3 visualization is currently running on hardcoded mock values:
- PHQ-9 trajectory (`MOCK_DECAY_POINTS`)
- Pulse check compliance (hardcoded `78%`, `92%`)
- Integration session counts (hardcoded `4/6`)
- PatientOutcomePanel falls back to static arrays
- `MOCK_PULSE_TREND` array (7 days, static)

These need to become **live Supabase reads with graceful mock fallback.**
The fallback stays in place so the UI never breaks — it just shows demo data
when a session has no real records yet.

---

## DATA SOURCES (all tables confirmed live in prod schema)

| UI Element | Source Table | Key Columns |
|---|---|---|
| PHQ-9 trajectory / Symptom Decay | `log_longitudinal_assessments` | `days_post_session`, `phq9_score`, `session_id` |
| Baseline PHQ-9 | `log_baseline_assessments` | `phq9_score`, `patient_id` |
| Pulse check compliance | `log_daily_pulse` | `session_id`, `submitted_at` (count rows vs expected) |
| Integration sessions attended | `log_integration_sessions` | `session_id`, `status = 'completed'` |
| Session vitals trend | `log_session_vitals` | `session_id`, `heart_rate`, `recorded_at` |
| MEQ-30 score | `log_meq30_responses` | `session_id`, `total_score` |

---

## NEW HOOK: `usePhase3Data.ts`

**File:** `src/hooks/usePhase3Data.ts`

```typescript
interface Phase3Data {
  // PHQ-9 trajectory for Symptom Decay chart
  decayPoints: Array<{ day: number; phq9: number }> | null;
  baselinePhq9: number | null;
  currentPhq9: number | null;

  // Compliance
  pulseCheckCompliance: number | null;   // 0–100%
  phq9Compliance: number | null;         // 0–100%

  // Integration sessions
  integrationSessionsAttended: number | null;
  integrationSessionsScheduled: number | null;

  // Pulse trend (7-day)
  pulseTrend: Array<{
    day: string;
    connection: number;
    sleep: number;
    date: string;
  }> | null;

  // Loading / error states
  isLoading: boolean;
  error: string | null;
}

export function usePhase3Data(
  sessionId: string | undefined,
  patientId: string | undefined
): Phase3Data
```

### Key queries inside the hook:

```typescript
// PHQ-9 trajectory — longitudinal assessments for this session
const { data: longitudinal } = await supabase
  .from('log_longitudinal_assessments')
  .select('days_post_session, phq9_score')
  .eq('session_id', sessionId)
  .order('days_post_session', { ascending: true });

// Baseline PHQ-9
const { data: baseline } = await supabase
  .from('log_baseline_assessments')
  .select('phq9_score')
  .eq('patient_id', patientId)
  .order('created_at', { ascending: false })
  .limit(1)
  .single();

// Pulse check compliance: count submitted vs expected (1 per day since session)
const daysSinceSession = Math.floor((Date.now() - sessionStartMs) / 86400000);
const { count: pulseCount } = await supabase
  .from('log_daily_pulse')
  .select('*', { count: 'exact', head: true })
  .eq('session_id', sessionId);
const pulseCompliance = daysSinceSession > 0
  ? Math.round((pulseCount / daysSinceSession) * 100)
  : null;

// Integration sessions
const { count: attendedCount } = await supabase
  .from('log_integration_sessions')
  .select('*', { count: 'exact', head: true })
  .eq('session_id', sessionId)
  .eq('status', 'completed');
```

### Graceful fallback
If `sessionId` is undefined, `patientId` is undefined, or any query returns zero rows:
→ return the existing hardcoded mock values so the UI never breaks.
→ Add a subtle `[DEMO DATA]` badge on any panel running on mock (removes automatically when real data exists).

---

## INTEGRATION POINTS

### `IntegrationPhase.tsx`
- Replace all hardcoded `journey.integration.*` field reads with `usePhase3Data(journey.sessionId, journey.patientId)` hook results
- Pass `isLoading` to show skeleton loaders on the panels while queries run

### `PatientOutcomePanel.tsx`
- Check if it's already querying Supabase — if yes, ensure it correctly uses `sessionId` (not a hardcoded `"1"`)
- Currently called with: `sessionId={journey.session?.sessionNumber?.toString() || "1"}` — **this is wrong**
  It should be: `sessionId={journey.sessionId}` (the UUID from `log_clinical_records.id`)
- Fix this prop immediately as it's currently causing all PatientOutcomePanel queries to return empty

### `SymptomDecayCurve` data prop
- Currently hardcoded: `{ day: 7, phq9: 14 }, { day: 14, phq9: 11 }...`
- Replace with `usePhase3Data().decayPoints ?? MOCK_DECAY_POINTS`

---

## `[DEMO DATA]` BADGE COMPONENT

Small amber indicator to show when a panel is running on demo data:

```tsx
// Renders only when isDemo=true
<DemoDataBadge />
// Output: 🟡 DEMO DATA — Connect patient records to see live data
```

Dismissible. Should render in top-right of each panel that's on mock data.

---

## ACCEPTANCE CRITERIA

- [ ] `usePhase3Data` hook created and exported from `src/hooks/usePhase3Data.ts`
- [ ] Hook queries `log_longitudinal_assessments` for PHQ-9 trajectory when `sessionId` is defined
- [ ] Hook queries `log_baseline_assessments` for baseline PHQ-9
- [ ] Pulse check compliance calculated from actual `log_daily_pulse` row count
- [ ] Integration session count from `log_integration_sessions`
- [ ] All Phase 3 panels show `[DEMO DATA]` badge when running on mock fallback
- [ ] `PatientOutcomePanel` prop corrected — `sessionId={journey.sessionId}` not `sessionNumber`
- [ ] Symptom Decay Curve pulls from hook data when available
- [ ] Skeleton loader shown during query fetch (no blank flash)
- [ ] If queries fail (network, RLS), graceful fallback to mock — no blank screen, no crash
- [ ] `[DEMO DATA]` badge disappears automatically when real data is present
- [ ] No PHI — queries scoped to `session_id` / `patient_id` Subject_ID only, no names

## END-TO-END TEST PROTOCOL (BUILDER to document results)
Walk through this sequence and annotate which assertions pass:
1. Open Wellness Journey, select any patient
2. Complete Phase 1 baseline observations (PHQ-9 score entry)
3. Complete dosing session (Phase 2), end session
4. Navigate to Phase 3 Integration
5. Verify: PHQ-9 baseline shows real score from step 2 (not hardcoded 22)
6. Submit a daily pulse check
7. Verify: pulse check compliance updates (shows 1/1 = 100% for day 1)
8. Submit a longitudinal assessment (PHQ-9 at Week 1)
9. Verify: Symptom Decay curve shows the Week 1 data point
10. Verify: `[DEMO DATA]` badges have disappeared from panels with real data

## ROUTING
BUILDER → INSPECTOR → 05_USER_REVIEW
