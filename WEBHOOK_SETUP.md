# Stripe Webhook Configuration

**Status:** Ready to configure  
**Webhook URL:** `https://rxwsthatjhnixqsthegf.supabase.co/functions/v1/stripe-webhook`

---

## Quick Setup (2 minutes)

### 1. Open Stripe Webhooks

Go to: [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/test/webhooks)

Make sure you're in **Test mode** (orange banner at top)

### 2. Add Endpoint

1. Click **+ Add endpoint**
2. **Endpoint URL:** 
   ```
   https://rxwsthatjhnixqsthegf.supabase.co/functions/v1/stripe-webhook
   ```
3. **Description:** `PPN Subscription Webhooks`

### 3. Select Events

Click **Select events** and choose these 3:

- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`

### 4. Add Endpoint

Click **Add endpoint** button

### 5. Get Signing Secret

After creating the endpoint:

1. Click on the endpoint you just created
2. Click **Reveal** next to **Signing secret**
3. Copy the secret (starts with `whsec_`)

### 6. Add Secret to Supabase

In Terminal, run:

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

Replace `whsec_YOUR_SECRET_HERE` with the actual signing secret.

---

## Test the Integration

### 1. Start Dev Server

```bash
npm run dev
```

### 2. Test Checkout

1. Navigate to: `http://localhost:3000/#/checkout`
2. Select a tier (Solo or Clinic)
3. Click "Start 14-Day Free Trial"
4. Use test card: **4242 4242 4242 4242**
5. Any future date, any CVC

### 3. Verify

✅ Checkout completes  
✅ Redirected to dashboard  
✅ Subscription appears in Supabase `user_subscriptions` table  
✅ Webhook event received in Stripe Dashboard

---

**Ready to configure? Follow steps 1-6 above!** 🚀
