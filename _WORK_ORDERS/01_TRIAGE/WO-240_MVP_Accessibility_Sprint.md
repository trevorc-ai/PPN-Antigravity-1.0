---
id: WO-240
title: "MVP Accessibility Sprint — Mobile/Tablet Font & Responsive Fixes"
status: 01_TRIAGE
owner: LEAD
priority: P0 — BLOCKS MVP LAUNCH
created: 2026-02-20T04:28:00-08:00
failure_count: 0
source: INSPECTOR QA Audit (2026-02-20)
sprint: MVP_FINAL
tags: [accessibility, mobile, tablet, fonts, responsive, WCAG]
---

## CONTEXT

INSPECTOR completed MVP QA audit on 2026-02-20. One ticket PASSED (WO-206 Service Layer). However, a systemic accessibility audit revealed font-size violations and responsive layout gaps that must be resolved before PPN Portal is presented to Jason or any external partner on mobile or tablet.

This ticket governs the MVP Accessibility Sprint. It is the **priority gate** — nothing ships until INSPECTOR signs off.

---

## LEAD ARCHITECTURE

### The Problem — Three Layers

**Layer 1 — CRITICAL (sub-12px outright banned):**
Three explicit sub-12px violations in `Phase1StepGuide.tsx`. These are WCAG 1.4.4 failures. Non-negotiable fix required.

**Layer 2 — SYSTEMIC (text-xs on semantic labels):**
`text-xs` (12px) is used on `<label>`, `<h1>`, `<h3>`, `<p>` elements across the app. Per team rules, body/label/paragraph contexts must be `text-sm` (14px) minimum. 665 `text-xs` instances in src/ — not all are violations (badge/chip contexts are fine), but a targeted sweep of semantic labels is required.

**Layer 3 — RESPONSIVE LAYOUT (mobile/tablet breakpoints missing):**
14 pages have zero responsive breakpoint classes (`sm:`, `md:`, `lg:`). Several active production pages (`Settings.tsx`, `SubstanceMonograph.tsx`) have flex layouts with no column-stack fallback on mobile. The `MobileSidebar.tsx` has nav labels and section headers at `text-xs` — the primary mobile navigation experience is below accessibility floor.

### Routing
- Font violations → `owner: BUILDER` (code changes, not design)
- Responsive layout audit → split: DESIGNER for layout strategy, BUILDER for implementation
- Console.log cleanup → `owner: BUILDER`

---

## WORK ORDER BREAKDOWN

### 🛑 WO-241 — Phase1StepGuide Sub-12px Font Violations [P0]
**Owner:** BUILDER  
**File:** `src/components/wellness-journey/Phase1StepGuide.tsx`

| Line | Current | Fix |
|------|---------|-----|
| 118 | `text-[10px]` on badge span | → `text-xs` minimum |
| 213 | `text-[11px]` on label span | → `text-xs` minimum |
| 221 | `text-[9px]` on hover label | → Remove or upgrade to `text-xs` |

**AC:**
- [ ] All three violations removed from file
- [ ] `grep -n 'text-\[9px\]\|text-\[10px\]\|text-\[11px\]' src/components/wellness-journey/Phase1StepGuide.tsx` → 0 results
- [ ] Visual regression: Wellness Journey phase tabs still render correctly

---

### 🛑 WO-242 — MobileSidebar Accessibility Upgrade [P0]
**Owner:** BUILDER  
**File:** `src/components/MobileSidebar.tsx`

The primary mobile navigation has `<h1>` and `<h3>` at `text-xs`. On a phone, this is the first thing users see.

| Line | Element | Current | Fix |
|------|---------|---------|-----|
| 135 | `<h1>` (app name/brand) | `text-xs` | → `text-sm` |
| 160 | `<h3>` (nav section header) | `text-xs` | → `text-sm` |
| 221 | `<span>` (version label) | `text-xs` | → `text-xs` is OK for version chip — **EXEMPT** |
| 279 | `<span>` nav item name | `text-xs` | → `text-sm` |
| 280 | `<span>` item count | `text-xs` | → `text-xs` OK for count badge — **EXEMPT** |

**AC:**
- [ ] `<h1>` brand heading ≥ `text-sm` 
- [ ] `<h3>` section nav headers ≥ `text-sm`
- [ ] Nav item text labels ≥ `text-sm`
- [ ] Mobile sidebar screenshots before/after appended to ticket

---

### 🛑 WO-243 — Form Label Font Sweep [P0]
**Owner:** BUILDER  
**Files:** Multiple (see list below)

All `<label htmlFor>` and `<label>` elements MUST be ≥ `text-sm`. Current violations:

| File | Lines | Fix |
|------|-------|-----|
| `src/components/forms/DateInput.tsx` | 58 | `text-xs` label → `text-sm` |
| `src/components/safety/AdverseEventLogger.tsx` | 114, 164, 177, 195 | `text-xs` labels → `text-sm` |
| `src/components/safety/PotencyNormalizerCard.tsx` | 183 | `text-xs` label → `text-sm` |
| `src/components/wizards/BaselineAssessmentWizard.tsx` | 68, 248 | `text-xs` labels → `text-sm` |
| `src/components/ProtocolBuilder/Section2_Treatment.tsx` | 21, 28 | `text-xs` labels → `text-sm` |

**AC:**
- [ ] `grep -rn '<label.*text-xs' src/` → 0 results
- [ ] All form labels ≥ 14px (text-sm)
- [ ] No form input labels rely on color alone for meaning

---

### 🟡 WO-244 — Settings Page Mobile Responsiveness [P1]
**Owner:** BUILDER  
**File:** `src/pages/Settings.tsx`

Settings.tsx has multiple `flex items-start gap-6` rows with no `flex-col` fallback on mobile. On a 390px phone, these overflow horizontally.

**Fix pattern:**
```tsx
// Before
<div className="flex items-start gap-6">
// After  
<div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
```

Also: Line 257 — Settings CTA button uses `text-xs` → upgrade to `text-sm`.

**AC:**
- [ ] No horizontal scroll on Settings page at 390px viewport
- [ ] All flex rows collapse to column stack on `< sm` breakpoint
- [ ] Settings CTA button text ≥ `text-sm`
- [ ] No new TypeScript errors

---

### 🟡 WO-245 — ProtocolBuilder Preview Panel Font Upgrade [P1]
**Owner:** BUILDER  
**File:** `src/components/ProtocolBuilder/PreviewPanel.tsx`

Section headers and metric labels are at `text-xs`. On tablet these are primary content labels.

| Lines | Context | Fix |
|-------|---------|-----|
| 31 | DRAFTING badge | OK — badge exempt |
| 37 | "Projected Remission Rate" label | `text-xs` → `text-sm` |
| 39 | "Based on global outcomes" sub-label | `text-xs` → `text-sm` |
| 45 | "Admin Time Saved" metric label | `text-xs` → `text-sm` |
| 49 | "AI Confidence" metric label | `text-xs` → `text-sm` |

**AC:**
- [ ] All non-badge metric labels ≥ `text-sm` in PreviewPanel
- [ ] Protocol Builder renders correctly at 768px (iPad) viewport

---

### 🟡 WO-246 — SymptomDecayCurve & ArcOfCare Label Upgrade [P1]
**Owner:** BUILDER  
**Files:** `src/components/arc-of-care/SymptomDecayCurve.tsx`, `src/components/arc-of-care/PhaseTours.tsx`

These render on the Analytics and Wellness Journey pages — viewed on tablets during clinical sessions.

| File | Lines | Fix |
|------|-------|-----|
| `SymptomDecayCurve.tsx` | 156, 162, 174 | Section label `<p>` at `text-xs` → `text-sm` |
| `SymptomDecayCurve.tsx` | 148 | Legend trend label → `text-sm` |
| `PhaseTours.tsx` | 406 | Tour step detail text → `text-sm` |

**Note:** Recharts axis tick labels (`<text>` SVG) are exempt from the `text-xs` ban per INSPECTOR protocol.

**AC:**
- [ ] All `<p>` and `<span>` text in clinical data components ≥ `text-sm`
- [ ] SVG/Recharts tick labels remain untouched (exempt)

---

### 🟡 WO-247 — ConsentForm & SafetyAndAdverseEventForm Text Upgrade [P1]  
**Owner:** BUILDER  
**Files:** `src/components/arc-of-care-forms/phase-1-preparation/ConsentForm.tsx`, `src/components/arc-of-care-forms/phase-2-dosing/SafetyAndAdverseEventForm.tsx`

Forms used during active clinical sessions. Labels and instructional text must be clearly readable.

| File | Lines | Fix |
|------|-------|-----|
| `ConsentForm.tsx` | 144, 172 | Consent clause labels `text-xs` → `text-sm` |
| `SafetyAndAdverseEventForm.tsx` | 257, 296, 353 | Category headers and helper text `text-xs` → `text-sm` |

**AC:**
- [ ] No `text-xs` on any form instruction or category header
- [ ] Consent form renders clearly on 768px (iPad)

---

### 🟢 WO-248 — Console.log Cleanup (Pre-Production) [P2]
**Owner:** BUILDER  

**Known PHI-adjacent logs:**
| File | Line | Log Content | Risk |
|------|------|-------------|------|
| `PatientFormPage.tsx` | 40 | `[PatientFormPage] {formName} saved for {patientId}` | ⚠️ Logs patient ID |
| `TopHeader.tsx` | 67 | `'No authenticated user found'` | Low — no data |
| `TopHeader.tsx` | 94 | `'Profile fetch failed, using minimal user data'` | Low — no data |
| `alertService.ts` | 102 | `'📧 EMAIL NOTIFICATION: {...}'` | ⚠️ May contain email/user data |

**AC:**
- [ ] `PatientFormPage.tsx` log removed or replaced with non-identifying log
- [ ] `alertService.ts` email notification log removed or redacted
- [ ] `grep -rn "console.log.*patientId\|console.log.*patient_id" src/` → 0 results

---

### 🟢 WO-249 — RefPicker.tsx Section Header Upgrade [P2]
**Owner:** BUILDER  
**File:** `src/components/ui/RefPicker.tsx`

Section headers inside the picker dropdown (`<p>` elements for "Recent", group names) are at `text-xs`. On mobile the picker is the primary vocabulary selection UI.

| Lines | Fix |
|-------|-----|
| 313, 411 | `<p>` section headers `text-xs` → `text-sm` |
| 432 | `<p>` hint text `text-xs` → `text-xs` is borderline — upgrade to `text-sm` for readability |
| 163, 167, 188, 193, 293, 356 | Badge/count spans — **EXEMPT** (badge context) |

**AC:**
- [ ] `<p>` section header labels ≥ `text-sm`
- [ ] Count/badge spans remain at `text-xs` (exempt)

---

## RESPONSIVE LAYOUT AUDIT — PAGES MISSING ALL BREAKPOINTS

The following 14 pages have **zero** `sm:`, `md:`, or `lg:` classes. DESIGNER to assess and flag which need layout fixes vs. which are demo/internal-only pages (exempt):

| Page | Production? | Mobile Risk |
|------|-------------|-------------|
| `SignUp.tsx` | ✅ YES | ⚠️ High — user onboarding |
| `ForgotPassword.tsx` | ✅ YES | ⚠️ High — user recovery |
| `ResetPassword.tsx` | ✅ YES | ⚠️ High — user recovery |
| `HelpCenter.tsx` | ✅ YES | Medium |
| `PatientFormPage.tsx` | ✅ YES | ⚠️ High — clinical use |
| `ProfileEdit.tsx` | ✅ YES | Medium |
| `PrivacyPolicy.tsx` | ✅ YES | Low (text-only) |
| `TermsOfService.tsx` | ✅ YES | Low (text-only) |
| `ArcOfCareDemo.tsx` | Demo | Low — internal |
| `ClinicalReportPDF.tsx` | Print only | Exempt |
| `ComponentShowcase.tsx` | Internal | Exempt |
| `FormsShowcase.tsx` | Internal | Exempt |
| `MoleculeTest.tsx` | Internal | Exempt |

---

## EXECUTION ORDER

```
DESIGNER → Reviews responsive audit list → Flags which pages need layout strategy
    ↓
BUILDER → Executes WO-241, 242, 243 (P0 — start immediately, no design needed)
    ↓
BUILDER → Executes WO-244, 245, 246, 247 (P1 — in parallel after P0 done)
    ↓
BUILDER → Executes WO-248, 249 (P2 — cleanup round)
    ↓
INSPECTOR → Full accessibility re-audit
    ↓
USER REVIEW → Sign-off for MVP launch
```

---

## GLOBAL ACCEPTANCE CRITERIA (INSPECTOR GATE)

- [ ] `grep -rn 'text-\[9px\]\|text-\[10px\]\|text-\[11px\]' src/` → **0 results**
- [ ] `grep -rn '<label.*text-xs' src/` → **0 results**  
- [ ] `grep -rn '<h[1-6].*text-xs' src/` → **0 results**
- [ ] `grep -rn 'console.log.*patient' src/ -i` → **0 results**
- [ ] MobileSidebar renders cleanly at 390px
- [ ] SignUp, ForgotPassword, PatientFormPage pass 390px visual check
- [ ] Production site screenshot at 390px shows no horizontal scroll

---

## LEAD SIGN-OFF

This sprint is estimated at **1–2 focused build sessions**. The P0 items (WO-241/242/243) can be completed in under 30 minutes of targeted search-and-replace. The P1/P2 items add another session. This is the final gate before MVP.

**— LEAD, 2026-02-20**
