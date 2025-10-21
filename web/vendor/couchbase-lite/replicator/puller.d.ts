import { Endpoint, EndpointConfig, EndpointParams } from './endpoint';
import { RemoteRevisionInfo, RemoteSequence, RemoteRevision } from './types';
import { CBLDictionary } from '../database/types';
import { BlobLoader } from '../blob/blob';
import { Collection, DocID } from '../couchbase-lite';
import * as blip from "@/blip/blip";
/** Callback that resolves a conflict between a local and remote document revision.
 *  @param collection  The owning Collection.
 *  @param docID  The ID of the document.
 *  @param local  The current local document body, or null if it's been deleted (a tombstone.)
 *  @param remote  The current remove document body, or null if it's been deleted (a tombstone.)
 *  @returns  The resolved body to save, or null for a deletion. */
export type PullConflictResolver = (collection: Collection, docID: DocID, local: CBLDictionary | null, remote: CBLDictionary | null) => Promise<CBLDictionary | null>;
/** Configuration parameters for pulling changes from a remote collection.
 *  @property continuous    If true, stay connected indefinitely.
 *  @property channels      Optional set of Sync Gateway channels, for server-side filtering.
 *  @property activeOnly    If true, don't get deleted docs.
 *  @property filter        Callback that can skip individual revisions.
 *  @property conflictResolver  Callback that resolves conflicts between local and server docs. */
export interface PullerConfig extends EndpointConfig {
    channels?: string[];
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
