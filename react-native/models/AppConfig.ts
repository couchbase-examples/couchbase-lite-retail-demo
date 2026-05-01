import Constants from 'expo-constants';

// MARK: - Store Types
export type StoreLocation = 'aa' | 'nyc';

export interface StoreConfig {
    storeId: string;
    displayName: string;
    scopeName: string;
    syncEndpoint: string;
    username: string;
    password: string;
    fullName: string;
    role: string;
}

// MARK: - App Configuration
export const APP_CONFIG = {
    databaseName: 'GroceryInventoryDB',
    collections: {
        inventory: 'inventory',
        orders: 'orders',
        profile: 'profile',
    },
    syncContinuous: true,
} as const;

// MARK: - Store Configuration
export function getStoreConfig(store: StoreLocation): StoreConfig {
    const extra = Constants.expoConfig?.extra;
    const baseUrl = extra?.cblBaseUrl ?? '';

    switch (store) {
        case 'aa':
            return {
                storeId: 'aa-store-01',
                displayName: 'Ann Arbor Store',
                scopeName: 'AA-Store',
                syncEndpoint: `${baseUrl}/${extra?.cblAADB ?? 'supermarket-aa'}`,
                username: extra?.cblAAUser ?? 'aa-store-01@supermarket.com',
                password: extra?.cblPassword ?? 'P@ssword1',
                fullName: 'Ann Arbor Store Manager',
                role: 'Store Manager',
            };
        case 'nyc':
            return {
                storeId: 'nyc-store-01',
                displayName: 'New York City Store',
                scopeName: 'NYC-Store',
                syncEndpoint: `${baseUrl}/${extra?.cblNYCDB ?? 'supermarket-nyc'}`,
                username: extra?.cblNYCUser ?? 'nyc-store-01@supermarket.com',
                password: extra?.cblPassword ?? 'P@ssword1',
                fullName: 'NYC Store Manager',
                role: 'Store Manager',
            };
    }
}
