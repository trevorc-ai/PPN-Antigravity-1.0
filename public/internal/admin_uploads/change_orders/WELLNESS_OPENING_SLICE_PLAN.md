# Wellness Journey — Opening Slice: File-by-File Plan

**Objective:** Mobile-optimize and reconnect only the opening Wellness Journey slice (Start Session modal, New/Existing/Most Recent/Scan flows, parent session creation, Preparation shell). No schema changes, no migrations, no Phase 2/3 work, no broad redesign.

**Source-of-truth:** REBUILD SQL Implementation Plan 3-8-26, REBUILD UI Field Map 3-8-26, Phase 0 Wellness Journey Setup Elements, ppn_master_plan_cursor_ui_reconnection. (REBUILD_Db_Dict_* and Phase_1_Preparation referenced if present.)

**Locked architecture:** `log_patient_site_links` = canonical patient identity; patient selection must resolve `patient_uuid`, `patient_link_code`, and `site_id` first; `log_clinical_records` = parent session row; session creation only after canonical patient resolution; no readable patient code in UUID fields.

---

## 1. File-by-file plan

| File | Change |
|------|--------|
| **src/components/wellness-journey/PatientSelectModal.tsx** | (1) Reorder and prioritize: New Patient, Existing Patient, Most Recent, Scan Patient Label as primary (full-width vertical cards, large tap targets); demote Practice Session and Phantom Shield (smaller/secondary or collapsible). (2) Preload patients on mount when view is `choose` so Most Recent is populated without opening Existing first. (3) Sticky bottom CTA area for primary actions on mobile. (4) Ensure min touch target 44px; full-width cards on mobile. (5) Hide QA-only controls on production mobile (none currently in this component). |
| **src/pages/WellnessJourney.tsx** | (1) Resolve `site_id` before opening session flow; fail clearly (toast + console) if `getCurrentSiteId()` returns null when user selects a non-TEST patient. (2) Do not call `createClinicalSession` until site_id and (for identity) patient resolution are confirmed. (3) Add temporary debug logging: log final payloads for identity resolution and session creation; log when site_id or patient_uuid resolution fails. (4) Patient context bar: keep compressed sticky bar; ensure mobile-friendly. (5) Hide QA Fast-Forward button on production build when viewport is mobile (e.g. `import.meta.env.PROD` or media query so it does not show on small screens in production). |
| **src/services/clinicalLog.ts** | (1) Add temporary debug logs: immediately before insert, log the exact payload for `createClinicalSession` (table name, all keys, non-UUID values; redact or truncate UUIDs if desired). (2) Ensure payload uses only schema-accurate fields: `practitioner_id`, `site_id`, `patient_link_code_hash`, `patient_uuid`, `session_date`. (3) On failure, log full Supabase error and a single-line user-facing message. (4) No schema or migration changes. |
| **src/services/identity.ts** | (1) Add temporary debug logging: log inputs and outcome of `getOrCreateCanonicalPatientUuid` (resolved vs created, patient_uuid prefix). (2) When `getCurrentSiteId()` returns null, ensure callers can detect and surface "Site not resolved" without claiming success. (3) No changes to resolution logic beyond logging. |
| **src/components/wellness-journey/Phase1StepGuide.tsx** | (1) On mobile (e.g. `sm:` breakpoint), use single-column full-width vertical cards for Preparation steps (already `grid-cols-1` on small; confirm cards are full-width and tap targets ≥44px). (2) No change to step content or Phase 2/3. |

**Files not changed in this slice:** ProtocolConfiguratorModal (workspace/configurator), WellnessFormRouter, SlideOutPanel, DosingSessionPhase, IntegrationPhase, identity resolution logic (except logging), any migration or schema file.

---

## 2. Risks and schema mismatches

- **patient_link_code_hash vs patient_link_code:** `log_clinical_records` uses `patient_link_code_hash`; `log_patient_site_links` uses `patient_link_code`. Existing-patient list is keyed by `patient_link_code_hash` from `log_clinical_records`. `getOrCreateCanonicalPatientUuid(patientLinkCode, siteId)` looks up/inserts by `patient_link_code`. If in production `patient_link_code_hash` stores a true hash and `patient_link_code` stores the readable PT- code, then passing the hash as `patientId` into `createClinicalSession` → `getOrCreateCanonicalPatientUuid` would look up the wrong value and could create a duplicate link. **Mitigation:** Document this in the plan; do not change schema. If production uses the same value in both columns (e.g. readable code in both), no change. If not, a follow-up task should resolve `patient_uuid` from the most recent `log_clinical_records` row for the selected patient instead of re-calling `getOrCreateCanonicalPatientUuid` with the hash.
- **site_id required:** If `getCurrentSiteId()` returns null, session creation must not claim success. Current code already falls back to a random session UUID and logs; we will add explicit user-facing failure (toast) and ensure no ghost-save.
- **TEST sessions:** No DB writes for TEST-* patients; no `patient_uuid` in journey state. Acceptable; document as intentional.
- **log_patient_intake:** Medication load for existing patients queries `log_patient_intake` by `patient_link_code_hash`. If that table or column is missing, the query may fail; we do not invent storage—we catch and log, and leave medications empty (existing behavior).

---

## 3. Implementation

### 3.1 PatientSelectModal.tsx

- **Order of blocks (choose view):**  
  1) New Patient (full-width card, primary).  
  2) Existing Patient (full-width card).  
  3) Most Recent (full-width card; enabled only when `patients.length > 0`, else disabled with "No prior sessions").  
  4) Scan Patient Label (full-width card or collapsible section, teal).  
  5) Practice Session (full-width but visually demoted, e.g. smaller text or moved below).  
  6) Footer: Back; Phantom Shield as small text/link (demoted).

- **Preload for Most Recent:** In `useEffect`, when `view === 'choose'`, call `fetchPatients()` once on mount so `patients[0]` is available for Most Recent without switching to Existing.

- **Touch and layout:** All primary cards `min-h-[48px]` or equivalent; use `py-4` / `p-4` for tap targets. On small screens use `w-full` and single-column layout (no side-by-side that shrinks tap area).

- **Sticky bottom (mobile):** Optional: wrap the primary action cards in a scrollable area and add a sticky bottom bar with a single “Start session” hint or leave as-is if the cards themselves are the CTAs. Current design has no single “Start Session” in the choose view (each card navigates). So no new sticky CTA in choose view; ensure Existing view’s Back button is sticky-friendly if needed.

### 3.2 WellnessJourney.tsx

- **Site resolution and failure:** In `handlePatientSelect`, after `const resolvedSiteId = await getCurrentSiteId()`: if `!isTestSession && !resolvedSiteId`, call `addToast({ title: 'Cannot start session', message: 'Site not found. Check your account settings.', type: 'error' })` and `console.error('[WellnessJourney] Cannot create session: site_id not resolved.')`. Do not set `sessionId` from `createClinicalSession`; set `sessionId` to undefined and still set journey state so the UI shows the patient but with a clear error. Optionally set a transient “sessionError” state and show a banner.

- **Debug logging:** Before `createClinicalSession(patientId, resolvedSiteId)`, log: `[WellnessJourney] createClinicalSession input: patientId (prefix)=..., siteId (prefix)=..., isNew=...`. After the call, log: `[WellnessJourney] createClinicalSession result: success=..., sessionId=..., patientUuid=... or error=...`.

- **QA Fast-Forward:** Wrap the QA Skip to Ph3 button so it is hidden when `import.meta.env.PROD` is true, or when `import.meta.env.PROD && window.matchMedia('(max-width: 768px)').matches` so production mobile never shows it. Use a single condition to avoid layout shift (e.g. `hidden` class when PROD).

### 3.3 clinicalLog.ts

- **createClinicalSession:** Right before `supabase.from(...).insert([payload])`, add:
  `console.log('[clinicalLog] createClinicalSession payload (schema-accurate):', { table: TABLE_LOG_CLINICAL_RECORDS, practitioner_id: payload.practitioner_id, site_id: payload.site_id, patient_link_code_hash: (payload.patient_link_code_hash as string)?.substring?.(0, 12) + '…', patient_uuid: (payload.patient_uuid as string)?.substring?.(0, 8) + '…', session_date: payload.session_date });`
- Ensure payload object has only: `practitioner_id`, `site_id`, `patient_link_code_hash`, `patient_uuid`, `session_date`. Remove any other keys if present.
- On insert error, keep existing console.error; ensure no user-facing toast is triggered from inside clinicalLog (caller handles that).

### 3.4 identity.ts

- **getOrCreateCanonicalPatientUuid:** Already has console.log for resolve/create. Add one line at start: `console.log('[identity] getOrCreateCanonicalPatientUuid called', { patient_link_code_prefix: code.substring(0, 10) + '…', site_id_prefix: siteId?.substring(0, 8) + '…' });` and on success return add: `console.log('[identity] getOrCreateCanonicalPatientUuid result', { patient_uuid_prefix: resolved.substring(0, 8) + '…' });`.
- **getCurrentSiteId:** When `!data || data.length === 0`, already logs; no change except optional one-line summary for “no site_id resolved”.

### 3.5 Phase1StepGuide.tsx

- Ensure step cards use `w-full` and on mobile use a single column. Current grid: `grid-cols-1 sm:grid-cols-${...}` — ensure the template literal is valid (Tailwind may not generate `sm:grid-cols-2` dynamically). Prefer explicit classes, e.g. `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` so Preparation step cards are full-width on mobile.
- Buttons (Continue, Open, Amend): ensure `min-h-[44px]` or equivalent for touch.

---

## 4. Test checklist

- [ ] **New Patient:** Select New Patient → session creates; journey shows patientId and session; `createClinicalSession` debug log shows schema-accurate payload; `patient_uuid` and `session_date` present; no readable PT- code in `patient_uuid` field.
- [ ] **Existing Patient:** Open Existing → select a patient → session creates; same payload check; no duplicate `log_patient_site_links` row if same patient selected again (optional: check DB).
- [ ] **Most Recent:** With at least one prior session, Most Recent is enabled and one-tap selects that patient and creates session. With zero prior sessions, Most Recent is disabled and shows “No prior sessions”.
- [ ] **Scan Patient Label:** Flow opens (existing link/QR); no regression; no new persistence required in this slice.
- [ ] **Practice Session:** Select Practice Session → TEST-* id; no DB write for session; toast shows practice mode; no ghost-save.
- [ ] **Site missing:** With no `log_user_sites` row (or mocked null `getCurrentSiteId`), select New or Existing patient → user sees error toast; console shows “site_id not resolved”; no successful session insert.
- [ ] **Patient resolution failure:** If `getOrCreateCanonicalPatientUuid` fails (e.g. DB down), createClinicalSession returns failure; WellnessJourney logs and does not set sessionId to a random UUID without at least logging that session will not persist (current behavior may set random UUID; document or change to leave sessionId undefined and show banner).
- [ ] **Mobile:** Entry modal uses full-width vertical cards; tap targets ≥44px; patient bar is compressed/sticky; QA Fast-Forward not visible on production mobile.
- [ ] **Preparation shell:** Phase 1 step cards are full-width on mobile; Proceed to Phase 2 button works when all steps complete (unchanged).

---

## 5. Deferred items

- **Workspace Configuration / Protocol Configurator:** Out of scope for this slice; no changes to ProtocolConfiguratorModal persistence or layout.
- **New Patient Setup (demographics/intake):** ProtocolConfiguratorModal collects condition, age, weight, gender, smoking; stored in journey state only. No `log_patient_profiles` or `log_patient_indications` in this slice (no schema); any persistence of those fields is deferred. If a visible field is not backed by the locked schema, it remains UI-only and marked deferred (e.g. tooltip or doc).
- **Resolving patient_uuid from log_clinical_records for Existing:** If production uses different values for `patient_link_code_hash` vs `patient_link_code`, resolving `patient_uuid` from the selected session row instead of re-calling `getOrCreateCanonicalPatientUuid` is a follow-up.
- **Phase 2 / Phase 3:** No work in this slice.
- **Hash vs readable in patient_link_code_hash:** No migration or column change; document only.

---

## 6. Final insert/update payloads (reference)

**Patient identity (log_patient_site_links) — created in identity.getOrCreateCanonicalPatientUuid:**

- Insert: `{ patient_link_code: string (readable PT-...), site_id: uuid, patient_uuid: uuid }`. No other fields required for this slice.

**Parent session (log_clinical_records) — created in clinicalLog.createClinicalSession:**

- Insert: `{ practitioner_id: uuid, site_id: uuid, patient_link_code_hash: string, patient_uuid: uuid, session_date: 'YYYY-MM-DD' }`. All values from authenticated user and from getOrCreateCanonicalPatientUuid; session_date from `new Date().toISOString().split('T')[0]`. No readable patient code in `patient_uuid`; `patient_uuid` must be the UUID returned by identity.

**Fail clearly when:**

- `site_id` is null/empty when creating a session for a non-TEST patient → toast + console; do not insert session.
- `getOrCreateCanonicalPatientUuid` returns null → createClinicalSession returns `{ success: false, error }`; WellnessJourney should not set a sessionId from a random UUID and should surface an error (toast/banner).
