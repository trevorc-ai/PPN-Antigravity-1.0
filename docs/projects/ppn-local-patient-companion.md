# PROJECT_BRIEF: The Bridge

**Created:** 2026-03-24 | **Status:** Active
**Owner:** PRODDY | **LEAD contact:** LEAD

---

## One-Sentence Goal

Give practitioners a zero-PHI, device-local tool — called **The Bridge** — that connects their de-identified PPN Subject_IDs to their real patient contact info, designed from the ground up to accept EMR exports (Osmind, REDCap) in Version 2.

---

## The Problem

Practitioners use PPN to document sessions against a de-identified Subject_ID (e.g., "QXZ"). Their real patient contact info — name, phone number, email — lives in their EMR, a spreadsheet, or their head. Every time they want to call a patient after reviewing their PPN chart, they must context-switch to another system and manually look up who QXZ actually is.

This is friction. At 20 patients/week, it becomes a real workflow blocker. Dr. Allen surfaced this explicitly.

The solution CANNOT store PHI in PPN's cloud. The solution MUST keep the practitioner owning their own PHI risk. But we CAN make the workflow seamless by providing a structured, local-first, CSV-portable lookup layer.

---

## Audience

Individual licensed practitioners (solo practice, small clinic). For now: single-device, single-user. Clinic-shared version is documented below as a future phase.

---

## Version Roadmap

### V1 — The Bridge (One Sprint, Current Scope)

Build a "Private Notes" panel inside the PPN patient view. Stores data in browser `localStorage`/`IndexedDB`. Zero server contact. Practitioners type in contact info once; it's there every time they open that patient.

**V1 Features:**
- Per-Subject_ID private card: Real Name, Phone, Email, Preferred Contact Time, Notes (free text)
- Auto-save on every keystroke — no save button needed
- One-time consent modal on first use (plain language: "this data lives on your device, PPN never sees it, back it up yourself")
- **Export All → CSV:** One-click download of all local records
- **Import from CSV:** Upload a previous export to restore records on a new device
- CSV schema designed with V2 EMR columns in mind (see below)
- Clear visual treatment — labeled "Private / Device Only" — never looks like PPN clinical data

**V1 CSV Schema (designed for V2 compatibility):**
```
subject_id, real_name, phone, email, preferred_contact_time, notes, last_updated
```
These column names are chosen to align with common EMR export field names so that V2 mapping adapters require minimal transformation.

---

### V2 — EMR Interoperability (Future Phase, Not Current Scope)

**Goal:** Allow practitioners to import a native CSV export from their EMR directly into the Companion, eliminating manual data entry entirely.

**Target systems:**
| System | Audience | Format |
|---|---|---|
| **Osmind** | Ketamine/psychedelic clinics | CSV (closest to our users) |
| **REDCap** | Research-affiliated practitioners | Event-based CSV |
| **Jane App / SimplePractice** | Private practice therapists | Standard CSV |
| **EPIC** | Large hospital groups | FHIR/HL7 (Phase 3+) |

**V2 approach:** Column mapping adapters — each EMR's known headers map to our internal schema. Practitioners select "Import from Osmind" vs "Import from REDCap" and we handle the column translation.

**Prerequisite for V2:** Research all target EMR export schemas. Verify column names before writing adapters. Do not assume.

---

### V3 — Clinic-Shared Version (Future Phase, Architecture TBD)

Multi-practitioner clinic needs the companion to be shared across devices without being stored in PPN's cloud. Requires a fundamentally different architecture (practitioner-controlled encrypted sync, local server, or separate authenticated service). **This is a full architectural decision — do not design V1 or V2 in a way that blocks V3.**

---

## Related Tickets

| Ticket | Stage | Status |
|---|---|---|
| [WO-676: The Bridge V1](_WORK_ORDERS/00_INBOX/WO-676_Local-Bridge_Side_App_V1.md) | 00_INBOX | Filed 2026-03-24 |
| GO for marketing positioning | Not yet filed | Pending V1 completion |

---

## Open Questions (for LEAD to resolve at architecture stage)

1. **localStorage vs IndexedDB:** localStorage is simpler but has a ~5MB per-origin limit. IndexedDB is more robust for larger contact lists. LEAD to recommend based on expected record volume.
2. **Encryption at rest:** Should the local store be encrypted (e.g., using a passphrase derived from the practitioner's PPN login)? This is a nice-to-have for V1, mandatory for V2. LEAD to advise.
3. **Where in the UI does this panel live?** Recommendation: a "Private" tab in the existing patient header card. DESIGNER to confirm.
4. **Consent modal text:** Must be reviewed by USER before build. PRODDY to draft. LEAD to flag as a USER-gate before BUILDER implements.

---

## Parked Context (for session resumption)

- This project originated from Dr. Allen asking how to call a patient whose PPN identity he only knows as "QXZ"
- The V1 feature is intentionally simple — no server sync, no clever routing, no EMR integration yet
- The V2 EMR column-mapping idea is the strategic differentiator; V1's CSV schema is designed to make V2 a small lift
- PHI risk stays entirely with the practitioner — PPN's zero-PHI guarantee is never compromised
- Clinic-shared version (V3) is documented but requires separate architecture planning before any ticket is filed
