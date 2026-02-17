import React from 'react';
import { Shield, Download } from 'lucide-react';
import { getRiskIcon, type CSSRSScore } from '../../utils/cssrsScoring';

export interface SafetyEvent {
    id: string;
    date: string;
    cssrsScore: CSSRSScore;
    actionsTaken: string[];
}

export interface SafetyTimelineProps {
    events: SafetyEvent[];
    patientId?: string;
    onExport?: () => void;
}

/**
 * SafetyTimeline - Chronological view of safety checks
 * 
 * Features:
 * - Chronological list of all safety checks
 * - Color-coded by severity (red/yellow/green)
 * - Shows actions taken for each event
 * - Export as PDF for audit
 */
export const SafetyTimeline: React.FC<SafetyTimelineProps> = ({
    events,
    patientId,
    onExport
}) => {
    const getRiskLevel = (score: CSSRSScore): 'high' | 'moderate' | 'low' => {
        if (score === 5) return 'high';
        if (score >= 3) return 'moderate';
        return 'low';
    };

    const getRiskColor = (score: CSSRSScore): string => {
        const level = getRiskLevel(score);
        switch (level) {
            case 'high':
                return 'text-red-400';
            case 'moderate':
                return 'text-yellow-400';
            case 'low':
                return 'text-emerald-400';
        }
    };

    const getRiskBgColor = (score: CSSRSScore): string => {
        const level = getRiskLevel(score);
        switch (level) {
            case 'high':
                return 'bg-red-500/10 border-red-500/30';
            case 'moderate':
                return 'bg-yellow-500/10 border-yellow-500/30';
            case 'low':
                return 'bg-emerald-500/10 border-emerald-500/30';
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Shield className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-300">
                            🛡️ Safety Event Timeline
                        </h3>
                        {patientId && (
                            <p className="text-xs text-slate-500 mt-1">
                                Patient: {patientId}
                            </p>
                        )}
                    </div>
                </div>

                {/* Export Button */}
                {onExport && (
                    <button
                        onClick={onExport}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export Safety Report</span>
                    </button>
                )}
            </div>

            {/* Timeline Events */}
            {events.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-slate-400">No safety checks recorded yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map((event, index) => (
                        <div
                            key={event.id}
                            className={`p-4 rounded-lg border ${getRiskBgColor(event.cssrsScore)}`}
                        >
                            {/* Event Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{getRiskIcon(getRiskLevel(event.cssrsScore))}</span>
                                    <div>
                                        <p className={`font-semibold ${getRiskColor(event.cssrsScore)}`}>
                                            C-SSRS: {event.cssrsScore} ({getRiskLevel(event.cssrsScore).toUpperCase()} Risk)
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {formatDate(event.date)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Taken */}
                            {event.actionsTaken.length > 0 && (
                                <div className="pl-11">
                                    <p className="text-xs text-slate-400 mb-2">
                                        <strong className="text-slate-300">Actions:</strong>
                                    </p>
                                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                                        {event.actionsTaken.map((action, actionIndex) => (
                                            <li key={actionIndex}>{action}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {event.actionsTaken.length === 0 && (
                                <div className="pl-11">
                                    <p className="text-xs text-slate-400">
                                        ↳ No actions needed
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Summary */}
            {events.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-emerald-400">
                                {events.filter(e => getRiskLevel(e.cssrsScore) === 'low').length}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Low Risk</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-yellow-400">
                                {events.filter(e => getRiskLevel(e.cssrsScore) === 'moderate').length}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Moderate Risk</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-400">
                                {events.filter(e => getRiskLevel(e.cssrsScore) === 'high').length}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">High Risk</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
