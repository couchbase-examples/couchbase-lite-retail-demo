import React, { useCallback, useEffect, useState } from 'react';
import {
  IonContent, IonHeader, IonIcon, IonPage, IonToolbar,
} from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import { useApp } from '../providers/AppProvider';
import { StoreProfile } from '../models/StoreProfile';

const ProfilePage: React.FC = () => {
  const { db } = useApp();
  const [profile, setProfile] = useState<StoreProfile | null>(null);

  const reload = useCallback(async () => {
    try { setProfile(await db.getProfile()); }
    catch (e) { console.error('[Profile] load failed', e); }
  }, [db]);

  useEffect(() => {
    void reload();
    return db.onProfileChanged(() => { void reload(); });
  }, [db, reload]);

  return (
    <IonPage>
      <IonHeader collapse="condense" className="ion-no-border">
        <IonToolbar className="page-toolbar centered-titlebar">
          <h1 className="centered-page-title">Store Profile</h1>
        </IonToolbar>
      </IonHeader>
      <IonContent className="page-content">
        <IonHeader collapse="condense" className="ion-no-border">
          <IonToolbar className="page-toolbar centered-titlebar">
            <h1 className="centered-page-title">Store Profile</h1>
          </IonToolbar>
        </IonHeader>

        {!profile
          ? <div className="empty-state">Profile is still syncing — give it a moment.</div>
          : <>
              <div className="profile-card">
                <div className="profile-store-name">{profile.name || '—'}</div>
                <div className="profile-store-id">Store ID: {profile.storeId || '—'}</div>
              </div>

              <p className="section-header">CONTACT INFORMATION</p>
              <div className="profile-card">
                <div className="profile-row">
                  <span className="profile-field-name">Email</span>
                  <span className="profile-field-value">{profile.contact?.email ?? '—'}</span>
                </div>
                <div className="cred-separator" />
                <div className="profile-row">
                  <span className="profile-field-name">Phone</span>
                  <span className="profile-field-value">{profile.contact?.phone ?? '—'}</span>
                </div>
              </div>

              <p className="section-header">LOCATION</p>
              <div className="profile-card">
                <div className="profile-address">
                  {profile.location?.address1}
                  {profile.location?.address2 ? (<><br />{profile.location.address2}</>) : null}
                  <br />
                  {profile.location?.locality}, {profile.location?.region} {profile.location?.postalCode}
                  <br />
                  {profile.location?.country}
                </div>
                {profile.location?.coordinates && (
                  <div className="profile-coords">
                    <IonIcon icon={locationOutline} />
                    {' '}
                    {profile.location.coordinates.lat.toFixed(6)},{' '}
                    {profile.location.coordinates.lon.toFixed(6)}
                  </div>
                )}
              </div>

              {profile.manager && (
                <p className="profile-manager">Manager: {profile.manager}</p>
              )}
            </>}
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
