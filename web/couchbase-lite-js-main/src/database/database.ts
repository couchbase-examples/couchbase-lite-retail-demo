//
// database.ts
//
// Copyright 2024-Present Couchbase, Inc.
//
// Use of this software is governed by the Business Source License included
// in the file licenses/BSL-Couchbase.txt.  As of the Change Date specified
// in that file, in accordance with the Business Source License, use of this
// software will be governed by the Apache License, Version 2.0, included in
// the file licenses/APL2.txt.
//

import { Query } from "@/query/query";
import { assert, assertEqual } from "@/util/assert";
import { BlobStore } from "./blobStore";
import { Collection, DefaultCollectionName, type CollectionConfig } from "./collection";
import { CryptoCodec, EncryptionError } from "./cryptoCodec";
import type { CBLDictLike } from "./document";
import { BlobTableName, CheckpointStore, MetaStore, type DatabaseMeta } from "./internals";
import type { CBLDictionary } from "./types";
import type * as logtape from "@logtape/logtape";
import * as dexie from "dexie";
import { DBLogger } from "../util/logging";

export { EncryptionError } from "./cryptoCodec";

export const ReadOnly = "r";
export const ReadWrite = "rw";

export type TransactionMode = typeof ReadOnly | typeof ReadWrite;

export type TransactionCallback<T> = () => Promise<T>;


/** Default database schema: collection names are unspecified, and document types are just
 *  {@link CBLDictionary}, i.e. any property name is allowed and values can be any JSON types. */
export type NoSchema = Record<string,CBLDictionary>;
export type SchemaLike<S> = { [K in keyof S]: CBLDictLike<S[K]> }   /** @internal */
export type SchemaKeys<S> = Extract<keyof S, string>;   /** @internal */


/** Configuration for opening a Database.
 *  @template Schema  The database schema: an interface type that maps collection names to the
 *                    interfaces that represent their documents. Defaults to none. */
export interface DatabaseConfig<Schema extends SchemaLike<Schema> = NoSchema> {
    /** Name of the database, in the browser's local IndexedDB storage. */
    readonly name: string;

    /** The version number of this database configuration.
     *  This must be incremented whenever any collection configurations change. */
    readonly version: number;

    /** The collections in the database.
     *  If Schema is given, there must be an entry for each collection name declared in the schema. */
    readonly collections: CollectionsConfig<Schema>;

    /** The password to decrypt the database with, if it's encrypted.
     *  For security reasons this property is cleared when the database is opened. */
    password?: string;
}


export type CollectionsConfig<Schema extends SchemaLike<Schema> = NoSchema> =
    {readonly [K in SchemaKeys<Schema>]: CollectionConfig<Schema[K]>};


/** Describes which properties should remain unencrypted in each collection.
 *  Key is collection name, value is array or set of property names. */
export type UnencryptedProperties = Record<string, Set<string> | Array<string>>;


/** Types of database maintenance; passed to {@link Database.performMaintenance}. */
export type MaintenanceType = 'compact';


type DexieSchema = {[tableName: string]: string | null};
let sDexieOptions: {indexedDB: IDBFactory, IDBKeyRange: typeof IDBKeyRange} | undefined;


/** A Couchbase Lite database. Contains one or more named {@link Collection collections},
 *  which contain {@link CBLDocument documents}.
 *
 *  Call {@link open} to create a Database instance (the constructor is private.)
 *
 *  @template Schema  An optional interface type that improves type-safety of collection and
 *      document accessors. Its keys must be the names of the collections, and each value type
 *      is an interface that describes the properties of a document in that collection:
 *
 *      interface MySchema {
 *        shoes: {style: string, foot: "left" | "right", size: number},
 *      }
 *
 *  If you don't give a schema, the `collections` property will accept any string as a key,
 *  and collections will use {@link CBLDictionary} as their document type.
 *      */
export class Database<Schema extends SchemaLike<Schema> = NoSchema> {

    /** Call this to use a non-default implementation of IndexedDB.
     *  This is required in non-browser environments like Node, Bun and Deno!
     *  It should be called only once, **before creating any Database objects**.
     *  Example:
     *  ```
     *      import { indexedDB, IDBKeyRange } from "fake-indexeddb";
     *      Database.useIndexedDB(indexedDB, IDBKeyRange);
     *  ```
     */
    static useIndexedDB(indexedDB: IDBFactory, idbKeyRange: typeof IDBKeyRange) {
        sDexieOptions = {indexedDB: indexedDB, IDBKeyRange: idbKeyRange};
    }

    /** Enable's Dexie's debug mode, which provides meaningful stack backtraces in exceptions. */
    static debugMode(debug: boolean) {
        dexie.Dexie.debug = debug;
    }


    /** Creates a Database instance and opens the database. If a local IndexedDB database with
     *  this name exists, it will be opened; otherwise a new one is created.
     *  @param config  The database {@link DatabaseConfig configuration}
     *  @template Schema  An optional interface type that improves type-safety of collection and
     *      document accessors. Its keys must be the names of the collections, and each value type
     *      is an interface that describes the properties of a document in that collection. */
    static async open<Schema extends SchemaLike<Schema> = NoSchema>(
        config: DatabaseConfig<Schema>): Promise<Database<Schema>>
    {
        const password = config.password;
        config.password = undefined;
        return await new Database<Schema>(config).initialize(password);
    }


    /** @internal */
    static get idbFactory() {return sDexieOptions?.indexedDB ?? indexedDB;}
    /** @internal */
    static get idbKeyRange() {return sDexieOptions?.IDBKeyRange ?? IDBKeyRange;}


    private constructor(readonly config: DatabaseConfig<Schema>) {
        // https://dexie.org/docs/Tutorial/Understanding-the-basics
        // https://dexie.org/docs/Tutorial/Design#database-versioning
        // https://dexie.org/docs/Version/Version.stores()

        this.name = config.name;
        this.logger = DBLogger.with({db: this.name});

        const erasedCollCfg = config.collections as unknown as Record<string,CollectionConfig>;

        const schema: DexieSchema = {
            [MetaStore]: "",
            [CheckpointStore]: "",
            [BlobTableName]: "digest",
        };
        for (const [collName, cfg] of Object.entries(erasedCollCfg)) {
            Collection.validateName(collName);
            schema[collName] = Collection.dexieIndexSpec(cfg);
        }
        if (Object.keys(erasedCollCfg).length === 0) {
            schema[DefaultCollectionName] = Collection.dexieIndexSpec({});
        }

        this.#collectionConfig = new Map(Object.entries(erasedCollCfg));
        if (this.#collectionConfig.size === 0)
            this.#collectionConfig.set(DefaultCollectionName, {});

        this.#db = new dexie.Dexie(config.name, sDexieOptions);
        this.installDBCore();    // must happen before db.version(...).stores(...)
        this.#db.version(config.version).stores(schema);

        this.logger.info("Created Database {db}");
    }


    private async initialize(password?: string): Promise<this> {
        try {
            const metadata = await this.getMeta();
            if (metadata.challenge) {
                this.#codec = CryptoCodec.withChallenge(metadata.challenge);
                if (password === undefined || ! await this.#codec.unlock(password))
                    throw new EncryptionError("Incorrect or missing database password");
            }

            const anyThis = this as unknown as Database;
            let collections: Record<string,Collection> = {};
            for (const [collName, config] of this.#collectionConfig) {
                const collection = new Collection(anyThis, collName, config, this.#db, this.#codec) as unknown as Collection;
                await collection.open();
                collections[collName] = collection;
            }
            Object.freeze(collections);
            this.#collections = collections;
            return this;
        } catch (x) {
            this.close();
            throw x;
        }
    }


    /** The database's name. */
    readonly name: string;


    /* {@link https://logtape.org LogTape} logger instance for this Database. */
    readonly logger : logtape.Logger;


    /** True if the database is open. */
    get isOpen(): boolean {return this.#db.isOpen();}


    /** Reopens the database after a {@link close} or {@link closeAndDelete} call.
     *  @param password  If the database is encrypted, you must provide the password. */
    async reopen(password?: string) {
        this.logger.info("Reopening database {db}");
        await this.#db.open();
        await this.initialize(password);
    }


    /** Closes the database.
     *
     *  You MUST NOT call any instance methods after this except for {@link reopen}.
     *
     *  You MUST NOT use or keep reference to the Database's Collections; they're invalidated. */
    close() {
        this.logger.info("Closing database {db}");
        for (const coll of Object.values(this.#collections))
            coll.closing();
        this.#collections = {};
        this.#codec = undefined;
        this.#db.close();
    }


    /** Allows Database to be used with the `using` statement:
     *  ```
     *  {
     *      using db = new Database(config);
     *      // `db` will be closed implicitly when it exits scope
     *  }
     *  ```
     *  See: https://www.totaltypescript.com/typescript-5-2-new-keyword-using
     */
    [Symbol.dispose]() {this.close();}


    /** Closes the database, then deletes its persistent storage.
     *  > Note: You can call {@link reopen}, and have an empty database. */
    async closeAndDelete() {
        if (this.#db) {
            this.logger.info("Closing and deleting database {db}");
            await this.#db.delete();
        }
    }


    /** Static method that deletes a database by name.
     *  You MUST close any open Database instance using it first. */
    static async delete(name: string) {
        DBLogger.info("Deleting database {db}", {db: name});
        await dexie.Dexie.delete(name);
    }


    /** @internal (no need to document this!) */
    toString(): string {return `Database[${this.name}]`;}


    //-------- COLLECTIONS:


    /** An object whose keys are collection names and values are {@link Collection}s.
     *  In TypeScript, this object is typed accoring to the database's schema type,
     *  so accessing a nonexistent collection will result in a compile error,
     *  and Collection instances access from this will be typed according to their
     *  document schema. */
    get collections(): {readonly [K in SchemaKeys<Schema>]: Collection<Schema[K]>} {
        return this.#collections as typeof this.collections;
    }


    /** Returns the Collection object for the named collection.
     *  @throws if there is no such collection. */
    getCollection(name: string): Collection {
        const coll = this.#collections[name];
        if (coll === undefined)
            throw Error(`Database ${this.name} has no collection named '${name}'`);
        return coll;
    }


    /** The names of the Collections in this Database. */
    get collectionNames(): readonly SchemaKeys<Schema>[] {
        return Object.keys(this.collections) as SchemaKeys<Schema>[];
    }


    /** Returns the Collection named "_default".
     *  @throws if there is no such collection. */
    get defaultCollection() : Collection {
        return this.getCollection(DefaultCollectionName);
    }


    //-------- CHANGE LISTENER:


    /** Collections call this to enable/disable receiving Dexie db events. @internal */
    observeChangesFor(collection: string, enable: boolean = true) {
        if (enable) {
            // if (this.#collectionsObservingChanges.size === 0)
            //     this.startChangeListener();
            this.#collectionsObservingChanges.add(collection);
        } else {
            // (I don't know a way to remove the observer when the last collection is removed)
            this.#collectionsObservingChanges.delete(collection);
            if (this.#collectionsObservingChanges.size === 0)
                this.logger.info `Stopping Dexie change listener`;
        }
    }

    private installDBCore() {
        // https://dexie.org/docs/Dexie/Dexie.use()#example
        // https://github.com/dexie/Dexie.js/blob/master/src/public/types/dbcore.d.ts
        this.#db.use({
            stack: "dbcore",
            name: "CouchbaseLite",
            create: (realDBCore): dexie.DBCore => {
                this.logger.trace `Creating DBCore!`;
                const myTables = new Map<string,dexie.DBCoreTable>();
                return {                                    // Return new implementation of DBCore
                    ...realDBCore,                          // Copy default implementation
                    table: (tableName) => {                 // Override table method
                        let realTable = realDBCore.table(tableName);  // Construct real table
                        if (!this.#collectionConfig.has(tableName))
                            return realTable;
                        let myTable = myTables.get(tableName);
                        if (myTable)
                            return myTable;
                        this.logger.trace `Installing mutate hook for ${tableName}`;
                        myTable = {                         // Wrap Collection's table
                            ...realTable,                   // Copy default table implementation
                            mutate: async req => {          // Override the mutate method
                                return realTable.mutate(req).then(res => {
                                    this.#collections[tableName]?.onMutate(req, res);
                                    return res;
                                });
                            }
                        };
                        myTables.set(tableName, myTable);
                        return myTable;
                    }
                };
            }
        });
    }

    #collectionsObservingChanges = new Set<string>();


    //-------- QUERIES:


    /** Creates a {@link Query} object from a N1QL/SQL++ `SELECT` statement. */
    createQuery(select: string): Query<Schema> {
        return new Query(this, select);
    }


    //-------- TRANSACTIONS:


    #txnCounter = 0;
    #txnDepth   = 0;

    /** Opens a transaction on one or more collections and invokes the callback.
     *  When the callback returns, the transaction commits.
     *  If the callback throws an exception, a read-write transaction is aborted.
     *
     *  **Warning:** Your callback, though declared as `async`, may not perform any async operations
     *  other than those that access the database. Trying to do network I/O or talking to Workers
     *  will trigger the dreaded "Transaction committed too soon" exception.
     *  Why? IndexedDB is very strict about not letting transactions remain open too long.
     *  If a transaction is still open when the current event loop cycle ends, it will automatically
     *  commit. The only exceptions are async operations on the database itself, for obvious
     *  reasons.
     *
     *  @param mode  'ReadWrite' or 'ReadOnly'.
     *  @param collections  Array of collections (or their names) that will be modified in this
     *              transaction.
     *  @param callback  The function that will run during the transaction.
     *  @returns  The result returned by the callback.
     *  @internal */
    async inTransaction<T>(mode: TransactionMode,
                           // eslint-disable-next-line @typescript-eslint/no-explicit-any
                           collections: ReadonlyArray<Collection<any>|string>,
                           callback: TransactionCallback<T>) : Promise<T> {
        const tables = collections.map(coll => (typeof coll === "string") ? coll : coll.name);
        const colls = collections.map(coll => (typeof coll === "string") ? this.getCollection(coll) : coll);
        if (mode === ReadWrite)
            tables.push(MetaStore, BlobTableName);

        const id = ++this.#txnCounter;
        let committing = false;
        try {
            return await this.#db.transaction(mode, tables, async () => {
                ++this.#txnDepth;
                if (this.#txnDepth === 1)
                    this.logger.debug(`Begin transaction #{id}`, {id});
                try {
                    const result = await callback();
                    committing = true;
                    return result;
                } catch (x) {
                    this.logger.debug(`Aborting transaction #{id} due to exception`, {id});
                    throw x;
                } finally {
                    assert(this.#txnDepth >= 0);
                    if (--this.#txnDepth === 0) {
                        // Notify collections that outer transaction is ending:
                        for (let coll of colls)
                            await coll.transactionEnding(committing);
                    }
                }
            });
        } catch (x) {
            committing = false;
            throw x;
        } finally {
            if (this.#txnDepth === 0) {
                // Notify collections that outer transaction has committed:
                if (committing)
                    this.logger.debug(`Committed transaction #{id}`, {id});
                for (let coll of colls)
                    coll.transactionEnded(committing);
            }
        }
    }


    /** A more performant wrapper around `Dexie.waitFor`. This must be wrapped around promises
     *  being awaited, if you are possibly in a transaction, to prevent the dreaded "Transaction
     * committed early" exception. (Blame IndexedDB's awkward API design.) @internal */
    static async waitFor<T>(promise: Promise<T>): Promise<T> {
        if (dexie.Dexie.currentTransaction !== undefined)
            return dexie.Dexie.waitFor(promise);
        else
            return promise; // no overhead if not in a txn
    }


    //-------- ENCRYPTION:


    // (Mis)using the collection metadata table to store DB metadata, under the key ""
    private get metaTable(): dexie.Table<DatabaseMeta,string>  {return this.#db.table(MetaStore);}

    private async getMeta(): Promise<DatabaseMeta> {
        return (await this.metaTable.get("")) ?? {};
    }

    private async setMeta(meta: DatabaseMeta): Promise<void> {
        await this.metaTable.put(meta, "");
    }


    // Implementation note: Avoid doing crypto operations during a transaction
    // because they're async and will cause the transaction to commit too early.
    // In places where that's unavoidable (while saving or loading a document)
    // we have to use Dexie's `waitFor()` hack.


    /** Returns 'none' if this database is not encrypted, 'locked' if it's encrypted but locked,
     *  or 'unlocked' if it's been unlocked.
     *
     *  If the status is 'locked' you must call {@link unlock} with the correct password,
     *  otherwise loading or querying documents will throw exceptions. @internal */
    get encryptionStatus(): 'none' | 'locked' | 'unlocked' {
        assert(!dexie.Dexie.currentTransaction?.active, "Don't call this in a transaction");
        if (this.#codec)
            return this.#codec.isUnlocked ? 'unlocked' : 'locked';
        else
            return 'none';
    }


    /** Unlocks an encrypted database using the given password. @internal
     *  @returns  True on success, false if the password is wrong (or there is no encryption.) */
    async unlock(password: string): Promise<boolean> {
        assert(!dexie.Dexie.currentTransaction?.active, "Don't call this in a transaction");
        if (!this.#codec)
            return false;
        return await this.#codec.unlock(password);
    }


    /** Locks an encrypted database, making encrypted stored data inaccessible until {@link unlock}
     *  is called. Has no effect if the database is not encrypted. @internal */
    lock(): void {
        this.#codec?.lock();
    }


    /** Encrypts or decrypts a database, or changes the encryption key.
     *  @param password  The new password for encryption, or `undefined` to decrypt.
     *  @param exceptProperties  Optional top-level properties to leave unencrypted, by collection
     *                           (in addition to indexed properties, which cannot be encrypted.)
     *                           Key is collection name, value is array or set of properties.
     *  @throws EncryptionError  if it's already encrypted. */
    async changeEncryptionKey(password: string | undefined,
                              exceptProperties?: UnencryptedProperties) {
        assert(!dexie.Dexie.currentTransaction?.active, "Don't call this in a transaction");
        assert(this.encryptionStatus !== 'locked', "Database must be unlocked to change encryption");

        const newCodec = password !== undefined ? await CryptoCodec.create(password) : undefined;

        // Remember each collection's unencrypted properties in case we have to back out:
        const oldExceptProperties = new Map<string, Set<string> | undefined>();
        for (const [name, collection] of Object.entries(this.#collections))
            oldExceptProperties.set(name, collection.unencryptedProperties);

        const what = newCodec ? (this.#codec ? "Rekey" : "Encrypt") : "Decrypt";
        this.logger.info `${what}ing database...`;
        try {
            await this.inTransaction(ReadWrite, this.collectionNames, async () => {
                // Add/remove "challenge" to db metadata:
                const metadata = await this.getMeta();
                metadata.challenge = newCodec?.challenge;
                await this.setMeta(metadata);

                // Encrypt blobs:
                await this.blobStore.rekey(newCodec);

                // Encrypt all collections:
                for (const [name, collection] of Object.entries(this.#collections))
                    await collection.rekey(newCodec, exceptProperties?.[name]);
            });
            this.#codec = newCodec;
            this.logger.info `...${what}ed database!`;

        } catch (x) {
            this.logger.error `${what}ing database failed! ${x}`;
            this.blobStore.resetEncryption(this.#codec);
            for (const [name, collection] of Object.entries(this.#collections))
                collection.resetEncryption(this.#codec, oldExceptProperties.get(name));
            throw x;
        }
    }


    /** Decrypts the database. (Same as `encrypt(undefined)`.) */
    async decrypt() {await this.changeEncryptionKey(undefined);}


    //-------- INTERNALS:


    /** Adds a document, returning `undefined` on success, else `ConstraintError`. @internal */
    async tryAdd<T,TKey>(table: dexie.Table<T,TKey,T>, doc: T, key?: TKey) : Promise<Error | undefined> {
        return await table.add(doc, key)
            .then( (_key) => {return undefined;})
            .catch( async (x) => {
                const err = x as Error;
                if (err instanceof dexie.Dexie.ConstraintError)
                    return err;
                else
                    return Promise.reject(err);
            } );
    }


    /** @internal */
    get blobStore(): BlobStore<Schema> {
        if (!this.#blobStore)
            this.#blobStore = new BlobStore(this, this.#db.table(BlobTableName), this.#codec);
        return this.#blobStore;
    }


    /** Returns the number of blobs stored in the database. */
    async countBlobs(): Promise<number> {
        return this.blobStore.countBlobs();
    }


    /** Deletes all blobs that are no longer referenced by any documents.
     *  @returns  The number of blobs deleted. */
    async performMaintenance(type: MaintenanceType) {
        assertEqual(type, 'compact');
        this.logger.info("Garbage-collecting blobs");
        return await this.inTransaction(ReadWrite, this.collectionNames, async () => {
            const allDigests = new Set<string>;
            for (const collection of Object.values(this.#collections))
                await collection.collectBlobDigests(allDigests);
            return await this.blobStore.deleteBlobsExcept(allDigests);
        });
    }


    /** Used as a callback in Blob objects. @internal */
    blobLoader = async (digest: string, _type?: string) => {
        return await this.blobStore.getBlob(digest);
    };


    /** @internal  Exposed for testing */
    enableAutoExpiry   = true;

    #db                 : dexie.Dexie;
    #collectionConfig   = new Map<string,CollectionConfig>();
    #collections        : Record<string,Collection> = {};
    #blobStore?         : BlobStore<Schema>;
    #codec?             : CryptoCodec;
}
