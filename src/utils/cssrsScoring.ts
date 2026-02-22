/**
 * C-SSRS Scoring (Columbia Suicide Severity Rating Scale)
 * 
 * Standardized assessment tool for suicidal ideation and behavior
 */

export type CSSRSScore = 0 | 1 | 2 | 3 | 4 | 5;
export type RiskLevel = 'none' | 'low' | 'moderate' | 'high';

export interface CSSRSAssessment {
    score: CSSRSScore;
    riskLevel: RiskLevel;
    label: string;
    description: string;
    requiresImmediateAction: boolean;
}

/**
 * C-SSRS Score Definitions:
 * 
 * Score 0: No suicidal ideation
 * Score 1-2: Passive ideation (no plan)
 * Score 3-4: Active ideation (with some intent)
 * Score 5: Active ideation with plan (HIGH RISK)
 */
export const CSSRS_SCORES: Record<CSSRSScore, CSSRSAssessment> = {
    0: {
        score: 0,
        riskLevel: 'none',
        label: 'No suicidal ideation',
        description: 'No thoughts of suicide or self-harm',
        requiresImmediateAction: false
    },
    1: {
        score: 1,
        riskLevel: 'low',
        label: 'Passive ideation',
        description: 'Wish to be dead without active plan',
        requiresImmediateAction: false
    },
    2: {
        score: 2,
        riskLevel: 'low',
        label: 'Passive ideation',
        description: 'Non-specific active suicidal thoughts',
        requiresImmediateAction: false
    },
    3: {
        score: 3,
        riskLevel: 'moderate',
        label: 'Active ideation',
        description: 'Active suicidal thoughts with some intent',
        requiresImmediateAction: true
    },
    4: {
        score: 4,
        riskLevel: 'moderate',
        label: 'Active ideation',
        description: 'Active suicidal thoughts with specific method',
        requiresImmediateAction: true
    },
    5: {
        score: 5,
        riskLevel: 'high',
        label: 'Active with plan',
        description: 'Active suicidal ideation with specific plan and intent',
        requiresImmediateAction: true
    }
};

/**
 * Get C-SSRS assessment details for a given score
 */
export const getCSSRSAssessment = (score: CSSRSScore): CSSRSAssessment => {
    return CSSRS_SCORES[score];
};

/**
 * Determine if score requires auto-flagging
 * (Score >= 3 triggers high-risk alert)
 */
export const requiresAutoFlag = (score: CSSRSScore): boolean => {
    return score >= 3;
};

/**
 * Get risk mitigation actions based on C-SSRS score
 */
export const getRiskMitigationActions = (score: CSSRSScore): string[] => {
    const assessment = getCSSRSAssessment(score);

    if (score === 0) {
        return ['Continue routine monitoring'];
    }

    if (score === 1 || score === 2) {
        return [
            'Document in patient record',
            'Schedule follow-up check-in',
            'Monitor for escalation'
        ];
    }

    if (score === 3 || score === 4) {
        return [
            'Auto-flag patient as moderate risk',
            'Contact patient within 24 hours',
            'Activate safety protocol',
            'Document all interventions',
            'Schedule integration session'
        ];
    }

    // Score 5
    return [
        'Auto-flag patient as HIGH RISK',
        'Contact patient within 1 hour',
        'Emergency contact notification',
        'Safety plan creation required',
        'Follow-up scheduled (24 hours)',
        'Document all interventions'
    ];
};

/**
 * Get color for risk level
 */
export const getRiskColor = (riskLevel: RiskLevel): string => {
    switch (riskLevel) {
        case 'none':
            return 'text-emerald-400';
        case 'low':
            return 'text-blue-400';
        case 'moderate':
            return 'text-yellow-400';
        case 'high':
            return 'text-red-400';
    }
};

/**
 * Get background color for risk level
 */
export const getRiskBgColor = (riskLevel: RiskLevel): string => {
    switch (riskLevel) {
        case 'none':
            return 'bg-emerald-500/10 border-emerald-500/30';
        case 'low':
            return 'bg-blue-500/10 border-blue-500/30';
        case 'moderate':
            return 'bg-yellow-500/10 border-yellow-500/30';
        case 'high':
            return 'bg-red-500/10 border-red-500/30';
    }
};

/**
 * Get icon for risk level
 */
export const getRiskIcon = (riskLevel: RiskLevel): string => {
    switch (riskLevel) {
        case 'none':
            return '🟢';
        case 'low':
            return '🔵';
        case 'moderate':
            return '🟡';
        case 'high':
            return '🔴';
    }
};
