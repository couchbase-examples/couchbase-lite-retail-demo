import { Database, SchemaKeys, TransactionMode } from './database';
import { DocProperty } from './docProperty';
import { LocalRevision } from './internals';
import { DocID, RevID, Sequence, CBLDictionary } from './types';
import { DocumentMeta, CBLDictLike, CBLDocument } from './document';
import { CryptoCodec } from './cryptoCodec';
import { ListenerToken } from '../couchbase-lite';
import * as repl from "@/replicator/types";
import type * as logtape from "@logtape/logtape";
import * as dexie from "dexie";
export declare const DefaultCollectionName = "_default";
type SchemaPath<D extends CBLDictLike<D>> = `${SchemaKeys<D>}.${string}`;
type SchemaProperty<D extends CBLDictLike<D>> = SchemaKeys<D> | SchemaPath<D>;
/** Configuration for a Collection; used in {@link DatabaseConfig}.
 *  @template D  An interface describing the schema of documents in this collection,
 *               i.e. the keys and their allowed value type(s).
 *  @property indexes  Indexes to create. Each item may be a string denoting a property path
 *              (with keys separated by "."s) or an {@link IndexConfig}. */
export interface CollectionConfig<D extends CBLDictLike<D> = CBLDictionary> {
    readonly indexes?: Array<IndexConfig<D> | SchemaProperty<D>>;
}
/** Configuration for a single index on a {@link Collection}; used in {@link CollectionConfig}.
 *  @interface
 *  @template D  An interface describing the schema of documents in this collection,
 *               i.e. the keys and their allowed value type(s).
 *  @property on  The property or properties to index. These may be key-paths delimited by ".".
 *                If multiple properties are indexed, the first will be its _primary_ key, the
 *                others _secondary_ keys; a query may use any prefix of the keys.
 *  @property type  The type of index, either 'value' (the default) or 'array'.
 *  @property unique  If true, every document must have a unique value for this property.
 *                    Any violation will cause a ConstraintError to be thrown when saving the
 *                    document. */
export interface IndexConfig<D extends CBLDictLike<D> = CBLDictionary> {
    readonly on: SchemaProperty<D> | SchemaProperty<D>[];
    readonly type?: IndexType;
    readonly unique?: boolean;
}
export type IndexType = typeof ValueIndex | typeof ArrayIndex;
/** Identifies a "normal" value index in an {@link IndexConfig}. */
export declare const ValueIndex = "value";
/** Identifies an array index in an {@link IndexConfig}. */
export declare const ArrayIndex = "array";
export interface Index {
    name: string;
    type: IndexType;
    on: DocProperty[];
    unique?: boolean;
}
export type ConflictHandlerResult = 'replace' | 'revert' | 'fail';
/** A callback that resolves conflicts that arise while {@link Collection.save saving} or
 *  {@link Collection.delete deleting} a {@link CBLDocument}, if another revision has been
 *  saved since the document was loaded.
 *  The callback can examine body revisions and make changes to `doc` if desired,
 *  then return 'replace' to proceed;
 *  or by returning 'revert' it can leave the existing revision in place;
 *  or by returning 'fail' it can cause a {@link ConflictError} to be thrown.
 *  @param doc  The document revision you are trying to save.
 *  @param conflictingDoc  The conflicting revision already stored in the database,
 *                         or `undefined` if the document has been deleted.
 *  @returns 'replace' to save the document, overwriting the conflicting revision;
 *           'revert' to leave the saved document as it is without reporting an error;
 *           'fail' to throw a {@link ConflictError}. */
export type ConflictHandler<D extends CBLDictLike<D> = CBLDictionary> = (doc: CBLDocument<D>, conflictingDoc?: CBLDocument<D>) => ConflictHandlerResult;
/** A simple {@link ConflictHandler} function that always saves the current document,
 *  overwriting any changes in the database. */
export declare function LastWriteWins<D extends CBLDictLike<D> = CBLDictionary>(_doc: CBLDocument<D>, _conflictingDoc?: CBLDocument<D>): ConflictHandlerResult;
/** A {@link ConflictHandler} function that saves the document if its RevisionID shows it has more
 *  edits than the currently-stored revision; else it leaves the stored revision. */
export declare function MostWritesWins<D extends CBLDictLike<D> = CBLDictionary>(doc: CBLDocument<D>, conflictingDoc?: CBLDocument<D>): ConflictHandlerResult;
/** Error thrown when saving or deleting a doc, if there is a conflicting revision already in the DB
 *  and either no conflict handler was given or the conflict handler returned 'fail'. */
export declare class ConflictError extends Error {
    docID: DocID;
    revID: RevID | undefined;
    savedRevID: RevID | undefined;
    constructor(what: string, docID: DocID, revID: RevID | undefined, savedRevID: RevID | undefined);
}
/** Error thrown by {@link Collection.updateMultiple} if it wasn't able to save/delete all the documents.
 *  @property errors  A Map containing all the errors that occurred. */
export declare class MultipleConflictsError extends Error {
    readonly errors: Map<DocID, Error>;
    constructor(errors: Map<DocID, Error>);
}
/** Information about a change to a document.
 *  Passed to a {@link CollectionChangeCallback} or a {@link DocumentChangeCallback}. */
export interface DocumentChange {
    id: DocID;
    rev: RevID;
    sequence: Sequence;
    deleted?: boolean;
}
/** Information about changes to documents in a collection. */
export type CollectionChange = Map<DocID, DocumentChange>;
export type CollectionChangeCallback = (change: CollectionChange) => void;
export type DocumentChangeCallback = (change: DocumentChange) => void;
/** Represents a single collection (namespace) of documents in a Database.
 *
 *  @template D  The document type, an interface; defaults to {@link CBLDictionary}.
 *  @property database  The owning Database.
 *  @property name  The Collection's name.
 *  @property config  The configuration with which the Collection was created. */
export declare class Collection<D extends CBLDictLike<D> = CBLDictionary> {
    #private;
    readonly database: Database;
    readonly name: string;
    readonly config: CollectionConfig<D>;
    protected readonly db: dexie.Dexie;
    /** @internal */
    constructor(database: Database, name: string, config: CollectionConfig<D>, db: dexie.Dexie, codec: CryptoCodec | undefined);
    /** Database calls this right after the constructor.  @internal */
    open(): Promise<void>;
    /** Checks that a collection name is valid. If not, throws.  @internal */
    static validateName(name: string): void;
    /** {@link https://logtape.org LogTape} logger instance for this Collection. @internal */
    readonly logger: logtape.Logger;
    /** @internal */
    get dexieTable(): dexie.Table<LocalRevision, string, LocalRevision>;
    /** True if the database is open.  @internal */
    get isOpen(): boolean;
    /** @internal */
    closing(): void;
    /** Opens a {@link Database.inTransaction transaction} on this collection only and invokes the callback.
     *  When the callback returns, the transaction commits.
     *  If the callback throws an exception, the transaction aborts.
     *  @remarks
     *  >  In the transaction you can only modify this collection. If you need to modify
     *  >  multiple collections, use {@link Database.inTransaction} instead.
     *  @template T  The type returned by the callback; usually inferred.
     *  @internal */
    inTransaction<T>(mode: TransactionMode, callback: (collection: Collection<D>) => T): Promise<T>;
    /** Translates a public property name/path to a DocProperty object. @internal */
    property(name: string): DocProperty;
    /** @internal (no need to document this!) */
    toString(): string;
    /** @internal */
    get unencryptedProperties(): Set<string> | undefined;
    /** Encrypts the documents in this Collection.  @internal */
    rekey(newCodec: CryptoCodec | undefined, exceptProperties?: Set<string> | Array<string>): Promise<void>;
    /** Called by `rekey`, and by the Database after `encrypt` or `decrypt` if something went wrong.
     *  @internal */
    resetEncryption(codec: CryptoCodec | undefined, unencryptedProperties: Set<string> | undefined): void;
    /** Called by queries to decrypt a LocalRevision returned from a Dexie query.  @internal */
    decryptRevision(rev: LocalRevision): Promise<void>;
    /** Loads an existing {@link CBLDocument document}, or returns `undefined` if it doesn't exist. */
    getDocument(id: DocID): Promise<CBLDocument<D> | undefined>;
    /** Gets an existing document in its raw `LocalRevision` form. @internal
     *  @throws EncryptionError  if `decrypt` is true, doc is encrypted & collection is locked. */
    getRevision(id: DocID, decrypt: boolean): Promise<LocalRevision | undefined>;
    /** Creates a new {@link CBLDocument document} instance tied to this collection.
     *  The document will not be persisted to the database until you save it.
     *  @param id  The document ID, which must be unique in the Collection.
     *             If you pass `null`, a random ID will be generated.
     *  @param body  The initial contents of the document; if omitted, it will be empty. */
    createDocument(id: DocID | null, body?: D): CBLDocument<D>;
    /** Saves a {@link CBLDocument document} to this collection.
     *
     *  If the document in the database has been changed since this instance was read
     *  -- by your app or by a replicator pulling revisions from a server --
     *  a conflict occurs. By default, a {@link ConflictError} will be thrown.
     *  If you pass a {@link ConflictHandler} callback, it will be invoked during the save and
     *  can decide how to resolve the conflict.
     *
     *  > **Performance note:** If you are saving multiple documents to a collection, use
     *    {@link updateMultiple} instead; it's much faster than saving one at a time.
     *
     *  @param onConflict  Optional conflict handler callback.
     *  @returns true if saved, false if the ConflictHandler decided to 'revert'.
     *  @throws ConflictError on conflict.
     *  @throws EncryptionError  if the database is encrypted and locked. */
    save(doc: DocumentMeta<D> | CBLDocument<D>, onConflict?: ConflictHandler<D>): Promise<boolean>;
    /** Prep work for save() that can be performed outside of a transaction. */
    private preSave;
    /** The actual work of saving a document. Must be called in a transaction. */
    private doSave;
    /** Deletes a {@link CBLDocument document} from this collection.
     *
     *  Deletion leaves behind an invisible "tombstone" revision, a placeholder that's used by
     *  the Replicator to sync the deletion back to a server. If you don't want the overhead,
     *  and this deletion does not need to be synced, consider using {@link purge} instead.
     *
     *  Conflicts can occur when deleting, just as on a regular save. A {@link ConflictHandler}
     *  allows you to handle them.
     *
     *  > **Performance note:** If you are deleting multiple documents, use
     *    {@link updateMultiple} instead; it's much faster than saving one at a time.
     *
     *  @param doc  The document.
     *  @param onConflict  Optional conflict handler callback.
     *  @returns true if saved, false if the ConflictHandler decided to 'revert'.
     *  @throws ConflictError on conflict.
     *  @throws EncryptionError  if the database is encrypted and locked. */
    delete(doc: DocumentMeta<D> | CBLDocument<D>, onConflict?: ConflictHandler<D>): Promise<boolean>;
    doDelete(doc: DocumentMeta<D>, onConflict?: ConflictHandler<D>): Promise<[RevID, Sequence] | undefined>;
    /** Saves and/or deletes multiple documents at once in a single database transaction.
     *  This is much faster than saving each individually.
     *
     *  The `args` object has the following properties, all optional:
     *  - `save`: Array of CBLDocuments to save
     *  - `delete`: Array of CBLDocuments to delete
     *  - `onConflict`: Conflict handler
     *  - `bestEffort`: If true, the transaction will commit even if some documents had errors.
     *                  An error will still be thrown, though.
     *  @throws {@link MultipleConflictsError} if any documents failed to update.
     *          Its `errors` property tells which documents failed and why. */
    updateMultiple(args: {
        save?: readonly CBLDocument<D>[];
        delete?: readonly CBLDocument<D>[];
        bestEffort?: boolean;
        onConflict?: ConflictHandler<D>;
    }): Promise<void>;
    /** Deletes all traces of a document, without leaving a "tombstone" revision behind.
     *  However, this means *purges are not visible to the replicator*, which has two side effects:
     *  - A push replication will not push the deletion to a server.
     *  - If the document is later updated on the server side, the next pull replication will
     *    download the new revision.
     *  @param doc  The document or DocID. */
    purge(doc: CBLDocument<D> | DocID): Promise<void>;
    /** {@link purge Purges} multiple documents at once. */
    purgeMultiple(docs: ReadonlyArray<CBLDocument<D> | DocID>): Promise<void>;
    /** Invokes an optional ConflictHandler.
     *  @returns true if the handler resolved the conflict, false if it returned 'ignore'.
     *  @throws ConflictError if there is no handler, or if it returned 'fail'. */
    private handleConflict;
    private saveNewBlobsIn;
    /** Adds the digest of every blob in every document to the set [allDigests]. @internal */
    collectBlobDigests(allDigests: Set<string>): Promise<void>;
    /** Adds a listener function that will be called after any document(s) change.
     *  If documents are changed while in a transaction, the listener is not called until the
     *  transaction successfully commits.
     *
     *  > Note:  Purged and expired documents do not trigger notifications.
     *
     *  @param callback  The function to be called after documents change.
     *  @returns  A ListenerToken whose {@link ListenerToken.remove} method you can call to
     *            remove the listener. */
    addChangeListener(callback: CollectionChangeCallback): ListenerToken;
    /** Adds a listener function that will be called after a specific document changes.
     *
     *  > Note: If the document is changed while in a transaction, the listener is not called
     *    until the transaction successfully commits.
     *
     *  > Note: Purged and expired documents do not trigger notifications.
     *
     *  @param docID The ID of the document to monitor.
     *  @param callback  The function to be called after the document changes.
     *  @returns  A ListenerToken whose {@link ListenerToken.remove} method you can call to
     *            remove the listener. */
    addDocumentChangeListener(docID: DocID, callback: DocumentChangeCallback): ListenerToken;
    private isListening;
    /** Called via a Dexie hook after any change in the collection's table. @internal */
    onMutate(req: dexie.DBCoreMutateRequest, res: dexie.DBCoreMutateResponse): void;
    private postChangeEvent;
    /** By default, returns the number of documents in the collection.
     *  If `what` is "deleted", it returns the number of deleted docs ("tombstones".)
     *  If `what` is "includeDeleted", it returns the total number of live and deleted docs. */
    count(what?: 'docs' | 'deleted' | 'includeDeleted'): Promise<number>;
    /** Invokes the callback with each (undeleted) Document of the Collection, ordered by docID.
     *  The callback should return true to continue, or false to stop the iteration.
     *  @returns  True if the iteration completed, false if it was stopped. */
    eachDocument(callback: (doc: CBLDocument<D>) => boolean): Promise<boolean>;
    /** Returns the DocIDs of all (undeleted) documents. */
    documentIDs(): Promise<DocID[]>;
    /** Returns the DocIDs of all deleted documents. */
    deletedDocumentIDs(): Promise<DocID[]>;
    /** Returns the DocIDs of all documents that have unresolved replication conflicts. @internal*/
    conflictedDocumentIDs(): Promise<DocID[]>;
    private docIDsByFlags;
    /** Sets or clears an expiration date for a document.
     *  @param doc  The document or DocID
     *  @param expiration  Can be an absolute `Date`,
     *                     or a number interpreted as milliseconds into the future,
     *                     or `undefined` to disable expiration.
     *  @throws if the document doesn't exist. */
    setDocumentExpiration(doc: CBLDocument<D> | DocID, expiration: Date | number | undefined): Promise<void>;
    /** Gets a document's expiration date.
     *  @returns The expiration date, or `undefined` if none, or if the document doesn't exist. */
    getDocumentExpiration(doc: CBLDocument<D> | DocID): Promise<Date | undefined>;
    /** Returns the next time (milliseconds since epoch) at which a doc will expire. @internal */
    nextExpirationTime(): Promise<number | undefined>;
    /** Purges all documents whose expiration date has arrived.
     *  Returns the number of documents purged. @internal */
    expireDocs(): Promise<number>;
    private startExpTimer;
    private stopExpTimer;
    /** Creates a Dexie schema string for use by the `Version.stores()` method.  @internal */
    static dexieIndexSpec<D extends CBLDictLike<D>>(cfg: CollectionConfig<D>): string;
    /** Returns the Dexie index name of an IndexConfig */
    private static indexNameFromSpec;
    /** Returns the collection's indexes, including the automatic ones. @internal */
    getIndexes(): Index[];
    /** Returns the index, if any, whose primary key is `property`.
     *  If there is more than one, it picks the one with the fewest properties.  @internal */
    indexOfProperty(property: DocProperty, type?: IndexType): Index | undefined;
    /** Returns the collection's UUID, used for saving the remote checkpoint on the server.
     *  @internal */
    getClientID(): Promise<string>;
    /** Returns the locally-stored Checkpoint for a given server URL.
     *  @internal */
    getCheckpoint(url: string): Promise<repl.Checkpoint | undefined>;
    /** Saves the local Checkpoint for a given server URL.
     *  @internal */
    setCheckpoint(url: string, checkpoint: repl.Checkpoint): Promise<void>;
    /** The last/highest sequence number assigned to a document.
     *  @internal */
    lastSequence(): Promise<Sequence>;
    /** Gets the local current revision(s) of a document, during a pull operation.
     *  @param id  The document ID.
     *  @param serverRevID  The current revID on the server.
     *  @returns  Array of current revIDs, or null if the document is up to date with the server.
     *  @internal */
    getAncestorRevs(id: DocID, serverRevID: RevID): Promise<RevID[] | null>;
    /** Saves multiple revisions received from the server.
     *  @param newRevs  Array of revisions received from the server.
     *  @param assumeNew  Set this to true if the docs most likely don't exist locally.
     *  @returns  The last Sequence added, and optionally the set of DocIDs with conflicts.
     *  @internal */
    putRemoteRevisions(newRevs: readonly repl.RemoteRevision[], assumeNew: boolean): Promise<{
        lastSequence: Sequence;
        conflicts?: Set<DocID>;
    }>;
    private putNewRemoteRevisions;
    private bulkAdd;
    /** Returns an ordered list of revisions that were created since a given local Sequence.
     *  @param since  The sequence to start just past; use `undefined` for all changes.
     *  @param limit  The maximum number of revisions to return.
     *  @returns  An array of `LocalRevision`, ordered by Sequence.
     *  @internal */
    getDocsSinceSequence(since: Sequence | undefined, limit: number): Promise<Array<repl.LocalRevision>>;
    /** Resolves a replication conflict. Returns false if `revID` is out of date. @internal */
    resolveConflict(docID: DocID, revID: RevID, resolvedBody: CBLDictionary | null): Promise<boolean>;
    /** Creates a LocalRevision from a RemoteRevision. */
    private createLocalRev;
    /** Updates or creates a LocalRevision from a RemoteRevision. */
    private updateLocalRev;
    /** Encrypts properties of `rev.body` and puts the ciphertext in `rev.encrypted`.
     *  - Precondition: *Codec exists* and is unlocked.
     *  - Precondition: `rev.body` contains _all_ doc properties. */
    private encryptLocalRev;
    /** Encrypts properties of each rev's `body` and puts the ciphertext in its `encrypted`. */
    private encryptLocalRevs;
    /** Converts a LocalRevision read from the Table into a client Document object. */
    private revToDoc;
    private nextSequence;
    /** generates the next consecutive sequence number; non-async but #meta must be loaded already */
    private _nextSequence;
    private getMeta;
    private _actuallyReadMeta;
    /** Saves cached changes (`this.meta`) back to the db. Called by Database.inTransaction.
        @internal */
    transactionEnding(committing: boolean): Promise<void>;
    /** Posts change notifications after a transaction is committed.
     *  Called by Database.inTransaction. @internal */
    transactionEnded(committing: boolean): void;
    private _readMeta;
    /** The MetaStore table. */
    private get metaTable();
}
export {};
