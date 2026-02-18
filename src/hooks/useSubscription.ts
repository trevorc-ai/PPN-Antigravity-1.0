/**
 * useSubscription Hook
 * 
 * Manages subscription state and provides subscription data from Supabase.
 * 
 * @see /Users/trevorcalton/.gemini/antigravity/brain/2e1f5871-bb94-43c4-bd75-775f905e85ec/stripe_integration_spec.md
 */

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { SubscriptionTier, SubscriptionStatus } from '../lib/stripe';

export interface Subscription {
    tier: SubscriptionTier | null;
    status: SubscriptionStatus | null;
    trialEnd: Date | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
}

export interface UseSubscriptionReturn {
    subscription: Subscription;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage user subscription data
 */
export function useSubscription(): UseSubscriptionReturn {
    const [subscription, setSubscription] = useState<Subscription>({
        tier: null,
        status: null,
        trialEnd: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSubscription = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError) throw authError;

            if (!user) {
                // Not logged in - reset subscription
                setSubscription({
                    tier: null,
                    status: null,
                    trialEnd: null,
                    currentPeriodEnd: null,
                    cancelAtPeriodEnd: false,
                    stripeCustomerId: null,
                    stripeSubscriptionId: null,
                });
                setLoading(false);
                return;
            }

            // Fetch subscription from log_user_subscriptions (live table name)
            const { data, error: fetchError } = await supabase
                .from('log_user_subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (fetchError) {
                // No subscription found is not an error
                if (fetchError.code === 'PGRST116') {
                    setSubscription({
                        tier: null,
                        status: null,
                        trialEnd: null,
                        currentPeriodEnd: null,
                        cancelAtPeriodEnd: false,
                        stripeCustomerId: null,
                        stripeSubscriptionId: null,
                    });
                } else {
                    throw fetchError;
                }
            } else if (data) {
                setSubscription({
                    tier: data.tier as SubscriptionTier,
                    status: data.status as SubscriptionStatus,
                    trialEnd: data.trial_end ? new Date(data.trial_end) : null,
                    currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : null,
                    cancelAtPeriodEnd: data.cancel_at_period_end || false,
                    stripeCustomerId: data.stripe_customer_id,
                    stripeSubscriptionId: data.stripe_subscription_id,
                });
            }
        } catch (err) {
            console.error('Error fetching subscription:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch subscription'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();

        // Subscribe to auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                fetchSubscription();
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return {
        subscription,
        loading,
        error,
        refetch: fetchSubscription,
    };
}

export default useSubscription;
