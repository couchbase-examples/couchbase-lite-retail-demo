import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InventoryItem as InventoryItemType } from "@/lib/mockData";
import { Minus, Plus, Package } from "lucide-react";
import { toast } from "sonner";

interface InventoryItemProps {
  item: InventoryItemType;
  onCountChange: (id: string, newCount: number) => void;
}

const InventoryItem = ({ item, onCountChange }: InventoryItemProps) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleCountChange = (increment: boolean) => {
    const newCount = increment ? item.count + 1 : Math.max(0, item.count - 1);
    onCountChange(item.id, newCount);
  };

  const handleReorder = () => {
    setShowAlert(true);
    toast.success("Item replenishment order has been made", {
      description: `Order placed for ${item.name}`,
    });
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getCountColor = (count: number) => {
    if (count <= 10) return "text-destructive font-bold";
    if (count <= 20) return "text-warning font-semibold";
    return "text-success font-semibold";
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-medium hover:scale-105 border border-border/50">
      {showAlert && (
        <div className="absolute inset-0 bg-success/95 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center text-success-foreground">
            <Package className="h-8 w-8 mx-auto mb-2" />
            <p className="font-semibold">Order Placed!</p>
            <p className="text-sm">Replenishment order has been made</p>
          </div>
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          {/* Item Image */}
          <div className="w-full h-32 bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<Package className="h-12 w-12 text-muted-foreground" />`;
              }}
            />
          </div>

          {/* Item Info */}
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold text-lg">{item.name}</h4>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium">ID:</span> {item.id}</p>
              <p><span className="font-medium">Barcode:</span> {item.barcode}</p>
              <p><span className="font-medium">Price:</span> ${item.price.toFixed(2)}</p>
            </div>

            {/* Count Display */}
            <div className="py-3">
              <div className="text-center mb-3">
                <p className="text-sm font-medium mb-1">Inventory Count</p>
                <div className={`text-4xl font-extrabold ${getCountColor(item.count)}`}>
                  {item.count}
                </div>
                {item.count <= 10 && (
                  <Badge variant="destructive" className="mt-1 text-xs">
                    Low Stock
                  </Badge>
                )}
              </div>

              {/* Count Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCountChange(false)}
                  disabled={item.count === 0}
                  className="h-8 w-8 rounded-full"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCountChange(true)}
                  className="h-8 w-8 rounded-full"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Reorder Button */}
            <Button 
              onClick={handleReorder}
              className="w-full"
              size="sm"
            >
              Re-order now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryItem;