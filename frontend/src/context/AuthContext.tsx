import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: any | null;
    isAdmin: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
    isAdmin: false,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async (userId: string, isMounted: boolean) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                console.error('[AUTH] Profile fetch error:', error.message);
                return;
            }

            if (isMounted) {
                setProfile(data ?? null);
            }
        } catch (err) {
            console.error('[AUTH] Unexpected profile fetch error:', err);
        } finally {
            if (isMounted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            setLoading(true);
            const { data: { session: initialSession } } = await supabase.auth.getSession();

            if (!isMounted) return;

            setSession(initialSession);
            setUser(initialSession?.user ?? null);

            if (initialSession?.user) {
                await fetchProfile(initialSession.user.id, isMounted);
            } else {
                setProfile(null);
                setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
                console.log('[AUTH] Event:', event);
                if (!isMounted) return;

                setSession(currentSession);
                setUser(currentSession?.user ?? null);

                if (currentSession?.user) {
                    setLoading(true);
                    await fetchProfile(currentSession.user.id, isMounted);
                } else if (event === 'SIGNED_OUT') {
                    setProfile(null);
                    setLoading(false);
                }
            }
        );

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    const signOut = useCallback(async () => {
        // INSTANT LOGOUT - Clear state immediately
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        localStorage.removeItem('supabase.auth.token');

        // Call Supabase in background (don't wait)
        supabase.auth.signOut();
    }, []);

    const contextValue = useMemo(() => ({
        user,
        session,
        profile,
        isAdmin: profile?.role === 'admin',
        loading,
        signOut
    }), [user, session, profile, loading, signOut]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
