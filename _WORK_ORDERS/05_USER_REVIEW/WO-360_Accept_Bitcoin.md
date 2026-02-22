---
status: 05_USER_REVIEW
owner: USER
failure_count: 0
---

# PRODDY Strategic Brief: Accepting Crypto / Bitcoin (WO-360)

Here are the primary considerations for accepting Bitcoin, CashApp, and Coinbase for PPN membership subscriptions.

## 1. Technical Implementation paths

**Option 1: The Native Stripe Approach (Recommended)**
Stripe now supports native crypto payouts (USDC) and CashApp Pay. 
- **Pros:** Everything stays in our existing billing architecture. Recurring subscriptions (ARR) are fully managed. Metrics stay flawless.
- **Cons:** Stripe's crypto support is largely B2B payouts, and consumer crypto payments (like raw BTC to your wallet) are not fully supported natively for SaaS subscriptions. CashApp Pay, however, is a simple toggle in the Stripe Dashboard.

**Option 2: Coinbase Commerce (The Crypto Native Approach)**
We integrate a second payment gateway (Coinbase Commerce) specifically for tech-forward/libertarian practitioners who prefer crypto.
- **Pros:** Direct crypto absorption.
- **Cons:** Coinbase Commerce does not natively support **recurring subscriptions**. It only does one-time charges. You'd have to sell 1-year prepaid licenses as a flat fee (e.g., $3,000 in BTC).

## 2. Market Positioning Risk
- Currently, PPN is positioned as a **strictly clinical, highly compliant medical intelligence platform**. Accepting crypto directly on the primary checkout page can inadvertently trigger negative heuristics for some conservative medical partners (associating it with unregulated markets or dark web origins).
- **Recommendation:** Do not put "Pay with Bitcoin" on the public Pricing Page. If a clinic wants to pay in crypto, handle it as a "Private Invoice" or VIP onboarding flow. 

## 3. Operational Overhead
- If you accept crypto directly into a wallet (not autoconverted to USD via Stripe), you introduce tax accounting complexity (cost-basis tracking) and volatility risk to your operating runway.

## 4. Immediate Next Step
- **For CashApp:** I recommend we simply toggle "CashApp Pay" on in your Stripe Dashboard. It will seamlessly integrate into the existing UI. 
- **For Bitcoin/Coinbase:** We should create a backdoor "Invoice me in Crypto" contact form, rather than building a complex secondary billing engine for an untested market segment. 

**Does this VIP backdoor approach for Crypto sound right to you?**
