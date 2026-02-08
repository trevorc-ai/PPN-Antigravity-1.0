import React from 'react';
import RegulatoryMosaic from '../../components/analytics/RegulatoryMosaic';
import RegulatoryHexMap from '../../components/analytics/RegulatoryHexMap';
import { LayoutGrid, Hexagon } from 'lucide-react';
import ConnectFeedButton from '../../components/ui/ConnectFeedButton';

const RegulatoryMapPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#05070a] text-white flex flex-col">

            {/* Page Header */}
            <div className="px-6 py-8 sm:px-10 sm:py-12 border-b border-slate-900 bg-[#0B0E14]">
                <div className="max-w-[1920px] mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white mb-2">
                            Regulatory Map
                        </h1>
                        <p className="text-slate-400 text-lg font-medium max-w-2xl">
                            Real-time tracking of psychedelic legislative frameworks across 52 jurisdictions.
                        </p>
                    </div>
                    <div>
                        <ConnectFeedButton />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 sm:p-10 space-y-24">

                {/* HERO: Interactive Hex Map */}
                <section className="max-w-[1920px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-8 flex items-center gap-3 border-b border-indigo-500/20 pb-4">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Hexagon className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-indigo-400 uppercase tracking-widest">Interactive Visualization</h2>
                            <p className="text-sm text-slate-500 font-medium">Explore regulatory status via interactive geometric map</p>
                        </div>
                    </div>
                    <div className="h-[85vh] min-h-[800px] w-full">
                        <RegulatoryHexMap />
                    </div>
                </section>

                {/* SECONDARY: Detailed Grid View */}
                <section className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
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
            </div>
        </div>
    );
};

export default RegulatoryMapPage;
