import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    title?: string;
    message: string;
    /** When provided, a "Retry" button is rendered. */
    onRetry?: () => void;
    /** When provided, a close (X) button is rendered. */
    onDismiss?: () => void;
    /**
     * 'error' (default) → red, 'warning' → orange. Reserved for future use;
     * for now both render with the same red palette so the visual is loud.
     */
    severity?: 'error' | 'warning';
};

/**
 * Top-of-screen banner used by all data screens to surface failures in
 * Couchbase Lite initialization, App Services auth, sync, queries, and
 * mutations. Keeps the UI a single source of truth for error styling.
 */
export function ErrorBanner({
    title = 'Something went wrong',
    message,
    onRetry,
    onDismiss,
    severity = 'error',
}: Props) {
    const palette = severity === 'warning'
        ? { bg: '#FFF4E5', border: '#FFB74D', icon: '#E65100', text: '#5D4037' }
        : { bg: '#FFEBEE', border: '#EF5350', icon: '#B71C1C', text: '#5D1A1A' };

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: palette.bg, borderLeftColor: palette.border },
            ]}
            accessibilityRole="alert"
            accessibilityLabel={`${title}. ${message}`}
        >
            <Ionicons
                name={severity === 'warning' ? 'warning-outline' : 'alert-circle-outline'}
                size={20}
                color={palette.icon}
                style={styles.icon}
            />
            <View style={styles.body}>
                <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
                <Text style={[styles.message, { color: palette.text }]} numberOfLines={3}>
                    {message}
                </Text>
                {onRetry && (
                    <TouchableOpacity
                        style={[styles.retryBtn, { borderColor: palette.border }]}
                        onPress={onRetry}
                        accessibilityRole="button"
                    >
                        <Ionicons name="refresh" size={14} color={palette.icon} />
                        <Text style={[styles.retryText, { color: palette.icon }]}>Retry</Text>
                    </TouchableOpacity>
                )}
            </View>
            {onDismiss && (
                <TouchableOpacity
                    onPress={onDismiss}
                    accessibilityRole="button"
                    accessibilityLabel="Dismiss error"
                    hitSlop={8}
                    style={styles.dismiss}
                >
                    <Ionicons name="close" size={18} color={palette.icon} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 4,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderLeftWidth: 4,
    },
    icon: { marginTop: 1 },
    body: { flex: 1 },
    title: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
    message: { fontSize: 13, lineHeight: 18 },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
    },
    retryText: { fontSize: 12, fontWeight: '600' },
    dismiss: { paddingTop: 1, paddingLeft: 4 },
});
