/**
 * Stripe Client Configuration
 *
 * Product: PPN Portal
 * Tier structure (approved 2026-02-19):
 *   1. Protocol Access      — FREE ($0, no Stripe price, lead gen/students)
 *   2. Standard Plan        — $199/month (full access, no data contribution required)
 *   3. Research Partner Plan — $49/month (75% discount for data contributors, ≥5 protocols/month)
 *   4. Enterprise           — Custom / Contact Sales ($999+/site/month)
 *   5. Data Licensing       — Internal/sales only, NOT public-facing
 *
 * Required Stripe products/prices (create in dashboard under product "PPN Portal"):
 *   VITE_STRIPE_PRICE_STANDARD           — $199/month recurring (price description: "Standard Plan")
 *   VITE_STRIPE_PRICE_RESEARCH_PARTNER   — $49/month recurring  (price description: "Research Partner Plan")
 *   VITE_STRIPE_PRICE_ANNUAL             — $1,899/year recurring (price_1T2pvyDc55zGK9Db92dmW9rd)
 *
 * Required Vercel environment variables:
 *   VITE_STRIPE_PUBLISHABLE_KEY          — pk_live_... (safe to expose, designed to be public)
 *   VITE_STRIPE_PRICE_STANDARD
 *   VITE_STRIPE_PRICE_RESEARCH_PARTNER
 *   VITE_STRIPE_PRICE_ANNUAL             (optional)
 *
 * Naming approved 2026-02-19:
 *   - "Clinic OS" retired — sounded like an EHR system
 *   - "Data Bounty" retired — not intuitive
 *   - "Risk Shield" retired — defensive/insurance connotation
 *   - "Pharma Partner" retired — market-sensitive, internal use only
 *   - "Institutional" banned from all public copy — market-sensitive
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
};

export const SUBSCRIPTION_TIERS = {

    /**
     * Tier 1: Protocol Access — FREE
     * No Stripe product needed. Goal: lead generation, students, practitioners evaluating.
     */
    free: {
        id: 'free',
        name: 'Protocol Access',
        tagline: 'Start learning. No cost.',
        priceId: null,
        priceIdAnnual: null,
        priceMonthly: 0,
        priceAnnual: 0,
        currency: 'usd',
        trialDays: null,
        badge: null,
        features: [
            'Read-only Protocol Library',
            'Public benchmark access (aggregated, N≥10)',
            'Interaction Checker (basic)',
            'Educational content & field resources',
        ],
        limitations: [
            'Cannot create or submit protocols',
            'No full benchmarking dashboard',
            'No data export',
            'No safety surveillance alerts',
        ],
        cta: 'Start Exploring',
        ctaPath: '/signup?tier=free',
        limits: { users: 1, sites: 0, protocols: 0 },
    },

    /**
     * Tier 2: PPN Portal — Standard Plan ($199/month)
     * Full access, no data contribution required.
     */
    standard: {
        id: 'standard',
        name: 'PPN Portal',
        planName: 'Standard Plan',
        tagline: 'Full clinical intelligence for your practice.',
        priceId: import.meta.env.VITE_STRIPE_PRICE_STANDARD || 'price_standard',
        priceIdAnnual: import.meta.env.VITE_STRIPE_PRICE_ANNUAL || 'price_annual',
        priceMonthly: 199,
        priceAnnual: 159,  // $159/mo equivalent, billed as $1,899/yr (Stripe: price_1T2pvyDc55zGK9Db92dmW9rd)
        currency: 'usd',
        trialDays: 14,
        badge: null,
        features: [
            'Full Protocol Builder (unlimited protocols)',
            'Patient Outcomes Tracking (de-identified)',
            'Real-Time Benchmarking Dashboard',
            'Safety Surveillance & Drug Interaction Alerts',
            'Wellness Journey Tracking (longitudinal)',
            'Data Export (CSV / PDF)',
            'Interaction Checker (full)',
            'Alliance Benchmarking (peer de-identified data)',
            'HIPAA-Compliant Storage',
            'Email Support',
            '14-Day Free Trial',
        ],
        cta: 'Start 14-Day Free Trial',
        ctaPath: '/signup?tier=standard',
        limits: { users: 1, sites: 1, protocols: -1 },
    },

    /**
     * Tier 3: PPN Portal — Research Partner Plan ($49/month)
     * 75% discount for practitioners who contribute ≥5 de-identified protocols/month
     * to the PPN Research Alliance.
     *
     * Business logic: a de-identified clinical record is worth ~$150/year to PPN.
     * Discounting the software by $150/month is breakeven — but guarantees data liquidity.
     * Practitioners save $1,800/year. PPN gets the data asset. Win-win.
     */
    research_partner: {
        id: 'research_partner',
        name: 'PPN Portal',
        planName: 'Research Partner Plan',
        tagline: 'Full access at 75% off. In exchange for contributing de-identified data.',
        priceId: import.meta.env.VITE_STRIPE_PRICE_RESEARCH_PARTNER || 'price_research_partner',
        priceIdAnnual: null,              // Annual not offered on Research Partner rate
        priceMonthly: 49,
        priceAnnual: null,
        standardPriceMonthly: 199,        // Reference price for showing discount
        savingsMonthly: 150,              // $1,800/year savings
        currency: 'usd',
        trialDays: 14,
        badge: 'Research Partner',
        features: [
            'Everything in Standard Plan',
            'Research Partner status in the PPN Research Alliance',
            'Contribution Dashboard (track your data quality score)',
            '75% subscription discount ($49/mo vs $199/mo)',
            'Save $1,800/year',
        ],
        requirements: {
            minProtocolsPerMonth: 5,
            minQualityScore: 'Bronze',      // completeness threshold
            gracePeriodMonths: 2,           // 2 consecutive months below threshold ends discount
        },
        cta: 'Join as Research Partner',
        ctaPath: '/signup?tier=research_partner',
        limits: { users: 1, sites: 1, protocols: -1 },
    },

    /**
     * Tier 4: Enterprise — Custom pricing ($999+/site/month)
     * Multi-site networks. Handled via Contact Sales — no self-serve checkout.
     * NOTE: Do not use 'institutional' or 'pharma' in any public-facing copy.
     */
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        planName: 'Enterprise',
        tagline: 'Multi-site clinical intelligence at scale.',
        priceId: null,
        priceIdAnnual: null,
        priceMonthly: null,
        priceAnnual: null,
        currency: 'usd',
        trialDays: null,
        badge: 'Enterprise',
        features: [
            'Everything in Standard Plan, plus:',
            'Multi-site dashboards (compare across locations)',
            'Group malpractice insurance access (negotiated rates)',
            'Insurance dossier generator (automated prior auth)',
            '"Center of Excellence" certification',
            'Unlimited practitioner accounts',
            'Unlimited sites',
            'Dedicated Account Manager',
            'Priority Support',
            'Custom Training & Onboarding',
            'Research Collaboration Opportunities',
        ],
        cta: 'Contact Sales',
        ctaPath: '/contact?subject=enterprise',
        limits: { users: -1, sites: -1, protocols: -1 },
    },

} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
export type BillingInterval = 'monthly' | 'annual';

export const getPriceId = (
    tier: SubscriptionTier,
    interval: BillingInterval
): string | null => {
    const t = SUBSCRIPTION_TIERS[tier];
    if (interval === 'annual' && 'priceIdAnnual' in t && t.priceIdAnnual) {
        return t.priceIdAnnual;
    }
    return t.priceId;
};

export const getPrice = (
    tier: SubscriptionTier,
    interval: BillingInterval
): number | null => {
    const t = SUBSCRIPTION_TIERS[tier];
    if (interval === 'annual' && 'priceAnnual' in t && t.priceAnnual) {
        return t.priceAnnual;
    }
    return 'priceMonthly' in t ? t.priceMonthly : null;
};

export const getAnnualSavings = (tier: SubscriptionTier): number => {
    const t = SUBSCRIPTION_TIERS[tier];
    if (!('priceMonthly' in t) || !t.priceMonthly || !('priceAnnual' in t) || !t.priceAnnual) return 0;
    return (t.priceMonthly - t.priceAnnual) * 12;
};

export const getResearchPartnerSavings = (): number => {
    return SUBSCRIPTION_TIERS.research_partner.savingsMonthly * 12; // $1,800/yr
};

export type SubscriptionStatus =
    | 'active'
    | 'trialing'
    | 'past_due'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'unpaid';

export interface SubscriptionData {
    id: string;
    userId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    trialEnd: Date | null;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    isResearchPartner: boolean;
    researchPartnerAgreementSignedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export const formatCurrency = (amount: number, currency: string = 'usd'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const hasFeatureAccess = (
    userTier: SubscriptionTier | null,
    requiredTier: SubscriptionTier
): boolean => {
    if (!userTier) return false;
    const hierarchy: SubscriptionTier[] = ['free', 'standard', 'research_partner', 'enterprise'];
    return hierarchy.indexOf(userTier) >= hierarchy.indexOf(requiredTier);
};

export default {
    getStripe,
    SUBSCRIPTION_TIERS,
    getPriceId,
    getPrice,
    getAnnualSavings,
    getResearchPartnerSavings,
    formatCurrency,
    hasFeatureAccess,
};
