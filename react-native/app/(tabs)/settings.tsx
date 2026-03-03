import { useContext, useCallback } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatabaseContext from '@/providers/DatabaseContext';
import { useAuth } from '@/providers/AuthContext';
import { APP_CONFIG } from '@/models/AppConfig';

export default function SettingsScreen() {
    const dbContext = useContext(DatabaseContext);
    const syncStatus = dbContext?.syncStatus ?? 'stopped';
    const isDbReady = dbContext?.isDbReady ?? false;
    const { storeConfig, logout } = useAuth();

    const syncColor = syncStatus === 'idle' ? '#34C759'
        : syncStatus === 'busy' ? '#FF9500'
        : syncStatus === 'connecting' ? '#007AFF'
        : '#8E8E93';

    const syncLabel = syncStatus === 'idle' ? 'Connected'
        : syncStatus === 'busy' ? 'Syncing...'
        : syncStatus === 'connecting' ? 'Connecting...'
        : syncStatus === 'offline' ? 'Offline'
        : 'Stopped';

    const handleRefresh = useCallback(() => {
        Alert.alert('Refresh', 'Data will sync automatically via App Services.');
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* User Info Header */}
                <View style={styles.userCard}>
                    <View style={styles.userAvatar}>
                        <Ionicons name="person-circle" size={48} color="#FC9C0C" />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{storeConfig?.fullName || 'Store Manager'}</Text>
                        <Text style={styles.userEmail}>{storeConfig?.username || ''}</Text>
                    </View>
                    <View style={styles.userRoleBadge}>
                        <Text style={styles.userRoleText}>{storeConfig?.role || 'Manager'}</Text>
                    </View>
                </View>

                {/* Sync Controls */}
                <Text style={styles.sectionHeader}>SYNC CONTROLS</Text>
                <View style={styles.sectionCard}>
                    <TouchableOpacity style={styles.settingRow} onPress={handleRefresh}>
                        <Ionicons name="refresh" size={20} color="#007AFF" />
                        <Text style={styles.settingLabel}>Refresh Data</Text>
                        <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <View style={styles.settingRow}>
                        <Ionicons name="cloud-outline" size={20} color="#007AFF" />
                        <Text style={styles.settingLabel}>App Services Sync</Text>
                        <Switch
                            value={true}
                            disabled
                            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                        />
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.settingRow}>
                        <View style={[styles.statusIndicator, { backgroundColor: syncColor }]} />
                        <Text style={styles.settingLabel}>Sync Status</Text>
                        <Text style={[styles.settingValue, { color: syncColor }]}>{syncLabel}</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.settingRow}>
                        <Ionicons name="wifi-outline" size={20} color="#8E8E93" />
                        <Text style={[styles.settingLabel, { color: '#8E8E93' }]}>P2P Sync</Text>
                        <Switch
                            value={false}
                            disabled
                            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                        />
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.settingRow}>
                        <Ionicons name="people-outline" size={20} color="#8E8E93" />
                        <Text style={[styles.settingLabel, { color: '#8E8E93' }]}>Connected Peers</Text>
                        <Text style={styles.settingValue}>0</Text>
                    </View>
                </View>

                {/* App Information */}
                <Text style={styles.sectionHeader}>APP INFORMATION</Text>
                <View style={styles.sectionCard}>
                    <View style={styles.settingRow}>
                        <Ionicons name="information-circle-outline" size={20} color="#8E8E93" />
                        <Text style={styles.settingLabel}>Version</Text>
                        <Text style={styles.settingValue}>1.0.0 (RN)</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.settingRow}>
                        <Ionicons name="hammer-outline" size={20} color="#8E8E93" />
                        <Text style={styles.settingLabel}>Build</Text>
                        <Text style={styles.settingValue}>React Native / Expo</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.settingRow}>
                        <Ionicons name="server-outline" size={20} color="#8E8E93" />
                        <Text style={styles.settingLabel}>Database</Text>
                        <Text style={styles.settingValue}>{APP_CONFIG.databaseName}</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.settingRow}>
                        <Ionicons name="layers-outline" size={20} color="#8E8E93" />
                        <Text style={styles.settingLabel}>Scope</Text>
                        <Text style={styles.settingValue}>{storeConfig?.scopeName || '—'}</Text>
                    </View>
                </View>

                {/* Sign Out */}
                <TouchableOpacity style={styles.signOutBtn} onPress={logout}>
                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    scrollContent: { paddingBottom: 40 },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 12,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    userAvatar: { marginRight: 12 },
    userInfo: { flex: 1 },
    userName: { fontSize: 17, fontWeight: '600', color: '#1C1C1E' },
    userEmail: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
    userRoleBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    userRoleText: { fontSize: 11, fontWeight: '600', color: '#2E7D32' },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
        marginHorizontal: 32,
        marginTop: 24,
        marginBottom: 8,
    },
    sectionCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    settingLabel: { flex: 1, fontSize: 15, color: '#1C1C1E' },
    settingValue: { fontSize: 14, color: '#8E8E93' },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#E5E5EA',
        marginLeft: 48,
    },
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    signOutText: { fontSize: 16, fontWeight: '600', color: '#FF3B30' },
});
