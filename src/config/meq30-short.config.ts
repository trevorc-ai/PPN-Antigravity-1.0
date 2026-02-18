import { AssessmentConfig } from '../components/arc-of-care/AssessmentForm';

/**
 * MEQ-30 Short Form (5 questions)
 * 
 * Validated brief version for rapid screening
 * 
 * Scoring:
 * - 5 questions, each rated 0-4
 * - Raw score: 0-20
 * - Normalized to 0-100
 * 
 * Interpretation:
 * - ≥60: Complete mystical experience → Expand to full MEQ-30
 * - 40-59: Strong experience → Continue with brief assessments
 * - <40: Minimal experience → Expand to investigate
 * 
 * Questions selected based on highest factor loadings:
 * 1. Internal Unity (core mystical dimension)
 * 2. Sacredness (spiritual significance)
 * 3. Noetic Quality (insight/truth)
 * 4. Positive Mood (emotional tone)
 * 5. Ineffability (beyond words)
 */

export const MEQ30_SHORT_CONFIG: AssessmentConfig = {
    id: 'meq30_short',
    name: 'Quick Experience Check',
    shortName: 'MEQ-Brief',
    description: 'A brief check-in about your session experience. This will only take 2 minutes.',
    questionsPerPage: 5,
    scoring: {
        method: 'sum',
        normalize: { from: 20, to: 100 }
    },
    questions: [
        {
            id: 'meq_short_1',
            text: 'Experience of unity with ultimate reality.',
            subscale: 'External Unity',
            tooltip: 'Measures the sense of oneness with the external world.',
            citation: 'Barrett et al., 2015',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None' },
                { value: 1, label: 'Slight' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_short_2',
            text: 'Feeling that you experienced something profoundly sacred and holy.',
            subscale: 'Sacredness',
            tooltip: 'Assesses the spiritual depth and reverence felt.',
            citation: 'Barrett et al., 2015',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None' },
                { value: 1, label: 'Slight' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_short_3',
            text: 'Certainty of encounter with ultimate reality (being able to "know" and "see" what is really real).',
            subscale: 'Noetic Quality',
            tooltip: 'Evaluates the sense of gaining direct knowledge or insight.',
            citation: 'Barrett et al., 2015',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None' },
                { value: 1, label: 'Slight' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_short_4',
            text: 'Experience of ecstasy.',
            subscale: 'Positive Mood',
            tooltip: 'Tracks intense positive emotional states.',
            citation: 'Barrett et al., 2015',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None' },
                { value: 1, label: 'Slight' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_short_5',
            text: 'Sense that the experience cannot be described adequately in words.',
            subscale: 'Ineffability',
            tooltip: 'Captures the difficulty of using words to describe the experience.',
            citation: 'Barrett et al., 2015',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None' },
                { value: 1, label: 'Slight' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        }
    ]
};
