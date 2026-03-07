import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { clearDataCache } from '../hooks/useDataCache';

// ── NOTE: No module-level IIFE ────────────────────────────────────────────────
// The previous implementation used a module-level IIFE to detect invite/recovery
// tokens in window.location.hash. This caused a race condition with HashRouter:
// HashRouter uses the hash for routing (/#/login), while Supabase uses it for
// tokens. They conflict. The IIFE was removed.
//
// Instead ALL auth event logic lives inside onAuthStateChange (reliable, ordered).
// Token exchange is handled manually in ResetPassword.tsx (detectSessionInUrl=false).
// ─────────────────────────────────────────────────────────────────────────────────

type UserRole = 'admin' | 'partner' | 'user' | null;

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    userRole: UserRole;
    isPartner: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRole>(null);

    useEffect(() => {
        // Get initial session (handles page refresh — session is already in storage)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setUserRole((session?.user?.app_metadata?.role as UserRole) ?? null);
            setLoading(false);
        });

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setUserRole((session?.user?.app_metadata?.role as UserRole) ?? null);
            setLoading(false);

            if (!session || typeof window === 'undefined') return;

            // ── PASSWORD_RECOVERY: Forgot-password link was clicked ──────────
            // Supabase emits this event when a reset email link is processed.
            // Redirect the user to /reset-password so they can set a new password.
            // NOTE: With detectSessionInUrl: false, this only fires after
            // ResetPassword.tsx manually calls exchangeCodeForSession().
            if (event === 'PASSWORD_RECOVERY') {
                window.location.replace(
                    window.location.origin + window.location.pathname + '#/reset-password'
                );
                return;
            }

            // ── Invite flow: new user, first login ───────────────────────────
            // When an invited user clicks their invite link and lands on
            // /reset-password, the page exchanges the code for a session.
            // That triggers a SIGNED_IN event. We detect first-time users by
            // checking last_sign_in_at — it is null on the very first sign-in.
            // Redirect them to /reset-password so they MUST set a password.
            // (Confirmed behavior: invited users must set a password before entry.)
            if (event === 'SIGNED_IN' && !session.user?.last_sign_in_at) {
                window.location.replace(
                    window.location.origin + window.location.pathname + '#/reset-password'
                );
                return;
            }

            // All other SIGNED_IN events are normal logins — do NOT redirect.
            // Navigation after login is handled by Login.tsx's navigate(from) call.
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
        <AuthContext.Provider value={{ user, session, loading, userRole, isPartner: userRole === 'partner', signOut }}>
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


