import { Database } from './database';
import { DocID } from './types';
import { Collection } from './collection';
import { Checkpoint } from '../replicator/types';
import * as repl from "@/replicator/replicator";
import type * as logtape from "@logtape/logtape";
export { type Credentials, type CheckpointerDelegate, type PusherConfig, type PullerConfig, type PullConflictResolver, type RemoteRevisionInfo, type Status } from '../replicator/replicator';
/** Configuration for {@link Replicator}.
 *  @interface
 *  @property database  The Database to sync.
 *  @property url  Server URL to connect to, with scheme "wss:" or "ws:", and database name
 *                 as first path component.
 *  @property collections  Keys are names of collections to sync;
 *                         values are per-collection configuration. */
export interface ReplicatorConfig {
    database: Database;
    url: string;
    credentials?: repl.Credentials;
    collections: Record<string, ReplicatorCollectionConfig>;
}
/** Per-collection Replicator configuration. At least one of `push` and `pull` must be defined. */
export interface ReplicatorCollectionConfig {
    push?: repl.PusherConfig;
    pull?: repl.PullerConfig;
}
/** Information about a document that's been pushed or pulled by a replicator.
 *  @see {@link Replicator.onDocuments} */
export interface DocumentEnded {
    docID: DocID;
    deleted?: boolean;
    error?: Error;
}
/** Syncs one or more {@link Collection}s with their remote counterparts. */
export declare class Replicator implements repl.CheckpointerDelegate {
    #private;
    private config;
    constructor(config: ReplicatorConfig);
    /** The local database being replicated. */
    readonly database: Database;
    /** Callback that notifies when {@link status} changes. */
    onStatusChange?: (status: repl.Status) => void;
    /** Callback that notifies when documents have been pushed or pulled. */
    onDocuments?: (collection: Collection, direction: 'push' | 'pull', documents: DocumentEnded[]) => void;
    /** Current replication status & progress. */
    get status(): repl.Status;
    /** Runs the replicator.
     *
     * This is an async operation. The returned Promise resolves when the replication completes.
     * A continuous replication usually _never_ completes, unless it encounters a fatal error or
     * you stop it, so you may not want to `await` it. */
    run(): Promise<void>;
    /** Stops the replicator. The current {@link run} operation's Promise will resolve with
     *  an error as soon as possible.
     *
     *  Does nothing if `run` is not active. */
    stop(): void;
    /** Checkpointer delegate implementation. @internal */
    saveCheckpoint(id: repl.CollectionID, checkpoint: Checkpoint): Promise<void>;
    readonly logger: logtape.Logger;
}
