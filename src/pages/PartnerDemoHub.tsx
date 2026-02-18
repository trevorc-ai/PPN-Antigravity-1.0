import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

/**
 * Partner Demo Hub
 * Comprehensive feature gallery for partner demonstrations
 * Organized by category with direct links to all features
 */

interface FeatureCard {
    title: string;
    description: string;
    path: string;
    badge?: 'Core' | 'Premium' | 'Enterprise' | 'Demo';
    isNew?: boolean;
}

interface CategorySection {
    title: string;
    icon: string;
    description: string;
    features: FeatureCard[];
}

const PartnerDemoHub: React.FC = () => {
    const categories: CategorySection[] = [
        {
            title: 'Research & Substance Intelligence',
            icon: '🔬',
            description: 'Comprehensive substance database and research tools',
            features: [
                {
                    title: 'Advanced Search Portal',
                    description: 'AI-powered search with Bento Grid layout and collapsible insights',
                    path: '/advanced-search',
                    badge: 'Premium',
                    isNew: true,
                },
                {
                    title: 'Substance Catalog',
                    description: 'Browse all psychedelic substances with detailed profiles',
                    path: '/catalog',
                    badge: 'Core',
                },
                {
                    title: 'Substance Monograph',
                    description: 'Detailed pharmacology, safety data, and clinical insights',
                    path: '/monograph/PSL-2201',
                    badge: 'Core',
                },
                {
                    title: 'Drug Interaction Checker',
                    description: 'Real-time safety screening with contraindication engine',
                    path: '/interactions',
                    badge: 'Premium',
                },
                {
                    title: 'News & Intelligence Hub',
                    description: 'Regulatory updates, trending topics, and portal metrics',
                    path: '/news',
                    badge: 'Core',
                    isNew: true,
                },
            ],
        },
        {
            title: 'Clinical Workflow & Protocol Management',
            icon: '📋',
            description: 'Complete protocol creation and management system',
            features: [
                {
                    title: 'My Protocols',
                    description: 'View and manage all clinical protocols',
                    path: '/protocols',
                    badge: 'Core',
                },
                {
                    title: 'Protocol Detail',
                    description: 'Comprehensive protocol view with all clinical data',
                    path: '/protocol/1',
                    badge: 'Core',
                },
                {
                    title: 'Protocol Builder (Demo)',
                    description: 'Interactive protocol creation with patient lookup and clinical insights',
                    path: '/hidden-components',
                    badge: 'Premium',
                },
            ],
        },
        {
            title: 'Wellness Journey & Longitudinal Tracking',
            icon: '🏥',
            description: 'Complete patient journey tracking from preparation through integration',
            features: [
                {
                    title: 'Wellness Journey (God View)',
                    description: 'Comprehensive longitudinal patient tracking dashboard',
                    path: '/wellness-journey',
                    badge: 'Enterprise',
                },
                {
                    title: 'MEQ-30 Assessment',
                    description: 'Mystical Experience Questionnaire with real-time scoring',
                    path: '/meq30',
                    badge: 'Premium',
                },
                {
                    title: 'Adaptive Assessment',
                    description: 'Dynamic clinical assessment with smart branching',
                    path: '/assessment',
                    badge: 'Premium',
                },
                {
                    title: 'Wellness Journey Phase 1 Demo',
                    description: 'Set & Setting analysis with risk stratification',
                    path: '/arc-of-care',
                    badge: 'Demo',
                },
                {
                    title: 'Wellness Journey Phase 2 Demo',
                    description: 'Session monitoring and real-time vitals',
                    path: '/arc-of-care-phase2',
                    badge: 'Demo',
                },
                {
                    title: 'Wellness Journey Phase 3 Demo',
                    description: 'Integration tracking and outcome measurement',
                    path: '/arc-of-care-phase3',
                    badge: 'Demo',
                },
            ],
        },
        {
            title: 'Analytics & Deep Dives',
            icon: '📊',
            description: 'Enterprise-grade analytics and business intelligence',
            features: [
                {
                    title: 'Analytics Dashboard',
                    description: 'Network-wide metrics and performance indicators',
                    path: '/analytics',
                    badge: 'Premium',
                },
                {
                    title: 'Patient Flow Analysis',
                    description: 'Sankey diagram showing patient retention and drop-off',
                    path: '/deep-dives/patient-flow',
                    badge: 'Enterprise',
                },
                {
                    title: 'Clinic Performance Radar',
                    description: 'Multi-dimensional clinic performance vs network average',
                    path: '/deep-dives/clinic-performance',
                    badge: 'Enterprise',
                },
                {
                    title: 'Patient Constellation',
                    description: '3D clustering analysis of patient outcomes',
                    path: '/deep-dives/patient-constellation',
                    badge: 'Enterprise',
                },
                {
                    title: 'Molecular Pharmacology',
                    description: 'Receptor binding profiles and pharmacodynamics',
                    path: '/deep-dives/molecular-pharmacology',
                    badge: 'Enterprise',
                },
                {
                    title: 'Protocol Efficiency',
                    description: 'ROI analysis and financial efficiency modeling',
                    path: '/deep-dives/protocol-efficiency',
                    badge: 'Enterprise',
                },
                {
                    title: 'Workflow Chaos Analysis',
                    description: 'Operational bottleneck identification',
                    path: '/deep-dives/workflow-chaos',
                    badge: 'Enterprise',
                },
                {
                    title: 'Safety Surveillance',
                    description: 'Adverse event monitoring and safety benchmarking',
                    path: '/deep-dives/safety-surveillance',
                    badge: 'Enterprise',
                },
                {
                    title: 'Regulatory Mosaic',
                    description: 'Multi-jurisdiction compliance tracking',
                    path: '/deep-dives/regulatory-mosaic',
                    badge: 'Enterprise',
                },
                {
                    title: 'Revenue Forensics',
                    description: 'Financial performance deep dive',
                    path: '/deep-dives/revenue-forensics',
                    badge: 'Enterprise',
                },
                {
                    title: 'Metabolic Risk Analysis',
                    description: 'CYP450 genetic risk assessment',
                    path: '/deep-dives/metabolic-risk',
                    badge: 'Enterprise',
                },
                {
                    title: 'Confidence Cone',
                    description: 'Statistical confidence intervals for outcomes',
                    path: '/deep-dives/confidence-cone',
                    badge: 'Enterprise',
                },
                {
                    title: 'Safety Benchmark',
                    description: 'Comparative safety performance metrics',
                    path: '/deep-dives/safety-benchmark',
                    badge: 'Enterprise',
                },
                {
                    title: 'Regulatory Weather',
                    description: 'Regulatory climate and compliance forecasting',
                    path: '/deep-dives/regulatory-weather',
                    badge: 'Enterprise',
                },
            ],
        },
        {
            title: 'Network & Collaboration',
            icon: '👥',
            description: 'Clinician directory and network features',
            features: [
                {
                    title: 'Clinician Directory',
                    description: 'Browse network clinicians with specialties and ratings',
                    path: '/clinicians',
                    badge: 'Premium',
                },
                {
                    title: 'Clinician Profile',
                    description: 'Detailed clinician profiles with experience and outcomes',
                    path: '/clinician/1',
                    badge: 'Premium',
                },
            ],
        },
        {
            title: 'Data & Compliance',
            icon: '🔐',
            description: 'Enterprise data management and audit tools',
            features: [
                {
                    title: 'Data Export',
                    description: 'Comprehensive data export with multiple formats',
                    path: '/data-export',
                    badge: 'Enterprise',
                },
                {
                    title: 'Audit Logs',
                    description: 'Complete audit trail of all system activities',
                    path: '/audit',
                    badge: 'Enterprise',
                },
            ],
        },
        {
            title: 'Component Showcases',
            icon: '🎨',
            description: 'Visual demonstrations of UI components and features',
            features: [
                {
                    title: 'Component Showcase',
                    description: 'Analytics components and deep-dive visualizations',
                    path: '/component-showcase',
                    badge: 'Demo',
                },
                {
                    title: 'Hidden Components',
                    description: 'Premium UI components (NeuralCopilot, GlassInput, etc.)',
                    path: '/hidden-components',
                    badge: 'Demo',
                },
                {
                    title: 'Molecular Visualization',
                    description: '3D molecular structure rendering',
                    path: '/molecules',
                    badge: 'Demo',
                },
                {
                    title: 'Isometric Molecules',
                    description: 'Isometric molecular visualization',
                    path: '/isometric-molecules',
                    badge: 'Demo',
                },
            ],
        },
    ];

    const getBadgeColor = (badge?: string) => {
        switch (badge) {
            case 'Core':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Premium':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Enterprise':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Demo':
                return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
            default:
                return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
        }
    };

    return (
        <PageContainer className="!max-w-7xl space-y-12 pb-20 pt-8">
            {/* Header */}
            <Section spacing="tight">
                <div className="text-center space-y-6">
                    <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                        <p className="text-xs font-black text-primary uppercase tracking-widest">
                            Partner Demo Hub
                        </p>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-slate-300">
                        PPN Portal
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Comprehensive feature gallery showcasing the complete platform capabilities.
                        Click any card to explore the live feature.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-300">80+</div>
                            <div className="text-sm text-slate-300">Active Features</div>
                        </div>
                        <div className="h-12 w-px bg-slate-700"></div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-300">13</div>
                            <div className="text-sm text-slate-300">Deep Dives</div>
                        </div>
                        <div className="h-12 w-px bg-slate-700"></div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-300">3</div>
                            <div className="text-sm text-slate-300">Tiers</div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Categories */}
            {categories.map((category, idx) => (
                <div key={idx}>
                    <Section spacing="default">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl">{category.icon}</span>
                                <h2 className="text-3xl font-black text-slate-300">{category.title}</h2>
                            </div>
                            <p className="text-slate-300 text-lg ml-14">{category.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.features.map((feature, featureIdx) => (
                                <Link
                                    key={featureIdx}
                                    to={feature.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-primary/50 hover:bg-slate-900/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
                                >
                                    {/* New Badge */}
                                    {feature.isNew && (
                                        <div className="absolute -top-3 -right-3 px-3 py-1 bg-clinical-green text-slate-900 text-xs font-black rounded-full uppercase tracking-widest shadow-lg">
                                            New!
                                        </div>
                                    )}

                                    {/* Tier Badge */}
                                    {feature.badge && (
                                        <div className={`inline-block px-3 py-1 border rounded-lg text-xs font-black uppercase tracking-widest mb-4 ${getBadgeColor(feature.badge)}`}>
                                            {feature.badge}
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h3 className="text-xl font-black text-slate-300 mb-2 group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Hover Arrow */}
                                    <div className="absolute bottom-6 right-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Section>
                </div>
            ))}

            {/* Footer Stats */}
            <Section spacing="tight">
                <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-clinical-green/10 border border-primary/20 rounded-2xl p-8">
                    <div className="text-center space-y-4">
                        <h3 className="text-2xl font-black text-slate-300">Ready to Explore?</h3>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            This demo hub provides access to all features across Core, Premium, and Enterprise tiers.
                            Click any card above to interact with the live feature.
                        </p>
                        <div className="flex items-center justify-center gap-6 pt-4">
                            <Link
                                to="/dashboard"
                                className="px-6 py-3 bg-primary hover:bg-primary/80 text-slate-300 font-black rounded-xl uppercase tracking-widest transition-all shadow-lg active:scale-95"
                            >
                                Go to Dashboard
                            </Link>
                            <Link
                                to="/analytics"
                                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-xl uppercase tracking-widest transition-all active:scale-95"
                            >
                                View Analytics
                            </Link>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Quick Stats */}
            <Section spacing="tight">
                <div className="text-center text-slate-500 text-sm space-y-2">
                    <p>Partner Demo Hub • Last Updated: {new Date().toLocaleDateString()}</p>
                    <p className="font-mono text-xs">
                        Access URL: <span className="text-primary">http://localhost:3000/#/partner-demo</span>
                    </p>
                </div>
            </Section>
        </PageContainer>
    );
};

export default PartnerDemoHub;
