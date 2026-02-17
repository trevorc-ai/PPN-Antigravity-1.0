import React, { useState } from 'react';
import { Plus, FileText, Activity, AlertCircle, CheckSquare } from 'lucide-react';

/**
 * QuickActionsMenu - Context-Aware FAB for Fast Form Access
 * 
 * Features:
 * - Fixed bottom-right position
 * - 56px diameter (mobile-friendly tap target)
 * - Context-aware actions based on current phase
 * - Bottom sheet (mobile) or floating menu (desktop)
 * - Haptic feedback on tap
 * - WCAG 2.1 AAA compliant
 */

interface QuickAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    formId: string;
}

interface QuickActionsMenuProps {
    currentPhase: 'phase1' | 'phase2' | 'phase3' | 'ongoing';
    onActionSelect: (formId: string) => void;
}

// Context-aware actions by phase
const PHASE_ACTIONS: Record<string, QuickAction[]> = {
    phase1: [
        { id: 'baseline', label: 'Complete Baseline Assessment', icon: <FileText className="w-5 h-5" />, formId: 'mental-health' },
        { id: 'consent', label: 'Get Informed Consent', icon: <CheckSquare className="w-5 h-5" />, formId: 'consent' }
    ],
    phase2: [
        { id: 'start-session', label: 'Start Session', icon: <Activity className="w-5 h-5" />, formId: 'dosing-protocol' },
        { id: 'record-vitals', label: 'Record Vitals', icon: <Activity className="w-5 h-5" />, formId: 'session-vitals' },
        { id: 'adverse-event', label: 'Report Adverse Event', icon: <AlertCircle className="w-5 h-5" />, formId: 'adverse-event' }
    ],
    phase3: [
        { id: 'daily-pulse', label: 'Daily Pulse Check', icon: <Activity className="w-5 h-5" />, formId: 'daily-pulse' },
        { id: 'integration-session', label: 'Document Session', icon: <FileText className="w-5 h-5" />, formId: 'structured-integration' },
        { id: 'behavioral-change', label: 'Log Behavioral Change', icon: <CheckSquare className="w-5 h-5" />, formId: 'behavioral-tracker' }
    ],
    ongoing: [
        { id: 'safety-check', label: 'Safety Check', icon: <AlertCircle className="w-5 h-5" />, formId: 'structured-safety' }
    ]
};

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
    currentPhase,
    onActionSelect
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const actions = PHASE_ACTIONS[currentPhase] || [];

    const handleActionClick = (formId: string) => {
        // Haptic feedback (if supported)
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
        onActionSelect(formId);
        setIsOpen(false);
    };

    const toggleMenu = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Backdrop (mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Actions Menu */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden
                     md:w-72 w-[calc(100vw-3rem)]"
                    role="menu"
                    aria-label="Quick actions"
                >
                    <div className="p-2 space-y-1">
                        {actions.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => handleActionClick(action.formId)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                         text-slate-300 hover:bg-slate-800 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                                role="menuitem"
                            >
                                <div className="text-blue-400">{action.icon}</div>
                                <span className="text-sm font-medium">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* FAB Button */}
            <button
                onClick={toggleMenu}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-500 hover:bg-blue-600 
                   rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center
                   transition-all duration-200 hover:scale-110 active:scale-95
                   focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                aria-label="Quick actions menu"
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                <Plus
                    className={`w-6 h-6 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-45' : 'rotate-0'
                        }`}
                />
            </button>
        </>
    );
};
