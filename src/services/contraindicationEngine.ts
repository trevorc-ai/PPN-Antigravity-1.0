/**
 * contraindicationEngine.ts — WO-309 / WO-673
 * Rule-based contraindication screening service.
 *
 * PRIVACY RULES:
 *   - Receives normalized intake data object ONLY — never raw patient text blobs.
 *   - No PHI is written to any output. patientId = Subject_ID only.
 *   - Flags reference clinical CATEGORY of concern, not the specific text matched.
 *
 * RULE SET SOURCE:
 *   - Oregon OHA Psilocybin Rules OAR 333-333
 *   - MAPS Protocol S2 Facilitator Manual §8.3
 *   - CTCAE v5.0 (adverse event grading)
 *   - Dr. Fernando Vega, MD — Hazards and Benefits of Psychedelic Medicine v5.8
 *     (600+ documented Ibogaine sessions; submitted to WA State Medical Disciplinary Board)
 *   - Dr. Jason Allen — QTc thresholds validated across 600+ Ibogaine sessions.
 *     Dr. Allen's thresholds override standard references on this platform:
 *     Green <490ms / Amber 490ms / Orange 500ms+ / Red advisory 550ms+.
 *     NO hard session block at any tier — practitioner retains full clinical authority.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ContraindicationFlag {
    id: string;
    severity: 'ABSOLUTE' | 'RELATIVE';
    category: 'MEDICATION' | 'PSYCHIATRIC' | 'CARDIOVASCULAR' | 'DEMOGRAPHIC' | 'ASSESSMENT';
    headline: string;
    detail: string;
    source: string;
    regulatoryBasis: string;
}

export interface ContraindicationResult {
    verdict: 'CLEAR' | 'PROCEED_WITH_CAUTION' | 'DO_NOT_PROCEED';
    absoluteFlags: ContraindicationFlag[];
    relativeFlags: ContraindicationFlag[];
    generatedAt: string;
    patientId: string;
    sessionSubstance: string;
}

/** Normalized intake data passed in from form data. No raw PHI. */
export interface IntakeScreeningData {
    patientId: string;
    sessionSubstance: string; // e.g. 'psilocybin', 'mdma', 'ketamine'

    // From BaselineObservationsForm — medication list (normalized to lowercase)
    medications: string[];

    // From BaselineObservationsForm — psych history keywords (normalized to lowercase)
    psychiatricHistory: string[];

    // From BaselineObservationsForm — family history keywords (normalized to lowercase)
    familyHistory: string[];

    // From StructuredSafetyCheck
    cssrsScore?: number; // Columbia Suicide Severity Rating Scale (0–6)

    // From SessionVitalsForm — most recent reading
    lastSystolicBP?: number;

    // From BaselineObservationsForm
    isPregnant?: boolean;
    ageYears?: number;

    // From BaselineMentalHealthForm
    phq9Score?: number;
    gad7Score?: number;
    pcl5Score?: number;

    // From DosingProtocolForm — calculated from weight/height
    bmi?: number;

    // From EKGComponent / baseline ECG form — Ibogaine sessions only
    // Baseline QTc interval in milliseconds. Required for ABS-IBO-QTC-GATE and REL-IBO-QTC-AMBER.
    // QTc authority: Dr. Jason Allen (600+ sessions). Thresholds override standard references.
    qtcBaselineMs?: number;
}

// ============================================================================
// HELPERS
// ============================================================================

function matchesAny(haystack: string[], needles: string[]): boolean {
    return haystack.some(h => needles.some(n => h.includes(n)));
}

// ============================================================================
// ABSOLUTE CONTRAINDICATION RULES (8 rules)
// ============================================================================

function checkAbsoluteContraindications(data: IntakeScreeningData): ContraindicationFlag[] {
    const flags: ContraindicationFlag[] = [];

    // A1 — Active lithium use (ALL psychedelics — no substance restriction)
    if (matchesAny(data.medications, ['lithium'])) {
        flags.push({
            id: 'ABS-MEDICATION-LITHIUM',
            severity: 'ABSOLUTE',
            category: 'MEDICATION',
            headline: 'Active lithium detected — session contraindicated',
            detail: 'Concurrent lithium use significantly elevates risk of serotonin syndrome, neurotoxicity, and cardiac arrhythmia in combination with serotonergic psychedelics (psilocybin, MDMA, LSD, ibogaine). Lithium must be discontinued under physician supervision before any psychedelic session. Minimum washout as directed by prescribing physician.',
            source: 'Baseline Observations — Medication List',
            regulatoryBasis: 'OHA OAR 333-333-4020(3)(c); MAPS Protocol S2 §8.3.1',
        });
    }

    // A2 — MAOI use within 14 days
    const maoiDrugs = ['phenelzine', 'tranylcypromine', 'selegiline', 'isocarboxazid', 'maoi', 'nardil', 'parnate', 'emsam', 'marplan'];
    if (matchesAny(data.medications, maoiDrugs)) {
        flags.push({
            id: 'ABS-MEDICATION-MAOI',
            severity: 'ABSOLUTE',
            category: 'MEDICATION',
            headline: 'MAOI detected — risk of serotonin syndrome',
            detail: 'Monoamine oxidase inhibitors (MAOIs) interacting with serotonergic substances (psilocybin, MDMA) carries risk of severe serotonin syndrome. Minimum 14-day washout period required.',
            source: 'Baseline Observations — Medication List',
            regulatoryBasis: 'OHA OAR 333-333-4020(3)(c); MAPS Protocol S2 §8.3.2',
        });
    }

    // A3 — Personal history of psychosis
    const psychosisTerms = ['schizophrenia', 'schizoaffective', 'psychosis', 'psychotic episode', 'psychotic disorder'];
    if (matchesAny(data.psychiatricHistory, psychosisTerms)) {
        flags.push({
            id: 'ABS-PSYCH-PSYCHOSIS-PERSONAL',
            severity: 'ABSOLUTE',
            category: 'PSYCHIATRIC',
            headline: 'Personal history of psychosis detected',
            detail: 'Personal history of psychotic disorder (schizophrenia, schizoaffective disorder, psychotic episodes) is an absolute contraindication. Psychedelics may trigger acute psychotic relapse.',
            source: 'Baseline Observations — Psychiatric History',
            regulatoryBasis: 'OHA OAR 333-333-4020(3)(b); MAPS Protocol S2 §8.2',
        });
    }

    // A4 — Family history of psychosis (first-degree)
    const familyPsychosisTerms = ['schizophrenia'];
    const familyRelativeTerms = ['parent', 'mother', 'father', 'sibling', 'brother', 'sister', 'first-degree'];
    const hasFamilyPsychosis = matchesAny(data.familyHistory, familyPsychosisTerms);
    const hasFamilyRelative = matchesAny(data.familyHistory, familyRelativeTerms);
    if (hasFamilyPsychosis && hasFamilyRelative) {
        flags.push({
            id: 'ABS-PSYCH-PSYCHOSIS-FAMILY',
            severity: 'ABSOLUTE',
            category: 'PSYCHIATRIC',
            headline: 'First-degree family history of schizophrenia detected',
            detail: 'First-degree family history (parent or sibling) of schizophrenia significantly elevates genetic risk of psychosis. This is an absolute contraindication per current clinical protocol.',
            source: 'Baseline Observations — Family History',
            regulatoryBasis: 'OHA OAR 333-333-4020(3)(b)',
        });
    }

    // A5 — Active suicidal ideation with plan (C-SSRS ≥ 4)
    if (data.cssrsScore !== undefined && data.cssrsScore >= 4) {
        flags.push({
            id: 'ABS-PSYCH-SUICIDALITY',
            severity: 'ABSOLUTE',
            category: 'PSYCHIATRIC',
            headline: `Active suicidal ideation with plan detected (C-SSRS: ${data.cssrsScore})`,
            detail: 'C-SSRS score ≥ 4 indicates suicidal ideation with intent and plan. Immediate safety plan activation required. Session must not proceed until risk is resolved and C-SSRS score is below threshold.',
            source: 'Structured Safety Check — C-SSRS',
            regulatoryBasis: 'OHA OAR 333-333-4020(3)(a); Joint Commission NPSG 15.01.01',
        });
    }

    // A6 — Cardiovascular instability (MDMA only: SBP > 160)
    if (
        data.sessionSubstance.toLowerCase() === 'mdma' &&
        data.lastSystolicBP !== undefined &&
        data.lastSystolicBP > 160
    ) {
        flags.push({
            id: 'ABS-CARDIOVASCULAR-HTN-MDMA',
            severity: 'ABSOLUTE',
            category: 'CARDIOVASCULAR',
            headline: `Cardiovascular instability detected — SBP ${data.lastSystolicBP} mmHg (MDMA session)`,
            detail: 'MDMA causes significant sympathomimetic cardiovascular stimulation. Systolic BP > 160 mmHg before session is an absolute contraindication. Refer to cardiology before rescheduling.',
            source: 'Session Vitals — Blood Pressure',
            regulatoryBasis: 'MAPS Protocol S2 §7.4; AHA Hypertension Guidelines 2023',
        });
    }

    // A7 — Pregnancy
    if (data.isPregnant === true) {
        flags.push({
            id: 'ABS-DEMOGRAPHIC-PREGNANCY',
            severity: 'ABSOLUTE',
            category: 'DEMOGRAPHIC',
            headline: 'Pregnancy status confirmed — session contraindicated',
            detail: 'No controlled clinical data exists on psychedelic safety during pregnancy. The precautionary principle applies; teratogenic risk cannot be excluded.',
            source: 'Baseline Observations — Pregnancy Status',
            regulatoryBasis: 'OHA OAR 333-333-4020(3)(d)',
        });
    }

    // A8 — Age < 21 (Oregon regulation)
    if (data.ageYears !== undefined && data.ageYears < 21) {
        flags.push({
            id: 'ABS-DEMOGRAPHIC-AGE',
            severity: 'ABSOLUTE',
            category: 'DEMOGRAPHIC',
            headline: `Patient age ${data.ageYears} — below Oregon minimum (21 years)`,
            detail: 'Oregon Psilocybin Services Act (Measure 109) sets minimum client age at 21 years. Sessions with clients under 21 are not permitted under any circumstance.',
            source: 'Baseline Observations — Demographics',
            regulatoryBasis: 'Oregon Ballot Measure 109; OHA OAR 333-333-4010',
        });
    }

    // A9 — SSRI + MDMA (ABSOLUTE — Serotonin Syndrome, potentially fatal)
    // Corrected 2026-02-25: Previously classified as RELATIVE (R3).
    // Active SSRI with MDMA is a potentially fatal combination and must be
    // treated as an absolute contraindication, not a caution.
    // Source: MAPS Protocol S2 §7.2; FDA Drug Interaction Guidance
    const ssriDrugsAbsolute = [
        'ssri', 'sertraline', 'fluoxetine', 'escitalopram', 'citalopram',
        'paroxetine', 'fluvoxamine', 'zoloft', 'prozac', 'lexapro', 'paxil',
        'luvox', 'viibryd', 'vilazodone', 'trintellix', 'vortioxetine',
    ];
    const substanceLower = data.sessionSubstance.toLowerCase();
    if (
        (substanceLower === 'mdma' || substanceLower.includes('mdma')) &&
        matchesAny(data.medications, ssriDrugsAbsolute)
    ) {
        flags.push({
            id: 'ABS-MEDICATION-SSRI-MDMA',
            severity: 'ABSOLUTE',
            category: 'MEDICATION',
            headline: 'SSRI detected with MDMA session — Serotonin Syndrome risk',
            detail: 'Active SSRI use combined with MDMA carries a serious risk of Serotonin Syndrome, a potentially life-threatening condition. MDMA dramatically increases synaptic serotonin; SSRIs block reuptake, compounding the effect. Minimum 2-week tapering washout under physician supervision is required before any MDMA session. Do NOT discontinue SSRIs abruptly.',
            source: 'Baseline Observations — Medication List',
            regulatoryBasis: 'MAPS Protocol S2 §7.2; FDA Drug Interaction Guidance',
        });
    }

    // A10 — Bupropion (Wellbutrin) + MDMA (ABSOLUTE — CYP2D6 inhibition + seizure risk)
    // Bupropion inhibits CYP2D6, the primary enzyme metabolizing MDMA.
    // This causes dangerous MDMA plasma accumulation (up to 3–4x normal levels).
    // Additionally: additive seizure threshold lowering, noradrenergic/dopaminergic
    // potentiation. NOT an SSRI but must be treated as absolute with MDMA.
    const bupropionTerms = ['bupropion', 'wellbutrin', 'zyban', 'aplenzin', 'forfivo', 'budeprion'];
    if (
        (substanceLower === 'mdma' || substanceLower.includes('mdma')) &&
        matchesAny(data.medications, bupropionTerms)
    ) {
        flags.push({
            id: 'ABS-MEDICATION-BUPROPION-MDMA',
            severity: 'ABSOLUTE',
            category: 'MEDICATION',
            headline: 'Bupropion detected with MDMA session — CYP2D6 inhibition danger',
            detail: 'Bupropion (Wellbutrin) is a potent CYP2D6 inhibitor - the primary enzyme responsible for MDMA metabolism. Co-administration causes MDMA plasma levels to accumulate 3-4x above expected levels, dramatically increasing cardiovascular strain, hyperthermia risk, and neurotoxicity. Bupropion also independently lowers seizure threshold, compounding MDMA CNS effects. This combination is absolutely contraindicated.',
            source: 'Baseline Observations — Medication List',
            regulatoryBasis: 'Farré et al. (2015) J Pharmacol Exp Ther; MAPS Protocol S2 §7.2; FDA CYP2D6 Drug Interaction Guidance',
        });
    }

    // ── IBOGAINE-SPECIFIC ABSOLUTE RULES (A11–A16) ────────────────────────────
    // Source: Dr. Fernando Vega MD (v5.8) + Dr. Jason Allen (600+ sessions)
    // Mechanism: Ibogaine blocks hERG (KCNH2) potassium channel → QT prolongation
    //            → Torsade de Pointes → ventricular fibrillation risk.
    //            Secondary: heavy CYP2D6 metabolism — inhibitors raise ibogaine plasma levels.
    // All rules are substance-gated. They CANNOT fire for psilocybin, MDMA, or ketamine.
    if (substanceLower === 'ibogaine' || substanceLower.includes('ibogaine')) {

        // A11 — QT-prolonging antiarrhythmics + Ibogaine (hERG block synergy)
        const antiarrhythmicQtDrugs = [
            'amiodarone', 'sotalol', 'dronedarone', 'quinidine',
            'propafenone', 'cisapride', 'pimozide', 'dofetilide',
        ];
        if (matchesAny(data.medications, antiarrhythmicQtDrugs)) {
            flags.push({
                id: 'ABS-IBO-ANTIARRHYTHMIC',
                severity: 'ABSOLUTE',
                category: 'CARDIOVASCULAR',
                headline: 'QT-prolonging antiarrhythmic detected — Ibogaine absolutely contraindicated',
                detail: 'This antiarrhythmic (amiodarone, sotalol, dronedarone, quinidine, propafenone, cisapride, pimozide, or dofetilide) blocks the hERG potassium channel. Ibogaine also blocks hERG. Simultaneous blockade produces additive QT prolongation with a high risk of Torsade de Pointes and ventricular fibrillation. This combination is an absolute contraindication.',
                source: 'Baseline Observations — Medication List',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8; Dr. Allen clinical review 2026-03-24',
            });
        }

        // A12 — Methadone + Ibogaine (hERG block synergy + opioid withdrawal risk)
        if (matchesAny(data.medications, ['methadone'])) {
            flags.push({
                id: 'ABS-IBO-METHADONE',
                severity: 'ABSOLUTE',
                category: 'CARDIOVASCULAR',
                headline: 'Methadone detected — Ibogaine absolutely contraindicated',
                detail: 'Methadone is both a potent hERG potassium channel blocker (additive QT prolongation with ibogaine) and a full opioid agonist. The combination poses dual risk: (1) Torsade de Pointes from hERG synergy, and (2) acute precipitated opioid withdrawal during the session. Minimum washout protocol required under physician supervision before any Ibogaine session.',
                source: 'Baseline Observations — Medication List',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8',
            });
        }

        // A13 — Antipsychotics with hERG block + Ibogaine
        const antipsychoticQtDrugs = ['haloperidol', 'ziprasidone', 'iloperidone'];
        // Note: pimozide is already covered by A11 (antiarrhythmic list) — not duplicated here
        if (matchesAny(data.medications, antipsychoticQtDrugs)) {
            flags.push({
                id: 'ABS-IBO-HALOPERIDOL-CLASS',
                severity: 'ABSOLUTE',
                category: 'CARDIOVASCULAR',
                headline: 'Antipsychotic hERG blocker detected — Ibogaine absolutely contraindicated',
                detail: 'Haloperidol, ziprasidone, and iloperidone are antipsychotics with confirmed hERG potassium channel blocking activity. Combined with ibogaine, additive QT prolongation significantly elevates Torsade de Pointes risk. This combination is absolutely contraindicated per Dr. Vega case reviews.',
                source: 'Baseline Observations — Medication List',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8',
            });
        }

        // A14 — QT-prolonging antibiotics + Ibogaine (CYP3A4 + hERG block)
        const macrolideQtDrugs = ['azithromycin', 'erythromycin', 'clarithromycin', 'moxifloxacin'];
        if (matchesAny(data.medications, macrolideQtDrugs)) {
            flags.push({
                id: 'ABS-IBO-MACROLIDE-QT',
                severity: 'ABSOLUTE',
                category: 'CARDIOVASCULAR',
                headline: 'QT-prolonging antibiotic detected — Ibogaine absolutely contraindicated',
                detail: 'Macrolide antibiotics (azithromycin, erythromycin, clarithromycin) and fluoroquinolone moxifloxacin combine CYP3A4 inhibition with direct hERG channel block. Both effects amplify ibogaine QT prolongation. This combination is an absolute contraindication.',
                source: 'Baseline Observations — Medication List',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8',
            });
        }

        // A15 — Baseline QTc > 550ms (Dr. Allen threshold — hard stop)
        // QTc authority: Dr. Jason Allen (600+ sessions, paper in preparation).
        // Threshold overrides standard references. Green <490 / Amber 490 / Orange 500+ / Red advisory 550+.
        // No hard block at any tier EXCEPT >550ms which is the clinical hard stop.
        if (data.qtcBaselineMs !== undefined && data.qtcBaselineMs > 550) {
            flags.push({
                id: 'ABS-IBO-QTC-GATE',
                severity: 'ABSOLUTE',
                category: 'CARDIOVASCULAR',
                headline: `Baseline QTc ${data.qtcBaselineMs}ms — Ibogaine session contraindicated (threshold: >550ms)`,
                detail: `Baseline QTc of ${data.qtcBaselineMs}ms exceeds the clinical hard stop threshold of 550ms established by Dr. Jason Allen across 600+ documented Ibogaine sessions. Session must not proceed. Cardiology consultation required before rescheduling. Note: QTc 500–549ms (orange tier) is advisory monitoring only — not a hard stop.`,
                source: 'EKG Component — Baseline ECG / QTc',
                regulatoryBasis: 'Dr. Jason Allen clinical threshold (600+ sessions); Vega MD v5.8',
            });
        }

        // A16 — Full opioid agonist active (withdrawal + post-session overdose risk)
        const fullOpioidAgonists = [
            'heroin', 'fentanyl', 'oxycodone', 'hydrocodone', 'morphine',
            'hydromorphone', 'oxymorphone', 'buprenorphine',
        ];
        if (matchesAny(data.medications, fullOpioidAgonists)) {
            flags.push({
                id: 'ABS-IBO-ACTIVE-OPIOID-FULL-AGONIST',
                severity: 'ABSOLUTE',
                category: 'MEDICATION',
                headline: 'Full opioid agonist detected — Ibogaine session requires washout protocol',
                detail: 'Active full opioid agonist use (heroin, fentanyl, oxycodone, hydrocodone, morphine, hydromorphone, oxymorphone, or buprenorphine at full agonist doses) poses dual risk with ibogaine: (1) ibogaine can precipitate acute opioid withdrawal during the session; (2) ibogaine dramatically reduces opioid tolerance post-session, elevating overdose risk on any relapse. A physician-supervised opioid washout protocol is required before any Ibogaine session.',
                source: 'Baseline Observations — Medication List',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8; Dr. Allen clinical review 2026-03-24',
            });
        }

    } // end Ibogaine absolute rules block

    return flags;
}

// ============================================================================
// RELATIVE CONTRAINDICATION RULES (9 rules)
// ============================================================================

function checkRelativeContraindications(data: IntakeScreeningData): ContraindicationFlag[] {
    const flags: ContraindicationFlag[] = [];

    // R1 — Borderline personality disorder
    const bpdTerms = ['bpd', 'borderline personality', 'emotionally unstable personality'];
    if (matchesAny(data.psychiatricHistory, bpdTerms)) {
        flags.push({
            id: 'REL-PSYCH-BPD',
            severity: 'RELATIVE',
            category: 'PSYCHIATRIC',
            headline: 'Borderline personality disorder identified',
            detail: 'BPD may increase risk of intense affective responses and emotional dysregulation during sessions. Heightened preparation and integration support historically indicated. Document clinical justification.',
            source: 'Baseline Observations — Psychiatric History',
            regulatoryBasis: 'MAPS Protocol S2 §8.4',
        });
    }

    // R2 — Active substance use disorder (other than target)
    const sudTerms = ['alcohol use disorder', 'aud', 'opioid use disorder', 'cocaine use disorder', 'stimulant use disorder', 'substance use disorder', 'sud'];
    if (matchesAny(data.psychiatricHistory, sudTerms)) {
        flags.push({
            id: 'REL-PSYCH-SUD',
            severity: 'RELATIVE',
            category: 'PSYCHIATRIC',
            headline: 'Active substance use disorder identified',
            detail: 'Active SUD (non-target substance) increases session safety risk. Assess sobriety duration, current support system, and readiness. Document clinical justification for proceeding.',
            source: 'Baseline Observations — Psychiatric History',
            regulatoryBasis: 'MAPS Protocol S2 §8.5',
        });
    }

    // R3 — SSRI within 2 weeks of MDMA session
    const ssriDrugs = ['ssri', 'sertraline', 'fluoxetine', 'escitalopram', 'citalopram', 'paroxetine', 'fluvoxamine', 'zoloft', 'prozac', 'lexapro', 'paxil'];
    if (
        data.sessionSubstance.toLowerCase() === 'mdma' &&
        matchesAny(data.medications, ssriDrugs)
    ) {
        flags.push({
            id: 'REL-MEDICATION-SSRI-MDMA',
            severity: 'RELATIVE',
            category: 'MEDICATION',
            headline: 'SSRI detected with MDMA session — reduced efficacy + serotonin risk',
            detail: 'SSRIs may blunt MDMA therapeutic effect and increase serotonin syndrome risk. Tapering protocols often considered under physician supervision 2 weeks prior. Do not discontinue abruptly. Document clinical decision.',
            source: 'Baseline Observations — Medication List',
            regulatoryBasis: 'MAPS Protocol S2 §7.2; FDA Drug Interaction Guidance',
        });
    }

    // R4 — PHQ-9 > 24 (extreme severity)
    if (data.phq9Score !== undefined && data.phq9Score > 24) {
        flags.push({
            id: 'REL-ASSESSMENT-PHQ9-EXTREME',
            severity: 'RELATIVE',
            category: 'ASSESSMENT',
            headline: `Extreme PHQ-9 severity (score: ${data.phq9Score}/27)`,
            detail: 'PHQ-9 > 24 indicates extreme depression severity. Heightened monitoring protocol required during and after session. Ensure crisis support plan is in place. Document clinical rationale for proceeding.',
            source: 'Baseline Mental Health Assessment — PHQ-9',
            regulatoryBasis: 'Kroenke, Spitzer & Williams (2001); MAPS Protocol S2 §8.6',
        });
    }

    // R5 — GAD-7 > 18 (extreme severity, max is 21)
    if (data.gad7Score !== undefined && data.gad7Score > 18) {
        flags.push({
            id: 'REL-ASSESSMENT-GAD7-EXTREME',
            severity: 'RELATIVE',
            category: 'ASSESSMENT',
            headline: `Extreme GAD-7 severity (score: ${data.gad7Score}/21)`,
            detail: 'GAD-7 > 18 indicates extreme anxiety severity. High anxiety at baseline may intensify session difficulty. Significant preparation support and anxiolytic rescue protocol should be in place.',
            source: 'Baseline Mental Health Assessment — GAD-7',
            regulatoryBasis: 'Spitzer et al. (2006); MAPS Protocol S2 §8.6',
        });
    }

    // R6 — PCL-5 > 60 (extreme PTSD)
    if (data.pcl5Score !== undefined && data.pcl5Score > 60) {
        flags.push({
            id: 'REL-ASSESSMENT-PCL5-EXTREME',
            severity: 'RELATIVE',
            category: 'ASSESSMENT',
            headline: `Extreme PTSD severity (PCL-5: ${data.pcl5Score}/80)`,
            detail: 'PCL-5 > 60 indicates extreme PTSD symptom burden. Trauma material may surface intensely during session. Ensure trauma-informed guide training and robust integration plan are in place.',
            source: 'Baseline Mental Health Assessment — PCL-5',
            regulatoryBasis: 'Weathers et al. (2013); MAPS Protocol S2 §8.7',
        });
    }

    // R7 — BMI < 17.5 (anorexia risk)
    if (data.bmi !== undefined && data.bmi < 17.5) {
        flags.push({
            id: 'REL-DEMOGRAPHIC-LOW-BMI',
            severity: 'RELATIVE',
            category: 'DEMOGRAPHIC',
            headline: `Low BMI detected (${data.bmi.toFixed(1)}) — anorexia risk`,
            detail: 'BMI < 17.5 may indicate restrictive eating disorder. Low body weight affects substance pharmacokinetics and increases cardiovascular stress risk. Nutritional and cardiological clearance historically indicated.',
            source: 'Baseline Observations — Demographics (Weight/Height)',
            regulatoryBasis: 'DSM-5 AN Diagnostic Criteria; MAPS Protocol S2 §7.3',
        });
    }

    // R8 — Uncontrolled hypertension (SBP > 150, not absolute MDMA threshold)
    if (data.lastSystolicBP !== undefined && data.lastSystolicBP > 150) {
        // Only flag as relative if not already flagged as absolute (MDMA >160 is absolute)
        const isAlreadyAbsolute =
            data.sessionSubstance.toLowerCase() === 'mdma' && data.lastSystolicBP > 160;
        if (!isAlreadyAbsolute) {
            flags.push({
                id: 'REL-CARDIOVASCULAR-HTN',
                severity: 'RELATIVE',
                category: 'CARDIOVASCULAR',
                headline: `Elevated blood pressure (SBP ${data.lastSystolicBP} mmHg)`,
                detail: 'Systolic BP > 150 mmHg indicates Stage 2 hypertension. All psychedelics produce transient cardiovascular stimulation. Physician clearance historically indicated. Monitor vitals at 15-minute intervals during session.',
                source: 'Session Vitals — Blood Pressure',
                regulatoryBasis: 'AHA Hypertension Guidelines 2023; MAPS Protocol S2 §7.4',
            });
        }
    }

    // R9 — Stimulant use with MDMA (amphetamine risk)
    const stimulantDrugs = ['adderall', 'amphetamine', 'dextroamphetamine', 'methamphetamine', 'vyvanse', 'lisdexamfetamine', 'ritalin', 'methylphenidate', 'concerta'];
    if (
        data.sessionSubstance.toLowerCase() === 'mdma' &&
        matchesAny(data.medications, stimulantDrugs)
    ) {
        flags.push({
            id: 'REL-MEDICATION-STIMULANT-MDMA',
            severity: 'RELATIVE',
            category: 'MEDICATION',
            headline: 'Stimulant medication detected with MDMA session',
            detail: 'Concurrent stimulant therapy (amphetamines/methylphenidate) with MDMA increases cardiovascular strain and serotonergic risk. Review and document cardiac clearance. Hold stimulant dose on session day if cleared by prescriber.',
            source: 'Baseline Observations — Medication List',
            regulatoryBasis: 'MAPS Protocol S2 §7.2',
        });
    }

    // ── IBOGAINE-SPECIFIC RELATIVE RULES (R10–R17) ───────────────────────────
    // Source: Dr. Fernando Vega MD (v5.8) + Dr. Jason Allen (600+ sessions)
    // All rules are substance-gated. They CANNOT fire for psilocybin, MDMA, or ketamine.
    const relSubstanceLower = data.sessionSubstance.toLowerCase();
    if (relSubstanceLower === 'ibogaine' || relSubstanceLower.includes('ibogaine')) {

        // R10 — Elevated baseline QTc 490–549ms (amber monitoring tier)
        // Range check avoids double-flagging with ABS-IBO-QTC-GATE (>550ms).
        if (
            data.qtcBaselineMs !== undefined &&
            data.qtcBaselineMs >= 490 &&
            data.qtcBaselineMs <= 549
        ) {
            flags.push({
                id: 'REL-IBO-QTC-AMBER',
                severity: 'RELATIVE',
                category: 'CARDIOVASCULAR',
                headline: `Elevated baseline QTc ${data.qtcBaselineMs}ms — heightened cardiac monitoring required (Amber tier)`,
                detail: `Baseline QTc of ${data.qtcBaselineMs}ms falls in the amber monitoring tier (490–549ms) per Dr. Jason Allen's clinical thresholds. Session may proceed with heightened monitoring. ECG should be repeated at 30-minute intervals during active session. No hard block at this tier — practitioner retains full clinical authority. (Orange tier: 500ms+ requires assessment of HR, RR, diaphoresis, and cognition.)`,
                source: 'EKG Component — Baseline ECG / QTc',
                regulatoryBasis: 'Dr. Jason Allen clinical thresholds (600+ sessions)',
            });
        }

        // R11 — CYP2D6 strong inhibitors (elevated ibogaine plasma concentration risk)
        // Ibogaine is heavily metabolized by CYP2D6. Strong inhibitors raise plasma levels
        // and amplify all ibogaine effects including QT prolongation.
        const cyp2d6StrongInhibitors = [
            'paroxetine', 'fluoxetine', 'propafenone',
            'terbinafine', 'chlorpromazine', 'quinidine',
        ];
        if (matchesAny(data.medications, cyp2d6StrongInhibitors)) {
            flags.push({
                id: 'REL-IBO-CYP2D6-STRONG',
                severity: 'RELATIVE',
                category: 'MEDICATION',
                headline: 'CYP2D6 strong inhibitor detected — elevated ibogaine plasma concentration risk',
                detail: 'Ibogaine is primarily metabolized by CYP2D6. Strong CYP2D6 inhibitors (paroxetine, fluoxetine, propafenone, terbinafine, chlorpromazine, quinidine) significantly reduce ibogaine clearance, producing higher and more prolonged plasma levels. This amplifies QT prolongation and all ibogaine effects. Physician review and dose adjustment planning required.',
                source: 'Baseline Observations — Medication List',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8',
            });
        }

        // R12 — CYP2D6 moderate inhibitors (enhanced ibogaine effect — monitor)
        const cyp2d6ModerateInhibitors = [
            'duloxetine', 'fluvoxamine', 'haloperidol',
            'clozapine', 'cinacalcet', 'fluphenazine',
        ];
        if (matchesAny(data.medications, cyp2d6ModerateInhibitors)) {
            flags.push({
                id: 'REL-IBO-CYP2D6-MODERATE',
                severity: 'RELATIVE',
                category: 'MEDICATION',
                headline: 'CYP2D6 moderate inhibitor detected — monitor for enhanced ibogaine effect',
                detail: 'Moderate CYP2D6 inhibitors (duloxetine, fluvoxamine, haloperidol, clozapine, cinacalcet, fluphenazine) partially reduce ibogaine clearance. Monitor for prolonged or intensified ibogaine effect. Document clinical decision to proceed.',
                source: 'Baseline Observations — Medication List',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8',
            });
        }

        // R13 — Tricyclic antidepressants (additive hERG block + QT prolongation)
        const tcaDrugs = [
            'amitriptyline', 'imipramine', 'nortriptyline',
            'desipramine', 'clomipramine',
        ];
        if (matchesAny(data.medications, tcaDrugs)) {
            flags.push({
                id: 'REL-IBO-TCA',
                severity: 'RELATIVE',
                category: 'CARDIOVASCULAR',
                headline: 'Tricyclic antidepressant detected — additive hERG block and QT prolongation risk',
                detail: 'Tricyclic antidepressants (amitriptyline, imipramine, nortriptyline, desipramine, clomipramine) independently block the hERG potassium channel. Combined with ibogaine, the additive effect increases QT prolongation and Torsade de Pointes risk. Document clinical rationale. Baseline QTc should be established and closely monitored.',
                source: 'Baseline Observations — Medication List',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8',
            });
        }

        // R14 — Diuretics (electrolyte depletion amplifies TdP risk)
        // Hypokalemia, hypomagnesemia, and hypocalcemia all increase TdP risk in the
        // context of QT prolongation. Electrolyte correction is mandatory before session.
        const diureticDrugs = [
            'furosemide', 'hydrochlorothiazide', 'bumetanide',
            'torsemide', 'chlorthalidone', 'spironolactone',
        ];
        if (matchesAny(data.medications, diureticDrugs)) {
            flags.push({
                id: 'REL-IBO-DIURETIC',
                severity: 'RELATIVE',
                category: 'CARDIOVASCULAR',
                headline: 'Diuretic detected — electrolyte correction (K⁺, Mg²⁺, Ca²⁺) mandatory before session',
                detail: 'Diuretics (furosemide, hydrochlorothiazide, bumetanide, torsemide, chlorthalidone, spironolactone) cause electrolyte loss (potassium, magnesium, calcium). Electrolyte deficiencies substantially amplify QT prolongation and Torsade de Pointes risk when combined with ibogaine. Serum electrolyte panel and correction is mandatory before the session proceeds.',
                source: 'Baseline Observations — Medication List',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8',
            });
        }

        // R15 — Digoxin (electrolyte instability amplifies TdP risk)
        if (matchesAny(data.medications, ['digoxin'])) {
            flags.push({
                id: 'REL-IBO-DIGOXIN',
                severity: 'RELATIVE',
                category: 'CARDIOVASCULAR',
                headline: 'Digoxin detected — electrolyte instability amplifies Torsade de Pointes risk',
                detail: 'Digoxin has a narrow therapeutic window and sensitizes the heart to electrolyte fluctuations. Combined with ibogaine-related QT prolongation, any hypokalemia or hypomagnesemia significantly elevates Torsade de Pointes risk. Serum digoxin level and electrolyte panel required before session.',
                source: 'Baseline Observations — Medication List',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8',
            });
        }

        // R16 — Hepatic impairment (ibogaine metabolism severely impaired)
        // Ibogaine is CYP2D6-dependent. Hepatic disease depletes CYP2D6 reserves,
        // causing prolonged ibogaine exposure and amplified cardiac risk.
        const hepaticTerms = [
            'liver disease', 'cirrhosis', 'hepatitis',
            'alcoholic liver disease', 'child-pugh',
        ];
        if (matchesAny(data.psychiatricHistory, hepaticTerms) || matchesAny(data.medications, hepaticTerms)) {
            flags.push({
                id: 'REL-IBO-HEPATIC',
                severity: 'RELATIVE',
                category: 'MEDICATION',
                headline: 'Hepatic impairment identified — ibogaine metabolism severely impaired',
                detail: 'Ibogaine is heavily metabolised by hepatic CYP2D6. Liver disease, cirrhosis, hepatitis, or alcoholic liver disease significantly reduces CYP2D6 reserves, causing accumulation of ibogaine and its active metabolites. This prolongs and amplifies all effects including QT prolongation. Hepatology clearance and LFT panel required before session.',
                source: 'Baseline Observations — Psychiatric / Medical History',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8',
            });
        }

        // R17 — Antimalarials (IK1 channel block + QT prolongation)
        const antimalarialDrugs = ['chloroquine', 'hydroxychloroquine'];
        if (matchesAny(data.medications, antimalarialDrugs)) {
            flags.push({
                id: 'REL-IBO-CHLOROQUINE',
                severity: 'RELATIVE',
                category: 'CARDIOVASCULAR',
                headline: 'Antimalarial detected — IK1 channel block and QT prolongation risk with Ibogaine',
                detail: 'Chloroquine and hydroxychloroquine block both hERG (IKr) and IK1 (KCNJ2) potassium channels, producing independent QT prolongation. Combined with ibogaine, cumulative channel blockade significantly elevates cardiac risk. Cardiology review and baseline QTc confirmation required.',
                source: 'Baseline Observations — Medication List',
                regulatoryBasis: 'Vega MD — Hazards and Benefits of Psychedelic Medicine v5.8',
            });
        }

    } // end Ibogaine relative rules block

    return flags;
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * runContraindicationEngine
 * Primary entry point. Pass normalized intake data, receive structured verdict.
 * No async calls — pure synchronous rule evaluation for predictability.
 */
export function runContraindicationEngine(data: IntakeScreeningData): ContraindicationResult {
    const absoluteFlags = checkAbsoluteContraindications(data);
    const relativeFlags = checkRelativeContraindications(data);

    let verdict: ContraindicationResult['verdict'];
    if (absoluteFlags.length > 0) {
        verdict = 'DO_NOT_PROCEED';
    } else if (relativeFlags.length > 0) {
        verdict = 'PROCEED_WITH_CAUTION';
    } else {
        verdict = 'CLEAR';
    }

    return {
        verdict,
        absoluteFlags,
        relativeFlags,
        generatedAt: new Date().toISOString(),
        patientId: data.patientId,
        sessionSubstance: data.sessionSubstance,
    };
}
