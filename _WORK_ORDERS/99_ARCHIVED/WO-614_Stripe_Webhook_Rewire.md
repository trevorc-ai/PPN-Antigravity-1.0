---
id: WO-614
title: Stripe Webhook → log_subscriptions Wiring
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 04_QA
completed_at: 2026-03-11
builder_notes: "Already fully implemented in supabase/functions/stripe-webhook/index.ts from prior session. Handles checkout.session.completed, customer.subscription.updated, customer.subscription.deleted. All writes to log_subscriptions with tier resolution via env vars."
priority: P1 — app reads log_subscriptions but nothing writes to it
created: 2026-03-11
depends_on: none (log_subscriptions already has the correct schema)
---

## Context

The app's `useSubscription` hook now reads from `log_subscriptions` (site-keyed).
However, **no Stripe webhook currently writes to this table.**

The legacy table `log_user_subscriptions` is what Stripe wrote to previously.
That table is now deprecated (superseded, not dropped).

The `log_subscriptions` table already has all required columns:
`id`, `site_id`, `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`,
`tier`, `status`, `current_period_start`, `current_period_end`, `trial_end`,
`canceled_at`, `cancel_at_period_end`, `max_users`, `max_sites`,
`max_records_per_month`, `created_at`, `updated_at`

---

## The Problem

Stripe webhook → writes to `log_user_subscriptions` (user-keyed, legacy)
App reads from → `log_subscriptions` (site-keyed, correct)

**Result:** Stripe charges work fine, but the app always shows no subscription.

---

## Join Pattern

Stripe identifies customers by `stripe_customer_id`.
To map a Stripe customer to a `site_id`, we need:

```
stripe_customer_id
  → log_user_subscriptions.user_id  (existing Stripe write target)
  → OR log_user_profiles.stripe_customer_id  (if stored)
  → log_user_sites.site_id           (bridge)
```

**Recommended approach:** When the Stripe webhook fires on `customer.subscription.created`
or `customer.subscription.updated`, look up the user's site_id from `log_user_sites`
and write to `log_subscriptions`.

---

## Tier Mapping

Stripe Price IDs must be mapped to PPN tier values:

| Stripe Price ID (env var) | log_subscriptions.tier |
|---|---|
| `STRIPE_PRICE_SOLO` | `solo` |
| `STRIPE_PRICE_CLINIC` | `clinic` |
| `STRIPE_PRICE_NETWORK` | `network` |

> **Do NOT hardcode Price IDs.** Read from `process.env`.

---

## Files to Modify

| File | Action |
|---|---|
| `supabase/functions/stripe-webhook/index.ts` | MODIFY — add writes to `log_subscriptions` |

> If the above function doesn't exist yet, check `src/api/` or `netlify/functions/` for
> the current Stripe webhook handler. Grep: `grep -rn "stripe-webhook\|stripeWebhook" .`

---

## Logic to Add (in the subscription event handler)

```typescript
// After verifying the Stripe event signature...

if (
  event.type === 'customer.subscription.created' ||
  event.type === 'customer.subscription.updated' ||
  event.type === 'customer.subscription.deleted'
) {
  const subscription = event.data.object;
  const stripeCustomerId = subscription.customer as string;

  // Step 1: Find the user_id from the legacy table or profiles
  const { data: profile } = await supabase
    .from('log_user_profiles')
    .select('user_id')
    .eq('stripe_customer_id', stripeCustomerId)
    .single();

  if (!profile?.user_id) {
    console.error('[stripe-webhook] No user found for customer:', stripeCustomerId);
    return new Response('User not found', { status: 200 }); // 200 to ack Stripe
  }

  // Step 2: Get their site_id
  const { data: siteLink } = await supabase
    .from('log_user_sites')
    .select('site_id')
    .eq('user_id', profile.user_id)
    .limit(1)
    .single();

  if (!siteLink?.site_id) {
    console.error('[stripe-webhook] No site found for user:', profile.user_id);
    return new Response('Site not found', { status: 200 });
  }

  // Step 3: Map price_id to tier
  const priceId = subscription.items.data[0]?.price.id;
  const tierMap: Record<string, string> = {
    [Deno.env.get('STRIPE_PRICE_SOLO') ?? '']: 'solo',
    [Deno.env.get('STRIPE_PRICE_CLINIC') ?? '']: 'clinic',
    [Deno.env.get('STRIPE_PRICE_NETWORK') ?? '']: 'network',
  };
  const tier = tierMap[priceId] ?? 'solo';

  // Step 4: Upsert into log_subscriptions
  await supabase.from('log_subscriptions').upsert({
    site_id: siteLink.site_id,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    tier,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: 'site_id', // assumes UNIQUE(site_id) constraint — verify in schema
  });
}
```

> **BUILDER note:** Check if `log_subscriptions` has a UNIQUE constraint on `site_id`.
> If not, use `stripe_subscription_id` as the conflict target instead.
> Run: `SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'log_subscriptions';`

---

## Prerequisite: `log_user_profiles.stripe_customer_id`

The lookup in Step 1 assumes `log_user_profiles` stores `stripe_customer_id`.
Verify with:

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'log_user_profiles' AND column_name = 'stripe_customer_id';
```

**If missing:** Add an additive migration first:
```sql
ALTER TABLE public.log_user_profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
```

Stripe's `customer.created` webhook (or the checkout session) must also write this value
to `log_user_profiles` when a new customer is created.

---

## Constraints

- No changes to the frontend
- No hardcoded secrets — all env vars
- Do not drop or alter `log_user_subscriptions` — leave it as legacy archive

---

## Acceptance Criteria

- [ ] A test Stripe event (via `stripe trigger customer.subscription.created`) writes a row to `log_subscriptions`
- [ ] `useSubscription` hook returns correct tier/status after the event
- [ ] `log_user_subscriptions` is not written to by the new handler (confirm via Supabase logs)
- [ ] `npm run build` clean
