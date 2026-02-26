import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { clearDataCache } from '../hooks/useDataCache';

// ── Invite-flow detection ────────────────────────────────────────────────────
// We MUST read the URL hash at module-load time, BEFORE React Router (HashRouter)
// processes the fragment and strips the Supabase token parameters from it.
// Supabase appends tokens to the hash like:
//   https://ppnportal.net/#access_token=xxx&type=invite
// HashRouter then rewrites the hash to route paths like /#/search,
// which destroys the type=invite param before onAuthStateChange fires.
(function captureInviteFlag() {
    if (typeof window === 'undefined') return;
    try {
        const rawHash = window.location.hash;
        // Parse as URLSearchParams by stripping the leading '#'
        const params = new URLSearchParams(rawHash.replace(/^#/, ''));
        const type = params.get('type');
        if (type === 'invite' || type === 'signup') {
            sessionStorage.setItem('ppn_pending_invite', 'true');
        }
    } catch {
        // Non-critical — fail silently
    }
})();

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
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // ── Invite / signup link interception ───────────────────────────
            // Two signals are checked (either is sufficient):
            //   1. sessionStorage flag set at module-load time (reliable across
            //      all browsers, survives HashRouter fragment rewrite)
            //   2. URL hash still contains 'type=invite' or 'type=signup'
            //      (works when the page load is very fast)
            //
            // On detection we do a hard replace() to /reset-password so the
            // user MUST create their own password before entering the portal.
            // This prevents the scenario where a user gets silently logged in
            // via magic link, never sets a password, then can't log back in.
            if (session && typeof window !== 'undefined') {
                const pendingInvite = sessionStorage.getItem('ppn_pending_invite');
                const rawHash = window.location.hash;
                const hashParams = new URLSearchParams(rawHash.replace(/^#/, ''));
                const hashType = hashParams.get('type');
                const isInviteFlow =
                    pendingInvite === 'true' ||
                    hashType === 'invite' ||
                    hashType === 'signup';

                if (isInviteFlow) {
                    sessionStorage.removeItem('ppn_pending_invite');
                    // Use replace() so the back button doesn't return to the
                    // raw invite URL (which is already consumed/expired).
                    window.location.replace(
                        window.location.origin + window.location.pathname + '#/reset-password'
                    );
                    return;
                }
            }
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
