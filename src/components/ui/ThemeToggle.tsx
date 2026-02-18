import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isCockpit = theme === 'cockpit';

    return (
        <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${isCockpit
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                }`}
            title={`Switch to ${isCockpit ? 'Clinical' : 'Cockpit'} Mode`}
            aria-label={`Current theme: ${isCockpit ? 'Cockpit' : 'Clinical'} Mode. Click to switch.`}
            aria-pressed={isCockpit}
        >
            {isCockpit ? (
                <>
                    <Sun className="w-4 h-4" />
                    <span className="text-sm font-bold hidden sm:inline">Clinical Mode</span>
                </>
            ) : (
                <>
                    <Moon className="w-4 h-4" />
                    <span className="text-sm font-bold hidden sm:inline">Cockpit Mode</span>
                </>
            )}
        </button>
    );
};

export default ThemeToggle;
