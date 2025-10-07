import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package2, ShoppingCart, ClipboardList, LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const tiles = [
    {
      id: "inventory",
      title: "Inventory",
      icon: Package2,
      description: "Manage stock levels and count inventory",
      color: "bg-primary text-primary-foreground",
      path: "/inventory"
    },
    {
      id: "merchandising", 
      title: "Merchandising",
      icon: ShoppingCart,
      description: "Product displays and promotions",
      color: "bg-accent text-accent-foreground",
      path: "/merchandising"
    },
    {
      id: "orders",
      title: "Orders", 
      icon: ClipboardList,
      description: "Track orders and replenishment",
      color: "bg-info text-info-foreground",
      path: "/orders"
    }
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm shadow-soft">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Inventory Pro</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Employee</p>
              <p className="text-xs text-muted-foreground">Store Number: #2847</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Select an Application</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from the available modules to manage your retail operations efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Card 
                key={tile.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-strong hover:scale-105 border-0 shadow-medium"
                onClick={() => navigate(tile.path)}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-2xl ${tile.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{tile.title}</h3>
                    <p className="text-muted-foreground">{tile.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;