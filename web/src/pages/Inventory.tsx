import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDatabase } from "@/lib/database/DatabaseProvider";
import type { InventoryItem as InventoryItemType } from "@/lib/database/types";
import InventoryItem from "@/components/InventoryItem";
import { SyncStatus } from "@/components/SyncStatus";
import { ArrowLeft, Search, Package2 } from "lucide-react";
import { DocID, LastWriteWins, type ListenerToken } from "@couchbaselabs/couchbase-lite";
import { getStoredCredentials, getScopeNameFromStoreId } from "@/lib/auth";
import { getUILogger } from "@/lib/logging";

const Inventory = () => {
  const navigate = useNavigate();
  const db = useDatabase();
  const logger = getUILogger();
  const [items, setItems] = useState<InventoryItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.includes(searchQuery) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Load items from database
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      logger.debug("Loading inventory from database");
      
      // Get collection name from stored credentials
      const credentials = getStoredCredentials();
      if (!credentials) {
        logger.error("No credentials found");
        return;
      }
      const scopeName = getScopeNameFromStoreId(credentials.storeId);
      const inventoryCollectionName = `${scopeName}.inventory` as any;
      
      // Check collection count first
      const count = await db.collections[inventoryCollectionName].count();
      logger.debug("Inventory collection document count", { count });
      
      const query = db.createQuery(`SELECT * FROM \`${inventoryCollectionName}\``);
      const inventoryItems: InventoryItemType[] = [];
      
      await query.execute((row) => {
        // Extract collection data from row
        const data = row[inventoryCollectionName];
        if (data) {
          inventoryItems.push(data as unknown as InventoryItemType);
        }
      });
      
      logger.info("Inventory items loaded from database", { 
        count: inventoryItems.length 
      });
      setItems(inventoryItems);
    } catch (error) {
      logger.error("Error loading inventory", { error });
    } finally {
      setLoading(false);
    }
  }, [db, logger]);

  // Load items and set up change listener
  useEffect(() => {
    const credentials = getStoredCredentials();
    if (!credentials) {
      logger.error("No credentials found");
      return;
    }
    
    const scopeName = getScopeNameFromStoreId(credentials.storeId);
    const inventoryCollectionName = `${scopeName}.inventory` as any;
    const inventoryCollection = db.collections[inventoryCollectionName];
    
    // Load items initially
    void loadItems();
    
    // Set up change listener to reload when data changes
    logger.debug("Setting up inventory change listener");
    const changeToken: ListenerToken = inventoryCollection.addChangeListener((changes) => {
      logger.info("Inventory collection changed - reloading", {
        changeCount: changes.size
      });
      
      // Reload items when changes are detected (from sync or local updates)
      void loadItems();
    });
    
    // Cleanup listener on unmount
    return () => {
      logger.debug("Removing inventory change listener");
      changeToken.remove();
    };
  }, [db, logger, loadItems]);

  const handleCountChange = async (id: string, newCount: number) => {
    logger.debug("Inventory count change requested", { id, newCount });
    
    try {
      // Get collection name from stored credentials
      const credentials = getStoredCredentials();
      if (!credentials) return;
      const scopeName = getScopeNameFromStoreId(credentials.storeId);
      const inventoryCollectionName = `${scopeName}.inventory` as any;
      
      // Check replicator status before saving
      const replicator = (window as any).__replicator;
      if (replicator) {
        const status = replicator.currentStatus || replicator.status;
        logger.info("Replicator status before document save", {
          activity: status?.activity || status?.status,
          status: JSON.stringify(status)
        });
      } else {
        logger.warn("No replicator found - changes will not sync!");
      }
      
      // Update in database using conflict-safe pattern
      const collection = db.collections[inventoryCollectionName];
      const existingDoc = await collection.getDocument(DocID(id));
      
      if (existingDoc) {
        // Create a new document with updated values
        const updatedData = {
          ...existingDoc,
          stockQty: newCount,
          lastUpdated: Date.now()
        };
        
        // Create new document instance and save with LastWriteWins conflict handler
        const docToSave = collection.createDocument(DocID(id), updatedData as any);
        await collection.save(docToSave, LastWriteWins);
        
        logger.info("Document saved to collection", { 
          id, 
          newStockQty: newCount,
          message: "CBL should now notify pusher automatically"
        });
        
        // With continuous replication, the pusher should be automatically notified
        // when save() is called. Watch console for "Notifying Pusher of changes" message.
        
        // Update local state
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, stockQty: newCount, lastUpdated: Date.now() } : item
          )
        );
      }
    } catch (error) {
      logger.error("Error updating inventory count", { id, error });
    }
  };

  const totalItems = filteredItems.length;

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
                    {totalItems} items
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
            </div>
          </div>
        </div>

        {/* Inventory Categories */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-12">
              <Package2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Loading inventory...</h3>
              <p className="text-muted-foreground">
                Please wait while we fetch your items.
              </p>
            </div>
          ) : Object.keys(groupedItems).length === 0 ? (
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