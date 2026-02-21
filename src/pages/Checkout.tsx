import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { supabase } from '../supabaseClient';
import {
    getStripe,
    SUBSCRIPTION_TIERS,
    type SubscriptionTier,
    type BillingInterval,
    getPriceId,
    getPrice,
    formatCurrency,
    getAnnualSavings,
} from '../lib/stripe';

export const Checkout: FC = () => {
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('standard');
    const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // ── ALL ORIGINAL LOGIC UNCHANGED ──────────────────────────────────────────
    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError && authError.message.includes('Auth session missing')) {
                navigate('/login');
                return;
            } else if (authError) {
                throw authError;
            }

            if (!user) {
                navigate('/login');
                return;
            }

            const priceId = getPriceId(selectedTier, billingInterval);

            if (!priceId) {
                throw new Error('Price ID not configured for this tier');
            }

            const { data, error: functionError } = await supabase.functions.invoke('create-checkout', {
                body: {
                    priceId,
                    userId: user.id,
                    userEmail: user.email,
                },
            });

            if (functionError) throw functionError;

            if (!data?.sessionId) {
                throw new Error('No session ID returned from checkout');
            }

            const stripe = await getStripe();
            if (!stripe) throw new Error('Stripe not loaded');

            const { error: stripeError } = await stripe.redirectToCheckout({
                sessionId: data.sessionId,
            });

            if (stripeError) throw stripeError;
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const tierEntries = Object.entries(SUBSCRIPTION_TIERS).filter(
        ([key]) => key !== 'enterprise' && key !== 'free'
    ) as [SubscriptionTier, typeof SUBSCRIPTION_TIERS[SubscriptionTier]][];
    // ── END ORIGINAL LOGIC ────────────────────────────────────────────────────

    const isResearchPartner = (tier: SubscriptionTier) => tier === 'research_partner';
    const researchPartnerAnnualNote = billingInterval === 'annual' && selectedTier === 'research_partner';

    return (
        <div className="min-h-screen bg-[#0a1628] px-4 py-12">
            <div className="max-w-5xl mx-auto">

                {/* ── ZONE 1: HEADER ────────────────────────────────────────── */}
                <div className="text-center mb-12">
                    {/* Logo mark */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#388bfd]/10 border border-[#388bfd]/30 mb-6">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z"
                                fill="none" stroke="#388bfd" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M9 12l2 2 4-4" stroke="#39d0d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight mb-3" style={{ color: '#9fb0be' }}>
                        Choose Your Plan
                    </h1>
                    <p className="text-base mb-6" style={{ color: '#6b7a8d' }}>
                        14-day free trial on all plans. No credit card required.
                    </p>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                        {[
                            '🔒 HIPAA-Compliant',
                            '🛡️ Zero-PHI Architecture',
                            '💳 No Card for Trial',
                            '✕ Cancel Anytime',
                        ].map((badge, i) => (
                            <span
                                key={i}
                                className="text-xs font-bold tracking-wide px-3 py-1.5 rounded-full border"
                                style={{ color: '#6b7a8d', borderColor: 'rgba(56,139,253,0.18)', background: 'rgba(56,139,253,0.04)', letterSpacing: '0.04em' }}
                            >
                                {badge}
                            </span>
                        ))}
                    </div>

                    {/* Billing toggle — pill style */}
                    <div
                        className="inline-flex items-center rounded-full p-1"
                        style={{ border: '1px solid rgba(56,139,253,0.25)', background: 'rgba(10,22,40,0.8)' }}
                    >
                        <button
                            id="billing-monthly-btn"
                            onClick={() => setBillingInterval('monthly')}
                            className="px-6 py-2 rounded-full text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#388bfd] focus:ring-offset-2 focus:ring-offset-[#0a1628]"
                            style={billingInterval === 'monthly'
                                ? { background: '#388bfd', color: '#fff' }
                                : { color: '#6b7a8d' }}
                        >
                            Monthly
                        </button>
                        <button
                            id="billing-annual-btn"
                            onClick={() => setBillingInterval('annual')}
                            className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#388bfd] focus:ring-offset-2 focus:ring-offset-[#0a1628]"
                            style={billingInterval === 'annual'
                                ? { background: '#388bfd', color: '#fff' }
                                : { color: '#6b7a8d' }}
                        >
                            Annual
                            {billingInterval === 'annual' && (
                                <span
                                    className="text-xs font-black px-2 py-0.5 rounded-full"
                                    style={{ background: '#f0a500', color: '#0a1628' }}
                                >
                                    Save $480/yr
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl border" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
                        <p className="text-red-400 text-center text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* ── ZONE 2: PRICING CARDS ──────────────────────────────────── */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {tierEntries.map(([tier, details]) => {
                        const price = getPrice(tier, billingInterval);
                        const savings = getAnnualSavings(tier);
                        const isSelected = selectedTier === tier;
                        const isRP = isResearchPartner(tier);
                        const rpDetails = isRP ? (details as any) : null;

                        // For Research Partner: always show monthly price even on annual toggle
                        const displayPrice = isRP ? (details as any).priceMonthly : price;
                        // Standard: show original price crossed out when annual is active
                        const standardMonthly = !isRP ? (details as any).priceMonthly : null;

                        const borderColor = isRP
                            ? isSelected ? 'rgba(240,165,0,0.6)' : 'rgba(240,165,0,0.25)'
                            : isSelected ? 'rgba(56,139,253,0.55)' : 'rgba(56,139,253,0.18)';
                        const bgColor = isRP
                            ? isSelected ? 'rgba(240,165,0,0.06)' : 'rgba(12,26,50,0.95)'
                            : isSelected ? 'rgba(56,139,253,0.07)' : 'rgba(12,26,50,0.95)';

                        return (
                            <div
                                key={tier}
                                id={`plan-card-${tier}`}
                                onClick={() => setSelectedTier(tier)}
                                className="relative rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden"
                                style={{
                                    border: `1.5px solid ${borderColor}`,
                                    background: bgColor,
                                    boxShadow: isSelected
                                        ? isRP ? '0 0 30px rgba(240,165,0,0.12)' : '0 0 30px rgba(56,139,253,0.12)'
                                        : 'none',
                                }}
                            >
                                {/* Research Partner ribbon */}
                                {isRP && (
                                    <div
                                        className="w-full py-2 text-center text-xs font-black uppercase tracking-widest"
                                        style={{ background: 'linear-gradient(90deg, #b07800 0%, #f0a500 50%, #b07800 100%)', color: '#0a1628' }}
                                    >
                                        ⭐ Research Partner — Alliance Member
                                    </div>
                                )}

                                {/* Selected indicator */}
                                {isSelected && (
                                    <div
                                        className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                                        style={{ background: isRP ? '#f0a500' : '#388bfd' }}
                                    >
                                        <Check className="w-3.5 h-3.5 text-[#0a1628]" />
                                    </div>
                                )}

                                <div className="p-7">
                                    {/* Plan name */}
                                    <div className="mb-1">
                                        <h2 className="text-xl font-black" style={{ color: '#9fb0be' }}>
                                            {details.name}
                                        </h2>
                                        {'planName' in details && (
                                            <p className="text-xs font-black uppercase tracking-widest mt-0.5"
                                                style={{ color: isRP ? '#f0a500' : '#388bfd' }}>
                                                {(details as any).planName}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price block */}
                                    <div className="mt-5 mb-6">
                                        {isRP ? (
                                            <>
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-5xl font-black" style={{ color: '#f0a500' }}>
                                                        {formatCurrency(displayPrice ?? 0)}
                                                    </span>
                                                    <span className="text-lg line-through" style={{ color: '#4a5568' }}>
                                                        {formatCurrency(rpDetails.standardPriceMonthly)}
                                                    </span>
                                                    <span className="text-base" style={{ color: '#6b7a8d' }}>/mo</span>
                                                </div>
                                                <p className="text-sm font-bold mt-1.5" style={{ color: '#3fb950' }}>
                                                    Save $1,800/year vs Standard Plan
                                                </p>
                                                {billingInterval === 'annual' && (
                                                    <p className="text-xs mt-1.5 px-3 py-1.5 rounded-lg inline-block"
                                                        style={{ color: '#f0a500', background: 'rgba(240,165,0,0.08)', border: '1px solid rgba(240,165,0,0.2)' }}>
                                                        Monthly billing only for Research Partner rate
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-baseline gap-2">
                                                    {billingInterval === 'annual' && standardMonthly && (
                                                        <span className="text-2xl font-black line-through" style={{ color: '#4a5568' }}>
                                                            {formatCurrency(standardMonthly)}
                                                        </span>
                                                    )}
                                                    <span className="text-5xl font-black" style={{ color: '#388bfd' }}>
                                                        {displayPrice ? formatCurrency(displayPrice) : 'Custom'}
                                                    </span>
                                                    {displayPrice && (
                                                        <span className="text-base" style={{ color: '#6b7a8d' }}>
                                                            /mo
                                                        </span>
                                                    )}
                                                </div>
                                                {billingInterval === 'annual' && savings > 0 && (
                                                    <p className="text-sm mt-1.5" style={{ color: '#6b7a8d' }}>
                                                        Billed{' '}
                                                        <span className="font-bold" style={{ color: '#3fb950' }}>
                                                            {formatCurrency((displayPrice ?? 0) * 12)}/yr
                                                        </span>
                                                        {' '}— Save {formatCurrency(savings)}/year
                                                    </p>
                                                )}
                                            </>
                                        )}
                                        {'trialDays' in details && details.trialDays && (
                                            <p className="text-sm mt-2" style={{ color: '#6b7a8d' }}>
                                                {details.trialDays}-day free trial included
                                            </p>
                                        )}
                                    </div>

                                    {/* Research Partner contribution callout */}
                                    {isRP && (
                                        <div className="mb-5 p-3 rounded-xl text-sm"
                                            style={{ background: 'rgba(240,165,0,0.08)', border: '1px solid rgba(240,165,0,0.25)', color: '#f0a500' }}>
                                            <span className="font-black">🔬 As a Research Partner, you</span> contribute 5+ de-identified session records/month to the PPN Research Alliance — helping advance the evidence base for the entire field.{' '}
                                            <span style={{ color: '#9fb0be' }}>Bronze tier quality minimum. 2-month grace period.</span>
                                        </div>
                                    )}

                                    {/* Features */}
                                    <ul className="space-y-2.5 mb-7">
                                        {details.features.map((feature, i) => {
                                            const isLastRP = isRP && i === details.features.length - 1;
                                            return (
                                                <li key={i} className="flex items-start gap-3">
                                                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#3fb950' }} />
                                                    <span
                                                        className="text-sm"
                                                        style={{
                                                            color: isLastRP ? '#3fb950' : '#889aab',
                                                            fontWeight: isLastRP ? 700 : 400,
                                                        }}
                                                    >
                                                        {feature}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* Card CTA */}
                                    <button
                                        id={`cta-${tier}`}
                                        onClick={(e) => { e.stopPropagation(); setSelectedTier(tier); handleCheckout(); }}
                                        disabled={loading}
                                        className="w-full py-3 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#388bfd] focus:ring-offset-2 focus:ring-offset-[#0a1628] disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={isRP
                                            ? { border: '1.5px solid rgba(240,165,0,0.5)', color: '#f0a500', background: 'rgba(240,165,0,0.07)' }
                                            : { background: '#388bfd', color: '#fff' }
                                        }
                                    >
                                        {loading && selectedTier === tier ? 'Processing...' : isRP ? 'Join as Research Partner' : 'Start 14-Day Free Trial'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── ZONE 4: MAIN CTA ──────────────────────────────────────── */}
                <div className="text-center mb-12">
                    <button
                        id="main-checkout-btn"
                        onClick={handleCheckout}
                        disabled={loading}
                        className="px-12 py-4 rounded-xl text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#388bfd] focus:ring-offset-2 focus:ring-offset-[#0a1628] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: '#388bfd',
                            color: '#fff',
                            boxShadow: loading ? 'none' : '0 0 0px rgba(56,139,253,0)',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = '#2070d0';
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(56,139,253,0.35)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = '#388bfd';
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                        }}
                    >
                        {loading
                            ? 'Processing...'
                            : `Start 14-Day Free Trial — ${(SUBSCRIPTION_TIERS[selectedTier] as any).planName ?? SUBSCRIPTION_TIERS[selectedTier].name}`
                        }
                    </button>
                    <p className="text-sm mt-3" style={{ color: '#6b7a8d' }}>
                        No credit card required for trial period. Cancel anytime from your settings.
                    </p>

                    {/* Security row */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                        {[
                            '🔐 Secured by Stripe',
                            '256-bit TLS Encryption',
                            'PCI-DSS Compliant',
                        ].map((item, i) => (
                            <span key={i} className="text-xs font-medium" style={{ color: '#4a5568' }}>
                                {i > 0 && <span className="mr-3" style={{ color: '#2d3748' }}>•</span>}
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── ZONE 3: ENTERPRISE ────────────────────────────────────── */}
                <div
                    className="rounded-2xl p-10"
                    style={{
                        background: 'rgba(12,26,50,0.7)',
                        border: '1px solid rgba(56,139,253,0.15)',
                    }}
                >
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left: info */}
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#388bfd' }}>
                                Enterprise
                            </p>
                            <h3 className="text-2xl font-black mb-3" style={{ color: '#9fb0be' }}>
                                Multi-Site and Organizational Access
                            </h3>
                            <p className="text-sm mb-5" style={{ color: '#6b7a8d' }}>
                                Group malpractice insurance access, multi-site dashboards, Center of Excellence certification, and dedicated account management.
                            </p>
                            <ul className="space-y-2">
                                {[
                                    'Unlimited practitioners & sites',
                                    'Multi-site performance dashboards',
                                    'Group insurance access (negotiated rates)',
                                    '"Center of Excellence" certification',
                                    'Custom training & onboarding',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: '#889aab' }}>
                                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#3fb950' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right: CTA */}
                        <div className="flex flex-col items-center md:items-end gap-4">
                            <a
                                id="enterprise-contact-btn"
                                href="mailto:sales@ppnportal.net"
                                className="inline-block px-8 py-4 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#388bfd] focus:ring-offset-2 focus:ring-offset-[#0a1628]"
                                style={{ border: '1.5px solid rgba(56,139,253,0.5)', color: '#388bfd' }}
                                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(56,139,253,0.08)'}
                                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}
                            >
                                Contact Sales →
                            </a>
                            <p className="text-xs text-center" style={{ color: '#4a5568' }}>
                                Typical response under 24 hours.
                            </p>
                            <p className="text-xs text-center" style={{ color: '#4a5568' }}>
                                sales@ppnportal.net
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
