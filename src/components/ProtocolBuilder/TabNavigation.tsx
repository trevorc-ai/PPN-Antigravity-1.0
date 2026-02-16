import React from 'react';
import { Check } from 'lucide-react';

interface TabNavigationProps {
    activeTab: number;
    completedTabs: number[];
    onTabChange: (tab: number) => void;
}

const tabs = [
    { id: 1, label: 'Patient' },
    { id: 2, label: 'Medications' },
    { id: 3, label: 'Protocol' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
    activeTab,
    completedTabs,
    onTabChange,
}) => {
    return (
        <div className="flex gap-2 border-b border-[#1e293b] mb-6">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isCompleted = completedTabs.includes(tab.id);

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
              relative px-6 py-3 font-medium transition-all
              ${isActive
                                ? 'text-[#14b8a6] border-b-2 border-[#14b8a6]'
                                : 'text-[#94a3b8] hover:text-[#f8fafc]'
                            }
            `}
                    >
                        <div className="flex items-center gap-2">
                            {isCompleted && !isActive && (
                                <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center">
                                    <Check className="w-3 h-3 text-slate-300" />
                                </div>
                            )}
                            <span>{tab.label}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
