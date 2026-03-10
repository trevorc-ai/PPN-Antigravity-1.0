# Interactive Elements Audit — Wellness Journey Onboarding Flow

> **Scope:** 5 screenshots across 3 distinct modal screens.
> **Status:** Read-only analysis. No code changes made.
> **Date:** 2026-03-08

---

## Screen 1 — "Start a Wellness Session" Modal

This is the entry-point modal. The practitioner must select a patient context before any clinical form is accessible.

---

### Element 1.1 — New Patient

| Field | Detail |
|---|---|
| **Label** | "New Patient / Assign a new anonymous ID and begin Phase 1" |
| **Type** | Navigational card / button (full-width, chevron right) |
| **Default State** | Not selected; highlighted with a brighter background vs. other cards |
| **Function** | Routes practitioner to the **New Patient Setup** flow (Screen 3). Triggers generation of a new anonymous `Subject_ID`. No PHI is collected. |
| **DB Mapping** | Inserts a new row into `patients` (or equivalent subject table) with a system-generated `subject_id`. Does **not** store any free-text patient name. |
| **RLS** | Available to all authenticated practitioners. New record is scoped to `practitioner_id = auth.uid()`. |
| **Mobile Priority** | **High** — Primary action for most sessions. Should be in primary view or top of bottom sheet. |
| **Edge Cases** | None visible. System handles ID generation automatically. |

---

### Element 1.2 — Existing Patient

| Field | Detail |
|---|---|
| **Label** | "Existing Patient / Look up a patient" |
| **Type** | Navigational card / button (half-width, chevron right) |
| **Default State** | Not selected |
| **Function** | Opens a patient search/lookup flow. Allows the practitioner to locate a previously created `Subject_ID` and attach a new session to that record. |
| **DB Mapping** | Reads from `patients` table filtered by `practitioner_id = auth.uid()`. No write at this step. |
| **RLS** | Practitioners can only look up their own patients (`practitioner_id = auth.uid()`). |
| **Mobile Priority** | **High** — Frequent action for returning patients. |
| **Edge Cases** | If no patients exist, the search results should return empty with a prompt to create a new patient. |

---

### Element 1.3 — Most Recent

| Field | Detail |
|---|---|
| **Label** | "Most Recent / No prior sessions" |
| **Type** | Navigational card / button (half-width, disabled state) |
| **Default State** | **Disabled** — greyed out with clock icon and "No prior sessions" text |
| **Function** | When active, performs a one-tap quick-resume of the most recently accessed patient record, bypassing the lookup step. |
| **DB Mapping** | Reads the last-accessed `subject_id` from a `session_history` or `practitioner_preferences` table, ordered by `updated_at DESC LIMIT 1`. |
| **RLS** | Scoped to `practitioner_id = auth.uid()`. Only the practitioner's own most-recent patient is surfaced. |
| **Mobile Priority** | **High** — Becomes the fastest action once the practitioner has a history. Should be promoted to primary view. |
| **Edge Cases** | Shown disabled when no prior sessions exist. Must become active/enabled after the first session is completed. |

---

### Element 1.4 — Practice Session

| Field | Detail |
|---|---|
| **Label** | "Practice Session / Explore the Wellness Journey without creating a real patient record" |
| **Type** | Navigational card / button (full-width, amber accent, chevron right) |
| **Default State** | Not selected; visually distinguished with amber/gold text and icon |
| **Function** | Launches the full Wellness Journey UI in a **sandbox/demo mode**. No data is written to any production table. |
| **DB Mapping** | **No DB writes.** All state is ephemeral (local/session memory only) or written to a dedicated `practice_sessions` table with a `is_practice = true` flag to isolate from real records. |
| **RLS** | Available to all authenticated practitioners. Practice data must **never** appear in analytics or benchmarking queries. |
| **Mobile Priority** | **Low** — Used for onboarding/training only. Hide behind secondary menu or overflow. |
| **Edge Cases** | Must ensure practice data is completely excluded from all aggregate/analytics queries via a hard filter on `is_practice = true`. |

---

### Element 1.5 — Scan Patient Label

| Field | Detail |
|---|---|
| **Label** | "Scan Patient Label" |
| **Type** | Navigational card / button (full-width, teal/cyan icon, chevron right) |
| **Default State** | Not selected |
| **Function** | Activates the device camera to scan a physical patient label (e.g., barcode or QR code). Decodes the `Subject_ID` from the label and auto-populates the patient context, bypassing manual lookup. |
| **DB Mapping** | Reads from `patients` using the decoded `subject_id`. No write at this step. |
| **RLS** | Practitioner must own the scanned patient record (`practitioner_id = auth.uid()`). Must handle gracefully if the scanned ID belongs to another practitioner. |
| **Mobile Priority** | **High** — A core mobile-native action (camera required). Must be prominent in mobile UI. |
| **Edge Cases** | Handle camera permission denial gracefully. Handle unrecognized QR codes (ID not found in DB). Handle IDs belonging to other practitioners with a clear "Access Denied" message. |

---

### Element 1.6 — Back Button

| Field | Detail |
|---|---|
| **Label** | "← Back" |
| **Type** | Ghost button (secondary navigation) |
| **Default State** | Always visible |
| **Function** | Dismisses this modal and returns the practitioner to the previous screen (likely the main dashboard). |
| **DB Mapping** | No DB interaction. |
| **RLS** | N/A |
| **Mobile Priority** | **Medium** — Standard back navigation; handled by OS back gesture on mobile. |
| **Edge Cases** | None. |

---

### Element 1.7 — Phantom Shield Link

| Field | Detail |
|---|---|
| **Label** | "Phantom Shield" (hyperlink in footer) |
| **Type** | Inline text link |
| **Default State** | Always visible |
| **Function** | Likely opens a modal or page explaining the anonymization/Zero-PHI architecture. Informational only. |
| **DB Mapping** | No DB interaction. |
| **RLS** | N/A |
| **Mobile Priority** | **Low** — Informational. Place in footer or help overflow. |
| **Edge Cases** | None. |

---

### Element 1.8 — Close (×) Button

| Field | Detail |
|---|---|
| **Label** | "×" (top right of modal) |
| **Type** | Icon button (modal dismiss) |
| **Default State** | Always visible |
| **Function** | Closes the modal entirely without saving state. |
| **DB Mapping** | No DB interaction. |
| **RLS** | N/A |
| **Mobile Priority** | **Medium** — Standard modal close. On mobile, swipe-down gesture should also dismiss. |
| **Edge Cases** | None. |

---
---

## Screen 2 — "Workspace Configuration" Modal

This modal appears after a patient context is selected. The practitioner chooses a workspace preset that controls which clinical modules are active for the session. Shown in **3 states** across the screenshots: Clinical Protocol selected, Ceremonial/Wellness selected, and Custom Framework expanded.

---

### Element 2.1 — Clinical Protocol Card

| Field | Detail |
|---|---|
| **Label** | "Clinical Protocol — Strict medical tracking. Auto-enables Vitals, Symptom Baselines, and Risk Engines." |
| **Type** | Selectable card (radio-button behavior — single-select) |
| **Default State** | **Selected by default** (blue border + checkmark visible in Screenshot 2) |
| **Modules Included** | Clinical Baselines (PHQ-9), Vital Sign Tracking, Automated Risk Engine |
| **Function** | Sets the session workspace to Clinical Protocol mode. Auto-enables a specific, fixed set of clinical modules. Cannot be customized from within this card. |
| **DB Mapping** | Writes `workspace_type = 'clinical_protocol'` to `session_configs` or `practitioner_preferences`. The specific module list is likely resolved server-side from a `workspace_presets` lookup table. |
| **RLS** | Available to all authenticated practitioners. If a practitioner has saved a global default, this card respects that. |
| **Mobile Priority** | **High** — Primary workspace selection. Must be easily tappable with a large touch target. |
| **Edge Cases** | Selecting this card must de-select any other active card. The checkmark badge in the top-right corner indicates active selection state. |

---

### Element 2.2 — Ceremonial / Wellness Card

| Field | Detail |
|---|---|
| **Label** | "Ceremonial / Wellness — Lightweight flow. Focuses on setting, narrative timeline, and integration." |
| **Type** | Selectable card (radio-button behavior — single-select) |
| **Default State** | Not selected by default |
| **Modules Included** | Narrative Timeline Logging, MEQ-30 Assessment, Integration Worksheets |
| **Function** | Sets the session workspace to Ceremonial/Wellness mode. Loads a lighter, non-clinical module set focused on subjective experience. |
| **DB Mapping** | Writes `workspace_type = 'ceremonial_wellness'` to `session_configs` or `practitioner_preferences`. |
| **RLS** | Available to all authenticated practitioners. |
| **Mobile Priority** | **High** — Co-primary workspace option. Same prominence as Clinical Protocol card. |
| **Edge Cases** | Selecting this card must de-select any other active card (orange border + checkmark in Screenshot 4). |

---

### Element 2.3 — Custom Framework Card

| Field | Detail |
|---|---|
| **Label** | "Custom Framework — Build your own workflow. Hand-pick features across clinical and subjective domains. (15 features selected)" |
| **Type** | Selectable card (radio-button behavior — single-select) — also acts as an **expander trigger** |
| **Default State** | Not selected by default; "15 features selected" counter shown in amber |
| **Function** | Selecting this card activates the Custom Framework and **expands a sub-panel** (visible in Screenshot 5) showing the four domain grids with individual module toggles. The "15 features selected" counter is dynamic. |
| **DB Mapping** | Writes `workspace_type = 'custom'` to `session_configs`. Individual module selections write to a `session_module_selections` junction table (many-to-many between `sessions` and `modules`). |
| **RLS** | Available to all authenticated practitioners. |
| **Mobile Priority** | **High** — Card selection is high priority. The expanded sub-panel scrolls below. |
| **Edge Cases** | The counter must update live as modules are toggled within the expanded panel. At least 1 module must be selected to proceed. |

---

### Element 2.4 — Custom Framework Module Toggles (Domain A – D)

> Applies only when the Custom Framework card is selected (Screenshot 5).

**Domain A: Medical & Physiological Gates**
- Vitals Tracking (HR, BP, SpO₂) — ✅ checked
- Rescue Protocol & Medical Tapering — ✅ checked
- Adverse Event Logging — ✅ checked
- Clinical Session Observations — ✅ checked

**Domain B: Clinical Symptom Tracking**
- Safety Screen & Eligibility (ECG, Medical Hx) — ✅ checked
- Baseline Scales (PHQ-9, GAD-7) — ✅ checked
- Longitudinal Scales (CAPS-5, Post-Session) — ✅ checked

**Domain C: Subjective & Spiritual Experience**
- Intention Setting Planner — ✅ checked
- Mystical Experience Questionnaire (MEQ-30) — ✅ checked
- Narrative Integration Journaling — ✅ checked
- Behavioral Breakthrough Tracker — ✅ checked
- Daily Pulse Check — ✅ checked

**Domain D: Regulatory & Logistics**
- Dynamic Touch & Informed Consent — ✅ checked
- Chain of Custody / Medicine Log — ✅ checked
- Session Timeline / Wave Mapping — ✅ checked

| Field | Detail |
|---|---|
| **Type** | Checkbox grid (multi-select, grouped by domain) |
| **Default State** | All 15 modules **checked by default** when Custom Framework is first selected |
| **Function** | Each checkbox toggles a specific clinical module in/out of the session workspace. The "15 features selected" counter on the card updates with each toggle. |
| **DB Mapping** | Writes to `session_module_selections` (junction table: `session_id FK`, `module_id FK`). Module definitions live in a `modules` reference table. **No free text.** All selections stored as FK IDs. |
| **RLS** | Practitioner can only modify selections for their own sessions. |
| **Mobile Priority** | **Medium** — Used during workspace setup. Display as a scrollable expanded panel below the card selector. |
| **Edge Cases** | Unchecking all modules in a domain is permissible, but the session must have at least 1 module selected globally. Domain headers with `ⓘ` icons imply tooltips — these should explain what happens if the domain is fully deselected. |

---

### Element 2.5 — "Save this as my global default for all future sessions" Checkbox

| Field | Detail |
|---|---|
| **Label** | "Save this as my global default for all future sessions." |
| **Type** | Checkbox |
| **Default State** | **Checked by default** (blue filled checkmark visible in all Workspace Configuration screenshots) |
| **Function** | When checked, saves the current workspace selection as the practitioner's persistent default. On future sessions, the Workspace Configuration modal will pre-populate with this choice. |
| **DB Mapping** | Writes to `practitioner_preferences` table: `default_workspace_type` column (and optionally `default_module_ids` array if Custom Framework is selected). |
| **RLS** | Scoped to `practitioner_id = auth.uid()`. Practitioners can only update their own preferences. |
| **Mobile Priority** | **Low** — A one-time or infrequent setting. Can live at the bottom of the modal. |
| **Edge Cases** | If the practitioner changes their selection but leaves this checkbox checked, the **new** selection becomes the default. Must confirm intent if overwriting an existing default (optional but good UX). |

---

### Element 2.6 — Back Button (Workspace Configuration)

| Field | Detail |
|---|---|
| **Label** | "← Back" |
| **Type** | Ghost button (secondary navigation) |
| **Default State** | Always visible |
| **Function** | Returns the practitioner to the previous screen (Screen 1 — Start a Wellness Session). No workspace selection is saved. |
| **DB Mapping** | No DB interaction. |
| **RLS** | N/A |
| **Mobile Priority** | **Medium** |
| **Edge Cases** | If the practitioner has made changes, consider a discard-confirmation prompt. |

---

### Element 2.7 — "Start Session →" Button (Workspace Configuration)

| Field | Detail |
|---|---|
| **Label** | "Start Session →" |
| **Type** | Primary CTA button |
| **Default State** | **Active/enabled** whenever a workspace card is selected. Color reflects selected mode: blue for Clinical Protocol, amber/orange for Ceremonial/Wellness, teal/green for Custom Framework. |
| **Function** | Commits the workspace configuration and initializes a new clinical session. Navigates to the session's first active module. |
| **DB Mapping** | Inserts a new row into `sessions` (with `subject_id FK`, `practitioner_id FK`, `workspace_type`, `started_at = NOW()`). If "Save as default" is checked, also upserts `practitioner_preferences`. |
| **RLS** | Practitioner can only create sessions owned by themselves. |
| **Mobile Priority** | **High** — Primary forward action. Must be sticky at the bottom of the screen (floating CTA bar) on mobile. |
| **Edge Cases** | Should be disabled if no workspace card is selected (edge case: state where nothing is selected, though the default appears to always pre-select one). |

---

### Element 2.8 — Close (×) Button (Workspace Configuration)

| Field | Detail |
|---|---|
| **Label** | "×" (top right) |
| **Type** | Icon button (modal dismiss) |
| **Default State** | Always visible |
| **Function** | Closes the modal without saving. Returns to dashboard. |
| **DB Mapping** | No DB interaction. |
| **RLS** | N/A |
| **Mobile Priority** | **Medium** |
| **Edge Cases** | None. |

---
---

## Screen 3 — "New Patient Setup" Modal

This modal collects anonymized demographic and clinical context for a new patient. All inputs use structured selections (no free text) to comply with Zero-PHI policy.

> **Note:** The modal header states "Complete all 5 steps" but only the first step's fields are visible in this screenshot. Analysis covers all visible elements.

---

### Element 3.1 — "What are you treating?" Multi-Select Tag Group

| Field | Detail |
|---|---|
| **Label** | "What are you treating? *" (required field) |
| **Type** | Multi-select tag/pill group (toggle buttons) |
| **Options** | PTSD *(selected)*, Depression, Anxiety / GAD, Addiction / SUD, End-of-Life Distress, Spiritual / Ceremonial, Chronic Pain, Other |
| **Default State** | No selection by default (PTSD is shown selected in the screenshot — practitioner has tapped it) |
| **Function** | Records the primary indication(s) being treated. Drives which clinical modules, risk tools, and outcome scales are recommended for this patient's sessions. This is likely the most consequential field in the setup flow. |
| **DB Mapping** | Writes to a `patient_indications` junction table (`subject_id FK`, `indication_id FK`). Indication definitions live in a `indications` reference/lookup table. **No free text.** `Other` likely maps to a specific `indication_id = 'other'` FK. |
| **RLS** | Scoped to practitioner (`practitioner_id = auth.uid()`). |
| **Mobile Priority** | **High** — First and most critical field. Full-width pill grid should be easy to tap on mobile. |
| **Edge Cases** | At least one indication must be selected (asterisk = required). If "Other" is selected, consider whether a structured secondary selector appears (not visible in screenshot). Multi-select is allowed — a patient can have comorbid indications. |

---

### Element 3.2 — Gender Selector

| Field | Detail |
|---|---|
| **Label** | "Gender" |
| **Type** | Single-select tag/pill group (radio behavior) |
| **Options** | Male *(selected)*, Female, Non-binary, Prefer not to say |
| **Default State** | No selection by default (Male shown selected in screenshot) |
| **Function** | Records the patient's gender for demographic segmentation in analytics and potential dosing reference. |
| **DB Mapping** | Writes `gender_id FK` to the `patients` table. Gender options live in a `genders` reference table. |
| **RLS** | Scoped to practitioner. |
| **Mobile Priority** | **High** — Part of required patient setup. |
| **Edge Cases** | Single-select only. "Prefer not to say" must store as a defined FK value, not NULL, to distinguish from "not asked." |

---

### Element 3.3 — Smoking Status Selector

| Field | Detail |
|---|---|
| **Label** | "Smoking Status" |
| **Type** | Single-select tag/pill group (radio behavior) |
| **Options** | Non-smoker *(selected)*, Ex-smoker, Current smoker, Prefer not to say |
| **Default State** | No selection by default (Non-smoker shown selected in screenshot) |
| **Function** | Records smoking status for physiological baseline and potential drug-interaction considerations. |
| **DB Mapping** | Writes `smoking_status_id FK` to `patients` table. Options live in `smoking_statuses` reference table. |
| **RLS** | Scoped to practitioner. |
| **Mobile Priority** | **High** — Part of patient setup. |
| **Edge Cases** | Same as Gender — "Prefer not to say" stores as defined FK, not NULL. |

---

### Element 3.4 — Age Numeric Input

| Field | Detail |
|---|---|
| **Label** | "Age" |
| **Type** | Numeric stepper / spinner input |
| **Default State** | Pre-populated with `55` (likely practitioner's last-used value or a system default) |
| **Function** | Records the patient's age in years. Used for dosing reference and demographic analytics. |
| **DB Mapping** | Writes `age_years` (Integer) to `patients` table. |
| **RLS** | Scoped to practitioner. |
| **Mobile Priority** | **High** — Required field. Stepper arrows suggest integer-only input; on mobile should also support numeric keyboard. |
| **Edge Cases** | Validate: must be > 0 and < 120. Minimum age threshold may apply (e.g., ≥ 18). Must not accept decimals. |

---

### Element 3.5 — Weight Numeric Input

| Field | Detail |
|---|---|
| **Label** | "Weight (kg) ⓘ" |
| **Type** | Numeric input with unit suffix (kg) and live conversion display |
| **Default State** | Pre-populated with `100` kg. Shows live conversion: "≈ 220.5 lbs" |
| **Function** | Records the patient's weight in kilograms. Used for dosing calculations and clinical analytics. The live lbs conversion aids practitioners using imperial units. |
| **DB Mapping** | Writes `weight_kg` (Numeric/Decimal) to `patients` table. Only kg is stored; lbs conversion is client-side display only. |
| **RLS** | Scoped to practitioner. |
| **Mobile Priority** | **High** — Required clinical field. |
| **Edge Cases** | Validate: must be > 0. Reasonable upper/lower bounds (e.g., 20–300 kg). The `ⓘ` icon implies a tooltip explaining clinical relevance (e.g., dosing reference). Must accept decimals (e.g., 72.5 kg). |

---

### Element 3.6 — Back Button (New Patient Setup)

| Field | Detail |
|---|---|
| **Label** | "← Back" |
| **Type** | Ghost button (secondary navigation) |
| **Default State** | Always visible |
| **Function** | Returns to Screen 2 (Workspace Configuration) or Screen 1. Data entered in this step may be lost unless auto-saved. |
| **DB Mapping** | No DB write unless a draft-save mechanism exists. |
| **RLS** | N/A |
| **Mobile Priority** | **Medium** |
| **Edge Cases** | If the practitioner has entered data and taps Back, consider preserving the draft in local state so it's not lost if they go forward again. |

---

### Element 3.7 — "Start Session →" Button (New Patient Setup)

| Field | Detail |
|---|---|
| **Label** | "Start Session →" |
| **Type** | Primary CTA button |
| **Default State** | Likely **disabled** until all required fields (marked `*`) are completed. Shown as enabled in screenshot because required fields are filled. |
| **Function** | Completes patient setup, inserts the new patient record and the new session record, then navigates to the first active clinical module. |
| **DB Mapping** | Inserts into `patients` (`subject_id`, `gender_id FK`, `smoking_status_id FK`, `age_years`, `weight_kg`, `practitioner_id`). Inserts into `patient_indications` (junction). Inserts into `sessions`. |
| **RLS** | Practitioner can only create their own records. |
| **Mobile Priority** | **High** — Sticky floating CTA at screen bottom on mobile. |
| **Edge Cases** | Must be disabled until all 5 steps are complete (only Step 1 fields visible here). Should validate all fields before submitting. |

---

### Element 3.8 — Close (×) Button (New Patient Setup)

| Field | Detail |
|---|---|
| **Label** | "×" (top right) |
| **Type** | Icon button (modal dismiss) |
| **Default State** | Always visible |
| **Function** | Closes the modal without saving. No patient record is created. |
| **DB Mapping** | No DB interaction. |
| **RLS** | N/A |
| **Mobile Priority** | **Medium** |
| **Edge Cases** | If data has been entered, show a discard confirmation ("Are you sure? This patient will not be saved."). |

---

## Summary Table

| Screen | Element | Type | DB Table | Mobile Priority |
|---|---|---|---|---|
| S1 | New Patient | Nav card | `patients` (INSERT) | High |
| S1 | Existing Patient | Nav card | `patients` (READ) | High |
| S1 | Most Recent | Nav card (disabled) | `session_history` (READ) | High |
| S1 | Practice Session | Nav card | None / `practice_sessions` | Low |
| S1 | Scan Patient Label | Nav card (camera) | `patients` (READ) | High |
| S1 | Back | Ghost button | None | Medium |
| S1 | Phantom Shield | Text link | None | Low |
| S1 | Close (×) | Icon button | None | Medium |
| S2 | Clinical Protocol Card | Selectable card | `session_configs` | High |
| S2 | Ceremonial/Wellness Card | Selectable card | `session_configs` | High |
| S2 | Custom Framework Card | Selectable card + expander | `session_configs` | High |
| S2 | Module Toggles (Domain A–D) | Checkbox grid (15 items) | `session_module_selections` | Medium |
| S2 | Save as Global Default | Checkbox | `practitioner_preferences` | Low |
| S2 | Back | Ghost button | None | Medium |
| S2 | Start Session → | Primary CTA | `sessions` (INSERT) | High |
| S2 | Close (×) | Icon button | None | Medium |
| S3 | What are you treating? | Multi-select tag group | `patient_indications` | High |
| S3 | Gender | Single-select tag group | `patients.gender_id` | High |
| S3 | Smoking Status | Single-select tag group | `patients.smoking_status_id` | High |
| S3 | Age | Numeric stepper | `patients.age_years` | High |
| S3 | Weight (kg) | Numeric input + live convert | `patients.weight_kg` | High |
| S3 | Back | Ghost button | None | Medium |
| S3 | Start Session → | Primary CTA | `patients` + `sessions` (INSERT) | High |
| S3 | Close (×) | Icon button | None | Medium |
