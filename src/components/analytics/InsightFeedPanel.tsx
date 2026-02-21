/**
 * InsightFeedPanel.tsx — WO-302
 * ================================
 * Actionable clinical intelligence card feed.
 * Evaluates all 8 rules from insightEngine.ts and renders triggered insight cards.
 *
 * Design rules:
 *   - Severity shown as TEXT BADGE only — never color-only (accessibility)
 *   - Cards are dismissible (stored in localStorage, keyed by card.id + date)
 *   - Staggered fade-in animation on mount (no bounce, no spin)
 *   - Empty state if no rules trigger or fewer than 5 patients
 *   - Loading skeleton while rules evaluate in parallel
 */

import { FC, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle,
    TrendingUp,
    Lightbulb,
    FileSearch,
    ChevronRight,
    X,
    Sparkles,
    RefreshCw,
} from 'lucide-react';
import { runInsightEngine, type InsightCard, type InsightSeverity } from '../../services/insightEngine';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Config
// ─────────────────────────────────────────────────────────────────────────────

interface InsightFeedPanelProps {
    siteId: number | null;
}

const SEVERITY_CONFIG: Record<InsightSeverity, {
    label: string;
    icon: typeof AlertTriangle;
    badgeClass: string;
    borderClass: string;
    accentClass: string;
}> = {
    SAFETY: {
        label: '[SAFETY]',
        icon: AlertTriangle,
        badgeClass: 'bg-rose-500/10 border-rose-500/40 text-rose-300',
        borderClass: 'border-rose-500/30',
        accentClass: 'bg-rose-500',
    },
    SIGNAL: {
        label: '[SIGNAL]',
        icon: TrendingUp,
        badgeClass: 'bg-violet-500/10 border-violet-500/40 text-violet-300',
        borderClass: 'border-violet-500/30',
        accentClass: 'bg-violet-500',
    },
    OPPORTUNITY: {
        label: '[OPPORTUNITY]',
        icon: Lightbulb,
        badgeClass: 'bg-amber-500/10 border-amber-500/40 text-amber-300',
        borderClass: 'border-amber-500/30',
        accentClass: 'bg-amber-500',
    },
    REVIEW: {
        label: '[REVIEW]',
        icon: FileSearch,
        badgeClass: 'bg-blue-500/10 border-blue-500/40 text-blue-300',
        borderClass: 'border-blue-500/30',
        accentClass: 'bg-blue-400',
    },
};

// Dismiss key format: card.id + date-portion of generatedAt
const getDismissKey = (card: InsightCard) => {
    const dateKey = card.generatedAt.slice(0, 10); // YYYY-MM-DD
    return `ppn_insight_dismissed_${card.id}_${dateKey}`;
};

const isCardDismissed = (card: InsightCard): boolean => {
    try {
        return localStorage.getItem(getDismissKey(card)) === 'true';
    } catch {
        return false;
    }
};

const dismissCard = (card: InsightCard): void => {
    try {
        localStorage.setItem(getDismissKey(card), 'true');
    } catch {
        // localStorage unavailable — no-op
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────────────────────────────────────

const InsightCardSkeleton: FC = () => (
    <div className="animate-pulse bg-slate-800/40 border border-slate-700/30 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
            <div className="h-5 w-20 bg-slate-700/60 rounded-full" />
            <div className="h-4 w-28 bg-slate-700/40 rounded" />
        </div>
        <div className="h-4 w-full bg-slate-700/50 rounded" />
        <div className="h-4 w-4/5 bg-slate-700/40 rounded" />
        <div className="h-3 w-2/3 bg-slate-700/30 rounded" />
        <div className="h-8 w-36 bg-slate-700/40 rounded-lg mt-2" />
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Single insight card
// ─────────────────────────────────────────────────────────────────────────────

interface InsightCardItemProps {
    card: InsightCard;
    index: number;
    onDismiss: (card: InsightCard) => void;
}

const InsightCardItem: FC<InsightCardItemProps> = ({ card, index, onDismiss }) => {
    const navigate = useNavigate();
    const config = SEVERITY_CONFIG[card.severity];
    const Icon = config.icon;

    return (
        <div
            className={`
        relative overflow-hidden bg-[#0a0c12]/70 border rounded-2xl p-5
        transition-all duration-300 hover:border-opacity-60
        ${config.borderClass}
      `}
            style={{
                animationDelay: `${index * 80}ms`,
                animation: 'fadeInUp 0.4s ease both',
            }}
            role="article"
            aria-label={`${card.severity} insight: ${card.category}`}
        >
            {/* Accent bar */}
            <div className={`absolute top-0 left-0 w-full h-0.5 ${config.accentClass} opacity-60`} />

            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Severity badge — text only, not color-only */}
                    <span
                        className={`
              text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full border
              ${config.badgeClass}
            `}
                    >
                        {config.label}
                    </span>
                    {/* Icon alongside badge for colorblind support */}
                    <Icon className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {card.category}
                    </span>
                </div>

                {/* Dismiss button */}
                <button
                    onClick={() => onDismiss(card)}
                    className="shrink-0 text-slate-600 hover:text-slate-400 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
                    aria-label={`Dismiss insight: ${card.category}`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Headline */}
            <p className="text-sm font-bold leading-snug mb-2" style={{ color: '#C8D5E8', fontSize: '14px' }}>
                {card.headline}
            </p>

            {/* Body */}
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#8B9DC3', fontSize: '13px' }}>
                {card.body}
            </p>

            {/* Source note */}
            <p className="text-xs mb-4" style={{ color: '#4B5E7A', fontSize: '12px' }}>
                {card.sourceNote}
            </p>

            {/* CTA */}
            <button
                onClick={() => navigate(card.actionRoute)}
                className="
          flex items-center gap-2 px-4 py-2 rounded-xl
          bg-slate-800/80 border border-slate-700/60
          text-sm font-bold text-slate-300
          hover:bg-slate-700/80 hover:border-slate-600
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-indigo-500/40
        "
                style={{ fontSize: '13px' }}
            >
                {card.actionLabel}
                <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────────────────────

const EmptyState: FC<{ hasData: boolean }> = ({ hasData }) => (
    <div className="text-center py-10 px-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-emerald-400" />
        </div>
        {hasData ? (
            <>
                <p className="text-sm font-bold mb-1" style={{ color: '#A8B5D1', fontSize: '14px' }}>
                    All clear — no active insights
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7A99', fontSize: '12px' }}>
                    No patterns requiring attention were detected in your current data.
                    Insights will appear as your caseload grows and clinical patterns emerge.
                </p>
            </>
        ) : (
            <>
                <p className="text-sm font-bold mb-1" style={{ color: '#A8B5D1', fontSize: '14px' }}>
                    Intelligence unlocks after 5+ patients
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7A99', fontSize: '12px' }}>
                    Log sessions via the Wellness Journey to activate clinical intelligence cards.
                    Insights are generated once your clinic has sufficient data for meaningful analysis.
                </p>
            </>
        )}
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main panel component
// ─────────────────────────────────────────────────────────────────────────────

const InsightFeedPanel: FC<InsightFeedPanelProps> = ({ siteId }) => {
    const [cards, setCards] = useState<InsightCard[]>([]);
    const [visibleCards, setVisibleCards] = useState<InsightCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasData, setHasData] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

    const loadInsights = useCallback(async () => {
        if (!siteId) return;
        setLoading(true);
        try {
            const results = await runInsightEngine(siteId);
            setCards(results);
            setHasData(true);
            setLastRefresh(new Date());
            // Filter dismissed cards
            const visible = results.filter(c => !isCardDismissed(c));
            setVisibleCards(visible);
        } catch {
            setCards([]);
            setVisibleCards([]);
        } finally {
            setLoading(false);
        }
    }, [siteId]);

    useEffect(() => {
        loadInsights();
    }, [loadInsights]);

    const handleDismiss = useCallback((card: InsightCard) => {
        dismissCard(card);
        setVisibleCards(prev => prev.filter(c => c.id !== card.id));
    }, []);

    const handleRefresh = useCallback(() => {
        loadInsights();
    }, [loadInsights]);

    return (
        <div className="space-y-4">
            {/* Panel header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: '#A8B5D1', fontSize: '13px' }}>
                            Clinical Intelligence
                        </h3>
                        {lastRefresh && (
                            <p className="text-xs" style={{ color: '#4B5E7A', fontSize: '11px' }}>
                                Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {cards.length > 0 && (
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400"
                            style={{ fontSize: '11px' }}>
                            {visibleCards.length} active
                        </span>
                    )}
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-slate-600"
                        aria-label="Refresh insights"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <InsightCardSkeleton key={i} />)}
                </div>
            )}

            {/* Insight cards */}
            {!loading && visibleCards.length > 0 && (
                <div className="space-y-3">
                    {visibleCards.map((card, i) => (
                        <InsightCardItem
                            key={card.id}
                            card={card}
                            index={i}
                            onDismiss={handleDismiss}
                        />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && visibleCards.length === 0 && (
                <EmptyState hasData={hasData} />
            )}

            {/* Dismissed cards note */}
            {!loading && cards.length > visibleCards.length && (
                <button
                    onClick={() => {
                        // Clear dismissed state and show all
                        cards.forEach(c => {
                            try { localStorage.removeItem(getDismissKey(c)); } catch { /* no-op */ }
                        });
                        setVisibleCards(cards);
                    }}
                    className="w-full text-xs text-slate-600 hover:text-slate-400 transition-colors py-2 text-center focus:outline-none focus:ring-2 focus:ring-slate-600 rounded-lg"
                    style={{ fontSize: '12px' }}
                >
                    {cards.length - visibleCards.length} dismissed insight{cards.length - visibleCards.length !== 1 ? 's' : ''} — show all
                </button>
            )}

            {/* Animation keyframe */}
            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default InsightFeedPanel;
