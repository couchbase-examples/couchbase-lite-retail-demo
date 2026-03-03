import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useAuth } from '@/providers/AuthContext';
import DatabaseProvider from '@/providers/DatabaseProvider';

function TabNavigator() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#FC9C0C',
                tabBarInactiveTintColor: '#8E8E93',
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inventory',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'cube' : 'cube-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Orders',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'receipt' : 'receipt-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="scanner"
                options={{
                    title: 'Scanner',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'scan' : 'scan-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

export default function TabLayout() {
    const { storeConfig } = useAuth();

    if (!storeConfig) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FC9C0C" />
            </View>
        );
    }

    return (
        <DatabaseProvider storeConfig={storeConfig}>
            <TabNavigator />
        </DatabaseProvider>
    );
}
