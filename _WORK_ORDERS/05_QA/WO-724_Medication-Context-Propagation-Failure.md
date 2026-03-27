---
id: WO-724
title: "P0 — Medications not showing anywhere in Wellness Journey for subsequent treatments"
owner: BUILDER
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P0
created: 2026-03-27
fast_track: true
origin: "User fast-track — multi-bug report with screenshots"
admin_visibility: no
admin_section: ""
parked_context: ""
pillar_supported: "Safety"
task_type: bug-fix
files:
  - src/components/wellness-journey/MedicationSafetyBanner.tsx
  - src/components/wellness-journey/LiveSessionTimeline.tsx
  - src/components/wellness-journey/DosingSessionPhase.tsx
  - src/components/wellness-journey/SessionPrepView.tsx
  - src/components/wellness-journey/Phase1StepGuide.tsx
  - src/components/wellness-journey/WellnessFormRouter.tsx
---

## Request

P0 — Medications not showing anywhere in Wellness Journey when entering a subsequent (Session 2+) Treatment for PT-PUKASFPVD7:
1. Phase 1 Preparation not auto-populating medications from previous session
2. Phase 2 Step 1 (Dosing Protocol) — "CURRENT MEDICATIONS: No medications on file"
3. Timeline not showing latest dose (Psilocybin 10 mg) for current session
4. Rescue Protocol entry on Timeline not displaying its detail description

## LEAD Architecture

**Root cause analysis — 4 confirmed bugs with file evidence:**

---

### BUG-1 (P0 — Safety-critical): MedicationSafetyBanner reads wrong localStorage key

**File:** `src/components/wellness-journey/MedicationSafetyBanner.tsx` — line 21

```ts
const STORAGE_KEY = 'mock_patient_medications_names';  // ← WRONG
```

`WellnessFormRouter.tsx` (line 694) writes medications to the **authoritative key** `ppn_patient_medications_names` when Phase 1 Safety Check is saved. For Session 1, the old `mock_patient_medications_names` key may still exist in localStorage (from DB hydration). On Session 2+, it is never refreshed — only `ppn_patient_medications_names` gets updated. The banner silently returns `null` every time (`meds.length === 0`).

**Fix:** Change `STORAGE_KEY` in `MedicationSafetyBanner.tsx` to read **both** keys with the authoritative key taking priority:
```ts
const raw = localStorage.getItem('ppn_patient_medications_names')
          || localStorage.getItem('mock_patient_medications_names');
```

---

### BUG-2 (P0): SessionPrepView "CURRENT MEDICATIONS" panel — same key mismatch

**File:** `src/components/wellness-journey/SessionPrepView.tsx` — line 466

The "CURRENT MEDICATIONS" section in Phase 2 Step 1 (Dosing Protocol / `SessionPrepView`) shows "No medications on file". This panel reads from a state variable populated by `DosingSessionPhase`. That component (lines 1005–1021) does implement the dual-key read correctly. **The bug is that the localStorage storage event listener** (lines 320–327 in `DosingSessionPhase.tsx`) only fires on `storage` events from OTHER tabs — for the same-tab write from WellnessFormRouter, the state never re-hydrates.

**Fix:** In `DosingSessionPhase.tsx` — after Phase 1 form closes/saves, force a re-read of medication state by listening to `ppn:phase1-saved` custom event (already dispatched by WellnessFormRouter) and re-running the medication read logic.

Additionally, confirm that `Phase1StepGuide.tsx` (line 132) also reads `ppn_patient_medications_names` — it does, with `mock_patient_medications_names` as fallback. This component is correct.

---

### BUG-3 (P1): Timeline missing dose entry for Session 2+ initial dose

**Observed:** Timeline shows Session 1 history (Ketamine dose, old rescue protocol) but NOT the new Psilocybin 10mg dose for Session 2.

**Likely cause:** The `LiveSessionTimeline` fetches by `sessionId`. The `ppn:dose-registered` event dispatch in `DosingSessionPhase.tsx` carries the `sessionId` in the event detail. If Session 2's UUID is not correctly threaded to the Timeline component's `sessionId` prop at the time of dose registration (race condition in session creation), the guard at line 297 (`if (evSessionId && evSessionId !== sessionId) return`) will silently drop the event.

**Fix:** Audit the session UUID thread from `WellnessFormRouter` → `DosingSessionPhase` → `LiveSessionTimeline` for Session 2. Verify that the `sessionId` prop is correctly resolved before the dose step completes. Add a fallback: if `sessionId` is null/undefined at dose-registration time, queue the event and dispatch it after `sessionId` resolves.

---

### BUG-4 (P1): Rescue Protocol Timeline entry shows wrong description / no details

**Observed:** Timeline shows `[RESCUE PROTOCOL] Session submitted and closed. Post-session assessment scores — MEQ: 0, EDI: 0, CEQ: 0.`

**Root cause:** The `session_completed` event type code maps to `[RESCUE PROTOCOL]` label in `EVENT_CONFIG` (line 61 of `LiveSessionTimeline.tsx`). This is a label collision — the Phase 3 session closeout writes a `session_completed` timeline entry (with the post-session description), and it is misrender as `[RESCUE PROTOCOL]`. The actual rescue protocol entry (written correctly by `WellnessFormRouter.handleRescueProtocolSave` with type `rescue-protocol`) may also be present but buried or not displayed.

**Fix 1:** Remove `session_completed` from the `[RESCUE PROTOCOL]` mapping in `EVENT_CONFIG`. It should map to `[CLOSE]` or `[SESSION COMPLETE]` label and use the green `CLOSE` color:
```ts
session_completed: { icon: <CheckCircle />, color: 'text-emerald-400 ...', symbol: '✓', label: '[SESSION CLOSED]' },
```

**Fix 2:** Verify `rescue-protocol` type is correctly dispatched via `ppn:session-event` in `WellnessFormRouter.tsx` line 489 — it is. The fix above (BUG-3 sessionId threading) may also resolve why the rescue protocol detail never appeared.

---

## Pillar

**Pillar:** Safety — medications are a P0 safety-critical data point for contraindication checking and practitioner awareness during dosing.

## Open Questions

- [ ] Should `session_completed` timeline entries always be labeled `[SESSION CLOSED]` with green emerald styling (preferred), or should it be hidden from the timeline entirely?
- [ ] For BUG-3: confirm whether the session UUID is definitely available before Step 1 (Dosing Protocol) completes — check `WellnessFormRouter` session creation sequence.
