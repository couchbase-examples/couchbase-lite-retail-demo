export interface Order {
    id: string;
    docType: string;
    orderId: number;
    storeId: string;
    orderDate: number;       // epoch millis
    orderStatus: string;     // "In Review" | "Approved" | "Submitted"
    productId: number;
    sku: string;
    unit: string;
    orderQty: number;
}

/**
 * Format order date from epoch milliseconds to a readable string.
 */
export function formatOrderDate(epochMs: number): string {
    const date = new Date(epochMs);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Returns the status badge color for an order status.
 */
export function getOrderStatusColor(status: string): string {
    switch (status) {
        case 'Approved':
            return '#34C759';   // green
        case 'In Review':
            return '#007AFF';   // blue
        case 'Submitted':
            return '#FF9500';   // orange
        default:
            return '#8E8E93';   // gray
    }
}
