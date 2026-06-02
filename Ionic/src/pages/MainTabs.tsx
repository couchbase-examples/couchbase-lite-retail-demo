import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs,
} from '@ionic/react';
import {
  cartOutline, cubeOutline, settingsOutline, storefrontOutline,
} from 'ionicons/icons';
import InventoryPage from './InventoryPage';
import OrdersPage from './OrdersPage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';

/** Bottom tab navigator — Ionic's IonTabs gives us the iOS-style bar for free. */
const MainTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/tabs/inventory" component={InventoryPage} />
      <Route exact path="/tabs/orders"    component={OrdersPage} />
      <Route exact path="/tabs/profile"   component={ProfilePage} />
      <Route exact path="/tabs/settings"  component={SettingsPage} />
      <Route exact path="/tabs"><Redirect to="/tabs/inventory" /></Route>
    </IonRouterOutlet>

    <IonTabBar slot="bottom" className="ios-tabbar">
      <IonTabButton tab="inventory" href="/tabs/inventory">
        <IonIcon icon={cartOutline} />
        <IonLabel>Inventory</IonLabel>
      </IonTabButton>
      <IonTabButton tab="orders" href="/tabs/orders">
        <IonIcon icon={cubeOutline} />
        <IonLabel>Orders</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/tabs/profile">
        <IonIcon icon={storefrontOutline} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
      <IonTabButton tab="settings" href="/tabs/settings">
        <IonIcon icon={settingsOutline} />
        <IonLabel>Settings</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default MainTabs;
