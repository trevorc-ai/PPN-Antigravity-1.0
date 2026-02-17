/**
 * Alert Service
 * 
 * Handles push notifications and alerts for high-risk patients
 */

import type { CSSRSScore } from '../utils/cssrsScoring';

export interface SafetyAlert {
    id: string;
    patientId: string;
    type: 'cssrs' | 'phq9' | 'pcl5' | 'self_harm' | 'substance_misuse';
    severity: 'moderate' | 'high';
    score?: number;
    message: string;
    timestamp: Date;
    acknowledged: boolean;
    actions: string[];
}

/**
 * Create a safety alert
 */
export const createSafetyAlert = (
    patientId: string,
    type: SafetyAlert['type'],
    severity: SafetyAlert['severity'],
    score?: number,
    customMessage?: string
): SafetyAlert => {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    let message = customMessage || '';
    let actions: string[] = [];

    // Generate message and actions based on type
    switch (type) {
        case 'cssrs':
            message = `C-SSRS Score: ${score} (${severity === 'high' ? 'Active ideation with plan' : 'Active ideation'})`;
            actions = severity === 'high'
                ? ['Contact patient within 1 hour', 'Activate safety protocol', 'Document all interventions']
                : ['Contact patient within 24 hours', 'Activate safety protocol', 'Document all interventions'];
            break;
        case 'phq9':
            message = `PHQ-9 Score: ${score} (Severe depression)`;
            actions = ['Schedule integration session', 'Monitor closely', 'Document in patient record'];
            break;
        case 'pcl5':
            message = `PCL-5 Score: ${score} (Significant PTSD)`;
            actions = ['Trauma-informed approach required', 'Monitor closely', 'Have rescue medication available'];
            break;
        case 'self_harm':
            message = 'Self-harm behaviors reported';
            actions = ['Contact patient immediately', 'Activate safety protocol', 'Emergency contact notification'];
            break;
        case 'substance_misuse':
            message = 'Substance misuse reported';
            actions = ['Schedule integration session', 'Assess for external stressors', 'Monitor closely'];
            break;
    }

    return {
        id,
        patientId,
        type,
        severity,
        score,
        message,
        timestamp: new Date(),
        acknowledged: false,
        actions
    };
};

/**
 * Send push notification (placeholder - would integrate with notification service)
 */
export const sendPushNotification = async (alert: SafetyAlert): Promise<void> => {
    // In production, this would integrate with:
    // - Browser Push API
    // - Email service (SendGrid, AWS SES)
    // - SMS service (Twilio)
    // - In-app notification system

    console.log('🚨 PUSH NOTIFICATION:', {
        title: `HIGH RISK ALERT - Patient ${alert.patientId}`,
        body: alert.message,
        actions: alert.actions,
        timestamp: alert.timestamp
    });

    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(resolve, 100);
    });
};

/**
 * Send email notification (placeholder)
 */
export const sendEmailNotification = async (alert: SafetyAlert, recipientEmail: string): Promise<void> => {
    console.log('📧 EMAIL NOTIFICATION:', {
        to: recipientEmail,
        subject: `HIGH RISK ALERT - Patient ${alert.patientId}`,
        body: alert.message,
        actions: alert.actions
    });

    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(resolve, 100);
    });
};

/**
 * Acknowledge an alert
 */
export const acknowledgeAlert = (alert: SafetyAlert): SafetyAlert => {
    return {
        ...alert,
        acknowledged: true
    };
};

/**
 * Get all unacknowledged alerts (placeholder - would fetch from database)
 */
export const getUnacknowledgedAlerts = async (): Promise<SafetyAlert[]> => {
    // In production, this would fetch from database
    return [];
};

/**
 * Auto-trigger alert based on C-SSRS score
 */
export const autoTriggerCSSRSAlert = async (
    patientId: string,
    score: CSSRSScore
): Promise<SafetyAlert | null> => {
    // Only trigger for scores >= 3
    if (score < 3) {
        return null;
    }

    const severity = score === 5 ? 'high' : 'moderate';
    const alert = createSafetyAlert(patientId, 'cssrs', severity, score);

    // Send notifications
    await sendPushNotification(alert);

    // In production, would also:
    // - Send email to practitioner
    // - Send SMS if high severity
    // - Create in-app notification
    // - Log to database

    return alert;
};
