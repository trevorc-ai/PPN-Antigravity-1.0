import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

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

                // Get subscription details from Stripe
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                // Extract tier from price metadata
                const priceId = subscription.items.data[0].price.id;
                let tier = 'solo'; // default

                // Determine tier from price ID (you'll need to set this up in Stripe)
                if (priceId.includes('clinic')) {
                    tier = 'clinic';
                } else if (priceId.includes('enterprise')) {
                    tier = 'enterprise';
                }

                // Save subscription to database
                const { error: upsertError } = await supabase
                    .from('user_subscriptions')
                    .upsert({
                        user_id: userId,
                        stripe_customer_id: session.customer as string,
                        stripe_subscription_id: subscriptionId,
                        tier,
                        status: subscription.status,
                        trial_end: subscription.trial_end
                            ? new Date(subscription.trial_end * 1000).toISOString()
                            : null,
                        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                        cancel_at_period_end: subscription.cancel_at_period_end,
                        updated_at: new Date().toISOString(),
                    });

                if (upsertError) {
                    console.error('Database upsert error:', upsertError);
                    throw upsertError;
                }

                console.log(`Subscription created for user ${userId}`);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;

                // Update subscription in database
                const { error: updateError } = await supabase
                    .from('user_subscriptions')
                    .update({
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
                    console.error('Database update error:', updateError);
                    throw updateError;
                }

                console.log(`Subscription updated: ${subscription.id}`);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                // Mark subscription as canceled
                const { error: deleteError } = await supabase
                    .from('user_subscriptions')
                    .update({
                        status: 'canceled',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);

                if (deleteError) {
                    console.error('Database delete error:', deleteError);
                    throw deleteError;
                }

                console.log(`Subscription deleted: ${subscription.id}`);
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
