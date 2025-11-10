import { Endpoint, EndpointConfig, EndpointParams } from './endpoint';
import { RemoteRevisionInfo, RemoteSequence, RemoteRevision, ReplicationFilter } from './types';
import { BlobLoader } from '../blob/blob';
import { CBLDocument } from '../database/document';
import * as blip from "@/blip/blip";
/** Callback that resolves a conflict between a local and remote (server) document revision,
 *  after a replicator pulls a conflicting revision from the server.
 *  @param local  The current local document, or `null` if it's deleted.
 *  @param remote  The conflicting remote document, or `null` if it's deleted.
 *  @returns  The resolved document, or `null` if it should be deleted.
 *            You may return either `local` or `remote`.
 *            You may modify the properties to merge the two revisions. */
export type PullConflictResolver = (local: CBLDocument | null, remote: CBLDocument | null) => Promise<CBLDocument | null>;
export interface PullerConfig extends EndpointConfig {
    channels?: readonly string[];
    activeOnly?: boolean;
    enableAutoPurge?: boolean;
    filter?: ReplicationFilter;
    conflictResolver?: PullConflictResolver;
    wantBatchSize?: number;
    saveBatchSize?: number;
}
export interface PullerDelegate {
    /** Rejects existing revisions by setting their `skip` property to `true`.
     *  For other revisions, it should set `knownRevs` to the current revID(s) it has. */
    wantRevs?(rev: RemoteRevisionInfo[], caughtUp: boolean): Promise<void>;
    /** Saves downloaded revisions to the database. */
    saveRevs(revs: RemoteRevision[]): Promise<boolean>;
    /** Checks whether each of the digests matches a blob in the local database.
     *  If so, returns `undefined`. Otherwise returns an array of the unknown digests. */
    missingBlobs(digests: Set<string>): Promise<string[] | undefined>;
    /** Adds a blob. Implementor must verify that the contents match the digest. */
    addBlob(digest: string, contents: Uint8Array): Promise<void>;
    /** Returns true if the onDocuments callback is set.
     * When true, the pull replicator includes the revocations flag in subChanges
     * requests to Sync Gateway, allowing it to receive notifications when access
     * to a document is revoked even when auto-purge is disabled. */
    hasOnDocumentsCallback(): boolean;
    blobLoader: BlobLoader;
}
interface RemoteRevisionWithMsg extends RemoteRevision {
    readonly remoteSequence: RemoteSequence;
    readonly msg: blip.Message;
}
/** Pulls documents from a remote collection using the Couchbase Mobile replication protocol.
    This class has no knowledge of a local database. */
export declare class Puller extends Endpoint {
    #private;
    private readonly config;
    private readonly delegate;
    constructor(params: EndpointParams, config: PullerConfig, delegate: PullerDelegate);
    checkIdle(): boolean;
    get batchSize(): number;
    onChanges(msg: blip.Message): void;
    private canProcessChangesMessage;
    private maybeProcessChangesMessage;
    private processChangesMessage;
    onRev(msg: blip.Message): void;
    private maybeInsertRevs;
    private decodeRevMsg;
    private processRevWithBlobs;
    finishedRev(rev: RemoteRevisionWithMsg, ok: boolean): void;
    toString(): string;
}
export {};
