//
// types.ts
//
// Copyright 2024-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import type { JSONObject, JSONValue } from "@/util/json_types";
import type * as db from "@/database/types";

export {type RevisionInfo} from "@/database/types";

export type DocID = db.DocID;
export type RevID = db.RevID;
export type LocalSequence = db.Sequence;

export interface LocalRevision extends db.Revision {
    readonly seq        : LocalSequence;    // Current sequence number
    readonly serverRev? : RevID;           // Last known server-side revID
}

/** A chronological sequence in a remote database.
    These are opaque JSON values (but usually numbers) with no intrinsic ordering. */
export type RemoteSequence = JSONValue;

/** Metadata of a remote revision available to be pulled. */
export interface RemoteRevisionInfo {
    readonly id         : DocID;
    readonly rev        : RevID;
    readonly deleted    : true | undefined;
    readonly bodySize   : number | null;    // Approx body size in bytes, if known
    knownRevs?          : RevID[];         // Client sets this to local current revID(s), if any
    skip?               : boolean;          // Client sets to true if not interested in revision
}

/** A revision pulled from the server. */
export interface RemoteRevision extends db.Revision {
    readonly history: RevID[];         // Previous revIDs in reverse chronological order
}


/** An object that holds the persistent state of replication. */
export class Checkpoint {
    constructor(public local?:  LocalSequence,
                public remote?: RemoteSequence) { }

    static fromObject(o: JSONObject) : Checkpoint {
        let local: JSONValue | undefined = o.local;
        if (typeof(local) !== "number")
            local = undefined;
        let remote: JSONValue | undefined = o.remote;
        if (remote === null)
            remote = undefined;
        return new Checkpoint(local as LocalSequence, remote);
    }

    get empty() : boolean {return this.local === undefined && this.remote === undefined;}

    equals(c: Checkpoint) {return this.local === c.local && this.remote === c.remote;}
    toString() {return `{local: ${this.local}, remote: ${JSON.stringify(this.remote)}}`;}
    clone() {return new Checkpoint(this.local, this.remote);}
}
