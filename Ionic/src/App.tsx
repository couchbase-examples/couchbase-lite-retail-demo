import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { AppProvider, useApp } from './providers/AppProvider';
import LoginPage from './pages/LoginPage';
import MainTabs from './pages/MainTabs';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';
import './theme/app.css';

setupIonicReact({ mode: 'ios' });

/** Top-level routes — gated on auth state from the provider. */
const RoutedApp: React.FC = () => {
  const { user } = useApp();
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login">
          {user ? <Redirect to="/tabs/inventory" /> : <LoginPage />}
        </Route>
        <Route path="/tabs">
          {user ? <MainTabs /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/">
          <Redirect to={user ? '/tabs/inventory' : '/login'} />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AppProvider>
      <RoutedApp />
    </AppProvider>
  </IonApp>
);

export default App;
