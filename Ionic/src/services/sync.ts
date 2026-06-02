import {
  BasicAuthenticator,
  CollectionConfig,
  Replicator,
  ReplicatorActivityLevel,
  ReplicatorConfiguration,
  URLEndpoint,
} from 'cbl-ionic';
import { AppConfig } from '../models/AppConfig';
import { DatabaseService } from './database';

export type SyncState =
  | 'STOPPED' | 'OFFLINE' | 'CONNECTING' | 'IDLE' | 'BUSY' | 'ERROR';

/**
 * Continuous push+pull replicator against Capella App Services.
 * Same heartbeat (60s) and retry parameters as the .NET / Java / Android
 * ports so the cross-platform behaviour stays consistent.
 *
 * cbl-ionic specifics:
 *   - `Replicator.create(config)` is async (constructor is private).
 *   - Change callback receives `{ status }`; pull activity level + error
 *     from there.
 *   - `CollectionConfig` constructor takes `(channels, documentIds)` —
 *     pass `null, null` for "everything".
 */
export class SyncService {
  private replicator?: Replicator;
  private state: SyncState = 'STOPPED';
  private lastError?: string;
  private listenerToken?: string;
  private stateListeners: ((s: SyncState) => void)[] = [];

  constructor(private db: DatabaseService) {}

  getState(): SyncState { return this.state; }
  getLastError(): string | undefined { return this.lastError; }

  onStateChanged(cb: (s: SyncState) => void): () => void {
    this.stateListeners.push(cb);
    return () => { this.stateListeners = this.stateListeners.filter(c => c !== cb); };
  }

  async start(config: AppConfig): Promise<void> {
    if (this.replicator) return;

    const inventory = this.db.getInventoryCollection();
    const orders = this.db.getOrdersCollection();
    const profile = this.db.getProfileCollection();
    if (!inventory || !orders || !profile) {
      throw new Error('SyncService.start() called before DatabaseService.openFor()');
    }

    const replConfig = new ReplicatorConfiguration(new URLEndpoint(config.syncUrl));
    replConfig.setReplicatorType(ReplicatorConfiguration.ReplicatorType.PUSH_AND_PULL);
    replConfig.setContinuous(true);
    replConfig.setHeartbeat(60);
    replConfig.setMaxAttempts(10);
    replConfig.setMaxAttemptWaitTime(300);
    replConfig.setAuthenticator(new BasicAuthenticator(config.username, config.password));

    // !!! cbl-ionic gotcha !!!
    // ReplicatorConfiguration defaults `acceptOnlySelfSignedCerts = true`,
    // which is the inverse of every other CBL SDK and means the replicator
    // rejects Capella App Services' real Let's Encrypt certificate. Flip
    // it to false so production TLS is accepted; the .NET/Java/Swift ports
    // never had to touch this because they default to false.
    replConfig.setAcceptOnlySelfSignedCerts(false);

    // CollectionConfig: passing `[], []` (empty arrays) matches the
    // upstream example app; passing `null, null` occasionally trips up
    // the native serializer.
    const collConfig = new CollectionConfig([], []);
    replConfig.addCollection(inventory, collConfig);
    replConfig.addCollection(orders, collConfig);
    replConfig.addCollection(profile, collConfig);

    this.replicator = await Replicator.create(replConfig);
    this.listenerToken = await this.replicator.addChangeListener(change => {
      const level = change.status.getActivityLevel();
      const err = change.status.getError();
      if (err) {
        this.lastError = err;
        console.error('[SyncService] replicator error:', err);
        this.setState('ERROR');
      } else {
        this.lastError = undefined;
        this.setState(mapActivity(level));
      }
    });
    await this.replicator.start(false);  // false = don't reset the local checkpoint
  }

  async stop(): Promise<void> {
    if (!this.replicator) return;
    try {
      if (this.listenerToken) await this.replicator.removeChangeListener(this.listenerToken);
      await this.replicator.stop();
    } catch (e) {
      console.warn('[SyncService] stop failed', e);
    }
    this.replicator = undefined;
    this.listenerToken = undefined;
    this.setState('STOPPED');
  }

  private setState(s: SyncState): void {
    this.state = s;
    for (const cb of this.stateListeners) {
      try { cb(s); } catch (e) { console.warn('[SyncService] listener threw', e); }
    }
  }
}

function mapActivity(level: ReplicatorActivityLevel): SyncState {
  switch (level) {
    case ReplicatorActivityLevel.STOPPED:    return 'STOPPED';
    case ReplicatorActivityLevel.OFFLINE:    return 'OFFLINE';
    case ReplicatorActivityLevel.CONNECTING: return 'CONNECTING';
    case ReplicatorActivityLevel.IDLE:       return 'IDLE';
    case ReplicatorActivityLevel.BUSY:       return 'BUSY';
    default:                                 return 'STOPPED';
  }
}
