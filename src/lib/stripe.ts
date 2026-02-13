/**
 * Stripe Client Configuration
 * 
 * Manages Stripe subscription tiers, pricing, and client initialization.
 * 
 * @see /Users/trevorcalton/.gemini/antigravity/brain/2e1f5871-bb94-43c4-bd75-775f905e85ec/stripe_integration_spec.md
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe publishable key from environment
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Client-side Stripe instance (lazy-loaded)
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe client instance
 * Lazy-loads Stripe.js on first call
 */
export const getStripe = (): Promise<Stripe | null> => {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
};

/**
 * Subscription tier configuration
 * Matches pricing strategy from MARKETER
 */
export const SUBSCRIPTION_TIERS = {
    solo: {
        id: 'solo',
        name: 'Solo Practitioner',
        priceId: import.meta.env.VITE_STRIPE_PRICE_SOLO_MONTHLY || 'price_solo_monthly',
        priceIdAnnual: import.meta.env.VITE_STRIPE_PRICE_SOLO_ANNUAL || 'price_solo_annual',
        priceMonthly: 99,
        priceAnnual: 79, // 20% discount
        currency: 'usd',
        interval: 'month' as const,
        trialDays: 14,
        features: [
            '1 practitioner account',
            'Unlimited protocols',
            'Unlimited patients',
            '1 clinic site',
            'Protocol Builder with Clinical Decision Support',
            'Safety Surveillance & Drug Interaction Alerts',
            'Patient Outcomes Tracking',
            'Network Benchmarking (840+ clinicians)',
            'Basic Analytics Dashboard',
            'Data Export (CSV)',
            'HIPAA-Compliant Storage',
            'Email Support',
        ],
        limits: {
            users: 1,
            sites: 1,
            protocols: -1, // unlimited
        },
    },
    clinic: {
        id: 'clinic',
        name: 'Clinic',
        priceId: import.meta.env.VITE_STRIPE_PRICE_CLINIC_MONTHLY || 'price_clinic_monthly',
        priceIdAnnual: import.meta.env.VITE_STRIPE_PRICE_CLINIC_ANNUAL || 'price_clinic_annual',
        priceMonthly: 499,
        priceAnnual: 399, // 20% discount
        currency: 'usd',
        interval: 'month' as const,
        trialDays: 14,
        features: [
            'Everything in Solo, PLUS:',
            'Up to 10 practitioner accounts',
            'Up to 3 clinic sites',
            'Team Collaboration & Role-Based Permissions',
            'Advanced Analytics (12 Deep Dives)',
            'Custom Reporting & Scheduled Exports',
            'Team Performance Dashboards',
            'Activity Logs & Audit Trails',
            'Protocol Templates (save & share)',
            'Priority Email Support',
            '1-hour Onboarding Call',
        ],
        limits: {
            users: 10,
            sites: 3,
            protocols: -1, // unlimited
        },
        addOns: {
            additionalUser: {
                name: 'Additional User',
                price: 40,
                priceId: import.meta.env.VITE_STRIPE_PRICE_ADDON_USER || 'price_addon_user',
            },
            additionalSite: {
                name: 'Additional Site',
                price: 100,
                priceId: import.meta.env.VITE_STRIPE_PRICE_ADDON_SITE || 'price_addon_site',
            },
        },
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        priceId: null, // Custom pricing
        priceIdAnnual: null,
        priceMonthly: null, // Custom
        priceAnnual: null,
        currency: 'usd',
        interval: 'month' as const,
        trialDays: null, // Custom demo
        features: [
            'Everything in Clinic, PLUS:',
            'Unlimited practitioners',
            'Unlimited sites',
            'API Access & Webhooks',
            'Custom Integrations (EHR, scheduling)',
            'White-Labeling (patient-facing reports)',
            'Advanced Data Validation & Quality Controls',
            'Multi-Site Coordination Tools',
            'Custom Export Formats (FDA submissions)',
            'Dedicated Account Manager',
            '24/7 Priority Support',
            'Custom Training & Onboarding',
            'Research Collaboration Opportunities',
            'Advisory Board Participation',
        ],
        limits: {
            users: -1, // unlimited
            sites: -1, // unlimited
            protocols: -1, // unlimited
        },
    },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
export type BillingInterval = 'monthly' | 'annual';

/**
 * Get price ID for a tier and billing interval
 */
export const getPriceId = (tier: SubscriptionTier, interval: BillingInterval): string | null => {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (interval === 'annual' && tierConfig.priceIdAnnual) {
        return tierConfig.priceIdAnnual;
    }
    return tierConfig.priceId;
};

/**
 * Get price amount for a tier and billing interval
 */
export const getPrice = (tier: SubscriptionTier, interval: BillingInterval): number | null => {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (interval === 'annual' && tierConfig.priceAnnual) {
        return tierConfig.priceAnnual;
    }
    return tierConfig.priceMonthly;
};

/**
 * Calculate annual savings
 */
export const getAnnualSavings = (tier: SubscriptionTier): number => {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig.priceMonthly || !tierConfig.priceAnnual) return 0;

    const monthlyTotal = tierConfig.priceMonthly * 12;
    const annualTotal = tierConfig.priceAnnual * 12;
    return monthlyTotal - annualTotal;
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
    status: SubscriptionStatus;
    trialEnd: Date | null;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
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

    const tierHierarchy: SubscriptionTier[] = ['solo', 'clinic', 'enterprise'];
    const userTierIndex = tierHierarchy.indexOf(userTier);
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);

    return userTierIndex >= requiredTierIndex;
};

export default {
    getStripe,
    SUBSCRIPTION_TIERS,
    getPriceId,
    getPrice,
    getAnnualSavings,
    formatCurrency,
    hasFeatureAccess,
};
