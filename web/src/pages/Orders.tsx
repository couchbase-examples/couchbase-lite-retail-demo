import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDatabase } from "@/lib/database/DatabaseProvider";
import type { Order } from "@/lib/database/types";
import { SyncStatus } from "@/components/SyncStatus";
import { ArrowLeft, ClipboardList, Package, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { DocID, LastWriteWins } from "@couchbaselabs/couchbase-lite";
import type { ListenerToken } from "@couchbaselabs/couchbase-lite";
import { getStoredCredentials, getScopeNameFromStoreId } from "@/lib/auth";
import { getUILogger } from "@/lib/logging";

type FilterType = 'all' | 'In Review' | 'Approved';

const Orders = () => {
  const navigate = useNavigate();
  const db = useDatabase();
  const logger = getUILogger();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  // Load orders from database
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      logger.debug('Loading orders from database');
      
      // Get collection name from stored credentials
      const credentials = getStoredCredentials();
      if (!credentials) {
        console.error('No credentials found');
        return;
      }
      const scopeName = getScopeNameFromStoreId(credentials.storeId);
      const ordersCollectionName = `${scopeName}.orders` as any;
      
      const count = await db.collections[ordersCollectionName].count();
      logger.debug(`Orders collection has ${count} documents`);
      
      // Always load ALL orders (no filter in query) - filtering happens in UI
      let queryString = `SELECT * FROM \`${ordersCollectionName}\` ORDER BY orderDate DESC`;
      
      const query = db.createQuery(queryString);
      const orderItems: Order[] = [];
      
      await query.execute((row) => {
        const data = row[ordersCollectionName];
        if (data) {
          orderItems.push(data);
        }
      });
      
      logger.info("Orders loaded from database", {
        count: orderItems.length,
        orders: orderItems
      });
      setOrders(orderItems);
    } catch (error) {
      logger.error("Error loading orders", { error });
    } finally {
      setLoading(false);
    }
  }, [db, logger]);

  // Load orders and set up change listener
  useEffect(() => {
    const credentials = getStoredCredentials();
    if (!credentials) {
      console.error('No credentials found');
      return;
    }
    
    const scopeName = getScopeNameFromStoreId(credentials.storeId);
    const ordersCollectionName = `${scopeName}.orders` as any;
    const ordersCollection = db.collections[ordersCollectionName];
    
    // Load orders initially
    void loadOrders();
    
    // Setting up change listener
    logger.debug("Setting up orders change listener");
    const changeToken: ListenerToken = ordersCollection.addChangeListener((changes) => {
      // Collection change detected - sync has updated documents
      logger.info("Orders collection changed - reloading", {
        changeCount: changes.size,
        changes
      });
      
      // Reload orders when changes are detected
      void loadOrders();
    });
    
    // Cleanup listener on unmount
    return () => {
      logger.debug("Removing orders change listener");
      changeToken.remove();
    };
  }, [db, loadOrders, logger]);

  // Filter orders based on current filter
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === filter);
  
  const inReviewOrders = orders.filter(order => order.orderStatus === 'In Review');
  const approvedOrders = orders.filter(order => order.orderStatus === 'Approved');
  const receivedOrders = orders.filter(order => order.orderStatus === 'Received');

  const handleOrderReceived = async (orderId: string) => {
    try {
      // Get collection name from stored credentials
      const credentials = getStoredCredentials();
      if (!credentials) return;
      const scopeName = getScopeNameFromStoreId(credentials.storeId);
      const ordersCollectionName = `${scopeName}.orders` as any;
      
      // Update in database with conflict resolution
      const collection = db.collections[ordersCollectionName];
      const doc = await collection.getDocument(DocID(orderId));
      if (doc) {
        const updatedDate = Date.now();
        // Create updated document with conflict handler
        const updatedDoc = collection.createDocument(DocID(orderId), {
          ...doc,
          orderStatus: "Received",
          orderDate: updatedDate
        } as any);
        // Use LastWriteWins to automatically resolve conflicts
        await collection.save(updatedDoc, LastWriteWins);
        
        console.log(`Updated order ${orderId} status to Received`);
        
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId 
              ? { ...order, orderStatus: 'Received' as const, orderDate: updatedDate }
              : order
          )
        );
        
        toast.success("Order marked as received", {
          description: "The order has been moved to the received tab",
        });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error("Failed to update order", {
        description: "Please try again",
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const OrderList = ({ orders, showReceiveButton = false }: { orders: Order[], showReceiveButton?: boolean }) => (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Loading orders...</h3>
          <p className="text-muted-foreground">
            Please wait while we fetch your orders.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground">
            {showReceiveButton ? "No submitted orders at this time." : "No received orders yet."}
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="shadow-soft border border-border/50 hover:shadow-medium transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      Order #{order.orderId}
                    </Badge>
                    <Badge 
                      variant={order.orderStatus === 'Received' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {order.orderStatus}
                    </Badge>
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-1">Product #{order.productId}</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">SKU:</span> {order.sku}
                    </div>
                    <div>
                      <span className="font-medium">Quantity:</span> {order.orderQty} {order.unit}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {formatDate(order.orderDate)}
                    </div>
                    <div>
                      <span className="font-medium">Store:</span> {order.storeId}
                    </div>
                  </div>
                </div>

                {showReceiveButton && (order.orderStatus === 'Approved' || order.orderStatus === 'In Review') && (
                  <div className="ml-6">
                    <Button 
                      onClick={() => handleOrderReceived(order.id)}
                      variant="default"
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Order Received
                    </Button>
                  </div>
                )}

                {order.orderStatus === 'Received' && (
                  <div className="ml-6 flex items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Received</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <ClipboardList className="h-5 w-5 text-info" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Orders Management</h1>
                  <p className="text-sm text-muted-foreground">
                    Track and manage inventory replenishment orders
                  </p>
                  <p className="text-xs text-muted-foreground">Store Number: #2847</p>
                </div>
              </div>
            </div>
            <SyncStatus />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-medium border border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-warning mb-2">{inReviewOrders.length}</div>
              <p className="text-sm text-muted-foreground">In Review</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-success mb-2">{approvedOrders.length}</div>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">{orders.length}</div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Card className="shadow-medium border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Order Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">
                  All ({orders.length})
                </TabsTrigger>
                <TabsTrigger value="In Review">
                  In Review ({inReviewOrders.length})
                </TabsTrigger>
                <TabsTrigger value="Approved">
                  Approved ({approvedOrders.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4 mt-4">
                <OrderList orders={filteredOrders} showReceiveButton={false} />
              </TabsContent>
              
              <TabsContent value="In Review" className="space-y-4 mt-4">
                <OrderList orders={filteredOrders} showReceiveButton={false} />
              </TabsContent>
              
              <TabsContent value="Approved" className="space-y-4 mt-4">
                <OrderList orders={filteredOrders} showReceiveButton={false} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Orders;
