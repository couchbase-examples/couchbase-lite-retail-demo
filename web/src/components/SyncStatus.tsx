import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  WifiOff,
  CheckCircle2,
  AlertCircle 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SyncState = 'idle' | 'syncing' | 'offline' | 'error';

export function SyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncState('idle');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setSyncState('offline');
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check if sync is configured
    const syncUrl = import.meta.env.VITE_SYNC_GATEWAY_URL;
    if (!syncUrl || !isOnline) {
      setSyncState('offline');
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  const getStatusConfig = () => {
    switch (syncState) {
      case 'syncing':
        return {
          icon: <RefreshCw className="h-3 w-3 animate-spin" />,
          label: 'Syncing',
          variant: 'secondary' as const,
          color: 'text-blue-600',
        };
      case 'offline':
        return {
          icon: isOnline ? <CloudOff className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />,
          label: isOnline ? 'Offline Mode' : 'No Connection',
          variant: 'secondary' as const,
          color: 'text-gray-600',
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          label: 'Sync Error',
          variant: 'destructive' as const,
          color: 'text-red-600',
        };
      default:
        return {
          icon: <Cloud className="h-3 w-3" />,
          label: 'Synced',
          variant: 'default' as const,
          color: 'text-green-600',
        };
    }
  };

  const config = getStatusConfig();

  const getTooltipContent = () => {
    if (!isOnline) {
      return "You're offline. Changes will sync when you're back online.";
    }
    if (syncState === 'error') {
      return "Sync error occurred. Check console for details.";
    }
    if (syncState === 'offline') {
      return "Running in offline-only mode. Sync not configured.";
    }
    if (lastSyncTime) {
      return `Last synced: ${lastSyncTime.toLocaleTimeString()}`;
    }
    return "Connected to Couchbase Capella";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={config.variant} 
            className={`gap-2 cursor-help ${config.color}`}
          >
            {config.icon}
            <span className="hidden sm:inline">{config.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Optional: Detailed sync status component with more info
export function SyncStatusDetailed() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [stats, setStats] = useState({
    docsInQueue: 0,
    docsSynced: 0,
    lastSync: null as Date | null,
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Sync Status</h3>
        <SyncStatus />
      </div>
      
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Connection:</span>
          <span className={isOnline ? "text-green-600" : "text-red-600"}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
        
        {stats.lastSync && (
          <div className="flex justify-between">
            <span>Last Sync:</span>
            <span>{stats.lastSync.toLocaleTimeString()}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Documents Synced:</span>
          <span>{stats.docsSynced}</span>
        </div>
        
        {stats.docsInQueue > 0 && (
          <div className="flex justify-between">
            <span>Pending:</span>
            <span className="text-yellow-600">{stats.docsInQueue}</span>
          </div>
        )}
      </div>
    </div>
  );
}

