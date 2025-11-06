import { Endpoint, EndpointConfig, EndpointParams } from './endpoint';
import { RemoteRevisionInfo, RemoteSequence, RemoteRevision } from './types';
import { Revision } from '../database/types';
import { BlobLoader } from '../blob/blob';
import { Collection } from '../couchbase-lite';
import * as blip from "@/blip/blip";
/** Callback that resolves a conflict between a local and remote (server) document revision,
 *  after a replicator pulls a conflicting revision from the server.
 *  @param collection  The owning Collection.
 *  @param local  The current local document revision.
 *  @param remote  The conflicting remote document revision.
 *  @returns  The resolved revision. `id` and `rev` are ignored. You may return `local` or `remote`
 *            with or without modifying the body, or a new `Revision` object. */
export type PullConflictResolver = (collection: Collection, local: Revision, remote: Revision) => Promise<Revision>;
/** Configuration parameters for pulling changes from a remote collection.
 *  @property continuous    If true, stay connected indefinitely.
 *  @property channels      Optional set of Sync Gateway channels, for server-side filtering.
 *  @property activeOnly    If true, don't get deleted docs.
 *  @property filter        Callback that can skip individual revisions.
 *  @property conflictResolver  Callback that resolves conflicts between local and server docs.
 *                              If not given, a default resolver is used that chooses the one
 *                              with the higher revision ID (Most Writes Wins.) */
export interface PullerConfig extends EndpointConfig {
    channels?: readonly string[];
    activeOnly?: boolean;
    filter?: (rev: RemoteRevisionInfo) => boolean;
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
