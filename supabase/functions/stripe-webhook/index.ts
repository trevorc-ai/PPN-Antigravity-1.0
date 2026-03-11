import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// WO-614: Rewired to write to log_subscriptions (canonical table).
// Tier mapping uses env vars so Price IDs never live in source code.
// Also looks up site_id from log_user_sites for the FK.

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// ── Tier lookup ───────────────────────────────────────────────────────────────
// Map Stripe Price IDs → tier slugs using env vars (set in Supabase Secrets).
// STRIPE_PRICE_SOLO, STRIPE_PRICE_CLINIC, STRIPE_PRICE_NETWORK
function resolveTier(priceId: string): 'solo' | 'clinic' | 'network' {
    const prices: Record<string, 'solo' | 'clinic' | 'network'> = {
        [Deno.env.get('STRIPE_PRICE_SOLO') || '__none__']: 'solo',
        [Deno.env.get('STRIPE_PRICE_CLINIC') || '__none__']: 'clinic',
        [Deno.env.get('STRIPE_PRICE_NETWORK') || '__none__']: 'network',
    };
    return prices[priceId] ?? 'solo'; // default to solo
}

// ── Fetch site_id for a user ───────────────────────────────────────────────
async function getSiteId(userId: string): Promise<string | null> {
    const { data } = await supabase
        .from('log_user_sites')
        .select('site_id')
        .eq('user_id', userId)
        .maybeSingle();
    return data?.site_id ?? null;
}

serve(async (req) => {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    try {
        // Verify webhook signature
        const event = stripe.webhooks.constructEvent(
            body,
            signature!,
            Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
        );

        console.log(`Webhook received: ${event.type}`);

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.user_id;
                const subscriptionId = session.subscription as string;

                if (!userId || !subscriptionId) {
                    throw new Error('Missing user_id or subscription_id in session metadata');
                }

                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const priceId = subscription.items.data[0].price.id;
                const tier = resolveTier(priceId);
                const siteId = await getSiteId(userId);

                // Write to log_subscriptions (canonical table — WO-614)
                const { error: upsertError } = await supabase
                    .from('log_subscriptions')
                    .upsert({
                        user_id: userId,
                        site_id: siteId,
                        stripe_customer_id: session.customer as string,
                        stripe_subscription_id: subscriptionId,
                        stripe_price_id: priceId,
                        tier,
                        status: subscription.status,
                        trial_end: subscription.trial_end
                            ? new Date(subscription.trial_end * 1000).toISOString()
                            : null,
                        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                        cancel_at_period_end: subscription.cancel_at_period_end,
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'stripe_subscription_id' });

                if (upsertError) {
                    console.error('log_subscriptions upsert error:', upsertError);
                    throw upsertError;
                }

                console.log(`Subscription created → log_subscriptions for user ${userId} tier=${tier}`);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const priceId = subscription.items.data[0].price.id;
                const tier = resolveTier(priceId);

                const { error: updateError } = await supabase
                    .from('log_subscriptions')
                    .update({
                        tier,
                        stripe_price_id: priceId,
                        status: subscription.status,
                        trial_end: subscription.trial_end
                            ? new Date(subscription.trial_end * 1000).toISOString()
                            : null,
                        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                        cancel_at_period_end: subscription.cancel_at_period_end,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);

                if (updateError) {
                    console.error('log_subscriptions update error:', updateError);
                    throw updateError;
                }

                console.log(`Subscription updated in log_subscriptions: ${subscription.id} tier=${tier}`);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                const { error: deleteError } = await supabase
                    .from('log_subscriptions')
                    .update({
                        status: 'canceled',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);

                if (deleteError) {
                    console.error('log_subscriptions cancel error:', deleteError);
                    throw deleteError;
                }

                console.log(`Subscription canceled in log_subscriptions: ${subscription.id}`);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return new Response(
            JSON.stringify({ received: true }),
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (err) {
        console.error('Webhook error:', err);
        return new Response(
            JSON.stringify({ error: err.message }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
});
