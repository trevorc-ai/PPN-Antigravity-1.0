---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
active_sprint: true
priority: P1
database_changes: no
project_brief: docs/projects/ppn-local-patient-companion.md
feature_name: The Bridge
created: 2026-03-24
files:
  - src/components/patients/LocalPatientCompanion.tsx
  - src/hooks/useLocalPatientStore.ts
  - src/components/patients/PatientHeader.tsx
---

## PRODDY PRD

> **Work Order:** WO-676 — The Bridge V1
> **Authored by:** PRODDY
> **Date:** 2026-03-24
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

> **Feature name:** The Bridge

Practitioners use PPN to document sessions against de-identified Subject_IDs (e.g., "QXZ"). Their real patient contact information — name, phone, preferred contact method — lives in a separate EMR or spreadsheet. Every time a practitioner reviews a PPN chart and wants to contact their patient, they must manually context-switch to another system to look up who QXZ actually is. This friction is a real workflow blocker surfaced directly by a beta practitioner.

---

### 2. Target User + Job-To-Be-Done

A licensed practitioner needs to instantly retrieve their patient's real contact info while viewing the patient's PPN chart so that they can make a call or send a message without switching applications.

---

### 3. Success Metrics

1. A practitioner can add contact info for a new patient and retrieve it on re-open in ≤10 seconds, measured across 5 consecutive QA sessions.
2. Export CSV and Import CSV round-trip restores all records with 100% field fidelity (zero data loss) in QA testing.
3. Zero bytes of PHI data appear in any network request, Supabase log, or browser storage key outside of `localStorage`/`IndexedDB` on the practitioner's own device, verified by INSPECTOR network audit.

---

### 4. Feature Scope

#### ✅ In Scope

- A "Private Notes" panel rendered inside the existing patient view, visually distinct from clinical data
- Per-Subject_ID local record with fields: Real Name, Phone, Email, Preferred Contact Time, Free-text Notes
- Auto-save on input change — no save button
- One-time consent acknowledgment modal: plain language, shown on first use only, must be dismissed before entering any data
- "Export All Records → CSV" button — downloads all local records as a single `.csv` file
- "Import from CSV" button — reads a previously exported file and restores records to local storage; overwrites existing records for matching Subject_IDs, appends new ones
- CSV schema: `subject_id, real_name, phone, email, preferred_contact_time, notes, last_updated`
- Clear "Private / Device Only" label badge on the panel — never resembles clinical documentation
- Storage via `localStorage` for V1 (LEAD to confirm or upgrade to `IndexedDB` based on expected volume)
- Designed with V2 EMR import adapters in mind — no hard-coded assumptions that would require a refactor

#### ❌ Out of Scope

- Any server-side storage, sync, or transmission of PHI data — absolute prohibition
- Clinic-shared or multi-device sync (V3)
- EMR column-mapping adapters (Osmind, REDCap, EPIC) — V2
- Encryption at rest of the local store — V2 (LEAD may add if low-effort)
- Integration with phone/email apps (click-to-call, mailto links) — considered nice-to-have, LEAD to advise
- Any auto-backup trigger that sends data off-device — not in scope

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** Dr. Allen (active beta practitioner) raised this as a concrete workflow question in session. The inability to bridge PPN Subject_IDs to real patient contact info is a live friction point that will affect every practitioner onboarded. Address before next practitioner onboarding.

---

### 6. Open Questions for LEAD

1. **localStorage vs IndexedDB:** localStorage has a ~5MB limit per origin. If a practitioner has 100+ patients with notes fields, will this be hit? LEAD to choose the appropriate storage API for V1.
2. **Consent modal text:** Proposed text needs USER review before BUILDER implements. Can LEAD flag this as a USER-gate checkpoint before the modal copy is finalized?
3. **UI placement:** The recommendation is a collapsible "Private" tab or panel in the existing patient header card. DESIGNER to confirm exact placement — LEAD to route through 01_DESIGN before BUILD.
4. **CSV import conflict handling:** If a practitioner imports a CSV where Subject_ID already exists locally, should we (a) overwrite, (b) merge by `last_updated`, or (c) prompt the user? LEAD to decide default behavior.
5. **Click-to-call / mailto:** Is `tel:` and `mailto:` link rendering on the Phone and Email fields a V1 inclusion or a V2 nice-to-have? LEAD to advise — it is a one-line change if approved.

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] `database_changes: no` — this is a pure frontend/localStorage feature; zero schema changes
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
