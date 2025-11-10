import { JSONObject } from '../util/json_types';
import { DocID, CBLDictionary, CBLValue, RevID, Sequence } from './types';
import { Encrypted, PartlyEncrypted } from './cryptoCodec';
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
/** Common base of `LocalRevision` and `StoredRevision`. A document as stored in the Dexie table.
 *  Unlike `Revision`, it has mutable properties. */
export interface LocalRevisionBase {
    readonly id: DocID;
    rev: RevID;
    seq: Sequence;
    flags?: RevisionFlags;
    expires?: number;
    serverRev?: RevID;
    conflict?: PartlyEncrypted | null;
    body: JSONObject;
}
/** This is the exact document type stored in a Collection's Dexie table.
 *  In this form, `body` is the unencrypted parts of the body
 *  and `encrypted`, if present, is the encrypted parts. */
export interface StoredRevision extends LocalRevisionBase, PartlyEncrypted {
}
/** Decrypted form of a document.
 *  (But `conflict` remains encrypted since it rarely needs decryption.) */
export interface LocalRevision extends LocalRevisionBase {
    encrypted?: false;
}
export declare function revIsDeleted(rev: LocalRevisionBase): boolean;
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
/** Returns true if `newRev` has a higher generation than `oldRev`. */
export declare function greaterGeneration(newRev: RevID | undefined, oldRev: RevID | undefined): boolean;
/** Generates a new revid, given the document's prior revid, new body, and deletion status. */
export declare function generateRevID(oldRevID: RevID | null | undefined, body: CBLDictionary | null, deleted: boolean): RevID;
/** Returns a deep copy of this object whose keys are in alphabetical order.
 *  Any nested objects (at any depth) also have their keys in alphabetical order. */
export declare function canonicalJSONDict(body: CBLDictionary): CBLDictionary;
export declare function canonicalJSONValue(value: CBLValue): typeof value;
