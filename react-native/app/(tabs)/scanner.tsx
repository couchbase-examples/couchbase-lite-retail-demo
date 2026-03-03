import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ScannerScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="scan-outline" size={64} color="#C7C7CC" />
                </View>
                <Text style={styles.title}>Scanner</Text>
                <Text style={styles.subtitle}>Coming Soon</Text>
                <Text style={styles.description}>
                    Barcode and QR code scanning will be available in a future update.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    title: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 4 },
    subtitle: { fontSize: 16, fontWeight: '600', color: '#FC9C0C', marginBottom: 12 },
    description: { fontSize: 14, color: '#8E8E93', textAlign: 'center', lineHeight: 20 },
});
