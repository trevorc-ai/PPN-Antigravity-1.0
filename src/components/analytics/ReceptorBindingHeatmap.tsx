
import React, { useState, useMemo } from 'react';
import { SUBSTANCES } from '../../constants';
import { Dna, Info, SlidersHorizontal } from 'lucide-react';

// ─── pKi conversion: Ki (nM) → pKi ──────────────────────────────────────────
// pKi = -log10(Ki in Molar) = 9 - log10(Ki in nM)
// Ki ≥ 10000 nM → no significant binding → pKi 0
const toPKi = (ki: number | undefined): number => {
    if (ki === undefined || ki >= 10000) return 0;
    return parseFloat((9 - Math.log10(ki)).toFixed(1));
};

// ─── Affinity label + cell style from pKi ───────────────────────────────────
interface AffinityMeta {
    label: string;
    shortLabel: string;
    cellBg: string;
    cellBorder: string;
    textColor: string;
    glowColor: string;
}

const getAffinityMeta = (pki: number, dimmed: boolean): AffinityMeta => {
    const opacity = dimmed ? '/20' : '';
    if (pki === 0) return {
        label: 'No significant binding',
        shortLabel: 'None',
        cellBg: `bg-slate-900${opacity}`,
        cellBorder: 'border-slate-800/60',
        textColor: 'text-slate-700',
        glowColor: 'transparent',
    };
    if (pki < 5.5) return {
        label: 'Very Low affinity',
        shortLabel: 'Very Low',
        cellBg: dimmed ? 'bg-slate-800/20' : 'bg-slate-800/50',
        cellBorder: dimmed ? 'border-slate-700/30' : 'border-slate-700',
        textColor: dimmed ? 'text-slate-700' : 'text-slate-500',
        glowColor: 'transparent',
    };
    if (pki < 6.5) return {
        label: 'Low affinity',
        shortLabel: 'Low',
        cellBg: dimmed ? 'bg-amber-900/10' : 'bg-amber-900/25',
        cellBorder: dimmed ? 'border-amber-800/20' : 'border-amber-800/50',
        textColor: dimmed ? 'text-amber-900/50' : 'text-amber-500/80',
        glowColor: 'transparent',
    };
    if (pki < 7.5) return {
        label: 'Moderate affinity',
        shortLabel: 'Moderate',
        cellBg: dimmed ? 'bg-amber-700/10' : 'bg-amber-700/25',
        cellBorder: dimmed ? 'border-amber-600/20' : 'border-amber-600/50',
        textColor: dimmed ? 'text-amber-700/40' : 'text-amber-400',
        glowColor: '#f59e0b',
    };
    if (pki < 8.5) return {
        label: 'High affinity',
        shortLabel: 'High',
        cellBg: dimmed ? 'bg-indigo-800/10' : 'bg-indigo-800/30',
        cellBorder: dimmed ? 'border-indigo-600/20' : 'border-indigo-600/60',
        textColor: dimmed ? 'text-indigo-700/40' : 'text-indigo-300',
        glowColor: '#6366f1',
    };
    return {
        label: 'Very High affinity',
        shortLabel: 'Very High',
        cellBg: dimmed ? 'bg-indigo-600/10' : 'bg-indigo-600/30',
        cellBorder: dimmed ? 'border-indigo-400/20' : 'border-indigo-400/80',
        textColor: dimmed ? 'text-indigo-500/30' : 'text-indigo-200',
        glowColor: '#8b5cf6',
    };
};

// ─── Receptor descriptions (from SubstanceMonograph.tsx) ──────────────────────
const RECEPTOR_DESCRIPTIONS: Record<string, { role: string; clinicalNote: string }> = {
    '5-HT2A': { role: 'Serotonin 2A Receptor', clinicalNote: 'Primary driver of psychedelic effects. Agonism promotes neuroplasticity and altered perception.' },
    '5-HT1A': { role: 'Serotonin 1A Receptor', clinicalNote: 'Modulates anxiety and mood. Partial agonism associated with anxiolytic effects during sessions.' },
    '5-HT2C': { role: 'Serotonin 2C Receptor', clinicalNote: 'Influences appetite and impulsivity. Agonism linked to serotonin syndrome risk in SSRI combinations.' },
    'D2': { role: 'Dopamine D2 Receptor', clinicalNote: 'Modulates reward and psychosis risk. Relevance varies significantly by compound class.' },
    'D1': { role: 'Dopamine D1 Receptor', clinicalNote: 'Unique to ergolines like LSD. D1 agonism contributes to the energetic, stimulating, analytical character of the LSD experience — absent in tryptamines.' },
    'SERT': { role: 'Serotonin Transporter', clinicalNote: 'Blocks serotonin reuptake. High affinity raises serotonin syndrome risk with concurrent SSRIs/SNRIs.' },
    'DAT': { role: 'Dopamine Transporter', clinicalNote: "MDMA's second major transporter target. DAT reversal releases presynaptic dopamine, contributing to euphoria and stimulant effects." },
    'NMDA': { role: 'NMDA Glutamate Receptor', clinicalNote: 'Antagonism produces dissociative states. Relevant for ketamine and PCP-class compounds.' },
};

// ─── Receptor row definitions (8 rows) ────────────────────────────────────────
type ReceptorKey = keyof typeof RECEPTOR_DESCRIPTIONS;
interface ReceptorRow {
    label: ReceptorKey;
    kiKey: string;
    system: 'serotonin' | 'dopamine' | 'transporter' | 'glutamate';
}

const RECEPTOR_ROWS: ReceptorRow[] = [
    { label: '5-HT2A', kiKey: 'ht2a', system: 'serotonin' },
    { label: '5-HT1A', kiKey: 'ht1a', system: 'serotonin' },
    { label: '5-HT2C', kiKey: 'ht2c', system: 'serotonin' },
    { label: 'D2', kiKey: 'd2', system: 'dopamine' },
    { label: 'D1', kiKey: 'd1', system: 'dopamine' },
    { label: 'SERT', kiKey: 'sert', system: 'transporter' },
    { label: 'DAT', kiKey: 'dat', system: 'transporter' },
    { label: 'NMDA', kiKey: 'nmda', system: 'glutamate' },
];

// ─── Pharmacological class groupings ─────────────────────────────────────────
type PharmClass = 'All' | 'Serotonergics' | 'Dissociatives' | 'Entactogens' | 'Atypicals';
const CLASS_MAP: Record<string, PharmClass> = {
    'PSL-2201': 'Serotonergics',
    'LSD-2500': 'Serotonergics',
    'DMT-1102': 'Serotonergics',
    'DMT-0601': 'Serotonergics',
    'AYA-7701': 'Serotonergics',
    'MES-3301': 'Serotonergics',
    'MDM-4410': 'Entactogens',
    'KET-9921': 'Dissociatives',
    'ESK-3822': 'Dissociatives',
    'IBO-5501': 'Atypicals',
};

// Display order per WO-341 spec
const SUBSTANCE_ORDER = [
    'PSL-2201', // Psilocybin
    'MDM-4410', // MDMA
    'LSD-2500', // LSD-25
    'DMT-1102', // 5-MeO-DMT
    'DMT-0601', // DMT
    'AYA-7701', // Ayahuasca
    'MES-3301', // Mescaline
    'IBO-5501', // Ibogaine
    'KET-9921', // Ketamine
    'ESK-3822', // Esketamine
];

type ReceptorSystem = 'All' | 'Serotonin (5-HT)' | 'Dopamine (D1/D2)' | 'Transporters (SERT/DAT)' | 'Glutamate (NMDA)';

const ReceptorBindingHeatmap: React.FC = () => {
    // ─── Filter state ───────────────────────────────────────────────────────────
    const [classFilter, setClassFilter] = useState<PharmClass>('All');
    const [receptorFilter, setReceptorFilter] = useState<ReceptorSystem>('All');
    const [threshold, setThreshold] = useState<number>(0);

    // ─── Tooltip state ──────────────────────────────────────────────────────────
    const [tooltip, setTooltip] = useState<{
        substanceName: string;
        receptorLabel: ReceptorKey;
        ki: number | undefined;
        pki: number;
    } | null>(null);

    // ─── Derived filtered lists ─────────────────────────────────────────────────
    const orderedSubstances = useMemo(() =>
        SUBSTANCE_ORDER
            .map(id => SUBSTANCES.find(s => s.id === id))
            .filter(Boolean) as typeof SUBSTANCES,
        []);

    const filteredSubstances = useMemo(() =>
        orderedSubstances.filter(s =>
            classFilter === 'All' || CLASS_MAP[s.id] === classFilter
        ),
        [orderedSubstances, classFilter]);

    const filteredReceptors = useMemo(() =>
        RECEPTOR_ROWS.filter(r => {
            if (receptorFilter === 'All') return true;
            if (receptorFilter === 'Serotonin (5-HT)') return r.system === 'serotonin';
            if (receptorFilter === 'Dopamine (D1/D2)') return r.system === 'dopamine';
            if (receptorFilter === 'Transporters (SERT/DAT)') return r.system === 'transporter';
            if (receptorFilter === 'Glutamate (NMDA)') return r.system === 'glutamate';
            return true;
        }),
        [receptorFilter]);

    // ─── Cell data helper ────────────────────────────────────────────────────────
    const getCellData = (sub: typeof SUBSTANCES[0], receptor: ReceptorRow) => {
        const kiProfile = sub.kiProfile as Record<string, number | undefined> | undefined;
        const ki = kiProfile?.[receptor.kiKey];
        const pki = toPKi(ki);
        const dimmed = pki > 0 && pki < threshold;
        const meta = getAffinityMeta(pki, dimmed);
        return { ki, pki, dimmed, meta };
    };

    // ─── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col relative overflow-hidden group">

            {/* ── Header ── */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <Dna size={18} />
                        </div>
                        <h3 className="text-lg font-black text-slate-300 tracking-tight">Receptor Binding Affinity Matrix</h3>
                    </div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">pKi Heatmap — All 10 Compounds × 8 Receptor Systems</p>
                </div>

                {/* Info tooltip */}
                <div className="group/info relative flex-shrink-0">
                    <Info size={16} className="text-slate-600 hover:text-slate-300 transition-colors cursor-help" />
                    <div className="absolute right-0 top-6 w-64 p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-300 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl leading-relaxed">
                        <p className="font-bold text-indigo-400 mb-1">How to read this chart</p>
                        <p>pKi = −log₁₀(Ki). Higher pKi = stronger binding. Cells show the pKi value. Hover a cell for Ki (nM) and clinical context. Use filters to focus on a drug class or receptor system.</p>
                    </div>
                </div>
            </div>

            {/* ── Filter Controls ── */}
            <div className="mb-6 space-y-4 relative z-10">
                {/* Row 1: Class filter + Receptor system filter */}
                <div className="flex flex-wrap gap-3">
                    {/* Pharmacological class toggles */}
                    <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest self-center mr-1">Class:</span>
                        {(['All', 'Serotonergics', 'Dissociatives', 'Entactogens', 'Atypicals'] as PharmClass[]).map(cls => (
                            <button
                                key={cls}
                                onClick={() => setClassFilter(cls)}
                                aria-pressed={classFilter === cls}
                                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${classFilter === cls
                                        ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                                    }`}
                            >
                                {cls === 'All' ? '◉ All' : cls}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    {/* Receptor system toggles */}
                    <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest self-center mr-1">Receptor:</span>
                        {(['All', 'Serotonin (5-HT)', 'Dopamine (D1/D2)', 'Transporters (SERT/DAT)', 'Glutamate (NMDA)'] as ReceptorSystem[]).map(sys => (
                            <button
                                key={sys}
                                onClick={() => setReceptorFilter(sys)}
                                aria-pressed={receptorFilter === sys}
                                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${receptorFilter === sys
                                        ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                                    }`}
                            >
                                {sys === 'All' ? '◉ All' : sys}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Row 2: Threshold slider */}
                <div className="flex items-center gap-4">
                    <SlidersHorizontal size={14} className="text-slate-600 flex-shrink-0" />
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest flex-shrink-0">Min pKi:</span>
                    <input
                        type="range"
                        min={0}
                        max={9}
                        step={0.5}
                        value={threshold}
                        onChange={e => setThreshold(parseFloat(e.target.value))}
                        aria-label="Minimum pKi affinity threshold"
                        className="w-40 accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-sm font-black text-indigo-400 w-8">{threshold.toFixed(1)}</span>
                    <span className="text-xs text-slate-600 italic">Cells below threshold are dimmed</span>
                </div>
            </div>

            {/* ── Matrix Grid ── */}
            <div
                className="relative z-10 overflow-x-auto"
                aria-label="Receptor binding affinity matrix — all compounds"
                role="table"
            >
                {/* Column count: 1 label col + N substance cols */}
                <div
                    className="grid gap-1.5 min-w-max"
                    style={{ gridTemplateColumns: `160px repeat(${filteredSubstances.length}, minmax(72px, 1fr))` }}
                >

                    {/* ── Column headers ── */}
                    <div role="columnheader" aria-label="Receptor" className="pb-1" />
                    {filteredSubstances.map(sub => (
                        <div key={sub.id} role="columnheader" scope="col"
                            className="flex flex-col items-center justify-end pb-2 gap-1">
                            {/* Substance color dot */}
                            <div className="size-2 rounded-full" style={{ backgroundColor: sub.color || '#64748b' }} aria-hidden="true" />
                            <span
                                className="text-xs font-black text-slate-400 uppercase tracking-tight text-center leading-tight"
                                title={sub.name}
                            >
                                {sub.name.split('-')[0].split(' ')[0]}
                                {sub.name.includes('-') ? <><br />{'-' + sub.name.split('-')[1]}</> : null}
                            </span>
                        </div>
                    ))}

                    {/* ── Data rows ── */}
                    {filteredReceptors.map(receptor => (
                        <React.Fragment key={receptor.label}>
                            {/* Row header */}
                            <div role="rowheader" scope="row"
                                className="flex items-center justify-end pr-3 py-1">
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-400 leading-none">{receptor.label}</p>
                                    <p className="text-xs text-slate-600 mt-0.5 truncate max-w-[140px]">{RECEPTOR_DESCRIPTIONS[receptor.label].role.split(' ').slice(0, 2).join(' ')}</p>
                                </div>
                            </div>

                            {/* Substance cells */}
                            {filteredSubstances.map(sub => {
                                const { ki, pki, dimmed, meta } = getCellData(sub, receptor);
                                const hasData = ki !== undefined && ki < 10000;
                                const displayPki = pki > 0 ? pki.toFixed(1) : '—';

                                return (
                                    <div
                                        key={`${receptor.label}-${sub.id}`}
                                        role="cell"
                                        className="group/cell relative"
                                        onMouseEnter={() => setTooltip({ substanceName: sub.name, receptorLabel: receptor.label, ki, pki })}
                                        onMouseLeave={() => setTooltip(null)}
                                    >
                                        <div
                                            className={`w-full aspect-square rounded-xl border flex flex-col items-center justify-center cursor-help transition-all duration-300 ${meta.cellBg} ${meta.cellBorder}`}
                                            style={
                                                !dimmed && meta.glowColor && meta.glowColor !== 'transparent'
                                                    ? { boxShadow: `0 0 12px ${meta.glowColor}30` }
                                                    : {}
                                            }
                                            aria-label={`${sub.name} — ${receptor.label}: ${displayPki === '—' ? 'No data' : `pKi ${displayPki}`}`}
                                        >
                                            <span className={`text-sm font-black leading-none ${meta.textColor}`}>
                                                {displayPki}
                                            </span>
                                            {hasData && (
                                                <span className={`text-xs font-bold leading-none mt-0.5 ${meta.textColor} opacity-60`}>
                                                    {meta.shortLabel === 'None' ? '' : meta.shortLabel.split(' ')[0]}
                                                </span>
                                            )}
                                        </div>

                                        {/* ─── Cell tooltip ─────────────────────────────────── */}
                                        {tooltip?.substanceName === sub.name && tooltip?.receptorLabel === receptor.label && (
                                            <div
                                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl z-50 pointer-events-none"
                                                role="tooltip"
                                            >
                                                {/* Substance name + receptor */}
                                                <div className="flex items-center gap-2 mb-3 border-b border-slate-700/50 pb-2">
                                                    <div className="size-2 rounded-full flex-shrink-0" style={{ backgroundColor: sub.color || '#64748b' }} />
                                                    <span className="text-sm font-black text-slate-200 leading-tight">
                                                        {sub.name}
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-500">×</span>
                                                    <span className="text-sm font-black text-indigo-400">{receptor.label}</span>
                                                </div>

                                                {/* Ki value */}
                                                {hasData ? (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-baseline">
                                                            <span className="text-xs text-slate-500 uppercase tracking-wider">Ki</span>
                                                            <span className="text-base font-black text-slate-200">{ki?.toLocaleString()} nM</span>
                                                        </div>
                                                        <div className="flex justify-between items-baseline">
                                                            <span className="text-xs text-slate-500 uppercase tracking-wider">pKi</span>
                                                            <span className="text-base font-black text-indigo-300">{pki.toFixed(1)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-slate-500 uppercase tracking-wider">Affinity</span>
                                                            <span
                                                                className="text-sm font-bold px-2 py-0.5 rounded"
                                                                style={{
                                                                    color: meta.glowColor && meta.glowColor !== 'transparent' ? meta.glowColor : '#94a3b8',
                                                                    backgroundColor: meta.glowColor && meta.glowColor !== 'transparent' ? `${meta.glowColor}20` : '#1e293b',
                                                                }}
                                                            >
                                                                {meta.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-slate-500 uppercase tracking-wider">Binding</span>
                                                        <span className="text-sm font-bold text-slate-600">≥10,000 nM — No sig. binding</span>
                                                    </div>
                                                )}

                                                {/* Clinical note */}
                                                <p className="text-sm text-slate-400 leading-relaxed mt-3 border-t border-slate-700/40 pt-3">
                                                    {RECEPTOR_DESCRIPTIONS[receptor.label].clinicalNote}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ── Legend Footer ── */}
            <div className="mt-6 pt-4 border-t border-slate-800 relative z-10">
                <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
                    {[
                        { label: 'Very High (≥8.5)', color: '#8b5cf6', note: 'Sub-nanomolar affinity' },
                        { label: 'High (7.5–8.5)', color: '#6366f1', note: 'High affinity' },
                        { label: 'Moderate (6.5–7.5)', color: '#f59e0b', note: 'Moderate affinity' },
                        { label: 'Low (5.5–6.5)', color: '#78716c', note: 'Weak binding' },
                        { label: 'None / No Data', color: '#334155', note: 'Ki ≥10,000 nM' },
                    ].map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                            <div
                                className="size-3 rounded-sm flex-shrink-0"
                                style={{ backgroundColor: item.color }}
                                aria-hidden="true"
                            />
                            <div>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                <span className="text-xs text-slate-600 ml-2">— {item.note}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-center text-xs text-slate-700 mt-3 italic">
                    Source: Peer-reviewed Ki binding data. Lower Ki = stronger binding = higher pKi. Hover any cell for clinical context.
                </p>
            </div>
        </div>
    );
};

export default ReceptorBindingHeatmap;
