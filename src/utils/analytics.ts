/**
 * Analytics Utility Module
 * 
 * Centralized analytics tracking for Google Analytics 4 and Mixpanel.
 * Implements privacy-compliant event tracking with no PHI/PII.
 * 
 * @see /Users/trevorcalton/.gemini/antigravity/brain/99ae7eb8-e313-4b39-af58-8fa6624728a6/analytics_infrastructure_plan.md
 */

import ReactGA from 'react-ga4';
import mixpanel from 'mixpanel-browser';

// Environment variables (set in .env.local)
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '';
const IS_PRODUCTION = import.meta.env.PROD;

// Analytics enabled flag (disable in development unless explicitly enabled)
const ANALYTICS_ENABLED = IS_PRODUCTION || import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

/**
 * User properties tracked on every event
 */
export interface UserProperties {
    user_id?: string;
    user_role?: 'solo' | 'clinic' | 'research';
    site_id?: string;
    account_age_days?: number;
    protocols_logged_total?: number;
    plan_tier?: 'solo' | 'clinic' | 'enterprise';
    team_size?: number;
    device_type?: 'desktop' | 'mobile' | 'tablet';
}

/**
 * Initialize analytics services
 * Call this once on app startup
 */
export const initAnalytics = (): void => {
    if (!ANALYTICS_ENABLED) {
        console.log('[Analytics] Disabled in development mode');
        return;
    }

    // Initialize Google Analytics 4
    if (GA4_MEASUREMENT_ID) {
        ReactGA.initialize(GA4_MEASUREMENT_ID, {
            gaOptions: {
                anonymizeIp: true, // GDPR compliance
            },
        });
        console.log('[Analytics] GA4 initialized');
    } else {
        console.warn('[Analytics] GA4 Measurement ID not found');
    }

    // Initialize Mixpanel
    if (MIXPANEL_TOKEN) {
        mixpanel.init(MIXPANEL_TOKEN, {
            debug: !IS_PRODUCTION,
            track_pageview: false, // We'll track manually
            persistence: 'localStorage',
            ip: false, // Don't track IP addresses (privacy)
        });
        console.log('[Analytics] Mixpanel initialized');
    } else {
        console.warn('[Analytics] Mixpanel token not found');
    }
};

/**
 * Track page views
 * Call this on route changes
 */
export const trackPageView = (path: string, title?: string): void => {
    if (!ANALYTICS_ENABLED) return;

    const pageData = {
        page_path: path,
        page_title: title || document.title,
    };

    // GA4
    ReactGA.send({ hitType: 'pageview', ...pageData });

    // Mixpanel
    mixpanel.track('page_view', pageData);
};

/**
 * Track custom events
 * 
 * @param eventName - Event name (e.g., 'signup_completed', 'protocol_logged')
 * @param properties - Event properties (must not contain PHI/PII)
 */
export const trackEvent = (
    eventName: string,
    properties?: Record<string, any>
): void => {
    if (!ANALYTICS_ENABLED) return;

    // Privacy check: warn if potentially sensitive data detected
    if (properties && process.env.NODE_ENV !== 'production') {
        const sensitiveKeys = ['name', 'email', 'phone', 'dob', 'mrn', 'address'];
        const foundSensitive = Object.keys(properties).filter(key =>
            sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))
        );
        if (foundSensitive.length > 0) {
            console.error(
                `[Analytics] WARNING: Potentially sensitive data detected in event properties: ${foundSensitive.join(', ')}`
            );
        }
    }

    // GA4
    ReactGA.event({
        category: 'User',
        action: eventName,
        ...properties,
    });

    // Mixpanel
    mixpanel.track(eventName, properties);
};

/**
 * Identify user and set user properties
 * Call this after login/signup
 * 
 * @param userId - System-generated UUID (NOT email or name)
 * @param properties - User properties (must be de-identified)
 */
export const identifyUser = (
    userId: string,
    properties?: UserProperties
): void => {
    if (!ANALYTICS_ENABLED) return;

    // GA4
    ReactGA.set({ userId });

    // Mixpanel
    mixpanel.identify(userId);
    if (properties) {
        mixpanel.people.set(properties);
    }
};

/**
 * Reset user identity (call on logout)
 */
export const resetUser = (): void => {
    if (!ANALYTICS_ENABLED) return;

    // GA4 - clear user ID
    ReactGA.set({ userId: undefined });

    // Mixpanel - reset identity
    mixpanel.reset();
};

/**
 * Track timing events (e.g., time to first protocol)
 * 
 * @param category - Timing category (e.g., 'Activation')
 * @param variable - Timing variable (e.g., 'time_to_first_protocol')
 * @param value - Time in milliseconds
 */
export const trackTiming = (
    category: string,
    variable: string,
    value: number
): void => {
    if (!ANALYTICS_ENABLED) return;

    // GA4
    ReactGA.event({
        category: 'Timing',
        action: variable,
        value: Math.round(value),
        label: category,
    });

    // Mixpanel
    mixpanel.track('timing', {
        category,
        variable,
        value_ms: value,
        value_seconds: Math.round(value / 1000),
    });
};

// ============================================================================
// Pre-defined Event Tracking Functions (P0 Events)
// ============================================================================

/**
 * ACQUISITION EVENTS
 */

export const trackSignupStarted = (sourcePage: string, utmParams?: Record<string, string>) => {
    trackEvent('signup_started', {
        source_page: sourcePage,
        ...utmParams,
    });
};

export const trackSignupCompleted = (
    userId: string,
    userRole: string,
    signupMethod: string,
    timeToSignup: number
) => {
    trackEvent('signup_completed', {
        user_id: userId,
        user_role: userRole,
        signup_method: signupMethod,
        time_to_signup: Math.round(timeToSignup / 1000), // seconds
    });
};

export const trackCTAClicked = (ctaText: string, ctaLocation: string, pagePath: string) => {
    trackEvent('cta_clicked', {
        cta_text: ctaText,
        cta_location: ctaLocation,
        page_path: pagePath,
    });
};

/**
 * ACTIVATION EVENTS
 */

export const trackFirstLogin = (userId: string, userRole: string, timeSinceSignup: number) => {
    trackEvent('first_login', {
        user_id: userId,
        user_role: userRole,
        time_since_signup: Math.round(timeSinceSignup / 1000 / 60), // minutes
    });
};

export const trackProtocolBuilderOpened = (userId: string, sourcePage: string) => {
    trackEvent('protocol_builder_opened', {
        user_id: userId,
        source_page: sourcePage,
    });
};

export const trackFirstProtocolLogged = (
    userId: string,
    substanceId: number,
    indicationId: number,
    timeSinceSignup: number,
    timeSinceFirstLogin: number
) => {
    trackEvent('first_protocol_logged', {
        user_id: userId,
        substance_id: substanceId,
        indication_id: indicationId,
        time_since_signup: Math.round(timeSinceSignup / 1000 / 60 / 60), // hours
        time_since_first_login: Math.round(timeSinceFirstLogin / 1000 / 60), // minutes
    });
};

/**
 * RETENTION EVENTS
 */

export const trackLogin = (userId: string, daysSinceLastLogin: number, loginCount: number) => {
    trackEvent('login', {
        user_id: userId,
        days_since_last_login: daysSinceLastLogin,
        login_count: loginCount,
    });
};

export const trackProtocolLogged = (
    userId: string,
    substanceId: number,
    indicationId: number,
    protocolCount: number
) => {
    trackEvent('protocol_logged', {
        user_id: userId,
        substance_id: substanceId,
        indication_id: indicationId,
        protocol_count: protocolCount,
    });
};

export const trackSafetyAlertViewed = (
    userId: string,
    alertType: string,
    severity: 'SEVERE' | 'MODERATE' | 'MILD'
) => {
    trackEvent('safety_alert_viewed', {
        user_id: userId,
        alert_type: alertType,
        severity,
    });
};

/**
 * BUSINESS EVENTS
 */

export const trackSubscriptionStarted = (
    userId: string,
    planTier: string,
    billingFrequency: 'monthly' | 'annual',
    amount: number
) => {
    trackEvent('subscription_started', {
        user_id: userId,
        plan_tier: planTier,
        billing_frequency: billingFrequency,
        amount,
    });
};

export const trackTrialStarted = (userId: string, planTier: string, trialDuration: number) => {
    trackEvent('trial_started', {
        user_id: userId,
        plan_tier: planTier,
        trial_duration: trialDuration,
    });
};

export const trackTrialConverted = (userId: string, planTier: string, daysInTrial: number) => {
    trackEvent('trial_converted', {
        user_id: userId,
        plan_tier: planTier,
        days_in_trial: daysInTrial,
    });
};

/**
 * Export analytics object for convenience
 */
export const analytics = {
    init: initAnalytics,
    pageView: trackPageView,
    event: trackEvent,
    identify: identifyUser,
    reset: resetUser,
    timing: trackTiming,

    // Pre-defined events
    signupStarted: trackSignupStarted,
    signupCompleted: trackSignupCompleted,
    ctaClicked: trackCTAClicked,
    firstLogin: trackFirstLogin,
    protocolBuilderOpened: trackProtocolBuilderOpened,
    firstProtocolLogged: trackFirstProtocolLogged,
    login: trackLogin,
    protocolLogged: trackProtocolLogged,
    safetyAlertViewed: trackSafetyAlertViewed,
    subscriptionStarted: trackSubscriptionStarted,
    trialStarted: trackTrialStarted,
    trialConverted: trackTrialConverted,
};

export default analytics;
