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

    const fetchProfile = useCallback(async (currentUser: User, mounted: boolean) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .maybeSingle();

            if (error) {
                if (error.message?.includes('AbortError') || error.message?.includes('aborted')) {
                    return null;
                }
                console.error('[AUTH] Profile fetch error:', error.message);
                return null;
            }

            // AUTO-HEAL: If profile is missing but user exists, recreate it from metadata
            if (!data) {
                console.warn('[AUTH] Profile missing for existing user. Attempting auto-recovery...');
                const metadata = currentUser.user_metadata || {};

                const newProfile = {
                    id: currentUser.id,
                    email: currentUser.email,
                    name: metadata.full_name || currentUser.email?.split('@')[0] || 'User',
                    role: 'user',
                    student_id: metadata.student_id || null,
                    grade_section: metadata.grade_section || null,
                    course: metadata.course || null,
                    status: 'active',
                    created_at: new Date().toISOString(),
                    // Intentionally leaving photo_url null as we can't recover the uploaded file URL easily 
                    // unless we store it in metadata (which we don't yet, but could in future)
                };

                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert(newProfile);

                if (!insertError) {
                    console.log('[AUTH] Profile auto-recovered successfully');
                    if (mounted) setProfile(newProfile);
                    return newProfile;
                } else {
                    console.error('[AUTH] Profile recovery failed:', insertError);
                    // ZOMBIE KILLER: If we can't recover the profile, the user likely doesn't exist anymore.
                    // Force sign out to clean up the stale local session.
                    if (mounted) {
                        console.warn('[AUTH] valid session but dead user found. Force signing out...');
                        await supabase.auth.signOut();
                        // Force wipe all auth tokens
                        Object.keys(localStorage).forEach(key => {
                            if (key.startsWith('sb-') || key.includes('supabase')) {
                                localStorage.removeItem(key);
                            }
                        });
                        window.location.reload();
                        return null;
                    }
                }
            }

            if (mounted) {
                console.log('[AUTH] ✅ Profile fetched successfully:', data);
                console.log('[AUTH] Setting profile in state with:', {
                    student_id: data?.student_id,
                    grade_section: data?.grade_section,
                    course: data?.course
                });
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
                // STRONG CHECK: Verify user against the server database
                const { data: { user: validUser }, error: userError } = await supabase.auth.getUser();

                if (!isMounted.current) return;

                if (userError || !validUser) {
                    console.log('[AUTH] Invalid user on server. Clearing session.');
                    // CRITICAL FIX: Explicitly sign out the Supabase client to clear the correct keys
                    await supabase.auth.signOut();
                    setSession(null);
                    setUser(null);
                    setProfile(null);
                    setLoading(false);
                    return;
                }

                // If user is valid, get the session object too (for tokens)
                const { data: { session: validSession } } = await supabase.auth.getSession();
                setSession(validSession);
                setUser(validUser);

                if (validUser) {
                    await fetchProfile(validUser, isMounted.current);
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
                    await fetchProfile(currentSession.user, isMounted.current);
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
        try {
            console.log('[AUTH] Requests SignOut...');
            // 1. Race: Give Supabase 500ms to sign out cleanly, otherwise FORCE it.
            await Promise.race([
                supabase.auth.signOut(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('SignOut Timeout')), 500))
            ]);
        } catch (error) {
            console.warn('[AUTH] Force-killing session locally due to timeout/error', error);
        } finally {
            // 2. Clear all local state immediately
            setUser(null);
            setSession(null);
            setProfile(null);

            // 3. Clear persistence storage to prevent "Sticky Session"
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-') || key.includes('supabase')) {
                    localStorage.removeItem(key);
                }
            });

            setLoading(false);
            console.log('[AUTH] Local cleanup done. Reloading...');

            // 4. Hard reload to ensure no memory leaks or stale state
            window.location.href = '/';
        }
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
                return await fetchProfile(user, true);
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
