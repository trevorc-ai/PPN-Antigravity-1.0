/**
 * Benchmark Readiness Calculator
 * 
 * Calculates benchmark readiness score (0-100%) based on 5 network requirements
 */

export interface BenchmarkRequirement {
    name: string;
    met: boolean;
    form: string;
    completedAt?: string;
    action?: string;
}

export interface BenchmarkReadinessResult {
    score: number; // 0-100
    requirements: BenchmarkRequirement[];
    isBenchmarkReady: boolean;
    metCount: number;
    totalCount: number;
}

export interface PatientBenchmarkData {
    hasBaselineAssessment?: boolean;
    baselineAssessmentDate?: string;
    hasFollowUpAssessment?: boolean;
    followUpAssessmentDate?: string;
    hasDosingProtocol?: boolean;
    dosingProtocolDate?: string;
    hasSetAndSetting?: boolean;
    setAndSettingDate?: string;
    hasSafetyCheck?: boolean;
    safetyCheckDate?: string;
}

/**
 * Calculate benchmark readiness score based on 5 requirements
 * 
 * Requirements:
 * 1. Baseline outcome measure (PHQ-9, GAD-7, etc.)
 * 2. At least one defined follow-up timepoint (6-week assessment)
 * 3. Coded exposure record (substance, route, dose)
 * 4. Coded setting and support structure (set & setting)
 * 5. Coded safety event capture (safety checks)
 * 
 * Each requirement = 20 points (5 × 20 = 100%)
 */
export const calculateBenchmarkReadiness = (
    patient: PatientBenchmarkData,
    enabledFeatures?: string[] // Optional array of form IDs from ProtocolContext
): BenchmarkReadinessResult => {
    let score = 0;
    const requirements: BenchmarkRequirement[] = [];

    // Requirement 1: Baseline outcome measure (Mental Health Screening)
    if (!enabledFeatures || enabledFeatures.includes('mental-health')) {
        if (patient.hasBaselineAssessment) {
            requirements.push({
                name: 'Baseline outcome measure',
                met: true,
                form: 'Mental Health Screening',
                completedAt: patient.baselineAssessmentDate
            });
        } else {
            requirements.push({
                name: 'Baseline outcome measure',
                met: false,
                form: 'Mental Health Screening',
                action: 'Complete Phase 1 baseline assessment'
            });
        }
    }

    // Requirement 2: Follow-up timepoint (Longitudinal Assessment)
    if (!enabledFeatures || enabledFeatures.includes('longitudinal-assessment')) {
        if (patient.hasFollowUpAssessment) {
            requirements.push({
                name: 'Follow-up timepoint',
                met: true,
                form: 'Longitudinal Assessment',
                completedAt: patient.followUpAssessmentDate
            });
        } else {
            requirements.push({
                name: 'Follow-up timepoint',
                met: false,
                form: 'Longitudinal Assessment',
                action: 'Schedule 6-week follow-up assessment'
            });
        }
    }

    // Requirement 3: Coded exposure record (Dosing Protocol)
    if (!enabledFeatures || enabledFeatures.includes('dosing-protocol')) {
        if (patient.hasDosingProtocol) {
            requirements.push({
                name: 'Coded exposure record',
                met: true,
                form: 'Dosing Protocol',
                completedAt: patient.dosingProtocolDate
            });
        } else {
            requirements.push({
                name: 'Coded exposure record',
                met: false,
                form: 'Dosing Protocol',
                action: 'Complete dosing session protocol'
            });
        }
    }

    // Requirement 4: Coded setting/support (Set & Setting)
    if (!enabledFeatures || enabledFeatures.includes('set-and-setting')) {
        if (patient.hasSetAndSetting) {
            requirements.push({
                name: 'Coded setting/support',
                met: true,
                form: 'Set & Setting',
                completedAt: patient.setAndSettingDate
            });
        } else {
            requirements.push({
                name: 'Coded setting/support',
                met: false,
                form: 'Set & Setting',
                action: 'Complete set & setting assessment'
            });
        }
    }

    // Requirement 5: Safety event capture (Structured Safety Check)
    if (!enabledFeatures || enabledFeatures.includes('structured-safety')) {
        if (patient.hasSafetyCheck) {
            requirements.push({
                name: 'Safety event capture',
                met: true,
                form: 'Structured Safety Check',
                completedAt: patient.safetyCheckDate
            });
        } else {
            requirements.push({
                name: 'Safety event capture',
                met: false,
                form: 'Structured Safety Check',
                action: 'Complete safety check'
            });
        }
    }

    const metCount = requirements.filter(r => r.met).length;
    const totalCount = requirements.length;
    score = totalCount === 0 ? 100 : Math.round((metCount / totalCount) * 100);

    return {
        score,
        requirements,
        isBenchmarkReady: score === 100,
        metCount,
        totalCount
    };
};

/**
 * Get next steps for missing requirements
 */
export const getNextSteps = (result: BenchmarkReadinessResult): string[] => {
    return result.requirements
        .filter(r => !r.met && r.action)
        .map(r => r.action!);
};

/**
 * Format score as percentage string
 */
export const formatScore = (score: number): string => {
    return `${score}%`;
};

/**
 * Get progress bar segments (5 dots)
 */
export const getProgressSegments = (metCount: number): boolean[] => {
    return Array.from({ length: 5 }, (_, i) => i < metCount);
};
