import React, { useState, useMemo, ReactNode, useCallback } from 'react';
import AuthContext from './AuthContext';
import { StoreLocation, StoreConfig, getStoreConfig } from '@/models/AppConfig';

type AuthProviderProps = {
    children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
    const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);

    const login = useCallback((store: StoreLocation) => {
        const config = getStoreConfig(store);
        setSelectedStore(store);
        setStoreConfig(config);
        setIsAuthenticated(true);
        console.log(`[Auth] Logged in as ${config.fullName} (${config.displayName})`);
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        setSelectedStore(null);
        setStoreConfig(null);
        console.log('[Auth] Logged out');
    }, []);

    const value = useMemo(
        () => ({ isAuthenticated, selectedStore, storeConfig, login, logout }),
        [isAuthenticated, selectedStore, storeConfig, login, logout]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
