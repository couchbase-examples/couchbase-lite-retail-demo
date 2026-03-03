import React from 'react';
import { StoreLocation, StoreConfig } from '@/models/AppConfig';

export interface AuthContextType {
    isAuthenticated: boolean;
    selectedStore: StoreLocation | null;
    storeConfig: StoreConfig | null;
    login: (store: StoreLocation) => void;
    logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
