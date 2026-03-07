import React, { useState } from 'react';
import { Share2, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ── TYPES ──────────────────────────────────────────────────────────────────
type RoleTag = 'owner' | 'admin' | 'partner_free' | 'partner_paid' | 'user_free' | 'user_pro' | 'user_premium' | 'user_enterprise';
type CategoryTag = 'All' | 'Founders' | 'Compliance' | 'Research' | 'Practitioner';

interface ShareTemplate {
    id: string;
    title: string;
    roleTag: RoleTag;
    categoryTags: CategoryTag[];
    useCase: string;
    messageBody: string;
}

// ── DATA SOURCES (WO-558 DESIGNER SPEC) ─────────────────────────────────────
const TEMPLATES: ShareTemplate[] = [
    {
        id: 'tpl_owner_01',
        title: 'The Founder Vision',
        roleTag: 'owner',
        categoryTags: ['All', 'Founders'],
        useCase: 'For board members, network founders, and investors.',
        messageBody: "Scale your practice with confidence. PPN Portal provides real-time unit economics and cross-site benchmarking. Compare your performance against the global network and ensure standard-of-care operations across all locations."
    },
    {
        id: 'tpl_admin_01',
        title: 'The Clinical Ops Overview',
        roleTag: 'admin',
        categoryTags: ['All', 'Compliance'],
        useCase: 'For clinical directors and compliance officers.',
        messageBody: "Maintain standard-of-care operations and eliminate compliance friction. PPN Portal offers an immutable, audit-ready defense log for every protocol. Identify outcome patterns and ensure safety across your entire organization."
    },
    {
        id: 'tpl_partner_free_01',
        title: 'The VIP / Advisor Invite',
        roleTag: 'partner_free',
        categoryTags: ['All', 'Founders'],
        useCase: 'For Jason Bluth, Dr. Jason Allen, Advisory Board members, and VIPs.',
        messageBody: "Equip your trainees with the clinical intelligence they need from day one. PPN Portal provides audit-ready documentation and automated safety guardrails. Start exploring the network benchmarks at no cost."
    },
    {
        id: 'tpl_partner_paid_01',
        title: 'The Paid Pilot Demo',
        roleTag: 'partner_paid',
        categoryTags: ['All', 'Research'],
        useCase: 'For paid pilot testers and early operational partners.',
        messageBody: "This is the institutional standard for outcomes tracking and safety surveillance. Our architecture reduces actuarial risk by screening protocols before treatment begins. Access the data your oversight board expects."
    },
    {
        id: 'tpl_user_free_01',
        title: 'The Anonymous Guide Invite',
        roleTag: 'user_free',
        categoryTags: ['All', 'Practitioner'],
        useCase: 'For guides logging protocols anonymously.',
        messageBody: "Protect your practice. Our Zero-Knowledge architecture means your data never exists on our servers. Log your protocols and screen for dangerous drug interactions without capturing patient names."
    },
    {
        id: 'tpl_user_pro_01',
        title: 'The Global Hive Mind Invite',
        roleTag: 'user_pro',
        categoryTags: ['All', 'Practitioner'],
        useCase: 'For licensed solo practitioners avoiding clinical isolation.',
        messageBody: "Stop guessing and start benchmarking. You are no longer practicing on an island. Check drug interactions instantly and compare your clinical outcomes against the entire network."
    },
    {
        id: 'tpl_user_premium_01',
        title: 'The Tough Case Solution',
        roleTag: 'user_premium',
        categoryTags: ['All', 'Practitioner', 'Research'],
        useCase: 'For lead clinicians requiring advanced case libraries.',
        messageBody: "Plug directly into the clinical hive mind. PPN Premium grants access to dynamic protocol recommendations and the Tough Case Library. See exactly what treatment parameters worked for similar patients."
    },
    {
        id: 'tpl_user_enterprise_01',
        title: 'The Research Grade Standard',
        roleTag: 'user_enterprise',
        categoryTags: ['All', 'Research', 'Compliance'],
        useCase: 'For regulatory research and large hospital systems.',
        messageBody: "Built for research excellence. Transform your clinical encounters into high-fidelity data tailored for standard reporting. Deploy custom export formats and API integrations for rigorous clinical trials."
    }
];

const CATEGORIES: CategoryTag[] = ['All', 'Founders', 'Compliance', 'Research', 'Practitioner'];

export default function AdminSharingLibrary() {
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState<CategoryTag>('All');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const isSuperAdmin = user?.app_metadata?.role === 'owner' ||
        user?.app_metadata?.role === 'admin' ||
        user?.email?.toLowerCase().includes('trevor');

    const availableCategories = isSuperAdmin
        ? CATEGORIES
        : CATEGORIES.filter(c => c === 'All' || c === 'Practitioner');

    const availableTemplates = isSuperAdmin
        ? TEMPLATES
        : TEMPLATES.filter(tpl => tpl.categoryTags.includes('Practitioner'));

    const filteredTemplates = availableTemplates.filter(tpl => tpl.categoryTags.includes(activeCategory));

    const handleShare = async (template: ShareTemplate) => {
        // Generate unique referral link (placeholder format for Phase 1 MVP parsing)
        // SQL capture expects: /join?ref_role=[target]&src=[admin_id]
        const referralUrl = `https://ppn.app/join?ref_role=${template.roleTag}`;
        const fullText = `${template.messageBody}\n\n${referralUrl}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `PPN Portal - ${template.title}`,
                    text: template.messageBody,
                    url: referralUrl,
                });
            } catch (err) {
                console.log('Share API deferred or cancelled', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(fullText);
            setCopiedId(template.id);
            setTimeout(() => setCopiedId(null), 2500);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-fade-in pb-32">
            {/* ── HEADER ───────────────────────────────────────────────────────── */}
            <div className="mb-8 lg:mb-12">
                <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">
                    Network Sharing Library
                </h1>
                <p className="text-slate-400 text-base lg:text-lg max-w-2xl leading-relaxed">
                    Pre-approved, Zero-PHI communication templates to invite practitioners, stakeholders, and partners to the PPN Clinical Network.
                </p>
            </div>

            {/* ── FILTER LAYOUT: Responsive Top Bar / Sidebar ──────────────────────── */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Sticky Bar & Desktop Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="sticky top-20 bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 z-30 lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:p-0">
                        <h2 className="hidden lg:block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
                            Filter Library
                        </h2>
                        <div className="flex lg:flex-col gap-2 overflow-x-auto custom-scrollbar pb-2 lg:pb-0 px-2 lg:px-0">
                            {availableCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`flex-shrink-0 px-4 py-2.5 lg:py-3 lg:px-5 rounded-xl text-sm lg:text-base font-medium transition-all text-left ${activeCategory === category
                                        ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400/50'
                                        : 'bg-slate-800/50 text-slate-400 border border-transparent hover:bg-slate-700/50 hover:text-slate-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── TEMPLATE GRID ─────────────────────────────────────────────────── */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredTemplates.map((tpl) => (
                            <div
                                key={tpl.id}
                                className="flex flex-col h-full bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 lg:p-8 hover:bg-slate-800/60 transition-colors"
                                title="Admin Sharing Library Template Card"
                            >
                                {/* Rule: Typography minimum is text-sm. Role text-base. */}
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <h3 className="text-xl font-bold text-white leading-tight">
                                        {tpl.title}
                                    </h3>
                                    <span className="inline-flex items-center px-3 py-1 bg-slate-800 text-slate-300 font-medium text-sm rounded-full border border-white/5 whitespace-nowrap">
                                        target: {tpl.roleTag}
                                    </span>
                                </div>

                                <p className="text-slate-400 text-sm italic mb-6 border-l-2 border-slate-700 pl-3">
                                    {tpl.useCase}
                                </p>

                                <div className="flex-1 mb-8">
                                    <p className="text-slate-200 text-sm leading-relaxed line-clamp-4">
                                        "{tpl.messageBody}"
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleShare(tpl)}
                                    className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-4 px-6 rounded-xl font-medium text-base transition-all min-h-[56px]"
                                >
                                    {/* Rule: Color-blindness mandate requires icons + text */}
                                    {copiedId === tpl.id ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                            <span className="text-emerald-400">Copied Link</span>
                                        </>
                                    ) : navigator.share ? (
                                        <>
                                            <Share2 className="w-5 h-5 text-blue-400" />
                                            <span>Share Template</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5 text-blue-400" />
                                            <span>Copy Link</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
                            <p className="text-slate-500 text-lg">No templates found for this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
