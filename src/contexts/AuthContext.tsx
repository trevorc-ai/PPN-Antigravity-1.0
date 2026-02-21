import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { clearDataCache } from '../hooks/useDataCache';
import { clearBenchmarkCache } from '../hooks/useSafetyBenchmark';
import { clearAnalyticsCache } from '../hooks/useAnalyticsData';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        console.log('[AuthContext] signOut called');
        try {
            console.log('[AuthContext] Calling supabase.auth.signOut()');
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('[AuthContext] Supabase signOut error:', error);
                throw error;
            }

            console.log('[AuthContext] Supabase signOut successful');
            setUser(null);
            setSession(null);
            clearDataCache();        // wipe useDataCache session cache
            clearBenchmarkCache();   // wipe safety benchmark cache
            clearAnalyticsCache();   // wipe analytics KPI cache
            localStorage.clear();
            sessionStorage.clear();

            console.log('[AuthContext] Redirecting to /');
            window.location.href = '/'; // Force full page reload to clear state
        } catch (error) {
            console.error('[AuthContext] signOut failed:', error);
            // Still clear local state even if Supabase call fails
            setUser(null);
            setSession(null);
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
            throw error; // Re-throw so caller can handle
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
