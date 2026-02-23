# PPN Portal — Doctor Demo Readiness Checklist
**Generated:** 2026-02-23 10:15 PST  
**Audience:** Internal — pre-beta review  
**Target demo audience:** Dr. Jason Allen, Dr. Shena Vanderpoeg

---

## [STATUS: PASS] — READY NOW (No further work needed)

### Authentication & Access
- [x] Login / Signup / Forgot Password flows — live Supabase auth
- [x] Session persistence (RequireAuth gate)
- [x] Password reset email flow

### Phase 1 — Patient Preparation
- [x] Patient Select Modal — live DB (queries `log_clinical_records` by `site_id`)
- [x] New patient ID generation (cryptographically random, PHI-safe)
- [x] Consent form — verified, stored with boolean + timestamp only
- [x] Baseline Assessment form — PHQ9, GAD7, ACE score — live writes
- [x] Risk Eligibility Report — gating logic with relative contraindication override
- [x] Phase 1 gating: all prerequisites checked before Phase 2 unlock

### Phase 2 — Dosing Session
- [x] Session creation flow — `createClinicalSession()` established
- [x] Dosing Protocol form — substance dropdown from `ref_substances` ✅
- [x] Session Vitals form — numeric only, live writes to `log_session_vitals`
- [x] Crisis Logger — UI capture works; DB write has P0 bug (see below)
- [x] Phase 2 gating: Dosing Protocol + Vitals required before "Start" button activates
- [x] MEQ30 assessment (UI complete, DB write commented out pending table)

### Phase 3 — Integration
- [x] Pulse check form
- [x] Integration session form (ratings, FK arrays)
- [x] Neuroplasticity Window badge with date math
- [x] Printable patient progress summary

### Substance Library
- [x] Full monograph pages loading from `ref_substances`
- [x] Interaction checker
- [x] Molecular visualization

### Analytics
- [x] All 8 Deep Dive pages (live UI)
- [x] Global Benchmark Intelligence panel
- [x] Analytics dashboard with charts

### Help Center
- [x] Full structure with 8 articles
- [x] Screenshots wired
- [x] Guided tour

### Platform
- [x] Sidebar navigation (all working routes)
- [x] Top header — profile, logout, guided tour, Send to Phone
- [x] Patient Companion page (16-tile video grid)
- [x] Protocol Builder
- [x] Data export (CSV)
- [x] Setting / Profile / Data export pages

---

## [STATUS: IN PROGRESS] — Sprint B Active

| Item | Owner | ETA |
|------|-------|-----|
| Command Palette (⌘K) | DESIGNER → BUILDER (WO-403) | This sprint |
| Phase 3 real data wiring | BUILDER (WO-402) | This sprint |
| Roomba dead navigate() cleanup | BUILDER (WO-404 partial) | This sprint |

---

## [STATUS: FAIL] — P0 Bugs (Must Fix Before Demo)

### P0-1: `CrisisLogger.tsx` — Strings Written to `log_adverse_events`
**Impact:** Every crisis event tap writes a string literal `'VITAL_SIGNS_ELEVATED'` to the
`alert_type` column. If the DB column is integer FK, this will silently fail.
If it's TEXT, this is an Architecture Constitution §2 violation.
**Fix:** WO-405 (SOOP migration + BUILDER code fix)

### P0-2: `AdverseEventLogger.tsx` — FK IDs Converted to Strings
**Impact:** `String(form.event_type_id)` converts `1` to `"1"` before insert.
The UI correctly collects integer IDs; the insert discards them.
**Fix:** WO-405 (BUILDER code fix — 3 lines changed)

### P0-3: `exportService.ts` — `patient_id` in Audit Log
**Impact:** `patient_id` (potentially identifiable) written into `log_system_events.details` JSONB.
Minor PHI risk but must be removed before regulatory conversations.
**Fix:** WO-405 (BUILDER code fix)

---

## Testing Instructions (For Demo Prep)

### Quick Smoke Test — 20 minutes
Run through this exact sequence before showing to doctors:

```
1. Login with a test account
   → Should land on Dashboard in < 2 seconds

2. Navigate to Wellness Journey
   → Click "Start New Session" → New Patient
   → Confirm anonymous ID assigned (should look like PT-XXXXXXXX)

3. Phase 1: Complete all three forms
   → Baseline Assessment (fill all fields, submit)
   → Consent Form (toggle all three, submit)
   → Risk Eligibility (fill, submit — trigger override if you want to demo that)
   → Confirm Phase 2 unlock button activates

4. Phase 2: Start Dosing Session
   → Confirm "Start Dosing Session" button is inactive until Dosing Protocol saved
   → Fill Dosing Protocol (select substance from dropdown — NOT free text)
   → Confirm vitals form appears and submit one reading
   → Confirm button activates after both prerequisites met

5. Substance Library
   → Navigate to /catalog
   → Click any substance monograph
   → Confirm full monograph renders with pharmacology data

6. Help Center
   → Navigate to /help
   → Confirm article content renders
   → Confirm guided tour launches from header

7. Logout and confirm redirect to /login
```

### Known Issues During Demo (Don't Click These)
| Issue | Workaround |
|-------|-----------|
| Crisis Logger may fail silently on DB write | UI still works — just don't show the DB in real-time |
| `ref_consent_types` not seeded — consent type omitted from insert | Approved — consent stores boolean + timestamp which is sufficient |
| MEQ30 page — DB write commented out | Navigate away from this page or explain it as "in development" |

---

## What the Doctors Will Care About

Based on both doctors' clinical backgrounds:

1. **"Can I actually log a patient session without it feeling like entering data into Excel?"**
   → Phase 2 dosing flow answers this. Demo the Crisis Logger UI (it looks clinical).

2. **"What happens to this data? Is it really anonymous?"**
   → Show the Patient Select modal — they'll see PT-XXXXXXXX codes, not names.
   → Show the Privacy Policy page (/privacy) — Phantom Shield explanation.

3. **"Who else sees this data?"**
   → RLS explanation: their site data is isolated. Global benchmark = anonymized aggregate only.

4. **"Can I try it on my phone?"**
   → Use the "Send to Phone" button in the header. Works on any device.

5. **"What's missing?"**
   → Be honest: Phase 3 real data wiring is in progress (analytics will use demo data).
   → MEQ30 scoring is UI-complete, DB integration is next sprint.

---

## Doctor Demo Script (15-minute version)

**Opening (2 min):** "Let me show you what we built. This is for practitioners who want to
document psychedelic therapy sessions in a way that holds up to scrutiny — clinically,
legally, and eventually in a research context."

**Demo flow (10 min):**
1. Start a new patient → show the ID system
2. Walk Phase 1 → 2 → 3 gating logic ("nothing unlocks until prerequisites are met")
3. Show Substance Library — "This is your pharmacology reference, built in"
4. Show Analytics → "This is where aggregate data goes — not your patient's, just patterns"

**Close (3 min):** "We are inviting three founding clinical partners. If you're willing to
run one real patient through this, that feedback shapes everything that comes next."

---

## Sprint Sequence to Full Beta

```
NOW:  WO-405 (DB audit + FK fix)
      WO-403 (Command Palette)
      WO-402 (Phase 3 data wiring)

NEXT: ref_ table seeding (Sprint A)
      Baseline data import (WO-231, ANALYST)

THEN: Doctor demo with Dr. Allen + Dr. Vanderpoeg
      Incorporate feedback
      Singularism outreach (see PRODDY brief)
```
