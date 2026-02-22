/**
 * Clinical Narrative Generator
 * WO-076: Auto-Generated Clinical Narratives
 * 
 * Generates professional clinical narratives from structured Phase 1 baseline data.
 * All output uses objective language — no clinical insights or medical advice.
 * Patient ID only (no PHI).
 */

// ─── Score Interpretation Tables ───────────────────────────────────────────

export function interpretPHQ9(score: number): string {
    if (score <= 4) return 'minimal depression';
    if (score <= 9) return 'mild depression';
    if (score <= 14) return 'moderate depression';
    if (score <= 19) return 'moderately severe depression';
    return 'severe depression';
}

export function interpretGAD7(score: number): string {
    if (score <= 4) return 'minimal anxiety';
    if (score <= 9) return 'mild anxiety';
    if (score <= 14) return 'moderate anxiety';
    return 'severe anxiety';
}

export function interpretPCL5(score: number): string {
    if (score < 33) return 'below clinical threshold';
    if (score < 50) return 'significant PTSD symptoms (above clinical threshold of 33)';
    return 'severe PTSD symptoms (well above clinical threshold of 33)';
}

export function interpretACE(score: number): string {
    if (score === 0) return 'no reported adverse childhood experiences';
    if (score <= 3) return 'low-to-moderate adverse childhood experiences';
    return 'moderate-to-high adverse childhood experiences';
}

export function interpretHRV(hrv: number, ageGroup: string): { label: string; range: string } {
    const ranges: Record<string, { min: number; max: number; typical: number }> = {
        '18-25': { min: 55, max: 105, typical: 80 },
        '26-35': { min: 50, max: 95, typical: 72 },
        '36-45': { min: 40, max: 60, typical: 50 },
        '46-55': { min: 25, max: 45, typical: 35 },
        '56+': { min: 20, max: 35, typical: 28 },
    };
    const range = ranges[ageGroup] ?? ranges['36-45'];
    const rangeStr = `${range.min}–${range.max}ms for age group ${ageGroup}`;
    if (hrv < range.min) return { label: 'below typical range', range: rangeStr };
    if (hrv > range.max) return { label: 'above typical range', range: rangeStr };
    return { label: 'within typical range', range: rangeStr };
}

// ─── Input Types ────────────────────────────────────────────────────────────

export interface MentalHealthData {
    phq9?: number;
    gad7?: number;
    pcl5?: number;
    ace?: number;
}

export interface SetSettingData {
    treatment_expectancy?: number; // 0–100
}

export interface PhysiologyData {
    hrv_ms?: number;
    bp_systolic?: number;
    bp_diastolic?: number;
    age_group?: string;
}

export interface ObservationsData {
    motivation_level?: string;
    support_system?: string;
    prior_experience?: string;
}

export interface ConsentData {
    consent_type?: string;
    consent_obtained?: boolean;
}

export interface NarrativeInput {
    patientId: string;
    assessmentDate?: string;
    mentalHealth?: MentalHealthData;
    setSetting?: SetSettingData;
    physiology?: PhysiologyData;
    observations?: ObservationsData;
    consent?: ConsentData;
}

export interface GeneratedNarrative {
    text: string;
    sections: Record<string, string>;
    generatedAt: string;
    patientId: string;
    completeness: number; // 0–100%
}

// ─── Generator ──────────────────────────────────────────────────────────────

export function generateBaselineNarrative(input: NarrativeInput): GeneratedNarrative {
    const date = input.assessmentDate ?? new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
    const sections: Record<string, string> = {};
    let completedSections = 0;
    const totalSections = 5;

    // ── Section 1: Mental Health Screening ──
    if (input.mentalHealth) {
        const mh = input.mentalHealth;
        const lines: string[] = ['Patient completed baseline mental health screening.'];
        if (mh.phq9 !== undefined) lines.push(`PHQ-9 score of ${mh.phq9} indicates ${interpretPHQ9(mh.phq9)} (scale: 0–27).`);
        if (mh.gad7 !== undefined) lines.push(`GAD-7 score of ${mh.gad7} indicates ${interpretGAD7(mh.gad7)} (scale: 0–21).`);
        if (mh.ace !== undefined) lines.push(`ACE score of ${mh.ace} indicates ${interpretACE(mh.ace)}.`);
        if (mh.pcl5 !== undefined) lines.push(`PCL-5 score of ${mh.pcl5} indicates ${interpretPCL5(mh.pcl5)}.`);
        sections['MENTAL HEALTH SCREENING'] = lines.join(' ');
        completedSections++;
    }

    // ── Section 2: Set & Setting ──
    if (input.setSetting) {
        const ss = input.setSetting;
        const lines: string[] = [];
        if (ss.treatment_expectancy !== undefined) {
            const level = ss.treatment_expectancy >= 70 ? 'high' : ss.treatment_expectancy >= 40 ? 'moderate' : 'low';
            lines.push(`Treatment expectancy score of ${ss.treatment_expectancy}/100 indicates ${level} confidence in treatment outcomes.`);
        }
        if (lines.length > 0) {
            sections['SET & SETTING'] = lines.join(' ');
            completedSections++;
        }
    }

    // ── Section 3: Baseline Physiology ──
    if (input.physiology) {
        const ph = input.physiology;
        const lines: string[] = [];
        if (ph.hrv_ms !== undefined) {
            const hrv = interpretHRV(ph.hrv_ms, ph.age_group ?? '36-45');
            lines.push(`Resting HRV: ${ph.hrv_ms.toFixed(1)}ms — ${hrv.label} (${hrv.range}).`);
        }
        if (ph.bp_systolic !== undefined && ph.bp_diastolic !== undefined) {
            const bpLabel = ph.bp_systolic < 120 ? 'normal' : ph.bp_systolic < 130 ? 'elevated' : 'high';
            lines.push(`Blood pressure: ${ph.bp_systolic}/${ph.bp_diastolic} mmHg (${bpLabel}).`);
        }
        if (lines.length > 0) {
            sections['BASELINE PHYSIOLOGY'] = lines.join(' ');
            completedSections++;
        }
    }

    // ── Section 4: Clinical Observations ──
    if (input.observations) {
        const obs = input.observations;
        const lines: string[] = [];
        if (obs.motivation_level) lines.push(`Motivation level documented as: ${obs.motivation_level}.`);
        if (obs.support_system) lines.push(`Support system: ${obs.support_system}.`);
        if (obs.prior_experience) lines.push(`Prior psychedelic experience: ${obs.prior_experience}.`);
        if (lines.length > 0) {
            sections['CLINICAL OBSERVATIONS'] = lines.join(' ');
            completedSections++;
        }
    }

    // ── Section 5: Informed Consent ──
    if (input.consent) {
        const c = input.consent;
        const lines: string[] = [];
        if (c.consent_obtained) {
            lines.push('Informed consent obtained and documented.');
            if (c.consent_type) lines.push(`Consent type: ${c.consent_type}.`);
        } else {
            lines.push('Informed consent not yet obtained.');
        }
        sections['INFORMED CONSENT'] = lines.join(' ');
        completedSections++;
    }

    // ── Assemble full text ──
    const header = [
        'BASELINE ASSESSMENT NARRATIVE',
        `Patient ID: ${input.patientId}`,
        `Assessment Date: ${date}`,
        '',
    ].join('\n');

    const body = Object.entries(sections)
        .map(([title, content]) => `${title}:\n${content}`)
        .join('\n\n');

    const text = header + body;
    const completeness = Math.round((completedSections / totalSections) * 100);

    return {
        text,
        sections,
        generatedAt: new Date().toISOString(),
        patientId: input.patientId,
        completeness,
    };
}

/**
 * copyNarrativeToClipboard
 * Copies the narrative text to clipboard. Returns true on success.
 */
export async function copyNarrativeToClipboard(narrative: GeneratedNarrative): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(narrative.text);
        return true;
    } catch {
        return false;
    }
}

/**
 * downloadNarrativeAsText
 * Triggers a plain-text download of the narrative.
 */
export function downloadNarrativeAsText(narrative: GeneratedNarrative): void {
    const blob = new Blob([narrative.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baseline_narrative_${narrative.patientId}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
