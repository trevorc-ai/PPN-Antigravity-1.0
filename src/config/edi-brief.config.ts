import { AssessmentConfig } from '../components/arc-of-care/AssessmentForm';

/**
 * EDI Brief (2 questions)
 * 
 * Rapid screening for ego dissolution
 * 
 * Scoring:
 * - 2 questions, 0-100 slider scale
 * - Average of both scores
 * 
 * Interpretation:
 * - ≥70: Strong ego dissolution → Continue with brief
 * - <70: Investigate further → Expand to full EDI (8 questions)
 * 
 * Questions selected:
 * 1. Core ego dissolution (boundaries dissolving)
 * 2. Unity with surroundings (loss of self/other distinction)
 */

export const EDI_BRIEF_CONFIG: AssessmentConfig = {
    id: 'edi_brief',
    name: 'Ego Dissolution Check',
    shortName: 'EDI-Brief',
    description: 'Two quick questions about the depth of your experience.',
    questionsPerPage: 2,
    scoring: {
        method: 'average'
    },
    questions: [
        {
            id: 'edi_brief_1',
            text: 'I experienced a disintegration of my "self" or ego.',
            tooltip: 'Measures the reduction in self-referential awareness.',
            citation: 'Nour et al., 2016',
            type: 'slider',
            min: 0,
            max: 100,
            labels: [
                { value: 0, label: 'No, not at all' },
                { value: 100, label: 'Yes, entirely' }
            ]
        },
        {
            id: 'edi_brief_2',
            text: 'I experienced a dissolution of my "self" or ego.',
            tooltip: 'Assesses the merging of self with surroundings.',
            citation: 'Nour et al., 2016',
            type: 'slider',
            min: 0,
            max: 100,
            labels: [
                { value: 0, label: 'No, not at all' },
                { value: 100, label: 'Yes, entirely' }
            ]
        }
    ]
};
