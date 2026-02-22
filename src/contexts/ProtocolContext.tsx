import React, { createContext, useContext, useState, useEffect } from 'react';

export type ProtocolArchetype = 'clinical' | 'ceremonial' | 'custom';

export interface SessionConfig {
    protocolType: ProtocolArchetype;
    enabledFeatures: string[];
}

interface ProtocolContextType {
    config: SessionConfig;
    setConfig: (config: SessionConfig) => void;
    isProtocolLocked: boolean;
    lockProtocol: () => void;
}

// Default to strict clinical if not loaded
const DEFAULT_CONFIG: SessionConfig = {
    protocolType: 'clinical',
    enabledFeatures: [
        'consent',
        'structured-safety',
        'set-and-setting',
        'mental-health',
        'dosing-protocol',
        'session-timeline',
        'session-vitals',
        'session-observations',
        'safety-and-adverse-event',
        'rescue-protocol',
        'daily-pulse',
        'meq30',
        'structured-integration',
        'behavioral-tracker',
        'longitudinal-assessment'
    ]
};

const ProtocolContext = createContext<ProtocolContextType | undefined>(undefined);

export const ProtocolProvider: React.FC<{ children: React.ReactNode, initialConfig?: SessionConfig }> = ({ children, initialConfig }) => {
    const [config, setConfig] = useState<SessionConfig>(initialConfig || DEFAULT_CONFIG);
    const [isProtocolLocked, setIsProtocolLocked] = useState(false);

    // If implementing DB persistence, fetch and hydrate here
    // For now, we simulate initializing from a passed-in config or DB fetch

    const lockProtocol = () => {
        setIsProtocolLocked(true);
    };

    return (
        <ProtocolContext.Provider value={{ config, setConfig, isProtocolLocked, lockProtocol }}>
            {children}
        </ProtocolContext.Provider>
    );
};

export const useProtocol = () => {
    const context = useContext(ProtocolContext);
    if (context === undefined) {
        throw new Error('useProtocol must be used within a ProtocolProvider');
    }
    return context;
};
