import { CheckpointerConfig, CheckpointerDelegate } from './checkpointer';
import { PullerConfig, PullerDelegate } from './puller';
import { PusherConfig, PusherDelegate } from './pusher';
import type * as logtape from "@logtape/logtape";
export { type CheckpointerConfig, type CheckpointerDelegate } from './checkpointer';
export { type PullConflictResolver, type PullerConfig, type PullerDelegate } from './puller';
export { type ChangeSet, type PusherConfig, type PusherDelegate } from './pusher';
export { type Checkpoint, DocumentFlags, type ReplicationFilter, type PushRevision, type LocalSequence, type LostAccess, type RemoteRevision, type RemoteRevisionInfo, ReplicatorError } from './types';
export declare const SyncLogger: logtape.Logger;
export type CollectionID = string & {
    __brand: 'CollectionID';
};
/** Configuration parameters. */
export interface ReplicatorConfig {
    url: string;
    credentials?: Credentials;
    collections: Record<CollectionID, CollectionConfig>;
}
/** Authentication credentials for the replicator. */
export interface Credentials {
    username: string;
    password: string;
}
/** Configuration for replicating a collection. */
export interface CollectionConfig {
    checkpoint: CheckpointerConfig & {
        delegate: CheckpointerDelegate;
    };
    push?: PusherConfig & {
        delegate: PusherDelegate;
    };
    pull?: PullerConfig & {
        delegate: PullerDelegate;
    };
}
/** Replication status and progress.
 *  @property status  The current state of the replicator.
 *  @property error  Fatal error, if any.
 *  @property pushedRevisions  The number of documents uploaded to the server so far.
 *  @property pulledRevisions  The number of documents downloaded from the server so far. */
export interface Status {
    status?: "connecting" | "busy" | "idle" | "stopped";
    error?: Error;
    pushedRevisions?: number;
    pulledRevisions?: number;
}
/** Couchbase Mobile replicator protocol implementation.
 *  This class is database-agnostic: it relies on delegate interfaces to read and write revisions.
 *  {@link ../database.Replicator} is a wrapper that supports this package's simple database API. */
export declare class Replicator {
    #private;
    private readonly config;
    constructor(config: ReplicatorConfig);
    readonly logger: logtape.Logger;
    /** Starts the replicator. Completes when the replicator finishes (never if continuous.) */
    run(): Promise<void>;
    /** Authenticates to the server. Returns an (optional) session-id token. */
    private authenticate;
    private start;
    /** Stops the replicator, if it's running. */
    stop(): void;
    get status(): Status;
    onStatusChange?: (status: Status) => void;
    get running(): boolean;
    statusChanged_(): void;
    maybeNotifyStatus(): void;
    protected finish(error?: Error): void;
    fatalError(error: Error): void;
}
