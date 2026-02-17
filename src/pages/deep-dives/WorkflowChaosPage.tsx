import React from 'react';
import { PageContainer } from '../../components/layouts/PageContainer';
import { Section } from '../../components/layouts/Section';
import { motion } from 'framer-motion';
import {
    Layers,
    FileText,
    MessageSquare,
    Music,
    Database,
    ServerCrash,
    ArrowRight,
    CheckCircle,
    Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkflowChaosPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <PageContainer className="min-h-screen bg-[#0a1628] text-slate-300">
            {/* Hero Section */}
            <Section spacing="tight" className="pt-20 pb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-black uppercase tracking-widest mb-6">
                        <ServerCrash className="w-4 h-4" />
                        Operational Inefficiency
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-300 mb-6 leading-[0.9]">
                        The End of <br />
                        <span className="text-gradient-primary">Fragmented Care.</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                        Your current stack—IntakeQ, Spruce, Spotify, Excel, and a generic EHR—is costing you 10+ hours a week in administrative burnout.
                    </p>
                </motion.div>
            </Section>

            {/* The Problem: Fragmented Stack */}
            <Section spacing="default">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        { name: 'IntakeQ', icon: FileText, desc: 'Forms', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                        { name: 'Spruce', icon: MessageSquare, desc: 'Messaging', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                        { name: 'Spotify', icon: Music, desc: 'Playlists', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                        { name: 'Excel', icon: Database, desc: 'Outcomes', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                        { name: 'SimplePractice', icon: Layers, desc: 'Billing', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                    ].map((tool, i) => (
                        <motion.div
                            key={tool.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-6 rounded-2xl border ${tool.border} ${tool.bg} flex flex-col items-center text-center space-y-3 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 hover:scale-105`}
                        >
                            <tool.icon className={`w-8 h-8 ${tool.color}`} />
                            <div>
                                <h3 className="text-sm font-black text-slate-300">{tool.name}</h3>
                                <p className="text-xs font-bold text-slate-3000 uppercase tracking-widest">{tool.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <p className="text-sm font-black text-red-400 uppercase tracking-widest animate-pulse">
                        = Disconnected Data Silos
                    </p>
                </div>
            </Section>

            {/* The Solution: Unified OS */}
            <Section spacing="spacious">
                <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black tracking-tight text-slate-300">
                                The <span className="text-gradient-primary">Practice OS</span> Solution.
                            </h2>
                            <p className="text-lg text-slate-300 font-medium leading-relaxed">
                                PPN unifies your entire clinical workflow into a single, secure, purpose-built platform designed specifically for the 6-8 hour psychedelic therapy session.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    'Session Logger (Tap-to-log vitals & events)',
                                    'Automated Measurement-Based Care (MEQ-30, IES)',
                                    'Integrated Protocol Library',
                                    'Dynamic Consent Engine',
                                    'Aggregated Network Benchmarking'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-clinical-green flex-shrink-0" />
                                        <span className="text-slate-300 font-bold">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="px-8 py-4 bg-white text-slate-900 font-black rounded-xl uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center gap-2"
                                >
                                    Request Early Access
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-slate-950 border border-slate-800 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden">
                                <Cpu className="w-32 h-32 text-primary opacity-20" />
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-primary/30">
                                            <Layers className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-2xl font-black text-slate-300">Unified Core</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </PageContainer>
    );
};

export default WorkflowChaosPage;
