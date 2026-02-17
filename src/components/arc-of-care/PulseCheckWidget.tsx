import React, { useState } from 'react';
import { Heart, Moon, Send, CheckCircle } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface PulseCheckWidgetProps {
    patientId: string;
    sessionId: number;
    onSubmit?: (data: PulseCheckData) => void;
}

interface PulseCheckData {
    connectionLevel: number; // 1-5
    sleepQuality: number; // 1-5
}

/**
 * PulseCheckWidget - Daily 2-question check-in (Mobile-optimized)
 * 
 * Ultra-fast daily assessment:
 * - "How connected do you feel?" (1-5 emoji scale)
 * - "How did you sleep?" (1-5 emoji scale)
 * 
 * Takes <10 seconds to complete
 * Triggers full PHQ-9 if 2 consecutive days <3
 */
const PulseCheckWidget: React.FC<PulseCheckWidgetProps> = ({
    patientId,
    sessionId,
    onSubmit
}) => {
    const [connectionLevel, setConnectionLevel] = useState<number | null>(null);
    const [sleepQuality, setSleepQuality] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const connectionEmojis = [
        { value: 1, emoji: '😔', label: 'Disconnected' },
        { value: 2, emoji: '😐', label: 'Low' },
        { value: 3, emoji: '🙂', label: 'Okay' },
        { value: 4, emoji: '😊', label: 'Good' },
        { value: 5, emoji: '🤩', label: 'Excellent' }
    ];

    const sleepEmojis = [
        { value: 1, emoji: '😴', label: 'Terrible' },
        { value: 2, emoji: '😐', label: 'Poor' },
        { value: 3, emoji: '🙂', label: 'Okay' },
        { value: 4, emoji: '😊', label: 'Good' },
        { value: 5, emoji: '🌟', label: 'Excellent' }
    ];

    const handleSubmit = () => {
        if (connectionLevel !== null && sleepQuality !== null) {
            const data: PulseCheckData = {
                connectionLevel,
                sleepQuality
            };

            if (onSubmit) {
                onSubmit(data);
            }

            setSubmitted(true);

            // Reset after 2 seconds
            setTimeout(() => {
                setConnectionLevel(null);
                setSleepQuality(null);
                setSubmitted(false);
            }, 2000);
        }
    };

    const isComplete = connectionLevel !== null && sleepQuality !== null;

    if (submitted) {
        return (
            <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/40 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-300">Thank you!</h3>
                    <p className="text-emerald-200">Your pulse check has been recorded.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-2">Daily Pulse Check</h2>
                <p className="text-slate-300 text-sm">Takes 5 seconds • Helps us support you better</p>
            </div>

            {/* Question 1: Connection Level */}
            <div className="mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-slate-300">How connected do you feel today?</h3>
                    <AdvancedTooltip
                        content="How connected do you feel to yourself, others, and the world? This tracks your sense of meaning and purpose."
                        type="info"
                        tier="standard"
                        side="top"
                    >
                        <div className="text-slate-300 hover:text-slate-300 cursor-help">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </AdvancedTooltip>
                </div>

                <div className="flex justify-center gap-3 md:gap-4">
                    {connectionEmojis.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setConnectionLevel(option.value)}
                            className={`
                flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all duration-200
                ${connectionLevel === option.value
                                    ? 'bg-purple-500/20 border-purple-500 scale-110'
                                    : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50 hover:scale-105'
                                }
              `}
                        >
                            <span className="text-3xl md:text-4xl">{option.emoji}</span>
                            <span className={`text-xs font-medium ${connectionLevel === option.value ? 'text-purple-300' : 'text-slate-300'
                                }`}>
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Question 2: Sleep Quality */}
            <div className="mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Moon className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-slate-300">How did you sleep last night?</h3>
                    <AdvancedTooltip
                        content="Sleep is the 'canary in the coal mine' for mental health. Declining sleep quality often precedes depression relapse by 2-3 weeks."
                        type="info"
                        tier="detailed"
                        title="Why Sleep Matters"
                        side="top"
                    >
                        <div className="text-slate-300 hover:text-slate-300 cursor-help">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </AdvancedTooltip>
                </div>

                <div className="flex justify-center gap-3 md:gap-4">
                    {sleepEmojis.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setSleepQuality(option.value)}
                            className={`
                flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all duration-200
                ${sleepQuality === option.value
                                    ? 'bg-blue-500/20 border-blue-500 scale-110'
                                    : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50 hover:scale-105'
                                }
              `}
                        >
                            <span className="text-3xl md:text-4xl">{option.emoji}</span>
                            <span className={`text-xs font-medium ${sleepQuality === option.value ? 'text-blue-300' : 'text-slate-300'
                                }`}>
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!isComplete}
                className={`
          w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-200
          ${isComplete
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-300 shadow-lg shadow-emerald-500/20 hover:scale-105'
                        : 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                    }
        `}
            >
                <Send className="w-5 h-5" />
                Submit Pulse Check
            </button>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <p className="text-blue-300 text-xs leading-relaxed text-center">
                    <span className="font-semibold">Why daily?</span> Daily pulse checks take &lt;10 seconds but provide early warning signs of destabilization. If you score &lt;3 for 2 consecutive days, we'll ask you to complete a full PHQ-9 assessment.
                </p>
            </div>
        </div>
    );
};

export default PulseCheckWidget;
