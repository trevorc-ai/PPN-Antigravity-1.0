/**
 * Stripe Client Configuration — WO-097 "Data Bounty" Pricing Model
 *
 * Tier structure (approved 2026-02-19):
 *   1. Protocol Access   — FREE   (no Stripe price, UI-only)
 *   2. Clinic OS         — $199/mo standard OR $49/mo with Data Bounty (75% discount)
 *   3. Risk Shield       — Custom / Contact Sales  ($999+/site/mo)
 *   4. Pharma Partner    — Data licensing ($50K+/yr, handled outside Stripe)
 *
 * Required Stripe products/prices to create in dashboard:
 *   VITE_STRIPE_PRICE_CLINIC_OS_STANDARD     — $199/month (recurring)
 *   VITE_STRIPE_PRICE_CLINIC_OS_DATA_BOUNTY  — $49/month  (recurring, Data Bounty rate)
 *   VITE_STRIPE_PRICE_CLINIC_OS_ANNUAL       — $1,908/year (recurring, equiv ~$159/mo, 20% off)
 *
 * Vercel env vars to set:
 *   VITE_STRIPE_PUBLISHABLE_KEY
 *   VITE_STRIPE_PRICE_CLINIC_OS_STANDARD
 *   VITE_STRIPE_PRICE_CLINIC_OS_DATA_BOUNTY
 *   VITE_STRIPE_PRICE_CLINIC_OS_ANNUAL        (optional, if offering annual)
 *
 * Previous tiers deprecated: solo ($99), clinic ($499) — replaced by this model.
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe publishable key from environment
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Client-side Stripe instance (lazy-loaded)
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe client instance — lazy-loads Stripe.js on first call
 */
export const getStripe = (): Promise<Stripe | null> => {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
};

/**
 * Subscription tier configuration — WO-097 Data Bounty model
 */
export const SUBSCRIPTION_TIERS = {

    /**
     * Tier 1: Protocol Access — FREE
     * Goal: Lead generation, students, observers. No Stripe price needed.
     */
    free: {
        id: 'free',
        name: 'Protocol Access',
        tagline: 'Start Learning. Zero Risk.',
        priceId: null,                  // No Stripe charge
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
            'No access to full benchmarking dashboard',
            'No data export',
            'No safety surveillance alerts',
        ],
        cta: 'Start Exploring',
        ctaPath: '/signup?tier=free',
        limits: {
            users: 1,
            sites: 0,
            protocols: 0,
        },
    },

    /**
     * Tier 2: Clinic OS — $199/month standard, OR $49/month with Data Bounty
     * The core paid tier. Data Bounty = practitioners contribute ≥5 de-identified
     * protocols/month and receive a 75% discount.
     *
     * Business logic: data record is worth ~$150/yr to PPN. Discounting by $150/mo
     * is breakeven financially but guarantees data liquidity. Win-win.
     */
    clinic_os: {
        id: 'clinic_os',
        name: 'Clinic OS',
        tagline: 'The Practice Operating System for Psychedelic Therapy',
        priceId: import.meta.env.VITE_STRIPE_PRICE_CLINIC_OS_STANDARD || 'price_clinic_os_standard',
        priceIdAnnual: import.meta.env.VITE_STRIPE_PRICE_CLINIC_OS_ANNUAL || 'price_clinic_os_annual',
        priceIdDataBounty: import.meta.env.VITE_STRIPE_PRICE_CLINIC_OS_DATA_BOUNTY || 'price_clinic_os_data_bounty',
        priceMonthly: 199,
        priceMonthlyDataBounty: 49,     // 75% off — the Data Bounty rate
        priceAnnual: 159,               // ~$1,908/yr — ~20% annual discount (standard rate)
        dataBountySavingsMonthly: 150,  // $150/mo saved = $1,800/yr
        currency: 'usd',
        trialDays: 14,
        badge: 'Most Popular',
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
        dataBountyRequirements: {
            minProtocolsPerMonth: 5,
            minQualityScore: 'Bronze',    // completeness threshold
            gracePeriodMonths: 2,         // 2 consecutive months below threshold = discount ends
        },
        cta: 'Start 14-Day Free Trial',
        ctaDataBounty: 'Start with Data Bounty ($49/mo)',
        ctaPath: '/signup?tier=clinic_os',
        limits: {
            users: 1,           // per-practitioner pricing
            sites: 1,
            protocols: -1,      // unlimited
        },
    },

    /**
     * Tier 3: Risk Shield — Custom pricing ($999+/site/month)
     * Multi-site networks, group malpractice insurance, Center of Excellence cert.
     * Handled via Contact Sales — no self-serve Stripe checkout.
     */
    risk_shield: {
        id: 'risk_shield',
        name: 'Risk Shield',
        tagline: 'Enterprise-Grade Risk Management for Multi-Site Networks',
        priceId: null,          // Custom — contact sales
        priceIdAnnual: null,
        priceMonthly: null,     // Starts at $999/site/month
        priceAnnual: null,
        currency: 'usd',
        trialDays: null,
        badge: 'Enterprise',
        features: [
            'Everything in Clinic OS, PLUS:',
            'Multi-site dashboards (compare across locations)',
            'Group malpractice insurance access (negotiated rates)',
            'Insurance dossier generator (automated prior auth)',
            '"Center of Excellence" certification badge',
            'Unlimited practitioner accounts',
            'Unlimited sites',
            'Dedicated Account Manager',
            'Priority Support',
            'Custom Training & Onboarding',
            'Research Collaboration Opportunities',
        ],
        cta: 'Contact Sales',
        ctaPath: '/contact?subject=risk_shield',
        limits: {
            users: -1,
            sites: -1,
            protocols: -1,
        },
    },

} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
export type BillingInterval = 'monthly' | 'annual';
export type ClinicOsPricingMode = 'standard' | 'data_bounty';

/**
 * Get price ID for a tier and billing interval.
 * For clinic_os, pass pricingMode to get the Data Bounty rate.
 */
export const getPriceId = (
    tier: SubscriptionTier,
    interval: BillingInterval,
    pricingMode?: ClinicOsPricingMode
): string | null => {
    const t = SUBSCRIPTION_TIERS[tier];

    // Data Bounty rate (only for clinic_os, monthly only)
    if (tier === 'clinic_os' && pricingMode === 'data_bounty') {
        return (SUBSCRIPTION_TIERS.clinic_os as typeof SUBSCRIPTION_TIERS['clinic_os']).priceIdDataBounty;
    }

    if (interval === 'annual' && 'priceIdAnnual' in t && t.priceIdAnnual) {
        return t.priceIdAnnual;
    }

    return t.priceId;
};

/**
 * Get display price for a tier
 */
export const getPrice = (
    tier: SubscriptionTier,
    interval: BillingInterval,
    pricingMode?: ClinicOsPricingMode
): number | null => {
    const t = SUBSCRIPTION_TIERS[tier];

    if (tier === 'clinic_os' && pricingMode === 'data_bounty') {
        return SUBSCRIPTION_TIERS.clinic_os.priceMonthlyDataBounty;
    }

    if (interval === 'annual' && 'priceAnnual' in t && t.priceAnnual) {
        return t.priceAnnual;
    }

    return 'priceMonthly' in t ? t.priceMonthly : null;
};

/**
 * Calculate annual savings vs monthly billing
 */
export const getAnnualSavings = (tier: SubscriptionTier): number => {
    const t = SUBSCRIPTION_TIERS[tier];
    if (!('priceMonthly' in t) || !t.priceMonthly || !('priceAnnual' in t) || !t.priceAnnual) return 0;
    return (t.priceMonthly - t.priceAnnual) * 12;
};

/**
 * Calculate Data Bounty annual savings (clinic_os only)
 */
export const getDataBountySavings = (): number => {
    return SUBSCRIPTION_TIERS.clinic_os.dataBountySavingsMonthly * 12; // $1,800/yr
};

/**
 * Subscription status types
 */
export type SubscriptionStatus =
    | 'active'
    | 'trialing'
    | 'past_due'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'unpaid';

/**
 * Subscription data interface
 */
export interface SubscriptionData {
    id: string;
    userId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    tier: SubscriptionTier;
    pricingMode?: ClinicOsPricingMode;
    status: SubscriptionStatus;
    trialEnd: Date | null;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    isDataContributor: boolean;             // WO-097: tracks Data Bounty enrollment
    dataContributionAgreementSignedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'usd'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Check if user has access to a feature based on tier
 */
export const hasFeatureAccess = (
    userTier: SubscriptionTier | null,
    requiredTier: SubscriptionTier
): boolean => {
    if (!userTier) return false;
    const hierarchy: SubscriptionTier[] = ['free', 'clinic_os', 'risk_shield'];
    return hierarchy.indexOf(userTier) >= hierarchy.indexOf(requiredTier);
};

export default {
    getStripe,
    SUBSCRIPTION_TIERS,
    getPriceId,
    getPrice,
    getAnnualSavings,
    getDataBountySavings,
    formatCurrency,
    hasFeatureAccess,
};
