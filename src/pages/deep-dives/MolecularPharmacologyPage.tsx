import React, { useState } from 'react';
import MolecularPharmacology from '../../components/analytics/MolecularPharmacology';
import ReceptorBindingHeatmap from '../../components/analytics/ReceptorBindingHeatmap';
import { PageContainer } from '../../components/layouts/PageContainer';
import { Section } from '../../components/layouts/Section';
import { BarChart2, Grid3X3 } from 'lucide-react';

type ActiveTab = 'affinity-chart' | 'heatmap';

const MolecularPharmacologyPage = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('affinity-chart');

    return (
        <PageContainer className="py-8">
            <Section>
                {/* ── Page header ──────────────────────────────────────────────── */}
                <div className="border-b border-slate-800 pb-6 mb-8">
                    <h1 className="text-5xl font-black tracking-tighter mb-2">Molecular Pharmacology</h1>
                    <p className="text-slate-300 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
                        How each compound interacts with the brain's receptor systems — from molecular binding affinity to clinical pharmacology.
                    </p>
                </div>

                {/* ── Tab navigation ──────────────────────────────────────────── */}
                <div className="flex gap-2 mb-8" role="tablist" aria-label="Pharmacology views">
                    <button
                        id="tab-affinity-chart"
                        role="tab"
                        aria-selected={activeTab === 'affinity-chart'}
                        aria-controls="panel-affinity-chart"
                        onClick={() => setActiveTab('affinity-chart')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${activeTab === 'affinity-chart'
                                ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300'
                                : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                            }`}
                    >
                        <BarChart2 size={16} />
                        Affinity Chart
                    </button>

                    <button
                        id="tab-heatmap"
                        role="tab"
                        aria-selected={activeTab === 'heatmap'}
                        aria-controls="panel-heatmap"
                        onClick={() => setActiveTab('heatmap')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${activeTab === 'heatmap'
                                ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300'
                                : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                            }`}
                    >
                        <Grid3X3 size={16} />
                        Binding Affinity Matrix
                        <span className="px-1.5 py-0.5 bg-indigo-500 text-white text-xs font-black rounded-md leading-none">NEW</span>
                    </button>
                </div>

                {/* ── Tab panels ──────────────────────────────────────────────── */}
                <div
                    id="panel-affinity-chart"
                    role="tabpanel"
                    aria-labelledby="tab-affinity-chart"
                    hidden={activeTab !== 'affinity-chart'}
                >
                    <MolecularPharmacology />
                </div>

                <div
                    id="panel-heatmap"
                    role="tabpanel"
                    aria-labelledby="tab-heatmap"
                    hidden={activeTab !== 'heatmap'}
                >
                    <ReceptorBindingHeatmap />
                </div>
            </Section>
        </PageContainer>
    );
};

export default MolecularPharmacologyPage;
