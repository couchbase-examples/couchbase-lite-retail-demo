import { JSONObject } from '../util/json_types';
import { DocID, CBLDictionary, CBLValue, RevID, Sequence } from './types';
import { Encrypted } from './cryptoCodec';
export declare const CheckpointStore = "cbl_checkpoints";
export declare const MetaStore = "cbl_collections";
export declare const BlobTableName = "cbl_blobs";
export declare const IDKey = "id";
export declare const SeqKey = "seq";
export declare const ExpiresKey = "expires";
export type RevisionFlags = number & {
    __brand: "RevisionFlags";
};
export declare const RevFlagBlobby: RevisionFlags;
export declare const RevFlagConflicted: RevisionFlags;
export declare const RevFlagDeleted: RevisionFlags;
/** A local document as stored in the local database.
 *  Unlike `Revision`, it has mutable properties. */
export interface LocalRevision {
    readonly id: DocID;
    rev: RevID;
    seq: Sequence;
    body: JSONObject;
    flags?: RevisionFlags;
    expires?: number;
    serverRev?: RevID;
    conflict?: JSONObject | null;
    encrypted?: Encrypted;
}
export declare function revIsDeleted(rev: LocalRevision): boolean;
export interface DatabaseMeta {
    challenge?: Encrypted;
}
export interface CollectionMeta {
    lastSeq: Sequence;
    clientID?: string;
    unencryptedProperties?: Set<string>;
}
/** Returns the generation number of a revid. */
export declare function getGeneration(rev: RevID): number;
/** Generates a new revid, given the document's prior revid, new body, and deletion status. */
export declare function generateRevID(oldRevID: RevID | null | undefined, body: CBLDictionary | null, deleted: boolean): RevID;
/** Returns a deep copy of this object whose keys are in alphabetical order.
 *  Any nested objects (at any depth) also have their keys in alphabetical order. */
export declare function canonicalJSONDict(body: CBLDictionary): CBLDictionary;
export declare function canonicalJSONValue(value: CBLValue): typeof value;
