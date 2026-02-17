import React from 'react';
import { Lightbulb, ArrowRight, Clock } from 'lucide-react';

export interface NextStepsProps {
    steps: string[];
    estimatedMinutes?: number;
}

/**
 * NextSteps - Guidance for completing missing requirements
 * 
 * Shows:
 * - Numbered list of next steps
 * - Estimated time to complete
 * - Clear call-to-action
 */
export const NextSteps: React.FC<NextStepsProps> = ({
    steps,
    estimatedMinutes = 15
}) => {
    if (steps.length === 0) {
        return null;
    }

    return (
        <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-blue-300">
                        Next Steps to Reach 100%
                    </h3>
                    <p className="text-xs text-blue-400/70 mt-1">
                        {steps.length} action{steps.length !== 1 ? 's' : ''} remaining
                    </p>
                </div>
            </div>

            {/* Steps List */}
            <div className="space-y-3 mb-4">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-400">
                                {index + 1}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-300">
                                {step}
                            </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-400/50 flex-shrink-0 mt-0.5" />
                    </div>
                ))}
            </div>

            {/* Estimated Time */}
            <div className="flex items-center gap-2 text-xs text-blue-400/70 pt-4 border-t border-blue-500/20">
                <Clock className="w-3 h-3" />
                <span>Estimated time to complete: {estimatedMinutes} minutes</span>
            </div>
        </div>
    );
};
