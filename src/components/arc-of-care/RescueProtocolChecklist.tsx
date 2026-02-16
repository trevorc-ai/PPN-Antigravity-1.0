import React, { useState } from 'react';
import { Shield, MessageCircle, Wind, Hand, Pill, CheckCircle } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface RescueProtocolChecklistProps {
    sessionId: number;
    onInterventionUsed?: (interventionCode: string) => void;
}

interface RescueProtocol {
    code: string;
    name: string;
    category: 'verbal' | 'physical' | 'chemical' | 'environmental';
    description: string;
    tooltipContent: string;
    icon: React.ComponentType<{ className?: string }>;
}

/**
 * RescueProtocolChecklist - Intervention tracking
 * 
 * Checklist of rescue interventions:
 * - Verbal de-escalation
 * - Breathing techniques
 * - Physical touch (hand-holding)
 * - Environment adjustment
 * - Chemical rescue (Lorazepam, Propranolol)
 * 
 * Tracks which interventions have been used
 */
const RescueProtocolChecklist: React.FC<RescueProtocolChecklistProps> = ({
    sessionId,
    onInterventionUsed
}) => {
    const [usedInterventions, setUsedInterventions] = useState<Set<string>>(new Set());

    const protocols: RescueProtocol[] = [
        {
            code: 'VERBAL_REASSURANCE',
            name: 'Verbal De-escalation',
            category: 'verbal',
            description: 'Calm, reassuring voice',
            tooltipContent: 'Calm, reassuring voice. Remind patient they are safe and the experience is temporary. Effective for mild-moderate anxiety.',
            icon: MessageCircle
        },
        {
            code: 'BREATHING_TECHNIQUE',
            name: 'Breathing Techniques',
            category: 'verbal',
            description: 'Guided deep breathing (4-7-8)',
            tooltipContent: 'Guided deep breathing (4-7-8 technique). Activates parasympathetic nervous system to reduce anxiety.',
            icon: Wind
        },
        {
            code: 'PHYSICAL_TOUCH',
            name: 'Physical Touch',
            category: 'physical',
            description: 'Hand-holding (with consent)',
            tooltipContent: 'Hand-holding or shoulder touch (with consent). Provides grounding and reassurance. Effective for dissociation.',
            icon: Hand
        },
        {
            code: 'ENVIRONMENT_ADJUST',
            name: 'Environment Adjustment',
            category: 'environmental',
            description: 'Lighting/music adjustment',
            tooltipContent: 'Adjust lighting (dimmer), music (calmer), or temperature. Environmental changes can significantly reduce distress.',
            icon: Shield
        },
        {
            code: 'CHEMICAL_BENZO',
            name: 'Chemical Rescue (Lorazepam)',
            category: 'chemical',
            description: 'Lorazepam 1mg sublingual',
            tooltipContent: 'Lorazepam 1mg sublingual. Use only for severe panic or uncontrollable anxiety. Will abort the psychedelic experience. Document reason for use.',
            icon: Pill
        },
        {
            code: 'CHEMICAL_PROPRANOLOL',
            name: 'Chemical Rescue (Propranolol)',
            category: 'chemical',
            description: 'Propranolol 20mg',
            tooltipContent: 'Propranolol 20mg. Beta-blocker for physical anxiety symptoms (rapid heart rate, tremor). Does not abort experience.',
            icon: Pill
        }
    ];

    const handleToggle = (code: string) => {
        const newUsed = new Set(usedInterventions);
        if (newUsed.has(code)) {
            newUsed.delete(code);
        } else {
            newUsed.add(code);
            if (onInterventionUsed) {
                onInterventionUsed(code);
            }
        }
        setUsedInterventions(newUsed);
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'verbal':
                return 'blue';
            case 'physical':
                return 'purple';
            case 'environmental':
                return 'emerald';
            case 'chemical':
                return 'red';
            default:
                return 'slate';
        }
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="text-slate-200 font-semibold">Rescue Protocol</h3>
            </div>

            <div className="space-y-2">
                {protocols.map((protocol) => {
                    const isUsed = usedInterventions.has(protocol.code);
                    const color = getCategoryColor(protocol.category);
                    const Icon = protocol.icon;

                    return (
                        <AdvancedTooltip
                            key={protocol.code}
                            content={protocol.tooltipContent}
                            type={protocol.category === 'chemical' ? 'warning' : 'info'}
                            tier="detailed"
                            title={protocol.name}
                            side="right"
                        >
                            <button
                                onClick={() => handleToggle(protocol.code)}
                                className={`
                  w-full p-3 rounded-lg border transition-all duration-200 text-left
                  ${isUsed
                                        ? `bg-${color}-500/20 border-${color}-500/40`
                                        : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50'
                                    }
                `}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Checkbox */}
                                    <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${isUsed
                                            ? `bg-${color}-500 border-${color}-500`
                                            : 'border-slate-600'
                                        }
                  `}>
                                        {isUsed && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>

                                    {/* Icon */}
                                    <Icon className={`w-4 h-4 ${isUsed ? `text-${color}-400` : 'text-slate-400'}`} />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-medium ${isUsed ? `text-${color}-300` : 'text-slate-300'}`}>
                                            {protocol.name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {protocol.description}
                                        </div>
                                    </div>

                                    {/* Category badge */}
                                    <span className={`
                    text-xs px-2 py-1 rounded capitalize
                    ${isUsed
                                            ? `bg-${color}-500/20 text-${color}-400 border border-${color}-500/30`
                                            : 'bg-slate-700/30 text-slate-500'
                                        }
                  `}>
                                        {protocol.category}
                                    </span>
                                </div>
                            </button>
                        </AdvancedTooltip>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-slate-700/30">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Interventions Used:</span>
                    <span className="text-slate-200 font-semibold">{usedInterventions.size} / {protocols.length}</span>
                </div>
            </div>
        </div>
    );
};

export default RescueProtocolChecklist;
