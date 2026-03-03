import { useContext, useEffect, useState, useCallback, useRef } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedSearchBar } from '@/components/searchBar/ThemedSearchBar';
import DatabaseContext from '@/providers/DatabaseContext';
import { useAuth } from '@/providers/AuthContext';
import { GroceryItem, getQuantityColor } from '@/models/GroceryItem';
import { debounce } from '@/util/debounce';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 10;
const CARD_PADDING = 12;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP) / 2;

export default function InventoryScreen() {
    const dbContext = useContext(DatabaseContext);
    const databaseService = dbContext?.databaseService;
    const isDbReady = dbContext?.isDbReady ?? false;

    const { storeConfig } = useAuth();

    const [items, setItems] = useState<GroceryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Reorder modal state
    const [reorderItem, setReorderItem] = useState<GroceryItem | null>(null);
    const [reorderQty, setReorderQty] = useState('');

    // Debounce timer for change listener to avoid rapid re-queries during sync
    const changeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isQueryingRef = useRef(false);
    const listenerTokenRef = useRef<any>(null);

    const loadItems = useCallback(async () => {
        if (!databaseService || !isDbReady) return;
        // Prevent concurrent queries
        if (isQueryingRef.current) return;
        isQueryingRef.current = true;
        try {
            const data = await databaseService.getInventoryItems();
            setItems(data);
        } catch (e) {
            console.warn('[Inventory] Load error (may be transient during sync):', e);
        } finally {
            isQueryingRef.current = false;
            setIsLoading(false);
        }
    }, [databaseService, isDbReady]);

    // Keep a stable ref to loadItems so the listener effect doesn't re-register
    const loadItemsRef = useRef(loadItems);
    loadItemsRef.current = loadItems;

    // Initial data load
    useEffect(() => {
        if (isDbReady) {
            loadItems();
        }
    }, [isDbReady, loadItems]);

    // Register change listener ONCE, remove on cleanup to avoid orphaned tokens
    useEffect(() => {
        if (!isDbReady || !databaseService) return;

        let cancelled = false;

        const register = async () => {
            const token = await databaseService.addInventoryChangeListener(() => {
                if (cancelled) return;
                if (changeTimerRef.current) {
                    clearTimeout(changeTimerRef.current);
                }
                changeTimerRef.current = setTimeout(() => {
                    loadItemsRef.current();
                }, 300);
            });
            if (!cancelled) {
                listenerTokenRef.current = token;
            } else if (token && typeof token.remove === 'function') {
                // Effect was cleaned up before registration completed
                await token.remove();
            }
        };
        register();

        return () => {
            cancelled = true;
            if (changeTimerRef.current) {
                clearTimeout(changeTimerRef.current);
            }
            // Remove the listener token to prevent orphaned callbacks
            const token = listenerTokenRef.current;
            if (token && typeof token.remove === 'function') {
                token.remove().catch((e: any) =>
                    console.warn('[Inventory] Error removing listener:', e)
                );
            }
            listenerTokenRef.current = null;
        };
    }, [isDbReady, databaseService]);

    const searchItems = useCallback(async (term: string) => {
        if (!databaseService || !isDbReady) return;
        setIsLoading(true);
        try {
            if (term.length > 0) {
                const data = await databaseService.searchInventory(term);
                setItems(data);
            } else {
                const data = await databaseService.getInventoryItems();
                setItems(data);
            }
        } catch (e) {
            console.error('[Inventory] Search error:', e);
        } finally {
            setIsLoading(false);
        }
    }, [databaseService, isDbReady]);

    const debouncedSearch = useCallback(debounce(searchItems, 400), [searchItems]);

    function onSearch(text: string) {
        setSearch(text);
        debouncedSearch(text);
    }

    async function handleDecrement(item: GroceryItem) {
        if (!databaseService || item.stockQty <= 0) return;
        await databaseService.updateStockQuantity(item.id, item.stockQty - 1);
        await loadItems();
    }

    async function handleIncrement(item: GroceryItem) {
        if (!databaseService) return;
        await databaseService.updateStockQuantity(item.id, item.stockQty + 1);
        await loadItems();
    }

    async function handleCreateOrder() {
        if (!reorderItem || !databaseService) return;
        const qty = parseInt(reorderQty, 10);
        if (isNaN(qty) || qty <= 0) {
            Alert.alert('Invalid', 'Please enter a valid order quantity');
            return;
        }
        await databaseService.createOrder(reorderItem, qty);
        Alert.alert('Order Created', `Reorder for ${reorderItem.name} (qty: ${qty}) submitted.`);
        setReorderItem(null);
        setReorderQty('');
    }

    const renderItem = ({ item }: { item: GroceryItem }) => (
        <View style={styles.card}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
                {item.imageURL ? (
                    <Image source={{ uri: item.imageURL }} style={styles.productImage} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="cube-outline" size={36} color="#C7C7CC" />
                    </View>
                )}
            </View>

            {/* Product Info */}
            <Text style={styles.productName} numberOfLines={2}>{item.name || 'Unknown'}</Text>
            <Text style={styles.productPrice}>${(Number(item.price) || 0).toFixed(2)}</Text>

            {/* Inventory Count */}
            <Text style={styles.inventoryLabel}>Inventory Count</Text>
            <Text style={[styles.inventoryCount, { color: getQuantityColor(Number(item.stockQty) || 0) }]}>
                {Number(item.stockQty) || 0}
            </Text>

            {/* +/- Buttons */}
            <View style={styles.qtyButtons}>
                <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleDecrement(item)}
                >
                    <Ionicons name="remove" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleIncrement(item)}
                >
                    <Ionicons name="add" size={20} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {/* Reorder Button */}
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

    // Welcome header with store name
    const storeName = storeConfig?.displayName || 'Store';
    const role = storeConfig?.role || 'Manager';

    return (
        <SafeAreaView style={styles.container}>
            {/* Welcome Header */}
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

            <ThemedSearchBar
                placeholder="Search grocery..."
                onChangeText={onSearch}
                value={search}
            />

            {isLoading ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#FC9C0C" />
                </View>
            ) : items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cube-outline" size={64} color="#C7C7CC" />
                    <Text style={styles.emptyText}>No inventory items found</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    columnWrapperStyle={styles.gridRow}
                />
            )}

            {/* Reorder Modal */}
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
    emptyText: { fontSize: 16, color: '#8E8E93' },
    grid: { paddingHorizontal: CARD_PADDING, paddingBottom: 20, paddingTop: 8 },
    gridRow: { justifyContent: 'space-between', marginBottom: CARD_GAP },
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
    // Modal
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
