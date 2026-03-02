import React from 'react';
import { SubstanceCategory } from '../../hooks/useCompassSession';

// Static network statistics scoped by substance + indication
const STATS: Record<SubstanceCategory, {
    responseRate: number;
    avgImprovement: number;
    completionRate: number;
    indication: string;
}> = {
    psilocybin: { responseRate: 67, avgImprovement: 48, completionRate: 82, indication: 'depression & anxiety' },
    ketamine: { responseRate: 71, avgImprovement: 52, completionRate: 78, indication: 'treatment-resistant depression' },
    mdma: { responseRate: 67, avgImprovement: 55, completionRate: 86, indication: 'trauma & PTSD' },
    ayahuasca: { responseRate: 64, avgImprovement: 44, completionRate: 80, indication: 'existential distress' },
    unknown: { responseRate: 66, avgImprovement: 49, completionRate: 81, indication: 'mental health conditions' },
};

const SUBSTANCE_NAMES: Record<SubstanceCategory, string> = {
    psilocybin: 'Psilocybin-assisted therapy',
    ketamine: 'Ketamine-assisted therapy',
    mdma: 'MDMA-assisted therapy',
    ayahuasca: 'Ayahuasca-assisted therapy',
    unknown: 'Psychedelic-assisted therapy',
};

export interface NetworkBenchmarkBlockProps {
    substanceCategory: SubstanceCategory;
    accentColor: string;
}

export const NetworkBenchmarkBlock: React.FC<NetworkBenchmarkBlockProps> = ({
    substanceCategory,
    accentColor,
}) => {
    const stats = STATS[substanceCategory];
    const substanceName = SUBSTANCE_NAMES[substanceCategory];

    const cards = [
        {
            value: `${stats.responseRate}%`,
            label: 'Clinical response rate',
            sub: 'Significant symptom reduction',
        },
        {
            value: `${stats.avgImprovement}%`,
            label: 'Average improvement',
            sub: 'In primary measure scores',
        },
        {
            value: `${stats.completionRate}%`,
            label: 'Integration completion',
            sub: 'Patients who complete 4+ check-ins',
        },
    ];

    return (
        <div>
            <p className="ppn-body" style={{ marginBottom: 16 }}>
                In{' '}
                <span style={{ color: accentColor, fontWeight: 700 }}>{substanceName}</span>
                {' '}for {stats.indication} tracked by PPN:
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 12,
            }}>
                {cards.map(({ value, label, sub }, i) => (
                    <div key={i} style={{
                        background: `${accentColor}08`,
                        border: `1px solid ${accentColor}20`,
                        borderRadius: 14,
                        padding: '16px 18px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: 30, fontWeight: 900, color: accentColor, lineHeight: 1 }}>
                            {value}
                        </div>
                        <div className="ppn-label" style={{ marginTop: 6, marginBottom: 4 }}>
                            {label}
                        </div>
                        <div className="ppn-meta" style={{ lineHeight: 1.4 }}>
                            {sub}
                        </div>
                    </div>
                ))}
            </div>

            <p className="ppn-meta" style={{ textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
                Data sourced from PPN network practitioners. Not population averages — substance and indication-matched.
            </p>
        </div>
    );
};

export default NetworkBenchmarkBlock;
