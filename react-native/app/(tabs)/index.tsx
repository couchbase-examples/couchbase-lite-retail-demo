import { useContext, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    TextInput,
    Modal,
    Dimensions,
    Image,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedSearchBar } from '@/components/searchBar/ThemedSearchBar';
import { ErrorBanner } from '@/components/feedback/ErrorBanner';
import DatabaseContext from '@/providers/DatabaseContext';
import { useAuth } from '@/providers/AuthContext';
import { GroceryItem, getQuantityColor } from '@/models/GroceryItem';
import { useInventory } from '@/hooks/useInventory';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 10;
const CARD_PADDING = 12;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP) / 2;

export default function InventoryScreen() {
    const dbContext = useContext(DatabaseContext);
    const { storeConfig } = useAuth();

    const {
        items,
        isLoading,
        isRefreshing,
        isLoadingMore,
        hasMore,
        search,
        setSearch,
        error,
        clearError,
        refresh,
        loadMore,
        incrementStock,
        decrementStock,
        createOrder,
    } = useInventory({
        databaseService: dbContext?.databaseService,
        isDbReady: dbContext?.isDbReady ?? false,
    });

    // Reorder modal state stays here — it's a screen-level UI concern.
    const [reorderItem, setReorderItem] = useState<GroceryItem | null>(null);
    const [reorderQty, setReorderQty] = useState('');

    async function handleCreateOrder() {
        if (!reorderItem) return;
        const qty = parseInt(reorderQty, 10);
        if (isNaN(qty) || qty <= 0) {
            Alert.alert('Invalid', 'Please enter a valid order quantity');
            return;
        }
        const result = await createOrder(reorderItem, qty);
        if (result.ok) {
            Alert.alert('Order Created', `Reorder for ${reorderItem.name} (qty: ${qty}) submitted.`);
            setReorderItem(null);
            setReorderQty('');
            return;
        }
        // The reorder Modal sits on top of the screen, so the ErrorBanner
        // would be hidden behind it. Surface the failure directly via an
        // Alert — the native system dialog renders above the Modal — and
        // clear the hook's error so the banner doesn't flash on screen
        // the moment the modal eventually closes.
        clearError();
        Alert.alert('Order Failed', result.error.message);
    }

    const renderItem = ({ item }: { item: GroceryItem }) => (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                {item.imageURL ? (
                    <Image source={{ uri: item.imageURL }} style={styles.productImage} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="cube-outline" size={36} color="#C7C7CC" />
                    </View>
                )}
            </View>

            <Text style={styles.productName} numberOfLines={2}>{item.name || 'Unknown'}</Text>
            <Text style={styles.productPrice}>${(Number(item.price) || 0).toFixed(2)}</Text>

            <Text style={styles.inventoryLabel}>Inventory Count</Text>
            <Text style={[styles.inventoryCount, { color: getQuantityColor(Number(item.stockQty) || 0) }]}>
                {Number(item.stockQty) || 0}
            </Text>

            <View style={styles.qtyButtons}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => decrementStock(item)}>
                    <Ionicons name="remove" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => incrementStock(item)}>
                    <Ionicons name="add" size={20} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.reorderBtn}
                onPress={() => {
                    setReorderItem(item);
                    setReorderQty('');
                }}
                activeOpacity={0.7}
            >
                <Ionicons name="cart-outline" size={14} color="#fff" />
                <Text style={styles.reorderText}>Re-order now</Text>
            </TouchableOpacity>
        </View>
    );

    const storeName = storeConfig?.displayName || 'Store';
    const role = storeConfig?.role || 'Manager';

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
            const titleByOp = {
                load: 'Could not load inventory',
                search: 'Search failed',
                updateStock: 'Could not update stock',
                createOrder: 'Could not create order',
            } as const;
            return {
                title: titleByOp[error.op],
                message: error.error.message,
                onRetry: error.op === 'load' || error.op === 'search'
                    ? () => { clearError(); refresh(); }
                    : undefined,
                onDismiss: clearError,
            };
        }
        return null;
    })();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.welcomeHeader}>
                <View style={styles.welcomeRow}>
                    <Text style={styles.welcomeText} numberOfLines={1}>
                        Welcome, {storeName} – {role.substring(0, 3)}...
                    </Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleBadgeText}>{role}</Text>
                    </View>
                </View>
                <Text style={styles.screenTitle}>Grocery Inventory</Text>
            </View>

            {errorBannerProps && <ErrorBanner {...errorBannerProps} />}

            <ThemedSearchBar
                placeholder="Search grocery..."
                onChangeText={setSearch}
                value={search}
            />

            {isLoading ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#FC9C0C" />
                </View>
            ) : items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cube-outline" size={64} color="#C7C7CC" />
                    <Text style={styles.emptyText}>
                        {search.length > 0
                            ? `No results for "${search}"`
                            : 'No inventory items found'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    columnWrapperStyle={styles.gridRow}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={refresh}
                            tintColor="#FC9C0C"
                        />
                    }
                    onEndReached={hasMore ? loadMore : undefined}
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

            <Modal visible={reorderItem !== null} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Reorder</Text>
                        <Text style={styles.modalSubtitle}>{reorderItem?.name}</Text>
                        <Text style={styles.modalDetail}>Current stock: {reorderItem?.stockQty}</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={reorderQty}
                            onChangeText={setReorderQty}
                            keyboardType="number-pad"
                            placeholder="Order Quantity"
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => { setReorderItem(null); setReorderQty(''); }}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.orderBtn]}
                                onPress={handleCreateOrder}>
                                <Text style={styles.orderBtnText}>Order</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    welcomeHeader: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },
    welcomeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    welcomeText: { fontSize: 14, color: '#8E8E93', flex: 1 },
    roleBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    roleBadgeText: { fontSize: 11, fontWeight: '600', color: '#2E7D32' },
    screenTitle: { fontSize: 28, fontWeight: 'bold', color: '#1C1C1E', marginTop: 2 },
    spinnerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    emptyText: { fontSize: 16, color: '#8E8E93', paddingHorizontal: 24, textAlign: 'center' },
    grid: { paddingHorizontal: CARD_PADDING, paddingBottom: 20, paddingTop: 8 },
    gridRow: { justifyContent: 'space-between', marginBottom: CARD_GAP },
    footer: { paddingVertical: 16, alignItems: 'center' },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: CARD_WIDTH * 0.6,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: '#F9F9F9',
    },
    productImage: { width: '100%', height: '100%' },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1C1E',
        textAlign: 'center',
        marginBottom: 2,
        minHeight: 36,
    },
    productPrice: {
        fontSize: 13,
        color: '#8E8E93',
        marginBottom: 8,
    },
    inventoryLabel: {
        fontSize: 10,
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inventoryCount: {
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    qtyButtons: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 6,
    },
    qtyBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reorderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        backgroundColor: '#FC9C0C',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: '100%',
        marginTop: 4,
    },
    reorderText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '85%',
        alignItems: 'center',
    },
    modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
    modalSubtitle: { fontSize: 16, color: '#3C3C43', marginBottom: 4 },
    modalDetail: { fontSize: 14, color: '#8E8E93', marginBottom: 16 },
    modalInput: {
        borderWidth: 1,
        borderColor: '#D1D1D6',
        borderRadius: 10,
        padding: 12,
        fontSize: 18,
        width: '100%',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: { flexDirection: 'row', gap: 12 },
    modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    cancelBtn: { backgroundColor: '#F2F2F7' },
    cancelBtnText: { fontSize: 16, color: '#3C3C43' },
    orderBtn: { backgroundColor: '#FC9C0C' },
    orderBtnText: { fontSize: 16, color: '#fff', fontWeight: '600' },
});
