import React, { useState } from 'react';
import NeuralCopilot from '../components/NeuralCopilot';
import { GlassInput } from '../components/GlassInput';
import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';
import GuidedTour from '../components/GuidedTour';
import { SetAndSettingCard } from '../components/arc-of-care';

/**
 * Hidden Components Showcase
 * Demonstrates all built-but-unused components
 */
const HiddenComponentsShowcase: React.FC = () => {
    const [showTour, setShowTour] = useState(false);
    const [inputValue, setInputValue] = useState('');

    return (
        <div className="min-h-screen bg-[#0a1628] p-8">
            {/* READ-ONLY WARNING BANNER */}
            <div className="bg-amber-500/20 border-2 border-amber-500/50 rounded-xl px-6 py-3 mb-8 max-w-7xl mx-auto">
                <p className="text-amber-300 text-sm font-bold text-center">
                    ⚠️ READ-ONLY SHOWCASE - Do not modify without express user permission
                </p>
            </div>

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black text-slate-300 tracking-tight">
                        Hidden Components Showcase
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Premium components that are built but not yet integrated into the application
                    </p>
                </div>

                {/* Component Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* 1. NeuralCopilot */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                <span className="text-indigo-400 font-black">1</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-300">NeuralCopilot</h2>
                                <p className="text-sm text-slate-500">AI-Powered Clinical Assistant</p>
                            </div>
                        </div>
                        <div className="h-[600px] rounded-2xl overflow-hidden border-2 border-indigo-500/20">
                            <NeuralCopilot context={{ demo: true }} />
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Features:</p>
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• Google Gemini AI integration</li>
                                <li>• Real-time safety flag detection</li>
                                <li>• Terminal-style neural trace animations</li>
                                <li>• Substance interaction warnings</li>
                            </ul>
                        </div>
                    </div>

                    {/* 2. GlassInput */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <span className="text-purple-400 font-black">2</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-300">GlassInput</h2>
                                <p className="text-sm text-slate-500">Premium Glassmorphic Input</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-2xl p-8 border border-purple-500/20 space-y-6">
                            <GlassInput
                                label="Standard Input"
                                placeholder="Enter text..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                helperText="This is a helper text"
                            />
                            <GlassInput
                                label="With Error"
                                placeholder="Enter text..."
                                error="This field is required"
                            />
                            <GlassInput
                                label="Disabled State"
                                placeholder="Disabled..."
                                disabled
                            />
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Features:</p>
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• Backdrop blur (12px)</li>
                                <li>• High-contrast borders (accessible)</li>
                                <li>• Focus states & error handling</li>
                                <li>• Helper text support</li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. GlassmorphicCard */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-emerald-400 font-black">3</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-300">GlassmorphicCard</h2>
                                <p className="text-sm text-slate-500">Glass Effect Container</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <GlassmorphicCard hoverable={true}>
                                <h3 className="text-xl font-black text-slate-300 mb-2">Hoverable Card</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    This card has hover effects. Try hovering over it to see the elevation and glow.
                                </p>
                            </GlassmorphicCard>
                            <GlassmorphicCard hoverable={false}>
                                <h3 className="text-xl font-black text-slate-300 mb-2">Static Card</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    This card has no hover effects. Perfect for content that doesn't need interaction.
                                </p>
                            </GlassmorphicCard>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Features:</p>
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• Backdrop blur (20px)</li>
                                <li>• Hover effects (optional)</li>
                                <li>• Smooth transitions</li>
                                <li>• Purple accent glow</li>
                            </ul>
                        </div>
                    </div>

                    {/* 4. GuidedTour */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                <span className="text-amber-400 font-black">4</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-300">GuidedTour</h2>
                                <p className="text-sm text-slate-500">Interactive Onboarding</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-2xl p-8 border border-amber-500/20 space-y-6">
                            <div className="text-center space-y-4">
                                <p className="text-sm text-slate-300">
                                    The Guided Tour component provides interactive onboarding with smart positioning and progress tracking.
                                </p>
                                <button
                                    onClick={() => setShowTour(true)}
                                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-300 text-sm font-black rounded-xl uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                >
                                    Start Tour Demo
                                </button>
                                <p className="text-sm text-slate-500">
                                    ⚠️ Note: Tour steps are outdated and need to be updated to match current UI
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Features:</p>
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• 5 predefined steps</li>
                                <li>• Smart positioning (auto-flip)</li>
                                <li>• Spotlight highlighting</li>
                                <li>• Progress indicators</li>
                            </ul>
                            <p className="text-sm text-amber-400 font-bold mt-3">
                                ⚠️ Status: Needs rebuild (steps outdated)
                            </p>
                        </div>
                    </div>

                    {/* 5. Wellness Journey - Set & Setting Card */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-emerald-400 font-black">5</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-300">Wellness Journey - Phase 1</h2>
                                <p className="text-sm text-slate-300">Set & Setting Analysis (WO_042)</p>
                            </div>
                        </div>

                        {/* Demo Scenarios */}
                        <div className="space-y-6">
                            {/* Low Risk Patient */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-300 mb-3">Low Risk Patient</h3>
                                <SetAndSettingCard
                                    expectancyScale={85}
                                    aceScore={1}
                                    gad7Score={4}
                                    phq9Score={8}
                                    onScheduleSessions={() => alert('Schedule Integration Sessions clicked!')}
                                />
                            </div>

                            {/* Moderate Risk Patient */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-300 mb-3">Moderate Risk Patient</h3>
                                <SetAndSettingCard
                                    expectancyScale={55}
                                    aceScore={5}
                                    gad7Score={12}
                                    phq9Score={15}
                                />
                            </div>

                            {/* High Risk Patient */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-300 mb-3">High Risk Patient</h3>
                                <SetAndSettingCard
                                    expectancyScale={35}
                                    aceScore={8}
                                    gad7Score={18}
                                    phq9Score={22}
                                />
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Features:</p>
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• Treatment expectancy gauge (1-100 scale)</li>
                                <li>• ACE score bar chart (0-10 trauma assessment)</li>
                                <li>• GAD-7 anxiety severity zones</li>
                                <li>• Algorithm-based integration session predictions</li>
                                <li>• Risk stratification (low/moderate/high)</li>
                                <li>• Evidence-based clinical insights</li>
                                <li>• AdvancedTooltip integration for education</li>
                            </ul>
                            <p className="text-sm text-emerald-400 font-bold mt-3">
                                ✅ Status: Phase 1 Complete (Week 3 of 20)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Strategic Value */}
                <div className="bg-slate-900/50 border-2 border-primary/20 rounded-2xl p-8">
                    <h2 className="text-2xl font-black text-slate-300 mb-4">Strategic Value</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="text-3xl font-black text-indigo-400">10KB</div>
                            <p className="text-sm text-slate-300">NeuralCopilot</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-black text-purple-400">3KB</div>
                            <p className="text-sm text-slate-300">GlassInput</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-black text-emerald-400">1KB</div>
                            <p className="text-sm text-slate-300">GlassmorphicCard</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-black text-amber-400">7KB</div>
                            <p className="text-sm text-slate-300">GuidedTour</p>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-800">
                        <p className="text-sm text-slate-300 leading-relaxed">
                            <span className="font-black text-primary">23KB</span> of production-ready code representing significant untapped potential.
                            These components could provide a <span className="font-black text-clinical-green">massive competitive advantage</span> with minimal integration effort.
                        </p>
                    </div>
                </div>

                {/* Documentation Link */}
                <div className="text-center">
                    <p className="text-sm text-slate-500">
                        Full strategic analysis: <code className="text-primary">HIDDEN_COMPONENTS_STRATEGIC_ANALYSIS.md</code>
                    </p>
                </div>
            </div>

            {/* Guided Tour (if activated) */}
            {showTour && <GuidedTour onComplete={() => setShowTour(false)} />}
        </div>
    );
};

export default HiddenComponentsShowcase;
