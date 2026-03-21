import React, { createContext, useContext } from 'react';

// Cockpit mode theme removed. ThemeContext is kept as a no-op stub
// so any remaining useTheme() call sites do not break at runtime.
// The only active theme is 'clinical'.

type Theme = 'clinical';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Clear any stale 'cockpit' value left in localStorage from previous sessions
    if (typeof window !== 'undefined') {
        localStorage.removeItem('ppn-theme');
        document.documentElement.removeAttribute('data-theme');
    }

    const noop = () => {};

    return (
        <ThemeContext.Provider value={{ theme: 'clinical', setTheme: noop, toggleTheme: noop }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
