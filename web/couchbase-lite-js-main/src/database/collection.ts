//
// collection.ts
//
// Copyright 2024-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { Database, type SchemaKeys } from "./database";
import { ReadWrite, type TransactionMode } from "./database";
import { DocIDProperty, DocProperty, ExpiresProperty, SequenceProperty } from "./docProperty";
import { MetaStore, CheckpointStore, type LocalRevision, type CollectionMeta, generateRevID, getGeneration, ExpiresKey, SeqKey, RevFlagBlobby, RevFlagDeleted, RevFlagConflicted, type RevisionFlags, revIsDeleted, IDKey }
    from "./internals";
import type { DocID} from "./types";
import { assertValidDocID, EqualValues, type RevID, type Sequence } from "./types";
import { assert, assertDefined } from "@/util/assert";
import * as repl from "../replicator/types";
import type { JSONObject } from "@/util/json_types";
import { DocumentMeta, generateDocID, meta, type CBLDictLike, type CBLDocument } from "./document";
import { ContainsBlobs, ForEachBlob, ForEachBloblike, ImportBlobs, NewToExistingBlobs } from "@/blob/doc_blobs";
import { NewBlob } from "@/blob/blob";
import type { CBLDictionary } from "./types";
import type * as logtape from "@logtape/logtape";
import { RevProducer, RowPasser } from "@/query/pipeline";
import type { RowState } from "@/query/eval";
import { EvalContext } from "@/query/eval";
import * as dexie from "dexie";
import { type CryptoCodec, EncryptionError, type PartlyEncrypted } from "./cryptoCodec";
import { DBLogger } from "../util/logging";
import { ListenerToken } from "@/couchbase-lite";


export const DefaultCollectionName = "_default";


//-------- CONFIGURATION:


// Matches a string that starts with a key of D and a '.'.
type SchemaPath<D extends CBLDictLike<D>>     = `${SchemaKeys<D>}.${string}`;
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
    readonly on         : SchemaProperty<D> | SchemaProperty<D>[];
    readonly type?      : IndexType;
    readonly unique?    : boolean;
}

export type IndexType = typeof ValueIndex | typeof ArrayIndex;

/** Identifies a "normal" value index in an {@link IndexConfig}. */
export const ValueIndex = "value";

/** Identifies an array index in an {@link IndexConfig}. */
export const ArrayIndex = "array";

export interface Index {
    name    : string,
    type    : IndexType,
    on      : DocProperty[],
    unique? : boolean,
};


//-------- CONFLICT HANDLING:


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
export type ConflictHandler<D extends CBLDictLike<D> = CBLDictionary> =
    (doc: CBLDocument<D>, conflictingDoc?: CBLDocument<D>) => ConflictHandlerResult;


/** A simple {@link ConflictHandler} function that always saves the current document,
 *  overwriting any changes in the database. */
export function LastWriteWins<D extends CBLDictLike<D> = CBLDictionary>(_doc: CBLDocument<D>, _conflictingDoc?: CBLDocument<D>): ConflictHandlerResult {
    return 'replace';
}


/** A {@link ConflictHandler} function that saves the document if its RevisionID shows it has more
 *  edits than the currently-stored revision; else it leaves the stored revision. */
export function MostWritesWins<D extends CBLDictLike<D> = CBLDictionary>(doc: CBLDocument<D>, conflictingDoc?: CBLDocument<D>): ConflictHandlerResult {
    if (conflictingDoc === undefined)
        return 'replace';
    const myRev = meta(doc).revisionID;
    if (myRev && getGeneration(myRev) >= getGeneration(meta(conflictingDoc).revisionID!))
        return 'replace';
    else
        return 'revert';
}


/** Error thrown when saving or deleting a doc, if there is a conflicting revision already in the DB
 *  and either no conflict handler was given or the conflict handler returned 'fail'. */
export class ConflictError extends Error {
    constructor(what: string,
                public docID: DocID,
                public revID: RevID | undefined,
                public savedRevID: RevID | undefined)
    {
        super(`Conflict ${what} "${docID}" rev ${revID}; saved revision is ${savedRevID}`);
        this.name = "Conflict";
    }
}


/** Error thrown by {@link Collection.updateMultiple} if it wasn't able to save/delete all the documents.
 *  @property errors  A Map containing all the errors that occurred. */
export class MultipleConflictsError extends Error {
    constructor(public readonly errors: Map<DocID, Error>) {
        super(`Conflict(s) saving ${errors.size} documents`);
        this.name = "MultipleConflicts";
    }
}


//-------- CHANGE LISTENERS:


/** Information about a change to a document.
 *  Passed to a {@link CollectionChangeCallback} or a {@link DocumentChangeCallback}. */
export interface DocumentChange {
    id:         DocID,
    rev:        RevID,
    sequence:   Sequence,
    deleted?:   boolean,
}

/** Information about changes to documents in a collection. */
export type CollectionChange = Map<DocID,DocumentChange>;

export type CollectionChangeCallback = (change: CollectionChange) => void;

export type DocumentChangeCallback = (change: DocumentChange) => void;


//-------- COLLECTION CLASS:


// Matches valid collection names.
const kCollOrScope = "(_default|([a-zA-Z0-9][-_a-zA-Z0-9%]*))";
const kCollectionNameRegex = new RegExp(`^${kCollOrScope}(\\.${kCollOrScope})?$`);


/** Represents a single collection (namespace) of documents in a Database.
 *
 *  @template D  The document type, an interface; defaults to {@link CBLDictionary}.
 *  @property database  The owning Database.
 *  @property name  The Collection's name.
 *  @property config  The configuration with which the Collection was created. */
export class Collection<D extends CBLDictLike<D> = CBLDictionary> {

    /** @internal */
    constructor(public readonly database: Database,
                public readonly name: string,
                public readonly config: CollectionConfig<D>,
                protected readonly db: dexie.Dexie,
                codec: CryptoCodec | undefined) {
        this.#table = db.table(name);
        this.#codec = codec;
        this.logger = DBLogger.getChild(['c', this.name]).with({db: database.name});

        const indexes = this.config.indexes;
        if (indexes) {
            for (const spec of indexes) {
                let property: string;
                if (typeof spec === "string")
                    property = spec;
                else if (typeof spec.on === "string")
                    property = spec.on;
                else
                    property = spec.on[0];
                this.#properties.set(property, DocProperty.create(property, true));
            }
        }
    }


    /** Database calls this right after the constructor.  @internal */
    async open() {
        if (this.#codec)
            this.#unencrypted = (await this.getMeta())?.unencryptedProperties;
        void(this.startExpTimer());
    }


    /** Checks that a collection name is valid. If not, throws.  @internal */
    static validateName(name: string) {
        if (!kCollectionNameRegex.test(name))
            throw Error(`Invalid collection name '${name}'`);
    }


    /** {@link https://logtape.org LogTape} logger instance for this Collection. @internal */
    readonly logger : logtape.Logger;


    /** @internal */
    get dexieTable() {return this.#table;}


    /** True if the database is open.  @internal */
    get isOpen(): boolean {return this.#table.db.isOpen();}


    /** @internal */
    closing() {
        this.stopExpTimer();
        this.#codec = undefined;
    }


    /** Opens a {@link Database.inTransaction transaction} on this collection only and invokes the callback.
     *  When the callback returns, the transaction commits.
     *  If the callback throws an exception, the transaction aborts.
     *  @remarks
     *  >  In the transaction you can only modify this collection. If you need to modify
     *  >  multiple collections, use {@link Database.inTransaction} instead.
     *  @template T  The type returned by the callback; usually inferred.
     *  @internal */
    async inTransaction<T>(mode: TransactionMode,
                           callback: (collection:Collection<D>) => T) : Promise<T> {
        return await this.database.inTransaction(mode, [this], async () => {
            return await callback(this);
        });
    }


    /** Translates a public property name/path to a DocProperty object. @internal */
    property(name: string): DocProperty {
        let prop = this.#properties.get(name);
        if (prop === undefined) {
            prop = DocProperty.create(name, false);
            if (this.#codec)
                prop.encrypted = !this.#unencrypted?.has(prop.rootName);
            this.#properties.set(name, prop);
        }
        return prop;
    }


    /** @internal (no need to document this!) */
    toString(): string {return `Collection[${this.name} in ${this.database.name}]`;}


    //-------- ENCRYPTION:


    // Implementation note: Avoid doing crypto operations during a transaction
    // because they're async and will cause the transaction to commit too early.
    // In places where that's unavoidable (while saving or loading a document)
    // we have to use Dexie's `waitFor()` hack.


    /** @internal */
    get unencryptedProperties() {return this.#unencrypted;}


    /** Encrypts the documents in this Collection.  @internal */
    async rekey(newCodec: CryptoCodec | undefined, exceptProperties?: Set<string> | Array<string>) {
        assert(dexie.Dexie.currentTransaction?.active, "Must be called in a transaction");

        const docIDs = await this.documentIDs();

        if (newCodec) {
            // Make exceptProperties a Set and validate it:
            if (exceptProperties === undefined)
                exceptProperties = new Set();
            else if (Array.isArray(exceptProperties))
                exceptProperties = new Set(exceptProperties);
            for (const name of exceptProperties) {
                assert(!name.includes('.'),
                       `Only top-level properties can be excluded from encryption, not "${name}"`);
            }

            // Also exclude all indexed properties from encryption:
            const indexes = this.config.indexes;
            if (indexes) {
                const exclude = (key: string, except: Set<string>) => {
                    const name = this.#properties.get(key)?.rootName;   // get 1st component of path
                    if (name)
                        except.add(name);
                };
                for (const spec of indexes) {
                    if (typeof spec === "string")
                        exclude(spec, exceptProperties);
                    else if (typeof spec.on === "string")
                        exclude(spec.on, exceptProperties);
                    else
                        for (const p of spec.on)
                            exclude(p, exceptProperties);
                }
            }
            this.logger.info `Encrypting ${docIDs.length} documents, except for properties ${Array.from(exceptProperties)}`;
        } else {
            this.logger.info `Decrypting ${docIDs.length} documents...`;
            exceptProperties = undefined;
        }

        // Now encrypt/decrypt all documents:
        for (const docID of docIDs) {
            let rev = (await this.#table.get(docID))!;
            if (!revIsDeleted(rev)) {
                const wasEncrypted = rev.encrypted !== undefined;
                if (wasEncrypted)
                    await this.decryptRevision(rev);    // decrypt with old codec
                if (newCodec) {
                    const {body, encrypted} = await Database.waitFor(
                        newCodec.partlyEncrypt(rev.body, exceptProperties) );
                    rev.body = body;
                    rev.encrypted = encrypted;
                }
                if (wasEncrypted || rev.encrypted) {
                    await this.#table.put(rev);
                }
            }
        }

        this.resetEncryption(newCodec, exceptProperties);

        // Store the collection's set of unencrypted properties:
        const metadata = await this.getMeta();
        metadata.unencryptedProperties = exceptProperties;
        this.#metaChanged = true;

        this.logger.info `...done encrypting/decrypting collection!`;
    }


    /** Called by `rekey`, and by the Database after `encrypt` or `decrypt` if something went wrong.
     *  @internal */
    resetEncryption(codec: CryptoCodec | undefined,
                    unencryptedProperties: Set<string> | undefined) {
        this.#codec = codec;
        this.#unencrypted = unencryptedProperties;
        // Update the `encrypted` property of my DocProperty objects:
        for (let prop of this.#properties.values())
            if (!prop.indexed)
                prop.encrypted = unencryptedProperties !== undefined && unencryptedProperties.has(prop.rootName);
    }


    /** Called by queries to decrypt a LocalRevision returned from a Dexie query.  @internal */
    async decryptRevision(rev: LocalRevision) {
        if (rev.encrypted) {
            if (!this.#codec)
                throw new EncryptionError("Document is encrypted");
            await Database.waitFor(this.#codec.decryptRevision(rev));
        }
    }


    //-------- CRUD:


    /** Loads an existing {@link CBLDocument document}, or returns `undefined` if it doesn't exist. */
    async getDocument(id: DocID) : Promise<CBLDocument<D> | undefined> {
        const rev = await this.getRevision(id, true);
        if (!rev) {
            this.logger.info("Get document {docID} -- missing", {docID: id});
            return undefined;
        }
        this.logger.info("Get document {docID}", {docID: id, revID: rev.rev});
        return this.revToDoc(rev);
    }


    /** Gets an existing document in its raw `LocalRevision` form. @internal
     *  @throws EncryptionError  if `decrypt` is true, doc is encrypted & collection is locked. */
    async getRevision(id: DocID, decrypt: boolean) : Promise<LocalRevision | undefined> {
        const rev = await this.#table.get(id);
        if (rev?.encrypted && decrypt)
            await this.decryptRevision(rev);
        return rev;
    }


    /** Creates a new {@link CBLDocument document} instance tied to this collection.
     *  The document will not be persisted to the database until you save it.
     *  @param id  The document ID, which must be unique in the Collection.
     *             If you pass `null`, a random ID will be generated.
     *  @param body  The initial contents of the document; if omitted, it will be empty. */
    createDocument(id: DocID | null, body?: D): CBLDocument<D> {
        if (!body) body = {} as D;
        return new DocumentMeta<D>(this, id ?? generateDocID(), body).body;
    }


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
    async save(doc: DocumentMeta<D> | CBLDocument<D>,
               onConflict?: ConflictHandler<D>): Promise<boolean>
    {
        const s = await this.preSave(doc);
        const saved = await this.inTransaction(ReadWrite, async () => {
            if (!this.#meta) await this.getMeta();
            return await this.doSave(s, onConflict);
        });
        s.postSave();
        if (saved)
            this.logger.info("Saved doc {docID}", {docID: s.doc.id, revID: s.newRevID});
        return saved;
    }


    /** Prep work for save() that can be performed outside of a transaction. */
    private async preSave(doc: DocumentMeta<D> | CBLDocument<D>, deleting = false): Promise<Saving<D>> {
        const s = new Saving(doc, deleting);
        assert(s.doc.collection === this, "Saving document to wrong Collection");
        if (!deleting && this.#codec) {
            s.newBody = await Database.waitFor(
                this.#codec.partlyEncrypt(s.doc.body as JSONObject, this.#unencrypted));
        }
        return s;
    }


    /** The actual work of saving a document. Must be called in a transaction. */
    private async doSave(s: Saving<D>, onConflict?: ConflictHandler<D>): Promise<boolean> {
        const doc = s.doc;
        let rev: LocalRevision | undefined;
        s.newSeq = this._nextSequence();

        // First, save any new blobs:
        if (s.blobStatus > 1)
            await this.saveNewBlobsIn(s.doc.body);

        if (doc.revisionID === undefined) {
            // This is a newly created CBLDocument, so try an add:
            const x = await this.database.tryAdd(this.#table, s.makeRevision());
            if (x === undefined)
                return true; // -> Success!

            // Constraint error probably means the doc exists...
            rev = (await this.#table.get(doc.id));
            if (!rev)
                throw x;    // ...but if it doesn't, rethrow the error (must be an index issue)
            if (!revIsDeleted(rev)) {
                // Conflict with an existing doc!
                if (!this.handleConflict("saving", onConflict, doc, rev)) {
                    s.newSeq = undefined;
                    return false;  // -> Conflict
                }
                if (s.updateFrom(rev.rev))
                    await this.saveNewBlobsIn(doc.body);
            }

        } else {
            // Saving existing document; check the rev matches:
            rev = await this.#table.get(doc.id);
            if (!rev || rev.rev !== doc.revisionID) {
                // Conflict with an existing doc; or doc was purged:
                if (!this.handleConflict("saving", onConflict, doc, rev)) {
                    s.newSeq = undefined;
                    return false;  // -> Conflict
                }

                if (s.updateFrom(rev?.rev))
                    await this.saveNewBlobsIn(doc.body);

                if (!rev) {
                    // doc was purged, so re-add it:
                    await this.#table.add(s.makeRevision());
                    return true; // -> Success!
                }
            }
        }

        // Finally put the updated rev:
        s.updateRevision(rev);
        await this.#table.put(rev);
        return true; // -> Success!
    }


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
    async delete(doc: DocumentMeta<D> | CBLDocument<D>,
                 onConflict?: ConflictHandler<D>): Promise<boolean>
    {
        if (!(doc instanceof DocumentMeta))
            doc = meta(doc);
        assert(doc.collection === this, "Saving document to wrong Collection");
        assert(doc.revisionID !== undefined, "Document has not been saved");

        let result = await this.inTransaction(ReadWrite, async () => {
            return await this.doDelete(doc, onConflict);
        });
        if (result === undefined)
            return false;
        doc.setBody({} as D);
        doc._updateRev(result[0], result[1]);
        this.logger.info("Deleted doc {docID}", {docID: doc.id});
        return true;
    }


    async doDelete(doc: DocumentMeta<D>, onConflict?: ConflictHandler<D>): Promise<[RevID,Sequence] | undefined> {
        assert(doc.collection === this, "Saving document to wrong Collection");
        assert(doc.revisionID !== undefined, "Document has not been saved");
        const rev = await this.#table.get(doc.id);
        if (!rev) {
            // No-op: it's been purged
            return [doc.revisionID, doc.sequence!];
        } else if (revIsDeleted(rev)) {
            // No-op: It's already deleted
            return [rev.rev, rev.seq];
        } else {
            if (rev.rev !== doc.revisionID) {
                if (!this.handleConflict("deleting", onConflict, doc, rev))
                    return undefined;
            }
            rev.rev = generateRevID(doc.revisionID, doc.body, true);
            rev.seq = await this.nextSequence();
            rev.body = {};
            rev.encrypted = undefined;
            rev.flags = ((rev.flags ?? 0) | RevFlagDeleted & ~RevFlagBlobby) as RevisionFlags;
            await this.#table.put(rev);
            return [rev.rev, rev.seq];
        }
    }


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
    async updateMultiple(args: {
        save?: readonly CBLDocument<D>[],
        delete?: readonly CBLDocument<D>[],
        bestEffort? : boolean,
        onConflict?: ConflictHandler<D>}): Promise<void>
    {
        const start = Date.now();
        const inserts: Saving<D>[] = [];
        const updates: Saving<D>[] = [];
        const deletes: Saving<D>[] = [];
        if (args.save) {
            this.logger.info `Saving ${args.save.length} docs ...`;
            // Divide the docs up into new ones to insert, and the rest to update:
            for (const doc of args.save) {
                const s = await this.preSave(doc);
                if (s.doc.revisionID === undefined)
                    inserts.push(s);
                else
                    updates.push(s);
            }
        }
        if (args.delete) {
            this.logger.info `Deleting ${args.delete.length} docs ...`;
            for (const doc of args.delete)
                deletes.push(await this.preSave(doc, true));
        }
        const total = inserts.length + updates.length + deletes.length;
        if (total === 0)
            return;

        let completed: Saving<D>[] = [];
        let failures = new Map<DocID,Error>();
        await this.inTransaction(ReadWrite, async () => {
            await this.getMeta();

            if (inserts.length > 0) {
                // Try inserting revs of docs with no parent revision:
                this.logger.debug `... inserting ${inserts.length} of the docs ...`;
                let conflictIndices = await this.bulkAdd(inserts.map( s => {
                    s.newSeq = this._nextSequence();
                    return s.makeRevision();
                }));
                if (conflictIndices === undefined) {
                    completed.push(...inserts);
                } else {
                    const conflictSet = new Set(conflictIndices);
                    inserts.forEach( (insert, i) => {
                        if (conflictSet.has(i)) {
                            // On conflict, add it to the list of regular saves:
                            insert.newSeq = undefined;
                            updates.push(insert);
                        } else {
                            completed.push(insert);
                        }
                    });
                }
            }

            if (updates.length > 0) {
                // Regular saves:
                this.logger.debug `... updating ${updates.length} of the docs ...`;
                for (const s of updates) {
                    try {
                        if (await this.doSave(s, args.onConflict))
                            completed.push(s);
                    } catch (x) {
                        failures.set(s.doc.id, x as Error);
                    }
                }
            }

            if (deletes.length > 0) {
                // Deletes:
                this.logger.debug `... deleting ${deletes.length} of the docs ...`;
                for (const s of deletes) {
                    try {
                        const result = await this.doDelete(s.doc, args.onConflict);
                        if (result) {
                            [s.newRevID, s.newSeq] = result;
                            completed.push(s);
                        }
                    } catch (x) {
                        failures.set(s.doc.id, x as Error);
                    }
                }
            }

            if (failures.size > 0) {
                this.logger.error `saveMultiple: ${failures.size} of ${total} docs failed`;
                // Without `bestEffort`, throw inside txn so it will abort:
                if (!args.bestEffort)
                    throw new MultipleConflictsError(failures);
            }
        });

        // After the commit, update the revIDs & sequences of the saved docs:
        for (const s of completed)
            s.postSave();

        this.logger.info `Updated ${completed.length} of ${total} docs in ${Date.now() - start}ms`;

        // With `bestEffort`, throw _after_ transaction commits:
        if (failures.size > 0 && args.bestEffort)
            throw new MultipleConflictsError(failures);
    }


    /** Deletes all traces of a document, without leaving a "tombstone" revision behind.
     *  However, this means *purges are not visible to the replicator*, which has two side effects:
     *  - A push replication will not push the deletion to a server.
     *  - If the document is later updated on the server side, the next pull replication will
     *    download the new revision.
     *  @param doc  The document or DocID. */
    async purge(doc: CBLDocument<D> | DocID): Promise<void> {
        const id = (typeof doc === "string") ? doc : meta(doc).id;
        await this.#table.delete(id);
        this.logger.info("Purged doc {docID}", {docID: id});
    }


    /** {@link purge Purges} multiple documents at once. */
    async purgeMultiple(docs: ReadonlyArray<CBLDocument<D> | DocID>): Promise<void> {
        const docIDs = docs.map( doc => (typeof doc === 'string') ? doc : meta(doc).id );
        await this.#table.where(IDKey).anyOf(docIDs).delete();
    }


    /** Invokes an optional ConflictHandler.
     *  @returns true if the handler resolved the conflict, false if it returned 'ignore'.
     *  @throws ConflictError if there is no handler, or if it returned 'fail'. */
    private handleConflict(what: string,
                           onConflict: ConflictHandler<D> | undefined,
                           docMeta: DocumentMeta<D>,
                           rev: LocalRevision | undefined): boolean
    {
        if (onConflict !== undefined) {
            const storedDoc = rev ? this.revToDoc(rev) : undefined;
            switch (onConflict(docMeta.body, storedDoc)) {
                case 'replace':
                    return true;
                case 'revert':
                    if (rev) {
                        docMeta.setBody(rev.body as D);
                        docMeta._updateRev(rev?.rev, rev.seq);
                    }
                    return false;
                case 'fail':
                    break;
            }
        }
        throw new ConflictError(what, docMeta.id, docMeta.revisionID, rev?.rev);
    }


    private async saveNewBlobsIn(body: CBLDictionary) {
        const newBlobs = new Array<NewBlob>();
        ForEachBlob(body, (blob, _path) => {
            if (blob instanceof NewBlob)
                newBlobs.push(blob);
            return true;
        });
        for (const blob of newBlobs)
            await this.database.blobStore.saveBlob(blob.contents, blob.digest);
        NewToExistingBlobs(body, this.database.blobLoader);
    }


    /** Adds the digest of every blob in every document to the set [allDigests]. @internal */
    async collectBlobDigests(allDigests: Set<string>) {
        const ids = await this.#table
            .where("flags")
            .anyOf( [RevFlagBlobby, RevFlagBlobby | RevFlagConflicted] )
            .primaryKeys();
        console.log(`collectBlobDigests: ${ids}`);
        for (const docID of ids) {
            const rev = (await this.#table.get(docID))!;
            if (rev.encrypted)
                await this.decryptRevision(rev);
            ForEachBloblike(rev.body, blob => allDigests.add(blob.digest) );
            if (rev.conflict)
                ForEachBloblike(rev.conflict, blob => allDigests.add(blob.digest) );
        }
    }


    //-------- EVENT LISTENERS:


    /** Adds a listener function that will be called after any document(s) change.
     *  If documents are changed while in a transaction, the listener is not called until the
     *  transaction successfully commits.
     *
     *  > Note:  Purged and expired documents do not trigger notifications.
     *
     *  @param callback  The function to be called after documents change.
     *  @returns  A ListenerToken whose {@link ListenerToken.remove} method you can call to
     *            remove the listener. */
    addChangeListener(callback: CollectionChangeCallback): ListenerToken {
        if (!this.isListening())
            this.database.observeChangesFor(this.name, true);
        this.#changeListeners.add(callback);

        return new ListenerToken( () => {
            this.#changeListeners.delete(callback);
            if (!this.isListening()) {
                this.#changes = undefined;
                this.database.observeChangesFor(this.name, false);
            }
        });
    }


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
    addDocumentChangeListener(docID: DocID, callback: DocumentChangeCallback): ListenerToken {
        if (!this.isListening())
            this.database.observeChangesFor(this.name, true);
        let listeners = this.#docListeners.get(docID);
        if (!listeners) {
            listeners = new Set<DocumentChangeCallback>();
            this.#docListeners.set(docID, listeners);
        }
        listeners.add(callback);

        return new ListenerToken( () => {
            this.#docListeners.get(docID)?.delete(callback);
            if (!this.isListening()) {
                this.#changes = undefined;
                this.database.observeChangesFor(this.name, false);
            }
        });
    }


    private isListening(): boolean {
        return this.#docListeners.size > 0 && this.#changeListeners.size > 0;
    }


    /** Called via a Dexie hook after any change in the collection's table. @internal */
    onMutate(req :dexie.DBCoreMutateRequest, res: dexie.DBCoreMutateResponse): void {
        if (this.#changeListeners.size === 0)
            return;

        // Subroutine that omits items marked as failed in `res.failures`.
        function filterSuccesses<T>(items: readonly unknown[]): T[] {
            if (items.length > 0 && Object.keys(res.failures).length > 0)
                return items.filter( (_item, index) => res.failures[index] === undefined ) as T[];
            else
                return items as T[];
        }

        switch (req.type) {
            case 'add':
            case 'put': {
                const revs = filterSuccesses<LocalRevision>(req.values);
                if (revs.length > 0) {
                    if (this.#changes === undefined)
                        this.#changes = new Map<DocID,DocumentChange>();
                    for (const rev of revs) {
                        let change: DocumentChange = {id: rev.id, rev: rev.rev, sequence: rev.seq};
                        if (revIsDeleted(rev))
                            change.deleted = true;
                        Object.freeze(change);
                        this.#changes.set(rev.id, change);
                    }
                    this.logger.debug `MUTATE ${this.name}: ${req.type.toUpperCase()}: ${revs.map(rev => rev.id).join(", ")}`;
                }
                break;
            }
            case 'delete': {
                const docIDs = filterSuccesses<DocID>(req.keys);
                if (docIDs.length > 0) {
                    // Deletion is equivalent to a CBL purge, and we don't notify about those,
                    // so remove any prior change entries:
                    for (const docID of docIDs)
                        this.#changes?.delete(docID);
                    this.logger.debug `MUTATE ${this.name}: DELETE keys = ${docIDs.join(", ")}`;
                }
                break;
            }
            case 'deleteRange': {
                this.logger.debug `MUTATE ${this.name}: DELETE RANGE values = ${req.range.lower} -- ${req.range.upper}`;
                //TODO: Should I remove all the keys from #changes within the key-range?
                break;
            }
        }

        if (!dexie.Dexie.currentTransaction)
            this.postChangeEvent();             // Post immediately if no transaction
    }


    // Posts accumulated changes to all change listeners.
    private postChangeEvent() {
        const changes = this.#changes;
        if (changes) {
            this.#changes = undefined;
            Object.freeze(changes);

            for (const listener of this.#changeListeners) {
                try {
                    listener(changes);
                } catch (x) {
                    this.logger.error `Caught exception in collection change listener: ${x}`;
                }
            }

            for (const [docID, listeners] of this.#docListeners) {
                const change = changes.get(docID);
                if (change) {
                    for (const listener of listeners) {
                        try {
                            listener(change);
                        } catch (x) {
                            this.logger.error `Caught exception in document change listener: ${x}`;
                        }
                    }
                }
            }
        }
    }


    //-------- QUERIES:


    /** By default, returns the number of documents in the collection.
     *  If `what` is "deleted", it returns the number of deleted docs ("tombstones".)
     *  If `what` is "includeDeleted", it returns the total number of live and deleted docs. */
    async count(what: 'docs' | 'deleted' | 'includeDeleted' = 'docs') : Promise<number> {
        const countDeletedDocs = async () => {
            // This query requires that RevFlagDeleted is the largest defined flag.
            return await this.#table.where("flags").aboveOrEqual(RevFlagDeleted).count();
        };
        switch (what) {
            case 'docs':            return (await this.#table.count()) - (await countDeletedDocs());
            case 'deleted':         return await countDeletedDocs();
            case 'includeDeleted':  return await this.#table.count();
        }
    }


    /** Invokes the callback with each (undeleted) Document of the Collection, ordered by docID.
     *  The callback should return true to continue, or false to stop the iteration.
     *  @returns  True if the iteration completed, false if it was stopped. */
    async eachDocument(callback: (doc: CBLDocument<D>) => boolean): Promise<boolean> {
        this.logger.info("Getting all documents");

        const alias = this.name;
        const ctx = new EvalContext();
        const source = new RevProducer({collection: this, alias: alias});
        const end = new RowPasser<RowState>( rowState => {
            const rev = rowState.getSourceRevision(alias);
            return callback(this.revToDoc(rev)!);
        });
        source.receiver = end;
        await source.run(ctx);
        return end.ok;
    }


    /** Returns the DocIDs of all (undeleted) documents. */
    async documentIDs(): Promise<DocID[]> {
        // (Can't do this by searching the 'flags' index, because undeleted docs are likely to have
        // no flags, hence don't appear in that index at all.)
        return await this.#table
            .toCollection()
            .filter( rev => !((rev.flags ?? 0) & RevFlagDeleted) )
            .primaryKeys() as DocID[];
    }

    /** Returns the DocIDs of all deleted documents. */
    async deletedDocumentIDs(): Promise<DocID[]> {
        return this.docIDsByFlags( whereFlags =>
            whereFlags.aboveOrEqual(RevFlagDeleted));
    }

    /** Returns the DocIDs of all documents that have unresolved replication conflicts. @internal*/
    async conflictedDocumentIDs(): Promise<DocID[]> {
        return this.docIDsByFlags( whereFlags =>
            whereFlags.between(RevFlagConflicted, RevFlagConflicted | RevFlagBlobby));
    }

    private async docIDsByFlags(cb: (where:dexie.WhereClause)=>dexie.Collection): Promise<DocID[]> {
        return await cb(this.#table.where("flags")).primaryKeys() as DocID[];
    }


    //-------- EXPIRATION:


    /** Sets or clears an expiration date for a document.
     *  @param doc  The document or DocID
     *  @param expiration  Can be an absolute `Date`,
     *                     or a number interpreted as milliseconds into the future,
     *                     or `undefined` to disable expiration.
     *  @throws if the document doesn't exist. */
    async setDocumentExpiration(doc: CBLDocument<D> | DocID, expiration: Date | number | undefined) {
        const id = (typeof doc === "string") ? doc : meta(doc).id;
        const now = Date.now();
        let t: number | undefined = undefined;
        if (expiration !== undefined) {
            t = (expiration instanceof Date)
                ? expiration.getTime()
                : (now + expiration);
        }
        if (await this.#table.update(id, {expires: t}) < 1)
            throw Error(`No such document '${id}`);
        if (t !== undefined)
            this.logger.info("Set expiration of doc {docID} to {time} sec from now",
                             {docID: id, time: (t - now) / 1000});
        else
            this.logger.info("Cleared expiration of doc {docID}", {docID: id});
        if (t !== undefined)
            void(this.startExpTimer());
    }


    /** Gets a document's expiration date.
     *  @returns The expiration date, or `undefined` if none, or if the document doesn't exist. */
    async getDocumentExpiration(doc: CBLDocument<D> | DocID): Promise<Date | undefined> {
        const id = (typeof doc === "string") ? doc : meta(doc).id;
        const expires = (await this.#table.get(id))?.expires;
        return expires ? new Date(expires) : undefined;
    }


    /** Returns the next time (milliseconds since epoch) at which a doc will expire. @internal */
    async nextExpirationTime(): Promise<number | undefined> {
        const firstRev = await this.#table.orderBy(ExpiresKey).first();
        return firstRev?.expires;
    }


    /** Purges all documents whose expiration date has arrived.
     *  Returns the number of documents purged. @internal */
    async expireDocs(): Promise<number> {
        const n = await this.#table
            .where(ExpiresKey)
            .belowOrEqual(Date.now())
            .delete();
        if (n > 0)
            this.logger.info("Deleted {n} expired docs", {n});
        return n;
    }


    private async startExpTimer() {
        this.stopExpTimer();
        if (this.isOpen && this.database.enableAutoExpiry) {
            const nextExp = await this.nextExpirationTime();
            if (nextExp !== undefined && this.#expTimeout === undefined && this.isOpen) {
                const delay = Math.max(nextExp - Date.now(), 0);
                const doExp = async () => {
                    this.#expTimeout = undefined;
                    if (this.isOpen) {
                        await this.expireDocs();
                        void(this.startExpTimer());
                    }
                };
                this.#expTimeout = setTimeout( () => void(doExp()), delay);
            }
        }
    }


    private stopExpTimer() {
        if (this.#expTimeout) {
            clearTimeout(this.#expTimeout);
            this.#expTimeout = undefined;
        }
    }


    //-------- INDEXES:


    /** Creates a Dexie schema string for use by the `Version.stores()` method.  @internal */
    static dexieIndexSpec<D extends CBLDictLike<D>>(cfg: CollectionConfig<D>): string {
        let spec = "id, &seq, flags, expires";      // The built-in indexes
        if (cfg.indexes) {
            for (const index of cfg.indexes)
                spec += ", " + Collection.indexNameFromSpec(index);
        }
        return spec;
    }


    /** Returns the Dexie index name of an IndexConfig */
    private static indexNameFromSpec(index: IndexConfig | SchemaProperty<CBLDictionary>): string {
        function bodyProperty(name: string) {return DocProperty.create(name).keypath;}

        if (typeof index === 'string') {
            return bodyProperty(index);
        } else {
            let name = "";
            switch (index.type) {
                case ValueIndex:
                case undefined:
                    if (index.unique)
                        name += "&";
                    if (typeof index.on === 'string') {
                        name += bodyProperty(index.on);
                    } else {
                        if (index.on.length === 0)
                            throw Error("Compound index must be on at least one key");
                        if (index.unique)
                            throw Error("Compound index cannot be unique");
                        name += "[" + index.on.map(bodyProperty).join("+") + "]";
                    }
                    break;
                case ArrayIndex:
                    if (typeof index.on !== 'string')
                        throw Error("Array index may not be on multiple properties");
                    name += "*" + bodyProperty(index.on);
                    break;
                default:
                    throw Error(`Invalid index type '${index.type}'`);
            }
            return name;
        }
    }


    /** Returns the collection's indexes, including the automatic ones. @internal */
    getIndexes(): Index[] {
        let indexes: Index[] = [
            {name: IDKey, type: ValueIndex, on: [this.property(DocIDProperty)], unique: true},
            {name: SeqKey, type: ValueIndex, on: [this.property(SequenceProperty)], unique: true},
            {name: ExpiresKey, type: ValueIndex, on: [this.property(ExpiresProperty)]},
        ];
        const indexesCfg = this.config.indexes;
        if (indexesCfg) {
            for (const index of indexesCfg) {
                let on: string[];
                let unique;
                let type;
                if (typeof index === 'string') {
                    on = [index];
                } else {
                    on = Array.isArray(index.on) ? index.on : [index.on];
                    type = index.type ?? ValueIndex;
                    unique = index.unique;
                }
                let indexName = Collection.indexNameFromSpec(index);
                if (indexName.startsWith("*"))
                    indexName = indexName.substring(1);// Dexie doesn't see '*' as part of the name
                indexes.push({
                    name: indexName,
                    type: type ?? ValueIndex,
                    on:   on.map( prop => this.property(prop) ),
                    unique,
                });
            }
        }
        return indexes;
    }


    /** Returns the index, if any, whose primary key is `property`.
     *  If there is more than one, it picks the one with the fewest properties.  @internal */
    indexOfProperty(property: DocProperty, type: IndexType = ValueIndex): Index | undefined {
        let bestIndex: Index | undefined;
        let indexProps = Infinity;
        if (property.indexed) {
            for (const index of this.getIndexes())
                if (index.on[0] === property && index.on.length < indexProps && index.type === type)
                    bestIndex = index;
        }
        return bestIndex;
    }


    //-------- Replicator Support:


    /** Returns the collection's UUID, used for saving the remote checkpoint on the server.
     *  @internal */
    async getClientID() : Promise<string> {
        // Assume it already exists, to avoid creating a readwrite txn:
        let myMeta = await this.getMeta();
        if (myMeta.clientID)
            return myMeta.clientID;

        // Gotta create it...
        return await this.db.transaction("rw", MetaStore, async () => {
            myMeta = await this.getMeta();
            if (!myMeta.clientID) {
                myMeta.clientID = crypto.randomUUID();
                this.#metaChanged = true;
                this.logger.debug("assigned clientID {clientID}", {clientID: myMeta.clientID});
                // will be saved when transaction commits
            }
            return myMeta.clientID;
        });
    }


    /** Returns the locally-stored Checkpoint for a given server URL.
     *  @internal */
    async getCheckpoint(url: string) {
        const c = (await this.db.table(CheckpointStore).get([this.name, url])) as JSONObject | undefined;
        return c ? repl.Checkpoint.fromObject(c) : undefined;
    }


    /** Saves the local Checkpoint for a given server URL.
     *  @internal */
    async setCheckpoint(url: string, checkpoint: repl.Checkpoint) {
        this.logger.debug("Saving checkpoint {checkpoint}", {checkpoint});
        await this.db.table(CheckpointStore).put(checkpoint, [this.name, url]);
    }


    /** The last/highest sequence number assigned to a document.
     *  @internal */
    async lastSequence() : Promise<Sequence> {
        if (this.#meta)
            return this.#meta.lastSeq;
        else
            return (await this.getMeta()).lastSeq;
    }


    /** Gets the local current revision(s) of a document, during a pull operation.
     *  @param id  The document ID.
     *  @param serverRevID  The current revID on the server.
     *  @returns  Array of current revIDs, or null if the document is up to date with the server.
     *  @internal */
    async getAncestorRevs(id: DocID, serverRevID: RevID) : Promise<RevID[] | null> {
        const myRev = await this.#table.get(id);
        if (!myRev)
            return [];
        else if (myRev.rev === serverRevID || myRev.serverRev === serverRevID)
            return null;    // already have this revision
        else if (myRev.serverRev)
            return [myRev.rev, myRev.serverRev];
        else
            return [myRev.rev];
    }


    /** Saves multiple revisions received from the server.
     *  @param newRevs  Array of revisions received from the server.
     *  @param assumeNew  Set this to true if the docs most likely don't exist locally.
     *  @returns  The last Sequence added, and optionally the set of DocIDs with conflicts.
     *  @internal */
    async putRemoteRevisions(newRevs: readonly repl.RemoteRevision[], assumeNew: boolean)
        : Promise<{lastSequence: Sequence, conflicts?: Set<DocID>}>
    {
        let lastSequence = 0 as Sequence;
        let conflicts: Set<DocID> | undefined;
        await this.inTransaction(ReadWrite, async () => {
            if (!this.#meta) await this.getMeta();
            if (assumeNew) {
                // As a shortcut, try inserting the revs as new docs:
                this.logger.debug `inserting ${newRevs.length} revs as new...`;
                const retry = await this.putNewRemoteRevisions(newRevs);
                if (retry === undefined) {
                    // Success! Inserted all the revs.
                    lastSequence = this.#meta!.lastSeq;
                    return;
                }
                newRevs = retry;
                // Fall through and retry, updating existing docs:
                //TODO: Reuse sequences assigned to the revs we're retrying
            }

            // Get the existing docs, update them from newRevs, and save:
            const docs = (await this.#table.bulkGet(newRevs.map(rev => rev.id)))
                .map( (doc, i) => this.updateLocalRev(doc, newRevs[i], this._nextSequence()) );
            if (this.#codec)
                await this.encryptLocalRevs(docs);
            await this.#table.bulkPut(docs);

            // Get the last sequence and find any conflicts:
            lastSequence = this.#meta!.lastSeq;
            for (const doc of docs) {
                if (doc.flags && (doc.flags & RevFlagConflicted)) {
                    if (conflicts === undefined)
                        conflicts = new Set<DocID>();
                    conflicts.add(doc.id);
                }
            }
        });
        assert(lastSequence > 0);
        return {lastSequence, conflicts};
    }

    // subroutine of putRemoteRevisions that uses `bulkAdd` to create new documents;
    // if any already exist, it returns them so the caller can handle them as normal updates.
    private async putNewRemoteRevisions(newRevs: readonly repl.RemoteRevision[]): Promise<repl.RemoteRevision[] | undefined> {
        const localRevs = newRevs.map( rev => this.createLocalRev(rev, this._nextSequence()) );
        if (this.#codec)
            await this.encryptLocalRevs(localRevs);

        let conflictIndices = await this.bulkAdd(localRevs);
        if (conflictIndices === undefined) {
            // Success! Inserted all the revs.
            return undefined;
        } else {
            return conflictIndices.map( i => newRevs[i] );
        }
    }


    private async bulkAdd(revs: LocalRevision[]): Promise<number[] | undefined> {
        try {
            await this.#table.bulkAdd(revs);
            return undefined;
        } catch (x) {
            if (!(x instanceof dexie.Dexie.BulkError))
                throw x;
            // Some of the revs failed; take a look:
            let retry: number[] = [];
            for (const [pos, error] of Object.entries(x.failuresByPos)) {
                const i = Number(pos);
                if (error.name !== "ConstraintError") {
                    this.logger.error("bulkAdd: '{id}' failed: {error}", {id: revs[i].id, error});
                    throw error;
                }
                retry.push(i);
            }
            return retry;
        }
    }


    /** Returns an ordered list of revisions that were created since a given local Sequence.
     *  @param since  The sequence to start just past; use `undefined` for all changes.
     *  @param limit  The maximum number of revisions to return.
     *  @returns  An array of `LocalRevision`, ordered by Sequence.
     *  @internal */
    async getDocsSinceSequence(since: Sequence | undefined, limit: number)
        : Promise<Array<repl.LocalRevision>> {
        let query;
        if (since !== undefined && since > 0)
            query = this.#table.where(SeqKey).above(since);
        else
            query = this.#table.orderBy(SeqKey);
        return (await query.limit(limit).toArray())
            .map( rev => {
                delete rev.conflict;
                return rev;
            });
    }


    /** Resolves a replication conflict. Returns false if `revID` is out of date. @internal */
    async resolveConflict(docID: DocID, revID: RevID, resolvedBody: CBLDictionary | null): Promise<boolean> {
        const ok = await this.inTransaction(ReadWrite, async () => {
            let rev = await this.#table.get(docID);
            if (rev?.rev !== revID)
                return false;   // conflict: local doc has changed

            assertDefined(rev.conflict);
            const serverWon = EqualValues(resolvedBody, rev.conflict);

            let flags = (rev.flags ?? 0) & ~(RevFlagConflicted | RevFlagDeleted | RevFlagBlobby);
            if (resolvedBody === null) {
                flags |= RevFlagDeleted;
                resolvedBody = {};
            } else {
                const blobStatus = ContainsBlobs(resolvedBody);
                if (blobStatus > 0)
                    flags |= RevFlagBlobby;
                if (blobStatus >= 2)
                    await this.saveNewBlobsIn(resolvedBody);
            }

            if (serverWon) {
                // If the server rev won, use its revID:
                assertDefined(rev.serverRev);
                rev.rev = rev.serverRev;
            } else {
                // else generate a new revID:
                rev.rev = generateRevID(revID, resolvedBody, (flags & RevFlagDeleted) !== 0);
            }

            rev.body = resolvedBody as JSONObject;   // Blob objects will be saved as regular JSON
            rev.seq = await this.nextSequence();
            rev.flags = flags ? flags as RevisionFlags : undefined;
            rev.conflict = undefined;
            await this.#table.put(rev);
            return true;
        });
        return ok;
    }


    //-------- INTERNAL REVISION HELPER METHODS:


    /** Creates a LocalRevision from a RemoteRevision. */
    private createLocalRev (newRev: repl.RemoteRevision, newSeq: Sequence) : LocalRevision {
        return {
            id:         newRev.id,
            rev:        newRev.rev,
            seq:        newSeq,
            flags:      newRev.deleted ? RevFlagDeleted : undefined,
            body:       newRev.body,
            serverRev:  newRev.rev,
        };
    }


    /** Updates or creates a LocalRevision from a RemoteRevision. */
    private updateLocalRev (rev: LocalRevision | undefined,
                            newRev: repl.RemoteRevision,
                            newSeq: Sequence) : LocalRevision
    {
        if (rev === undefined)
            return this.createLocalRev(newRev, newSeq);

        rev.seq = newSeq;
        rev.serverRev = newRev.rev;
        let flags = rev.flags ?? 0;
        if (rev.rev !== rev.serverRev && rev.rev !== newRev.rev) {
            // Conflict!
            rev.conflict = newRev.deleted ? null : newRev.body;
            flags |= RevFlagConflicted;
        } else {
            // Not conflict:
            rev.rev = newRev.rev;
            rev.body = newRev.body;
            if (newRev.deleted)
                flags |= RevFlagDeleted;
            else
                flags &= ~RevFlagDeleted;
            flags &= ~RevFlagConflicted;
            delete rev.conflict;
        }
        rev.flags = flags ? (flags as RevisionFlags) : undefined;
        return rev;
    }


    /** Encrypts properties of `rev.body` and puts the ciphertext in `rev.encrypted`.
     *  - Precondition: *Codec exists* and is unlocked.
     *  - Precondition: `rev.body` contains _all_ doc properties. */
    private async encryptLocalRev(rev: LocalRevision) : Promise<void> {
        const {body, encrypted} = await this.#codec!.partlyEncrypt(rev.body, this.#unencrypted);
        rev.body = body;
        rev.encrypted = encrypted;
    }


    /** Encrypts properties of each rev's `body` and puts the ciphertext in its `encrypted`. */
    private async encryptLocalRevs(revs: LocalRevision[]): Promise<void> {
        if (this.#codec) {
            this.logger.info `Encrypting ${revs.length} incoming revisions`;
            const promise = Promise.all( revs.map( async rev => this.encryptLocalRev(rev) ) );
            await Database.waitFor(promise);     // avoid premature commit of txn
        }
    }


    /** Converts a LocalRevision read from the Table into a client Document object. */
    private revToDoc(rev: LocalRevision) : CBLDocument<D> | undefined {
        if (rev.flags) {
            if (rev.flags & RevFlagDeleted)
                return undefined;
            if (rev.flags & RevFlagBlobby)
                ImportBlobs(rev.body, this.database.blobLoader);
        }
        return new DocumentMeta<D>(this, rev.id, rev.body as D, rev.rev, rev.seq).body;
    }


    //-------- Sequence & Transaction Support:


    // generates the next consecutive sequence number.
    private async nextSequence() : Promise<Sequence> {
        if (!this.#meta) await this.getMeta();
        return this._nextSequence();
    }

    /** generates the next consecutive sequence number; non-async but #meta must be loaded already */
    private _nextSequence(): Sequence {
        assertDefined(this.#meta);
        this.#metaChanged = true;
        return ++this.#meta.lastSeq as Sequence;
    }


    // Returns the Collection's metadata object.
    private async getMeta(): Promise<CollectionMeta> {
        if (!dexie.Dexie.currentTransaction) {
            // Outside of a transaction we don't cache meta, just read & return it every time:
            return await this._readMeta();
        }
        if (!this.#meta) {
            // Ensure `actuallyReadMeta` is called only once:
            if (!this.#metaPromise)
                this.#metaPromise = this._actuallyReadMeta();
            await this.#metaPromise;
        }
        return this.#meta!;
    }


    // subroutine of getMeta(). Do not call.
    private async _actuallyReadMeta() {
        this.#meta = await this._readMeta();
        this.#metaPromise = undefined;
        this.#metaChanged = false;
    }


    /** Saves cached changes (`this.meta`) back to the db. Called by Database.inTransaction.
        @internal */
    async transactionEnding(committing: boolean) {
        if (committing && this.#metaChanged && this.#meta)
            await this.metaTable.put(this.#meta, this.name);
        this.#metaChanged = false;
        this.#meta = undefined;
    }

    /** Posts change notifications after a transaction is committed.
     *  Called by Database.inTransaction. @internal */
    transactionEnded(committing: boolean) {
        if (committing)
            this.postChangeEvent();
        else
            this.#changes = undefined;
    }

    // Lowest-level method to get the collection metadata.
    private async _readMeta(): Promise<CollectionMeta> {
        return (await this.metaTable.get(this.name)) ?? {lastSeq: 0 as Sequence};
    }

    /** The MetaStore table. */
    private get metaTable(): dexie.Table<CollectionMeta,string>  {return this.db.table(MetaStore);}

    #table           : dexie.Table<LocalRevision, string>;  // Dexie Table instance
    #properties      = new Map<string,DocProperty>();       // Cached DocProperty instances
    #metaPromise?    : Promise<void>;                       // Current task reading metadata
    #meta?           : CollectionMeta;                      // Metadata, during a transaction
    #metaChanged     = false;                               // True if `_meta` has unsaved changes
    #expTimeout?     : number | NodeJS.Timeout;             // Timer for expiring documents
    #changes?        : Map<DocID,DocumentChange>;           // Pending changes during a txn
    #changeListeners = new Set<CollectionChangeCallback>(); // Collection change listeners
    #docListeners    = new Map<DocID,Set<DocumentChangeCallback>>; // Doc change listeners by DocID
    #codec?          : CryptoCodec;                         // Encrypts/decrypts rev bodies
    #unencrypted?    : Set<string>;                         // Properties to leave unencrypted
}


/** Temporary object used while saving or deleting a document. */
class Saving<D extends CBLDictLike<D>> {
    constructor(doc: CBLDocument<D> | DocumentMeta<D>, readonly deleting = false) {
        if (!(doc instanceof DocumentMeta))
            doc = meta(doc);
        assertValidDocID(doc.id);
        this.doc = doc;
        if (deleting) {
            this.blobStatus = 0;
            this.newBody = {body: {}};
        } else {
            this.blobStatus = ContainsBlobs(doc.body);
            this.newBody = {body: doc.body as JSONObject};
        }
        this.newRevID = generateRevID(doc.revisionID, doc.body, deleting);
    }

    /** Creates a LocalRevision object. */
    makeRevision(): LocalRevision {
        assert(!this.deleting);
        assertDefined(this.newSeq, "Saving.newSeq");
        return {
            id: this.doc.id,
            rev: this.newRevID,
            seq: this.newSeq,
            flags: this.blobStatus ? RevFlagBlobby : undefined,
            body: this.newBody.body,
            encrypted: this.newBody.encrypted,
        };
    }

    /** Updates the revID and blob status. */
    updateFrom(parentRev: RevID | undefined): boolean {
        this.newRevID = generateRevID(parentRev, this.doc.body, false);
        this.blobStatus = ContainsBlobs(this.doc.body);
        return (this.blobStatus > 1);
    }

    /** Copies my state to a `LocalRevision` read from the table. */
    updateRevision(rev: LocalRevision) {
        let flags = (rev.flags ?? 0) & ~(RevFlagDeleted | RevFlagBlobby);
        if (this.deleting)
            flags |= RevFlagDeleted;
        if (this.blobStatus > 0)
            flags |= RevFlagBlobby;
        rev.rev = this.newRevID;
        rev.seq = this.newSeq!;
        rev.flags = flags as RevisionFlags;
        rev.body = this.newBody.body;
        rev.encrypted = this.newBody.encrypted;
    }

    /** After a save has committed, updates the CBLDocument's revID and sequence. */
    postSave() {
        if (this.newSeq !== undefined) {
            this.doc._updateRev(this.newRevID, this.newSeq);
            if (this.deleting)
                this.doc.setBody({} as D);
        }
    }

    readonly doc    : DocumentMeta<D>;      // The document
    blobStatus      : 0 | 1 | 2;            // Whether it has blobs
    newBody         : PartlyEncrypted;      // The body & maybe encrypted bits
    newRevID        : RevID;                // The new revision's revID
    newSeq?         : Sequence;             // The new revision's sequence
}
