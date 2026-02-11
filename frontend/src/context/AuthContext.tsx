import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface User {
    id: string;
    email: string;
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
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
    isAdmin: false,
    loading: false,
    signOut: async () => { },
    refreshProfile: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    const signOut = useCallback(async () => {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        window.location.href = '/';
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
        }
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
