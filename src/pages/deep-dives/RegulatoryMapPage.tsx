import React from 'react';
import RegulatoryMosaic from '../../components/analytics/RegulatoryMosaic';
import { LayoutGrid } from 'lucide-react';
import ConnectFeedButton from '../../components/ui/ConnectFeedButton';
import { PageContainer } from '../../components/layouts/PageContainer';
import { Section } from '../../components/layouts/Section';

const RegulatoryMapPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#080a10] text-white flex flex-col">

            {/* Page Header - Keep custom wide header but constrain content */}
            <div className="border-b border-slate-900 bg-[#0d1117] w-full">
                <PageContainer width="wide" className="py-8 sm:py-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white mb-2">
                                Regulatory Map
                            </h1>
                            <p className="text-slate-400 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
                                This map shows the current legal status of psychedelic substances across different regions. It tracks approval phases and policy changes to help you navigate the regulatory landscape.
                            </p>
                        </div>
                        <div>
                            <ConnectFeedButton />
                        </div>
                    </div>
                </PageContainer>
            </div>

            {/* Content Area */}
            <PageContainer width="wide" className="flex-1 py-10">
                <Section spacing="spacious">



                    {/* SECONDARY: Detailed Grid View */}
                    <section className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <div className="mb-8 flex items-center gap-3 border-b border-slate-800 pb-4">
                            <div className="p-2 bg-slate-800/50 rounded-lg">
                                <LayoutGrid className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-400 uppercase tracking-widest">Detailed Grid View</h2>
                                <p className="text-sm text-slate-500 font-medium">Complete list of jurisdictions and statuses</p>
                            </div>
                        </div>
                        <div className="h-[600px] w-full">
                            <RegulatoryMosaic />
                        </div>
                    </section>
                </Section>
            </PageContainer>
        </div>
    );
};

export default RegulatoryMapPage;
