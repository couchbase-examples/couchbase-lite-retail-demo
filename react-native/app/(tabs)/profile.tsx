import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatabaseContext from '@/providers/DatabaseContext';
import { useAuth } from '@/providers/AuthContext';
import { StoreProfile } from '@/models/StoreProfile';

export default function ProfileScreen() {
    const dbContext = useContext(DatabaseContext);
    const databaseService = dbContext?.databaseService;
    const isDbReady = dbContext?.isDbReady ?? false;

    const { storeConfig } = useAuth();
    const [profile, setProfile] = useState<StoreProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!databaseService || !isDbReady) return;
        const load = async () => {
            try {
                const data = await databaseService.getStoreProfile();
                setProfile(data);
            } catch (e) {
                console.error('[Profile] Load error:', e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [databaseService, isDbReady]);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#FC9C0C" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Store Header */}
                <View style={styles.headerCard}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="storefront" size={40} color="#FC9C0C" />
                    </View>
                    <Text style={styles.storeName}>
                        {profile?.name || storeConfig?.displayName || 'Store'}
                    </Text>
                    <Text style={styles.storeId}>{storeConfig?.storeId}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{storeConfig?.role || 'Manager'}</Text>
                    </View>
                </View>

                {/* Contact Info */}
                {profile?.contact && (
                    <>
                        <Text style={styles.sectionHeader}>CONTACT</Text>
                        <View style={styles.sectionCard}>
                            <InfoRow icon="mail-outline" label="Email" value={safeString(profile.contact.email)} />
                            {profile.contact.phone && (
                                <>
                                    <View style={styles.separator} />
                                    <InfoRow icon="call-outline" label="Phone" value={safeString(profile.contact.phone)} />
                                </>
                            )}
                            {profile.contact.name && (
                                <>
                                    <View style={styles.separator} />
                                    <InfoRow icon="person-outline" label="Name" value={safeString(profile.contact.name)} />
                                </>
                            )}
                            {profile.contact.employeeId && (
                                <>
                                    <View style={styles.separator} />
                                    <InfoRow icon="id-card-outline" label="Employee ID" value={safeString(profile.contact.employeeId)} />
                                </>
                            )}
                            {profile.manager && (
                                <>
                                    <View style={styles.separator} />
                                    <InfoRow icon="briefcase-outline" label="Manager" value={safeString(profile.manager)} />
                                </>
                            )}
                        </View>
                    </>
                )}

                {/* Location */}
                {profile?.location && (
                    <>
                        <Text style={styles.sectionHeader}>LOCATION</Text>
                        <View style={styles.sectionCard}>
                            {profile.location.address1 && (
                                <InfoRow icon="location-outline" label="Address" value={safeString(profile.location.address1)} />
                            )}
                            {(profile.location.locality || profile.location.region) && (
                                <>
                                    <View style={styles.separator} />
                                    <InfoRow icon="business-outline" label="City" value={[profile.location.locality, profile.location.region, profile.location.postalCode].filter(Boolean).join(', ')} />
                                </>
                            )}
                            {profile.location.country && (
                                <>
                                    <View style={styles.separator} />
                                    <InfoRow icon="globe-outline" label="Country" value={safeString(profile.location.country)} />
                                </>
                            )}
                        </View>
                    </>
                )}

                {/* Opening Hours */}
                {profile?.openingHours && (
                    <>
                        <Text style={styles.sectionHeader}>HOURS</Text>
                        <View style={styles.sectionCard}>
                            <InfoRow icon="time-outline" label="Opening Hours" value={safeString(profile.openingHours)} />
                        </View>
                    </>
                )}

                {/* Account */}
                <Text style={styles.sectionHeader}>ACCOUNT</Text>
                <View style={styles.sectionCard}>
                    <InfoRow icon="person-circle-outline" label="Username" value={storeConfig?.username || '—'} />
                    <View style={styles.separator} />
                    <InfoRow icon="layers-outline" label="Scope" value={storeConfig?.scopeName || '—'} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function safeString(val: any): string {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'string') return val;
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (typeof val === 'object') {
        if (val.name) return String(val.name);
        if (val.email) return String(val.email);
        return JSON.stringify(val);
    }
    return String(val);
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <Ionicons name={icon as any} size={20} color="#8E8E93" />
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    spinnerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { paddingBottom: 40 },
    headerCard: {
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 12,
        padding: 24,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF0DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    storeName: { fontSize: 20, fontWeight: 'bold', color: '#1C1C1E' },
    storeId: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
    roleBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        marginTop: 8,
    },
    roleText: { fontSize: 12, fontWeight: '600', color: '#2E7D32' },
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
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#E5E5EA',
        marginLeft: 48,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 12, color: '#8E8E93' },
    infoValue: { fontSize: 15, color: '#1C1C1E', marginTop: 1 },
});
