import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  IonAlert, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonPage,
  IonRefresher, IonRefresherContent, IonSearchbar, IonToolbar,
} from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useApp } from '../providers/AppProvider';
import { GroceryItem } from '../models/GroceryItem';

const InventoryPage: React.FC = () => {
  const { user, db, syncState } = useApp();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [search, setSearch] = useState('');
  const [reorderItem, setReorderItem] = useState<GroceryItem | null>(null);

  // Index for fast lookup-by-id (so + / − don't re-query the full collection).
  const itemsById = useMemo(() => {
    const m = new Map<string, GroceryItem>();
    items.forEach(i => m.set(i.id, i));
    return m;
  }, [items]);

  const reload = useCallback(async (text = search) => {
    try {
      const rows = text.trim()
        ? await db.searchInventory(text)
        : await db.getAllInventory();
      setItems(rows);
    } catch (e) { console.error('[Inventory] load failed', e); }
  }, [db, search]);

  // Initial load + subscribe to changes for targeted updates.
  // We read the current items + search via refs so the change-listener
  // closure never sees stale state from the moment useEffect ran.
  const itemsRef = useRef<GroceryItem[]>([]);
  const searchRef = useRef<string>('');
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { searchRef.current = search; }, [search]);

  useEffect(() => {
    void reload('');
    const unsub = db.onInventoryChanged(async (changedIds) => {
      console.log('[Inventory] change event for ids:', changedIds);
      const current = itemsRef.current;
      const known = new Set(current.map(i => i.id));
      const anyMissing = changedIds.some(id => !known.has(id));
      if (anyMissing || current.length === 0) {
        void reload(searchRef.current);
        return;
      }
      try {
        const patched: GroceryItem[] = [];
        for (const item of current) {
          if (changedIds.includes(item.id)) {
            const fresh = await db.getInventoryItem(item.id);
            patched.push(fresh ?? item);
          } else {
            patched.push(item);
          }
        }
        setItems(patched);
      } catch (e) { console.error('[Inventory] patch failed', e); }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  // Fallback for remote sync: cbl-ionic's collection change listener doesn't
  // always fire for *pulled* docs (only local saves). Watch the replicator's
  // status — every time it returns to IDLE after BUSY, a pull batch just
  // finished; re-query the local DB so the UI picks up the new data.
  const prevSyncRef = useRef(syncState);
  useEffect(() => {
    if (prevSyncRef.current === 'BUSY' && syncState === 'IDLE') {
      console.log('[Inventory] pull batch complete — reloading');
      void reload(searchRef.current);
    }
    prevSyncRef.current = syncState;
  }, [syncState, reload]);


  const adjustQty = async (id: string, delta: number) => {
    const current = itemsById.get(id);
    if (!current) return;
    const next = Math.max(0, current.quantity + delta);
    if (next === current.quantity) return;
    // Optimistic UI — bump the in-memory copy immediately
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: next } : i));
    try { await db.updateQuantity(id, next); }
    catch (e) { console.error('[Inventory] updateQuantity failed', e); }
  };

  const submitReorder = async (qty: number) => {
    if (!reorderItem || !Number.isFinite(qty) || qty <= 0) {
      setReorderItem(null);
      return;
    }
    try { await db.createOrder(reorderItem, qty); }
    catch (e) { console.error('[Inventory] createOrder failed', e); }
    setReorderItem(null);
  };

  return (
    <IonPage>
      <IonHeader collapse="condense" className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <div className="page-header-row">
            <span className="welcome-label">Welcome!</span>
            <span className="role-badge">{user?.role ?? 'Store Manager'}</span>
          </div>
          <h1 className="page-title">Grocery Inventory</h1>
        </IonToolbar>
      </IonHeader>

      <IonContent className="page-content">
        <IonHeader collapse="condense" className="ion-no-border">
          <IonToolbar className="page-toolbar">
            <div className="page-header-row">
              <span className="welcome-label">Welcome!</span>
              <span className="role-badge">{user?.role ?? 'Store Manager'}</span>
            </div>
            <h1 className="page-title">Grocery Inventory</h1>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={async e => {
          await reload();
          e.detail.complete();
        }}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="search-wrap">
          <IonItem lines="none" className="search-pill">
            <IonIcon slot="start" icon={searchOutline} />
            <IonInput
              value={search}
              placeholder="Search"
              onIonInput={e => {
                const v = e.detail.value ?? '';
                setSearch(v);
                void reload(v);
              }}
            />
          </IonItem>
        </div>

        {items.length === 0
          ? <div className="empty-state">
              No inventory yet — pull to refresh once App Services has synced data.
            </div>
          : <div className="inventory-grid">
              {items.map(item => (
                <InventoryTile
                  key={item.id}
                  item={item}
                  onMinus={() => adjustQty(item.id, -1)}
                  onPlus={() => adjustQty(item.id, +1)}
                  onReorder={() => setReorderItem(item)}
                />
              ))}
            </div>}
      </IonContent>

      <IonAlert
        isOpen={!!reorderItem}
        header="Re-order Stock"
        message={reorderItem ? `Re-order: ${reorderItem.name}` : ''}
        inputs={[{ name: 'qty', type: 'number', placeholder: 'Quantity', value: 100, min: 1 }]}
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: () => setReorderItem(null) },
          { text: 'Order',  handler: ({ qty }) => submitReorder(parseInt(qty, 10)) },
        ]}
        onDidDismiss={() => setReorderItem(null)}
      />
    </IonPage>
  );
};

const InventoryTile: React.FC<{
  item: GroceryItem;
  onMinus: () => void;
  onPlus: () => void;
  onReorder: () => void;
}> = ({ item, onMinus, onPlus, onReorder }) => (
  <div className="inventory-tile">
    <div className="tile-image-wrap">
      {item.imageURL
        ? <img
            src={item.imageURL}
            alt={item.name}
            // Capacitor's WKWebView serves the app from capacitor://localhost,
            // which leaks into the Referer. The no-referrer policy strips it.
            // (Do NOT set crossOrigin here — it forces a CORS preflight that
            // neither Cloudinary nor S3 honour for raw image GETs.)
            referrerPolicy="no-referrer"
          />
        : <div className="tile-image-placeholder" />}
    </div>
    <div className="tile-name">{item.name}</div>
    <div className="tile-price">Price: ${item.price.toFixed(2)}</div>
    <div className="tile-inv-label">Inventory Count</div>
    <div className="tile-qty">{item.quantity}</div>
    <div className="tile-circle-row">
      <button className="circle-button" onClick={onMinus}>−</button>
      <button className="circle-button" onClick={onPlus}>+</button>
    </div>
    <button className="primary-button tile-reorder" onClick={onReorder}>
      Re-order now
    </button>
  </div>
);

export default InventoryPage;
