import React from 'react';
import {
  IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle,
  IonToolbar,
} from '@ionic/react';
import { arrowForwardOutline } from 'ionicons/icons';
import { DEMO_USERS, DemoUser } from '../models/User';

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
  onUse: (username: string, password: string) => void;
}

const DemoCredentialsModal: React.FC<Props> = ({ isOpen, onDismiss, onUse }) => (
  <IonModal isOpen={isOpen} onDidDismiss={onDismiss}
            initialBreakpoint={0.85} breakpoints={[0, 0.85, 1]}>
    <IonHeader>
      <IonToolbar className="demo-toolbar">
        <IonTitle>Demo Credentials</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={onDismiss}>Done</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent className="demo-content">
      <p className="section-header">DEMO USER ACCOUNTS — TAP TO LOGIN</p>
      <div className="demo-card">
        {DEMO_USERS.map((u, i) => (
          <React.Fragment key={u.username}>
            <CredentialRow user={u} onUse={() => onUse(u.username, u.password)} />
            {i < DEMO_USERS.length - 1 && <div className="cred-separator" />}
          </React.Fragment>
        ))}
      </div>

      <p className="section-header">INSTRUCTIONS</p>
      <div className="demo-card instructions-card">
        <p>• Tap any credential above to auto-login</p>
        <p>• Each user has different role permissions</p>
        <p>• Session persists until logout</p>
      </div>
    </IonContent>
  </IonModal>
);

const CredentialRow: React.FC<{ user: DemoUser; onUse: () => void }> = ({ user, onUse }) => (
  <div className="cred-row" onClick={onUse}>
    <div className="cred-row-top">
      <div className="cred-email">{user.username}</div>
      <span className="cred-role-pill">Store Manager</span>
      <button className="cred-arrow" onClick={e => { e.stopPropagation(); onUse(); }}>
        <IonIcon icon={arrowForwardOutline} />
      </button>
    </div>
    <div className="cred-description">{user.label}</div>
    <div className="cred-endpoint">Endpoint: {user.endpoint}</div>
    <div className="cred-password">Password: {user.password}</div>
  </div>
);

export default DemoCredentialsModal;
