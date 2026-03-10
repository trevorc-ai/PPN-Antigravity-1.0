# Interactive Elements Audit — Wellness Journey Phase 1: Preparation

> **Scope:** 5 screenshots — Main Wellness Journey page + 4 Phase 1 step modals.
> **Status:** Read-only analysis. No code changes made.
> **Date:** 2026-03-08

---

## Screen 1 — Wellness Journey Main Page (Desktop Layout)

The primary session view. Shows the patient context bar, three-phase tab navigation, and the four-step Preparation kanban.

---

### Element 1.1 — Global Sidebar Navigation Links

| Field | Detail |
|---|---|
| **Labels** | Search, Dashboard, Analytics, My Protocols, Wellness Journey *(active)*, Interactions, Audit Logs, Download Center, Substance Library, Help & FAQ |
| **Type** | Navigation link list (single active state highlighted) |
| **Default State** | "Wellness Journey" is currently active (filled highlight + icon) |
| **Function** | Each link routes to a top-level application section. No data is written on navigation. |
| **DB Mapping** | Read-only routing. No writes. |
| **RLS** | All links visible to authenticated practitioners. Specific sections (e.g., Audit Logs, Analytics) may require elevated roles. |
| **Mobile Priority** | **High** — Must collapse into a bottom tab bar or hamburger/drawer on mobile. Permanent sidebar is desktop-only. |
| **Edge Cases** | "Wellness Journey" active state must update when navigating away. |

---

### Element 1.2 — ← Back Breadcrumb

| Field | Detail |
|---|---|
| **Label** | "← Back" (top-left breadcrumb) |
| **Type** | Ghost/text button (breadcrumb navigation) |
| **Default State** | Always visible on this page |
| **Function** | Returns to the previous screen (likely the patient or session list/dashboard). |
| **DB Mapping** | No DB interaction. |
| **RLS** | N/A |
| **Mobile Priority** | **Medium** — Covered by OS back gesture on mobile. |
| **Edge Cases** | Must not trigger if unsaved session data exists without a discard confirmation. |

---

### Element 1.3 — Patient Context Bar

| Field | Detail |
|---|---|
| **Displayed Data** | PATIENT ID: `PT-64GN7GCSLF` · Age: `55 yrs` · Gender: `Male` · Weight: `100 kg` · Treating: `PTSD` |
| **Type** | Read-only data display bar (non-interactive data badges) |
| **Default State** | Populated from session data. Read-only — no inline editing from this bar. |
| **Function** | Provides persistent patient context visible at all times during the session. The green status icon indicates session is active. |
| **DB Mapping** | Reads from `patients` table (`subject_id`, `age_years`, `gender_id FK`, `weight_kg`) and `patient_indications` (`indication_id FK`). |
| **RLS** | Scoped to `practitioner_id = auth.uid()`. Practitioner can only see their own patients. |
| **Mobile Priority** | **High** — Must be visible at all times but compressed (e.g., collapsible top bar or sticky chip strip). |
| **Edge Cases** | If patient data is incomplete, show placeholder ("—") rather than blank. |

---

### Element 1.4 — "Edit Config" Badge

| Field | Detail |
|---|---|
| **Label** | "Edit Config" (visible in patient context bar, right side) |
| **Type** | Small action badge / pill button |
| **Default State** | Always visible on the context bar |
| **Function** | Opens the Workspace Configuration modal (from previous audit, Screen 2) to allow the practitioner to change the active module set for this session. |
| **DB Mapping** | On save, updates `session_configs` (`workspace_type`, `module_selections`). |
| **RLS** | Practitioner can only modify their own session config. |
| **Mobile Priority** | **Low** — Infrequent mid-session action. Place behind an overflow/settings menu on mobile. |
| **Edge Cases** | Changing workspace config mid-session must not delete already-entered data from modules that are being deactivated. |

---

### Element 1.5 — "QA Skip to Ph…" Badge

| Field | Detail |
|---|---|
| **Label** | "QA Skip to Ph…" (truncated; likely "QA Skip to Phase 2" or similar) |
| **Type** | Pill button (QA/developer shortcut) |
| **Default State** | Visible; appears to be a QA/testing-only control |
| **Function** | Skips immediately to the next phase (Dosing Session) without completing Preparation steps. For QA and developer testing only. |
| **DB Mapping** | Likely sets session phase flags in the `sessions` table directly (e.g., `current_phase = 2`, bypassing step completion checks). |
| **RLS** | **Should be restricted to admin/QA roles only.** Must not be visible to standard practitioners in production. |
| **Mobile Priority** | **Low** — QA-only. Must be completely hidden in production. |
| **Edge Cases** | ⚠️ **Critical**: This button must be gated behind an `is_qa_mode = true` environment flag or role check. Accidental use in a live session would corrupt the session's phase integrity. |

---

### Element 1.6 — Phase Tabs (1 Preparation / 2 Dosing Session / 3 Integration)

| Field | Detail |
|---|---|
| **Labels** | "1 Preparation" *(active)*, "2 Dosing Session" *(with checkmark — completed or unlocked)*, "3 Integration" |
| **Type** | Tab navigation (3 tabs, single-active) |
| **Default State** | Tab 1 "Preparation" is active. Tab 2 shows a green checkmark icon, possibly indicating it's unlocked/navigable. Tab 3 appears accessible. |
| **Function** | Switches the main content panel between the three phases of the Wellness Journey. Phase progression is gate-controlled — later phases may require prior phase completion. |
| **DB Mapping** | Reads `sessions.current_phase` and `sessions.phase_completion_flags` (or equivalent) to determine active tab and which tabs are accessible. Navigation writes `sessions.current_phase`. |
| **RLS** | Scoped to practitioner's own session. |
| **Mobile Priority** | **High** — Must be accessible at all times, ideally as a sticky top segment control or bottom tab set. |
| **Edge Cases** | Tab 2/3 may be locked if prior steps are incomplete. Tapping a locked tab should show a tooltip/toast explaining what must be completed first. |

---

### Element 1.7 — Step Cards (Step 1–4 in Preparation)

| Field | Detail |
|---|---|
| **Labels** | Step 1: "Informed Consent" · Step 2: "Safety Check - Condit…" · Step 3: "Mental Health Screen…" · Step 4: "Set & Setting" |
| **Type** | Clickable step cards in a horizontal kanban layout |
| **Default State** | Step 1 shows a "Continue ▾" button (in progress). Steps 2–4 show "Open" (not started). All have "REQ" badges (required). Progress counter: 0/4. |
| **Function** | Tapping a step card or its "Open"/"Continue" button opens the corresponding step modal. Steps may unlock sequentially. |
| **DB Mapping** | Reads step completion state from `session_steps` or `session_progress` table (`step_id FK`, `status`, `completed_at`). |
| **RLS** | Scoped to practitioner's own session. |
| **Mobile Priority** | **High** — The core interaction loop. Must be full-width cards in a vertical scroll on mobile (not horizontal scroll). |
| **Edge Cases** | Steps marked "REQ" must be completed before "Start Session" or phase advancement is allowed. Handle partially-completed steps (the "Continue" state) gracefully. |

---

### Element 1.8 — "Continue ▾" Button (Step 1)

| Field | Detail |
|---|---|
| **Label** | "Continue ▾" |
| **Type** | Primary button with dropdown chevron |
| **Default State** | Visible on step cards that are in-progress |
| **Function** | Primary action: re-opens the step's modal to continue where the practitioner left off. The dropdown chevron (▾) likely reveals secondary options such as "Mark Complete," "Reset," or "View Summary." |
| **DB Mapping** | Reads and updates `session_steps` status. |
| **RLS** | Practitioner's own session only. |
| **Mobile Priority** | **High** — Primary tap target per step. |
| **Edge Cases** | If the step is already complete, this button should change to "Review" or "Edit." |

---

### Element 1.9 — "Export Report ▾" Button

| Field | Detail |
|---|---|
| **Label** | "↓ Export Report ▾" (bottom-right of content panel) |
| **Type** | Secondary button with dropdown |
| **Default State** | Visible; available at any time during the session |
| **Function** | Exports a clinical session report. The dropdown (▾) likely offers format options: PDF, CSV, or structured report. |
| **DB Mapping** | Reads from `sessions`, `session_steps`, `patients`, and associated data tables to compile the report. No writes. May log an `export_events` record for audit trail. |
| **RLS** | Practitioner can only export their own patient/session data. |
| **Mobile Priority** | **Low** — Export is an end-of-session or administrative action. Place in overflow menu on mobile. |
| **Edge Cases** | If session is incomplete, report must clearly indicate which steps are missing. |

---
---

## Screen 2 — "Set & Setting" Modal (Step 4)

Pre-session mindset and clinical observation assessment. All inputs use structured selectors — no free text.

---

### Element 2.1 — Patient Treatment Expectancy Slider

| Field | Detail |
|---|---|
| **Label** | "Patient Treatment Expectancy" — range slider (Low ↔ High, value: 60) |
| **Type** | Range slider (continuous, 0–100) |
| **Default State** | Set to `60` (shown mid-screen). Color gradient reflects score (red → yellow → green). |
| **Function** | Records the practitioner's assessment of the patient's treatment expectancy/confidence level. The value drives a live interpretive label: "Moderate Expectancy — Patient has moderate confidence in treatment. Continue building therapeutic alliance." |
| **DB Mapping** | Writes `treatment_expectancy_score` (Integer, 0–100) to `session_step_set_and_setting` or equivalent step table. |
| **RLS** | Scoped to practitioner's own session step. |
| **Mobile Priority** | **High** — Primary assessment input. Slider must be touch-friendly (large thumb, sufficient height). |
| **Edge Cases** | Live label must update as the slider moves. Define clear breakpoints: e.g., 0–33 = Low, 34–66 = Moderate, 67–100 = High. The color gradient is also a live indicator. |

---

### Element 2.2 — Expectancy Interpretive Banner

| Field | Detail |
|---|---|
| **Label** | *(Dynamic text)* "Moderate Expectancy. Patient has moderate confidence in treatment. Continue building therapeutic alliance." |
| **Type** | Read-only dynamic text banner (updates live based on slider value) |
| **Default State** | Updates based on slider value |
| **Function** | Provides a clinical decision-support hint to the practitioner based on the expectancy score. Informational only — not directly saved; its meaning is derived from the saved score. |
| **DB Mapping** | No direct DB write. Text is generated client-side from the `treatment_expectancy_score` value. |
| **RLS** | N/A (display-only) |
| **Mobile Priority** | **High** — Visible immediately below the slider. |
| **Edge Cases** | Must cover all score ranges with appropriate text. The amber/warning color implies clinical significance — consider a distinct style for very low scores (< 20). |

---

### Element 2.3 — Motivation Level Selector

| Field | Detail |
|---|---|
| **Label** | "MOTIVATION LEVEL" |
| **Type** | Single-select tag group (radio behavior) |
| **Options** | Low, Moderate, **High** *(selected)*, Very High |
| **Default State** | No default; "High" selected in screenshot |
| **Function** | Records the practitioner's clinical observation of the patient's motivation level pre-session. |
| **DB Mapping** | Writes `motivation_level_id FK` to `session_step_set_and_setting`. Options stored in `motivation_levels` reference table. |
| **RLS** | Scoped to practitioner's own session. |
| **Mobile Priority** | **High** — Core clinical input. Full-width 2×2 grid on mobile. |
| **Edge Cases** | Section is labeled "optional" — must be nullable in DB (`NULL` allowed). |

---

### Element 2.4 — Support System Selector

| Field | Detail |
|---|---|
| **Label** | "SUPPORT SYSTEM" |
| **Type** | Single-select tag group (radio behavior) |
| **Options** | None identified, Minimal, **Moderate** *(selected)*, Strong |
| **Default State** | No default; "Moderate" selected in screenshot |
| **Function** | Records the practitioner's assessment of the patient's social/support network quality. |
| **DB Mapping** | Writes `support_system_id FK` to `session_step_set_and_setting`. Options in `support_system_levels` reference table. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** |
| **Edge Cases** | Nullable (optional section). "None identified" is a clinically meaningful flag — analytics should treat this distinctly from NULL (not answered). |

---

### Element 2.5 — Prior Psychedelic Experience Selector

| Field | Detail |
|---|---|
| **Label** | "PRIOR PSYCHEDELIC EXPERIENCE" |
| **Type** | Single-select tag group (radio behavior) |
| **Options** | None, Minimal (1-2 times), **Some (3-5 times)** *(selected)*, Experienced (6+) |
| **Default State** | No default; "Some (3-5 times)" selected |
| **Function** | Records patient's prior exposure to psychedelic substances, used for risk assessment and dosing context. |
| **DB Mapping** | Writes `prior_experience_id FK` to `session_step_set_and_setting`. Options in `prior_experience_levels` reference table. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** |
| **Edge Cases** | Nullable. Must not allow free-text input — FK only. |

---

### Element 2.6 — Back Button (Set & Setting)

| Field | Detail |
|---|---|
| **Label** | "< Back" |
| **Type** | Ghost button |
| **Default State** | Always visible |
| **Function** | Returns to the previous step without saving current changes. |
| **DB Mapping** | No write unless a draft-save mechanism exists. |
| **RLS** | N/A |
| **Mobile Priority** | **Medium** |
| **Edge Cases** | Consider auto-saving draft state on Back to prevent data loss. |

---

### Element 2.7 — "Save & Exit" Button (Set & Setting)

| Field | Detail |
|---|---|
| **Label** | "→ Save & Exit" |
| **Type** | Secondary action button |
| **Default State** | Always visible |
| **Function** | Saves current form state as a draft and closes the modal, returning to the main Wellness Journey page. The step remains "in progress" (not marked complete). |
| **DB Mapping** | Upserts current field values to `session_step_set_and_setting` with `status = 'draft'`. Writes `updated_at = NOW()`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **Medium** — Important escape hatch during a live session. |
| **Edge Cases** | Must save all currently entered values even if the form is incomplete. Success toast should confirm save. |

---

### Element 2.8 — "Save & Continue" Button (Set & Setting)

| Field | Detail |
|---|---|
| **Label** | "✓ SAVE & CONTINUE ›" |
| **Type** | Primary CTA button |
| **Default State** | Enabled (no required fields in this step — all optional) |
| **Function** | Validates and saves all Set & Setting data, marks the step as complete, and advances to the next step or closes modal. |
| **DB Mapping** | Upserts all fields to `session_step_set_and_setting` with `status = 'complete'`, `completed_at = NOW()`. Updates `session_steps` progress. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Sticky floating CTA at bottom on mobile. |
| **Edge Cases** | Since all fields are optional, "Save & Continue" should always be enabled. No blocking validation required. |

---

### Element 2.9 — Close (×) Button (Set & Setting)

| Field | Detail |
|---|---|
| **Label** | "×" (top right) |
| **Type** | Icon button (modal dismiss) |
| **Default State** | Always visible |
| **Function** | Closes the modal without saving. Returns to the main Wellness Journey page. |
| **DB Mapping** | No write. Data entered since last save is lost. |
| **RLS** | N/A |
| **Mobile Priority** | **Medium** |
| **Edge Cases** | If unsaved changes exist, prompt: "You have unsaved changes. Save & Exit or Discard?" |

---

### Element 2.10 — "Request a feature or addition" Link

| Field | Detail |
|---|---|
| **Label** | "Request a feature or addition" (small link below subtitle) |
| **Type** | Inline text link |
| **Default State** | Always visible in modal headers |
| **Function** | Opens a feedback/feature request flow (likely a modal form or external link to a feedback tool). |
| **DB Mapping** | May write to a `feature_requests` table or trigger an external webhook. |
| **RLS** | Available to all authenticated practitioners. |
| **Mobile Priority** | **Low** — Rare action. Place in overflow or footer. |
| **Edge Cases** | None. |

---
---

## Screen 3 — "Informed Consent" Modal (Step 1)

The first and most legally critical step. Records consent acknowledgment and type — no consent document is stored in PPN.

---

### Element 3.1 — Patient ID "Copy" Button

| Field | Detail |
|---|---|
| **Label** | "Copy" (beside Patient ID `PT-64GN7GCSLF`) |
| **Type** | Inline action button (clipboard copy) |
| **Default State** | Always enabled |
| **Function** | Copies the anonymized patient ID to the clipboard so the practitioner can record it in their external paper trail or EHR. |
| **DB Mapping** | No DB write. Client-side clipboard operation only. May log a `clipboard_copy_event` for audit purposes. |
| **RLS** | N/A |
| **Mobile Priority** | **High** — Critical on mobile where practitioners need to transcribe or share the ID. |
| **Edge Cases** | Show a brief success state ("Copied!") after action to confirm. |

---

### Element 3.2 — Informed Consent Confirmation Checkbox

| Field | Detail |
|---|---|
| **Label** | "I confirm that informed consent has been obtained from the patient" |
| **Type** | Checkbox (single acknowledgment) |
| **Default State** | **Checked** in the screenshot. Unclear if it defaults to checked or requires practitioner action — **this warrants clarification.** |
| **Function** | Records the practitioner's attestation that informed consent was obtained. PPN logs the acknowledgment and timestamp only — no document is stored here. This is a legal compliance checkpoint. |
| **DB Mapping** | Writes `consent_acknowledged = TRUE` and `consent_acknowledged_at = NOW()` and `acknowledged_by_practitioner_id FK` to `session_step_informed_consent`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Legally required gate. Must be impossible to miss. |
| **Edge Cases** | ⚠️ **Critical**: This checkbox must **default to unchecked** and require a deliberate practitioner action. A pre-checked consent box negates its legal value. "Save Consent Documentation" button must be **disabled** until this box is explicitly checked. |

---

### Element 3.3 — Verification Date & Time Picker

| Field | Detail |
|---|---|
| **Label** | "Verification Date & Time *" (required, with `?` tooltip) |
| **Type** | Datetime picker input |
| **Default State** | Pre-populated with current date/time: `03/08/2026, 10:52 PM` |
| **Function** | Records the exact date and time the practitioner verified the consent. This timestamp is part of the clinical/legal record. |
| **DB Mapping** | Writes `consent_verified_at` (Timestamp with timezone) to `session_step_informed_consent`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Required field. Native datetime picker on mobile. |
| **Edge Cases** | Must default to `NOW()` but allow editing (e.g., if consent was obtained earlier in the day). Should not allow a future timestamp. The `?` tooltip should explain why this field is required. |

---

### Element 3.4 — Consent Type Multi-Select (4 colored cards)

| Field | Detail |
|---|---|
| **Label** | "Consent Type *" (required) |
| **Type** | Multi-select toggle cards (checkbox behavior) |
| **Options** | **Informed Consent** *(green, selected)*, **HIPAA Authorization** *(amber, selected)*, **Research Participation** *(purple, selected)*, **Photography / Recording** *(teal, selected)* |
| **Default State** | All 4 shown as **selected** in the screenshot (each has a checkmark). Unclear if this is the default or practitioner-set. |
| **Function** | Records which consent types were obtained from the patient in this session. Each card toggles independently (multi-select allowed). |
| **DB Mapping** | Writes to `session_consent_types` junction table (`session_step_id FK`, `consent_type_id FK`). Consent type definitions in `consent_types` reference table. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Required field. 2×2 card grid is mobile-friendly already. |
| **Edge Cases** | At least one consent type must be selected (required field). "Informed Consent" should arguably always be required/pre-selected as a non-removable default — confirm with product. De-selecting all should surface a validation error. |

---

### Element 3.5 — Back Button (Informed Consent)

| Field | Detail |
|---|---|
| **Label** | "< Back" |
| **Type** | Ghost button |
| **Default State** | Always visible |
| **Function** | Returns to the Wellness Journey main page without saving. |
| **DB Mapping** | No write unless auto-save is active. |
| **RLS** | N/A |
| **Mobile Priority** | **Medium** |
| **Edge Cases** | If checkbox is checked and date/types are filled, prompt about unsaved progress. |

---

### Element 3.6 — "Save & Exit" Button (Informed Consent)

| Field | Detail |
|---|---|
| **Label** | "→ Save & Exit" |
| **Type** | Secondary action button |
| **Default State** | Visible; enabled once checkbox is checked |
| **Function** | Saves the consent acknowledgment as a draft and exits the modal. Step not marked complete. |
| **DB Mapping** | Upserts `session_step_informed_consent` with `status = 'draft'`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **Medium** |
| **Edge Cases** | Should be disabled if the main consent checkbox is unchecked. |

---

### Element 3.7 — "Save Consent Documentation" Button

| Field | Detail |
|---|---|
| **Label** | "✓ SAVE CONSENT DOCUMENTATION ›" |
| **Type** | Primary CTA button |
| **Default State** | Should be **disabled** until all required fields are complete (checkbox + datetime + at least one consent type) |
| **Function** | Saves and finalizes the consent record. Marks Step 1 as complete. |
| **DB Mapping** | Upserts `session_step_informed_consent` with `status = 'complete'`, `completed_at = NOW()`. Updates `session_steps` progress counter (0/4 → 1/4). |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Sticky floating CTA at screen bottom. |
| **Edge Cases** | Gate: checkbox must be checked + date entered + ≥ 1 consent type selected. This record is immutable once saved — do not allow edits after completion (or log an amendment trail). |

---

### Element 3.8 — Close (×) Button (Informed Consent)

| Field | Detail |
|---|---|
| **Label** | "×" |
| **Type** | Icon button |
| **Default State** | Always visible |
| **Function** | Closes modal without saving. |
| **DB Mapping** | No write. |
| **RLS** | N/A |
| **Mobile Priority** | **Medium** |
| **Edge Cases** | If form has data, prompt discard confirmation. |

---
---

## Screen 4 — "Mental Health Screening" Modal (Step 3)

Administers psychometric and physiological baseline assessments, and captures safety-relevant clinical flags.

---

### Element 4.1 — PHQ-9 Score Dropdown (0–27)

| Field | Detail |
|---|---|
| **Label** | "PHQ-9 (0–27)" |
| **Type** | Dropdown / select (integer range) |
| **Default State** | Pre-populated with `10` |
| **Function** | Records the patient's PHQ-9 depression severity score. Used for baseline tracking and longitudinal analytics. |
| **DB Mapping** | Writes `phq9_score` (Integer, 0–27) to `session_step_mental_health_screening`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Core clinical data. Dropdown should become a bottom sheet picker on mobile. |
| **Edge Cases** | Enforce range 0–27. Labeled "optional (for testing)" — confirm if this remains optional in production. |

---

### Element 4.2 — GAD-7 Score Dropdown (0–21)

| Field | Detail |
|---|---|
| **Label** | "GAD-7 (0–21)" |
| **Type** | Dropdown / select (integer range) |
| **Default State** | Pre-populated with `10` |
| **Function** | Records the patient's GAD-7 anxiety severity score. |
| **DB Mapping** | Writes `gad7_score` (Integer, 0–21) to `session_step_mental_health_screening`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** |
| **Edge Cases** | Enforce range 0–21. Nullable if optional. |

---

### Element 4.3 — ACE Score Dropdown (0–10)

| Field | Detail |
|---|---|
| **Label** | "ACE (0–10)" |
| **Type** | Dropdown / select (integer range) |
| **Default State** | Pre-populated with `5` |
| **Function** | Records the patient's ACE (Adverse Childhood Experiences) score. |
| **DB Mapping** | Writes `ace_score` (Integer, 0–10) to `session_step_mental_health_screening`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** |
| **Edge Cases** | Enforce range 0–10. |

---

### Element 4.4 — PCL-5 Score Input (0–80)

| Field | Detail |
|---|---|
| **Label** | "PCL-5 (0–80)" |
| **Type** | Numeric text input (no dropdown visible — free entry with range constraint) |
| **Default State** | Pre-populated with `50` |
| **Function** | Records the patient's PCL-5 PTSD severity score. |
| **DB Mapping** | Writes `pcl5_score` (Integer, 0–80) to `session_step_mental_health_screening`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** |
| **Edge Cases** | Enforce range 0–80. Must accept only integers. |

---

### Element 4.5 — HRV Input (ms)

| Field | Detail |
|---|---|
| **Label** | "HRV (MS)" |
| **Type** | Numeric text input |
| **Default State** | Pre-populated with `55` |
| **Function** | Records baseline Heart Rate Variability in milliseconds. |
| **DB Mapping** | Writes `hrv_ms` (Integer or Decimal) to `session_step_mental_health_screening`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **Medium** — Physiological baseline, not always collected. |
| **Edge Cases** | Validate > 0. Reasonable clinical range (e.g., 5–250 ms). Nullable (optional section). |

---

### Element 4.6 — Systolic Blood Pressure Input

| Field | Detail |
|---|---|
| **Label** | "SYSTOLIC" |
| **Type** | Numeric text input |
| **Default State** | Pre-populated with `120` |
| **Function** | Records baseline systolic blood pressure (mmHg). |
| **DB Mapping** | Writes `systolic_bp` (Integer) to `session_step_mental_health_screening`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **Medium** |
| **Edge Cases** | Validate range (e.g., 60–250 mmHg). Nullable. |

---

### Element 4.7 — Diastolic Blood Pressure Input

| Field | Detail |
|---|---|
| **Label** | "DIASTOLIC" |
| **Type** | Numeric text input |
| **Default State** | Pre-populated with `80` |
| **Function** | Records baseline diastolic blood pressure (mmHg). |
| **DB Mapping** | Writes `diastolic_bp` (Integer) to `session_step_mental_health_screening`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **Medium** |
| **Edge Cases** | Validate range (e.g., 30–150 mmHg). Must be ≤ Systolic value. Nullable. |

---

### Element 4.8 — "Prior Adverse Events" Toggle

| Field | Detail |
|---|---|
| **Label** | "⚠ PRIOR ADVERSE EVENTS" |
| **Type** | Toggle switch (boolean) |
| **Default State** | **ON** (orange) in screenshot |
| **Function** | Flags that the patient has a history of prior adverse events with psychedelic treatment. When toggled ON, it **reveals** the "Primary Clinical Observation" and "Severity (CTCAE Grade)" dropdowns below. |
| **DB Mapping** | Writes `has_prior_adverse_events` (Boolean) to `session_step_mental_health_screening`. The conditional dropdowns write to the same table or a linked `session_adverse_events` record. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Safety-critical flag. Must be large and clearly visible. |
| **Edge Cases** | When toggled OFF, the conditional dropdowns must be hidden AND their values cleared/nulled in the DB. The orange color and warning icon (⚠) are appropriate — should remain even in hover/focus states. |

---

### Element 4.9 — Primary Clinical Observation Dropdown

| Field | Detail |
|---|---|
| **Label** | "PRIMARY CLINICAL OBSERVATION" |
| **Type** | Single-select dropdown |
| **Default State** | "Nausea / Vomiting" selected. **Conditionally visible** — only shown when "Prior Adverse Events" toggle is ON. |
| **Function** | Records the primary type of adverse event previously experienced. |
| **DB Mapping** | Writes `prior_adverse_event_type_id FK` to `session_step_mental_health_screening`. Options in `adverse_event_types` reference table. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Safety data when visible. |
| **Edge Cases** | Required if "Prior Adverse Events" is ON. Nulled when toggle is OFF. |

---

### Element 4.10 — Severity (CTCAE Grade) Dropdown

| Field | Detail |
|---|---|
| **Label** | "SEVERITY (CTCAE GRADE)" |
| **Type** | Single-select dropdown |
| **Default State** | "Grade 1, Mild (No Intervention)" selected. **Conditionally visible** — only shown when "Prior Adverse Events" toggle is ON. |
| **Function** | Records the severity grade of the prior adverse event using the standardized CTCAE grading system. |
| **DB Mapping** | Writes `prior_adverse_event_severity_id FK` to `session_step_mental_health_screening`. Options (Grade 1–5) in `ctcae_severity_grades` reference table. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Safety data when visible. |
| **Edge Cases** | Required if "Prior Adverse Events" is ON. Nulled when toggle is OFF. |

---

### Element 4.11 — "Additional Medications" Toggle

| Field | Detail |
|---|---|
| **Label** | "ADDITIONAL MEDICATIONS" |
| **Type** | Toggle switch (boolean) |
| **Default State** | **ON** (blue) in screenshot |
| **Function** | Reveals the medication multi-select picker when enabled. Flags that the patient is on concomitant medications relevant to safety/drug interactions. |
| **DB Mapping** | Writes `has_additional_medications` (Boolean) to `session_step_mental_health_screening`. Individual medications write to a `session_medications` junction table. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Safety-critical. |
| **Edge Cases** | When toggled OFF, the medication picker and all added medications must be cleared/nulled. |

---

### Element 4.12 — Medication Multi-Select Dropdown

| Field | Detail |
|---|---|
| **Label** | "Select Medication to Add…" |
| **Type** | Multi-select searchable dropdown / combobox (tag-based) |
| **Default State** | "Atenolol" already added as a tag. **Conditionally visible** when "Additional Medications" toggle is ON. |
| **Function** | Allows the practitioner to add one or more medications the patient is currently taking. Each added medication appears as a removable tag/chip below the dropdown. |
| **DB Mapping** | Writes to `session_medications` junction table (`session_step_id FK`, `medication_id FK`). Medications listed in `medications` reference table. **No free-text medication entry** — FK only. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Safety data when visible. Searchable dropdown must work well on mobile keyboard. |
| **Edge Cases** | If "Additional Medications" is toggled OFF, all medication tags must be removed and DB records nulled. The "× " on each tag removes that medication. Must not allow duplicate entries. |

---

### Element 4.13 — Back / Save & Exit / Save & Continue (Mental Health Screening)

_(Same pattern as Set & Setting — see Elements 2.6, 2.7, 2.8 above for full detail.)_

| Button | DB Action | Priority |
|---|---|---|
| Back | No write | Medium |
| Save & Exit | Upsert `status = 'draft'` | Medium |
| Save & Continue | Upsert `status = 'complete'`, advance step progress | High |

---
---

## Screen 5 — "Safety Check – Conditions Prior to Treatment" Modal (Step 2)

Structured safety monitoring tool. Records suicidality scores, active safety concerns, interventions taken, and follow-up scheduling. **Highest clinical risk surface in the entire flow.**

---

### Element 5.1 — Monitoring Date Picker

| Field | Detail |
|---|---|
| **Label** | "Monitoring Date" |
| **Type** | Date picker input |
| **Default State** | Pre-populated with current date: `03/08/2026` |
| **Function** | Records the specific date this safety check was conducted. Supports backdating (e.g., if logging after a call). |
| **DB Mapping** | Writes `monitoring_date` (Date) to `session_step_safety_check`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Required field. Native date picker on mobile. |
| **Edge Cases** | Should not allow future dates. |

---

### Element 5.2 — "Today" Shortcut Button

| Field | Detail |
|---|---|
| **Label** | "Today" |
| **Type** | Inline shortcut button (fills date field with current date) |
| **Default State** | Always visible next to the date input |
| **Function** | One-tap to set Monitoring Date to today's date. Speed shortcut for the most common case. |
| **DB Mapping** | Same as date picker — sets `monitoring_date = CURRENT_DATE`. |
| **RLS** | N/A |
| **Mobile Priority** | **High** — Excellent mobile shortcut; reduces keyboard interaction. |
| **Edge Cases** | None. |

---

### Element 5.3 — C-SSRS Score Selector (0–5)

| Field | Detail |
|---|---|
| **Label** | "C-SSRS Score (0–5)" with `?` tooltip |
| **Type** | Button group / segmented control (6 options: 0–5, single-select) |
| **Default State** | `2` selected (amber highlight) |
| **Function** | Records the Columbia Suicide Severity Rating Scale score. Each numeric value maps to a clinical severity level. Score drives risk stratification in analytics. |
| **DB Mapping** | Writes `cssrs_score` (Integer, 0–5) to `session_step_safety_check`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Safety-critical. Must be large, accessible touch targets. |
| **Edge Cases** | The `?` tooltip must clearly explain what each score level means (0 = No ideation, 5 = Attempt with intent to die). Higher scores (4–5) should ideally trigger a warning banner or mandatory Action selection. |

---

### Element 5.4 — Safety Concerns Multi-Select Grid

| Field | Detail |
|---|---|
| **Label** | "Safety Concerns" with `?` tooltip |
| **Type** | Multi-select toggle card grid (8 cards, 2 columns) |
| **Options (with severity badges)** | Medication non-compliance *(Moderate)*, Social isolation increase *(Moderate)*, Sleep disturbance worsening *(Moderate)*, Panic attacks *(Moderate)*, Substance use relapse *(High)*, Suicidal ideation increase *(Critical)*, Self-harm behavior *(Critical)*, Psychotic symptoms *(Critical)* |
| **Default State** | All 8 shown as **selected** in the screenshot. |
| **Function** | Records which active safety concerns are present at this check-in. Multi-select. Color coding (teal = Moderate, orange = High, red = Critical) communicates clinical urgency at a glance. |
| **DB Mapping** | Writes to `session_safety_concerns` junction table (`session_step_id FK`, `safety_concern_id FK`). Concern definitions in `safety_concerns` reference table with a `severity_level` column. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Safety-critical. 2-column card grid works on mobile. |
| **Edge Cases** | "Critical" concerns (Suicidal ideation, Self-harm, Psychotic symptoms) must trigger a mandatory require-action rule: if any Critical concern is selected, at least one "Immediate" Action must also be selected. The `?` tooltip must clarify severity definitions. |

---

### Element 5.5 — Actions Taken Multi-Select Grid

| Field | Detail |
|---|---|
| **Label** | "Actions Taken" with `?` tooltip |
| **Type** | Multi-select toggle card grid (7 cards, 2 columns) |
| **Options (with urgency badges)** | Hospitalization recommended *(Immediate)*, Emergency contact notified *(Immediate)*, Crisis hotline information provided *(Immediate)*, Referred to psychiatrist *(Urgent)*, Increased check-in frequency *(Urgent)*, Medication adjustment recommended *(Urgent)*, Additional therapy session scheduled *(Urgent)* |
| **Default State** | All 7 shown as **selected** in the screenshot. |
| **Function** | Records which clinical interventions were taken in response to identified safety concerns. Multi-select. Color coding (red = Immediate, amber = Urgent) mirrors severity of the actions. |
| **DB Mapping** | Writes to `session_safety_actions` junction table (`session_step_id FK`, `safety_action_id FK`). Action definitions in `safety_actions` reference table with an `urgency_level` column. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Safety-critical. |
| **Edge Cases** | As noted above: if any Critical safety concern is selected, at least one Immediate action must be selected before Save & Continue is enabled. |

---

### Element 5.6 — Follow-Up Required Selector

| Field | Detail |
|---|---|
| **Label** | "Follow-Up Required?" |
| **Type** | Binary toggle / button group (single-select) |
| **Options** | **Yes** *(selected, purple)*, No, Continue standard monitoring |
| **Default State** | "Yes" selected in screenshot |
| **Function** | Records whether a follow-up check-in is required for this patient. When "Yes" is selected, the "Schedule Follow-Up Within" interval selector is revealed below. |
| **DB Mapping** | Writes `followup_required` (Boolean) to `session_step_safety_check`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Clinically important outcome flag. |
| **Edge Cases** | When switched to "No", the follow-up interval selector must be hidden AND its value nulled. |

---

### Element 5.7 — Schedule Follow-Up Within Selector

| Field | Detail |
|---|---|
| **Label** | "Schedule Follow-Up Within:" |
| **Type** | Single-select button group (3 options) |
| **Options** | 24 hours, 3 days, **1 week** *(selected)* |
| **Default State** | "1 week" selected. **Conditionally visible** when "Follow-Up Required?" = Yes. |
| **Function** | Sets the recommended follow-up interval. Used to schedule or flag a reminder for the practitioner. |
| **DB Mapping** | Writes `followup_interval_id FK` or `followup_within_days` (Integer: 1, 3, 7) to `session_step_safety_check`. |
| **RLS** | Practitioner's own session. |
| **Mobile Priority** | **High** — Quick selection; full-width 3-option button group is touch-friendly. |
| **Edge Cases** | Nulled when "Follow-Up Required?" = No. Consider whether "24 hours" should auto-populate when a Critical safety concern is selected, as a clinical safety nudge. |

---

### Element 5.8 — Back / Save & Exit / Save & Continue (Safety Check)

_(Same pattern as other step modals.)_

| Button | DB Action | Priority |
|---|---|---|
| Back | No write | Medium |
| Save & Exit | Upsert `status = 'draft'` | Medium |
| Save & Continue | Upsert `status = 'complete'`, advance step progress | High |

> **Special Gate on Save & Continue:** If a Critical safety concern is selected but no Immediate action is recorded, the button should be disabled or surface a blocking validation warning.

---

## Summary Table

| Screen | Element | Type | DB Table | Mobile Priority |
|---|---|---|---|---|
| S1 | Sidebar Nav | Nav links | None (routing) | High |
| S1 | ← Back breadcrumb | Ghost button | None | Medium |
| S1 | Patient Context Bar | Read-only data display | `patients` (READ) | High |
| S1 | Edit Config badge | Pill button | `session_configs` | Low |
| S1 | QA Skip badge | Pill button (QA only) | `sessions` | Low (QA-only) |
| S1 | Phase Tabs (1/2/3) | Tab navigation | `sessions.current_phase` | High |
| S1 | Step Cards (1–4) | Clickable step cards | `session_steps` | High |
| S1 | Continue ▾ button | Primary + dropdown | `session_steps` | High |
| S1 | Export Report ▾ | Secondary + dropdown | READ aggregate | Low |
| S2 | Expectancy Slider | Range slider (0–100) | `treatment_expectancy_score` | High |
| S2 | Expectancy Banner | Dynamic text (read-only) | None (derived) | High |
| S2 | Motivation Level | Single-select tags | `motivation_level_id FK` | High |
| S2 | Support System | Single-select tags | `support_system_id FK` | High |
| S2 | Prior Psychedelic Experience | Single-select tags | `prior_experience_id FK` | High |
| S2 | Back | Ghost button | None | Medium |
| S2 | Save & Exit | Secondary button | draft upsert | Medium |
| S2 | Save & Continue | Primary CTA | complete upsert | High |
| S2 | Close (×) | Icon button | None | Medium |
| S2 | Request a feature link | Text link | `feature_requests` | Low |
| S3 | Copy Patient ID | Inline button | None (clipboard) | High |
| S3 | Consent Checkbox | Checkbox | `consent_acknowledged` | High |
| S3 | Verification Date & Time | Datetime picker | `consent_verified_at` | High |
| S3 | Consent Type (4 cards) | Multi-select cards | `session_consent_types` | High |
| S3 | Back | Ghost button | None | Medium |
| S3 | Save & Exit | Secondary button | draft upsert | Medium |
| S3 | Save Consent Documentation | Primary CTA | complete upsert | High |
| S4 | PHQ-9 Dropdown | Dropdown (0–27) | `phq9_score` | High |
| S4 | GAD-7 Dropdown | Dropdown (0–21) | `gad7_score` | High |
| S4 | ACE Dropdown | Dropdown (0–10) | `ace_score` | High |
| S4 | PCL-5 Input | Numeric input (0–80) | `pcl5_score` | High |
| S4 | HRV Input | Numeric input | `hrv_ms` | Medium |
| S4 | Systolic BP Input | Numeric input | `systolic_bp` | Medium |
| S4 | Diastolic BP Input | Numeric input | `diastolic_bp` | Medium |
| S4 | Prior Adverse Events toggle | Toggle (boolean) | `has_prior_adverse_events` | High |
| S4 | Primary Clinical Observation | Conditional dropdown | `prior_adverse_event_type_id FK` | High |
| S4 | CTCAE Severity | Conditional dropdown | `prior_adverse_event_severity_id FK` | High |
| S4 | Additional Medications toggle | Toggle (boolean) | `has_additional_medications` | High |
| S4 | Medication MultiSelect | Searchable tag combobox | `session_medications` junction | High |
| S5 | Monitoring Date | Date picker | `monitoring_date` | High |
| S5 | Today shortcut | Inline button | `monitoring_date` | High |
| S5 | C-SSRS Score (0–5) | Segmented button group | `cssrs_score` | High |
| S5 | Safety Concerns (8 cards) | Multi-select grid | `session_safety_concerns` junction | High |
| S5 | Actions Taken (7 cards) | Multi-select grid | `session_safety_actions` junction | High |
| S5 | Follow-Up Required | Binary button group | `followup_required` | High |
| S5 | Schedule Follow-Up Within | Conditional button group | `followup_within_days` | High |
