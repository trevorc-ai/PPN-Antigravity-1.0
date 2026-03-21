---
description: Mandatory Phase 2 session regression checklist — run before any Phase 2 commit
---

# Phase 2 Session Regression Checklist

> **Who runs this:** INSPECTOR only, after BUILDER submits and before `/finalize_feature`.
> **When:** Required for ANY change to `DosingSessionPhase.tsx`, `ActiveSessionsContext.tsx`, `SessionPillCard.tsx`, `LiveSessionTimeline.tsx`, or any file that reads/writes `ppn_session_mode_*` or `ppn_session_start_*` localStorage keys.

---

## Pre-flight

Start the dev server and log in as a test practitioner before running any scenario.

```bash
npm run dev
```

---

## Scenario 1: Deep-Link Navigation (BUG-2 regression test)

This is the highest-risk scenario. Previously caused the timer to start before the practitioner tapped Start.

1. Open a real phase 2 session so the header timer chip appears.
2. Navigate away from the Wellness Journey (e.g., go to Dashboard).
3. Click the amber timer chip in the header.
4. **PASS:** Phase 2 loads in **preparation mode** (`ppn_session_mode_<uuid>` = `'pre'`). Timer reads `00:00:00`. The "Start Session" button is visible and enabled (if Dosing Protocol is complete).
5. **FAIL:** Phase 2 loads directly in live mode with a running timer — the bug is still present.

---

## Scenario 2: Hard Page Refresh Mid-Session (Recovery guard test)

This tests the legitimate recovery case the guard was built for.

1. Start a dosing session (tap Start — timer begins running).
2. Confirm `ppn_session_start_<uuid>` is set in DevTools → Application → LocalStorage.
3. Hard refresh the page (`Cmd+Shift+R` / `Ctrl+Shift+R`).
4. Navigate back to the Wellness Journey for that patient.
5. **PASS:** Phase 2 loads in live mode with the timer showing elapsed time from the original start. The session is correctly recovered.
6. **FAIL:** Phase 2 loads in pre-mode after a hard refresh (recovery guard not firing), OR loads in live mode without a running timer.

---

## Scenario 3: Multi-Patient Simultaneous Sessions (BUG-1 regression test)

This tests localStorage key isolation between concurrent sessions.

1. Start a dosing session for Patient A. Confirm the header chip shows the correct timer.
2. Without stopping Patient A, open a new Wellness Journey for Patient B. Do **not** start Patient B's session yet.
3. Navigate back to Patient A's Wellness Journey (via the header chip or direct URL).
4. **PASS:** Patient A's timer shows the correct elapsed time from when Patient A's Start was tapped. Patient B's Phase 2 still shows preparation mode.
5. **FAIL:** Patient A's timer shows an incorrect time (inherited from Patient B's key), OR Patient B's Phase 2 auto-enters live mode.

---

## Scenario 4: Force-Close Smoke Test

Verify the emergency panel still works after BUG-2 fix.

1. Open DevTools and manually delete `ppn_session_start_<uuid>` from localStorage while a session is live.
2. Hard refresh the page and navigate back to that session.
3. **PASS:** The component enters recovery mode and restores to live (since start key is absent = genuine hard-refresh scenario).
4. Alternatively: confirm the "Session Timer Running — No Active UI" emergency panel is visible when appropriate (mode=pre + real UUID + no local start key).

---

## INSPECTOR Sign-Off

All four scenarios must PASS before calling `/finalize_feature`. Document results as:

```
Scenario 1 (Deep-Link): PASS / FAIL
Scenario 2 (Hard Refresh): PASS / FAIL
Scenario 3 (Multi-Patient): PASS / FAIL
Scenario 4 (Force-Close): PASS / FAIL
```
