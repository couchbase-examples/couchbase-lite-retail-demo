import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InventoryItem } from "@/lib/database/types";

interface ReorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem;
  onConfirm: (quantity: number) => void;
}

export function ReorderDialog({ open, onOpenChange, item, onConfirm }: ReorderDialogProps) {
  const [quantity, setQuantity] = useState("100");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(qty);
      onOpenChange(false);
      setQuantity("100");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>Place a replenishment order for {item.name}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right">Product</Label>
              <div className="col-span-2 text-sm">{item.name}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right">SKU</Label>
              <div className="col-span-2 text-sm">{item.sku}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right">Unit</Label>
              <div className="col-span-2 text-sm">{item.unit}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity *</Label>
              <Input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} onKeyPress={handleKeyPress} className="col-span-2" autoFocus />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right">Status</Label>
              <div className="col-span-2 text-sm font-medium text-blue-600">In Review</div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !quantity || parseInt(quantity) <= 0}>{isSubmitting ? "Creating..." : "Create Order"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
