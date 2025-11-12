import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wifi, WifiOff } from "lucide-react";
import { isOfflineMode, toggleOfflineMode } from "@/lib/database/syncControl";
import { toast } from "sonner";

export function OfflineToggle() {
  const [isOffline, setIsOffline] = useState(isOfflineMode());

  // Check offline mode on mount
  useEffect(() => {
    setIsOffline(isOfflineMode());
  }, []);

  const handleToggle = () => {
    const success = toggleOfflineMode();
    
    if (success) {
      const newOfflineState = !isOffline;
      setIsOffline(newOfflineState);
      
      if (newOfflineState) {
        toast.info("Offline Mode", {
          description: "Sync stopped. Changes will be stored locally.",
        });
      } else {
        toast.success("Online Mode", {
          description: "Sync resumed. Syncing changes now.",
        });
      }
    } else {
      toast.error("Failed to toggle sync mode", {
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
      {isOffline ? (
        <WifiOff className="h-4 w-4 text-orange-500" />
      ) : (
        <Wifi className="h-4 w-4 text-green-500" />
      )}
      
      <div className="flex items-center space-x-2">
        <Label 
          htmlFor="offline-mode" 
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          {isOffline ? "Offline" : "Online"}
        </Label>
        <Switch
          id="offline-mode"
          checked={!isOffline}
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-green-500"
        />
      </div>
    </div>
  );
}

