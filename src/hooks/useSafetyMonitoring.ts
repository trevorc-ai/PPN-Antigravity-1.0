import { useState, useEffect } from 'react';
import { autoTriggerCSSRSAlert, type SafetyAlert } from '../services/alertService';
import type { CSSRSScore } from '../utils/cssrsScoring';

export interface SafetyCheckData {
    cssrsScore?: CSSRSScore;
    safetyConcerns?: string[];
    actionsTaken?: string[];
}

export interface SafetyMonitoringResult {
    alerts: SafetyAlert[];
    hasHighRiskAlert: boolean;
    hasModerateRiskAlert: boolean;
    addAlert: (alert: SafetyAlert) => void;
    acknowledgeAlert: (alertId: string) => void;
}

/**
 * Hook for monitoring patient safety and managing alerts
 */
export const useSafetyMonitoring = (patientId: string): SafetyMonitoringResult => {
    const [alerts, setAlerts] = useState<SafetyAlert[]>([]);

    // Auto-trigger alerts based on C-SSRS score
    const handleCSSRSScore = async (score: CSSRSScore) => {
        const alert = await autoTriggerCSSRSAlert(patientId, score);
        if (alert) {
            setAlerts(prev => [...prev, alert]);
        }
    };

    // Add alert manually
    const addAlert = (alert: SafetyAlert) => {
        setAlerts(prev => [...prev, alert]);
    };

    // Acknowledge alert
    const acknowledgeAlert = (alertId: string) => {
        setAlerts(prev =>
            prev.map(alert =>
                alert.id === alertId
                    ? { ...alert, acknowledged: true }
                    : alert
            )
        );
    };

    const hasHighRiskAlert = alerts.some(a => a.severity === 'high' && !a.acknowledged);
    const hasModerateRiskAlert = alerts.some(a => a.severity === 'moderate' && !a.acknowledged);

    return {
        alerts,
        hasHighRiskAlert,
        hasModerateRiskAlert,
        addAlert,
        acknowledgeAlert
    };
};
