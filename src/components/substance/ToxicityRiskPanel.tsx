import React, { useState } from 'react';
import type { Substance, RiskTier } from '../../types';
import RiskTierBadge from './RiskTierBadge';

interface ToxicityRiskPanelProps {
    substance: Substance;
}

const TIER_SUMMARY: Record<RiskTier, { label: string; icon: string; color: string }> = {
    'CARDIAC RISK': {
        label: 'High — Mandatory cardiac screening required before administration',
        icon: 'monitor_heart',
        color: '#ef4444',
    },
    'MAOI INTERACTION RISK': {
        label: 'Moderate-High — MAOI activity creates serious drug-drug interaction risk',
        icon: 'warning',
        color: '#f97316',
    },
    'DISSOCIATIVE PROTOCOL': {
        label: 'Moderate — Monitored clinical setting required; dissociation expected',
        icon: 'psychology_alt',
        color: '#3b82f6',
    },
    'FDA APPROVED · REMS': {
        label: 'Moderate — REMS program enrollment required; 2-hour post-dose monitoring',
        icon: 'verified',
        color: '#10b981',
    },
    'STANDARD MONITORING': {
        label: 'Standard — Well-tolerated physiologically at clinical doses',
        icon: 'health_and_safety',
        color: '#64748b',
    },
};

/**
 * ToxicityRiskPanel — the primary unmet-market-need section.
 * Slot 4 of the Monograph, full-width.
 *
 * Shows:
 *  - Risk classification header (with tier summary)
 *  - Toxicity highlights list
 *  - Absolute contraindications list
 *  - Required pre-session screening checklist
 *
 * No competitor tool surfaces this at the compound level for psychedelics.
 */
const ToxicityRiskPanel: React.FC<ToxicityRiskPanelProps> = ({ substance: sub }) => {
    const [screeningChecked, setScreeningChecked] = useState<Record<number, boolean>>({});

    const tier = sub.riskTier ?? 'STANDARD MONITORING';
    const summary = TIER_SUMMARY[tier];
    const hasData =
        (sub.toxicityHighlights?.length ?? 0) > 0 ||
        (sub.absoluteContraindications?.length ?? 0) > 0 ||
        (sub.requiredScreening?.length ?? 0) > 0;

    if (!hasData) return null;

    const toggleScreening = (i: number) =>
        setScreeningChecked(prev => ({ ...prev, [i]: !prev[i] }));

    return (
        <section
            className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-3xl shadow-2xl space-y-6"
            aria-labelledby="toxicity-heading"
        >
            {/* Header */}
            <div className="flex flex-wrap gap-3 items-start justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="size-10 rounded-xl flex items-center justify-center border shrink-0"
                        style={{ background: `${summary.color}15`, borderColor: `${summary.color}30`, color: summary.color }}
                    >
                        <span className="material-symbols-outlined text-xl" aria-hidden="true">
                            {summary.icon}
                        </span>
                    </div>
                    <div>
                        <h3
                            id="toxicity-heading"
                            className="text-[13px] font-black tracking-[0.2em] uppercase"
                            style={{ color: '#A8B5D1' }}
                        >
                            Toxicity &amp; Risk Analysis
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug max-w-lg">
                            {summary.label}
                        </p>
                    </div>
                </div>
                <RiskTierBadge tier={tier} size="md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Toxicity highlights */}
                {(sub.toxicityHighlights?.length ?? 0) > 0 && (
                    <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
                        <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-slate-600" aria-hidden="true">
                                science
                            </span>
                            Toxicity Profile
                        </h4>
                        <ul className="space-y-2" role="list" aria-label="Toxicity highlights">
                            {sub.toxicityHighlights!.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-400 font-medium leading-snug">
                                    <span
                                        className="material-symbols-outlined text-[14px] text-slate-600 shrink-0 mt-0.5"
                                        aria-hidden="true"
                                    >
                                        fiber_manual_record
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Absolute contraindications */}
                {(sub.absoluteContraindications?.length ?? 0) > 0 && (
                    <div
                        className="rounded-2xl p-4 space-y-3 border"
                        style={{ background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.15)' }}
                    >
                        <h4 className="text-[11px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm" aria-hidden="true">
                                block
                            </span>
                            Absolute Contraindications
                        </h4>
                        <ul className="space-y-2" role="list" aria-label="Absolute contraindications">
                            {sub.absoluteContraindications!.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-red-300/80 font-medium leading-snug">
                                    <span
                                        className="material-symbols-outlined text-[14px] text-red-500 shrink-0 mt-0.5"
                                        aria-hidden="true"
                                    >
                                        close
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Required pre-session screening */}
                {(sub.requiredScreening?.length ?? 0) > 0 && (
                    <div
                        className="rounded-2xl p-4 space-y-3 border"
                        style={{ background: 'rgba(251,191,36,0.04)', borderColor: 'rgba(251,191,36,0.15)' }}
                    >
                        <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm" aria-hidden="true">
                                checklist
                            </span>
                            Pre-Session Screening
                        </h4>
                        <ul className="space-y-2" role="list" aria-label="Required pre-session screening">
                            {sub.requiredScreening!.map((item, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => toggleScreening(i)}
                                        className="flex items-start gap-2.5 text-sm text-amber-200/70 font-medium leading-snug text-left hover:text-amber-200 transition-colors w-full"
                                        aria-pressed={!!screeningChecked[i]}
                                        aria-label={`Mark "${item}" as ${screeningChecked[i] ? 'incomplete' : 'complete'}`}
                                    >
                                        <span
                                            className="material-symbols-outlined text-[16px] shrink-0 mt-0.5 transition-colors"
                                            style={{ color: screeningChecked[i] ? '#10b981' : '#92400e' }}
                                            aria-hidden="true"
                                        >
                                            {screeningChecked[i] ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                        <span className={screeningChecked[i] ? 'line-through opacity-50' : ''}>
                                            {item}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-600 font-medium leading-relaxed border-t border-white/5 pt-4">
                This risk analysis is for practitioner reference only. Clinical decisions require
                individual patient assessment. Sources: published clinical trial safety data, FDA
                product labeling, peer-reviewed pharmacology literature.
            </p>
        </section>
    );
};

export default ToxicityRiskPanel;
