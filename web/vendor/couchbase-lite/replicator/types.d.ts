import { JSONObject, JSONValue } from '../util/json_types';
import type * as db from "@/database/types";
export { type RevisionInfo } from '../database/types';
export type DocID = db.DocID;
export type RevID = db.RevID;
export type LocalSequence = db.Sequence;
/** A local revision being pushed. */
export interface PushRevision extends db.Revision {
    readonly seq: LocalSequence;
    serverRev?: RevID;
}
/** A chronological sequence in a remote database.
    These are opaque JSON values (but usually numbers) with no intrinsic ordering. */
export type RemoteSequence = JSONValue;
export type LostAccess = 'revoked' | 'removed';
/** Metadata of a remote revision available to be pulled. */
export interface RemoteRevisionInfo {
    readonly id: DocID;
    readonly rev: RevID;
    readonly deleted: boolean;
    readonly lostAccess?: LostAccess;
    readonly bodySize: number | null;
    readonly remoteSequence: RemoteSequence;
    knownRevs?: RevID[];
    skip?: boolean;
}
/** A revision pulled from the server. */
export interface RemoteRevision extends db.Revision {
    readonly history: RevID[];
    hasBlobs?: boolean;
}
/** An object that holds the persistent state of replication. */
export declare class Checkpoint {
    local?: LocalSequence | undefined;
    remote?: RemoteSequence | undefined;
    constructor(local?: LocalSequence | undefined, remote?: RemoteSequence | undefined);
    static fromObject(o: JSONObject): Checkpoint;
    get empty(): boolean;
    equals(c: Checkpoint): boolean;
    toString(): string;
    clone(): Checkpoint;
}
/** An error thrown by the replicator. */
export declare class ReplicatorError extends Error {
    readonly code?: number | undefined;
    constructor(message: string, code?: number | undefined);
}
