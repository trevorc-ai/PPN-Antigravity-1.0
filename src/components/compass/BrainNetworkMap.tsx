import React, { useMemo } from 'react';
import { SubstanceCategory } from '../../hooks/useCompassSession';

// ─── Static node positions (DMN + key network nodes in normalized 0-100 space)
const NODES = [
    { id: 'mPFC', x: 50, y: 18, label: 'mPFC', desc: 'Self-referential thinking' },
    { id: 'PCC', x: 50, y: 55, label: 'PCC', desc: 'Default mode hub' },
    { id: 'AMY', x: 28, y: 42, label: 'Amy', desc: 'Emotion regulation' },
    { id: 'HPC', x: 72, y: 42, label: 'Hipp', desc: 'Memory formation' },
    { id: 'TPC', x: 20, y: 25, label: 'TPJ-L', desc: 'Social cognition' },
    { id: 'TPR', x: 80, y: 25, label: 'TPJ-R', desc: 'Theory of mind' },
    { id: 'DLPFC', x: 22, y: 65, label: 'dlPFC', desc: 'Executive control' },
    { id: 'ACC', x: 50, y: 38, label: 'ACC', desc: 'Conflict monitoring' },
    { id: 'INS', x: 34, y: 56, label: 'Insula', desc: 'Interoception' },
    { id: 'V1', x: 50, y: 82, label: 'V1', desc: 'Visual processing' },
];

// Conditioned (baseline) connections — loops & rigid patterns
const BASELINE_EDGES = [
    ['mPFC', 'PCC'],
    ['PCC', 'AMY'],
    ['AMY', 'mPFC'],
    ['ACC', 'DLPFC'],
    ['ACC', 'AMY'],
    ['HPC', 'PCC'],
    ['TPC', 'mPFC'],
    ['TPR', 'mPFC'],
];

// New connections formed during session — cross-wiring explosion
const SESSION_EDGES: [string, string][] = [
    ['V1', 'mPFC'],
    ['V1', 'AMY'],
    ['INS', 'HPC'],
    ['INS', 'V1'],
    ['DLPFC', 'AMY'],
    ['DLPFC', 'HPC'],
    ['DLPFC', 'V1'],
    ['TPC', 'INS'],
    ['TPC', 'V1'],
    ['TPR', 'INS'],
    ['TPR', 'AMY'],
    ['TPR', 'HPC'],
    ['TPR', 'V1'],
    ['ACC', 'V1'],
    ['ACC', 'INS'],
    ['ACC', 'HPC'],
    ['PCC', 'V1'],
    ['PCC', 'TPC'],
    ['PCC', 'TPR'],
    ['PCC', 'DLPFC'],
    ['HPC', 'mPFC'],
    ['HPC', 'TPC'],
];

function getNodePos(id: string, w: number, h: number) {
    const node = NODES.find(n => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return { x: (node.x / 100) * w, y: (node.y / 100) * h };
}

export interface BrainNetworkMapProps {
    substanceCategory: SubstanceCategory;
    accentColor: string;
}

export const BrainNetworkMap: React.FC<BrainNetworkMapProps> = ({
    substanceCategory,
    accentColor,
}) => {
    const W = 240; const H = 200;

    const substanceLabels: Record<SubstanceCategory, string> = {
        psilocybin: 'Psilocybin',
        ketamine: 'Ketamine',
        mdma: 'MDMA',
        ayahuasca: 'Ayahuasca',
        unknown: 'Psychedelic',
    };

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* ── Left: Conditioned mind ── */}
                <div>
                    <p className="ppn-label" style={{ textAlign: 'center', marginBottom: 8 }}>
                        The Conditioned Mind
                    </p>
                    <div style={{
                        background: 'rgba(15,23,42,0.6)',
                        border: '1px solid rgba(100,116,139,0.2)',
                        borderRadius: 12,
                        padding: 8,
                    }}>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-label="Conditioned mind brain network" role="img">
                            {/* Baseline edges — rigid, loops */}
                            {BASELINE_EDGES.map(([a, b], i) => {
                                const p1 = getNodePos(a, W, H);
                                const p2 = getNodePos(b, W, H);
                                return (
                                    <line
                                        key={i}
                                        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                        stroke="rgba(100,116,139,0.45)"
                                        strokeWidth={1.5}
                                    />
                                );
                            })}
                            {/* Nodes */}
                            {NODES.map(node => {
                                const { x, y } = getNodePos(node.id, W, H);
                                return (
                                    <g key={node.id}>
                                        <circle cx={x} cy={y} r={6} fill="rgba(51,65,85,0.9)" stroke="rgba(100,116,139,0.5)" strokeWidth={1.5} />
                                        <text x={x} y={y + 14} textAnchor="middle" fill="rgba(100,116,139,0.7)" fontSize={7} fontWeight={600}>{node.label}</text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                    <p className="ppn-meta" style={{ textAlign: 'center', marginTop: 6 }}>
                        Repetitive thought patterns
                    </p>
                </div>

                {/* ── Right: During session ── */}
                <div>
                    <p className="ppn-label" style={{ textAlign: 'center', marginBottom: 8, color: accentColor }}>
                        During Your Session
                    </p>
                    <div style={{
                        background: 'rgba(15,23,42,0.6)',
                        border: `1px solid ${accentColor}30`,
                        borderRadius: 12,
                        padding: 8,
                        boxShadow: `0 0 24px ${accentColor}10`,
                    }}>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-label="Brain during psychedelic session — new connections forming" role="img">
                            <defs>
                                <filter id="brain-glow">
                                    <feGaussianBlur stdDeviation="2" result="blur" />
                                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </defs>

                            {/* Baseline edges (faint) */}
                            {BASELINE_EDGES.map(([a, b], i) => {
                                const p1 = getNodePos(a, W, H);
                                const p2 = getNodePos(b, W, H);
                                return (
                                    <line
                                        key={`base-${i}`}
                                        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                        stroke="rgba(100,116,139,0.20)"
                                        strokeWidth={1}
                                    />
                                );
                            })}

                            {/* New session edges — glowing cross-wiring */}
                            {SESSION_EDGES.map(([a, b], i) => {
                                const p1 = getNodePos(a, W, H);
                                const p2 = getNodePos(b, W, H);
                                // Vary opacity by index to create depth
                                const opacity = 0.25 + (i % 5) * 0.12;
                                return (
                                    <line
                                        key={`sess-${i}`}
                                        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                        stroke={accentColor}
                                        strokeWidth={0.8}
                                        opacity={opacity}
                                        filter="url(#brain-glow)"
                                    />
                                );
                            })}

                            {/* Nodes — glowing */}
                            {NODES.map(node => {
                                const { x, y } = getNodePos(node.id, W, H);
                                return (
                                    <g key={node.id}>
                                        <circle cx={x} cy={y} r={5} fill={`${accentColor}25`} stroke={accentColor} strokeWidth={1.5} filter="url(#brain-glow)" />
                                        <text x={x} y={y + 14} textAnchor="middle" fill={`${accentColor}90`} fontSize={7} fontWeight={600}>{node.label}</text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                    <p className="ppn-meta" style={{ textAlign: 'center', marginTop: 6, color: `${accentColor}90` }}>
                        New connections forming
                    </p>
                </div>
            </div>

            {/* Substance name above right brain */}
            <p className="ppn-body" style={{ textAlign: 'center', marginTop: 16 }}>
                <span style={{ fontWeight: 900, color: accentColor }}>{substanceLabels[substanceCategory]}</span>
                {' '}opened pathways that had never spoken before.
            </p>
            <p className="ppn-body" style={{ textAlign: 'center', fontWeight: 700, color: '#A8B5D1', marginTop: 6 }}>
                Your brain was not breaking. It was building.
            </p>
        </div>
    );
};

export default BrainNetworkMap;
