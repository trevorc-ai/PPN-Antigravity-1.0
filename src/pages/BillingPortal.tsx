import { FC, useState } from 'react';
import { CreditCard, Calendar, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useSubscription } from '../hooks/useSubscription';
import { SUBSCRIPTION_TIERS, formatCurrency } from '../lib/stripe';

export const BillingPortal: FC = () => {
    const { subscription, loading: subLoading, refetch } = useSubscription();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleManageBilling = async () => {
        setLoading(true);
        setError(null);

        try {
            // Call Supabase Edge Function to create portal session
            const { data, error: functionError } = await supabase.functions.invoke('create-portal', {
                body: {},
            });

            if (functionError) throw functionError;

            if (!data?.url) {
                throw new Error('No portal URL returned');
            }

            // Redirect to Stripe billing portal
            window.location.href = data.url;
        } catch (err) {
            console.error('Portal error:', err);
            setError(err instanceof Error ? err.message : 'Failed to open billing portal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (subLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-300">Loading subscription...</p>
                </div>
            </div>
        );
    }

    const tierConfig = subscription.tier ? SUBSCRIPTION_TIERS[subscription.tier] : null;

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-300 mb-2">Subscription & Billing</h1>
                    <p className="text-slate-300">Manage your subscription and payment methods</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                        <p className="text-rose-400">{error}</p>
                    </div>
                )}

                {subscription.tier ? (
                    <div className="space-y-6">
                        {/* Current Plan Card */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-300 mb-2">
                                        {tierConfig?.name}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${subscription.status === 'active'
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : subscription.status === 'trialing'
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : subscription.status === 'past_due'
                                                        ? 'bg-amber-500/20 text-amber-400'
                                                        : 'bg-slate-500/20 text-slate-300'
                                                }`}
                                        >
                                            <div className="w-2 h-2 rounded-full bg-current"></div>
                                            {subscription.status === 'trialing' ? 'Free Trial' : subscription.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-emerald-400">
                                        {tierConfig?.priceMonthly ? formatCurrency(tierConfig.priceMonthly) : 'Custom'}
                                    </p>
                                    {tierConfig?.priceMonthly && (
                                        <p className="text-slate-300 text-sm">/month</p>
                                    )}
                                </div>
                            </div>

                            {/* Trial Warning */}
                            {subscription.status === 'trialing' && subscription.trialEnd && (
                                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-blue-400 font-semibold mb-1">Free Trial Active</p>
                                        <p className="text-slate-300 text-sm">
                                            Your trial ends on {subscription.trialEnd.toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}. Add a payment method to continue after your trial.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Cancellation Warning */}
                            {subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd && (
                                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-rose-400 font-semibold mb-1">Subscription Ending</p>
                                        <p className="text-slate-300 text-sm">
                                            Your subscription will end on {subscription.currentPeriodEnd.toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}. Reactivate to continue using PPN.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Current Period */}
                            {subscription.currentPeriodEnd && (
                                <div className="mb-6">
                                    <p className="text-sm text-slate-300 mb-1">Current billing period ends</p>
                                    <p className="text-slate-300 font-semibold">
                                        {subscription.currentPeriodEnd.toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            )}

                            {/* Manage Button */}
                            <button
                                onClick={handleManageBilling}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                            >
                                <CreditCard className="w-5 h-5" />
                                {loading ? 'Loading...' : 'Manage Subscription'}
                                <ExternalLink className="w-4 h-4" />
                            </button>
                            <p className="text-xs text-slate-300 text-center mt-3">
                                Update payment method, view invoices, or cancel subscription
                            </p>
                        </div>

                        {/* Features Included */}
                        {tierConfig && (
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
                                <h3 className="text-xl font-bold text-slate-300 mb-4">What's Included</h3>
                                <ul className="grid md:grid-cols-2 gap-3">
                                    {tierConfig.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-300">
                                            <span className="text-emerald-400 mt-1">✓</span>
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    // No Subscription State
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
                        <CreditCard className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-300 mb-2">No Active Subscription</h2>
                        <p className="text-slate-300 mb-8">
                            Start your free trial to access all features of PPN Research Portal.
                        </p>
                        <a
                            href="/#/checkout"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                        >
                            Start Free Trial
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingPortal;
