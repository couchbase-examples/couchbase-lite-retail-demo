//
// internals.ts
//
// Copyright 2024-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import type { JSONObject } from "@/util/json_types";
import { isDictionary, type DocID } from "./types";
import type { CBLDictionary, CBLValue, RevID, Sequence } from "./types";
import { sha1 } from "sha.js";
import type { Encrypted } from "./cryptoCodec";

export const CheckpointStore = "cbl_checkpoints";  // Table for sync checkpoints
export const MetaStore       = "cbl_collections";  // Table for collection metadata
export const BlobTableName   = "cbl_blobs";        // Table for blob data


// Keys in LocalRevision:
export const IDKey      = "id";
export const SeqKey     = "seq";
export const ExpiresKey = "expires";


// Flags in a LocalRevision.
export type RevisionFlags = number & {__brand: "RevisionFlags"};

export const RevFlagBlobby      = 0x01 as RevisionFlags;     // Body contains blobs
export const RevFlagConflicted  = 0x40 as RevisionFlags;     // Has a conflict
export const RevFlagDeleted     = 0x80 as RevisionFlags;     // It's a tombstone


/** A local document as stored in the local database.
 *  Unlike `Revision`, it has mutable properties. */
export interface LocalRevision {
    readonly id : DocID;                 // docID [indexed]
    rev         : RevID;                 // revID
    seq         : Sequence;              // Local sequence number [indexed]
    body        : JSONObject;            // Document body, minus any encrypted properties
    flags?      : RevisionFlags;         // Revision flags; see above. [indexed]
    expires?    : number;                // Expiration time (milliseconds since epoch) [indexed]
    serverRev?  : RevID;                 // Last known server-side revID
    conflict?   : JSONObject | null;     // Conflicting body from server (null if deleted)
    encrypted?  : Encrypted;             // Encrypted properties
}

export function revIsDeleted(rev: LocalRevision): boolean {
    return rev.flags !== undefined && (rev.flags & RevFlagDeleted) !== 0;
}


export interface DatabaseMeta {
    challenge?  : Encrypted;            // Encryption challenge, if db is encrypted
}


// Collection metadata stored in the MetaStore, keyed by collection name.
export interface CollectionMeta {
    lastSeq                 : Sequence;     // Last Sequence number assigned
    clientID?               : string;       // Unique collection ID; key for remote checkpoints
    unencryptedProperties?  : Set<string>;  // Document properties to leave unencrypted
};


/** Returns the generation number of a revid. */
export function getGeneration(rev: RevID) : number {
    const dash = rev.indexOf("-");
    if (dash >= 1) {
        const gen = Number(rev.substring(0, dash));
        if (gen > 0 && Number.isSafeInteger(gen))
            return gen;
    }
    throw Error(`Invalid revision id '${rev}'`);
}


/** Generates a new revid, given the document's prior revid, new body, and deletion status. */
export function generateRevID(oldRevID: RevID | null | undefined,
                              body: CBLDictionary | null,
                              deleted: boolean) : RevID
{
    // Construct the input data of the SHA-1 digest, in the same format as LiteCore:
    // - length in bytes of oldRevID, or 0 if none
    // - oldRevID, if given
    // - 0x01 if deleted, else 0x00
    // - The document body in canonical JSON form
    let sha = new sha1();
    if (oldRevID)
        sha.update(new Uint8Array([Math.min(oldRevID.length, 0xFF)])).update(oldRevID);
    else
        sha.update(new Uint8Array([0]));
    sha.update(new Uint8Array([deleted ? 1 : 0]));
    if (!deleted)
        sha.update(JSON.stringify(canonicalJSONValue(body)));

    const hexDigest = sha.digest("hex");
    const newGen = oldRevID ? (getGeneration(oldRevID) + 1) : 1;
    return `${newGen}-${hexDigest}` as RevID;
}


/** Returns a deep copy of this object whose keys are in alphabetical order.
 *  Any nested objects (at any depth) also have their keys in alphabetical order. */
export function canonicalJSONDict(body: CBLDictionary): CBLDictionary {
    // This isn't 100% correct, because sort() sorts strings by UTF-16 values, not UTF-8.
    // But it produces the right ordering for ASCII keys.
    let result: CBLDictionary = {};
    for (const key of Object.keys(body).sort())
        result[key] = canonicalJSONValue(body[key]);
    return result;
}

export function canonicalJSONValue(value: CBLValue): typeof value {
    if (Array.isArray(value))
        return value.map( item => canonicalJSONValue(item) );
    else if (isDictionary(value))
        return canonicalJSONDict(value);
    else
        return value;
}
