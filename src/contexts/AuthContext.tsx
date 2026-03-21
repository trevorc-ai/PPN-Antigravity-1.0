import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

/**
 * UserProfile — the fetched row from log_user_profiles.
 * Kept intentionally minimal: only surface what components actually consume.
 * Always augmented with email + id from the auth user object.
 */
export interface UserProfile {
    id: string;
    email: string | undefined;
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
    role?: string | null;
    license_type?: string | null;
    license_number?: string | null;
    location_city?: string | null;
    location_country?: string | null;
    [key: string]: unknown; // allow arbitrary extra columns without breaking TS
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    userRole: UserRole;
    isPartner: boolean;
    userProfile: UserProfile | null;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    /**
     * Fetch the practitioner's profile row from log_user_profiles.
     * Called once on login / page refresh — result is held in context for the
     * lifetime of the session, so NO component needs to re-fetch it.
     */
    const fetchUserProfile = useCallback(async (authUser: User) => {
        try {
            const { data: profile, error } = await supabase
                .from('log_user_profiles')
                .select(
                    'user_id, first_name, last_name, display_name, avatar_url, role, ' +
                    'license_type, license_number, location_city, location_country'
                )
                .eq('user_id', authUser.id)
                .single();

            if (!error && profile) {
                setUserProfile({ ...(profile as unknown as Record<string, unknown>), email: authUser.email, id: authUser.id } as UserProfile);
            } else {
                // Profile row doesn't exist yet (new user) — use minimal data
                setUserProfile({ email: authUser.email, id: authUser.id });
            }
        } catch {
            setUserProfile({ email: authUser.email, id: authUser.id });
        }
    }, []);

    useEffect(() => {
        // Get initial session (handles page refresh — session is already in storage)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setUserRole((session?.user?.app_metadata?.role as UserRole) ?? null);
            setLoading(false);

            // Fetch profile once on page load if already logged in
            if (session?.user) {
                fetchUserProfile(session.user);
            }
        });

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setUserRole((session?.user?.app_metadata?.role as UserRole) ?? null);
            setLoading(false);

            if (!session || typeof window === 'undefined') {
                // User signed out — clear profile
                setUserProfile(null);
                return;
            }

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

            // ── Normal SIGNED_IN: fetch profile once ─────────────────────────
            // TOKEN_REFRESHED is explicitly excluded — the profile doesn't change
            // on token refresh, so we skip the fetch entirely.
            if (event === 'SIGNED_IN') {
                fetchUserProfile(session.user);
            }

            // All other SIGNED_IN events are normal logins — do NOT redirect.
            // Navigation after login is handled by Login.tsx's navigate(from) call.
        });

        return () => subscription.unsubscribe();
    }, [fetchUserProfile]);

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
            setUserProfile(null);
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
            setUserProfile(null);
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
            throw error; // Re-throw so caller can handle
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, userRole, isPartner: userRole === 'partner', userProfile, signOut }}>
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
