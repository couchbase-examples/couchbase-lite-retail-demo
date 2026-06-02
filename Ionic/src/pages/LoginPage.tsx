import React, { useState } from 'react';
import {
  IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonNote,
  IonPage, IonSpinner, IonText,
} from '@ionic/react';
import {
  arrowForwardOutline, cartOutline, eyeOffOutline, eyeOutline,
  informationCircleOutline, lockClosedOutline, personOutline,
} from 'ionicons/icons';
import { useApp } from '../providers/AppProvider';
import DemoCredentialsModal from './DemoCredentialsModal';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDemoSheet, setShowDemoSheet] = useState(false);

  const submit = async (u = username, p = password) => {
    setError(null);
    setSubmitting(true);
    const result = await login(u, p);
    setSubmitting(false);
    if (!result.success) setError(result.errorMessage ?? 'Login failed');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content" scrollY={false}>
        <div className="login-root">

          <div className="login-hero">
            <IonIcon icon={cartOutline} className="login-cart" />
            <h1 className="login-title">Grocery Inventory</h1>
            <p className="login-subtitle">Management System</p>
          </div>

          <div className="login-form">
            <IonLabel className="field-label">Username</IonLabel>
            <IonItem lines="none" className="input-pill">
              <IonIcon slot="start" icon={personOutline} className="input-icon" />
              <IonInput
                value={username}
                placeholder="Enter username"
                onIonInput={e => setUsername(e.detail.value ?? '')}
                inputmode="email"
              />
            </IonItem>

            <IonLabel className="field-label">Password</IonLabel>
            <IonItem lines="none" className="input-pill">
              <IonIcon slot="start" icon={lockClosedOutline} className="input-icon" />
              <IonInput
                value={password}
                placeholder="Enter password"
                type={showPassword ? 'text' : 'password'}
                onIonInput={e => setPassword(e.detail.value ?? '')}
                onKeyDown={e => { if (e.key === 'Enter') submit(); }}
              />
              <IonIcon
                slot="end"
                icon={showPassword ? eyeOffOutline : eyeOutline}
                className="input-icon-trailing"
                onClick={() => setShowPassword(v => !v)}
              />
            </IonItem>

            <IonButton
              expand="block"
              className="primary-button"
              disabled={submitting}
              onClick={() => submit()}
            >
              {submitting
                ? <IonSpinner name="dots" />
                : <>
                    <IonIcon slot="start" icon={arrowForwardOutline} />
                    Sign In
                  </>}
            </IonButton>

            {error && <IonNote color="danger" className="error-note">{error}</IonNote>}

            <IonText
              className="demo-toggle"
              onClick={() => setShowDemoSheet(true)}
            >
              <IonIcon icon={informationCircleOutline} />
              <span>View Demo Credentials</span>
            </IonText>
          </div>

          <div className="login-footer">
            <img src="/couchbase_logo.png" alt="Couchbase" className="cb-logo" />
            <span className="footer-label">Powered by Couchbase</span>
          </div>
        </div>

        <DemoCredentialsModal
          isOpen={showDemoSheet}
          onDismiss={() => setShowDemoSheet(false)}
          onUse={(u, p) => { setShowDemoSheet(false); submit(u, p); }}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
