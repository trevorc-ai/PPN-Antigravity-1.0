import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Substance } from '../../types';
import { INTERACTION_RULES } from '../../constants';
import IsometricMolecule from '../science/IsometricMolecule';
import RiskTierBadge from './RiskTierBadge';

interface SubstanceCardProps {
    substance: Substance;
}

const PHASE_BADGE: Record<string, string> = {
    'Approved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Phase 3': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Phase 2': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'Phase 1': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    'Pre-Clinical': 'bg-slate-600/10 text-slate-500 border-slate-600/20',
};

/**
 * SubstanceCard — catalog preview card for a single substance.
 * Self-contained: handles navigation, interaction count, risk badge,
 * isometric molecule display, efficacy bar.
 * 
 * Used by SubstanceCatalog grid — one per substance.
 */
const SubstanceCard: React.FC<SubstanceCardProps> = ({ substance: sub }) => {
    const navigate = useNavigate();

    const interactionCount = INTERACTION_RULES.filter(r =>
        r.substance === sub.name
    ).length;

    const phaseClass = PHASE_BADGE[sub.phase as string] ?? PHASE_BADGE['Phase 1'];

    return (
        <article
            className="group relative flex flex-col bg-[#0d1117]/80 border border-slate-800/60 rounded-[1.75rem] overflow-hidden shadow-2xl transition-all duration-300 hover:border-slate-600/60 hover:-translate-y-1"
            style={{
                boxShadow: `0 0 0 0 ${sub.color}00`,
                transition: 'box-shadow 0.4s ease, transform 0.3s ease, border-color 0.3s ease',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px -8px ${sub.color}40`;
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${sub.color}00`;
            }}
            aria-label={`${sub.name} substance card`}
        >
            {/* Molecule Image — visual hero */}
            <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{
                    background: `radial-gradient(ellipse at center, ${sub.color}18 0%, transparent 70%)`,
                    minHeight: '220px',
                    padding: '1.5rem 1.5rem 0.75rem',
                }}
            >
                {/* Research phase badge — top left */}
                <div className="absolute top-4 left-4 z-10">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${phaseClass}`}>
                        {sub.phase}
                    </span>
                </div>

                {/* Schedule badge — top right */}
                <div className="absolute top-4 right-4 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-slate-900/80 text-slate-500 border border-slate-800">
                        {sub.schedule}
                    </span>
                </div>

                <IsometricMolecule
                    image={sub.imageUrl}
                    name={sub.name}
                    formula={sub.formula}
                    glowColor={sub.color}
                    tiltOnHover
                    showLabel={false}
                    className="w-40 h-40"
                />
            </div>

            {/* Content body */}
            <div className="flex flex-col flex-1 p-5 gap-4">

                {/* Identity */}
                <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-100">{sub.name}</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug">
                        {sub.chemicalName}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-slate-800/80 text-slate-500 text-[11px] font-black uppercase tracking-widest">
                        {sub.class}
                    </span>
                </div>

                {/* Risk tier */}
                {sub.riskTier && (
                    <RiskTierBadge tier={sub.riskTier} size="sm" />
                )}

                {/* Efficacy bar */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                            Efficacy Signal
                        </span>
                        <span className="text-[11px] font-black text-slate-400">
                            {Math.round(sub.efficacy * 100)}%
                        </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${sub.efficacy * 100}%`,
                                background: `linear-gradient(90deg, ${sub.color}80, ${sub.color})`,
                            }}
                        />
                    </div>
                </div>

                {/* Interaction count badge */}
                {interactionCount > 0 && (
                    <div className="flex items-center gap-2 text-[11px] text-amber-500/80 font-bold">
                        <span className="material-symbols-outlined text-sm" aria-hidden="true">warning</span>
                        <span>{interactionCount} documented drug interaction{interactionCount > 1 ? 's' : ''}</span>
                    </div>
                )}

                {/* Divider */}
                <div className="flex-1" />

                {/* CTA */}
                <button
                    id={`view-monograph-${sub.id}`}
                    onClick={() => navigate(`/monograph/${sub.id}`)}
                    className="w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200 active:scale-95 border"
                    style={{
                        background: `${sub.color}15`,
                        borderColor: `${sub.color}30`,
                        color: sub.color,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = `${sub.color}25`;
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = `${sub.color}15`;
                    }}
                    aria-label={`View full monograph for ${sub.name}`}
                >
                    View Full Monograph
                </button>
            </div>
        </article>
    );
};

export default SubstanceCard;
