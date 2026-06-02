import React from 'react';
import {
  IonButton, IonContent, IonHeader, IonPage, IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useApp } from '../providers/AppProvider';

const SettingsPage: React.FC = () => {
  const { user, config, syncState, sync, logout } = useApp();
  const history = useHistory();

  const toggleSync = async () => {
    if (syncState === 'STOPPED') {
      if (config) await sync.start(config);
    } else {
      await sync.stop();
    }
  };

  const handleSignOut = async () => {
    await logout();
    history.replace('/login');
  };

  const stateClass = stateClassFor(syncState);

  return (
    <IonPage>
      <IonHeader collapse="condense" className="ion-no-border">
        <IonToolbar className="page-toolbar">
          <h1 className="page-title">Settings</h1>
        </IonToolbar>
      </IonHeader>
      <IonContent className="page-content">
        <IonHeader collapse="condense" className="ion-no-border">
          <IonToolbar className="page-toolbar">
            <h1 className="page-title">Settings</h1>
          </IonToolbar>
        </IonHeader>

        <p className="section-header">SYNC STATUS</p>
        <div className="profile-card">
          <div className={`sync-state-label ${stateClass}`}>Sync: {syncState}</div>
          <div className="sync-meta">Endpoint: {config?.syncUrl ?? '—'}</div>
          {syncState === 'ERROR' && sync.getLastError() && (
            <div className="sync-error">{sync.getLastError()}</div>
          )}
        </div>

        <div className="settings-button-row">
          <IonButton className="secondary-button" onClick={toggleSync}>
            {syncState === 'STOPPED' ? 'Start sync' : 'Stop sync'}
          </IonButton>
        </div>

        <p className="section-header">ACCOUNT</p>
        <div className="profile-card">
          <div className="profile-field-value">
            {user ? `${user.username}  ·  ${user.role}` : '—'}
          </div>
        </div>

        <div className="settings-spacer" />

        <IonButton expand="block" className="danger-button" onClick={handleSignOut}>
          Sign Out
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

function stateClassFor(state: string): string {
  switch (state) {
    case 'IDLE':
    case 'BUSY':       return 'state-ok';
    case 'CONNECTING':
    case 'OFFLINE':    return 'state-pending';
    case 'ERROR':      return 'state-error';
    default:           return 'state-stopped';
  }
}

export default SettingsPage;
