import React, { useState } from 'react';
import { Share2, Copy, Check, Users, Stethoscope, ShieldCheck, ChevronRight, Link as LinkIcon } from 'lucide-react';

// WO-587: VIP Invite Tool — 2-Tap Admin Send
// Protected route: /admin/invite (admin role only, enforced in App.tsx)
// Reuses Web Share API + clipboard fallback from MagicLinkModal.tsx (LEAD architecture decision Q3)
// LEAD Q2: User pastes magic link into each card's URL input before sharing.

interface InviteCard {
    id: string;
    segment: string;
    icon: React.ReactNode;
    accentColor: string;
    accentBg: string;
    accentBorder: string;
    tagColor: string;
    headline: string;
    preview: string;
    messageTemplate: (link: string) => string;
}

const INVITE_CARDS: InviteCard[] = [
    {
        id: 'partner-advisor',
        segment: 'Partner / Advisor',
        icon: <Users className="w-5 h-5 text-indigo-400" aria-hidden="true" />,
        accentColor: 'text-indigo-400',
        accentBg: 'bg-indigo-900/30',
        accentBorder: 'border-indigo-500/30',
        tagColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
        headline: 'First look at 1,500+ real clinical records',
        preview: '"We\'ve crossed a meaningful threshold — I wanted you to be one of the first to see it."',
        messageTemplate: (link: string) =>
            `We've crossed a meaningful threshold. The PPN Portal now has 1,500+ anonymized clinical outcome records from psychedelic therapy practitioners — live, structured, and visualized in real time.\n\nI wanted you to be one of the first people to see it before it goes broader.\n\nThis link is yours — one click, you're in:\n${link}\n\nNo setup required. Takes about five minutes to get a real feel for it.`,
    },
    {
        id: 'clinician',
        segment: 'Clinician',
        icon: <Stethoscope className="w-5 h-5 text-teal-400" aria-hidden="true" />,
        accentColor: 'text-teal-400',
        accentBg: 'bg-teal-900/20',
        accentBorder: 'border-teal-500/30',
        tagColor: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
        headline: 'Built for sessions like yours',
        preview: '"I built something I think you\'ll actually use — and I\'d love your honest read on it."',
        messageTemplate: (link: string) =>
            `This is the clinical documentation system I've been working on — built from the ground up for psychedelic therapy practitioners. What I'm sending you today isn't a mockup. It's the live platform, with 1,500+ real treatment outcome records already in the network.\n\nYou'll be one of the first clinicians to see it.\n\nOne click, you're in — no setup, no password:\n${link}\n\nEven five minutes of honest feedback would be incredibly valuable.`,
    },
    {
        id: 'privacy',
        segment: 'Privacy / Compliance',
        icon: <ShieldCheck className="w-5 h-5 text-amber-400" aria-hidden="true" />,
        accentColor: 'text-amber-400',
        accentBg: 'bg-amber-900/20',
        accentBorder: 'border-amber-500/30',
        tagColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        headline: 'Zero-PHI by design — not by policy',
        preview: '"The architecture enforces privacy at the database level. No disclaimers. No promises. Just structure."',
        messageTemplate: (link: string) =>
            `Most clinical tools treat privacy as a feature. PPN treats it as a structural constraint enforced at the database level — zero PHI is not a policy, it's an impossibility by design.\n\nI'd like you to see it firsthand.\n\nOne click, you're in:\n${link}\n\nNo sign-up. No password. Your read on this would matter a lot.`,
    },
];

const AdminInvitePage: React.FC = () => {
    const [links, setLinks] = useState<Record<string, string>>({});
    const [shareStates, setShareStates] = useState<Record<string, 'idle' | 'sharing' | 'copied'>>({});

    const handleLinkChange = (cardId: string, value: string) => {
        setLinks(prev => ({ ...prev, [cardId]: value }));
    };

    const handleShare = async (card: InviteCard) => {
        const link = links[card.id]?.trim() || '[PASTE MAGIC LINK HERE]';
        const message = card.messageTemplate(link);

        setShareStates(prev => ({ ...prev, [card.id]: 'sharing' }));

        const shareData = {
            title: `PPN Portal — ${card.segment} Invitation`,
            text: message,
            url: link !== '[PASTE MAGIC LINK HERE]' ? link : undefined,
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare({ text: message })) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(message);
            }
            setShareStates(prev => ({ ...prev, [card.id]: 'copied' }));
            setTimeout(() => setShareStates(prev => ({ ...prev, [card.id]: 'idle' })), 2500);
        } catch {
            // User cancelled share sheet — reset silently
            setShareStates(prev => ({ ...prev, [card.id]: 'idle' }));
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] px-4 py-10 relative overflow-hidden">

            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-indigo-600/8 blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">

                {/* Page header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase">
                            <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                            Admin Only
                        </span>
                    </div>
                    <h1 className="ppn-page-title text-slate-100 mb-2">VIP Invite Tool</h1>
                    <p className="ppn-body text-slate-400 max-w-xl">
                        Paste the magic link you generated in Supabase, then tap <strong className="text-slate-300">Share</strong> to send via iMessage, WhatsApp, or clipboard — in 2 taps.
                    </p>
                </div>

                {/* Instruction strip */}
                <div className="flex items-start gap-3 mb-8 p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <div className="flex shrink-0 flex-col items-center gap-1 pt-0.5">
                        {['1', '2', '3'].map((n, i) => (
                            <React.Fragment key={n}>
                                <span className="w-6 h-6 rounded-full bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-center">{n}</span>
                                {i < 2 && <div className="w-px h-3 bg-slate-700/60" />}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="space-y-3 pt-0.5">
                        <p className="ppn-body text-slate-300"><strong>Choose</strong> the card that matches your invitee's role.</p>
                        <p className="ppn-body text-slate-300"><strong>Paste</strong> the Supabase magic link into the field.</p>
                        <p className="ppn-body text-slate-300"><strong>Tap Share</strong> — native share sheet opens with the message pre-filled.</p>
                    </div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {INVITE_CARDS.map((card) => {
                        const shareState = shareStates[card.id] || 'idle';
                        const linkValue = links[card.id] || '';
                        const hasLink = linkValue.trim().length > 0;

                        return (
                            <div
                                key={card.id}
                                className={`flex flex-col gap-5 p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border transition-all duration-200 ${card.accentBorder} hover:border-opacity-60`}
                            >
                                {/* Card header */}
                                <div className="flex items-center justify-between">
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${card.accentBg} border ${card.accentBorder}`}>
                                        {card.icon}
                                        <span className={`ppn-meta font-bold tracking-wide uppercase ${card.accentColor}`}>
                                            {card.segment}
                                        </span>
                                    </div>
                                </div>

                                {/* Headline */}
                                <div>
                                    <h2 className="ppn-card-title text-slate-100 mb-2">{card.headline}</h2>
                                    <p className="ppn-body text-slate-500 italic text-sm leading-relaxed">
                                        {card.preview}
                                    </p>
                                </div>

                                {/* Magic link input */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className="ppn-label text-slate-500 uppercase tracking-wider"
                                        htmlFor={`link-${card.id}`}
                                    >
                                        Magic Link
                                    </label>
                                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-700/50 focus-within:border-indigo-500/50 transition-colors">
                                        <LinkIcon className="w-4 h-4 text-slate-600 shrink-0" aria-hidden="true" />
                                        <input
                                            id={`link-${card.id}`}
                                            type="url"
                                            value={linkValue}
                                            onChange={(e) => handleLinkChange(card.id, e.target.value)}
                                            placeholder="Paste Supabase magic link…"
                                            className="flex-1 bg-transparent ppn-body text-slate-300 placeholder-slate-600 outline-none min-w-0"
                                            aria-label={`Magic link for ${card.segment} invitation`}
                                        />
                                        {hasLink && (
                                            <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" aria-hidden="true" />
                                        )}
                                    </div>
                                </div>

                                {/* Share CTA */}
                                <button
                                    id={`share-btn-${card.id}`}
                                    onClick={() => handleShare(card)}
                                    disabled={shareState === 'sharing'}
                                    className={`flex items-center justify-center gap-2.5 w-full px-5 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 active:scale-[0.97] ${shareState === 'copied'
                                            ? 'bg-teal-700/50 border border-teal-500/40 text-teal-100'
                                            : 'bg-indigo-700/50 hover:bg-indigo-600/60 border border-indigo-500/40 hover:border-indigo-400/60 text-indigo-100'
                                        }`}
                                    aria-label={`Share ${card.segment} invitation`}
                                >
                                    {shareState === 'copied' ? (
                                        <>
                                            <Check className="w-4 h-4" aria-hidden="true" />
                                            Ready to Send
                                        </>
                                    ) : shareState === 'sharing' ? (
                                        <span className="animate-pulse">Opening…</span>
                                    ) : (
                                        <>
                                            <Share2 className="w-4 h-4" aria-hidden="true" />
                                            Share Invitation
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer note */}
                <div className="mt-8 flex items-center gap-2 justify-center">
                    <Copy className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                    <p className="ppn-meta text-slate-600">
                        Desktop browsers will copy the message to clipboard instead of opening the share sheet.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminInvitePage;
