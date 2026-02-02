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
    refreshProfile: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
    isAdmin: false,
    loading: true,
    signOut: async () => { },
    refreshProfile: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async (userId: string, mounted: boolean) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                if (error.message?.includes('AbortError') || error.message?.includes('aborted')) {
                    return null;
                }
                console.error('[AUTH] Profile fetch error:', error.message);
                return null;
            }

            if (mounted) {
                setProfile(data ?? null);
            }
            return data;
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('aborted')) {
                // Ignore abort errors
                return null;
            }
            console.error('[AUTH] Unexpected profile fetch error:', err);
            return null;
        } finally {
            if (mounted) setLoading(false);
        }
    }, []);

    const isMounted = React.useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            const safetyTimeout = setTimeout(() => {
                if (isMounted.current && loading) {
                    setLoading(false);
                }
            }, 5000);

            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();
                if (!isMounted.current) return;

                setSession(initialSession);
                setUser(initialSession?.user ?? null);

                if (initialSession?.user) {
                    await fetchProfile(initialSession.user.id, isMounted.current);
                } else {
                    setProfile(null);
                    setLoading(false);
                }
            } catch (err: any) {
                if (err.name !== 'AbortError' && !err.message?.includes('aborted')) {
                    console.error("Auth init failed", err);
                }
                if (isMounted.current) setLoading(false);
            } finally {
                clearTimeout(safetyTimeout);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
                if (!isMounted.current) return;
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                if (currentSession?.user) {
                    await fetchProfile(currentSession.user.id, isMounted.current);
                } else if (event === 'SIGNED_OUT') {
                    setProfile(null);
                    setLoading(false);
                }
            }
        );

        initAuth();
        return () => { subscription.unsubscribe(); };

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
        isAdmin: profile?.role === 'admin' || user?.email === 'rebadomiarobert@gmail.com',
        loading,
        signOut,
        refreshProfile: async () => {
            if (user) {
                return await fetchProfile(user.id, true);
            }
            return null;
        }
    }), [user, session, profile, loading, signOut, fetchProfile]);

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
