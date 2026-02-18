import React from 'react';
import { AlertTriangle, Phone, FileText, CheckCircle } from 'lucide-react';
import type { SafetyAlert as SafetyAlertType } from '../../services/alertService';

export interface SafetyAlertProps {
    alert: SafetyAlertType;
    onAcknowledge?: (alertId: string) => void;
    onContactPatient?: (patientId: string) => void;
    onViewSafetyPlan?: (patientId: string) => void;
    onDocumentIntervention?: (patientId: string) => void;
}

/**
 * SafetyAlert - High-risk alert notification
 * 
 * Features:
 * - Displays alert details (patient, score, message)
 * - Shows immediate actions required
 * - Action buttons (Contact, View Safety Plan, Document)
 * - Acknowledge button
 */
export const SafetyAlert: React.FC<SafetyAlertProps> = ({
    alert,
    onAcknowledge,
    onContactPatient,
    onViewSafetyPlan,
    onDocumentIntervention
}) => {
    const isHighRisk = alert.severity === 'high';

    return (
        <div className={`p-6 rounded-2xl border-2 ${isHighRisk
                ? 'bg-red-500/10 border-red-500/50'
                : 'bg-yellow-500/10 border-yellow-500/50'
            }`}>
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${isHighRisk ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                    <AlertTriangle className={`w-6 h-6 ${isHighRisk ? 'text-red-400' : 'text-yellow-400'}`} />
                </div>
                <div className="flex-1">
                    <h3 className={`text-lg font-bold ${isHighRisk ? 'text-red-300' : 'text-yellow-300'}`}>
                        🚨 {isHighRisk ? 'HIGH RISK ALERT' : 'MODERATE RISK ALERT'}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        Patient {alert.patientId} flagged for:
                    </p>
                </div>
                {alert.acknowledged && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-emerald-300 font-semibold">Acknowledged</span>
                    </div>
                )}
            </div>

            {/* Alert Details */}
            <div className="mb-4 p-4 bg-slate-900/50 rounded-lg">
                <p className={`font-semibold ${isHighRisk ? 'text-red-300' : 'text-yellow-300'}`}>
                    {alert.message}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                    Logged: {alert.timestamp.toLocaleString()}
                </p>
            </div>

            {/* Immediate Actions Required */}
            <div className="mb-4">
                <p className="text-sm font-semibold text-slate-300 mb-2">
                    Immediate Actions Required:
                </p>
                <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                    {alert.actions.map((action, index) => (
                        <li key={index}>{action}</li>
                    ))}
                </ol>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                    onClick={() => onContactPatient?.(alert.patientId)}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Phone className="w-4 h-4" />
                    Contact Patient
                </button>

                <button
                    onClick={() => onViewSafetyPlan?.(alert.patientId)}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <FileText className="w-4 h-4" />
                    View Safety Plan
                </button>

                <button
                    onClick={() => onDocumentIntervention?.(alert.patientId)}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <FileText className="w-4 h-4" />
                    Document Intervention
                </button>
            </div>

            {/* Acknowledge Button */}
            {!alert.acknowledged && onAcknowledge && (
                <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="w-full mt-4 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-slate-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <CheckCircle className="w-5 h-5" />
                    Acknowledge Alert
                </button>
            )}
        </div>
    );
};
