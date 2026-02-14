import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    display_name?: string;
    specialty?: string;
    organization_name?: string;
    role_tier: string;
    subscription_status?: string;
    is_profile_complete: boolean;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                setProfile(null);
            } else {
                setProfile(data);
            }
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
            setProfile(null);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>
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
