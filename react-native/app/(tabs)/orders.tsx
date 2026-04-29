import { useContext, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatabaseContext from '@/providers/DatabaseContext';
import { ErrorBanner } from '@/components/feedback/ErrorBanner';
import { Order, formatOrderDate, getOrderStatusColor } from '@/models/Order';
import { useOrders } from '@/hooks/useOrders';

const FILTERS = ['All', 'In Review', 'Approved'] as const;
type FilterType = typeof FILTERS[number];

export default function OrdersScreen() {
    const dbContext = useContext(DatabaseContext);

    const {
        orders,
        isLoading,
        isRefreshing,
        isLoadingMore,
        hasMore,
        error,
        clearError,
        refresh,
        loadMore,
    } = useOrders({
        databaseService: dbContext?.databaseService,
        isDbReady: dbContext?.isDbReady ?? false,
    });

    const [activeFilter, setActiveFilter] = useState<FilterType>('All');

    const filteredOrders = useMemo(() => {
        if (activeFilter === 'All') return orders;
        return orders.filter(o => o.orderStatus === activeFilter);
    }, [orders, activeFilter]);

    const initError = dbContext?.initError ?? null;
    const errorBannerProps = (() => {
        if (initError) {
            return {
                title: 'Database failed to start',
                message: initError.message,
                onRetry: dbContext?.retryInit,
            };
        }
        if (error) {
            return {
                title: 'Could not load orders',
                message: error.error.message,
                onRetry: () => { clearError(); refresh(); },
                onDismiss: clearError,
            };
        }
        return null;
    })();

    const renderOrder = ({ item }: { item: Order }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                    <Ionicons name="document-text-outline" size={18} color="#8E8E93" />
                    <Text style={styles.orderNumber}>Order #{typeof item.orderId === 'string' ? (item.orderId as string).substring(0, 8) : item.orderId}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getOrderStatusColor(item.orderStatus) }]}>
                    <Text style={styles.statusText}>{item.orderStatus}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <DetailRow label="SKU" value={item.sku || '—'} />
                <DetailRow label="Quantity" value={String(item.orderQty)} />
                <DetailRow label="Product ID" value={String(item.productId)} />
                <DetailRow label="Date" value={formatOrderDate(item.orderDate)} />
                <DetailRow label="Order ID" value={typeof item.orderId === 'string' ? (item.orderId as string).substring(0, 16) + '...' : String(item.orderId)} />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={refresh} style={styles.headerBtn}>
                    <Ionicons name="refresh" size={20} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Orders</Text>
                <View style={styles.headerBtn} />
            </View>

            {errorBannerProps && <ErrorBanner {...errorBannerProps} />}

            <View style={styles.segmentContainer}>
                {FILTERS.map(filter => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.segmentBtn,
                            activeFilter === filter && styles.segmentBtnActive,
                        ]}
                        onPress={() => setActiveFilter(filter)}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                activeFilter === filter && styles.segmentTextActive,
                            ]}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {isLoading ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#FC9C0C" />
                </View>
            ) : filteredOrders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={64} color="#C7C7CC" />
                    <Text style={styles.emptyTitle}>No Orders</Text>
                    <Text style={styles.emptySubtitle}>
                        {activeFilter !== 'All'
                            ? `No "${activeFilter}" orders found`
                            : 'Reorder items from the Inventory tab'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredOrders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={refresh}
                            tintColor="#FC9C0C"
                        />
                    }
                    onEndReached={hasMore && activeFilter === 'All' ? loadMore : undefined}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={
                        isLoadingMore ? (
                            <View style={styles.footer}>
                                <ActivityIndicator size="small" color="#FC9C0C" />
                            </View>
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    headerBtn: { width: 40, alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '600' },
    segmentContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        backgroundColor: '#E5E5EA',
        borderRadius: 8,
        padding: 2,
        marginBottom: 12,
    },
    segmentBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 7,
    },
    segmentBtnActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    segmentText: { fontSize: 13, fontWeight: '500', color: '#8E8E93' },
    segmentTextActive: { color: '#1C1C1E', fontWeight: '600' },
    spinnerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: '#8E8E93' },
    emptySubtitle: { fontSize: 14, color: '#AEAEB2', textAlign: 'center', paddingHorizontal: 40 },
    list: { paddingHorizontal: 16, paddingBottom: 20 },
    footer: { paddingVertical: 16, alignItems: 'center' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5EA',
    },
    cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    orderNumber: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: { color: '#fff', fontSize: 11, fontWeight: '600' },
    cardBody: { gap: 6 },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: { fontSize: 13, color: '#8E8E93' },
    detailValue: { fontSize: 13, fontWeight: '500', color: '#1C1C1E' },
});
