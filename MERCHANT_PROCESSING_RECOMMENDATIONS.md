# 💳 MERCHANT PROCESSING RECOMMENDATIONS
## Payment Processing for PPN Research Portal

**Created By:** LEAD  
**Date:** 2026-02-12 02:45 PST  
**Context:** SaaS subscription billing for psychedelic therapy platform  
**Priority:** CRITICAL - Required for revenue

---

## 🎯 EXECUTIVE SUMMARY

**Recommendation:** **Stripe** (primary) + **PayPal** (alternative)

**Why Stripe:**
- ✅ Best-in-class developer experience (fastest integration)
- ✅ Built-in subscription management (recurring billing)
- ✅ Supports freemium model (free tier → paid upgrades)
- ✅ Low risk of account holds (healthcare SaaS is allowed)
- ✅ Excellent fraud protection
- ✅ Transparent pricing (2.9% + $0.30 per transaction)

**Why PayPal (as backup):**
- ✅ Some practitioners prefer PayPal
- ✅ Backup if Stripe has issues
- ✅ International payments (easier than Stripe in some countries)

**Why NOT Others:**
- ❌ Square: Designed for in-person, not SaaS subscriptions
- ❌ Braintree: Owned by PayPal, more complex than Stripe
- ❌ Authorize.net: Outdated, poor developer experience
- ❌ High-risk processors: Unnecessary (we're not selling substances)

---

## 💰 PRICING STRUCTURE RECAP

### **Freemium Model:**
- **Free Tier:** $0/month (Interaction Checker + Self-Reporting)
- **Solo Tier:** $49/month (Network benchmarking, analytics, export)
- **Clinic Tier:** $149/month (5 users, templates, compliance)
- **Network Tier:** $499/month (Unlimited users, API, white-label)

### **Annual Discounts:**
- Solo: $490/year (save $98 = 2 months free)
- Clinic: $1,490/year (save $298 = 2 months free)
- Network: $4,990/year (save $998 = 2 months free)

---

## 🏆 RECOMMENDATION 1: STRIPE (PRIMARY)

### **Why Stripe:**

**1. Best Developer Experience**
- Pre-built UI components (Stripe Checkout, Stripe Elements)
- Excellent documentation
- React integration (stripe-react-js)
- Fastest time to launch (2-3 hours integration)

**2. Built-In Subscription Management**
- Recurring billing (monthly/annual)
- Automatic invoice generation
- Failed payment retry logic
- Proration for upgrades/downgrades
- Trial periods (14-day free trial)

**3. Freemium Support**
- Free tier (no payment required)
- Seamless upgrade flow (add payment method)
- Metered billing (if needed for usage-based pricing)

**4. Healthcare-Friendly**
- Healthcare SaaS is explicitly allowed
- Not considered "high-risk" (we're not selling substances)
- Low risk of account holds

**5. Fraud Protection**
- Stripe Radar (built-in fraud detection)
- 3D Secure (for high-risk transactions)
- Chargeback protection

**6. Transparent Pricing**
- 2.9% + $0.30 per transaction (standard)
- No monthly fees
- No setup fees
- No hidden fees

---

### **Stripe Pricing Breakdown:**

**Monthly Subscriptions:**
- Solo ($49/month): Stripe fee = $1.72 → You keep $47.28 (96.5%)
- Clinic ($149/month): Stripe fee = $4.62 → You keep $144.38 (96.9%)
- Network ($499/month): Stripe fee = $14.77 → You keep $484.23 (97.0%)

**Annual Subscriptions:**
- Solo ($490/year): Stripe fee = $14.51 → You keep $475.49 (97.0%)
- Clinic ($1,490/year): Stripe fee = $43.51 → You keep $1,446.49 (97.1%)
- Network ($4,990/year): Stripe fee = $144.91 → You keep $4,845.09 (97.1%)

**Revenue Projection (Month 12):**
- Gross MRR: $42,893
- Stripe fees (3%): -$1,287
- **Net MRR: $41,606 (97%)**

---

### **Stripe Integration (Technical):**

**Step 1: Install Stripe**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Step 2: Create Stripe Products**
```javascript
// Create products in Stripe Dashboard or via API
const products = [
  {
    name: 'PPN Solo',
    price: 4900, // $49.00 in cents
    interval: 'month',
    features: ['Network Benchmarking', 'Analytics', 'Data Export']
  },
  {
    name: 'PPN Clinic',
    price: 14900, // $149.00 in cents
    interval: 'month',
    features: ['5 Users', 'Protocol Templates', 'Compliance Dashboard']
  },
  {
    name: 'PPN Network',
    price: 49900, // $499.00 in cents
    interval: 'month',
    features: ['Unlimited Users', 'API Access', 'White-Label']
  }
];
```

**Step 3: Implement Checkout**
```tsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ priceId }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create subscription
    const { error, subscription } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: user.email,
          },
        },
      }
    );

    if (error) {
      console.error(error);
    } else {
      // Subscription successful
      updateUserTier(subscription.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Subscribe to Solo ($49/month)
      </button>
    </form>
  );
}
```

**Step 4: Handle Webhooks**
```javascript
// Backend: Handle Stripe webhooks
app.post('/webhook/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

  switch (event.type) {
    case 'customer.subscription.created':
      // Activate user's subscription
      await activateSubscription(event.data.object);
      break;
    case 'customer.subscription.deleted':
      // Downgrade user to free tier
      await downgradeToFree(event.data.object);
      break;
    case 'invoice.payment_failed':
      // Send payment failure email
      await sendPaymentFailureEmail(event.data.object);
      break;
  }

  res.json({ received: true });
});
```

---

### **Stripe Features to Use:**

**1. Stripe Checkout (Hosted Page)**
- Pre-built, secure checkout page
- Handles payment method collection
- Supports trial periods
- **Fastest integration** (1-2 hours)

**2. Stripe Billing Portal**
- Self-service subscription management
- Users can upgrade/downgrade
- Users can update payment method
- Users can cancel subscription
- **Zero maintenance** (Stripe handles UI)

**3. Stripe Radar (Fraud Detection)**
- Automatically blocks fraudulent transactions
- Machine learning-based
- No additional cost (included)

**4. Stripe Tax (Optional)**
- Automatic sales tax calculation
- Handles US state taxes + VAT
- $0.50 per transaction (optional)

---

## 🏆 RECOMMENDATION 2: PAYPAL (BACKUP)

### **Why PayPal:**

**1. Practitioner Preference**
- Some practitioners prefer PayPal (familiar, trusted)
- Especially older practitioners (less tech-savvy)

**2. International Payments**
- Easier than Stripe in some countries
- More currencies supported

**3. Backup Payment Method**
- If Stripe has issues (rare)
- If practitioner's card is declined by Stripe

---

### **PayPal Pricing:**

**Standard Rates:**
- 2.99% + $0.49 per transaction (slightly higher than Stripe)

**Monthly Subscriptions:**
- Solo ($49/month): PayPal fee = $1.96 → You keep $47.04 (96.0%)
- Clinic ($149/month): PayPal fee = $4.95 → You keep $144.05 (96.7%)
- Network ($499/month): PayPal fee = $15.41 → You keep $483.59 (96.9%)

**Comparison to Stripe:**
- PayPal is ~$0.20-$0.70 more expensive per transaction
- But worth it for practitioners who prefer PayPal

---

### **PayPal Integration:**

**Step 1: Install PayPal SDK**
```bash
npm install @paypal/react-paypal-js
```

**Step 2: Implement PayPal Buttons**
```tsx
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

function PayPalCheckout({ planId, amount }) {
  return (
    <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        createSubscription={(data, actions) => {
          return actions.subscription.create({
            plan_id: planId, // 'SOLO_MONTHLY', 'CLINIC_MONTHLY', etc.
          });
        }}
        onApprove={(data, actions) => {
          // Subscription successful
          updateUserTier(data.subscriptionID);
        }}
      />
    </PayPalScriptProvider>
  );
}
```

---

## ❌ NOT RECOMMENDED

### **Square:**
- **Why NOT:** Designed for in-person payments (retail, restaurants)
- **Issue:** Poor subscription management
- **Issue:** Not optimized for SaaS

### **Braintree:**
- **Why NOT:** Owned by PayPal, more complex than Stripe
- **Issue:** Worse developer experience than Stripe
- **Issue:** No advantage over Stripe + PayPal combo

### **Authorize.net:**
- **Why NOT:** Outdated technology (2000s-era)
- **Issue:** Poor developer experience
- **Issue:** Complex integration

### **High-Risk Processors (e.g., CCBill, Epoch):**
- **Why NOT:** Unnecessary (we're not selling substances)
- **Issue:** Higher fees (5-15%)
- **Issue:** Reputation risk (associated with adult content)

---

## 🚨 RISK CONSIDERATIONS

### **Is PPN "High-Risk"?**

**NO.** Here's why:

**What We Are:**
- Healthcare SaaS (software subscription)
- Documentation and analytics platform
- No substance sales
- No patient payments
- B2B (practitioner-to-business)

**What We're NOT:**
- Substance sales (we don't sell psilocybin, ketamine, etc.)
- Patient-facing payments (no co-pays, no insurance billing)
- High-chargeback business (SaaS has low chargebacks)

**Stripe's Prohibited Businesses:**
- ✅ Healthcare SaaS: **Allowed**
- ❌ Controlled substance sales: **Prohibited** (we don't do this)
- ❌ Unlicensed pharmaceutical sales: **Prohibited** (we don't do this)

**Conclusion:** PPN is **low-risk** for Stripe and PayPal.

---

### **Potential Issues:**

**Issue 1: "Psychedelic" in Name**
- **Risk:** Payment processor sees "psychedelic" and flags as high-risk
- **Mitigation:** Emphasize "research," "clinical," "healthcare SaaS"
- **Mitigation:** Show we're not selling substances
- **Likelihood:** Low (Stripe is sophisticated, understands SaaS)

**Issue 2: Chargeback Rate**
- **Risk:** High chargeback rate → account hold
- **Mitigation:** Clear refund policy, excellent customer service
- **Mitigation:** 14-day free trial (reduces buyer's remorse)
- **Likelihood:** Very low (SaaS has <1% chargeback rate)

**Issue 3: Regulatory Scrutiny**
- **Risk:** DEA or FDA scrutinizes psychedelic businesses
- **Mitigation:** We're documentation software, not substance sales
- **Mitigation:** No PHI = no HIPAA risk
- **Likelihood:** Very low (we're not in their jurisdiction)

---

## 💳 RECOMMENDED PAYMENT FLOW

### **Free Tier Signup:**
1. User signs up (email + password)
2. No payment method required
3. Immediate access to Interaction Checker + Self-Reporting

### **Upgrade to Paid Tier:**
1. User clicks "Upgrade to Solo" in Dashboard
2. Redirect to Stripe Checkout (or show PayPal option)
3. User enters payment method
4. 14-day free trial starts (no charge)
5. After 14 days, first charge ($49)
6. User upgraded to Solo tier

### **Subscription Management:**
1. User clicks "Manage Subscription" in Dashboard
2. Redirect to Stripe Billing Portal
3. User can:
   - Upgrade to Clinic or Network
   - Downgrade to Free
   - Update payment method
   - Cancel subscription
   - View invoices

---

## 📊 REVENUE OPTIMIZATION

### **Reduce Stripe Fees:**

**Option 1: Annual Billing**
- Encourage annual billing (17% discount)
- Reduces Stripe fees (1 charge vs. 12 charges)
- Improves cash flow

**Option 2: Stripe Billing (vs. Checkout)**
- Stripe Billing: 0.5% + $0.05 per invoice (cheaper for subscriptions)
- Stripe Checkout: 2.9% + $0.30 per transaction
- **Savings:** ~$1.20 per $49 transaction

**Option 3: Volume Discounts**
- Stripe offers custom pricing for >$1M/year revenue
- Negotiate lower rates (e.g., 2.5% instead of 2.9%)
- **Savings:** ~$4,000/year at $1M revenue

---

## ✅ IMPLEMENTATION CHECKLIST

### **Phase 1: Stripe Setup (4 hours)**
- [ ] Create Stripe account
- [ ] Create products (Solo, Clinic, Network)
- [ ] Create prices (monthly, annual)
- [ ] Set up webhook endpoint
- [ ] Test in Stripe test mode

### **Phase 2: Frontend Integration (6 hours)**
- [ ] Install Stripe SDK
- [ ] Create Checkout component
- [ ] Create Subscription Management page
- [ ] Add upgrade prompts in Dashboard
- [ ] Test upgrade flow (free → Solo)

### **Phase 3: Backend Integration (8 hours)**
- [ ] Create Stripe customer on signup
- [ ] Handle webhook events (subscription created, deleted, payment failed)
- [ ] Update user tier in database
- [ ] Send confirmation emails
- [ ] Test subscription lifecycle

### **Phase 4: PayPal Integration (4 hours)**
- [ ] Create PayPal business account
- [ ] Create subscription plans
- [ ] Install PayPal SDK
- [ ] Add PayPal button to Checkout
- [ ] Test PayPal subscription flow

### **Phase 5: Testing (4 hours)**
- [ ] Test free → Solo upgrade
- [ ] Test Solo → Clinic upgrade
- [ ] Test Clinic → Free downgrade
- [ ] Test payment failure handling
- [ ] Test annual billing
- [ ] Test refunds

**Total Estimated Time:** 26 hours

---

## 🎯 SUCCESS METRICS

### **Payment Conversion:**
- Free → Paid conversion: >20%
- Trial → Paid conversion: >60%
- Payment failure rate: <5%

### **Revenue:**
- Month 3 MRR: $5,880
- Month 6 MRR: $20,064
- Month 12 MRR: $42,893

### **Chargeback Rate:**
- Target: <0.5% (industry average: 0.6%)
- Mitigation: 14-day free trial, clear refund policy

---

## 📋 FINAL RECOMMENDATION

### **Primary: Stripe**
- Use for 90%+ of transactions
- Best developer experience
- Built-in subscription management
- Transparent pricing (2.9% + $0.30)

### **Backup: PayPal**
- Offer as alternative payment method
- For practitioners who prefer PayPal
- For international payments

### **Implementation Priority:**
1. **Week 1:** Stripe integration (Checkout + Billing Portal)
2. **Week 2:** PayPal integration (backup option)
3. **Week 3:** Testing and optimization

### **Estimated Costs:**
- Stripe fees: ~3% of revenue ($1,287/month at $42,893 MRR)
- PayPal fees: ~3% of PayPal transactions (minimal)
- **Total:** ~$1,300/month in payment processing fees

### **Net Revenue:**
- Gross MRR: $42,893
- Payment fees: -$1,287
- **Net MRR: $41,606 (97%)**

---

**Status:** ✅ Merchant processing recommendations complete  
**Next:** Set up Stripe account, integrate Checkout  
**Priority:** 🔴 CRITICAL - Required for revenue 💳
