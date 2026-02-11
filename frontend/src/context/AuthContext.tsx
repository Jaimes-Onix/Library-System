import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    username?: string;
    full_name?: string;
}

interface Session {
    user: User;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: any | null;
    isAdmin: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<any>;
    setUser: (user: User | null) => void;
    signIn: (userData: any, profile: any) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
    isAdmin: false,
    loading: false,
    signOut: async () => { },
    refreshProfile: async () => { },
    setUser: () => { },
    signIn: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    // Initialize user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setSession({ user: userData });
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const signIn = useCallback((userData: any, userProfile: any) => {
        setUser(userData);
        setSession({ user: userData });
        setProfile(userProfile);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    const signOut = useCallback(async () => {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        localStorage.removeItem('user');
        window.location.href = '/home';
    }, []);

    const contextValue = useMemo(() => ({
        user,
        session,
        profile,
        isAdmin: false,
        loading,
        signOut,
        refreshProfile: async () => {
            return null;
        },
        setUser,
        signIn,
    }), [user, session, profile, loading, signOut, signIn]);

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
