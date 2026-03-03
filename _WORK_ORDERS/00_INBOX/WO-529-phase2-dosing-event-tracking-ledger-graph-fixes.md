---
id: WO-529
title: "Phase 2 Dosing Session — Event Tracking: Ledger & Graph Fix (6 Bugs)"
owner: LEAD
status: 00_INBOX
filed_by: CUE
date: 2026-03-03
priority: P1
caution: HIGHLY_SURGICAL — double QA required (pre- and post-implementation)
review_chain: CUE (filed) → LEAD (triage & assign) → INSPECTOR (preliminary QA) → USER (approval) → LEAD (assign for execution)
files_touched:
  - src/components/wellness-journey/DosingSessionPhase.tsx
  - src/components/wellness-journey/SessionVitalsTrendChart.tsx
  - src/components/wellness-journey/WellnessFormRouter.tsx
  - src/services/clinicalLog.ts
no_schema_migration: true
depends_on: []
conflicts_with: WO-525 (shared files — see INSPECTOR Cross-Check section)
inspector_status: PENDING — awaiting LEAD assignment
user_approval_required: true
---

==== CUE ====

## CUE Filing: Phase 2 Dosing Session Event Tracking

> **Work Order:** WO-529 — Phase 2: Live Ledger & Graph Event Tracking Fixes
> **Filed by:** CUE (sourced from full source-code audit, 2026-03-03)
> **Date:** 2026-03-03
> **Review chain:** LEAD → INSPECTOR → USER before any implementation

> ⚠️ **CAUTION: HIGHLY SURGICAL.** This WO touches 4 files active in the live dosing session flow. Any regression here affects a practitioner mid-session. INSPECTOR must perform a complete blast-radius audit and pre-implementation QA pass before any agent is assigned. Double QA pass is mandatory.

> 🚫 **NO IMPLEMENTATION until LEAD has triaged, INSPECTOR has signed off, and USER has explicitly approved.**

---

## 1. Problem Statement

During a Phase 2 dosing session, six categories of practitioner and patient actions fail to appear in the Live Session Timeline (ledger) or the Session Vitals Trend Chart (graph). The bugs were identified in a full source-code audit on 2026-03-03. Every affected event type either writes to the database with no corresponding ledger entry, writes to localStorage only (never reaching the DB), or reaches the DB but is rendered blank in the ledger because a critical field is stripped at the service layer. The result is that the practitioner's live documentation view is materially incomplete and does not reflect the true clinical record of the session.

---

## 2. Target User + Job-To-Be-Done

A practitioner conducting a live Phase 2 dosing session needs every clinical action they take — adverse event logging, rescue protocol activation, patient observation updates, and companion-initiated patient states — to appear immediately in the Live Session Timeline so they have a single, accurate, real-time record of everything that occurred during the session without gaps.

---

## 3. Bug Inventory (Audit Findings)

All 6 bugs were identified through direct source-code inspection. Each is described with its root cause, the exact file and approximate line where the defect exists, impact, and the class of fix required.

---

### BUG-529-01 | Vitals Trend Chart Shows Mock Data Only — Never Real DB Vitals

- **File:** `src/components/wellness-journey/SessionVitalsTrendChart.tsx`
- **Approximate lines:** 98–129
- **Root cause:** The `useEffect` that populates the chart is hardcoded to generate and set 5 static mock `VitalsSnapshot` objects. The `sessionId` prop is received but never passed to any database fetch call. `getSessionVitals()` exists in `clinicalLog.ts` and is already importable but is never called from this component.
- **Impact:** Vitals entered via the Session Update Panel (HR/BP) are correctly saved to `log_session_vitals` in the database. However, the chart never reflects them. The practitioner always sees the same fabricated data for every session, regardless of what was actually logged.
- **Fix class:** Replace the mock-only `useEffect` with a real `getSessionVitals(sessionId)` fetch. Fall back to mock data only when the query returns zero rows (i.e., no vitals have been entered yet). Add a 30-second poll on the same fetch to pick up vitals logged during the session without requiring a page reload.
- **No schema change required.**

---

### BUG-529-02 | `createTimelineEvent` Strips `metadata` Field — All Ledger Entries Show "No Description"

- **File:** `src/services/clinicalLog.ts`
- **Approximate lines:** 406–416 (inside `createTimelineEvent`)
- **Root cause:** The `createTimelineEvent` function explicitly omits the `metadata` field from the Supabase insert, citing the comment `// metadata: intentionally omitted — no free-text JSON blobs in log tables`. However, `metadata` is a structured JSONB column (`log_session_timeline_events.metadata`) that stores `{ event_description, notes }` — controlled-vocabulary clinical shorthand authored by the practitioner, not patient-identifying information. Its omission causes every timeline event to be written to the DB with a null `metadata`, which the `LiveSessionTimeline` component then reads back as `"No description provided"` on every single ledger row.
- **Impact:** Every ledger entry — whether from the quick-action buttons, free-text notes, or the Session Timeline Form — displays "No description provided" as its description. The timeline is functionally blind. The event type icons display correctly, but the content of every entry is lost.
- **PHI safety confirmation:** `event_description` here is practitioner-authored shorthand such as `"Administered additional dose."` or `"Patient spoke: feeling warm."` This is not PHI. It is clinically equivalent to the `notes` field already present in `metadata` objects passed from `WellnessFormRouter.handleTimelineSave` (line 272 of `WellnessFormRouter.tsx`), which is also currently stripped by this bug.
- **Fix class:** Re-enable the `metadata` field pass-through in the Supabase insert. One line of change (remove the comment-disabled field).
- **No schema change required.** The `metadata` column already exists and accepts JSONB.

---

### BUG-529-03 | Safety & Adverse Event Form — DB Write Only, No Ledger Entry

- **File:** `src/components/wellness-journey/WellnessFormRouter.tsx`
- **Approximate lines:** 239–250 (`handleSafetyEventSave`)
- **Root cause:** When the practitioner submits the Safety & Adverse Event form, `handleSafetyEventSave` correctly calls `createSessionEvent()`, which writes a row to `log_safety_events`. However, no `createTimelineEvent()` call follows. The event is never written to `log_session_timeline_events`, so it never appears in the `LiveSessionTimeline` ledger.
- **Impact:** Adverse events are clinically recorded in the database but are permanently invisible in the live timeline. The practitioner receives a success toast but sees nothing appear in the ledger below. Cross-session auditors viewing the timeline see no trace of adverse events.
- **Fix class:** After the existing `createSessionEvent()` call succeeds, add a single `createTimelineEvent()` call that writes a `safety_event` type entry to the ledger with a structured description (e.g., `"Adverse event logged: Nausea/Vomiting (Grade 2)"`).
- **No schema change required.**

---

### BUG-529-04 | Rescue Protocol Form — DB Write Only, No Ledger Entry

- **File:** `src/components/wellness-journey/WellnessFormRouter.tsx`
- **Approximate lines:** 252–261 (`handleRescueProtocolSave`)
- **Root cause:** Identical pattern to BUG-529-03. `handleRescueProtocolSave` calls `createSessionEvent()` to write to `log_safety_events` but does not call `createTimelineEvent()`. Additionally, on line 258, the `intervention_type_id` field is set to `undefined` unconditionally (`data.intervention_type ? undefined : undefined`), which is a dead-code branch that always writes `undefined` regardless of what the practitioner selected. This is a secondary data quality defect within the same function.
- **Impact:** Rescue protocol activations are invisible in the live timeline. Practitioners have no ledger confirmation that a rescue was logged.
- **Fix class:** Same as BUG-529-03 — add a `createTimelineEvent()` call after the existing `createSessionEvent()` succeeds, using event type `clinical_decision` and a structured description (e.g., `"Rescue protocol activated: Chemical Rescue (Benzo)"`). Additionally, fix the dead-code branch on `intervention_type_id`.
- **No schema change required.**

---

### BUG-529-05 | Session Update Panel — Observations Are Local-Only, Never Persisted

- **File:** `src/components/wellness-journey/DosingSessionPhase.tsx`
- **Approximate lines:** 273–307 (`handleSaveUpdate`) and 975 (UI hint text)
- **Root cause:** The Session Update Panel collects four observation fields: Patient Affect, Responsiveness, Physical Comfort, and a free-text Note. When saved, only the HR/BP vitals fields trigger a `createSessionVital()` DB write (conditionally, if vitals were entered). The four observation fields are written only to the local `updateLog` React state array. The UI even informs the practitioner of this with the hint: `"Session-local only — exported with session summary. Not logged to the database."` This was intentional during initial development but is clinically unacceptable — a page refresh destroys all observations with no recovery.
- **Impact:** Every Session Update observation (affect, responsiveness, comfort, note) is permanently lost if the page is refreshed or a new browser tab opens. Collaborative practitioners cannot see updates from the other's device. The ledger never reflects what the patient's state was at any given moment during the session.
- **Fix class:** After the existing vitals DB write, add a `createTimelineEvent()` call that constructs a structured description from the non-empty observation fields (e.g., `"Affect: Calm · Resp: Eyes closed, calm · Comfort: Normal, no complaints · Patient appears settled"`) and writes it as a `patient_observation` event. The local `updateLog` React state is retained for the same-tab in-page log below the panel. Update the hint text to reflect the new persistent behavior.
- **Requires:** Import `createTimelineEvent` at the top of `DosingSessionPhase.tsx` (currently not imported). The `sessionId` used must be the real UUID from `journey.sessionId`, not `journey.session?.sessionNumber`, which is an integer — a UUID guard (`/^[0-9a-f]{8}-/` regex) must be applied before calling the timeline service.
- **No schema change required.**

---

### BUG-529-06 | Companion App Feeling Taps Are localStorage-Only, Never Persisted

- **File:** `src/components/wellness-journey/DosingSessionPhase.tsx`
- **Approximate lines:** 1135–1148 (Companion overlay button grid `onClick`)
- **Root cause:** When a patient taps a feeling button on the Companion overlay screen (Blissful, Peaceful, Anxious, etc.), the selection is written to `localStorage` under the key `companion_logs_<sessionId>`. No database write and no timeline event are triggered. The data exists only in the local browser cache and is discarded when the session storage is cleared.
- **Impact:** Patient-reported emotional states during the session are captured transiently and permanently lost. They cannot be reviewed post-session in the clinical record, exported, or cross-referenced with vitals data logged at the same time.
- **Fix class:** Alongside the existing `localStorage` write (which can remain for immediate same-tab display), add a `createTimelineEvent()` call using event type `patient_observation` and description `"Patient reported: <feeling label>"`. The `performed_by` field should identify the source as the patient/companion interface (e.g., `'Companion (Patient)'`).
- **UUID guard required** — same as BUG-529-05: only call the service if `journey.sessionId` passes the UUID format check.
- **No schema change required.**

---

## 4. Files to Be Modified

| File | Bugs Fixed | Nature of Change |
|---|---|---|
| `src/components/wellness-journey/SessionVitalsTrendChart.tsx` | BUG-529-01 | Replace mock-only effect; add real DB fetch + 30s poll |
| `src/services/clinicalLog.ts` | BUG-529-02 | Restore `metadata` pass-through in `createTimelineEvent` (1 line restored) |
| `src/components/wellness-journey/WellnessFormRouter.tsx` | BUG-529-03, BUG-529-04 | Two `createTimelineEvent` calls added after existing safety/rescue saves |
| `src/components/wellness-journey/DosingSessionPhase.tsx` | BUG-529-05, BUG-529-06 | `createTimelineEvent` import added; two call sites added (Session Update, Companion) |

**No new files. No schema migrations. No RLS changes.**

---

## 5. INSPECTOR Cross-Check: WOs 520–528

INSPECTOR must confirm all of the following before assigning this WO to any agent.

### WO-520 | Patient Report Accordion A11y Fix
- **Files:** `PatientReport.tsx`
- **Conflict:** ❌ None. Disjoint file.

### WO-521 | Patient Report Accordion Approve
- **Files:** `PatientReport.tsx`
- **Conflict:** ❌ None. Disjoint file.

### WO-522 | Patient Report Journey Heading Gradient
- **Files:** `PatientReport.tsx`
- **Conflict:** ❌ None. Disjoint file.

### WO-523 | Patient Report Color Correction & A11y Audit
- **Files:** `PatientReport.tsx`
- **Conflict:** ❌ None. Disjoint file.

### WO-524 | TopHeader Active Session Timer Chips
- **Files:** `TopHeader.tsx`, timer state
- **Conflict:** ⚠️ LOW. WO-524 reads session timer state from localStorage (`ppn_session_mode_*`). WO-529 does not modify localStorage session state keys. However, INSPECTOR should confirm WO-524's implementation does not subscribe to `log_session_timeline_events` in a way that would conflict with BUG-529-02's metadata fix (i.e., if WO-524 reads `metadata.event_description` from real events, it will now receive populated data instead of null — this is additive and safe, but should be verified).

### WO-525 | Multi-Practitioner Notes: `performed_by` + Realtime
- **Files:** `LiveSessionTimeline.tsx`, `WellnessFormRouter.tsx`
- **Conflict:** 🔴 **HIGH — DIRECT FILE OVERLAP.**
  - WO-525 modifies `LiveSessionTimeline.tsx` to replace `performed_by: 'Current Clinician'` with a resolved `auth.uid()`, and replaces the 30-second poll with a Supabase Realtime subscription.
  - WO-529 modifies `WellnessFormRouter.tsx` to add `createTimelineEvent()` calls in `handleSafetyEventSave` and `handleRescueProtocolSave`.
  - **Resolution required by LEAD:** These WOs must be sequenced or merged. **Recommended order: WO-525 ships first** (it is already CONDITIONALLY_APPROVED by INSPECTOR). WO-529's `WellnessFormRouter.tsx` changes should then be applied to the WO-525-updated codebase. INSPECTOR must verify that the `createTimelineEvent` calls added by WO-529 pass the resolved `auth.uid()` as `performed_by` — not a hardcoded string — to be consistent with WO-525's attribution fix. This requires a small amendment to the WO-529 implementation brief (the `performed_by: 'Current Clinician'` placeholder in the diffs above must be replaced with the resolved UID approach from WO-525).
  - **Additionally:** WO-525 replaces the 30-second poll in `LiveSessionTimeline.tsx` with a Realtime subscription. BUG-529-01 adds a separate 30-second poll **in `SessionVitalsTrendChart.tsx`** (a different component, fetching from `log_session_vitals`, not `log_session_timeline_events`). These are non-conflicting polls on different tables in different components. No merge needed for the chart poll.

### WO-526 | RLS Policy Correction: `log_session_timeline_events`
- **Files:** Supabase SQL (RLS policy only, no application code)
- **Conflict:** ⚠️ **DEPENDENCY.** WO-526 tightens the INSERT policy on `log_session_timeline_events` to require `authenticated` role + site membership in `log_user_sites`. WO-529 adds new `createTimelineEvent()` call sites to `DosingSessionPhase.tsx`. If WO-526 ships before WO-529, the new call sites in WO-529 will correctly operate under the new authenticated policy (the app is always called from an authenticated context). **WO-526 must ship before or concurrently with WO-529 — never after.** An unauthenticated insert path must not be created and then closed weeks later.

### WO-527 | Practitioner Enrollment: `log_user_sites`
- **Files:** Practitioner enrollment UI, `log_user_sites` table data
- **Conflict:** ⚠️ **DEPENDENCY** (same as WO-526). WO-526's new INSERT policy references `log_user_sites`. WO-529 relies on WO-526's policy. Therefore WO-527's data (practitioner enrollment) must exist before either WO-526 or WO-529 can be meaningfully tested. **Recommended ship order: WO-527 → WO-526 → WO-525 → WO-529.**

### WO-528 | Patient Session Kit: Token-Gated Patient Hub
- **Files:** New route `/patient/:token`, new component, possibly `log_clinical_records` extension
- **Conflict:** ❌ None. WO-528 explicitly calls out in its Out of Scope: `"Any changes to WellnessJourney.tsx or DosingSessionPhase.tsx"`. No overlap with WO-529.

---

## 6. Success Metrics

1. After logging a Session Update with affect/responsiveness/comfort fields, a `[OBSERVATION]` entry appears in the `LiveSessionTimeline` ledger within 5 seconds — confirmed by INSPECTOR browser test.
2. After submitting the Safety & Adverse Event form, a `[SAFETY]` entry appears in the `LiveSessionTimeline` ledger within 5 seconds — confirmed by INSPECTOR browser test.
3. After activating the Rescue Protocol form, a `[DECISION]` entry appears in the `LiveSessionTimeline` ledger within 5 seconds — confirmed by INSPECTOR browser test.
4. After tapping a feeling on the Companion screen, a `[OBSERVATION]` entry attributed to `"Companion (Patient)"` appears in the ledger — confirmed by INSPECTOR browser test.
5. The Session Vitals Trend Chart displays real data from `log_session_vitals` when the session has recorded vitals, and falls back to mock data when it has none — confirmed by Supabase dashboard vs. chart comparison.
6. All existing ledger entries (quick-action notes, free-text notes) display their description text (not `"No description provided"`) — confirmed by INSPECTOR reviewing `log_session_timeline_events.metadata` in the Supabase dashboard.

---

## 7. Out of Scope

- Changes to `SessionVitalsForm.tsx`, `SessionObservationsForm.tsx`, `SessionTimelineForm.tsx`, or any Phase 1/Phase 3 forms
- Changes to `LiveSessionTimeline.tsx` UI layout or rendering (WO-525 owns those changes)
- Changes to `PatientCompanionPage.tsx` (separate patient-facing companion route, not the practitioner dosing overlay)
- Any new Supabase tables, columns, or RLS policies
- Analytics page, Patient Galaxy, Benchmark Intelligence, or any non-Phase-2 surface
- The `performed_by` attribution fix (owned by WO-525; WO-529 only requires that WO-529's new call sites use the same resolved-UID approach that WO-525 establishes)

---

## 8. Priority Tier

**[x] P1** — Ship this sprint, after WO-527 (practitioner enrollment), WO-526 (RLS fix), and WO-525 (Realtime + attribution) have shipped.

**Reason:** This WO fixes event tracking gaps in the live dosing session — the highest-acuity workflow in the entire platform. Incomplete ledger entries undermine the practitioner's ability to document a session accurately, which is the core mission of PPN. These are not cosmetic defects; they are documentation integrity failures.

---

## 9. Mandatory Pre-Implementation QA Pass (INSPECTOR)

Before any agent writes a single line of code, INSPECTOR must run the following **baseline capture** to confirm each bug is real and reproducible:

- [ ] **BUG-529-01:** Open a live Phase 2 session. Log a Session Update with HR=88 BP=120/80. Observe that the `SessionVitalsTrendChart` does not change. Then check `log_session_vitals` in Supabase for the new row. Confirm mismatch.
- [ ] **BUG-529-02:** Open a live Phase 2 session. Use the LiveSessionTimeline quick-action "Patient Spoke" button. Close and reopen the session page. Confirm the ledger entry shows `"No description provided"`. Then check `log_session_timeline_events.metadata` in Supabase and confirm it is null.
- [ ] **BUG-529-03:** Open a live Phase 2 session. Submit the Safety & Adverse Event form. Confirm no entry appears in `LiveSessionTimeline`. Check `log_safety_events` in Supabase and confirm the row was written.
- [ ] **BUG-529-04:** Open a live Phase 2 session. Submit the Rescue Protocol form. Confirm no entry appears in `LiveSessionTimeline`. Check `log_safety_events` in Supabase and confirm the row was written.
- [ ] **BUG-529-05:** Open a live Phase 2 session. Log a Session Update with Affect="Calm" and a note. Confirm no entry appears in `LiveSessionTimeline`. Refresh the page. Confirm the observation is gone from the in-page panel.
- [ ] **BUG-529-06:** Open a live Phase 2 session. Open the Companion overlay and tap "Blissful". Close the overlay. Confirm no entry appears in `LiveSessionTimeline`. Check `log_session_timeline_events` in Supabase and confirm no row was written.

---

## 10. Mandatory Post-Implementation QA Pass (INSPECTOR)

After implementation, INSPECTOR must re-run all 6 baseline checks and confirm each bug is resolved:

- [ ] BUG-529-01 resolved: Chart reflects real `log_session_vitals` data
- [ ] BUG-529-02 resolved: Ledger entries show their descriptions (not "No description provided"); `metadata` column non-null in Supabase
- [ ] BUG-529-03 resolved: Adverse Event form submission produces `[SAFETY]` ledger entry
- [ ] BUG-529-04 resolved: Rescue Protocol form submission produces `[DECISION]` ledger entry
- [ ] BUG-529-05 resolved: Session Update observations produce `[OBSERVATION]` ledger entry; survive page refresh
- [ ] BUG-529-06 resolved: Companion feeling tap produces `[OBSERVATION]` ledger entry attributed to "Companion (Patient)"
- [ ] Zero TypeScript compilation errors introduced
- [ ] No regression on Phase 1 or Phase 3 form saves
- [ ] No regression on `LiveSessionTimeline` quick-action notes or free-text note submission
- [ ] `performed_by` on new WO-529 ledger entries uses the resolved `auth.uid()` approach (consistent with WO-525; not a hardcoded string)

---

## INSPECTOR Sign-Off Checklist (To Be Completed by INSPECTOR After LEAD Assignment)

> ℹ️ This section is a pre-drafted template by CUE. It must be completed by INSPECTOR after LEAD assigns this WO. INSPECTOR may add, remove, or amend items.

- [ ] All 6 bugs confirmed reproducible via pre-implementation baseline QA pass (Section 9)
- [ ] Blast-radius audit performed across all 4 affected files and all downstream consumers
- [ ] WO-525 file-overlap conflict reviewed; sequencing decision documented and communicated to LEAD
- [ ] WO-526 dependency confirmed — RLS fix ships before or with WO-529
- [ ] WO-527 dependency confirmed — practitioner enrollment data exists for integration testing
- [ ] No schema migration required — confirmed by INSPECTOR code review
- [ ] `performed_by` approach aligned with WO-525 output before implementation brief is finalized
- [ ] INSPECTOR sign-off delivered to USER before any agent begins implementation

==== CUE ====

---

## ✅ INSPECTOR + USER Directives — 2026-03-03

### USER Surgical Scope Directive (Non-Negotiable)
> "Strictly surgical. 100% defined scope. Builder must NOT clean up extra code or make any changes outside the explicit bug fix lines. If something looks wrong but is outside scope, file a new WO."

INSPECTOR formally adopts this as a hard constraint for WO-529. BUILDER receives this as:
- **Touch only the exact lines identified per bug number**
- **No refactoring. No tidying. No opportunistic fixes.**
- If you see a problem outside scope → note it in chat, do not touch it

### Updated Dependency List (Resolved)
Depends on (in order):
1. ✅ WO-530 complete (timestamps fixed — `dose_administered_at`, `recorded_at`, etc. now TIMESTAMPTZ)
2. 🔒 WO-527 — practitioner enrollment (must have data for `performed_by` testing)
3. 🔒 WO-526 — RLS fix (must be live before adding new write paths)
4. 🔒 WO-525 — `performed_by` fix (WO-529 inherits the `auth.uid()` approach from WO-525)

### Pre-Implementation QA (Section 9) is Mandatory
USER confirmed they will test every portion of every step in a live staging session before any code is written. BUILDER must not begin until INSPECTOR confirms QA pass.

### INSPECTOR Status
All 6 bugs confirmed:
- Bug 529-01: Mock vitals data confirmed (SessionVitalsTrendChart.tsx — hardcoded `useEffect`)
- Bug 529-02: Metadata stripped from createTimelineEvent (clinicalLog.ts — intentionally omitted)
- Bug 529-03: Safety events not in ledger (WellnessFormRouter.tsx — handleSafetyEventSave)
- Bug 529-04: Rescue protocol not in ledger (WellnessFormRouter.tsx — handleRescueProtocolSave)
- Bug 529-05: Observations local-only — PENDING live QA confirmation
- Bug 529-06: Companion log localStorage-only — PENDING live QA confirmation
