---
owner: BUILDER
status: 00_INBOX
authored_by: INSPECTOR
priority: P1
track: A
track_item: A2
stabilization_brief: STABILIZATION_BRIEF.md v1.2
created: 2026-03-21
---

# WO-A2: Fix Vitals Chart DB Hydration on Mount

## Context

During a live Phase 2 dosing session, the Session Vitals Trend Chart renders correctly as vitals are entered. However, if the practitioner refreshes the page or navigates away and returns during an active session, the chart resets to empty.

**Root cause (confirmed from code inspection):**  
`DosingSessionPhase.tsx` manages vitals as in-memory React state (`vitalSigns[]`). The component correctly writes new vitals to `log_session_vitals` via `clinicalLog.ts`. However, on mount, there is **no read-back** from `log_session_vitals` to hydrate the chart. The chart has no data on initial render unless vitals were entered in the same browser session.

**Data is not lost** — it's in the database. The chart just doesn't read it on mount.

---

## Scope

This is a **one-file fix** in the component layer. No schema changes. No new tables. No UI layout changes.

**File to modify:**
- `src/components/wellness-journey/DosingSessionPhase.tsx`

**Service function to use (already exists in `clinicalLog.ts`):**
- `getSessionVitals(sessionId: string)` — INSPECTOR must verify this function exists and confirm its return type before BUILDER writes the effect hook. If it does not exist, BUILDER must add it to `clinicalLog.ts` and add that file to scope with a plan amendment.

---

## Implementation Specification

### Step 1 — Pre-Flight: Verify `getSessionVitals` exists

BUILDER must run:
```bash
grep -n "getSessionVitals\|log_session_vitals" /path/to/src/services/clinicalLog.ts
```

Confirm the function signature and return type. If it does not exist, STOP and notify the user. Do not proceed to Step 2 until confirmed.

### Step 2 — Add a mount hydration `useEffect`

In `DosingSessionPhase.tsx`, add a `useEffect` that fires when `sessionId` is available and stable. It should:

1. Call `getSessionVitals(sessionId)` (or equivalent)
2. Map the returned rows to the local `vitalSigns` state shape
3. Set `vitalSigns` state with the hydrated array
4. Guard with `if (!sessionId) return` to prevent premature fetch
5. Only run once on mount (dependency array: `[sessionId]`)

```tsx
// Pseudocode — BUILDER determines exact implementation based on state shape
useEffect(() => {
  if (!sessionId) return;
  getSessionVitals(sessionId).then((rows) => {
    if (rows && rows.length > 0) {
      setVitalSigns(mapDbRowsToVitalShape(rows));
    }
  }).catch((err) => {
    console.error('[DosingSessionPhase] Failed to hydrate vitals chart:', err);
    // Do not show user-facing error — silent failure is acceptable here
    // Chart will remain empty, which is the current behavior
  });
}, [sessionId]);
```

### Step 3 — Guard against duplicate entries

If the practitioner stays on the page and continues entering vitals after the hydration runs, the optimistic state updates must still work correctly. Verify that new entries appended to `vitalSigns` after hydration do not cause duplicates. If the existing add-vital handler uses `.concat()` or `[...prev, newEntry]`, this should be safe without modification.

---

## Constraints (from STABILIZATION_BRIEF.md)

- **One file only** (`DosingSessionPhase.tsx`). If `getSessionVitals` must be added, `clinicalLog.ts` is added to scope with explicit plan amendment and user approval before proceeding.
- **No UI layout changes.** The chart component itself (`SessionVitalsTrendChart` or equivalent) is not modified.
- **No schema changes.** `log_session_vitals` already has the correct structure.
- **Two-strike rule applies.** If the hydration effect causes any regression (e.g., duplicate vitals, incorrect mapping, chart flash), STOP and report. Do not patch the patch.
- **RULE 7 enforced.** Any changes to Tailwind classes or component layout in the same file are explicitly out of scope.

---

## Acceptance Criteria

1. Refresh the page during an active dosing session with existing vitals logged. The chart renders the previously entered vitals immediately on mount.
2. After hydration, entering a new vital appends correctly. No duplicates appear in the chart.
3. For a new session with no vitals yet, the chart renders in its empty state (same as today). No error is thrown.
4. Network tab confirms one `log_session_vitals` read on mount. No polling loop introduced.
5. Console shows no unhandled promise rejections.

---

## Verification

1. Start or resume an active Phase 2 dosing session
2. Enter at least 2 vital readings
3. Hard-refresh the browser (Cmd+Shift+R)
4. Confirm the chart immediately shows the previously entered vitals
5. Enter one more vital reading and confirm it appends without duplicates
6. Open browser dev tools → Network → confirm one DB read on mount

**Route:** BUILDER → INSPECTOR → user sign-off before commit.

---

## UI/UX Note (from UI_UX_GUARDRAILS.md)

Per UI Guardrail 9 (empty states), if the chart loads with data, it should render silently. If it loads empty (new session), it should ideally show: *"Vitals will appear here as they are recorded."* This is a cosmetic improvement that may be included in this WO if it requires fewer than 5 lines and does not touch any layout/Tailwind classes. If scope is unclear, defer to WO-A4.
