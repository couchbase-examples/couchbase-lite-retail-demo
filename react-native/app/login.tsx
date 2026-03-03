import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    TextInput,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthContext';
import { StoreLocation, getStoreConfig } from '@/models/AppConfig';

const DEMO_CREDENTIALS = [
    {
        store: 'aa' as StoreLocation,
        email: 'aa-store-01@supermarket.com',
        password: 'P@ssword1',
        role: 'Store Manager',
        description: 'Ann Arbor Store',
        endpoint: 'supermarket-aa',
    },
    {
        store: 'nyc' as StoreLocation,
        email: 'nyc-store-01@supermarket.com',
        password: 'P@ssword1',
        role: 'Store Manager',
        description: 'New York City Store',
        endpoint: 'supermarket-nyc',
    },
];

export default function LoginScreen() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showDemoModal, setShowDemoModal] = useState(false);

    const handleSignIn = () => {
        // Match username to a store
        const aaCred = DEMO_CREDENTIALS[0];
        const nycCred = DEMO_CREDENTIALS[1];
        if (username === aaCred.email && password === aaCred.password) {
            login('aa');
        } else if (username === nycCred.email && password === nycCred.password) {
            login('nyc');
        } else {
            // Default: try to match partial
            if (username.toLowerCase().includes('aa')) {
                login('aa');
            } else if (username.toLowerCase().includes('nyc')) {
                login('nyc');
            } else if (username.length > 0) {
                // Default to NYC if any username entered
                login('nyc');
            }
        }
    };

    const handleDemoLogin = (store: StoreLocation) => {
        const cred = DEMO_CREDENTIALS.find(c => c.store === store)!;
        setUsername(cred.email);
        setPassword(cred.password);
        setShowDemoModal(false);
        login(store);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Ionicons name="cart" size={48} color="#fff" />
                    </View>

                    <Text style={styles.title}>Grocery Inventory</Text>
                    <Text style={styles.subtitle}>Management System</Text>

                    {/* Login Form */}
                    <View style={styles.formContainer}>
                        {/* Username Field */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter username"
                                placeholderTextColor="#C7C7CC"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Password Field */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter password"
                                placeholderTextColor="#C7C7CC"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#8E8E93"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={[styles.signInBtn, (!username || !password) && styles.signInBtnDisabled]}
                            onPress={handleSignIn}
                            activeOpacity={0.8}
                            disabled={!username || !password}
                        >
                            <Text style={styles.signInText}>Sign In</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>

                        {/* Demo Credentials Link */}
                        <TouchableOpacity
                            style={styles.demoLink}
                            onPress={() => setShowDemoModal(true)}
                        >
                            <Ionicons name="information-circle-outline" size={16} color="#FC9C0C" />
                            <Text style={styles.demoLinkText}>View Demo Credentials</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footerContainer}>
                        <Ionicons name="server-outline" size={14} color="#C7C7CC" />
                        <Text style={styles.footer}>Powered by Couchbase</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Demo Credentials Modal */}
            <Modal visible={showDemoModal} animationType="slide" presentationStyle="pageSheet">
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Demo Credentials</Text>
                        <TouchableOpacity onPress={() => setShowDemoModal(false)}>
                            <Ionicons name="close-circle-outline" size={28} color="#8E8E93" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.modalScroll}>
                        <Text style={styles.modalDescription}>
                            Tap any credential below to auto-login
                        </Text>

                        {DEMO_CREDENTIALS.map((cred, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.credCard}
                                onPress={() => handleDemoLogin(cred.store)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.credHeader}>
                                    <Ionicons name="storefront-outline" size={22} color="#FC9C0C" />
                                    <Text style={styles.credStoreName}>{cred.description}</Text>
                                    <View style={styles.credRoleBadge}>
                                        <Text style={styles.credRoleText}>{cred.role}</Text>
                                    </View>
                                </View>
                                <View style={styles.credRow}>
                                    <Text style={styles.credLabel}>Email</Text>
                                    <Text style={styles.credValue}>{cred.email}</Text>
                                </View>
                                <View style={styles.credRow}>
                                    <Text style={styles.credLabel}>Password</Text>
                                    <Text style={styles.credValue}>{cred.password}</Text>
                                </View>
                                <View style={styles.credRow}>
                                    <Text style={styles.credLabel}>Endpoint</Text>
                                    <Text style={styles.credValue}>{cred.endpoint}</Text>
                                </View>
                                <View style={styles.credTapHint}>
                                    <Ionicons name="log-in-outline" size={16} color="#FC9C0C" />
                                    <Text style={styles.credTapText}>Tap to auto-login</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <View style={styles.instructionsBox}>
                            <Text style={styles.instructionsTitle}>Instructions</Text>
                            <Text style={styles.instructionsText}>
                                Each store has its own data scope. Select a store to log in with pre-configured credentials and sync data from Capella App Services.
                            </Text>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF8ED' },
    keyboardView: { flex: 1 },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 40,
    },
    logoContainer: {
        width: 90,
        height: 90,
        borderRadius: 22,
        backgroundColor: '#2C2C2E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1C1C1E' },
    subtitle: { fontSize: 17, color: '#8E8E93', marginBottom: 36 },
    formContainer: { width: '100%' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        marginBottom: 12,
        paddingHorizontal: 14,
        height: 50,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: '#1C1C1E' },
    eyeIcon: { padding: 4 },
    signInBtn: {
        backgroundColor: '#FC9C0C',
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    signInBtnDisabled: { opacity: 0.5 },
    signInText: { fontSize: 17, fontWeight: '600', color: '#fff' },
    demoLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 20,
    },
    demoLinkText: { fontSize: 14, color: '#FC9C0C', fontWeight: '500' },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 40,
    },
    footer: { fontSize: 12, color: '#C7C7CC' },
    // Modal styles
    modalContainer: { flex: 1, backgroundColor: '#F2F2F7' },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#D1D1D6',
        backgroundColor: '#fff',
    },
    modalTitle: { fontSize: 20, fontWeight: '700' },
    modalScroll: { padding: 20, paddingBottom: 40 },
    modalDescription: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 20,
    },
    credCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    credHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    credStoreName: { fontSize: 17, fontWeight: '600', flex: 1 },
    credRoleBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
    },
    credRoleText: { fontSize: 11, fontWeight: '600', color: '#2E7D32' },
    credRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F2F2F7',
    },
    credLabel: { fontSize: 13, color: '#8E8E93' },
    credValue: { fontSize: 13, fontWeight: '500', color: '#1C1C1E' },
    credTapHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E5E5EA',
    },
    credTapText: { fontSize: 13, fontWeight: '600', color: '#FC9C0C' },
    instructionsBox: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginTop: 4,
    },
    instructionsTitle: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
    instructionsText: { fontSize: 13, color: '#8E8E93', lineHeight: 19 },
});
