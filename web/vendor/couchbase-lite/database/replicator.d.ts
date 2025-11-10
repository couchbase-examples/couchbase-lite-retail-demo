import { Database } from './database';
import { DocID } from './types';
import { Collection } from './collection';
import * as repl from "../replicator/replicator";
import type * as logtape from "@logtape/logtape";
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
/** Per-collection Replicator configuration.
 *  @property push  Configuration for pushing. If not present, replicator will not push.
 *  @property pull  Configuration for pulling. If not present, replicator will not pull.
 *  @property documentIDs  If set, only these documents will be pushed or pulled.
 *  @property resetCheckpoint  If true, the replicator will ignore its current state and compare
 *                             all document revision IDs with the server.  */
export interface ReplicatorCollectionConfig {
    push?: PushConfig;
    pull?: PullConfig;
    documentIDs?: readonly DocID[];
    resetCheckpoint?: boolean;
}
/** Configuration parameters for pushing changes to the remote collection.
 *  @property continuous    If true, stay connected indefinitely.
 *  @property filter        Callback that can skip revisions one at a time. */
export interface PushConfig {
    continuous?: boolean;
    filter?: repl.ReplicationFilter;
}
/** Configuration parameters for pulling changes from a remote collection.
 *  @property continuous    If true, stay connected indefinitely.
 *  @property channels      Optional set of Sync Gateway channels, for server-side filtering.
 *  @property enableAutoPurge   If true, automatically purges documents when the user loses access
 *                              through channel revocation on Sync Gateway. Defaults to true.
 *  @property filter        Callback that can skip individual revisions.
 *  @property conflictResolver  Callback that resolves conflicts between local and server docs.
 *                              If not given, a default resolver is used that chooses the one
 *                              with the higher revision ID (Most Writes Wins.) */
export interface PullConfig {
    continuous?: boolean;
    channels?: readonly string[];
    enableAutoPurge?: boolean;
    filter?: repl.ReplicationFilter;
    conflictResolver?: repl.PullConflictResolver;
}
/** Information about a document that's been pushed or pulled by a replicator.
 *  @see {@link Replicator.onDocuments} */
export interface DocumentEnded {
    docID: DocID;
    deleted?: boolean;
    lostAccess?: repl.LostAccess;
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
    /** Callback that notifies when documents have been pushed or pulled.
     *
     * Note: To receive lost-access (revocation) notifications from the pull replicator
     * when auto-purge is disabled, this callback must be registered *before*
     * starting the pull replicator. */
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
    /** Returns the checkpoint ID that will be used for a collection. @internal */
    getCheckpointID(collection: Collection): Promise<string>;
    /** Saves a checkpoint to the local database. @internal */
    saveCheckpoint(id: repl.CollectionID, clientID: string, checkpoint: repl.Checkpoint): Promise<void>;
    readonly logger: logtape.Logger;
}
