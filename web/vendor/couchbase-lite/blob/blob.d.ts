/** Metadata of a binary blob or attachment embedded in a document. (The data is external.)
 *  Originally from CouchDB, and Sync Gateway / App Services still uses it the same way:
 *  - Attachments live in a top-level `_attachments` property, whose value is an object that
 *    maps names to these metadata dicts.
 *  Couchbase Lite, since 2.0, lets blobs live anywhere in a document:
 *  - A blob is any object with a `"@type": "blob"` property, as well as a `digest`. */
export interface Bloblike {
    readonly digest: string;
    readonly content_type?: string;
    readonly length?: number;
    readonly revpos?: number;
    readonly stub?: boolean;
    readonly "@type"?: "blob";
}
/** A binary blob in a CBLDocument.
 *  Abstract superclass of {@link NewBlob} and {@link ExistingBlob}.
 *  @property digest  The unique digest, usually SHA-1, of the blob's contents.
 *  @property length  Length in bytes of the contents.
 *  @property content_type  Optional MIME type of the contents. (Couchbase Lite doesn't use this,
 *                          except as a hint for whether to compress the contents during sync.)
 *  @property revpos  Used internally by Sync Gateway; you can ignore it. */
export declare abstract class Blob implements Bloblike {
    readonly digest: string;
    readonly length?: number | undefined;
    readonly content_type?: string | undefined;
    readonly revpos?: number | undefined;
    constructor(digest: string, length?: number | undefined, content_type?: string | undefined, revpos?: number | undefined);
    /** Asynchronously returns the blob's data as a UInt8Array. */
    abstract getContents(): Promise<Uint8Array>;
    /** Called by JSON.stringify() -- encodes the Blob into its JSON form. @internal
        Note: This is _not_ called when saving a doc; IndexedDB uses "structured clone" not JSON. */
    toJSON(_key: string): Bloblike;
    /** Returns a form suitable for storing in a SG `_attachments` dictionary. @internal */
    asAttachmentDict(revpos: number): Bloblike;
    /** @internal */
    readonly "@type" = "blob";
}
/** An async function that returns the contents of a Blob given its digest.  @internal */
export type BlobLoader = (digest: string, content_type?: string) => Promise<Uint8Array>;
/** A Blob found in an existing document, whose contents have been saved in the database. */
export declare class ExistingBlob extends Blob {
    #private;
    /** @internal */
    constructor(obj: Bloblike, loader: BlobLoader | undefined);
    getContents(): Promise<Uint8Array>;
}
/** An Attachment is the same as an ExistingBlob except that -- due to differences between CBL
 *  and Sync Gateway -- it serializes to JSON differently, without `@type` and with `stub: true`.
 *  @internal */
export declare class Attachment extends ExistingBlob {
    constructor(obj: Bloblike, loader: BlobLoader);
    toJSON(_key: string): Bloblike;
}
/** A newly-created Blob that hasn't been saved yet.
 *  You can create instances and add them to a CBLDocument's body, at top-level or nested.
 *  When the document is saved, the data (contents) will be saved in the database separately
 *  from the document, loadable on demand via the {@link getContents} method;
 *  and this object will be replaced with an equivalent {@link ExistingBlob} object. */
export declare class NewBlob extends Blob {
    #private;
    /** Constructs a NewBlob.
     *  @param contents  The raw data. Will be moved into the database when the document is saved.
     *                   The constructor makes a copy of this, so any modifications afterwards
     *                   will be ignored.
     *  @param content_type  MIME type of the contents; this is optional. */
    constructor(contents: Uint8Array, content_type?: string);
    getContents(): Promise<Uint8Array>;
    /** For convenience, a non-async accessor for the contents. */
    get contents(): Uint8Array;
    /** @internal */
    static computeDigest(contents: Uint8Array): string;
}
