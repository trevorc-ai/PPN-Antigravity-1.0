import React, { useState } from 'react';
import { AlertTriangle, Save, CheckCircle } from 'lucide-react';
import { getCSSRSAssessment, getRiskMitigationActions, getRiskColor, getRiskBgColor, getRiskIcon, type CSSRSScore } from '../../utils/cssrsScoring';

export interface SafetyCheckFormData {
    checkInDate: string;
    cssrsScore: CSSRSScore;
    safetyConcerns: string[];
    actionsTaken: string[];
}

export interface StructuredSafetyCheckProps {
    patientId?: string;
    onSubmit?: (data: SafetyCheckFormData) => void;
    onScoreChange?: (score: CSSRSScore) => void;
}

const SAFETY_CONCERNS = [
    'Suicidal ideation',
    'Self-harm behaviors',
    'Substance misuse',
    'Psychotic symptoms'
];

const ACTIONS_TAKEN = [
    'Emergency contact notified',
    'Safety plan created',
    'Follow-up scheduled (24 hours)',
    'Rescue medication provided',
    'Integration session scheduled'
];

/**
 * StructuredSafetyCheck - C-SSRS screening form
 * 
 * Features:
 * - C-SSRS score selection (0-5)
 * - Safety concerns checklist
 * - Actions taken checklist
 * - Auto-flagging for scores >= 3
 * - Real-time risk assessment display
 */
export const StructuredSafetyCheck: React.FC<StructuredSafetyCheckProps> = ({
    patientId,
    onSubmit,
    onScoreChange
}) => {
    const [formData, setFormData] = useState<SafetyCheckFormData>({
        checkInDate: new Date().toISOString().split('T')[0],
        cssrsScore: 0,
        safetyConcerns: [],
        actionsTaken: []
    });

    const [submitted, setSubmitted] = useState(false);

    const assessment = getCSSRSAssessment(formData.cssrsScore);
    const riskMitigationActions = getRiskMitigationActions(formData.cssrsScore);
    const isHighRisk = formData.cssrsScore >= 3;

    const handleScoreChange = (score: CSSRSScore) => {
        setFormData(prev => ({ ...prev, cssrsScore: score }));
        onScoreChange?.(score);
    };

    const toggleConcern = (concern: string) => {
        setFormData(prev => ({
            ...prev,
            safetyConcerns: prev.safetyConcerns.includes(concern)
                ? prev.safetyConcerns.filter(c => c !== concern)
                : [...prev.safetyConcerns, concern]
        }));
    };

    const toggleAction = (action: string) => {
        setFormData(prev => ({
            ...prev,
            actionsTaken: prev.actionsTaken.includes(action)
                ? prev.actionsTaken.filter(a => a !== action)
                : [...prev.actionsTaken, action]
        }));
    };

    const handleSubmit = () => {
        onSubmit?.(formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg ${isHighRisk ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                    <AlertTriangle className={`w-6 h-6 ${isHighRisk ? 'text-red-400' : 'text-blue-400'}`} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-300">
                        🚨 Structured Safety Check
                    </h3>
                    {patientId && (
                        <p className="text-sm text-slate-500 mt-1">
                            Patient: {patientId}
                        </p>
                    )}
                </div>
            </div>

            {/* Check-In Date */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Check-In Date:
                </label>
                <input
                    type="date"
                    value={formData.checkInDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, checkInDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* C-SSRS Screening */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                    C-SSRS Screening:
                </label>
                <div className="space-y-2">
                    {([0, 1, 2, 3, 4, 5] as CSSRSScore[]).map((score) => {
                        const scoreAssessment = getCSSRSAssessment(score);
                        const isSelected = formData.cssrsScore === score;

                        return (
                            <label
                                key={score}
                                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${isSelected
                                    ? getRiskBgColor(scoreAssessment.riskLevel) + ' border-2'
                                    : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="cssrsScore"
                                    value={score}
                                    checked={isSelected}
                                    onChange={() => handleScoreChange(score)}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{getRiskIcon(scoreAssessment.riskLevel)}</span>
                                        <span className={`font-semibold ${isSelected ? getRiskColor(scoreAssessment.riskLevel) : 'text-slate-300'}`}>
                                            {scoreAssessment.label} (Score: {score})
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {scoreAssessment.description}
                                    </p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* High Risk Warning */}
            {isHighRisk && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 font-bold text-sm mb-2">
                        ⚠️ HIGH RISK DETECTED
                    </p>
                    <p className="text-sm text-red-400">
                        This patient requires immediate attention and safety protocol activation.
                    </p>
                </div>
            )}

            {/* Safety Concerns */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Safety Concerns:
                </label>
                <div className="space-y-2">
                    {SAFETY_CONCERNS.map((concern) => (
                        <label
                            key={concern}
                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 cursor-pointer transition-all"
                        >
                            <input
                                type="checkbox"
                                checked={formData.safetyConcerns.includes(concern)}
                                onChange={() => toggleConcern(concern)}
                            />
                            <span className="text-sm text-slate-300">{concern}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Actions Taken */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Actions Taken:
                </label>
                <div className="space-y-2">
                    {ACTIONS_TAKEN.map((action) => (
                        <label
                            key={action}
                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 cursor-pointer transition-all"
                        >
                            <input
                                type="checkbox"
                                checked={formData.actionsTaken.includes(action)}
                                onChange={() => toggleAction(action)}
                            />
                            <span className="text-sm text-slate-300">{action}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Risk Mitigation Actions */}
            {formData.cssrsScore > 0 && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 font-semibold text-sm mb-2">
                        Risk Mitigation Strategies:
                    </p>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {riskMitigationActions.map((action, index) => (
                            <li key={index}>{action}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${submitted
                    ? 'bg-emerald-600 text-slate-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-slate-300'
                    }`}
            >
                {submitted ? (
                    <>
                        <CheckCircle className="w-5 h-5" />
                        Safety Check Submitted
                    </>
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        Submit Safety Check
                    </>
                )}
            </button>
        </div>
    );
};
