import { Query } from '../query/query';
import { BlobStore } from './blobStore';
import { Collection, CollectionConfig } from './collection';
import { CBLDictLike } from './document';
import { CBLDictionary } from './types';
import type * as logtape from "@logtape/logtape";
import * as dexie from "dexie";
export { EncryptionError } from './cryptoCodec';
export declare const ReadOnly = "r";
export declare const ReadWrite = "rw";
export type TransactionMode = typeof ReadOnly | typeof ReadWrite;
export type TransactionCallback<T> = () => Promise<T>;
/** Default database schema: collection names are unspecified, and document types are just
 *  {@link CBLDictionary}, i.e. any property name is allowed and values can be any JSON types. */
export type NoSchema = Record<string, CBLDictionary>;
export type SchemaLike<S> = {
    [K in keyof S]: CBLDictLike<S[K]>;
}; /** @internal */
export type SchemaKeys<S> = Extract<keyof S, string>; /** @internal */
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
export type CollectionsConfig<Schema extends SchemaLike<Schema> = NoSchema> = {
    readonly [K in SchemaKeys<Schema>]: CollectionConfig<Schema[K]>;
};
/** Describes which properties should remain unencrypted in each collection.
 *  Key is collection name, value is array or set of property names. */
export type UnencryptedProperties = Record<string, Set<string> | Array<string>>;
/** Types of database maintenance; passed to {@link Database.performMaintenance}. */
export type MaintenanceType = 'compact';
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
export declare class Database<Schema extends SchemaLike<Schema> = NoSchema> {
    #private;
    readonly config: DatabaseConfig<Schema>;
    /** Call this to use a non-default implementation of IndexedDB.
     *  This is required in non-browser environments like Node, Bun and Deno!
     *  It should be called only once, **before creating any Database objects**.
     *  Example:
     *  ```
     *      import { indexedDB, IDBKeyRange } from "fake-indexeddb";
     *      Database.useIndexedDB(indexedDB, IDBKeyRange);
     *  ```
     */
    static useIndexedDB(indexedDB: IDBFactory, idbKeyRange: typeof IDBKeyRange): void;
    /** Enable's Dexie's debug mode, which provides meaningful stack backtraces in exceptions. */
    static debugMode(debug: boolean): void;
    /** Creates a Database instance and opens the database. If a local IndexedDB database with
     *  this name exists, it will be opened; otherwise a new one is created.
     *  @param config  The database {@link DatabaseConfig configuration}
     *  @template Schema  An optional interface type that improves type-safety of collection and
     *      document accessors. Its keys must be the names of the collections, and each value type
     *      is an interface that describes the properties of a document in that collection. */
    static open<Schema extends SchemaLike<Schema> = NoSchema>(config: DatabaseConfig<Schema>): Promise<Database<Schema>>;
    /** @internal */
    static get idbFactory(): IDBFactory;
    /** @internal */
    static get idbKeyRange(): {
        new (): IDBKeyRange;
        prototype: IDBKeyRange;
        bound(lower: any, upper: any, lowerOpen?: boolean, upperOpen?: boolean): IDBKeyRange;
        lowerBound(lower: any, open?: boolean): IDBKeyRange;
        only(value: any): IDBKeyRange;
        upperBound(upper: any, open?: boolean): IDBKeyRange;
    };
    private constructor();
    private initialize;
    /** The database's name. */
    readonly name: string;
    readonly logger: logtape.Logger;
    /** True if the database is open. */
    get isOpen(): boolean;
    /** Reopens the database after a {@link close} or {@link closeAndDelete} call.
     *  @param password  If the database is encrypted, you must provide the password. */
    reopen(password?: string): Promise<void>;
    /** Closes the database.
     *
     *  You MUST NOT call any instance methods after this except for {@link reopen}.
     *
     *  You MUST NOT use or keep reference to the Database's Collections; they're invalidated. */
    close(): void;
    /** Allows Database to be used with the `using` statement:
     *  ```
     *  {
     *      using db = new Database(config);
     *      // `db` will be closed implicitly when it exits scope
     *  }
     *  ```
     *  See: https://www.totaltypescript.com/typescript-5-2-new-keyword-using
     */
    [Symbol.dispose](): void;
    /** Closes the database, then deletes its persistent storage.
     *  > Note: You can call {@link reopen}, and have an empty database. */
    closeAndDelete(): Promise<void>;
    /** Static method that deletes a database by name.
     *  You MUST close any open Database instance using it first. */
    static delete(name: string): Promise<void>;
    /** @internal (no need to document this!) */
    toString(): string;
    /** An object whose keys are collection names and values are {@link Collection}s.
     *  In TypeScript, this object is typed accoring to the database's schema type,
     *  so accessing a nonexistent collection will result in a compile error,
     *  and Collection instances access from this will be typed according to their
     *  document schema. */
    get collections(): {
        readonly [K in SchemaKeys<Schema>]: Collection<Schema[K]>;
    };
    /** Returns the Collection object for the named collection.
     *  @throws if there is no such collection. */
    getCollection(name: string): Collection;
    /** The names of the Collections in this Database. */
    get collectionNames(): readonly SchemaKeys<Schema>[];
    /** Returns the Collection named "_default".
     *  @throws if there is no such collection. */
    get defaultCollection(): Collection;
    /** Collections call this to enable/disable receiving Dexie db events. @internal */
    observeChangesFor(collection: string, enable?: boolean): void;
    private installDBCore;
    /** Creates a {@link Query} object from a N1QL/SQL++ `SELECT` statement. */
    createQuery(select: string): Query<Schema>;
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
    inTransaction<T>(mode: TransactionMode, collections: ReadonlyArray<Collection<any> | string>, callback: TransactionCallback<T>): Promise<T>;
    /** A more performant wrapper around `Dexie.waitFor`. This must be wrapped around promises
     *  being awaited, if you are possibly in a transaction, to prevent the dreaded "Transaction
     * committed early" exception. (Blame IndexedDB's awkward API design.) @internal */
    static waitFor<T>(promise: Promise<T>): Promise<T>;
    private get metaTable();
    private getMeta;
    private setMeta;
    /** Returns 'none' if this database is not encrypted, 'locked' if it's encrypted but locked,
     *  or 'unlocked' if it's been unlocked.
     *
     *  If the status is 'locked' you must call {@link unlock} with the correct password,
     *  otherwise loading or querying documents will throw exceptions. @internal */
    get encryptionStatus(): 'none' | 'locked' | 'unlocked';
    /** Unlocks an encrypted database using the given password. @internal
     *  @returns  True on success, false if the password is wrong (or there is no encryption.) */
    unlock(password: string): Promise<boolean>;
    /** Locks an encrypted database, making encrypted stored data inaccessible until {@link unlock}
     *  is called. Has no effect if the database is not encrypted. @internal */
    lock(): void;
    /** Encrypts or decrypts a database, or changes the encryption key.
     *  @param password  The new password for encryption, or `undefined` to decrypt.
     *  @param exceptProperties  Optional top-level properties to leave unencrypted, by collection
     *                           (in addition to indexed properties, which cannot be encrypted.)
     *                           Key is collection name, value is array or set of properties.
     *  @throws EncryptionError  if it's already encrypted. */
    changeEncryptionKey(password: string | undefined, exceptProperties?: UnencryptedProperties): Promise<void>;
    /** Decrypts the database. (Same as `encrypt(undefined)`.) */
    decrypt(): Promise<void>;
    /** Adds a document, returning `undefined` on success, else `ConstraintError`. @internal */
    tryAdd<T, TKey>(table: dexie.Table<T, TKey, T>, doc: T, key?: TKey): Promise<Error | undefined>;
    /** @internal */
    get blobStore(): BlobStore<Schema>;
    /** Returns the number of blobs stored in the database. */
    countBlobs(): Promise<number>;
    /** Deletes all blobs that are no longer referenced by any documents.
     *  @returns  The number of blobs deleted. */
    performMaintenance(type: MaintenanceType): Promise<number>;
    /** Used as a callback in Blob objects. @internal */
    blobLoader: (digest: string, _type?: string) => Promise<Uint8Array<ArrayBufferLike>>;
    /** @internal  Exposed for testing */
    enableAutoExpiry: boolean;
}
