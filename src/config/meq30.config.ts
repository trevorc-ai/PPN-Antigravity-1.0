import { AssessmentConfig } from '../components/arc-of-care/AssessmentForm';

/**
 * MEQ-30: Mystical Experience Questionnaire (30-item version)
 * 
 * Measures the intensity of mystical-type experiences during psychedelic sessions
 * 
 * Scoring:
 * - 30 questions, each rated 0-4
 * - Raw score: 0-120
 * - Normalized to 0-100
 * - Score ≥60 indicates "complete mystical experience"
 * - Correlates with 87% remission rate at 6 months
 * 
 * 7 Subscales:
 * 1. Mystical (Unity, Noetic Quality, Sacredness)
 * 2. Positive Mood
 * 3. Transcendence of Time and Space
 * 4. Ineffability
 * 5. Internal Unity
 * 6. External Unity
 * 7. Sacredness
 */

export const MEQ30_CONFIG: AssessmentConfig = {
    id: 'meq30',
    name: 'Mystical Experience Questionnaire (MEQ-30)',
    shortName: 'MEQ-30',
    description: 'Please rate the degree to which you experienced the following during your session.',
    questionsPerPage: 10,
    scoring: {
        method: 'sum',
        normalize: { from: 120, to: 100 }
    },
    questions: [
        // Internal Unity (4 questions)
        {
            id: 'meq_1',
            text: 'Freedom from the limitations of your personal self and feeling a unity or bond with what was felt to be greater than your personal self.',
            subscale: 'Internal Unity',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_2',
            text: 'Experience of pure being and pure awareness (beyond the world of sense impressions).',
            subscale: 'Internal Unity',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_3',
            text: 'Experience of oneness or unity with objects and/or persons perceived in your surroundings.',
            subscale: 'Internal Unity',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_4',
            text: 'Experience of the fusion of your personal self into a larger whole.',
            subscale: 'Internal Unity',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },

        // External Unity (6 questions)
        {
            id: 'meq_5',
            text: 'Experience of unity with ultimate reality.',
            subscale: 'External Unity',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_6',
            text: 'Feeling that you experienced eternity or infinity.',
            subscale: 'External Unity',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_7',
            text: 'Experience of oneness in relation to an "inner world" within.',
            subscale: 'External Unity',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_8',
            text: 'Loss of your usual sense of time.',
            subscale: 'External Unity',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_9',
            text: 'Loss of your usual sense of space.',
            subscale: 'External Unity',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_10',
            text: 'Loss of usual awareness of where you were.',
            subscale: 'External Unity',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },

        // Sacredness (3 questions)
        {
            id: 'meq_11',
            text: 'Sense of being at a spiritual height.',
            subscale: 'Sacredness',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_12',
            text: 'Sense of reverence.',
            subscale: 'Sacredness',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_13',
            text: 'Feeling that you experienced something profoundly sacred and holy.',
            subscale: 'Sacredness',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },

        // Noetic Quality (6 questions)
        {
            id: 'meq_14',
            text: 'Gain of insightful knowledge experienced at an intuitive level.',
            subscale: 'Noetic Quality',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_15',
            text: 'Certainty of encounter with ultimate reality (in the sense of being able to "know" and "see" what is really real at some point during your experience).',
            subscale: 'Noetic Quality',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_16',
            text: 'You are convinced now, as you look back, that in your experience you encountered ultimate reality (i.e., that you "knew" and "saw" what was really real).',
            subscale: 'Noetic Quality',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_17',
            text: 'Feeling that you experienced something profoundly true and real.',
            subscale: 'Noetic Quality',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_18',
            text: 'Insight into the nature of reality.',
            subscale: 'Noetic Quality',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_19',
            text: 'Sense of being "outside of" time, beyond past and future.',
            subscale: 'Noetic Quality',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },

        // Deeply Felt Positive Mood (6 questions)
        {
            id: 'meq_20',
            text: 'Experience of amazement.',
            subscale: 'Positive Mood',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_21',
            text: 'Feelings of tenderness and gentleness.',
            subscale: 'Positive Mood',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_22',
            text: 'Feelings of peace and tranquility.',
            subscale: 'Positive Mood',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_23',
            text: 'Experience of ecstasy.',
            subscale: 'Positive Mood',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_24',
            text: 'Sense of awe or awesomeness.',
            subscale: 'Positive Mood',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_25',
            text: 'Feelings of joy.',
            subscale: 'Positive Mood',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },

        // Ineffability (5 questions)
        {
            id: 'meq_26',
            text: 'Sense that the experience cannot be described adequately in words.',
            subscale: 'Ineffability',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_27',
            text: 'Feeling that it would be difficult to communicate your experience to others who have not had similar experiences.',
            subscale: 'Ineffability',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_28',
            text: 'Feeling that you could not do justice to your experience by describing it in words.',
            subscale: 'Ineffability',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_29',
            text: 'Feeling that you experienced something ineffable, that is, something that you could not put into words.',
            subscale: 'Ineffability',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        },
        {
            id: 'meq_30',
            text: 'Feeling that you experienced something that you could not adequately express in words.',
            subscale: 'Ineffability',
            type: 'likert',
            min: 0,
            max: 4,
            labels: [
                { value: 0, label: 'None; not at all' },
                { value: 1, label: 'So slight cannot decide' },
                { value: 2, label: 'Moderate' },
                { value: 3, label: 'Strong' },
                { value: 4, label: 'Extreme' }
            ]
        }
    ]
};
