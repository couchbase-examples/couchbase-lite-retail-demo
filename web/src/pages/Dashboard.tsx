import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SyncStatus } from "@/components/SyncStatus";
import { Package2, ShoppingCart, ClipboardList, LogOut } from "lucide-react";
import { useDatabase } from "@/lib/database/DatabaseProvider";
import { getStoredCredentials, clearCredentials, getScopeNameFromStoreId } from "@/lib/auth";
import { DocID } from "@couchbase/lite-js";
import { startContinuousSync } from "@/main";
import type { StoreProfile } from "@/lib/database/types";
import { convertCBLToPlain } from "@/lib/database/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const db = useDatabase();
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication and load store profile
  useEffect(() => {
    const credentials = getStoredCredentials();
    
    // Redirect to login if not authenticated
    if (!credentials) {
      console.log('⚠️ No credentials found - redirecting to login');
      navigate("/");
      return;
    }

    // Load store profile from database using direct KV read
    const loadStoreProfile = async () => {
      try {
        setLoading(true);
        console.log('📊 Loading store profile...');
        
        // Get fully qualified collection name
        const scopeName = getScopeNameFromStoreId(credentials.storeId);
        const profileCollectionName = `${scopeName}.profile` as any;
        
        // Construct profile document ID (e.g., "nyc-store-01-profile")
       // const profileDocId = `${scopeName}::profile::${credentials.storeId}`;
        const profileDocId = `${credentials.storeId}-profile`;
        
        console.log(`🗒️ Reading profile document: ${profileDocId}`);
        
        // Direct KV read - much more efficient than query for single document
        const profile = await db.collections[profileCollectionName].getDocument(DocID(profileDocId));
        
        if (profile) {
          console.log('✅ Store profile loaded:', profile);
          // Convert Couchbase Lite objects to plain JavaScript values
          const plainProfile = convertCBLToPlain(profile);
          setStoreProfile(plainProfile as StoreProfile);
        } else {
          console.log('⚠️ No store profile found in database');
        }
      } catch (error) {
        console.error('❌ Error loading store profile:', error);
      } finally {
        setLoading(false);
      }
    };

    // Start continuous sync for inventory and orders
    const initSync = async () => {
      console.log('🔄 Dashboard: Checking if replicator exists...');
      if (!(window as any).__replicator) {
        console.log('🚀 Dashboard: Starting continuous sync...');
        await startContinuousSync(db);
      } else {
        console.log('✅ Dashboard: Replicator already exists');
      }
    };

    void loadStoreProfile();
    void initSync();
  }, [navigate, db]);

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
    // Clear stored credentials
    clearCredentials();
    
    // Stop sync if running
    const replicator = (window as any).__replicator;
    if (replicator) {
      try {
        // Note: Replicator doesn't have a stop() method in this SDK version
        // It will stop automatically when the page reloads
        console.log('🔄 Replicator will stop on logout');
      } catch (error) {
        console.error('Error stopping replicator:', error);
      }
    }
    
    // Redirect to login
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
              <h1 className="text-xl font-bold">
                {loading ? 'Inventory Pro' : (storeProfile?.name || 'Inventory Pro')}
              </h1>
              <p className="text-xs text-muted-foreground">
                {loading ? '' : storeProfile ? 
                  `Store ID: ${storeProfile.storeId}` : 
                  'Store Number: #2847'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SyncStatus />
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
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