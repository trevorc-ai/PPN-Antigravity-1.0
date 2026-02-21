/**
 * contraindicationEngine.ts — WO-309
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

    // A1 — Active lithium use
    if (matchesAny(data.medications, ['lithium'])) {
        flags.push({
            id: 'ABS-MEDICATION-LITHIUM',
            severity: 'ABSOLUTE',
            category: 'MEDICATION',
            headline: 'Active lithium detected — session contraindicated',
            detail: 'Concurrent lithium use significantly elevates risk of serotonin syndrome and cardiac arrhythmia in combination with serotonergic psychedelics. Lithium must be discontinued under physician supervision before any session.',
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
            detail: 'BPD may increase risk of intense affective responses and emotional dysregulation during sessions. Heightened preparation and integration support recommended. Document clinical justification.',
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
            detail: 'SSRIs may blunt MDMA therapeutic effect and increase serotonin syndrome risk. Recommend gradual taper under physician supervision 2 weeks prior. Do not discontinue abruptly. Document clinical decision.',
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
            detail: 'BMI < 17.5 may indicate restrictive eating disorder. Low body weight affects substance pharmacokinetics and increases cardiovascular stress risk. Nutritional and cardiological clearance recommended.',
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
                detail: 'Systolic BP > 150 mmHg indicates Stage 2 hypertension. All psychedelics produce transient cardiovascular stimulation. Physician clearance recommended. Monitor vitals at 15-minute intervals during session.',
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
