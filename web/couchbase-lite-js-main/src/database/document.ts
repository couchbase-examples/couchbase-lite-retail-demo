// document.ts
//
// Copyright 2025-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import type { Collection } from "./collection.js";
import { assertValidDocID, CopyDict, type CBLDictionary, type CBLValue, type DocID, type RevID, type Sequence } from "./types.js";
import { encodeBase64 } from "@/util/base64";

export type CBLDictLike<D> = { [K in keyof D]: CBLValue }

/**
 * A Couchbase Lite document. Use {@link Collection.getDocument} to fetch a document or
 * {@link Collection.createDocument} to create a new one.
 *
 * The Document can be used as if it were an object of the Collection's schema type
 * ({@link CBLDictionary} by default).
 *
 * - Property values may be any JSON compatible type, as well as {@link Blob}.
 * - Property names (at the top level) must not begin with an underscore. (This is a restriction
 *   imposed on the server by Sync Gateway / App Services.)
 *
 * The drawback is that Couchbase Lite can't reserve any properties for metadata like the DocID.
 * To access that, call the function {@link meta}, which takes the document as its argument
 * and returns a {@link DocumentMeta} object that exposes the metadata. */
export type CBLDocument<D extends CBLDictLike<D> = CBLDictionary> = {
    /** @internal */ [DocMetaKey]: DocumentMeta<D>;
} & D;


const DocMetaKey: unique symbol = Symbol();


/** Access the {@link DocumentMeta} for a {@link CBLDocument}.
 *  This gives access to meta properties such as the document ID, revision ID and sequence. */
export function meta<D extends CBLDictLike<D> = CBLDictionary>(doc: CBLDocument<D>): DocumentMeta<D> {
    const m = doc[DocMetaKey];
    if (m === undefined)
        throw TypeError(`meta() called on non-document`);
    return m;
}


/** The metadata of a document, such as its DocID; returned by the function {@link meta}.
 *  For example:
 *  ```ts
 *  const docID = meta(doc).id;
 *  ```
 *  @template D  The document schema; will be the same as in the {@link CBLDocument} argument
 *               to `meta()`.
 */
export class DocumentMeta<D extends CBLDictLike<D>> {

    /** The collection that the document belongs to. */
    public readonly collection: Collection<D>;


    /** The ID (primary key) of the document. */
    public readonly id: DocID;


    /** The document itself. */
    public readonly body: CBLDocument<D>;


    /** The current revision ID of the document. */
    get revisionID(): RevID | undefined {
        return this.#revID;
    }


    /** The current sequence number of the document. */
    get sequence(): Sequence | undefined {
        return this.#sequence;
    }


    /** Replaces the document's properties with a copy of `newBody`. */
    setBody(newBody: D) {
        const body = this.body as CBLDictionary;
        for (const p of Object.getOwnPropertyNames(body))
            if (!Object.hasOwn(newBody, p))
                delete body[p];
        Object.assign(body, newBody);
    }


    /** @internal */
    constructor(collection: Collection<D>, id: DocID, body: D, revID?: RevID, sequence?: Sequence) {
        assertValidDocID(id);
        this.collection = collection;
        this.id = id;
        this.#revID = revID;
        this.#sequence = sequence;

        this.body = body as unknown as CBLDocument<D>;
        this.body[DocMetaKey] = this;
        Object.defineProperty(body, DocMetaKey, {enumerable: false});
    }

    /** Makes a deep copy of a CBLDocument. @internal */
    clone(): CBLDocument<D> {
        const docMeta = new DocumentMeta<D>(this.collection, this.id, CopyDict(this.body), this.#revID, this.#sequence);
        return docMeta.body;
    }

    /** Updates the `revID` and `sequence` properties after the document is saved. @internal */
    _updateRev(revID: RevID, sequence: Sequence): void {
        this.#revID = revID;
        this.#sequence = sequence;
    }

    #revID?     : RevID;
    #sequence?  : Sequence;
}


/** Generates a unique random DocID. */
export function generateDocID() : DocID {
    const bytes = new Uint8Array(15);
    return "-" + encodeBase64(crypto.getRandomValues(bytes)).replaceAll('/','_') as DocID;
}
