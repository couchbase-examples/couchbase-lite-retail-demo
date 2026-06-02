import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  IonContent, IonHeader, IonPage, IonToolbar,
} from '@ionic/react';
import { useApp } from '../providers/AppProvider';
import { Order, OrderStatus } from '../models/Order';

const FILTERS: ('All' | OrderStatus)[] = ['All', 'Submitted', 'In Review', 'Approved'];

const OrdersPage: React.FC = () => {
  const { db } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'All' | OrderStatus>('All');

  const reload = useCallback(async () => {
    try { setOrders(await db.getAllOrders()); }
    catch (e) { console.error('[Orders] load failed', e); }
  }, [db]);

  useEffect(() => {
    void reload();
    return db.onOrdersChanged(() => { void reload(); });
  }, [db, reload]);

  const filtered = useMemo(() =>
    filter === 'All' ? orders : orders.filter(o => o.orderStatus === filter),
  [orders, filter]);

  return (
    <IonPage>
      <IonHeader collapse="condense" className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <h1 className="page-title">Orders</h1>
        </IonToolbar>
      </IonHeader>
      <IonContent className="page-content">
        <IonHeader collapse="condense" className="ion-no-border">
          <IonToolbar className="page-toolbar">
            <h1 className="page-title">Orders</h1>
          </IonToolbar>
        </IonHeader>

        <div className="chips-row">
          {FILTERS.map(f => (
            <button
              key={f}
              className={'filter-chip' + (filter === f ? ' filter-chip-active' : '')}
              onClick={() => setFilter(f)}
            >{f}</button>
          ))}
        </div>

        {filtered.length === 0
          ? <div className="empty-state">No orders yet — re-order stock from the Inventory tab.</div>
          : <div className="orders-list">
              {filtered.map(o => <OrderRow key={o.id} order={o} />)}
            </div>}
      </IonContent>
    </IonPage>
  );
};

const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
  const date = order.orderDate
    ? new Date(order.orderDate).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
      })
    : '';
  const unit = order.unit ? ` ${order.unit}` : '';
  const title = `Order #${order.orderId}` + (order.sku ? `  ·  SKU ${order.sku}` : '');

  return (
    <div className="order-row">
      <div>
        <div className="order-name">{title}</div>
        <div className="order-meta">{date}  ·  Qty {order.orderQty}{unit}</div>
      </div>
      <span className={`status-pill status-${slugify(order.orderStatus)}`}>
        {order.orderStatus}
      </span>
    </div>
  );
};

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

export default OrdersPage;
