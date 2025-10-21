import { Collection } from './collection.js';
import { CBLDictionary, CBLValue, DocID, RevID, Sequence } from './types.js';
export type CBLDictLike<D> = {
    [K in keyof D]: CBLValue;
};
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
declare const DocMetaKey: unique symbol;
/** Access the {@link DocumentMeta} for a {@link CBLDocument}.
 *  This gives access to meta properties such as the document ID, revision ID and sequence. */
export declare function meta<D extends CBLDictLike<D> = CBLDictionary>(doc: CBLDocument<D>): DocumentMeta<D>;
/** The metadata of a document, such as its DocID; returned by the function {@link meta}.
 *  For example:
 *  ```ts
 *  const docID = meta(doc).id;
 *  ```
 *  @template D  The document schema; will be the same as in the {@link CBLDocument} argument
 *               to `meta()`.
 */
export declare class DocumentMeta<D extends CBLDictLike<D>> {
    #private;
    /** The collection that the document belongs to. */
    readonly collection: Collection<D>;
    /** The ID (primary key) of the document. */
    readonly id: DocID;
    /** The document itself. */
    readonly body: CBLDocument<D>;
    /** The current revision ID of the document. */
    get revisionID(): RevID | undefined;
    /** The current sequence number of the document. */
    get sequence(): Sequence | undefined;
    /** Replaces the document's properties with a copy of `newBody`. */
    setBody(newBody: D): void;
    /** @internal */
    constructor(collection: Collection<D>, id: DocID, body: D, revID?: RevID, sequence?: Sequence);
    /** Makes a deep copy of a CBLDocument. @internal */
    clone(): CBLDocument<D>;
    /** Updates the `revID` and `sequence` properties after the document is saved. @internal */
    _updateRev(revID: RevID, sequence: Sequence): void;
}
/** Generates a unique random DocID. */
export declare function generateDocID(): DocID;
export {};
