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
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('clinic');
    const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError) throw authError;

            if (!user) {
                navigate('/login');
                return;
            }

            // Get price ID for selected tier and interval
            const priceId = getPriceId(selectedTier, billingInterval);

            if (!priceId) {
                throw new Error('Price ID not configured for this tier');
            }

            // Call Supabase Edge Function to create checkout session
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

            // Redirect to Stripe Checkout
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
        ([key]) => key !== 'enterprise'
    ) as [SubscriptionTier, typeof SUBSCRIPTION_TIERS[SubscriptionTier]][];

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-300 mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-slate-300 mb-6">
                        14-day free trial. No credit card required. Cancel anytime.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-lg p-2">
                        <button
                            onClick={() => setBillingInterval('monthly')}
                            className={`px-6 py-2 rounded-md font-semibold transition ${billingInterval === 'monthly'
                                ? 'bg-emerald-500 text-slate-900'
                                : 'text-slate-300 hover:text-slate-300'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingInterval('annual')}
                            className={`px-6 py-2 rounded-md font-semibold transition ${billingInterval === 'annual'
                                ? 'bg-emerald-500 text-slate-900'
                                : 'text-slate-300 hover:text-slate-300'
                                }`}
                        >
                            Annual
                            <span className="ml-2 text-sm">(Save 20%)</span>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-lg">
                        <p className="text-rose-400 text-center">{error}</p>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {tierEntries.map(([tier, details]) => {
                        const price = getPrice(tier, billingInterval);
                        const savings = getAnnualSavings(tier);
                        const isSelected = selectedTier === tier;
                        const isPopular = tier === 'clinic';

                        return (
                            <div
                                key={tier}
                                onClick={() => setSelectedTier(tier)}
                                className={`relative p-8 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                    }`}
                            >
                                {/* Popular Badge */}
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-slate-900 font-bold text-sm rounded-full">
                                        POPULAR
                                    </div>
                                )}

                                {/* Tier Name */}
                                <h2 className="text-2xl font-bold text-slate-300 mb-2">
                                    {details.name}
                                </h2>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-emerald-400">
                                            {price ? formatCurrency(price) : 'Custom'}
                                        </span>
                                        {price && (
                                            <span className="text-lg text-slate-300">
                                                /{billingInterval === 'monthly' ? 'mo' : 'mo'}
                                            </span>
                                        )}
                                    </div>
                                    {billingInterval === 'annual' && savings > 0 && (
                                        <p className="text-sm text-emerald-400 mt-2">
                                            Save {formatCurrency(savings)}/year
                                        </p>
                                    )}
                                    <p className="text-sm text-slate-300 mt-2">
                                        {details.trialDays}-day free trial
                                    </p>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {details.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300">
                                            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-base">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Selection Indicator */}
                                {isSelected && (
                                    <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-slate-900" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="px-12 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                        {loading ? 'Processing...' : 'Start 14-Day Free Trial'}
                    </button>
                    <p className="text-sm text-slate-300 mt-4">
                        No credit card required for trial. Cancel anytime.
                    </p>
                </div>

                {/* Enterprise CTA */}
                <div className="mt-12 p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-slate-300 mb-2">
                        Need Enterprise?
                    </h3>
                    <p className="text-slate-300 mb-6">
                        Custom solutions for research institutions and large-scale operations.
                    </p>
                    <a
                        href="mailto:sales@ppnportal.net"
                        className="inline-block px-8 py-3 border-2 border-emerald-500 text-emerald-400 font-semibold rounded-lg hover:bg-emerald-500/10 transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        Contact Sales
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
