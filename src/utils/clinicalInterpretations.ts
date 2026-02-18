/**
 * Clinical Interpretations Utility
 * WO-076: Auto-Generated Clinical Narratives
 *
 * Maps raw assessment scores to clinical severity labels, descriptions,
 * and age-adjusted physiological ranges. No PHI stored here — pure logic.
 */

// ─── PHQ-9 (Depression) ──────────────────────────────────────────────────────

export interface ScoreInterpretation {
    severity: string;
    description: string;
    flag: boolean; // true = clinically significant, warrants mention
}

export function interpretPHQ9(score: number): ScoreInterpretation {
    if (score <= 4) return { severity: 'Minimal', description: 'minimal depression symptoms', flag: false };
    if (score <= 9) return { severity: 'Mild', description: 'mild depression symptoms', flag: false };
    if (score <= 14) return { severity: 'Moderate', description: 'moderate depression (clinical threshold met)', flag: true };
    if (score <= 19) return { severity: 'Moderately Severe', description: 'moderately severe depression', flag: true };
    return { severity: 'Severe', description: 'severe depression (score ≥ 20)', flag: true };
}

// ─── GAD-7 (Anxiety) ─────────────────────────────────────────────────────────

export function interpretGAD7(score: number): ScoreInterpretation {
    if (score <= 4) return { severity: 'Minimal', description: 'minimal anxiety symptoms', flag: false };
    if (score <= 9) return { severity: 'Mild', description: 'mild anxiety symptoms', flag: false };
    if (score <= 14) return { severity: 'Moderate', description: 'moderate anxiety (clinical threshold met)', flag: true };
    return { severity: 'Severe', description: 'severe anxiety symptoms', flag: true };
}

// ─── PCL-5 (PTSD) ────────────────────────────────────────────────────────────

export function interpretPCL5(score: number): ScoreInterpretation {
    if (score < 33) return { severity: 'Sub-threshold', description: 'PTSD symptoms below clinical threshold', flag: false };
    if (score < 50) return { severity: 'Moderate', description: 'significant PTSD symptoms (threshold: 33)', flag: true };
    return { severity: 'Severe', description: 'severe PTSD symptom burden (score ≥ 50)', flag: true };
}

// ─── ACE Score (Childhood Adversity) ─────────────────────────────────────────

export function interpretACE(score: number): ScoreInterpretation {
    if (score === 0) return { severity: 'None', description: 'no reported childhood adversity', flag: false };
    if (score <= 3) return { severity: 'Low–Moderate', description: 'low-to-moderate childhood adversity', flag: false };
    return { severity: 'Moderate–High', description: 'moderate-to-high childhood adversity (score ≥ 4)', flag: true };
}

// ─── HRV (Heart Rate Variability) — Age-Adjusted ─────────────────────────────

interface HRVRange {
    min: number;
    max: number;
    typical: number;
    label: string;
}

const HRV_RANGES: Record<string, HRVRange> = {
    '18-25': { min: 55, max: 105, typical: 80, label: '18–25' },
    '26-35': { min: 50, max: 95, typical: 72, label: '26–35' },
    '36-45': { min: 40, max: 60, typical: 50, label: '36–45' },
    '46-55': { min: 25, max: 45, typical: 35, label: '46–55' },
    '56+': { min: 20, max: 35, typical: 28, label: '56+' },
};

export function getHRVRange(ageGroup: string): HRVRange {
    return HRV_RANGES[ageGroup] ?? HRV_RANGES['36-45'];
}

export function interpretHRV(hrv: number, ageGroup: string): ScoreInterpretation {
    const range = getHRVRange(ageGroup);
    if (hrv >= range.min && hrv <= range.max) {
        return {
            severity: 'Normal',
            description: `${hrv.toFixed(1)}ms (normal range for age ${range.label}: ${range.min}–${range.max}ms)`,
            flag: false,
        };
    }
    if (hrv < range.min) {
        return {
            severity: 'Below Normal',
            description: `${hrv.toFixed(1)}ms (below normal for age ${range.label}: expected ${range.min}–${range.max}ms)`,
            flag: true,
        };
    }
    return {
        severity: 'Above Normal',
        description: `${hrv.toFixed(1)}ms (above normal for age ${range.label}: expected ${range.min}–${range.max}ms)`,
        flag: false,
    };
}

// ─── Blood Pressure ───────────────────────────────────────────────────────────

export function interpretBP(systolic: number, diastolic: number): ScoreInterpretation {
    if (systolic < 90 || diastolic < 60) {
        return { severity: 'Low', description: `${systolic}/${diastolic} mmHg (hypotension — monitor closely)`, flag: true };
    }
    if (systolic < 120 && diastolic < 80) {
        return { severity: 'Normal', description: `${systolic}/${diastolic} mmHg (normal)`, flag: false };
    }
    if (systolic < 130 && diastolic < 80) {
        return { severity: 'Elevated', description: `${systolic}/${diastolic} mmHg (elevated)`, flag: true };
    }
    if (systolic < 140 || diastolic < 90) {
        return { severity: 'Stage 1 Hypertension', description: `${systolic}/${diastolic} mmHg (Stage 1 hypertension)`, flag: true };
    }
    return { severity: 'Stage 2 Hypertension', description: `${systolic}/${diastolic} mmHg (Stage 2 hypertension — clinical review required)`, flag: true };
}

// ─── Treatment Expectancy ─────────────────────────────────────────────────────

export function interpretExpectancy(score: number): ScoreInterpretation {
    if (score < 30) return { severity: 'Low', description: 'low treatment expectancy — may benefit from motivational work', flag: true };
    if (score < 60) return { severity: 'Moderate', description: 'moderate treatment expectancy with realistic outlook', flag: false };
    return { severity: 'High', description: 'high treatment expectancy and positive therapeutic alliance', flag: false };
}

// ─── MEQ-30 (Mystical Experience) ────────────────────────────────────────────

export function interpretMEQ30(score: number): ScoreInterpretation {
    // MEQ-30 total score 0–150; complete mystical experience threshold ≥ 60%
    const pct = (score / 150) * 100;
    if (pct >= 60) return { severity: 'Complete Mystical Experience', description: `MEQ-30 score ${score}/150 (${pct.toFixed(0)}%) — complete mystical experience threshold met`, flag: false };
    if (pct >= 30) return { severity: 'Partial Mystical Experience', description: `MEQ-30 score ${score}/150 (${pct.toFixed(0)}%) — partial mystical experience`, flag: false };
    return { severity: 'Minimal', description: `MEQ-30 score ${score}/150 (${pct.toFixed(0)}%) — minimal mystical experience features`, flag: false };
}
