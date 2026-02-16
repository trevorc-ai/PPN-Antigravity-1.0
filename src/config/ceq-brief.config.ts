import { AssessmentConfig } from '../components/arc-of-care/AssessmentForm';

/**
 * CEQ Brief (3 questions)
 * 
 * Rapid screening for challenging experiences
 * 
 * Scoring:
 * - 3 questions, each rated 0-5
 * - Raw score: 0-15
 * - Normalized to 0-100
 * 
 * Interpretation:
 * - ≥60: Significant challenges → Expand to full CEQ (26 questions)
 * - <60: Manageable challenges → Continue with brief
 * 
 * Questions selected (highest clinical relevance):
 * 1. Fear (most common challenging emotion)
 * 2. Grief (emotional processing)
 * 3. Physical distress (safety concern)
 */

export const CEQ_BRIEF_CONFIG: AssessmentConfig = {
    id: 'ceq_brief',
    name: 'Challenge Check',
    shortName: 'CEQ-Brief',
    description: 'A few questions about any difficult moments during your session.',
    questionsPerPage: 3,
    scoring: {
        method: 'sum',
        normalize: { from: 15, to: 100 }
    },
    questions: [
        {
            id: 'ceq_brief_1',
            text: 'I experienced fear.',
            subscale: 'Fear',
            type: 'likert',
            min: 0,
            max: 5,
            labels: [
                { value: 0, label: 'None' },
                { value: 1, label: 'Slight' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Very Strong' },
                { value: 5, label: 'Extreme' }
            ]
        },
        {
            id: 'ceq_brief_2',
            text: 'I experienced grief.',
            subscale: 'Grief',
            type: 'likert',
            min: 0,
            max: 5,
            labels: [
                { value: 0, label: 'None' },
                { value: 1, label: 'Slight' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Very Strong' },
                { value: 5, label: 'Extreme' }
            ]
        },
        {
            id: 'ceq_brief_3',
            text: 'I experienced physical distress.',
            subscale: 'Physical Distress',
            type: 'likert',
            min: 0,
            max: 5,
            labels: [
                { value: 0, label: 'None' },
                { value: 1, label: 'Slight' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Very Strong' },
                { value: 5, label: 'Extreme' }
            ]
        }
    ]
};
