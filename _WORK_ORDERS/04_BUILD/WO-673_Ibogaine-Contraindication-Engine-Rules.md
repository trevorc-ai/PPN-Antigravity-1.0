# WO-673 — Ibogaine-Specific Contraindication Engine Rules
**Status:** INBOX
**Priority:** P0 — Patient Safety
**Filed by:** PRODDY
**Date:** 2026-03-24
**Assigned to:** BUILDER
**Reviewer:** INSPECTOR

---

## Problem Statement

`contraindicationEngine.ts` (WO-309) currently has **zero Ibogaine-specific contraindication rules.** Ibogaine is listed as Substance ID 7 in the PPN constants and is supported by DosageCalculator, QTIntervalTracker, and EKGComponent — but the safety screener that practitioners run before every session produces no meaningful Ibogaine-specific output.

A practitioner running an Ibogaine session through the current contraindication engine receives a `CLEAR` or generic cautionary verdict with no cardiac medication flags, no QT-prolonging drug warnings, no opioid washout requirements, and no hepatic impairment checks.

**This is a patient safety gap, not a UX gap. It must be addressed before any Ibogaine session page is built.**

---

## Clinical Basis

Source: Dr. Fernando Vega, MD — *Hazards and Benefits of Psychedelic Medicine v5.8* (submitted to Washington State Medical Disciplinary Board, 600+ documented sessions). Dr. Vega's research documents exact drug classes, mechanisms, and thresholds for ibogaine risk.

Primary mechanism: Ibogaine blocks the **hERG (KCNH2) potassium channel**, slowing ventricular repolarization → QT prolongation → Torsade de Pointes (TdP) → ventricular fibrillation risk.

Secondary mechanism: Ibogaine is heavily metabolized by **CYP2D6** — medications that inhibit CYP2D6 elevate ibogaine plasma levels, increasing all risks.

---

## Required Changes — `contraindicationEngine.ts`

### New Absolute Contraindication Rules (Ibogaine-Specific)

The function `checkAbsoluteContraindications()` must gain a substance-gating check (`data.sessionSubstance.toLowerCase() === 'ibogaine'`) before all Ibogaine-specific rules.

| Rule ID | Pill/Substance Trigger | Headline | Clinical Basis |
|---|---|---|---|
| `ABS-IBO-ANTIARRHYTHMIC` | amiodarone, sotalol, dronedarone, quinidine, propafenone, cisapride, pimozide, dofetilide | QT-prolonging antiarrhythmic — Ibogaine absolutely contraindicated | hERG block synergy: both substances block hERG simultaneously → additive QT prolongation |
| `ABS-IBO-METHADONE` | methadone | Methadone + Ibogaine: hERG block synergy + opioid withdrawal risk | Methadone is both a strong hERG blocker and a full opioid agonist; withdrawal risk during session |
| `ABS-IBO-HALOPERIDOL-CLASS` | haloperidol, pimozide, ziprasidone, iloperidone | Antipsychotic hERG blocker detected — Ibogaine contraindicated | Additive QT prolongation confirmed in Dr. Vega's case reviews |
| `ABS-IBO-MACROLIDE-QT` | azithromycin, erythromycin, clarithromycin, moxifloxacin | QT-prolonging antibiotic + Ibogaine | CYP3A4 interaction + hERG block |
| `ABS-IBO-QTC-GATE` | qtcBaselineMs > 500 | Baseline QTc > 500ms — Ibogaine session contraindicated | Per Dr. Vega: QTc > 500ms is a hard stop threshold. Note: must be supplied to engine from EKG form |
| `ABS-IBO-ACTIVE-OPIOID-FULL-AGONIST` | heroin, fentanyl, oxycodone, hydrocodone, morphine, hydromorphone, oxymorphone, buprenorphine (full agonist doses) | Full opioid agonist active — session not safe without washout protocol | Ibogaine can precipitate acute opioid withdrawal; post-session opioid tolerance reduction elevates overdose risk on relapse |

### New Relative Contraindication Rules (Ibogaine-Specific)

| Rule ID | Trigger | Headline |
|---|---|---|
| `REL-IBO-QTC-AMBER` | qtcBaselineMs 450–500 | Elevated baseline QTc (450–500ms) — heightened cardiac monitoring required |
| `REL-IBO-CYP2D6-STRONG` | paroxetine, fluoxetine, propafenone, terbinafine, chlorpromazine, quinidine | CYP2D6 strong inhibitor — elevated ibogaine plasma concentration risk |
| `REL-IBO-CYP2D6-MODERATE` | duloxetine, fluvoxamine, haloperidol, clozapine, cinacalcet, fluphenazine | CYP2D6 moderate inhibitor — monitor for enhanced ibogaine effect |
| `REL-IBO-TCA` | amitriptyline, imipramine, nortriptyline, desipramine, clomipramine | Tricyclic antidepressant — additive hERG block + QT prolongation |
| `REL-IBO-DIURETIC` | furosemide, hydrochlorothiazide, bumetanide, torsemide, chlorthalidone, spironolactone | Diuretic detected — electrolyte correction (K⁺, Mg²⁺, Ca²⁺) mandatory before session |
| `REL-IBO-DIGOXIN` | digoxin | Digoxin detected — electrolyte instability amplifies TdP risk |
| `REL-IBO-HEPATIC` | liver disease, cirrhosis, hepatitis, alcoholic liver disease, child-pugh | Hepatic impairment — ibogaine metabolism severely impaired (CYP2D6 reserves reduced) |
| `REL-IBO-CHLOROQUINE` | chloroquine, hydroxychloroquine | Antimalarial — IK1 channel (KCNJ2) block + QT prolongation |

---

## IntakeScreeningData Interface Updates

The `IntakeScreeningData` interface must gain one new optional field:

```typescript
// From EKGComponent / baseline ECG form — if available
qtcBaselineMs?: number;
```

This allows QTc-gated rules (ABS-IBO-QTC-GATE, REL-IBO-QTC-AMBER) to fire when the practitioner has entered a baseline ECG reading.

---

## Testing Requirements (INSPECTOR)

- [ ] `sessionSubstance = 'ibogaine'` + `medications = ['amiodarone']` → verdict: `DO_NOT_PROCEED`, flag: `ABS-IBO-ANTIARRHYTHMIC`
- [ ] `sessionSubstance = 'ibogaine'` + `medications = ['methadone']` → verdict: `DO_NOT_PROCEED`, flag: `ABS-IBO-METHADONE`
- [ ] `sessionSubstance = 'ibogaine'` + `qtcBaselineMs = 520` → verdict: `DO_NOT_PROCEED`, flag: `ABS-IBO-QTC-GATE`
- [ ] `sessionSubstance = 'ibogaine'` + `qtcBaselineMs = 470` → verdict: `PROCEED_WITH_CAUTION`, flag: `REL-IBO-QTC-AMBER`
- [ ] `sessionSubstance = 'ibogaine'` + `medications = ['paroxetine']` → verdict: `PROCEED_WITH_CAUTION`, flag: `REL-IBO-CYP2D6-STRONG`
- [ ] `sessionSubstance = 'ibogaine'` + `medications = ['furosemide']` → verdict: `PROCEED_WITH_CAUTION`, flag: `REL-IBO-DIURETIC`
- [ ] `sessionSubstance = 'psilocybin'` + `medications = ['amiodarone']` → **no ibogaine flags** (rules must be substance-gated)
- [ ] Existing rules (A1–A10, R1–R9) must all produce identical output to pre-change behavior (non-regression)

---

## Files to Modify

- `src/services/contraindicationEngine.ts` — add rules, extend `IntakeScreeningData` interface
- No UI changes required; engine is called from existing Phase 1 contraindication screening flow

---

## Sign-Off Checklist

- [ ] PRODDY: PRD approved
- [ ] LEAD: Architecture approved (additive rules only — no breaking changes)
- [ ] BUILDER: Rules implemented with exact drug name arrays per spec above
- [ ] INSPECTOR: 9 test cases above pass; non-regression confirmed
- [ ] USER: Final approval before merge
