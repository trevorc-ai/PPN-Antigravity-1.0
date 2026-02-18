import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, AlertCircle, Info, CheckCircle, X } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface RedAlertPanelProps {
    patientId: string;
    alerts: RedAlert[];
    onAcknowledge?: (alertId: number) => void;
    onResolve?: (alertId: number, notes: string) => void;
}

interface RedAlert {
    id: number;
    alertType: 'cssrs_spike' | 'phq9_regression' | 'pulse_drop' | 'psqi_decline' | 'missed_assessments';
    severity: 'low' | 'moderate' | 'high' | 'critical';
    triggeredAt: string;
    message: string;
    triggerValue?: any;
    isAcknowledged: boolean;
    isResolved: boolean;
}

/**
 * RedAlertPanel - Automated safety alerts
 * 
 * Displays critical patient safety alerts:
 * 1. C-SSRS spike (score >3) → CRITICAL
 * 2. PHQ-9 regression (>5 point increase) → HIGH
 * 3. Pulse check drop (2 consecutive days <3) → MODERATE
 * 4. PSQI decline (>3 point increase) → MODERATE
 * 5. Missed assessments (3+ consecutive days) → LOW
 * 
 * Requires clinician acknowledgment and resolution
 */
// PHI-Safe: Predefined resolution actions (controlled vocabulary)
const RESOLUTION_ACTIONS = [
    'Contacted patient - situation resolved',
    'Referred to crisis services',
    'Updated safety plan with patient',
    'Medication adjustment made',
    'Additional therapy session scheduled',
    'False alarm - patient stable',
    'Family/support person contacted',
    'Increased monitoring frequency',
    'Scheduled urgent clinical assessment'
];

const RedAlertPanel: React.FC<RedAlertPanelProps> = ({
    patientId,
    alerts,
    onAcknowledge,
    onResolve
}) => {
    const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
    const [selectedResolution, setSelectedResolution] = useState('');

    const getAlertConfig = (alertType: string) => {
        switch (alertType) {
            case 'cssrs_spike':
                return {
                    icon: ShieldAlert,
                    label: 'Suicide Risk',
                    tooltip: 'Columbia Suicide Severity Rating Scale score >3 indicates moderate-high suicide risk. IMMEDIATE clinician contact required. Do not delay.',
                    color: 'red'
                };
            case 'phq9_regression':
                return {
                    icon: AlertTriangle,
                    label: 'Depression Worsening',
                    tooltip: 'A >5 point increase in PHQ-9 score indicates significant symptom worsening. Schedule urgent check-in to assess need for intervention.',
                    color: 'orange'
                };
            case 'pulse_drop':
                return {
                    icon: AlertCircle,
                    label: 'Connection Drop',
                    tooltip: 'Two consecutive days with connection level <3 may indicate early destabilization. Trigger full PHQ-9 assessment to investigate.',
                    color: 'amber'
                };
            case 'psqi_decline':
                return {
                    icon: AlertCircle,
                    label: 'Sleep Decline',
                    tooltip: 'Sleep quality decline often precedes depression relapse by 2-3 weeks. Early intervention recommended.',
                    color: 'amber'
                };
            case 'missed_assessments':
                return {
                    icon: Info,
                    label: 'Missed Check-ins',
                    tooltip: 'Patient has missed 3+ consecutive assessments. Reach out to ensure engagement and address barriers.',
                    color: 'blue'
                };
            default:
                return {
                    icon: AlertCircle,
                    label: 'Alert',
                    tooltip: '',
                    color: 'slate'
                };
        }
    };

    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case 'critical':
                return { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-300', badge: 'bg-red-500 text-slate-300' };
            case 'high':
                return { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-300', badge: 'bg-orange-500 text-slate-300' };
            case 'moderate':
                return { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-300', badge: 'bg-amber-500 text-slate-300' };
            case 'low':
                return { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-300', badge: 'bg-blue-500 text-slate-300' };
            default:
                return { bg: 'bg-slate-500/20', border: 'border-slate-500/40', text: 'text-slate-300', badge: 'bg-slate-500 text-slate-300' };
        }
    };

    const handleAcknowledge = (alertId: number) => {
        if (onAcknowledge) {
            onAcknowledge(alertId);
        }
    };

    const handleResolve = (alertId: number) => {
        if (onResolve && selectedResolution) {
            onResolve(alertId, selectedResolution);
            setSelectedAlert(null);
            setSelectedResolution('');
        }
    };

    // Filter active alerts (not resolved)
    const activeAlerts = alerts.filter(a => !a.isResolved);
    const resolvedAlerts = alerts.filter(a => a.isResolved);

    if (alerts.length === 0) {
        return (
            <div className="bg-emerald-900/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8">
                <div className="text-center space-y-3">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="text-xl font-semibold text-emerald-300">All Clear</h3>
                    <p className="text-emerald-200 text-sm">No active safety alerts for this patient.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Active Alerts */}
            {activeAlerts.length > 0 && (
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <h3 className="text-slate-300 font-semibold text-lg">Active Alerts ({activeAlerts.length})</h3>
                    </div>

                    <div className="space-y-3">
                        {activeAlerts.map((alert) => {
                            const config = getAlertConfig(alert.alertType);
                            const severity = getSeverityConfig(alert.severity);
                            const Icon = config.icon;
                            const isExpanded = selectedAlert === alert.id;

                            return (
                                <div key={alert.id} className={`border rounded-xl ${severity.bg} ${severity.border}`}>
                                    <div className="p-4">
                                        <div className="flex items-start gap-3">
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${severity.bg} border ${severity.border} flex items-center justify-center`}>
                                                <Icon className={`w-5 h-5 ${severity.text}`} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <AdvancedTooltip
                                                            content={config.tooltip}
                                                            type="warning"
                                                            tier="detailed"
                                                            title={config.label}
                                                            side="top"
                                                        >
                                                            <span className={`text-sm font-semibold ${severity.text} cursor-help`}>
                                                                {config.label}
                                                            </span>
                                                        </AdvancedTooltip>
                                                        <span className={`text-xs px-2 py-1 rounded font-medium ${severity.badge}`}>
                                                            {alert.severity.toUpperCase()}
                                                        </span>
                                                        {alert.isAcknowledged && (
                                                            <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                                Acknowledged
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-slate-500 flex-shrink-0">
                                                        {new Date(alert.triggeredAt).toLocaleString()}
                                                    </span>
                                                </div>

                                                <p className={`text-sm ${severity.text} mb-3`}>
                                                    {alert.message}
                                                </p>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    {!alert.isAcknowledged && (
                                                        <button
                                                            onClick={() => handleAcknowledge(alert.id)}
                                                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-slate-300 text-xs font-medium rounded transition-colors"
                                                        >
                                                            Acknowledge
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setSelectedAlert(isExpanded ? null : alert.id)}
                                                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${isExpanded
                                                            ? 'bg-slate-700 text-slate-300'
                                                            : 'bg-emerald-500 hover:bg-emerald-600 text-slate-300'
                                                            }`}
                                                    >
                                                        {isExpanded ? 'Cancel' : 'Resolve'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>


                                        {/* Resolution Form - PHI SAFE */}
                                        {isExpanded && (
                                            <div className="mt-4 pt-4 border-t border-slate-700/30">
                                                {/* PHI Safety Notice */}
                                                <div className="flex items-start gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-3">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-emerald-300 text-sm">
                                                        <strong>PHI-Safe:</strong> Select from predefined resolution actions only.
                                                    </p>
                                                </div>

                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Resolution Action
                                                </label>
                                                <select
                                                    value={selectedResolution}
                                                    onChange={(e) => setSelectedResolution(e.target.value)}
                                                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                >
                                                    <option value="">Select resolution action...</option>
                                                    {RESOLUTION_ACTIONS.map((action) => (
                                                        <option key={action} value={action}>
                                                            {action}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleResolve(alert.id)}
                                                    disabled={!selectedResolution}
                                                    className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedResolution
                                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-300'
                                                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Mark as Resolved
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Resolved Alerts (Collapsed) */}
            {resolvedAlerts.length > 0 && (
                <details className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <summary className="cursor-pointer text-slate-300 text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Resolved Alerts ({resolvedAlerts.length})
                    </summary>
                    <div className="mt-4 space-y-2">
                        {resolvedAlerts.map((alert) => {
                            const config = getAlertConfig(alert.alertType);
                            return (
                                <div key={alert.id} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-300">{config.label}</span>
                                        <span className="text-xs text-slate-500">
                                            {new Date(alert.triggeredAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </details>
            )}
        </div>
    );
};

export default RedAlertPanel;
