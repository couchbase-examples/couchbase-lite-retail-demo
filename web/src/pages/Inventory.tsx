import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { inventoryData, categories, InventoryItem as InventoryItemType } from "@/lib/mockData";
import InventoryItem from "@/components/InventoryItem";
import { ArrowLeft, Search, Package2 } from "lucide-react";

const Inventory = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItemType[]>(inventoryData);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.includes(searchQuery)
    );
  }, [items, searchQuery]);

  const groupedItems = useMemo(() => {
    const grouped: Record<string, InventoryItemType[]> = {};
    
    filteredItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    // Sort categories alphabetically and items within each category
    const sortedGrouped: Record<string, InventoryItemType[]> = {};
    Object.keys(grouped)
      .sort()
      .forEach(category => {
        sortedGrouped[category] = grouped[category].sort((a, b) => a.name.localeCompare(b.name));
      });

    return sortedGrouped;
  }, [filteredItems]);

  const handleCountChange = (id: string, newCount: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, count: newCount } : item
      )
    );
  };

  const totalItems = filteredItems.length;
  const lowStockItems = filteredItems.filter(item => item.count <= 10).length;

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
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Inventory Management</h1>
                  <p className="text-sm text-muted-foreground">
                    {totalItems} items • {lowStockItems} low stock
                  </p>
                  <p className="text-xs text-muted-foreground">Store Number: #2847</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Search and Stats */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items, categories, ID, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            
            <div className="flex gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {Object.keys(groupedItems).length} Categories
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {totalItems} Items
              </Badge>
              {lowStockItems > 0 && (
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  {lowStockItems} Low Stock
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Inventory Categories */}
        <div className="space-y-8">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-12">
              <Package2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query or check back later.
              </p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, categoryItems]) => (
              <Card key={category} className="shadow-medium border border-border/50">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-xl">{category}</span>
                    <Badge variant="outline" className="text-sm">
                      {categoryItems.length} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryItems.map((item) => (
                      <InventoryItem
                        key={item.id}
                        item={item}
                        onCountChange={handleCountChange}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Inventory;