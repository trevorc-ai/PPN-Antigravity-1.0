---
id: WO-570a
title: "Integration Compass — Data Hooks: useCompassSession, useCompassTimeline, useCompassMode"
owner: BUILDER
status: 04_QA
authored_by: LEAD
parent: WO-570
sequence: 1
date: 2026-03-02
priority: P0
tags: [compass, hooks, data-layer, useCompassSession, useCompassTimeline, useCompassMode]
failure_count: 0
depends_on: [WO-570]
blocks: [WO-570b, WO-570c, WO-570d]
---

## LEAD Architecture

This is ticket 1 of 5 in the WO-570 child sequence. BUILDER must complete this
before any component work begins. All subsequent tickets (570b–570d) import from
these hooks.

---

### Target Directory

`src/hooks/compass/` (new directory)

---

### Hook 1: `useCompassSession`

**File:** `src/hooks/compass/useCompassSession.ts`

**Responsibility:** Fetches the session record and derives computed values.

**Inputs:** `sessionId: string | null` (from URL `?sessionId=` param)

**Queries:**
- `log_clinical_records` — `substance_id`, `session_date`, `indication_id`,
  `baseline_phq9_score`, `meq30_score`, `ceq_score`, `dosage_mg`
- `log_dose_events` — `dose_mg`, `dose_mg_per_kg`, `substance_id`,
  `administered_at` (for timeline X-axis anchor)
- `ref_substances` — `substance_name` (join on `substance_id`)

**Returns:**
```typescript
{
  sessionId: string;
  substanceId: number | null;
  substanceName: string | null;           // e.g. "Psilocybin"
  substanceCategory: 'psilocybin' | 'ketamine' | 'mdma' | 'ayahuasca' | 'unknown';
  sessionDate: Date | null;
  daysPostSession: number | null;         // computed: today - sessionDate
  doseMg: number | null;
  indicationId: number | null;
  baselinePhq9: number | null;
  meq30Score: number | null;
  accentColor: string;                    // derived from substanceCategory
  loading: boolean;
  error: string | null;
}
```

**Accent color map (static constant, not from DB):**
```
psilocybin → '#2dd4bf'
ketamine   → '#a78bfa'
mdma       → '#fb7185'
ayahuasca  → '#f59e0b'
unknown    → '#2dd4bf'
```

---

### Hook 2: `useCompassTimeline`

**File:** `src/hooks/compass/useCompassTimeline.ts`

**Responsibility:** Fetches in-session Companion event taps.

> ⚠️ BLOCKER: BUILDER must first run:
> ```sql
> SELECT table_name FROM information_schema.tables
> WHERE table_schema = 'public'
> AND table_name IN ('log_session_timeline_events', 'log_companion_events');
> ```
> If neither table exists → STOP. Escalate to SOOP for migration before
> build continues. This hook returns empty array gracefully if table is absent.

**Inputs:** `sessionId: string | null`

**Returns:**
```typescript
{
  events: Array<{
    eventId: string;
    eventTypeId: number;
    eventLabel: string;        // patient-language label from ref table
    intensity: number;         // 0–10
    occurredAt: Date;
    minutesFromDose: number;   // computed from administered_at
    axis: SpiderAxis;          // mapped from eventTypeId
  }>;
  hasData: boolean;
  loading: boolean;
  error: string | null;
}
```

**Spider axis mapping (static, BUILDER implements as constant):**
```
Emotional events     → 'emotionalIntensity'
Perceptual events    → 'sensoryAlteration'
Ego/self events      → 'egoDissolution'
Body/somatic events  → 'physicalSensation'
Time-related events  → 'timeDistortion'
Spiritual events     → 'mysticalQuality'
```

---

### Hook 3: `useCompassMode`

**File:** `src/hooks/compass/useCompassMode.ts`

**Responsibility:** Determines whether to render Daily Mode or Full Report Mode.

**Inputs:**
- `emaPointsLength: number` (from useCompassEMA, which BUILDER also implements here)
- `searchParams: URLSearchParams`

**Returns:**
```typescript
{
  mode: 'daily' | 'report';
  practitionerView: boolean;   // true if ?pv=1 present in URL
}
```

**Logic:**
- `practitionerView = searchParams.get('pv') === '1'`
- `mode = emaPointsLength >= 1 ? 'daily' : 'report'`

---

### Hook 4: `useCompassEMA` (also in this ticket)

**File:** `src/hooks/compass/useCompassEMA.ts`

**Responsibility:** Fetches daily pulse check-in history from `log_pulse_checks`.

**Inputs:** `sessionId: string | null`

**Queries:** `log_pulse_checks` — all rows for `session_id`, ordered by `check_in_date` ASC

**Returns:**
```typescript
{
  points: Array<{
    date: Date;
    daysPostSession: number;
    moodLevel: number;
    sleepQuality: number;
    anxietyLevel: number;
    connectionLevel: number;
  }>;
  hasData: boolean;
  streakDays: number;         // consecutive days with entries ending today
  loading: boolean;
}
```

---

### Acceptance Criteria

- [ ] All 4 hook files exist in `src/hooks/compass/`
- [ ] Each hook exports a typed return interface (no `any` types)
- [ ] `useCompassSession` correctly computes `daysPostSession` from `session_date`
- [ ] `useCompassSession` correctly maps `substanceId` to `substanceCategory` and `accentColor`
- [ ] `useCompassTimeline` returns empty array gracefully when table does not exist
- [ ] `useCompassMode` returns `practitionerView: true` only when `?pv=1` is in URL
- [ ] `useCompassEMA` reads from `log_pulse_checks` (NOT `log_daily_pulse`)
- [ ] Blocker SQL query run and result documented in this ticket before build proceeds
- [ ] Zero calls to `supabase` from inside any component — all DB access through hooks
- [ ] TypeScript: zero `any` types, zero compile errors
