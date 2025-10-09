import { useState, useEffect } from "react";
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
import { DocID } from "@couchbaselabs/couchbase-lite";

const Orders = () => {
  const navigate = useNavigate();
  const db = useDatabase();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Load orders from database
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        console.log('Loading orders from database...');
        
        const count = await db.collections.orders.count();
        console.log(`Orders collection has ${count} documents`);
        
        const query = db.createQuery('SELECT * FROM orders');
        const orderItems: Order[] = [];
        
        await query.execute((row) => {
          console.log('Order row:', row);
          if (row.orders) {
            orderItems.push(row.orders);
          }
        });
        
        console.log(`Loaded ${orderItems.length} orders`, orderItems);
        setOrders(orderItems);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, [db]);

  const submittedOrders = orders.filter(order => order.orderStatus === 'Submitted');
  const receivedOrders = orders.filter(order => order.orderStatus === 'Received');

  const handleOrderReceived = async (orderId: string) => {
    try {
      // Update in database
      const doc = await db.collections.orders.getDocument(DocID(orderId));
      if (doc) {
        const updatedDate = Date.now();
        // Modify the document directly (it's a plain JavaScript object)
        doc.orderStatus = "Received";
        doc.orderDate = updatedDate;
        await db.collections.orders.save(doc);
        
        console.log(`Updated order ${orderId} status to Received`);
        
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId 
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
          <Card key={order._id} className="shadow-soft border border-border/50 hover:shadow-medium transition-shadow">
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

                {showReceiveButton && order.orderStatus === 'Submitted' && (
                  <div className="ml-6">
                    <Button 
                      onClick={() => handleOrderReceived(order._id)}
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
              <div className="text-2xl font-bold text-warning mb-2">{submittedOrders.length}</div>
              <p className="text-sm text-muted-foreground">Submitted Orders</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-success mb-2">{receivedOrders.length}</div>
              <p className="text-sm text-muted-foreground">Received Orders</p>
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
            <Tabs defaultValue="submitted" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="submitted" className="gap-2">
                  <Package className="h-4 w-4" />
                  Submitted ({submittedOrders.length})
                </TabsTrigger>
                <TabsTrigger value="received" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Received ({receivedOrders.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="submitted" className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Orders in Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    These orders have been submitted and are awaiting delivery. 
                    Click "Order Received" when items arrive.
                  </p>
                </div>
                <OrderList orders={submittedOrders} showReceiveButton={true} />
              </TabsContent>
              
              <TabsContent value="received" className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Completed Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    These orders have been received and added to your inventory.
                  </p>
                </div>
                <OrderList orders={receivedOrders} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Orders;