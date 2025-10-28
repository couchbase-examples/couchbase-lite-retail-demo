//
// blob.ts
//
// Copyright 2022-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import {assert} from "@/util/assert";
import {sha1} from "sha.js";


/** Metadata of a binary blob or attachment embedded in a document. (The data is external.)
 *  Originally from CouchDB, and Sync Gateway / App Services still uses it the same way:
 *  - Attachments live in a top-level `_attachments` property, whose value is an object that
 *    maps names to these metadata dicts.
 *  Couchbase Lite, since 2.0, lets blobs live anywhere in a document:
 *  - A blob is any object with a `"@type": "blob"` property, as well as a `digest`. */
export interface Bloblike {
    readonly digest         : string;   // SHA1, or sometimes MD5, digest of the body
    readonly content_type?  : string;   // MIME type (optional)
    readonly length?        : number;   // Length of body in bytes (almost always present)
    readonly revpos?        : number;   // Gen# of revision where this last changed [SG only]
    readonly stub?          : boolean;  // Indicates body is not included           [SG only]
    readonly "@type"?       : "blob";   // Marker property for a blob               [CBL only]
}


/** A binary blob in a CBLDocument.
 *  Abstract superclass of {@link NewBlob} and {@link ExistingBlob}.
 *  @property digest  The unique digest, usually SHA-1, of the blob's contents.
 *  @property length  Length in bytes of the contents.
 *  @property content_type  Optional MIME type of the contents. (Couchbase Lite doesn't use this,
 *                          except as a hint for whether to compress the contents during sync.)
 *  @property revpos  Used internally by Sync Gateway; you can ignore it. */
export abstract class Blob implements Bloblike {
    constructor(readonly digest: string,
                readonly length?: number,
                readonly content_type?: string,
                readonly revpos?: number)
    { }

    /** Asynchronously returns the blob's data as a UInt8Array. */
    abstract getContents() : Promise<Uint8Array>;

    /** Called by JSON.stringify() -- encodes the Blob into its JSON form. @internal
        Note: This is _not_ called when saving a doc; IndexedDB uses "structured clone" not JSON. */
    toJSON(_key: string) : Bloblike {
        // Keys are in ASCII order to produce canonical JSON.
        return {
            "@type": "blob",
            content_type: this.content_type,
            digest: this.digest,
            length: this.length};
    }

    /** Returns a form suitable for storing in a SG `_attachments` dictionary. @internal */
    asAttachmentDict(revpos: number) : Bloblike {
        // Keys are in ASCII order to produce canonical JSON.
        return {
            content_type: this.content_type,
            digest: this.digest,
            length: this.length,
            revpos: this.revpos ?? revpos,
            stub: true};
    }

    /** @internal */
    readonly "@type" = "blob";  // Required for saving to db. Can't be made private, sadly.
}


/** An async function that returns the contents of a Blob given its digest.  @internal */
export type BlobLoader = (digest: string, content_type?: string) => Promise<Uint8Array>;


/** A Blob found in an existing document, whose contents have been saved in the database. */
export class ExistingBlob extends Blob {
    /** @internal */
    constructor(obj: Bloblike, loader: BlobLoader | undefined) {
        assert(typeof obj.digest === "string"); // sanity check
        super(obj.digest, obj.length, obj.content_type, obj.revpos);
        this.#loader = loader;
    }

    override async getContents() : Promise<Uint8Array> {
        if (!this.#loader)
            return Promise.reject(Error("No BlobLoader"));
        return this.#loader(this.digest, this.content_type);
    }

    readonly #loader: BlobLoader | undefined;
}


/** An Attachment is the same as an ExistingBlob except that -- due to differences between CBL
 *  and Sync Gateway -- it serializes to JSON differently, without `@type` and with `stub: true`.
 *  @internal */
export class Attachment extends ExistingBlob {

    constructor(obj: Bloblike, loader: BlobLoader)  {super(obj, loader);}
    override toJSON(_key: string) : Bloblike        {return this.asAttachmentDict(0);}
}


/** A newly-created Blob that hasn't been saved yet.
 *  You can create instances and add them to a CBLDocument's body, at top-level or nested.
 *  When the document is saved, the data (contents) will be saved in the database separately
 *  from the document, loadable on demand via the {@link getContents} method;
 *  and this object will be replaced with an equivalent {@link ExistingBlob} object. */
export class NewBlob extends Blob {
    /** Constructs a NewBlob.
     *  @param contents  The raw data. Will be moved into the database when the document is saved.
     *                   The constructor makes a copy of this, so any modifications afterwards
     *                   will be ignored.
     *  @param content_type  MIME type of the contents; this is optional. */
    constructor(contents: Uint8Array, content_type?: string) {
        super(NewBlob.computeDigest(contents), contents.length, content_type);
        this.#contents = new Uint8Array(contents);  // copy it to prevent mutations
    }

    override async getContents() : Promise<Uint8Array> {
        return Promise.resolve(this.#contents);
    }

    /** For convenience, a non-async accessor for the contents. */
    get contents() : Uint8Array {
        return this.#contents;
    }

    /** @internal */
    static computeDigest(contents: Uint8Array) : string {
        return "sha1-" + (new sha1()).update(contents).digest("base64");
    }

    readonly #contents: Uint8Array;
}
