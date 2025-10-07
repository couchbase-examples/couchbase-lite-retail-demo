import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ordersData, Order } from "@/lib/mockData";
import { ArrowLeft, ClipboardList, Package, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(ordersData);

  const submittedOrders = orders.filter(order => order.status === 'submitted');
  const receivedOrders = orders.filter(order => order.status === 'received');

  const handleOrderReceived = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId 
          ? { ...order, status: 'received' as const, date: new Date().toISOString().split('T')[0] }
          : order
      )
    );
    
    toast.success("Order marked as received", {
      description: "The order has been moved to the received tab",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const OrderList = ({ orders, showReceiveButton = false }: { orders: Order[], showReceiveButton?: boolean }) => (
    <div className="space-y-4">
      {orders.length === 0 ? (
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
                      {order.id}
                    </Badge>
                    <Badge 
                      variant={order.status === 'received' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-1">{order.itemName}</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Item ID:</span> {order.itemId}
                    </div>
                    <div>
                      <span className="font-medium">Quantity:</span> {order.count} units
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {formatDate(order.date)}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-1 capitalize ${order.status === 'received' ? 'text-success' : 'text-warning'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {showReceiveButton && order.status === 'submitted' && (
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

                {order.status === 'received' && (
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