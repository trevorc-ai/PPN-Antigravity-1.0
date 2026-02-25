import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NetworkIntelligenceCardProps {
    /** Array of contraindication/warning flag IDs or slugs currently active.
     *  The component renders nothing when this is empty. */
    activeWarnings: string[];
    /** Optional: overrides the external network URL base (default: ppnportal.com) */
    networkBaseUrl?: string;
}

// ─── Static lookup map (demo data — WO-343 AC-2) ─────────────────────────────
// Keys are lowercased substrings matched against a warning's id or headline.
// Production: replace with a live query against the opt-in practitioner table.
const NETWORK_COUNTS: Record<string, number> = {
    lithium: 4,
    ssri: 7,
    maoi: 3,
    benzodiazepine: 6,
    benzo: 6,
    cardiac: 5,
    qt: 5,
    ibogaine: 8,
    psilocybin: 9,
    ketamine: 6,
    default: 2,
};

/** Derive a network count from the first active warning string */
function resolveCount(warnings: string[]): { count: number; slug: string } {
    for (const w of warnings) {
        const lower = w.toLowerCase();
        for (const [key, count] of Object.entries(NETWORK_COUNTS)) {
            if (key !== 'default' && lower.includes(key)) {
                return { count, slug: key };
            }
        }
    }
    return { count: NETWORK_COUNTS.default, slug: 'drug-interaction' };
}

// ─── Component ────────────────────────────────────────────────────────────────

const NetworkIntelligenceCard: React.FC<NetworkIntelligenceCardProps> = ({
    activeWarnings,
    networkBaseUrl = 'https://ppnportal.com',
}) => {
    const [visible, setVisible] = useState(false);

    // Fade-in with 300ms delay after mounting — WO-343 AC-3
    useEffect(() => {
        if (activeWarnings.length > 0) {
            const timer = setTimeout(() => setVisible(true), 300);
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [activeWarnings.length]);

    // Render nothing if no active warnings — WO-343 AC-1 & AC-3
    if (activeWarnings.length === 0) return null;

    const { count, slug } = resolveCount(activeWarnings);
    const profilesUrl = `${networkBaseUrl}/practitioners?contraindication=${encodeURIComponent(slug)}`;

    return (
        <div
            role="complementary"
            aria-label="Network Intelligence — practitioner experience with this contraindication"
            className={`
                transition-all duration-500
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
            `}
        >
            {/* ── Card shell — amber/gold tint to distinguish from the red warning above ── */}
            <div className="
                flex flex-col gap-4
                p-5 rounded-xl
                bg-amber-950/25
                border border-amber-500/30
                shadow-[0_0_20px_-6px_rgba(217,119,6,0.15)]
            ">
                {/* ── Header ── */}
                <div className="flex items-center gap-3">
                    <div className="
                        flex-shrink-0 w-9 h-9
                        rounded-lg bg-amber-500/10 border border-amber-500/20
                        flex items-center justify-center
                    ">
                        {/* Lucide Users icon covers the "people/network" semantic — WO-343 AC-3 */}
                        <Users
                            className="w-5 h-5 text-amber-400"
                            aria-hidden="true"
                        />
                    </div>
                    <h3 className="ppn-card-title text-amber-300 uppercase tracking-widest">
                        🩺 Network Intelligence
                    </h3>
                </div>

                {/* ── Body ── */}
                <p className="ppn-body text-slate-300 leading-relaxed">
                    <span className="font-bold text-amber-200">{count}</span>{' '}
                    {count === 1
                        ? 'practitioner'
                        : 'practitioners'}{' '}
                    in the PPN network {count === 1 ? 'has' : 'have'} documented
                    experience managing this contraindication.
                </p>

                {/* ── CTA ── */}
                <a
                    id="network-intelligence-view-profiles"
                    href={profilesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View practitioners with experience managing ${slug} contraindication — opens in new tab`}
                    className="
                        inline-flex items-center gap-2 self-start
                        px-4 py-2.5 rounded-lg
                        bg-amber-900/40 hover:bg-amber-800/50
                        border border-amber-500/30 hover:border-amber-400/50
                        text-amber-200 hover:text-amber-100
                        text-sm font-semibold
                        transition-all duration-200 active:scale-95
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
                    "
                >
                    View Practitioner Profiles
                    <span aria-hidden="true">→</span>
                </a>

                {/* ── Opt-in footnote — WO-343 AC-2 & accessibility rules ── */}
                <p className="ppn-meta text-slate-500 flex items-center gap-1.5">
                    {/* Star symbol keeps semantic meaning from text alone, not from color alone */}
                    <span aria-hidden="true">⚝</span>
                    Opt-in only. No patient data is shared.
                </p>
            </div>
        </div>
    );
};

export default NetworkIntelligenceCard;
